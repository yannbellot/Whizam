import test from 'node:test'
import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import { PassThrough } from 'node:stream'
import { mkdir, mkdtemp, rm, symlink } from 'node:fs/promises'
import { resolve } from 'node:path'
import { createCodexDecisionAgent, decodeCodexDecision } from '../scripts/design-editor/codex.mjs'

const input = {
  value: '#abc',
  choices: [{ id: 'local', label: 'Ce réglage', requiresAnswer: false }],
}
async function fixture(run) {
  const parent = resolve('.runtime.local/design-agent-tests')
  await mkdir(parent, { recursive: true })
  const root = await mkdtemp(resolve(parent, 'case-'))
  try {
    await run(root)
  } finally {
    await rm(root, { recursive: true, force: true })
  }
}
function fakeServer({ connected = true, hang = false, tool = false } = {}) {
  const calls = [],
    launches = []
  const spawnProcess = (executable, args, options) => {
    launches.push({ executable, args, options })
    const child = new EventEmitter()
    child.stdin = new PassThrough()
    child.stdout = new PassThrough()
    child.stderr = new PassThrough()
    child.kill = () => {
      queueMicrotask(() => child.emit('close', 0))
      return true
    }
    const emit = (data) => child.stdout.write(JSON.stringify(data) + '\n')
    child.stdin.on('data', (chunk) => {
      for (const line of chunk.toString().trim().split('\n')) {
        const request = JSON.parse(line)
        calls.push(request)
        if (hang || !request.id) continue
        if (request.method === 'initialize') emit({ id: request.id, result: {} })
        if (request.method === 'config/read')
          emit({
            id: request.id,
            result: {
              config: {
                sandbox_mode: 'read-only',
                approval_policy: 'never',
                mcp_servers: {},
                features: Object.fromEntries(
                  [
                    'shell_tool',
                    'shell_snapshot',
                    'multi_agent',
                    'apps',
                    'plugins',
                    'hooks',
                    'browser_use',
                    'computer_use',
                    'view_image',
                    'image_generation',
                  ].map((name) => [name, false]),
                ),
              },
            },
          })
        if (request.method === 'account/read')
          emit({
            id: request.id,
            result: {
              account: connected ? { type: 'chatgpt', email: 'synthetic@example.test' } : null,
            },
          })
        if (request.method === 'account/login/start')
          emit({
            id: request.id,
            result: {
              type: 'chatgpt',
              loginId: 'synthetic-login',
              authUrl: 'https://auth.openai.com/oauth/authorize?state=synthetic',
            },
          })
        if (request.method === 'account/logout' || request.method === 'account/login/cancel') {
          connected = false
          emit({ id: request.id, result: {} })
        }
        if (request.method === 'thread/start')
          emit({ id: request.id, result: { thread: { id: 'test-thread' } } })
        if (request.method === 'turn/start') {
          emit({ id: request.id, result: { turn: { id: 'test-turn' } } })
          emit({
            method: 'item/completed',
            params: {
              threadId: 'test-thread',
              item: tool
                ? { type: 'commandExecution' }
                : {
                    type: 'agentMessage',
                    text: JSON.stringify({
                      kind: 'select',
                      choice: 'local',
                      reason: 'Réglage particulier.',
                      question: null,
                      choices: [],
                    }),
                  },
            },
          })
          emit({
            method: 'turn/completed',
            params: { threadId: 'test-thread', turn: { status: 'completed' } },
          })
        }
      }
    })
    return child
  }
  return { spawnProcess, calls, launches }
}
test('isolates all Codex state and uses structured read-only turns without exporting account data', () =>
  fixture(async (root) => {
    const fake = fakeServer(),
      agent = createCodexDecisionAgent({ root, ...fake, maxRequests: 1 })
    try {
      assert.deepEqual(await agent.status(), { connected: true, remaining: 1 })
      assert.deepEqual(await agent.decide(input), {
        kind: 'select',
        choice: 'local',
        reason: 'Réglage particulier.',
      })
      await assert.rejects(agent.decide(input), /agent-budget-exceeded/)
      const launched = fake.launches[0]
      assert.equal(launched.executable, '/usr/bin/sandbox-exec')
      assert.match(launched.args[1], /deny file-write\*/)
      assert.equal(
        launched.options.env.CODEX_HOME,
        resolve(root, '.runtime.local/design-agent/codex'),
      )
      for (const key of ['OPENAI_API_KEY', 'ADL_DESIGN_EDITOR_SESSION', 'CODEX_THREAD_ID'])
        assert.equal(launched.options.env[key], undefined)
      const thread = fake.calls.find((call) => call.method === 'thread/start').params
      assert.equal(thread.ephemeral, true)
      assert.equal(thread.sandbox, 'read-only')
      assert.equal(thread.approvalPolicy, 'never')
      assert.ok(fake.calls.find((call) => call.method === 'turn/start').params.outputSchema)
      assert.ok(launched.args.includes('shell_tool'))
      assert.ok(launched.args.includes('plugins'))
    } finally {
      agent.close()
    }
  }))
