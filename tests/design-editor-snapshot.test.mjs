import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, readFile, mkdir, writeFile, rm } from 'node:fs/promises'
import path from 'node:path'
import { parse, stringify } from 'yaml'
import { createEditorSnapshot } from '../scripts/editor-snapshot.mjs'
import { loadCanonicalEditorModel, readDesignSheet } from '../scripts/validate-editor-contract.mjs'
import { compositionArtifacts } from '../scripts/ui-composition.mjs'
import { tokenPath } from '../scripts/dtcg-tokens.mjs'

const root = process.cwd()
const input = await loadCanonicalEditorModel()
async function fixture(run) {
  const temporaryRoot = path.join(root, '.runtime.local', 'tmp')
  await mkdir(temporaryRoot, { recursive: true })
  const temporary = await mkdtemp(path.join(temporaryRoot, 'editor-inventory-'))
  try {
    await mkdir(path.join(temporary, 'app'), { recursive: true })
    for (const target of input.context.contract.targets) {
      const text = await readFile(path.join(root, target.sheet), 'utf8')
      const sheet = parse(text)
      for (const file of [target.sheet, ...sheet.presentation.consumerFiles]) {
        await mkdir(path.dirname(path.join(temporary, file)), { recursive: true })
        await writeFile(path.join(temporary, file), await readFile(path.join(root, file)))
      }
    }
    const composition = (await compositionArtifacts(root)).data
    for (const file of new Set([
      'src/design-system/authority/ui-composition.yaml',
      'src/design-system/authority/primitives.yaml',
      'src/design-system/authority/semantic-tokens.yaml',
      'src/design-system/authority/components.yaml',
      tokenPath,
      ...composition.tokens.map((t) => t.file),
    ])) {
      await mkdir(path.dirname(path.join(temporary, file)), { recursive: true })
      await writeFile(path.join(temporary, file), await readFile(path.join(root, file)))
    }
    await run(temporary)
  } finally {
    await rm(temporary, { recursive: true, force: true })
  }
}
test('snapshot generation inventories every binding and the explicit dynamic legacy catalogue', async () => {
  const a = await createEditorSnapshot(root, input),
    b = await createEditorSnapshot(root, input)
  assert.equal(a.generation, b.generation)
  assert.deepEqual(a.inventoryIssues, [])
  assert.equal(
    new Set(a.usages.filter((item) => item.kind === 'binding').map((item) => item.reference)).size,
    188,
  )
  assert.equal(
    a.usages.filter(
      (item) => item.kind === 'dynamic' && item.file === 'src/design-system/Foundations.tsx',
    ).length,
    24,
  )
  assert(
    a.usages.some(
      (item) => item.kind === 'dynamic' && item.file === 'src/design-system/TokenCatalog.tsx',
    ),
  )
})
test('unknown tokens and dynamic variables make the inventory partial instead of silently complete', () =>
  fixture(async (temporary) => {
    await writeFile(path.join(temporary, 'src', 'unknown.css'), 'p{color:var( --adl-unknown)}')
    await writeFile(path.join(temporary, 'src', 'unknown.tsx'), 'const color=`var(${arbitrary})`')
    const data = await createEditorSnapshot(temporary, input)
    assert(data.inventoryIssues.some((issue) => issue.includes('Référence non préparée')))
    assert(data.inventoryIssues.some((issue) => issue.includes('Usage dynamique non préparé')))
  }))
test('a composition token outside the editable matrix changes generation without changing the component model', () =>
  fixture(async (temporary) => {
    const before = await createEditorSnapshot(temporary, input)
    const { readTokens } = await import('../scripts/dtcg-tokens.mjs')
    const file = path.join(temporary, tokenPath)
    const document = JSON.parse(await readFile(file, 'utf8'))
    readTokens(document).ids.get('primitive.composition.editor-preview-inset').node.$value.value =
      24
    await writeFile(file, JSON.stringify(document))
    const after = await createEditorSnapshot(temporary, input)
    assert.deepEqual(after.model, before.model)
    assert.notEqual(after.authorityGeneration, before.authorityGeneration)
    assert.notEqual(after.generation, before.generation)
  }))
