import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { WorkspaceStore } from '../scripts/core/workspace.ts'
import { applyDesign, designSnapshot, undoDesign } from '../scripts/core/workspace-design.ts'
import { tokenPath } from '../scripts/design-editor/manifest.mjs'
import { fixture, chatFixture } from './helpers/workspace.mjs'
import { ChatManager } from '../scripts/agent-chat/manager.mjs'
const source = path.resolve(import.meta.dirname, '..')
const revision = 'a'.repeat(64)
test('DS specialized writer shares revision, durable receipt and undo with common draft', async (t) => {
  const f = await fixture(t, true)
  const before = await fs.readFile(path.join(f.root, tokenPath), 'utf8')
  const snapshot = await designSnapshot(f.store, f.treeId),
    id = randomUUID()
  const input = {
    id,
    revision,
    targets: [
      (await f.store.snapshot()).trees[0].entities.find(
        (e) =>
          e.kind === 'token' && e.sourceKey === 'component.button.default.root.background.default',
      ).id,
    ],
    request: {
      protocolVersion: 4,
      requestId: id,
      baseRevision: snapshot.revision,
      operations: [
        {
          kind: 'set-component-token',
          target: 'component.button.default.root.background.default',
          value: '#123456',
        },
      ],
    },
  }
  const result = await applyDesign(f.store, f.treeId, input)
  assert.equal(result.state, 'applied')
  assert.equal(await fs.readFile(path.join(f.root, tokenPath), 'utf8'), before)
  assert.notEqual(
    await fs.readFile(path.join(f.store.treeRoot(f.treeId), tokenPath), 'utf8'),
    before,
  )
  assert.equal((await applyDesign(f.store, f.treeId, input)).revision, result.revision)
  const undo = await undoDesign(f.store, f.treeId, id, result.revision)
  assert.notEqual(undo.revision, result.revision)
  const restored = await designSnapshot(f.store, f.treeId)
  assert.deepEqual(restored.snapshot.model.bindings, snapshot.snapshot.model.bindings)
  assert.deepEqual(restored.snapshot.model.styles, snapshot.snapshot.model.styles)
  for (const primitive of snapshot.snapshot.model.primitives)
    assert.deepEqual(
      restored.snapshot.model.primitives.find((p) => p.id === primitive.id),
      primitive,
    )
})
test('DS writer receipt finishes common metadata after interrupted publication', async (t) => {
  const f = await fixture(t, true)
  const snapshot = await designSnapshot(f.store, f.treeId),
    id = randomUUID()
  const input = {
    id,
    revision,
    targets: [
      (await f.store.snapshot()).trees[0].entities.find(
        (e) =>
          e.kind === 'token' && e.sourceKey === 'component.button.default.root.background.default',
      ).id,
    ],
    request: {
      protocolVersion: 4,
      requestId: id,
      baseRevision: snapshot.revision,
      operations: [
        {
          kind: 'set-component-token',
          target: 'component.button.default.root.background.default',
          value: '#123456',
        },
      ],
    },
  }
  const interrupted = new WorkspaceStore(f.root, async (phase) => {
    if (phase === 'design-saved') throw new Error('injected design crash')
  })
  await assert.rejects(applyDesign(interrupted, f.treeId, input), /injected/)
  const current = await f.store.snapshot()
  assert.notEqual(current.trees[0].revision, revision)
  assert.equal((await applyDesign(f.store, f.treeId, input)).revision, current.trees[0].revision)
})
test('contextual chat survives rename/reopen and writes only through common draft', async (t) => {
  const f = await fixture(t),
    c = await chatFixture(t, f)
  const conversation = await c.manager.newConversation(c.project, f.target)
  assert.equal(await c.manager.newConversation(c.project, f.target), conversation)
  const model = (await f.store.snapshot()).trees[0]
  const entities = model.entities.map((e) =>
    e.id === f.target ? { ...e, label: 'Renamed page' } : e,
  )
  await f.store.apply(f.treeId, {
    id: randomUUID(),
    revision,
    origin: 'inspector',
    targets: [f.target],
    edits: [],
    entities,
  })
  assert.equal(await c.manager.newConversation(c.project, f.target), conversation)
  await c.manager.send(c.project, {
    conversation,
    text: 'Change the selected page',
    requestId: randomUUID(),
  })
  const turn = c.manager.turn
  const sent = c.manager.provider.calls.find((call) => call.method === 'turn/start').params.input[0]
    .text
  assert.ok(sent.includes('Renamed page'))
  const result = c.manager.tool({
    threadId: turn.row.nativeId,
    turnId: turn.id,
    tool: 'loomata_propose_write',
    arguments: { file: 'page.txt', text: 'modified in draft', reason: 'Synthetic' },
  })
  while (!c.manager.approvals.size) await new Promise((r) => setTimeout(r, 5))
  const approval = [...c.manager.approvals.values()][0]
  await c.manager.approve(c.project, { id: approval.id, decision: 'approve' })
  await result
  assert.equal(await fs.readFile(path.join(f.root, 'page.txt'), 'utf8'), 'original')
  assert.equal(
    await fs.readFile(path.join(f.store.treeRoot(f.treeId), 'page.txt'), 'utf8'),
    'modified in draft',
  )
  await c.manager.interrupt(c.project)
  await c.manager.close()
  const reopened = await ChatManager.open(c.options),
    project = await reopened.register(f.root)
  f.disposers.push(() => reopened.close())
  assert.equal(await reopened.newConversation(project, f.target), conversation)
  assert.equal(reopened.turn, null)
})

