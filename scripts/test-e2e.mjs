import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs'
import { createServer } from 'node:net'
import { dirname, join, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const cache = join(root, '.runtime.local', 'playwright')
const temporaryRoot = join(root, '.runtime.local', 'tmp')
mkdirSync(cache, { recursive: true })
mkdirSync(temporaryRoot, { recursive: true })
const temporary = mkdtempSync(join(temporaryRoot, 'e2e-'))
const reserve = createServer()

try {
  await new Promise((accept, reject) => {
    reserve.once('error', reject)
    reserve.listen(0, '127.0.0.1', accept)
  })
  const address = reserve.address()
  if (!address || typeof address === 'string') throw new Error('Local test port unavailable')
  await new Promise((accept, reject) =>
    reserve.close((error) => (error ? reject(error) : accept())),
  )
  const install = process.argv.includes('--install')
  const args = install
    ? ['install', 'chromium']
    : ['test', '--config', 'config/testing/playwright.config.ts', ...process.argv.slice(2)]
  const result = spawnSync(
    process.execPath,
    [join(root, 'node_modules/@playwright/test/cli.js'), ...args],
    {
      cwd: root,
      env: {
        ...process.env,
        ADL_E2E_PORT: String(address.port),
        DATABASE_URL: '',
        PLAYWRIGHT_BROWSERS_PATH: cache,
        TMPDIR: temporary,
      },
      stdio: 'inherit',
      timeout: install ? 240000 : 120000,
    },
  )
  if (result.error) throw result.error
  process.exitCode = result.status ?? 1
} finally {
  reserve.close()
  rmSync(temporary, { recursive: true, force: true })
}
