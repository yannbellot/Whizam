import * as fs from 'node:fs/promises'
import { createWriteStream } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFile, execFileSync, spawn } from 'node:child_process'
import { promisify } from 'node:util'
import { setTimeout as delay } from 'node:timers/promises'
import { createServer } from 'node:net'
import assert from 'node:assert/strict'
import { copyFixture } from './test-local-app.mjs'
import { runLocalService } from './core/local-service.mjs'

if (process.platform !== 'darwin') throw new Error('E2E natif : macOS requis.')
const kit = fileURLToPath(new URL('..', import.meta.url))
const run = promisify(execFile)
const parent = resolve(kit, 'test-results/native-e2e')
await fs.mkdir(parent, { recursive: true })
const output = await fs.mkdtemp(resolve(parent, 'run-'))
const root = resolve(output, 'project with spaces')
const source = await fs.readFile(resolve(kit, 'macos/Prototype.swift'), 'utf8')
const harness = await fs.readFile(resolve(kit, 'macos/tests/PrototypeE2E.swift'), 'utf8')
assert(source.includes('let app = NSApplication.shared') && source.endsWith('app.run()\n'))
const instrumented = source
  .replace(
    'guard let url = action.request.url,',
    'fputs("NativeE2E navigation: \\(action.request.url?.absoluteString ?? "nil")\\n",stderr); guard let url = action.request.url,',
  )
  .replace('let picker = NSOpenPanel();', 'let picker = NSOpenPanel(); prototypeE2EPanel = picker;')
  .replace(
    'guard picker.runModal() == .OK,',
    'let e2eResponse = picker.runModal(); fputs("NativeE2E panel response: \\(e2eResponse.rawValue)\\n",stderr); guard e2eResponse == .OK,',
  )
  .replace('let app = NSApplication.shared', harness + '\nlet app = E2EApplication.shared')
  .replace(
    'app.run()',
    'DispatchQueue.main.async { Task { @MainActor in await prototypeE2E(host) } }\napp.run()',
  )
await fs.writeFile(resolve(output, 'main.swift'), instrumented)
const sdk =
  process.env.CORE_E2E_SDK ??
  execFileSync('/usr/bin/xcrun', ['--show-sdk-path'], { encoding: 'utf8' }).trim()
const bundle = resolve(output, 'NativeE2E.app')
const binary = resolve(bundle, 'Contents/MacOS/NativeE2E')
await fs.mkdir(resolve(bundle, 'Contents/MacOS'), { recursive: true })
await fs.writeFile(
  resolve(bundle, 'Contents/Info.plist'),
  `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0"><dict>
<key>CFBundleExecutable</key><string>NativeE2E</string>
<key>CFBundleIdentifier</key><string>org.loomata.e2e.${output.split('/').at(-1)}</string>
<key>CFBundleName</key><string>UI Lab E2E</string>
<key>CFBundlePackageType</key><string>APPL</string>
<key>NSAppTransportSecurity</key><dict><key>NSAllowsLocalNetworking</key><true/></dict>
</dict></plist>
`,
)
async function stopNative() {
  const pid = Number(await fs.readFile(resolve(output, 'native.pid'), 'utf8').catch(() => '0'))
  if (!Number.isInteger(pid) || pid < 2) return
  const command = await run('/bin/ps', ['-p', String(pid), '-o', 'command=']).catch(() => null)
  if (command?.stdout.trim().startsWith(binary + ' ')) process.kill(pid, 'SIGTERM')
}
const report = {
  status: 'running',
  driver: 'AppKit/WKWebView instrumented E2E; real services; no AX or physical clicks',
  cases: [],
}
let child, browser, sink
const command = (args) =>
  run(process.execPath, args, {
    cwd: root,
    timeout: 200000,
    maxBuffer: 4e6,
    env: { ...process.env, DATABASE_URL: '' },
  })
