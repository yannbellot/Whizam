import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises'
import path from 'node:path'
import { prepareLoomataUI, nativeAppearanceTokens } from '../scripts/generate-loomata-ui.mjs'
test('deterministic tool derivation refuses invalid references and project leakage', async () => {
  await mkdir('test-results', { recursive: true })
  const directory = await mkdtemp(path.resolve('test-results/ui-authority-'))
  try {
    for (const name of ['src/loomata-ui/authority', 'src/loomata-ui/styles', 'src/ui-lab/editor'])
      await mkdir(path.join(directory, name), { recursive: true })
    const model = JSON.parse(await readFile('src/loomata-ui/authority/tokens.tokens.json', 'utf8'))
    const file = path.join(directory, 'src/loomata-ui/authority/tokens.tokens.json')
    await writeFile(file, JSON.stringify(model))
    for (const name of [
      'src/loomata-ui/Controls.tsx',
      'src/ui-lab/editor/SceneNavigation.tsx',
      'src/ui-lab/editor/NavigationIcon.tsx',
    ])
      await writeFile(path.join(directory, name), '')
    const initial = await prepareLoomataUI(directory)
    assert.deepEqual(await prepareLoomataUI(directory), initial)
    await prepareLoomataUI(directory, true)
    assert.deepEqual(JSON.parse(await nativeAppearanceTokens(directory)), model)
    model.decision.surface.$value = '{primitive.missing}'
    await writeFile(file, JSON.stringify(model))
    await assert.rejects(prepareLoomataUI(directory), /reference/)
    model.decision.surface.$value = '{primitive.surface}'
    model.primitive.surface.$value.components[0] = 2
    await writeFile(file, JSON.stringify(model))
    await assert.rejects(prepareLoomataUI(directory), /primitive/)
    model.primitive.surface.$value.components[0] = 1
    await writeFile(file, JSON.stringify(model))
    await writeFile(path.join(directory, 'src/loomata-ui/Controls.tsx'), 'var(--adl-color)')
    await assert.rejects(prepareLoomataUI(directory), /Unscoped/)
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})
