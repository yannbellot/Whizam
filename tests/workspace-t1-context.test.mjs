import test from 'node:test'
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fixture, chatFixture } from './helpers/workspace.mjs'
import { contextControl } from '../scripts/agent-chat/context-control.mjs'
import { workspacePlanning } from '../scripts/core/workspace-planning.ts'
import { registerInterface } from '../scripts/agent-chat/interface-registration.mjs'
test('micro-chat and full Agents use one durable entity conversation; foreign operations and stale selection fail', async (t) => {
  const f = await fixture(t),
    { manager, project, options } = await chatFixture(t, f)
  const command = (command, payload = {}) =>
    contextControl(manager, {
      operation: 'context',
      root: f.root,
      treeId: f.treeId,
      command,
      payload,
    })
  const a = await command('new', { entityId: f.target }),
    b = await command('new', { entityId: f.target }),
    general = await command('new')
  assert.equal(a.conversation, b.conversation)
  assert.notEqual(a.conversation, general.conversation)
  const snapshot = await command('snapshot')
  assert.equal(snapshot.conversations.find((c) => c.id === a.conversation).entityId, f.target)
  assert.ok(!JSON.stringify(snapshot).includes(f.root))
  await assert.rejects(command('workspaceSelect', { treeId: null }), /denied/)
  await assert.rejects(
    command('send', {
      conversation: a.conversation,
      text: 'Hello',
      requestId: randomUUID(),
      root: '/foreign',
    }),
  )
  await f.store.select(null)
  await assert.rejects(command('snapshot'), /selection-changed/)
  assert.ok(project)
  assert.ok(options)
})
test('planning persists and qualifies without inference, then explicit start promotes the isolated tree', async (t) => {
  const f = await fixture(t),
    root = f.store.treeRoot(f.treeId)
  let view = (await f.store.snapshot()).trees.find((t) => t.id === f.treeId)
  const requestId = randomUUID(),
    workItemId = randomUUID()
  await workspacePlanning(root, {
    kind: 'plan',
    id: requestId,
    revision: view.revision,
    label: 'Préparer une page',
  })
  view = (await f.store.snapshot()).trees.find((t) => t.id === f.treeId)
  assert.ok(view.entities.some((e) => e.id === requestId))
  assert.equal(view.kind, 'draft')
  await workspacePlanning(root, {
    kind: 'qualify',
    id: randomUUID(),
    revision: view.revision,
    requestId,
    workItemId,
    label: 'Page pilote',
  })
  view = (await f.store.snapshot()).trees.find((t) => t.id === f.treeId)
  assert.equal(view.entities.find((e) => e.id === workItemId).state, 'qualified')
  assert.equal(view.kind, 'draft')
  await assert.rejects(
    workspacePlanning(root, {
      kind: 'start',
      id: randomUUID(),
      revision: view.revision,
      workItemId,
      explicitStart: false,
    }),
  )
  await workspacePlanning(root, {
    kind: 'start',
    id: randomUUID(),
    revision: view.revision,
    workItemId,
    explicitStart: true,
  })
  view = (await f.store.snapshot()).trees.find((t) => t.id === f.treeId)
  assert.equal(view.kind, 'workItem')
  assert.equal(view.entities.find((e) => e.id === workItemId).state, 'running')
  assert.equal(await fs.readFile(path.join(root, 'page.txt'), 'utf8'), 'original')
  assert.equal((await f.store.snapshot()).trees.length, 1)
})
test('approved interface declaration keeps IDs, rejects attestations and cannot redefine an entity kind', () => {
  const projectId = randomUUID(),
    id = randomUUID(),
    revision = 'a'.repeat(64)
  const model = {
    schemaVersion: 1,
    projectId,
    revision,
    entities: [{ kind: 'page', id, label: 'Old', revision, path: '/' }],
  }
  const registered = registerInterface(
    model,
    JSON.stringify({ schemaVersion: 1, entities: [{ ...model.entities[0], label: 'Renamed' }] }),
  )
  assert.equal(registered[0].id, id)
  assert.equal(registered[0].label, 'Renamed')
  assert.throws(
    () =>
      registerInterface(
        model,
        JSON.stringify({
          schemaVersion: 1,
          entities: [{ kind: 'component', id, label: 'Conflict', revision, sourceKey: 'button' }],
        }),
      ),
    /identity-conflict/,
  )
  assert.throws(() =>
    registerInterface(
      model,
      JSON.stringify({
        schemaVersion: 1,
        entities: [
          {
            kind: 'workItem',
            id: randomUUID(),
            label: 'Escalation',
            revision,
            taskIds: [],
            commitIds: [],
            state: 'running',
          },
        ],
      }),
    ),
  )
})
test('selection changes during provider account preparation cannot start a turn in a different tree', async (t) => {
  const f = await fixture(t),
    { manager } = await chatFixture(t, f)
  const command = (command, payload = {}) =>
    contextControl(manager, {
      operation: 'context',
      root: f.root,
      treeId: f.treeId,
      command,
      payload,
    })
  const { conversation } = await command('new', { entityId: f.target })
  const account = manager.account.bind(manager)
  manager.account = async () => {
    const result = await account()
    await f.store.select(null)
    return result
  }
  await assert.rejects(
    command('send', {
      conversation,
      text: 'Do not send after selection changed',
      requestId: randomUUID(),
    }),
    /selection-changed/,
  )
  assert.equal(
    manager.provider.calls.some((c) => c.method === 'turn/start'),
    false,
  )
  assert.equal(manager.turn, null)
})
test('contending requests wait for acquisition once, then one stale revision is refused without replay', async (t) => {
  const f = await fixture(t),
    tree = (await f.store.snapshot()).trees.find((t) => t.id === f.treeId)
  const operation = (text) => ({
    id: randomUUID(),
    revision: tree.revision,
    origin: 'inspector',
    targets: [f.target],
    edits: [{ file: 'page.txt', before: 'original', after: text }],
  })
  const results = await Promise.allSettled([
    f.store.apply(f.treeId, operation('first')),
    f.store.apply(f.treeId, operation('second')),
  ])
  assert.equal(results.filter((r) => r.status === 'fulfilled').length, 1)
  const rejected = results.find((r) => r.status === 'rejected')
  assert.match(rejected.reason.message, /revision-conflict/)
  const next = (await f.store.snapshot()).trees.find((t) => t.id === f.treeId)
  assert.equal(next.operations.length, 1)
})
test('Codex work-item changes inherit the qualified tasks for modification and commit grouping', async (t) => {
  const f = await fixture(t),
    root = f.store.treeRoot(f.treeId)
  const view = async () => (await f.store.snapshot()).trees.find((t) => t.id === f.treeId)
  const requestId = randomUUID(),
    workItemId = randomUUID()
  await workspacePlanning(root, {
    kind: 'plan',
    id: requestId,
    revision: (await view()).revision,
    label: 'Modifier le témoin',
  })
  await workspacePlanning(root, {
    kind: 'qualify',
    id: randomUUID(),
    revision: (await view()).revision,
    requestId,
    workItemId,
    label: 'Chantier témoin',
  })
  await workspacePlanning(root, {
    kind: 'start',
    id: randomUUID(),
    revision: (await view()).revision,
    workItemId,
    explicitStart: true,
  })
  const { project } = await chatFixture(t, f)
  const { workspaceContext, applyWorkspaceProposal } =
    await import('../scripts/agent-chat/workspace.mjs')
  const context = await workspaceContext(project, workItemId),
    id = randomUUID()
  await applyWorkspaceProposal(
    project,
    context,
    { file: 'page.txt', previousText: 'original', text: 'Linked change' },
    id,
  )
  const tree = await view(),
    modification = tree.entities.find((e) => e.id === id)
  assert.deepEqual(modification.taskIds, tree.entities.find((e) => e.id === workItemId).taskIds)
  assert.equal(modification.taskIds.length, 1)
})
