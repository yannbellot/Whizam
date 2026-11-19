// Only called by the native host with its immutable payload and a private state destination.
import * as fs from 'node:fs/promises'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { privateDir } from './design-editor/files.mjs'
const run = promisify(execFile),
  payload = path.resolve(import.meta.dirname, '..')
const parent = path.resolve(process.argv[2])
await fs.mkdir(parent, { recursive: true, mode: 0o700 })
await privateDir(parent)
const install = path.join(parent, 'installation-v1'),
  marker = path.join(install, 'delivery.json')
try {
  await fs.access(marker)
} catch (e) {
  if (e.code !== 'ENOENT') throw e
  try {
    await fs.lstat(install)
    throw new Error('Installation incomplète conservée ; diagnostic requis.')
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
  const attempt = await fs.mkdtemp(path.join(parent, 'install-'))
  try {
    await run('/bin/cp', ['-cR', payload + '/.', attempt], { timeout: 180000 })
    await fs.chmod(attempt, 0o700)
    await fs.rename(attempt, install)
  } catch (error) {
    throw new Error('Installation privée non terminée ; tentative conservée.', { cause: error })
  }
}
await privateDir(install)
const expected = JSON.parse(await fs.readFile(path.join(payload, 'delivery.json'), 'utf8'))
const installed = JSON.parse(await fs.readFile(marker, 'utf8'))
if (
  !expected.sourceSHA256 ||
  installed.sourceSHA256 !== expected.sourceSHA256 ||
  installed.runtimeArchiveSHA256 !== expected.runtimeArchiveSHA256
)
  throw new Error('Version installée différente ; migration explicite requise, données conservées.')
const node = path.join(install, '.runtime.local/node/bin/node'),
  client = path.join(install, 'scripts/local-service.mjs')
console.log(JSON.stringify({ node, client, project: install }))
