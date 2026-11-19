import { watch, lstatSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { sourcePaths } from './manifest.mjs'

// Closed metadata-only observation; source validation and reads remain in the protected store.
export function observeReferences(root, delay = 400) {
  let version = 0,
    settled = true,
    timer,
    closed = false
  const fingerprint = () =>
    sourcePaths
      .map((file) => {
        try {
          const stat = lstatSync(resolve(root, file), { bigint: true })
          return `${stat.ino}:${stat.size}:${stat.mtimeNs}:${stat.ctimeNs}:${stat.isSymbolicLink()}`
        } catch {
          return 'unavailable'
        }
      })
      .join('|')
  let previous = fingerprint()
  const check = () => {
    if (closed) return
    const next = fingerprint()
    if (next === previous) return
    previous = next
    version++
    settled = false
    clearTimeout(timer)
    timer = setTimeout(() => {
      if (!closed) settled = true
    }, delay)
  }
  const watchers = []
  try {
    for (const directory of new Set(sourcePaths.map((file) => resolve(root, dirname(file))))) {
      const watcher = watch(directory, check)
      watcher.on('error', check)
      watchers.push(watcher)
    }
  } catch (error) {
    for (const watcher of watchers) watcher.close()
    throw error
  }
  // Directory events can be delayed/coalesced; this bounded fallback checks only reference metadata.
  const poll = setInterval(check, 1500)
  poll.unref()
  return {
    current: () => ({ version, settled }),
    close: () => {
      closed = true
      clearInterval(poll)
      clearTimeout(timer)
      for (const watcher of watchers) watcher.close()
    },
  }
}
