import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { createHash, randomUUID } from 'node:crypto'
import { parseEnv } from 'node:util'
import { fileURLToPath } from 'node:url'

const stateName = '.github-publication.local'
const hash = (value) => createHash('sha256').update(value).digest('hex')
const modes = ['after-commit', 'on-demand']
const accountValid = (value) =>
  typeof value === 'string' && /^[a-zA-Z0-9][a-zA-Z0-9-]{0,38}$/.test(value)
const fail = (code) => {
  throw new Error(code)
}
// Raw child output/errors may contain credentials or private repository details.
function execute(root, bin, args, env = process.env) {
  const result = spawnSync(bin, args, {
    cwd: root,
    env,
    encoding: 'utf8',
    input: '',
    timeout: 60_000,
    maxBuffer: 16 * 1024 * 1024,
  })
  if (result.error || result.status !== 0)
    fail(bin === 'git' ? 'github-git-operation-failed' : 'github-access-or-operation-failed')
  return result.stdout.trim()
}
function git(root, args, env) {
  return execute(root, 'git', args, env)
}
function optionalGit(root, args) {
  try {
    return git(root, args)
  } catch {
    return null
  }
}
function regular(file) {
  const stat = fs.lstatSync(file)
  if (!stat.isFile() || stat.isSymbolicLink() || stat.nlink !== 1 || stat.size > 1024 * 1024)
    fail('github-private-file-invalid')
  return stat
}
function privateDirectory(root) {
  const dir = path.join(root, stateName)
  if (fs.existsSync(dir)) {
    const stat = fs.lstatSync(dir)
    if (!stat.isDirectory() || stat.isSymbolicLink()) fail('github-state-path-invalid')
  }
  return dir
}
function exactRepository(root) {
  const top = optionalGit(root, ['rev-parse', '--show-toplevel'])
  if (!top || fs.realpathSync(top) !== root) fail('github-exact-repository-required')
}
export function destination(repository) {
  if (
    typeof repository !== 'string' ||
    !/^[a-zA-Z0-9][a-zA-Z0-9-]{0,38}\/[a-zA-Z0-9_.-]{1,100}$/.test(repository) ||
    /\/(?:\.|\.\.)$/.test(repository)
  )
    fail('github-destination-invalid')
  return `https://github.com/${repository}.git`
}
function branchValid(root, branch) {
  if (
    typeof branch !== 'string' ||
    branch.startsWith('-') ||
    optionalGit(root, ['check-ref-format', '--branch', branch]) === null
  )
    fail('github-branch-invalid')
}
function privatePath(file) {
  return (
    file
      .split('/')
      .some(
        (part) =>
          (part !== '.env.example' && /^\.env(?:\.|$)/.test(part)) ||
          part.endsWith('.local') ||
          [
            'node_modules',
            '.git',
            'build',
            'dist',
            'storybook-static',
            'test-results',
            'playwright-report',
          ].includes(part),
      ) || /\.(?:pem|key|p12|pfx)$/.test(file)
  )
}

