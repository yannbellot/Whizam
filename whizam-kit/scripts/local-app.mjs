import * as fs from 'node:fs/promises'
import { createHash, randomUUID } from 'node:crypto'
import { createServer, connect } from 'node:net'
import { spawn, execFileSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { setTimeout as delay } from 'node:timers/promises'

const privatePath = '.runtime.local/local-app'
const socket = privatePath + '/control.sock'
export const shellQuote = (value) => "'" + value.replaceAll("'", "'\\''") + "'"
export function validatePorts(ui, book) {
  if (![ui, book].every((p) => Number.isInteger(p) && p >= 1024 && p <= 65535) || ui === book)
    throw new Error('Deux ports distincts entre 1024 et 65535 sont requis.')
}
export async function assertAvailable(port) {
  const server = createServer()
  await new Promise((done, reject) => {
    server.once('error', () =>
      reject(new Error(`Le port ${port} est occupé ; aucun processus arrêté.`)),
    )
    server.listen(port, '127.0.0.1', done)
  })
  await new Promise((done) => server.close(done))
}
async function fingerprint(root) {
  const hash = createHash('sha256')
  for (const file of [
    'package.json',
    'scripts/local-app.mjs',
    'node_modules/@react-router/dev/bin.js',
    'scripts/storybook-local.mjs',
  ])
    hash.update(await fs.readFile(resolve(root, file)))
  return hash.digest('hex')
}
async function request(command = 'status') {
  return new Promise((done, reject) => {
    const client = connect(socket)
    client.on('connect', () => client.write(command + '\n'))
    let data = ''
    client.setTimeout(1500, () => client.destroy(new Error('Superviseur sans réponse.')))
    client.on('error', reject)
    client.on('data', (chunk) => {
      data += chunk
      if (data.length > 16384) client.destroy(new Error('Réponse trop grande.'))
    })
    client.on('end', () => {
      try {
        done(JSON.parse(data))
      } catch {
        reject(new Error('Réponse invalide.'))
      }
    })
  })
}
async function exists(path) {
  try {
    await fs.access(path)
    return true
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
    return false
  }
}
export async function readConfig(root) {
  const file = await fs.lstat(resolve(root, privatePath, 'config.json'))
  if (!file.isFile() || file.isSymbolicLink() || file.mode & 0o077)
    throw new Error('Configuration privée non régulière ou trop accessible.')
  const config = JSON.parse(await fs.readFile(resolve(root, privatePath, 'config.json'), 'utf8'))
  const stat = await fs.stat(root)
  if (
    config.version !== 1 ||
    config.root !== root ||
    config.dev !== stat.dev ||
    config.ino !== stat.ino
  )
    throw new Error(
      'L’instance a changé ; réparer explicitement son raccourci, sans réutiliser une autre copie.',
    )
  validatePorts(config.uiPort, config.bookPort)
  return config
}
async function writeJSON(path, value) {
  await fs.writeFile(path, JSON.stringify(value, null, 2) + '\n', { mode: 0o600 })
}
async function daemon(root, config) {
  const children = []
  let phase = 'starting',
    stopping = false,
    closing
  const version = await fingerprint(root)
  const info = () => ({
    version: 1,
    id: config.id,
    root,
    fingerprint: version,
    phase,
    uiURL: `http://127.0.0.1:${config.uiPort}/`,
    storybookURL: `http://127.0.0.1:${config.bookPort}/`,
    pids: children.filter((item) => !item.exited).map((item) => item.process.pid),
  })
  const server = createServer((client) => {
    client.setTimeout(2000, () => client.destroy())
    let input = ''
    client.on('error', () => {})
    client.on('data', (chunk) => {
      input += chunk
      if (input.length > 32) {
        client.destroy()
        return
      }
      if (!input.endsWith('\n')) return
      const command = input.trim()
      client.end(JSON.stringify(info()))
      if (command === 'stop') void stop().catch(console.error)
    })
  })
  async function stop() {
    if (closing) return closing
    closing = (async () => {
      stopping = true
      phase = 'stopping'
      // Stop the documentation process before the application.
      for (const item of [...children].reverse()) {
        if (item.exited) continue
        process.kill(-item.process.pid, 'SIGTERM')
        for (let n = 0; n < 300 && !item.exited; n++) await delay(100)
        if (!item.exited)
          throw new Error(
            'Arrêt incomplet ; aucun SIGKILL ni verrou supprimé. Consulter le journal privé.',
          )
      }
      await new Promise((done) => server.close(done))
      await fs.rm(privatePath + '/owner.json', { force: true })
    })()
    return closing
  }
  const fail = async () => {
    if (stopping) return
    phase = 'failed'
    console.error(
      'Un service local s’est arrêté. Pas de relance automatique ; consulter ce journal avant une nouvelle ouverture.',
    )
    await stop()
    process.exitCode = 1
  }
  const start = (args) => {
    const env = {
      ...process.env,
      DATABASE_URL: '',
      PATH: dirname(process.execPath) + ':' + process.env.PATH,
    }
    // Application reads only this instance's private env file; Storybook has no DB access.
    if (args.includes('node_modules/@react-router/dev/bin.js')) delete env.DATABASE_URL
    for (const key of Object.keys(env))
      if (key.startsWith('ADL_DESIGN_EDITOR_') || key === 'ADL_UI_EDITOR') delete env[key]
    const child = spawn(process.execPath, args, {
      cwd: root,
      env,
      detached: true,
      stdio: ['ignore', 'inherit', 'inherit'],
    })
    const item = { process: child, exited: false }
    children.push(item)
    child.on('error', () => {
      item.exited = true
      void fail().catch(console.error)
    })
    child.on('exit', () => {
      item.exited = true
      void fail().catch(console.error)
    })
  }
  async function ready(url) {
    const deadline = Date.now() + 75000
    while (Date.now() < deadline) {
      if (stopping || children.some((item) => item.exited)) throw new Error('Démarrage interrompu.')
      try {
        const response = await fetch(url, { signal: AbortSignal.timeout(1000), redirect: 'error' })
        if (response.ok) return
      } catch {
        /* The deadline below bounds startup. */
      }
      await delay(100)
    }
    throw new Error('Délai de démarrage dépassé ; consulter le journal privé.')
  }
  await assertAvailable(config.uiPort)
  await assertAvailable(config.bookPort)
  // The current kit requires deterministic token outputs, never a writer snapshot.
  await fs.access('src/styles/tokens.generated.css')
  await new Promise((done, reject) => {
    server.once('error', reject)
    server.listen(socket, done)
  })
  await fs.chmod(socket, 0o600)
  await writeJSON(privatePath + '/owner.json', {
    id: config.id,
    pid: process.pid,
    root,
    fingerprint: version,
  })
  process.on('SIGTERM', () => {
    void stop().catch(console.error)
  })
  process.on('SIGINT', () => {
    void stop().catch(console.error)
  })
  try {
    start([
      '--env-file-if-exists=.env.local',
      'node_modules/@react-router/dev/bin.js',
      'dev',
      '--host',
      '127.0.0.1',
      '--port',
      String(config.uiPort),
    ])
    await ready(info().uiURL)
    start([
      'scripts/storybook-local.mjs',
      'dev',
      '--host',
      '127.0.0.1',
      '-p',
      String(config.bookPort),
      '--ci',
      '--no-open',
      '--disable-telemetry',
      '--no-version-updates',
      '--exact-port',
    ])
    await ready(info().storybookURL)
    phase = 'ready'
  } catch (error) {
    console.error(error.message)
    await stop()
    process.exitCode = 1
  }
}

export async function main(args = process.argv.slice(2)) {
  const action = args.shift()
  const options = Object.fromEntries(
    Array.from({ length: args.length / 2 }, (_, n) => [args[n * 2], args[n * 2 + 1]]),
  )
  if (
    args.length % 2 ||
    Object.keys(options).some(
      (key) => !['--root', '--ui-port', '--storybook-port', '--web-app'].includes(key),
    )
  )
    throw new Error('Options invalides.')
  const root = await fs.realpath(options['--root'] ?? fileURLToPath(new URL('..', import.meta.url)))
  process.chdir(root) // Relative Unix socket avoids macOS sockaddr path length limits.
  if (
    !['configure', 'repair', 'start', 'open', 'storybook', 'status', 'stop', 'daemon'].includes(
      action,
    )
  )
    throw new Error('Action locale inconnue.')
  await fs.access('node_modules/@react-router/dev/bin.js')
  await fs.mkdir(privatePath, { recursive: true, mode: 0o700 })
  const privateDirectory = await fs.lstat(privatePath)
  if (
    !privateDirectory.isDirectory() ||
    privateDirectory.isSymbolicLink() ||
    privateDirectory.mode & 0o077 ||
    (await fs.realpath(privatePath)) !== resolve(root, privatePath)
  )
    throw new Error('État privé non isolé ; aucun lien symbolique ou accès partagé accepté.')
  if (action === 'configure') {
    validatePorts(Number(options['--ui-port'] ?? 5173), Number(options['--storybook-port'] ?? 6006))
    const stat = await fs.stat(root)
    const config = {
      version: 1,
      id: randomUUID(),
      root,
      dev: stat.dev,
      ino: stat.ino,
      uiPort: Number(options['--ui-port'] ?? 5173),
      bookPort: Number(options['--storybook-port'] ?? 6006),
      webApp: options['--web-app'] ?? null,
    }
    await fs.writeFile(privatePath + '/config.json', JSON.stringify(config, null, 2), {
      flag: 'wx',
      mode: 0o600,
    })
    console.log('Instance configurée ; aucune installation ni génération effectuée.')
    return
  }
  if (action === 'repair') {
    if (
      (await exists(socket)) ||
      (await exists(privatePath + '/owner.json')) ||
      (await exists(privatePath + '/command.lock'))
    )
      throw new Error('Instance possédée ou état interrompu : diagnostiquer avant réparation.')
    const config = JSON.parse(await fs.readFile(privatePath + '/config.json', 'utf8'))
    const stat = await fs.stat(root)
    if (config.dev !== stat.dev || config.ino !== stat.ino)
      throw new Error('Autre copie : préparer une nouvelle identité, sans transférer ses journaux.')
    config.root = root
    if (options['--web-app']) config.webApp = options['--web-app']
    await writeJSON(privatePath + '/config.json', config)
    console.log('Chemin réparé ; régénérer le lanceur macOS et vérifier son URL Safari.')
    return
  }
  const config = await readConfig(root)
  if (action === 'daemon') return daemon(root, config)
  if (action === 'open') {
    if (process.platform !== 'darwin' || !config.webApp?.endsWith('.app'))
      throw new Error('Associer une app web Safari avant ouverture.')
    await fs.access(resolve(config.webApp, 'Contents/Info.plist'))
    const plist = JSON.parse(
      execFileSync(
        '/usr/bin/plutil',
        ['-convert', 'json', '-o', '-', resolve(config.webApp, 'Contents/Info.plist')],
        { encoding: 'utf8' },
      ),
    )
    if (
      !plist.CFBundleIdentifier?.startsWith('com.apple.Safari.WebApp.') ||
      plist.Manifest?.start_url !== `http://127.0.0.1:${config.uiPort}/`
    )
      throw new Error('Cette app web Safari ne désigne pas l’adresse de cette instance.')
  }
  // Serialize CLI commands. Stale ownership is a diagnostic, never a reason to purge.
  let acquired = false
  for (let n = 0; n < 1200 && !acquired; n++) {
    try {
      await fs.mkdir(privatePath + '/command.lock', { mode: 0o700 })
      acquired = true
    } catch (error) {
      if (error.code !== 'EEXIST') throw error
      await delay(100)
    }
  }
  if (!acquired) throw new Error('Une commande est active ou interrompue ; aucun verrou supprimé.')
  try {
    const version = await fingerprint(root)
    let state
    if (await exists(socket)) state = await request()
    if (state && (state.id !== config.id || state.root !== root || state.fingerprint !== version))
      throw new Error(
        'Autre instance ou version active : conserver son outillage et l’arrêter explicitement.',
      )
    if (action === 'status') {
      console.log(JSON.stringify(state ?? { phase: 'stopped' }))
      return
    }
    if (action === 'stop') {
      if (!state) {
        if (await exists(privatePath + '/owner.json'))
          throw new Error('Superviseur interrompu : diagnostic requis, aucun PID signalé.')
        console.log('Services arrêtés.')
        return
      }
      // The live socket identifies the owner, not a stale PID file alone.
      await request('stop')
      for (let n = 0; n < 650 && (await exists(socket)); n++) await delay(100)
      if (await exists(socket)) throw new Error('Arrêt non confirmé ; aucun arrêt forcé.')
      console.log('Services arrêtés ; sources et reçus conservés.')
      return
    }
    let startupExited = false
    if (!state) {
      if (await exists(privatePath + '/owner.json'))
        throw new Error('Superviseur interrompu ; diagnostic requis, aucune reprise aveugle.')
      await assertAvailable(config.uiPort)
      await assertAvailable(config.bookPort)
      const log = await fs.open(privatePath + '/services.log', 'a', 0o600)
      try {
        const child = spawn(
          process.execPath,
          [resolve(root, 'scripts/local-app.mjs'), 'daemon', '--root', root],
          {
            cwd: root,
            detached: true,
            stdio: ['ignore', log.fd, log.fd],
          },
        )
        child.on('error', () => {
          startupExited = true
        })
        child.on('exit', () => {
          startupExited = true
        })
        child.unref()
      } finally {
        await log.close()
      }
    }
    const deadline = Date.now() + 180000
    while (Date.now() < deadline) {
      if (startupExited)
        throw new Error(
          'Démarrage échoué ; consulter .runtime.local/local-app/services.log. Aucun navigateur ouvert.',
        )
      try {
        state = await request()
      } catch {
        state = null
      }
      if (state?.id === config.id && state.fingerprint === version && state.phase === 'ready') {
        if (action === 'open') execFileSync('/usr/bin/open', ['-a', config.webApp])
        if (action === 'storybook')
          execFileSync('/usr/bin/open', ['-a', 'Safari', state.storybookURL])
        console.log(JSON.stringify(state))
        return
      }
      await delay(100)
    }
    throw new Error(
      'Services indisponibles ; consulter .runtime.local/local-app/services.log. Aucun navigateur ouvert.',
    )
  } finally {
    await fs.rmdir(privatePath + '/command.lock')
  }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  main().catch((error) => {
    console.error(error.message)
    process.exitCode = 1
  })
