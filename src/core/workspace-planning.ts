import { workspaceSchema, identitySchema, type Workspace } from './workspace-contract.ts'
export function qualifyTasks(
  input: unknown,
  taskIds: string[],
  workItemId: string,
  label: string,
): Workspace {
  const model = workspaceSchema.parse(input)
  identitySchema.parse(workItemId)
  for (const id of taskIds)
    if (!model.entities.some((e) => e.id === id && e.kind === 'task'))
      throw new Error('workspace-task-unknown')
  const previous = model.entities.find((e) => e.id === workItemId)
  if (previous && previous.kind !== 'workItem') throw new Error('workspace-identity-conflict')
  const preserved = model.entities
    .filter((e) => e.kind === 'workItem' && e.id !== workItemId)
    .flatMap((e) => (e.kind === 'workItem' ? e.taskIds : []))
  const taskSet = [
    ...new Set([
      ...(previous?.kind === 'workItem' ? previous.taskIds : []),
      ...taskIds.filter((id) => !preserved.includes(id)),
    ]),
  ]
  return workspaceSchema.parse({
    ...model,
    entities: [
      ...model.entities.filter((e) => e.id !== workItemId),
      {
        id: workItemId,
        label,
        kind: 'workItem',
        revision: model.revision,
        taskIds: taskSet,
        commitIds: previous?.kind === 'workItem' ? previous.commitIds : [],
        state:
          previous?.kind === 'workItem' && previous.state === 'running' ? 'running' : 'qualified',
      },
    ],
  })
}
export function startWorkItem(input: unknown, id: string, explicitStart: boolean): Workspace {
  const model = workspaceSchema.parse(input)
  if (explicitStart !== true) throw new Error('workspace-explicit-start-required')
  const item = model.entities.find((e) => e.id === id)
  if (item?.kind !== 'workItem' || item.state !== 'qualified')
    throw new Error('workspace-work-item-not-qualified')
  return workspaceSchema.parse({
    ...model,
    entities: model.entities.map((e) => (e.id === id ? { ...e, state: 'running' } : e)),
  })
}