function plan(root, branch = 'main') {
  exactRepository(root)
  branchValid(root, branch)
  const head = git(root, ['rev-parse', '--verify', `refs/heads/${branch}^{commit}`])
  // Include removed files in history; ignore rules do not erase an earlier secret.
  const history = git(root, ['log', '--format=', '--name-only', '-z', head])
    .split('\0')
    .filter(Boolean)
  if (history.some(privatePath)) fail('github-private-history-review-required')
  const files = git(root, ['ls-tree', '-rz', '--name-only', head])
    .split('\0')
    .filter(Boolean)
    .sort()
  return {
    branch,
    head,
    files,
    selectionHash: hash(JSON.stringify({ head, files })),
    historyReviewRequired: true,
  }
}
function readState(root) {
  const file = path.join(privateDirectory(root), 'state.json')
  if (!fs.existsSync(file)) return null
  regular(file)
  const state = JSON.parse(fs.readFileSync(file, 'utf8'))
  if (
    state.version !== 1 ||
    state.root !== root ||
    !accountValid(state.account) ||
    !modes.includes(state.mode) ||
    typeof state.enabled !== 'boolean' ||
    !['private', 'public'].includes(state.visibility) ||
    !['existing', 'form'].includes(state.credential) ||
    !/^[a-f0-9]{40,64}$/.test(state.reviewedHead) ||
    !/^[a-f0-9]{64}$/.test(state.selectionHash)
  )
    fail('github-state-invalid-or-moved')
  destination(state.repository)
  branchValid(root, state.branch)
  return state
}
function writeState(root, state) {
  const dir = privateDirectory(root)
  fs.mkdirSync(dir, { recursive: true, mode: 0o700 })
  const file = path.join(dir, 'state.json')
  if (fs.existsSync(file)) regular(file)
  const temp = path.join(dir, randomUUID() + '.tmp')
  try {
    fs.writeFileSync(temp, JSON.stringify(state, null, 2) + '\n', { flag: 'wx', mode: 0o600 })
    fs.renameSync(temp, file)
  } finally {
    if (fs.existsSync(temp)) fs.unlinkSync(temp)
  }
}
function authEnvironment(root, state) {
  const env = {
    ...process.env,
    GIT_TERMINAL_PROMPT: '0',
    GH_PROMPT_DISABLED: '1',
    GH_HOST: 'github.com',
  }
  for (const key of Object.keys(env))
    if (key.startsWith('GIT_TRACE') || key === 'GH_DEBUG') delete env[key]
  if (state.credential === 'form') {
    const file = path.join(root, '.github-token.local')
    const stat = regular(file)
    if ((stat.mode & 0o077) !== 0) fail('github-token-permissions-invalid')
    const values = parseEnv(fs.readFileSync(file, 'utf8'))
    if (Object.keys(values).length !== 1 || !values.GH_TOKEN || /[\r\n\0]/.test(values.GH_TOKEN))
      fail('github-token-invalid')
    env.GH_TOKEN = values.GH_TOKEN
    delete env.GITHUB_TOKEN
  }
  return env
}
function identity(root, state, env) {
  const login = execute(root, 'gh', ['api', 'user', '--jq', '.login'], env)
  if (login.toLowerCase() !== state.account.toLowerCase()) fail('github-account-changed')
}
function inspect(root, state, env) {
  identity(root, state, env)
  const result = JSON.parse(
    execute(
      root,
      'gh',
      ['repo', 'view', state.repository, '--json', 'nameWithOwner,visibility,viewerPermission'],
      env,
    ),
  )
  if (
    result.nameWithOwner?.toLowerCase() !== state.repository.toLowerCase() ||
    result.visibility?.toLowerCase() !== state.visibility ||
    !['ADMIN', 'MAINTAIN', 'WRITE'].includes(result.viewerPermission)
  )
    fail('github-destination-or-permission-changed')
  return { repository: state.repository, visibility: state.visibility, writable: true }
}
function transport(root, state) {
  const url = destination(state.repository)
  // Resolve insteadOf and pushInsteadOf before using a credential helper.
  if (git(root, ['ls-remote', '--get-url', url]) !== url) fail('github-url-rewrite-refused')
  if (
    optionalGit(root, ['config', '--name-only', '--get-regexp', '^url\\..*\\.pushinsteadof$']) !==
    null
  )
    fail('github-url-rewrite-refused')
  const pushURL = optionalGit(root, ['remote', 'get-url', '--push', '--all', 'origin'])
  if (pushURL !== null && pushURL !== url) fail('github-existing-remote-conflict')
  return url
}
function gitWithAuth(root, env, args) {
  return git(
    root,
    [
      '-c',
      'credential.helper=',
      '-c',
      'credential.https://github.com.helper=',
      '-c',
      'credential.https://github.com.helper=!gh auth git-credential',
      '-c',
      'push.followTags=false',
      ...args,
    ],
    env,
  )
}
// Network operations are injectable for isolated tests; the CLI always uses the real transport.
export function run(command, root, input = {}, network = {}) {
  root = fs.realpathSync(root)
  exactRepository(root)
  if (command === 'plan') return plan(root, input.branch)
  if (command === 'status') {
    const state = readState(root)
    if (!state) return { configured: false }
    const head = plan(root, state.branch).head
    return {
      configured: true,
      repository: state.repository,
      account: state.account,
      branch: state.branch,
      mode: state.mode,
      enabled: state.enabled,
      head,
      lastSent: state.lastSent ?? null,
      pending: head !== state.lastSent,
      lastResult: state.lastResult ?? null,
      remoteVerified: false,
    }
  }
  if (!['authorize', 'suspend', 'create', 'inspect', 'sync', 'after-commit'].includes(command))
    fail('github-command-invalid')
  const dir = privateDirectory(root)
  // A private receipt cannot be safely written unless Git ignores it and the token.
  for (const file of [stateName + '/state.json', '.github-token.local']) {
    if (
      optionalGit(root, ['check-ignore', '--', file]) === null ||
      git(root, ['ls-files', '--', file])
    )
      fail('github-private-state-must-be-ignored')
  }
  fs.mkdirSync(dir, { recursive: true, mode: 0o700 })
  const lock = path.join(dir, 'write.lock')
  fs.mkdirSync(lock, { mode: 0o700 })
  try {
    if (command === 'authorize') {
      destination(input.repository)
      const selection = plan(root, input.branch)
      if (
        !accountValid(input.account) ||
        !modes.includes(input.mode) ||
        !['private', 'public'].includes(input.visibility) ||
        !['existing', 'form'].includes(input.credential ?? 'existing') ||
        input.authorized !== true ||
        input.historyReviewed !== true ||
        input.reviewedHead !== selection.head ||
        input.selectionHash !== selection.selectionHash ||
        typeof input.approval !== 'string' ||
        !input.approval.trim() ||
        input.approval.length > 500
      )
        fail('github-concrete-authorization-required')
      const state = {
        version: 1,
        root,
        repository: input.repository,
        account: input.account,
        branch: selection.branch,
        visibility: input.visibility,
        mode: input.mode,
        credential: input.credential ?? 'existing',
        enabled: true,
        reviewedHead: selection.head,
        selectionHash: selection.selectionHash,
        approval: input.approval,
        lastSent: null,
        lastResult: 'authorized',
      }
      writeState(root, state)
      return {
        authorized: true,
        repository: state.repository,
        branch: state.branch,
        mode: state.mode,
        networkUsed: false,
      }
    }
    const state = readState(root)
    if (!state) fail('github-not-configured')
    if (command === 'suspend') {
      state.enabled = false
      writeState(root, state)
      return { suspended: true }
    }
    if (!state.enabled) return { skipped: 'suspended', networkUsed: false }
    if (command === 'after-commit' && state.mode !== 'after-commit')
      return { skipped: 'on-demand', networkUsed: false }
    const env = authEnvironment(root, state)
    const view = () => (network.inspect ?? inspect)(root, state, env)
    if (command === 'inspect') return view()
    if (command === 'create') {
      if (input.createAuthorized !== true) fail('github-create-authorization-required')
      ;(network.identity ?? identity)(root, state, env)
      // No --source, --push, --remote or implicit first publication.
      ;(
        network.create ??
        ((root, state, env) =>
          execute(root, 'gh', ['repo', 'create', state.repository, `--${state.visibility}`], env))
      )(root, state, env)
      return { created: true, ...view() }
    }
    const selection = plan(root, state.branch)
    if (input.verifiedHead !== selection.head || input.checksPassed !== true)
      fail('github-current-checks-required')
    if (command === 'sync' && input.requested !== true) fail('github-explicit-request-required')
    if (git(root, ['status', '--porcelain'])) fail('github-clean-worktree-required')
    if (
      optionalGit(root, ['merge-base', '--is-ancestor', state.reviewedHead, selection.head]) ===
      null
    )
      fail('github-history-changed')
    const url = transport(root, state)
    try {
      view()
      const remote = (
        network.remoteHead ??
        ((root, url, branch, env) =>
          gitWithAuth(root, env, ['ls-remote', '--refs', url, `refs/heads/${branch}`]))
      )(root, url, state.branch, env)
      const match = remote ? /^([a-f0-9]{40,64})\s+refs\/heads\/(.+)$/.exec(remote) : null
      if (remote && (!match || match[2] !== state.branch)) fail('github-remote-state-invalid')
      const remoteHead = match?.[1] ?? null
      if (remoteHead !== selection.head) {
        if (
          remoteHead &&
          optionalGit(root, ['merge-base', '--is-ancestor', remoteHead, selection.head]) === null
        )
          fail('github-remote-diverged')
        ;(
          network.push ??
          ((root, url, branch, head, env) =>
            gitWithAuth(root, env, [
              'push',
              '--porcelain',
              '--no-follow-tags',
              url,
              `${head}:refs/heads/${branch}`,
            ]))
        )(root, url, state.branch, selection.head, env)
        const observed = (
          network.remoteHead ??
          ((root, url, branch, env) =>
            gitWithAuth(root, env, ['ls-remote', '--refs', url, `refs/heads/${branch}`]))
        )(root, url, state.branch, env)
        if (!observed.startsWith(selection.head + '\t')) fail('github-send-not-verified')
      }
      state.lastSent = selection.head
      state.lastResult = 'sent'
      writeState(root, state)
      return {
        sent: true,
        head: selection.head,
        repository: state.repository,
        branch: state.branch,
        alreadyPresent: remoteHead === selection.head,
      }
    } catch (error) {
      state.lastResult = 'pending'
      writeState(root, state)
      // Only known codes are emitted; never relay provider/hook messages.
      if (!/^github-[a-z-]+$/.test(error.message)) fail('github-send-failed')
      throw error
    }
  } finally {
    fs.rmdirSync(lock)
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const [command, root = process.cwd()] = process.argv.slice(2)
    const input = ['authorize', 'plan', 'create', 'sync', 'after-commit'].includes(command)
      ? JSON.parse(fs.readFileSync(0, 'utf8') || '{}')
      : {}
    console.log(JSON.stringify(run(command, root, input), null, 2))
  } catch (error) {
    console.error(
      /^github-[a-z-]+$/.test(error.message) ? error.message : 'github-operation-refused',
    )
    process.exitCode = 1
  }
}
