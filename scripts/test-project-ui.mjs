import { spawn } from 'node:child_process'
import { createServer } from 'node:net'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import assert from 'node:assert/strict'
const root = fileURLToPath(new URL('..', import.meta.url))
const { chromium, firefox, webkit, expect } = await import('@playwright/test')
const output = path.join(root, 'test-results/project-ui')
await mkdir(output, { recursive: true })
const reserve = createServer()
await new Promise((r) => reserve.listen(0, '127.0.0.1', r))
const port = reserve.address().port
await new Promise((r) => reserve.close(r))
const child = spawn(process.execPath, ['scripts/serve-storybook.mjs'], {
  cwd: root,
  env: { ...process.env, ADL_E2E_PORT: String(port) },
  stdio: 'ignore',
})
const origin = `http://127.0.0.1:${port}`
let browser
const report = { status: 'running', cases: [] }
try {
  for (let n = 0; ; n++) {
    try {
      if ((await fetch(origin + '/index.json')).ok) break
    } catch {}
    if (n > 200) throw new Error('Owned Storybook unavailable')
    await new Promise((r) => setTimeout(r, 50))
  }
  for (const [name, engine] of [
    ['chromium', chromium],
    ['firefox', firefox],
    ['webkit', webkit],
  ]) {
    browser = await engine.launch(name === 'chromium' ? { channel: 'chromium' } : {})
    for (const viewport of [
      { width: 1280, height: 800 },
      { width: 390, height: 844 },
    ]) {
      const page = await browser.newPage({ viewport })
      const errors = []
      page.on('pageerror', (e) => errors.push(e.message))
      await page.route('**/*', (route) =>
        new URL(route.request().url()).origin === origin ? route.continue() : route.abort(),
      )
      for (const scheme of ['light', 'dark']) {
        await page.emulateMedia({ colorScheme: scheme })
        await page.goto(
          origin + '/iframe.html?id=patterns-form-feedback--validation&viewMode=story',
        )
        const field = page.getByRole('textbox', { name: 'Nom du document' })
        await expect(field).toBeVisible()
        await page.getByRole('button', { name: 'Valider l’exemple' }).click()
        await expect(field).toBeFocused()
        await expect(field).toHaveAttribute('aria-invalid', 'true')
        const description = await field.getAttribute('aria-describedby')
        assert(description)
        assert(
          (
            await page.locator('[id]').evaluateAll(
              (nodes, ids) =>
                nodes
                  .filter((n) => ids.includes(n.id))
                  .map((n) => n.textContent)
                  .join(' '),
              description.split(' '),
            )
          ).includes('Saisissez un nom'),
        )
        await field.fill('Document fictif')
        await field.press('Enter')
        await expect(page.getByText('Exemple validé. Aucune donnée enregistrée.')).toBeVisible()
        await expect(field).toHaveValue('Document fictif')
        await page.screenshot({
          path: path.join(output, `${name}-${viewport.width}-${scheme}.png`),
          fullPage: true,
        })
        await page.goto(origin + '/iframe.html?id=components-button--html-form&viewMode=story')
        const value = page.getByRole('textbox', { name: 'Valeur du formulaire' })
        await expect(value).toHaveValue('Initiale')
        await value.fill('Modifiée')
        const submit = page.getByRole('button', { name: 'Soumettre', exact: true })
        await submit.click()
        await expect(page.getByRole('status')).toHaveText(
          'Modifiée · action=7 · clics=1 · focus=true',
        )
        await submit.press('Space')
        await expect(page.getByRole('status')).toHaveText(
          'Modifiée · action=7 · clics=2 · focus=true',
        )
        await page.getByRole('button', { name: 'Rétablir' }).click()
        await expect(value).toHaveValue('Initiale')
        assert.equal(await page.locator('.loomata-ui').count(), 0)
        assert.equal(await page.locator('[class*="ui:"]').count(), 0)
        assert.deepEqual(errors, [])
        if (name === 'chromium' && scheme === 'light' && process.env.PROJECT_UI_BASELINE) {
          for (const scenario of [
            'default',
            'button-hover',
            'button-focus-hover',
            'disabled-hover',
            'loading-hover',
            'field-error-focus',
            'multiline-error-focus',
          ]) {
            await page.goto(
              origin + '/iframe.html?id=design-system-migration--reference&viewMode=story',
            )
            await page.locator('[data-migration="page"]').waitFor()
            await page.evaluate(() => document.fonts.ready)
            await page.mouse.click(0, 0)
            const button = page.getByRole('button', { name: 'Action disponible', exact: true })
            if (scenario === 'button-hover') await button.hover()
            if (scenario === 'button-focus-hover') {
              await page.keyboard.press('Tab')
              await button.focus()
              await button.hover()
            }
            if (scenario === 'disabled-hover')
              await page.getByRole('button', { name: 'Action désactivée', exact: true }).hover()
            if (scenario === 'loading-hover')
              await page.getByRole('button', { name: 'Enregistrement…', exact: true }).hover()
            if (scenario === 'field-error-focus') {
              await page.keyboard.press('Tab')
              await page.getByRole('textbox', { name: 'Erreur courte', exact: true }).focus()
            }
            if (scenario === 'multiline-error-focus') {
              await page.keyboard.press('Tab')
              await page.getByRole('textbox', { name: 'Erreur longue', exact: true }).focus()
            }
            const prefix = (viewport.width === 1280 ? 'desktop' : 'mobile') + '-' + scenario
            const png = await page
              .locator('[data-migration="page"]')
              .screenshot({ animations: 'disabled', caret: 'hide' })
            await writeFile(path.join(output, prefix + '.png'), png)
            assert(
              png.equals(
                await readFile(
                  path.join(process.env.PROJECT_UI_BASELINE, 'before', prefix + '.png'),
                ),
              ),
              'Visual drift: ' + prefix,
            )
          }
        }
        report.cases.push({
          browser: name,
          version: browser.version(),
          viewport,
          scheme,
          status: 'passed',
        })
        console.log(`${name} ${viewport.width} ${scheme}: PASS`)
      }
      await page.close()
    }
    await browser.close()
    browser = null
  }
  report.status = 'passed'
} finally {
  await browser?.close()
  if (child.exitCode === null) {
    const done = new Promise((r) => child.once('exit', r))
    child.kill('SIGTERM')
    await done
  }
  await writeFile(path.join(output, 'qualification.json'), JSON.stringify(report, null, 2) + '\n')
}
