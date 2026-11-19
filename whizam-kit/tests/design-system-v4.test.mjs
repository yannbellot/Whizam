import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, mkdtemp, mkdir, writeFile, rm, symlink } from 'node:fs/promises'
import path from 'node:path'
import { stringify, parse } from 'yaml'
import { migrateSources as v3 } from '../scripts/migrate-design-system-v3.mjs'
import { migrateSources as v4, migrateRoot } from '../scripts/migrate-design-system-v4.mjs'
import { loadCanonicalEditorModel } from '../scripts/validate-editor-contract.mjs'
import { generateEditorTokenArtifacts } from '../src/design-system/token-resolution.ts'
import { applyOperations, saveRequestSchema } from '../src/design-system/editor/operations.ts'
import {
  prepareStyleDecision,
  conservativeStyleDecision,
} from '../src/design-system/editor/style-decision.ts'
const { context, model, authorities } = await loadCanonicalEditorModel()
context.contract = parse(
  await readFile(new URL('./fixtures/editor-contract-v1.yaml', import.meta.url), 'utf8'),
)
const frozen = JSON.parse(
  await readFile(new URL('./fixtures/design-system-v2.json', import.meta.url), 'utf8'),
)
const old = v3(frozen.primitives, frozen.semantic, frozen.sheets, context.contract, context.catalog)
const convert = (source = old) =>
  v4(
    source.primitives,
    source.semantic,
    { schemaVersion: 3 },
    source.sheets,
    context.contract,
    context.catalog,
  )
