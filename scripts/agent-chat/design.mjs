import { z } from 'zod'
import { createHash } from 'node:crypto'
import { operationSchema, projectTransaction } from '../../src/design-system/editor/operations.ts'
import { projectValues, emptyChanges } from '../../src/design-system/editor/draft.ts'
import { applyDesign, designSnapshot, chatDesignAuthority } from '../core/workspace-design.ts'
import { createStore } from '../design-editor/store.mjs'
import { mutateVariant } from '../core/workspace-variants.ts'
import { workspaceFigmaImport } from '../core/workspace-figma-import.mjs'
import { readDesignSnapshot } from '../design-editor/read-snapshot.mjs'

const commandSchema = z.discriminatedUnion('kind', [
  z.strictObject({ kind: z.literal('plan'), label: z.string().trim().min(1).max(200) }),
  z.strictObject({
    kind: z.literal('tokens'),
    operations: z.array(operationSchema).min(1).max(20),
  }),
  z.strictObject({ kind: z.literal('variant'), command: z.record(z.string(), z.unknown()) }),
  z.strictObject({ kind: z.literal('import'), command: z.record(z.string(), z.unknown()) }),
])
export async function designContext(context, { readOnly = false } = {}) {
  if (!context?.treeId) return null
  const ds = readOnly
    ? await readDesignSnapshot(context.store.treeRoot(context.treeId))
    : await designSnapshot(context.store, context.treeId)
  const snapshot = ds.snapshot
  const values = projectValues(snapshot, emptyChanges())
  return {
    revision: ds.revision,
    generation: snapshot.generation,
    properties: snapshot.contract.properties,
    categories: snapshot.catalog.categories,
    bindings: snapshot.model.bindings.map((b) => ({ ...b, value: values.bindings[b.id] })),
    decisions: snapshot.model.styles.map((s) => ({ ...s, value: values.styles[s.id] })),
  }
}
export async function proposeDesign(context, args) {
  if (!context?.treeId) throw new Error('workspace-select-draft')
  if (!args || Object.keys(args).sort().join(',') !== 'content,reason')
    throw new Error('chat-action-invalid')
  const reason = z.string().trim().min(1).max(600).parse(args.reason)
  const command = commandSchema.parse(JSON.parse(z.string().max(100000).parse(args.content)))
  const ds = await designSnapshot(context.store, context.treeId)
  if (command.kind === 'tokens') {
    if (command.operations.some((op) => op.kind === 'restore-binding'))
      throw new Error('chat-action-denied')
    projectTransaction(ds.snapshot, command.operations)
  }
  if (command.kind === 'variant' && command.command.kind !== 'create')
    throw new Error('chat-action-invalid')
  if (command.kind === 'import' && command.command.kind !== 'import-accept')
    throw new Error('chat-action-invalid')
  let importFingerprint, importPreview
  if (command.kind === 'import') {
    const raw = await context.store.read('.runtime.local/figma/proposal.json', context.binding.root)
    if (!raw || raw.length > 2 * 1024 * 1024) throw new Error('chat-proposal-invalid')
    importPreview = JSON.parse(raw)
    if (
      importPreview.id !== command.command.id ||
      importPreview.revision !== context.revision ||
      importPreview.designRevision !== ds.revision
    )
      throw new Error('revision-conflict')
    importFingerprint = createHash('sha256').update(raw).digest('hex')
  }
  return {
    ...(importFingerprint ? { importFingerprint } : {}),
    file: 'Design System',
    reason,
    previousText: null,
    text: importPreview
      ? JSON.stringify({ command, proposal: importPreview })
      : JSON.stringify(command, null, 2),
    command,
    designRevision: ds.revision,
  }
}
/** Called only from a live, correlated chat approval. The durable DS journal owns recovery after entry. */
export async function applyChatDesign(context, proposal, operationId, chat) {
  const tree = await context.store.tree(await context.store.state(), context.treeId)
  if (tree.model.revision !== context.revision) throw new Error('workspace-revision-conflict')
  const ds = await designSnapshot(context.store, context.treeId)
  if (ds.revision !== proposal.designRevision) throw new Error('revision-conflict')
  const command = commandSchema.parse(proposal.command)
  if (command.kind === 'plan') {
    return context.store.apply(context.treeId, {
      id: operationId,
      revision: context.revision,
      origin: 'codex',
      targets: [operationId],
      requireSelected: true,
      edits: [],
      entities: [
        ...tree.model.entities,
        { id: operationId, kind: 'request', label: command.label, revision: context.revision },
      ],
    })
  }
  if (command.kind === 'tokens') {
    const targets = command.operations.map((op) => {
      const key = op.kind === 'update-shared' ? op.style : op.target
      const token = tree.model.entities.find((e) => e.kind === 'token' && e.sourceKey === key)
      if (!token) throw new Error('workspace-target-unknown')
      return token.id
    })
    return applyDesign(
      context.store,
      context.treeId,
      {
        id: operationId,
        ...(chat ? { chat } : {}),
        revision: context.revision,
        targets: [...new Set(targets)],
        requireSelected: true,
        request: {
          protocolVersion: 4,
          requestId: operationId,
          baseRevision: ds.revision,
          operations: command.operations,
        },
      },
      chatDesignAuthority,
    )
  }
  const writer = await createStore(context.binding.root)
  try {
    if (command.kind === 'variant')
      return await mutateVariant(
        context.binding.root,
        writer,
        {
          ...command.command,
          id: operationId,
          revision: context.revision,
          designRevision: createHash('sha256')
            .update(JSON.stringify({ design: ds.revision, common: context.revision }))
            .digest('hex'),
        },
        chatDesignAuthority,
        chat,
      )
    if (!proposal.importFingerprint) throw new Error('chat-proposal-invalid')
    return await workspaceFigmaImport(
      context.binding.root,
      writer,
      { ...command.command, revision: context.revision },
      chatDesignAuthority,
      chat,
      proposal.importFingerprint,
    )
  } finally {
    await writer.close()
  }
}