test('a second installation starts disconnected and cannot inherit the first account', () =>
  fixture(async (root) => {
    const firstFake = fakeServer(),
      secondFake = fakeServer({ connected: false })
    const first = createCodexDecisionAgent({ root: resolve(root, 'one'), ...firstFake })
    const second = createCodexDecisionAgent({ root: resolve(root, 'two'), ...secondFake })
    // Product roots are real installations; create only these isolated fixture roots.
    await mkdir(resolve(root, 'one'))
    await mkdir(resolve(root, 'two'))
    try {
      assert.equal((await first.status()).connected, true)
      assert.equal((await second.status()).connected, false)
      await assert.rejects(second.decide(input), /agent-login-required/)
      assert.equal(
        secondFake.calls.some((call) => call.method === 'turn/start'),
        false,
      )
      assert.notEqual(
        firstFake.launches[0].options.env.CODEX_HOME,
        secondFake.launches[0].options.env.CODEX_HOME,
      )
      const login = await second.connect()
      assert.equal(login.connected, false)
      assert.match(login.authUrl, /^https:\/\/auth.openai.com\//)
      await second.disconnect()
      assert.ok(secondFake.calls.some((call) => call.method === 'account/logout'))
    } finally {
      first.close()
      second.close()
    }
  }))
test('unexpected tools fail closed instead of returning an accepted decision', () =>
  fixture(async (root) => {
    const agent = createCodexDecisionAgent({ root, ...fakeServer({ tool: true }) })
    try {
      await assert.rejects(agent.decide(input), /agent-unexpected-tool/)
    } finally {
      agent.close()
    }
  }))
test('input limits prevent model requests and arbitrary output fields are rejected', () =>
  fixture(async (root) => {
    const fake = fakeServer(),
      agent = createCodexDecisionAgent({ root, ...fake })
    await assert.rejects(agent.decide({ ...input, data: 'x'.repeat(32768) }), /agent-input-budget/)
    assert.equal(fake.launches.length, 0)
    assert.throws(
      () =>
        decodeCodexDecision(
          JSON.stringify({
            kind: 'select',
            choice: 'local',
            reason: 'x',
            question: null,
            choices: [],
            command: 'run',
          }),
        ),
      /agent-invalid-response/,
    )
    agent.close()
  }))
test('symlinked runtime state is refused before starting Codex', () =>
  fixture(async (root) => {
    await mkdir(resolve(root, 'outside'))
    await symlink(resolve(root, 'outside'), resolve(root, '.runtime.local'))
    const fake = fakeServer(),
      agent = createCodexDecisionAgent({ root, ...fake })
    await assert.rejects(agent.status(), /agent-unsafe-directory/)
    assert.equal(fake.launches.length, 0)
    agent.close()
  }))
