import test from 'node:test'
import assert from 'node:assert/strict'
import * as fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { randomUUID } from 'node:crypto'
import {
  manifestPaths,
  sourcePaths,
  compositionPath,
  variantsPath,
  tokenPath,
} from '../scripts/design-editor/manifest.mjs'
import { createStore, stateName } from '../scripts/design-editor/store.mjs'
import { prepareEditorArtifacts, derivedPaths } from '../scripts/editor-artifacts.mjs'
import { parseBounded } from '../scripts/design-editor/parsing.mjs'
import { readTokens, buildTokenDocument } from '../scripts/dtcg-tokens.mjs'
import { styleId } from '../src/design-system/editor/contract.ts'
const root = fileURLToPath(new URL('..', import.meta.url))
const target = 'component.button.default.root.background.default'
async function fixture(run) {
  const parent = path.join(root, '.runtime.local', 'tmp')
  await fs.mkdir(parent, { recursive: true })
  const directory = await fs.mkdtemp(path.join(parent, 'design-editor-store-'))
  const stores = []
  try {
    for (const file of manifestPaths) {
      await fs.mkdir(path.dirname(path.join(directory, file)), { recursive: true })
      await fs.copyFile(path.join(root, file), path.join(directory, file))
    }
    const { outputs } = await prepareEditorArtifacts(directory)
    for (const [file, bytes] of outputs) {
      await fs.mkdir(path.dirname(path.join(directory, file)), { recursive: true })
      await fs.writeFile(path.join(directory, file), bytes)
    }
    const open = async (options) => {
      const store = await createStore(directory, options)
      stores.push(store)
      return store
    }
    await run(directory, open)
  } finally {
    for (const store of stores.reverse()) await store.close()
    await fs.rm(directory, { recursive: true, force: true })
  }
}
const request = (revision) => ({
  protocolVersion: 4,
  requestId: randomUUID(),
  baseRevision: revision,
  operations: [{ kind: 'set-component-token', target, value: '#123456' }],
})
test('non-semantic attribution persists in DTCG and restores the current shared convention', () =>
  fixture(async (directory, open) => {
    const file = path.join(directory, tokenPath)
    const document = JSON.parse(await fs.readFile(file, 'utf8'))
    const definition = {
      type: 'dimension',
      intention: 'scale.compact',
      role: 'radius',
      state: 'default',
    }
    const id = styleId(definition)
    const records = readTokens(document).entries.map((entry) => ({
      type: entry.type,
      value: entry.node.$value,
      reference: entry.reference,
      meta: entry.meta,
      deprecated: entry.node.$deprecated,
    }))
    records.push({
      type: 'dimension',
      reference: 'primitive.radius.rem-0-5',
      meta: {
        id,
        kind: 'decision',
        collection: 'editor',
        classification: 'non-semantic',
        justification: 'Échelle compacte explicite, fixture de persistance isolée.',
        editor: definition,
        order: 17,
      },
    })
    await fs.writeFile(file, JSON.stringify(buildTokenDocument(records), null, 2) + '\n')
    for (const [relative, bytes] of (await prepareEditorArtifacts(directory)).outputs)
      await fs.writeFile(path.join(directory, relative), bytes)
    let store = await open()
    const body = request((await store.snapshot()).revision)
    const radius = 'component.button.default.root.border-radius.default'
    body.operations = [
      { kind: 'assign', target: radius, style: id },
      { kind: 'update-shared', style: id, value: '1rem' },
      { kind: 'set-component-token', target: radius, value: '2rem' },
    ]
    assert.equal((await store.save(body)).status, 'saved')
    await store.close()
    store = await open()
    const initial = await store.snapshot()
    assert.equal(
      initial.snapshot.model.styles.find((style) => style.id === id).classification,
      'non-semantic',
    )
    const restore = request(initial.revision)
    restore.operations = [{ kind: 'restore', target: radius }]
    assert.equal((await store.save(restore)).status, 'saved')
    const loaded = await store.snapshot()
    assert.equal(
      loaded.snapshot.model.bindings.find((binding) => binding.id === radius).reference,
      id,
    )
    const parsed = readTokens(JSON.parse(await fs.readFile(file, 'utf8')))
    assert.equal(parsed.ids.get(id).meta.classification, 'non-semantic')
    assert.equal(parsed.ids.get(id).value.value, 1)
    assert(
      !(
        'bindings' in
        parseBounded(
          (
            await fs.readFile(
              path.join(directory, 'src/design-system/components/Button/Button.design.yaml'),
            )
          ).toString(),
        ).toJSON()
      ),
    )
  }))
