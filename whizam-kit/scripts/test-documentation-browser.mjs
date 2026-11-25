import { chromium } from '@playwright/test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
const base = process.env.DOCS_URL ?? 'http://127.0.0.1:8000/'
if (new URL(base).hostname !== '127.0.0.1') throw new Error('Local synthetic target required')
const catalog = JSON.parse(await readFile('config/documentation/catalog.json', 'utf8'))
const browser = await chromium.launch({
  channel: process.env.DOCS_BROWSER_CHANNEL ?? 'chromium',
  headless: true,
})
try {
  for (const width of [1280, 1600]) {
    const page = await browser.newPage({
      viewport: { width, height: 900 },
      reducedMotion: 'reduce',
    })
    page.setDefaultTimeout(10000)
    const errors = [],
      external = []
    page.on('pageerror', (e) => errors.push(e.message))
    page.on('request', (r) => {
      if (!r.url().startsWith(base)) external.push(r.url())
    })
    await page.goto(base)
    await page.getByRole('heading', { name: /^Concevoir et développer avec Whizam/ }).waitFor()
    const rootItems = page.locator('nav[aria-label="Navigation"] > ul > li')
    assert.deepEqual(
      await rootItems.evaluateAll((items) =>
        items.map((item) => item.querySelector(':scope > a, :scope > label')?.textContent.trim()),
      ),
      ['Accueil', 'Guide d’utilisation', 'Suivi de projet', 'Documentation technique'],
    )
    await page.screenshot({
      path: `.runtime.local/documentation/home-${width}.png`,
      fullPage: true,
    })
    for (const [label, heading] of [
      ['Guide d’utilisation', /^Démarrer avec Whizam/],
      ['Suivi de projet', /^État courant du projet/],
      ['Partager votre projet', /^Partager votre projet/],
    ]) {
      await page.locator('main').getByRole('link', { name: label, exact: true }).click()
      await page.getByRole('heading', { name: heading }).waitFor()
      await page.goto(base)
    }
    await page
      .locator('main')
      .getByRole('link', { name: 'Guide d’utilisation', exact: true })
      .click()
    await page.getByRole('heading', { name: /^Démarrer avec Whizam/ }).waitFor()
    await page.screenshot({
      path: `.runtime.local/documentation/guide-${width}.png`,
      fullPage: true,
    })
    const guidePages = Object.keys(catalog.organization.documents).filter((s) =>
      s.startsWith('docs/guide-whizam/'),
    )
    assert.equal(guidePages.length, 9)
    for (const source of guidePages) {
      const route = source.replace(/index\.md$/, '').replace(/\.md$/, '/')
      const response = await page.goto(new URL(route, base).href)
      assert.equal(response.status(), 200)
      await page.locator('h1').waitFor()
    }
    // Vérifier le lien vers le suivi au clavier depuis l’accueil.
    await page.goto(base)
    const stateLink = page
      .locator('main')
      .getByRole('link', { name: 'Suivi de projet', exact: true })
    await stateLink.focus()
    await stateLink.press('Enter')
    await page.getByRole('heading', { name: /^État courant du projet/ }).waitFor()
    await page.goto(base)
    const sidebar = page.locator('nav[aria-label="Navigation"]')
    assert.equal(await sidebar.getByText('Historique du kit', { exact: true }).count(), 0)
    assert.equal(await sidebar.getByText('Documentation designer', { exact: true }).count(), 0)
    await sidebar
      .locator('label.md-nav__link')
      .filter({ hasText: 'Suivi de projet' })
      .first()
      .click()
    await sidebar.getByRole('link', { name: 'État courant', exact: true }).click()
    await page.getByRole('heading', { name: /^État courant du projet/ }).waitFor()
    const roadmap = sidebar.getByRole('link', { name: 'Roadmap', exact: true })
    await roadmap.focus()
    await roadmap.press('Enter')
    await page.getByRole('heading', { name: /^Roadmap du projet/ }).waitFor()
    await sidebar
      .locator('label.md-nav__link')
      .filter({ hasText: 'Étapes du projet' })
      .first()
      .click()
    await sidebar.getByRole('link', { name: 'Vue des étapes', exact: true }).click()
    await page.getByRole('heading', { name: /^Étapes du projet/ }).waitFor()
    if (!catalog.organization.stages?.length)
      await page.getByText('Aucune étape définie.', { exact: false }).waitFor()
    await sidebar
      .locator('label.md-nav__link')
      .filter({ hasText: 'Documentation technique' })
      .first()
      .click()
    for (const title of [
      'Architecture et données',
      'Installation et exploitation',
      'Sécurité et configuration privée',
      'Design system — implémentation',
      'Assistants et automatisations',
      'Maintenance de la documentation',
    ])
      assert.ok(
        await sidebar.locator('label.md-nav__link').filter({ hasText: title }).first().isVisible(),
        title,
      )
    await page.screenshot({
      path: `.runtime.local/documentation/preview-${width}.png`,
      fullPage: true,
    })
    await page.locator('button').first().click()
    const search = page.getByPlaceholder('Search')
    await search.pressSequentially('primitives', { delay: 30 })
    await page.getByText('Trois catégories de tokens', { exact: true }).first().waitFor()
    await search.fill('Démarrer avec Whizam')
    await page.locator('h2.x').filter({ hasText: 'Démarrer avec Whizam' }).first().waitFor()
    await search.press('Escape')
    // Vérifier chaque route historique dans l’index de recherche, pas seulement son intitulé.
    const index = await (await page.request.get(new URL('search.json', base).href)).json()
    const locations = index.items.map((item) => item.location.split('#')[0])
    for (const [source, info] of Object.entries(catalog.organization.documents)) {
      if (info.kind !== 'history' || source === 'README.md') continue
      const route = source.replace(/\.md$/, '/')
      assert.ok(!locations.includes(route), source + ' excluded from search')
    }
    for (const removed of [
      'preparer-kit',
      'premier-projet',
      'assistant',
      'cadrer-version',
      'demander-evolution',
      'verifier-decider',
      'reprendre-transmettre',
      'questions-frequentes',
    ]) {
      const route = 'docs/guide-whizam/' + removed + '/'
      assert.ok(!locations.includes(route), route + ' removed from search')
      assert.equal((await page.request.get(new URL(route, base).href)).status(), 404)
      for (const locale of ['fr', 'en'])
        assert.equal(
          (await page.request.get(new URL(locale + '/' + route, base).href)).status(),
          404,
        )
    }
    for (const source of [
      'docs/reviews/ds-edit-64-f/',
      'docs/work-items/port-03-autonomous-agent-kit/',
    ])
      assert.equal((await page.request.get(new URL(source, base).href)).status(), 404)
    assert.equal((await page.request.post(base)).status(), 405)
    assert.equal((await page.request.get(new URL('.env.local', base).href)).status(), 404)
    assert.deepEqual(errors, [])
    assert.deepEqual(external, [])
    console.log(
      width,
      'navigation, keyboard link, search, historical routes and private exclusions verified',
    )
    await page.close()
  }
} finally {
  await browser.close()
}
