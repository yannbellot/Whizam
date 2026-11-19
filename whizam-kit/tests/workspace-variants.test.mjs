import test from 'node:test'
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { fixture } from './helpers/workspace.mjs'
import {
  applyDesign as rawApplyDesign,
  chatDesignAuthority,
  designSnapshot,
  undoDesign,
} from '../scripts/core/workspace-design.ts'
import { WorkspaceStore } from '../scripts/core/workspace.ts'
import { loadVariantDefinitions } from '../scripts/variant-recipes.mjs'
import { createStore } from '../scripts/design-editor/store.mjs'
// These transaction fixtures represent admission from the trusted chat adapter.
const applyDesign = (store, tree, input) => rawApplyDesign(store, tree, input, chatDesignAuthority)
const binding = 'component.button.default.root.background.default'
async function setup(t) {
  const f = await fixture(t, true),
    state = await f.store.snapshot(),
    tree = state.trees.find((x) => x.id === f.treeId)
  const definition = tree.entities.find((e) => e.kind === 'component' && e.sourceKey === 'button')
  const [pageB, a, b, marker] = Array.from({ length: 4 }, () => randomUUID())
  const entities = [
    ...tree.entities.map((e) => (e.id === f.target ? { ...e, path: '/' } : e)),
    { id: pageB, kind: 'page', path: '/two', label: 'Two', revision: tree.revision },
    ...[
      { id: a, pageId: f.target },
      { id: b, pageId: pageB },
    ].map((e) => ({
      ...e,
      kind: 'occurrence',
      label: 'Button',
      definitionId: definition.id,
      marker,
      variantId: null,
      revision: tree.revision,
    })),
  ]
  const meta = await f.store.apply(f.treeId, {
    id: randomUUID(),
    revision: tree.revision,
    origin: 'inspector',
    targets: [f.target],
    edits: [],
    entities,
  })
  const design = await designSnapshot(f.store, f.treeId),
    id = randomUUID(),
    variantId = randomUUID()
  return {
    ...f,
    a,
    b,
    variantId,
    input: {
      id,
      revision: meta.revision,
      targets: [a],
      requireSelected: true,
      assignment: { occurrenceId: a, variantId },
      request: {
        protocolVersion: 5,
        requestId: id,
        baseRevision: design.revision,
        operations: [
          {
            kind: 'put-variant',
            variant: {
              id: variantId,
              owner: 'button',
              label: 'Secondary local',
              bindings: [{ target: binding, style: 'semantic.color.secondary.background.default' }],
            },
          },
        ],
      },
    },
  }
}
test('common variant transaction assigns only one occurrence and can be undone after reopening', async (t) => {
  const f = await setup(t),
    receipt = await applyDesign(f.store, f.treeId, f.input)
  assert.ok(receipt)
  let tree = (await f.store.snapshot()).trees.find((x) => x.id === f.treeId)
  assert.equal(tree.entities.find((e) => e.id === f.a).variantId, f.variantId)
  assert.equal(tree.entities.find((e) => e.id === f.b).variantId, null)
  assert.equal((await applyDesign(f.store, f.treeId, f.input)).revision, receipt.revision)
  const reopened = new WorkspaceStore(f.root)
  await undoDesign(reopened, f.treeId, f.input.id, receipt.revision)
  tree = (await reopened.snapshot()).trees.find((x) => x.id === f.treeId)
  assert.equal(tree.entities.find((e) => e.id === f.a).variantId, null)
  assert.equal(tree.entities.find((e) => e.id === f.b).variantId, null)
  assert.equal((await loadVariantDefinitions(reopened.treeRoot(f.treeId)))[0].bindings.length, 0)
})
test('common metadata finishes an interrupted specialized variant save and stale selection is refused', async (t) => {
  const f = await setup(t)
  const interrupted = new WorkspaceStore(f.root, async (phase) => {
    if (phase === 'design-saved') throw new Error('injected common interruption')
  })
  await assert.rejects(applyDesign(interrupted, f.treeId, f.input), /injected/)
  const snapshot = await f.store.snapshot(),
    tree = snapshot.trees.find((x) => x.id === f.treeId)
  assert.equal(tree.entities.find((e) => e.id === f.a).variantId, f.variantId)
  assert.equal((await applyDesign(f.store, f.treeId, f.input)).revision, tree.revision)
  await f.store.select(null)
  const other = { ...f.input, id: randomUUID(), revision: tree.revision }
  other.request = { ...other.request, requestId: other.id }
  await assert.rejects(applyDesign(f.store, f.treeId, other), /selection-changed/)
})
test('assignment-only undo restores metadata and preserves modification history', async (t) => {
  const f = await setup(t)
  await applyDesign(f.store, f.treeId, f.input)
  const before = (await f.store.snapshot()).trees.find((x) => x.id === f.treeId)
  const id = randomUUID()
  const receipt = await f.store.apply(f.treeId, {
    id,
    revision: before.revision,
    origin: 'inspector',
    targets: [f.b],
    edits: [],
    entities: before.entities.map((e) => (e.id === f.b ? { ...e, variantId: f.variantId } : e)),
  })
  await new WorkspaceStore(f.root).undo(f.treeId, id, receipt.revision, true)
  const tree = (await f.store.snapshot()).trees.find((x) => x.id === f.treeId)
  assert.equal(tree.entities.find((e) => e.id === f.a).variantId, f.variantId)
  assert.equal(tree.entities.find((e) => e.id === f.b).variantId, null)
  assert.ok(tree.entities.some((e) => e.id === id && e.kind === 'modification'))
  assert.ok(tree.entities.some((e) => e.id === f.input.id && e.kind === 'modification'))
})
test('a competing raw DS mutation prevents undo from absorbing unrecognized source changes', async (t) => {
  const f = await setup(t),
    receipt = await applyDesign(f.store, f.treeId, f.input)
  const writer = await createStore(f.store.treeRoot(f.treeId))
  try {
    const base = await writer.snapshot()
    const result = await writer.saveVariant({
      ...f.input.request,
      requestId: randomUUID(),
      baseRevision: base.revision,
      operations: [
        {
          kind: 'put-variant',
          variant: { ...f.input.request.operations[0].variant, label: 'Concurrent raw recipe' },
        },
      ],
    })
    assert.equal(result.status, 'saved')
  } finally {
    await writer.close()
  }
  await assert.rejects(undoDesign(f.store, f.treeId, f.input.id, receipt.revision), /undo-conflict/)
  assert.equal(
    (await loadVariantDefinitions(f.store.treeRoot(f.treeId)))[0].label,
    'Concurrent raw recipe',
  )
})

test('ordinary clients cannot create variants without chat admission', async (t) => {
  const f = await setup(t)
  await assert.rejects(rawApplyDesign(f.store, f.treeId, f.input), /chat-creation-required/)
})
