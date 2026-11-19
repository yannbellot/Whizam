import { test, expect } from '@playwright/test'
import { execFileSync } from 'node:child_process'
import process from 'node:process'
import { request as httpRequest } from 'node:http'

test.beforeEach(async ({ context, baseURL }) => {
  await context.route('**/*', (route) =>
    new URL(route.request().url()).origin === baseURL ? route.continue() : route.abort(),
  )
})

test('creates and edits a project through real server validation and persistence', async ({
  page,
}, testInfo) => {
  const name = `Projet ${process.env.ADL_E2E_RUN_ID} ${testInfo.project.name}`
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/')
  await page.getByRole('link', { name: 'Ouvrir l’exemple de projet test', exact: true }).click()
  await expect(page).toHaveTitle('Exemple de projet test — Agentic Design Lab')
  await expect(
    page.getByRole('heading', { name: 'Exemple de projet test', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByText('Elle ne crée pas de nouvelles applications.', { exact: false }),
  ).toBeVisible()
  await expect(
    page.getByRole('navigation').getByRole('link', { name: 'Exemple de projet test', exact: true }),
  ).toBeVisible()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBe(true)
  await page.screenshot({ path: testInfo.outputPath('project-example.png'), fullPage: true })
  if (testInfo.project.name === 'desktop')
    await expect(page.getByText('Aucun projet pour le moment.')).toBeVisible()
  await page.getByRole('link', { name: 'Créer un projet' }).click()
  await page.getByRole('textbox', { name: 'Nom du projet' }).fill('   ')
  await page.getByRole('textbox', { name: 'Description', exact: true }).fill('Saisie conservée')
  await page.getByRole('button', { name: 'Enregistrer le projet' }).click()
  await expect(page.getByRole('alert')).toContainText('Vérifiez les champs')
  await expect(page.getByRole('alert').locator('..')).toBeFocused()
  await expect(page.getByRole('textbox', { name: 'Nom du projet' })).toHaveAttribute(
    'aria-invalid',
    'true',
  )
  await expect(page.getByRole('textbox', { name: 'Description', exact: true })).toHaveValue(
    'Saisie conservée',
  )
  await page.getByRole('textbox', { name: 'Nom du projet' }).fill(name)
  await page
    .getByRole('textbox', { name: 'Description', exact: true })
    .fill('<script>window.injected = true</script>\nTexte fictif.')
  await page.route(
    '**/projects/new.data*',
    async (route) => {
      await new Promise((accept) => setTimeout(accept, 400))
      await route.continue()
    },
    { times: 1 },
  )
  await page.getByRole('textbox', { name: 'Description', exact: true }).press('Tab')
  await expect(page.getByRole('button', { name: 'Enregistrer le projet' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('button', { name: 'Enregistrement…' })).toBeDisabled()
  await expect(page.getByRole('heading', { name, exact: true })).toBeVisible()
  await expect(page.getByRole('status')).toContainText('Le projet a été créé.')
  const detail = new URL(page.url()).pathname
  await page.reload()
  await expect(
    page.getByText('<script>window.injected = true</script>', { exact: false }),
  ).toBeVisible()
  expect(await page.evaluate(() => 'injected' in window)).toBe(false)
  await page.getByRole('link', { name: 'Modifier le projet' }).click()
  await page.getByRole('textbox', { name: 'Nom du projet' }).fill(name + ' modifié')
  await page
    .getByRole('textbox', { name: 'Description', exact: true })
    .fill('Modification persistante fictive.')
  await page.getByRole('button', { name: 'Enregistrer le projet' }).click()
  await expect(page.getByRole('heading', { name: name + ' modifié', exact: true })).toBeVisible()
  expect(new URL(page.url()).pathname).toBe(detail)
  await page.reload()
  await expect(page.getByText('Modification persistante fictive.', { exact: true })).toBeVisible()
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBe(true)
  await page.screenshot({ path: testInfo.outputPath('project-detail.png'), fullPage: true })
  await page.getByRole('link', { name: 'Modifier le projet' }).focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { name: 'Modifier le projet', exact: true })).toBeVisible()
  await page.getByRole('textbox', { name: 'Nom du projet' }).fill('Annulation sans écriture')
  await page.getByRole('link', { name: 'Annuler' }).click()
  await expect(page.getByRole('heading', { name: name + ' modifié', exact: true })).toBeVisible()
  expect(errors).toEqual([])
})

test('refuses invalid server requests and missing projects', async ({ request, baseURL }) => {
  const post = (body: string, headers: Record<string, string> = {}) =>
    request.post('/projects/new', {
      data: body,
      maxRedirects: 0,
      headers: {
        Origin: baseURL!,
        'Content-Type': 'application/x-www-form-urlencoded',
        ...headers,
      },
    })
  for (const body of [
    'name=+++',
    'name=' + 'x'.repeat(101),
    'name=A&description=' + 'x'.repeat(2001),
    'name=A&name=B',
    'name=A&id=forged',
  ])
    expect((await post(body)).status()).toBe(400)
  expect((await post('name=A', { Origin: 'http://foreign.invalid' })).status()).toBe(400)
  expect((await post('name=A', { Origin: '' })).status()).toBe(403)
  expect(
    (
      await request.post('/projects/new', {
        data: 'name=A',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
    ).status(),
  ).toBe(403)
  expect((await post('name=A', { 'Sec-Fetch-Site': 'cross-site' })).status()).toBe(403)
  expect((await post('name=A', { 'Content-Type': 'application/json' })).status()).toBe(415)
  const oversized = await post('name=' + 'x'.repeat(17000))
  expect(oversized.status()).toBe(413)
  const chunkedStatus = await new Promise<number>((accept, reject) => {
    const outgoing = httpRequest(
      new URL('/projects/new', baseURL!),
      {
        method: 'POST',
        headers: {
          Origin: baseURL!,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Transfer-Encoding': 'chunked',
        },
      },
      (response) => {
        response.resume()
        response.on('end', () => accept(response.statusCode ?? 0))
      },
    )
    outgoing.on('error', reject)
    outgoing.write('name=' + 'x'.repeat(10000))
    outgoing.end('x'.repeat(10000))
  })
  expect(chunkedStatus).toBe(413)
  expect(
    (
      await request.put('/projects/new', { data: 'name=A', headers: { Origin: baseURL! } })
    ).status(),
  ).toBe(405)
  expect((await request.get('/projects/invalid')).status()).toBe(400)
  const missing = await request.get('/projects/99999999-9999-4999-8999-999999999999')
  expect(missing.status()).toBe(404)
  expect((await missing.text()).includes('node_modules')).toBe(false)
  expect((await request.get('/projects', { headers: { Host: 'foreign.invalid' } })).status()).toBe(
    403,
  )
})

test('preserves input on database failure and recovers after its owned database restarts', async ({
  page,
  request,
}, testInfo) => {
  const id = process.env.ADL_E2E_DATABASE_ID!
  const runId = process.env.ADL_E2E_RUN_ID!
  const label = execFileSync(
    'docker',
    ['inspect', '--format', '{{index .Config.Labels "org.agentic-design.e2e"}}', id],
    { encoding: 'utf8' },
  ).trim()
  if (label !== runId) throw new Error('Owned database identity mismatch')
  await page.goto('/projects/new')
  const name = `Reprise ${testInfo.project.name}`
  await page.getByRole('textbox', { name: 'Nom du projet' }).fill(name)
  await page
    .getByRole('textbox', { name: 'Description', exact: true })
    .fill('Saisie après panne fictive')
  const editPage = await page.context().newPage()
  await editPage.goto('/projects')
  await editPage
    .getByRole('link', { name: `Projet ${runId} ${testInfo.project.name} modifié`, exact: true })
    .click()
  await editPage.getByRole('link', { name: 'Modifier le projet' }).click()
  await editPage
    .getByRole('textbox', { name: 'Description', exact: true })
    .fill('Modification conservée après panne fictive')
  execFileSync('docker', ['stop', '--time', '5', id], { stdio: 'pipe' })
  try {
    await page.getByRole('button', { name: 'Enregistrer le projet' }).click()
    await expect(page.getByRole('alert')).toContainText('stockage indisponible', { timeout: 15000 })
    await expect(page.getByRole('textbox', { name: 'Nom du projet' })).toHaveValue(name)
    await expect(page.getByRole('textbox', { name: 'Description', exact: true })).toHaveValue(
      'Saisie après panne fictive',
    )
    await editPage.getByRole('button', { name: 'Enregistrer le projet' }).click()
    await expect(editPage.getByRole('alert')).toContainText('stockage indisponible', {
      timeout: 15000,
    })
    await expect(editPage.getByRole('textbox', { name: 'Description', exact: true })).toHaveValue(
      'Modification conservée après panne fictive',
    )
    const response = await request.get('/projects')
    expect(response.status()).toBe(503)
    const html = await response.text()
    expect(html.includes(process.env.ADL_PROJECTS_DATABASE_URL!)).toBe(false)
    expect(html.includes('node_modules')).toBe(false)
  } finally {
    execFileSync('docker', ['start', id], { stdio: 'pipe' })
  }
  await expect
    .poll(async () => (await request.get('/projects')).status(), { timeout: 20000 })
    .toBe(200)
  await page.getByRole('button', { name: 'Enregistrer le projet' }).click()
  await expect(page.getByRole('heading', { name, exact: true })).toBeVisible()
  await editPage.getByRole('button', { name: 'Enregistrer le projet' }).click()
  await expect(
    editPage.getByText('Modification conservée après panne fictive', { exact: true }),
  ).toBeVisible()
  await editPage.close()
})

test('presents an optional empty description consistently without inventing data', async ({
  page,
}, testInfo) => {
  const name = 'Sans description ' + testInfo.project.name
  await page.goto('/projects/new')
  await page.getByRole('textbox', { name: 'Nom du projet' }).fill(name)
  await page.getByRole('button', { name: 'Enregistrer le projet' }).click()
  await expect(page.getByRole('heading', { name, exact: true })).toBeVisible()
  await expect(
    page.getByText('Ce projet ne comporte pas encore de description.', { exact: true }),
  ).toBeVisible()
  await page.reload()
  await expect(
    page.getByText('Ce projet ne comporte pas encore de description.', { exact: true }),
  ).toBeVisible()
  await page.screenshot({ path: testInfo.outputPath('empty-description.png'), fullPage: true })
  await page.getByRole('link', { name: 'Tous les projets' }).click()
  const row = page.getByRole('listitem').filter({ hasText: name })
  await expect(
    row.getByText('Ce projet ne comporte pas encore de description.', { exact: true }),
  ).toBeVisible()
})
