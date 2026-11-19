import { chatDesignAuthority } from '../scripts/core/workspace-design.ts'
import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fixture } from './helpers/workspace.mjs'
import { createStore } from '../scripts/design-editor/store.mjs'
import { designSnapshot, undoDesign } from '../scripts/core/workspace-design.ts'
import { workspaceFigmaImport as rawFigmaImport } from '../scripts/core/workspace-figma-import.mjs'
import { normalizeFigmaFile } from '../scripts/core/figma-file-client.ts'
import { readTokens } from '../scripts/dtcg-tokens.mjs'
// Compiler/transaction fixtures exercise the chat-authorized import path.
const workspaceFigmaImport = (root, writer, input) =>
  rawFigmaImport(root, writer, input, chatDesignAuthority)

const source = () =>
  normalizeFigmaFile(
    {
      name: 'Synthetic',
      version: '1',
      document: {
        id: '0:0',
        name: 'Document',
        type: 'DOCUMENT',
        children: [
          {
            id: '1:0',
            name: 'Page',
            type: 'CANVAS',
            children: [
              {
                id: '2:0',
                name: 'Action',
                type: 'COMPONENT',
                layoutMode: 'HORIZONTAL',
                paddingLeft: 8,
                paddingRight: 8,
                fills: [{ type: 'SOLID', color: { r: 0.2, g: 0.3, b: 0.4 } }],
                absoluteBoundingBox: { x: 100, y: 200, width: 120, height: 40 },
                children: [{ id: '3:0', type: 'TEXT', name: 'Label', characters: 'Action' }],
              },
            ],
          },
        ],
      },
    },
    'SyntheticFigmaFile123',
  )
