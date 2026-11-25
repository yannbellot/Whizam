import { test, expect } from '@playwright/test'

for (const language of ['fr', 'en']) {
  for (const initial of ['light', 'dark'] as const) {
    test(`system theme ${language} ${initial}`, async ({ page, request }) => {
      const errors: string[] = []
      page.on('pageerror', (error) => errors.push(error.message))
      const index = await (await request.get('/index.json')).json()
      const entry = (Object.values(index.entries) as { id: string; title: string }[]).find((item) =>
        item.title.endsWith('/Primitives/All'),
      )!
      await page.emulateMedia({ colorScheme: initial })
      await page.goto(`/?path=/docs/${entry.id}&globals=documentationLanguage:${language}`)
      const frame = page.frameLocator('#storybook-preview-iframe')
      const content = frame.locator('.sbdocs-content')
      await expect(content).toContainText(language === 'fr' ? 'Aucun' : 'No project')
      const url = page.url()
      for (const scheme of [initial, initial === 'dark' ? 'light' : 'dark', initial] as const) {
        await page.emulateMedia({ colorScheme: scheme })
        await expect(page.locator('html')).toHaveCSS('color-scheme', scheme)
        await expect(frame.locator('.sbdocs-wrapper')).toHaveCSS('color-scheme', scheme)
        await expect(frame.locator('.sbdocs-wrapper')).toHaveCSS(
          'background-color',
          scheme === 'dark' ? 'rgb(11, 13, 15)' : 'rgb(255, 255, 255)',
        )
        expect(page.url()).toBe(url)
        await expect(content).toContainText(language === 'fr' ? 'Aucun' : 'No project')
      }
      await page.reload()
      await expect(frame.locator('.sbdocs-wrapper')).toHaveCSS('color-scheme', initial)
      expect(errors).toEqual([])
    })
  }
}
