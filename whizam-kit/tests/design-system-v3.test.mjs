import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, writeFile, mkdir, mkdtemp, rm, lstat } from 'node:fs/promises'
import path from 'node:path'
import { stringify, parse } from 'yaml'
import { migrateSources, migrateRoot } from '../scripts/migrate-design-system-v3.mjs'
import { loadCanonicalEditorModel } from '../scripts/validate-editor-contract.mjs'
import { generateEditorTokenArtifacts } from '../src/design-system/token-resolution.ts'
import { applyOperations, saveRequestSchema } from '../src/design-system/editor/operations.ts'
import {
  primitiveFamily,
  primitiveName,
  semanticTemplate,
} from '../src/design-system/editor/naming.ts'
import { validateEditorModel, styleId } from '../src/design-system/editor/legacy-v3-contract.ts'
import { migrateSources as migrateV4 } from '../scripts/migrate-design-system-v4.mjs'

const frozen = JSON.parse(
  await readFile(new URL('./fixtures/design-system-v2.json', import.meta.url), 'utf8'),
)
const { context } = await loadCanonicalEditorModel()
context.contract = parse(
  await readFile(new URL('./fixtures/editor-contract-v1.yaml', import.meta.url), 'utf8'),
)
const convert = (input = frozen) =>
  migrateSources(input.primitives, input.semantic, input.sheets, context.contract, context.catalog)
const modelOf = (r) => ({
  schemaVersion: 3,
  primitives: r.primitives.primitives,
  styles: r.semantic.styles,
  bindings: r.sheets.flatMap((s) => s.bindings),
})
const artifacts = (r) =>
  generateEditorTokenArtifacts(modelOf(r), context.contract, r.semantic.tokens)
