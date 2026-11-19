import * as fs from 'node:fs/promises'
import { resolve } from 'node:path'
import { randomUUID } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { contextControl, nativeLoginControl, nativeAccountControl } from './context-control.mjs'
import { ChatManager } from './manager.mjs'
import { chatHTTP } from './http.mjs'
import { readJSON, writeJSON } from './private.mjs'
const [state] = process.argv.slice(2)
if (!state) throw new Error('chat-daemon-invocation')
const nonce = randomUUID() + randomUUID()
const tool = fileURLToPath(new URL('../..', import.meta.url))
const manager = await ChatManager.open({ tool, state })
let closing = false
const { server, origin } = await chatHTTP({
  manager,
  web: resolve(state, 'web'),
  control: {
    nonce,
    async handle(request) {
      if (['account', 'disconnect'].includes(request.operation))
        return nativeAccountControl(manager, request)
      if (request.operation === 'connect') return nativeLoginControl(manager, request)
      if (request.operation === 'context') return contextControl(manager, request)
      if (request.operation === 'open') {
        const project = await manager.register(request.root)
        return { url: origin + '/assistant/' + project.id }
      }
      const project = [...manager.projects.values()].find((p) => p.binding.root === request.root)
      if (request.operation === 'interrupt') {
        if (project) await manager.interrupt(project)
        return { interrupted: true }
      }
      if (request.operation === 'status')
        return { running: !!(project && manager.turn?.project.id === project.id) }
      throw new Error('chat-control-denied')
    },
  },
})
await writeJSON(resolve(state, 'owner.json'), { version: 1, pid: process.pid, nonce, origin })
async function stop() {
  if (closing) return
  closing = true
  await manager.close()
  server.closeAllConnections()
  await new Promise((done) => server.close(done))
  const owner = await readJSON(resolve(state, 'owner.json'), null)
  if (owner?.nonce === nonce) await fs.unlink(resolve(state, 'owner.json'))
}
for (const signal of ['SIGTERM', 'SIGINT'])
  process.on(signal, () => {
    void stop().catch(() => {
      process.exitCode = 1
    })
  })