test('prepare does not mutate product; cancellation is targeted; acceptance uses specialized writer and survives restart', async (t) => {
  const f = await fixture(t, true),
    root = f.store.treeRoot(f.treeId)
  await designSnapshot(f.store, f.treeId)
  const writer = await createStore(root)
  t.after(() => writer.close())
  const call = (input) => workspaceFigmaImport(root, writer, input)
  await fs.mkdir(path.join(root, '.runtime.local/figma'), { recursive: true, mode: 0o700 })
  await fs.writeFile(
    path.join(root, '.runtime.local/figma/file.json'),
    JSON.stringify({ readAt: 'now', file: source() }),
  )
  const tokens = path.join(root, 'src/design-system/authority/tokens.tokens.json')
  const before = await fs.readFile(tokens)
  const snapshot = () =>
    f.store.snapshot().then((s) => s.trees.find((tree) => tree.id === f.treeId))
  const revision = (await snapshot()).revision
  const input = {
    kind: 'import-prepare',
    fileKey: 'SyntheticFigmaFile123',
    revision,
    nodeId: '2:0',
    version: '1',
    role: 'action',
  }
  await assert.rejects(call({ ...input, fileKey: 'OtherSyntheticFile123' }), /source-stale/)
  const first = await call(input)
  assert.ok(first.proposal.css.includes('background-color: var('))
  assert.deepEqual(await fs.readFile(tokens), before)
  await assert.rejects(call(input), /proposal-exists/)
  await call({ kind: 'import-cancel', id: first.proposal.id })
  assert.deepEqual(await fs.readFile(tokens), before)
  const prepared = await call(input)
  const cacheFile = path.join(root, '.runtime.local/figma/file.json')
  await fs.writeFile(
    cacheFile,
    JSON.stringify({ file: { ...source(), fileKey: 'OtherSyntheticFile123' } }),
  )
  await assert.rejects(
    call({ kind: 'import-accept', id: prepared.proposal.id, revision }),
    /source-stale/,
  )
  assert.deepEqual(await fs.readFile(tokens), before)
  await fs.writeFile(cacheFile, JSON.stringify({ file: source() }))
  await assert.rejects(
    rawFigmaImport(root, writer, { kind: 'import-accept', id: prepared.proposal.id, revision }),
    /chat-creation-required/,
  )
  await assert.rejects(
    rawFigmaImport(
      root,
      writer,
      { kind: 'import-accept', id: prepared.proposal.id, revision },
      chatDesignAuthority,
      undefined,
      '0'.repeat(64),
    ),
    /chat-proposal-stale/,
  )
  const accepted = await call({ kind: 'import-accept', id: prepared.proposal.id, revision })
  assert.equal(accepted.accepted, true)
  const registry = JSON.parse(await fs.readFile(path.join(root, 'app/loomata-imports.json')))
  assert.equal(registry.definitions.length, 1)
  const parsed = readTokens(JSON.parse(await fs.readFile(tokens)))
  assert.ok(parsed.entries.some((e) => e.id.startsWith('component.composition.imported.')))
  const status = await call({ kind: 'import-status' })
  assert.equal(status.registry.definitions.length, 1)
  assert.equal(status.proposal, null)
  const { exportSources } = await import('../scripts/core/exports.mjs')
  const { execFileSync } = await import('node:child_process')
  const exportParent = path.resolve(import.meta.dirname, '../../.local/figma-import-02')
  await fs.mkdir(exportParent, { recursive: true })
  const exported = await fs.mkdtemp(path.join(exportParent, 'export-'))
  t.after(() => fs.rm(exported, { recursive: true, force: true }))
  const archive = await exportSources('project.export', {
    root,
    source: path.resolve(import.meta.dirname, '..'),
    options: { destination: path.join(exported, 'Imported.zip') },
  })
  const files = execFileSync('/usr/bin/unzip', ['-Z1', archive.destination], { encoding: 'utf8' })
  assert.ok(files.includes('app/loomata-imports.json') && files.includes('app/loomata-imports.css'))
  assert.ok(!files.includes('.runtime.local') && !files.includes('connection.json'))
  assert.ok(
    (await snapshot()).entities.some(
      (e) => e.kind === 'component' && e.sourceKey.startsWith('import-'),
    ),
  )
  // Reimport reuses the same source identity and does not duplicate its definition.
  const beforeReimport = (await snapshot()).revision
  const again = await call({ ...input, revision: beforeReimport })
  assert.equal(again.reused, true)
  assert.equal((await snapshot()).revision, beforeReimport)
  // Incompatible replacement is refused before touching the original action.
  const existing = (await snapshot()).entities.find(
    (e) => e.kind === 'component' && e.sourceKey.startsWith('import-'),
  )
  await assert.rejects(
    call({
      ...input,
      revision: (await snapshot()).revision,
      role: 'input',
      replaceId: existing.id,
    }),
    /functional-incompatible/,
  )
  assert.equal(
    JSON.parse(await fs.readFile(path.join(root, 'app/loomata-imports.json'))).definitions[0].role,
    'action',
  )
  f.store.designWriter = { ...writer, close: async () => {} }
  const current = await snapshot()
  await undoDesign(f.store, f.treeId, prepared.proposal.id, current.revision, true)
  assert.deepEqual(JSON.parse(await fs.readFile(path.join(root, 'app/loomata-imports.json'))), {
    version: 1,
    redirects: {},
    overrides: [],
    definitions: [],
  })
  assert.ok(
    !(await snapshot()).entities.some(
      (e) => e.kind === 'component' && e.sourceKey.startsWith('import-'),
    ),
  )
})

