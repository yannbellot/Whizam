import { chromium } from '@playwright/test'
import path from 'node:path'
import { localEditorEnvironment } from './design-editor/local.mjs'
import fs from 'node:fs/promises'
import assert from 'node:assert/strict'
const root = await fs.realpath(process.argv[2])
const origin = new URL(process.argv[3])
if (origin.protocol !== 'http:' || origin.hostname !== '127.0.0.1' || origin.pathname !== '/')
  throw new Error('fixture-origin-invalid')
await fs.access(path.join(root, '.runtime.local/ds-ui-06-fixture'))
const output = path.join(root, 'test-results/ds-ui-06')
await fs.mkdir(output, { recursive: true })
const browser = await chromium.launch({ headless: true, channel: 'chromium' })
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto(origin.origin + '/ui-lab')
  assert.equal(
    await page.locator('meta[name=adl-design-editor-root]').getAttribute('content'),
    localEditorEnvironment(root, '127.0.0.1', origin.port).ADL_DESIGN_EDITOR_ROOT,
  )
  const token = 'component.button.default.root.background.default'
  const background = page.locator(`[data-token-field="${token}"]`)
  await background.getByLabel('Valeur précise', { exact: true }).waitFor()
  await page.waitForFunction(
    () => !document.querySelector('[data-token-field] input')?.matches(':disabled'),
    null,
    { timeout: 30000 },
  )
  assert.ok((await page.locator('[data-token-field]').count()) > 5)
  assert.equal(await page.getByLabel('Propriété', { exact: true }).count(), 0)
  const wanted =
    (await background.getByLabel('Valeur précise', { exact: true }).inputValue()) === '#123456'
      ? '#345678'
      : '#123456'
  await background.getByLabel('Valeur précise', { exact: true }).fill(wanted)
  await page
    .locator('[data-token-field="component.button.default.root.border-radius.default"]')
    .getByRole('textbox')
    .fill('0.5rem')
  await page
    .locator('[data-token-field="component.button.default.root.font-weight.default"]')
    .getByRole('textbox')
    .fill('650')
  await page.getByRole('button', { name: 'Enregistrer', exact: true }).click()
  await page.waitForFunction(
    () =>
      document.querySelector('[data-loomata-dirty]')?.getAttribute('data-loomata-dirty') ===
      'false',
    null,
    { timeout: 30000 },
  )
  await page.reload()
  await background.getByLabel('Valeur précise', { exact: true }).waitFor()
  await page.waitForFunction(
    (wanted) =>
      document.querySelector(
        '[data-token-field="component.button.default.root.background.default"] input[aria-label="Valeur précise"]',
      )?.value === wanted,
    wanted,
    { timeout: 30000 },
  )
  await page.screenshot({ path: output + '/inspector.png' })
  await page.getByRole('button', { name: 'Foundations', exact: true }).click()
  await page.getByRole('heading', { name: 'Foundations', exact: true }).waitFor()
  const candidates = page.locator('[data-decision]:enabled')
  assert.ok((await candidates.count()) > 40)
  await page.getByLabel('Classification des décisions').selectOption('non-semantic')
  assert.equal(await page.locator('[data-decision]').filter({ hasText: 'Intention' }).count(), 0)
  await page.getByLabel('Classification des décisions').selectOption('all')
  await page.locator('[data-decision="semantic.color.action.primary.background.default"]').click()
  const color = page.getByLabel('Valeur précise', { exact: true })
  await color.fill((await color.inputValue()) === '#234567' ? '#456789' : '#234567')
  await page.getByRole('button', { name: 'Enregistrer', exact: true }).click()
  await page.waitForFunction(
    () =>
      document.querySelector('[data-loomata-dirty]')?.getAttribute('data-loomata-dirty') ===
      'false',
    null,
    { timeout: 30000 },
  )
  await page.reload()
  await background.getByLabel('Valeur précise', { exact: true }).waitFor()
  await page.waitForFunction(
    (wanted) =>
      document.querySelector(
        '[data-token-field="component.button.default.root.background.default"] input[aria-label="Valeur précise"]',
      )?.value === wanted,
    wanted,
    { timeout: 30000 },
  )
  await page.getByRole('button', { name: 'Foundations', exact: true }).click()
  await page.locator('[data-decision="semantic.color.action.primary.background.default"]').click()
  await page.screenshot({ path: output + '/foundations.png' })
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.screenshot({ path: output + '/foundations-1440.png' })
  assert.equal(errors.length, 0, JSON.stringify(errors))
  await fs.writeFile(
    output + '/browser.json',
    JSON.stringify({
      errors,
      multiFieldSave: true,
      filter: true,
      sharedEdit: true,
      viewports: ['1280x800', '1440x900'],
    }),
  )
} finally {
  await browser.close()
}