const values = (m, aliases) => generateEditorTokenArtifacts(m, context.contract, aliases)
const snap = (m = model) => ({
  model: m,
  catalog: context.catalog,
  contract: context.contract,
  legacy: authorities['semantic-tokens'].tokens,
  presentation: { button: {} },
  generation: 'a'.repeat(64),
  inventoryIssues: [],
  usages: [],
})
test('v4 retains every effective component and legacy value while removing only 24 audited styles', () => {
  const next = convert(),
    before = values(
      {
        schemaVersion: 3,
        primitives: old.primitives.primitives,
        styles: old.semantic.styles,
        bindings: old.sheets.flatMap((s) => s.bindings),
      },
      old.semantic.tokens,
    ),
    after = values(next.model, next.semantic.tokens)
  assert.equal(next.model.styles.length, 17)
  assert.equal(next.model.bindings.filter((b) => b.style === null).length, 137)
  for (const key of ['bindings', 'legacy'])
    assert.deepEqual(
      after[key].map((x) => [x.id, x.value]),
      before[key].map((x) => [x.id, x.value]),
    )
  assert.deepEqual(next.model.primitives, old.primitives.primitives)
  assert.equal(
    v4(
      next.primitives,
      next.semantic,
      next.registry,
      next.sheets,
      context.contract,
      context.catalog,
    ).changed,
    false,
  )
})
test('autonomous padding edits and restores its immutable base without changing neighbours or fabricating a style', () => {
  const autonomous = structuredClone(model)
  const own = autonomous.bindings.find(
    (b) => b.id === 'component.button.default.root.padding-inline.default',
  )
  own.style = null
  own.reference = own.baseReference

  const id = 'component.button.default.root.padding-inline.default',
    b = autonomous.bindings.find((b) => b.id === id),
    before = structuredClone(autonomous)
  assert.equal(b.style, null)
  let edited = applyOperations(snap(autonomous), [
    { kind: 'set-component-token', target: id, value: '2rem' },
  ])
  assert.equal(edited.bindings.find((b) => b.id === id).baseReference, b.baseReference)
  assert.deepEqual(edited.styles, autonomous.styles)
  assert.deepEqual(
    edited.bindings.filter((b) => b.id !== id),
    autonomous.bindings.filter((b) => b.id !== id),
  )
  edited = applyOperations(snap(edited), [{ kind: 'restore', target: id }])
  assert.deepEqual(
    edited.bindings.find((b) => b.id === id),
    b,
  )
  assert.deepEqual(autonomous, before)
  assert.throws(
    () =>
      applyOperations(snap(autonomous), [
        {
          kind: 'create-and-assign',
          target: id,
          intention: 'neutral-hierarchy.primary',
          value: '2rem',
        },
      ]),
    /undemonstrated-semantic-role/,
  )
  assert.throws(() =>
    applyOperations(snap(autonomous), [
      {
        kind: 'set-component-token',
        target: id,
        value: '2rem',
        baseReference: 'primitive.space.rem-2',
      },
    ]),
  )
})
test('local assistance has no shared/create plans for an autonomous component token', () => {
  const autonomous = structuredClone(model)
  const own = autonomous.bindings.find(
    (b) => b.id === 'component.button.default.root.padding-inline.default',
  )
  own.style = null
  own.reference = own.baseReference

  const context = prepareStyleDecision(snap(autonomous), {
    requestId: '11111111-1111-4111-8111-111111111111',
    rootId: 'fixture',
    revision: 'a'.repeat(64),
    draftFingerprint: 'b'.repeat(64),
    target: 'component.button.default.root.padding-inline.default',
    value: '2rem',
  })
  assert.equal(context.context.currentIntention, null)
  assert.deepEqual(
    context.choices.map((c) => c.id),
    ['local'],
  )
  assert(context.choices.every((c) => c.operations.every((o) => o.kind === 'set-component-token')))
  assert(conservativeStyleDecision(context))
  assert(
    !saveRequestSchema.safeParse({
      protocolVersion: 2,
      requestId: '11111111-1111-4111-8111-111111111111',
      baseRevision: 'a'.repeat(64),
      operations: [{ kind: 'restore', target: model.bindings[0].id }],
    }).success,
  )
})
test('saved local color, shared attribution and primitive base survive the v4 migration and restore', () => {
  const input = structuredClone(old),
    b = input.sheets
      .flatMap((s) => s.bindings)
      .find((b) => b.id === 'component.button.default.root.background.default')
  input.primitives.primitives.push({
    id: 'primitive.color.hex-b51a00',
    family: 'color',
    type: 'color',
    value: '#b51a00',
    provenance: { kind: 'designer-edit', status: 'proposed', reason: 'Fixture saved value.' },
  })
  b.reference = 'primitive.color.hex-b51a00'
  b.provenance = { kind: 'designer-edit', status: 'proposed', reason: 'Fixture local.' }
  const next = convert(input),
    binding = next.model.bindings.find((x) => x.id === b.id)
  assert.equal(binding.reference, b.reference)
  assert.equal(binding.style, b.style)
  assert.equal(binding.baseReference, 'primitive.color.hex-1d4ed8')
  const snapshot = { ...snap(next.model), legacy: next.semantic.tokens }
  const edited = applyOperations(snapshot, [
    { kind: 'update-shared', style: binding.style, value: '#345678' },
    { kind: 'restore', target: b.id },
  ])
  assert.equal(
    values(edited, next.semantic.tokens).bindings.find((x) => x.id === b.id).value,
    '#345678',
  )
})
test('migration rejects unknown custom meanings and mixed versions instead of guessing from visual values', () => {
  const source = structuredClone(old)
  source.semantic.styles.push({
    ...source.semantic.styles.find((s) => s.role === 'spacing'),
    id: 'semantic.layout.primary.spacing.hover',
    intention: 'neutral-hierarchy.primary',
    state: 'hover',
  })
  assert.throws(() => convert(source), /unclassified-custom-style/)
  assert.throws(
    () =>
      v4(
        { ...old.primitives, schemaVersion: 4 },
        old.semantic,
        { schemaVersion: 3 },
        old.sheets,
        context.contract,
        context.catalog,
      ),
    /mixed-authority-versions/,
  )
})
test('offline root migration refuses journals, owners and symlinks, and persists a report before writes', async () => {
  await mkdir(path.resolve('.runtime.local'), { recursive: true })
  const root = await mkdtemp(path.resolve('.runtime.local/v4-test-'))
  try {
    const docs = [
      ['src/design-system/authority/primitives.yaml', old.primitives],
      ['src/design-system/authority/semantic-tokens.yaml', old.semantic],
      ['src/design-system/authority/components.yaml', { schemaVersion: 3 }],
      ['src/design-system/authority/editor-contract.yaml', context.contract],
      ['src/design-system/authority/semantic-catalog.yaml', context.catalog],
      ...context.contract.targets.map((t, i) => [t.sheet, old.sheets[i]]),
    ]
    for (const [file, doc] of docs) {
      await mkdir(path.dirname(path.join(root, file)), { recursive: true })
      await writeFile(path.join(root, file), stringify(doc, { aliasDuplicateObjects: false }))
    }
    const before = await readFile(path.join(root, docs[0][0]))
    assert.equal((await migrateRoot(root)).changed, true)
    assert.deepEqual(await readFile(path.join(root, docs[0][0])), before)
    await writeFile(path.join(root, '.design-editor.local/owner.json'), '{}')
    await assert.rejects(migrateRoot(root), /old-writer-state/)
    await rm(path.join(root, '.design-editor.local/owner.json'))
    await assert.rejects(
      migrateRoot(root, { write: true, reportFile: '../outside.json' }),
      /unsafe-migration-path/,
    )
    await migrateRoot(root, { write: true, reportFile: 'report.json' })
    assert.equal((await migrateRoot(root)).changed, false)
    assert.equal(JSON.parse(await readFile(path.join(root, 'report.json'))).to, 4)
    const file = path.join(root, docs[0][0])
    await rm(file)
    await symlink('semantic-tokens.yaml', file)
    await assert.rejects(migrateRoot(root))
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})

test('an explicitly documented spacing role can qualify semantically; the property type alone never decides', () => {
  const catalog = structuredClone(context.catalog)
  catalog.semanticEligibility.push({
    intention: 'neutral-hierarchy.context',
    role: 'spacing',
    definition:
      'Jeu synthétique : distance reliant les éléments d’un même groupe, indépendante du composant.',
  })
  const snapshot = { ...snap(), catalog }
  const id = 'component.button.default.root.padding-inline.default'
  const next = applyOperations(snapshot, [
    {
      kind: 'create-and-assign',
      target: id,
      intention: 'neutral-hierarchy.context',
      value: '2rem',
    },
  ])
  const binding = next.bindings.find((b) => b.id === id)
  assert(binding.style)
  assert.equal(binding.baseReference, model.bindings.find((b) => b.id === id).baseReference)
  assert.equal(next.styles.find((s) => s.id === binding.style).role, 'spacing')
})

test('migration refuses incomplete or displaced component sheets before any output', () => {
  const missing = structuredClone(old)
  missing.sheets[0].bindings.pop()
  assert.throws(() => convert(missing), /unknown-guidance-context|incomplete-sheet/)
  const moved = structuredClone(old)
  moved.sheets[0].target = 'field'
  assert.throws(() => convert(moved), /sheet-target-mismatch/)
})