test('interruption after the specialized save is recovered into one coherent common receipt', async (t) => {
  const f = await fixture(t, true),
    root = f.store.treeRoot(f.treeId)
  await designSnapshot(f.store, f.treeId)
  const writer = await createStore(root)
  t.after(() => writer.close())
  f.store.designWriter = { ...writer, close: async () => {} }
  await fs.mkdir(path.join(root, '.runtime.local/figma'), { recursive: true, mode: 0o700 })
  await fs.writeFile(
    path.join(root, '.runtime.local/figma/file.json'),
    JSON.stringify({ readAt: 'now', file: source() }),
  )
  const before = (await f.store.snapshot()).trees.find((tree) => tree.id === f.treeId)
  const p = (
    await workspaceFigmaImport(root, writer, {
      kind: 'import-prepare',
      fileKey: 'SyntheticFigmaFile123',
      revision: before.revision,
      nodeId: '2:0',
      version: '1',
      role: 'action',
    })
  ).proposal
  const { applyDesign } = await import('../scripts/core/workspace-design.ts')
  f.store.fault = async (phase) => {
    if (phase === 'design-saved') throw new Error('synthetic-interruption')
  }
  await assert.rejects(
    applyDesign(
      f.store,
      f.treeId,
      {
        id: p.id,
        revision: p.revision,
        targets: p.targets,
        registration: p.registration,
        requireSelected: true,
        request: {
          protocolVersion: 6,
          requestId: p.id,
          baseRevision: p.designRevision,
          registry: p.registry,
        },
      },
      chatDesignAuthority,
    ),
    /synthetic-interruption/,
  )
  f.store.fault = async () => {}
  const recovered = (await f.store.snapshot()).trees.find((tree) => tree.id === f.treeId)
  assert.ok(
    recovered.entities.some((e) => e.kind === 'component' && e.sourceKey.startsWith('import-')),
  )
  const next = (await f.store.snapshot()).trees.find((tree) => tree.id === f.treeId)
  assert.equal(next.revision, recovered.revision)
  assert.equal(
    JSON.parse(await fs.readFile(path.join(root, 'app/loomata-imports.json'))).definitions.length,
    1,
  )
  // Replaying the browser's accept after a lost response acknowledges, never applies twice.
  const retry = await workspaceFigmaImport(root, writer, {
    kind: 'import-accept',
    id: p.id,
    revision: p.revision,
  })
  assert.equal(retry.repeated, true)
  assert.equal(
    (await f.store.snapshot()).trees.find((tree) => tree.id === f.treeId).revision,
    recovered.revision,
  )
})

test('ordinary code writers cannot alter the imported authority or bypass the specialized path', async (t) => {
  const f = await fixture(t, true)
  const current = (await f.store.snapshot()).trees.find((tree) => tree.id === f.treeId)
  await assert.rejects(
    f.store.apply(f.treeId, {
      id: crypto.randomUUID(),
      revision: current.revision,
      origin: 'codex',
      targets: [f.target],
      edits: [
        {
          file: 'app/loomata-imports.json',
          before: await f.store.read('app/loomata-imports.json', f.store.treeRoot(f.treeId)),
          after: '{"version":1,"definitions":[]}',
        },
      ],
    }),
    /chat-writer-protected/,
  )
})

