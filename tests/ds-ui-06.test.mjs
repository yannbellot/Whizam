import test from 'node:test'
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { fixture, chatFixture } from './helpers/workspace.mjs'
import { designSnapshot, applyDesign, undoDesign } from '../scripts/core/workspace-design.ts'
import { proposeDesign, applyChatDesign } from '../scripts/agent-chat/design.mjs'
import { workspaceContext } from '../scripts/agent-chat/workspace.mjs'
import { applyOperations } from '../src/design-system/editor/operations.ts'
import { WorkspaceStore } from '../scripts/core/workspace.ts'
const target = 'component.button.default.root.background.default'
const definition = {
  category: 'neutral-hierarchy',
  id: 'quiet-warning',
  label: 'Avertissement discret',
  definition: 'Surface de signalement discret',
  examples: ['Attention'],
  synonyms: ['warning-soft'],
}
async function setup(t) {
  const f = await fixture(t, true),
    chat = await chatFixture(t, f)
  const context = await workspaceContext(chat.project, null)
  return { ...f, ...chat, context }
}
test('new values allocate or reuse primitives without changing other consumers or token identities', async (t) => {
  const f = await fixture(t, true),
    { snapshot } = await designSnapshot(f.store, f.treeId)
  const model = applyOperations(snapshot, [
    { kind: 'set-component-token', target, value: '#123456' },
  ])
  const second = applyOperations({ ...snapshot, model }, [
    { kind: 'set-component-token', target, value: '#123456' },
  ])
  assert.equal(second.primitives.length, model.primitives.length)
  assert.deepEqual(
    model.bindings.filter((b) => b.id !== target),
    snapshot.model.bindings.filter((b) => b.id !== target),
  )
  assert.deepEqual(model.styles, snapshot.model.styles)
  assert.deepEqual(
    model.bindings.map((b) => b.id),
    snapshot.model.bindings.map((b) => b.id),
  )
})
test('chat creates a convention without granting it semantic eligibility; stale proposals are refused', async (t) => {
  const f = await setup(t)
  const proposal = await proposeDesign(f.context, {
    reason: 'Convention locale contrôlée',
    content: JSON.stringify({
      kind: 'tokens',
      operations: [
        {
          kind: 'define-and-assign',
          target,
          value: '#123456',
          classification: 'non-semantic',
          definition,
        },
      ],
    }),
  })
  const before = await designSnapshot(f.store, f.treeId)
  const operationId = randomUUID()
  const receipt = await applyChatDesign(f.context, proposal, operationId)
  const after = await designSnapshot(f.store, f.treeId)
  const style = after.snapshot.model.styles.find(
    (s) => s.intention === 'neutral-hierarchy.quiet-warning',
  )
  assert.equal(style.classification, 'non-semantic')
  assert.equal(style.justification, definition.definition)
  assert.deepEqual(after.snapshot.catalog, before.snapshot.catalog)
  await assert.rejects(applyChatDesign(f.context, proposal, randomUUID()), /revision-conflict/)
  await undoDesign(f.store, f.treeId, operationId, receipt.revision)
  const restored = await designSnapshot(f.store, f.treeId)
  assert.deepEqual(restored.snapshot.model.bindings, before.snapshot.model.bindings)
})
test('raw client cannot create decisions or forge chat provenance', async (t) => {
  const f = await setup(t),
    ds = await designSnapshot(f.store, f.treeId),
    id = randomUUID()
  const input = {
    id,
    revision: f.context.revision,
    targets: [f.context.entities.find((e) => e.sourceKey === target).id],
    request: {
      protocolVersion: 4,
      requestId: id,
      baseRevision: ds.revision,
      operations: [{ kind: 'define-and-assign', target, value: '#123456', definition }],
    },
  }
  await assert.rejects(applyDesign(f.store, f.treeId, input), /chat-creation-required/)
  await assert.rejects(
    applyDesign(f.store, f.treeId, input, Symbol('chat-design-authority')),
    /chat-creation-required/,
  )
})
test('an admitted chat creation recovers after interrupted common publication without another approval', async (t) => {
  const f = await setup(t)
  const proposal = await proposeDesign(f.context, {
    reason: 'Intention de test',
    content: JSON.stringify({
      kind: 'tokens',
      operations: [{ kind: 'define-and-assign', target, value: '#123456', definition }],
    }),
  })
  f.context.store = new WorkspaceStore(f.root, async (phase) => {
    if (phase === 'design-trace-published') throw new Error('synthetic-interruption')
  })
  const id = randomUUID()
  await assert.rejects(applyChatDesign(f.context, proposal, id), /synthetic-interruption/)
  const reopened = new WorkspaceStore(f.root)
  await reopened.snapshot()
  const ds = await designSnapshot(reopened, f.treeId)
  assert.equal(
    ds.snapshot.model.styles.filter((s) => s.intention === 'neutral-hierarchy.quiet-warning')
      .length,
    1,
  )
})
test('the live chat approval uses the typed DS adapter, without granting raw DS file writes', async (t) => {
  const f = await setup(t),
    manager = f.manager
  const row = await manager.newConversation(f.project)
  await manager.send(f.project, {
    conversation: row,
    text: 'Crée une convention de couleur discrète',
    requestId: randomUUID(),
  })
  const turn = manager.turn
  const pending = manager.tool({
    threadId: turn.row.nativeId,
    turnId: turn.id,
    tool: 'loomata_propose_design',
    arguments: {
      reason: 'Convention de test',
      content: JSON.stringify({
        kind: 'tokens',
        operations: [
          {
            kind: 'define-and-assign',
            target,
            value: '#234567',
            classification: 'non-semantic',
            definition,
          },
        ],
      }),
    },
  })
  for (let n = 0; n < 1500 && manager.approvals.size === 0; n++)
    await new Promise((r) => setTimeout(r, 20))
  assert.equal(manager.approvals.size, 1)
  await manager.approve(f.project, { id: [...manager.approvals.keys()][0], decision: 'approve' })
  await pending
  const ds = await designSnapshot(f.store, f.treeId)
  assert.ok(ds.snapshot.model.styles.some((s) => s.intention === 'neutral-hierarchy.quiet-warning'))
  const tree = await f.store.tree(await f.store.state(), f.treeId)
  const receipt = Object.values(tree.receipts).find((r) => r.chat?.conversationId === row)
  assert.ok(receipt, 'chat provenance survives the common receipt')
})

test('out-of-domain creation becomes a planned request without modifying tokens or launching a work item', async (t) => {
  const f = await setup(t),
    before = await designSnapshot(f.store, f.treeId)
  const proposal = await proposeDesign(f.context, {
    reason: 'Nouveau composant à concevoir',
    content: JSON.stringify({ kind: 'plan', label: 'Créer une navigation de projet' }),
  })
  const id = randomUUID()
  await applyChatDesign(f.context, proposal, id)
  const tree = await f.store.tree(await f.store.state(), f.treeId)
  assert.ok(tree.model.entities.some((e) => e.kind === 'request' && e.id === id))
  assert.ok(!tree.model.entities.some((e) => e.kind === 'workItem' && e.state === 'running'))
  const after = await designSnapshot(f.store, f.treeId)
  assert.deepEqual(after.snapshot.model, before.snapshot.model)
})
