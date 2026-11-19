import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, writeFile, mkdir, mkdtemp, cp, rm } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL, fileURLToPath } from 'node:url'
import { parse, stringify } from 'yaml'
import { prepareNamingRules, namingRulesPath } from '../scripts/naming-rules.mjs'

const root = fileURLToPath(new URL('..', import.meta.url))
async function fixture(run) {
  const parent = path.join(root, '.runtime.local/tmp')
  await mkdir(parent, { recursive: true })
  const directory = await mkdtemp(path.join(parent, 'naming-'))
  try {
    const authority = path.join(directory, 'src/design-system/authority')
    await mkdir(path.join(authority, 'schemas'), { recursive: true })
    await mkdir(path.dirname(path.join(directory, namingRulesPath)), { recursive: true })
    for (const file of ['naming.yaml', 'schemas/naming.schema.json'])
      await cp(path.join(root, 'src/design-system/authority', file), path.join(authority, file))
    await run(directory, path.join(authority, 'naming.yaml'))
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
}

test('the committed runtime rules match the YAML authority', async () => {
  await prepareNamingRules(root, { check: true })
})

test('missing, unknown and invalid template rules are refused before generation', async () => {
  await fixture(async (directory, file) => {
    const original = parse(await readFile(file, 'utf8'))
    for (const mutate of [
      (rules) => delete rules.tokenNaming.component.template,
      (rules) => (rules.tokenNaming.component.extra = 'unexpected'),
      (rules) => (rules.tokenNaming.semantic.template = 'semantic.{state}.{usage}'),
    ]) {
      const rules = structuredClone(original)
      mutate(rules)
      await writeFile(file, stringify(rules))
      await assert.rejects(prepareNamingRules(directory), /invalid-naming-rules/)
    }
    await writeFile(file, 'schemaVersion: 1\nschemaVersion: 1\n')
    await assert.rejects(prepareNamingRules(directory), /invalid-naming-yaml/)
  })
})

test('stale or missing rules fail the check without overwriting the file', async () => {
  await fixture(async (directory) => {
    await assert.rejects(prepareNamingRules(directory, { check: true }), /stale-naming-rules/)
    await prepareNamingRules(directory)
    const output = path.join(directory, namingRulesPath)
    await writeFile(output, '{}\n')
    await assert.rejects(prepareNamingRules(directory, { check: true }), /stale-naming-rules/)
    assert.equal(await readFile(output, 'utf8'), '{}\n')
    await prepareNamingRules(directory)
    await prepareNamingRules(directory, { check: true })
  })
})

test('runtime names follow regenerated declarations, including lexical mappings', async () => {
  await fixture(async (directory, file) => {
    const rules = parse(await readFile(file, 'utf8'))
    rules.tokenNaming.primitive.dimensionFamilies.spacing = 'size'
    rules.tokenNaming.semantic.categoryNames.actions = 'interaction'
    await writeFile(file, stringify(rules))
    await prepareNamingRules(directory)
    const modulePath = path.join(directory, 'src/design-system/editor/naming.ts')
    await cp(path.join(root, 'src/design-system/editor/naming.ts'), modulePath)
    const naming = await import(pathToFileURL(modulePath).href)
    assert.equal(naming.primitiveFamily('dimension', 'spacing'), 'size')
    assert.equal(naming.primitiveName('size', '1rem'), 'primitive.size.rem-1')
    assert.equal(
      naming.semanticName({
        type: 'color',
        role: 'surface',
        intention: 'actions.primary',
        state: 'hover',
      }),
      'semantic.color.interaction.primary.background.hover',
    )
    assert.equal(
      naming.componentName({
        target: 'button',
        variant: 'default',
        part: 'root',
        property: 'fontSize',
        state: 'default',
      }),
      'component.button.default.root.font-size.default',
    )
  })
})
