import test from 'node:test'
import assert from 'node:assert/strict'
import { createServer, request as httpRequest } from 'node:http'
import * as fs from 'node:fs/promises'
import { randomBytes, randomUUID } from 'node:crypto'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { editorFixture } from './helpers/editor-fixture.mjs'
import { createStore } from '../scripts/design-editor/store.mjs'
import { createEditorHTTP } from '../scripts/design-editor/http.mjs'
const target = 'component.button.default.root.background.default'
async function fixture(run) {
  const root = await editorFixture(),
    store = await createStore(root),
    token = randomBytes(32).toString('hex')
  let handler,
    drop = false
  const server = createServer((req, res) => {
    if (drop && req.url.endsWith('/save')) {
      drop = false
      res.end = () => {
        res.socket.destroy()
        return res
      }
    }
    void handler(req, res)
  })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  const origin = `http://127.0.0.1:${server.address().port}`
  handler = createEditorHTTP({
    store,
    token,
    origin,
    observation: () => ({ version: 3, settled: true }),
  })
  const call = (action, input = {}, options = {}) =>
    new Promise((resolve, reject) => {
      const body = options.raw ?? JSON.stringify(input)
      const req = httpRequest(
        origin + '/__design-system/editor/' + action,
        {
          method: options.method ?? 'POST',
          headers: options.rawHeaders ?? {
            Host: new URL(origin).host,
            Origin: origin,
            'X-Design-Editor-Session': token,
            'Content-Type': 'application/json',
            ...options.headers,
          },
        },
        (res) => {
          const chunks = []
          res.on('data', (chunk) => chunks.push(chunk))
          res.on('end', () =>
            resolve({
              status: res.statusCode,
              headers: res.headers,
              text: Buffer.concat(chunks).toString(),
              json: JSON.parse(Buffer.concat(chunks).toString()),
            }),
          )
        },
      )
      req.on('error', reject)
      if (options.chunks) for (const chunk of options.chunks) req.write(chunk)
      else req.write(body)
      req.end()
    })
  try {
    await run({
      root,
      store,
      token,
      origin,
      call,
      drop: () => {
        drop = true
      },
    })
  } finally {
    server.closeAllConnections()
    await new Promise((resolve) => server.close(resolve))
    await store.close()
    await fs.rm(root, { recursive: true, force: true })
  }
}
test('HTTP saves actual sources, protects reads, and exposes only closed receipts', () =>
  fixture(async ({ root, token, call }) => {
    const loaded = await call('snapshot')
    assert.equal(loaded.status, 200)
    assert.match(loaded.json.rootId, /^[a-f0-9]{64}$/)
    assert.equal(loaded.headers['cache-control'], 'no-store')
    assert.equal(loaded.headers['access-control-allow-origin'], undefined)
    const body = {
      protocolVersion: 4,
      requestId: randomUUID(),
      baseRevision: loaded.json.revision,
      operations: [{ kind: 'set-component-token', target, value: '#123456' }],
    }
    const saved = await call('save', body)
    assert.equal(saved.status, 200)
    assert.equal(saved.json.status, 'saved')
    assert.deepEqual((await call('save', body)).json, saved.json)
    assert.deepEqual((await call('status', { requestId: body.requestId })).json, saved.json)
    const after = await call('snapshot')
    assert.equal(after.json.revision, saved.json.revision)
    assert(!saved.text.includes(root))
    assert(!saved.text.includes(token))
    assert(!after.text.includes(token))
  }))
test('real origin, host, capability, method and format refusals leave generation unchanged', () =>
  fixture(async ({ call, origin, token }) => {
    const loaded = await call('snapshot')
    const checks = [
      { method: 'GET', code: 405 },
      { headers: { Origin: '' }, code: 403 },
      {
        rawHeaders: [
          'Host',
          new URL(origin).host,
          'Content-Type',
          'application/json',
          'X-Design-Editor-Session',
          token,
        ],
        code: 403,
      },
      { headers: { Origin: 'null' }, code: 403 },
      { headers: { Origin: 'https://foreign.invalid' }, code: 403 },
      { headers: { Host: 'foreign.invalid' }, code: 403 },
      { headers: { 'X-Design-Editor-Session': 'wrong' }, code: 403 },
      { headers: { Forwarded: 'host=127.0.0.1' }, code: 403 },
      { headers: { 'X-Forwarded-Host': new URL(origin).host }, code: 403 },
      { headers: { 'Sec-Fetch-Site': 'cross-site' }, code: 403 },
      { headers: { 'Content-Type': 'text/plain' }, code: 415 },
      { headers: { 'Content-Encoding': 'gzip' }, code: 415 },
      { raw: '{"a":1,"a":2}', code: 400 },
      { raw: '{"a":1e309}', code: 400 },
      {
        raw: JSON.stringify({ a: Array.from({ length: 18 }).reduce((value) => ({ a: value }), 1) }),
        code: 413,
      },
      {
        chunks: [Buffer.alloc(32768, 0x20), Buffer.alloc(32768, 0x20), Buffer.alloc(16, 0x20)],
        code: 413,
      },
      { headers: { 'Content-Length': '70000' }, raw: '{}', code: 413 },
      {
        rawHeaders: [
          'Host',
          new URL(origin).host,
          'Origin',
          origin,
          'Origin',
          origin,
          'Content-Type',
          'application/json',
          'X-Design-Editor-Session',
          token,
        ],
        code: 403,
      },
    ]
    for (const options of checks)
      assert.equal(
        (await call('snapshot', {}, options)).status,
        options.code,
        JSON.stringify(options),
      )
    assert.equal((await call('snapshot')).json.revision, loaded.json.revision)
  }))
