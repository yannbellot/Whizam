import test from 'node:test'
import assert from 'node:assert/strict'
import * as fs from 'node:fs/promises'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { editorFixture } from './helpers/editor-fixture.mjs'
import { prepareEditorArtifacts } from '../scripts/editor-artifacts.mjs'
import {
  documentationPaths,
  renderEditorDocumentation,
  markdownText,
} from '../scripts/editor-documentation.mjs'
import { generateEditorTokenArtifacts } from '../src/design-system/token-resolution.ts'
import { applyRequest } from '../src/design-system/editor/operations.ts'
import { createStore } from '../scripts/design-editor/store.mjs'

const root = path.resolve(import.meta.dirname, '..')
const target = 'component.button.default.root.background.default'
const artifacts = (snapshot) =>
  generateEditorTokenArtifacts(snapshot.model, snapshot.contract, snapshot.legacy)
const render = (snapshot) => renderEditorDocumentation(snapshot, artifacts(snapshot))

test('catalogue is exhaustive and deterministic; inventory uses the shared resolved values', async () => {
  const { snapshot, outputs } = await prepareEditorArtifacts(root)
  assert.deepEqual(outputs, (await prepareEditorArtifacts(root)).outputs)
  const [catalogue, inventory] = render(snapshot)
  for (const category of snapshot.catalog.categories) {
    assert(catalogue.includes(category.id))
    for (const intention of category.intentions)
      assert(catalogue.includes(`${category.id}.${intention.id}`))
  }
  for (const item of [...snapshot.model.styles, ...snapshot.model.bindings, ...snapshot.legacy])
    assert(inventory.includes(item.id))
  for (const style of artifacts(snapshot).styles)
    assert(inventory.includes(markdownText(style.value)))
  assert(inventory.includes('pas les exemplaires DOM'))
  assert(!inventory.includes(root))
})

test('catalogue, labels, provenance and inventory warnings cannot inject Markdown/HTML/MDX', async () => {
  const { snapshot } = await prepareEditorArtifacts(root)
  const payload =
    '<img src=x onerror=alert(1)> [clic](javascript:alert(1)) {process.exit()} `x` | **texte**'
  snapshot.catalog.categories[0].label = payload
  snapshot.catalog.categories[0].intentions[0].definition = payload
  snapshot.presentation.button.label = payload
  snapshot.model.primitives[0].provenance.reason = payload
  snapshot.inventoryIssues.push(payload)
  snapshot.catalog.taxonomy.vocabulary[0].definition = payload
  const documents = render(snapshot)
  for (const document of documents) {
    assert(!document.includes('<img'))
    assert(!document.includes('[clic]'))
    assert(!document.includes('{process.exit()}'))
    assert(document.includes('&#60;img'))
  }
})

test('inventory preserves attribution under an exception and follows the current style after restore', async () => {
  const { snapshot } = await prepareEditorArtifacts(root)
  const style = snapshot.model.bindings.find((item) => item.id === target).style
  const change = (operations) => {
    const next = applyRequest(snapshot, {
      protocolVersion: 4,
      requestId: randomUUID(),
      baseRevision: 'a'.repeat(64),
      operations,
    })
    snapshot.model = next.model
  }
  change([{ kind: 'set-component-token', target, value: '#123456' }])
  change([{ kind: 'update-shared', style, value: '#345678' }])
  let row = render(snapshot)[1]
    .split('\n')
    .find((line) => line.startsWith(`| ${target} |`))
  assert(row.includes(style) && row.includes('&#35;123456') && row.includes('&#35;345678'))
  change([{ kind: 'restore', target }])
  row = render(snapshot)[1]
    .split('\n')
    .find((line) => line.startsWith(`| ${target} |`))
  assert(row.includes('Aucune') && row.includes('&#35;345678') && !row.includes('&#35;123456'))
  snapshot.inventoryIssues = ['Consommation non identifiée : fixture']
  assert(render(snapshot)[1].includes(markdownText(snapshot.inventoryIssues[0])))
})

test('documentation check refuses absent/stale documents without rewriting and works from another cwd', async () => {
  const fixture = await editorFixture()
  try {
    await fs.symlink(path.join(root, 'node_modules'), path.join(fixture, 'node_modules'), 'dir')
    const file = path.join(fixture, documentationPaths[0])
    const before = await fs.stat(file)
    const run = () =>
      spawnSync(
        process.execPath,
        [path.join(fixture, 'scripts/generate-tokens.mjs'), '--check-docs'],
        { cwd: root, encoding: 'utf8' },
      )
    assert.equal(run().status, 0)
    assert.equal((await fs.stat(file)).mtimeMs, before.mtimeMs)
    await fs.writeFile(file, 'stale fixture')
    assert.notEqual(run().status, 0)
    assert.equal(await fs.readFile(file, 'utf8'), 'stale fixture')
    await fs.unlink(file)
    assert.notEqual(run().status, 0)
    await assert.rejects(fs.stat(file), { code: 'ENOENT' })
  } finally {
    await fs.rm(fixture, { recursive: true, force: true })
  }
})

test('saved creation and reuse regenerate documents; a changed renderer cannot report saved', async () => {
  const fixture = await editorFixture()
  let store
  try {
    store = await createStore(fixture)
    const save = async (operations) =>
      store.save({
        protocolVersion: 4,
        requestId: randomUUID(),
        baseRevision: (await store.snapshot()).revision,
        operations,
      })
    assert.equal(
      (
        await save([
          { kind: 'create-and-assign', target, intention: 'actions.recovery', value: '#123456' },
        ])
      ).status,
      'saved',
    )
    let snapshot = (await store.snapshot()).snapshot
    const style = snapshot.model.bindings.find((item) => item.id === target).style
    assert.equal((await save([{ kind: 'assign', target, style }])).status, 'saved')
    snapshot = (await store.snapshot()).snapshot
    for (const [index, text] of render(snapshot).entries())
      assert.equal(await fs.readFile(path.join(fixture, documentationPaths[index]), 'utf8'), text)
    const before = await fs.readFile(path.join(fixture, documentationPaths[1]))
    // A generator dependency changed: immutable manifest refusal, before any publication.
    await fs.appendFile(
      path.join(fixture, 'scripts/editor-documentation.mjs'),
      '\nthrow new Error("fixture-render-failure")\n',
    )
    await assert.rejects(
      store.save({
        protocolVersion: 4,
        requestId: randomUUID(),
        baseRevision: 'a'.repeat(64),
        operations: [{ kind: 'restore', target }],
      }),
      /service-unavailable/,
    )
    assert.deepEqual(await fs.readFile(path.join(fixture, documentationPaths[1])), before)
    await fs.symlink(path.join(root, 'node_modules'), path.join(fixture, 'node_modules'), 'dir')
    const result = spawnSync(
      process.execPath,
      [path.join(fixture, 'scripts/generate-tokens.mjs')],
      { cwd: root, encoding: 'utf8' },
    )
    assert.notEqual(result.status, 0)
    assert(result.stderr.includes('fixture-render-failure'))
    assert.deepEqual(await fs.readFile(path.join(fixture, documentationPaths[1])), before)
  } finally {
    if (store) await store.close()
    await fs.rm(fixture, { recursive: true, force: true })
  }
})
