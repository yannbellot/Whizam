import * as fs from 'node:fs/promises'
import path from 'node:path'
import { createHash, randomUUID } from 'node:crypto'
import {
  privateDir,
  syncDir,
  identity,
  sameIdentity,
  readSafe,
  checkParents,
} from '../design-editor/files.mjs'
export const digest = (bytes) => createHash('sha256').update(bytes).digest('hex')
const hidden = /^(\.|.*\.local$)|(^|[-_.])(secret|credential|token|password)([-_.]|$)/i
const protectedRoots = [
  'loomata',
  'scripts',
  'config',
  'macos',
  'skills',
  'agents',
  'src/design-system',
  'src/ui-lab',
  'src/assistant',
  'docs/design-system',
]
const protectedFiles = [
  'app/loomata-imports.json',
  'app/loomata-imports.css',
  'app/loomata-context-styles.json',
  'package.json',
  'package-lock.json',
  'vite.config.ts',
  'AGENTS.md',
  'CLAUDE.md',
  'GEMINI.md',
  'src/styles/tokens.generated.css',
  'app/routes/ui-lab.tsx',
  'app/routes/ui-lab-preview.tsx',
  'app/routes/ui-lab-reference.tsx',
]
export function permittedPath(file, writing = false) {
  if (
    typeof file !== 'string' ||
    file.length > 300 ||
    path.isAbsolute(file) ||
    file.includes('\\') ||
    file.split('/').some((p) => !p || p === '.' || p === '..' || hidden.test(p)) ||
    /\.(pem|key|p12|crt)$/i.test(file) ||
    /(^|\/)(auth|credentials|tokens|service-account)\.json$/i.test(file)
  )
    throw new Error('chat-file-denied')
  const folded = file.normalize('NFC').toLowerCase()
  if (
    writing &&
    (protectedFiles.some((p) => p.toLowerCase() === folded) ||
      protectedRoots.some((p) => folded === p || folded.startsWith(p + '/')) ||
      !/\.(tsx?|jsx?|css|json|md|txt|html|svg)$/.test(file))
  )
    throw new Error('chat-writer-protected')
  return file
}
export async function projectBinding(directory) {
  const root = await fs.realpath(directory)
  const stat = await fs.lstat(root)
  if (!stat.isDirectory() || stat.isSymbolicLink()) throw new Error('chat-project-invalid')
  return { root, identity: identity(stat) }
}
export async function assertBinding(binding) {
  if (
    (await fs.realpath(binding.root)) !== binding.root ||
    !sameIdentity(identity(await fs.lstat(binding.root)), binding.identity)
  )
    throw new Error('chat-project-changed')
}
export async function listFiles(binding) {
  await assertBinding(binding)
  const files = []
  async function walk(directory, prefix = '', depth = 0) {
    if (depth > 8 || files.length >= 1000) return
    for (const e of await fs.readdir(directory, { withFileTypes: true })) {
      if (files.length >= 1000) break
      const file = prefix + e.name
      try {
        permittedPath(file)
      } catch {
        continue
      }
      if (e.isSymbolicLink()) continue
      if (e.isDirectory()) {
        if (e.name !== 'node_modules')
          await walk(path.join(directory, e.name), file + '/', depth + 1)
      } else if (e.isFile()) {
        const s = await fs.lstat(path.join(binding.root, file))
        if (s.nlink === 1) files.push(file)
      }
    }
  }
  await walk(binding.root)
  return files.sort()
}
export async function readFile(binding, file) {
  await assertBinding(binding)
  permittedPath(file)
  const full = path.join(binding.root, file)
  const stat = await fs.lstat(full)
  if (stat.nlink !== 1 || stat.isSymbolicLink()) throw new Error('chat-file-denied')
  const { bytes } = await readSafe(binding.root, file, 100000)
  if (bytes.includes(0)) throw new Error('chat-file-denied')
  return { file, text: bytes.toString('utf8'), hash: digest(bytes) }
}
export async function proposedWrite(binding, args) {
  await assertBinding(binding)
  if (
    !args ||
    Object.keys(args).sort().join(',') !== 'file,reason,text' ||
    typeof args.text !== 'string' ||
    Buffer.byteLength(args.text) > 100000 ||
    typeof args.reason !== 'string' ||
    args.reason.length > 600
  )
    throw new Error('chat-action-invalid')
  permittedPath(args.file, true)
  await checkParents(binding.root, args.file)
  let previous = null
  try {
    previous = await readFile(binding, args.file)
  } catch (e) {
    if (e.code !== 'ENOENT') throw e
  }
  return {
    file: args.file,
    text: args.text,
    reason: args.reason,
    previousHash: previous?.hash ?? null,
    previousText: previous?.text ?? null,
  }
}
const writeLocks = new Set()
export async function applyWrite(binding, proposal) {
  const key = binding.root + '\0' + proposal.file
  if (writeLocks.has(key)) throw new Error('chat-file-busy')
  writeLocks.add(key)
  let temporary
  try {
    await assertBinding(binding)
    permittedPath(proposal.file, true)
    await checkParents(binding.root, proposal.file)
    const runtime = path.resolve(binding.root, '.runtime.local')
    await fs.mkdir(runtime, { mode: 0o700 }).catch((e) => {
      if (e.code !== 'EEXIST') throw e
    })
    const parent = await fs.lstat(runtime)
    if (
      !parent.isDirectory() ||
      parent.isSymbolicLink() ||
      parent.mode & 0o022 ||
      (await fs.realpath(runtime)) !== runtime
    )
      throw new Error('chat-private-state')
    const staging = path.join(runtime, 'agent-writes')
    await privateDir(staging)
    temporary = path.join(staging, randomUUID() + '.tmp')
    const handle = await fs.open(temporary, 'wx', 0o644)
    try {
      await handle.writeFile(proposal.text)
      await handle.sync()
    } finally {
      await handle.close()
    }
    await assertBinding(binding)
    await checkParents(binding.root, proposal.file)
    const target = path.join(binding.root, proposal.file)
    if (proposal.previousHash === null) {
      await fs.link(temporary, target)
      await fs.unlink(temporary)
      temporary = null
    } else {
      if ((await readFile(binding, proposal.file)).hash !== proposal.previousHash)
        throw new Error('chat-file-changed')
      await fs.rename(temporary, target)
      temporary = null
    }
    await syncDir(path.dirname(target))
    await syncDir(staging)
    return { file: proposal.file, hash: digest(Buffer.from(proposal.text)) }
  } finally {
    if (temporary) await fs.unlink(temporary).catch(() => {})
    writeLocks.delete(key)
  }
}

