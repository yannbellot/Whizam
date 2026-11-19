import { test } from 'node:test'
import assert from 'node:assert/strict'
import * as fs from 'node:fs/promises'
import { resolve } from 'node:path'
import { randomUUID } from 'node:crypto'
import { execFile, spawn } from 'node:child_process'
import { promisify } from 'node:util'
import { WorkspaceStore } from '../scripts/core/workspace.ts'
const run = promisify(execFile)
const revision = 'a'.repeat(64)
const parent = resolve(import.meta.dirname, '../test-results/workspace-store')
await fs.mkdir(parent, { recursive: true })
async function fixture(t) {
  const root = await fs.mkdtemp(resolve(parent, 'project-'))
  const store = new WorkspaceStore(root)
  const projectId = randomUUID(),
    target = randomUUID()
  await fs.writeFile(
    resolve(root, 'loomata.project.json'),
    JSON.stringify({ version: 1, phase: 'created', id: projectId }),
  )
  await fs.writeFile(resolve(root, '.gitignore'), '*.local\n')
  await fs.writeFile(resolve(root, 'page.txt'), 'before')
  await store.git(['init', '-b', 'main'])
  await store.git(['add', '--', '.gitignore', 'loomata.project.json', 'page.txt'])
  await store.git(['commit', '-m', 'test: establish synthetic project'])
  const model = {
    schemaVersion: 1,
    projectId,
    revision,
    entities: [
      { id: target, kind: 'page', label: 'Page', revision, files: ['page.txt', 'new.txt'] },
    ],
  }
  await store.initialize(model)
  await store.git(['add', '--', 'loomata/workspace.json'])
  await store.git(['commit', '-m', 'test: establish workspace model'])
  t.after(async () => {
    await fs.rm(root, { recursive: true, force: true })
  })
  const tree = await store.openTree('draft')
  const operation = (after = 'after') => ({
    id: randomUUID(),
    revision,
    origin: 'codex',
    targets: [target],
    edits: [{ file: 'page.txt', before: 'before', after }],
  })
  return { root, store, tree, operation, target }
}
test('durable isolated draft, same revision, idempotent operation and undo after reopening', async (t) => {
  const { root, store, tree, operation } = await fixture(t)
  const input = operation()
  const first = await store.apply(tree, input)
  assert.equal(await fs.readFile(resolve(root, 'page.txt'), 'utf8'), 'before')
  assert.equal(await fs.readFile(resolve(store.treeRoot(tree), 'page.txt'), 'utf8'), 'after')
  assert.deepEqual(await store.apply(tree, input), first)
  await assert.rejects(store.apply(tree, { ...input, origin: 'inspector' }), /operation-reused/)
  await assert.rejects(store.apply(tree, operation()), /revision-conflict/)
  const reopened = new WorkspaceStore(root)
  assert.equal((await reopened.snapshot()).trees[0].revision, first.revision)
  await reopened.undo(tree, input.id, first.revision)
  assert.equal(await fs.readFile(resolve(store.treeRoot(tree), 'page.txt'), 'utf8'), 'before')
  await assert.rejects(reopened.undo(tree, input.id, first.revision), /undo-conflict/)
  await assert.rejects(reopened.openTree('draft'), /draft-exists/)
  const concurrent = await reopened.openTree('workItem')
  assert.notEqual(concurrent, tree)
  assert.equal((await reopened.select(tree)).selected, tree)
})
test('prepared transaction recovers after each publication boundary', async (t) => {
  for (const phase of ['prepared', 'file-published', 'state-published']) {
    const { root, store, tree, operation } = await fixture(t)
    const input = operation()
    const broken = new WorkspaceStore(root, async (at) => {
      if (at === phase) throw new Error('injected interruption')
    })
    await assert.rejects(broken.apply(tree, input), /injected/)
    const resumed = new WorkspaceStore(root)
    await resumed.snapshot()
    assert.equal(await fs.readFile(resolve(store.treeRoot(tree), 'page.txt'), 'utf8'), 'after')
    assert.equal((await resumed.apply(tree, input)).state, 'applied')
  }
})
test('real SIGKILL recovery preserves operation exactly once', async (t) => {
  const { root, store, tree, operation } = await fixture(t)
  const input = operation()
  const moduleURL = new URL('../scripts/core/workspace.ts', import.meta.url).href
  const child = spawn(
    process.execPath,
    [
      '--input-type=module',
      '-e',
      `import { WorkspaceStore } from ${JSON.stringify(moduleURL)}; const s = new WorkspaceStore(process.argv[1], async p => { if (p === 'file-published') process.kill(process.pid, 'SIGKILL') }); await s.apply(process.argv[2], JSON.parse(process.argv[3]));`,
      root,
      tree,
      JSON.stringify(input),
    ],
    { stdio: 'pipe' },
  )
  const exit = await new Promise((done) =>
    child.once('exit', (code, signal) => done({ code, signal })),
  )
  assert.equal(exit.signal, 'SIGKILL')
  await assert.rejects(store.snapshot(), /busy-or-interrupted/)
  await store.recover()
  assert.equal(await fs.readFile(resolve(store.treeRoot(tree), 'page.txt'), 'utf8'), 'after')
  assert.equal((await store.apply(tree, input)).state, 'applied')
})
test('recovery refuses unknown competing bytes without overwriting either version', async (t) => {
  const { root, store, tree, operation } = await fixture(t)
  const broken = new WorkspaceStore(root, async () => {
    throw new Error('injected')
  })
  await assert.rejects(broken.apply(tree, operation()), /injected/)
  await fs.writeFile(resolve(store.treeRoot(tree), 'page.txt'), 'external')
  await assert.rejects(store.snapshot(), /recovery-conflict/)
  assert.equal(await fs.readFile(resolve(store.treeRoot(tree), 'page.txt'), 'utf8'), 'external')
  assert.ok(await fs.stat(resolve(root, '.runtime.local/workspace/journal.json')))
})
test('closed paths and preconditions deny private, linked, stale and unknown inputs', async (t) => {
  const { store, tree, operation } = await fixture(t)
  for (const file of [
    '../outside.txt',
    '/tmp/outside.txt',
    '.env.local',
    'scripts/file.mjs',
    'src/design-system/components/Button.tsx',
    'loomata/workspace.json',
  ]) {
    const input = operation()
    input.edits[0].file = file
    await assert.rejects(store.apply(tree, input))
  }
  await fs.symlink('/tmp', resolve(store.treeRoot(tree), 'linked'))
  const linked = operation()
  linked.edits[0].file = 'linked/outside.txt'
  await assert.rejects(store.apply(tree, linked))
  const mismatch = operation()
  mismatch.edits[0].before = 'other'
  await assert.rejects(store.apply(tree, mismatch), /file-conflict/)
  await assert.rejects(
    store.apply(tree, { ...operation(), targets: [randomUUID()] }),
    /target-unknown/,
  )
  await assert.rejects(store.apply(tree, { ...operation(), extra: 'unknown' }))
})
const options = (revision, patch = {}) => ({
  revision,
  proofRevision: revision,
  visible: false,
  critical: false,
  mode: 'automatic',
  humanApproved: false,
  e2ePassed: false,
  ...patch,
})
test('commit is distinct from integration and version-specific checks are mandatory', async (t) => {
  const { root, store, tree, operation } = await fixture(t)
  const input = operation(),
    receipt = await store.apply(tree, input)
  const old = await store.git(['rev-parse', 'HEAD'])
  await store.commit(tree, receipt.revision)
  assert.equal(await store.git(['rev-parse', 'HEAD']), old)
  await assert.rejects(store.integrate(tree, options(receipt.revision)), /checks-required/)
  await store.check(tree, input.id, receipt.revision, 'checking')
  await store.check(tree, input.id, receipt.revision, 'failed')
  await assert.rejects(store.integrate(tree, options(receipt.revision)), /checks-required/)
  await store.check(tree, input.id, receipt.revision, 'passed')
  await assert.rejects(
    store.integrate(tree, options(receipt.revision, { visible: true })),
    /human-required/,
  )
  await assert.rejects(
    store.integrate(
      tree,
      options(receipt.revision, { critical: true, mode: 'e2e', e2ePassed: true }),
    ),
    /human-required/,
  )
  await assert.rejects(
    store.integrate(tree, options(receipt.revision, { visible: true, mode: 'e2e' })),
    /e2e-required/,
  )
  await assert.rejects(
    store.integrate(tree, options(receipt.revision, { proofRevision: revision })),
    /proof-obsolete/,
  )
  await store.integrate(tree, options(receipt.revision))
  assert.equal(await fs.readFile(resolve(root, 'page.txt'), 'utf8'), 'after')
  const clone = root + '-clone'
  t.after(() => fs.rm(clone, { recursive: true, force: true }))
  await run('git', ['clone', '--local', root, clone])
  assert.equal(
    JSON.parse(await fs.readFile(resolve(clone, 'loomata/workspace.json'), 'utf8')).revision,
    receipt.revision,
  )
  await assert.rejects(fs.access(resolve(clone, '.runtime.local')))
})
test('Git commit and integration receipts recover after publication interruption', async (t) => {
  for (const phase of ['git-staged', 'git-committed', 'git-integrated']) {
    const { root, store, tree, operation } = await fixture(t)
    const input = operation(),
      receipt = await store.apply(tree, input)
    await store.check(tree, input.id, receipt.revision, 'passed')
    const broken = new WorkspaceStore(root, async (at) => {
      if (at === phase) throw new Error('injected')
    })
    if (phase === 'git-committed' || phase === 'git-staged')
      await assert.rejects(broken.commit(tree, receipt.revision), /injected/)
    else {
      await store.commit(tree, receipt.revision)
      await assert.rejects(broken.integrate(tree, options(receipt.revision)), /injected/)
    }
    await store.snapshot()
    assert.equal((await store.snapshot()).trees[0].revision, receipt.revision)
  }
})
test('concurrent branch and main changes are preserved on integration conflict', async (t) => {
  const { root, store, tree, operation } = await fixture(t)
  const input = operation(),
    receipt = await store.apply(tree, input)
  await store.check(tree, input.id, receipt.revision, 'passed')
  await store.commit(tree, receipt.revision)
  await fs.writeFile(resolve(root, 'page.txt'), 'concurrent main')
  await store.git(['add', '--', 'page.txt'])
  await store.git(['commit', '-m', 'test: concurrent edit'])
  await assert.rejects(store.integrate(tree, options(receipt.revision)), /base-conflict/)
  assert.equal(await fs.readFile(resolve(root, 'page.txt'), 'utf8'), 'concurrent main')
  assert.equal(await fs.readFile(resolve(store.treeRoot(tree), 'page.txt'), 'utf8'), 'after')
})

