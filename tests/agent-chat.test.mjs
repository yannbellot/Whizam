import test from 'node:test'
import assert from 'node:assert/strict'
import * as fs from 'node:fs/promises'
import { resolve } from 'node:path'
import { randomUUID } from 'node:crypto'
import { ChatManager } from '../scripts/agent-chat/manager.mjs'
import {
  readFile,
  listFiles,
  proposedWrite,
  applyWrite,
  projectBinding,
} from '../scripts/agent-chat/broker.mjs'
import { chatHTTP } from '../scripts/agent-chat/http.mjs'
import {
  contextControl,
  nativeLoginControl,
  nativeAccountControl,
} from '../scripts/agent-chat/context-control.mjs'

class FakeCodex {
  constructor(options) {
    Object.assign(this, options)
    this.work = resolve(options.state, 'work')
    this.calls = []
    this.connected = true
  }
  async start() {}
  async rpc(method, params) {
    this.calls.push({ method, params })
    if (method === 'account/read')
      return {
        account: this.connected ? { type: 'chatgpt', email: 'fixture@example.invalid' } : null,
      }
    if (method === 'account/logout') {
      this.connected = false
      return {}
    }
    if (method === 'account/login/start')
      return {
        authUrl: 'https://auth.openai.com/authorize?state=synthetic',
        loginId: 'synthetic-login',
      }
    if (method === 'thread/start') return { thread: { id: 'thread-' + randomUUID() } }
    if (method === 'turn/start') return { turn: { id: 'turn-' + randomUUID() } }
    return {}
  }
  stop() {
    this.onClose?.('chat-provider-stopped')
  }
}
async function fixture(t) {
  const base = resolve(import.meta.dirname, '../test-results/agent-chat')
  await fs.mkdir(base, { recursive: true })
  const directory = await fs.mkdtemp(resolve(base, 'case-')),
    state = resolve(directory, 'state'),
    root = resolve(directory, 'project with spaces')
  await fs.mkdir(state, { mode: 0o700 })
  await fs.mkdir(root, { mode: 0o700 })
  await fs.writeFile(resolve(root, 'visible.txt'), 'original')
  await fs.writeFile(resolve(root, '.env.local'), 'synthetic secret')
  const manager = await ChatManager.open({
    state,
    tool: root,
    providerFactory: (o) => new FakeCodex(o),
    install: async () => '/fixture/provider',
  })
  const project = await manager.register(root)
  t.after(async () => {
    await manager.close()
    await fs.rm(directory, { recursive: true, force: true })
  })
  return { manager, project, root, directory, state }
}
async function turn(f) {
  const id = await f.manager.newConversation(f.project)
  await f.manager.send(f.project, { conversation: id, text: 'Test', requestId: randomUUID() })
  return f.manager.turn
}
function call(turn, tool, args) {
  return {
    threadId: turn.row.nativeId,
    turnId: turn.id,
    callId: randomUUID(),
    tool,
    arguments: args,
  }
}
async function pending(f, proposal) {
  const active = f.manager.turn
  const result = f.manager.tool(call(active, 'loomata_propose_write', proposal))
  while (!f.manager.approvals.size) await new Promise((done) => setTimeout(done, 5))
  return { result, approval: [...f.manager.approvals.values()][0] }
}

