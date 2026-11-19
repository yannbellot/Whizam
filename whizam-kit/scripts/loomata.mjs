import { createHash } from 'node:crypto'
import * as fs from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { buildLoomata } from './build-loomata.mjs'
import { inspectProject, runLocalService } from './core/local-service.mjs'

const run = promisify(execFile)
const kit = fileURLToPath(new URL('..', import.meta.url))
const args = process.argv.slice(2)
if (args.length && !(args.length === 2 && args[0] === '--project-directory'))
  throw new Error('Usage: node scripts/loomata.mjs [--project-directory directory]')
if (process.platform !== 'darwin') throw new Error('Ce lanceur de Loomata nécessite macOS.')
let recent
try {
  recent = JSON.parse(
    await fs.readFile(resolve(kit, '.runtime.local/loomata-context/last-project.json'), 'utf8'),
  ).root
} catch (error) {
  if (error.code !== 'ENOENT') throw error
}
const root = args[1] ? (await inspectProject(args[1])).root : resolve(recent ?? kit)
const parent = resolve(kit, '.runtime.local/loomata')
await fs.mkdir(parent, { recursive: true })
const metadata = resolve(parent, 'latest.json')
const nativeSHA256 = createHash('sha256')
  .update(await fs.readFile(resolve(kit, 'macos/Loomata.swift')))
  .digest('hex')
let previous
try {
  previous = JSON.parse(await fs.readFile(metadata, 'utf8'))
} catch (error) {
  if (error.code !== 'ENOENT') throw error
}
let bundle
if (previous?.bundle) {
  const binary = resolve(previous.bundle, 'Contents/MacOS/Loomata')
  const commands = (await run('/bin/ps', ['-axo', 'command='], { maxBuffer: 4e6 })).stdout.split(
    '\n',
  )
  const running = commands.some((c) => c.trim() === binary || c.trim().startsWith(binary + ' '))
  const same = previous.nativeSHA256 === nativeSHA256 && previous.node === process.execPath
  if (running && args[1] && root !== (recent ?? previous.project))
    throw new Error(
      'Loomata est ouverte sur un autre projet. Utiliser Ouvrir un projet dans sa fenêtre ; aucun contexte remplacé par le lanceur.',
    )
  if (running && !same)
    throw new Error(
      'Une version de Loomata est ouverte. Fermez-la après avoir conservé vos brouillons avant de reconstruire ou changer de dossier.',
    )
  if (same) {
    await fs.access(binary)
    bundle = previous.bundle
  }
}
const launch = {
  node: process.execPath,
  client: resolve(kit, 'scripts/local-service.mjs'),
  project: root,
  nativeSHA256,
}
if (!bundle) {
  const directory = await fs.mkdtemp(resolve(parent, 'build-'))
  bundle = (await buildLoomata({ directory, launch })).bundle
}
launch.bundle = bundle
await fs.writeFile(metadata, JSON.stringify(launch, null, 2) + '\n', { mode: 0o600 })
// An explicit CLI selection is remembered; startup and its failures belong to the native window.
if (args[1]) await runLocalService('project.open', { root })
await run('/usr/bin/open', [
  '-o',
  resolve(parent, 'native.stdout'),
  '--stderr',
  resolve(parent, 'native.stderr'),
  bundle,
])
console.log('Loomata ouverte : ' + bundle)
