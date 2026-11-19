import { workspaceFigmaImport } from './workspace-figma-import.mjs'
import path from 'node:path'
import fs from 'node:fs/promises'
import { createHash, randomUUID } from 'node:crypto'
import { z } from 'zod'
import { readSafe, privateDir, durableReplace, syncDir } from '../design-editor/files.mjs'
import { explorationStore, explorationSnapshot } from './workspace-exploration.ts'
import { readFigma } from './figma-client.ts'
import { workspaceFigmaFile } from './workspace-figma-file.ts'
import {
  identitySchema,
  revisionSchema,
  type WorkspaceEntity,
} from '../../src/core/workspace-contract.ts'
import { figmaNodeIdSchema } from '../../src/core/figma-reference.ts'
import { applyDesign } from './workspace-design.ts'
import type { WorkspaceStore } from './workspace.ts'
const digest = (v: unknown) => createHash('sha256').update(JSON.stringify(v)).digest('hex')
const source = { fileKey: z.string().regex(/^[A-Za-z0-9]{10,100}$/), nodeId: figmaNodeIdSchema }
const base = { revision: revisionSchema }
const schema = z.discriminatedUnion('kind', [
  z.strictObject({ kind: z.literal('status') }),
  z.strictObject({
    kind: z.literal('connect'),
    token: z
      .string()
      .min(20)
      .max(1000)
      .regex(/^[!-~]+$/),
    ...source,
  }),
  z.strictObject({ kind: z.literal('disconnect') }),
  z.strictObject({ kind: z.literal('import'), ...base, ...source }),
  z.strictObject({
    kind: z.literal('decide'),
    ...base,
    referenceId: identitySchema,
    nodeId: figmaNodeIdSchema,
    sourceHash: revisionSchema,
    targets: z.array(identitySchema).min(1).max(20),
    outcome: z.enum(['keep', 'adopt', 'combine', 'defer']),
    rationale: z.string().trim().min(1).max(4000),
    bindingId: z.string().min(1).max(200).nullable(),
  }),
])
const connectionFile = '.runtime.local/figma/connection.json'
async function connection(store: WorkspaceStore) {
  try {
    const result = await readSafe(store.root, connectionFile, 4096)
    return z
      .strictObject({ token: schema.options[1].shape.token })
      .parse(JSON.parse(result.bytes.toString('utf8')))
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'ENOENT') return null
    throw e
  }
}
function resolvedValue(
  snapshot: Awaited<
    ReturnType<NonNullable<WorkspaceStore['designWriter']>['snapshot']>
  >['snapshot'],
  id: string,
): string | number {
  const binding = snapshot.model.bindings.find((b) => b.id === id)
  if (!binding) throw new Error('unknown-reference')
  let ref = binding.reference
  for (let i = 0; i < 20; i++) {
    const primitive = snapshot.model.primitives.find((p) => p.id === ref)
    if (primitive) return primitive.value
    const style = snapshot.model.styles.find((s) => s.id === ref)
    if (!style) throw new Error('unknown-reference')
    ref = style.reference
  }
  throw new Error('unknown-reference')
}
/** Explicit, bounded direct read; credentials are private and never returned or included in traces. */
export async function workspaceFigma(
  root: string,
  writer: NonNullable<WorkspaceStore['designWriter']>,
  value: unknown,
  request: typeof fetch = fetch,
) {
  if (
    value &&
    typeof value === 'object' &&
    'kind' in value &&
    typeof value.kind === 'string' &&
    value.kind.startsWith('import-')
  )
    return workspaceFigmaImport(root, writer, value)
  if (
    value &&
    typeof value === 'object' &&
    'kind' in value &&
    typeof value.kind === 'string' &&
    value.kind.startsWith('file-')
  ) {
    const { store } = explorationStore(root)
    await store.assertRoot()
    return workspaceFigmaFile(root, store.root, value, request)
  }
  const input = schema.parse(value),
    { store, treeId } = explorationStore(root)
  await store.assertRoot()
  if (input.kind === 'status') {
    const view = await explorationSnapshot(root)
    const design = await writer.snapshot()
    const comparisons = view.available
      ? view.model.entities.flatMap((mapping) => {
          if (mapping.kind !== 'figmaMapping') return []
          const reference = view.model.entities.find((e) => e.id === mapping.referenceId)
          const node =
            reference?.kind === 'figmaReference'
              ? reference.source.nodes.find((n) => n.id === mapping.nodeId)
              : undefined
          const productValue = mapping.bindingId
            ? resolvedValue(design.snapshot, mapping.bindingId)
            : null
          const sourceChanged = node?.visualHash !== mapping.sourceVisualHash
          const productChanged = digest(productValue) !== mapping.projectBaselineHash
          return [
            {
              id: mapping.id,
              productValue,
              sourceColor: node?.color ?? null,
              status: !node
                ? 'selection-incomplete'
                : sourceChanged && productChanged
                  ? 'source-and-product-changed'
                  : sourceChanged
                    ? 'source-changed'
                    : productChanged
                      ? 'product-changed'
                      : 'unchanged',
            },
          ]
        })
      : []
    return { connected: !!(await connection(store)), comparisons }
  }
  if (input.kind === 'disconnect') {
    await connection(store)
    await fs.unlink(path.join(store.root, connectionFile)).catch((e) => {
      if (e.code !== 'ENOENT') throw e
    })
    await syncDir(path.join(store.root, '.runtime.local/figma')).catch((e) => {
      if (e.code !== 'ENOENT') throw e
    })
    return { connected: false }
  }
  if (input.kind === 'connect') {
    await connection(store)
    await readFigma(input.token, input.fileKey, input.nodeId, request)
    await privateDir(path.join(store.root, '.runtime.local'))
    await privateDir(path.join(store.root, '.runtime.local/figma'))
    await durableReplace(
      store.root,
      connectionFile,
      Buffer.from(JSON.stringify({ token: input.token })),
    )
    return { connected: true }
  }
  const view = await explorationSnapshot(root)
  if (
    !view.available ||
    !treeId ||
    !view.selected ||
    !view.writable ||
    view.model.revision !== input.revision
  )
    throw new Error('revision-conflict')
  if (input.kind === 'import') {
    const auth = await connection(store)
    if (!auth) throw new Error('figma-connection-required')
    const source = await readFigma(auth.token, input.fileKey, input.nodeId, request)
    const existing = view.model.entities.find(
      (e) =>
        e.kind === 'figmaReference' &&
        e.source.fileKey === input.fileKey &&
        e.source.nodeId === input.nodeId,
    )
    if (existing?.kind === 'figmaReference' && existing.source.contentHash === source.contentHash) {
      const latest = await explorationSnapshot(root)
      if (!latest.available || !latest.selected || latest.model.revision !== input.revision)
        throw new Error('revision-conflict')
      return { unchanged: true }
    }
    const reference: WorkspaceEntity = {
      id: existing?.id ?? randomUUID(),
      kind: 'figmaReference',
      label: source.nodes.find((n) => n.id === source.nodeId)?.name || 'Sélection Figma',
      revision: view.model.revision,
      source,
    }
    const receipt = await store.apply(treeId, {
      id: randomUUID(),
      origin: 'figma',
      targets: [reference.id],
      revision: input.revision,
      requireSelected: true,
      edits: [],
      entities: [...view.model.entities.filter((e) => e.id !== reference.id), reference],
    })
    return { revision: receipt.revision }
  }
  const reference = view.model.entities.find((e) => e.id === input.referenceId)
  if (reference?.kind !== 'figmaReference' || reference.source.contentHash !== input.sourceHash)
    throw new Error('revision-conflict')
  const node = reference.source.nodes.find((n) => n.id === input.nodeId)
  if (!node) throw new Error('unknown-reference')
  if (
    input.targets.some(
      (id) =>
        !view.model.entities.some(
          (e) =>
            e.id === id && ['page', 'component', 'variant', 'occurrence', 'token'].includes(e.kind),
        ),
    )
  )
    throw new Error('unknown-reference')
  const design = await writer.snapshot()
  const valueBefore = input.bindingId ? resolvedValue(design.snapshot, input.bindingId) : null
  if (
    input.bindingId &&
    !input.targets.some((id) =>
      view.model.entities.some(
        (e) => e.id === id && e.kind === 'token' && e.sourceKey === input.bindingId,
      ),
    )
  )
    throw new Error('unknown-reference')
  const effect = ['adopt', 'combine'].includes(input.outcome)
  if (effect && (!input.bindingId || !node.color)) throw new Error('figma-effect-unsupported')
  const previous = view.model.entities.find(
    (e) =>
      e.kind === 'figmaMapping' &&
      e.referenceId === reference.id &&
      e.nodeId === node.id &&
      JSON.stringify([...e.targetIds].sort()) === JSON.stringify([...input.targets].sort()),
  )
  const mapping: WorkspaceEntity = {
    id: previous?.id ?? randomUUID(),
    kind: 'figmaMapping',
    label: node.name || 'Correspondance Figma',
    revision: input.revision,
    referenceId: reference.id,
    nodeId: node.id,
    targetIds: input.targets,
    sourceVisualHash: node.visualHash,
    projectBaselineHash: digest(effect ? node.color : valueBefore),
    bindingId: input.bindingId,
    outcome: input.outcome,
  }
  const decision: WorkspaceEntity = {
    id: randomUUID(),
    kind: 'decision',
    label: 'Arbitrage Figma',
    revision: input.revision,
    targetIds: [mapping.id, ...input.targets],
    outcome: input.outcome,
    rationale: input.rationale,
    source: {
      referenceId: reference.id,
      version: reference.source.version,
      contentHash: reference.source.contentHash,
      node,
      productValueBefore: valueBefore,
    },
  }
  const entities = [...view.model.entities.filter((e) => e.id !== mapping.id), mapping, decision]
  if (!effect) {
    const receipt = await store.apply(treeId, {
      id: randomUUID(),
      revision: input.revision,
      origin: 'figma',
      targets: input.targets,
      entities,
      edits: [],
      requireSelected: true,
    })
    return { revision: receipt.revision }
  }
  const id = randomUUID()
  store.designWriter = { ...writer, close: async () => {} }
  const receipt = await applyDesign(store, treeId, {
    id,
    revision: input.revision,
    targets: input.targets,
    requireSelected: true,
    trace: entities.filter((e) => ['decision', 'figmaMapping'].includes(e.kind)),
    request: {
      protocolVersion: 4,
      requestId: id,
      baseRevision: design.revision,
      operations: [{ kind: 'set-component-token', target: input.bindingId, value: node.color }],
    },
  })
  if (!receipt) throw new Error('service-unavailable')
  return { revision: receipt.revision }
}