test('broker refuses private, external, linked and multiply linked files; DS and tools stay protected', async (t) => {
  const f = await fixture(t),
    binding = await projectBinding(f.root)
  assert.equal((await readFile(binding, 'visible.txt')).text, 'original')
  await fs.writeFile(resolve(f.directory, 'outside.txt'), 'outside')
  await fs.symlink(resolve(f.directory, 'outside.txt'), resolve(f.root, 'link.txt'))
  await fs.link(resolve(f.directory, 'outside.txt'), resolve(f.root, 'hard.txt'))
  for (const file of ['.env.local', '../outside.txt', 'link.txt', 'hard.txt'])
    await assert.rejects(readFile(binding, file))
  for (const file of [
    'src/design-system/authority/tokens.tokens.json',
    'scripts/test.mjs',
    'package.json',
    'Package.json',
    'SRC/design-system/authority/theme.json',
    'Scripts/test.mjs',
  ])
    await assert.rejects(proposedWrite(binding, { file, text: 'x', reason: 'test' }), /protected/)
  await Promise.all(
    Array.from({ length: 1002 }, (_, i) =>
      fs.writeFile(resolve(f.root, 'entry-' + i + '.txt'), 'synthetic'),
    ),
  )
  assert.equal((await listFiles(binding)).length, 1000)
})
test('a real write happens only after the matching explicit approval, once', async (t) => {
  const f = await fixture(t)
  await turn(f)
  const { result, approval } = await pending(f, {
    file: 'visible.txt',
    text: 'approved',
    reason: 'Test explicit approval',
  })
  assert.equal(await fs.readFile(resolve(f.root, 'visible.txt'), 'utf8'), 'original')
  await f.manager.approve(f.project, { id: approval.id, decision: 'approve' })
  assert.equal((await result).success, true)
  assert.equal(await fs.readFile(resolve(f.root, 'visible.txt'), 'utf8'), 'approved')
  await assert.rejects(
    f.manager.approve(f.project, { id: approval.id, decision: 'approve' }),
    /obsolete/,
  )
})
test('refusal, interruption, obsolete and foreign approval execute no write', async (t) => {
  const f = await fixture(t)
  await turn(f)
  let p = await pending(f, { file: 'visible.txt', text: 'bad', reason: 'refusal' })
  await f.manager.approve(f.project, { id: p.approval.id, decision: 'deny' })
  assert.equal((await p.result).success, false)
  p = await pending(f, { file: 'visible.txt', text: 'bad', reason: 'interruption' })
  const otherRoot = resolve(f.directory, 'other')
  await fs.mkdir(otherRoot)
  const other = await f.manager.register(otherRoot)
  await assert.rejects(
    f.manager.approve(other, { id: p.approval.id, decision: 'approve' }),
    /obsolete/,
  )
  await f.manager.interrupt(f.project)
  assert.equal((await p.result).success, false)
  await assert.rejects(
    f.manager.approve(f.project, { id: p.approval.id, decision: 'approve' }),
    /obsolete/,
  )
  assert.equal(await fs.readFile(resolve(f.root, 'visible.txt'), 'utf8'), 'original')
})
test('changed file revision and changed root are rejected before saving', async (t) => {
  const f = await fixture(t),
    binding = await projectBinding(f.root)
  const proposal = await proposedWrite(binding, {
    file: 'visible.txt',
    text: 'new',
    reason: 'test',
  })
  await fs.writeFile(resolve(f.root, 'visible.txt'), 'user work')
  await assert.rejects(applyWrite(binding, proposal), /changed/)
  const old = resolve(f.directory, 'previous')
  await fs.rename(f.root, old)
  await fs.mkdir(f.root, { mode: 0o700 })
  await assert.rejects(readFile(binding, 'visible.txt'), /changed/)
  assert.equal(await fs.readFile(resolve(old, 'visible.txt'), 'utf8'), 'user work')
})
test('history restores without replaying a message, command or pending approval', async (t) => {
  const f = await fixture(t)
  const active = await turn(f)
  await f.manager.save()
  const restored = await ChatManager.open({
    state: f.state,
    tool: f.root,
    providerFactory: (o) => new FakeCodex(o),
    install: async () => '/fixture/provider',
  })
  const project = await restored.register(f.root)
  assert.equal(restored.snapshot(project).conversations[0].status, 'interrupted')
  assert.equal(restored.provider, null)
  assert.equal(restored.approvals.size, 0)
  await restored.ensure(project)
  await restored.send(project, {
    conversation: active.row.id,
    text: 'Continue',
    requestId: randomUUID(),
  })
  assert(
    restored.provider.calls.some(
      (c) => c.method === 'thread/resume' && c.params.threadId === active.row.nativeId,
    ),
  )
  assert.equal(restored.provider.calls.filter((c) => c.method === 'turn/start').length, 1)
  await restored.close()
})
test('project and account isolation are enforced even with known conversation ids', async (t) => {
  const f = await fixture(t),
    id = await f.manager.newConversation(f.project)
  const otherRoot = resolve(f.directory, 'other')
  await fs.mkdir(otherRoot)
  const other = await f.manager.register(otherRoot)
  assert.equal(f.manager.snapshot(other).conversations.length, 0)
  await assert.rejects(
    f.manager.send(other, { conversation: id, text: 'bad', requestId: randomUUID() }),
    /foreign/,
  )
  await f.manager.ensure(f.project)
  f.manager.index.conversations[0].accountRef = 'other-account'
  await assert.rejects(
    f.manager.send(f.project, { conversation: id, text: 'bad', requestId: randomUUID() }),
    /account-changed/,
  )
})
test('HTTP capability belongs only to the chat document; origin, paths, bodies and project are guarded', async (t) => {
  const f = await fixture(t),
    web = resolve(f.directory, 'web')
  await fs.mkdir(web)
  await fs.writeFile(
    resolve(web, 'index.html'),
    '<!doctype html><head><!-- LOOMATA_BOOTSTRAP --></head>',
  )
  const http = await chatHTTP({ manager: f.manager, web })
  t.after(() => new Promise((done) => http.server.close(done)))
  const url = http.origin + '/assistant/' + f.project.id
  const response = await fetch(url)
  const html = await response.text()
  assert(html.includes(f.project.token))
  assert(!html.includes(f.root))
  assert.equal(response.headers.get('cache-control'), 'no-store')
  const post = (body, headers = {}) =>
    fetch(url + '/command', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: http.origin,
        Authorization: 'Bearer ' + f.project.token,
        ...headers,
      },
      body: JSON.stringify(body),
    })
  assert.equal((await post({ operation: 'snapshot' })).status, 200)
  assert.equal(
    (await post({ operation: 'snapshot' }, { Origin: 'https://example.invalid' })).status,
    403,
  )
  assert.equal(
    (await post({ operation: 'snapshot' }, { Authorization: 'Bearer wrong' })).status,
    403,
  )
  assert.equal(
    (await post({ operation: 'shell', payload: { command: 'touch private' } })).status,
    409,
  )
  assert.equal((await post({ operation: 'snapshot', root: '/arbitrary' })).status, 400)
  assert.equal(
    (await fetch(http.origin + '/.runtime.local/agent-chat/conversations.json')).status,
    404,
  )
  assert.equal((await fetch(http.origin + '/control', { method: 'POST', body: '{}' })).status, 403)
})

