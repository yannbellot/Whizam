import { importedRequestSchema } from '../../src/core/imported-components.ts'
// Node adapter: expose the existing writer without importing browser-only TypeScript types.
export { createStore } from '../design-editor/store.mjs'
export { sourcePaths } from '../design-editor/manifest.mjs'
export { prepareEditorArtifacts, derivedPaths } from '../editor-artifacts.mjs'
export { bindingBase } from '../../src/design-system/editor/contract.ts'
import { saveRequestSchema } from '../../src/design-system/editor/operations.ts'
import { variantRequestSchema } from '../../src/core/variant-recipes.ts'
import { visualWriteSchema } from '../visual-tokens.mjs'
export function validateDesignRequest(input) {
  if (input?.protocolVersion === 7) return visualWriteSchema.parse(input)
  if (input?.protocolVersion === 6) return importedRequestSchema.parse(input)
  if (input?.protocolVersion === 5) return variantRequestSchema.parse(input)
  const request = saveRequestSchema.parse(input)
  return request
}
