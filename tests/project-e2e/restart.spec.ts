import { test, expect } from '@playwright/test'
import process from 'node:process'

test('reads the modified project after a new application process starts', async ({ page }) => {
  await page.goto(`/projects/${process.env.ADL_E2E_RESTART_ID}`)
  await expect(
    page.getByRole('heading', { name: process.env.ADL_E2E_RESTART_NAME!, exact: true }),
  ).toBeVisible()
  await expect(
    page.getByText(process.env.ADL_E2E_RESTART_DESCRIPTION!, { exact: true }),
  ).toBeVisible()
  await page.reload()
  await expect(
    page.getByRole('heading', { name: process.env.ADL_E2E_RESTART_NAME!, exact: true }),
  ).toBeVisible()
})
