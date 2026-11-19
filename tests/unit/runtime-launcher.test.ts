import { afterEach, describe, expect, it } from 'vitest'
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs'
import { spawnSync } from 'node:child_process'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import process from 'node:process'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const scratch = join(root, '.runtime.local', 'launcher-tests')
const owned: string[] = []
afterEach(() => {
  for (const path of owned.splice(0)) rmSync(path, { recursive: true, force: true })
})

function fixture() {
  mkdirSync(scratch, { recursive: true })
  const parent = mkdtempSync(join(scratch, 'owned-'))
  owned.push(parent)
  const kit = join(parent, 'kit with spaces')
  mkdirSync(join(kit, 'scripts'), { recursive: true })
  cpSync(join(root, 'scripts/with-runtime.sh'), join(kit, 'scripts/with-runtime.sh'))
  cpSync(join(root, 'package.json'), join(kit, 'package.json'))
  writeFileSync(join(kit, '.env.local'), 'PRIVATE_TEST_CONFIGURATION=preserved\n')
  const system = join(parent, 'system')
  mkdirSync(system)
  // Simulate an incompatible machine installation, without changing the host.
  const executable = `'${process.execPath.replaceAll("'", "'\\''")}'`
  writeFileSync(
    join(system, 'node'),
    `#!/bin/sh\nif [ "$1" = --version ]; then printf 'v1.0.0\\n'; else exec ${executable} "$@"; fi\n`,
    { mode: 0o755 },
  )
  writeFileSync(join(system, 'npm'), '#!/bin/sh\nprintf "1.0.0\\n"\n', { mode: 0o755 })
  return { parent, kit, system }
}

function localRuntime(kit: string) {
  const bin = join(kit, '.runtime.local/node/bin')
  const npm = join(kit, '.runtime.local/node/lib/node_modules/npm/bin')
  mkdirSync(bin, { recursive: true })
  mkdirSync(npm, { recursive: true })
  symlinkSync(process.execPath, join(bin, 'node'))
  writeFileSync(join(npm, 'npm-cli.js'), '#!/usr/bin/env node\nconsole.log("11.8.0")\n', {
    mode: 0o755,
  })
  symlinkSync('../lib/node_modules/npm/bin/npm-cli.js', join(bin, 'npm'))
}

function launch(kit: string, system: string, args: string[], cwd = dirname(kit)) {
  return spawnSync('/bin/sh', [join(kit, 'scripts/with-runtime.sh'), ...args], {
    cwd,
    env: { ...process.env, PATH: `${system}:/usr/bin:/bin` },
    encoding: 'utf8',
  })
}

describe('project runtime launcher', () => {
  it('refuses an incompatible machine without installing tools or changing private configuration', () => {
    const { kit, system } = fixture()
    const before = readFileSync(join(kit, '.env.local'), 'utf8')
    const result = launch(kit, system, ['npm', 'ci'])
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('indisponibles')
    expect(readFileSync(join(kit, '.env.local'), 'utf8')).toBe(before)
  })

  it('finds the local Node again after a rename, with a fresh environment and another cwd', () => {
    const { parent, kit, system } = fixture()
    localRuntime(kit)
    const moved = join(parent, 'renamed project')
    renameSync(kit, moved)
    const result = launch(moved, system, ['node', '-e', 'console.log(process.cwd())'])
    expect(result.status, result.stderr).toBe(0)
    expect(result.stdout.trim()).toBe(moved)
  })

  it('passes the local Node and cache to children, preserves arguments and propagates failures', () => {
    const { kit, system } = fixture()
    localRuntime(kit)
    const result = launch(kit, system, [
      'node',
      '-e',
      'const {spawnSync}=require("node:child_process"); const r=spawnSync("node",["-e","console.log(process.version)"],{encoding:"utf8"}); console.log(JSON.stringify([r.stdout.trim(),process.argv[1],process.env.npm_config_cache])); process.exit(7)',
      'a name; $(no command)',
    ])
    expect(result.status).toBe(7)
    expect(JSON.parse(result.stdout)).toEqual([
      process.version,
      'a name; $(no command)',
      join(kit, '.runtime.local/npm-cache'),
    ])
  })

  it('reuses a compatible machine installation ahead of a broken project runtime', () => {
    const { kit, system } = fixture()
    rmSync(join(system, 'node'))
    symlinkSync(process.execPath, join(system, 'node'))
    writeFileSync(join(system, 'npm'), '#!/bin/sh\nprintf "11.8.0\\n"\n', { mode: 0o755 })
    mkdirSync(join(kit, '.runtime.local/node/bin'), { recursive: true })
    writeFileSync(join(kit, '.runtime.local/node/bin/node'), 'broken local file')
    const result = launch(kit, system, ['node', '-e', 'console.log(process.execPath)'])
    expect(result.status, result.stderr).toBe(0)
    expect(result.stdout.trim()).toBe(process.execPath)
  })

  it('refuses an incomplete local npm and never falls through to the incompatible machine', () => {
    const { kit, system } = fixture()
    localRuntime(kit)
    rmSync(join(kit, '.runtime.local/node/lib/node_modules/npm/bin/npm-cli.js'))
    const result = launch(kit, system, ['node', '--version'])
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('incomplet ou incompatible')
  })

  it('preserves a compatible machine installation discovered through a relative PATH', () => {
    const { kit, system } = fixture()
    rmSync(join(system, 'node'))
    symlinkSync(process.execPath, join(system, 'node'))
    writeFileSync(join(system, 'npm'), '#!/bin/sh\nprintf "11.8.0\\n"\n', { mode: 0o755 })
    const result = launch(kit, 'system', [
      'node',
      '-e',
      'const {spawnSync}=require("node:child_process"); const node=spawnSync("node",["--version"],{encoding:"utf8"}); const npm=spawnSync("npm",["--version"],{encoding:"utf8"}); if(node.error || npm.error) throw node.error || npm.error; console.log(JSON.stringify([node.stdout.trim(),npm.stdout.trim()]))',
    ])
    expect(result.status, result.stderr).toBe(0)
    expect(JSON.parse(result.stdout)).toEqual([process.version, '11.8.0'])
  })

  it('selects the local npm override for both the top level and child processes', () => {
    const { kit, system } = fixture()
    localRuntime(kit)
    const packageDir = join(kit, '.runtime.local/npm/node_modules/npm/bin')
    const bin = join(kit, '.runtime.local/npm/node_modules/.bin')
    mkdirSync(packageDir, { recursive: true })
    mkdirSync(bin, { recursive: true })
    writeFileSync(join(packageDir, 'npm-cli.js'), '#!/usr/bin/env node\nconsole.log("11.9.0")\n', {
      mode: 0o755,
    })
    symlinkSync('../npm/bin/npm-cli.js', join(bin, 'npm'))
    const direct = launch(kit, system, ['npm', '--version'])
    expect(direct.status, direct.stderr).toBe(0)
    expect(direct.stdout.trim()).toBe('11.9.0')
    const child = launch(kit, system, [
      'node',
      '-e',
      'const r=require("node:child_process").spawnSync("npm",["--version"],{encoding:"utf8"}); process.stdout.write(r.stdout); process.exit(r.status)',
    ])
    expect(child.status, child.stderr).toBe(0)
    expect(child.stdout.trim()).toBe('11.9.0')
  })
})
