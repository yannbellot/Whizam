import { describe, expect, test } from 'vitest'
import { resolveTokenValues } from '../../src/design-system/token-resolution'

const primitives = [{ id: 'primitive.color.blue', type: 'color', value: '#1d4ed8' }]
const token = {
  id: 'semantic.color.action',
  type: 'color',
  value: { reference: 'primitive.color.blue' },
}

describe('semantic token resolution', () => {
  test('resolves direct references and aliases from one primitive', () => {
    const result = resolveTokenValues(primitives, [
      token,
      { ...token, id: 'semantic.color.alias', value: { reference: token.id } },
    ])
    expect(result.map((t) => t.value)).toEqual(['#1d4ed8', '#1d4ed8'])
    expect(result[0].variable).toBe('--adl-color-action')
  })
  test('rejects unknown references', () =>
    expect(() => resolveTokenValues([], [token])).toThrow('Unknown token'))
  test('rejects mismatched types', () =>
    expect(() => resolveTokenValues(primitives, [{ ...token, type: 'dimension' }])).toThrow(
      'type mismatch',
    ))
  test('rejects cycles', () =>
    expect(() => resolveTokenValues([], [{ ...token, value: { reference: token.id } }])).toThrow(
      'cycle',
    ))
  test('rejects duplicate ids and collapsed CSS names', () => {
    expect(() => resolveTokenValues(primitives, [token, token])).toThrow('Duplicate')
    expect(() =>
      resolveTokenValues(primitives, [
        { ...token, id: 'semantic.color.a-b' },
        { ...token, id: 'semantic.color-a.b' },
      ]),
    ).toThrow('collision')
  })
})
