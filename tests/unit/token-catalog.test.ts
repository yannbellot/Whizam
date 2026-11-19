import { test, expect } from 'vitest'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { TokenCatalog } from '../../src/design-system/TokenCatalog'
import { inventory } from '../../src/design-system/tokens.generated'
test('catalogue shows every component/page token exactly once and no semantic layer', () => {
  const html = renderToStaticMarkup(createElement(TokenCatalog))
  const rows = inventory.filter((e) => e.kind !== 'primitive')
  expect(html.match(/scope="row"/g)).toHaveLength(rows.length)
  for (const e of rows) expect(html).toContain(e.id)
  expect(html).not.toMatch(/<input|<button|Decision Tokens|Apparence/)
})
test('component catalogue filters the component owner', () => {
  const html = renderToStaticMarkup(
    createElement(TokenCatalog, { category: 'Component tokens / Button' }),
  )
  expect(html).toContain('component.button.default')
  expect(html).not.toContain('component.field.')
})