test('store saves actual sources, rereads generation, retains provenance and durable idempotent receipts', () =>
  fixture(async (directory, open) => {
    let store = await open()
    const initial = await store.snapshot(),
      body = request(initial.revision)
    const old = await fs.readFile(path.join(directory, tokenPath), 'utf8')
    const saved = await store.save(body)
    assert.equal(saved.status, 'saved')
    const loaded = await store.snapshot()
    assert.equal(loaded.revision, saved.revision)
    const binding = loaded.snapshot.model.bindings.find((item) => item.id === target)
    assert.equal(binding.provenance.kind, 'designer-edit')
    assert.equal(
      loaded.snapshot.model.primitives.find((item) => item.id === binding.reference).value,
      '#123456',
    )
    assert.notEqual(await fs.readFile(path.join(directory, tokenPath), 'utf8'), old)
    assert.deepEqual(
      loaded.snapshot.model.bindings.filter((item) => item.id !== target),
      initial.snapshot.model.bindings.filter((item) => item.id !== target),
    )
    assert.deepEqual(await store.save(body), saved)
    assert.equal(
      (await store.save({ ...body, operations: [{ kind: 'restore', target }] })).issues[0].code,
      'request-id-reused',
    )
    await store.close()
    store = await open()
    assert.deepEqual(await store.save(body), saved)
    assert.deepEqual(await store.status(body.requestId), saved)
    assert.equal((await store.save(request(initial.revision))).status, 'conflict')
  }))
test('second owner is refused and a stale concurrent request conflicts', () =>
  fixture(async (directory, open) => {
    const store = await open()
    await assert.rejects(createStore(directory), /service-unavailable/)
    const { revision } = await store.snapshot()
    const results = await Promise.all([
      store.save(request(revision)),
      store.save(request(revision)),
    ])
    assert.deepEqual(
      results.map((item) => item.status),
      ['saved', 'conflict'],
    )
  }))
test('read dependencies changed during preparation reject before any source replacement', () =>
  fixture(async (directory, open) => {
    let changed = false
    const store = await open({
      fault: async (point) => {
        if (point === 'before-prepared' && !changed) {
          changed = true
          await fs.appendFile(
            path.join(directory, 'src/design-system/components/Button/Button.module.css'),
            '\n/* fixture */\n',
          )
        }
      },
    })
    const { revision } = await store.snapshot(),
      before = await fs.readFile(path.join(directory, tokenPath))
    assert.equal((await store.save(request(revision))).status, 'conflict')
    assert.deepEqual(await fs.readFile(path.join(directory, tokenPath)), before)
  }))
for (const point of [
  'pending',
  'before-prepared',
  'prepared',
  'before-replace',
  'after-replace',
  'after-progress',
  'before-committed',
  'after-committed',
])
  test(`restart handles injected interruption at ${point}`, () =>
    fixture(async (directory, open) => {
      let fired = false
      const store = await open({
        fault: async (phase) => {
          if (!fired && phase === point) {
            fired = true
            throw new Error('fixture interruption')
          }
        },
      })
      const body = request((await store.snapshot()).revision),
        result = await store.save(body)
      assert(fired)
      assert.notEqual(result.status, 'saved')
      await store.close()
      const restarted = await open()
      const receipt = await restarted.status(body.requestId)
      assert.equal(
        receipt.status,
        ['pending', 'before-prepared'].includes(point) ? 'failed' : 'saved',
      )
      if (receipt.status === 'saved') assert.deepEqual(await restarted.save(body), receipt)
      await restarted.snapshot()
    }))
