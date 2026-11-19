import test from 'node:test'
import assert from 'node:assert/strict'
import * as fs from 'node:fs/promises'
import { resolve } from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { createServer } from 'node:net'
import { setTimeout as delay } from 'node:timers/promises'
import { validatePorts, assertAvailable, shellQuote } from '../scripts/local-app.mjs'

const run = promisify(execFile)
const kit = resolve(import.meta.dirname, '..')
const cli = resolve(kit, 'scripts/local-app.mjs')
const execute = (root, action, extra = []) =>
  run(process.execPath, [cli, action, '--root', root, ...extra], { timeout: 45000 })
async function port() {
  const server = createServer()
  await new Promise((done) => server.listen(0, '127.0.0.1', done))
  const value = server.address().port
  await new Promise((done) => server.close(done))
  return value
}
async function fixture(t) {
  const parent = resolve(kit, 'test-results')
  await fs.mkdir(parent, { recursive: true })
  const root = await fs.mkdtemp(resolve(parent, 'local app '))
  await fs.mkdir(resolve(root, 'scripts'))
  await fs.mkdir(resolve(root, 'public'))
  await fs.writeFile(resolve(root, 'package.json'), '{}')
  await fs.mkdir(resolve(root, 'src/styles'), { recursive: true })
  await fs.writeFile(resolve(root, 'src/styles/tokens.generated.css'), '/* Generated */')
  await fs.copyFile(cli, resolve(root, 'scripts/local-app.mjs'))
  const mock = `
import {createServer} from 'node:http';
import {statSync,appendFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const ui=process.argv.includes('--port');
const port=Number(process.argv[process.argv.indexOf(ui?'--port':'-p')+1]);
const stat=statSync(process.cwd());
const root=createHash('sha256').update(JSON.stringify({dev:stat.dev,ino:stat.ino})).digest('hex');
appendFileSync('starts', (ui?'ui':'book')+'\\n');
if(!ui && process.env.PROBE_BOOK_FAIL==='1') process.exit(5);
const server=createServer((req,res)=>{res.setHeader('X-Fixture-Database',process.env.DATABASE_URL?'configured':'absent');res.end(ui?'<meta name="adl-design-editor-session"><meta content="'+root+'">':'storybook')});
server.listen(port,'127.0.0.1');
process.on('SIGTERM',()=>server.close());
`
  await fs.writeFile(resolve(root, 'scripts/storybook-local.mjs'), mock)
  await fs.mkdir(resolve(root, 'node_modules/@react-router/dev'), { recursive: true })
  await fs.writeFile(resolve(root, 'node_modules/@react-router/dev/bin.js'), mock)
  const ui = await port(),
    book = await port()
  await execute(root, 'configure', ['--ui-port', String(ui), '--storybook-port', String(book)])
  t.after(async () => {
    await execute(root, 'stop').catch(() => {})
  })
  return { root, ui, book }
}

test('ports are explicit, distinct and never borrowed from another listener', async () => {
  for (const pair of [
    [5173, 5173],
    [80, 6006],
    [5173.5, 6006],
    [5173, 65536],
  ])
    assert.throws(() => validatePorts(...pair))
  const server = createServer()
  await new Promise((done) => server.listen(0, '127.0.0.1', done))
  try {
    await assert.rejects(assertAvailable(server.address().port), /occupé/)
  } finally {
    await new Promise((done) => server.close(done))
  }
})

test('Finder paths are shell-quoted, including apostrophes and metacharacters', async () => {
  const value = "/project's folder/$(echo no);`echo no`"
  const { stdout } = await run('/bin/sh', ['-c', 'printf %s ' + shellQuote(value)])
  assert.equal(stdout, value)
})

test('concurrent opens reuse one supervisor, stop preserves sources, restart keeps URLs', async (t) => {
  const { root } = await fixture(t)
  const starts = await Promise.all([execute(root, 'start'), execute(root, 'start')])
  const first = JSON.parse(starts[0].stdout),
    second = JSON.parse(starts[1].stdout)
  assert.deepEqual(first.pids, second.pids)
  assert.equal(first.pids.length, 2)
  assert.equal(await fs.readFile(resolve(root, 'starts'), 'utf8'), 'ui\nbook\n')
  await execute(root, 'stop')
  assert.equal(JSON.parse((await execute(root, 'status')).stdout).phase, 'stopped')
  const next = JSON.parse((await execute(root, 'start')).stdout)
  assert.equal(next.uiURL, first.uiURL)
  assert.equal(next.storybookURL, first.storybookURL)
  assert.equal(
    await fs.readFile(resolve(root, 'src/styles/tokens.generated.css'), 'utf8'),
    '/* Generated */',
  )
})

