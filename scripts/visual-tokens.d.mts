import type { Catalog, EditorContract, EditorModel } from '../src/design-system/editor/contract'
import type {
  ContextualState,
  RenderedContextualStyle,
  contextualStyleRequest,
} from '../src/core/contextual-style'
import type { z } from 'zod'
type VisualEdit = {
  owner: string
  variant: string
  part: string
  state: ContextualState
  condition: string | null
  changes: z.infer<typeof contextualStyleRequest>['changes']
}
export function readVisualTokenStyles(document: Record<string, unknown>): RenderedContextualStyle[]
export function planVisualDefinitionTokens(
  document: Record<string, unknown>,
  snapshot: {
    model: EditorModel
    contract: EditorContract
    catalog: Catalog
    legacy: { id: string }[]
  },
  edits: VisualEdit[],
): { document?: Record<string, unknown>; issues: Omit<VisualEdit, 'changes'>[] }
