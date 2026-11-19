import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, mkdir, mkdtemp, writeFile, rm } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  buildTokenDocument,
  readTokens,
  tokenExtension,
  tokenCSS,
  editorProjection,
} from '../scripts/dtcg-tokens.mjs'
import { convertTokenSources, migrateTokenRoot } from '../scripts/migrate-design-tokens.mjs'
import { projectComposition } from '../scripts/token-composition.mjs'
import { parseBounded } from '../scripts/design-editor/parsing.mjs'
import { styleId, validateEditorModel } from '../src/design-system/editor/contract.ts'
import { loadCanonicalEditorModel } from '../scripts/validate-editor-contract.mjs'
import { applyOperations } from '../src/design-system/editor/operations.ts'
import { updateEditorTokens } from '../scripts/dtcg-tokens.mjs'
import { loadTokens, tokenPath } from '../scripts/dtcg-tokens.mjs'

const frozen = JSON.parse(
  await readFile(new URL('./fixtures/design-system-before-dtcg.json', import.meta.url), 'utf8'),
)
const converted = convertTokenSources(frozen)
const primitive = (id = 'primitive.radius.base') => ({
  type: 'dimension',
  value: { value: 8, unit: 'px' },
  meta: { id, kind: 'primitive', collection: 'composition' },
})
const decision = (id, reference, classification = 'semantic') => ({
  type: 'dimension',
  reference,
  meta: {
    id,
    kind: 'decision',
    collection: 'composition',
    classification,
    justification:
      classification === 'semantic'
        ? 'Rayon des contrôles compacts.'
        : 'Échelle abstraite de rayons.',
  },
})
const component = (id, reference) => ({
  type: 'dimension',
  reference,
  meta: { id, kind: 'component', collection: 'composition', owner: id.split('.')[1] },
})
const record = (doc, id) => readTokens(doc).ids.get(id).node

test('source migration keeps all editable values, identities, assignments, bases and provenance', () => {
  const projected = editorProjection(converted.document)
  assert.deepEqual(projected.primitives, frozen.primitives.primitives)
  assert.deepEqual(projected.styles, frozen.semantic.styles)
  assert.deepEqual(projected.legacy, frozen.semantic.tokens)
  assert.deepEqual(
    projected.bindings,
    frozen.sheets.flatMap((s) => s.bindings),
  )
  assert.equal(converted.composition.recipes.length, 28)
  assert.equal(
    readTokens(converted.document).ids.get('semantic.color.feedback.error').path,
    'semantic.color.feedback.error.$root',
  )
  assert.equal(
    record(converted.document, 'component.button.default.root.border-radius.default').$value,
    '{primitive.radius.rem-0-5}',
  )
})
test('semantic and non-semantic decisions chain to primitives without sharing component ownership', () => {
  const document = buildTokenDocument([
    primitive(),
    decision('decision.radius.sm', 'primitive.radius.base', 'non-semantic'),
    decision('decision.control.sm', 'decision.radius.sm'),
    component('component.button.radius', 'decision.control.sm'),
    component('component.input.radius', 'primitive.radius.base'),
  ])
  const { ids } = readTokens(document)
  assert.equal(ids.get('component.button.radius').terminal, 'primitive.radius.base')
  assert.equal(ids.get('decision.radius.sm').meta.classification, 'non-semantic')
  assert.equal(ids.get('component.input.radius').meta.owner, 'input')
})
test('root tokens and JSON Pointer whole-value aliases resolve unambiguously', () => {
  const document = buildTokenDocument([
    primitive('primitive.radius'),
    primitive('primitive.radius.base'),
    decision('decision.radius.sm', 'primitive.radius'),
  ])
  assert.equal(record(document, 'decision.radius.sm').$value, '{primitive.radius.$root}')
  record(document, 'decision.radius.sm').$value = { $ref: '#/primitive/radius/$root/$value' }
  assert.equal(readTokens(document).ids.get('decision.radius.sm').value.value, 8)
})
for (const [name, records, expected] of [
  [
    'component to another component',
    [
      primitive(),
      component('component.a.radius', 'primitive.radius.base'),
      component('component.b.radius', 'component.a.radius'),
    ],
    /forbidden-component-reference/,
  ],
  [
    'decision to component',
    [
      primitive(),
      component('component.a.radius', 'primitive.radius.base'),
      decision('decision.radius.sm', 'component.a.radius'),
    ],
    /forbidden-decision-reference/,
  ],
  [
    'decision cycle',
    [
      decision('decision.radius.a', 'decision.radius.b'),
      decision('decision.radius.b', 'decision.radius.a'),
    ],
    /forbidden-token-cycle/,
  ],
  [
    'unknown reference',
    [decision('decision.radius.sm', 'primitive.radius.absent')],
    /unknown-token-reference/,
  ],
])
  test(`rejects ${name}`, () => assert.throws(() => buildTokenDocument(records), expected))
