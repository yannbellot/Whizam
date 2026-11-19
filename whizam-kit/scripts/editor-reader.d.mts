export function withEditorRead<T>(root: string, action: () => Promise<T>): Promise<T>
export function editorReadMiddleware(
  root: string,
  prepare?: () => Promise<unknown>,
): (
  req: import('node:http').IncomingMessage,
  res: import('node:http').ServerResponse,
  next: () => void,
) => void