function oldValues(input) {
  const nodes = new Map(
    [
      ...input.primitives.primitives,
      ...input.semantic.styles,
      ...input.semantic.tokens.map((t) => ({ ...t, reference: t.value.reference })),
    ].map((t) => [t.id, t]),
  )
  const resolve = (id) => {
    const p = nodes.get(id)
    return p.reference ? resolve(p.reference) : p.value
  }
  return {
    resolve,
    bindings: input.sheets
      .flatMap((s) => s.bindings)
      .map((b) => ({ id: b.id, value: resolve(b.exception?.reference ?? b.style) })),
  }
}
test('frozen v2 values survive migration for all 41 styles, 24 aliases and 188 component tokens', () => {
  const result = convert(),
    old = oldValues(frozen),
    next = artifacts(result)
  assert.deepEqual(
    next.bindings.map((b) => ({ id: b.id, value: b.value })),
    old.bindings,
  )
  for (const { from, to } of result.report.styles)
    assert.equal(next.styles.find((s) => s.id === to).value, old.resolve(from))
  for (const t of next.legacy) assert.equal(t.value, old.resolve(t.id))
  assert.equal(next.bindings.length, 188)
  assert.equal(next.styles.length, 41)
  assert.deepEqual(convert(), result)
})
test('one historical scalar splits by technical family without converting units or losing origins', () => {
  const result = convert(),
    mapped = result.report.primitives.find((p) => p.from === 'primitive.space.button-inline')
  assert.deepEqual(
    new Set(mapped.to),
    new Set(['primitive.space.rem-1', 'primitive.type.font-size.rem-1']),
  )
  for (const id of mapped.to) {
    const p = result.primitives.primitives.find((p) => p.id === id)
    assert.equal(p.value, '1rem')
    assert(p.origins.some((o) => o.id === mapped.from))
  }
  const white = result.primitives.primitives.find((p) => p.id === 'primitive.color.hex-ffffff')
  assert(white.origins.length > 1)
  assert.notEqual(primitiveName('space', '1rem'), primitiveName('space', '16px'))
  assert.notEqual(
    primitiveName('type.line-height', 1.5),
    primitiveName('type.line-height', '1.5rem'),
  )
})
test('saved #b51a00 becomes the existing component token; repeated edits and restoration keep its identity', () => {
  const input = structuredClone(frozen),
    provenance = {
      kind: 'designer-edit',
      status: 'proposed',
      reason: 'Valeur enregistrée de référence.',
    }
  input.primitives.primitives.push({
    id: 'primitive.color.designer-edit-1',
    type: 'color',
    value: '#b51a00',
    provenance,
  })
  const target = 'component.button.default.root.background.default',
    binding = input.sheets.flatMap((s) => s.bindings).find((b) => b.id === target)
  binding.exception = { reference: 'primitive.color.designer-edit-1', provenance }
  const result = convert(input),
    model = modelOf(result),
    b = model.bindings.find((b) => b.id === target),
    shared = b.style
  assert.equal(artifacts(result).bindings.find((b) => b.id === target).value, '#b51a00')
  assert.equal(b.reference, 'primitive.color.hex-b51a00')
  assert.equal(artifacts(result).styles.find((s) => s.id === shared).value, '#1d4ed8')
  assert(!Object.hasOwn(b, 'exception'))
  assert.deepEqual(b.provenance, provenance)
  const migrated = migrateV4(
    result.primitives,
    result.semantic,
    { schemaVersion: 3 },
    result.sheets,
    context.contract,
    context.catalog,
  )
  const snapshot = {
    model: migrated.model,
    catalog: context.catalog,
    contract: context.contract,
    legacy: migrated.semantic.tokens,
  }
  let edited = applyOperations(snapshot, [
    { kind: 'set-component-token', target, value: '#123456' },
  ])
  edited = applyOperations({ ...snapshot, model: edited }, [
    { kind: 'set-component-token', target, value: '#234567' },
    { kind: 'update-shared', style: shared, value: '#345678' },
  ])
  const effective = (m) =>
    generateEditorTokenArtifacts(m, context.contract, migrated.semantic.tokens).bindings.find(
      (b) => b.id === target,
    ).value
  assert.equal(effective(edited), '#234567')
  assert.equal(edited.bindings.length, 188)
  assert.equal(edited.styles.length, 17)
  const restored = applyOperations({ ...snapshot, model: edited }, [{ kind: 'restore', target }])
  assert.equal(effective(restored), '#345678')
})
test('migration rejects cycles and missing references before any output', () => {
  for (const reference of ['semantic.missing.reference', frozen.semantic.styles[0].id]) {
    const input = structuredClone(frozen)
    input.semantic.styles[0].reference = reference
    assert.throws(() => convert(input), /unknown-reference|forbidden-cycle/)
  }
  const aliases = structuredClone(frozen)
  aliases.semantic.tokens[0].value.reference = aliases.semantic.tokens[0].id
  assert.throws(() => convert(aliases), /forbidden-cycle/)
})

