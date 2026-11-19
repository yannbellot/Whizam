import { z } from 'zod'
import { identitySchema } from '../../src/core/workspace-contract.ts'
import { workspaceContext } from './workspace.mjs'
const empty = z.strictObject({})
const nativeLoginSchema = z.strictObject({
  operation: z.literal('connect'),
  root: z.string().min(1),
})
const nativeAccountSchema = z.strictObject({
  operation: z.enum(['account', 'disconnect']),
  root: z.string().min(1),
})
export async function nativeAccountControl(manager, value) {
  const request = nativeAccountSchema.parse(value)
  if (manager.commandActive) throw new Error('chat-command-busy')
  manager.commandActive = true
  try {
    const project = await manager.register(request.root)
    if (!manager.provider) await manager.ensure(project)
    if (request.operation === 'disconnect') await manager.disconnect(manager.current ?? project)
    return {
      connected: await manager.account(),
      pendingLogin: !!manager.login,
      loginFailed: manager.lastError === 'chat-login-failed',
    }
  } finally {
    manager.commandActive = false
  }
}
/** Explicit native account menu only; no conversation or credential projection. */
export async function nativeLoginControl(manager, value) {
  const request = nativeLoginSchema.parse(value)
  if (manager.commandActive) throw new Error('chat-command-busy')
  manager.commandActive = true
  try {
    const project = await manager.register(request.root)
    await manager.connect(project, { reauthenticate: true })
    if (!manager.login?.url) throw new Error('chat-login-unavailable')
    return { url: manager.login.url }
  } finally {
    manager.commandActive = false
  }
}
const commands = {
  snapshot: empty,
  status: empty,
  connect: empty,
  disconnect: empty,
  cancelLogin: empty,
  new: z.strictObject({ entityId: identitySchema.nullable().optional() }),
  send: z.strictObject({
    conversation: identitySchema,
    text: z.string().trim().min(1).max(16000),
    requestId: identitySchema,
  }),
  approve: z.strictObject({ id: identitySchema, decision: z.enum(['approve', 'deny']) }),
  interrupt: empty,
}
const envelope = z.strictObject({
  operation: z.literal('context'),
  root: z.string().min(1),
  command: z.string(),
  payload: z.unknown(),
  treeId: identitySchema.nullable(),
})
/** Private daemon control only. Browser capabilities never become provider or filesystem capabilities. */
export async function contextControl(manager, value) {
  const request = envelope.parse(value)
  if (!Object.hasOwn(commands, request.command)) throw new Error('chat-operation-denied')
  const payload = commands[request.command].parse(request.payload)
  const project = await manager.register(request.root)
  const context = await workspaceContext(project)
  if (!context || context.treeId !== request.treeId) throw new Error('workspace-selection-changed')
  const exclusive = !['snapshot', 'approve', 'interrupt'].includes(request.command)
  if (exclusive && manager.commandActive) throw new Error('chat-command-busy')
  if (exclusive) manager.commandActive = true
  try {
    let result
    switch (request.command) {
      case 'snapshot':
        result = await manager.workspaceSnapshot(project)
        break
      case 'status':
        await manager.ensure(project)
        result = await manager.workspaceSnapshot(project)
        break
      case 'connect':
        await manager.connect(project)
        break
      case 'disconnect':
        await manager.disconnect(project)
        break
      case 'cancelLogin':
        if (manager.current?.id !== project.id) throw new Error('chat-project-foreign')
        await manager.cancelLogin()
        break
      case 'new':
        result = {
          conversation: await manager.newConversation(
            project,
            payload.entityId ?? null,
            request.treeId,
          ),
        }
        break
      case 'send':
        await manager.send(project, payload, request.treeId)
        break
      case 'approve':
        await manager.approve(project, payload)
        break
      case 'interrupt':
        await manager.interrupt(project)
        break
    }
    return result ?? { ok: true }
  } finally {
    if (exclusive) manager.commandActive = false
  }
}
