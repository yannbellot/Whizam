import { createServer } from 'node:http'
import { agentChat } from '../scripts/core/agent-chat.mjs'
import { stateDirectory, writeJSON } from '../scripts/agent-chat/private.mjs'
import test from 'node:test'
import assert from 'node:assert/strict'
import * as fs from 'node:fs/promises'
import { join } from 'node:path'
import { capabilities, runLocalService, workspaceURLs } from '../scripts/core/local-service.mjs'

async function fixture(t) {
  const directory = join(import.meta.dirname, '../test-results')
  await fs.mkdir(directory, { recursive: true })
  const root = await fs.mkdtemp(join(directory, 'service with spaces '))
  await fs.mkdir(join(root, 'scripts'))
  await fs.mkdir(join(root, 'public'))
  await fs.mkdir(join(root, 'src/styles'), { recursive: true })
  await fs.writeFile(join(root, 'src/styles/tokens.generated.css'), '/* Generated */')
  await fs.writeFile(
    join(root, 'package.json'),
    JSON.stringify({
      name: 'fixture',
      version: '1.0',
      type: 'module',
      scripts: { dev: 'node scripts/-local.mjs' },
    }),
  )
  for (const name of ['ui-lab-local.mjs', 'storybook-local.mjs'])
    await fs.writeFile(join(root, 'scripts', name), '')
  await fs.writeFile(
    join(root, 'scripts/local-app.mjs'),
    `
import {appendFileSync} from 'node:fs';
appendFileSync('calls',JSON.stringify(process.argv.slice(2))+'\\n');
if(process.argv[2]==='stop') console.log('arrêté');
else console.log(JSON.stringify({phase:'ready',uiURL:'http://127.0.0.1:5173/',storybookURL:'http://127.0.0.1:6006/'}));
`,
  )
  t.after(() => fs.rm(root, { recursive: true, force: true }))
  return root
}
test('unavailable and arbitrary operations are refused before filesystem access', async () => {
  for (const op of ['__proto__', 'constructor', 'shell', 'ai.arbitrary'])
    await assert.rejects(runLocalService(op, { root: '/not-used' }), /non disponible/)
  assert.equal(capabilities['project.export'], true)
})
test('local clients inspect the project and share the same supervisor without shell interpolation', async (t) => {
  const root = await fixture(t)
  assert.equal((await runLocalService('project.inspect', { root })).name, 'fixture')
  assert.equal((await runLocalService('runtime.start', { root })).phase, 'ready')
  assert.equal((await runLocalService('runtime.status', { root })).protocolVersion, 1)
  assert.equal((await runLocalService('runtime.stop', { root })).phase, 'stopped')
  const calls = (await fs.readFile(join(root, 'calls'), 'utf8')).trim().split('\n').map(JSON.parse)
  assert.deepEqual(
    calls.map((c) => c[0]),
    ['start', 'status', 'stop'],
  )
  assert(calls.every((c) => c[1] === '--root' && c[2] === root))
})
test('an incompatible directory cannot execute a project script', async (t) => {
  const root = await fixture(t)
  await fs.writeFile(join(root, 'package.json'), '{}')
  await assert.rejects(runLocalService('runtime.start', { root }), /incompatible/)
  await assert.rejects(fs.access(join(root, 'calls')))
})

test('workspace endpoints are exact loopback services and preview is the actual project root', () => {
  assert.deepEqual(workspaceURLs('http://127.0.0.1:5173/', 'http://127.0.0.1:6006/'), {
    uiLab: 'http://127.0.0.1:5173/',
    storybook: 'http://127.0.0.1:6006/',
    preview: 'http://127.0.0.1:5173/',
  })
  for (const ui of [
    'https://127.0.0.1:5173/',
    'http://localhost:5173/',
    'http://127.0.0.1:80/',
    'http://user@127.0.0.1:5173/',
    'http://127.0.0.1:5173/?target=other',
    'http://127.0.0.1:5173/other',
    'http://other.invalid:5173/',
    'http://127.0.0.1:5173/#other',
  ])
    assert.throws(() => workspaceURLs(ui, 'http://127.0.0.1:6006/'))
  for (const book of [
    'http://127.0.0.1:5173/',
    'http://127.0.0.1:6006/other',
    'https://other.invalid/',
  ])
    assert.throws(() => workspaceURLs('http://127.0.0.1:5173/', book))
})

test('private control keeps account errors in successful snapshots distinct from transport refusal', async (t) => {
  const root = await fixture(t)
  let status = 200
  const server = createServer((req, res) => {
    assert.equal(req.headers.authorization, 'Bearer synthetic-private-control')
    res.writeHead(status, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ connected: true, error: 'chat-login-failed' }))
  })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  t.after(() => new Promise((resolve) => server.close(resolve)))
  const state = await stateDirectory(root)
  await writeJSON(join(state, 'owner.json'), {
    origin: `http://127.0.0.1:${server.address().port}`,
    nonce: 'synthetic-private-control',
    pid: process.pid,
    version: 1,
  })
  const context = { treeId: null, command: 'snapshot', payload: {} }
  assert.deepEqual(await agentChat('ai.context', { root, tool: root, context }), {
    connected: true,
    error: 'chat-login-failed',
  })
  status = 409
  await assert.rejects(
    agentChat('ai.context', { root, tool: root, context }),
    /chat-control-failed/,
  )
})