test('multiple operations invalidate previous proofs and can create then undo a file', async (t) => {
  const { store, tree, operation } = await fixture(t)
  const first = operation(),
    a = await store.apply(tree, first)
  await store.check(tree, first.id, a.revision, 'passed')
  const next = {
    ...operation('second'),
    revision: a.revision,
    edits: [{ file: 'new.txt', before: null, after: 'new content' }],
  }
  const b = await store.apply(tree, next)
  await assert.rejects(store.check(tree, first.id, a.revision, 'passed'), /proof-obsolete/)
  const c = await store.undo(tree, next.id, b.revision)
  await assert.rejects(fs.access(resolve(store.treeRoot(tree), 'new.txt')))
  await store.check(tree, first.id, c.revision, 'passed')
  await store.commit(tree, c.revision)
  await store.integrate(
    tree,
    options(c.revision, { mode: 'human', humanApproved: true, visible: true }),
  )
  assert.equal((await store.checkpoints()).length, 1)
})

test('reconstructs committed model and concrete commit links on a clone with no private state', async (t) => {
  const { root, store, tree, operation } = await fixture(t)
  const input = operation(),
    receipt = await store.apply(tree, input)
  await store.check(tree, input.id, receipt.revision, 'passed')
  const oid = await store.commit(tree, receipt.revision)
  await store.integrate(
    tree,
    options(receipt.revision, { mode: 'e2e', visible: true, e2ePassed: true }),
  )
  const clone = root + '-reconstruction'
  t.after(() => fs.rm(clone, { recursive: true, force: true }))
  await run('git', ['clone', '--local', root, clone])
  const rebuilt = await new WorkspaceStore(clone).reconstruct()
  assert.equal(rebuilt.model.revision, receipt.revision)
  assert.equal(rebuilt.commits[0].gitOid, oid)
  assert.ok(rebuilt.commits[0].modifications.includes(input.id))
  assert.equal(rebuilt.trees.length, 0)
})