async function port() {
  const server = createServer()
  await new Promise((done) => server.listen(0, '127.0.0.1', done))
  const result = server.address().port
  await new Promise((done) => server.close(done))
  return result
}
try {
  const compiled = await run(
    '/usr/bin/swiftc',
    [
      '-swift-version',
      '5',
      '-sdk',
      sdk,
      '-module-cache-path',
      resolve(kit, '.runtime.local/swift-e2e-cache'),
      resolve(output, 'main.swift'),
      '-o',
      binary,
    ],
    { timeout: 180000, maxBuffer: 4e6 },
  )
  await fs.writeFile(resolve(output, 'compile.log'), compiled.stderr)
  await copyFixture(root, { includeDependencies: false })
  // macOS clone copy is much faster for the many small, immutable dependency files.
  await run('/bin/cp', ['-cR', resolve(kit, 'node_modules'), root], { timeout: 180000 })
  await command(['scripts/generate-tokens.mjs'])
  const uiPort = await port(),
    bookPort = await port()
  await command([
    'scripts/local-app.mjs',
    'configure',
    '--ui-port',
    String(uiPort),
    '--storybook-port',
    String(bookPort),
  ])
  process.env.PLAYWRIGHT_BROWSERS_PATH = resolve(kit, '.runtime.local/playwright')
  const { chromium, expect } = await import('@playwright/test')
  browser = await chromium.launch({ channel: 'chromium' })
  const page = await browser.newPage()
  await page.route('**/*', (route) =>
    new URL(route.request().url()).origin === `http://127.0.0.1:${bookPort}`
      ? route.continue()
      : route.abort(),
  )
  const storyURL = `http://127.0.0.1:${bookPort}/iframe.html?id=components-button--default&viewMode=story`
  const storyButton = page.getByRole('button', { name: 'Enregistrer le projet', exact: true })
  async function observeStorybook() {
    const deadline = Date.now() + 180000
    while (true) {
      try {
        await page.goto(storyURL, { timeout: 10000 })
        await expect(storyButton).toBeVisible({ timeout: 10000 })
        break
      } catch (error) {
        if (Date.now() > deadline) throw error
        await delay(300)
      }
    }
    const initial = await storyButton.evaluate((b) => getComputedStyle(b).backgroundColor)
    assert.notEqual(initial, 'rgb(35, 69, 103)')
    await fs.writeFile(resolve(output, 'storybook-ready'), initial)
    await expect(storyButton).toHaveCSS('background-color', 'rgb(35, 69, 103)', { timeout: 90000 })
    await page.screenshot({ path: resolve(output, 'storybook-live.png'), fullPage: true })
    report.cases.push('already-open Storybook automatically updates after the real WKWebView save')
    await fs.writeFile(resolve(output, 'storybook-checked'), 'passed')
  }
  sink = createWriteStream(resolve(output, 'native.log'))
  async function nativeRun(mode, project) {
    const args = [process.execPath, resolve(root, 'scripts/local-service.mjs')]
    if (project) args.push(project)
    await fs.rm(resolve(output, 'native.pid'), { force: true })
    const envArgs = [
      'CORE_E2E_ROOT=' + root,
      'CORE_E2E_OUTPUT=' + output,
      'CORE_E2E_MODE=' + mode,
      'DATABASE_URL=',
    ].flatMap((v) => ['--env', v])
    child = spawn(
      '/usr/bin/open',
      [
        '-n',
        '-W',
        ...envArgs,
        '-o',
        resolve(output, `native-${mode}.stdout`),
        '--stderr',
        resolve(output, `native-${mode}.log`),
        bundle,
        '--args',
        ...args,
      ],
      {
        cwd: output,
        env: {
          ...process.env,
          CORE_E2E_ROOT: root,
          CORE_E2E_OUTPUT: output,
          CORE_E2E_MODE: mode,
          DATABASE_URL: '',
        },
        stdio: ['ignore', 'pipe', 'pipe'],
      },
    )
    child.stdout.pipe(sink, { end: false })
    child.stderr.pipe(sink, { end: false })
    const exitResult = new Promise((done, reject) => {
      const timer = setTimeout(() => {
        void stopNative()
        child.kill('SIGTERM')
        reject(new Error('E2E natif : délai global dépassé.'))
      }, 420000)
      child.once('error', (error) => {
        clearTimeout(timer)
        reject(error)
      })
      child.once('exit', (code, signal) => {
        clearTimeout(timer)
        done({ code, signal })
      })
    })
    const nativeResult = exitResult.then(async (result) => {
      const native = JSON.parse(await fs.readFile(resolve(output, 'native.json'), 'utf8'))
      await fs.writeFile(
        resolve(output, `native-${mode}.json`),
        JSON.stringify(native, null, 2) + '\n',
      )
      report.cases.push(...native.cases)
      assert.equal(result.code, 0, native.error ?? `Native E2E exited: ${result.signal}`)
      assert.notEqual(native.status, 'failed', native.error)
      return native
    })
    const observer =
      mode === 'workshop'
        ? observeStorybook().catch(async (error) => {
            await stopNative()
            child.kill('SIGTERM')
            throw error
          })
        : Promise.resolve()
    const [native] = await Promise.all([nativeResult, observer])
    return native
  }
  assert.equal((await nativeRun('panel')).status, 'panel-checked')
  assert.equal((await nativeRun('invalid', output)).status, 'invalid-checked')
  assert.equal((await nativeRun('workshop', root)).status, 'window-closed')
  report.reserves = [
    'Native folder-picker acceptance requires manual verification; valid and incompatible folders are tested through the production direct-open path.',
  ]
  const state = await runLocalService('runtime.status', { root })
  assert.equal(state.phase, 'ready', 'Window close must leave services running')
  assert.equal(state.pids.length, 2, 'One reader and one writer supervisor')
  report.cases.push('native process exits after final close while services remain ready')
  await page.goto(storyURL)
  await expect(page.getByRole('button', { name: 'Enregistrer le projet', exact: true })).toHaveCSS(
    'background-color',
    'rgb(35, 69, 103)',
    { timeout: 30000 },
  )
  await page.screenshot({ path: resolve(output, 'storybook.png'), fullPage: true })
  report.cases.push(
    'Storybook independently renders the value saved in WKWebView, not the canceled draft',
  )
  await runLocalService('runtime.stop', { root })
  for (const port of [uiPort, bookPort]) {
    await assert.rejects(fetch(`http://127.0.0.1:${port}/`, { signal: AbortSignal.timeout(2000) }))
  }
  report.cases.push('final common-service stop closes both test ports')
  report.status = 'passed-with-reserves'
} catch (error) {
  report.status = 'failed'
  report.error = error.message
  const native = await fs.readFile(resolve(output, 'native.json'), 'utf8').catch(() => null)
  if (native) report.native = JSON.parse(native)
  throw error
} finally {
  await stopNative().catch(() => {})
  if (child && child.exitCode === null && child.signalCode === null) child.kill('SIGTERM')
  await browser?.close()
  await runLocalService('runtime.stop', { root }).catch(() => {})
  sink?.end()
  await fs.writeFile(resolve(output, 'qualification.json'), JSON.stringify(report, null, 2) + '\n')
  console.log(JSON.stringify({ output, ...report }, null, 2))
}
