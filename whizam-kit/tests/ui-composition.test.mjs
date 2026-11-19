import { test } from 'node:test'
import assert from 'node:assert/strict'
import { compositionArtifacts, assertTokenizedCSS } from '../scripts/ui-composition.mjs'
import { fileURLToPath } from 'node:url'
test('composition tokens resolve to existing authorities and declared consumers', async () => {
  const result = await compositionArtifacts(fileURLToPath(new URL('..', import.meta.url)))
  assert.equal(result.data.tokens.length, 148)
  assert.match(result.css, /--adl-component-composition-/)
  assert(result.primitiveSamples['primitive.color.hex-ffffff'])
  assert(
    result.css.includes(
      `${result.primitiveSamples['primitive.color.hex-ffffff']}: var(--adl-primitive-color-hex-ffffff)`,
    ),
  )
})
test('UI visual values require a token and refuse primitive consumption', () => {
  assert.throws(() => assertTokenizedCSS('.a{color:#fff}'), /Untokenized/)
  assert.throws(() => assertTokenizedCSS('.a{color:var(--adl-component-a,red)}'), /Untokenized/)
  assert.throws(
    () => assertTokenizedCSS('.a{padding:20px var(--adl-component-a-gap)}'),
    /Untokenized/,
  )
  assert.throws(
    () => assertTokenizedCSS('.a{color:var(--adl-primitive-color-hex-ffffff)}'),
    /Direct primitive/,
  )
  assertTokenizedCSS('.a{display:grid;margin:0 auto;color:var(--adl-component-a-text-default)}')
})

test('tool chrome only accepts declared tool decisions', () => {
  const variables = new Set(['--loomata-ui-surface'])
  assertTokenizedCSS('.tool{background:var(--loomata-ui-surface)}', 'tool.css', variables)
  assert.throws(
    () => assertTokenizedCSS('.tool{color:var(--loomata-ui-unknown)}', 'tool.css', variables),
    /Untokenized/,
  )
  assert.throws(
    () =>
      assertTokenizedCSS('.tool{color:var(--loomata-ui-primitive-surface)}', 'tool.css', variables),
    /Direct primitive/,
  )
  assert.throws(
    () => assertTokenizedCSS('.tool{color:var(--loomata-ui-surface, red)}', 'tool.css', variables),
    /Untokenized/,
  )
})
