import * as fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { manifestPaths } from '../../scripts/design-editor/manifest.mjs'
import { prepareEditorArtifacts } from '../../scripts/editor-artifacts.mjs'
export async function editorFixture() {
  const root = fileURLToPath(new URL('../..', import.meta.url)),
    parent = path.join(root, '.runtime.local', 'tmp')
  await fs.mkdir(parent, { recursive: true })
  const directory = await fs.mkdtemp(path.join(parent, 'editor-http-'))
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
    return directory
  } catch (error) {
    await fs.rm(directory, { recursive: true, force: true })
    throw error
  }
}
