import * as fs from 'node:fs/promises'
import { resolve } from 'node:path'
import { spawn } from 'node:child_process'
import { setTimeout as delay } from 'node:timers/promises'
import { privateDir } from '../design-editor/files.mjs'
import { stateDirectory, readJSON } from '../agent-chat/private.mjs'
import { buildChatUI } from '../build-agent-chat.mjs'
import { chatErrorCodes } from '../agent-chat/errors.mjs'
export async function agentChat(operation, { root, tool, context = undefined }) {
  const state = await stateDirectory(tool)
  const real = await fs.realpath(root)
  async function request(owner) {
    const url = new URL(owner.origin)
    if (
      url.protocol !== 'http:' ||
      url.hostname !== '127.0.0.1' ||
      Number(url.port) < 1024 ||
      url.pathname !== '/' ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      typeof owner.nonce !== 'string'
    )
      throw new Error('chat-owner-invalid')
    const response = await fetch(url.origin + '/control', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + owner.nonce },
      body: JSON.stringify({
        operation: operation.slice(3),
        root: real,
        ...(operation === 'ai.context' ? context : {}),
      }),
      signal: AbortSignal.timeout(15000),
    })
    const text = await response.text()
    if (text.length > (operation === 'ai.context' ? 4 * 1024 * 1024 : 16384))
      throw new Error('chat-control-failed')
    const value = JSON.parse(text)
    // A successful snapshot may describe a prior login failure in its `error` field.
    // Transport failure and account state are separate contracts.
    if (!response.ok)
      throw new Error(chatErrorCodes.includes(value.error) ? value.error : 'chat-control-failed')
    return value
  }

  let owner = await readJSON(resolve(state, 'owner.json'), null)
  if (owner) {
    try {
      return await request(owner)
    } catch (e) {
      let dead = false
      try {
        process.kill(owner.pid, 0)
      } catch (error) {
        dead = error.code === 'ESRCH'
      }
      if (!dead || owner.version !== 1 || typeof owner.nonce !== 'string') throw e
      // Reconcile a dead, identified chat owner only; persistent history/auth remain intact.
      const latest = await readJSON(resolve(state, 'owner.json'), null)
      if (latest?.nonce !== owner.nonce) throw new Error('chat-owner-changed')
      await fs.rm(resolve(state, 'control.sock'), { force: true })
      await fs.unlink(resolve(state, 'owner.json'))
      owner = null
    }
  }
  if (!['ai.open', 'ai.context', 'ai.connect', 'ai.account'].includes(operation))
    return { running: false }
  const lock = resolve(state, 'startup.lock')
  try {
    await fs.mkdir(lock, { mode: 0o700 })
  } catch (e) {
    if (e.code !== 'EEXIST') throw e
    for (let n = 0; n < 600; n++) {
      await delay(100)
      owner = await readJSON(resolve(state, 'owner.json'), null)
      if (owner) return request(owner)
    }
    throw new Error('chat-startup-interrupted')
  }
  try {
    owner = await readJSON(resolve(state, 'owner.json'), null)
    if (owner) return request(owner)
    const web = resolve(state, 'web')
    await privateDir(web)
    await buildChatUI(web)
    const child = spawn(process.execPath, [resolve(tool, 'scripts/agent-chat/daemon.mjs'), state], {
      cwd: state,
      env: { PATH: process.env.PATH ?? '/usr/bin:/bin', LANG: 'en_US.UTF-8' },
      detached: true,
      stdio: 'ignore',
    })
    let failed = false
    child.once('error', () => {
      failed = true
    })
    child.once('exit', () => {
      failed = true
    })
    child.unref()
    for (let n = 0; n < 200; n++) {
      await delay(100)
      if (failed) throw new Error('chat-daemon-unavailable')
      owner = await readJSON(resolve(state, 'owner.json'), null)
      if (owner?.pid === child.pid) return request(owner)
    }
    throw new Error('chat-daemon-timeout')
  } finally {
    await fs.rmdir(lock)
  }
}
