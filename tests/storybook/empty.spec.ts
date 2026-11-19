import { test, expect } from '@playwright/test'

test('Storybook starts with an empty catalog', async ({ page, request }) => {
  const response = await request.get('/index.json')
  expect(response.ok()).toBe(true)
  const index = await response.json()
  expect(index.entries).toEqual({})
  await page.goto('/')
  await expect(page.locator('#root')).toBeVisible()
  await expect(page.locator('[data-item-id]')).toHaveCount(0)
})
