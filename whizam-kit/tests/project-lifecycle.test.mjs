import test from 'node:test'
import assert from 'node:assert/strict'
import * as fs from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import {
  createProject,
  sourceFiles,
  prepareProject,
  openProject,
} from '../scripts/core/projects.mjs'
import { runLocalService } from '../scripts/core/local-service.mjs'

const kit = resolve(import.meta.dirname, '..')
async function fixture(t) {
  const parent = resolve(kit, 'test-results/project-lifecycle')
  await fs.mkdir(parent, { recursive: true })
  const directory = await fs.mkdtemp(resolve(parent, 'case-'))
  const source = resolve(directory, 'kit')
  await fs.mkdir(resolve(source, 'scripts'), { recursive: true })
  await fs.mkdir(resolve(source, 'src'))
  await fs.mkdir(resolve(source, 'docs'))
  const files = [
    'package.json',
    'package-lock.json',
    'scripts/project-files.json',
    'scripts/local-app.mjs',
    'scripts/ui-lab-local.mjs',
    'scripts/storybook-local.mjs',
    'scripts/generate-tokens.mjs',
    'src/App.tsx',
    'ROADMAP.md',
    'docs/project-state.md',
  ]
  for (const path of files) await fs.writeFile(resolve(source, path), '')
  await fs.writeFile(
    resolve(source, 'package.json'),
    JSON.stringify({
      type: 'module',
      name: 'fixture',
      version: '0',
      scripts: { 'dev:editor': 'unused' },
    }),
  )
  await fs.writeFile(
    resolve(source, 'scripts/project-files.json'),
    JSON.stringify({ version: 1, files }),
  )
  // Unknown files and state must not enter a project.
  await fs.writeFile(resolve(source, '.env.local'), 'DO_NOT_COPY')
  await fs.writeFile(resolve(source, 'private.txt'), 'DO_NOT_COPY')
  t.after(() => fs.rm(directory, { recursive: true, force: true }))
  return { source, directory, destination: resolve(directory, 'Project with spaces') }
}
test('creation selects source files, neutralizes the preview and copies no unknown/private state', async (t) => {
  const f = await fixture(t)
  const result = await runLocalService('project.create', {
    root: f.source,
    source: f.source,
    options: { destination: f.destination, name: 'Atlas <test>' },
  })
  assert.equal(result.phase, 'created')
  assert.equal(
    (await fs.readFile(resolve(f.destination, 'src/App.tsx'), 'utf8')).includes('Atlas <test>'),
    true,
  )
  for (const file of [
    '.env.local',
    'private.txt',
    '.design-editor.local',
    '.runtime.local',
    '.git',
  ])
    await assert.rejects(fs.access(resolve(f.destination, file)))
  assert.equal(
    (await runLocalService('project.inspect', { root: f.destination })).root,
    f.destination,
  )
  assert.equal(
    JSON.parse(await fs.readFile(resolve(f.destination, 'loomata.project.json'))).phase,
    'created',
  )
})
test('two concurrent creations cannot overwrite even an empty preexisting destination', async (t) => {
  const f = await fixture(t)
  const results = await Promise.allSettled(
    [1, 2].map(() => createProject(f.source, { destination: f.destination, name: 'Atlas' })),
  )
  assert.equal(results.filter((r) => r.status === 'fulfilled').length, 1)
  await fs.writeFile(resolve(f.destination, 'user-work'), 'keep')
  await assert.rejects(
    createProject(f.source, { destination: f.destination, name: 'Other' }),
    /existe déjà/,
  )
  assert.equal(await fs.readFile(resolve(f.destination, 'user-work'), 'utf8'), 'keep')
})
test('nested targets, path traversal, external symlinks and private paths are refused', async (t) => {
  const f = await fixture(t)
  await assert.rejects(
    createProject(f.source, { destination: resolve(f.source, 'nested'), name: 'Atlas' }),
    /distinct/,
  )
  const list = resolve(f.source, 'scripts/project-files.json')
  const original = await fs.readFile(list, 'utf8')
  for (const bad of ['../outside', '.env.local', '.runtime.local/x', 'src/../../outside']) {
    const value = JSON.parse(original)
    value.files.push(bad)
    await fs.writeFile(list, JSON.stringify(value))
    await assert.rejects(sourceFiles(f.source), /invalide/)
  }
  await fs.writeFile(list, original)
  await fs.unlink(resolve(f.source, 'src/App.tsx'))
  await fs.symlink(resolve(f.source, 'private.txt'), resolve(f.source, 'src/App.tsx'))
  await assert.rejects(
    createProject(f.source, { destination: f.destination, name: 'Atlas' }),
    /Lien source refusé/,
  )
  await assert.rejects(fs.access(f.destination))
})
test('an interrupted writer blocks source creation before a destination is created', async (t) => {
  const f = await fixture(t)
  await fs.mkdir(resolve(f.source, '.design-editor.local'), { mode: 0o700 })
  await fs.writeFile(resolve(f.source, '.design-editor.local/active'), '{}')
  await assert.rejects(
    createProject(f.source, { destination: f.destination, name: 'Atlas' }),
    /recovery/,
  )
  await assert.rejects(fs.access(f.destination))
})
test('preparation failure preserves a project and is resumable without recopying user sources', async (t) => {
  const f = await fixture(t)
  await fs.mkdir(resolve(f.source, 'node_modules'))
  await createProject(f.source, { destination: f.destination, name: 'Atlas' })
  await fs.writeFile(
    resolve(f.destination, 'scripts/generate-tokens.mjs'),
    "throw new Error('synthetic generation failure')",
  )
  await assert.rejects(prepareProject(f.destination, f.source), /conservé/)
  assert.equal(
    JSON.parse(await fs.readFile(resolve(f.destination, '.runtime.local/project/state.json')))
      .phase,
    'failed',
  )
  await fs.writeFile(resolve(f.destination, 'src/App.tsx'), 'USER_WORK')
  await fs.writeFile(resolve(f.destination, 'scripts/generate-tokens.mjs'), '')
  await fs.copyFile(
    resolve(kit, 'scripts/local-app.mjs'),
    resolve(f.destination, 'scripts/local-app.mjs'),
  )
  assert.equal((await prepareProject(f.destination, f.source)).phase, 'prepared')
  assert.equal(await fs.readFile(resolve(f.destination, 'src/App.tsx'), 'utf8'), 'USER_WORK')
})
test('preparation rejects a linked private parent without writing to its target', async (t) => {
  const f = await fixture(t)
  await createProject(f.source, { destination: f.destination, name: 'Atlas' })
  const other = resolve(f.directory, 'other')
  await fs.mkdir(other)
  await fs.symlink(other, resolve(f.destination, '.runtime.local'))
  await assert.rejects(prepareProject(f.destination, f.source), /isolé/)
  assert.deepEqual(await fs.readdir(other), [])
})
test('preparation refuses a live owner, keeps receipts and does not regenerate', async (t) => {
  const f = await fixture(t)
  await createProject(f.source, { destination: f.destination, name: 'Atlas' })
  const owner = resolve(f.destination, '.runtime.local/local-app/owner.json')
  await fs.mkdir(dirname(owner), { recursive: true, mode: 0o700 })
  await fs.writeFile(owner, 'OWNER')
  await assert.rejects(prepareProject(f.destination, f.source), /conservé/)
  assert.equal(await fs.readFile(owner, 'utf8'), 'OWNER')
})

test('an existing readable runtime parent is preserved while the owned state stays private', async (t) => {
  const f = await fixture(t)
  await createProject(f.source, { destination: f.destination, name: 'Atlas' })
  await fs.copyFile(
    resolve(kit, 'scripts/local-app.mjs'),
    resolve(f.destination, 'scripts/local-app.mjs'),
  )
  await fs.mkdir(resolve(f.destination, '.runtime.local'), { mode: 0o755 })
  assert.equal((await openProject(f.destination)).phase, 'opened')
  assert.equal((await fs.stat(resolve(f.destination, '.runtime.local'))).mode & 0o777, 0o755)
  assert.equal(
    (await fs.stat(resolve(f.destination, '.runtime.local/local-app'))).mode & 0o777,
    0o700,
  )
})