test('parallel sends and repeated client ids do not start a second turn', async (t) => {
  const f = await fixture(t),
    id = await f.manager.newConversation(f.project),
    requestId = randomUUID()
  const args = { conversation: id, text: 'One message', requestId }
  const results = await Promise.allSettled([
    f.manager.send(f.project, args),
    f.manager.send(f.project, args),
  ])
  assert.equal(results.filter((r) => r.status === 'fulfilled').length, 1)
  assert.equal(f.manager.provider.calls.filter((c) => c.method === 'turn/start').length, 1)
  await f.manager.interrupt(f.project)
  await assert.rejects(f.manager.send(f.project, args), /duplicate/)
})
test('expired approval and a foreign turn cannot write', async (t) => {
  const f = await fixture(t),
    active = await turn(f)
  const foreign = await f.manager.tool({
    ...call(active, 'loomata_propose_write', {
      file: 'visible.txt',
      text: 'foreign',
      reason: 'test',
    }),
    turnId: 'foreign',
  })
  assert.equal(foreign.success, false)
  const p = await pending(f, { file: 'visible.txt', text: 'expired', reason: 'test' })
  p.approval.expiresAt = Date.now() - 1
  await assert.rejects(
    f.manager.approve(f.project, { id: p.approval.id, decision: 'approve' }),
    /obsolete/,
  )
  f.manager.finishApproval(p.approval.id, 'expired')
  assert.equal((await p.result).success, false)
  assert.equal(await fs.readFile(resolve(f.root, 'visible.txt'), 'utf8'), 'original')
})
test('corrupt or unknown private history is refused without silently replacing it', async (t) => {
  const f = await fixture(t)
  const path = resolve(f.state, 'conversations.json'),
    bytes = JSON.stringify({
      version: 1,
      conversations: [{ id: 'bad', binding: { root: f.root }, messages: [] }],
    })
  await fs.writeFile(path, bytes, { mode: 0o600 })
  await assert.rejects(ChatManager.open({ state: f.state, tool: f.root }), /history-invalid/)
  assert.equal(await fs.readFile(path, 'utf8'), bytes)
})

