export function agentChat(
  operation: string,
  options: {
    root: string
    tool: string
    context?: { command: string; payload: Record<string, unknown>; treeId: string | null }
  },
): Promise<unknown>
