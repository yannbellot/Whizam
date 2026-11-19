export interface TokenEntry {
  id: string
  path: string
  segments: string[]
  type: string
  value: unknown
  reference?: string
  terminal: string
  node: Record<string, unknown>
  meta: Record<string, unknown>
}
export const tokenPath: string
export function loadTokens(root: string): Promise<{
  document: Record<string, unknown>
  entries: TokenEntry[]
  ids: Map<string, TokenEntry>
  paths: Map<string, TokenEntry>
}>
export function tokenCSS(type: string, value: unknown): string