test('structured actions are validated, bounded and stale provider events cannot close a newer turn', async (t) => {
  const { decodeResponse, progressMessage } = await import('../scripts/agent-chat/response.mjs')
  assert.equal(progressMessage('{"message":"Bonjour'), 'Bonjour')
  for (const value of [
    { message: 'x', action: 'shell', file: null, content: null, reason: null },
    { message: 'x', action: 'respond', file: 'visible.txt', content: null, reason: null },
    { message: 'x', action: 'write', file: 'visible.txt', content: null, reason: 'x' },
  ])
    assert.throws(() => decodeResponse(JSON.stringify(value)))
  const f = await fixture(t),
    active = await turn(f)
  await f.manager.notification({
    method: 'turn/completed',
    params: { threadId: active.row.nativeId, turn: { id: 'obsolete', status: 'completed' } },
  })
  assert.equal(f.manager.turn, active)
  const completed = async (response) => {
    const id = f.manager.turn.id
    await f.manager.notification({
      method: 'item/completed',
      params: {
        threadId: active.row.nativeId,
        turnId: id,
        item: { id: randomUUID(), type: 'agentMessage', text: JSON.stringify(response) },
      },
    })
    await f.manager.notification({
      method: 'turn/completed',
      params: { threadId: active.row.nativeId, turn: { id, status: 'completed' } },
    })
  }
  for (let i = 0; i < 9; i++)
    await completed({
      message: 'Lire',
      action: 'read',
      file: 'visible.txt',
      content: null,
      reason: null,
    })
  assert.equal(f.manager.turn, null)
  assert.equal(f.manager.lastError, 'chat-provider-event-failed')
  assert.equal(await fs.readFile(resolve(f.root, 'visible.txt'), 'utf8'), 'original')
})

test('installation private state and credential directories cannot become a project', async (t) => {
  const f = await fixture(t)
  for (const name of ['.runtime.local', '.codex', '.ssh', 'node_modules']) {
    const root = resolve(f.root, name)
    await fs.mkdir(root)
    await assert.rejects(f.manager.register(root), /private/)
  }
})

test('a mismatched private installation receipt refuses execution without reinstalling', async (t) => {
  const { installCodex, binaryRelative } = await import('../scripts/agent-chat/install.mjs')
  if (process.platform !== 'darwin' || process.arch !== 'arm64')
    return t.skip('macOS arm64 provider')
  const { state } = await fixture(t),
    provider = resolve(state, 'provider')
  await fs.mkdir(provider, { mode: 0o700 })
  const binary = resolve(provider, 'ready', binaryRelative)
  await fs.mkdir(resolve(binary, '..'), { recursive: true })
  await fs.writeFile(binary, 'synthetic invalid binary')
  await fs.writeFile(
    resolve(provider, 'installed.json'),
    JSON.stringify({ version: '0.167.0', binarySHA256: '0'.repeat(64) }),
    { mode: 0o600 },
  )
  await assert.rejects(installCodex(state), /integrity/)
  assert.equal(await fs.readFile(binary, 'utf8'), 'synthetic invalid binary')
})

