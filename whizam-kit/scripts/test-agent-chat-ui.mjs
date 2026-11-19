// UI E2E with an explicitly simulated provider transport; filesystem effects and HTTP are real.
import * as fs from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomUUID } from 'node:crypto'
import { ChatManager } from './agent-chat/manager.mjs'
import { chatHTTP } from './agent-chat/http.mjs'
import { buildChatUI } from './build-agent-chat.mjs'
const tool = fileURLToPath(new URL('..', import.meta.url)),
  parent = resolve(tool, 'test-results/agent-chat-ui')
await fs.mkdir(parent, { recursive: true })
const output = await fs.mkdtemp(resolve(parent, 'run-'))
const state = resolve(output, 'state'),
  root = resolve(output, 'project with spaces'),
  web = resolve(output, 'web')
await fs.mkdir(state, { mode: 0o700 })
await fs.mkdir(root, { mode: 0o700 })
await fs.mkdir(web, { mode: 0o700 })
await fs.writeFile(resolve(root, 'witness.txt'), 'original')
let authenticated = false,
  started = 0
const threads = new Map()
class SimulatedCodex {
  constructor(options) {
    Object.assign(this, options)
    this.work = resolve(state, 'work')
  }
  async start() {}
  async rpc(method, params) {
    if (method === 'account/read')
      return {
        account: authenticated ? { type: 'chatgpt', email: 'ui-fixture@example.invalid' } : null,
      }
    if (method === 'account/login/start') {
      setTimeout(() => {
        authenticated = true
        void this.onNotification({
          method: 'account/login/completed',
          params: { loginId: 'fixture', success: true },
        })
      }, 250)
      return { loginId: 'fixture', authUrl: 'https://auth.openai.com/fixture-not-used' }
    }
    if (method === 'thread/start') {
      const id = 'thread-' + randomUUID()
      threads.set(id, { turns: [] })
      return { thread: { id } }
    }
    if (method === 'thread/read') return { thread: threads.get(params.threadId) }
    if (method === 'turn/interrupt') {
      this.cancelled = true
      await this.onNotification({
        method: 'turn/completed',
        params: { threadId: params.threadId, turn: { id: params.turnId, status: 'interrupted' } },
      })
      return {}
    }
    if (method === 'turn/start') {
      started++
      this.cancelled = false
      const turnId = 'turn-' + randomUUID(),
        itemId = 'message-' + randomUUID()
      const input = params.input[0].text
      setTimeout(() => {
        void (async () => {
          await this.onNotification({
            method: 'turn/started',
            params: { threadId: params.threadId, turn: { id: turnId } },
          })
          const continuation = input.startsWith('DONNEES_LOOMATA')
          const result = continuation ? JSON.parse(input.slice(input.indexOf('\n') + 1)) : null
          const response = continuation
            ? {
                message: result.success
                  ? 'Modification confirmée. <img src=x onerror=alert(1)>'
                  : 'Refus respecté.',
                action: 'respond',
                file: null,
                content: null,
                reason: null,
              }
            : {
                message: 'Je prépare la proposition… ',
                action: 'write',
                file: 'witness.txt',
                content: 'modification approuvée',
                reason: 'Scénario de test ' + input,
              }
          const text = JSON.stringify(response)
          await this.onNotification({
            method: 'item/agentMessage/delta',
            params: {
              threadId: params.threadId,
              turnId,
              itemId,
              delta: text.slice(0, text.indexOf(',"action"')),
            },
          })
          if (this.cancelled) return
          threads
            .get(params.threadId)
            .turns.push({ items: [{ id: itemId, type: 'agentMessage', text }] })
          await this.onNotification({
            method: 'item/completed',
            params: { threadId: params.threadId, item: { id: itemId, type: 'agentMessage', text } },
          })
          await this.onNotification({
            method: 'turn/completed',
            params: { threadId: params.threadId, turn: { id: turnId, status: 'completed' } },
          })
        })()
      }, 25)
      return { turn: { id: turnId } }
    }
    return {}
  }
  stop() {
    this.onClose?.('chat-provider-stopped')
  }
}
let manager, http, browser
const report = {
  status: 'running',
  provider: 'simulated transport, never a real account or inference',
  cases: [],
}
try {
  await buildChatUI(web)
  manager = await ChatManager.open({
    tool,
    state,
    providerFactory: (o) => new SimulatedCodex(o),
    install: async () => '/fixture/provider',
  })
  const project = await manager.register(root)
  http = await chatHTTP({ manager, web })
  process.env.PLAYWRIGHT_BROWSERS_PATH ??= resolve(tool, '.runtime.local/playwright')
  const { chromium, expect } = await import('@playwright/test')
  browser = await chromium.launch({ channel: 'chromium' })
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
  await page.route('**/*', (route) =>
    new URL(route.request().url()).origin === http.origin ? route.continue() : route.abort(),
  )
  await page.goto(http.origin + '/assistant/' + project.id)
  await expect(page.getByRole('button', { name: 'Connecter Codex', exact: true })).toBeEnabled()
  await page.getByRole('button', { name: 'Connecter Codex', exact: true }).click()
  await expect(page.getByText('Compte connecté', { exact: false })).toBeVisible()
  report.cases.push(
    'actual React connection states render from the explicitly simulated account transport',
  )
  const send = async (text) => {
    await page.getByLabel('Message à Codex', { exact: true }).fill(text)
    await page.getByRole('button', { name: 'Envoyer le message', exact: true }).click()
    await expect(
      page.getByRole('heading', { name: 'Autoriser une modification ?', exact: true }),
    ).toBeVisible()
  }
  await send('refuser')
  if ((await fs.readFile(resolve(root, 'witness.txt'), 'utf8')) !== 'original')
    throw new Error('Write before approval')
  await page.getByRole('button', { name: 'Refuser la modification', exact: true }).click()
  await expect(page.getByText('Refus respecté.', { exact: true })).toBeVisible()
  if ((await fs.readFile(resolve(root, 'witness.txt'), 'utf8')) !== 'original')
    throw new Error('Refused write occurred')
  report.cases.push('progressive message and real approval card; refusal writes nothing')
  await send('accepter')
  await page.screenshot({ path: resolve(output, 'approval-desktop.png'), fullPage: true })
  await page.getByRole('button', { name: 'Autoriser cette modification', exact: true }).click()
  await expect(
    page.getByText('Modification confirmée. <img src=x onerror=alert(1)>', { exact: true }),
  ).toBeVisible()
  if ((await fs.readFile(resolve(root, 'witness.txt'), 'utf8')) !== 'modification approuvée')
    throw new Error('Approved file not saved')
  if (await page.locator('img').count()) throw new Error('Provider output rendered as HTML')
  report.cases.push('one approved file is really saved; provider markup is rendered as text')
  await send('interrompre')
  await page.getByRole('button', { name: 'Interrompre', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Autoriser une modification ?', exact: true }),
  ).toHaveCount(0)
  await expect(
    page.getByText('Échange interrompu. Aucun message ni accord rejoué.', { exact: true }),
  ).toBeVisible()
  const count = started
  await page.reload()
  await expect(
    page.getByText('Modification confirmée. <img src=x onerror=alert(1)>', { exact: true }),
  ).toBeVisible()
  if (started !== count) throw new Error('Reload resent a turn')
  report.cases.push(
    'interruption cancels pending approval; reload restores history without resending',
  )
  await page.setViewportSize({ width: 390, height: 844 })
  await expect(page.getByLabel('Message à Codex', { exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Assistance Loomata', exact: true })).toHaveCount(
    1,
  )
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({ path: resolve(output, 'chat-mobile.png') })
  await page.getByLabel('Message à Codex', { exact: true }).focus()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: 'Envoyer le message', exact: true })).toBeFocused()
  await page.screenshot({ path: resolve(output, 'composer-mobile.png') })
  if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth))
    throw new Error('Mobile horizontal overflow')
  report.cases.push(
    'mobile layout has one document, no horizontal overflow, and keyboard access to the composer',
  )
  report.status = 'passed'
  console.log(JSON.stringify({ status: report.status, cases: report.cases, output }, null, 2))
} finally {
  await browser?.close()
  await manager?.close()
  if (http) {
    http.server.closeAllConnections()
    await new Promise((done) => http.server.close(done))
  }
  await fs.writeFile(resolve(output, 'qualification.json'), JSON.stringify(report, null, 2) + '\n')
}