test('migration refuses incomplete or displaced sheets before writing a lossy distribution', () => {
  const incomplete = structuredClone(frozen)
  incomplete.sheets[0].bindings.pop()
  assert.throws(() => convert(incomplete), /unknown-guidance-context/)
  delete incomplete.sheets[0].presentation
  assert.throws(() => convert(incomplete), /incomplete-sheet/)
  const displaced = structuredClone(frozen)
  displaced.sheets[0].target = 'field'
  assert.throws(() => convert(displaced), /sheet-target-mismatch/)
})
test('new model refuses old snapshots, direct exception objects, wrong family and missing attribution', () => {
  const model = modelOf(convert()),
    validate = (m) => validateEditorModel(m, context.catalog, context.contract)
  assert.throws(() => validate({ ...model, schemaVersion: 2 }), /incompatible-model-version/)
  const direct = structuredClone(model)
  direct.bindings[0].exception = { reference: direct.styles[0].reference }
  assert.throws(() => validate(direct), /invalid-component-token/)
  const wrong = structuredClone(model),
    b = wrong.bindings[0]
  b.reference = 'primitive.space.rem-1'
  b.provenance = { kind: 'designer-edit', status: 'proposed', reason: 'Test' }
  assert.throws(() => validate(wrong), /type-mismatch/)
  const family = structuredClone(model)
  const s = family.styles.find((s) => s.role === 'font-size')
  s.reference = 'primitive.space.rem-1'
  assert.throws(() => validate(family), /family-mismatch/)
  assert(
    !saveRequestSchema.safeParse({
      protocolVersion: 1,
      requestId: '12345678-1234-4123-8123-123456789abc',
      baseRevision: 'a'.repeat(64),
      operations: [{ kind: 'set-exception', target: b.id, value: '#123456' }],
    }).success,
  )
})
test('catalogue homonyms remain distinct under the new usage naming for every compatible pair', () => {
  const ids = new Set()
  for (const category of context.catalog.categories) {
    assert.equal(category.identifierTemplate, semanticTemplate)
    for (const intention of category.intentions)
      for (const pair of category.compatibility) {
        const [type, role] = pair.split(':')
        const id = styleId({
          type,
          role,
          intention: category.id + '.' + intention.id,
          state: 'default',
        })
        assert(!ids.has(id), id)
        ids.add(id)
      }
  }
  assert.equal(primitiveFamily('dimension', 'font-size'), 'type.font-size')
})
test('root migration is idempotent and refuses any existing receipt or live owner', async () => {
  const folder = path.resolve('.runtime.local/tmp')
  await mkdir(folder, { recursive: true })
  const root = await mkdtemp(path.join(folder, 'v3-migration-'))
  try {
    const base = 'src/design-system/authority'
    await mkdir(path.join(root, base), { recursive: true })
    const docs = [
      [base + '/primitives.yaml', frozen.primitives],
      [base + '/semantic-tokens.yaml', frozen.semantic],
      [base + '/editor-contract.yaml', context.contract],
      [base + '/semantic-catalog.yaml', context.catalog],
      ...context.contract.targets.map((t, i) => [t.sheet, frozen.sheets[i]]),
    ]
    for (const [file, data] of docs) {
      await mkdir(path.dirname(path.join(root, file)), { recursive: true })
      await writeFile(path.join(root, file), stringify(data, { aliasDuplicateObjects: false }))
    }
    const original = await Promise.all(docs.map(([file]) => readFile(path.join(root, file))))
    await assert.rejects(
      () => migrateRoot(root, { write: true, reportFile: path.join(folder, 'outside.json') }),
      /unsafe-migration-path/,
    )
    const existing = path.join(root, 'existing.json')
    await writeFile(existing, 'sentinel')
    await assert.rejects(
      () => migrateRoot(root, { write: true, reportFile: existing }),
      /migration-report-exists/,
    )
    assert.equal(await readFile(existing, 'utf8'), 'sentinel')
    assert.deepEqual(
      await Promise.all(docs.map(([file]) => readFile(path.join(root, file)))),
      original,
    )
    await mkdir(path.join(root, '.design-editor.local'), { recursive: true, mode: 0o700 })
    const rootMeta = await lstat(root),
      owner = path.join(root, '.design-editor.local/owner.json')
    // Synthetic owner owned by this test; its cleanup never touches a real writer.
    await writeFile(
      owner,
      JSON.stringify({
        version: 1,
        pid: process.pid,
        nonce: '00000000-0000-4000-8000-000000000000',
        root: { dev: rootMeta.dev, ino: rootMeta.ino, mode: rootMeta.mode & 0o7777 },
      }),
    )
    await assert.rejects(() => migrateRoot(root, { write: true }), /old-writer-state/)
    await rm(owner)
    assert((await migrateRoot(root, { write: true })).changed)
    const before = await Promise.all(docs.map(([file]) => readFile(path.join(root, file))))
    assert.equal((await migrateRoot(root, { write: true })).changed, false)
    assert.deepEqual(
      await Promise.all(docs.map(([file]) => readFile(path.join(root, file)))),
      before,
    )
    await mkdir(path.join(root, '.design-editor.local/records'), { recursive: true })
    await writeFile(path.join(root, '.design-editor.local/records/saved.json'), '{}')
    await assert.rejects(() => migrateRoot(root, { write: true }), /old-writer-state/)
    assert.deepEqual(
      await Promise.all(docs.map(([file]) => readFile(path.join(root, file)))),
      before,
    )
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
