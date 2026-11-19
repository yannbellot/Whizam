import test from 'node:test'
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { loadCanonicalEditorModel, requireSchema } from '../scripts/validate-editor-contract.mjs'
import { createEditorSnapshot } from '../scripts/editor-snapshot.mjs'
import {
  taxonomySchema,
  validateTaxonomy,
  primitiveCategory,
  semanticCategory,
  componentCategory,
  categoryGroups,
} from '../src/design-system/editor/taxonomy.ts'
import { tokenAssociations } from '../src/design-system/editor/associations.ts'
import { applyRequest } from '../src/design-system/editor/operations.ts'
const root = fileURLToPath(new URL('..', import.meta.url))
const input = await loadCanonicalEditorModel(root)
const { catalog, contract, validators } = input.context
const snapshot = await createEditorSnapshot(root, input)
const check = (change) => {
  const data = structuredClone(catalog.taxonomy)
  change(data)
  validateTaxonomy(data, contract, catalog)
}
test('approved global taxonomy has exactly eight primitive and eleven semantic domains; mode axes remain inactive', () => {
  const roots = (collection) =>
    collection.filter((node) => !node.path.includes('.')).map((node) => node.path)
  assert.deepEqual(roots(catalog.taxonomy.collections.primitive), [
    'color',
    'space',
    'size',
    'radius',
    'stroke',
    'opacity',
    'type',
    'motion',
  ])
  assert.deepEqual(roots(catalog.taxonomy.collections.semantic), [
    'color',
    'type',
    'space',
    'size',
    'shape',
    'stroke',
    'elevation',
    'layer',
    'opacity',
    'motion',
    'content',
  ])
  assert(catalog.taxonomy.modes.every((mode) => mode.active === false && mode.fallback === null))
})
test('taxonomy refuses unknown fields, non-English keys, missing parents and duplicated terms/rules/axes', () => {
  assert.throws(() =>
    check((t) => {
      t.extra = true
    }),
  )
  assert.throws(() =>
    check((t) => {
      t.collections.semantic[0].path = 'couleur accentuée'
    }),
  )
  assert.throws(
    () =>
      check((t) => {
        t.collections.semantic = t.collections.semantic.filter((n) => n.path !== 'color')
      }),
    /missing-taxonomy-parent/,
  )
  assert.throws(
    () =>
      check((t) => {
        t.vocabulary.push(t.vocabulary[0])
      }),
    /duplicate-vocabulary-term/,
  )
  assert.throws(
    () =>
      check((t) => {
        t.rules[1] = t.rules[0]
      }),
    /duplicate-token-rule/,
  )
  assert.throws(
    () =>
      check((t) => {
        t.modes[1] = t.modes[0]
      }),
    /duplicate-mode-axis/,
  )
  assert.throws(() =>
    check((t) => {
      t.modes[0].active = true
    }),
  )
})
test('routes refuse unknown categories, nonexistent intentions, incompatible roles and primitive families', () => {
  assert.throws(
    () =>
      check((t) => {
        t.classification.semanticRoles.spacing = 'unprepared'
      }),
    /unknown-taxonomy-category/,
  )
  assert.throws(
    () =>
      check((t) => {
        t.classification.colorIntentions.invented = 'color.action'
      }),
    /unknown-taxonomy-intention/,
  )
  assert.throws(
    () =>
      check((t) => {
        t.classification.semanticRoles.spacing = 'color.content'
      }),
    /incompatible-taxonomy-role/,
  )
  assert.throws(
    () =>
      check((t) => {
        t.classification.primitiveFamilies.color = 'space'
      }),
    /incompatible-primitive-category/,
  )
})
test('all stored identities have one category, official component names and shared usages stay at the parent', () => {
  for (const p of input.model.primitives) assert(primitiveCategory(catalog.taxonomy, p))
  for (const s of input.model.styles) assert(semanticCategory(catalog.taxonomy, s))
  for (const b of input.model.bindings)
    assert.equal(
      componentCategory(contract, b),
      contract.targets.find((t) => t.id === b.target).component,
    )
  const group = categoryGroups(input.model.styles, (s) => semanticCategory(catalog.taxonomy, s))
  assert.equal(group.flatMap((g) => g.entries).length, 53)
  assert(
    ['type.family', 'space', 'shape', 'stroke', 'size.container'].some((path) =>
      group.some((g) => g.path === path),
    ),
  )
  assert(!group.some((g) => g.path.startsWith('motion') || g.path === 'type.heading'))
  assert(
    input.model.styles
      .filter((s) => s.role === 'spacing')
      .every((s) => semanticCategory(catalog.taxonomy, s) === 'space'),
  )
})
test('a new semantic intent and primitive are classified immediately and keep intent separate from state', () => {
  const { model } = applyRequest(snapshot, {
    protocolVersion: 4,
    requestId: randomUUID(),
    baseRevision: 'a'.repeat(64),
    operations: [
      {
        kind: 'create-style',
        target: 'component.button.default.root.background.default',
        intention: 'actions.destructive',
        value: '#b51a00',
      },
    ],
  })
  const created = model.styles.find((s) => s.intention === 'actions.destructive')
  assert.equal(semanticCategory(catalog.taxonomy, created), 'color.action')
  assert.equal(created.state, 'default')
  assert.equal(
    primitiveCategory(
      catalog.taxonomy,
      model.primitives.find((p) => p.value === '#b51a00'),
    ),
    'color.standalone',
  )
})
test('declared associations follow exact references, measure real pairs and do not invent icons or missing backgrounds', () => {
  const associations = tokenAssociations(snapshot)
  const button = associations.find(
    (a) => a.component === 'Button' && a.part === 'root' && a.state === 'default',
  )
  assert(button.textContrast > 1)
  assert.equal(button.iconContrast, null)
  assert(
    associations.some(
      (a) => a.contrastScope === 'background-not-declared' && a.textContrast === null,
    ),
  )
  const before = JSON.stringify(snapshot.model)
  const hover = associations.find(
    (a) => a.component === 'Button' && a.part === 'root' && a.state === 'hover',
  )
  assert(hover.properties.some((p) => p.property === 'foreground' && p.token.endsWith('.default')))
  for (const a of associations)
    for (const p of a.properties)
      assert.equal(p.reference, snapshot.model.bindings.find((b) => b.id === p.token).reference)
  assert.equal(JSON.stringify(snapshot.model), before)
})
test('common category labels are English while the intent dictionary and old identities remain intact', () => {
  assert(catalog.categories.every((c) => /^[A-Za-z][A-Za-z -]*$/.test(c.label)))
  const invalid = structuredClone(catalog)
  invalid.categories[0].label = 'Hiérarchie'
  assert.throws(() => requireSchema(validators['semantic-catalog'], invalid), /schema-invalid/)
  assert.equal(catalog.categories.length, 17)
  assert.equal(
    catalog.categories.reduce((n, c) => n + c.intentions.length, 0),
    152,
  )
  assert(taxonomySchema.safeParse(catalog.taxonomy).success)
  for (const role of new Set(Object.values(contract.properties).map((p) => p.role)))
    assert(
      catalog.taxonomy.vocabulary.some((term) => term.term === role && term.examples.length > 0),
    )
})
