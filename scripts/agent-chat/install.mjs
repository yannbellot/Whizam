import * as fs from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'
import { privateDir } from '../design-editor/files.mjs'
import { digest } from './broker.mjs'
import { readJSON, writeJSON } from './private.mjs'
const execute = promisify(execFile)
export const codexVersion = '0.167.0'
export const binaryRelative =
  'node_modules/@openai/codex-darwin-arm64/vendor/aarch64-apple-darwin/bin/codex'
export async function installCodex(state) {
  if (process.platform !== 'darwin' || process.arch !== 'arm64')
    throw new Error('chat-platform-unqualified')
  const directory = resolve(state, 'provider')
  await privateDir(directory)
  const receipt = await readJSON(resolve(directory, 'installed.json'), null)
  if (receipt) {
    const binary = resolve(directory, 'ready', binaryRelative)
    if (
      receipt.version !== codexVersion ||
      digest(await fs.readFile(binary)) !== receipt.binarySHA256
    )
      throw new Error('chat-provider-integrity')
    return binary
  }
  const ready = resolve(directory, 'ready')
  try {
    await fs.access(ready)
    throw new Error('chat-provider-incomplete')
  } catch (e) {
    if (e.code !== 'ENOENT') throw e
  }
  const attempt = await fs.mkdtemp(resolve(directory, 'install-'))
  const lock = await fs.readFile(
    fileURLToPath(new URL('./codex-package-lock.json', import.meta.url)),
  )
  await fs.writeFile(resolve(attempt, 'package-lock.json'), lock, { mode: 0o600 })
  await writeJSON(resolve(attempt, 'package.json'), {
    name: 'loomata-codex-runtime',
    private: true,
    dependencies: { '@openai/codex': codexVersion },
  })
  await fs.writeFile(resolve(attempt, 'npm-user.ini'), '', { mode: 0o600 })
  await fs.writeFile(resolve(attempt, 'npm-global.ini'), '', { mode: 0o600 })
  const npm = resolve(dirname(process.execPath), '../lib/node_modules/npm/bin/npm-cli.js')
  const env = {
    PATH: dirname(process.execPath) + ':' + (process.env.PATH ?? '/usr/bin:/bin'),
    TMPDIR: attempt,
    LANG: 'en_US.UTF-8',
  }
  try {
    await execute(
      process.execPath,
      [
        npm,
        'ci',
        '--prefix',
        attempt,
        '--ignore-scripts',
        '--no-audit',
        '--no-fund',
        '--userconfig',
        resolve(attempt, 'npm-user.ini'),
        '--globalconfig',
        resolve(attempt, 'npm-global.ini'),
        '--cache',
        resolve(directory, 'npm-cache'),
      ],
      { cwd: attempt, env, timeout: 240000, maxBuffer: 1048576 },
    )
    const binary = resolve(attempt, binaryRelative)
    const version = await execute(binary, ['--version'], {
      cwd: attempt,
      env: { ...env, CODEX_HOME: attempt },
      timeout: 10000,
    })
    if (version.stdout.trim() !== 'codex-cli ' + codexVersion)
      throw new Error('chat-provider-integrity')
    const hash = digest(await fs.readFile(binary))
    await fs.rename(attempt, ready)
    await writeJSON(resolve(directory, 'installed.json'), {
      version: codexVersion,
      binarySHA256: hash,
    })
    return resolve(ready, binaryRelative)
  } catch (error) {
    throw new Error('chat-provider-install-failed', { cause: error })
  }
}