test('unrecognised edit after partial replacement blocks recovery and preserves all versions', () =>
  fixture(async (directory, open) => {
    let fired = false
    const store = await open({
      fault: async (phase) => {
        if (!fired && phase === 'after-replace') {
          fired = true
          throw new Error('fixture')
        }
      },
    })
    const body = request((await store.snapshot()).revision)
    assert.equal((await store.save(body)).status, 'recovery-required')
    await store.close()
    const file = path.join(directory, tokenPath)
    await fs.appendFile(file, '\n# more recent external version\n')
    const newer = await fs.readFile(file)
    await assert.rejects(open(), /recovery-required|revision-conflict/)
    assert.deepEqual(await fs.readFile(file), newer)
    assert((await fs.readdir(path.join(directory, stateName, 'records'))).length === 1)
  }))
test('symlink and hardlink dependencies refuse writing and keep sentinel unchanged', () =>
  fixture(async (directory, open) => {
    const sentinel = path.join(directory, 'sentinel')
    await fs.writeFile(sentinel, 'private fixture')
    const file = path.join(directory, 'src/design-system/components/Button/Button.module.css'),
      original = await fs.readFile(file)
    await fs.unlink(file)
    await fs.symlink(sentinel, file)
    await assert.rejects(open(), /forbidden/)
    assert.equal(await fs.readFile(sentinel, 'utf8'), 'private fixture')
    await fs.unlink(file)
    await fs.writeFile(file, original)
    await fs.link(file, path.join(directory, 'second-link'))
    await assert.rejects(open(), /forbidden/)
  }))
test('parsers reject duplicate, anchored, tagged, deep and non-JSON values', () => {
  for (const text of ['{"a":1,"a":2}', '{"a":1e309}', '{a: 1}', '{"a":NaN}'])
    assert.throws(() => parseBounded(text, { format: 'json', depth: 16 }))
  for (const text of ['a: &x 1\nb: *x', 'a: !custom value']) assert.throws(() => parseBounded(text))
  assert.throws(() =>
    parseBounded(JSON.stringify({ a: { b: { c: 1 } } }), { format: 'json', depth: 2 }),
  )
  assert.deepEqual(parseBounded('{"a":1}', { format: 'json' }), { a: 1 })
})

test('explicit cancellation restores recognised preimages and retains an unsuccessful receipt', () =>
  fixture(async (directory, open) => {
    const store = await open({
      fault: async (phase) => {
        if (phase === 'after-replace') throw new Error('fixture')
      },
    })
    const initial = await store.snapshot(),
      body = request(initial.revision)
    assert.equal((await store.save(body)).status, 'recovery-required')
    await store.close()
    const cancelled = await open({ cancelRequest: body.requestId })
    assert.equal((await cancelled.snapshot()).revision, initial.revision)
    assert.equal((await cancelled.status(body.requestId)).status, 'failed')
    assert.equal((await cancelled.save(body)).status, 'failed')
    assert(
      (
        await fs.readFile(
          path.join(directory, stateName, 'transactions', body.requestId, 'original.json'),
        )
      ).length > 0,
    )
  }))
test('failed validation and revision conflicts also reserve request identities durably', () =>
  fixture(async (directory, open) => {
    const store = await open(),
      body = request((await store.snapshot()).revision)
    body.operations = [
      { kind: 'create-and-assign', target, intention: 'actions.primary', value: '#1d4ed8' },
    ]
    const invalid = await store.save(body)
    assert.equal(invalid.status, 'invalid')
    assert.equal(invalid.issues[0].code, 'style-exists')
    assert.deepEqual(await store.save(body), invalid)
    assert.equal(
      (await store.save({ ...body, operations: [{ kind: 'restore', target }] })).issues[0].code,
      'request-id-reused',
    )
  }))
