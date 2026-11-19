import * as fs from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFile, spawn } from 'node:child_process'
import { promisify } from 'node:util'
import { copyFixture } from './test-local-app.mjs'
import { buildLoomata } from './build-loomata.mjs'
import { runLocalService } from './core/local-service.mjs'

const run = promisify(execFile)
const kit = fileURLToPath(new URL('..', import.meta.url))
const parent = resolve(kit, 'test-results/loomata')
await fs.mkdir(parent, { recursive: true })
const output = await fs.mkdtemp(resolve(parent, 'run-'))
const root = resolve(output, 'application kit with spaces')
const source = await fs.readFile(resolve(kit, 'macos/Loomata.swift'), 'utf8')
const harness = await fs.readFile(
  resolve(
    kit,
    process.env.LOOMATA_UI_ARCH_TEST === '1'
      ? 'macos/tests/UiArchE2E.swift'
      : 'macos/tests/LoomataE2E.swift',
  ),
  'utf8',
)
const instrumented = source
  .replace(
    'forMainFrameOnly: true))\n            let view',
    'forMainFrameOnly: false))\n            let view',
  )
  .replace('let app = NSApplication.shared', harness + '\nlet app = LoomataE2EApplication.shared')
  .replace(
    'app.run()',
    'DispatchQueue.main.async { Task { @MainActor in await loomataE2E(host) } }\napp.run()',
  )
