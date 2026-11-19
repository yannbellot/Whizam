import { spawn } from 'node:child_process'
import { createServer } from 'node:net'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import assert from 'node:assert/strict'
const root = fileURLToPath(new URL('..', import.meta.url))
const { chromium, firefox, webkit, expect } = await import('@playwright/test')
const output = path.join(root, 'test-results/project-form-ssr')
await mkdir(output, { recursive: true })
const reserve = createServer()
await new Promise((r) => reserve.listen(0, '127.0.0.1', r))
const port = reserve.address().port
await new Promise((r) => reserve.close(r))
const child = spawn(process.execPath, ['scripts/start.ts'], {
  cwd: root,
  env: { ...process.env, PORT: String(port), HOST: '127.0.0.1', DATABASE_URL: '' },
  stdio: 'ignore',
})
const origin = `http://127.0.0.1:${port}`,
  report = { status: 'running', cases: [] }
let browser
try {
  for (let n = 0; ; n++) {
    try {
      if ((await fetch(origin + '/health')).ok) break
    } catch {}
    if (n > 300) throw new Error('Owned runtime unavailable')
    await new Promise((r) => setTimeout(r, 100))
  }
  const html = await (await fetch(origin + '/projects/new')).text()
  assert.match(html, /<input[^>]*name="name"/)
  assert.match(html, /<textarea[^>]*name="description"/)
  for (const [name, engine] of [
    ['chromium', chromium],
    ['firefox', firefox],
    ['webkit', webkit],
  ]) {
    browser = await engine.launch(name === 'chromium' ? { channel: 'chromium' } : {})
    const nojs = await browser.newContext({ javaScriptEnabled: false })
    const before = await nojs.newPage()
    await before.goto(origin + '/projects/new')
    await expect(before.getByRole('textbox', { name: 'Nom du projet' })).toBeVisible()
    await nojs.close()
    for (const viewport of [
      { width: 1280, height: 800 },
      { width: 390, height: 844 },
    ]) {
      const page = await browser.newPage({ viewport })
      const errors = []
      page.on('pageerror', (e) => errors.push(e.message))
      page.on('console', (m) => {
        if (m.type() === 'error' && /hydrat|did not match|server rendered/i.test(m.text()))
          errors.push(m.text())
      })
      await page.goto(origin + '/projects/new')
      const field = page.getByRole('textbox', { name: 'Nom du projet' }),
        description = page.getByRole('textbox', { name: 'Description' })
      await expect(field).toHaveAttribute('required', '')
      await field.fill(' ')
      await description.fill('Résumé fictif conservé')
      await page.getByRole('button', { name: 'Enregistrer le projet' }).click()
      await expect(page.getByText('Vérifiez les champs indiqués.')).toBeVisible()
      await expect(field).toHaveAttribute('aria-invalid', 'true')
      await expect(description).toHaveValue('Résumé fictif conservé')
      const ids = (await field.getAttribute('aria-describedby')).split(' ')
      const text = await page.locator('[id]').evaluateAll(
        (nodes, ids) =>
          nodes
            .filter((n) => ids.includes(n.id))
            .map((n) => n.textContent)
            .join(' '),
        ids,
      )
      assert(text.length > 0)
      assert.deepEqual(errors, [])
      assert.equal(await page.locator('.loomata-ui').count(), 0)
      await page.screenshot({
        path: path.join(output, `${name}-${viewport.width}.png`),
        fullPage: true,
      })
      report.cases.push({
        browser: name,
        version: browser.version(),
        viewport,
        ssr: true,
        hydration: true,
        invalidAction: 400,
        noDatabase: true,
        status: 'passed',
      })
      console.log(`${name} ${viewport.width} SSR/hydration/action: PASS`)
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
