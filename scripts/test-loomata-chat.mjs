// Opt-in live qualification on a prepared disposable project; never copies authentication.
import fs from 'node:fs/promises'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { buildLoomata } from './build-loomata.mjs'
import { runLocalService } from './core/local-service.mjs'
const tool = path.resolve(import.meta.dirname, '..')
const args = process.argv.slice(2)
if (args.length !== 3 || args[0] !== '--project' || args[2] !== '--live')
  throw new Error(
    'Usage: node scripts/test-loomata-chat.mjs --project <prepared disposable project> --live. Uses the dedicated Loomata account and sends real qualifying messages.',
  )
const root = await fs.realpath(args[1])
if (root === tool || root.startsWith(tool + path.sep))
  throw new Error('Choose a disposable project outside the installation')
const parent = path.resolve(tool, 'test-results/loomata-chat')
await fs.mkdir(parent, { recursive: true })
const output = await fs.mkdtemp(path.resolve(parent, 'run-'))
const file = 'native-witness-' + Date.now() + '.txt',
  marker = 'NATIVE_READ_' + crypto.randomUUID(),
  approved = 'NATIVE_APPROVED_' + crypto.randomUUID()
await fs.writeFile(path.join(root, file), marker, { flag: 'wx' })
const source = await fs.readFile(path.resolve(tool, 'macos/Loomata.swift'), 'utf8')
const harness = await fs.readFile(path.resolve(tool, 'macos/tests/LoomataChatE2E.swift'), 'utf8')
const swift = source
  .replace('let app = NSApplication.shared', harness + '\nlet app = NSApplication.shared')
  .replace(
    'app.run()',
    'DispatchQueue.main.async { Task { @MainActor in await loomataChatE2E(host) } }\napp.run()',
  )
await fs.writeFile(path.join(output, 'main.swift'), swift)
const report = { status: 'running', output }
let child
const current = path.resolve(tool, '.runtime.local/loomata-context/last-project.json')
const previous = await fs.readFile(current).catch((e) => {
  if (e.code !== 'ENOENT') throw e
  return null
})
try {
  const { bundle } = await buildLoomata({
    directory: output,
    source: path.join(output, 'main.swift'),
    identifier: 'org.loomata.chat-test.' + path.basename(output),
    launch: {
      node: process.execPath,
      client: path.resolve(tool, 'scripts/local-service.mjs'),
      project: root,
    },
  })
  // Explicit project for this owned test. Restore the prior source selection at cleanup.
  await runLocalService('project.open', { root })
  const stdout = await fs.open(path.join(output, 'stdout.log'), 'w'),
    stderr = await fs.open(path.join(output, 'stderr.log'), 'w')
  child = spawn(path.join(bundle, 'Contents/MacOS/Loomata'), [], {
    env: {
      PATH: process.env.PATH,
      LOOMATA_E2E_OUTPUT: output,
      LOOMATA_E2E_EXPECT_CONNECTED: '1',
      LOOMATA_E2E_CHAT_FILE: file,
      LOOMATA_E2E_CHAT_MARKER: marker,
      LOOMATA_E2E_CHAT_APPROVED: approved,
    },
    stdio: ['ignore', stdout.fd, stderr.fd],
  })
  await stdout.close()
  await stderr.close()
  const status = await new Promise((done, reject) => {
    const timer = setTimeout(() => reject(new Error('Native qualification timeout')), 600000)
    child.once('error', reject)
    child.once('exit', (c) => {
      clearTimeout(timer)
      done(c)
    })
  })
  report.native = JSON.parse(await fs.readFile(path.join(output, 'native.json')))
  if (status !== 0 || report.native.status !== 'passed')
    throw new Error('Native qualification failed')
  const saved = await fs.readFile(path.join(root, file), 'utf8')
  if (saved !== approved && saved !== approved + '\n')
    throw new Error('Native approval did not save the expected witness')
  report.nativeSavedWitness = true
  report.status = 'passed'
  console.log(JSON.stringify(report))
} catch (error) {
  report.status = 'failed'
  report.error = error.message
  throw error
} finally {
  child?.kill('SIGTERM')
  await runLocalService('runtime.stop', { root }).catch((e) => {
    report.cleanupError = e.message
  })
  if (previous) await fs.writeFile(current, previous, { mode: 0o600 })
  else
    await fs.unlink(current).catch((e) => {
      if (e.code !== 'ENOENT') throw e
    })
  await fs.writeFile(
    path.join(output, 'qualification.json'),
    JSON.stringify(report, null, 2) + '\n',
  )
}
