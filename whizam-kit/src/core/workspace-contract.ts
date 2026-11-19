import { z } from 'zod'
import { figmaReferenceSchema, figmaNodeIdSchema, figmaNodeSchema } from './figma-reference.ts'

// Pure contracts: no filesystem, provider, database or execution capability.
export const identitySchema = z
  .string()
  .uuid()
  .refine((value) => value === value.toLowerCase())
export const revisionSchema = z.string().regex(/^[a-f0-9]{64}$/)
// Concrete application paths only; no editor, file server, query, traversal or external URL.
export const pagePathSchema = z
  .string()
  .max(500)
  .regex(/^\/(?:[a-zA-Z0-9_-]+\/?)*$/)
  .refine(
    (value) =>
      !['ui-lab', '__design-system', 'node_modules', 'fonts'].includes(value.split('/')[1]),
  )
const label = z.string().trim().min(1).max(200)
const base = {
  id: identitySchema,
  label,
  revision: revisionSchema,
  files: z
    .array(
      z
        .string()
        .min(1)
        .max(500)
        .refine(
          (file) =>
            !file.startsWith('/') &&
            !file.includes('\\') &&
            !file.split('/').some((part) => !part || part === '..' || part.startsWith('.')),
        ),
    )
    .max(1000)
    .optional(),
}
const ids = z
  .array(identitySchema)
  .max(10000)
  .refine((v) => new Set(v).size === v.length)
const sourceKey = z
  .string()
  .min(1)
  .max(500)
  .refine((v) => [...v].every((character) => character.charCodeAt(0) >= 32))
const entitySchema = z.discriminatedUnion('kind', [
  z.strictObject({ ...base, kind: z.literal('figmaReference'), source: figmaReferenceSchema }),
  z.strictObject({
    ...base,
    kind: z.literal('figmaMapping'),
    referenceId: identitySchema,
    nodeId: figmaNodeIdSchema,
    targetIds: ids,
    sourceVisualHash: revisionSchema,
    projectBaselineHash: revisionSchema,
    bindingId: z.string().min(1).max(200).nullable(),
    outcome: z.enum(['keep', 'adopt', 'combine', 'defer']),
  }),
  z.strictObject({ ...base, kind: z.literal('page'), path: pagePathSchema.optional() }),
  z.strictObject({
    ...base,
    kind: z.literal('component'),
    sourceKey,
    placements: z
      .array(
        z.strictObject({
          id: identitySchema,
          definitionId: identitySchema,
        }),
      )
      .max(200)
      .optional(),
  }),
  z.strictObject({ ...base, kind: z.literal('variant'), definitionId: identitySchema }),
  z.strictObject({
    ...base,
    kind: z.literal('occurrence'),
    pageId: identitySchema,
    definitionId: identitySchema,
    variantId: identitySchema.nullable(),
    marker: identitySchema.optional(),
    parentId: identitySchema.optional(),
  }),
  z.strictObject({ ...base, kind: z.literal('token'), sourceKey }),
  z.strictObject({
    ...base,
    kind: z.literal('flow'),
    pageIds: ids,
    edges: z
      .array(
        z.strictObject({ from: identitySchema, to: identitySchema, condition: label.nullable() }),
      )
      .max(10000),
    realization: z.enum(['planned', 'implemented']),
    evidence: z
      .strictObject({ revision: revisionSchema, result: z.enum(['passed', 'failed']) })
      .nullable(),
  }),
  z.strictObject({ ...base, kind: z.literal('request') }),
  z.strictObject({ ...base, kind: z.literal('task'), requestIds: ids }),
  z.strictObject({
    ...base,
    kind: z.literal('modification'),
    taskIds: ids,
    targetIds: ids,
    state: z.enum(['applied', 'checking', 'validated']),
    evidenceRevision: revisionSchema.nullable(),
  }),
  z.strictObject({
    ...base,
    kind: z.literal('commit'),
    modificationIds: ids,
    gitOid: z.string().regex(/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/),
  }),
  z.strictObject({
    ...base,
    kind: z.literal('workItem'),
    taskIds: ids,
    commitIds: ids,
    state: z.enum(['pending', 'qualified', 'running', 'completed']),
  }),
  z.strictObject({
    ...base,
    kind: z.literal('decision'),
    targetIds: ids,
    outcome: z.enum(['keep', 'adopt', 'combine', 'defer']),
    rationale: z.string().min(1).max(4000),
    source: z
      .strictObject({
        referenceId: identitySchema,
        version: z.string().min(1).max(200),
        contentHash: revisionSchema,
        node: figmaNodeSchema,
        productValueBefore: z.union([z.string(), z.number().finite()]).nullable(),
      })
      .optional(),
  }),
])
export type WorkspaceEntity = z.infer<typeof entitySchema>