test('missing presentation and foreign consumer paths refuse generation', () =>
  fixture(async (temporary) => {
    const file = path.join(temporary, input.context.contract.targets[0].sheet)
    const sheet = parse(await readFile(file, 'utf8'))
    const previous = sheet.presentation
    delete sheet.presentation
    await writeFile(file, stringify(sheet))
    await assert.rejects(createEditorSnapshot(temporary, input), /missing-presentation/)
    sheet.presentation = { ...previous, consumerFiles: ['../outside.css'] }
    await writeFile(file, stringify(sheet))
    await assert.rejects(createEditorSnapshot(temporary, input), /unknown-consumer-file/)
  }))

test('presentation stays inside the prepared domains and old sheets remain valid', async () => {
  const { validateSheet } = await import('../scripts/validate-editor-contract.mjs')
  const sheet = await readDesignSheet(root, input.context.contract.targets[0].sheet)
  const old = structuredClone(sheet)
  delete old.presentation
  assert.doesNotThrow(() => validateSheet(old, input.context, input.model))
  for (const mutate of [
    (candidate) => {
      candidate.presentation.parts.foreign = 'Autre'
    },
    (candidate) => {
      delete candidate.presentation.states.default
    },
    (candidate) => {
      candidate.presentation.priorityIntentions = ['unknown.intention']
    },
    (candidate) => {
      candidate.presentation.contrastParts = ['foreign']
    },
    (candidate) => {
      candidate.presentation.consumerFiles = ['../outside.css']
    },
  ]) {
    const candidate = structuredClone(sheet)
    mutate(candidate)
    assert.throws(() => validateSheet(candidate, input.context, input.model))
  }
})

test('semantic guidance covers all six sheets and rejects invalid or ambiguous contexts', async () => {
  const { validateSheet } = await import('../scripts/validate-editor-contract.mjs')
  for (const target of input.context.contract.targets) {
    const sheet = await readDesignSheet(root, target.sheet)
    assert(sheet.presentation.semanticGuidance.recommendations.length > 0)
    assert.doesNotThrow(() => validateSheet(sheet, input.context, input.model))
    const legacy = structuredClone(sheet)
    delete legacy.presentation.semanticGuidance
    legacy.presentation.priorityIntentions = []
    assert.doesNotThrow(() => validateSheet(legacy, input.context, input.model))
    for (const mutate of [
      (rules) => rules.pop(),
      (rules) => rules.push(structuredClone(rules[0])),
      (rules) => {
        rules[0].part = 'unknown'
      },
      (rules) => {
        rules[0].variants = ['unknown']
      },
      (rules) => {
        rules[0].intentions = ['actions.unknown']
      },
      (rules) => {
        rules[0].intentions = []
      },
      (rules) => {
        rules[0].intentions.push(rules[0].intentions[0])
      },
    ]) {
      const candidate = structuredClone(sheet)
      mutate(candidate.presentation.semanticGuidance.recommendations)
      assert.throws(() => validateSheet(candidate, input.context, input.model))
    }
    const dimension = sheet.bindings.find(
      (b) => input.context.contract.properties[b.property].type !== 'color',
    )
    const candidate = structuredClone(sheet)
    const rule = candidate.presentation.semanticGuidance.recommendations.find(
      (r) =>
        r.variants.includes(dimension.variant) &&
        r.part === dimension.part &&
        r.properties.includes(dimension.property) &&
        r.states.includes(dimension.state),
    )
    if (rule)
      candidate.presentation.semanticGuidance.recommendations.splice(
        candidate.presentation.semanticGuidance.recommendations.indexOf(rule),
        1,
      )
    candidate.presentation.semanticGuidance.recommendations.push({
      variants: [dimension.variant],
      part: dimension.part,
      properties: [dimension.property],
      states: [dimension.state],
      intentions: ['actions.primary'],
      reason: 'Test de refus : rôle sans sens démontré.',
    })
    assert.throws(
      () => validateSheet(candidate, input.context, input.model),
      /incompatible-guidance/,
    )
  }
})