test('variant sets import shared nested components once, and structural replacement requires explicit acknowledgement', async (t) => {
  const n = (id, type, children = [], extra = {}) => ({ id, type, name: id, children, ...extra })
  const paint = { fills: [{ type: 'SOLID', color: { r: 0.2, g: 0.3, b: 0.4 } }] }
  const instance = (id) => n(id, 'INSTANCE', [], { ...paint, componentId: '4:0' })
  const data = {
    name: 'Nested',
    version: '1',
    document: n('0:0', 'DOCUMENT', [
      n('1:0', 'CANVAS', [
        n('2:0', 'COMPONENT_SET', [
          n('2:1', 'COMPONENT', [instance('I2:1;4:0')], { layoutMode: 'HORIZONTAL' }),
          n('2:2', 'COMPONENT', [instance('I2:2;4:0')], { layoutMode: 'HORIZONTAL' }),
        ]),
        n('4:0', 'COMPONENT', [], paint),
        n('5:0', 'COMPONENT', [instance('I5:0;4:0')], { layoutMode: 'HORIZONTAL' }),
      ]),
    ]),
  }
  const f = await fixture(t, true),
    root = f.store.treeRoot(f.treeId)
  await designSnapshot(f.store, f.treeId)
  const writer = await createStore(root)
  t.after(() => writer.close())
  const call = (input) => workspaceFigmaImport(root, writer, input)
  const cache = path.join(root, '.runtime.local/figma/file.json')
  await fs.mkdir(path.dirname(cache), { recursive: true, mode: 0o700 })
  const update = () =>
    fs.writeFile(
      cache,
      JSON.stringify({ readAt: 'now', file: normalizeFigmaFile(data, 'SyntheticFigmaFile123') }),
    )
  await update()
  const view = () => f.store.snapshot().then((s) => s.trees.find((tree) => tree.id === f.treeId))
  const prepare = async (nodeId, extra = {}) =>
    (
      await call({
        kind: 'import-prepare',
        fileKey: 'SyntheticFigmaFile123',
        revision: (await view()).revision,
        nodeId,
        version: data.version,
        role: 'action',
        ...extra,
      })
    ).proposal
  const first = await prepare('2:1')
  assert.equal(first.registry.definitions.length, 2)
  assert.equal(first.registry.definitions.find((d) => d.nodeId === '2:0').variants.length, 2)
  await call({
    kind: 'import-adjust',
    id: first.id,
    definitionId: first.definitionId,
    nodeId: '2:1',
    property: 'width',
    value: 140,
  })
  await call({ kind: 'import-accept', id: first.id, revision: first.revision })
  const reused = await call({
    kind: 'import-prepare',
    fileKey: 'SyntheticFigmaFile123',
    revision: (await view()).revision,
    nodeId: '2:1',
    version: '1',
    role: 'action',
  })
  assert.equal(reused.reused, true)
  assert.equal(
    (await call({ kind: 'import-status' })).registry.definitions
      .find((d) => d.id === first.definitionId)
      .nodes.find((n) => n.id === '2:1').values.bounds.width,
    140,
  )
  const second = await prepare('5:0')
  assert.equal(second.registry.definitions.length, 3)
  assert.equal(second.registry.definitions.filter((d) => d.nodeId === '4:0').length, 1)
  await call({ kind: 'import-accept', id: second.id, revision: second.revision })
  const sourceDefinition = (await call({ kind: 'import-status' })).registry.definitions.find(
    (d) => d.nodeId === '2:0',
  )
  const target = (await view()).entities.find(
    (e) => e.kind === 'component' && e.sourceKey === 'import-' + sourceDefinition.id,
  )
  data.version = '2'
  data.document.children[0].children[0].children[0].children.push(
    n('6:0', 'TEXT', [], { characters: 'Nouveau texte' }),
  )
  await update()
  const changed = await prepare('2:1', { replaceId: target.id })
  assert.equal(changed.comparison.structural, true)
  assert.equal(changed.comparison.localAdaptation, true)
  await assert.rejects(
    call({ kind: 'import-accept', id: changed.id, revision: changed.revision }),
    /structure-confirmation-required/,
  )
  assert.equal((await view()).revision, changed.revision)
  await call({
    kind: 'import-accept',
    id: changed.id,
    revision: changed.revision,
    acknowledgeStructure: true,
  })
  assert.notEqual((await view()).revision, changed.revision)
})

