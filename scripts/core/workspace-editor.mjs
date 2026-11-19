import path from 'node:path'
import { createHash } from 'node:crypto'
import { WorkspaceStore } from './workspace.ts'
import { applyDesign } from './workspace-design.ts'
export const coordinatedDesignRevision = (design, common) =>
  createHash('sha256').update(JSON.stringify({ design, common })).digest('hex')
const alias = coordinatedDesignRevision
/** Keep both writer guarantees. Lock order is common coordinator, then specialized writer. */
export async function coordinateEditor(root, writer) {
  const rootStore = new WorkspaceStore(root)
  if (await rootStore.read('.runtime.local/workspace/state.json'))
    return {
      ...writer,
      get busy() {
        return writer.busy
      },
      save: async (request) => ({
        status: 'conflict',
        requestId: request.requestId,
        issues: [
          {
            code: 'revision-conflict',
            message: 'Sélectionnez un brouillon pour modifier cette version.',
          },
        ],
      }),
      importFont: async () => {
        throw new Error('workspace-select-draft')
      },
    }
  const treeId = path.basename(root)
  if (
    !/^[a-f0-9-]{36}$/.test(treeId) ||
    path.basename(path.dirname(root)) !== 'trees' ||
    path.basename(path.resolve(root, '../..')) !== 'workspace'
  )
    return writer
  const commonRoot = path.resolve(root, '../../../..'),
    store = new WorkspaceStore(commonRoot)
  if (store.treeRoot(treeId) !== root) throw new Error('workspace-tree-changed')
  if (!(await store.read('.runtime.local/workspace/state.json'))) return writer
  await store.assertRoot()
  store.designWriter = { ...writer, close: async () => {} }
  store.designWriterTreeId = treeId
  const versions = new Map()
  const snapshot = () =>
    store.locked(async () => {
      await store.recoverJournal()
      const tree = await store.tree(await store.state(), treeId)
      const ds = await writer.snapshot(),
        revision = alias(ds.revision, tree.model.revision)
      versions.set(revision, { design: ds.revision, common: tree.model.revision })
      if (versions.size > 100) versions.delete(versions.keys().next().value)
      return { ...ds, revision }
    })
  return {
    ...writer,
    get busy() {
      return writer.busy
    },
    snapshot,
    importFont: async () => {
      throw new Error('workspace-plan-required')
    },
    async save(request) {
      const pair = versions.get(request.baseRevision)
      if (!pair)
        return {
          status: 'conflict',
          requestId: request.requestId,
          issues: [
            { code: 'revision-conflict', message: 'Actualisez la sélection avant de modifier.' },
          ],
        }
      const state = await store.state(),
        tree = await store.tree(state, treeId)
      const targets = request.operations.map((op) => {
        const key = op.kind === 'update-shared' ? op.style : op.target
        const entity = tree.model.entities.find((e) => e.kind === 'token' && e.sourceKey === key)
        if (!entity) throw new Error('workspace-target-unknown')
        return entity.id
      })
      try {
        await applyDesign(store, treeId, {
          id: request.requestId,
          revision: pair.common,
          targets: [...new Set(targets)],
          request: { ...request, baseRevision: pair.design },
        })
        const next = await snapshot()
        return { status: 'saved', requestId: request.requestId, revision: next.revision }
      } catch (error) {
        return {
          status: 'conflict',
          requestId: request.requestId,
          issues: [{ code: 'revision-conflict', message: error.message }],
        }
      }
    },
    async status(id) {
      await snapshot()
      const result = await writer.status(id)
      if (result.status !== 'saved') return result
      const state = await store.state(),
        tree = await store.tree(state, treeId),
        receipt = tree.receipts[id]
      if (!receipt) return { status: 'recovery-required', requestId: id }
      return { ...result, revision: alias(result.revision, receipt.revision) }
    },
  }
}
