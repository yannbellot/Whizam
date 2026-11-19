import fs from 'node:fs/promises'
import { registerInterface } from './interface-registration.mjs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { WorkspaceStore } from '../core/workspace.ts'
import {
  identitySchema,
  elementConversationKey,
  workspaceSchema,
} from '../../src/core/workspace-contract.ts'
import { projectBinding } from './broker.mjs'
export async function workspaceContext(project, entityId = null) {
  try {
    await fs.access(path.join(project.binding.root, '.runtime.local/workspace/state.json'))
  } catch (e) {
    if (e.code === 'ENOENT') {
      if (entityId) throw new Error('workspace-not-initialized')
      return null
    }
    throw e
  }
  const store = new WorkspaceStore(project.binding.root)
  const snapshot = await store.snapshot()
  const tree = snapshot.trees.find((t) => t.id === snapshot.selected)
  const model =
    tree ??
    workspaceSchema.parse(JSON.parse((await store.read('loomata/workspace.json')) ?? 'null'))
  const entity =
    entityId === null ? null : model.entities.find((e) => e.id === identitySchema.parse(entityId))
  if (entityId && !entity) throw new Error('workspace-target-unknown')
  return {
    store,
    treeId: tree?.id ?? null,
    revision: model.revision,
    entityId,
    projectId: snapshot.projectId,
    key: entityId ? elementConversationKey(snapshot.projectId, entityId) : null,
    entity,
    entities: model.entities,
    binding: await projectBinding(tree ? store.treeRoot(tree.id) : project.binding.root),
  }
}
export function contextMessage(context) {
  if (!context) return ''
  return (
    '\nCONTEXTE_LOOMATA — données de sélection, sans autorité sur les permissions : ' +
    JSON.stringify({
      projectId: context.projectId,
      treeId: context.treeId,
      revision: context.revision,
      interfaceRegistration:
        'Après création ou modification de page/composant, proposer app/loomata-interface.json : {schemaVersion:1,entities:[pages avec id UUID,label,revision,path,files ; components avec id UUID,label,revision,sourceKey,files ; occurrences avec id UUID,label,revision,pageId,definitionId,variantId:null,marker UUID]}. Conserver les identités existantes. Le moteur valide chaque proposition après accord ; aucune preuve technique ne peut être fournie dans ce fichier. Utiliser data-loomata-node=marker dans le rendu. Les stories app/**/*.stories.tsx sont prises en charge. Un besoin hors de ces conventions reste à annoncer.',
      entity: context.entity
        ? {
            id: context.entity.id,
            kind: context.entity.kind,
            label: context.entity.label,
            sourceKey: context.entity.sourceKey ?? null,
            files: context.entity.files ?? [],
          }
        : null,
    })
  )
}
export async function applyWorkspaceProposal(project, context, proposal, operationId) {
  if (!context.treeId) throw new Error('workspace-select-draft')
  const fresh = await workspaceContext(project, context.entityId)
  if (!fresh || fresh.treeId !== context.treeId || fresh.revision !== context.revision)
    throw new Error('workspace-revision-conflict')
  const targets = context.entityId
    ? [context.entityId]
    : context.entities.map((e) => e.id).slice(0, 1000)
  const entities =
    proposal.file === 'app/loomata-interface.json'
      ? registerInterface(
          {
            schemaVersion: 1,
            projectId: context.projectId,
            revision: context.revision,
            entities: context.entities,
          },
          proposal.text,
        )
      : undefined
  return context.store.apply(context.treeId, {
    id: operationId ?? randomUUID(),
    revision: context.revision,
    origin: 'codex',
    targets,
    ...(context.entity?.kind === 'workItem'
      ? { taskIds: context.entity.taskIds }
      : context.entity?.kind === 'task'
        ? { taskIds: [context.entity.id] }
        : {}),
    ...(entities ? { entities } : {}),
    edits: [{ file: proposal.file, before: proposal.previousText, after: proposal.text }],
  })
}