test('journal flush and directory flush failures never acknowledge saved', () =>
  fixture(async (directory, open) => {
    const { durableReplace, syncDir } = await import('../scripts/design-editor/files.mjs')
    let flag = false,
      once = false
    let store = await open({
      io: {
        durableReplace: async (root, file, bytes, mode) => {
          if (
            flag &&
            !once &&
            file.includes('/records/') &&
            JSON.parse(bytes).phase === 'prepared'
          ) {
            once = true
            throw Object.assign(new Error('fixture ENOSPC'), { code: 'ENOSPC' })
          }
          return durableReplace(root, file, bytes, mode)
        },
      },
    })
    let body = request((await store.snapshot()).revision)
    flag = true
    assert.notEqual((await store.save(body)).status, 'saved')
    await store.close()
    let failFlush = false
    store = await open({
      fault: async (phase) => {
        if (phase === 'before-replace') failFlush = true
      },
      io: {
        syncDir: async (directory) => {
          if (failFlush && directory.endsWith('/authority')) {
            failFlush = false
            throw new Error('fixture directory flush failure')
          }
          return syncDir(directory)
        },
      },
    })
    body = request((await store.snapshot()).revision)
    assert.equal((await store.save(body)).status, 'recovery-required')
    await store.close()
    store = await open()
    assert.equal((await store.status(body.requestId)).status, 'saved')
  }))
// Sources modifiées par ce scénario et tous les dérivés, y compris les documents.
// Les imports Figma restent byte-identiques ici et ne sont pas remplacés.
for (const phase of ['before-replace', 'after-replace', 'after-progress'])
  for (
    let index = 0;
    index <
    sourcePaths.filter(
      (file) =>
        ![
          compositionPath,
          variantsPath,
          'app/loomata-imports.json',
          'app/loomata-imports.css',
        ].includes(file),
    ).length +
      derivedPaths.length;
    index++
  )
    test(`${phase} at file ${index} recovers exactly once`, () =>
      fixture(async (directory, open) => {
        // Catalogue normally stays byte-identical during a value save. Make its
        // derived preimage stale to exercise its replacement and recovery too.
        await fs.appendFile(
          path.join(directory, 'docs/design-system/semantic-catalog.md'),
          '\nStale fixture\n',
        )
        // The project theme contains references, so value-only changes leave it identical.
        // Stale this derivative explicitly to exercise its real replacement/recovery too.
        await fs.appendFile(
          path.join(directory, 'src/styles/project-theme.generated.css'),
          '\n/* Stale theme fixture */\n',
        )
        const store = await open({
          fault: async (point, current) => {
            if (point === phase && current === index) throw new Error('fixture interruption')
          },
        })
        const initial = await store.snapshot(),
          body = request(initial.revision)
        body.operations = [
          {
            kind: 'define-and-assign',
            target,
            value: '#123456',
            definition: {
              category: 'actions',
              id: 'reconciliation',
              label: 'Réconciliation',
              definition: 'Réconcilier les versions concurrentes.',
              examples: ['Réconcilier un document'],
              synonyms: ['Réconcilier les versions'],
            },
          },
          ...['foundations', 'field', 'select-field', 'notice', 'panel'].map((name) => ({
            kind: 'set-component-token',
            target: initial.snapshot.model.bindings.find(
              (binding) =>
                binding.target === name &&
                binding.property === 'background' &&
                binding.state === 'default',
            ).id,
            value: '#123456',
          })),
        ]
        assert.equal((await store.save(body)).status, 'recovery-required')
        await store.close()
        const restarted = await open(),
          receipt = await restarted.status(body.requestId)
        assert.equal(receipt.status, 'saved')
        assert.deepEqual(await restarted.save(body), receipt)
        const { outputs } = await prepareEditorArtifacts(directory)
        for (const file of derivedPaths)
          assert.deepEqual(await fs.readFile(path.join(directory, file)), outputs.get(file))
      }))

