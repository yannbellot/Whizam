import { z } from 'zod'
import { agentChat } from './agent-chat.mjs'
import { explorationStore, explorationSnapshot } from './workspace-exploration.ts'
const inputSchema = z.strictObject({
  command: z.string().min(1).max(30),
  payload: z.record(z.string(), z.unknown()),
})
/** Finite same-origin bridge to the existing dedicated Codex account and private history. */
export async function workspaceAssistant(root: string, input: unknown) {
  const request = inputSchema.parse(input)
  if (
    ![
      'snapshot',
      'status',
      'connect',
      'disconnect',
      'cancelLogin',
      'new',
      'send',
      'approve',
      'interrupt',
    ].includes(request.command)
  )
    throw new Error('unknown-operation')
  const { store, treeId } = explorationStore(root)
  const tool = process.env.LOOMATA_TOOL_DIRECTORY ?? store.root
  const view = await explorationSnapshot(root)
  if (!view.available || !view.selected) throw new Error('revision-conflict')
  return agentChat('ai.context', { root: store.root, tool, context: { ...request, treeId } })
}
