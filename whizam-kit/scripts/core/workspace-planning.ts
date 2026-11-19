import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import { explorationStore, explorationSnapshot } from './workspace-exploration.ts'
import { identitySchema, revisionSchema } from '../../src/core/workspace-contract.ts'
import { qualifyTasks, startWorkItem } from '../../src/core/workspace-planning.ts'
const base = { id: identitySchema, revision: revisionSchema }
const schema = z.discriminatedUnion('kind', [
  z.strictObject({ kind: z.literal('plan'), ...base, label: z.string().trim().min(1).max(200) }),
  z.strictObject({
    kind: z.literal('qualify'),
    ...base,
    requestId: identitySchema,
    workItemId: identitySchema,
    label: z.string().trim().min(1).max(200),
  }),
  z.strictObject({
    kind: z.literal('start'),
    ...base,
    workItemId: identitySchema,
    explicitStart: z.literal(true),
  }),
])
export async function workspacePlanning(root: string, value: unknown) {
  const input = schema.parse(value),
    view = await explorationSnapshot(root)
  if (
    !view.available ||
    !view.treeId ||
    !view.selected ||
    !view.writable ||
    view.model.revision !== input.revision
  )
    throw new Error('revision-conflict')
  const { store, treeId } = explorationStore(root)
  if (!treeId) throw new Error('revision-conflict')
  let model = view.model
  let targets: string[]
  if (input.kind === 'plan') {
    model = {
      ...model,
      entities: [
        ...model.entities,
        { id: input.id, kind: 'request', label: input.label, revision: model.revision },
      ],
    }
    targets = [input.id]
  } else if (input.kind === 'qualify') {
    const request = model.entities.find((e) => e.id === input.requestId && e.kind === 'request')
    if (!request) throw new Error('unknown-reference')
    const task = model.entities.find((e) => e.kind === 'task' && e.requestIds.includes(request.id))
    const taskId = task?.id ?? randomUUID()
    if (!task)
      model = {
        ...model,
        entities: [
          ...model.entities,
          {
            id: taskId,
            kind: 'task',
            label: request.label,
            requestIds: [request.id],
            revision: model.revision,
          },
        ],
      }
    model = qualifyTasks(model, [taskId], input.workItemId, input.label)
    targets = [input.workItemId]
  } else {
    model = startWorkItem(model, input.workItemId, true)
    targets = [input.workItemId]
  }
  const receipt = await store.apply(treeId, {
    id: randomUUID(),
    revision: input.revision,
    origin: 'inspector',
    targets,
    entities: model.entities,
    edits: [],
    requireSelected: true,
    ...(input.kind === 'start' ? { promoteToWorkItem: true } : {}),
  })
  return { revision: receipt.revision }
}