test('rejects literal decisions, absent classification, mismatched types and unowned components', () => {
  const document = buildTokenDocument([
    primitive(),
    decision('decision.radius.sm', 'primitive.radius.base'),
    component('component.button.radius', 'decision.radius.sm'),
  ])
  const check = (change, expected) => {
    const clone = structuredClone(document)
    change(clone)
    assert.throws(() => readTokens(clone), expected)
  }
  check((d) => {
    record(d, 'decision.radius.sm').$value = { value: 8, unit: 'px' }
  }, /non-primitive-literal/)
  check((d) => {
    delete record(d, 'decision.radius.sm').$extensions[tokenExtension].classification
  }, /missing-decision-classification/)
  check((d) => {
    record(d, 'decision.radius.sm').$type = 'color'
  }, /token-type-mismatch/)
  check((d) => {
    delete record(d, 'component.button.radius').$extensions[tokenExtension].owner
  }, /missing-component-owner/)
})
test('rejects arbitrary CSS as a type/value and non-terminal primitives', () => {
  const document = buildTokenDocument([primitive()])
  const change = (update, expected) => {
    const clone = structuredClone(document)
    update(record(clone, 'primitive.radius.base'))
    assert.throws(() => readTokens(clone), expected)
  }
  change((t) => {
    t.$type = 'css'
  }, /unsupported-dtcg-type/)
  change((t) => {
    t.$value = 'clamp(2rem, 5vw, 4rem)'
  }, /invalid-dtcg-value/)
  change((t) => {
    t.$value.unit = 'vh'
  }, /invalid-dtcg-value/)
  change((t) => {
    t.$value = '{primitive.radius.base}'
  }, /non-terminal-primitive/)
})
test('bounded JSON rejects duplicates and active YAML features before interpretation', () => {
  assert.throws(() => parseBounded('{"x":1,"x":2}', { format: 'json' }), /schema-invalid/)
  assert.throws(() => parseBounded('a: &a [*a]', { format: 'json' }), /schema-invalid/)
  assert.throws(
    () => parseBounded(JSON.stringify({ a: { b: { c: 1 } } }), { format: 'json', depth: 1 }),
    /budget-exceeded/,
  )
})
test('building names cannot mutate Object.prototype', () => {
  const document = buildTokenDocument([primitive('constructor.prototype.dtcg-test')])
  assert.equal(Object.prototype['dtcg-test'], undefined)
  assert.equal(readTokens(document).entries.length, 1)
})
test('CSS recipes preserve responsive units and contextual colour while exposing their primitive parameters', () => {
  const projected = projectComposition(converted.document, converted.composition)
  const values = new Map(projected.data.primitives.map((p) => [p.id, p.value]))
  for (const recipe of converted.composition.recipes) {
    const old = frozen.composition.primitives.find((p) => p.id === recipe.id)
    if (!/\bease\b/.test(old.value)) assert.equal(values.get(old.id), old.value, old.id)
    else
      assert.equal(
        values.get(old.id),
        old.value.replace('ease', 'cubic-bezier(0.25, 0.1, 0.25, 1)'),
      )
  }
  assert.equal(projected.data.primitives.length, 79)
  assert.equal(projected.data.tokens.length, 148)
  assert(projected.parameters.length > 0)
  assert(
    converted.composition.recipes.every((r) =>
      r.parts.every(
        (p) => typeof p === 'string' || readTokens(converted.document).ids.has(p.reference),
      ),
    ),
  )
})
test('CSS recipes refuse unprepared grammar, literal quantities, URL, unknown references and units', () => {
  for (const part of [
    '12px',
    'url(https://example.test/a)',
    'expression(',
    'red',
    { reference: 'primitive.radius.missing' },
    { reference: 'primitive.radius.rem-0-5', unit: 'vh' },
  ]) {
    const clone = structuredClone(converted.composition)
    clone.recipes[0].parts = [part]
    assert.throws(() => projectComposition(converted.document, clone), /css-recipe/)
  }
})
test('typed composite and font serialisation preserves safe CSS syntax', () => {
  assert.equal(
    tokenCSS('border', {
      width: { value: 1, unit: 'px' },
      style: 'solid',
      color: { colorSpace: 'srgb', components: [1, 1, 1] },
    }),
    '1px solid #ffffff',
  )
  assert.equal(tokenCSS('fontFamily', ['system-ui', 'a; color:red']), 'system-ui, "a; color:red"')
  assert.throws(
    () => tokenCSS('color', { colorSpace: 'srgb', components: [2, 0, 0] }),
    /invalid-dtcg-value/,
  )
})

