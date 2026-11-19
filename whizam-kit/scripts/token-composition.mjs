import { readTokens, tokenCSS } from './dtcg-tokens.mjs'

const words = new Set(
  'auto collapse currentColor min max minmax repeat auto-fit calc clamp linear-gradient to top right transparent solid translateX translate background transform uppercase'.split(
    ' ',
  ),
)
const fail = (code) => {
  throw new Error(code)
}
/** Recipes are closed CSS grammar with typed primitive or decision parameters, never opaque tokens. */
export function projectComposition(document, rules) {
  if (rules.schemaVersion !== 2 || !Array.isArray(rules.recipes) || !Array.isArray(rules.outputs))
    fail('invalid-composition-version')
  const { entries, ids } = readTokens(document)
  const samplePrefix = 'component.composition.catalog.primitive-sample'
  if (rules.primitiveColorSamples?.tokenPrefix !== samplePrefix)
    fail('invalid-primitive-sample-rule')
  const colours = entries.filter(
    (e) => e.meta.collection === 'editor' && e.meta.kind === 'primitive' && e.type === 'color',
  )
  const samples = entries.filter((e) => e.meta.collection === 'sample')
  if (
    samples.length !== colours.length ||
    colours.some((e) => ids.get(samplePrefix + '.' + e.id)?.reference !== e.id)
  )
    fail('incomplete-primitive-samples')
  const seen = new Set(entries.map((entry) => entry.id))
  const primitives = entries
    .filter((e) => e.meta.collection === 'composition' && e.meta.kind === 'primitive')
    .map((e) => ({
      id: e.id,
      value: tokenCSS(e.type, e.value),
      provenance: e.meta.provenance,
      order: e.meta.order,
    }))
  const tokens = entries
    .filter((e) => e.meta.collection === 'composition' && e.meta.kind === 'component')
    .map((e) => ({ id: e.id, reference: e.reference, ...e.meta.consumer, order: e.meta.order }))
  const recipeIds = new Set()
  for (const recipe of rules.recipes) {
    if (
      !/^primitive\.composition\.[a-z0-9-]+$/.test(recipe.id) ||
      seen.has(recipe.id) ||
      !Array.isArray(recipe.parts) ||
      recipe.parts.length < 1 ||
      recipe.parts.length > 256
    )
      fail('invalid-css-recipe')
    seen.add(recipe.id)
    recipeIds.add(recipe.id)
    let value = ''
    for (const part of recipe.parts) {
      if (typeof part === 'string') {
        if (
          part.length > 200 ||
          !/^[a-zA-Z\s(),+*/.-]*$/.test(part) ||
          [...part.matchAll(/[a-zA-Z][a-zA-Z-]*/g)].some(([word]) => !words.has(word))
        )
          fail('unprepared-css-recipe-grammar')
        value += part
      } else {
        if (
          !part ||
          typeof part !== 'object' ||
          Object.keys(part).some((key) => !['reference', 'unit'].includes(key))
        )
          fail('invalid-css-recipe-parameter')
        const token = ids.get(part.reference)
        if (!token || !['primitive', 'decision'].includes(token.meta.kind))
          fail('invalid-css-recipe-reference')
        if (
          part.unit !== undefined &&
          (!['em', 'vh', 'vw', 'fr', '%'].includes(part.unit) || token.type !== 'number')
        )
          fail('invalid-css-recipe-unit')
        value += tokenCSS(token.type, token.value) + (part.unit ?? '')
      }
    }
    if (!value || /[;{}]|var\(|url\(|@/i.test(value)) fail('invalid-css-recipe-value')
    primitives.push({ id: recipe.id, value, provenance: recipe.provenance, order: recipe.order })
  }
  for (const output of rules.outputs) {
    if (
      !/^component\.composition\.[a-z0-9.-]+$/.test(output.id) ||
      seen.has(output.id) ||
      !recipeIds.has(output.reference)
    )
      fail('invalid-css-recipe-output')
    seen.add(output.id)
    tokens.push(output)
  }
  const order = (a, b) => (a.order ?? 0) - (b.order ?? 0)
  const stripOrder = ({ order: removedOrder, ...entry }) => entry
  return {
    data: {
      schemaVersion: 1,
      primitiveColorSamples: rules.primitiveColorSamples,
      primitives: primitives.sort(order).map(stripOrder),
      tokens: tokens.sort(order).map(stripOrder),
    },
    decisions: entries
      .filter((e) => e.meta.collection === 'composition' && e.meta.kind === 'decision')
      .map((e) => ({ id: e.id, reference: e.reference })),
    parameters: entries
      .filter((e) => e.meta.collection === 'parameter')
      .map((e) => ({ id: e.id, value: tokenCSS(e.type, e.value) })),
  }
}
