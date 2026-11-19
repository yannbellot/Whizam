import type { Plugin } from 'vite'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
// The browser receives no writer, capability or AI endpoint.
export function designSystemPlugin(): Plugin {
  let root = fileURLToPath(new URL('..', import.meta.url))
  let queue: Promise<unknown> = Promise.resolve()
  return {
    name: 'design-system-documentation',
    configResolved(config) {
      root = config.root
    },
    async handleHotUpdate(context) {
      if (!context.file.includes('.generated.')) return
      const deadline = Date.now() + 10000
      while (existsSync(path.join(root, '.design-sync.local'))) {
        if (Date.now() > deadline) return []
        await new Promise((resolve) => setTimeout(resolve, 25))
      }
    },
    configureServer(server) {
      server.middlewares.use((_request, response, next) => {
        if (existsSync(path.join(root, '.design-sync.local'))) {
          response.statusCode = 503
          response.setHeader('Cache-Control', 'no-store')
          response.end('Génération en cours ; réessayer après synchronisation.')
        } else next()
      })
      server.watcher.on('all', (event, file) => {
        if (!['add', 'change', 'unlink'].includes(event)) return
        if (
          (!file.includes('/authority/') && !file.endsWith('.examples.tsx')) ||
          file.includes('.generated.')
        )
          return
        queue = queue
          .catch(() => {})
          .then(async () => {
            const { synchronize } = await import('./design-system.mjs')
            await synchronize(root)
            server.ws.send({ type: 'full-reload' })
          })
          .catch((error: Error) => {
            server.config.logger.error(error.message)
          })
      })
    },
  }
}
