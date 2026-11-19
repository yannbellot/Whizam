import * as fs from 'node:fs/promises'
import path from 'node:path'
import { randomUUID, createHash } from 'node:crypto'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { sourceFiles } from './projects.mjs'
import { withEditorRead } from '../editor-reader.mjs'
import { readSafe, syncDir } from '../design-editor/files.mjs'
const run = promisify(execFile)
const hash = (b) => createHash('sha256').update(b).digest('hex')
const privatePart = (p) =>
  p.startsWith('.') ||
  /^(?:service[-_]?account\.json|id_(?:rsa|dsa|ecdsa|ed25519))$/i.test(p) ||
  /(?:^|[-_.])(secret|credentials?|password|auth|api-key|access-token|refresh-token)(?:[-_.]|$)/i.test(
    p,
  ) ||
  p.toLowerCase().endsWith('.local') ||
  [
    'node_modules',
    'build',
    'dist',
    'test-results',
    'test-fixtures',
    'storybook-static',
    'coverage',
    'vendor',
    'backups',
    'storage',
    'uploads',
  ].includes(p.toLowerCase())
const roots = new Set([
  'app',
  'src',
  'public',
  'docs',
  'scripts',
  'config',
  'tests',
  'agents',
  'skills',
  'macos',
  'drizzle',
  'loomata',
])
export async function projectSources(root) {
  const files = []
  async function walk(dir, prefix = '') {
    for (const e of await fs.readdir(dir, { withFileTypes: true })) {
      const file = prefix + e.name
      if (
        prefix.startsWith('loomata/') &&
        file !== 'loomata/checkpoints' &&
        file !== 'loomata/workspace.json' &&
        !/^loomata\/checkpoints\/[a-f0-9-]{36}\.json$/.test(file)
      )
        continue
      if (
        privatePart(e.name) &&
        ![
          '.env.example',
          '.gitignore',
          '.dockerignore',
          '.nvmrc',
          '.prettierrc.json',
          '.prettierignore',
          '.storybook',
          '.agents',
          '.claude',
        ].includes(e.name)
      )
        continue
      if (e.isSymbolicLink()) {
        if (/^(\.agents|\.claude)\/skills\/[^/]+$/.test(file)) {
          const full = path.join(root, file),
            link = await fs.readlink(full),
            real = await fs.realpath(full)
          if (path.isAbsolute(link) || !real.startsWith(root + path.sep))
            throw new Error('Lien de skill externe refusé.')
          files.push({ path: file, link })
        }
        continue
      }
      if (e.isDirectory()) {
        if (prefix || roots.has(e.name) || ['.storybook', '.agents', '.claude'].includes(e.name))
          await walk(path.join(dir, e.name), file + '/')
      } else if (
        e.isFile() &&
        !/\.(pem|key|p12|pfx|keystore|crt|zip|db[0-9]*|sqlite[0-9]*|dump)$/i.test(e.name)
      )
        files.push({ path: file })
      if (files.length > 10000) throw new Error('Trop de sources pour cet export.')
    }
  }
  await walk(root)
  return files.sort((a, b) => a.path.localeCompare(b.path))
}
export async function exportSources(operation, { root, source, options }) {
  if (!['project.export', 'tool.export'].includes(operation))
    throw new Error('Opération d’export inconnue.')
  if (process.platform !== 'darwin')
    throw new Error('Export ZIP actuellement qualifié sur macOS uniquement.')
  if (
    !options ||
    Object.keys(options).join(',') !== 'destination' ||
    !path.isAbsolute(options.destination) ||
    !options.destination.endsWith('.zip')
  )
    throw new Error('Choisir une nouvelle destination ZIP absolue.')
  const origin = await fs.realpath(operation === 'tool.export' ? source : root)
  const parent = await fs.realpath(path.dirname(options.destination)),
    destination = path.join(parent, path.basename(options.destination))
  for (const dir of [origin, await fs.realpath(source), await fs.realpath(root)])
    if (destination.startsWith(dir + path.sep))
      throw new Error('Choisir une destination hors du projet et de l’installation.')
  const stage = await fs.mkdtemp(path.join(parent, '.loomata-export-'))
  try {
    return await withEditorRead(origin, async () => {
      const files =
        operation === 'tool.export' ? await sourceFiles(origin) : await projectSources(origin)
      const folder = path.join(
        stage,
        operation === 'tool.export' ? 'Loomata-sources' : 'Projet-sources',
      )
      await fs.mkdir(folder)
      const inventory = []
      let total = 0
      for (const file of files) {
        const target = path.join(folder, file.path)
        await fs.mkdir(path.dirname(target), { recursive: true })
        if (file.link) {
          await fs.symlink(file.link, target)
          inventory.push({ file: file.path, link: file.link })
          continue
        }
        const { bytes } = await readSafe(origin, file.path, 32 * 1024 * 1024)
        total += bytes.length
        if (total > 512 * 1024 * 1024) throw new Error('Export trop volumineux.')
        const stat = await fs.lstat(path.join(origin, file.path))
        await fs.writeFile(target, bytes, { mode: stat.mode & 0o111 ? 0o755 : 0o644 })
        inventory.push({ file: file.path, sha256: hash(bytes) })
      }
      // Recheck both inventory and contents before publishing the snapshot.
      const current =
        operation === 'tool.export' ? await sourceFiles(origin) : await projectSources(origin)
      if (JSON.stringify(current) !== JSON.stringify(files))
        throw new Error('Sources modifiées pendant l’export ; réessayer.')
      for (const item of inventory) {
        if (item.link) continue
        const { bytes } = await readSafe(origin, item.file, 32 * 1024 * 1024)
        if (hash(bytes) !== item.sha256)
          throw new Error('Sources modifiées pendant l’export ; réessayer.')
      }
      if (inventory.some((i) => i.file === 'loomata-export.json'))
        throw new Error('Nom réservé loomata-export.json ; renommer ce fichier avant export.')
      const receipt = {
        version: 1,
        kind: operation,
        createdAt: new Date().toISOString(),
        scope: 'saved sources only; no private state, dependencies, Git or database',
        files: inventory,
      }
      await fs.writeFile(
        path.join(folder, 'loomata-export.json'),
        JSON.stringify(receipt, null, 2) + '\n',
      )
      const archive = path.join(stage, randomUUID() + '.zip')
      await run(
        '/usr/bin/ditto',
        ['-c', '-k', '--norsrc', '--noextattr', '--noqtn', '--keepParent', folder, archive],
        { timeout: 180000 },
      )
      const h = await fs.open(archive, 'r')
      await h.sync()
      await h.close()
      await fs.link(archive, destination) // Exclusive publication, even under concurrent exports.
      await syncDir(parent)
      return {
        protocolVersion: 1,
        phase: 'exported',
        destination,
        files: files.length,
        sha256: hash(await fs.readFile(archive)),
      }
    })
  } finally {
    await fs.rm(stage, { recursive: true, force: true })
  }
}
