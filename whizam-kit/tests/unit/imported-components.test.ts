import { describe, it, expect } from 'vitest'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { importedRegistrySchema, resolveImportedUsage } from '../../src/core/imported-components'
import { ImportedComponent } from '../../src/core/ImportedComponent'
const a = 'a'.repeat(24),
  b = 'b'.repeat(24),
  c = 'c'.repeat(24)
const marker = '11111111-1111-4111-8111-111111111111'
const variant = '22222222-2222-4222-8222-222222222222'
const occurrence = '33333333-3333-4333-8333-333333333333'
const definition = (id: string, label: string) => ({
  id,
  label,
  role: 'action',
  fileKey: 'SyntheticFile123',
  nodeId: '2:0',
  sourceHash: id.repeat(3).slice(0, 64),
  rootId: '2:0',
  variants: [],
  nodes: [
    {
      id: '2:0',
      name: label,
      type: 'COMPONENT',
      parentId: null,
      children: [],
      componentId: null,
      componentKey: null,
      values: {},
      contentHash: 'd'.repeat(64),
    },
  ],
})
describe('imported components consumed as real React controls', () => {
  it('resolves local, variant and global replacements in that order and preserves unselected usages', () => {
    const registry = importedRegistrySchema.parse({
      version: 1,
      definitions: [definition(a, 'Original'), definition(b, 'Global'), definition(c, 'Local')],
      redirects: { [a]: b },
      overrides: [
        { sourceDefinitionId: a, targetId: c, marker, variantId: null, occurrenceId: occurrence },
        { sourceDefinitionId: a, targetId: b, marker: null, variantId: variant },
      ],
    })
    expect(resolveImportedUsage(registry, a, marker, variant, occurrence)?.id).toBe(c)
    expect(resolveImportedUsage(registry, a, null, variant)?.id).toBe(b)
    expect(resolveImportedUsage(registry, a, null, null)?.id).toBe(b)
    registry.redirects = {}
    expect(resolveImportedUsage(registry, a, null, null)?.id).toBe(a)
    expect(resolveImportedUsage(registry, a, marker, null, variant)?.id).toBe(a)
    const html = renderToStaticMarkup(
      createElement(ImportedComponent, {
        registry,
        definition: registry.definitions[0],
        'data-loomata-node': marker,
        'data-loomata-occurrence': occurrence,
      } as Parameters<typeof ImportedComponent>[0]),
    )
    expect(html).toContain('<button')
    expect(html).toContain('Local</button>')
    expect(html).not.toContain('Original</button>')
  })
  it('keeps content escaped and exposes a native value-bearing input when the contract is input', () => {
    const registry = importedRegistrySchema.parse({
      version: 1,
      definitions: [{ ...definition(a, '<img src=x onerror=attack()>'), role: 'input' }],
    })
    const html = renderToStaticMarkup(
      createElement(ImportedComponent, {
        registry,
        definition: registry.definitions[0],
        value: 'controlled value',
      }),
    )
    expect(html).toContain('<input')
    expect(html).toContain('value="controlled value"')
    expect(html).not.toContain('<img')
    expect(html).toContain('&lt;img')
  })
})

it('stamps the current page occurrence identity, restores owned attributes and refuses ambiguous roots', async () => {
  const { bindInterface } = await import('../../src/core/interface-binding')
  const { vi } = await import('vitest')
  vi.stubGlobal(
    'MutationObserver',
    class {
      observe() {}
      disconnect() {}
    },
  )
  try {
    const attributes = new Map<string, string>()
    const element = {
      getAttribute: (key: string) => attributes.get(key) ?? null,
      setAttribute: (key: string, value: string) => attributes.set(key, value),
      removeAttribute: (key: string) => attributes.delete(key),
    }
    let count = 1
    const document = {
      documentElement: {},
      querySelectorAll: () => Array.from({ length: count }, () => element),
    } as unknown as Document
    const unbind = bindInterface(document, {
      revision: 'a',
      occurrences: [{ id: occurrence, marker, variantId: variant }],
    })
    expect(attributes.get('data-loomata-occurrence')).toBe(occurrence)
    expect(attributes.get('data-loomata-variant')).toBe(variant)
    unbind()
    expect(attributes.size).toBe(0)
    const unbindSecond = bindInterface(document, {
      revision: 'b',
      occurrences: [{ id: variant, marker, variantId: null }],
    })
    expect(attributes.get('data-loomata-occurrence')).toBe(variant)
    unbindSecond()
    count = 2
    bindInterface(document, {
      revision: 'c',
      occurrences: [{ id: occurrence, marker, variantId: variant }],
    })()
    expect(attributes.size).toBe(0)
  } finally {
    vi.unstubAllGlobals()
  }
})
