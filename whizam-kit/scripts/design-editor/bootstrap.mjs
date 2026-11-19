import { coordinateEditor } from '../core/workspace-editor.mjs'
import { explorationSnapshot } from '../core/workspace-exploration.ts'
import { workspaceFigma } from '../core/workspace-figma.ts'
import { workspacePlanning } from '../core/workspace-planning.ts'
import { workspaceAssistant } from '../core/workspace-assistant.ts'
import { mutateVariant } from '../core/workspace-variants.ts'
import { saveContextualStyle } from '../core/workspace-contextual-styles.ts'
import { observeReferences } from './observe.mjs'
import { createStore } from './store.mjs'
import { createEditorHTTP } from './http.mjs'
import { createCodexDecisionAgent } from './codex.mjs'
import { createStyleAssistance } from './assistance.mjs'
export async function createEditorService({ root, token, origin, onResume }) {
  const writer = await createStore(root, {
    onResume: onResume,
  })
  let store = writer,
    assistance,
    observer
  try {
    store = await coordinateEditor(root, writer)
    assistance = createStyleAssistance({ store, agent: createCodexDecisionAgent({ root }) })
    observer = observeReferences(root)
    const handler = createEditorHTTP({
      store,
      token,
      origin,
      assistance,
      observation: observer.current,
      exploration: () => explorationSnapshot(root, writer),
      variant: (input) => mutateVariant(root, writer, input),
      contextualStyle: (input) => saveContextualStyle(root, input, () => writer.snapshot(), writer),
      figma: (input) => workspaceFigma(root, writer, input),
      planning: (input) => workspacePlanning(root, input),
      assistant: (input) => workspaceAssistant(root, input),
    })
    return {
      handler,
      close: async () => {
        observer.close()
        assistance.close()
        await store.close()
      },
    }
  } catch (error) {
    observer?.close()
    assistance?.close()
    await store.close()
    throw error
  }
}
