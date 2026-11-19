import { spawn } from 'node:child_process'
import * as fs from 'node:fs/promises'
import { resolve } from 'node:path'
import { privateDir } from '../design-editor/files.mjs'
import { permissionsConfig } from './broker.mjs'
export class CodexProvider {
  constructor({ binary, state, binding, onNotification, onTool, onClose }) {
    Object.assign(this, { binary, state, binding, onNotification, onTool, onClose })
    this.pending = new Map()
    this.id = 0
    this.closed = false
  }
  async start() {
    this.home = resolve(this.state, 'codex')
    await privateDir(this.home)
    this.work = resolve(this.state, 'work')
    await privateDir(this.work)
    await fs.writeFile(
      resolve(this.home, 'config.toml'),
      permissionsConfig(this.binding, this.work),
      { mode: 0o600 },
    )
    const env = {
      PATH: process.env.PATH ?? '/usr/bin:/bin',
      LANG: 'en_US.UTF-8',
      CODEX_HOME: this.home,
      TMPDIR: this.work,
    }
    const child = spawn(this.binary, ['app-server', '--listen', 'stdio://'], {
      cwd: this.work,
      env,
      stdio: ['pipe', 'pipe', 'pipe'],
    })
    this.process = child
    let buffer = '',
      bytes = 0
    child.stdout.on('data', (chunk) => {
      bytes += chunk.length
      if (bytes > 16 * 1024 * 1024) return this.stop('chat-output-budget')
      buffer += chunk
      if (buffer.length > 1024 * 1024) return this.stop('chat-output-budget')
      while (buffer.includes('\n')) {
        const i = buffer.indexOf('\n')
        const line = buffer.slice(0, i)
        buffer = buffer.slice(i + 1)
        try {
          this.receive(JSON.parse(line))
        } catch {
          this.stop('chat-provider-protocol')
        }
      }
    })
    child.stderr.on('data', (chunk) => {
      bytes += chunk.length
      if (bytes > 16 * 1024 * 1024) this.stop('chat-output-budget')
    })
    child.stdin.on('error', () => this.stop('chat-provider-unavailable'))
    child.once('error', () => this.stop('chat-provider-unavailable'))
    child.once('close', () => this.stop('chat-provider-unavailable'))
    await this.rpc('initialize', {
      clientInfo: { name: 'loomata', title: 'Loomata', version: '0.1.0' },
      capabilities: { experimentalApi: true },
    })
    this.send({ method: 'initialized' })
    const effective = (await this.rpc('config/read', { includeLayers: false })).config
    if (
      effective.default_permissions !== 'loomata' ||
      effective.approval_policy !== 'never' ||
      effective.features?.shell_tool !== false ||
      effective.features?.apps !== false ||
      effective.features?.plugins !== false ||
      effective.features?.hooks !== false ||
      Object.keys(effective.mcp_servers ?? {}).length
    )
      throw new Error('chat-provider-permissions')
  }
  send(value) {
    if (this.closed) throw new Error('chat-provider-unavailable')
    this.process.stdin.write(JSON.stringify(value) + '\n')
  }
  rpc(method, params, timeout = 15000) {
    return new Promise((resolve, reject) => {
      const id = ++this.id
      const timer = setTimeout(() => {
        this.pending.delete(id)
        reject(new Error('chat-provider-timeout'))
      }, timeout)
      this.pending.set(id, { resolve, reject, timer })
      try {
        this.send({ id, method, params })
      } catch (e) {
        clearTimeout(timer)
        this.pending.delete(id)
        reject(e)
      }
    })
  }
  receive(message) {
    if (this.closed) return
    if (message.id !== undefined && !message.method) {
      const p = this.pending.get(message.id)
      if (!p) return
      this.pending.delete(message.id)
      clearTimeout(p.timer)
      message.error
        ? p.reject(new Error('chat-provider-request-failed'))
        : p.resolve(message.result)
      return
    }
    if (message.id !== undefined) {
      if (message.method === 'item/tool/call') {
        Promise.resolve(this.onTool(message.params)).then(
          (result) => {
            if (!this.closed) this.send({ id: message.id, result })
          },
          () => {
            if (!this.closed)
              this.send({
                id: message.id,
                result: {
                  success: false,
                  contentItems: [{ type: 'inputText', text: 'Action refused by Loomata.' }],
                },
              })
          },
        )
      } else {
        // No native escalation, account-token refresh callback, shell, MCP or arbitrary host request.
        this.send({
          id: message.id,
          error: {
            code: -32601,
            message: 'Use the validated Loomata project tools. Native escalation is unavailable.',
          },
        })
        this.onNotification({ method: 'loomata/requestDenied', params: {} })
      }
      return
    }
    this.onNotification(message)
  }
  stop(code = 'chat-provider-stopped') {
    if (this.closed) return
    this.closed = true
    for (const p of this.pending.values()) {
      clearTimeout(p.timer)
      p.reject(new Error(code))
    }
    this.pending.clear()
    this.process?.stdin.end()
    this.process?.kill('SIGTERM')
    this.onClose?.(code)
  }
}