test('native account menu starts login for an existing account, reuses pending login and exposes no conversation or credential', async (t) => {
  const f = await fixture(t)
  await f.manager.connect(f.project)
  assert.equal(f.manager.login, null)
  const request = { operation: 'connect', root: f.root }
  const first = await nativeLoginControl(f.manager, request)
  assert.deepEqual(Object.keys(first), ['url'])
  assert.equal(new URL(first.url).hostname, 'auth.openai.com')
  assert.deepEqual(await nativeLoginControl(f.manager, request), first)
  assert.equal(f.manager.provider.calls.filter((c) => c.method === 'account/login/start').length, 1)
  assert.equal(
    f.manager.provider.calls.some((c) => c.method === 'account/logout'),
    false,
  )
  assert.equal(f.manager.index.conversations.length, 0)
  await assert.rejects(nativeLoginControl(f.manager, { ...request, command: 'shell' }))
  assert.equal(f.manager.commandActive, false)
  await f.manager.notification({ method: 'account/login/completed', params: { success: true } })
  assert.equal(f.manager.login, null)
  assert.equal(f.manager.connected, true)
  assert.equal(
    f.manager.provider.calls.some((c) => c.method === 'account/logout'),
    false,
  )
})

test('native account login refuses an active turn and concurrent control without losing the turn', async (t) => {
  const f = await fixture(t)
  const active = await turn(f)
  await assert.rejects(
    nativeLoginControl(f.manager, { operation: 'connect', root: f.root }),
    /turn-running/,
  )
  assert.equal(f.manager.turn, active)
  f.manager.commandActive = true
  await assert.rejects(
    nativeLoginControl(f.manager, { operation: 'connect', root: f.root }),
    /command-busy/,
  )
  f.manager.commandActive = false
})

test('native account state is a closed projection and confirmed disconnect logs out without editing project files', async (t) => {
  const f = await fixture(t)
  const original = await fs.readFile(resolve(f.root, 'visible.txt'), 'utf8')
  assert.deepEqual(await nativeAccountControl(f.manager, { operation: 'account', root: f.root }), {
    connected: true,
    pendingLogin: false,
    loginFailed: false,
  })
  assert.equal(
    (await nativeAccountControl(f.manager, { operation: 'disconnect', root: f.root })).connected,
    false,
  )
  assert.equal(f.manager.provider.calls.filter((c) => c.method === 'account/logout').length, 1)
  assert.equal(await fs.readFile(resolve(f.root, 'visible.txt'), 'utf8'), original)
  await assert.rejects(
    nativeAccountControl(f.manager, { operation: 'disconnect', root: f.root, token: 'forbidden' }),
  )
})

test('retired inspector commands cannot start an assistant or consume private history', async (t) => {
  const { manager, state, root } = await fixture(t)
  const visualRequests = [{ preserved: 'historical private row' }]
  const history = resolve(state, 'conversations.json')
  await fs.writeFile(history, JSON.stringify({ version: 1, conversations: [], visualRequests }))
  const reopened = await ChatManager.open({ state, tool: root })
  try {
    for (const command of ['receiveVisualIntent', 'visualReceipts', 'applyVisualIntent'])
      await assert.rejects(
        contextControl(reopened, {
          operation: 'context',
          root,
          command,
          payload: {},
          treeId: null,
        }),
        /chat-operation-denied/,
      )
    await reopened.save()
    assert.deepEqual(JSON.parse(await fs.readFile(history, 'utf8')).visualRequests, visualRequests)
    assert.equal(reopened.provider, null)
    assert.equal(manager.provider, null)
  } finally {
    await reopened.close()
  }
})