test('foreign port refuses startup without launching either child', async (t) => {
  const { root, book } = await fixture(t)
  const server = createServer()
  await new Promise((done) => server.listen(book, '127.0.0.1', done))
  try {
    await assert.rejects(execute(root, 'start'), /occupé/)
    await assert.rejects(fs.access(resolve(root, 'starts')))
    assert(server.listening)
  } finally {
    await new Promise((done) => server.close(done))
  }
})

test('partial startup failure closes the writer and reports failure promptly', async (t) => {
  const { root, ui, book } = await fixture(t)
  await assert.rejects(
    run(process.execPath, [cli, 'start', '--root', root], {
      timeout: 15000,
      env: { ...process.env, PROBE_BOOK_FAIL: '1' },
    }),
    /Démarrage échoué/,
  )
  assert.equal(JSON.parse((await execute(root, 'status')).stdout).phase, 'stopped')
  await assertAvailable(ui)
  await assertAvailable(book)
  assert.equal(await fs.readFile(resolve(root, 'starts'), 'utf8'), 'ui\nbook\n')
})

test('a child failure stops its sibling and is never retried in a loop', async (t) => {
  const { root } = await fixture(t)
  const first = JSON.parse((await execute(root, 'start')).stdout)
  process.kill(first.pids[1], 'SIGKILL')
  for (let n = 0; n < 100; n++) {
    const state = await execute(root, 'status').catch(() => null)
    if (state && JSON.parse(state.stdout).phase === 'stopped') break
    await delay(100)
  }
  assert.equal(JSON.parse((await execute(root, 'status')).stdout).phase, 'stopped')
  assert.equal(await fs.readFile(resolve(root, 'starts'), 'utf8'), 'ui\nbook\n')
  assert.throws(() => process.kill(first.pids[0], 0))
})

test('wrong root identity and interrupted owner refuse blind recovery', async (t) => {
  const { root } = await fixture(t)
  const path = resolve(root, '.runtime.local/local-app/config.json')
  const original = JSON.parse(await fs.readFile(path, 'utf8'))
  await fs.writeFile(path, JSON.stringify({ ...original, ino: original.ino + 1 }))
  await assert.rejects(execute(root, 'start'), /instance a changé/)
  await fs.writeFile(path, JSON.stringify(original))
  const owner = resolve(root, '.runtime.local/local-app/owner.json')
  await fs.writeFile(owner, '{"pid":1}')
  await assert.rejects(execute(root, 'start'), /interrompu/)
  await assert.rejects(execute(root, 'stop'), /interrompu/)
  assert.equal(await fs.readFile(owner, 'utf8'), '{"pid":1}')
})

test('code changed under a live supervisor is refused until its original version stops', async (t) => {
  const { root } = await fixture(t)
  await execute(root, 'start')
  const file = resolve(root, 'scripts/storybook-local.mjs')
  const original = await fs.readFile(file)
  await fs.appendFile(file, '\n// different version\n')
  await assert.rejects(execute(root, 'start'), /version active/)
  await fs.writeFile(file, original)
  await execute(root, 'stop')
})

test('private state cannot be redirected by a symlink or readable by other users', async (t) => {
  const { root } = await fixture(t)
  const directory = resolve(root, '.runtime.local/local-app')
  await fs.chmod(resolve(directory, 'config.json'), 0o644)
  await assert.rejects(execute(root, 'start'), /trop accessible/)
  await fs.chmod(resolve(directory, 'config.json'), 0o600)
  await fs.rename(directory, directory + '-kept')
  await fs.symlink(directory + '-kept', directory)
  await assert.rejects(execute(root, 'start'), /non isolé/)
  await fs.unlink(directory)
  await fs.rename(directory + '-kept', directory)
})

test('application loads its own database configuration while Storybook remains offline', async (t) => {
  const { root, ui, book } = await fixture(t)
  await fs.writeFile(
    resolve(root, '.env.local'),
    'DATABASE_URL=postgresql://synthetic:synthetic@127.0.0.1:5432/fake\n',
  )
  await execute(root, 'start')
  assert.equal(
    (await fetch(`http://127.0.0.1:${ui}/`)).headers.get('X-Fixture-Database'),
    'configured',
  )
  assert.equal(
    (await fetch(`http://127.0.0.1:${book}/`)).headers.get('X-Fixture-Database'),
    'absent',
  )
})
