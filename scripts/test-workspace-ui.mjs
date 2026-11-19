// Desktop qualification of the real chat HTTP UI; model transport is explicitly simulated.
import fs from 'node:fs/promises'
import path from 'node:path'
import { chromium, expect } from '@playwright/test'
import { fixture, chatFixture } from '../tests/helpers/workspace.mjs'
import { chatHTTP } from './agent-chat/http.mjs'
import { buildChatUI } from './build-agent-chat.mjs'
const cleanup = [],
  t = { after: (f) => cleanup.push(f) }
const root = path.resolve(import.meta.dirname, '..')
const parent = path.join(root, 'test-results/workspace-ui')
await fs.mkdir(parent, { recursive: true })
const output = await fs.mkdtemp(path.join(parent, 'run-'))
const report = { status: 'running', cases: [] }
let browser, server, currentPage
try {
  const f = await fixture(t),
    c = await chatFixture(t, f)
  const web = path.join(f.root, '.runtime.local/web')
  await fs.mkdir(web)
  await buildChatUI(web)
  const http = await chatHTTP({ manager: c.manager, web })
  server = http.server
  browser = await chromium.launch({ channel: 'chromium' })
  for (const viewport of [
    { width: 1280, height: 800 },
    { width: 1440, height: 900 },
  ]) {
    const page = await browser.newPage({ viewport })
    currentPage = page
    await page.goto(http.origin + '/assistant/' + c.project.id)
    await expect(page.getByRole('heading', { name: 'État de travail' })).toBeVisible()
    await expect(page.getByLabel('Version affichée')).toHaveValue(f.treeId)
    await page.getByLabel('Élément de la conversation').selectOption(f.target)
    report.diagnostic = await page
      .getByRole('button', { name: 'Nouvelle conversation', exact: true })
      .evaluate((el) => ({
        rect: el.getBoundingClientRect().toJSON(),
        visible: getComputedStyle(el).visibility,
        display: getComputedStyle(el).display,
        disabled: el.disabled,
      }))
    await fs.writeFile(path.join(output, 'diagnostic.json'), JSON.stringify(report.diagnostic))
    await page.screenshot({
      path: path.join(output, 'before.png'),
      fullPage: false,
      timeout: 5000,
      animations: 'disabled',
    })
    await page.getByRole('button', { name: 'Nouvelle conversation', exact: true }).click()
    await expect(page.getByRole('button', { name: 'Page', exact: true })).toBeVisible()
    await page.getByLabel('Version affichée').focus()
    await page.keyboard.press('Tab')
    if (!(await page.evaluate(() => document.activeElement !== document.body)))
      throw new Error('Keyboard focus lost')
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth))
      throw new Error('Horizontal overflow')
    await page.screenshot({
      path: path.join(output, `desktop-${viewport.width}.png`),
      fullPage: true,
    })
    report.cases.push(
      `desktop ${viewport.width}x${viewport.height}: state and contextual conversation, keyboard, scrolling`,
    )
    await page.close()
  }
  // This is the actual capability boundary, not a mock endpoint.
  const denied = await fetch(http.origin + '/assistant/' + c.project.id + '/command', {
    method: 'POST',
    headers: { Origin: 'https://foreign.invalid', 'Content-Type': 'application/json' },
    body: JSON.stringify({ operation: 'workspaceSelect', payload: { treeId: f.treeId } }),
  })
  if (denied.status !== 403) throw new Error('Foreign origin accepted')
  report.cases.push('foreign origin denied at real HTTP boundary')
  report.status = 'passed'
} catch (error) {
  if (currentPage)
    await currentPage
      .screenshot({ path: path.join(output, 'failure.png'), fullPage: true })
      .catch(() => {})
  report.status = 'failed'
  report.error = error.message
  process.exitCode = 1
} finally {
  await browser?.close()
  if (server) {
    server.closeAllConnections()
    await new Promise((r) => server.close(r))
  }
  for (const dispose of cleanup.reverse()) await dispose()
  await fs.writeFile(
    path.join(output, 'qualification.json'),
    JSON.stringify(report, null, 2) + '\n',
  )
  console.log(JSON.stringify({ ...report, output }))
}
