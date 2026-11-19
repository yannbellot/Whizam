import { withEditorRead } from '../editor-reader.mjs'
import { manifestPaths } from './manifest.mjs'
import { derivedPaths, prepareEditorArtifacts } from '../editor-artifacts.mjs'
import { readSafe, sameIdentity } from './files.mjs'
import { editorRevision } from './store.mjs'

// Participate in the existing reader reservation; never claim or close the live writer.
export async function readDesignSnapshot(root) {
  return withEditorRead(root, async () => {
    async function read() {
      const entries = {}
      let size = 0
      for (const file of new Set([...manifestPaths, ...derivedPaths])) {
        const entry = await readSafe(root, file)
        size += entry.bytes.length
        if (size > 16 * 1024 * 1024) throw new Error('budget-exceeded')
        entries[file] = entry
      }
      return entries
    }
    const before = await read()
    const { snapshot } = await prepareEditorArtifacts(root)
    const after = await read()
    for (const file of Object.keys(before))
      if (before[file].hash !== after[file].hash || !sameIdentity(before[file], after[file]))
        throw new Error('revision-conflict')
    return { snapshot, revision: editorRevision(after) }
  })
}
