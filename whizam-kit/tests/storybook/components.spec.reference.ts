import { test, expect } from '@playwright/test'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
const authority = resolve('src/design-system/authority/tokens.tokens.json')
test('catalogue contains foundations/components/patterns and no editing workshop', async ({
  request,
}) => {
  const index = await (await request.get('/index.json')).json()
  for (const id of [
    'design-system--primitives',
    'design-system--tokens',
    'components-button--default',
    'components-field--invalid',
    'patterns-form-feedback--validation',
  ])
    expect(index.entries[id], id).toBeDefined()
  const titles = Object.values(index.entries).map((e: unknown) => (e as { title: string }).title)
  expect(titles.join('\n')).not.toMatch(/UI Lab|Loomata UI|Semantic Tokens|Decision Tokens/i)
  expect((await request.post('/')).status()).toBe(405)
  for (const path of [
    '/ui-lab',
    '/editor-snapshot.generated.json',
    '/.env.local',
    '/__design_editor/save',
  ])
    expect((await request.get(path)).status()).toBe(404)
})
test('button states and keyboard focus preserve their resolved appearance', async ({ page }) => {
  await page.goto('/iframe.html?id=components-button--default&viewMode=story')
  const button = page.getByRole('button', { name: 'Enregistrer le projet' })
  await expect(button).toHaveCSS('background-color', 'rgb(29, 78, 216)')
  await button.focus()
  await expect(button).toBeFocused()
  await expect(button).toHaveCSS('outline-style', 'solid')
  await page.goto('/iframe.html?id=components-button--disabled&viewMode=story')
  await expect(page.getByRole('button')).toBeDisabled()
  await expect(page.getByRole('button')).toHaveCSS('background-color', 'rgb(100, 116, 139)')
})
test('consulting and interacting with fixtures never changes canonical sources', async ({
  page,
  request,
}) => {
  const before = await readFile(authority, 'utf8'),
    writes: string[] = []
  page.on('request', (req) => {
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method())) writes.push(req.url())
  })
  await page.goto('/iframe.html?id=components-field--invalid&viewMode=story')
  const input = page.getByRole('textbox', { name: 'Nom du projet' })
  await input.fill('Donnée fictive')
  await expect(input).toHaveValue('Donnée fictive')
  await expect(page.getByRole('button', { name: /Enregistrer|Appliquer/ })).toHaveCount(0)
  await page.goto('/iframe.html?id=design-system--tokens&viewMode=story')
  await expect(page.getByRole('table')).toBeVisible()
  expect(await readFile(authority, 'utf8')).toBe(before)
  expect(writes).toEqual([])
  expect((await request.post('/__design_editor/save', { data: {} })).status()).toBe(405)
})
test('catalogue is readable without horizontal page overflow', async ({ page }) => {
  await page.goto('/iframe.html?id=design-system--primitives&viewMode=story')
  await expect(page.getByRole('table')).toBeVisible()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBe(true)
})
