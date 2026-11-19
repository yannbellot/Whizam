import { createServer } from 'node:http'
import { readFile, mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import assert from 'node:assert/strict'
import { chromium } from '@playwright/test'
const root = fileURLToPath(new URL('..', import.meta.url))
const baseline = process.argv[2]
if (!baseline) throw new Error('Usage: test-design-system-visual.mjs BASELINE_STORYBOOK_DIRECTORY')
const mime = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.ttf': 'font/ttf',
}
async function serve(directory) {
  directory = path.resolve(directory)
  const server = createServer(async (req, res) => {
    try {
      const file = path.resolve(directory, '.' + new URL(req.url, 'http://localhost').pathname)
      if (!file.startsWith(directory + path.sep)) throw new Error('path')
      res.setHeader('Content-Type', mime[path.extname(file)] ?? 'application/octet-stream')
      res.end(await readFile(file))
    } catch {
      res.writeHead(404).end()
    }
  })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  return { server, url: `http://127.0.0.1:${server.address().port}` }
}
const before = await serve(baseline),
  after = await serve(path.join(root, 'storybook-static'))
const output = path.join(root, '.runtime.local/visual-comparison')
await mkdir(output, { recursive: true })
let browser
try {
  browser = await chromium.launch({ channel: 'chromium', headless: true })
  const cases = [
    ['components-button--default', '[data-design-target="button"]'],
    ['components-button--disabled', '[data-design-target="button"]'],
    ['components-button--loading', '[data-design-target="button"]'],
    ['components-field--invalid', '[data-design-target="field"] input'],
    ['components-select-field--default', '[data-design-target="select-field"] select'],
    ['components-notice--empty', '[data-design-target="notice"]'],
    ['components-panel--default', '[data-design-target="panel"]'],
  ]
  const rows = []
  for (const [id, selector] of cases) {
    const values = [],
      shots = []
    for (const [label, site] of [
      ['before', before],
      ['after', after],
    ]) {
      const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
      await page.goto(site.url + `/iframe.html?id=${id}&viewMode=story`)
      console.log(label, id)
      const target = page.locator(selector).first()
      await target.waitFor()
      const styles = await target.evaluate((el) => {
        const s = getComputedStyle(el)
        return Object.fromEntries(
          [
            'color',
            'backgroundColor',
            'borderRadius',
            'borderColor',
            'fontFamily',
            'fontSize',
            'fontWeight',
            'lineHeight',
            'paddingBlock',
            'paddingInline',
          ].map((k) => [k, s[k]]),
        )
      })
      values.push(styles)
      shots.push(
        await target.screenshot({
          path: path.join(output, `${id}-${label}.png`),
          animations: 'disabled',
        }),
      )
      await page.close()
    }
    assert.deepEqual(values[1], values[0], id + ' resolved styles')
    assert.ok(shots[0].equals(shots[1]), id + ' pixel equality')
    rows.push({ id, styles: values[1], pixelsIdentical: true })
  }
  await writeFile(path.join(output, 'results.json'), JSON.stringify(rows, null, 2))
  console.log(`${rows.length} component states: identical computed styles and screenshots.`)
} finally {
  await browser?.close()
  before.server.close()
  after.server.close()
}
