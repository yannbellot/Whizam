import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { editorFixture } from './helpers/editor-fixture.mjs'
import { createStore } from '../scripts/design-editor/store.mjs'
import { variantArtifacts, variantsPath } from '../scripts/variant-recipes.mjs'
const target = 'component.button.default.root.background.default'
const recipe = (id) => ({
  id,
  owner: 'button',
  label: 'Variante secondaire',
  bindings: [{ target, style: 'semantic.color.secondary.background.default' }],
})
test('specialized writer publishes a scoped recipe without changing canonical token values', async (t) => {
  const root = await editorFixture()
  let writer
  t.after(async () => {
    await writer?.close()
    await fs.rm(root, { recursive: true, force: true })
  })
  writer = await createStore(root)
  const base = await writer.snapshot(),
    id = randomUUID(),
    requestId = randomUUID()
  const request = {
    protocolVersion: 5,
    requestId,
    baseRevision: base.revision,
    operations: [{ kind: 'put-variant', variant: recipe(id) }],
  }
  const tokenFile = path.join(root, 'src/design-system/authority/tokens.tokens.json'),
    before = await fs.readFile(tokenFile)
  const result = await writer.saveVariant(request)
  assert.equal(result.status, 'saved')
  assert.deepEqual(await writer.saveVariant(request), result)
  assert.ok(
    (await fs.readFile(tokenFile)).equals(before),
    'Canonical tokens changed during recipe-only save',
  )
  const next = await writer.snapshot(),
    artifacts = await variantArtifacts(root, next.snapshot)
  assert.equal(artifacts.rules.variants[0].id, id)
  assert.ok(artifacts.css.includes(`[data-loomata-variant="${id}"][data-design-target="button"]`))
  assert.ok(
    artifacts.css.includes(
      '--adl-local-root-background-default: var(--adl-semantic-color-secondary-background-default)',
    ),
  )
  const stale = await writer.saveVariant({ ...request, requestId: randomUUID() })
  assert.equal(stale.status, 'conflict')
  const invalid = await writer.saveVariant({
    ...request,
    requestId: randomUUID(),
    baseRevision: next.revision,
    operations: [{ kind: 'put-variant', variant: { ...recipe(id), owner: 'field' } }],
  })
  assert.equal(invalid.status, 'invalid')
  assert.equal((await writer.snapshot()).revision, next.revision)
})
for (const phase of ['before-replace', 'after-replace', 'after-progress'])
  for (let index = 0; index < 2; index++)
    test(`variant ${phase} at file ${index} recovers the same receipt and CSS`, async (t) => {
      const root = await editorFixture()
      let writer
      t.after(async () => {
        await writer?.close()
        await fs.rm(root, { recursive: true, force: true })
      })
      let fired = false
      writer = await createStore(root, {
        fault: async (point, current) => {
          if (!fired && point === phase && current === index) {
            fired = true
            throw new Error('injected variant interruption')
          }
        },
      })
      const base = await writer.snapshot(),
        id = randomUUID(),
        request = {
          protocolVersion: 5,
          requestId: randomUUID(),
          baseRevision: base.revision,
          operations: [{ kind: 'put-variant', variant: recipe(id) }],
        }
      const interrupted = await writer.saveVariant(request)
      assert.equal(fired, true)
      assert.equal(interrupted.status, 'recovery-required')
      const record = JSON.parse(
        await fs.readFile(
          path.join(root, '.design-editor.local/records', request.requestId + '.json'),
          'utf8',
        ),
      )
      assert.equal(record.changes.length, 2)
      assert.ok(record.changes.some((e) => e.file === variantsPath))
      assert.ok(record.changes.some((e) => e.file === 'src/styles/tokens.generated.css'))
      await writer.close()
      writer = await createStore(root)
      assert.equal((await writer.status(request.requestId)).status, 'saved')
      assert.equal((await writer.saveVariant(request)).status, 'saved')
      assert.ok((await fs.readFile(path.join(root, variantsPath), 'utf8')).includes(id))
      assert.ok(
        (await fs.readFile(path.join(root, 'src/styles/tokens.generated.css'), 'utf8')).includes(
          id,
        ),
      )
    })