export const workspaceSchema = z
  .strictObject({
    schemaVersion: z.literal(1),
    projectId: identitySchema,
    revision: revisionSchema,
    entities: z.array(entitySchema).max(10000),
  })
  .superRefine((workspace, ctx) => {
    const entities = new Map(workspace.entities.map((e) => [e.id, e]))
    const keys = new Set<string>()
    const seen = new Set<string>()
    const issue = (index: number, message: string) =>
      ctx.addIssue({ code: 'custom', path: ['entities', index], message })
    workspace.entities.forEach((entity, index) => {
      if (seen.has(entity.id)) issue(index, 'duplicate-identity')
      seen.add(entity.id)
      const ref = (id: string, kinds?: WorkspaceEntity['kind'][]) => {
        const target = entities.get(id)
        if (!target || (kinds && !kinds.includes(target.kind))) issue(index, 'invalid-reference')
      }
      if ('sourceKey' in entity) {
        const key = `${entity.kind}:${entity.sourceKey}`
        if (keys.has(key)) issue(index, 'duplicate-source-key')
        keys.add(key)
      }
      switch (entity.kind) {
        case 'component': {
          const placementIds = new Set<string>()
          for (const placement of entity.placements ?? []) {
            if (placementIds.has(placement.id)) issue(index, 'duplicate-component-placement')
            placementIds.add(placement.id)
            ref(placement.definitionId, ['component'])
          }
          break
        }
        case 'page':
          if (entity.path) {
            const key = 'page-path:' + entity.path.replace(/\/$/, '')
            if (keys.has(key)) issue(index, 'duplicate-page-path')
            keys.add(key)
          }
          break
        case 'variant':
          ref(entity.definitionId, ['component'])
          break
        case 'occurrence': {
          ref(entity.pageId, ['page'])
          ref(entity.definitionId, ['component'])
          if (entity.marker) {
            const key = `occurrence-marker:${entity.pageId}:${entity.marker}`
            if (keys.has(key)) issue(index, 'duplicate-occurrence-marker')
            keys.add(key)
          }
          if (entity.parentId) {
            ref(entity.parentId, ['occurrence'])
            const visited = new Set([entity.id])
            let parent = entities.get(entity.parentId)
            while (parent?.kind === 'occurrence') {
              if (parent.pageId !== entity.pageId || visited.has(parent.id)) {
                issue(index, 'invalid-occurrence-parent')
                break
              }
              visited.add(parent.id)
              parent = parent.parentId ? entities.get(parent.parentId) : undefined
            }
          }
          if (entity.variantId) {
            ref(entity.variantId, ['variant'])
            const variant = entities.get(entity.variantId)
            if (variant?.kind === 'variant' && variant.definitionId !== entity.definitionId)
              issue(index, 'variant-definition-mismatch')
          }
          break
        }
        case 'flow':
          entity.pageIds.forEach((id) => ref(id, ['page']))
          entity.edges.forEach((edge) => {
            if (!entity.pageIds.includes(edge.from) || !entity.pageIds.includes(edge.to))
              issue(index, 'flow-endpoint-outside-pages')
          })
          if (
            entity.evidence &&
            (entity.realization !== 'implemented' || entity.evidence.revision !== entity.revision)
          )
            issue(index, 'stale-flow-evidence')
          break
        case 'figmaMapping':
          ref(entity.referenceId, ['figmaReference'])
          entity.targetIds.forEach((id) =>
            ref(id, ['page', 'component', 'variant', 'occurrence', 'token']),
          )
          break
        case 'task':
          entity.requestIds.forEach((id) => ref(id, ['request']))
          break
        case 'modification':
          entity.taskIds.forEach((id) => ref(id, ['task']))
          entity.targetIds.forEach((id) =>
            ref(id, ['page', 'component', 'variant', 'occurrence', 'token', 'flow']),
          )
          if (entity.state === 'validated' && entity.evidenceRevision !== entity.revision)
            issue(index, 'missing-current-evidence')
          if (entity.evidenceRevision !== null && entity.evidenceRevision !== entity.revision)
            issue(index, 'stale-modification-evidence')
          break
        case 'commit':
          entity.modificationIds.forEach((id) => ref(id, ['modification']))
          break
        case 'workItem':
          entity.taskIds.forEach((id) => ref(id, ['task']))
          entity.commitIds.forEach((id) => ref(id, ['commit']))
          break
        case 'decision':
          if (entity.source) ref(entity.source.referenceId, ['figmaReference'])
          entity.targetIds.forEach((id) => ref(id))
          break
      }
    })
  })
export type Workspace = z.infer<typeof workspaceSchema>

/** Caller supplies identities; display names and source paths never create identities. */
export function renameEntity(
  input: unknown,
  id: string,
  name: string,
  nextRevision: string,
): Workspace {
  const workspace = workspaceSchema.parse(input)
  if (!workspace.entities.some((entity) => entity.id === id)) throw new Error('unknown-identity')
  revisionSchema.parse(nextRevision)
  if (nextRevision === workspace.revision) throw new Error('unchanged-revision')
  return workspaceSchema.parse({
    ...workspace,
    revision: nextRevision,
    entities: workspace.entities.map((entity) =>
      entity.id === id
        ? {
            ...entity,
            label: name,
            revision: nextRevision,
            ...('evidence' in entity ? { evidence: null } : {}),
            ...('evidenceRevision' in entity ? { evidenceRevision: null, state: 'applied' } : {}),
          }
        : entity,
    ),
  })
}

/** Private storage key only: never includes provider/session/access identifiers. */
export function elementConversationKey(projectId: string, entityId: string) {
  return `${identitySchema.parse(projectId)}:${identitySchema.parse(entityId)}`
}

/** Exact source identity bridge; does not copy token values or infer matches by label. */
export function findSourceEntity(input: unknown, kind: 'token' | 'component', key: string) {
  const workspace = workspaceSchema.parse(input)
  return (
    workspace.entities.find(
      (entity) => entity.kind === kind && 'sourceKey' in entity && entity.sourceKey === key,
    )?.id ?? null
  )
}
