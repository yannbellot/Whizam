import { test, expect } from '@playwright/test'
test('application keeps its home and health while workshop routes are retired', async ({
  page,
  request,
}) => {
  expect((await request.get('/health')).status()).toBe(200)
  for (const route of [
    '/ui-lab',
    '/ui-lab/preview',
    '/projects',
    '/projects/new',
    '/projects/11111111-1111-4111-8111-111111111111',
  ])
    expect((await request.get(route)).status()).toBe(404)
  await page.goto('/')
  await expect(page.locator('main')).toHaveText('')
  await expect(page.locator('main').locator('*')).toHaveCount(0)
  await expect(page.locator('a[href^="/ui-lab"]')).toHaveCount(0)
  expect(await page.locator('meta[name="adl-design-editor-session"]').count()).toBe(0)
})
