import { contrastRatio } from './draft.ts'

export type UnitContext = {
  rootFontPx?: number
  fontPx?: number
  viewportWidth?: number
  viewportHeight?: number
  containerWidth?: number
  containerHeight?: number
  percentageBase?: number
  // Qualified per-property references for future controls; never inferred from a generic container.
  relativePx?: Partial<
    Record<
      | 'ex'
      | 'cap'
      | 'ch'
      | 'ic'
      | 'lh'
      | 'rex'
      | 'rcap'
      | 'rch'
      | 'ric'
      | 'rlh'
      | 'vi'
      | 'vb'
      | 'svw'
      | 'svh'
      | 'svi'
      | 'svb'
      | 'svmin'
      | 'svmax'
      | 'lvw'
      | 'lvh'
      | 'lvi'
      | 'lvb'
      | 'lvmin'
      | 'lvmax'
      | 'dvw'
      | 'dvh'
      | 'dvi'
      | 'dvb'
      | 'dvmin'
      | 'dvmax'
      | 'cqi'
      | 'cqb'
      | 'cqmin'
      | 'cqmax',
      number
    >
  >
}
const fixed: Record<string, [string, number]> = {
  px: ['length', 1],
  in: ['length', 96],
  cm: ['length', 96 / 2.54],
  mm: ['length', 96 / 25.4],
  q: ['length', 96 / 101.6],
  pt: ['length', 96 / 72],
  pc: ['length', 16],
  ms: ['time', 1],
  s: ['time', 1000],
  deg: ['angle', 1],
  rad: ['angle', 180 / Math.PI],
  turn: ['angle', 360],
  grad: ['angle', 0.9],
  dpi: ['resolution', 1],
  dppx: ['resolution', 96],
  dpcm: ['resolution', 2.54],
}
export function convertUnit(value: number, from: string, to: string, context: UnitContext = {}) {
  from = from.toLowerCase()
  to = to.toLowerCase()
  if (!Number.isFinite(value)) throw new Error('Valeur non finie.')
  const factor = (unit: string): [string, number] => {
    if (Object.hasOwn(fixed, unit)) return fixed[unit]
    const contextual: Record<string, number | undefined> = {
      rem: context.rootFontPx,
      em: context.fontPx,
      vw: context.viewportWidth && context.viewportWidth / 100,
      vh: context.viewportHeight && context.viewportHeight / 100,
      vmin:
        context.viewportWidth && context.viewportHeight
          ? Math.min(context.viewportWidth, context.viewportHeight) / 100
          : undefined,
      vmax:
        context.viewportWidth && context.viewportHeight
          ? Math.max(context.viewportWidth, context.viewportHeight) / 100
          : undefined,
      cqw: context.containerWidth && context.containerWidth / 100,
      cqh: context.containerHeight && context.containerHeight / 100,
      '%': context.percentageBase && context.percentageBase / 100,
      ratio: context.fontPx,
    }
    const result =
      contextual[unit] ?? context.relativePx?.[unit as keyof NonNullable<UnitContext['relativePx']>]
    if (result === undefined || !Number.isFinite(result) || result <= 0)
      throw new Error('Référence de conversion absente ou unité non prise en charge.')
    return ['length', result]
  }
  const [sourceKind, source] = factor(from),
    [targetKind, target] = factor(to)
  if (sourceKind !== targetKind) throw new Error('Unités incompatibles.')
  const result = (value * source) / target
  if (!Number.isFinite(result)) throw new Error('Conversion non représentable.')
  return result
}

// Oklab matrices: Björn Ottosson, https://bottosson.github.io/posts/oklab/ (public domain).
type Lab = [number, number, number]
function rgb(value: string): number[] {
  const match = /^#([a-f\d]{6})$/i.exec(value)
  if (!match) throw new Error('Couleur opaque hexadécimale requise.')
  return [0, 2, 4].map((i) => parseInt(match[1].slice(i, i + 2), 16) / 255)
}
function lab(value: string): Lab {
  const [r, g, b] = rgb(value).map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ]
}
function linear([L, a, b]: Lab) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]
}
function hexAt(L: number, original: Lab) {
  let low = 0,
    high = 1
  const at = (scale: number) => linear([L, original[1] * scale, original[2] * scale])
  const inside = (values: number[]) => values.every((v) => v >= -1e-7 && v <= 1 + 1e-7)
  if (inside(at(1))) low = 1
  else
    for (let i = 0; i < 24; i++) {
      const middle = (low + high) / 2
      if (inside(at(middle))) low = middle
      else high = middle
    }
  return (
    '#' +
    at(low)
      .map((v) => {
        v = Math.max(0, Math.min(1, v))
        const encoded = v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055
        return Math.round(encoded * 255)
          .toString(16)
          .padStart(2, '0')
      })
      .join('')
  )
}
export function correctContrast(color: string, surfaces: string[], threshold: number) {
  if (
    !Number.isFinite(threshold) ||
    threshold < 1 ||
    threshold > 21 ||
    !surfaces.length ||
    surfaces.length > 8
  )
    throw new Error('Mesure de contraste indisponible.')
  const origin = lab(color)
  surfaces.forEach(rgb)
  const passes = (value: string) =>
    surfaces.every((surface) => (contrastRatio(value, surface) ?? 0) >= threshold)
  if (passes(color)) return color
  let best: string | null = null,
    distance = Infinity
  // Bounded search in both lightness directions; rank the serialized, measured colors.
  const examine = (L: number) => {
    const value = hexAt(L, origin)
    if (!passes(value)) return
    const next = lab(value)
    const delta = next.reduce((sum, v, i) => sum + (v - origin[i]) ** 2, 0)
    if (delta < distance) {
      distance = delta
      best = value
    }
  }
  for (let i = 0; i <= 1000; i++) examine(i / 1000)
  if (best) {
    const center = lab(best)[0]
    for (let i = -100; i <= 100; i++) examine(Math.max(0, Math.min(1, center + i / 100000)))
  }
  if (!best)
    throw new Error(
      'Aucune couleur ne satisfait ce seuil sur toutes les surfaces mesurées. Modifiez aussi le fond ou la paire de couleurs.',
    )
  return best
}