test('an inspector revision invalidates a pending Codex approval without a second write', async (t) => {
  const f = await fixture(t),
    c = await chatFixture(t, f)
  const conversation = await c.manager.newConversation(c.project)
  await c.manager.send(c.project, {
    conversation,
    text: 'Synthetic change',
    requestId: randomUUID(),
  })
  const turn = c.manager.turn
  const pending = c.manager.tool({
    threadId: turn.row.nativeId,
    turnId: turn.id,
    tool: 'loomata_propose_write',
    arguments: { file: 'page.txt', text: 'obsolete', reason: 'Synthetic' },
  })
  while (!c.manager.approvals.size) await new Promise((r) => setTimeout(r, 5))
  const approval = [...c.manager.approvals.values()][0]
  await f.store.apply(f.treeId, {
    id: randomUUID(),
    revision,
    origin: 'inspector',
    targets: [f.target],
    edits: [{ file: 'page.txt', before: 'original', after: 'inspector result' }],
  })
  await assert.rejects(
    c.manager.approve(c.project, { id: approval.id, decision: 'approve' }),
    /revision-conflict/,
  )
  assert.equal((await pending).success, false)
  assert.equal(
    await fs.readFile(path.join(f.store.treeRoot(f.treeId), 'page.txt'), 'utf8'),
    'inspector result',
  )
})

test('existing inspector uses a common revision while retaining the owned specialized writer', async (t) => {
  const { createStore } = await import('../scripts/design-editor/store.mjs')
  const { coordinateEditor } = await import('../scripts/core/workspace-editor.mjs')
  const f = await fixture(t, true)
  await designSnapshot(f.store, f.treeId)
  const writer = await createStore(f.store.treeRoot(f.treeId))
  f.disposers.push(() => writer.close())
  const editor = await coordinateEditor(f.store.treeRoot(f.treeId), writer)
  const snapshot = await editor.snapshot(),
    id = randomUUID()
  const request = {
    protocolVersion: 4,
    requestId: id,
    baseRevision: snapshot.revision,
    operations: [
      {
        kind: 'set-component-token',
        target: 'component.button.default.root.background.default',
        value: '#123456',
      },
    ],
  }
  const result = await editor.save(request)
  assert.equal(result.status, 'saved')
  assert.notEqual((await f.store.state()).trees[0].model.revision, revision)
  assert.equal((await editor.status(id)).status, 'saved')
  const old = await editor.snapshot()
  const current = (await f.store.state()).trees[0].model.revision
  await f.store.apply(f.treeId, {
    id: randomUUID(),
    revision: current,
    origin: 'codex',
    targets: [f.target],
    edits: [{ file: 'page.txt', before: 'original', after: 'external inspector concurrency' }],
  })
  assert.equal(
    (await editor.save({ ...request, requestId: randomUUID(), baseRevision: old.revision })).status,
    'conflict',
  )
})
