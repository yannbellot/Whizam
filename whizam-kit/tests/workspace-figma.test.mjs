import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { WorkspaceStore } from '../scripts/core/workspace.ts'
import { fixture } from './helpers/workspace.mjs'
import { createStore } from '../scripts/design-editor/store.mjs'
import { applyDesign, designSnapshot } from '../scripts/core/workspace-design.ts'
import { workspaceFigma } from '../scripts/core/workspace-figma.ts'
import { normalizeFigma, readFigma } from '../scripts/core/figma-client.ts'
import { parseFigmaLink, compareFigma } from '../src/core/figma-reference.ts'
const fileKey = 'SyntheticFigmaFile123',
  nodeId = '10:1'
const raw = (name = 'Button', color = { r: 0.2, g: 0.3, b: 0.4 }) => ({
  version: 'synthetic-v1',
  nodes: {
    [nodeId]: {
      document: {
        id: nodeId,
        name,
        type: 'COMPONENT',
        absoluteBoundingBox: { width: 100, height: 40 },
        fills: [{ type: 'SOLID', color }],
        children: [{ id: '10:2', name: 'Label', type: 'TEXT' }],
      },
    },
  },
})
test('bounded Figma normalization distinguishes rename, change and incomplete selection without inferred deletion', () => {
  const propertiesRaw = raw()
  propertiesRaw.nodes[nodeId].document.componentPropertyDefinitions = {
    Size: { type: 'VARIANT', defaultValue: 'Small', variantOptions: ['Small', 'Large'] },
  }
  propertiesRaw.nodes[nodeId].document.componentProperties = {
    Icon: { type: 'BOOLEAN', value: false },
  }
  const properties = normalizeFigma(propertiesRaw, fileKey, nodeId).nodes[0].properties
  assert.ok(
    properties.some((p) => p.name === 'Definition: Size' && p.value.includes('Small | Large')),
  )
  assert.ok(properties.some((p) => p.name === 'Icon' && p.value === 'false'))
  const original = normalizeFigma(raw(), fileKey, nodeId),
    renamed = normalizeFigma(raw('Renamed'), fileKey, nodeId)
  assert.equal(compareFigma(original, renamed)[0].state, 'renamed')
  assert.equal(original.nodes[0].visualHash, renamed.nodes[0].visualHash)
  const missing = raw()
  missing.nodes[nodeId].document.children = []
  assert.equal(compareFigma(original, normalizeFigma(missing, fileKey, nodeId)).length, 1)
  const duplicate = raw()
  duplicate.nodes[nodeId].document.children.push({ id: nodeId, name: 'Duplicate', type: 'FRAME' })
  assert.throws(() => normalizeFigma(duplicate, fileKey, nodeId), /ambiguous/)
})
test('direct reader uses one fixed HTTPS host, refuses bad keys, denied responses and oversized streams', async () => {
  let calls = 0
  await readFigma('synthetic', fileKey, nodeId, async (url, options) => {
    calls++
    assert.equal(url.origin, 'https://api.figma.com')
    assert.equal(options.redirect, 'error')
    assert.equal(options.headers['X-Figma-Token'], 'synthetic')
    return Response.json(raw())
  })
  assert.equal(calls, 1)
  await assert.rejects(readFigma('synthetic', '../bad', nodeId), /link-invalid/)
  await assert.rejects(
    readFigma('synthetic', fileKey, nodeId, async () => new Response('', { status: 403 })),
    /access-denied/,
  )
  await assert.rejects(
    readFigma(
      'synthetic',
      fileKey,
      nodeId,
      async () => new Response(new Uint8Array(17 * 1024 * 1024)),
    ),
    /response-budget/,
  )
})
test('direct import, four durable decisions, no-op reimport and stale concurrent decision share the common engine', async (t) => {
  const f = await fixture(t, true),
    root = f.store.treeRoot(f.treeId)
  await designSnapshot(f.store, f.treeId)
  const writer = await createStore(root)
  t.after(() => writer.close())
  let data = raw()
  const mock = async () => Response.json(data),
    call = (input) => workspaceFigma(root, writer, input, mock)
  assert.equal((await call({ kind: 'status' })).connected, false)
  await call({ kind: 'connect', token: 'synthetic-figma-token-123456', fileKey, nodeId })
  assert.equal((await call({ kind: 'status' })).connected, true)
  const view = async () => (await f.store.snapshot()).trees.find((t) => t.id === f.treeId)
  let current = await view()
  await call({ kind: 'import', fileKey, nodeId, revision: current.revision })
  current = await view()
  let reference = current.entities.find((e) => e.kind === 'figmaReference')
  assert.ok(reference)
  assert.equal(reference.source.nodes.length, 2)
  assert.ok(!JSON.stringify(current.entities).includes('synthetic-figma-token'))
  const revision = current.revision
  assert.deepEqual(await call({ kind: 'import', fileKey, nodeId, revision }), { unchanged: true })
  assert.equal((await view()).revision, revision)
  const target = current.entities.find(
    (e) => e.kind === 'token' && e.sourceKey === 'component.button.default.root.background.default',
  )
  assert.ok(target)
  const tokens = path.join(root, 'src/design-system/authority/tokens.tokens.json'),
    before = await fs.readFile(tokens)
  for (const outcome of ['keep', 'defer', 'adopt', 'combine']) {
    current = await view()
    reference = current.entities.find((e) => e.kind === 'figmaReference')
    await call({
      kind: 'decide',
      revision: current.revision,
      referenceId: reference.id,
      nodeId,
      sourceHash: reference.source.contentHash,
      targets: [target.id],
      outcome,
      rationale: 'Décision synthétique ' + outcome,
      bindingId: target.sourceKey,
    })
    if (['keep', 'defer'].includes(outcome)) assert.ok((await fs.readFile(tokens)).equals(before))
  }
  current = await view()
  assert.equal(current.entities.filter((e) => e.kind === 'decision').length, 4)
  assert.equal(current.entities.find((e) => e.kind === 'figmaMapping').outcome, 'combine')
  assert.equal((await call({ kind: 'status' })).comparisons[0].status, 'unchanged')
  const priorDecision = current.entities.find((e) => e.kind === 'decision')
  assert.equal(priorDecision.source.version, 'synthetic-v1')
  assert.equal(priorDecision.source.node.id, nodeId)
  f.store.designWriter = { ...writer, close: async () => {} }
  const localId = crypto.randomUUID(),
    design = await writer.snapshot()
  await applyDesign(f.store, f.treeId, {
    id: localId,
    revision: current.revision,
    targets: [target.id],
    requireSelected: true,
    request: {
      protocolVersion: 4,
      requestId: localId,
      baseRevision: design.revision,
      operations: [{ kind: 'set-component-token', target: target.sourceKey, value: '#abcdef' }],
    },
  })
  assert.equal((await call({ kind: 'status' })).comparisons[0].status, 'product-changed')
  current = await view()
  data = raw('Source changed', { r: 1, g: 0, b: 0 })
  await call({ kind: 'import', fileKey, nodeId, revision: current.revision })
  assert.equal((await call({ kind: 'status' })).comparisons[0].status, 'source-and-product-changed')
  current = await view()
  assert.equal(
    current.entities.find((e) => e.id === priorDecision.id).source.node.color,
    priorDecision.source.node.color,
  )

  await assert.rejects(call({ kind: 'import', fileKey, nodeId, revision }), /revision-conflict/)
  data = raw('Renamed')
  await call({ kind: 'import', fileKey, nodeId, revision: current.revision })
  current = await view()
  assert.equal(current.entities.find((e) => e.kind === 'figmaReference').id, reference.id)
  assert.equal(current.entities.find((e) => e.kind === 'figmaMapping').referenceId, reference.id)
  await call({ kind: 'disconnect' })
  assert.equal((await call({ kind: 'status' })).connected, false)
  current = await view()
  const head = await f.store.commit(f.treeId, current.revision)
  assert.notEqual(await f.store.git(['rev-parse', 'HEAD']), head, 'Commit integrated implicitly')
  const cloneRoot = f.root + '-clone'
  t.after(() => fs.rm(cloneRoot, { recursive: true, force: true }))
  await f.store.git([
    'clone',
    '--branch',
    'loomata/' + f.treeId,
    '--single-branch',
    f.root,
    cloneRoot,
  ])
  const reconstructed = await new WorkspaceStore(cloneRoot).reconstruct()
  assert.equal(
    reconstructed.model.entities.filter(
      (e) => e.kind === 'decision' && e.source?.version === 'synthetic-v1',
    ).length,
    4,
  )
  assert.equal(
    reconstructed.model.entities.find((e) => e.kind === 'figmaMapping').referenceId,
    reference.id,
  )
  await assert.rejects(fs.access(path.join(cloneRoot, '.runtime.local/figma/connection.json')))
  await assert.rejects(fs.access(path.join(cloneRoot, '.runtime.local/agent-chat')))
})

test('pasted design selection links preserve the file and node, strip tracking and reject foreign or ambiguous targets', () => {
  assert.deepEqual(
    parseFigmaLink(
      'https://www.figma.com/design/SyntheticFigmaFile123/Example?node-id=3-5&t=tracking',
    ),
    { fileKey, nodeId: '3:5' },
  )
  for (const link of [
    'https://figma.com.evil/design/SyntheticFigmaFile123/Example?node-id=3-5',
    'https://user:password@figma.com/design/SyntheticFigmaFile123/Example?node-id=3-5',
    'https://figma.com/design/SyntheticFigmaFile123/branch/OtherBranch?node-id=3-5',
    'https://figma.com/design/SyntheticFigmaFile123/Example',
    'https://figma.com/design/SyntheticFigmaFile123/Example?node-id=3-5&node-id=4-5',
  ])
    assert.throws(() => parseFigmaLink(link))
})