test('non-semantic convention supports assignment, shared updates and restoration without fabricated semantic eligibility', async () => {
  const { context } = await loadCanonicalEditorModel()
  const definition = {
    type: 'dimension',
    intention: 'scale.compact',
    role: 'radius',
    state: 'default',
  }
  const id = styleId(definition)
  const source = readTokens(converted.document)
  const records = source.entries.map((entry) => ({
    type: entry.type,
    value: entry.node.$value,
    reference: entry.reference,
    meta: entry.meta,
    deprecated: entry.node.$deprecated,
  }))
  records.push({
    type: 'dimension',
    reference: 'primitive.radius.rem-0-5',
    meta: {
      id,
      kind: 'decision',
      collection: 'editor',
      classification: 'non-semantic',
      justification: 'Échelle abstraite compacte, donnée isolée de test.',
      editor: definition,
      order: 17,
    },
  })
  let document = buildTokenDocument(records)
  const projection = editorProjection(document)
  let model = {
    schemaVersion: 4,
    primitives: projection.primitives,
    styles: projection.styles,
    bindings: projection.bindings,
  }
  validateEditorModel(model, context.catalog, context.contract)
  const target = 'component.button.default.root.border-radius.default'
  const run = (operations) => {
    model = applyOperations(
      { model, catalog: context.catalog, contract: context.contract, legacy: projection.legacy },
      operations,
    )
    document = updateEditorTokens(document, { model, catalog: context.catalog })
    const reread = editorProjection(document)
    assert.deepEqual(reread.styles, model.styles)
    assert.deepEqual(reread.bindings, model.bindings)
  }
  run([
    { kind: 'assign', target, style: id },
    { kind: 'update-shared', style: id, value: '1rem' },
  ])
  run([{ kind: 'set-component-token', target, value: '2rem' }])
  run([{ kind: 'restore', target }])
  assert.equal(model.bindings.find((binding) => binding.id === target).reference, id)
  assert.equal(readTokens(document).ids.get(id).value.value, 1)
  assert.equal(readTokens(document).ids.get(id).meta.classification, 'non-semantic')
  assert(
    !context.catalog.semanticEligibility.some((entry) => entry.intention === definition.intention),
  )
})

test('token metadata cannot override stable identities or hide literal references in editor fields', () => {
  for (const field of ['id', 'value', 'reference']) {
    const document = structuredClone(converted.document)
    record(document, 'primitive.radius.rem-0-5').$extensions[tokenExtension].editor[field] =
      'primitive.radius.other'
    assert.throws(() => readTokens(document), /invalid-editor-token-metadata/)
  }
})