test('participating readers block a save and an active transaction blocks new readers', () =>
  fixture(async (directory, open) => {
    const { withEditorRead } = await import('../scripts/editor-reader.mjs')
    const store = await open(),
      initial = await store.snapshot()
    await withEditorRead(directory, async () =>
      assert.equal((await store.save(request(initial.revision))).status, 'failed'),
    )
    assert.equal((await store.snapshot()).revision, initial.revision)
    await store.close()
    let checked = false
    const writer = await open({
      fault: async (phase) => {
        if (phase === 'prepared') {
          checked = true
          await assert.rejects(
            withEditorRead(directory, async () => assert.fail('partial generation exposed')),
            /recovery-required/,
          )
        }
      },
    })
    assert.equal((await writer.save(request(initial.revision))).status, 'saved')
    assert(checked)
  }))
test('cancellation interrupted after a restoration resumes without reversing twice', () =>
  fixture(async (directory, open) => {
    let store = await open({
      fault: async (phase) => {
        if (phase === 'before-committed') throw new Error('fixture')
      },
    })
    const initial = await store.snapshot(),
      body = request(initial.revision)
    assert.equal((await store.save(body)).status, 'recovery-required')
    await store.close()
    await assert.rejects(
      open({
        cancelRequest: body.requestId,
        fault: async (phase) => {
          if (phase === 'after-replace') throw new Error('fixture cancellation interruption')
        },
      }),
      /fixture cancellation interruption/,
    )
    store = await open({ cancelRequest: body.requestId })
    assert.equal((await store.snapshot()).revision, initial.revision)
    assert.equal((await store.status(body.requestId)).status, 'failed')
  }))
for (const phase of ['prepared', 'after-replace'])
  test(`real SIGKILL at ${phase} retains a dead owner and recovers once`, () =>
    fixture(async (directory, open) => {
      const { spawn } = await import('node:child_process')
      const store = await open(),
        body = request((await store.snapshot()).revision)
      body.operations = [
        {
          kind: 'define-and-assign',
          target,
          value: '#123456',
          definition: {
            category: 'actions',
            id: 'reconciliation',
            label: 'Réconciliation',
            definition: 'Réconcilier les versions concurrentes.',
            examples: ['Réconcilier un document'],
            synonyms: ['Réconcilier les versions'],
          },
        },
      ]
      await store.close()
      const script = `import {createStore} from ${JSON.stringify(new URL('../scripts/design-editor/store.mjs', import.meta.url).href)};const store=await createStore(${JSON.stringify(directory)},{fault:async point=>{if(point===${JSON.stringify(phase)}){process.send('ready');await new Promise(()=>{setInterval(()=>{},1000)})}}});await store.save(${JSON.stringify(body)})`
      const child = spawn(process.execPath, ['--input-type=module', '-e', script], {
        stdio: ['ignore', 'pipe', 'pipe', 'ipc'],
      })
      let stderr = ''
      child.stderr.on('data', (chunk) => (stderr += chunk))
      try {
        await new Promise((resolve, reject) => {
          child.once('message', resolve)
          child.once('exit', () => reject(new Error(stderr || 'child exited early')))
          setTimeout(() => reject(new Error('child timeout')), 10000).unref()
        })
        child.kill('SIGKILL')
        await new Promise((resolve) => child.once('exit', resolve))
      } finally {
        if (child.exitCode === null) child.kill('SIGKILL')
      }
      assert.equal(stderr, '')
      const restarted = await open()
      assert.equal((await restarted.status(body.requestId)).status, 'saved')
      assert.deepEqual(await restarted.save(body), await restarted.status(body.requestId))
      const recovered = await restarted.snapshot()
      assert(
        recovered.snapshot.catalog.categories
          .find((c) => c.id === 'actions')
          .intentions.some((i) => i.id === 'reconciliation'),
      )
      assert.equal(
        recovered.snapshot.model.bindings.find((b) => b.id === target).reference,
        'semantic.color.action.reconciliation.background.default',
      )
    }))
