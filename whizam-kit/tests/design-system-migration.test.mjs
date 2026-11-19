import { fileURLToPath } from 'node:url'
import { loadTokens, tokenCSS } from '../scripts/dtcg-tokens.mjs'
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import {
  loadCanonicalEditorModel,
  loadPreparedModel,
  requireSchema,
} from '../scripts/validate-editor-contract.mjs'
import { generateEditorTokenArtifacts } from '../src/design-system/token-resolution.ts'
import Ajv2020 from 'ajv/dist/2020.js'

const { context, authorities, model } = await loadCanonicalEditorModel()
const { ids } = await loadTokens(fileURLToPath(new URL('..', import.meta.url)))
const artifact = (candidate = model) =>
  generateEditorTokenArtifacts(candidate, context.contract, authorities['semantic-tokens'].tokens)
test('six fiches complètes, 188 propriétés et anciennes références encore valides', () => {
  assert.equal(model.bindings.length, 188)
  assert.equal(authorities['semantic-tokens'].tokens.length, 24)
  const outputs = artifact()
  const alias = ids.get(outputs.legacy[0].id)
  assert.equal(outputs.legacy[0].value, tokenCSS(alias.type, alias.value))
  assert.equal(outputs.bindings.length, 188)
  assert.equal(outputs.styles.length, 53)
  assert.deepEqual(
    outputs.legacy.map((token) => token.id),
    authorities['semantic-tokens'].tokens.map((token) => token.id),
  )
  assert.equal(
    context.contract.targets
      .find((target) => target.id === 'select-field')
      .cells.filter((cell) => cell.part === 'control')
      .some((cell) => cell.properties.includes('lineHeight')),
    false,
  )
})
test('génération reproductible, CSS de références et exception conservant le style', () => {
  assert.deepEqual(artifact(), artifact())
  const candidate = structuredClone(model)
  const binding = candidate.bindings.find(
    (binding) => binding.id === 'component.field.single-line.control.background.default',
  )
  const original = binding.style
  const value = {
    id: 'primitive.color.hex-123456',
    family: 'color',
    type: 'color',
    value: '#123456',
    provenance: { kind: 'agent-migration', status: 'proposed', reason: 'Jeu isolé.' },
  }
  candidate.primitives.push(value)
  binding.reference = value.id
  binding.provenance = value.provenance
  const local = artifact(candidate)
  assert.equal(local.bindings.find((item) => item.id === binding.id).value, '#123456')
  assert.equal(
    local.bindings.find(
      (item) => item.id === 'component.select-field.default.control.background.default',
    ).value,
    '#ffffff',
  )
  assert.equal(binding.style, original)
  candidate.styles.find((style) => style.id === original).reference = 'primitive.color.hex-475569'
  const shared = artifact(candidate)
  assert.equal(shared.bindings.find((item) => item.id === binding.id).value, '#123456')
  assert.equal(
    shared.bindings.find(
      (item) => item.id === 'component.select-field.default.control.background.default',
    ).value,
    '#475569',
  )
  binding.reference = binding.style
  delete binding.provenance
  assert.equal(artifact(candidate).bindings.find((item) => item.id === binding.id).value, '#475569')
  assert.match(
    local.css,
    /--adl-component-field-single-line-control-background-default: var\(--adl-primitive-color-hex-123456\)/,
  )
})
test('registre : refus chemins non autorisés, cible déplacée et ensemble mixte', async () => {
  const wrong = structuredClone(authorities)
  wrong.components.designSystemComponents[0].designSheet = '../outside.yaml'
  await assert.rejects(() => loadPreparedModel(wrong, context), /invalid-sheet-path/)
  const mixed = structuredClone(authorities)
  mixed.primitives.schemaVersion = 1
  await assert.rejects(() => loadPreparedModel(mixed, context), /mixed-authority-versions/)
})
test('les trois schémas de transition acceptent aussi des documents historiques v1', async () => {
  const ajv = new Ajv2020({ allErrors: true, strict: true })
  ajv.addSchema(
    JSON.parse(
      await readFile(
        new URL('../src/design-system/authority/schemas/editor-model.schema.json', import.meta.url),
        'utf8',
      ),
    ),
  )
  for (const name of ['components', 'primitives', 'semantic-tokens']) {
    const schema = JSON.parse(
      await readFile(
        new URL(`../src/design-system/authority/schemas/${name}.schema.json`, import.meta.url),
        'utf8',
      ),
    )
    const validate = ajv.compile(schema)
    requireSchema(validate, authorities[name])
    let legacy
    if (name === 'primitives')
      legacy = {
        ...authorities[name],
        schemaVersion: 1,
        primitives: JSON.parse(
          await readFile(
            new URL('../docs/design-system/token-migration.json', import.meta.url),
            'utf8',
          ),
        ).legacyPrimitives.filter((p) => p.source),
      }
    else if (name === 'semantic-tokens')
      legacy = { schemaVersion: 1, tokens: authorities[name].tokens }
    else
      legacy = {
        schemaVersion: 1,
        baseUiComponents: authorities[name].baseUiComponents,
        designSystemComponents: authorities[name].designSystemComponents.map((component) => {
          const { designSheet, family, ...rest } = component
          return {
            ...rest,
            slots: ['root'],
            states: { default: { tokens: { foreground: 'semantic.color.text.default' } } },
          }
        }),
      }
    requireSchema(validate, legacy)
  }
})

test('aucun identifiant partagé entre alias historiques et styles préparés', async () => {
  const copy = structuredClone(authorities)
  copy['semantic-tokens'].tokens[0].id = model.styles[0].id
  await assert.rejects(() => loadPreparedModel(copy, context), /duplicate-id/)
  const collision = structuredClone(authorities)
  collision['semantic-tokens'].tokens[0].id = 'semantic.' + model.styles[0].id
  await assert.rejects(() => loadPreparedModel(collision, context), /css-collision/)
})
