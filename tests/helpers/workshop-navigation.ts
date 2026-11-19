import type { Page } from '@playwright/test'

export async function selectScene(page: Page, id: string) {
  const example = page.locator(`[data-scene="${id}"]`)
  const groups = await page.locator('details').filter({ has: example }).all()
  for (const group of groups) {
    if ((await group.getAttribute('open')) === null) await group.locator('summary').first().click()
  }
  await example.click()
}