test('occurrence and variant replacements retain shared source and reuse an already imported target', async (t) => {
  const n = (id, type, children = [], extra = {}) => ({ id, type, name: id, children, ...extra })
  const data = {
    name: 'Scopes',
    version: '1',
    document: n('0:0', 'DOCUMENT', [
      n('1:0', 'CANVAS', [
        n('2:0', 'COMPONENT_SET', [n('2:1', 'COMPONENT'), n('2:2', 'COMPONENT')]),
        n('3:0', 'COMPONENT'),
      ]),
    ]),
  }
  const f = await fixture(t, true),
    root = f.store.treeRoot(f.treeId)
  await designSnapshot(f.store, f.treeId)
  const writer = await createStore(root)
  t.after(() => writer.close())
  const call = (input) => workspaceFigmaImport(root, writer, input)
  await fs.mkdir(path.join(root, '.runtime.local/figma'), { recursive: true, mode: 0o700 })
  await fs.writeFile(
    path.join(root, '.runtime.local/figma/file.json'),
    JSON.stringify({ file: normalizeFigmaFile(data, 'SyntheticFigmaFile123') }),
  )
  const view = () => f.store.snapshot().then((s) => s.trees.find((tree) => tree.id === f.treeId))
  const prepare = async (nodeId, extra = {}) =>
    call({
      kind: 'import-prepare',
      fileKey: 'SyntheticFigmaFile123',
      revision: (await view()).revision,
      nodeId,
      version: '1',
      role: 'action',
      ...extra,
    })
  const accept = (p) =>
    call({ kind: 'import-accept', id: p.id, revision: p.revision, acknowledgeStructure: true })
  const original = (await prepare('2:0')).proposal
  await accept(original)
  const replacement = (await prepare('3:0')).proposal
  await accept(replacement)
  const state = await view()
  const owner = state.entities.find(
    (e) => e.kind === 'component' && e.sourceKey === 'import-' + original.definitionId,
  )
  const variant = state.entities.find((e) => e.kind === 'variant' && e.definitionId === owner.id)
  const occurrenceId = crypto.randomUUID(),
    marker = crypto.randomUUID()
  await f.store.apply(f.treeId, {
    id: crypto.randomUUID(),
    revision: state.revision,
    origin: 'inspector',
    targets: [f.target],
    edits: [],
    entities: [
      ...state.entities,
      {
        id: occurrenceId,
        kind: 'occurrence',
        definitionId: owner.id,
        pageId: f.target,
        marker,
        variantId: null,
        revision: state.revision,
        label: 'Known usage',
      },
    ],
  })
  await call({
    kind: 'import-assign-variant',
    revision: (await view()).revision,
    occurrenceId,
    variantId: variant.id,
  })
  assert.equal((await view()).entities.find((e) => e.id === occurrenceId).variantId, variant.id)
  await assert.rejects(
    call({
      kind: 'import-assign-variant',
      revision: (await view()).revision,
      occurrenceId,
      variantId: crypto.randomUUID(),
    }),
    /scope-unverified/,
  )
  const local = (await prepare('3:0', { replaceId: occurrenceId, scope: 'occurrence' })).proposal
  assert.equal(local.registry.definitions.length, 2)
  assert.deepEqual(local.registry.redirects, {})
  assert.equal(local.registry.overrides[0].marker, marker)
  assert.equal(local.registry.overrides[0].occurrenceId, occurrenceId)
  await accept(local)
  const byVariant = (await prepare('3:0', { replaceId: occurrenceId, scope: 'variant' })).proposal
  assert.equal(byVariant.registry.definitions.length, 2)
  assert.equal(byVariant.registry.overrides[1].variantId, variant.id)
  await accept(byVariant)
  // A global replacement cannot silently lose a live variant assignment.
  await assert.rejects(prepare('3:0', { replaceId: owner.id }), /scope-unverified/)
  await call({
    kind: 'import-assign-variant',
    revision: (await view()).revision,
    occurrenceId,
    variantId: null,
  })
  const global = (await prepare('3:0', { replaceId: owner.id })).proposal
  assert.equal(global.registry.definitions.length, 2)
  assert.equal(global.registry.redirects[original.definitionId], replacement.definitionId)
  await accept(global)
  assert.equal((await call({ kind: 'import-status' })).registry.definitions.length, 2)
})

