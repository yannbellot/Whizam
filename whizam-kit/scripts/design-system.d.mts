export function synchronize(
  root: string,
  options?: { check?: boolean },
): Promise<{ count: number; outputs: number }>
export function recoverGeneration(root: string): Promise<{ count: number; outputs: number }>

export function loadTokens(root: string): Promise<{
  entries: CatalogToken[]
  ids: Map<string, CatalogToken>
}>
interface CatalogToken {
  id: string
  type: string
  css: string
  reference?: string
  meta: { kind: string; owner?: string; context?: { property?: string; state?: string } }
}
