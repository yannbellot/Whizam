import { test } from 'node:test'
import assert from 'node:assert/strict'
import * as fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import { fileURLToPath } from 'node:url'
import { parse, stringify } from 'yaml'
import {
  readTokens,
  loadTokens,
  synchronize,
  prepare,
  ensurePrimitive,
  tokenFile,
  extension,
} from '../scripts/design-system.mjs'
const root = fileURLToPath(new URL('..', import.meta.url))
async function fixture(t) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'ds-auto-test-'))
  t.after(() => fs.rm(dir, { recursive: true, force: true }))
  for (const name of ['src', 'app', 'docs/design-system'])
    await fs.cp(path.join(root, name), path.join(dir, name), {
      recursive: true,
      filter: (p) => !p.includes('.generated.'),
    })
  return dir
}
async function document(dir) {
  return JSON.parse(await fs.readFile(path.join(dir, tokenFile), 'utf8'))
}
const firstComponent = (d) => readTokens(d).entries.find((e) => e.meta.kind === 'component')
test('migration preserves every retained resolved value and removes the decision layer', async () => {
  const model = await loadTokens(root)
  const mapping = JSON.parse(
    await fs.readFile(path.join(root, 'docs/design-system/simple-token-migration.json'), 'utf8'),
  )
  for (const e of mapping.tokens) {
    const actual = model.ids.get(e.to)
    assert.ok(actual, e.to)
    assert.deepEqual(actual.value, e.value, e.from)
    assert.equal(actual.css, e.css)
  }
  assert.deepEqual([...new Set(model.entries.map((e) => e.meta.kind))].sort(), [
    'component',
    'local',
    'primitive',
  ])
})
test('only direct typed primitive references are allowed, including local page scopes', async () => {
  const d = await document(root),
    component = firstComponent(d)
  component.node.$value = '{' + component.path + '}'
  assert.throws(() => readTokens(d), /reference a primitive/)
  const d2 = await document(root),
    c2 = firstComponent(d2)
  c2.node.$type = 'duration'
  assert.throws(() => readTokens(d2), /type mismatch/)
  const d3 = await document(root),
    local = readTokens(d3).entries.find((e) => e.meta.kind === 'local')
  local.meta.owner = 'instance/button-1'
  assert.throws(() => readTokens(d3), /Local tokens belong/)
})
test('new values reuse compatible primitives without mutating consumed values or converting units', async () => {
  const d = await document(root),
    before = JSON.stringify(d)
  const id = ensurePrimitive(d, 'dimension', { value: 17, unit: 'px' })
  assert.equal(ensurePrimitive(d, 'dimension', { value: 17, unit: 'px' }), id)
  assert.notEqual(ensurePrimitive(d, 'dimension', { value: 17, unit: 'rem' }), id)
  const old = readTokens(JSON.parse(before))
  const after = readTokens(d)
  for (const e of old.entries) assert.deepEqual(after.ids.get(e.id).value, e.value)
})
test('generation is byte-idempotent; check detects stale output without changing sources', async (t) => {
  const dir = await fixture(t)
  await synchronize(dir)
  const a = await prepare(dir)
  await synchronize(dir)
  await synchronize(dir, { check: true })
  assert.deepEqual([...(await prepare(dir)).outputs], [...a.outputs])
  const output = path.join(dir, 'src/styles/tokens.generated.css')
  await fs.writeFile(output, '/* Generated */\nstale')
  const source = await fs.readFile(path.join(dir, tokenFile), 'utf8')
  await assert.rejects(synchronize(dir, { check: true }), /Stale/)
  assert.equal(await fs.readFile(path.join(dir, tokenFile), 'utf8'), source)
  assert.equal(await fs.readFile(output, 'utf8'), '/* Generated */\nstale')
})
test('invalid references fail before any output publication', async (t) => {
  const dir = await fixture(t)
  await synchronize(dir)
  const before = await fs.readFile(path.join(dir, 'src/styles/tokens.generated.css'), 'utf8')
  const d = await document(dir)
  firstComponent(d).node.$value = '{missing.primitive}'
  await fs.writeFile(path.join(dir, tokenFile), JSON.stringify(d))
  await assert.rejects(synchronize(dir), /reference a primitive/)
  assert.equal(await fs.readFile(path.join(dir, 'src/styles/tokens.generated.css'), 'utf8'), before)
})
test('authored examples drive new story exports and missing fixtures fail coverage', async (t) => {
  const dir = await fixture(t),
    registryFile = path.join(dir, 'src/design-system/authority/components.yaml')
  const registry = parse(await fs.readFile(registryFile, 'utf8')),
    button = registry.designSystemComponents[0]
  await fs.appendFile(
    path.join(dir, button.examples),
    '\nexport const Secondary = { args: { children: "Secondaire" } }\n',
  )
  await synchronize(dir)
  assert.match(await fs.readFile(path.join(dir, button.story), 'utf8'), /export const Secondary/)
  button.requiredExamples.push('MissingState')
  await fs.writeFile(registryFile, stringify(registry))
  await assert.rejects(synchronize(dir), /Missing state fixture/)
})
test('authored output collisions and symlinks are refused', async (t) => {
  const dir = await fixture(t)
  await synchronize(dir)
  const registry = parse(
    await fs.readFile(path.join(dir, 'src/design-system/authority/components.yaml'), 'utf8'),
  )
  const file = path.join(dir, registry.designSystemComponents[0].story)
  await fs.writeFile(file, '// Authored story\n')
  await assert.rejects(synchronize(dir), /Unowned output/)
  assert.equal(await fs.readFile(file, 'utf8'), '// Authored story\n')
  await fs.rm(file)
  await fs.symlink(path.join(dir, 'src/App.tsx'), file)
  await assert.rejects(synchronize(dir), /symlink refused/)
})
test('concurrent or interrupted publication blocks further generation', async (t) => {
  const dir = await fixture(t)
  await fs.mkdir(path.join(dir, '.design-sync.local'))
  await assert.rejects(synchronize(dir), /already running or interrupted/)
})
test('unknown CSS tokens and undeclared exported components are diagnosed', async (t) => {
  const dir = await fixture(t)
  await fs.appendFile(
    path.join(dir, 'src/App.module.css'),
    '\n.bad { color: var(--adl-component-missing); }',
  )
  await assert.rejects(prepare(dir), /Unknown CSS token/)
  await fs.writeFile(
    path.join(dir, 'src/App.module.css'),
    await fs.readFile(path.join(root, 'src/App.module.css')),
  )
  await fs.writeFile(
    path.join(dir, 'src/design-system/components/Undeclared.tsx'),
    'export function Undeclared() { return null }',
  )
  await assert.rejects(prepare(dir), /Undocumented shared component/)
})
test('recipe parameters preserve types and refuse opaque CSS injection', async (t) => {
  const dir = await fixture(t),
    file = path.join(dir, 'src/design-system/authority/recipes.yaml'),
    recipes = parse(await fs.readFile(file, 'utf8'))
  recipes.recipes[0].parts = ['url(https://example.com/collect)']
  await fs.writeFile(file, stringify(recipes))
  await assert.rejects(prepare(dir), /recipe grammar|recipe value/)
})

