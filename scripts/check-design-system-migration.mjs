import { spawn } from 'node:child_process'
import { createServer } from 'node:net'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from '@playwright/test'
import { loadCanonicalEditorModel } from './validate-editor-contract.mjs'

const root = fileURLToPath(new URL('..', import.meta.url))
const output =
  process.env.ADL_MIGRATION_OUTPUT ?? path.join(root, '.runtime.local/design-system-migration')
const mode = process.argv[2]
if (!['before', 'after'].includes(mode)) throw new Error('Expected before or after')
await mkdir(path.join(output, mode), { recursive: true })
const reserve = createServer()
await new Promise((resolve, reject) => {
  reserve.once('error', reject)
  reserve.listen(0, '127.0.0.1', resolve)
})
const port = reserve.address().port
await new Promise((resolve) => reserve.close(resolve))
const child = spawn(process.execPath, ['scripts/serve-storybook.mjs'], {
  cwd: root,
  env: { ...process.env, ADL_E2E_PORT: String(port) },
  stdio: ['ignore', 'pipe', 'pipe'],
})
let browser
try {
  const origin = `http://127.0.0.1:${port}`
  for (let attempt = 0; ; attempt++) {
    try {
      if ((await fetch(origin + '/index.json')).ok) break
    } catch {
      /* startup */
    }
    if (attempt === 100) throw new Error('Owned Storybook server unavailable')
    await new Promise((resolve) => setTimeout(resolve, 50))
  }
  browser = await chromium.launch({ channel: 'chromium', headless: true })
  const properties = [
    'backgroundColor',
    'color',
    'borderTopColor',
    'borderTopWidth',
    'borderRadius',
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
    'gap',
    'fontSize',
    'fontWeight',
    'fontFamily',
    'lineHeight',
    'maxWidth',
    'width',
    'height',
    'outlineColor',
    'outlineWidth',
    'outlineOffset',
    'outlineStyle',
    'cursor',
    'display',
  ]
  const scenarios = [
    'default',
    'button-hover',
    'button-focus-hover',
    'disabled-hover',
    'loading-hover',
    'field-error-focus',
    'multiline-error-focus',
  ]
  let comparisons = 0
  for (const [name, viewport] of [
    ['desktop', { width: 1280, height: 800 }],
    ['mobile', { width: 390, height: 844 }],
  ]) {
    const page = await browser.newPage({ viewport })
    await page.route('**/*', (route) =>
      new URL(route.request().url()).origin === origin ? route.continue() : route.abort(),
    )
    for (const scenario of scenarios) {
      await page.route('**/*', (route) =>
        new URL(route.request().url()).origin === origin ? route.continue() : route.abort(),
      )
      await page.goto(origin + '/iframe.html?id=design-system-migration--reference&viewMode=story')
      await page.locator('[data-migration="page"]').waitFor()
      await page.evaluate(() => document.fonts.ready)
      // Reset input modality before exercising each explicit focus/hover state.
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
      const stats = await page.locator('#storybook-root').evaluate(
        (container, properties) =>
          Array.from(container.querySelectorAll('*')).map((element) => {
            const style = getComputedStyle(element)
            const box = element.getBoundingClientRect()
            return {
              tag: element.tagName,
              box: [box.x, box.y, box.width, box.height],
              values: Object.fromEntries(properties.map((property) => [property, style[property]])),
            }
          }),
        properties,
      )
      const prefix = `${name}-${scenario}`
      const png = await page
        .locator('[data-migration="page"]')
        .screenshot({ animations: 'disabled', caret: 'hide' })
      await writeFile(path.join(output, mode, prefix + '.png'), png)
      await writeFile(path.join(output, mode, prefix + '.json'), JSON.stringify(stats, null, 2))
      if (mode === 'after') {
        const before = JSON.parse(
          await readFile(path.join(output, 'before', prefix + '.json'), 'utf8'),
        )
        if (JSON.stringify(before) !== JSON.stringify(stats))
          throw new Error(`Computed style/layout drift: ${prefix}`)
        if (!png.equals(await readFile(path.join(output, 'before', prefix + '.png'))))
          throw new Error(`Screenshot drift: ${prefix}`)
        comparisons++
      }
    }
    await page.close()
  }
  if (mode === 'after') {
    const { model } = await loadCanonicalEditorModel()
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
    await page.route('**/*', (route) =>
      new URL(route.request().url()).origin === origin ? route.continue() : route.abort(),
    )
    await page.goto(origin + '/iframe.html?id=design-system-migration--reference&viewMode=story')
    await page.locator('[data-migration="page"]').waitFor()
    await page.keyboard.press('Tab')
    const cssProperties = {
      background: 'backgroundColor',
      foreground: 'color',
      borderColor: 'borderTopColor',
      borderWidth: 'borderTopWidth',
      borderRadius: 'borderTopLeftRadius',
      paddingBlock: 'paddingTop',
      paddingInline: 'paddingLeft',
      fontSize: 'fontSize',
      fontWeight: 'fontWeight',
      lineHeight: 'lineHeight',
      fontFamily: 'fontFamily',
      gap: 'gap',
      ringColor: 'outlineColor',
      ringWidth: 'outlineWidth',
      ringOffset: 'outlineOffset',
      maxWidth: 'maxWidth',
      pageMargin: 'paddingTop',
    }
    let wired = 0
    for (const binding of model.bindings) {
      await page.setViewportSize(
        binding.part === 'page-mobile' ? { width: 390, height: 844 } : { width: 1280, height: 800 },
      )
      await page.mouse.move(0, 0)
      const selector = await page.evaluate((binding) => {
        document.activeElement?.blur()
        if (binding.target === 'foundations') {
          const selectors = {
            document: ':root',
            page: '[data-migration="page"]',
            'page-mobile': '[data-migration="page"]',
            'layout-small': '[data-migration="layout-small"]',
            'layout-medium': '[data-migration="layout-medium"]',
            'layout-large': '[data-migration="layout-large"]',
            table:
              binding.property === 'fontSize'
                ? '[data-migration=page] table'
                : '[data-migration=page] table td',
          }
          return selectors[binding.part]
        }
        const roots = Array.from(
          document.querySelectorAll(
            `[data-design-target="${binding.target}"][data-design-variant="${binding.variant}"]`,
          ),
        )
        const root = roots.find((element) => {
          const control = element.matches('button')
            ? element
            : element.querySelector('input,textarea,select')
          if (binding.target === 'button')
            return binding.state === 'loading'
              ? element.hasAttribute('aria-busy')
              : binding.state === 'disabled'
                ? element.disabled && !element.hasAttribute('aria-busy')
                : !element.disabled
          if (!control) return true
          if (binding.state === 'disabled')
            return control.disabled && !control.hasAttribute('aria-invalid')
          if (binding.state === 'error' || binding.part === 'error')
            return control.hasAttribute('aria-invalid') && !control.disabled
          return !control.disabled && !control.hasAttribute('aria-invalid')
        })
        if (!root) throw new Error('No fixture root: ' + binding.id)
        const element =
          binding.part === 'root'
            ? root
            : root.querySelector(`[data-design-part="${binding.part}"]`)
        if (!element) throw new Error('No fixture part: ' + binding.id)
        element.setAttribute('data-migration-probe', 'active')
        if (binding.state === 'focus-visible') element.focus()
        return '[data-migration-probe="active"]'
      }, binding)
      const element = page.locator(selector)
      if (binding.state === 'hover') await element.hover()
      const result = await element.evaluate(
        (element, { binding, property }) => {
          const style = getComputedStyle(element)
          const before = style[property]
          const variable = '--adl-' + binding.id.replaceAll('.', '-')
          const value = ['background', 'foreground', 'borderColor', 'ringColor'].includes(
            binding.property,
          )
            ? '#123456'
            : binding.property === 'fontFamily'
              ? 'serif'
              : binding.property === 'fontWeight'
                ? '700'
                : binding.property === 'lineHeight'
                  ? '1.75'
                  : binding.property === 'maxWidth'
                    ? '900px'
                    : binding.property === 'fontSize'
                      ? '19px'
                      : '5px'
          document.documentElement.style.setProperty(variable, value)
          const after = getComputedStyle(element)[property]
          document.documentElement.style.removeProperty(variable)
          element.removeAttribute('data-migration-probe')
          return { before, after }
        },
        {
          binding,
          property:
            binding.target === 'foundations' &&
            binding.part === 'table' &&
            binding.property === 'borderColor'
              ? 'borderBottomColor'
              : cssProperties[binding.property],
        },
      )
      if (result.before === result.after)
        throw new Error(`Unwired cell ${binding.id}: ${JSON.stringify(result)}`)
      wired++
    }
    // Exceptions synthétiques et style partagé : CSS réel, aucun fichier d’autorité modifié.
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.mouse.move(0, 0)
    const isolation = await page.evaluate(() => {
      document.activeElement?.blur()
      const field = document.querySelector(
        '[data-design-target="field"][data-design-variant="single-line"] input',
      )
      const select = document.querySelector('[data-design-target="select-field"] select')
      const notice = document.querySelector(
        '[data-design-target="notice"][data-design-variant="info"]',
      )
      const panel = document.querySelector('[data-design-target="panel"]')
      const color = (element) => getComputedStyle(element).backgroundColor
      const before = [field, select, notice, panel].map(color)
      const first = '--adl-component-field-single-line-control-background-default'
      const second = '--adl-component-notice-info-root-background-default'
      document.documentElement.style.setProperty(first, '#123456')
      document.documentElement.style.setProperty(second, '#234567')
      const local = [field, select, notice, panel].map(color)
      document.documentElement.style.setProperty(
        '--adl-semantic-color-neutral-background-default',
        '#345678',
      )
      const shared = [field, select, notice, panel].map(color)
      document.documentElement.style.removeProperty(first)
      document.documentElement.style.removeProperty(second)
      const restored = [field, select, notice, panel].map(color)
      document.documentElement.style.removeProperty(
        '--adl-semantic-color-neutral-background-default',
      )
      return { before, local, shared, restored }
    })
    if (
      isolation.local[0] === isolation.before[0] ||
      isolation.local[1] !== isolation.before[1] ||
      isolation.local[2] === isolation.before[2] ||
      isolation.local[3] !== isolation.before[3]
    )
      throw new Error('Local scope leaked')
    if (
      isolation.shared[0] !== isolation.local[0] ||
      isolation.shared[1] === isolation.local[1] ||
      isolation.shared[2] !== isolation.local[2] ||
      isolation.shared[3] === isolation.local[3]
    )
      throw new Error('Shared propagation or exception preservation failed')
    if (
      isolation.restored[0] !== isolation.shared[1] ||
      isolation.restored[2] !== isolation.before[2]
    )
      throw new Error('Restoration failed')
    await writeFile(
      path.join(output, 'wiring.json'),
      JSON.stringify(
        { browser: browser.version(), node: process.version, arch: process.arch, wired, isolation },
        null,
        2,
      ),
    )
    await page.close()
    console.log(
      `${wired} prepared cells change their computed property; Field/SelectField and Notice/Panel isolation, shared propagation and restoration passed.`,
    )
  }
  console.log(
    mode === 'before'
      ? '14 baseline captures and computed-style snapshots saved.'
      : `${comparisons} captures identical byte-for-byte and computed styles/layout identical.`,
  )
} finally {
  await browser?.close()
  if (child.exitCode === null && child.signalCode === null) {
    const closed = new Promise((resolve) => child.once('exit', resolve))
    child.kill('SIGTERM')
    await closed
  }
}
