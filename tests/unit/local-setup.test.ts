import { afterEach, describe, expect, it } from 'vitest'
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs'
import { spawnSync } from 'node:child_process'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import process from 'node:process'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const scratchRoot = join(root, '.runtime.local', 'setup-tests')
const owned: string[] = []
afterEach(() => {
  for (const path of owned.splice(0)) rmSync(path, { recursive: true, force: true })
})

describe('local instance configuration', () => {
  it('stays inside its package and preserves identity and credentials after a move', () => {
    mkdirSync(scratchRoot, { recursive: true })
    const parent = mkdtempSync(join(scratchRoot, 'owned-'))
    owned.push(parent)
    const original = join(parent, 'original')
    mkdirSync(join(original, 'scripts'), { recursive: true })
    copyFileSync(join(root, 'scripts/setup-local.mjs'), join(original, 'scripts/setup-local.mjs'))
    writeFileSync(join(parent, '.env.local'), 'PARENT_SENTINEL=unchanged\n')
    const run = (cwd: string) =>
      spawnSync(process.execPath, ['scripts/setup-local.mjs'], { cwd, encoding: 'utf8' })
    const first = run(original)
    expect(first.status, first.stderr).toBe(0)
    const config = readFileSync(join(original, '.env.local'), 'utf8')
    expect(config).toMatch(/^COMPOSE_PROJECT_NAME=adl-[a-f0-9]{12}$/m)
    expect(config).not.toContain('PARENT_SENTINEL')
    expect(statSync(join(original, '.env.local')).mode & 0o777).toBe(0o600)
    const password = config.match(/^POSTGRES_PASSWORD=(.+)$/m)![1]
    expect(first.stdout + first.stderr).not.toContain(password)
    const moved = join(parent, 'renamed with spaces')
    renameSync(original, moved)
    const second = run(moved)
    expect(second.status, second.stderr).toBe(0)
    expect(readFileSync(join(moved, '.env.local'), 'utf8')).toBe(config)
    expect(readFileSync(join(parent, '.env.local'), 'utf8')).toBe('PARENT_SENTINEL=unchanged\n')
    expect(second.stdout + second.stderr).not.toContain(password)
  })
})