test('lost response is resolved through status and identical retry without duplicate mutation', () =>
  fixture(async ({ call, drop }) => {
    const { revision } = (await call('snapshot')).json
    const body = {
      protocolVersion: 4,
      requestId: randomUUID(),
      baseRevision: revision,
      operations: [{ kind: 'set-component-token', target, value: '#123456' }],
    }
    drop()
    await assert.rejects(call('save', body))
    const receipt = await call('status', { requestId: body.requestId })
    assert.equal(receipt.json.status, 'saved')
    assert.deepEqual((await call('save', body)).json, receipt.json)
    const loaded = (await call('snapshot')).json
    assert.equal(
      loaded.snapshot.model.primitives.filter((primitive) => primitive.value === '#123456').length,
      1,
    )
    assert.equal(
      (await call('save', { ...body, operations: [{ kind: 'restore', target }] })).json.issues[0]
        .code,
      'request-id-reused',
    )
  }))
test('another actual process cannot acquire the same writer root', () =>
  fixture(async ({ root }) => {
    const script = `import {createStore} from ${JSON.stringify(new URL('../scripts/design-editor/store.mjs', import.meta.url).href)};try{const store=await createStore(${JSON.stringify(root)});await store.close();process.exitCode=1}catch(error){if(error.message!=='service-unavailable')throw error}`
    const result = await promisify(execFile)(process.execPath, [
      '--input-type=module',
      '-e',
      script,
    ])
    assert.equal(result.stderr, '')
  }))

test('standalone style creation requires chat after capability/origin validation', () =>
  fixture(async ({ store, call }) => {
    const before = await store.snapshot()
    const body = {
      protocolVersion: 4,
      requestId: randomUUID(),
      baseRevision: before.revision,
      operations: [{ kind: 'create-style', target, intention: 'actions.recovery', value: '#abc' }],
    }
    assert.equal(
      (await call('save', body, { headers: { 'X-Design-Editor-Session': 'b'.repeat(64) } })).status,
      403,
    )
    assert.equal(
      (await call('save', body, { headers: { Origin: 'http://untrusted.invalid' } })).status,
      403,
    )
    const saved = await call('save', body)
    assert.equal(saved.status, 422)
    assert.equal(saved.json.code, 'chat-creation-required')
    assert.deepEqual(
      (await store.snapshot()).snapshot.model.bindings,
      before.snapshot.model.bindings,
    )
    assert.deepEqual((await call('save', body)).json, saved.json)
  }))

test('body deadline ends after complete input and does not abort a valid slow publication', () =>
  fixture(async ({ store, call }) => {
    const loaded = await call('snapshot')
    const save = store.save.bind(store)
    let running
    store.save = (...args) => {
      running = (async () => {
        await new Promise((resolve) => setTimeout(resolve, 6100))
        return save(...args)
      })()
      return running
    }
    try {
      const result = await call('save', {
        protocolVersion: 4,
        requestId: randomUUID(),
        baseRevision: loaded.json.revision,
        operations: [{ kind: 'set-component-token', target, value: '#123456' }],
      })
      assert.equal(result.status, 200)
      assert.equal(result.json.status, 'saved')
    } finally {
      await running
    }
  }))

test('body deadline still closes an incomplete upload without changing the generation', () =>
  fixture(async ({ origin, token, call }) => {
    const before = await call('snapshot')
    await assert.rejects(
      new Promise((resolve, reject) => {
        const request = httpRequest(
          origin + '/__design-system/editor/save',
          {
            method: 'POST',
            agent: false,
            headers: {
              Host: new URL(origin).host,
              Origin: origin,
              'X-Design-Editor-Session': token,
              'Content-Type': 'application/json',
              'Content-Length': '2',
            },
          },
          () => reject(new Error('Incomplete upload received a successful response')),
        )
        request.on('error', reject)
        request.write('{')
      }),
      { code: 'ECONNRESET' },
    )
    assert.equal((await call('snapshot')).json.revision, before.json.revision)
  }))

test('reference version requires same-origin capability', async () =>
  fixture(async ({ call }) => {
    const valid = await call('version')
    assert.equal(valid.status, 200)
    assert.deepEqual(valid.json, { version: 3, settled: true })
    assert.equal(
      (await call('version', {}, { headers: { Origin: 'http://foreign.invalid' } })).status,
      403,
    )
    assert.equal(
      (await call('version', {}, { headers: { 'X-Design-Editor-Session': '0'.repeat(64) } }))
        .status,
      403,
    )
  }))

test('font imports require the same local capability and reject arbitrary sources without writing', async () => {
  await fixture(async ({ call, root }) => {
    assert.equal(
      (await call('fonts/import', { id: 'inter' }, { headers: { Origin: 'http://example.test' } }))
        .status,
      403,
    )
    assert.equal(
      (
        await call(
          'fonts/import',
          { id: 'inter' },
          { headers: { 'X-Design-Editor-Session': '0'.repeat(64) } },
        )
      ).status,
      403,
    )
    assert.equal((await call('fonts/import', { id: 'inter' }, { method: 'GET' })).status, 405)
    assert.equal(
      (await call('fonts/import', { id: 'inter', url: 'http://127.0.0.1/private' })).status,
      400,
    )
    assert.equal((await call('fonts/import', { id: '../escape' })).status, 400)
    assert.equal((await call('fonts/import', { id: 'unknown' })).status, 503)
    await assert.rejects(fs.stat(root + '/public/fonts'), { code: 'ENOENT' })
  })
})
