import { createHash } from 'node:crypto'
import type { Workspace } from '../../src/core/workspace-contract.ts'
import { workspaceSchema } from '../../src/core/workspace-contract.ts'
import { loadTokens } from '../dtcg-tokens.mjs'
import type { WorkspaceStore } from './workspace.ts'
import { loadVariantDefinitions, variantsPath } from '../variant-recipes.mjs'
function stableId(project: string, source: string) {
  const hex = createHash('sha256')
    .update(project + ':' + source)
    .digest('hex')
    .slice(0, 32)
    .split('')
  hex[12] = '4'
  hex[16] = '8'
  const id = hex.join('')
  return `${id.slice(0, 8)}-${id.slice(8, 12)}-${id.slice(12, 16)}-${id.slice(16, 20)}-${id.slice(20)}`
}
/** Exact DS source identities only. Real page composition is implemented in T1. */
export async function inventory(store: WorkspaceStore, input: Workspace, root = store.root) {
  const model = workspaceSchema.parse(input)
  const text = await store.read('src/design-system/authority/tokens.tokens.json', root)
  if (!text) return model
  const { entries } = await loadTokens(root)
  for (const entry of entries) {
    if (
      model.entities.some((e) => 'sourceKey' in e && e.kind === 'token' && e.sourceKey === entry.id)
    )
      continue
    model.entities.push({
      id: stableId(model.projectId, 'token:' + entry.id),
      kind: 'token',
      sourceKey: entry.id,
      label: entry.id.slice(0, 200),
      revision: model.revision,
    })
    if (
      entry.meta.kind === 'component' &&
      typeof entry.meta.owner === 'string' &&
      /^[a-z][a-z0-9-]*$/.test(entry.meta.owner) &&
      !model.entities.some((e) => e.kind === 'component' && e.sourceKey === entry.meta.owner)
    )
      model.entities.push({
        id: stableId(model.projectId, 'component:' + entry.meta.owner),
        kind: 'component',
        sourceKey: entry.meta.owner,
        label: entry.meta.owner,
        revision: model.revision,
      })
  }
  if (await store.read(variantsPath, root)) {
    for (const recipe of await loadVariantDefinitions(root)) {
      const definition = model.entities.find(
        (e) => e.kind === 'component' && e.sourceKey === recipe.owner,
      )
      if (!definition) throw new Error('workspace-variant-definition-unknown')
      const previous = model.entities.find((e) => e.id === recipe.id)
      if (previous && (previous.kind !== 'variant' || previous.definitionId !== definition.id))
        throw new Error('workspace-variant-identity-conflict')
      model.entities = model.entities
        .filter((e) => e.id !== recipe.id)
        .concat({
          id: recipe.id,
          kind: 'variant',
          label: recipe.label,
          definitionId: definition.id,
          revision: model.revision,
        })
    }
  }
  return workspaceSchema.parse(model)
}
