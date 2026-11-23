import { fileURLToPath } from 'node:url'
import {
  readDocumentationPreference,
  initialDocumentationLanguage,
} from '../../scripts/documentation-preference.mjs'
import { test, expect } from '@playwright/test'

import { catalogPages } from '../../.storybook/organization'
const titles = catalogPages
const informational = /Architecture|Principles|Intentions/
test('organisation complète sans contenu initial', async ({ page, request }, testInfo) => {
  const response = await request.get('/index.json')
  expect(response.ok()).toBe(true)
  const index = await response.json()
  const entries = Object.values(index.entries) as { id: string; title: string; type: string }[]
  expect(entries.map((entry) => entry.title).sort()).toEqual([...titles].sort())
  expect(entries.every((entry) => entry.type === 'docs')).toBe(true)
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  for (const entry of entries) {
    await page.goto('/?path=/docs/' + entry.id + '&globals=documentationLanguage:fr')
    const frame = page.frameLocator('#storybook-preview-iframe')
    if (!informational.test(entry.title)) {
      await expect(frame.getByText(/Aucun.*projet.*document/)).toBeVisible()
      await expect(frame.locator('.sbdocs-content table')).toHaveCount(0)
    } else await expect(frame.locator('.sbdocs-content')).not.toBeEmpty()
    await expect(frame.locator('.sbdocs-content')).not.toContainText('Button')
  }
  await page.goto(
    '/?path=/docs/' +
      entries.find((entry) => entry.title.endsWith('/Primitives/All'))!.id +
      '&globals=documentationLanguage:en',
  )
  const english = page.frameLocator('#storybook-preview-iframe')
  await expect(english.getByText(/No project.*documented/)).toBeVisible()
  await expect(english.getByText(/Aucun.*projet.*document/)).toHaveCount(0)
  await page.screenshot({ path: testInfo.outputPath('structure.png'), fullPage: true })
  await page.getByRole('button', { name: 'Documentation language English', exact: true }).click()
  await page.getByText('Français', { exact: true }).click()
  await expect(english.getByText(/Aucun.*projet.*document/)).toBeVisible()
  expect(errors).toEqual([])
})

test('langue initiale issue de la préférence du projet', async ({ page, request }) => {
  const root = fileURLToPath(new URL('../..', import.meta.url))
  const language = initialDocumentationLanguage(await readDocumentationPreference(root))
  const index = await (await request.get('/index.json')).json()
  const entry = (Object.values(index.entries) as { id: string; title: string }[]).find((entry) =>
    entry.title.endsWith('/Primitives/All'),
  )!
  await page.goto('/?path=/docs/' + entry.id)
  const frame = page.frameLocator('#storybook-preview-iframe')
  await expect(
    frame.getByText(language === 'en' ? /No project.*documented/ : /Aucun.*projet.*document/),
  ).toBeVisible()
})