await fs.writeFile(resolve(output, 'main.swift'), instrumented)
const report = {
  status: 'running',
  output,
  driver: 'AppKit controls and real WKWebView, not physical clicks',
}
let child
try {
  const { bundle, sdk } = await buildLoomata({
    directory: output,
    source: resolve(output, 'main.swift'),
    identifier: 'org.loomata.test.' + output.split('/').at(-1),
    launch: {
      node: process.execPath,
      client: resolve(root, 'scripts/local-service.mjs'),
      project: root,
    },
  })
  report.sdk = sdk
  await copyFixture(root, { includeDependencies: false })
  await run('/bin/cp', ['-cR', resolve(kit, 'node_modules'), root], { timeout: 180000 })
  await run(process.execPath, ['scripts/generate-tokens.mjs'], {
    cwd: root,
    env: { ...process.env, DATABASE_URL: '' },
    timeout: 60000,
  })
  if (process.env.LOOMATA_WORKSPACE_TEST === '1') {
    const { WorkspaceStore } = await import('./core/workspace.ts')
    const { randomUUID } = await import('node:crypto')
    const id = randomUUID(),
      revision = 'a'.repeat(64)
    await fs.writeFile(
      resolve(root, 'loomata.project.json'),
      JSON.stringify({ version: 1, phase: 'created', id, name: 'Qualification du socle' }),
    )
    let t1Entities = []
    if (process.env.LOOMATA_T1_TEST === '1') {
      const [
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
      ] = Array.from({ length: 10 }, () => randomUUID())
      await fs.writeFile(
        resolve(root, 'src/App.tsx'),
        `import {Button} from './design-system/components/Button/Button';export default function App(){return <main><h1>Agentic Design Lab</h1><Button data-loomata-node="${marker}"><span data-loomata-node="${labelMarker}">Enregistrer le projet</span></Button></main>}\n`,
      )
      await fs.writeFile(
        resolve(root, 'app/routes/t1-second.tsx'),
        `import {Button} from '../../src/design-system/components/Button/Button';export default function Page(){return <main><h1>Seconde page T1</h1><Button data-loomata-node="${marker}"><span data-loomata-node="${labelMarker}">Enregistrer le projet</span></Button></main>}\n`,
      )
      const routes = resolve(root, 'app/routes.ts')
      await fs.writeFile(
        routes,
        (await fs.readFile(routes, 'utf8')).replace(
          "  index('routes/home.tsx'),",
          "  index('routes/home.tsx'),\n  route('t1-second','routes/t1-second.tsx'),",
        ),
      )
      t1Entities = [
        {
          id: pageA,
          kind: 'page',
          label: 'Première page T1',
          path: '/',
          revision,
          files: ['src/App.tsx'],
        },
        {
          id: pageB,
          kind: 'page',
          label: 'Seconde page T1',
          path: '/t1-second',
          revision,
          files: ['app/routes/t1-second.tsx'],
        },
        { id: definition, kind: 'component', label: 'Button', sourceKey: 'button', revision },
        {
          id: labelDefinition,
          kind: 'component',
          label: 'Libellé du bouton',
          sourceKey: 'button-label',
          revision,
        },
        ...[
          { id: occurrenceA, pageId: pageA },
          { id: occurrenceB, pageId: pageB },
        ].map((e) => ({
          ...e,
          kind: 'occurrence',
          definitionId: definition,
          variantId: null,
          marker,
          label: 'Bouton T1',
          revision,
        })),
        ...[
          { id: labelA, pageId: pageA, parentId: occurrenceA },
          { id: labelB, pageId: pageB, parentId: occurrenceB },
        ].map((e) => ({
          ...e,
          kind: 'occurrence',
          definitionId: labelDefinition,
          variantId: null,
          marker: labelMarker,
          label: 'Libellé T1',
          revision,
        })),
      ]
    }
    const store = new WorkspaceStore(root)
    await store.git(['init', '-b', 'main'])
    await store.git(['add', '.'])
    await store.git(['commit', '-m', 'test: establish native workspace fixture'])
    await store.initialize({
      schemaVersion: 1,
      projectId: id,
      revision,
      entities: t1Entities.length
        ? t1Entities
        : [
            {
              id: randomUUID(),
              kind: 'page',
              label: 'Application',
              revision,
              files: ['src/App.tsx'],
            },
          ],
    })
    await store.git(['add', '--', 'loomata/workspace.json'])
    await store.git(['commit', '-m', 'test: initialize native coordination'])
    const treeId = await store.openTree('draft')
    report.workspaceTree = treeId
    report.workspaceRoot = (await store.preview()).root
    if (process.env.LOOMATA_T1_TEST === '1') {
      const { normalizeFigmaFile } = await import('./core/figma-file-client.ts')
      const file = normalizeFigmaFile(
        {
          name: 'Native Figma fixture',
          version: 'native-v1',
          document: {
            id: '0:0',
            name: 'Document',
            type: 'DOCUMENT',
            children: [
              {
                id: '1:0',
                name: 'Page',
                type: 'CANVAS',
                children: [
                  {
                    id: '2:0',
                    name: 'Native Action',
                    type: 'COMPONENT',
                    layoutMode: 'HORIZONTAL',
                    children: [
                      { id: '3:0', name: 'Label', type: 'TEXT', characters: 'Native import' },
                    ],
                  },
                ],
              },
            ],
          },
        },
        'SyntheticNativeFigma123',
      )
      const directory = resolve(report.workspaceRoot, '.runtime.local/figma')
      await fs.mkdir(directory, { recursive: true, mode: 0o700 })
      await fs.writeFile(
        resolve(directory, 'file.json'),
        JSON.stringify({ readAt: new Date().toISOString(), file }),
      )
    }
  }
  const privateWitness = 'LOOMATA_PRIVATE_HTTP_WITNESS'
  const privateRoot = report.workspaceRoot ?? root
  const privateFiles = [
    '.runtime.local/private-probe.txt',
    '.design-editor.local/private-probe.txt',
    '.env.private-probe',
  ]
  for (const file of privateFiles) {
    await fs.mkdir(resolve(privateRoot, file, '..'), { recursive: true, mode: 0o700 })
    await fs.writeFile(resolve(privateRoot, file), privateWitness)
  }
  // Configuration and first launch follow the same source launcher's private configuration contract.
  const { createServer } = await import('node:net')
  async function port() {
    const s = createServer()
    await new Promise((r) => s.listen(0, '127.0.0.1', r))
    const p = s.address().port
    await new Promise((r) => s.close(r))
    return p
  }
  const ui = await port()
  let book = await port()
  while (book === ui) book = await port()
  await run(
    process.execPath,
    [
      'scripts/local-app.mjs',
      'configure',
      '--ui-port',
      String(ui),
      '--storybook-port',
      String(book),
    ],
    { cwd: root },
  )
  const env = { ...process.env, DATABASE_URL: '', LOOMATA_E2E_OUTPUT: output }
  const stdout = await fs.open(resolve(output, 'native.stdout'), 'w')
  const stderr = await fs.open(resolve(output, 'native.stderr'), 'w')
  try {
    child = spawn(resolve(bundle, 'Contents/MacOS/Loomata'), [], {
      env,
      stdio: ['ignore', stdout.fd, stderr.fd],
    })
  } finally {
    await stdout.close()
    await stderr.close()
  }

  const result = await new Promise((done, reject) => {
    const timer = setTimeout(() => reject(new Error('Loomata E2E timed out')), 420000)
    child.once('error', (e) => {
      clearTimeout(timer)
      reject(e)
    })
    child.once('exit', (code) => {
      clearTimeout(timer)
      done(code)
    })
  })
  const native = JSON.parse(await fs.readFile(resolve(output, 'native.json'), 'utf8'))
  if (result !== 0 || native.status !== 'passed')
    throw new Error(native.error ?? 'Native runner failed')
  report.native = native
  // Reader guards are checked over HTTP as well as in the native documents.
  let readerPorts = [ui, book]
  if (report.workspaceRoot) {
    const running = await runLocalService('runtime.status', { root })
    if (running.project?.directory !== report.workspaceRoot)
      throw new Error('Native preview did not use the selected isolated root')
    readerPorts = [Number(new URL(running.uiURL).port), Number(new URL(running.storybookURL).port)]
    report.workspacePreviewVerified = true
  }
  for (const port of readerPorts) {
    const html = await (await fetch(`http://127.0.0.1:${port}/`)).text()
    if (html.includes('name="adl-design-editor-session"'))
      throw new Error('Reader received bootstrap')
    const response = await fetch(`http://127.0.0.1:${port}/__design-system/editor/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    })
    if (![403, 404].includes(response.status)) throw new Error('Reader write endpoint accepted')
    for (const file of privateFiles) {
      const response = await fetch(`http://127.0.0.1:${port}/@fs/${resolve(privateRoot, file)}`)
      if (![403, 404].includes(response.status) || (await response.text()).includes(privateWitness))
        throw new Error('Reader exposed a private source path')
    }
  }
  report.privatePathsDenied = true
  report.status = 'passed'
  console.log(JSON.stringify({ status: report.status, cases: native.cases, output }, null, 2))
} catch (error) {
  report.status = 'failed'
  report.error = error.stack
  throw error
} finally {
  const pid = Number(await fs.readFile(resolve(output, 'native.pid'), 'utf8').catch(() => 0))
  if (pid > 1) {
    const command = await run('/bin/ps', ['-p', String(pid), '-o', 'command=']).catch(() => null)
    if (
      command?.stdout.trim() === resolve(output, 'Loomata.app/Contents/MacOS/Loomata') ||
      command?.stdout.startsWith(resolve(output, 'Loomata.app/Contents/MacOS/Loomata') + ' ')
    )
      process.kill(pid, 'SIGTERM')
  }
  child?.kill('SIGTERM')
  try {
    await runLocalService('runtime.stop', { root })
  } catch (e) {
    report.cleanupError = e.message
  }
  await fs.writeFile(resolve(output, 'qualification.json'), JSON.stringify(report, null, 2) + '\n')
}
