import { expect, test } from 'vitest'
import { convertUnit, correctContrast } from '../../src/design-system/editor/value-tools'
import { contrastRatio } from '../../src/design-system/editor/draft'

test('unit conversion preserves magnitude with actual context and dimensions', () => {
  expect(convertUnit(1, 'rem', 'px', { rootFontPx: 16 })).toBe(16)
  expect(convertUnit(1, 'rem', 'px', { rootFontPx: 20 })).toBe(20)
  expect(convertUnit(24, 'px', 'rem', { rootFontPx: 16 })).toBe(1.5)
  expect(convertUnit(1, 's', 'ms')).toBe(1000)
  expect(convertUnit(1, 'turn', 'deg')).toBe(360)
  expect(convertUnit(1, 'dppx', 'dpi')).toBe(96)
  expect(convertUnit(50, '%', 'px', { percentageBase: 200 })).toBe(100)
  expect(convertUnit(2, 'ch', 'px', { relativePx: { ch: 8 } })).toBe(16)
  expect(convertUnit(1.5, 'ratio', 'px', { fontPx: 16 })).toBe(24)
  expect(convertUnit(10, 'vw', 'px', { viewportWidth: 1000 })).toBe(100)
  expect(() => convertUnit(1, 'rem', 'px')).toThrow(/Référence/)
  expect(() => convertUnit(1, 's', 'px')).toThrow(/incompatibles/)
  expect(() => convertUnit(1, 'fr', 'px')).toThrow(/Référence/)
})

test('contrast solver checks serialized colors at AA and AAA and retains compliant originals', () => {
  for (const [color, surfaces, threshold] of [
    ['#aaaaaa', ['#ffffff'], 4.5],
    ['#1d4ed8', ['#ffffff'], 7],
    ['#555555', ['#000000'], 4.5],
    ['#ff0000', ['#ffffff'], 7],
    ['#888888', ['#ffffff', '#000000'], 4.5],
  ] as [string, string[], number][]) {
    const result = correctContrast(color, surfaces, threshold)
    for (const surface of surfaces)
      expect(contrastRatio(result, surface)!).toBeGreaterThanOrEqual(threshold)
    expect(correctContrast(result, surfaces, threshold)).toBe(result)
  }
  expect(correctContrast('#000000', ['#ffffff'], 4.5)).toBe('#000000')
  expect(() => correctContrast('#777777', ['#777777'], 7)).toThrow(/Aucune couleur/)
  expect(() => correctContrast('#777777', [], 4.5)).toThrow(/indisponible/)
})
