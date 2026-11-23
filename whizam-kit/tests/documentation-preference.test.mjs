import { test } from 'node:test'
import assert from 'node:assert/strict'
import * as fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import {
  readDocumentationPreference,
  writeDocumentationPreference,
  initialDocumentationLanguage,
} from '../scripts/documentation-preference.mjs'
async function fixture(t) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'whizam-language-choice-'))
  t.after(() => fs.rm(root, { recursive: true, force: true }))
  return root
}
test('preference persists independently of the assistant and survives a project rename', async (t) => {
  const root = await fixture(t),
    project = path.join(root, 'project')
  await fs.mkdir(project)
  await fs.mkdir(path.join(project, '.assistant-choice.local'))
  await fs.writeFile(
    path.join(project, '.assistant-choice.local/choice.json'),
    '{"version":1,"assistant":"Codex (OpenAI)"}',
  )
  assert.equal(await readDocumentationPreference(project), null)
  for (const language of ['en', 'bilingual', 'fr']) {
    await writeDocumentationPreference(project, language)
    assert.equal(await readDocumentationPreference(project), language)
  }
  await writeDocumentationPreference(project, 'en')
  await fs.rename(project, path.join(root, 'renamed'))
  assert.equal(await readDocumentationPreference(path.join(root, 'renamed')), 'en')
  assert.equal(
    (await fs.stat(path.join(root, 'renamed/.documentation-language.local/choice.json'))).mode &
      0o777,
    0o600,
  )
  assert.equal(
    await fs.readFile(path.join(root, 'renamed/.assistant-choice.local/choice.json'), 'utf8'),
    '{"version":1,"assistant":"Codex (OpenAI)"}',
  )
  assert.equal(initialDocumentationLanguage('en'), 'en')
  assert.equal(initialDocumentationLanguage('bilingual'), 'fr')
})
test('invalid states and symlinks fail without overwriting the existing state', async (t) => {
  const r = await fixture(t)
  await fs.mkdir(path.join(r, '.documentation-language.local'))
  const file = path.join(r, '.documentation-language.local/choice.json')
  await fs.writeFile(file, 'invalid')
  await assert.rejects(writeDocumentationPreference(r, 'en'), /Invalid/)
  assert.equal(await fs.readFile(file, 'utf8'), 'invalid')
  await fs.rm(file)
  await fs.symlink('/etc/passwd', file)
  await assert.rejects(readDocumentationPreference(r), /symlink/)
  await assert.rejects(writeDocumentationPreference(r, 'xx'), /Invalid/)
})
test(
  'unwritable projects report failure without creating preference or changing assistant state',
  { skip: process.getuid?.() === 0 },
  async (t) => {
    const root = await fixture(t)
    await fs.chmod(root, 0o500)
    try {
      await assert.rejects(writeDocumentationPreference(root, 'en'), (error) =>
        ['EACCES', 'EPERM'].includes(error.code),
      )
      assert.equal(await readDocumentationPreference(root), null)
    } finally {
      await fs.chmod(root, 0o700)
    }
  },
)

test('additional languages persist, legacy preferences remain readable, invalid paths are refused', async (t) => {
  const root = await fixture(t)
  const preference = {
    version: 2,
    languages: ['fr', 'es'],
    defaultLanguage: 'es',
    translation: 'now',
  }
  await writeDocumentationPreference(root, 'bilingual')
  await writeDocumentationPreference(root, preference)
  assert.deepEqual(await readDocumentationPreference(root), preference)
  assert.equal(initialDocumentationLanguage(preference), 'es')
  for (const bad of [
    { ...preference, languages: ['../es'] },
    { ...preference, languages: ['es', 'es'] },
    { ...preference, defaultLanguage: 'en' },
    { ...preference, translation: 'automatic' },
    { ...preference, privateData: 'must-not-be-stored' },
  ]) {
    await assert.rejects(writeDocumentationPreference(root, bad), /Invalid/)
    assert.deepEqual(await readDocumentationPreference(root), preference)
  }
})
