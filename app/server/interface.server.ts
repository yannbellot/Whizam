import { readSafe } from '../../scripts/design-editor/files.mjs'
import { workspaceSchema } from '../../src/core/workspace-contract.ts'
import type { RenderedContextualStyle } from '../../src/core/contextual-style-render.ts'

/** Public source bindings only. Never expose the workspace file, decisions or private state. */
export async function readInterfaceView(root: string, pathname: string) {
  try {
    const marker = JSON.parse((await readSafe(root, 'loomata.project.json')).bytes.toString('utf8'))
    if (marker.version !== 1 || marker.phase !== 'created') return null
    const model = workspaceSchema.parse(
      JSON.parse(
        (await readSafe(root, 'loomata/workspace.json', 8 * 1024 * 1024)).bytes.toString('utf8'),
      ),
    )
    if (model.projectId !== marker.id) throw new Error('interface-project-mismatch')
    const page = model.entities.find((e) => e.kind === 'page' && e.path === pathname)
    const contextualStyles: RenderedContextualStyle[] = []
    if (!page && !contextualStyles.length) return null
    return {
      revision: model.revision,
      contextualStyles,
      occurrences: model.entities.flatMap((e) =>
        e.kind === 'occurrence' && e.pageId === page?.id && e.marker
          ? [{ id: e.id, marker: e.marker, variantId: e.variantId }]
          : [],
      ),
    }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null
    // Inconsistent public bindings are not guessed, nor returned as a successful empty inventory.
    throw new Error('Correspondances de page incohérentes. Les sources sont conservées.')
  }
}
