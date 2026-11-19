import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { exportSources } from '../scripts/core/exports.mjs'
const run = promisify(execFile),
  source = path.resolve(import.meta.dirname, '..')
async function fixture(t) {
  const base = path.resolve(source, '../.local/ui-final-01-e')
  await fs.mkdir(base, { recursive: true })
  const directory = await fs.mkdtemp(path.join(base, 'export-test-')),
    root = path.join(directory, 'Project with spaces')
  await fs.mkdir(root)
  t.after(() => fs.rm(directory, { recursive: true, force: true }))
  return { root, directory, source, options: { destination: path.join(directory, 'Sources.zip') } }
}
test('ZIP contains saved public sources and inventory, excludes private state, secrets, Git and linked files', async (t) => {
  const f = await fixture(t)
  for (const file of [
    'README.md',
    'witness.txt',
    '.env.local',
    'auth.json',
    'api-key.txt',
    'database.sqlite3',
    'service-account.json',
    'id_ed25519',
  ])
    await fs.writeFile(path.join(f.root, file), 'synthetic ' + file)
  await fs.mkdir(path.join(f.root, 'loomata/checkpoints'), { recursive: true })
  await fs.writeFile(
    path.join(f.root, 'loomata/workspace.json'),
    JSON.stringify({ synthetic: 'shareable reference and decisions' }),
  )
  await fs.writeFile(path.join(f.root, 'loomata/private-history.json'), 'synthetic private')
  await fs.writeFile(
    path.join(f.root, 'loomata/checkpoints/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa.json'),
    'synthetic checkpoint',
  )
  await fs.mkdir(path.join(f.root, 'src'))
  await fs.writeFile(path.join(f.root, 'src/site.tsx'), 'saved source')
  for (const dir of ['.runtime.local', '.git', 'node_modules']) {
    await fs.mkdir(path.join(f.root, dir))
    await fs.writeFile(path.join(f.root, dir, 'private'), 'synthetic')
  }
  await fs.symlink('/etc/hosts', path.join(f.root, 'link.txt'))
  const result = await exportSources('project.export', f)
  assert.equal(result.phase, 'exported')
  const list = (await run('/usr/bin/unzip', ['-Z1', result.destination])).stdout
  for (const denied of [
    '.env.local',
    'auth.json',
    'api-key.txt',
    'node_modules',
    '.runtime.local',
    '.git/',
    'link.txt',
    'database.sqlite3',
    'service-account.json',
    'id_ed25519',
    'private-history.json',
  ])
    assert.equal(list.includes(denied), false, denied)
  assert.match(list, /src\/site.tsx/)
  assert.match(list, /loomata\/workspace.json/)
  assert.match(list, /loomata\/checkpoints\/aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa.json/)
  assert.match(list, /loomata-export.json/)
  assert.equal(
    (await run('/usr/bin/unzip', ['-p', result.destination, 'Projet-sources/src/site.tsx'])).stdout,
    'saved source',
  )
})
test('existing ZIP and concurrent exports never overwrite a destination', async (t) => {
  const f = await fixture(t)
  await fs.writeFile(path.join(f.root, 'witness.txt'), 'saved')
  await fs.writeFile(f.options.destination, 'preserve')
  await assert.rejects(exportSources('project.export', f))
  assert.equal(await fs.readFile(f.options.destination, 'utf8'), 'preserve')
  f.options.destination = path.join(f.directory, 'Concurrent.zip')
  const outcomes = await Promise.allSettled([
    exportSources('project.export', f),
    exportSources('project.export', f),
  ])
  assert.equal(outcomes.filter((r) => r.status === 'fulfilled').length, 1)
  await run('/usr/bin/unzip', ['-t', f.options.destination])
})
test('destination inside project/installation or an unknown option is refused before export', async (t) => {
  const f = await fixture(t)
  for (const options of [
    { destination: path.join(f.root, 'inside.zip') },
    { destination: path.join(source, 'inside.zip') },
    { destination: f.options.destination, shell: 'anything' },
  ])
    await assert.rejects(exportSources('project.export', { ...f, options }))
})
test('multiple hard links and unresolved writer recovery block export', async (t) => {
  const f = await fixture(t)
  await fs.writeFile(path.join(f.directory, 'outside.txt'), 'outside')
  await fs.link(path.join(f.directory, 'outside.txt'), path.join(f.root, 'linked.txt'))
  await assert.rejects(exportSources('project.export', f))
  await fs.unlink(path.join(f.root, 'linked.txt'))
  await fs.mkdir(path.join(f.root, '.design-editor.local/active'), { recursive: true })
  await assert.rejects(exportSources('project.export', f), /recovery/)
  await assert.rejects(fs.access(f.options.destination))
})

test('bundled bootstrap refuses incomplete and different installations without changing user data', async (t) => {
  const f = await fixture(t),
    payload = path.join(f.directory, 'payload'),
    state = path.join(f.directory, 'private'),
    install = path.join(state, 'installation-v1')
  await fs.mkdir(path.join(payload, 'scripts/design-editor'), { recursive: true })
  for (const name of ['bootstrap-bundle.mjs', 'design-editor/files.mjs'])
    await fs.copyFile(path.join(source, 'scripts', name), path.join(payload, 'scripts', name))
  await fs.writeFile(
    path.join(payload, 'delivery.json'),
    JSON.stringify({ sourceSHA256: 'expected', runtimeArchiveSHA256: 'runtime' }),
  )
  await fs.mkdir(install, { recursive: true, mode: 0o700 })
  await fs.chmod(state, 0o700)
  await fs.writeFile(path.join(install, 'user.txt'), 'preserve')
  const script = path.join(payload, 'scripts/bootstrap-bundle.mjs')
  await assert.rejects(run(process.execPath, [script, state]))
  await fs.writeFile(
    path.join(install, 'delivery.json'),
    JSON.stringify({ sourceSHA256: 'different', runtimeArchiveSHA256: 'runtime' }),
  )
  await assert.rejects(run(process.execPath, [script, state]))
  assert.equal(await fs.readFile(path.join(install, 'user.txt'), 'utf8'), 'preserve')
})
test('runtime integrity failure stops packaging before creating a delivery', async (t) => {
  const f = await fixture(t),
    archive = path.join(f.directory, 'bad.tar.gz'),
    output = path.join(f.directory, 'output')
  await fs.writeFile(archive, 'synthetic corrupt archive')
  const { packageDeliveries } = await import('../scripts/package-deliveries.mjs')
  await assert.rejects(packageDeliveries(output, archive), /Intégrité/)
  await assert.rejects(fs.access(output))
})
