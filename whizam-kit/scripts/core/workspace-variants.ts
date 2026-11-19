import { createHash } from 'node:crypto'
import { z } from 'zod'
import { explorationStore, explorationSnapshot } from './workspace-exploration.ts'
import { applyDesign, undoDesign } from './workspace-design.ts'
import { identitySchema, revisionSchema } from '../../src/core/workspace-contract.ts'
import { variantRecipeSchema } from '../../src/core/variant-recipes.ts'
import type { WorkspaceStore } from './workspace.ts'
const base = {
  id: identitySchema.refine((id) => id[14] === '4'),
  revision: revisionSchema,
  designRevision: revisionSchema,
}
const commandSchema = z.discriminatedUnion('kind', [
  z.strictObject({
    ...base,
    occurrenceId: identitySchema,
    kind: z.literal('create'),
    variantId: identitySchema,
    label: z.string().trim().min(1).max(200),
    bindings: variantRecipeSchema.shape.bindings,
  }),
  z.strictObject({
    ...base,
    occurrenceId: identitySchema,
    kind: z.literal('assign'),
    variantId: identitySchema.nullable(),
  }),
  z.strictObject({ ...base, kind: z.literal('undo'), operationId: identitySchema }),
])
/** Writer capability gates this finite adapter. It cannot accept a root, arbitrary source or Git operation. */
export async function mutateVariant(
  root: string,
  writer: NonNullable<WorkspaceStore['designWriter']>,
  input: unknown,
  authority?: symbol,
  chat?: { conversationId: string; turnId: string },
) {
  const command = commandSchema.parse(input)
  const view = await explorationSnapshot(root)
  if (!view.available || !view.treeId || !view.writable || !view.selected)
    throw new Error('revision-conflict')
  if (view.model.revision !== command.revision) throw new Error('revision-conflict')
  const design = await writer.snapshot()
  const alias = createHash('sha256')
    .update(JSON.stringify({ design: design.revision, common: view.model.revision }))
    .digest('hex')
  if (alias !== command.designRevision) throw new Error('revision-conflict')
  const { store, treeId } = explorationStore(root)
  if (!treeId) throw new Error('revision-conflict')
  store.designWriter = { ...writer, close: async () => {} }
  try {
    if (command.kind === 'undo') {
      if (view.lastOperation?.id !== command.operationId) throw new Error('revision-conflict')
      const receipt = view.lastOperation.design
        ? await undoDesign(store, treeId, command.operationId, command.revision, true)
        : await store.undo(treeId, command.operationId, command.revision, true)
      if (!receipt) throw new Error('service-unavailable')
      return { revision: receipt.revision }
    }
    const occurrence = view.model.entities.find((e) => e.id === command.occurrenceId)
    if (occurrence?.kind !== 'occurrence' || !occurrence.marker)
      throw new Error('unknown-reference')
    const definition = view.model.entities.find((e) => e.id === occurrence.definitionId)
    if (definition?.kind !== 'component') throw new Error('unknown-reference')
    if (command.kind === 'create') {
      if (view.model.entities.some((e) => e.id === command.variantId))
        throw new Error('duplicate-id')
      const receipt = await applyDesign(
        store,
        treeId,
        {
          id: command.id,
          ...(chat ? { chat } : {}),
          revision: command.revision,
          targets: [occurrence.id],
          requireSelected: true,
          assignment: { occurrenceId: occurrence.id, variantId: command.variantId },
          request: {
            protocolVersion: 5,
            requestId: command.id,
            baseRevision: design.revision,
            operations: [
              {
                kind: 'put-variant',
                variant: {
                  id: command.variantId,
                  owner: definition.sourceKey,
                  label: command.label,
                  bindings: command.bindings,
                },
              },
            ],
          },
        },
        authority,
      )
      if (!receipt) throw new Error('service-unavailable')
      return { revision: receipt.revision }
    }
    if (command.variantId) {
      const variant = view.model.entities.find((e) => e.id === command.variantId)
      if (
        variant?.kind !== 'variant' ||
        variant.definitionId !== definition.id ||
        !view.variants.some((r) => r.id === variant.id)
      )
        throw new Error('unknown-reference')
    }
    const receipt = await store.apply(treeId, {
      id: command.id,
      origin: 'inspector',
      revision: command.revision,
      targets: [occurrence.id],
      requireSelected: true,
      edits: [],
      entities: view.model.entities.map((e) =>
        e.id === occurrence.id ? { ...occurrence, variantId: command.variantId } : e,
      ),
    })
    return { revision: receipt.revision }
  } catch (error) {
    if (/revision|selection|committed/.test((error as Error).message))
      throw new Error('revision-conflict')
    throw error
  }
}
