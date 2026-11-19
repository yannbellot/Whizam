export function workspaceFigmaImport(
  root: string,
  writer: unknown,
  value: unknown,
  authority?: symbol,
  chat?: { conversationId: string; turnId: string },
  expectedFingerprint?: string,
): Promise<Record<string, unknown>>