test('preview resolves exactly one isolated state and functional conflicts preserve both versions', async (t) => {
  const { root, store, tree, operation } = await fixture(t)
  const second = await store.openTree('workItem')
  const a = operation(),
    b = operation('other work item')
  await store.apply(tree, a)
  const receipt = await store.apply(second, b)
  await store.check(second, b.id, receipt.revision, 'passed')
  await store.commit(second, receipt.revision)
  await store.integrate(second, options(receipt.revision))
  const conflict = await store.conflicts(tree)
  assert.ok(conflict.functional.includes(a.targets[0]))
  await store.select(tree)
  assert.equal((await store.preview()).root, store.treeRoot(tree))
  await store.select(null)
  assert.equal((await store.preview()).root, root)
  await assert.rejects(store.integrate(tree, options(receipt.revision)))
})

test('new Loomata projects bootstrap only the selected public sources', async (t) => {
  const root = await fs.mkdtemp(resolve(parent, 'bootstrap-'))
  t.after(() => fs.rm(root, { recursive: true, force: true }))
  const projectId = randomUUID(),
    target = randomUUID(),
    store = new WorkspaceStore(root)
  await fs.mkdir(resolve(root, 'scripts'))
  await fs.mkdir(resolve(root, '.runtime.local'), { mode: 0o700 })
  await fs.writeFile(resolve(root, '.gitignore'), '*.local\n')
  await fs.writeFile(
    resolve(root, 'loomata.project.json'),
    JSON.stringify({ version: 1, phase: 'created', id: projectId }),
  )
  const files = ['.gitignore', 'scripts/project-files.json']
  for (let i = 0; i < 10; i++) {
    files.push(`source-${i}.txt`)
    await fs.writeFile(resolve(root, files.at(-1)), 'synthetic')
  }
  await fs.writeFile(
    resolve(root, 'scripts/project-files.json'),
    JSON.stringify({ version: 1, files }),
  )
  await fs.writeFile(resolve(root, '.runtime.local/private.txt'), 'synthetic private')
  await store.bootstrap({
    schemaVersion: 1,
    projectId,
    revision,
    entities: [{ id: target, kind: 'page', label: 'Page', revision }],
  })
  assert.ok(await store.git(['show', 'HEAD:loomata/workspace.json']))
  assert.equal((await store.git(['ls-files'])).includes('.runtime.local'), false)
  await assert.rejects(
    store.bootstrap({ schemaVersion: 1, projectId, revision, entities: [] }),
    /already-present/,
  )
})