test('identical bytes at a replaced dependency inode are refused', () =>
  fixture(async (directory, open) => {
    const dependency = path.join(directory, 'src/design-system/components/Button/Button.module.css')
    const store = await open({
      fault: async (phase) => {
        if (phase === 'before-prepared') {
          const bytes = await fs.readFile(dependency)
          await fs.rename(dependency, dependency + '.previous')
          await fs.writeFile(dependency, bytes)
        }
      },
    })
    assert.equal((await store.save(request((await store.snapshot()).revision))).status, 'conflict')
  }))

test('corrupt journal paths and a changed directory mode block recovery without restoring', () =>
  fixture(async (directory, open) => {
    const store = await open({
      fault: async (phase) => {
        if (phase === 'prepared') throw new Error('fixture')
      },
    })
    const body = request((await store.snapshot()).revision)
    assert.equal((await store.save(body)).status, 'recovery-required')
    await store.close()
    const journal = path.join(directory, stateName, 'records', body.requestId + '.json'),
      bytes = await fs.readFile(journal),
      record = JSON.parse(bytes)
    record.changes[0].file = '../sentinel'
    await fs.writeFile(journal, JSON.stringify(record))
    await assert.rejects(open())
    await fs.writeFile(journal, bytes)
    const dependency = path.join(directory, 'src/design-system/authority'),
      mode = (await fs.stat(dependency)).mode & 0o777
    await fs.chmod(dependency, 0o500)
    try {
      await assert.rejects(open(), /revision-conflict|recovery-required/)
      assert.equal((await fs.stat(dependency)).mode & 0o777, 0o500)
    } finally {
      await fs.chmod(dependency, mode)
    }
  }))

test('restart clears a failed preparation marker only when sources still match', () =>
  fixture(async (directory, open) => {
    let store = await open({
      fault: async (phase) => {
        if (phase === 'pending') throw new Error('fixture')
      },
    })
    const initial = await store.snapshot(),
      body = request(initial.revision)
    assert.equal((await store.save(body)).status, 'failed')
    await store.close()
    await fs.writeFile(
      path.join(directory, stateName, 'active'),
      JSON.stringify({ requestId: body.requestId }),
      { mode: 0o600 },
    )
    store = await open()
    assert.equal((await store.snapshot()).revision, initial.revision)
    assert.equal((await store.status(body.requestId)).status, 'failed')
  }))

test('cancellation rejects unknown and already committed identities before resuming any transaction', () =>
  fixture(async (directory, open) => {
    let store = await open({
      fault: async (phase) => {
        if (phase === 'after-replace') throw new Error('fixture')
      },
    })
    const initial = await store.snapshot(),
      failed = request(initial.revision)
    failed.operations = [
      { kind: 'create-and-assign', target, intention: 'actions.primary', value: '#1d4ed8' },
    ]
    assert.equal((await store.save(failed)).status, 'invalid')
    const body = request(initial.revision)
    assert.equal((await store.save(body)).status, 'recovery-required')
    await store.close()
    const file = path.join(directory, tokenPath),
      partial = await fs.readFile(file)
    await assert.rejects(open({ cancelRequest: randomUUID() }), /unknown-reference/)
    await assert.rejects(open({ cancelRequest: failed.requestId }), /forbidden/)
    assert.deepEqual(await fs.readFile(file), partial)
    const record = JSON.parse(
      await fs.readFile(path.join(directory, stateName, 'records', body.requestId + '.json')),
    )
    assert.equal(record.phase, 'prepared')
    store = await open()
    assert.equal((await store.status(body.requestId)).status, 'saved')
    await store.close()
    const saved = await fs.readFile(file)
    await assert.rejects(open({ cancelRequest: body.requestId }), /forbidden/)
    assert.deepEqual(await fs.readFile(file), saved)
  }))

