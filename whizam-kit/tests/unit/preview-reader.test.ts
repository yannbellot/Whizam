import { expect, test, vi } from 'vitest'
import { EventEmitter } from 'node:events'
import { mkdir, mkdtemp, readdir, rm } from 'node:fs/promises'
import { resolve, join } from 'node:path'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { editorReadMiddleware } from '../../scripts/editor-reader.mjs'

test('an aborted response releases its real reservation when close precedes preparation', async () => {
  const parent = resolve('.runtime.local/tmp')
  await mkdir(parent, { recursive: true })
  const root = await mkdtemp(join(parent, 'reader-response-'))
  let resume: () => void = () => {}
  const preparing = vi.fn()
  const gate = new Promise<void>((resolve) => {
    resume = resolve
  })
  try {
    const middleware = editorReadMiddleware(root, async () => {
      preparing()
      await gate
    })
    const response = Object.assign(new EventEmitter(), { destroyed: false, writableEnded: false })
    // A compression wrapper may redirect .on away from the real HTTP emitter.
    response.on = vi.fn(() => response)
    const next = vi.fn()
    middleware({ url: '/component.tsx' } as IncomingMessage, response as ServerResponse, next)
    await vi.waitFor(() => expect(preparing).toHaveBeenCalledOnce())
    const readers = async () =>
      (await readdir(join(root, '.design-editor.local'))).filter((name) =>
        name.startsWith('reader-'),
      )
    expect(await readers()).toHaveLength(1)
    response.emit('close')
    resume()
    await vi.waitFor(async () => expect(await readers()).toHaveLength(0))
    expect(next).not.toHaveBeenCalled()
    expect(response.on).not.toHaveBeenCalled()
  } finally {
    resume()
    await rm(root, { recursive: true, force: true })
  }
})
