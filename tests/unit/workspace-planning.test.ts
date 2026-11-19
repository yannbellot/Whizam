import { expect, test } from 'vitest'
import { qualifyTasks, startWorkItem } from '../../src/core/workspace-planning'
const id = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`
const revision = 'a'.repeat(64)
test('qualifying requests preserves links and does not launch work', () => {
  const model = {
    schemaVersion: 1,
    projectId: id(1),
    revision,
    entities: [
      { id: id(2), kind: 'request', label: 'Request', revision },
      { id: id(3), kind: 'task', label: 'Task 1', revision, requestIds: [id(2)] },
      { id: id(4), kind: 'task', label: 'Task 2', revision, requestIds: [id(2)] },
      {
        id: id(5),
        kind: 'workItem',
        label: 'Existing',
        revision,
        taskIds: [id(3)],
        commitIds: [],
        state: 'pending',
      },
    ],
  }
  const qualified = qualifyTasks(model, [id(3), id(4), id(4)], id(6), 'Next')
  expect(qualified.entities.find((e) => e.id === id(5))).toEqual(model.entities[3])
  expect(qualified.entities.find((e) => e.id === id(6))).toMatchObject({
    taskIds: [id(4)],
    state: 'qualified',
  })
  expect(() => startWorkItem(qualified, id(6), false)).toThrow('explicit-start')
  expect(startWorkItem(qualified, id(6), true).entities.find((e) => e.id === id(6))).toMatchObject({
    state: 'running',
  })
})
