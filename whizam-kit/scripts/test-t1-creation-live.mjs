// Explicit real Codex qualification. Synthetic project/history; dedicated account is referenced, never copied.
import fs from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { spawn, execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { createServer } from 'node:net'
import { chromium, expect } from '@playwright/test'
import { createProject, prepareProject } from './core/projects.mjs'
import { WorkspaceStore } from './core/workspace.ts'
import { workspacePlanning } from './core/workspace-planning.ts'
import { ChatManager } from './agent-chat/manager.mjs'
import { CodexProvider } from './agent-chat/provider.mjs'
import { installCodex } from './agent-chat/install.mjs'
import { stateDirectory } from './agent-chat/private.mjs'
import { contextControl } from './agent-chat/context-control.mjs'
if (process.argv[2] !== '--live') throw new Error('Explicit --live required')
const source = path.resolve(import.meta.dirname, '..'),
  parent = path.resolve(source, '../t1-creation-live')
await fs.mkdir(parent, { recursive: true })
const output = await fs.mkdtemp(path.join(parent, 'run-')),
  root = path.join(output, 'project')
const tool = path.resolve(process.env.LOOMATA_DEDICATED_TOOL ?? source),
  dedicated = await stateDirectory(tool)
const config = path.join(dedicated, 'codex/config.toml'),
  before = await fs.readFile(config).catch((e) => {
    if (e.code === 'ENOENT') return null
    throw e
  })
const report = { status: 'running', cases: [], writes: [] }
let manager, child, browser, log
const run = promisify(execFile)
async function until(condition, label) {
  const deadline = Date.now() + 120000
  for (;;) {
    if (await condition()) return
    if (Date.now() > deadline) throw new Error('Timed out: ' + label)
    await new Promise((r) => setTimeout(r, 100))
  }
}
try {
  await createProject(source, { destination: root, name: 'Création réelle Codex T1' })
  const metadata = JSON.parse(await fs.readFile(path.join(root, 'loomata.project.json'), 'utf8')),
    revision = 'a'.repeat(64),
    pageId = randomUUID()
  const store = new WorkspaceStore(root)
  await store.bootstrap({
    schemaVersion: 1,
    projectId: metadata.id,
    revision,
    entities: [
      {
        id: pageId,
        kind: 'page',
        label: 'Accueil du projet',
        path: '/',
        revision,
        files: ['src/App.tsx'],
      },
    ],
  })
  const treeId = await store.openTree('draft'),
    servedRoot = store.treeRoot(treeId)
  await prepareProject(servedRoot, source, process.execPath)
  const tree = async () => (await store.snapshot()).trees.find((t) => t.id === treeId)
  const requestId = randomUUID(),
    workItemId = randomUUID()
  await workspacePlanning(servedRoot, {
    kind: 'plan',
    id: requestId,
    revision: (await tree()).revision,
    label: 'Créer la page et la carte de qualification',
  })
  await workspacePlanning(servedRoot, {
    kind: 'qualify',
    id: randomUUID(),
    revision: (await tree()).revision,
    requestId,
    workItemId,
    label: 'Création synthétique Codex',
  })
  await workspacePlanning(servedRoot, {
    kind: 'start',
    id: randomUUID(),
    revision: (await tree()).revision,
    workItemId,
    explicitStart: true,
  })
  const state = path.join(root, '.runtime.local/t1-chat')
  await fs.mkdir(state, { mode: 0o700 })
  const binary = await installCodex(dedicated)
  manager = await ChatManager.open({
    tool: source,
    state,
    install: async () => binary,
    providerFactory: (o) => new CodexProvider({ ...o, binary, state: dedicated }),
  })
  const command = (command, payload = {}) =>
    contextControl(manager, { operation: 'context', root, treeId, command, payload })
  const { conversation } = await command('new', { entityId: workItemId })
  const [newPage, cardDefinition, cardOccurrence, buttonOccurrence, cardMarker, buttonMarker] =
    Array.from({ length: 6 }, () => randomUUID())
  const buttonDefinition = (await tree()).entities.find(
    (e) => e.kind === 'component' && e.sourceKey === 'button',
  )
  if (!buttonDefinition) throw new Error('Missing shared Button definition')
  const componentFile = 'app/routes/t1-generated-component.tsx',
    storyFile = 'app/routes/t1-generated-component.stories.tsx',
    pageFile = 'app/routes/t1-generated.tsx'
  const component = `import {Button} from '../../src/design-system/components/Button/Button'\nexport function GeneratedCard(){return <section data-loomata-node="${cardMarker}"><h2>Carte de qualification</h2><Button data-loomata-node="${buttonMarker}">Continuer</Button></section>}\n`
  const story =
    "import type {Meta,StoryObj} from '@storybook/react-vite'\nimport {GeneratedCard} from './t1-generated-component'\nconst meta={title:'Project/GeneratedCard',component:GeneratedCard} satisfies Meta<typeof GeneratedCard>\nexport default meta\nexport const Default:StoryObj<typeof meta>={}\n"
  const page =
    "import {GeneratedCard} from './t1-generated-component'\nexport default function Page(){return <main><h1>Page créée avec Codex</h1><GeneratedCard/></main>}\n"
  const routes = (await fs.readFile(path.join(servedRoot, 'app/routes.ts'), 'utf8')).replace(
    "  index('routes/home.tsx'),",
    "  index('routes/home.tsx'),\n  route('codex-created','routes/t1-generated.tsx'),",
  )
  const files = [
    [componentFile, component],
    [storyFile, story],
    [pageFile, page],
    ['app/routes.ts', routes],
  ]
  const registration = () =>
    JSON.stringify(
      {
        schemaVersion: 1,
        entities: [
          {
            id: newPage,
            kind: 'page',
            label: 'Page créée avec Codex',
            path: '/codex-created',
            revision: manager.turn?.workspace?.revision ?? revision,
            files: [pageFile, componentFile, storyFile, 'app/routes.ts'],
          },
          {
            id: cardDefinition,
            kind: 'component',
            label: 'Carte créée avec Codex',
            sourceKey: 'generated-card',
            revision,
            files: [componentFile, storyFile],
          },
          {
            id: cardOccurrence,
            kind: 'occurrence',
            label: 'Carte de qualification',
            pageId: newPage,
            definitionId: cardDefinition,
            variantId: null,
            marker: cardMarker,
            revision,
          },
          {
            id: buttonOccurrence,
            kind: 'occurrence',
            label: 'Continuer',
            pageId: newPage,
            definitionId: buttonDefinition.id,
            variantId: null,
            marker: buttonMarker,
            parentId: cardOccurrence,
            revision,
          },
        ],
      },
      null,
      2,
    ) + '\n'
  files.push(['app/loomata-interface.json', registration()])
  for (const [file, text] of files) {
    await command('send', {
      conversation,
      requestId: randomUUID(),
      text: `Qualification synthétique autorisée. Propose uniquement une action write vers ${file}, avec le contenu complet exact ci-dessous et une raison en français. N'appelle aucun autre outil. Après confirmation, réponds sans autre écriture.\nCONTENU EXACT:\n${text}`,
    })
    await until(
      () => manager.approvals.size || (!manager.turn && manager.lastError),
      'proposal ' + file,
    )
    const approval = [...manager.approvals.values()][0]
    if (
      !approval ||
      approval.proposal.file !== file ||
      approval.proposal.text.trim() !== text.trim()
    )
      throw new Error('Unexpected proposal: ' + file)
    await command('approve', { id: approval.id, decision: 'approve' })
    await until(() => !manager.turn, 'completion ' + file)
    if ((await fs.readFile(path.join(servedRoot, file), 'utf8')).trim() !== text.trim())
      throw new Error('File not published: ' + file)
    report.writes.push(file)
  }
  const model = await tree()
  if (!model.entities.some((e) => e.id === newPage && e.kind === 'page'))
    throw new Error('Page was not registered')
  if (!model.entities.some((e) => e.kind === 'modification' && e.taskIds.length))
    throw new Error('Missing task links')
  await fs.access(path.join(root, pageFile)).then(
    () => {
      throw new Error('Main changed')
    },
    (e) => {
      if (e.code !== 'ENOENT') throw e
    },
  )
  report.cases.push(
    'five real Codex proposals approved individually through the common work-item engine; source registration, shared Button and task links preserved; main unchanged',
  )
  await manager.close()
  manager = null
  const socket = createServer()
  await new Promise((r) => socket.listen(0, '127.0.0.1', r))
  const port = socket.address().port
  await new Promise((r) => socket.close(r))
  log = await fs.open(path.join(output, 'service.log'), 'w')
  child = spawn(process.execPath, ['scripts/ui-lab-local.mjs', '--port', String(port)], {
    cwd: servedRoot,
    env: {
      ...process.env,
      DATABASE_URL: '',
      PATH: path.dirname(process.execPath) + ':' + process.env.PATH,
    },
    detached: true,
    stdio: ['ignore', log.fd, log.fd],
  })
  const origin = `http://127.0.0.1:${port}`
  await fs.writeFile(
    path.join(output, 'owned-process.json'),
    JSON.stringify({ pid: child.pid, root: servedRoot, port }),
  )
  await until(async () => {
    try {
      return (await fetch(origin + '/ui-lab', { signal: AbortSignal.timeout(2000) })).ok
    } catch {
      return false
    }
  }, 'workshop')
  browser = await chromium.launch({ channel: 'chromium' })
  const view = await browser.newPage({ viewport: { width: 1280, height: 800 } })
  await view.goto(origin + '/ui-lab')
  await view
    .getByRole('searchbox', { name: 'Rechercher dans le UI Lab' })
    .fill('Page créée avec Codex')
  await view
    .getByRole('treegrid', { name: 'Pages et Design System' })
    .getByText('Page créée avec Codex', { exact: true })
    .click()
  const frame = view.frameLocator('iframe[title="Page réelle du projet"]')
  await expect(
    frame.getByRole('heading', { name: 'Page créée avec Codex', exact: true }),
  ).toBeVisible()
  await expect(view.getByRole('button', { name: 'Continuer', exact: true })).toBeEnabled()
  await frame.getByRole('button', { name: 'Continuer', exact: true }).click()
  await expect(view.getByLabel('Fil d’Ariane')).toHaveText(
    'Page créée avec Codex / Carte de qualification / Continuer',
  )
  await view.screenshot({ path: path.join(output, 'created-page.png'), fullPage: true })
  report.cases.push(
    'actual generated page and reusable component render in React Router, with nested occurrence selection and consistent breadcrumbs',
  )
  await browser.close()
  browser = null
  process.kill(-child.pid, 'SIGTERM')
  await new Promise((r) => child.once('exit', r))
  child = null
  let npmCLI
  for (const candidate of [
    path.join(source, '.runtime.local/npm/node_modules/npm/bin/npm-cli.js'),
    path.join(tool, '.runtime.local/npm/node_modules/npm/bin/npm-cli.js'),
  ]) {
    try {
      await fs.access(candidate)
      npmCLI = candidate
      break
    } catch (e) {
      if (e.code !== 'ENOENT') throw e
    }
  }
  if (!npmCLI) throw new Error('Known manufacturing npm runtime unavailable')
  await run(process.execPath, [npmCLI, 'run', 'build-storybook'], {
    cwd: servedRoot,
    env: { ...process.env, PATH: path.dirname(process.execPath) + ':' + process.env.PATH },
    timeout: 240000,
    maxBuffer: 4 * 1024 * 1024,
  })
  const index = JSON.parse(
    await fs.readFile(path.join(servedRoot, 'storybook-static/index.json'), 'utf8'),
  )
  if (!index.entries['project-generatedcard--default'])
    throw new Error('Generated Storybook documentation absent')
  report.cases.push(
    'Storybook builds the generated component story; existing documentation retained',
  )
  report.status = 'passed'
} catch (e) {
  report.status = 'failed'
  report.error = e.message
  process.exitCode = 1
} finally {
  await browser?.close()
  if (child && child.exitCode === null) process.kill(-child.pid, 'SIGTERM')
  await manager?.close()
  await log?.close()
  if (before) await fs.writeFile(config, before, { mode: 0o600 })
  await fs.writeFile(
    path.join(output, 'qualification.json'),
    JSON.stringify(report, null, 2) + '\n',
  )
  console.log(JSON.stringify({ ...report, output }))
}
