import { fileURLToPath } from 'node:url'
import { test } from 'node:test'
import assert from 'node:assert/strict'
import * as fs from 'node:fs/promises'
import path from 'node:path'
import {
  fontCatalog,
  coversFrench,
  importFont,
  installedFont,
} from '../scripts/design-editor/fonts.mjs'

test('pinned catalogue has confined immutable resources, licences and weight ranges', () => {
  assert.match(fontCatalog.revision, /^[a-f0-9]{40}$/)
  for (const font of fontCatalog.families) {
    assert.match(font.stack, /^ADL [A-Za-z ]+, (sans-serif|serif)$/)
    assert.ok(font.minWeight <= font.maxWeight)
    assert.deepEqual(
      font.files.map((f) => f.name),
      ['font.ttf', 'OFL.txt'],
    )
    for (const file of font.files) {
      assert.ok(
        file.url.startsWith(
          `https://raw.githubusercontent.com/google/fonts/${fontCatalog.revision}/`,
        ),
      )
      assert.match(file.sha256, /^[a-f0-9]{64}$/)
    }
  }
})
test('cmap check rejects malformed or missing French glyphs', () => {
  assert.equal(coversFrench(Buffer.alloc(40)), false)
  assert.equal(coversFrench(Buffer.from('invalid')), false)
})
test('unknown identities and corrupt downloads never publish a font; symlink parents refused', async () => {
  const base = path.resolve('.runtime.local/tmp')
  await fs.mkdir(base, { recursive: true })
  const root = await fs.mkdtemp(path.join(base, 'font-refusals-'))
  try {
    await fs.mkdir(path.join(root, 'public'))
    await assert.rejects(importFont(root, '../escape'), /forbidden/)
    await assert.rejects(
      importFont(root, 'inter', async () => Buffer.from('wrong')),
      /font-integrity-failed/,
    )
    assert.equal(await installedFont(root, fontCatalog.families[0]), false)
    assert.deepEqual(await fs.readdir(path.join(root, 'public/fonts')), [])
    await fs.rmdir(path.join(root, 'public/fonts'))
    await fs.symlink(base, path.join(root, 'public/fonts'))
    await assert.rejects(importFont(root, 'inter'), /forbidden/)
  } finally {
    await fs.rm(root, { recursive: true, force: true })
  }
})

test('a family with spaces survives DTCG projection without CSS quoting in the editor value', async () => {
  const { loadCanonicalEditorModel } = await import('../scripts/validate-editor-contract.mjs')
  const { applyOperations } = await import('../src/design-system/editor/operations.ts')
  const { loadTokens, updateEditorTokens, editorProjection, tokenCSS } =
    await import('../scripts/dtcg-tokens.mjs')
  const root = fileURLToPath(new URL('..', import.meta.url))
  const { model, context } = await loadCanonicalEditorModel(root)
  const binding = model.bindings.find((b) => b.property === 'fontFamily')
  const { createEditorSnapshot } = await import('../scripts/editor-snapshot.mjs')
  const snapshot = await createEditorSnapshot(root, await loadCanonicalEditorModel(root))
  const next = applyOperations(snapshot, [
    { kind: 'set-component-token', target: binding.id, value: 'ADL Montserrat, sans-serif' },
  ])
  const document = updateEditorTokens((await loadTokens(root)).document, {
    model: next,
    catalog: context.catalog,
  })
  assert.ok(
    editorProjection(document).primitives.some((p) => p.value === 'ADL Montserrat, sans-serif'),
  )
  assert.equal(
    tokenCSS('fontFamily', ['ADL Montserrat', 'sans-serif']),
    '"ADL Montserrat", sans-serif',
  )
})
