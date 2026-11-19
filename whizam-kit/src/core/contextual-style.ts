import { z } from 'zod'
import {
  identitySchema,
  revisionSchema,
  type Workspace,
  type WorkspaceEntity,
} from './workspace-contract.ts'
import { cssProperties, visualCssValue, visualMediaCondition } from './visual-properties.ts'

export const contextualStylePath = 'app/loomata-context-styles.json'
export const contextualStates = [
  'default',
  'hover',
  'focus-visible',
  'disabled',
  'loading',
  'error',
] as const
export type ContextualState = (typeof contextualStates)[number]
const partSchema = z.string().regex(/^[a-z][a-z0-9-]{0,79}$/)
const pathSchema = z.array(identitySchema).max(12)
const targetSchema = z.discriminatedUnion('kind', [
  z.strictObject({
    kind: z.literal('definition'),
    ownerId: identitySchema,
    variant: partSchema,
    part: partSchema,
  }),
  z.strictObject({
    kind: z.literal('instance'),
    pageId: identitySchema,
    occurrenceId: identitySchema,
    placements: pathSchema,
    part: partSchema,
  }),
  z.strictObject({
    kind: z.literal('placement'),
    ownerId: identitySchema,
    placements: pathSchema.min(1),
    part: partSchema,
  }),
])
export type ContextualTarget = z.infer<typeof targetSchema>
const propertySchema = z.string().refine((property) => cssProperties.includes(property))
const context = {
  target: targetSchema,
  state: z.enum(contextualStates),
  condition: visualMediaCondition.nullable(),
}
export const contextualStyleRequest = z.strictObject({
  ...context,
  id: identitySchema,
  revision: revisionSchema,
  changes: z
    .array(z.strictObject({ property: propertySchema, value: visualCssValue.nullable() }))
    .min(1)
    .max(100)
    .refine((rows) => new Set(rows.map(({ property }) => property)).size === rows.length),
})
export const contextualMigrationRequest = z.strictObject({
  action: z.literal('migrate-definitions'),
  id: identitySchema,
  revision: revisionSchema,
})
const ruleSchema = z.strictObject({
  ...context,
  declarations: z.record(propertySchema, visualCssValue),
})
export const contextualStylesSchema = z.array(ruleSchema).max(600)
export type ContextualRule = z.infer<typeof ruleSchema>
export type CompiledStyleTarget = {
  owner: string | null
  variant?: string
  markers: string[]
  placements: { id: string; definition: string }[]
  definition: string
  part: string
}
export type RenderedContextualStyle = Omit<ContextualRule, 'target'> & {
  target: CompiledStyleTarget
  level: 0 | 1 | 2
}

type Component = Extract<WorkspaceEntity, { kind: 'component' }>
type Occurrence = Extract<WorkspaceEntity, { kind: 'occurrence' }>

export function compileStyleTarget(model: Workspace, target: ContextualTarget) {
  const entities = new Map(model.entities.map((entity) => [entity.id, entity]))
  let source: Component
  let owner: string | null = null
  let pagePath: string | null = null
  const markers: string[] = []
  const writeIds: string[] = []
  if (target.kind === 'instance') {
    const page = entities.get(target.pageId)
    const occurrence = entities.get(target.occurrenceId)
    if (
      page?.kind !== 'page' ||
      !page.path ||
      occurrence?.kind !== 'occurrence' ||
      occurrence.pageId !== page.id
    )
      throw new Error('visual-target')
    pagePath = page.path
    writeIds.push(occurrence.id)
    let cursor: Occurrence | undefined = occurrence
    const visited = new Set<string>()
    while (cursor) {
      if (!cursor.marker || visited.has(cursor.id)) throw new Error('visual-target')
      visited.add(cursor.id)
      markers.unshift(cursor.marker)
      if (!cursor.parentId) break
      const parent = entities.get(cursor.parentId)
      if (parent?.kind !== 'occurrence' || parent.pageId !== page.id)
        throw new Error('visual-target')
      cursor = parent
    }
    const definition = entities.get(occurrence.definitionId)
    if (definition?.kind !== 'component') throw new Error('visual-target')
    source = definition
  } else {
    const definition = entities.get(target.ownerId)
    if (definition?.kind !== 'component') throw new Error('visual-target')
    source = definition
    owner = definition.sourceKey
    writeIds.push(definition.id)
  }
  const placements = (target.kind === 'definition' ? [] : target.placements).map((id) => {
    const registered = source.placements?.find((placement) => placement.id === id)
    const next = registered && entities.get(registered.definitionId)
    if (next?.kind !== 'component') throw new Error('visual-target')
    source = next
    return { id, definition: source.sourceKey }
  })
  const rendered: CompiledStyleTarget = {
    owner,
    ...(target.kind === 'definition' ? { variant: target.variant } : {}),
    markers,
    placements,
    definition: source.sourceKey,
    part: target.part,
  }
  return { rendered, pagePath, writeIds }
}

export function styleRuleKey({
  target,
  state,
  condition,
}: Pick<ContextualRule, 'target' | 'state' | 'condition'>) {
  const location =
    target.kind === 'instance' ? [target.pageId, target.occurrenceId] : [target.ownerId]
  return JSON.stringify([
    target.kind,
    location,
    target.kind === 'definition' ? target.variant : target.placements,
    target.part,
    state,
    condition,
  ])
}
