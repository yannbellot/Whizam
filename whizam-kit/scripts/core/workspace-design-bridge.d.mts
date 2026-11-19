export type DesignOperation = import('../../src/design-system/editor/contract').EditorOperation
export type TokenDesignRequest = {
  protocolVersion: 4
  requestId: string
  baseRevision: string
  operations: DesignOperation[]
}
export type DesignRequest =
  | TokenDesignRequest
  | import('../../src/core/variant-recipes.ts').VariantRequest
  | {
      protocolVersion: 7
      requestId: string
      baseRevision: string
      document: Record<string, unknown>
      previousStyles: string | null
      nextStyles: string | null
    }
  | {
      protocolVersion: 6
      requestId: string
      baseRevision: string
      registry: import('../../src/core/imported-components.ts').ImportedRegistry
    }
export function validateDesignRequest(input: unknown): DesignRequest
export const sourcePaths: string[]
export const derivedPaths: string[]
export type DesignSnapshot = {
  model: {
    primitives: { id: string; value: string | number }[]
    styles: { id: string; reference: string }[]
    bindings: { id: string; reference: string; style: string | null; baseReference: string }[]
  }
}
export function bindingBase(binding: { style: string | null; baseReference: string }): string
export function prepareEditorArtifacts(root: string): Promise<{ outputs: Map<string, Buffer> }>
export function createStore(root: string): Promise<{
  snapshot(): Promise<{ revision: string; snapshot: DesignSnapshot }>
  save(request: unknown): Promise<{ status: string; revision: string }>
  saveImport(request: unknown): Promise<{ status: string; revision: string }>
  saveVariant(request: unknown): Promise<{ status: string; revision: string }>
  saveVisual(request: unknown): Promise<{ status: string; revision: string }>
  status(id: string): Promise<{ status: string; revision: string }>
  close(): Promise<void>
}>
