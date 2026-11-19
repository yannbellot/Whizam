import * as fs from 'node:fs/promises'
import { constants } from 'node:fs'
import { resolve, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { randomUUID } from 'node:crypto'
import assert from 'node:assert/strict'
import { setTimeout as delay } from 'node:timers/promises'
import { createServer } from 'node:net'

const run = promisify(execFile)
const kit = fileURLToPath(new URL('..', import.meta.url))
export async function copyFixture(destination, { includeDependencies = true } = {}) {
  await fs.mkdir(destination, { recursive: true })
  const excluded = new Set([
    'node_modules',
    '.runtime.local',
    '.design-editor.local',
    '.local',
    'test-results',
    'test-fixtures',
    '.react-router',
    'build',
    'dist',
    'storybook-static',
    '.agents',
    '.claude',
  ])
  const filter = (path) =>
    !excluded.has(basename(path)) &&
    !basename(path).includes(' 2') &&
    !basename(path).startsWith('.env')
  for (const entry of await fs.readdir(kit)) {
    const source = resolve(kit, entry)
    if (filter(source))
      await fs.cp(source, resolve(destination, entry), {
        recursive: true,
        filter,
        mode: constants.COPYFILE_FICLONE,
      })
  }
  if (includeDependencies)
    await fs.cp(resolve(kit, 'node_modules'), resolve(destination, 'node_modules'), {
      recursive: true,
      mode: constants.COPYFILE_FICLONE,
    })
}
async function port() {
  const server = createServer()
  await new Promise((done) => server.listen(0, '127.0.0.1', done))
  const value = server.address().port
  await new Promise((done) => server.close(done))
  return value
}
export async function integration() {
  const parent = resolve(kit, 'test-results/local-app')
  await fs.mkdir(parent, { recursive: true })
  const fixture = await fs.mkdtemp(resolve(parent, 'instance with spaces '))
  await copyFixture(fixture)
  const ui = await port(),
    book = await port()
  const command = (args) =>
    run(process.execPath, args, { cwd: fixture, timeout: 200000, maxBuffer: 2 * 1024 * 1024 })
  const cli = (action) => command(['scripts/local-app.mjs', action])
  const report = { fixture, cases: [], status: 'running' }
  let browser
  try {
    await command(['scripts/generate-tokens.mjs'])
    // Inject a real writer interruption only in this synthetic copy.
    const bootstrap = resolve(fixture, 'scripts/design-editor/bootstrap.mjs')
    const original = await fs.readFile(bootstrap, 'utf8')
    assert(original.includes('onResume: onResume,'))
    await fs.writeFile(
      bootstrap,
      original.replace(
        'onResume: onResume,',
        `onResume: onResume,
      fault: async (phase, index) => {
        if (phase !== 'after-replace' || index !== 0) return
        const fs = await import('node:fs/promises')
        try { await fs.unlink(root + '/.runtime.local/interrupt-once') }
        catch (error) { if (error.code === 'ENOENT') return; throw error }
        process.kill(process.pid, 'SIGKILL')
      },`,
      ),
    )
    await command([
      'scripts/local-app.mjs',
      'configure',
      '--ui-port',
      String(ui),
      '--storybook-port',
      String(book),
    ])
    const [a, b] = await Promise.all([cli('start'), cli('start')])
    assert.deepEqual(JSON.parse(a.stdout).pids, JSON.parse(b.stdout).pids)
    report.cases.push('cold start and concurrent reuse')
    process.env.PLAYWRIGHT_BROWSERS_PATH = resolve(kit, '.runtime.local/playwright')
    const { chromium, expect } = await import('@playwright/test')
    browser = await chromium.launch({ channel: 'chromium' })
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
    const documentation = await browser.newPage()
    await page.goto(`http://127.0.0.1:${ui}/ui-lab`)
    await documentation.goto(`http://127.0.0.1:${book}/?path=/story/components-button--default`)
    await expect(page.getByLabel('Valeur précise', { exact: true })).toBeEnabled({ timeout: 30000 })
    await page.getByLabel('Valeur précise', { exact: true }).fill('#123456')
    await page.getByRole('button', { name: 'Nouveau style de composant', exact: true }).click()
    await page.getByRole('button', { name: 'Enregistrer', exact: true }).click()
    await expect(
      page.getByText('Enregistré dans les sources et relu avec succès.', { exact: true }),
    ).toBeVisible({ timeout: 30000 })
    const button = () =>
      documentation
        .frameLocator('#storybook-preview-iframe')
        .getByRole('button', { name: 'Enregistrer le projet', exact: true })
    await expect(button()).toHaveCSS('background-color', 'rgb(18, 52, 86)', { timeout: 30000 })
    report.cases.push('save and automatic Storybook propagation')
    await page.screenshot({ path: resolve(parent, 'workshop.png'), fullPage: true })
    await documentation.screenshot({ path: resolve(parent, 'storybook.png'), fullPage: true })
    assert(
      !(await (await fetch(`http://127.0.0.1:${book}`)).text()).includes(
        'name="adl-design-editor-session"',
      ),
    )
    assert.equal(
      (await fetch(`http://127.0.0.1:${book}/__design-system/editor/save`, { method: 'POST' }))
        .status,
      404,
    )
    report.cases.push('documentary reader has no writer')
    await cli('stop')
    await cli('start')
    await page.reload()
    await documentation.reload()
    await expect(button()).toHaveCSS('background-color', 'rgb(18, 52, 86)', { timeout: 30000 })
    report.cases.push('graceful stop and stable restart with saved values')
    const api = (action, body) =>
      page.evaluate(
        async ({ action, body }) => {
          const token = document.querySelector('meta[name="adl-design-editor-session"]').content
          const response = await fetch('/__design-system/editor/' + action, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Design-Editor-Session': token },
            body: JSON.stringify(body),
          })
          return response.json()
        },
        { action, body },
      )
    const snapshot = await api('snapshot', {})
    const requestId = randomUUID()
    await fs.writeFile(resolve(fixture, '.runtime.local/interrupt-once'), '')
    await api('save', {
      protocolVersion: 4,
      requestId,
      baseRevision: snapshot.revision,
      operations: [
        {
          kind: 'set-component-token',
          target: 'component.button.default.root.background.default',
          value: '#234567',
        },
      ],
    }).catch(() => {})
    for (let n = 0; n < 300; n++) {
      const state = await cli('status').catch(() => null)
      if (state && JSON.parse(state.stdout).phase === 'stopped') break
      await delay(100)
    }
    assert.equal(JSON.parse((await cli('status')).stdout).phase, 'stopped')
    await cli('start')
    await page.reload()
    const receipt = await api('status', { requestId })
    assert.equal(receipt.status, 'saved')
    await documentation.reload()
    await expect(button()).toHaveCSS('background-color', 'rgb(35, 69, 103)', { timeout: 30000 })
    report.cases.push(
      'writer SIGKILL after durable replacement, sibling shutdown and recovery without generation',
    )
    await cli('stop')
    const moved = fixture + ' moved'
    await fs.rename(fixture, moved)
    const movedCLI = (action) =>
      run(process.execPath, [resolve(moved, 'scripts/local-app.mjs'), action], {
        cwd: moved,
        timeout: 200000,
      })
    await assert.rejects(movedCLI('start'), /instance a changé/)
    await movedCLI('repair')
    await movedCLI('start')
    await page.reload()
    await documentation.reload()
    await expect(button()).toHaveCSS('background-color', 'rgb(35, 69, 103)', { timeout: 30000 })
    await movedCLI('stop')
    await fs.rename(moved, fixture)
    await cli('repair')
    report.cases.push('same instance moved with explicit repair; sources and receipts preserved')
    report.status = 'passed'
  } catch (error) {
    report.status = 'failed'
    report.error = error.message
    throw error
  } finally {
    await browser?.close()
    await cli('stop').catch(() => {})
    await fs.writeFile(resolve(parent, 'qualification.json'), JSON.stringify(report, null, 2))
  }
  console.log(JSON.stringify(report, null, 2))
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  await integration()
