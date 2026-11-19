import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { dirname, extname, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import process from 'node:process'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../storybook-static')
const port = Number(process.env.ADL_E2E_PORT)
if (!Number.isInteger(port) || port < 1 || port > 65535)
  throw new Error('An isolated test port is required')
const mime = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
}
const server = createServer(async (request, response) => {
  try {
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405).end()
      return
    }
    const path = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname)
    const file = resolve(root, '.' + (path === '/' ? '/index.html' : path))
    if (!file.startsWith(root + sep)) {
      response.writeHead(403).end()
      return
    }
    const body = await readFile(file)
    response.writeHead(200, {
      'Content-Type': mime[extname(file)] ?? 'application/octet-stream',
      'Cache-Control': 'no-store',
    })
    response.end(request.method === 'HEAD' ? undefined : body)
  } catch {
    response.writeHead(404).end('Not found')
  }
})
server.listen(port, '127.0.0.1')
for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, () => server.close())
