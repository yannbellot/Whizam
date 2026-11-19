import { expect, test } from 'vitest'
import { workspaceSchema, renameEntity, pagePathSchema } from '../../src/core/workspace-contract'
import { resolvePage, resolveSelection } from '../../src/core/exploration'
const id = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`
const revision = 'a'.repeat(64)
export const model = () =>
  workspaceSchema.parse({
    schemaVersion: 1,
    projectId: id(90),
    revision,
    entities: [
      { id: id(1), kind: 'page', label: 'One', path: '/', revision },
      { id: id(2), kind: 'page', label: 'Two', path: '/two', revision },
      { id: id(3), kind: 'component', sourceKey: 'button', label: 'Button', revision },
      {
        id: id(4),
        kind: 'occurrence',
        label: 'Submit one',
        pageId: id(1),
        definitionId: id(3),
        variantId: null,
        marker: id(8),
        revision,
      },
      {
        id: id(5),
        kind: 'occurrence',
        label: 'Submit two',
        pageId: id(2),
        definitionId: id(3),
        variantId: null,
        marker: id(8),
        revision,
      },
    ],
  })
const report = (markers = [id(8)]) => ({ pageId: id(1), revision, markers })
test('same source marker on two pages resolves to distinct durable occurrences', () => {
  expect(resolveSelection(model(), report(), id(4)).id).toBe(id(4))
  expect(() => resolveSelection(model(), report(), id(5))).toThrow('unavailable')
  expect(resolveSelection(model(), { ...report(), pageId: id(2) }, id(5)).id).toBe(id(5))
})
test('rename and DOM order preserve identity; stale renders cannot select', () => {
  const next = renameEntity(model(), id(4), 'Renamed', 'b'.repeat(64))
  expect(
    resolveSelection(next, { ...report([id(7), id(8)]), revision: next.revision }, id(4)).label,
  ).toBe('Renamed')
  expect(() => resolvePage(next, report())).toThrow('stale-render')
})
test('duplicate, missing and unregistered markers are explicit without a best guess', () => {
  expect(resolvePage(model(), report([id(8), id(8)])).occurrences[0].status).toBe('ambiguous')
  expect(() => resolveSelection(model(), report([id(8), id(8)]), id(4))).toThrow('unavailable')
  expect(resolvePage(model(), report([])).occurrences[0].status).toBe('missing')
  expect(resolvePage(model(), report([id(8), id(7)])).unknown).toBe(1)
  expect(resolvePage(model(), report([id(7)])).coverage).toBe('partial')
})
test('unknown legacy pages remain unmapped and invalid paths are refused', () => {
  for (const path of [
    'https://example.org',
    '//other',
    '/../secret',
    '/ui-lab',
    '/ui-lab/preview',
    '/@fs/file',
    '/.env',
    '/two?x=1',
    '/a%2fb',
    '/a\\b',
  ])
    expect(pagePathSchema.safeParse(path).success).toBe(false)
  const legacy = model()
  delete (legacy.entities[0] as { path?: string }).path
  expect(() => resolvePage(legacy, report())).toThrow('page-unknown')
})
test('duplicate routes, per-page markers and cross-page/cyclic parents fail closed', () => {
  const invalid = (mutate: (m: ReturnType<typeof model>) => void) => {
    const m = model()
    mutate(m)
    expect(workspaceSchema.safeParse(m).success).toBe(false)
  }
  invalid((m) => Object.assign(m.entities[1], { path: '/' }))
  invalid((m) => m.entities.push({ ...m.entities[3], id: id(6) }))
  invalid((m) => Object.assign(m.entities[3], { parentId: id(5) }))
  invalid((m) => Object.assign(m.entities[3], { parentId: id(4) }))
})
