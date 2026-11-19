import { fileURLToPath } from 'node:url'
import test from 'node:test'
import assert from 'node:assert/strict'
import * as fs from 'node:fs/promises'
import path from 'node:path'
import { readTokens, loadTokens, tokenCSS, buildTokenDocument } from '../scripts/dtcg-tokens.mjs'
import {
  consolidateDecisions,
  policyPlan,
  migrateDecisionCopy,
  migrationMarker,
} from '../scripts/migrate-decision-policy.mjs'
import { loadCanonicalEditorModel } from '../scripts/validate-editor-contract.mjs'
import { createEditorSnapshot } from '../scripts/editor-snapshot.mjs'
import { projectComposition } from '../scripts/token-composition.mjs'
import { parse } from 'yaml'
import { applyOperations } from '../src/design-system/editor/operations.ts'
import { generateEditorTokenArtifacts } from '../src/design-system/token-resolution.ts'
import { emptyChanges, getImpact } from '../src/design-system/editor/draft.ts'
import { editorFixture } from './helpers/editor-fixture.mjs'
import { createStore } from '../scripts/design-editor/store.mjs'
const root = fileURLToPath(new URL('..', import.meta.url))
const plan = await policyPlan(),
  loaded = await loadCanonicalEditorModel(root)
const { document, entries, ids } = await loadTokens(root)
const snapshot = await createEditorSnapshot(root, loaded)
const retiredReferencePrefix = 'component.composition.ui-lab-page.'
const survivingTokens = plan.tokens.filter((token) => !token.id.startsWith(retiredReferencePrefix))
const survivingPlan = { ...plan, tokens: survivingTokens }
const radius = 'component.button.default.root.border-radius.default'

function originalRecords() {
  return survivingTokens.map((e) => {
    const current = ids.get(e.id),
      meta = structuredClone(current.meta)
    if (e.beforeEditor) meta.editor = structuredClone(e.beforeEditor)
    return {
      type: current.type,
      value: e.value,
      reference: e.beforeReference ?? undefined,
      meta,
      deprecated: current.node.$deprecated,
    }
  })
}

test('only the explicitly removed reference-page identities retire from the historical allocation', () => {
  const retired = plan.tokens.filter((token) => token.id.startsWith(retiredReferencePrefix))
  assert.ok(retired.length > 0)
  for (const token of retired) assert.equal(ids.has(token.id), false, token.id)
  for (const token of survivingTokens) assert.ok(ids.has(token.id), token.id)
})

