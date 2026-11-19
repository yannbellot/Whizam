import { primitiveName } from '../src/design-system/editor/naming.ts'
import test from 'node:test'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import { loadCssDomains } from '../scripts/css-value-domains.mjs'
import { loadCanonicalEditorModel } from '../scripts/validate-editor-contract.mjs'
import {
  normalizeValue,
  validateEditorModel,
  validateCatalog,
} from '../src/design-system/editor/contract.ts'
const root = fileURLToPath(new URL('..', import.meta.url))
const { context, model } = await loadCanonicalEditorModel(root)
const p = context.contract.properties

test('CSS ranges preserve design freedom and reject impossible literals', () => {
  for (const [key, value] of [
    ['borderRadius', '9999px'],
    ['fontSize', '160px'],
    ['fontSize', '0px'],
    ['ringWidth', '0px'],
    ['maxWidth', '1px'],
    ['maxWidth', '9999rem'],
    ['lineHeight', 0],
    ['lineHeight', 5],
    ['fontWeight', 650.5],
    ['ringOffset', '-2rem'],
  ])
    assert.equal(normalizeValue(p[key], value, []), value)
  for (const [key, value] of [
    ['borderRadius', '-1px'],
    ['paddingBlock', '-1rem'],
    ['fontSize', '-1px'],
    ['fontWeight', 1001],
    ['fontWeight', 0],
    ['lineHeight', -1],
    ['ringOffset', '1%'],
    ['borderRadius', 'calc(1px)'],
    ['lineHeight', Infinity],
    ['borderRadius', '9'.repeat(400) + 'px'],
  ])
    assert.throws(() => normalizeValue(p[key], value, []))
})

test('canonical graph accepts new ranges without changing existing defaults', () => {
  const candidate = structuredClone(model)
  const binding = candidate.bindings.find((b) => b.property === 'borderRadius')
  const id = primitiveName('radius', '9999px')
  candidate.primitives.push({
    id,
    family: 'radius',
    type: 'dimension',
    value: '9999px',
    provenance: { kind: 'designer-edit', status: 'proposed', reason: 'Test isolé.' },
  })
  binding.reference = id
  binding.provenance = candidate.primitives.at(-1).provenance
  validateEditorModel(candidate, context.catalog, context.contract)
})

test('registry distinguishes catalogued capabilities from executable current types', async () => {
  const domains = await loadCssDomains(root)
  assert.ok(domains['css-value-types'].types.calculation)
  assert.ok(domains['css-value-types'].types.variable)
  assert.equal(domains['css-properties'].properties['box-shadow'].capability, 'catalogued')
  assert.equal(domains['css-properties'].properties['border-radius'].range.maximum, null)
  assert.equal(p.borderRadius.max, undefined)
  assert.equal(p.ringOffset.min, undefined)
})

test('large radius and signed outline offset survive save and reload; negative radius is rejected', async () => {
  const { editorFixture } = await import('./helpers/editor-fixture.mjs')
  const { createStore } = await import('../scripts/design-editor/store.mjs')
  const { randomUUID } = await import('node:crypto')
  const { rm } = await import('node:fs/promises')
  const directory = await editorFixture()
  let store
  try {
    store = await createStore(directory)
    for (const [property, value] of [
      ['borderRadius', '9999px'],
      ['ringOffset', '-2px'],
      ['fontWeight', 650.5],
    ]) {
      const current = await store.snapshot()
      const binding = current.snapshot.model.bindings.find(
        (b) => b.target === 'button' && b.property === property,
      )
      const saved = await store.save({
        protocolVersion: 4,
        requestId: randomUUID(),
        baseRevision: current.revision,
        operations: [{ kind: 'set-component-token', target: binding.id, value }],
      })
      assert.equal(saved.status, 'saved')
      await store.close()
      store = await createStore(directory)
      const loaded = (await store.snapshot()).snapshot.model
      const reference = loaded.bindings.find((b) => b.id === binding.id).reference
      assert.equal(loaded.primitives.find((p) => p.id === reference).value, value)
    }
    const current = await store.snapshot()
    const binding = current.snapshot.model.bindings.find((b) => b.property === 'borderRadius')
    const refused = await store.save({
      protocolVersion: 4,
      requestId: randomUUID(),
      baseRevision: current.revision,
      operations: [{ kind: 'set-component-token', target: binding.id, value: '-1px' }],
    })
    assert.notEqual(refused.status, 'saved')
    assert.equal((await store.snapshot()).revision, current.revision)
  } finally {
    await store?.close()
    await rm(directory, { recursive: true, force: true })
  }
})

test('property groups cover all editable properties exactly once with stable short labels', () => {
  const groups = context.contract.propertyGroups
  assert.deepEqual(
    groups.map((g) => g.label),
    ['Typographie', 'Couleurs', 'Bordures', 'Espacements', 'Dimensions', 'Contour de focus'],
  )
  assert.deepEqual(new Set(groups.flatMap((g) => g.properties)), new Set(Object.keys(p)))
  assert.equal(p.fontSize.label, 'Taille')
  assert.equal(p.borderColor.label, 'Couleur')
  assert.equal(p.pageMargin.cssProperty, 'padding')
  assert.equal(normalizeValue(p.pageMargin, '9999px', []), '9999px')
  assert.throws(() => normalizeValue(p.pageMargin, '-1px', []))
})

test('group validation rejects duplicated, missing and unknown properties', () => {
  for (const mutation of [
    (c) => c.propertyGroups[0].properties.push('background'),
    (c) => c.propertyGroups[0].properties.pop(),
    (c) => c.propertyGroups[0].properties.splice(0, 1, 'unknown'),
    (c) => (c.propertyGroups[1].id = c.propertyGroups[0].id),
  ]) {
    const candidate = structuredClone(context.contract)
    mutation(candidate)
    assert.throws(() => validateCatalog(context.catalog, candidate))
  }
})
