import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync, spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { run, destination } from '../scripts/github-project.mjs'

const git = (root, args) =>
  execFileSync('git', ['-C', root, ...args], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim()
function fixture(t, mode = 'after-commit') {
  const parent = fs.mkdtempSync(path.join(os.tmpdir(), 'whizam-github-'))
  t.after(() => fs.rmSync(parent, { recursive: true, force: true }))
  const root = path.join(parent, 'project'),
    remote = path.join(parent, 'remote.git')
  fs.mkdirSync(root)
  git(root, ['init', '-b', 'main'])
  git(root, ['config', 'user.email', 'fixture@example.test'])
  git(root, ['config', 'user.name', 'Fixture'])
  fs.writeFileSync(path.join(root, '.gitignore'), '*.local\n.github-publication.local/\n')
  fs.writeFileSync(path.join(root, 'README.md'), 'Public fixture\n')
  git(root, ['add', '.gitignore', 'README.md'])
  git(root, ['commit', '-m', 'Initial public fixture'])
  git(parent, ['init', '--bare', remote])
  const selection = run('plan', root)
  const approval = {
    repository: 'fixture/project',
    account: 'fixture-user',
    mode,
    visibility: 'private',
    reviewedHead: selection.head,
    selectionHash: selection.selectionHash,
    authorized: true,
    historyReviewed: true,
    approval: 'Synthetic explicit approval',
  }
  const auth = () => run('authorize', root, approval)
  let sends = 0,
    inspections = 0
  const network = {
    identity() {},
    inspect() {
      inspections++
      return { writable: true }
    },
    remoteHead(root, _url, branch) {
      return git(root, ['ls-remote', '--refs', remote, `refs/heads/${branch}`])
    },
    push(root, _url, branch, head) {
      sends++
      git(root, ['push', remote, `${head}:refs/heads/${branch}`])
    },
  }
  const input = () => ({
    verifiedHead: run('plan', root).head,
    checksPassed: true,
    requested: true,
  })
  const commit = (name = 'next.txt') => {
    fs.writeFileSync(path.join(root, name), 'Public change\n')
    git(root, ['add', name])
    git(root, ['commit', '-m', 'Add public change'])
  }
  return {
    root,
    parent,
    remote,
    approval,
    selection,
    auth,
    input,
    commit,
    network,
    counts: () => ({ sends, inspections }),
  }
}
test('a fresh project has no authorization; destinations refuse URLs, secrets and options', (t) => {
  const f = fixture(t)
  assert.deepEqual(run('status', f.root), { configured: false })
  for (const repo of ['https://github.com/a/b', '--public/x', 'a/b?token=x', 'a/..', 'a/b\n'])
    assert.throws(() => destination(repo))
  assert.throws(() => run('sync', f.root, f.input(), f.network), /not-configured/)
  assert.deepEqual(f.counts(), { sends: 0, inspections: 0 })
})
test('authorization pins a reviewed commit and selection, without network calls', (t) => {
  const f = fixture(t)
  for (const changes of [
    { authorized: false },
    { historyReviewed: false },
    { selectionHash: '0'.repeat(64) },
    { reviewedHead: '0'.repeat(40) },
  ])
    assert.throws(
      () => run('authorize', f.root, { ...f.approval, ...changes }, f.network),
      /authorization/,
    )
  assert.equal(f.auth().networkUsed, false)
  assert.equal(
    fs.statSync(path.join(f.root, '.github-publication.local/state.json')).mode & 0o777,
    0o600,
  )
  assert.equal(run('status', f.root).pending, true)
  assert.deepEqual(f.counts(), { sends: 0, inspections: 0 })
})
test('automatic send uses a real isolated remote, resumes and avoids duplicate pushes', (t) => {
  const f = fixture(t)
  f.auth()
  assert.equal(run('after-commit', f.root, f.input(), f.network).sent, true)
  assert.equal(run('status', f.root).pending, false)
  assert.equal(run('after-commit', f.root, f.input(), f.network).alreadyPresent, true)
  assert.equal(f.counts().sends, 1)
  f.commit()
  run('after-commit', f.root, f.input(), f.network)
  assert.equal(f.counts().sends, 2)
  assert.equal(
    git(f.root, ['rev-parse', 'main']),
    git(f.root, ['ls-remote', f.remote, 'refs/heads/main']).split('\t')[0],
  )
  assert.equal(git(f.root, ['ls-remote', f.remote, 'refs/tags/*']), '')
})
test('on-demand, revocation and mode changes preserve commits and avoid implicit network', (t) => {
  const f = fixture(t, 'on-demand')
  f.auth()
  assert.equal(run('after-commit', f.root, {}, f.network).skipped, 'on-demand')
  assert.throws(
    () => run('sync', f.root, { ...f.input(), requested: false }, f.network),
    /explicit/,
  )
  run('sync', f.root, f.input(), f.network)
  run('suspend', f.root)
  f.commit()
  assert.equal(run('sync', f.root, f.input(), f.network).skipped, 'suspended')
  assert.equal(f.counts().sends, 1)
})
test('provider failures are redacted and pending, without losing the local commit', (t) => {
  const f = fixture(t)
  f.auth()
  assert.throws(
    () =>
      run('after-commit', f.root, f.input(), {
        ...f.network,
        push() {
          throw new Error('fake-provider-secret')
        },
      }),
    /github-send-failed/,
  )
  assert.equal(run('status', f.root).lastResult, 'pending')
  assert.equal(git(f.root, ['rev-parse', 'main']), f.selection.head)
  assert.doesNotMatch(
    fs.readFileSync(path.join(f.root, '.github-publication.local/state.json'), 'utf8'),
    /fake-provider-secret/,
  )
  assert.equal(run('after-commit', f.root, f.input(), f.network).sent, true)
})
test('dirty worktrees, stale checks and changed origin block sends', (t) => {
  const f = fixture(t)
  f.auth()
  assert.throws(() => run('after-commit', f.root, {}, f.network), /checks/)
  fs.writeFileSync(path.join(f.root, 'untracked.txt'), 'pending')
  assert.throws(() => run('after-commit', f.root, f.input(), f.network), /clean/)
  fs.unlinkSync(path.join(f.root, 'untracked.txt'))
  git(f.root, ['remote', 'add', 'origin', 'https://github.com/other/destination.git'])
  assert.throws(() => run('after-commit', f.root, f.input(), f.network), /remote-conflict/)
  assert.equal(f.counts().sends, 0)
})
test('a removed private file remains refused in history', (t) => {
  const f = fixture(t)
  fs.writeFileSync(path.join(f.root, '.env'), 'FAKE=synthetic\n')
  git(f.root, ['add', '.env'])
  git(f.root, ['commit', '-m', 'Synthetic private history'])
  git(f.root, ['rm', '.env'])
  git(f.root, ['commit', '-m', 'Remove synthetic private file'])
  assert.throws(() => run('plan', f.root), /private-history/)
})
test('divergent remote refuses overwrite and preserves both histories', (t) => {
  const f = fixture(t)
  f.auth()
  run('after-commit', f.root, f.input(), f.network)
  const other = path.join(f.parent, 'other')
  git(f.parent, ['clone', '-b', 'main', f.remote, other])
  git(other, ['config', 'user.name', 'Other'])
  git(other, ['config', 'user.email', 'other@example.test'])
  fs.writeFileSync(path.join(other, 'remote.txt'), 'Remote change')
  git(other, ['add', 'remote.txt'])
  git(other, ['commit', '-m', 'Remote change'])
  git(other, ['push'])
  f.commit()
  assert.throws(() => run('after-commit', f.root, f.input(), f.network), /diverged/)
  assert.equal(run('status', f.root).pending, true)
  assert.equal(f.counts().sends, 1)
})
test('parent repositories, symlink state and url rewrites are refused', (t) => {
  const f = fixture(t)
  const nested = path.join(f.root, 'nested')
  fs.mkdirSync(nested)
  assert.throws(() => run('plan', nested), /exact-repository/)
  f.auth()
  git(f.root, ['config', 'url.https://example.test/.insteadOf', 'https://github.com/'])
  assert.throws(() => run('after-commit', f.root, f.input(), f.network), /rewrite/)
  const state = path.join(f.root, '.github-publication.local/state.json')
  fs.renameSync(state, state + '.original')
  fs.symlinkSync(state + '.original', state)
  assert.throws(() => run('status', f.root), /private-file/)
})
test('create requires its own authorization and never pushes the initial history', (t) => {
  const f = fixture(t)
  f.auth()
  assert.throws(() => run('create', f.root, {}, f.network), /create-authorization/)
  let created = false
  run(
    'create',
    f.root,
    { createAuthorized: true },
    {
      ...f.network,
      create() {
        created = true
      },
    },
  )
  assert.equal(created, true)
  assert.equal(f.counts().sends, 0)
})
test('standalone CLI redacts errors and reads state in a fresh process', (t) => {
  const f = fixture(t)
  f.auth()
  const script = fileURLToPath(new URL('../scripts/github-project.mjs', import.meta.url))
  const result = spawnSync(process.execPath, [script, 'status', f.root], {
    encoding: 'utf8',
  })
  assert.equal(result.status, 0, result.stderr)
  assert.equal(JSON.parse(result.stdout).mode, 'after-commit')
  const invalid = spawnSync(process.execPath, [script, 'authorize', f.root], {
    encoding: 'utf8',
    input: '{"token":"synthetic-not-for-logs"}',
  })
  assert.equal(invalid.status, 1)
  assert.doesNotMatch(invalid.stdout + invalid.stderr, /synthetic-not-for-logs/)
})

test('pushInsteadOf rewrites are refused even when fetch URLs are unchanged', (t) => {
  const f = fixture(t)
  f.auth()
  git(f.root, ['config', 'url.https://example.test/.pushInsteadOf', 'https://github.com/'])
  assert.throws(() => run('after-commit', f.root, f.input(), f.network), /rewrite/)
  assert.equal(f.counts().sends, 0)
})

test('production CLI verifies the connected account and isolates token consumption without provider access', (t) => {
  const f = fixture(t)
  const bin = path.join(f.parent, 'bin')
  fs.mkdirSync(bin)
  const fake = path.join(bin, 'gh')
  fs.writeFileSync(
    fake,
    '#!' +
      process.execPath +
      '\n' +
      `
const args = process.argv.slice(2)
if (process.env.EXPECT_FORM === 'yes' && process.env.GH_TOKEN !== 'synthetic-form-token') process.exit(9)
if (args[0] === 'api') console.log(process.env.FAKE_ACCOUNT || 'fixture-user')
else if (args[0] === 'repo' && args[1] === 'view') console.log(JSON.stringify({nameWithOwner:'fixture/project', visibility:process.env.FAKE_VISIBILITY || 'PRIVATE', viewerPermission:process.env.FAKE_PERMISSION || 'WRITE'}))
else if (args[0] === 'repo' && args[1] === 'create') console.log('created')
else process.exit(8)
`,
    { mode: 0o700 },
  )
  const script = fileURLToPath(new URL('../scripts/github-project.mjs', import.meta.url))
  const inspect = (overrides = {}) =>
    spawnSync(process.execPath, [script, 'inspect', f.root], {
      encoding: 'utf8',
      env: { ...process.env, PATH: bin + path.delimiter + process.env.PATH, ...overrides },
    })
  f.auth()
  // An unused form file must not be opened with the existing-login mode.
  fs.symlinkSync('missing-private-target', path.join(f.root, '.github-token.local'))
  assert.equal(inspect().status, 0)
  const changed = inspect({ FAKE_ACCOUNT: 'other-user' })
  assert.equal(changed.status, 1)
  assert.match(changed.stderr, /account-changed/)
  assert.match(inspect({ FAKE_VISIBILITY: 'PUBLIC' }).stderr, /destination-or-permission/)
  assert.match(inspect({ FAKE_PERMISSION: 'READ' }).stderr, /destination-or-permission/)
  fs.unlinkSync(path.join(f.root, '.github-token.local'))
  fs.writeFileSync(path.join(f.root, '.github-token.local'), "GH_TOKEN='synthetic-form-token'\n", {
    mode: 0o600,
  })
  run('authorize', f.root, { ...f.approval, credential: 'form' })
  const success = inspect({ EXPECT_FORM: 'yes' })
  assert.equal(success.status, 0, success.stderr)
  assert.doesNotMatch(success.stdout + success.stderr, /synthetic-form-token/)
  fs.chmodSync(path.join(f.root, '.github-token.local'), 0o644)
  assert.match(inspect().stderr, /token-permissions/)
})

test('a lost send receipt is reconciled by reading the actual remote branch', (t) => {
  const f = fixture(t)
  f.auth()
  let reads = 0
  const interrupted = {
    ...f.network,
    remoteHead(...args) {
      reads++
      if (reads === 2) throw new Error('synthetic network loss after push')
      return f.network.remoteHead(...args)
    },
  }
  assert.throws(() => run('after-commit', f.root, f.input(), interrupted), /send-failed/)
  assert.equal(run('status', f.root).pending, true)
  assert.equal(run('after-commit', f.root, f.input(), f.network).alreadyPresent, true)
  assert.equal(f.counts().sends, 1)
})
