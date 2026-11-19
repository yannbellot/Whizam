import assert from 'node:assert/strict'
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import process from 'node:process'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const generation = spawnSync(process.execPath, ['scripts/generate-tokens.mjs'], {
  cwd: projectRoot,
  stdio: 'inherit',
})
assert.equal(generation.status, 0, 'Token generation failed')
const temporaryRoot = join(projectRoot, '.boundary-check.local')
mkdirSync(temporaryRoot, { recursive: true })
const scratch = mkdtempSync(join(temporaryRoot, 'run-'))

try {
  for (const name of [
    'app',
    'src',
    'public',
    'package.json',
    'package-lock.json',
    'react-router.config.ts',
    'vite.config.ts',
    'tsconfig.json',
    'config',
    'scripts',
  ]) {
    cpSync(join(projectRoot, name), join(scratch, name), { recursive: true })
  }
  // Architecture is a downloadable UI Lab asset and therefore part of the build input.
  mkdirSync(join(scratch, 'docs/design-system'), { recursive: true })
  cpSync(
    join(projectRoot, 'docs/design-system/architecture.md'),
    join(scratch, 'docs/design-system/architecture.md'),
  )
  symlinkSync(join(projectRoot, 'node_modules'), join(scratch, 'node_modules'), 'dir')
  const devRoot = join(projectRoot, 'node_modules', '@react-router', 'dev')
  const { bin } = JSON.parse(readFileSync(join(devRoot, 'package.json'), 'utf8'))
  const cli = resolve(devRoot, bin['react-router'])
  const build = () =>
    spawnSync(process.execPath, [cli, 'build'], {
      cwd: scratch,
      env: { ...process.env, NODE_ENV: 'production' },
      encoding: 'utf8',
      timeout: 60000,
    })

  const baseline = build()
  assert.equal(
    baseline.status,
    0,
    `Isolated baseline build failed:\n${baseline.stderr}\n${baseline.stdout}`,
  )
  // The root route is mandatory; the starter home route may be replaced by a derived project.
  writeFileSync(
    join(scratch, 'app', 'root.tsx'),
    [
      "import { getHealth } from './server/runtime.server'",
      'export default function InvalidClientBoundary() {',
      '  return <p>{getHealth().status}</p>',
      '}',
    ].join('\n'),
  )

  const rejected = build()
  const diagnostic = `${rejected.stderr}\n${rejected.stdout}`
  assert.equal(typeof rejected.status, 'number', 'Negative build did not finish normally')
  assert.notEqual(rejected.status, 0, 'Client import of a server module was accepted')
  assert.match(diagnostic, /server-only module/i)
  assert.match(diagnostic, /runtime\.server/)
  console.log('PASS: isolated baseline builds; client import of .server module is rejected')
} finally {
  // Only this invocation’s newly-created directory is removed, including its symlink.
  rmSync(scratch, { recursive: true, force: true })
}
