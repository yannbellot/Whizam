import {
  compileStyleTarget,
  contextualMigrationRequest,
  contextualStylePath,
  contextualStyleRequest,
  contextualStylesSchema,
  styleRuleKey,
} from '../../src/core/contextual-style.ts'
import { explorationSnapshot, explorationStore } from './workspace-exploration.ts'
import {
  visualFourValueProperties,
  type VisualFourValueProperty,
} from '../../src/core/visual-properties.ts'
import { loadTokens } from '../dtcg-tokens.mjs'
import { planVisualDefinitionTokens } from '../visual-tokens.mjs'
import { applyDesign, visualDesignAuthority } from './workspace-design.ts'
import type { WorkspaceStore } from './workspace.ts'

/** The caller selects a registered target. File, selectors and writer scope are server-owned. */
export async function saveContextualStyle(
  root: string,
  input: unknown,
  readDesign: () => Promise<{
    revision: string
    snapshot: Parameters<typeof planVisualDefinitionTokens>[1]
  }>,
  writer?: WorkspaceStore['designWriter'],
) {
  const migration = contextualMigrationRequest.safeParse(input)
  const request = migration.success ? migration.data : contextualStyleRequest.parse(input)
  const { store, treeId } = explorationStore(root, writer)
  const view = await explorationSnapshot(root, writer)
  if (
    !view.available ||
    !view.writable ||
    !view.selected ||
    !treeId ||
    view.treeId !== treeId ||
    view.model.revision !== request.revision
  )
    throw new Error('revision-conflict')
  const before = await store.read(contextualStylePath, root)
  const rows = contextualStylesSchema.parse(JSON.parse(before ?? '[]'))
  if ('action' in request || request.target.kind === 'definition') {
    const legacy = rows.filter((row) => row.target.kind === 'definition')
    if (!legacy.length && 'action' in request) return { revision: request.revision }
    const targets = new Set<string>()
    const edits: Parameters<typeof planVisualDefinitionTokens>[2] = []
    for (const row of legacy) {
      try {
        const { rendered, writeIds } = compileStyleTarget(view.model, row.target)
        for (const id of writeIds) targets.add(id)
        edits.push({
          owner: rendered.definition,
          variant: rendered.variant!,
          part: rendered.part,
          state: row.state,
          condition: row.condition,
          changes: Object.entries(row.declarations).map(([property, value]) => ({
            property,
            value,
          })),
        })
      } catch {
        return {
          status: 'unconvertible',
          issues: [
            {
              owner: row.target.kind === 'definition' ? row.target.ownerId : '',
              property: Object.keys(row.declarations).join(', '),
            },
          ],
        }
      }
    }
    if (!('action' in request)) {
      const { rendered, writeIds } = compileStyleTarget(view.model, request.target)
      for (const id of writeIds) targets.add(id)
      edits.push({
        owner: rendered.definition,
        variant: rendered.variant!,
        part: rendered.part,
        state: request.state,
        condition: request.condition,
        changes: request.changes,
      })
    }
    const design = await readDesign()
    const { document } = await loadTokens(root)
    const plan = planVisualDefinitionTokens(document, design.snapshot, edits)
    if (!plan.document) return { status: 'unconvertible', issues: plan.issues }
    const receipt = await applyDesign(
      store,
      treeId,
      {
        id: request.id,
        revision: request.revision,
        requireSelected: true,
        targets: [...targets],
        request: {
          protocolVersion: 7,
          requestId: request.id,
          baseRevision: design.revision,
          document: plan.document,
          previousStyles: before,
          nextStyles: legacy.length
            ? JSON.stringify(
                rows.filter((row) => row.target.kind !== 'definition'),
                null,
                2,
              ) + '\n'
            : before,
        },
      },
      visualDesignAuthority,
    )
    if (!receipt) throw new Error('workspace-design-recovery-required')
    return { revision: receipt.revision }
  }
  const { writeIds } = compileStyleTarget(view.model, request.target)
  const key = styleRuleKey(request)
  const existing = rows.find((row) => styleRuleKey(row) === key)
  const declarations = { ...existing?.declarations }
  for (const { property, value } of request.changes) {
    delete declarations[property]
    if (value !== null) {
      if (Object.hasOwn(visualFourValueProperties, property))
        for (const side of visualFourValueProperties[property as VisualFourValueProperty])
          delete declarations[side]
      declarations[property] = value
    }
  }
  const next = rows.filter((row) => styleRuleKey(row) !== key)
  if (Object.keys(declarations).length)
    next.push({
      target: request.target,
      state: request.state,
      condition: request.condition,
      declarations,
    })
  const after = JSON.stringify(contextualStylesSchema.parse(next), null, 2) + '\n'
  const receipt = await store.apply(treeId, {
    id: request.id,
    origin: 'inspector',
    revision: request.revision,
    targets: writeIds,
    requireSelected: true,
    edits: [{ file: contextualStylePath, before, after }],
    entities: view.model.entities.map((entity) =>
      writeIds.includes(entity.id) && !entity.files?.includes(contextualStylePath)
        ? { ...entity, files: [...(entity.files ?? []), contextualStylePath] }
        : entity,
    ),
  })
  return { revision: receipt.revision }
}
