import type { ValueType } from './contract'
import naming from './naming-rules.generated.json' with { type: 'json' }

const rules = naming.tokenNaming
const lookup = (entries: Record<string, string>, key: string) =>
  Object.hasOwn(entries, key) ? entries[key] : undefined
function render(template: string, segments: Record<string, string>): string {
  return template.replace(/\{([a-z]+)\}/g, (_, key: string) => {
    if (!Object.hasOwn(segments, key)) throw new Error('unknown-naming-segment')
    return segments[key]
  })
}

export const semanticTemplate = rules.semantic.template
export function primitiveFamily(type: ValueType, role: string): string {
  const family =
    type === 'dimension'
      ? lookup(rules.primitive.dimensionFamilies, role)
      : lookup(rules.primitive.typeFamilies, type)
  if (!family) throw new Error('unknown-primitive-family')
  return family
}

/** Lossless for the closed scalar domains; units are never converted. */
export function primitiveName(family: string, value: string | number): string {
  let suffix: string
  if (family === rules.primitive.typeFamilies.color) {
    if (typeof value !== 'string' || !/^#[a-f0-9]{6}(?:[a-f0-9]{2})?$/.test(value))
      throw new Error('non-canonical-value')
    suffix = `${rules.primitive.valuePrefixes.color}-${value.slice(1)}`
  } else if (family === rules.primitive.typeFamilies['font-family']) {
    if (typeof value !== 'string' || !/^[A-Za-z][A-Za-z0-9 ,_-]{0,150}$/.test(value))
      throw new Error('non-canonical-value')
    suffix =
      rules.primitive.valuePrefixes.fontStack +
      '-' +
      Array.from(value, (c) => c.charCodeAt(0).toString(16).padStart(2, '0')).join('')
  } else if (typeof value === 'number' && Number.isFinite(value)) {
    suffix = `${family === rules.primitive.typeFamilies['font-weight'] ? rules.primitive.valuePrefixes.fontWeight : rules.primitive.valuePrefixes.ratio}-${String(value).replace('-', 'neg-').replace('.', '-')}`
  } else {
    const match = typeof value === 'string' && /^(-?\d+(?:\.\d{1,6})?)(px|rem)$/.exec(value)
    if (!match || `${Number(match[1])}${match[2]}` !== value) throw new Error('non-canonical-value')
    suffix = `${match[2]}-${match[1].replace('-', 'neg-').replace('.', '-')}`
  }
  const id = render(rules.primitive.template, { family, value: suffix })
  if (id.length > rules.primitive.maxLength) throw new Error('identifier-too-long')
  return id
}

/** Category remains semantic metadata; only useful distinctions enter the usage path. */
export function semanticName(style: {
  type: ValueType
  role: string
  intention: string
  state: string
}): string {
  const [category, intention] = style.intention.split('.')
  const semantic = rules.semantic
  const role = lookup(semantic.roleNames, style.role) ?? style.role
  const domain =
    style.type === 'color'
      ? semantic.domains.color
      : primitiveFamily(style.type, style.role).startsWith('type.')
        ? semantic.domains.typography
        : semantic.domains.geometry
  const categoryName = lookup(semantic.categoryNames, category) ?? category
  const templates: Record<string, Record<string, string>> = semantic.categoryUsageTemplates
  const override = Object.hasOwn(templates, category) ? templates[category] : undefined
  const template = override
    ? (lookup(override, domain) ?? override.default)
    : semantic.usageTemplate
  const usage = render(template, { category: categoryName, intention, role })
  return render(semantic.template, { domain, usage, state: style.state })
}

export function componentName(binding: {
  target: string
  variant: string
  part: string
  property: string
  state: string
}): string {
  return render(rules.component.template, {
    component: binding.target,
    variant: binding.variant,
    part: binding.part,
    property: binding.property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`),
    state: binding.state,
  })
}
