// Two real React Router pages in a disposable Loomata project; no provider or database required.
import fs from 'node:fs/promises'
import path from 'node:path'
import { spawn, execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { createServer } from 'node:net'
import { randomUUID, createHash } from 'node:crypto'
process.env.PLAYWRIGHT_BROWSERS_PATH = path.resolve(
  import.meta.dirname,
  '../.runtime.local/playwright',
)
const { chromium, webkit, expect: playwrightExpect } = await import('@playwright/test')
import { copyFixture } from './test-local-app.mjs'
import { WorkspaceStore } from './core/workspace.ts'
import { loadTokens } from './dtcg-tokens.mjs'
import { prepareProject } from './core/projects.mjs'
import { normalizeFigmaFile } from './core/figma-file-client.ts'
// Source publication regenerates the full DS and can exceed five seconds on a busy local host.
const expect = playwrightExpect.configure({ timeout: 30000 })
async function openProjectPage(page, title = 'Première page') {
  const search = page.getByRole('searchbox', { name: 'Rechercher dans le UI Lab' })
  await search.fill('Pages ' + title)
  await page
    .getByRole('treegrid', { name: 'Pages et Design System' })
    .getByText(title, { exact: true })
    .click()
}
async function openFigma(page) {
  if (!page.__figmaObserved) {
    page.__figmaObserved = true
    page.on('response', async (response) => {
      if (
        response.url().endsWith('/project/figma') ||
        response.url().endsWith('/project/exploration')
      ) {
        const body = await response.json().catch(() => ({}))
        if (!response.ok() || body.status === 'invalid')
          report.apiErrors = [
            ...(report.apiErrors ?? []),
            { status: response.status(), error: body.error, issues: body.issues },
          ]
      }
    })
  }
  await page.getByRole('button', { name: 'Figma', exact: true }).click()
}
const run = promisify(execFile),
  kit = path.resolve(import.meta.dirname, '..')
const parent = path.join(kit, 'test-results/exploration-ui')
await fs.mkdir(parent, { recursive: true })
const output = await fs.mkdtemp(path.join(parent, 'run-')),
  root = path.join(output, 'project')
const report = { status: 'running', cases: [] }
const contextualOnly = process.argv.includes('--contextual-only')
let child, browser, currentPage
const log = await fs.open(path.join(output, 'service.log'), 'w')
try {
  await copyFixture(root, { includeDependencies: false })
  await run('/bin/cp', ['-cR', path.join(kit, 'node_modules'), root], { timeout: 180000 })
  const [
    projectId,
    pageA,
    pageB,
    definition,
    occurrenceA,
    occurrenceB,
    marker,
    labelDefinition,
    labelA,
    labelB,
    labelMarker,
  ] = Array.from({ length: 11 }, () => randomUUID())
  const revision = 'a'.repeat(64)
  const [pattern, secondPlacement, firstCard, secondCard, otherCard, firstMark, secondMark] =
    Array.from({ length: 7 }, () => randomUUID())
  const firstPlacement = 'de873e98-e6c0-46c1-8096-759448e17490'
  const legacyStyles = [
    {
      target: { kind: 'definition', ownerId: definition, variant: 'default', part: 'root' },
      state: 'default',
      condition: null,
      declarations: { 'background-color': '#244A98', 'box-shadow': '0 2px 8px #00000040' },
    },
    {
      target: { kind: 'definition', ownerId: definition, variant: 'default', part: 'root' },
      state: 'default',
      condition: '(min-width: 600px)',
      declarations: { padding: '4px 8px 6px 10px' },
    },
    {
      target: { kind: 'definition', ownerId: definition, variant: 'default', part: 'root' },
      state: 'hover',
      condition: null,
      declarations: { width: '160px' },
    },
  ]
  if (contextualOnly) {
    await fs.writeFile(
      path.join(root, 'app/loomata-context-styles.json'),
      JSON.stringify(legacyStyles),
    )
    const file = path.join(root, 'src/design-system/patterns/FormFeedback.tsx')
    const patternCode = await fs.readFile(file, 'utf8')
    await fs.writeFile(
      file,
      patternCode.replace(
        '</form>',
        `<Button data-loomata-placement="${secondPlacement}">Autre action</Button></form>`,
      ),
    )
  }
  await fs.writeFile(
    path.join(root, 'loomata.project.json'),
    JSON.stringify({ version: 1, phase: 'created', id: projectId, name: 'Pages de qualification' }),
  )
  await fs.writeFile(
    path.join(root, 'app/routes.ts'),
    `import {index,route} from '@react-router/dev/routes';export default [index('routes/first.tsx'),route('two','routes/second.tsx'),route('imported/:definitionId','routes/imported-page.tsx'),route('ui-lab','routes/ui-lab.tsx'),route('ui-lab/preview','routes/ui-lab-preview.tsx')];`,
  )
  for (const [file, title, cards] of [
    ['first', 'Première page', [firstMark, secondMark]],
    ['second', 'Seconde page', [firstMark]],
  ])
    await fs.writeFile(
      path.join(root, `app/routes/${file}.tsx`),
      `import {Button} from '../../src/design-system/components/Button/Button';
      ${contextualOnly ? "import {FormFeedback} from '../../src/design-system/patterns/FormFeedback';" : ''}
      export default function Page(){return <main style={{maxWidth:600,margin:'64px auto'}}><h1>${title}</h1><Button data-loomata-node="${marker}" onClick={()=>document.body.dataset.executed='yes'}><span data-loomata-node="${labelMarker}">Action du projet</span></Button>
      ${contextualOnly ? cards.map((card) => `<FormFeedback data-loomata-node="${card}"/>`).join('') : ''}
      </main>}`,
    )
  await run(process.execPath, ['scripts/generate-tokens.mjs'], { cwd: root, timeout: 60000 })
  const store = new WorkspaceStore(root)
  await store.git(['init', '-b', 'main'])
  await store.git(['add', '.'])
  await store.git(['commit', '-m', 'test: establish real page fixture'])
  await store.initialize({
    schemaVersion: 1,
    projectId,
    revision,
    entities: [
      { id: pageA, kind: 'page', label: 'Première page', path: '/', revision },
      { id: pageB, kind: 'page', label: 'Seconde page', path: '/two', revision },
      { id: definition, kind: 'component', sourceKey: 'button', label: 'Button', revision },
      ...(contextualOnly
        ? [
            {
              id: pattern,
              kind: 'component',
              sourceKey: 'form-feedback',
              label: 'Validation de formulaire',
              revision,
              placements: [firstPlacement, secondPlacement].map((id) => ({
                id,
                definitionId: definition,
              })),
            },
            ...[
              { id: firstCard, pageId: pageA, marker: firstMark },
              { id: secondCard, pageId: pageA, marker: secondMark },
              { id: otherCard, pageId: pageB, marker: firstMark },
            ].map((card) => ({
              ...card,
              kind: 'occurrence',
              variantId: null,
              definitionId: pattern,
              label: 'Formulaire',
              revision,
            })),
          ]
        : []),
      {
        id: labelDefinition,
        kind: 'component',
        sourceKey: 'button-label',
        label: 'Libellé du bouton',
        revision,
      },
      ...[
        { id: labelA, pageId: pageA, parentId: occurrenceA },
        { id: labelB, pageId: pageB, parentId: occurrenceB },
      ].map((e) => ({
        ...e,
        kind: 'occurrence',
        definitionId: labelDefinition,
        variantId: null,
        marker: labelMarker,
        label: 'Libellé de l’action',
        revision,
      })),
      {
        id: occurrenceA,
        kind: 'occurrence',
        label: 'Action de la première page',
        pageId: pageA,
        definitionId: definition,
        variantId: null,
        marker,
        revision,
      },
      {
        id: occurrenceB,
        kind: 'occurrence',
        label: 'Action de la seconde page',
        pageId: pageB,
        definitionId: definition,
        variantId: null,
        marker,
        revision,
      },
    ],
  })
  await store.git(['add', 'loomata/workspace.json'])
  await store.git(['commit', '-m', 'test: register page identities'])
  const treeId = await store.openTree('draft')
  const servedRoot = store.treeRoot(treeId)
  await prepareProject(servedRoot, root, process.execPath)
  const socket = createServer()
  await new Promise((r) => socket.listen(0, '127.0.0.1', r))
  const port = socket.address().port
  await new Promise((r) => socket.close(r))
  child = spawn(process.execPath, ['scripts/ui-lab-local.mjs', '--port', String(port)], {
    cwd: servedRoot,
    detached: true,
    env: {
      ...process.env,
      PATH: path.dirname(process.execPath) + ':' + process.env.PATH,
      DATABASE_URL: '',
    },
    stdio: ['ignore', log.fd, log.fd],
  })
  await fs.writeFile(
    path.join(output, 'owned-process.json'),
    JSON.stringify({ pid: child.pid, root: servedRoot, port }, null, 2) + '\n',
  )
  const origin = `http://127.0.0.1:${port}`
  for (let i = 0; ; i++) {
    try {
      if ((await fetch(origin + '/ui-lab')).ok) break
    } catch {}
    if (i === 150) throw new Error('Owned workshop unavailable')
    await new Promise((r) => setTimeout(r, 500))
  }
  browser = process.argv.includes('--webkit')
    ? await webkit.launch()
    : await chromium.launch({ channel: 'chromium' })
  const navigationOnly = process.argv.includes('--navigation-only')
  if (contextualOnly) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
    currentPage = page
    page.on('pageerror', (error) => {
      report.browserErrors = [...(report.browserErrors ?? []), error.stack]
    })
    page.on('console', (message) => {
      if (message.type() === 'error')
        report.browserErrors = [...(report.browserErrors ?? []), message.text()]
    })
    const panel = page.locator('[data-inspector-panel]')
    const background = panel.locator('[data-visual-property="background-color"]')
    const preview = page.frameLocator('iframe[title="Aperçu du design system"]')
    const site = page.frameLocator('iframe[title="Page réelle du projet"]')
    async function saveContextualStyle(gesture) {
      const response = page.waitForResponse(
        (result) => result.url().endsWith('/project/visual-style') && result.status() !== 503,
        { timeout: 35000 },
      )
      await gesture()
      const result = await response
      const saved = await result.json()
      if (!result.ok() || saved.status === 'unconvertible')
        throw new Error('Écriture visuelle refusée · ' + JSON.stringify(saved))
    }
    async function editField(field, value) {
      await expect(field).toBeEditable()
      await field.fill(value)
      await saveContextualStyle(() => field.press('Enter'))
      await expect(field).toBeEditable()
    }
    async function editBackground(button, value, opacityValue) {
      await button.click({ position: { x: 4, y: 4 } })
      await expect(background).toHaveCount(1)
      await expect(panel.getByRole('combobox', { name: 'État', exact: true })).toBeEnabled()
      await editField(background, value)
      if (opacityValue) await editField(opacity, opacityValue)
    }
    await page.goto(origin + '/ui-lab?scene=button%2FDefault')
    const generic = preview.getByRole('button', { name: 'Enregistrer le projet', exact: true })
    await generic.click({ position: { x: 4, y: 4 } })
    const opacity = panel.locator('[data-visual-property="opacity"]')
    const shadow = panel.locator('[data-visual-property="box-shadow"]')
    const stateField = panel.getByRole('combobox', { name: 'État', exact: true })
    const widthField = panel.locator('[data-visual-property="width"]')
    const focusFields = panel.getByRole('region', { name: 'Contour de focus', exact: true })
    async function checkAlternateStates() {
      await expect(opacity).toHaveCount(1)
      const fields = () =>
        panel
          .locator('[data-visual-property]')
          .evaluateAll((nodes) => nodes.map((el) => el.getAttribute('data-visual-property')))
      const initial = await fields()
      expect(new Set(initial).size).toBe(initial.length)
      for (const value of ['hover', 'focus-visible', 'disabled', 'loading']) {
        await stateField.selectOption(value)
        await expect.poll(fields).toEqual(initial)
        await expect(background).toHaveCount(1)
        await expect(opacity).toHaveCount(1)
        await expect(widthField).toHaveCount(1)
        for (const label of ['Couleur', 'Épaisseur', 'Décalage'])
          await expect(focusFields.getByLabel(label, { exact: true })).toHaveCount(1)
      }
      await stateField.selectOption('default')
      await expect.poll(fields).toEqual(initial)
    }
    async function expectStateAlignment(field) {
      const controlLeft = (el) =>
        el.closest('[data-inspector-control]').getBoundingClientRect().left
      const expected = await field.evaluate(controlLeft)
      const actual = await stateField.evaluate(controlLeft)
      expect(Math.abs(actual - expected)).toBeLessThan(1)
    }
    for (const name of [
      'Retouche CSS',
      'Enregistrer la modification',
      'Transmettre à Loomata',
      'Actualiser les lots reçus',
      'Demander l’application',
    ])
      await expect(panel.getByRole('button', { name, exact: true })).toHaveCount(0)
    await expect(panel.getByRole('region', { name: 'Lots reçus' })).toHaveCount(0)
    await expect(background).toHaveCount(1)
    await expect(opacity).toBeEditable()
    await expect(shadow).toBeEditable()
    await expectStateAlignment(background)
    await checkAlternateStates()
    await generic.getByText('Enregistrer le projet', { exact: true }).click()
    await expect(panel.getByRole('combobox', { name: 'Type', exact: true })).toBeVisible()
    await expect(panel.locator('[data-visual-property="color"]')).toHaveAccessibleName('Couleur')
    await expect(panel.locator('[data-visual-property="font-size"]')).toBeEditable()
    await expect(background).toHaveCount(0)
    await expect(shadow).toHaveCount(0)
    await expect(panel.getByRole('combobox', { name: 'Portée de la demande' })).toHaveCount(0)
    report.cases.push('Un seul champ Fond sur Button et sélection exacte du libellé')

    await page.goto(origin + '/ui-lab?scene=pattern%2Fform-feedback%2FValidation')
    const placement = preview.getByRole('button', { name: 'Valider l’exemple', exact: true })
    await placement.click({ position: { x: 4, y: 4 } })
    await checkAlternateStates()
    await editBackground(placement, '#167245')
    await expect(placement).toHaveCSS('background-color', 'rgb(22, 114, 69)')
    await expect(preview.getByRole('button', { name: 'Autre action', exact: true })).toHaveCSS(
      'background-color',
      'rgb(36, 74, 152)',
    )

    await page.goto(origin + '/ui-lab?page=' + pageA)
    const repeated = site.getByRole('button', { name: 'Valider l’exemple', exact: true })
    await expect(repeated.nth(0)).toHaveCSS('background-color', 'rgb(22, 114, 69)')
    await expect(repeated.nth(1)).toHaveCSS('background-color', 'rgb(22, 114, 69)')
    await repeated.nth(1).click({ position: { x: 4, y: 4 } })
    await checkAlternateStates()
    report.cases.push(
      'Mêmes champs sans doublon dans chaque état sur la définition, le placement et l’instance',
    )
    await editBackground(repeated.nth(1), '#2F00D980')
    await expect(repeated.nth(1)).toHaveCSS('background-color', 'rgba(47, 0, 217, 0.5)')
    await page.reload()
    await expect(repeated.nth(0)).toHaveCSS('background-color', 'rgb(22, 114, 69)')
    await expect(repeated.nth(1)).toHaveCSS('background-color', 'rgba(47, 0, 217, 0.5)')
    await expect(site.getByRole('button', { name: 'Autre action', exact: true }).nth(1)).toHaveCSS(
      'background-color',
      'rgb(36, 74, 152)',
    )
    await page.goto(origin + '/ui-lab?page=' + pageB)
    await expect(repeated).toHaveCSS('background-color', 'rgb(22, 114, 69)')
    report.cases.push(
      'Placement du pattern et surcharge transparente de la deuxième instance sur une seule page',
    )
    const current = (await store.snapshot()).trees.find((tree) => tree.id === treeId)
    const invalid = await page.evaluate(
      async ({ revision, pageId, occurrenceId, placementId }) => {
        const session = document.querySelector('meta[name="adl-design-editor-session"]').content
        const req = await fetch('/__design-system/editor/project/visual-style', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Design-Editor-Session': session },
          body: JSON.stringify({
            id: crypto.randomUUID(),
            revision,
            target: {
              kind: 'instance',
              pageId,
              occurrenceId,
              placements: [placementId],
              part: 'root',
            },
            state: 'default',
            condition: null,
            changes: [{ property: 'opacity', value: '0.4' }],
          }),
        })
        return req.status
      },
      {
        revision: current.revision,
        pageId: pageB,
        occurrenceId: secondCard,
        placementId: firstPlacement,
      },
    )
    if (invalid !== 409) throw new Error('Le serveur a accepté une occurrence étrangère à la page')
    report.cases.push('Refus serveur d’une occurrence étrangère à la page')

    const contextualFile = path.join(servedRoot, 'app/loomata-context-styles.json')
    const before = JSON.parse(await fs.readFile(contextualFile, 'utf8'))
    await page.goto(origin + '/ui-lab?scene=button%2FDefault')
    await expect(generic).toHaveCSS('background-color', 'rgb(36, 74, 152)')
    await expect(generic).toHaveCSS('padding', '4px 8px 6px 10px')
    const originalShadow = await generic.evaluate((el) => getComputedStyle(el).boxShadow)
    expect(originalShadow).not.toBe('none')
    await saveContextualStyle(() =>
      panel.getByRole('button', { name: 'Migrer les réglages des composants' }).click(),
    )
    await page.reload()
    await expect(
      panel.getByRole('button', { name: 'Migrer les réglages des composants' }),
    ).toHaveCount(0)
    expect(JSON.parse(await fs.readFile(contextualFile, 'utf8'))).toEqual(
      before.filter((row) => row.target.kind !== 'definition'),
    )
    const migrated = await loadTokens(servedRoot)
    expect(
      migrated.ids.get('component.button.default.root.background.default').value.components,
    ).toEqual([36 / 255, 74 / 255, 152 / 255])
    expect(
      migrated.entries.some((entry) => entry.meta.owner === 'button' && entry.type === 'shadow'),
    ).toBe(true)
    await expect(generic).toHaveCSS('background-color', 'rgb(36, 74, 152)')
    await expect(generic).toHaveCSS('padding', '4px 8px 6px 10px')
    await expect(generic).toHaveCSS('box-shadow', originalShadow)
    report.cases.push(
      'Migration du token existant, de l’ombre et du padding responsive, avec les deux surcharges locales conservées',
    )
    await expect(generic).toBeVisible()
    await editBackground(generic, '#555577', '0.75')
    await expect(generic).toHaveCSS('background-color', 'rgb(85, 85, 119)')
    await page.goto(origin + '/ui-lab?page=' + pageA)
    await expect(repeated.nth(0)).toHaveCSS('background-color', 'rgb(22, 114, 69)')
    await expect(repeated.nth(1)).toHaveCSS('background-color', 'rgba(47, 0, 217, 0.5)')
    await expect(repeated.nth(0)).toHaveCSS('opacity', '0.75')
    await expect(repeated.nth(1)).toHaveCSS('opacity', '0.75')
    await expect(site.getByRole('button', { name: 'Autre action', exact: true }).nth(1)).toHaveCSS(
      'background-color',
      'rgb(85, 85, 119)',
    )
    await page.goto(origin + '/ui-lab?page=' + pageB)
    await expect(repeated).toHaveCSS('background-color', 'rgb(22, 114, 69)')
    report.cases.push(
      'Les fonds du pattern et de l’instance survivent au changement générique du même état et héritent de sa nouvelle opacité',
    )

    await page.goto(origin + '/ui-lab?scene=pattern%2Fform-feedback%2FValidation')
    await editBackground(placement, '#667744')
    await page.goto(origin + '/ui-lab?page=' + pageA)
    await expect(repeated.nth(0)).toHaveCSS('background-color', 'rgb(102, 119, 68)')
    await expect(repeated.nth(1)).toHaveCSS('background-color', 'rgba(47, 0, 217, 0.5)')
    await page.goto(origin + '/ui-lab?page=' + pageB)
    await expect(repeated).toHaveCSS('background-color', 'rgb(102, 119, 68)')
    report.cases.push(
      'La surcharge de la page survit à la mise à jour de son placement dans le pattern',
    )

    await page.goto(origin + '/ui-lab?page=' + pageA)
    await editBackground(repeated.nth(1), '#AA4400')
    await page
      .getByRole('button', { name: 'Annuler le dernier changement du brouillon', exact: true })
      .click()
    await expect(repeated.nth(0)).toHaveCSS('background-color', 'rgb(102, 119, 68)')
    await expect(repeated.nth(1)).toHaveCSS('background-color', 'rgba(47, 0, 217, 0.5)')
    report.cases.push('Annulation durable de la nouvelle valeur, surcharge précédente conservée')
    await page.goto(origin + '/ui-lab?scene=button%2FDefault')
    await generic.click({ position: { x: 4, y: 4 } })
    const state = panel.getByRole('combobox', { name: 'État', exact: true })
    await state.selectOption('hover')
    await expect(opacity).toHaveValue('0.75')
    await editField(background, '#225599')
    await editField(opacity, '0.8')
    await page.reload()
    await generic.click({ position: { x: 4, y: 4 } })
    await expect(opacity).toHaveValue('0.75')
    for (const value of ['disabled', 'loading', 'focus-visible']) {
      await state.selectOption(value)
      await expect(opacity).toHaveValue('0.75')
    }
    await state.selectOption('hover')
    await expect(opacity).toHaveValue('0.8')
    const direct = await browser.newPage()
    await direct.goto(origin + '/')
    const genericInstance = direct.getByRole('button', { name: 'Action du projet', exact: true })
    await expect(genericInstance).toHaveCSS('background-color', 'rgb(85, 85, 119)')
    await expect(genericInstance).toHaveCSS('opacity', '0.75')
    await genericInstance.hover()
    await expect(genericInstance).toHaveCSS('background-color', 'rgb(34, 85, 153)')
    await expect(genericInstance).toHaveCSS('opacity', '0.8')
    await direct.close()
    const slider = panel.getByRole('slider', { name: 'Régler l’opacité' })
    await expect(slider).toBeEnabled()
    await slider.scrollIntoViewIfNeeded()
    const range = await slider.boundingBox()
    await page.mouse.move(range.x + range.width * 0.8, range.y + range.height / 2)
    await page.mouse.down()
    await page.mouse.move(range.x + 1, range.y + range.height / 2, { steps: 8 })
    await expect(opacity).toHaveValue('0')
    await saveContextualStyle(() => page.mouse.up())
    await expect(opacity).toHaveValue('0')
    await panel.getByRole('button', { name: 'Annuler la retouche', exact: true }).click()
    await expect(opacity).toHaveValue('0.8')
    report.cases.push('Curseur enregistré par geste et annulation durable avec état préservé')
    report.cases.push('Button hérite de son opacité par défaut puis enregistre 80 % au seul survol')

    await page.screenshot({ path: path.join(output, 'contextual-styles.png') })

    const search = page.getByRole('searchbox', { name: 'Rechercher dans le UI Lab' })
    await search.fill('Decision tokens Semantic')
    await page.getByRole('treegrid').getByText('Semantic', { exact: true }).click()
    const decisionId = 'semantic.color.action.primary.text.default'
    const decision = page.locator(`[data-decision="${decisionId}"]`)
    await decision.click()
    const sharedColor = page.getByRole('textbox', { name: 'Valeur précise' })
    await expect(sharedColor).toBeEditable()
    await sharedColor.fill('#F0E1D2')
    const sharedSave = page.waitForResponse((result) => result.url().endsWith('/editor/save'), {
      timeout: 35000,
    })
    await sharedColor.blur()
    const sharedResponse = await sharedSave
    expect(sharedResponse.ok()).toBe(true)
    await expect(sharedColor).toBeEditable()
    await page.reload()
    await decision.click()
    await expect(sharedColor).toHaveValue(/^#f0e1d2$/i)
    report.cases.push(
      'Décision de Foundations enregistrée à la sortie du champ et relue après recharge',
    )
  }
  if (navigationOnly) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    currentPage = page
    const menu = page.getByRole('treegrid', { name: 'Pages et Design System' })
    const search = page.getByRole('searchbox', { name: 'Rechercher dans le UI Lab' })
    async function open(entry, query = entry, keyboard = false) {
      await search.fill(query)
      const label = menu.getByText(entry, { exact: true })
      if (keyboard) {
        const row = label.locator('xpath=ancestor::*[@role="row"][1]')
        await row.press('Enter')
      } else await label.click()
    }
    await page.goto(origin + '/ui-lab')
    await expect(menu.getByText('Pages', { exact: true })).toBeVisible()
    await expect(menu.getByText('Design System', { exact: true })).toBeVisible()
    await expect(menu.getByText('Première page', { exact: true })).toBeVisible()
    await expect(menu.getByText('Seconde page', { exact: true })).toBeVisible()
    await expect(menu.getByText('Form validation', { exact: true })).toBeVisible()
    await open('Première page')
    const project = page.frameLocator('iframe[title="Page réelle du projet"]')
    await expect(project.getByRole('heading', { name: 'Première page' })).toBeVisible()
    await expect(page).toHaveURL(/\?page=/)
    await open('Seconde page', 'Seconde page', true)
    await expect(project.getByRole('heading', { name: 'Seconde page' })).toBeVisible()
    await page.reload()
    await expect(project.getByRole('heading', { name: 'Seconde page' })).toBeVisible()
    await open('Button', 'UI components Button')
    const component = page.frameLocator('iframe[title="Aperçu du design system"]')
    await expect(component.getByRole('button', { name: 'Enregistrer le projet' })).toBeVisible()
    const variants = page.getByLabel('Variante d’aperçu')
    await expect(variants).toHaveValue('button/Default')
    await variants.selectOption('button/Disabled')
    await expect(component.getByRole('button', { name: 'Enregistrer le projet' })).toBeDisabled()
    await expect(menu.locator('[data-scene="button/Disabled"]')).toHaveCount(0)
    await open('Semantic', 'Decision tokens Semantic')
    await expect(page.getByRole('heading', { name: 'Semantic', exact: true })).toBeVisible()
    await open('color', 'Primitives color')
    await expect(page.getByRole('heading', { name: 'Primitives / color' })).toBeVisible()
    await open('Form validation', 'Patterns Form validation')
    await expect(component.getByRole('button', { name: 'Valider l’exemple' })).toBeVisible()
    await search.fill('Tous les composants')
    await expect(menu.getByText('Tous les composants')).toHaveCount(0)
    await page.goto(origin + '/ui-lab?scene=button%2FLoading')
    await expect(component.getByRole('button', { name: 'Enregistrement…' })).toBeVisible()
    report.cases.push('Menu partagé, pages réelles, recherche, variante, fondations et URL directe')
    await page.screenshot({ path: path.join(output, 'unified-navigation.png') })
  }
  for (const viewport of contextualOnly || navigationOnly || process.argv.includes('--figma-only')
    ? []
    : [
        { width: 1280, height: 800 },
        { width: 1440, height: 900 },
      ]) {
    const current = (await store.snapshot()).trees.find((t) => t.id === treeId)
    if (current.entities.some((e) => e.kind === 'occurrence' && e.variantId))
      await store.apply(treeId, {
        id: randomUUID(),
        revision: current.revision,
        origin: 'inspector',
        targets: [occurrenceA, occurrenceB],
        edits: [],
        entities: current.entities.map((e) =>
          e.kind === 'occurrence' ? { ...e, variantId: null } : e,
        ),
      })
    const page = await browser.newPage({ viewport })
    currentPage = page
    page.on('console', (message) => {
      if (message.type() === 'error')
        report.consoleErrors = [...(report.consoleErrors ?? []), message.text()]
    })
    page.on('pageerror', (error) => {
      report.browserErrors ??= []
      report.browserErrors.push(error.message)
    })
    await page.goto(origin + '/ui-lab')
    await openProjectPage(page)
    const view = page.frameLocator('iframe[title="Page réelle du projet"]')
    await expect(view.getByRole('heading', { name: 'Première page' })).toBeVisible({
      timeout: 15000,
    })
    await expect(
      page.getByRole('button', { name: 'Action de la première page', exact: true }),
    ).toBeEnabled()
    await view
      .getByRole('button', { name: 'Action du projet', exact: true })
      .click({ position: { x: 4, y: 4 } })
    await expect(page.getByLabel('Fil d’Ariane')).toHaveText(
      'Première page / Action de la première page',
    )
    await view.getByText('Action du projet', { exact: true }).click()
    await expect(page.getByLabel('Fil d’Ariane')).toHaveText(
      'Première page / Action de la première page / Libellé de l’action',
    )
    await page.getByRole('button', { name: 'Action de la première page', exact: true }).click()
    await expect(
      view.getByRole('button', { name: 'Action du projet', exact: true }),
    ).toHaveAttribute('data-loomata-occurrence', occurrenceA)
    if (await view.locator('body').getAttribute('data-executed'))
      throw new Error('Selection ran the project action')
    const inspector = page.getByRole('region', { name: 'Inspecteur visuel', exact: true })
    const beforeStyle = await view
      .getByRole('button', { name: 'Action du projet', exact: true })
      .evaluate((el) => el.style.cssText)
    await inspector.locator('[data-visual-property="background-color"]').fill('#123456')
    await expect
      .poll(() =>
        view
          .getByRole('button', { name: 'Action du projet', exact: true })
          .evaluate((el) => getComputedStyle(el).backgroundColor),
      )
      .toBe('rgb(18, 52, 86)')
    await inspector.locator('[data-visual-property="background-color"]').blur()
    await expect(inspector.getByRole('status')).toContainText(
      'Modification enregistrée dans le brouillon',
    )
    await expect
      .poll(() =>
        view
          .getByRole('button', { name: 'Action du projet', exact: true })
          .evaluate((el) => el.style.cssText),
      )
      .toBe(beforeStyle)
    await expect(view.getByRole('button', { name: 'Action du projet', exact: true })).toHaveCSS(
      'background-color',
      'rgb(18, 52, 86)',
    )
    await page
      .getByRole('button', { name: 'Annuler le dernier changement du brouillon', exact: true })
      .click()
    await expect(view.getByRole('button', { name: 'Action du projet', exact: true })).toHaveCSS(
      'background-color',
      'rgb(29, 78, 216)',
    )
    await openProjectPage(page, 'Seconde page')
    await expect(view.getByRole('heading', { name: 'Seconde page', exact: true })).toBeVisible()
    await page.getByRole('button', { name: 'Action de la seconde page', exact: true }).click()
    await expect(
      view.getByRole('button', { name: 'Action du projet', exact: true }),
    ).toHaveAttribute('data-loomata-occurrence', occurrenceB)
    await expect(page.getByLabel('Fil d’Ariane')).toHaveText(
      'Seconde page / Action de la seconde page',
    )
    await view
      .locator('main')
      .evaluate((el) => el.append(el.querySelector('button').cloneNode(true)))
    await expect(
      page.getByRole('button', {
        name: 'Action de la seconde page — plusieurs rendus',
        exact: true,
      }),
    ).toBeDisabled()
    await expect(page.getByText('Couverture partielle :', { exact: false })).toBeVisible()
    // The chat transport is simulated here; the direct provider is qualified separately.
    const conversationId = randomUUID()
    await page.route('**/__design-system/editor/project/assistant', async (route) => {
      const model = JSON.parse(await store.read('loomata/workspace.json', servedRoot))
      const privateState = JSON.parse(await store.read('.runtime.local/workspace/state.json'))
      const privateTree = privateState.trees.find((t) => t.id === treeId)
      const tree = {
        id: treeId,
        kind: 'draft',
        revision: model.revision,
        coverage: 'partial',
        operations:
          privateTree.model.revision === model.revision
            ? Object.entries(privateTree.receipts).map(([id, r]) => ({
                id,
                state: r.state,
                revision: r.revision,
              }))
            : [],
        entities: model.entities,
      }
      await route.fulfill({
        json: {
          project: 'Projet synthétique T1',
          connected: false,
          installing: false,
          loginUrl: null,
          error: null,
          approvals: [],
          workspace: {
            selected: treeId,
            trees: [
              {
                ...tree,
                entities: tree.entities.map(({ id, kind, label }) => ({ id, kind, label })),
              },
            ],
          },
          conversations: [
            {
              id: conversationId,
              title: 'Action de la seconde page',
              entityId: occurrenceB,
              status: 'idle',
              canContinue: false,
              messages: [
                { id: randomUUID(), role: 'assistant', text: 'Témoin du même échange contextuel' },
              ],
            },
          ],
        },
      })
    })
    await page.getByRole('button', { name: 'Actualiser les pages', exact: true }).click()
    await expect(
      page.getByRole('button', { name: 'Action de la seconde page', exact: true }),
    ).toBeEnabled()
    await page.getByRole('button', { name: 'Action de la seconde page', exact: true }).click()
    await page.getByRole('button', { name: 'Discuter de cet élément', exact: true }).click()
    await expect(
      page
        .getByLabel('Micro-chat de la sélection')
        .getByText('Témoin du même échange contextuel', { exact: true }),
    ).toBeVisible()
    await page.screenshot({
      path: path.join(output, `micro-chat-${viewport.width}.png`),
      fullPage: true,
    })
    await page.getByRole('button', { name: 'Agents IA', exact: true }).click()
    await expect(
      page.getByLabel('Agents IA').getByText('Témoin du même échange contextuel', { exact: true }),
    ).toBeVisible()
    const beforeCheck = (await store.snapshot()).trees.find((t) => t.id === treeId)
    const checkFile = 'app/routes/second.tsx'
    const checkSource = await store.read(checkFile, servedRoot)
    await store.apply(treeId, {
      id: randomUUID(),
      revision: beforeCheck.revision,
      origin: 'inspector',
      targets: [occurrenceB],
      edits: [
        {
          file: checkFile,
          before: checkSource,
          after: checkSource + '\n// Synthetic engine verification operation\n',
        },
      ],
    })
    const checkingTree = (await store.snapshot()).trees.find((t) => t.id === treeId)
    const latestOperation = checkingTree.operations.at(-1)
    await store.check(treeId, latestOperation.id, checkingTree.revision, 'checking')
    await expect(page.getByText('En vérification', { exact: true }).first()).toBeVisible()
    await store.check(treeId, latestOperation.id, checkingTree.revision, 'passed')
    await expect(page.getByText('Contrôles réussis', { exact: true }).first()).toBeVisible()
    const plannedLabel = `Préparer une page de test ${viewport.width}`
    await page.getByLabel('Demande à conserver', { exact: true }).fill(plannedLabel)
    await page.getByRole('button', { name: 'Conserver pour plus tard', exact: true }).click()
    await expect(
      page.getByText(plannedLabel + ' · Conservée, sans exécution', { exact: false }),
    ).toBeVisible()
    await expect(page.getByText('Appliqué, à vérifier', { exact: true }).first()).toBeVisible()
    await page.getByRole('button', { name: 'Qualifier la demande', exact: true }).first().click()
    await expect(
      page.getByText(plannedLabel + ' · Qualifiée, sans exécution', { exact: false }),
    ).toBeVisible()
    await page
      .getByRole('button', { name: 'Démarrer ce chantier isolé', exact: true })
      .first()
      .click()
    await expect(
      page.getByText(plannedLabel + ' · Chantier démarré', { exact: false }),
    ).toBeVisible()
    await page.getByRole('button', { name: 'Retour aux pages', exact: true }).click()
    await openFigma(page)
    await expect(page.getByRole('button', { name: 'Lire le fichier', exact: true })).toBeVisible()
    await expect(page.getByLabel('Jeton Figma (obligatoire)', { exact: true })).toHaveAttribute(
      'type',
      'password',
    )
    await page.getByRole('button', { name: 'Fermer Figma', exact: true }).click()
    await openProjectPage(page)
    await openProjectPage(page, 'Seconde page')
    await expect(view.getByRole('heading', { name: 'Seconde page', exact: true })).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Action de la seconde page', exact: true }),
    ).toBeEnabled()
    await page.getByRole('button', { name: 'Action de la seconde page', exact: true }).click()
    const toggle = page.getByRole('button', { name: 'Discuter de cet élément', exact: true })
    if ((await toggle.getAttribute('aria-expanded')) === 'true') await toggle.click()
    await page.getByRole('button', { name: 'Actualiser les pages', exact: true }).focus()
    await page.keyboard.press('Tab')
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth))
      throw new Error('Horizontal overflow')
    await page.screenshot({
      path: path.join(output, `desktop-${viewport.width}.png`),
      fullPage: true,
    })
    report.cases.push(
      `${viewport.width}x${viewport.height}: two real pages, contextual color preview, durable draft save and undo, visual/tree selection, suspended action, ambiguous duplicate refused, keyboard, shared micro-chat/Agents display with simulated transport, real planned request conservation/qualification/explicit isolated start, private direct-Figma form, and no horizontal overflow`,
    )
    await page.close()
  }

  if (!contextualOnly && !navigationOnly && !process.argv.includes('--pages-only')) {
    // Real local import with synthetic Figma data; no credential or provider calls.
    await store.select(treeId)
    const source = normalizeFigmaFile(
      {
        name: 'Catalogue de qualification',
        version: 'import-test-v1',
        document: {
          id: '0:0',
          name: 'Document',
          type: 'DOCUMENT',
          children: [
            {
              id: '1:0',
              name: 'Écrans',
              type: 'CANVAS',
              children: [
                {
                  id: '2:0',
                  name: 'Action Figma',
                  type: 'COMPONENT',
                  layoutMode: 'HORIZONTAL',
                  absoluteBoundingBox: { width: 120, height: 40 },
                  fills: [{ type: 'SOLID', color: { r: 0.2, g: 0.3, b: 0.4 } }],
                  children: [
                    { id: '3:0', name: 'Libellé', type: 'TEXT', characters: 'Action importée' },
                  ],
                },
              ],
            },
          ],
        },
      },
      'SyntheticArbitrationFile',
    )
    const cache = path.join(servedRoot, '.runtime.local/figma')
    await fs.mkdir(cache, { recursive: true, mode: 0o700 })
    await fs.writeFile(
      path.join(cache, 'file.json'),
      JSON.stringify({ readAt: new Date().toISOString(), file: source }),
    )
    async function cachePreviews(file) {
      for (const node of file.nodes) {
        const key = createHash('sha256')
          .update(JSON.stringify([file.fileKey, file.version, node.id, 'svg-outlines-v1']))
          .digest('hex')
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${node.type === 'TEXT' ? 60 : 600}" height="${node.type === 'TEXT' ? 20 : 500}"><rect width="100%" height="100%" fill="#345678"/></svg>`
        await fs.writeFile(
          path.join(cache, 'preview-' + key + '.json'),
          JSON.stringify({
            image: 'data:image/svg+xml;base64,' + Buffer.from(svg).toString('base64'),
          }),
        )
      }
    }
    await cachePreviews(source)
    for (const viewport of [
      { width: 1280, height: 800 },
      { width: 1440, height: 900 },
    ]) {
      const page = await browser.newPage({ viewport })
      currentPage = page
      await page.addInitScript(() => {
        // SVG dimensions must come from the source, independently of engine intrinsic sizing.
        Object.defineProperty(HTMLImageElement.prototype, 'naturalWidth', { get: () => 9999 })
        Object.defineProperty(HTMLImageElement.prototype, 'naturalHeight', { get: () => 9999 })
      })
      await page.goto(origin + '/ui-lab')
      await openProjectPage(page)
      await openFigma(page)
      const overlay = page.getByRole('dialog', {
        name: 'Figma — Catalogue de qualification',
        exact: true,
      })
      await expect(overlay).toBeVisible()
      await page.screenshot({ path: path.join(output, 'figma-overlay-' + viewport.width + '.png') })
      const box = await overlay.boundingBox()
      if (
        Math.abs(box.x - 24) > 1 ||
        Math.abs(box.y - 24) > 1 ||
        Math.abs(box.width - (viewport.width - 48)) > 1 ||
        Math.abs(box.height - (viewport.height - 48)) > 1
      )
        throw new Error('Overlay margins are not 24px')
      await page.keyboard.press('Escape')
      await expect(overlay).not.toBeVisible()
      await expect(page.getByRole('button', { name: 'Figma', exact: true })).toBeFocused()
      await openFigma(page)
      await overlay.getByRole('button', { name: 'Composants', exact: true }).click()
      await overlay.getByRole('treeitem', { name: 'Action Figma · COMPONENT', exact: true }).click()
      const reference = overlay.getByRole('region', { name: 'Référence visuelle Figma' })
      await expect(
        reference.getByRole('img', { name: 'Référence Figma : Action Figma', exact: true }),
      ).toBeVisible()
      await expect(
        overlay.getByRole('button', { name: 'Afficher l’aperçu', exact: true }),
      ).toHaveCount(0)
      const canvasBox = await reference.boundingBox(),
        zoomBox = await reference.getByRole('group', { name: 'Zoom de l’aperçu' }).boundingBox()
      if (
        Math.abs(zoomBox.y - canvasBox.y - 9) > 1 ||
        Math.abs(canvasBox.x + canvasBox.width - zoomBox.x - zoomBox.width - 9) > 1
      )
        throw new Error('Zoom controls are not inset 8px from the canvas inner border')
      await reference.getByRole('button', { name: 'Zoomer', exact: true }).click()
      const zoomInput = reference.getByRole('textbox', { name: 'Zoom en pourcentage' })
      const valueBox = await zoomInput.boundingBox(),
        percentBox = await reference.getByText('%', { exact: true }).boundingBox()
      if (
        zoomBox.height > 30 ||
        Math.abs(valueBox.y + valueBox.height / 2 - percentBox.y - percentBox.height / 2) > 1
      )
        throw new Error('Zoom percentage must remain inline between compact buttons')
      await zoomInput.fill('250')
      await zoomInput.press('Enter')
      await expect(zoomInput).toHaveValue('250')
      await overlay.getByRole('button', { name: 'Déplier Action Figma', exact: true }).click()
      await overlay.getByRole('treeitem', { name: 'Libellé · TEXT', exact: true }).click()
      await expect(
        reference.getByRole('img', { name: 'Référence Figma : Libellé', exact: true }),
      ).toBeVisible()
      await expect(zoomInput).toHaveValue('250')
      await expect(
        reference.getByRole('img', { name: 'Référence Figma : Libellé', exact: true }),
      ).toHaveCSS('width', '150px')
      await expect(
        overlay.getByRole('treeitem', { name: 'Libellé · TEXT', exact: true }),
      ).toHaveAttribute('aria-level', '2')
      await overlay.getByRole('treeitem', { name: 'Action Figma · COMPONENT', exact: true }).click()
      await expect(
        reference.getByRole('img', { name: 'Référence Figma : Action Figma', exact: true }),
      ).toBeVisible()
      await expect(zoomInput).toHaveValue('250')
      const image = reference.getByRole('img', {
        name: 'Référence Figma : Action Figma',
        exact: true,
      })
      async function expectCentered() {
        await expect
          .poll(() =>
            image.evaluate((img) => {
              const area = img.parentElement
              return Math.max(
                Math.abs(area.scrollLeft - (area.scrollWidth - area.clientWidth) / 2),
                Math.abs(area.scrollTop - (area.scrollHeight - area.clientHeight) / 2),
              )
            }),
          )
          .toBeLessThanOrEqual(1)
      }
      await expect(image).toHaveCSS('width', '1500px')
      await expectCentered()
      await image.evaluate((img) => img.parentElement.scrollTo(0, 0))
      await overlay.getByRole('treeitem', { name: 'Action Figma · COMPONENT', exact: true }).click()
      await expect(image).toBeVisible()
      await expectCentered()
      await overlay.getByRole('treeitem', { name: 'Libellé · TEXT', exact: true }).click()
      await expect(
        reference.getByRole('img', { name: 'Référence Figma : Libellé', exact: true }),
      ).toBeVisible()
      await overlay.getByRole('treeitem', { name: 'Action Figma · COMPONENT', exact: true }).click()
      await expect(image).toBeVisible()
      await expectCentered()
      await zoomInput.fill('abc')
      await zoomInput.press('Enter')
      await expect(zoomInput).toHaveValue('250')
      await zoomInput.fill('120')
      await zoomInput.press('Escape')
      await expect(overlay).toBeVisible()
      await expect(zoomInput).toHaveValue('250')
      await zoomInput.fill('1000')
      await zoomInput.press('Tab')
      await expect(zoomInput).toHaveValue('400')
      await expect(reference.getByRole('button', { name: 'Zoomer', exact: true })).toBeDisabled()
      await expectCentered()
      await zoomInput.fill('0')
      await zoomInput.press('Enter')
      await expect(zoomInput).toHaveValue('5')
      await expect(reference.getByRole('button', { name: 'Dézoomer', exact: true })).toBeDisabled()
      await zoomInput.fill('125 %')
      await zoomInput.press('Enter')
      await expect(zoomInput).toHaveValue('125')
      await reference.getByRole('button', { name: 'Dézoomer', exact: true }).click()
      await expect(zoomInput).toHaveValue('100')
      await reference.getByRole('button', { name: 'Zoomer', exact: true }).click()
      await expect(zoomInput).toHaveValue('125')
      await page.screenshot({ path: path.join(output, 'figma-layers-' + viewport.width + '.png') })
      await overlay.getByLabel('Rôle fonctionnel de la proposition').selectOption('action')
      await overlay.getByRole('button', { name: 'Préparer l’import', exact: true }).click()
      await expect(overlay).not.toBeVisible()
      await expect(
        page.getByRole('heading', { name: 'Import provisoire', exact: true }),
      ).toBeVisible()
      const preview = page.getByRole('region', { name: 'Composant importé réel', exact: true })
      await expect(
        preview.getByRole('button', { name: 'Action importée', exact: true }),
      ).toBeVisible()
      await page.screenshot({
        path: path.join(output, 'import-proposal-' + viewport.width + '.png'),
        fullPage: true,
      })
      await page.getByRole('button', { name: 'Annuler l’import', exact: true }).click()
      await expect(page.getByText('Aucun composant importé.', { exact: false })).toBeVisible()
      // Reopen and accept, then re-read after reload. Only the first viewport writes the fixture.
      if (viewport.width === 1280) {
        await openFigma(page)
        await overlay.getByRole('button', { name: 'Composants', exact: true }).click()
        await overlay
          .getByRole('treeitem', { name: 'Action Figma · COMPONENT', exact: true })
          .click()
        await overlay.getByLabel('Rôle fonctionnel de la proposition').selectOption('action')
        await overlay.getByRole('button', { name: 'Préparer l’import', exact: true }).click()
        await page.getByRole('button', { name: 'Ajouter au projet', exact: true }).click()
        await expect(
          page.getByRole('heading', { name: 'Composants importés', exact: true }),
        ).toBeVisible()
        await page.reload()
        await openProjectPage(page)
        await page.getByRole('button', { name: 'Composants importés', exact: true }).click()
        await expect(
          page
            .getByRole('region', { name: 'Composant importé réel' })
            .getByRole('button', { name: 'Action importée', exact: true }),
        ).toBeVisible()
        await page.getByRole('button', { name: 'Remplacer', exact: true }).click()
        await overlay.getByRole('button', { name: 'Composants', exact: true }).click()
        await overlay
          .getByRole('treeitem', { name: 'Action Figma · COMPONENT', exact: true })
          .click()
        await overlay.getByLabel('Rôle fonctionnel de la proposition').selectOption('input')
        await overlay.getByRole('button', { name: 'Préparer l’import', exact: true }).click()
        const refusal = page.getByRole('dialog', { name: 'Remplacement incompatible', exact: true })
        await expect(refusal).toBeVisible()
        await expect(refusal.getByRole('button', { name: /Forcer|Continuer/ })).toHaveCount(0)
        await refusal.getByRole('button', { name: 'Annuler', exact: true }).click()
        // Undo the accepted import to restore the fixture before the second viewport.
        await page
          .getByRole('button', { name: 'Annuler le dernier changement du brouillon', exact: true })
          .click()
        await expect(page.getByText('Aucun composant importé.', { exact: false })).toBeVisible()
      }
      await page.close()
    }
    report.cases.push(
      'Figma file overlay at 1280/1440: 24px margins, modal focus/Escape, component selection, provisional real control, targeted cancellation, specialized acceptance/reload and hard functional refusal; no external provider calls',
    )
    const frameSource = normalizeFigmaFile(
      {
        name: 'Frame fixture',
        version: 'frame-v1',
        document: {
          id: '0:0',
          name: 'Document',
          type: 'DOCUMENT',
          children: [
            {
              id: '1:0',
              name: 'Pages',
              type: 'CANVAS',
              children: [
                {
                  id: '7:0',
                  name: 'Écran importé',
                  type: 'FRAME',
                  layoutMode: 'VERTICAL',
                  absoluteBoundingBox: { x: 0, y: 0, width: 360, height: 200 },
                  children: [
                    {
                      id: '7:1',
                      name: 'Contenu',
                      type: 'TEXT',
                      characters: 'Page importée réelle',
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
      'SyntheticFrameFile123',
    )
    await fs.writeFile(
      path.join(cache, 'file.json'),
      JSON.stringify({ readAt: new Date().toISOString(), file: frameSource }),
    )
    await cachePreviews(frameSource)
    const framePage = await browser.newPage({ viewport: { width: 1280, height: 800 } })
    currentPage = framePage
    await framePage.goto(origin + '/ui-lab')
    await openProjectPage(framePage)
    await openFigma(framePage)
    const frameOverlay = framePage.getByRole('dialog', {
      name: 'Figma — Frame fixture',
      exact: true,
    })
    await frameOverlay.getByLabel('Rechercher dans le fichier').fill('Écran importé')
    await frameOverlay.getByRole('treeitem', { name: 'Écran importé · FRAME', exact: true }).click()
    await frameOverlay.getByLabel('Rôle fonctionnel de la proposition').selectOption('container')
    await frameOverlay.getByRole('button', { name: 'Préparer l’import', exact: true }).click()
    await expect(framePage.getByText('Destination proposée :', { exact: false })).toBeVisible()
    await framePage.getByRole('button', { name: 'Ajouter au projet', exact: true }).click()
    await expect(
      framePage.getByRole('heading', { name: 'Composants importés', exact: true }),
    ).toBeVisible()
    await framePage.getByRole('button', { name: 'Composants importés', exact: true }).click()
    await openProjectPage(framePage, 'Écran importé')
    await expect(
      framePage
        .frameLocator('iframe[title="Page réelle du projet"]')
        .getByText('Page importée réelle'),
    ).toBeVisible()
    const frameOccurrence = framePage
      .getByRole('region', { name: 'Éléments enregistrés' })
      .getByRole('button', { name: 'Écran importé', exact: true })
      .last()
    await expect(frameOccurrence).toBeEnabled()
    await frameOccurrence.click()
    await expect(framePage.getByLabel('Fil d’Ariane')).toHaveText('Écran importé / Écran importé')
    await framePage.screenshot({ path: path.join(output, 'imported-page-real.png') })
    await framePage.close()
    report.cases.push(
      'Frame import explicitly proposes a destination and renders a real registered page through the application route, with no inferred business logic',
    )
  }
  report.status = 'passed'
} catch (e) {
  if (currentPage) {
    await currentPage
      .screenshot({ path: path.join(output, 'failure.png'), fullPage: true })
      .catch(() => {})
    report.body = await currentPage
      .locator('body')
      .innerText()
      .catch(() => 'unavailable')
  }
  report.status = 'failed'
  report.error = e.message
  process.exitCode = 1
} finally {
  await browser?.close()
  if (child && child.exitCode === null) {
    process.kill(-child.pid, 'SIGTERM')
    await new Promise((r) => {
      const timer = setTimeout(r, 10000)
      child.once('exit', () => {
        clearTimeout(timer)
        r()
      })
    })
  }
  try {
    const owner = JSON.parse(
      await fs.readFile(path.join(root, '.runtime.local/agent-chat/owner.json'), 'utf8'),
    )
    if (owner.pid !== process.pid) process.kill(owner.pid, 'SIGTERM')
  } catch (error) {
    if (!['ENOENT', 'ESRCH'].includes(error.code)) report.cleanupError = error.message
  }
  await log.close()
  await fs.writeFile(
    path.join(output, 'qualification.json'),
    JSON.stringify(report, null, 2) + '\n',
  )
  console.log(JSON.stringify({ ...report, output }))
}