async function isolated(run) {
  const parent = fileURLToPath(new URL('../.runtime.local/tmp/', import.meta.url))
  await mkdir(parent, { recursive: true })
  const directory = await mkdtemp(path.join(parent, 'dtcg-authority-'))
  try {
    await run(directory)
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
}
test('hash cache preserves fresh reads and cannot be poisoned by a caller mutation', () =>
  isolated(async (root) => {
    await mkdir(path.dirname(path.join(root, tokenPath)), { recursive: true })
    const document = buildTokenDocument([primitive()])
    await writeFile(path.join(root, tokenPath), JSON.stringify(document))
    const first = await loadTokens(root)
    record(first.document, 'primitive.radius.base').$value.value = 99
    assert.equal((await loadTokens(root)).ids.get('primitive.radius.base').value.value, 8)
    record(document, 'primitive.radius.base').$value.value = 12
    await writeFile(path.join(root, tokenPath), JSON.stringify(document))
    assert.equal((await loadTokens(root)).ids.get('primitive.radius.base').value.value, 12)
    await writeFile(path.join(root, tokenPath), '{"duplicate":1,"duplicate":2}')
    await assert.rejects(loadTokens(root), /schema-invalid/)
  }))
test('offline migration refuses live ownership and journals without removing any protection', () =>
  isolated(async (root) => {
    const state = path.join(root, '.design-editor.local')
    for (const folder of ['records', 'transactions'])
      await mkdir(path.join(state, folder), { recursive: true })
    const owner = JSON.stringify({ pid: process.pid })
    await writeFile(path.join(state, 'owner.json'), owner)
    await assert.rejects(migrateTokenRoot(root, { write: true }), /editor-service-alive/)
    assert.equal(await readFile(path.join(state, 'owner.json'), 'utf8'), owner)
    await writeFile(path.join(state, 'records', 'fixture.json'), '{}')
    await assert.rejects(migrateTokenRoot(root, { write: true }), /editor-state-present/)
    assert.equal(await readFile(path.join(state, 'records', 'fixture.json'), 'utf8'), '{}')
  }))
test('compatibility aliases cannot hide a component dependency', () => {
  assert.throws(
    () =>
      buildTokenDocument([
        primitive(),
        component('component.button.radius', 'primitive.radius.base'),
        {
          type: 'dimension',
          reference: 'component.button.radius',
          meta: {
            id: 'semantic.radius.compatibility',
            kind: 'alias',
            collection: 'compatibility',
            editor: { type: 'dimension' },
          },
        },
      ]),
    /forbidden-alias-reference/,
  )
  assert.throws(
    () =>
      buildTokenDocument([
        primitive(),
        component('component.button.first', 'primitive.radius.base'),
        component('component.button.second', 'component.button.first'),
      ]),
    /forbidden-component-reference/,
  )
})

test('offline migration rejects imported sheet paths and document fields before any write', () =>
  isolated(async (root) => {
    const write = async (file, value) => {
      await mkdir(path.dirname(path.join(root, file)), { recursive: true })
      await writeFile(path.join(root, file), JSON.stringify(value))
    }
    const { authorities } = await loadCanonicalEditorModel()
    const base = 'src/design-system/authority/'
    await write(base + 'components.yaml', authorities.components)
    for (const [file, value] of [
      ['primitives', frozen.primitives],
      ['semantic-tokens', frozen.semantic],
      ['ui-composition', frozen.composition],
      ['semantic-catalog', frozen.catalog],
    ])
      await write(base + file + '.yaml', value)
    const contract = structuredClone(frozen.contract)
    contract.targets[0].sheet = '../outside-design-sheet.yaml'
    await write(base + 'editor-contract.yaml', contract)
    await assert.rejects(migrateTokenRoot(root, { write: true }), /forbidden/)
    contract.targets[0].sheet = frozen.contract.targets[0].sheet
    await write(base + 'editor-contract.yaml', contract)
    for (const original of frozen.sheets) {
      const { file, ...sheet } = original
      await write(file, { ...sheet, file: '../outside-output.yaml' })
    }
    await assert.rejects(migrateTokenRoot(root, { write: true }), /invalid-migration-sheet/)
    await assert.rejects(readFile(path.join(root, tokenPath)), /ENOENT/)
  }))
