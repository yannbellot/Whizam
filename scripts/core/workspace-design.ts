import * as fs from 'node:fs/promises'
import path from 'node:path'
import { createHash, randomUUID } from 'node:crypto'
import { z } from 'zod'
import { stateSchema, type WorkspaceStore } from './workspace.ts'
import { inventory } from './workspace-inventory.ts'
import {
  identitySchema,
  revisionSchema,
  workspaceSchema,
} from '../../src/core/workspace-contract.ts'
import {
  createStore,
  sourcePaths,
  prepareEditorArtifacts,
  derivedPaths,
  validateDesignRequest,
} from './workspace-design-bridge.mjs'
import { durableReplace } from '../design-editor/files.mjs'
import { loadVariantDefinitions } from '../variant-recipes.mjs'
import { contextualStylePath } from '../../src/core/contextual-style.ts'
import { tokenPath } from '../dtcg-tokens.mjs'
// In-process authority, never accepted from a JSON client or provider response.
export const chatDesignAuthority = Symbol('chat-design-authority')
export const visualDesignAuthority = Symbol('visual-design-authority')
const recordPath = '.runtime.local/workspace/design-action.json'
const serialized = (value: unknown) => JSON.stringify(value, null, 2) + '\n'
const hash = (value: unknown) => createHash('sha256').update(serialized(value)).digest('hex')
const trackedPaths = [...sourcePaths, ...derivedPaths.filter((p) => p.startsWith('docs/'))]
const inputSchema = z.strictObject({
  id: identitySchema,
  chat: z
    .strictObject({ conversationId: identitySchema, turnId: z.string().min(1).max(200) })
    .optional(),
  revision: revisionSchema,
  targets: z.array(identitySchema).min(1),
  request: z.unknown().transform(validateDesignRequest),
  registration: workspaceSchema.shape.entities.optional(),
  restoreEntities: workspaceSchema.shape.entities.optional(),
  assignment: z
    .strictObject({ occurrenceId: identitySchema, variantId: identitySchema.nullable() })
    .optional(),
  requireSelected: z.boolean().optional(),
  trace: workspaceSchema.shape.entities
    .refine((entities) => entities.every((e) => ['decision', 'figmaMapping'].includes(e.kind)))
    .optional(),
})
async function open(store: WorkspaceStore, treeId: string) {
  const root = store.treeRoot(treeId)
  if (store.designWriter && (!store.designWriterTreeId || store.designWriterTreeId === treeId))
    return store.designWriter
  // Populate only missing, generated artifacts. Existing journals remain owned by the DS writer.
  if ((await store.read('public/editor-snapshot.generated.json', root)) === null) {
    if (await store.read('.design-editor.local/active', root))
      throw new Error('workspace-design-recovery-required')
    const { outputs } = await prepareEditorArtifacts(root)
    for (const [file, bytes] of outputs) {
      await fs.mkdir(path.dirname(path.join(root, file)), { recursive: true })
      if ((await store.read(file, root)) === null) await durableReplace(root, file, bytes, 0o644)
    }
  }
  return createStore(root)
}
export async function designSnapshot(store: WorkspaceStore, treeId: string, operationId?: string) {
  return store.locked(async () => {
    await store.recoverJournal()
    await store.tree(await store.state(), treeId)
    const writer = await open(store, treeId)
    try {
      const snapshot = await writer.snapshot()
      return { ...snapshot, operation: operationId ? await writer.status(operationId) : undefined }
    } finally {
      await writer.close()
    }
  })
}
export async function recoverDesign(store: WorkspaceStore) {
  const raw = await store.read(recordPath)
  if (!raw) return
  const record = z
    .strictObject({
      input: inputSchema,
      before: stateSchema,
      treeId: identitySchema,
      files: z.record(z.string(), z.string().nullable()),
    })
    .parse(JSON.parse(raw))
  const input = inputSchema.parse(record.input)
  const before = record.before
  const previous = serialized(before)
  const tree = await store.tree(before, identitySchema.parse(record.treeId))
  const current = await store.state()
  const writer = await open(store, tree.id)
  const visual = input.request.protocolVersion === 7 ? input.request : null
  try {
    let stylesToPublish = false
    if (visual) {
      const raw = await store.read(contextualStylePath, store.treeRoot(tree.id))
      if (raw !== visual.previousStyles && raw !== visual.nextStyles)
        throw new Error('workspace-file-conflict')
      stylesToPublish = raw !== visual.nextStyles
    }
    let result = await writer.status(input.id)
    if (result.status === 'unknown')
      result =
        input.request.protocolVersion === 7
          ? await writer.saveVisual(input.request)
          : input.request.protocolVersion === 6
            ? await writer.saveImport(input.request)
            : input.request.protocolVersion === 5
              ? await writer.saveVariant(input.request)
              : await writer.save(input.request)
    if (result.status !== 'saved') {
      if (['failed', 'conflict'].includes(result.status))
        await fs.unlink(path.join(store.root, recordPath))
      throw new Error('workspace-design-' + result.status)
    }
    if (visual && stylesToPublish) {
      await store.publish(store.treeRoot(tree.id), {
        file: contextualStylePath,
        before: visual.previousStyles,
        after: visual.nextStyles,
      })
      await store.fault('design-visual-styles-published')
    }
    const revision = hash({ previous: tree.model.revision, input, designRevision: result.revision })
    tree.model = workspaceSchema.parse({
      ...tree.model,
      revision,
      entities: tree.model.entities.map((e) => {
        if (e.kind === 'flow') return { ...e, revision, evidence: null }
        if (e.kind === 'modification')
          return { ...e, revision, state: 'applied', evidenceRevision: null }
        return input.targets.includes(e.id) ? { ...e, revision } : e
      }),
    })
    if (input.registration) {
      tree.model = workspaceSchema.parse({
        ...tree.model,
        entities: [
          ...tree.model.entities.filter((e) => !input.registration!.some((n) => n.id === e.id)),
          ...input.registration,
        ],
      })
    }
    if (input.trace)
      tree.model = workspaceSchema.parse({
        ...tree.model,
        entities: [
          ...tree.model.entities.filter((e) => !['decision', 'figmaMapping'].includes(e.kind)),
          ...input.trace,
        ],
      })
    tree.model = await inventory(store, tree.model, store.treeRoot(tree.id))
    if (input.restoreEntities)
      tree.model = workspaceSchema.parse({
        ...tree.model,
        entities: input.restoreEntities.map((e) =>
          e.kind === 'flow'
            ? { ...e, revision, evidence: null }
            : e.kind === 'modification'
              ? { ...e, revision, state: 'applied', evidenceRevision: null }
              : e,
        ),
      })
    if (!tree.model.entities.some((e) => e.id === input.id)) {
      tree.model.entities.push({
        id: input.id,
        kind: 'modification',
        label: 'Modification du design system',
        revision,
        targetIds: input.targets.filter((id) => tree.model.entities.some((e) => e.id === id)),
        taskIds: [],
        state: 'applied',
        evidenceRevision: null,
      })
    }
    if (input.assignment) {
      const assignment = input.assignment
      tree.model = workspaceSchema.parse({
        ...tree.model,
        entities: tree.model.entities.map((e) =>
          e.id === assignment.occurrenceId && e.kind === 'occurrence'
            ? { ...e, variantId: assignment.variantId, revision }
            : e,
        ),
      })
    }
    tree.model = workspaceSchema.parse(tree.model)
    const edits = []
    for (const file of visual ? [...trackedPaths, contextualStylePath] : trackedPaths) {
      const after = await store.read(file, store.treeRoot(tree.id))
      if (after !== record.files[file]) edits.push({ file, before: record.files[file], after })
    }
    for (const r of Object.values(tree.receipts)) r.state = 'applied'
    tree.proof = null
    tree.receipts[input.id] = {
      design: true,
      ...(input.chat ? { chat: input.chat } : {}),
      inputHash: hash(input),
      revision,
      targets: input.targets,
      state: 'applied',
      edits,
    }
    const publicFile = 'loomata/workspace.json'
    const actual = await store.read(publicFile, store.treeRoot(tree.id))
    const original = JSON.parse(raw).before.trees.find(
      (t: { id: string }) => t.id === tree.id,
    ).model
    if (actual !== serialized(original) && actual !== serialized(tree.model))
      throw new Error('workspace-trace-conflict')
    const persisted = serialized(current)
    if (persisted !== previous && persisted !== serialized(stateSchema.parse(before)))
      throw new Error('workspace-recovery-conflict')
    await durableReplace(
      store.treeRoot(tree.id),
      publicFile,
      Buffer.from(serialized(tree.model)),
      0o644,
    )
    await store.fault('design-trace-published')
    await store.save(before)
    await fs.unlink(path.join(store.root, recordPath))
    return tree.receipts[input.id]
  } finally {
    await writer.close()
  }
}
export async function applyDesign(
  store: WorkspaceStore,
  treeId: string,
  value: unknown,
  authority?: symbol,
) {
  return store.locked(async () => {
    await store.assertRoot()
    await store.recoverJournal()
    const input = inputSchema.parse(value)
    const request = input.request
    const visual = request.protocolVersion === 7
    if (input.request.requestId !== input.id) throw new Error('workspace-design-identity-mismatch')
    if (visual && authority !== visualDesignAuthority)
      throw new Error('visual-design-authority-required')
    if (
      !visual &&
      authority !== chatDesignAuthority &&
      (request.protocolVersion === 5 ||
        request.protocolVersion === 6 ||
        request.operations.some(
          (op) => !['set-component-token', 'restore', 'update-shared', 'assign'].includes(op.kind),
        ))
    )
      throw new Error('chat-creation-required')
    const before = await store.state(),
      tree = await store.tree(before, treeId)
    if (input.requireSelected && before.selected !== treeId)
      throw new Error('workspace-selection-changed')
    if (tree.receipts[input.id]) {
      if (tree.receipts[input.id].inputHash !== hash(input))
        throw new Error('workspace-operation-reused')
      return tree.receipts[input.id]
    }
    if (tree.head !== tree.base) throw new Error('workspace-draft-committed-create-new')
    if (tree.model.revision !== input.revision) throw new Error('workspace-revision-conflict')
    await store.assertSourceState(tree)
    if (
      request.protocolVersion === 7 &&
      (await store.read(contextualStylePath, store.treeRoot(treeId))) !== request.previousStyles
    )
      throw new Error('workspace-file-conflict')
    if (
      input.targets.some(
        (id) =>
          !tree.model.entities.some((e) => e.id === id) &&
          !input.registration?.some((e) => e.id === id),
      )
    )
      throw new Error('workspace-target-unknown')
    if (request.protocolVersion === 6) {
      if (input.assignment) throw new Error('workspace-design-scope-mismatch')
      if (
        input.registration?.some((e) =>
          e.kind === 'component'
            ? !request.registry.definitions.some((d) => e.sourceKey === 'import-' + d.id)
            : e.kind === 'page'
              ? !e.path?.startsWith('/imported/')
              : e.kind === 'variant'
                ? !request.registry.definitions.some((d) =>
                    d.variants.some((v) => v.identity === e.id),
                  )
                : e.kind !== 'occurrence',
        )
      )
        throw new Error('workspace-design-scope-mismatch')
    } else if (input.registration || (input.restoreEntities && !visual))
      throw new Error('workspace-design-operation-unsupported')
    if (request.protocolVersion === 5) {
      const definitions = tree.model.entities.filter((e) => e.kind === 'component')
      const declared = tree.model.entities.filter((e) => input.targets.includes(e.id))
      const owners = declared.flatMap((e) => {
        if (e.kind === 'component') return [e.sourceKey]
        if (e.kind === 'occurrence') {
          const d = definitions.find((d) => d.id === e.definitionId)
          return d?.kind === 'component' ? [d.sourceKey] : []
        }
        return []
      })
      for (const op of request.operations) {
        if (!owners.includes(op.variant.owner)) throw new Error('workspace-design-scope-mismatch')
        const existing = tree.model.entities.find((e) => e.id === op.variant.id)
        const definition = definitions.find(
          (e) => e.kind === 'component' && e.sourceKey === op.variant.owner,
        )
        if (
          !definition ||
          (existing && (existing.kind !== 'variant' || existing.definitionId !== definition.id))
        )
          throw new Error('workspace-variant-identity-conflict')
        if (
          tree.model.entities.some(
            (e) =>
              e.kind === 'occurrence' &&
              e.variantId === op.variant.id &&
              !input.targets.includes(e.id),
          )
        )
          throw new Error('workspace-design-scope-mismatch')
      }
      if (input.assignment) {
        const a = input.assignment,
          o = tree.model.entities.find((e) => e.id === a.occurrenceId)
        if (o?.kind !== 'occurrence' || !input.targets.includes(o.id))
          throw new Error('workspace-design-scope-mismatch')
        if (a.variantId) {
          const recipe = request.operations.find((op) => op.variant.id === a.variantId)?.variant
          const definition = definitions.find((e) => e.id === o.definitionId)
          if (!recipe || definition?.kind !== 'component' || definition.sourceKey !== recipe.owner)
            throw new Error('workspace-design-scope-mismatch')
        }
      }
    } else if (input.assignment) throw new Error('workspace-design-operation-unsupported')
    const actualTargets =
      request.protocolVersion === 5 ||
      request.protocolVersion === 6 ||
      request.protocolVersion === 7
        ? input.targets
        : request.operations.map((op) => {
            const key = op.kind === 'update-shared' ? op.style : 'target' in op ? op.target : ''
            const entity = tree.model.entities.find(
              (e) => e.kind === 'token' && e.sourceKey === key,
            )
            if (!entity || !input.targets.includes(entity.id))
              throw new Error('workspace-design-scope-mismatch')
            return entity.id
          })
    if (!actualTargets.length) throw new Error('workspace-design-scope-mismatch')
    const files: Record<string, string | null> = {}
    for (const file of trackedPaths) files[file] = await store.read(file, store.treeRoot(treeId))
    if (request.protocolVersion === 7) files[contextualStylePath] = request.previousStyles
    const writer = await open(store, treeId)
    try {
      const base = await writer.snapshot()
      if (base.revision !== request.baseRevision)
        throw new Error('workspace-design-revision-conflict')
      const model = base.snapshot.model
      const resolve = (id: string): string | number => {
        const primitive = model.primitives.find((p: { id: string }) => p.id === id)
        if (primitive) return primitive.value
        const style = model.styles.find((s: { id: string }) => s.id === id)
        if (!style) throw new Error('workspace-design-reference-unknown')
        return resolve(style.reference)
      }
      const previousRecipes =
        request.protocolVersion === 5 ? await loadVariantDefinitions(store.treeRoot(treeId)) : []
      const inverse =
        request.protocolVersion === 7
          ? null
          : request.protocolVersion === 6
            ? JSON.parse(files['app/loomata-imports.json'] ?? '{"version":1,"definitions":[]}')
            : request.protocolVersion === 5
              ? request.operations.map((op) => ({
                  kind: 'put-variant',
                  variant: previousRecipes.find((r) => r.id === op.variant.id) ?? {
                    ...op.variant,
                    bindings: [],
                  },
                }))
              : request.operations
                  .map((op) => {
                    if (op.kind === 'update-shared')
                      return { kind: 'update-shared', style: op.style, value: resolve(op.style) }
                    if (!('target' in op)) throw new Error('chat-creation-required')
                    const binding = model.bindings.find((b: { id: string }) => b.id === op.target)
                    if (!binding) throw new Error('workspace-design-reference-unknown')
                    return {
                      kind: 'restore-binding',
                      target: op.target,
                      reference: binding.reference,
                      style: binding.style,
                      ...('provenance' in binding && binding.provenance
                        ? { provenance: binding.provenance }
                        : {}),
                    }
                  })
                  .reverse()
      await store.write(recordPath, { input, before, treeId, files })
      const oldOccurrence = input.assignment
        ? tree.model.entities.find((e) => e.id === input.assignment!.occurrenceId)
        : null
      await store.write('.runtime.local/workspace/design-inverse.json', {
        id: input.id,
        inverse,
        ...(input.trace
          ? {
              trace: tree.model.entities.filter((e) =>
                ['decision', 'figmaMapping'].includes(e.kind),
              ),
            }
          : {}),
        ...(request.protocolVersion === 6 || request.protocolVersion === 7
          ? { restoreEntities: tree.model.entities }
          : {}),
        protocolVersion: request.protocolVersion,
        ...(oldOccurrence?.kind === 'occurrence'
          ? { assignment: { occurrenceId: oldOccurrence.id, variantId: oldOccurrence.variantId } }
          : {}),
      })
      await store.fault('design-prepared')
      const result =
        request.protocolVersion === 7
          ? await writer.saveVisual(request)
          : request.protocolVersion === 6
            ? await writer.saveImport(request)
            : request.protocolVersion === 5
              ? await writer.saveVariant(request)
              : await writer.save(request)
      if (result.status !== 'saved') throw new Error('workspace-design-' + result.status)
      await store.fault('design-saved')
    } finally {
      await writer.close()
    }
    return recoverDesign(store)
  })
}
export async function undoDesign(
  store: WorkspaceStore,
  treeId: string,
  id: string,
  revision: string,
  requireSelected = false,
) {
  const state = await store.state(),
    tree = await store.tree(state, treeId)
  if (
    tree.head !== tree.base ||
    tree.model.revision !== revision ||
    tree.receipts[id]?.revision !== revision
  )
    throw new Error('workspace-undo-conflict')
  const inverse = JSON.parse(
    (await store.read('.runtime.local/workspace/design-inverse.json')) ?? 'null',
  )
  if (inverse?.id !== id) throw new Error('workspace-undo-conflict')
  const ds = await designSnapshot(store, treeId, id)
  if (ds.operation?.status !== 'saved' || ds.operation.revision !== ds.revision)
    throw new Error('workspace-undo-conflict')
  const next = randomUUID()
  if (inverse.protocolVersion === 7) {
    const receipt = tree.receipts[id]
    const authorityFile = receipt.edits.find((edit) => edit.file === tokenPath)
    const contextual = receipt.edits.find((edit) => edit.file === contextualStylePath)
    const styles = await store.read(contextualStylePath, store.treeRoot(treeId))
    if (
      !authorityFile ||
      !('before' in authorityFile) ||
      !authorityFile.before ||
      (contextual && (!('after' in contextual) || styles !== contextual.after))
    )
      throw new Error('workspace-undo-conflict')
    return applyDesign(
      store,
      treeId,
      {
        id: next,
        revision,
        targets: receipt.targets,
        requireSelected,
        restoreEntities: inverse.restoreEntities,
        request: {
          protocolVersion: 7,
          requestId: next,
          baseRevision: ds.revision,
          document: JSON.parse(authorityFile.before),
          previousStyles: styles,
          nextStyles: contextual ? contextual.before : styles,
        },
      },
      visualDesignAuthority,
    )
  }
  return applyDesign(
    store,
    treeId,
    {
      id: next,
      revision,
      targets: tree.receipts[id].targets,
      requireSelected,
      ...(inverse.assignment ? { assignment: inverse.assignment } : {}),
      ...(inverse.trace ? { trace: inverse.trace } : {}),
      ...(inverse.restoreEntities
        ? {
            restoreEntities: inverse.restoreEntities,
            ...(inverse.restoreEntities[0] ? { targets: [inverse.restoreEntities[0].id] } : {}),
          }
        : {}),
      request: {
        protocolVersion: inverse.protocolVersion ?? 4,
        requestId: next,
        baseRevision: ds.revision,
        ...(inverse.protocolVersion === 6
          ? { registry: inverse.inverse }
          : { operations: inverse.inverse }),
      },
    },
    chatDesignAuthority,
  )
}
