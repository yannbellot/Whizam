import { createServer } from 'node:http'
import * as fs from 'node:fs/promises'
import { resolve, extname } from 'node:path'
import { timingSafeEqual } from 'node:crypto'
import { chatErrorCodes } from './errors.mjs'
const mime = {
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
}
function equal(a, b) {
  return (
    typeof a === 'string' &&
    a.length === b.length &&
    timingSafeEqual(Buffer.from(a), Buffer.from(b))
  )
}
export async function chatHTTP({ manager, web, control }) {
  let origin
  const server = createServer((req, res) => {
    void handle(req, res).catch(() => {
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end('{"error":"chat-unavailable"}')
      } else res.destroy()
    })
  })
  async function handle(req, res) {
    res.setHeader('Cache-Control', 'no-store')
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('Referrer-Policy', 'no-referrer')
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'none'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' data:; font-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'",
    )
    const json = (status, value) => {
      res.writeHead(status, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(value))
    }
    if (
      req.headers.host !== new URL(origin).host ||
      req.headers['sec-fetch-site'] === 'cross-site' ||
      req.headers['sec-fetch-site'] === 'same-site'
    ) {
      json(403, { error: 'chat-origin-denied' })
      return
    }
    const url = new URL(req.url, origin)
    if (url.search || url.hash) {
      json(404, { error: 'chat-route-unavailable' })
      return
    }
    if (url.pathname === '/control') {
      if (
        !control ||
        req.method !== 'POST' ||
        req.headers.authorization !== 'Bearer ' + control.nonce ||
        (req.headers.origin && req.headers.origin !== origin)
      ) {
        json(403, { error: 'chat-access-denied' })
        return
      }
      let body = ''
      for await (const chunk of req) {
        body += chunk
        // The closed visual intent schema allows 64 KiB, plus its private envelope.
        if (Buffer.byteLength(body) > 98304) {
          json(413, {})
          return
        }
      }
      try {
        json(200, await control.handle(JSON.parse(body)))
      } catch (e) {
        json(409, {
          error: chatErrorCodes.includes(e.message) ? e.message : 'chat-control-failed',
        })
      }
      return
    }
    if (req.method === 'GET' && /^\/assets\/[A-Za-z0-9_.-]+$/.test(url.pathname)) {
      const file = resolve(web, '.' + url.pathname),
        extension = extname(file)
      if (!mime[extension]) {
        json(404, {})
        return
      }
      try {
        const bytes = await fs.readFile(file)
        res.writeHead(200, { 'Content-Type': mime[extension] })
        res.end(bytes)
      } catch {
        json(404, {})
      }
      return
    }
    const match = url.pathname.match(/^\/assistant\/([0-9a-f-]{36})(\/command)?$/)
    const project = match && manager.projects.get(match[1])
    if (!project) {
      json(404, { error: 'chat-project-unknown' })
      return
    }
    if (req.method === 'GET' && !match[2]) {
      let html = await fs.readFile(resolve(web, 'index.html'), 'utf8')
      html = html.replace(
        '<!-- LOOMATA_BOOTSTRAP -->',
        '<meta name="loomata-chat-session" content="' + project.token + '">',
      )
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      res.end(html)
      return
    }
    if (req.method !== 'POST' || !match[2]) {
      json(405, {})
      return
    }
    if (
      req.headers.origin !== origin ||
      !equal(req.headers.authorization, 'Bearer ' + project.token) ||
      req.headers['content-type'] !== 'application/json'
    ) {
      json(403, { error: 'chat-access-denied' })
      return
    }
    let bytes = 0,
      body = ''
    for await (const chunk of req) {
      bytes += chunk.length
      if (bytes > 32768) {
        json(413, { error: 'chat-input-budget' })
        return
      }
      body += chunk
    }
    let input
    try {
      input = JSON.parse(body)
    } catch {
      json(400, { error: 'chat-input-invalid' })
      return
    }
    if (
      !input ||
      typeof input !== 'object' ||
      Array.isArray(input) ||
      Object.keys(input).some((k) => !['operation', 'payload'].includes(k))
    ) {
      json(400, { error: 'chat-input-invalid' })
      return
    }
    const payload = input.payload ?? {}
    const exclusive = !['snapshot', 'approve', 'interrupt'].includes(input.operation)
    if (exclusive && manager.commandActive) {
      json(409, { error: 'chat-command-busy' })
      return
    }
    if (exclusive) manager.commandActive = true
    try {
      let result
      switch (input.operation) {
        case 'snapshot':
          result = await manager.workspaceSnapshot(project)
          break
        case 'workspaceSelect':
          if (Object.keys(payload).join(',') !== 'treeId') throw new Error('chat-input-invalid')
          result = await manager.selectWorkspace(project, payload.treeId)
          break
        case 'status':
          await manager.ensure(project)
          result = manager.snapshot(project)
          break
        case 'connect':
          await manager.connect(project)
          break
        case 'cancelLogin':
          if (manager.current?.id !== project.id) throw new Error('chat-project-foreign')
          await manager.cancelLogin()
          break
        case 'disconnect':
          await manager.disconnect(project)
          break
        case 'new':
          if (Object.keys(payload).some((k) => k !== 'entityId'))
            throw new Error('chat-input-invalid')
          result = {
            conversation: await manager.newConversation(project, payload.entityId ?? null),
          }
          break
        case 'send':
          await manager.send(project, payload)
          break
        case 'interrupt':
          await manager.interrupt(project)
          break
        case 'approve':
          await manager.approve(project, payload)
          break
        default:
          throw new Error('chat-operation-denied')
      }
      json(200, result ?? { ok: true })
    } catch (e) {
      json(409, { error: /^chat-[a-z-]+$/.test(e.message) ? e.message : 'chat-operation-failed' })
    } finally {
      if (exclusive) manager.commandActive = false
    }
  }
  await new Promise((done, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', done)
  })
  origin = 'http://127.0.0.1:' + server.address().port
  return { server, origin }
}
