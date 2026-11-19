import { assertDecisionMigrationComplete } from './decision-policy-state.mjs'
import { EventEmitter } from 'node:events'
import * as fs from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { constants } from 'node:fs'
import { privateDir, identity, syncDir } from './design-editor/files.mjs'
export async function withEditorRead(root, action) {
  await assertDecisionMigrationComplete(root)
  const directory = path.join(root, '.design-editor.local')
  await privateDir(directory)
  const blocked = async () => {
    await assertDecisionMigrationComplete(root)
    try {
      await fs.lstat(path.join(directory, 'active'))
      return true
    } catch (error) {
      if (error.code === 'ENOENT') return false
      throw error
    }
  }
  if (await blocked()) throw new Error('recovery-required')
  const nonce = randomUUID(),
    file = path.join(directory, `reader-${nonce}.json`)
  const handle = await fs.open(
    file,
    constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW,
    0o600,
  )
  try {
    await handle.writeFile(
      JSON.stringify({ version: 1, pid: process.pid, nonce, root: identity(await fs.lstat(root)) }),
    )
    await handle.sync()
    await syncDir(directory)
    if (await blocked()) throw new Error('recovery-required')
    return await action()
  } finally {
    await handle.close()
    await fs.unlink(file)
    await syncDir(directory)
  }
}

/** HTTP reader only: never creates a writer or accepts editor API requests. */
export function editorReadMiddleware(root, prepare = async () => {}) {
  return (req, res, next) => {
    if ((req.url ?? '').startsWith('/__design-system/editor/')) {
      res.statusCode = 404
      res.setHeader('Cache-Control', 'no-store')
      res.end()
      return
    }
    try {
      const pathname = decodeURIComponent(new URL(req.url ?? '/', 'http://localhost').pathname)
      if (
        pathname
          .split('/')
          .some(
            (part) =>
              ['.design-editor.local', '.runtime.local', '.git'].includes(part) ||
              part.startsWith('.env'),
          )
      ) {
        res.statusCode = 403
        res.end('Accès refusé.')
        return
      }
    } catch {
      res.statusCode = 400
      res.end()
      return
    }
    // Observe completion before the first asynchronous filesystem operation.
    let ended = res.destroyed || res.writableEnded || res.closed
    let complete
    const completed = new Promise((resolve) => {
      complete = resolve
    })
    const finish = () => {
      ended = true
      complete()
    }
    // Storybook's compression middleware redirects res.on to its compression stream.
    // Reservations must follow the actual HTTP response, including pre-stream aborts.
    EventEmitter.prototype.on.call(res, 'finish', finish)
    EventEmitter.prototype.on.call(res, 'close', finish)
    void withEditorRead(root, async () => {
      await prepare()
      if (ended || res.destroyed || res.writableEnded || res.closed) return
      next()
      await completed
    })
      .catch(() => {
        if (ended || res.destroyed || res.writableEnded || res.closed) return
        if (!res.headersSent) {
          res.statusCode = 503
          res.setHeader('Cache-Control', 'no-store')
          res.setHeader('Retry-After', '1')
          res.end(
            'Design system en cours d’enregistrement ou de récupération. Réessayez après sa confirmation.',
          )
        } else res.destroy()
      })
      .finally(() => {
        EventEmitter.prototype.removeListener.call(res, 'finish', finish)
        EventEmitter.prototype.removeListener.call(res, 'close', finish)
      })
  }
}
