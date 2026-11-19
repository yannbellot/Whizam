import * as fs from 'node:fs/promises'
import { resolve, dirname } from 'node:path'
import { randomUUID } from 'node:crypto'
import { privateDir, syncDir } from '../design-editor/files.mjs'
export async function stateDirectory(tool) {
  const runtime = resolve(tool, '.runtime.local')
  await fs.mkdir(runtime, { mode: 0o700 }).catch((e) => {
    if (e.code !== 'EEXIST') throw e
  })
  if ((await fs.lstat(runtime)).isSymbolicLink() || (await fs.realpath(runtime)) !== runtime)
    throw new Error('chat-private-state')
  const root = resolve(runtime, 'agent-chat')
  await privateDir(root)
  return root
}
export async function writeJSON(file, value) {
  const temporary = file + '.' + randomUUID() + '.tmp'
  const handle = await fs.open(temporary, 'wx', 0o600)
  try {
    await handle.writeFile(JSON.stringify(value))
    await handle.sync()
  } finally {
    await handle.close()
  }
  await fs.rename(temporary, file)
  await syncDir(dirname(file))
}
export async function readJSON(file, fallback) {
  try {
    const stat = await fs.lstat(file)
    if (!stat.isFile() || stat.isSymbolicLink() || stat.mode & 0o077)
      throw new Error('chat-private-state')
    return JSON.parse(await fs.readFile(file, 'utf8'))
  } catch (e) {
    if (e.code === 'ENOENT') return fallback
    throw e
  }
}
