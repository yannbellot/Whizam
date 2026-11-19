import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises'
import path from 'node:path'
import {
  projectTheme,
  validateProjectConsumers,
  projectConsumers,
} from '../scripts/project-theme.mjs'
const contract = { properties: { background: { type: 'color', cssProperty: 'background-color' } } }
const binding = { part: 'root', property: 'background', state: 'default' }
test('project theme keeps contextual references and deduplicates variants without copying values', () => {
  const model = {
    bindings: [
      { ...binding, target: 'button', variant: 'default' },
      { ...binding, target: 'field', variant: 'multiline' },
    ],
  }
  const result = projectTheme(model, contract)
  assert.equal(result.css, projectTheme(model, contract).css)
  assert.equal(result.utilities.size, 1)
  assert.match(
    result.css,
    /--color-local-root-background-default: var\(--adl-local-root-background-default\)/,
  )
  assert.equal((result.css.match(/@utility /g) ?? []).length, 1)
  assert.doesNotMatch(result.css, /#|--loomata-ui-|--adl-primitive-/)
  assert.throws(
    () => projectTheme({ bindings: [{ ...binding, part: 'root;bad' }] }, contract),
    /Invalid/,
  )
  assert.throws(
    () =>
      projectTheme(
        { bindings: [binding] },
        { properties: { background: { type: 'color', cssProperty: 'color;bad' } } },
      ),
    /Invalid/,
  )
})
test('project consumer guard refuses arbitrary values, undeclared utilities and chrome references', async () => {
  await mkdir('test-results', { recursive: true })
  const directory = await mkdtemp(path.resolve('test-results/project-consumers-'))
  try {
    for (const file of projectConsumers) {
      await mkdir(path.dirname(path.join(directory, file)), { recursive: true })
      await writeFile(path.join(directory, file), 'project:token-root-background-default')
    }
    const utilities = projectTheme({ bindings: [binding] }, contract).utilities
    await validateProjectConsumers(directory, utilities)
    for (const value of [
      'project:bg-[#123456]',
      'project:token-missing',
      'var(--loomata-ui-ink)',
    ]) {
      await writeFile(path.join(directory, projectConsumers[0]), value)
      await assert.rejects(validateProjectConsumers(directory, utilities), /Unapproved|leakage/)
    }
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})
