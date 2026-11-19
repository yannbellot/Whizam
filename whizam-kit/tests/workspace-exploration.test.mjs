import test from 'node:test'
import assert from 'node:assert/strict'
import { createServer } from 'node:http'
import { randomBytes } from 'node:crypto'
import { fixture } from './helpers/workspace.mjs'
import { explorationSnapshot } from '../scripts/core/workspace-exploration.ts'
import { createEditorHTTP } from '../scripts/design-editor/http.mjs'

test('exploration reads the served physical version and never returns private roots', async (t) => {
  const f = await fixture(t)
  const current = await explorationSnapshot(f.store.treeRoot(f.treeId))
  assert.equal(current.available, true)
  assert.equal(current.treeId, f.treeId)
  assert.equal(current.selected, true)
  assert.equal(JSON.stringify(current).includes(f.root), false)
  const main = await explorationSnapshot(f.root)
  assert.equal(main.treeId, null)
  assert.equal(main.selected, false)
  assert.equal(main.writable, false)
})
test('exploration HTTP uses existing origin/capability and accepts only an empty read request', async (t) => {
  const token = randomBytes(32).toString('hex')
  let reads = 0,
    handler
  const server = createServer((req, res) => void handler(req, res))
  await new Promise((r) => server.listen(0, '127.0.0.1', r))
  t.after(async () => {
    server.closeAllConnections()
    await new Promise((r) => server.close(r))
  })
  const origin = 'http://127.0.0.1:' + server.address().port
  handler = createEditorHTTP({
    store: { busy: false },
    token,
    origin,
    exploration: async () => {
      reads++
      return { available: false }
    },
  })
  const call = (body = {}, headers = {}, action = 'project/exploration') =>
    fetch(origin + '/__design-system/editor/' + action, {
      method: 'POST',
      headers: {
        Origin: origin,
        'Content-Type': 'application/json',
        'X-Design-Editor-Session': token,
        ...headers,
      },
      body: JSON.stringify(body),
    })
  assert.equal((await call({}, { Origin: 'https://foreign.invalid' })).status, 403)
  assert.equal((await call({}, { 'X-Design-Editor-Session': '0'.repeat(64) })).status, 403)
  assert.equal((await call({ root: '/other' })).status, 400)
  assert.equal((await call({}, {}, 'project/integrate')).status, 403)
  assert.equal(reads, 0)
  const response = await call()
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { available: false })
  assert.equal(reads, 1)
})
