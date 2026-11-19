import path from 'node:path'
import { WorkspaceStore } from './workspace.ts'
import { identitySchema, workspaceSchema } from '../../src/core/workspace-contract.ts'
import { loadVariantDefinitions, variantsPath } from '../variant-recipes.mjs'
import { contextualStylePath, contextualStylesSchema } from '../../src/core/contextual-style.ts'

/** Read only projection of the physical source root currently served. No client root or Git commands. */
export function explorationStore(root: string, writer?: WorkspaceStore['designWriter']) {
  let common = root,
    treeId: string | null = null
  const candidate = path.basename(root)
  if (
    identitySchema.safeParse(candidate).success &&
    path.basename(path.dirname(root)) === 'trees' &&
    path.basename(path.resolve(root, '../..')) === 'workspace'
  ) {
    common = path.resolve(root, '../../../..')
    treeId = candidate
  }
  const store = new WorkspaceStore(common)
  if (treeId && store.treeRoot(treeId) !== root) throw new Error('workspace-root-changed')
  if (treeId && writer) {
    store.designWriter = { ...writer, close: async () => {} }
    store.designWriterTreeId = treeId
  }
  return { store, treeId }
}
export async function explorationSnapshot(root: string, writer?: WorkspaceStore['designWriter']) {
  const { store, treeId } = explorationStore(root, writer)
  if (!(await store.read('.runtime.local/workspace/state.json')))
    return { available: false as const }
  return store.locked(async () => {
    await store.assertRoot()
    await store.recoverJournal()
    const state = await store.state()
    const tree = treeId ? await store.tree(state, treeId) : null
    const model =
      tree?.model ??
      workspaceSchema.parse(JSON.parse((await store.read('loomata/workspace.json')) ?? 'null'))
    const last = tree
      ? Object.entries(tree.receipts)
          .reverse()
          .find(([, receipt]) => receipt.revision === model.revision && !receipt.launch)
      : null
    return {
      available: true as const,
      model,
      treeId,
      selected: state.selected === treeId,
      writable: tree?.head === tree?.base && tree !== null,
      legacyDefinitionStyles: contextualStylesSchema
        .parse(JSON.parse((await store.read(contextualStylePath, root)) ?? '[]'))
        .some((row) => row.target.kind === 'definition'),
      variants: (await store.read(variantsPath, root)) ? await loadVariantDefinitions(root) : [],
      lastOperation: last
        ? { id: last[0], revision: last[1].revision, design: last[1].design === true }
        : null,
    }
  })
}
