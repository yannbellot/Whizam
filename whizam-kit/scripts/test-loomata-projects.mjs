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
const parent = resolve(kit, 'test-results/loomata-projects')
await fs.mkdir(parent, { recursive: true })
const output = await fs.mkdtemp(resolve(parent, 'run-'))
const root = resolve(output, 'application kit with spaces')
const source = await fs.readFile(resolve(kit, 'macos/Loomata.swift'), 'utf8')
const harness = await fs.readFile(resolve(kit, 'macos/tests/LoomataProjectsE2E.swift'), 'utf8')
const instrumented = source
  .replace(
    'let picker = NSSavePanel()',
    'let picker = NSSavePanel(); loomataProjectPanel = picker; if let destination = loomataProjectDestination { picker.directoryURL = destination.deletingLastPathComponent(); picker.nameFieldStringValue = destination.lastPathComponent }',
  )
  .replace(
    'picker.nameFieldStringValue = "Mon projet"',
    'picker.nameFieldStringValue = loomataProjectDestination?.lastPathComponent ?? "Mon projet"',
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
let child, panelWatcher
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
  await run(
    '/usr/bin/swiftc',
    [
      '-swift-version',
      '5',
      '-sdk',
      sdk,
      '-module-cache-path',
      resolve(output, 'swift-cache'),
      resolve(kit, 'macos/tests/PanelDriver.swift'),
      '-o',
      resolve(output, 'panel-driver'),
    ],
    { timeout: 120000 },
  )
  await copyFixture(root, { includeDependencies: false })
  await fs.copyFile(resolve(kit, '.env.example'), resolve(root, '.env.example'))
  // Restore only the declared internal skill exposure links excluded by the generic fixture copier.
  const release = JSON.parse(await fs.readFile(resolve(kit, 'scripts/project-files.json'), 'utf8'))
  for (const file of release.files.filter((f) => /^(\.agents|\.claude)\/skills\//.test(f))) {
    const target = resolve(root, file)
    await fs.mkdir(resolve(target, '..'), { recursive: true })
    await fs.symlink(await fs.readlink(resolve(kit, file)), target)
  }
  await run('/bin/cp', ['-cR', resolve(kit, 'node_modules'), root], { timeout: 180000 })
  await run(process.execPath, ['scripts/generate-tokens.mjs'], {
    cwd: root,
    env: { ...process.env, DATABASE_URL: '' },
    timeout: 60000,
  })
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

  let panelHandled = false
  panelWatcher = setInterval(async () => {
    if (panelHandled) return
    try {
      await fs.access(resolve(output, 'save-panel.ready'))
    } catch {
      return
    }
    panelHandled = true
    try {
      const driven = await run(resolve(output, 'panel-driver'), [String(child.pid)], {
        timeout: 15000,
      })
      await fs.writeFile(
        resolve(output, 'panel-driver.json'),
        JSON.stringify({ status: 'passed', stdout: driven.stdout }),
      )
    } catch (error) {
      await fs.writeFile(
        resolve(output, 'panel-driver.json'),
        JSON.stringify({ status: 'failed', error: error.message }),
      )
    }
  }, 250)
  const result = await new Promise((done, reject) => {
    const timer = setTimeout(() => reject(new Error('Loomata E2E timed out')), 1200000)
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
  // Relaunch the exact same native bundle; its frozen launch.json still names the initial kit.
  const resumeOutput = resolve(output, 'resume')
  await fs.mkdir(resumeOutput)
  const reopened = await run(resolve(bundle, 'Contents/MacOS/Loomata'), [], {
    env: {
      ...env,
      LOOMATA_E2E_OUTPUT: resumeOutput,
      LOOMATA_E2E_RESUME: '1',
      LOOMATA_E2E_PROJECT: resolve(output, 'Atlas C with spaces'),
    },
    timeout: 240000,
    maxBuffer: 32768,
  })
  await fs.writeFile(resolve(resumeOutput, 'native.stderr'), reopened.stderr)
  report.resume = JSON.parse(await fs.readFile(resolve(resumeOutput, 'native.json'), 'utf8'))
  if (report.resume.status !== 'passed') throw new Error('Native relaunch failed')
  const selected = await runLocalService('runtime.status', {
    root: resolve(output, 'Atlas C with spaces'),
  })
  report.readers = []
  // Reader guards follow the active project, not the intentionally stopped initial instance.
  for (const address of [selected.workspace.preview, selected.workspace.storybook]) {
    const port = new URL(address).port
    const html = await (
      await fetch(`http://127.0.0.1:${port}/`, { signal: AbortSignal.timeout(5000) })
    ).text()
    if (html.includes('name="adl-design-editor-session"'))
      throw new Error('Reader received bootstrap')
    const response = await fetch(`http://127.0.0.1:${port}/__design-system/editor/save`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
      signal: AbortSignal.timeout(5000),
    })
    if (![403, 404].includes(response.status)) throw new Error('Reader write endpoint accepted')
    report.readers.push({ bootstrap: false, writeStatus: response.status })
  }
  report.status = 'passed'
  console.log(JSON.stringify({ status: report.status, cases: native.cases, output }, null, 2))
} catch (error) {
  report.status = 'failed'
  report.error = error.stack
  throw error
} finally {
  clearInterval(panelWatcher)
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
    for (const project of [
      root,
      ...(await fs.readdir(output))
        .map((name) => resolve(output, name))
        .filter((path) => path !== root && path !== resolve(output, 'Loomata.app')),
    ]) {
      try {
        if (project !== root) await fs.access(resolve(project, 'loomata.project.json'))
        await runLocalService('runtime.stop', { root: project })
      } catch (e) {
        if (project === root || !['ENOENT', 'ENOTDIR'].includes(e.code))
          report.cleanupError = e.message
      }
    }
  } catch (e) {
    report.cleanupError = e.message
  }
  await fs.writeFile(resolve(output, 'qualification.json'), JSON.stringify(report, null, 2) + '\n')
}
