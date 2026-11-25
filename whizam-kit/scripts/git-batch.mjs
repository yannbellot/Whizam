import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

// Diagnostic and bookkeeping only: Git writes remain the assistant's responsibility.
const policy = fs.readFileSync(new URL('../docs/conventions.md', import.meta.url), 'utf8')
const requests = Number(policy.match(/\| Accumulation\s*\| (\d+)/)?.[1])
const size = policy.match(/\| Taille\s*\| Au moins (\d+) fichiers sources modifiés ou (\d+) lignes/)
if (!requests || !size) throw new Error('git-batch-policy-unreadable')
export const thresholds = { requests, files: Number(size[1]), lines: Number(size[2]) }
const privateName = '.git-batches.local'
const git = (root, args) =>
  execFileSync('git', ['-C', root, ...args], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    env: {
      ...process.env,
      GIT_OPTIONAL_LOCKS: '0',
      GIT_LITERAL_PATHSPECS: args[0] === 'check-ignore' ? '0' : '1',
    },
    maxBuffer: 8 * 1024 * 1024,
  }).trim()
const optional = (root, args) => {
  try {
    return git(root, args)
  } catch {
    return null
  }
}
// Only terminal adapters declared by the local catalog are legitimate source links.
function canonicalAdapter(root, file, full) {
  const match = /^(?:\.agents|\.claude)\/skills\/([a-z0-9]+(?:-[a-z0-9]+)*)$/.exec(file)
  if (!match || fs.readlinkSync(full) !== '../../skills/' + match[1]) return false
  try {
    for (const name of ['skills', 'skills/' + match[1]]) {
      const info = fs.lstatSync(path.join(root, name))
      if (!info.isDirectory() || info.isSymbolicLink()) return false
    }
    for (const name of ['skills/catalog.json', 'skills/' + match[1] + '/SKILL.md']) {
      const info = fs.lstatSync(path.join(root, name))
      if (!info.isFile() || info.isSymbolicLink() || info.nlink !== 1) return false
    }
    const catalog = JSON.parse(fs.readFileSync(path.join(root, 'skills/catalog.json'), 'utf8'))
    return catalog.skills.some(
      (skill) => skill.name === match[1] && skill.source === `skills/${match[1]}/SKILL.md`,
    )
  } catch {
    return false
  }
}
function safe(root, file) {
  if (
    typeof file !== 'string' ||
    !file ||
    /[\x00-\x1f\\]/.test(file) ||
    path.isAbsolute(file) ||
    file.split('/').some((p) => !p || p === '.' || p === '..')
  )
    throw new Error('git-batch-path-invalid')
  if (
    file
      .split('/')
      .some(
        (p) =>
          p === '.git' ||
          p.endsWith('.local') ||
          ['node_modules', 'build', 'dist', 'storybook-static', 'test-results'].includes(p),
      ) ||
    (/^\.env(?:\.|$)/.test(path.basename(file)) && path.basename(file) !== '.env.example') ||
    /\.(pem|key|p12|pfx)$/.test(file)
  )
    throw new Error('git-batch-private-path')
  let current = root
  for (const part of file.split('/')) {
    current = path.join(current, part)
    if (
      fs.existsSync(current) ||
      (() => {
        try {
          fs.lstatSync(current)
          return true
        } catch {
          return false
        }
      })()
    ) {
      const stat = fs.lstatSync(current)
      if (stat.isSymbolicLink()) {
        if (current === path.join(root, file) && canonicalAdapter(root, file, current))
          return current
        throw new Error('git-batch-link-refused')
      }
      if (stat.isFile() && stat.nlink !== 1) throw new Error('git-batch-link-refused')
    }
  }
  const full = path.join(root, file)
  if (fs.existsSync(full) && !fs.statSync(full).isFile()) throw new Error('git-batch-file-required')
  return full
}
export function diagnose(root) {
  root = fs.realpathSync(root)
  const top = optional(root, ['rev-parse', '--show-toplevel'])
  const exact = top !== null && fs.realpathSync(top) === root
  return {
    root,
    repository: top === null ? 'missing' : exact ? 'exact' : 'parent',
    branch: exact ? optional(root, ['symbolic-ref', '--short', 'HEAD']) : null,
    head: exact ? optional(root, ['rev-parse', '--verify', 'HEAD']) : null,
    main: exact ? optional(root, ['rev-parse', '--verify', 'refs/heads/main']) : null,
    identityAvailable:
      exact &&
      !!optional(root, ['config', 'user.name']) &&
      !!optional(root, ['config', 'user.email']),
    thresholds,
  }
}
function assertRepository(root, state) {
  const d = diagnose(root)
  if (d.repository !== 'exact' || !d.main || !d.head || !d.branch)
    throw new Error('git-batch-repository-not-ready')
  if (state && (state.root !== root || state.branch !== d.branch || state.base !== d.head))
    throw new Error('git-batch-base-or-branch-changed')
  return d
}
function differences(root, state) {
  const changes = []
  for (const file of state.files) {
    const full = safe(root, file)
    if (optional(root, ['check-ignore', '--', file]) !== null)
      throw new Error('git-batch-ignored-path')
    const tracked = optional(root, ['ls-files', '--error-unmatch', '--', file]) !== null
    let lines = 0,
      changed = false,
      binary = false
    if (tracked) {
      const diff = git(root, [
        'diff',
        '--no-ext-diff',
        '--no-textconv',
        '--numstat',
        state.base,
        '--',
        file,
      ])
      changed = !!diff
      for (const row of diff.split('\n').filter(Boolean)) {
        const [a, b] = row.split('\t')
        binary ||= a === '-' || b === '-'
        if (!binary) lines += Number(a) + Number(b)
      }
    } else if (fs.lstatSync(full, { throwIfNoEntry: false })?.isSymbolicLink()) {
      changed = true
      lines = 1
    } else if (fs.existsSync(full)) {
      if (!fs.statSync(full).isFile() || fs.statSync(full).size > 2 * 1024 * 1024)
        throw new Error('git-batch-source-budget')
      const content = fs.readFileSync(full)
      binary = content.includes(0)
      changed = true
      if (!binary && content.length)
        lines = content.toString('utf8').split('\n').length - (content.at(-1) === 10 ? 1 : 0)
    }
    const excluded =
      /\.generated\./.test(file) ||
      /^(package-lock\.json|npm-shrinkwrap\.json|yarn\.lock|pnpm-lock\.yaml)$/.test(
        path.basename(file),
      ) ||
      state.generated.includes(file)
    if (changed) changes.push({ file, lines, binary, excluded })
  }
  return changes
}
function validate(state) {
  if (
    state?.version !== 1 ||
    typeof state.root !== 'string' ||
    typeof state.branch !== 'string' ||
    !/^[a-f0-9]{40,64}$/.test(state.base) ||
    !Array.isArray(state.files) ||
    !Array.isArray(state.generated) ||
    !Array.isArray(state.requests) ||
    new Set(state.requests).size !== state.requests.length ||
    state.requests.some((id) => typeof id !== 'string' || !/^[a-zA-Z0-9_-]{1,100}$/.test(id)) ||
    !['none', 'explicit', 'subject', 'session', 'stop'].includes(state.event)
  )
    throw new Error('git-batch-state-invalid')
  return state
}
export function run(command, root, input = {}) {
  root = fs.realpathSync(root)
  if (command === 'diagnose') return diagnose(root)
  if (!['begin', 'record', 'status', 'archive', 'extend'].includes(command))
    throw new Error('git-batch-command-invalid')
  const dir = path.join(root, privateName)
  if (
    fs.existsSync(dir) &&
    (fs.lstatSync(dir).isSymbolicLink() || !fs.lstatSync(dir).isDirectory())
  )
    throw new Error('git-batch-state-path-invalid')
  const stateFile = path.join(dir, 'batch.json')
  if (
    fs.existsSync(stateFile) &&
    (fs.lstatSync(stateFile).isSymbolicLink() ||
      fs.lstatSync(stateFile).nlink !== 1 ||
      fs.statSync(stateFile).size > 1024 * 1024)
  )
    throw new Error('git-batch-state-path-invalid')
  let state
  const original = fs.existsSync(stateFile) ? fs.readFileSync(stateFile, 'utf8') : null
  if (command === 'begin') {
    if (fs.existsSync(stateFile)) throw new Error('git-batch-already-open')
    const d = assertRepository(root)
    if (optional(root, ['check-ignore', '--', privateName + '/batch.json']) === null)
      throw new Error('git-batch-state-must-be-ignored')
    if (!d.branch.startsWith('codex/')) throw new Error('git-batch-topic-branch-required')
    if (git(root, ['diff', '--cached', '--name-only'])) throw new Error('git-batch-index-not-empty')
    if (
      !Array.isArray(input.files) ||
      !input.files.length ||
      input.files.length > 1000 ||
      !Array.isArray(input.generated ?? []) ||
      typeof input.objective !== 'string' ||
      !input.objective.trim()
    )
      throw new Error('git-batch-input-invalid')
    state = {
      version: 1,
      root,
      branch: d.branch,
      base: d.head,
      objective: input.objective,
      files: [...new Set(input.files)],
      generated: input.generated ?? [],
      requests: [],
      event: 'none',
    }
    if (state.generated.some((f) => !state.files.includes(f)))
      throw new Error('git-batch-input-invalid')
    if (differences(root, state).length) throw new Error('git-batch-preexisting-selected-changes')
  } else {
    state = validate(JSON.parse(fs.readFileSync(stateFile, 'utf8')))
    if (command === 'archive') {
      if (state.root !== root) throw new Error('git-batch-state-root-conflict')
      for (const file of state.files) safe(root, file)
      const d = assertRepository(root)
      if (
        d.branch !== state.branch ||
        d.head === state.base ||
        optional(root, ['merge-base', state.base, d.head]) !== state.base ||
        git(root, ['status', '--porcelain'])
      )
        throw new Error('git-batch-archive-not-ready')
      const committed = git(root, ['diff', '--name-only', '--no-renames', state.base, d.head])
        .split('\n')
        .filter(Boolean)
      if (!committed.length || committed.some((f) => !state.files.includes(f)))
        throw new Error('git-batch-commit-scope-conflict')
      const lock = path.join(dir, 'write.lock')
      fs.mkdirSync(lock, { mode: 0o700 })
      try {
        if (fs.readFileSync(stateFile, 'utf8') !== original)
          throw new Error('git-batch-state-conflict')
        const archive = path.join(dir, 'archived-' + state.base + '-' + d.head + '.json')
        if (fs.existsSync(archive)) throw new Error('git-batch-archive-exists')
        fs.renameSync(stateFile, archive)
      } finally {
        fs.rmdirSync(lock)
      }
      return { archived: true, head: d.head, integrationAuthorized: false }
    }
    assertRepository(root, state)
    if (command === 'extend') {
      if (!Array.isArray(input.files) || !input.files.length || input.files.length > 1000)
        throw new Error('git-batch-input-invalid')
      const added = input.files.filter((f) => !state.files.includes(f))
      if (differences(root, { ...state, files: added }).length)
        throw new Error('git-batch-preexisting-selected-changes')
      state.files = [...new Set([...state.files, ...added])]
    }
    if (command === 'record') {
      if (input.id !== undefined) {
        if (typeof input.id !== 'string' || !/^[a-zA-Z0-9_-]{1,100}$/.test(input.id))
          throw new Error('git-batch-request-id-invalid')
        if (!state.requests.includes(input.id)) state.requests.push(input.id)
      }
      if (!['none', 'explicit', 'subject', 'session', 'stop'].includes(input.event ?? 'none'))
        throw new Error('git-batch-event-invalid')
      state.event = input.event ?? 'none'
    }
  }
  const changes = differences(root, state),
    counted = changes.filter((c) => !c.excluded)
  const lines = counted.reduce((n, c) => n + c.lines, 0)
  const reasons = []
  if (state.requests.length >= thresholds.requests) reasons.push('requests')
  if (counted.length >= thresholds.files) reasons.push('files')
  if (lines >= thresholds.lines) reasons.push('lines')
  if (['explicit', 'subject', 'session'].includes(state.event)) reasons.push(state.event)
  const indexOccupied = !!git(root, ['diff', '--cached', '--name-only'])
  const mainAdvanced =
    diagnose(root).main !== optional(root, ['merge-base', state.base, 'refs/heads/main'])
  const result = {
    state,
    changes,
    requestCount: state.requests.length,
    sourceFiles: counted.length,
    lines,
    reasons,
    closureDue: changes.length > 0 && reasons.length > 0 && state.event !== 'stop',
    indexOccupied,
    mainAdvanced,
    binaryRequiresReview: counted.some((c) => c.binary),
    checksRequired: true,
    integrationAuthorized: false,
  }
  if (command !== 'status') {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { mode: 0o700 })
    const lock = path.join(dir, 'write.lock')
    fs.mkdirSync(lock, { mode: 0o700 }) // Never remove another writer's lock.
    try {
      const latest = fs.existsSync(stateFile) ? fs.readFileSync(stateFile, 'utf8') : null
      if (latest !== original) throw new Error('git-batch-state-conflict')
      const temp = path.join(dir, 'batch.' + process.pid + '.tmp')
      fs.writeFileSync(temp, JSON.stringify(state, null, 2) + '\n', { flag: 'wx', mode: 0o600 })
      fs.renameSync(temp, stateFile)
    } finally {
      fs.rmdirSync(lock)
    }
  }
  return result
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const [command, root] = process.argv.slice(2)
    const input = ['begin', 'record', 'extend'].includes(command)
      ? JSON.parse(fs.readFileSync(0, 'utf8'))
      : {}
    console.log(JSON.stringify(run(command, root ?? process.cwd(), input), null, 2))
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}
