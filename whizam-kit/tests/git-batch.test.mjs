import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { run, thresholds } from '../scripts/git-batch.mjs'
const cli = path.resolve('scripts/git-batch.mjs')
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'whizam-batch-'))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  const git = (...args) =>
    execFileSync('git', ['-C', root, ...args], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim()
  git('init', '-b', 'main')
  git('config', 'user.name', 'Synthetic')
  git('config', 'user.email', 'synthetic@example.invalid')
  fs.writeFileSync(path.join(root, '.gitignore'), '.git-batches.local/\n.env*\n')
  fs.writeFileSync(path.join(root, 'page.txt'), 'before\n')
  git('add', '--', '.gitignore', 'page.txt')
  git('commit', '-m', 'test: synthetic base')
  git('switch', '-c', 'codex/batch')
  return {
    root,
    git,
    write: (name, value) => fs.writeFileSync(path.join(root, name), value),
    begin: (files = ['page.txt']) => run('begin', root, { objective: 'Synthetic batch', files }),
  }
}
test('diagnostic never initializes a repository; parent roots refused', (t) => {
  const { root, begin } = fixture(t)
  fs.mkdirSync(path.join(root, 'child'))
  assert.equal(run('diagnose', path.join(root, 'child')).repository, 'parent')
  assert.throws(
    () => run('begin', path.join(root, 'child'), { objective: 'x', files: ['x'] }),
    /not-ready/,
  )
  const empty = fs.mkdtempSync(path.join(os.tmpdir(), 'whizam-no-git-'))
  t.after(() => fs.rmSync(empty, { recursive: true, force: true }))
  assert.equal(run('diagnose', empty).repository, 'missing')
  assert.equal(fs.existsSync(path.join(empty, '.git')), false)
  begin()
})
test('four requests persist across processes, retries deduplicate, fifth closes without Git writes', (t) => {
  const { root, git, write, begin } = fixture(t)
  begin()
  const head = git('rev-parse', 'HEAD')
  write('page.txt', 'after\n')
  for (let i = 1; i <= 4; i++) assert.equal(run('record', root, { id: 'r' + i }).closureDue, false)
  const resumed = JSON.parse(
    execFileSync(process.execPath, [cli, 'status', root], { encoding: 'utf8' }),
  )
  assert.equal(resumed.requestCount, 4)
  assert.equal(run('record', root, { id: 'r4' }).requestCount, 4)
  assert.equal(run('record', root, { id: 'r5' }).closureDue, true)
  assert.equal(git('rev-parse', 'HEAD'), head)
  assert.equal(git('diff', '--cached', '--name-only'), '')
})
test('size counts final diff including new files; reverted and generated changes', (t) => {
  const { root, write, begin } = fixture(t)
  const files = [
    'page.txt',
    ...Array.from({ length: thresholds.files }, (_, i) => 'new' + i + '.txt'),
  ]
  begin(files)
  for (const f of files.slice(1)) write(f, 'new\n')
  assert.equal(run('status', root).closureDue, true)
  for (const f of files.slice(1)) fs.unlinkSync(path.join(root, f))
  write('page.txt', Array.from({ length: thresholds.lines }, () => 'line').join('\n') + '\n')
  assert.equal(run('status', root).closureDue, true)
  write('page.txt', 'before\n')
  assert.equal(run('record', root, { event: 'explicit' }).closureDue, false)
})
test('explicit, subject, session and stop events; checks remain mandatory', (t) => {
  const { root, write, begin } = fixture(t)
  begin()
  write('page.txt', 'after\n')
  for (const event of ['explicit', 'subject', 'session']) {
    const s = run('record', root, { event })
    assert.equal(s.closureDue, true)
    assert.equal(s.integrationAuthorized, false)
    assert.equal(s.checksRequired, true)
  }
  assert.equal(run('record', root, { event: 'stop', id: 'last' }).closureDue, false)
})
test('foreign changes and index are preserved; preexisting selection, secrets and links refused', (t) => {
  const { root, write, git, begin } = fixture(t)
  write('page.txt', 'foreign\n')
  assert.throws(() => begin(), /preexisting/)
  write('page.txt', 'before\n')
  write('foreign.txt', 'foreign\n')
  begin()
  write('page.txt', 'ours\n')
  git('add', '--', 'foreign.txt')
  assert.equal(run('status', root).indexOccupied, true)
  assert.equal(git('diff', '--cached', '--name-only'), 'foreign.txt')
  const dir = path.join(root, '.git-batches.local')
  fs.renameSync(path.join(dir, 'batch.json'), path.join(dir, 'saved.json'))
  git('reset', '--', 'foreign.txt')
  assert.throws(() => begin(['.env.local']), /private-path/)
  fs.symlinkSync('foreign.txt', path.join(root, 'link.txt'))
  assert.throws(() => begin(['link.txt']), /link-refused/)
  assert.throws(() => begin(['../escape']), /path-invalid/)
})
test('main advancement flagged; a coherent checked synthetic commit integrates once and archives', (t) => {
  const { root, git, write, begin } = fixture(t)
  begin()
  write('page.txt', 'after\n')
  run('record', root, { id: 'done', event: 'explicit' })
  // These are real external checks and Git operations, not attestations from the helper.
  assert.equal(fs.readFileSync(path.join(root, 'page.txt'), 'utf8'), 'after\n')
  git('add', '--', 'page.txt')
  git('commit', '-m', 'test: coherent batch')
  assert.equal(run('archive', root).archived, true)
  git('switch', 'main')
  git('merge', '--ff-only', 'codex/batch')
  assert.equal(git('rev-list', '--count', 'HEAD'), '2')
  git('switch', 'codex/batch')
  begin()
  git('switch', 'main')
  write('other.txt', 'main\n')
  git('add', '--', 'other.txt')
  git('commit', '-m', 'test: advance main')
  git('switch', 'codex/batch')
  assert.equal(run('status', root).mainAdvanced, true)
})
test('ignored generated files do not trigger size; replaced state and source links refused', (t) => {
  const { root, write } = fixture(t)
  run('begin', root, { objective: 'generated', files: ['page.txt'], generated: ['page.txt'] })
  write('page.txt', 'x\n'.repeat(250))
  assert.equal(run('status', root).closureDue, false)
  fs.unlinkSync(path.join(root, 'page.txt'))
  fs.symlinkSync('missing', path.join(root, 'page.txt'))
  assert.throws(() => run('status', root), /link-refused/)
})
test('selection extends only before changes; occupied lock and changed branch refuse writes', (t) => {
  const { root, begin, write, git } = fixture(t)
  begin()
  run('extend', root, { files: ['planned.txt'] })
  write('planned.txt', 'included\n')
  assert.equal(run('status', root).sourceFiles, 1)
  write('late.txt', 'foreign\n')
  assert.throws(() => run('extend', root, { files: ['late.txt'] }), /preexisting/)
  const lock = path.join(root, '.git-batches.local', 'write.lock')
  fs.mkdirSync(lock)
  assert.throws(() => run('record', root, { id: 'blocked' }))
  assert.equal(run('status', root).requestCount, 0)
  fs.rmdirSync(lock)
  git('switch', 'main')
  assert.throws(() => run('record', root, { id: 'wrong-branch' }), /base-or-branch/)
})
test('archive refuses a commit containing unrelated tracked work', (t) => {
  const { root, git, write, begin } = fixture(t)
  begin()
  write('page.txt', 'ours\n')
  write('foreign.txt', 'foreign\n')
  git('add', '--', 'page.txt', 'foreign.txt')
  git('commit', '-m', 'test: mixed scope')
  assert.throws(() => run('archive', root), /scope-conflict/)
})

