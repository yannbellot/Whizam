import { test, expect } from '@playwright/test'

test('renders the architecture reference and interactive form pattern in Storybook', async ({
  page,
}) => {
  await page.goto('/iframe.html?id=design-system--rules&viewMode=story')
  await expect(
    page.getByRole('heading', { name: 'Principes et usages du design system', exact: true }),
  ).toBeVisible()
  await page.goto('/iframe.html?id=patterns-form-feedback--validation&viewMode=story')
  await page.getByRole('button', { name: 'Valider l’exemple', exact: true }).click()
  const input = page.getByRole('textbox', { name: 'Nom du document' })
  await expect(input).toBeFocused()
  await expect(input).toHaveAccessibleDescription('Saisissez un nom pour continuer.')
  await input.fill('Document de démonstration')
  await page.getByRole('button', { name: 'Valider l’exemple', exact: true }).click()
  await expect(input).toHaveValue('Document de démonstration')
  await expect(page.getByRole('status')).toContainText('Aucune donnée enregistrée.')
  await expect(page.locator('meta[name="adl-design-editor-session"]')).toHaveCount(0)
})

test('hands off React props, source and states without an editor service', async ({
  page,
  request,
  baseURL,
}) => {
  await page
    .context()
    .route('**/*', (route) =>
      new URL(route.request().url()).origin === baseURL ? route.continue() : route.abort(),
    )
  await page.goto('/iframe.html?id=components-button--docs&viewMode=docs')
  await expect(page.getByRole('heading', { name: 'Button', exact: true })).toBeVisible()
  for (const name of ['loading', 'disabled'])
    await expect(page.getByRole('cell', { name, exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Enregistrement…', exact: true })).toBeDisabled()
  await expect(page.locator('meta[name="adl-design-editor-session"]')).toHaveCount(0)
  expect((await request.post('/__design-system/editor/save', { data: {} })).status()).toBe(405)
})

test('keeps documentation navigation without the former editor addon or preview layer', async ({
  page,
}) => {
  await page.goto('/?path=/story/components-button--default')
  await expect(
    page.frameLocator('#storybook-preview-iframe').getByRole('button', {
      name: 'Enregistrer le projet',
      exact: true,
    }),
  ).toBeVisible()
  await expect(page.getByRole('tab', { name: 'Apparence', exact: true })).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Connecter Codex', exact: true })).toHaveCount(0)
  await expect(page.locator('meta[name="adl-design-editor-session"]')).toHaveCount(0)
  await expect(
    page.frameLocator('#storybook-preview-iframe').locator('style[data-design-editor]'),
  ).toHaveCount(0)
  await page.screenshot({
    path: `test-results/storybook-documentation-${test.info().project.name}.png`,
    fullPage: true,
  })
})

test('documents direct primitive references and page scopes without editing', async ({ page }) => {
  await page.goto('/iframe.html?id=design-system--tokens&viewMode=story')
  await expect(page.getByRole('columnheader', { name: 'Primitive', exact: true })).toBeVisible()
  await expect(page.locator('body')).toContainText('local.projects')
  await expect(page.getByRole('button', { name: 'Enregistrer', exact: true })).toHaveCount(0)
  await expect(page.locator('meta[name="adl-design-editor-session"]')).toHaveCount(0)
})
