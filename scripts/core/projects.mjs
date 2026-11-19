import * as fs from 'node:fs/promises'
import { constants } from 'node:fs'
import { randomUUID, createHash } from 'node:crypto'
import { basename, dirname, resolve, sep, isAbsolute } from 'node:path'
import { createServer } from 'node:net'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { withEditorRead } from '../editor-reader.mjs'
import { readConfig } from '../local-app.mjs'

const run = promisify(execFile)
const privateName = '.runtime.local/project'
const forbidden = new Set([
  '.git',
  'node_modules',
  '.runtime.local',
  '.design-editor.local',
  '.local',
  'test-results',
  'test-fixtures',
  'build',
  'dist',
  '.react-router',
  'storybook-static',
])
const inside = (root, path) => path === root || path.startsWith(root + sep)
const json = async (path) => JSON.parse(await fs.readFile(path, 'utf8'))
async function write(path, value) {
  await fs.writeFile(path, JSON.stringify(value, null, 2) + '\n', { mode: 0o600 })
}
async function missing(path) {
  try {
    await fs.lstat(path)
    return false
  } catch (e) {
    if (e.code === 'ENOENT') return true
    throw e
  }
}
function validPath(path) {
  return (
    typeof path === 'string' &&
    path.length > 0 &&
    !isAbsolute(path) &&
    !path.includes('\\') &&
    path
      .split('/')
      .every(
        (p) =>
          p &&
          p !== '.' &&
          p !== '..' &&
          !forbidden.has(p) &&
          (!p.startsWith('.env') || p === '.env.example') &&
          !p.endsWith('.local') &&
          !/\.(pem|key|p12)$/i.test(p),
      )
  )
}
/** A closed release file list, usable after extracting the folder without Git. */
export async function sourceFiles(source) {
  const manifest = await json(resolve(source, 'scripts/project-files.json'))
  if (
    manifest.version !== 1 ||
    !Array.isArray(manifest.files) ||
    manifest.files.length < 10 ||
    new Set(manifest.files).size !== manifest.files.length ||
    !manifest.files.every(validPath)
  )
    throw new Error('Liste de sources du kit invalide ; restaurer une version complète du kit.')
  const files = []
  for (const path of manifest.files) {
    const full = resolve(source, path)
    if ((await fs.realpath(dirname(full))) !== dirname(full))
      throw new Error('Dossier source symbolique refusé : ' + path)
    const stat = await fs.lstat(full)
    if (stat.isSymbolicLink()) {
      const link = await fs.readlink(full)
      if (
        isAbsolute(link) ||
        !inside(source, await fs.realpath(full)) ||
        !/^(\.agents|\.claude)\/skills\/[^/]+$/.test(path)
      )
        throw new Error('Lien source refusé : ' + path)
      files.push({ path, link })
    } else if (stat.isFile()) files.push({ path })
    else throw new Error('Source non régulière refusée : ' + path)
  }
  return files
}
export async function createProject(sourceDirectory, options = {}) {
  if (
    !options ||
    Object.keys(options).some((k) => !['destination', 'name'].includes(k)) ||
    typeof options.destination !== 'string' ||
    !isAbsolute(options.destination)
  )
    throw new Error('Choisir un nouveau dossier absolu et un nom de projet.')
  const name = options.name?.normalize('NFC').trim()
  if (!name || name.length > 80 || /[\u0000-\u001f\u007f]/.test(name))
    throw new Error('Le nom du projet doit contenir entre 1 et 80 caractères lisibles.')
  const source = await fs.realpath(sourceDirectory)
  const parent = await fs.realpath(dirname(options.destination))
  const leaf = basename(options.destination)
  if (leaf.startsWith('.') || leaf.length > 100 || /[\u0000-\u001f\u007f]/.test(leaf))
    throw new Error('Choisir un nom de dossier visible, de 100 caractères maximum.')
  const root = resolve(parent, leaf)
  if (inside(source, root) || inside(root, source))
    throw new Error('Le projet doit être distinct de l’installation de Loomata.')
  // Validate all sources before claiming a new directory; EEXIST never triggers a cleanup.
  return withEditorRead(source, async () => {
    const files = await sourceFiles(source)
    try {
      await fs.mkdir(root, { mode: 0o700 })
    } catch (e) {
      if (e.code === 'EEXIST')
        throw new Error(
          'Ce dossier existe déjà. Choisir un nouveau dossier ; aucun contenu écrasé.',
        )
      throw e
    }
    const metadata = {
      version: 1,
      id: randomUUID(),
      name,
      sourceVersion: (await json(resolve(source, 'package.json'))).version,
    }
    await write(resolve(root, 'loomata.project.json'), { ...metadata, phase: 'creating' })
    try {
      for (const file of files) {
        const destination = resolve(root, file.path)
        await fs.mkdir(dirname(destination), { recursive: true })
        if (file.link) await fs.symlink(file.link, destination)
        else {
          const handle = await fs.open(
            resolve(source, file.path),
            constants.O_RDONLY | constants.O_NOFOLLOW,
          )
          try {
            await fs.writeFile(destination, await handle.readFile(), { flag: 'wx', mode: 0o644 })
          } finally {
            await handle.close()
          }
        }
      }
      // A neutral starting page, never the starter's business demonstration as a delivered project.
      await fs.writeFile(
        resolve(root, 'src/App.tsx'),
        `import styles from './App.module.css'\n\nexport default function App() {\n  return <main className={styles.page}><section><h1>{${JSON.stringify(name)}}<\/h1><p>Projet créé avec Loomata. Le cadrage et la première version restent à réaliser.</p></section></main>\n}\n`,
      )
      await fs.writeFile(
        resolve(root, 'ROADMAP.md'),
        `# Roadmap du projet\n\nProjet : ${JSON.stringify(name)}.\n\nPréparation technique en cours. Intention et première version à cadrer ; aucune fonctionnalité métier inventée.\n\nProchaine étape : préciser le brief et le périmètre autorisé.\n`,
      )
      await fs.writeFile(
        resolve(root, 'docs/project-state.md'),
        '# État courant du projet\n\nDossier créé par Loomata. Préparation des outils à vérifier avant utilisation.\n\nLe cadrage et la première version restent à réaliser. Voir la roadmap et les instructions du kit.\n',
      )
      await write(resolve(root, 'loomata.project.json'), { ...metadata, phase: 'created' })
      return { protocolVersion: 1, root, name, phase: 'created' }
    } catch (error) {
      // Keep an interrupted folder visible. Never remove a directory that may now contain user work.
      throw new Error(
        'Création interrompue. Le dossier partiel est conservé ; choisir une autre destination après diagnostic.',
        { cause: error },
      )
    }
  })
}
async function freePort() {
  const server = createServer()
  await new Promise((done, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', done)
  })
  const value = server.address().port
  await new Promise((done) => server.close(done))
  return value
}
async function isolatedDirectory(root, path) {
  let current = root
  for (const part of path.split('/')) {
    current = resolve(current, part)
    try {
      await fs.mkdir(current, { mode: 0o700 })
    } catch (e) {
      if (e.code !== 'EEXIST') throw e
    }
    const stat = await fs.lstat(current)
    if (
      !stat.isDirectory() ||
      stat.isSymbolicLink() ||
      stat.mode & (current === resolve(root, path) ? 0o077 : 0o022) ||
      (await fs.realpath(current)) !== current
    )
      throw new Error('État privé non isolé ; aucun accès partagé ou lien symbolique accepté.')
  }
}
export async function openProject(root, node = process.execPath, toolRoot) {
  const config = resolve(root, '.runtime.local/local-app/config.json')
  await isolatedDirectory(root, '.runtime.local/local-app')
  if (await missing(config)) {
    const ui = await freePort()
    let book = await freePort()
    while (book === ui) book = await freePort()
    await run(
      node,
      [
        resolve(root, 'scripts/local-app.mjs'),
        'configure',
        '--ui-port',
        String(ui),
        '--storybook-port',
        String(book),
      ],
      { cwd: root, timeout: 10000 },
    )
  }
  await readConfig(root)
  if (toolRoot) {
    await isolatedDirectory(toolRoot, '.runtime.local/loomata-context')
    await write(resolve(toolRoot, '.runtime.local/loomata-context/last-project.json'), { root })
  }
  return { protocolVersion: 1, root, phase: 'opened' }
}
export async function prepareProject(root, sourceDirectory, node = process.execPath, signal) {
  const metadata = await json(resolve(root, 'loomata.project.json')).catch(() => null)
  if (
    metadata?.version !== 1 ||
    metadata.phase !== 'created' ||
    !/^[0-9a-f-]{36}$/.test(metadata.id)
  )
    throw new Error(
      'Préparation réservée aux projets créés par Loomata. Pour ce dossier existant, suivre sa préparation documentée.',
    )
  await isolatedDirectory(root, privateName)
  const lock = resolve(root, privateName, 'prepare.lock')
  try {
    await fs.mkdir(lock, { mode: 0o700 })
  } catch (e) {
    if (e.code === 'EEXIST')
      throw new Error(
        'Une préparation est active ou interrompue. Diagnostiquer son journal avant de reprendre ; aucun verrou supprimé.',
      )
    throw e
  }
  const statePath = resolve(root, privateName, 'state.json')
  const log = await fs.open(resolve(root, privateName, 'prepare.log'), 'a', 0o600)
  let stage = 'ownership-check'
  try {
    // Never regenerate under a writer or recovery state, even when a prior preparation failed.
    for (const path of [
      '.runtime.local/local-app/owner.json',
      '.runtime.local/local-app/control.sock',
      '.design-editor.local/active',
    ])
      if (!(await missing(resolve(root, path))))
        throw new Error(
          'Arrêter les services et résoudre toute récupération avant préparation. Aucun journal modifié.',
        )
    stage = 'dependencies'
    await write(statePath, { version: 1, id: metadata.id, phase: 'preparing' })
    const lockHash = createHash('sha256')
      .update(await fs.readFile(resolve(root, 'package-lock.json')))
      .digest('hex')
    const deps = resolve(root, 'node_modules')
    if (await missing(deps)) {
      const attempt = await fs.mkdtemp(resolve(root, privateName, 'dependencies-'))
      const preparedDependencies = resolve(attempt, 'node_modules')
      const source = await fs.realpath(sourceDirectory)
      const sourceDeps = resolve(source, 'node_modules')
      const sameLock = (await fs.readFile(resolve(root, 'package-lock.json'))).equals(
        await fs.readFile(resolve(source, 'package-lock.json')),
      )
      if (
        sameLock &&
        !(await missing(sourceDeps)) &&
        (await fs.realpath(sourceDeps)) === sourceDeps
      ) {
        // Installed, trusted dependencies only. No runtime, credentials or npm configuration copied.
        if (process.platform === 'darwin')
          await run('/bin/cp', ['-cR', sourceDeps, preparedDependencies], {
            timeout: 180000,
            signal,
          })
        else
          await fs.cp(sourceDeps, preparedDependencies, {
            recursive: true,
            mode: constants.COPYFILE_FICLONE,
          })
      } else {
        for (const name of ['package.json', 'package-lock.json'])
          await fs.copyFile(resolve(root, name), resolve(attempt, name))
        const npm = resolve(dirname(node), '../lib/node_modules/npm/bin/npm-cli.js')
        await run(
          node,
          [
            npm,
            'ci',
            '--ignore-scripts',
            '--no-audit',
            '--no-fund',
            '--cache',
            resolve(root, privateName, 'npm-cache'),
          ],
          {
            cwd: attempt,
            signal,
            timeout: 240000,
            maxBuffer: 1024 * 1024,
            env: { ...process.env, PATH: dirname(node) + ':' + process.env.PATH },
          },
        )
      }
      await fs.rename(preparedDependencies, deps)
      await write(resolve(root, privateName, 'dependencies.json'), { lockHash })
    } else {
      if (
        (await fs.lstat(deps)).isSymbolicLink() ||
        (await json(resolve(root, privateName, 'dependencies.json')).catch(() => null))
          ?.lockHash !== lockHash
      )
        throw new Error(
          'Dépendances existantes non reconnues ou modifiées ; diagnostic requis, aucun remplacement automatique.',
        )
    }
    stage = 'derivatives'
    const result = await run(node, [resolve(root, 'scripts/generate-tokens.mjs')], {
      cwd: root,
      signal,
      timeout: 90000,
      maxBuffer: 1024 * 1024,
      env: { ...process.env, DATABASE_URL: '' },
    })
    await log.writeFile(result.stdout)
    stage = 'configuration'
    await openProject(root, node)
    await write(statePath, { version: 1, id: metadata.id, phase: 'prepared' })
    return { protocolVersion: 1, root, name: metadata.name, phase: 'prepared' }
  } catch (error) {
    await log.writeFile(
      'Préparation échouée — étape : ' +
        stage +
        '. Consulter les prérequis et conserver les sources.\n',
    )
    if (stage !== 'ownership-check')
      await write(statePath, { version: 1, id: metadata.id, phase: 'failed', stage })
    throw new Error(
      'Préparation échouée. Le projet est conservé. Vérifier .runtime.local/project/prepare.log puis utiliser Préparer / Réessayer.',
      { cause: error },
    )
  } finally {
    await log.close()
    await fs.rmdir(lock)
  }
}