test('lockfiles are excluded and state symlinks are refused', (t) => {
  const { root, write } = fixture(t)
  run('begin', root, { objective: 'lockfiles', files: ['yarn.lock'] })
  write('yarn.lock', 'x\n'.repeat(300))
  assert.equal(run('status', root).closureDue, false)
  const file = path.join(root, '.git-batches.local/batch.json')
  const original = path.join(root, '.git-batches.local/original.json')
  fs.renameSync(file, original)
  fs.symlinkSync(original, file)
  assert.throws(() => run('status', root), /state-path-invalid/)
})

test('directory selections are refused and Git pathspecs remain literal', (t) => {
  const { root, write } = fixture(t)
  fs.mkdirSync(path.join(root, 'source'))
  assert.throws(
    () => run('begin', root, { objective: 'directory', files: ['source'] }),
    /file-required/,
  )
  run('begin', root, { objective: 'literal', files: [':(glob)*'] })
  write('unselected.txt', 'foreign\n')
  assert.equal(run('status', root).changes.length, 0)
})

test('private state cannot be created without an ignore rule', (t) => {
  const { root, write, begin } = fixture(t)
  write('.gitignore', '.env*\n')
  assert.throws(() => begin(), /state-must-be-ignored/)
  assert.equal(fs.existsSync(path.join(root, '.git-batches.local')), false)
})

