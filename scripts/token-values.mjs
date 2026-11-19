const object = (v) => v !== null && typeof v === 'object' && !Array.isArray(v)
const fail = (code) => {
  throw new Error(code)
}
const finite = (v) => typeof v === 'number' && Number.isFinite(v)
const exact = (v, keys) => object(v) && Object.keys(v).every((k) => keys.includes(k))
const types = new Set([
  'color',
  'dimension',
  'fontFamily',
  'fontWeight',
  'number',
  'duration',
  'cubicBezier',
  'strokeStyle',
  'border',
  'shadow',
])
const kinds = new Set(['primitive', 'decision', 'component', 'alias'])
const collections = new Set([
  'editor',
  'composition',
  'compatibility',
  'sample',
  'parameter',
  'visual',
])
const stableId = /^[a-z][a-z0-9-]*(?:\.[a-z0-9][a-z0-9-]*)+$/
const editorTypes = {
  color: 'color',
  dimension: 'dimension',
  'font-family': 'fontFamily',
  'font-weight': 'fontWeight',
  'line-height': 'number',
}
export function validateTokenValue(type, value) {
  if (!types.has(type)) fail('unsupported-dtcg-type')
  let valid = false
  if (type === 'number') valid = finite(value)
  if (type === 'fontWeight') valid = finite(value) && value >= 1 && value <= 1000
  if (type === 'fontFamily')
    valid =
      (typeof value === 'string' && value.length > 0) ||
      (Array.isArray(value) &&
        value.length > 0 &&
        value.every((v) => typeof v === 'string' && v.length > 0))
  if (type === 'strokeStyle')
    valid = ['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'outset', 'inset'].includes(
      value,
    )
  if (type === 'dimension' || type === 'duration')
    valid =
      exact(value, ['value', 'unit']) &&
      finite(value.value) &&
      (type === 'dimension' ? ['px', 'rem'] : ['ms', 's']).includes(value.unit) &&
      (type !== 'duration' || value.value >= 0)
  if (type === 'cubicBezier')
    valid =
      Array.isArray(value) &&
      value.length === 4 &&
      value.every(finite) &&
      [value[0], value[2]].every((v) => v >= 0 && v <= 1)
  if (type === 'color')
    valid =
      exact(value, ['colorSpace', 'components', 'alpha']) &&
      value.colorSpace === 'srgb' &&
      Array.isArray(value.components) &&
      value.components.length === 3 &&
      value.components.every((v) => finite(v) && v >= 0 && v <= 1) &&
      (value.alpha === undefined || (finite(value.alpha) && value.alpha >= 0 && value.alpha <= 1))
  if (type === 'border') {
    valid = exact(value, ['width', 'style', 'color'])
    if (valid) {
      validateTokenValue('dimension', value.width)
      validateTokenValue('strokeStyle', value.style)
      validateTokenValue('color', value.color)
    }
  }
  if (type === 'shadow') {
    const shadows = Array.isArray(value) ? value : [value]
    valid =
      shadows.length > 0 &&
      shadows.every(
        (v) =>
          exact(v, ['color', 'offsetX', 'offsetY', 'blur', 'spread', 'inset']) &&
          (v.inset === undefined || typeof v.inset === 'boolean'),
      )
    if (valid)
      for (const shadow of shadows) {
        validateTokenValue('color', shadow.color)
        for (const key of ['offsetX', 'offsetY', 'blur', 'spread'])
          validateTokenValue('dimension', shadow[key])
        if (shadow.blur.value < 0) fail('invalid-dtcg-value')
      }
  }
  if (!valid) fail('invalid-dtcg-value')
}

export function colorValue(css) {
  if (css === 'white') css = '#ffffff'
  if (/^#[a-f0-9]{6}(?:[a-f0-9]{2})?$/i.test(css))
    return {
      colorSpace: 'srgb',
      components: [1, 3, 5].map((i) => parseInt(css.slice(i, i + 2), 16) / 255),
      ...(css.length === 9 ? { alpha: parseInt(css.slice(7, 9), 16) / 255 } : {}),
    }
  const match = /^rgb\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+)(%)?)?\s*\)$/.exec(css)
  if (!match) fail('unsupported-css-color')
  const value = {
    colorSpace: 'srgb',
    components: match.slice(1, 4).map((v) => Number(v) / 255),
    ...(match[4] === undefined ? {} : { alpha: Number(match[4]) / (match[5] ? 100 : 1) }),
  }
  validateTokenValue('color', value)
  return value
}
export function dimensionValue(css) {
  if (css === '0') return { value: 0, unit: 'px' }
  const match = /^(-?\d+(?:\.\d+)?)(px|rem)$/.exec(css)
  if (!match) fail('unsupported-css-dimension')
  return { value: Number(match[1]), unit: match[2] }
}
export function editorValue(type, value) {
  const dtcgType = editorTypes[type]
  const dtcgValue =
    type === 'color'
      ? colorValue(value)
      : type === 'dimension'
        ? dimensionValue(value)
        : type === 'font-family'
          ? value.split(',').map((v) => v.trim())
          : value
  validateTokenValue(dtcgType, dtcgValue)
  return { type: dtcgType, value: dtcgValue }
}
const decimal = (v) => String(Number(v.toFixed(10)))
export function tokenCSS(type, value) {
  validateTokenValue(type, value)
  if (type === 'dimension' || type === 'duration') return `${value.value}${value.unit}`
  if (type === 'number' || type === 'fontWeight') return String(value)
  if (type === 'fontFamily')
    return (Array.isArray(value) ? value : [value])
      .map((family) => (/^[-a-zA-Z][a-zA-Z0-9-]*$/.test(family) ? family : JSON.stringify(family)))
      .join(', ')
  if (type === 'strokeStyle') return value
  if (type === 'cubicBezier') return `cubic-bezier(${value.join(', ')})`
  if (type === 'color') {
    const channels = value.components.map((v) => v * 255)
    if ((value.alpha ?? 1) === 1 && channels.every((v) => Math.abs(v - Math.round(v)) < 1e-9))
      return '#' + channels.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')
    return `rgb(${channels.map(decimal).join(' ')} / ${value.alpha ?? 1})`
  }
  if (type === 'border')
    return `${tokenCSS('dimension', value.width)} ${value.style} ${tokenCSS('color', value.color)}`
  if (type === 'shadow')
    return (Array.isArray(value) ? value : [value])
      .map(
        (v) =>
          `${v.inset ? 'inset ' : ''}${['offsetX', 'offsetY', 'blur', 'spread'].map((key) => tokenCSS('dimension', v[key])).join(' ')} ${tokenCSS('color', v.color)}`,
      )
      .join(', ')
  fail('unsupported-dtcg-type')
}
