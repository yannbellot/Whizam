import test from 'node:test'
import assert from 'node:assert/strict'
import * as fs from 'node:fs/promises'
import path from 'node:path'
import { observeReferences } from '../scripts/design-editor/observe.mjs'
import { sourcePaths } from '../scripts/design-editor/manifest.mjs'
const pause = (ms) => new Promise((r) => setTimeout(r, ms))
test('closed reference watcher observes atomic replacements, ignores unrelated files and closes', async () => {
  const parent = path.resolve('.runtime.local/tmp')
  await fs.mkdir(parent, { recursive: true })
  const root = await fs.mkdtemp(path.join(parent, 'observer-'))
  let observer
  try {
    for (const file of sourcePaths) {
      await fs.mkdir(path.dirname(path.join(root, file)), { recursive: true })
      await fs.writeFile(path.join(root, file), 'synthetic')
    }
    observer = observeReferences(root, 30)
    await fs.writeFile(path.join(root, sourcePaths[0]) + '.tmp', 'replacement')
    await fs.rename(path.join(root, sourcePaths[0]) + '.tmp', path.join(root, sourcePaths[0]))
    for (let i = 0; i < 250 && observer.current().version === 0; i++) await pause(10)
    assert.ok(observer.current().version > 0)
    await pause(60)
    assert.equal(observer.current().settled, true)
    const version = observer.current().version
    await fs.writeFile(path.join(root, 'src/design-system/authority/unrelated.txt'), 'ignored')
    await pause(60)
    assert.equal(observer.current().version, version)
    observer.close()
    await fs.writeFile(path.join(root, sourcePaths[0]), 'after close')
    await pause(60)
    assert.equal(observer.current().version, version)
  } finally {
    observer?.close()
    await fs.rm(root, { recursive: true, force: true })
  }
})