export function permissionsConfig(binding, work) {
  // Broker performs validated writes. Provider-native tools have no direct project access.
  const lines = [
    'default_permissions="loomata"',
    'approval_policy="never"',
    'cli_auth_credentials_store="file"',
    'project_doc_max_bytes=0',
    'web_search="disabled"',
    '[features]',
  ]
  for (const feature of [
    'shell_tool',
    'shell_snapshot',
    'multi_agent',
    'apps',
    'plugins',
    'hooks',
    'browser_use',
    'computer_use',
    'view_image',
    'image_generation',
    'code_mode',
    'code_mode_host',
    'goals',
    'skill_search',
    'request_permissions_tool',
    'sleep_tool',
  ])
    lines.push(feature + '=false')
  lines.push(
    '[permissions.loomata.filesystem]',
    '":root"="deny"',
    '":minimal"="read"',
    JSON.stringify(work) + '="read"',
    '[permissions.loomata.filesystem.' + JSON.stringify(binding.root) + ']',
    '"."="deny"',
  )
  for (const glob of [
    '.env*',
    '**/.env*',
    '**/*.pem',
    '**/*.key',
    '.git',
    '.codex',
    '.claude',
    '.agents',
    '.runtime.local',
    '.design-editor.local',
    'node_modules',
    '**/*.local',
    '**/*secret*',
    '**/*credential*',
  ])
    lines.push(JSON.stringify(glob) + '="deny"')
  lines.push('[permissions.loomata.network]', 'enabled=false')
  return lines.join('\n') + '\n'
}
