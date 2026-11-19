import { test, expect } from 'vitest'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { PrimitiveCatalog } from '../../src/design-system/PrimitiveCatalog'
import { inventory } from '../../src/design-system/tokens.generated'
test('primitive catalogue exposes canonical values without editing controls', () => {
  const html = renderToStaticMarkup(createElement(PrimitiveCatalog))
  for (const e of inventory.filter((e) => e.kind === 'primitive')) expect(html).toContain(e.id)
  expect(html).not.toMatch(/<input|<button|contenteditable/)
})
