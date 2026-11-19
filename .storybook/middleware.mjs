import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
const barrier = fileURLToPath(new URL('../.design-sync.local', import.meta.url))
// Storybook serves HTML before Vite. This guard reads only publication state.
export default function middleware(app) {
  app.use((_request, response, next) => {
    if (existsSync(barrier)) {
      response.statusCode = 503
      response.setHeader('Cache-Control', 'no-store')
      response.end('Génération en cours ; réessayer après synchronisation.')
    } else next()
  })
}