test('declared canonical skill adapters can be counted and archived without following links', (t) => {
  const f = fixture(t)
  const files = [
    'skills/catalog.json',
    'skills/example/SKILL.md',
    '.agents/skills/example',
    '.claude/skills/example',
  ]
  f.begin(files)
  fs.mkdirSync(path.join(f.root, 'skills/example'), { recursive: true })
  fs.mkdirSync(path.join(f.root, '.agents/skills'), { recursive: true })
  fs.mkdirSync(path.join(f.root, '.claude/skills'), { recursive: true })
  f.write(
    'skills/catalog.json',
    JSON.stringify({ skills: [{ name: 'example', source: 'skills/example/SKILL.md' }] }),
  )
  f.write('skills/example/SKILL.md', '# Example\n')
  for (const dir of ['.agents', '.claude'])
    fs.symlinkSync('../../skills/example', path.join(f.root, dir, 'skills/example'))
  const state = run('record', f.root, { id: 'extend-library', event: 'explicit' })
  assert.equal(state.requestCount, 1)
  assert.equal(state.changes.filter((c) => c.file.startsWith('.')).length, 2)
  assert.ok(state.changes.every((c) => !c.binary))
  f.git('add', '--', ...files)
  f.git('commit', '-m', 'Add canonical adapters')
  assert.equal(run('archive', f.root).archived, true)
})

test('adapter exception refuses external, undeclared, alternate and traversed links', (t) => {
  const f = fixture(t)
  const leaf = '.agents/skills/example'
  f.begin([leaf])
  fs.mkdirSync(path.join(f.root, '.agents/skills'), { recursive: true })
  fs.mkdirSync(path.join(f.root, 'skills/example'), { recursive: true })
  f.write('skills/catalog.json', JSON.stringify({ skills: [] }))
  f.write('skills/example/SKILL.md', '# Example\n')
  fs.symlinkSync('../../skills/example', path.join(f.root, leaf))
  assert.throws(() => run('status', f.root), /link-refused/)
  f.write(
    'skills/catalog.json',
    JSON.stringify({ skills: [{ name: 'example', source: 'skills/example/SKILL.md' }] }),
  )
  fs.unlinkSync(path.join(f.root, leaf))
  fs.symlinkSync('/private/tmp', path.join(f.root, leaf))
  assert.throws(() => run('status', f.root), /link-refused/)
  fs.unlinkSync(path.join(f.root, leaf))
  fs.symlinkSync('../../skills/example', path.join(f.root, leaf))
  fs.renameSync(path.join(f.root, 'skills/example'), path.join(f.root, 'skills/original'))
  fs.symlinkSync('original', path.join(f.root, 'skills/example'))
  assert.throws(() => run('status', f.root), /link-refused/)
  fs.unlinkSync(path.join(f.root, 'skills/example'))
  fs.renameSync(path.join(f.root, 'skills/original'), path.join(f.root, 'skills/example'))
  fs.renameSync(path.join(f.root, '.agents/skills'), path.join(f.root, '.agents/original'))
  fs.symlinkSync('original', path.join(f.root, '.agents/skills'))
  assert.throws(() => run('status', f.root), /link-refused/)
})