test('standalone style persists without binding mutation and supports a later explicit assignment', () =>
  fixture(async (directory, open) => {
    let store = await open()
    const initial = await store.snapshot()
    const id = 'semantic.color.action.recovery.background.default'
    const body = {
      ...request(initial.revision),
      operations: [{ kind: 'create-style', target, intention: 'actions.recovery', value: '#abc' }],
    }
    const saved = await store.save(body)
    assert.equal(saved.status, 'saved')
    assert.deepEqual(
      (await store.snapshot()).snapshot.model.bindings,
      initial.snapshot.model.bindings,
    )
    await store.close()
    store = await open()
    const loaded = await store.snapshot()
    assert(loaded.snapshot.model.styles.some((item) => item.id === id))
    assert.deepEqual(await store.save(body), saved)
    const assign = await store.save({
      ...request(loaded.revision),
      operations: [{ kind: 'assign', target, style: id }],
    })
    assert.equal(assign.status, 'saved')
    assert.equal(
      (await store.snapshot()).snapshot.model.bindings.find((item) => item.id === target).style,
      id,
    )
    const { revision } = await store.snapshot()
    const mixedId = 'semantic.color.action.constructive.background.default'
    const mixed = await store.save({
      ...request(revision),
      operations: [
        { kind: 'create-style', target, intention: 'actions.constructive', value: '#123456' },
        { kind: 'assign', target, style: mixedId },
      ],
    })
    assert.equal(mixed.status, 'saved')
    assert.equal(
      (await store.snapshot()).snapshot.model.bindings.find((item) => item.id === target).style,
      mixedId,
    )
  }))

test('standalone creation recovers after a partial replacement without acquiring an attribution', () =>
  fixture(async (directory, open) => {
    const store = await open({
      fault: async (phase) => {
        if (phase === 'after-replace') throw new Error('fixture interruption')
      },
    })
    const initial = await store.snapshot()
    const body = {
      ...request(initial.revision),
      operations: [
        { kind: 'create-style', target, intention: 'actions.recovery', value: '#123456' },
      ],
    }
    assert.equal((await store.save(body)).status, 'recovery-required')
    await store.close()
    const restarted = await open()
    const receipt = await restarted.status(body.requestId)
    assert.equal(receipt.status, 'saved')
    assert.deepEqual(await restarted.save(body), receipt)
    assert.deepEqual(
      (await restarted.snapshot()).snapshot.model.bindings,
      initial.snapshot.model.bindings,
    )
  }))

for (const interrupt of [false, true]) {
  test(`new semantic intention is atomic with its token and attribution, including recovery (${interrupt})`, () =>
    fixture(async (directory, open) => {
      let fired = false
      let store = await open({
        fault: async (phase) => {
          if (interrupt && !fired && phase === 'after-replace') {
            fired = true
            throw new Error('semantic intention interruption')
          }
        },
      })
      const initial = await store.snapshot()
      const definition = {
        category: 'actions',
        id: 'reconciliation',
        label: 'Réconciliation',
        definition: 'Réconcilier des versions concurrentes de documents.',
        examples: ['Réconcilier un document'],
        synonyms: ['Réconcilier les versions'],
      }
      const body = {
        protocolVersion: 4,
        requestId: randomUUID(),
        baseRevision: initial.revision,
        operations: [{ kind: 'define-and-assign', target, value: '#123456', definition }],
      }
      const response = await store.save(body)
      if (interrupt) {
        assert.notEqual(response.status, 'saved')
        await store.close()
        store = await open()
      } else assert.equal(response.status, 'saved')
      const loaded = await store.snapshot()
      assert(
        loaded.snapshot.catalog.categories
          .find((c) => c.id === 'actions')
          .intentions.some((i) => i.id === 'reconciliation'),
      )
      const binding = loaded.snapshot.model.bindings.find((b) => b.id === target)
      assert.equal(binding.reference, 'semantic.color.action.reconciliation.background.default')
      assert.equal(loaded.snapshot.model.bindings.length, initial.snapshot.model.bindings.length)
      const receipt = await store.status(body.requestId)
      assert.equal(receipt.status, 'saved')
      assert.deepEqual(await store.save(body), receipt)
      assert.equal(
        (await store.save({ ...body, requestId: randomUUID(), baseRevision: loaded.revision }))
          .status,
        'invalid',
      )
    }))
}