test('every surviving original identity, terminal value and primitive base survives consolidation', () => {
  const migrated = readTokens(
    consolidateDecisions(buildTokenDocument(originalRecords()), survivingPlan).document,
  )
  for (const e of survivingTokens) {
    assert.deepEqual(migrated.ids.get(e.id).value, e.value, e.id)
    if (e.beforeEditor?.baseReference)
      assert.equal(migrated.ids.get(e.id).meta.editor.baseReference, e.beforeEditor.baseReference)
  }
  for (const e of entries.filter(
    (e) => e.meta.kind === 'component' && ids.get(e.reference)?.meta.kind === 'primitive',
  ))
    assert.ok(
      e.meta.collection === 'sample' || e.meta.consumer?.usage.startsWith('Exception technique'),
    )
  assert.ok(
    entries.some((e) => e.meta.classification === 'non-semantic' && e.meta.collection === 'editor'),
  )
})
test('decision chains preserve local exceptions and restore the current policy, with separate control/container intents', () => {
  const binding = loaded.model.bindings.find((b) => b.id === radius),
    policy = binding.style
  const container = loaded.model.bindings.find(
    (b) => b.target === 'panel' && b.property === 'borderRadius',
  )
  let model = applyOperations(snapshot, [
    { kind: 'set-component-token', target: radius, value: '2rem' },
    { kind: 'update-shared', style: policy, value: '1rem' },
  ])
  assert.equal(model.bindings.find((b) => b.id === radius).style, policy)
  let artifacts = generateEditorTokenArtifacts(model, snapshot.contract, snapshot.legacy)
  assert.equal(artifacts.bindings.find((b) => b.id === radius).value, '2rem')
  assert.equal(artifacts.bindings.find((b) => b.id === container.id).value, '0.5rem')
  assert.ok(
    getImpact({ ...snapshot, model }, emptyChanges(), policy).masked.some((b) => b.id === radius),
  )
  model = applyOperations({ ...snapshot, model }, [{ kind: 'restore', target: radius }])
  artifacts = generateEditorTokenArtifacts(model, snapshot.contract, snapshot.legacy)
  assert.equal(artifacts.bindings.find((b) => b.id === radius).value, '1rem')
  assert.equal(model.bindings.find((b) => b.id === radius).baseReference, binding.baseReference)
})
test('recipe decision parameters preserve expressions and reject component parameters', async () => {
  const rules = parse(
    await fs.readFile(path.join(root, 'src/design-system/authority/ui-composition.yaml'), 'utf8'),
  )
  const p = projectComposition(document, rules)
  assert.equal(p.data.tokens.length, 148)
  assert.ok(p.decisions.length > 0)
  const bad = structuredClone(rules),
    part = bad.recipes
      .flatMap((r) => r.parts)
      .find((p) => typeof p === 'object' && p.reference.startsWith('decision.'))
  part.reference = radius
  assert.throws(() => projectComposition(document, bad), /invalid-css-recipe-reference/)
})
test('offline source migration preserves customised values, attributions and bases', async () => {
  const records = originalRecords()
  const old = buildTokenDocument(records),
    oldEntry = readTokens(old).ids.get(radius)
  // An explicit saved local exception to the former default.
  const original = records.find((r) => r.meta.id === oldEntry.reference),
    extra = structuredClone(original)
  extra.meta.id = 'primitive.radius.rem-2'
  extra.value = { value: 2, unit: 'rem' }
  delete extra.meta.editor.origins
  records.push(extra)
  const b = records.find((r) => r.meta.id === radius)
  b.reference = extra.meta.id
  b.meta.editor.provenance = {
    kind: 'designer-edit',
    status: 'proposed',
    reason: 'Exception locale fictive conservée.',
  }
  const source = buildTokenDocument(records),
    converted = consolidateDecisions(source, survivingPlan),
    next = readTokens(converted.document)
  assert.equal(tokenCSS(next.ids.get(radius).type, next.ids.get(radius).value), '2rem')
  assert.equal(next.ids.get(radius).meta.editor.style, b.meta.editor.style)
  assert.equal(next.ids.get(radius).meta.editor.baseReference, b.meta.editor.baseReference)
  assert.throws(
    () => consolidateDecisions(converted.document, survivingPlan),
    /already-consolidated/,
  )
})
test('policy rejects an unjustified direct component reference, accepts an explicit local exception', () => {
  const bad = structuredClone(document),
    entry = readTokens(bad).ids.get(radius)
  entry.node.$value = '{primitive.radius.rem-0-5}'
  assert.throws(() => readTokens(bad), /unjustified-direct-component-reference/)
  entry.meta.editor.provenance = {
    kind: 'designer-edit',
    status: 'proposed',
    reason: 'Exception locale fictive.',
  }
  assert.doesNotThrow(() => readTokens(bad))
})
test('migration refuses private state and incomplete copies without altering sources', async () => {
  const temp = await editorFixture(),
    before = await fs.readFile(path.join(temp, 'src/design-system/authority/tokens.tokens.json'))
  try {
    await assert.rejects(migrateDecisionCopy(root), /use-clean-inactive-copy/)
    await fs.mkdir(path.join(temp, '.design-editor.local'))
    await assert.rejects(migrateDecisionCopy(temp), /use-clean-inactive-copy/)
    assert.deepEqual(
      await fs.readFile(path.join(temp, 'src/design-system/authority/tokens.tokens.json')),
      before,
    )
    await fs.rmdir(path.join(temp, '.design-editor.local'))
    await fs.writeFile(path.join(temp, migrationMarker), '{}')
    await assert.rejects(migrateDecisionCopy(temp), /use-clean-inactive-copy/)
    await assert.rejects(createStore(temp), /recovery-required/)
    const { withEditorRead } = await import('../scripts/editor-reader.mjs')
    await assert.rejects(
      withEditorRead(temp, async () => {}),
      /recovery-required/,
    )
  } finally {
    await fs.rm(temp, { recursive: true, force: true })
  }
})
