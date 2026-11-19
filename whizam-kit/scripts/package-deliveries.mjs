import * as fs from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { sourceFiles } from './core/projects.mjs'
import { withEditorRead } from './editor-reader.mjs'
import { buildLoomata, signBuiltBundle } from './build-loomata.mjs'
const run = promisify(execFile),
  tool = path.resolve(import.meta.dirname, '..')
export const runtimeSHA256 = '6a9724d9b50a5f22b4816cded441b5a8d9ddae546191a5e5b7efa5a5e2ee26d5'
export async function packageDeliveries(output, archive) {
  if (process.platform !== 'darwin' || process.arch !== 'arm64')
    throw new Error('Packaging qualifié macOS arm64 uniquement.')
  if (
    createHash('sha256')
      .update(await fs.readFile(archive))
      .digest('hex') !== runtimeSHA256
  )
    throw new Error('Intégrité Node invalide.')
  await fs.mkdir(output) // Destination must be new.
  const folder = path.join(output, 'Loomata-dossier')
  await fs.mkdir(folder)
  const sourceHash = createHash('sha256')
  await withEditorRead(tool, async () => {
    for (const file of await sourceFiles(tool)) {
      const target = path.join(folder, file.path)
      await fs.mkdir(path.dirname(target), { recursive: true })
      sourceHash.update(file.path + '\0')
      sourceHash.update(file.link ?? (await fs.readFile(path.join(tool, file.path))))
      if (file.link) await fs.symlink(file.link, target)
      else await fs.copyFile(path.join(tool, file.path), target)
    }
  })
  const runtime = path.join(folder, '.runtime.local')
  await fs.mkdir(runtime, { mode: 0o700 })
  await run('/usr/bin/tar', ['-xzf', path.resolve(archive), '-C', runtime], { timeout: 60000 })
  await fs.rename(path.join(runtime, 'node-v24.22.0-darwin-arm64'), path.join(runtime, 'node'))
  const node = path.join(runtime, 'node/bin/node'),
    npm = path.join(runtime, 'node/lib/node_modules/npm/bin/npm-cli.js')
  const env = { PATH: path.dirname(node) + ':/usr/bin:/bin:/usr/sbin:/sbin', LANG: 'en_US.UTF-8' }
  if (
    (await run(node, ['--version'], { env })).stdout.trim() !== 'v24.22.0' ||
    (await run(node, [npm, '--version'], { env })).stdout.trim() !== '11.19.1'
  )
    throw new Error('Runtime inattendu.')
  // Clone trusted installed dependencies locally; do not package caches, credentials or arbitrary host state.
  await run(
    '/bin/cp',
    ['-cR', path.join(tool, 'node_modules'), path.join(folder, 'node_modules')],
    { timeout: 180000 },
  )
  await run(node, ['scripts/generate-tokens.mjs'], { cwd: folder, env, timeout: 60000 })
  // Generated reader locks/state are not shipped.
  await fs.rm(path.join(folder, '.design-editor.local'), { recursive: true, force: true })
  for (const cache of ['.cache', '.vite', '.vite-temp'])
    await fs.rm(path.join(folder, 'node_modules', cache), { recursive: true, force: true })
  await fs.writeFile(
    path.join(folder, 'Lancer.command'),
    '#!/bin/sh\nset -eu\ncd "$(dirname "$0")"\nexec ./.runtime.local/node/bin/node scripts/portable.mjs\n',
    { mode: 0o755 },
  )
  await fs.writeFile(
    path.join(folder, 'delivery.json'),
    JSON.stringify(
      {
        version: 1,
        platform: 'darwin-arm64',
        node: '24.22.0',
        npm: '11.19.1',
        runtimeArchiveSHA256: runtimeSHA256,
        sourceSHA256: sourceHash.digest('hex'),
      },
      null,
      2,
    ),
  )
  const { bundle } = await buildLoomata({ directory: output, launch: { portable: '1' } })
  const payload = path.join(bundle, 'Contents/Resources/payload')
  await run('/bin/cp', ['-cR', folder, payload], { timeout: 180000 })
  await signBuiltBundle(bundle, true)
  return { folder, bundle }
}
if (process.argv[1] === import.meta.filename)
  console.log(
    JSON.stringify(await packageDeliveries(path.resolve(process.argv[2]), process.argv[3])),
  )