test('unknown source coverage stays explicit and requires human integration', async (t) => {
  const { store, tree, operation } = await fixture(t)
  const input = operation()
  input.edits = [{ file: 'unmapped.txt', before: null, after: 'unrecognized source' }]
  const receipt = await store.apply(tree, input)
  assert.equal((await store.snapshot()).trees[0].coverage, 'partial')
  await store.check(tree, input.id, receipt.revision, 'passed')
  await store.commit(tree, receipt.revision)
  await assert.rejects(store.integrate(tree, options(receipt.revision)), /coverage-human/)
})

test('source bytes changed after proof cannot be committed under the old revision', async (t) => {
  const { store, tree, operation } = await fixture(t),
    input = operation()
  const receipt = await store.apply(tree, input)
  await store.check(tree, input.id, receipt.revision, 'passed')
  await fs.writeFile(resolve(store.treeRoot(tree), 'page.txt'), 'changed after verification')
  await assert.rejects(store.commit(tree, receipt.revision), /file-conflict/)
  const snapshot = await store.snapshot()
  assert.equal(snapshot.trees[0].coverage, 'partial')
  assert.equal(snapshot.trees[0].operations[0].state, 'applied')
})

test('bootstrap never overwrites an existing public trace, including a partial installation', async (t) => {
  const root = await fs.mkdtemp(resolve(parent, 'existing-trace-'))
  t.after(() => fs.rm(root, { recursive: true, force: true }))
  const projectId = randomUUID(),
    store = new WorkspaceStore(root)
  await fs.writeFile(
    resolve(root, 'loomata.project.json'),
    JSON.stringify({ version: 1, phase: 'created', id: projectId }),
  )
  await fs.mkdir(resolve(root, 'loomata'))
  await fs.writeFile(resolve(root, 'loomata/workspace.json'), 'existing user trace')
  await assert.rejects(
    store.bootstrap({ schemaVersion: 1, projectId, revision, entities: [] }),
    /existing-trace/,
  )
  assert.equal(
    await fs.readFile(resolve(root, 'loomata/workspace.json'), 'utf8'),
    'existing user trace',
  )
  await assert.rejects(fs.access(resolve(root, '.git')))
})