test('changing a component token preserves all other consumers of its primitive', async () => {
  const { retargetToken } = await import('../scripts/design-system.mjs')
  const d = await document(root),
    before = readTokens(d),
    target = firstComponent(d),
    values = new Map(before.entries.map((e) => [e.id, e.css]))
  retargetToken(d, target.id, target.type, {
    colorSpace: 'srgb',
    components: [0.2, 0.1, 0.8],
    alpha: 1,
  })
  const after = readTokens(d)
  assert.notEqual(after.ids.get(target.id).css, values.get(target.id))
  for (const [id, value] of values) if (id !== target.id) assert.equal(after.ids.get(id).css, value)
})
test('obsolete generated stories are removed while authored examples stay intact', async (t) => {
  const dir = await fixture(t)
  await synchronize(dir)
  const file = path.join(dir, 'src/design-system/authority/components.yaml'),
    registry = parse(await fs.readFile(file, 'utf8'))
  const button = registry.designSystemComponents[0],
    oldStory = button.story,
    authored = await fs.readFile(path.join(dir, button.examples), 'utf8')
  button.story = button.story.replace('.generated.stories', '.documentation.generated.stories')
  await fs.writeFile(file, stringify(registry))
  await synchronize(dir)
  await assert.rejects(fs.access(path.join(dir, oldStory)))
  assert.equal(await fs.readFile(path.join(dir, button.examples), 'utf8'), authored)
})
test('interrupted publication leaves a barrier and explicit recovery restores consistency', async (t) => {
  const dir = await fixture(t)
  await synchronize(dir)
  const { spawnSync } = await import('node:child_process')
  const moduleURL = new URL('../scripts/design-system.mjs', import.meta.url).href
  const child = spawnSync(
    process.execPath,
    [
      '--input-type=module',
      '-e',
      `
 import fs from 'node:fs/promises';import {syncBuiltinESMExports} from 'node:module';
 const original=fs.rename;
 fs.rename=async(...args)=>{await original(...args);process.exit(73)};syncBuiltinESMExports();
 const {synchronize}=await import(${JSON.stringify(moduleURL)});
 await fs.writeFile(${JSON.stringify(path.join(dir, 'src/styles/tokens.generated.css'))},'/* Generated */ stale');
 await synchronize(${JSON.stringify(dir)});
 `,
    ],
    { encoding: 'utf8' },
  )
  assert.equal(child.status, 73, child.stderr)
  await assert.rejects(synchronize(dir), /already running or interrupted/)
  const { recoverGeneration } = await import('../scripts/design-system.mjs')
  await recoverGeneration(dir)
  await synchronize(dir, { check: true })
  assert.ok((await fs.readdir(dir)).some((n) => n.startsWith('.design-sync-recovery-')))
})
test('recovery refuses a live publication owner and preserves the lock', async (t) => {
  const dir = await fixture(t),
    lock = path.join(dir, '.design-sync.local')
  await fs.mkdir(lock)
  await fs.writeFile(path.join(lock, 'owner.json'), JSON.stringify({ pid: process.pid }))
  const { recoverGeneration } = await import('../scripts/design-system.mjs')
  await assert.rejects(recoverGeneration(dir), /still alive/)
  await fs.access(lock)
})

test('new component variants require an explicit corresponding fixture', async (t) => {
  const dir = await fixture(t),
    d = await document(dir),
    target = firstComponent(d)
  target.meta.context.variant = 'secondary'
  await fs.writeFile(path.join(dir, tokenFile), JSON.stringify(d))
  await assert.rejects(prepare(dir), /Missing variant fixture/)
})
