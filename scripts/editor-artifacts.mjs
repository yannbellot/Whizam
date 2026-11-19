import { fontCatalog, fontDirectory } from './design-editor/fonts.mjs'
import { compositionArtifacts } from './ui-composition.mjs'
import { validateDesignSystem } from './validate-design-system.mjs'
import { isDtcgRoot, loadCanonicalEditorModel } from './validate-editor-contract.mjs'
import { generateEditorTokenArtifacts } from '../src/design-system/token-resolution.ts'
import { createEditorSnapshot } from './editor-snapshot.mjs'
import { documentationPaths, renderEditorDocumentation } from './editor-documentation.mjs'
import { variantArtifacts } from './variant-recipes.mjs'
import { projectTheme, validateProjectConsumers } from './project-theme.mjs'
import { loadTokens } from './dtcg-tokens.mjs'
import { readVisualTokenStyles } from './visual-tokens.mjs'
export const derivedPaths = [
  'src/styles/tokens.generated.css',
  'src/design-system/tokens.generated.ts',
  'src/design-system/editor/snapshot.generated.ts',
  'public/editor-snapshot.generated.json',
  ...documentationPaths,
  'src/styles/project-theme.generated.css',
]
export async function prepareEditorArtifacts(root) {
  await validateDesignSystem(root, { quiet: true })
  const input = await loadCanonicalEditorModel(root)
  const artifacts = generateEditorTokenArtifacts(
    input.model,
    input.context.contract,
    input.authorities['semantic-tokens'].tokens,
  )
  const theme = projectTheme(input.model, input.context.contract)
  await validateProjectConsumers(root, theme.utilities)
  const snapshot = await createEditorSnapshot(root, input)
  const composition = await compositionArtifacts(root)
  const variants = await variantArtifacts(root, snapshot)
  const definitionStyles = (await isDtcgRoot(root))
    ? readVisualTokenStyles((await loadTokens(root)).document)
    : []
  const texts = [
    artifacts.css +
      composition.css +
      variants.css +
      fontCatalog.families
        .map(
          (font) =>
            `\n@font-face { font-family: "${font.cssFamily}"; font-style: normal; font-weight: ${font.minWeight} ${font.maxWeight}; font-display: swap; src: url("/${fontDirectory(font).replace('public/', '')}/font.ttf") format("truetype"); }\n`,
        )
        .join(''),
    `// Generated; do not edit.\nimport type { RenderedContextualStyle } from '../core/contextual-style'\nexport const tokens = ${JSON.stringify(artifacts.legacy, null, 2)} as const\nexport const styles = ${JSON.stringify(artifacts.styles, null, 2)} as const\nexport const componentTokens = ${JSON.stringify(artifacts.bindings, null, 2)} as const\nexport const primitiveSamples: Record<string, string> = ${JSON.stringify(composition.primitiveSamples, null, 2)}\nexport const definitionStyles: RenderedContextualStyle[] = ${JSON.stringify(definitionStyles)}\n`,
    `// Generated; do not edit.\nimport type { EditorSnapshot } from './snapshot'\nexport const snapshot: EditorSnapshot = ${JSON.stringify(snapshot)}\n`,
    JSON.stringify(snapshot),
    ...renderEditorDocumentation(snapshot, artifacts),
    theme.css,
  ]
  return {
    snapshot,
    outputs: new Map(derivedPaths.map((file, index) => [file, Buffer.from(texts[index])])),
  }
}