test('commit grouping preserves existing work items and many-to-many task links across commits', async (t) => {
  const { root, store, tree, target } = await fixture(t)
  const [requestA, requestB, taskA, taskB, groupA, groupB] = Array.from({ length: 6 }, () =>
    randomUUID(),
  )
  const base = (id, label) => ({ id, label, revision })
  const entities = [
    ...(await store.state()).trees[0].model.entities,
    { ...base(requestA, 'Request A'), kind: 'request' },
    { ...base(requestB, 'Request B'), kind: 'request' },
    { ...base(taskA, 'Task A'), kind: 'task', requestIds: [requestA, requestB] },
    { ...base(taskB, 'Task B'), kind: 'task', requestIds: [requestA] },
    {
      ...base(groupA, 'Existing group A'),
      kind: 'workItem',
      taskIds: [taskA],
      commitIds: [],
      state: 'pending',
    },
    {
      ...base(groupB, 'Existing group B'),
      kind: 'workItem',
      taskIds: [taskB],
      commitIds: [],
      state: 'pending',
    },
  ]
  const meta = await store.apply(tree, {
    id: randomUUID(),
    revision,
    origin: 'inspector',
    targets: [target],
    entities,
    edits: [],
  })
  const change = randomUUID()
  const first = await store.apply(tree, {
    id: change,
    revision: meta.revision,
    origin: 'codex',
    targets: [target],
    taskIds: [taskA, taskB],
    edits: [{ file: 'page.txt', before: 'before', after: 'first' }],
  })
  await store.check(tree, change, first.revision, 'passed')
  await store.commit(tree, first.revision)
  await store.integrate(tree, options(first.revision))
  const next = await store.openTree('draft'),
    secondChange = randomUUID()
  const second = await store.apply(next, {
    id: secondChange,
    revision: first.revision,
    origin: 'codex',
    targets: [target],
    taskIds: [taskA],
    edits: [{ file: 'page.txt', before: 'first', after: 'second' }],
  })
  await store.check(next, secondChange, second.revision, 'passed')
  await store.commit(next, second.revision)
  await store.integrate(next, options(second.revision))
  const checkpoints = await store.checkpoints()
  assert.equal(checkpoints.length, 2)
  assert.equal(checkpoints.filter((entry) => entry.workItemIds.includes(groupA)).length, 2)
  assert.equal(checkpoints.filter((entry) => entry.workItemIds.includes(groupB)).length, 1)
  for (const entry of checkpoints)
    assert.ok(
      !Number.isNaN(Date.parse(await store.git(['log', '-1', '--format=%cI', entry.gitOid]))),
    )
  const saved = JSON.parse(await fs.readFile(resolve(root, 'loomata/workspace.json'), 'utf8'))
  assert.equal(saved.entities.filter((e) => e.kind === 'task').length, 2)
  assert.deepEqual(saved.entities.find((e) => e.id === taskA).requestIds, [requestA, requestB])
})
