import test from 'node:test'
import assert from 'node:assert/strict'
import {
  parseFigmaFileLink,
  figmaDependencies,
  compareFigmaImport,
} from '../src/core/figma-file.ts'
import {
  normalizeFigmaFile,
  figmaImportFingerprint,
  readFigmaFile,
} from '../scripts/core/figma-file-client.ts'
const key = 'SyntheticFile123456'
const n = (id, type, children = [], extra = {}) => ({ id, name: id, type, children, ...extra })
const raw = () => ({
  version: '1',
  name: 'Synthetic',
  document: n('0:0', 'DOCUMENT', [
    n('1:0', 'CANVAS', [
      n('2:0', 'COMPONENT_SET', [
        n('2:1', 'COMPONENT', [n('3:1', 'INSTANCE', [], { componentId: '4:1' })]),
        n('2:2', 'COMPONENT', [n('3:2', 'INSTANCE', [], { componentId: '5:1' })]),
      ]),
      n('4:0', 'COMPONENT_SET', [n('4:1', 'COMPONENT')]),
      n('5:1', 'COMPONENT'),
    ]),
  ]),
})
const normalize = (data = raw()) => normalizeFigmaFile(data, key)
const fingerprint = (data) => figmaImportFingerprint(normalize(data), '2:1').hash

test('file links accept an optional selected node and reject unsafe/ambiguous destinations', () => {
  assert.deepEqual(parseFigmaFileLink(`https://figma.com/design/${key}/Example`), {
    fileKey: key,
    nodeId: null,
  })
  assert.equal(
    parseFigmaFileLink(`https://www.figma.com/file/${key}/Example?node-id=2-1`).nodeId,
    '2:1',
  )
  for (const url of [
    `https://figma.com.evil/design/${key}`,
    `https://x:y@figma.com/design/${key}`,
    `https://figma.com/design/${key}/branch/Other`,
    `https://figma.com:444/design/${key}`,
    `https://figma.com/design/${key}?node-id=2-1&node-id=4-1`,
    `https://figma.com/design/${key}?node-id=`,
  ])
    assert.throws(() => parseFigmaFileLink(url))
})
test('dependency closure includes sibling variants and their transitive dependencies once', () => {
  const plan = figmaDependencies(normalize(), '2:1')
  assert.equal(plan.complete, true)
  assert.deepEqual(plan.definitionIds, ['2:0', '2:1', '2:2', '4:0', '4:1', '5:1'])
  assert.equal(new Set(plan.nodeIds).size, plan.nodeIds.length)
})
test('unavailable definitions remain incomplete; repeated references terminate', () => {
  const data = raw(),
    leaf = data.document.children[0].children[2]
  leaf.children.push(n('6:1', 'INSTANCE', [], { componentId: '2:1' }))
  assert.equal(figmaDependencies(normalize(data), '2:1').complete, true)
  leaf.children.push(n('6:2', 'INSTANCE', [], { componentId: '99:9' }))
  assert.deepEqual(figmaDependencies(normalize(data), '2:1').missingIds, ['99:9'])
})
test('deep traversal exceeds eight layers and rejects duplicate identities', () => {
  const data = raw()
  let parent = data.document.children[0].children[2]
  for (let i = 0; i < 80; i++) {
    const child = n(`10:${i}`, 'FRAME')
    parent.children.push(child)
    parent = child
  }
  assert.equal(normalize(data).nodes.filter((v) => v.type === 'FRAME').length, 80)
  parent.children.push(n('0:0', 'FRAME'))
  assert.throws(() => normalize(data), /ambiguous/)
})
test('fingerprints ignore variables, names and canvas placement, but detect changed dependencies', () => {
  const data = raw(),
    before = fingerprint(data),
    component = data.document.children[0].children[0].children[0]
  component.name = 'Renamed'
  component.boundVariables = { fills: { type: 'VARIABLE_ALIAS', id: 'VariableID:private' } }
  component.explicitVariableModes = { example: 'mode' }
  component.relativeTransform = [
    [1, 0, 999],
    [0, 1, 888],
  ]
  assert.equal(fingerprint(data), before)
  assert.ok(!JSON.stringify(normalize(data)).includes('VariableID'))
  data.document.children[0].children[2].fills = [
    { type: 'SOLID', color: { r: 1, g: 0, b: 0, a: 1 } },
  ]
  assert.notEqual(fingerprint(data), before)
})
test('internal geometry and child ordering affect hashes, object key order does not', () => {
  const data = raw(),
    component = data.document.children[0].children[0].children[0]
  component.fills = [{ type: 'SOLID', color: { r: 1, g: 0, b: 0 } }]
  const before = fingerprint(data)
  component.fills = [{ color: { b: 0, g: 0, r: 1 }, type: 'SOLID' }]
  assert.equal(fingerprint(data), before)
  component.children[0].relativeTransform = [
    [1, 0, 10],
    [0, 1, 20],
  ]
  assert.notEqual(fingerprint(data), before)
  const ordered = fingerprint(data)
  data.document.children[0].children[0].children.reverse()
  assert.notEqual(fingerprint(data), ordered)
})
test('comparison separates unchanged, local adaptation, source update, conflict and incomplete', () => {
  assert.equal(compareFigmaImport(false, false, true), 'unchanged')
  assert.equal(compareFigmaImport(false, true, true), 'local-adaptation')
  assert.equal(compareFigmaImport(true, false, true), 'source-changed')
  assert.equal(compareFigmaImport(true, true, true), 'conflict')
  assert.equal(compareFigmaImport(false, false, false), 'indeterminate')
})
test('reader uses fixed HTTPS host, no depth truncation/redirects, bounded streams and explicit refusal', async () => {
  const result = await readFigmaFile('synthetic', key, async (url, options) => {
    assert.equal(url.origin, 'https://api.figma.com')
    assert.equal(url.pathname, `/v1/files/${key}`)
    assert.equal(url.searchParams.has('depth'), false)
    assert.equal(url.searchParams.get('geometry'), 'paths')
    assert.equal(options.redirect, 'error')
    return Response.json(raw())
  })
  assert.equal(result.coverage, 'file-tree')
  await assert.rejects(readFigmaFile('synthetic', '../bad'), /link-invalid/)
  for (const [status, message] of [
    [403, /access-denied/],
    [429, /rate-limited/],
    [500, /read-failed/],
  ])
    await assert.rejects(
      readFigmaFile('synthetic', key, async () => new Response('', { status })),
      message,
    )
  await assert.rejects(
    readFigmaFile('synthetic', key, async () => new Response(new Uint8Array(17 * 1024 * 1024))),
    /response-budget/,
  )
})

test('invalid document or missing version is never advertised as a complete file', () => {
  const data = raw()
  data.document.type = 'FRAME'
  assert.throws(() => normalize(data), /document-required/)
  data.document.type = 'DOCUMENT'
  delete data.version
  assert.throws(() => normalize(data))
})

test('variant selection names carry semantics even though cosmetic definition names do not', () => {
  const data = raw(),
    variant = data.document.children[0].children[0].children[0]
  variant.name = 'State=Default, Size=Small'
  const before = fingerprint(data)
  variant.name = 'State=Disabled, Size=Small'
  assert.notEqual(fingerprint(data), before)
})