test('source file identities prevent collisions and invalid graphs cannot be published', async (t) => {
  const { compileImportedComponents } = await import('../scripts/imported-components.mjs')
  const { importedRegistrySchema } = await import('../src/core/imported-components.ts')
  const doc = JSON.parse(
    await fs.readFile(
      new URL('../src/design-system/authority/tokens.tokens.json', import.meta.url),
    ),
  )
  const file = source(),
    node = file.nodes.find((n) => n.id === '2:0')
  const def = {
    id: 'a'.repeat(24),
    label: 'A',
    role: 'action',
    fileKey: file.fileKey,
    nodeId: node.id,
    rootId: node.id,
    sourceHash: node.contentHash,
    variants: [],
    nodes: file.nodes.filter((n) => ['2:0', '3:0'].includes(n.id)),
  }
  const registry = importedRegistrySchema.parse({
    version: 1,
    definitions: [def, { ...def, id: 'b'.repeat(24), fileKey: 'OtherSyntheticFile123' }],
  })
  assert.equal(compileImportedComponents(doc, registry).registry.definitions.length, 2)
  registry.redirects[def.id] = 'b'.repeat(24)
  registry.redirects['b'.repeat(24)] = def.id
  assert.throws(() => compileImportedComponents(doc, registry), /component-cycle/)
  const parentNode = {
    ...def.nodes[0],
    children: ['I2:0;4:0'],
    values: { layoutMode: 'HORIZONTAL' },
  }
  const childNode = { ...def.nodes[0], id: '4:0', children: [], values: {}, parentId: null }
  const instance = {
    ...childNode,
    id: 'I2:0;4:0',
    parentId: '2:0',
    type: 'INSTANCE',
    componentId: '4:0',
  }
  const nested = importedRegistrySchema.parse({
    version: 1,
    definitions: [
      { ...def, nodes: [parentNode, instance], dependencies: { '4:0': 'b'.repeat(24) } },
      { ...def, id: 'b'.repeat(24), nodeId: '4:0', rootId: '4:0', nodes: [childNode] },
    ],
  })
  assert.throws(() => compileImportedComponents(doc, nested), /node-unsupported/)
  nested.definitions[1].role = 'container'
  assert.equal(compileImportedComponents(doc, nested).registry.definitions.length, 2)
  nested.definitions[0].nodes[1].values = {
    ...nested.definitions[0].nodes[1].values,
    bounds: { width: 20, height: 20 },
  }
  assert.throws(() => compileImportedComponents(doc, nested), /instance-adaptation-required/)
  t.assert.ok(true)
})

test('unsupported imports can be planned with raw source context without applying or starting Codex', async (t) => {
  const f = await fixture(t, true),
    root = f.store.treeRoot(f.treeId)
  await designSnapshot(f.store, f.treeId)
  const writer = await createStore(root)
  t.after(() => writer.close())
  const file = source()
  file.nodes.find((n) => n.id === '2:0').values.effects = [{ type: 'LAYER_BLUR', radius: 12 }]
  await fs.mkdir(path.join(root, '.runtime.local/figma'), { recursive: true, mode: 0o700 })
  await fs.writeFile(path.join(root, '.runtime.local/figma/file.json'), JSON.stringify({ file }))
  const view = (await f.store.snapshot()).trees.find((tree) => tree.id === f.treeId)
  const input = {
    fileKey: file.fileKey,
    revision: view.revision,
    nodeId: '2:0',
    version: '1',
    role: 'action',
  }
  await assert.rejects(
    workspaceFigmaImport(root, writer, { ...input, kind: 'import-prepare' }),
    /effects-unsupported/,
  )
  const result = await workspaceFigmaImport(root, writer, { ...input, kind: 'import-plan' })
  assert.equal(result.planned, true)
  const current = (await f.store.snapshot()).trees.find((tree) => tree.id === f.treeId)
  const request = current.entities.find((e) => e.id === result.requestId)
  assert.equal(request.kind, 'request')
  assert.ok(!current.entities.some((e) => e.kind === 'workItem'))
  assert.equal(
    (await workspaceFigmaImport(root, writer, { kind: 'import-status' })).registry.definitions
      .length,
    0,
  )
  const context = JSON.parse(await fs.readFile(path.join(root, request.files[0])))
  assert.equal(context.source.fileKey, file.fileKey)
  assert.equal(context.nodes.find((n) => n.id === '2:0').values.effects[0].radius, 12)
})
