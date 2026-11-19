import * as fs from 'node:fs/promises'
import { constants } from 'node:fs'
import path from 'node:path'
import { createHash, randomUUID } from 'node:crypto'
export const hash = (bytes) => createHash('sha256').update(bytes).digest('hex')
export const identity = (stat) => {
  if (!Number.isSafeInteger(stat.dev) || !Number.isSafeInteger(stat.ino))
    throw new Error('forbidden')
  return { dev: stat.dev, ino: stat.ino, mode: stat.mode & 0o7777 }
}
export const sameIdentity = (a, b) => a.dev === b.dev && a.ino === b.ino && a.mode === b.mode
export async function syncDir(directory) {
  const handle = await fs.open(directory, constants.O_RDONLY)
  try {
    await handle.sync()
  } finally {
    await handle.close()
  }
}
export async function privateDir(directory) {
  try {
    await fs.mkdir(directory, { mode: 0o700 })
  } catch (error) {
    if (error.code !== 'EEXIST') throw error
  }
  const stat = await fs.lstat(directory)
  if (
    !stat.isDirectory() ||
    stat.isSymbolicLink() ||
    (stat.mode & 0o777) !== 0o700 ||
    typeof process.getuid !== 'function' ||
    stat.uid !== process.getuid()
  )
    throw new Error('recovery-required')
}
export async function checkParents(root, file) {
  if (
    path.isAbsolute(file) ||
    file.split('/').some((segment) => !segment || segment === '.' || segment === '..')
  )
    throw new Error('forbidden')
  let current = root
  for (const segment of file.split('/').slice(0, -1)) {
    current = path.join(current, segment)
    const stat = await fs.lstat(current)
    if (!stat.isDirectory() || stat.isSymbolicLink()) throw new Error('forbidden')
  }
  if (path.relative(root, await fs.realpath(path.dirname(path.join(root, file)))).startsWith('..'))
    throw new Error('forbidden')
}
export async function readSafe(root, file, limit = 2 * 1024 * 1024) {
  await checkParents(root, file)
  const full = path.join(root, file),
    before = await fs.lstat(full)
  if (!before.isFile() || before.isSymbolicLink() || before.nlink !== 1 || before.size > limit)
    throw new Error('forbidden')
  const handle = await fs.open(full, constants.O_RDONLY | constants.O_NOFOLLOW)
  try {
    const start = await handle.stat()
    if (!sameIdentity(identity(before), identity(start)) || start.nlink !== 1)
      throw new Error('forbidden')
    let offset = 0
    const chunks = []
    for (;;) {
      const buffer = Buffer.alloc(Math.min(65536, limit + 1 - offset))
      if (!buffer.length) throw new Error('budget-exceeded')
      const { bytesRead } = await handle.read(buffer, 0, buffer.length, null)
      if (!bytesRead) break
      offset += bytesRead
      if (offset > limit) throw new Error('budget-exceeded')
      chunks.push(buffer.subarray(0, bytesRead))
    }
    const end = await handle.stat(),
      after = await fs.lstat(full)
    if (
      !sameIdentity(identity(start), identity(after)) ||
      start.mtimeMs !== end.mtimeMs ||
      start.size !== end.size ||
      end.nlink !== 1
    )
      throw new Error('revision-conflict')
    const bytes = Buffer.concat(chunks)
    return { bytes, hash: hash(bytes), ...identity(end) }
  } finally {
    await handle.close()
  }
}
export async function durableReplace(root, file, bytes, mode = 0o600) {
  await checkParents(root, file)
  const full = path.join(root, file),
    temporary = full + '.' + randomUUID() + '.tmp'
  const handle = await fs.open(
    temporary,
    constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW,
    mode,
  )
  try {
    await handle.writeFile(bytes)
    await handle.chmod(mode)
    await handle.sync()
  } finally {
    await handle.close()
  }
  // Appelé uniquement pour les journaux privés ; les publications de sources utilisent les inodes préparés.
  await fs.rename(temporary, full)
  await syncDir(path.dirname(full))
}
