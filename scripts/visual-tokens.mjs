import { createHash } from 'node:crypto'
import { z } from 'zod'
import { canonicalJSON } from '../src/design-system/editor/canonical-json.ts'
import { projectTransaction } from '../src/design-system/editor/operations.ts'
import { contextualStyleRequest } from '../src/core/contextual-style.ts'
import { identitySchema, revisionSchema } from '../src/core/workspace-contract.ts'
import {
  cssProperties,
  visualCssValue,
  visualFourValueProperties,
} from '../src/core/visual-properties.ts'
import {
  buildTokenDocument,
  colorValue,
  readTokens,
  tokenCSS,
  tokenExtension,
  updateEditorTokens,
} from './dtcg-tokens.mjs'

const identifier = z.string().regex(/^[a-z][a-z0-9-]{0,79}$/)
export const visualWriteSchema = z.strictObject({
  protocolVersion: z.literal(7),
  requestId: identitySchema,
  baseRevision: revisionSchema,
  document: z.record(z.string(), z.unknown()),
  previousStyles: z
    .string()
    .max(1024 * 1024)
    .nullable(),
  nextStyles: z
    .string()
    .max(1024 * 1024)
    .nullable(),
})
const lengthUnits = [
  'px',
  'rem',
  'em',
  '%',
  'vh',
  'vw',
  'ch',
  'ex',
  'fr',
  'dvh',
  'dvw',
  'vmin',
  'vmax',
]
const keywords = [
  'auto',
  'none',
  'normal',
  'thin',
  'medium',
  'thick',
  'min-content',
  'max-content',
  'fit-content',
  'solid',
  'dashed',
  'dotted',
  'double',
  'groove',
  'ridge',
  'inset',
  'outset',
  'hidden',
  'block',
  'inline',
  'inline-block',
  'flex',
  'inline-flex',
  'grid',
  'inline-grid',
  'contents',
  'flow-root',
  'row',
  'column',
  'row-reverse',
  'column-reverse',
  'nowrap',
  'wrap',
  'wrap-reverse',
  'stretch',
  'start',
  'center',
  'end',
  'baseline',
  'space-between',
  'space-around',
  'space-evenly',
  'flex-start',
  'flex-end',
  'left',
  'right',
  'justify',
  'match-parent',
  'bold',
  'bolder',
  'lighter',
  'subgrid',
]
const keywordProperties = {
  display: [
    'none',
    'block',
    'inline',
    'inline-block',
    'flex',
    'inline-flex',
    'grid',
    'inline-grid',
    'contents',
    'flow-root',
  ],
  'flex-direction': ['row', 'column', 'row-reverse', 'column-reverse'],
  'flex-wrap': ['nowrap', 'wrap', 'wrap-reverse'],
  'align-items': [
    'normal',
    'stretch',
    'start',
    'center',
    'end',
    'baseline',
    'flex-start',
    'flex-end',
  ],
  'justify-content': [
    'normal',
    'stretch',
    'start',
    'center',
    'end',
    'space-between',
    'space-around',
    'space-evenly',
    'flex-start',
    'flex-end',
    'left',
    'right',
  ],
  'text-align': ['start', 'center', 'end', 'left', 'right', 'justify', 'match-parent'],
  'font-weight': ['normal', 'bold', 'bolder', 'lighter'],
  'line-height': ['normal'],
  'letter-spacing': ['normal'],
  'box-shadow': ['none'],
}
const functionNames = ['minmax', 'fit-content', 'repeat', 'min', 'max', 'clamp', 'calc']
const recipeAtom = z.strictObject({
  token: z
    .string()
    .regex(/^component\.[a-z0-9.-]+$/)
    .max(240),
  unit: z.enum(lengthUnits).optional(),
  keyword: z.literal(true).optional(),
  prefix: z
    .string()
    .regex(/^(?:[ (),/*+-]|minmax\(|fit-content\(|repeat\(|min\(|max\(|clamp\(|calc\()*$/)
    .max(80)
    .optional(),
})
const recipeSchema = z.strictObject({
  atoms: z.array(recipeAtom).min(1).max(24),
  suffix: z.string().regex(/^\)*$/).max(12).optional(),
})
const visualRulesSchema = z
  .array(
    z.strictObject({
      owner: identifier,
      variant: identifier,
      part: identifier,
      state: contextualStyleRequest.shape.state,
      condition: contextualStyleRequest.shape.condition,
      declarations: z.record(
        z.string().refine((name) => cssProperties.includes(name)),
        recipeSchema,
      ),
    }),
  )
  .max(600)

const ruleKey = ({ owner, variant, part, state, condition }) =>
  JSON.stringify([owner, variant, part, state, condition])
const digest = (value) =>
  createHash('sha256').update(canonicalJSON(value)).digest('hex').slice(0, 32)
const unrepresentable = () => {
  throw new Error('visual-token-value-unsupported')
}

function color(text) {
  if (text === 'transparent') return { colorSpace: 'srgb', components: [0, 0, 0], alpha: 0 }
  if (/^#[0-9a-f]{3,8}$/i.test(text)) {
    let hex = text.slice(1)
    if (hex.length === 3 || hex.length === 4) hex = [...hex].map((ch) => ch + ch).join('')
    if (hex.length === 6 || hex.length === 8) {
      const value = colorValue('#' + hex.slice(0, 6))
      if (hex.length === 8) value.alpha = parseInt(hex.slice(6), 16) / 255
      return value
    }
  }
  const commaColor =
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+%?))?\s*\)$/.exec(text)
  if (commaColor) {
    const [, r, g, b, alpha] = commaColor
    return colorValue(`rgb(${r} ${g} ${b}${alpha === undefined ? '' : ' / ' + alpha})`)
  }
  return colorValue(text)
}

function shadow(text) {
  return text.split(/,(?![^()]*\))/).map((layer) => {
    const words = layer.match(/(?:rgb|rgba)\([^()]+\)|[^\s]+/g) ?? []
    const lengths = []
    let paint,
      inset = false
    for (const word of words) {
      if (word === 'inset' && !inset) inset = true
      else if (/^[-+]?(?:\d+\.?\d*|\.\d+)(?:px|rem)?$/.test(word)) lengths.push(dimension(word))
      else if (!paint) paint = color(word)
      else unrepresentable()
    }
    if (!paint || lengths.length < 2 || lengths.length > 4) unrepresentable()
    const [offsetX, offsetY, blur = dimension('0'), spread = dimension('0')] = lengths
    return { color: paint, offsetX, offsetY, blur, spread, ...(inset ? { inset } : {}) }
  })
}

function dimension(text) {
  const match = /^([-+]?(?:\d+\.?\d*|\.\d+))(px|rem)?$/.exec(text)
  if (!match || (!match[2] && Number(match[1]) !== 0)) unrepresentable()
  return { value: Number(match[1]), unit: match[2] ?? 'px' }
}
function propertyKeywords(property) {
  if (keywordProperties[property]) return keywordProperties[property]
  if (
    (property.startsWith('border-') && property.endsWith('-style')) ||
    property === 'border-style'
  )
    return [
      'none',
      'solid',
      'dashed',
      'dotted',
      'double',
      'groove',
      'ridge',
      'inset',
      'outset',
      'hidden',
    ]
  if (
    property.endsWith('-width') &&
    (property.startsWith('border-') || property.startsWith('outline-'))
  )
    return ['thin', 'medium', 'thick']
  if (/^(?:(?:min-|max-)?(?:height|width)|grid-template-)/.test(property))
    return ['none', 'auto', 'min-content', 'max-content', 'fit-content', 'subgrid']
  if (property.startsWith('margin')) return ['auto']
  if (property === 'gap') return ['normal']
  return []
}

function planValue(property, css) {
  visualCssValue.parse(css)
  const keyword = propertyKeywords(property)
  const part = (type, value, extra = {}) => ({ type, value, ...extra })
  const atom = (type, value, extra) => ({ parts: [part(type, value, extra)] })
  if (keyword.includes(css) && property !== 'font-weight')
    return atom('number', keywords.indexOf(css), { keyword: true })
  if (property === 'opacity') {
    const match = /^([-+]?(?:\d+\.?\d*|\.\d+))(%)?$/.exec(css)
    if (!match) return unrepresentable()
    return atom('number', Number(match[1]) / (match[2] ? 100 : 1))
  }
  if (property === 'font-weight') {
    if (css === 'bolder' || css === 'lighter')
      return atom('number', keywords.indexOf(css), { keyword: true })
    return atom('fontWeight', css === 'normal' ? 400 : css === 'bold' ? 700 : Number(css))
  }
  if (property === 'font-family') {
    if (!/^(?:[-\w ]+|"[-\w ]+"|'[-\w ]+')(?:\s*,\s*(?:[-\w ]+|"[-\w ]+"|'[-\w ]+'))*$/.test(css))
      return unrepresentable()
    return atom(
      'fontFamily',
      css.split(',').map((word) => word.trim().replace(/^['"]|['"]$/g, '')),
    )
  }
  if (property === 'box-shadow') return atom('shadow', shadow(css))
  if (property === 'color' || property.endsWith('-color')) {
    const colors = css.match(/(?:rgb|rgba)\([^()]+\)|[^\s]+/g) ?? []
    if (colors.length < 1 || colors.length > (property === 'border-color' ? 4 : 1))
      return unrepresentable()
    return {
      parts: colors.map((item, index) => part('color', color(item), index ? { prefix: ' ' } : {})),
    }
  }
  if (keywordProperties[property] && !['line-height', 'letter-spacing'].includes(property))
    return unrepresentable()
  if (property === 'border-style') {
    const styles = css.split(/\s+/)
    if (styles.length > 4 || styles.some((item) => !keyword.includes(item)))
      return unrepresentable()
    return {
      parts: styles.map((item, index) =>
        part('number', keywords.indexOf(item), {
          keyword: true,
          ...(index ? { prefix: ' ' } : {}),
        }),
      ),
    }
  }
  if (property.endsWith('-style')) return unrepresentable()
  const parts = []
  let prefix = '',
    depth = 0
  const atoms =
    css.match(/[a-z-]+\(|[-+]?(?:\d+\.?\d*|\.\d+)(?:[a-z]+|%)?|[a-z-]+|[ ,/*+()-]/g) ?? []
  if (atoms.join('') !== css) return unrepresentable()
  for (const item of atoms) {
    if (item.endsWith('(')) {
      if (!functionNames.includes(item.slice(0, -1)) || ++depth > 4) return unrepresentable()
      prefix += item
      continue
    }
    if (item === ')') {
      if (--depth < 0) return unrepresentable()
      prefix += item
      continue
    }
    if (/^[ ,/*+-]$/.test(item)) {
      prefix += item
      continue
    }
    let decoded
    const numeric = /^([-+]?(?:\d+\.?\d*|\.\d+))([a-z]+|%)?$/.exec(item)
    if (keyword.includes(item)) decoded = part('number', keywords.indexOf(item), { keyword: true })
    else if (numeric && ['px', 'rem'].includes(numeric[2]))
      decoded = part('dimension', dimension(item))
    else if (numeric && (!numeric[2] || lengthUnits.includes(numeric[2])))
      decoded = part('number', Number(numeric[1]), numeric[2] ? { unit: numeric[2] } : {})
    else return unrepresentable()
    parts.push({ ...decoded, ...(prefix ? { prefix } : {}) })
    prefix = ''
  }
  if (depth !== 0 || !parts.length || !/^\)*$/.test(prefix)) return unrepresentable()
  return { parts, ...(prefix ? { suffix: prefix } : {}) }
}

export function readVisualTokenStyles(document) {
  const rules = visualRulesSchema.parse(document.$extensions[tokenExtension].visualRules ?? [])
  if (new Set(rules.map(ruleKey)).size !== rules.length) throw new Error('duplicate-visual-rule')
  if (!rules.length) return []
  const { ids } = readTokens(document)
  return rules.map(({ owner, variant, part, state, condition, declarations }) => ({
    level: 0,
    state,
    condition,
    target: { owner, variant, part, definition: owner, markers: [], placements: [] },
    declarations: Object.fromEntries(
      Object.entries(declarations).map(([property, recipe]) => {
        const value =
          recipe.atoms
            .map((atom) => {
              const token = ids.get(atom.token)
              if (token?.meta.kind !== 'component' || token.meta.owner !== owner)
                throw new Error('visual-token-owner')
              if ((atom.keyword || atom.unit) && token.type !== 'number')
                throw new Error('visual-token-type')
              if (
                atom.keyword &&
                (atom.unit || !propertyKeywords(property).includes(keywords[token.value]))
              )
                throw new Error('visual-token-keyword')
              const css = atom.keyword
                ? keywords[token.value]
                : tokenCSS(token.type, token.value) + (atom.unit ?? '')
              return (atom.prefix ?? '') + css
            })
            .join('') + (recipe.suffix ?? '')
        return [property, visualCssValue.parse(value)]
      }),
    ),
  }))
}

export function planVisualDefinitionTokens(document, snapshot, edits) {
  const rules = visualRulesSchema.parse(document.$extensions[tokenExtension].visualRules ?? [])
  const original = readTokens(document)
  const operations = new Map()
  const values = new Map()
  const issues = []
  for (const { owner, variant, part, state, condition, changes } of edits) {
    const context = { owner, variant, part, state, condition }
    const key = ruleKey(context)
    const index = rules.findIndex((candidate) => ruleKey(candidate) === key)
    const declarations = { ...rules[index]?.declarations }
    for (const { property, value } of changes) {
      try {
        if (value === null) throw new Error('visual-definition-value-required')
        const recipe = planValue(property, value)
        const binding =
          !condition &&
          snapshot.model.bindings.find(
            (entry) =>
              entry.target === owner &&
              entry.variant === variant &&
              entry.part === part &&
              entry.state === state &&
              snapshot.contract.properties[entry.property]?.cssProperty === property,
          )
        let canonical
        if (binding && recipe.parts.length === 1) {
          const [item] = recipe.parts
          const field = snapshot.contract.properties[binding.property]
          if (!item.keyword && !item.unit && original.ids.get(binding.id)?.type === item.type) {
            let normalized = tokenCSS(item.type, item.value)
            if (field.type === 'color') {
              const channels = [...item.value.components, item.value.alpha ?? 1]
              const round = channels.map((v) => Math.round(v * 255))
              if (channels.every((v, i) => Math.abs(v * 255 - round[i]) < 1e-8))
                normalized =
                  '#' +
                  round
                    .slice(0, round[3] === 255 ? 3 : 4)
                    .map((v) => v.toString(16).padStart(2, '0'))
                    .join('')
            }
            if (field.type === 'font-family') normalized = item.value.join(', ')
            operations.set(binding.id, {
              kind: 'set-component-token',
              target: binding.id,
              value: ['font-weight', 'line-height'].includes(field.type) ? item.value : normalized,
            })
            canonical = binding.id
          }
        }
        delete declarations[property]
        for (const side of visualFourValueProperties[property] ?? []) delete declarations[side]
        declarations[property] = {
          atoms: recipe.parts.map(({ type, value: tokenValue, ...format }, position) => {
            if (canonical) return { token: canonical }
            const token =
              'component.' + owner + '.visual.' + property + '.' + digest([key, property, position])
            values.set(token, { type, value: tokenValue, property, owner })
            return { token, ...format }
          }),
          ...(recipe.suffix ? { suffix: recipe.suffix } : {}),
        }
      } catch {
        issues.push({ ...context, property, value })
      }
    }
    if (index < 0) rules.push({ ...context, declarations })
    else rules[index] = { ...context, declarations }
  }
  if (issues.length) return { issues }

  let canonical = document
  if (operations.size) {
    try {
      canonical = updateEditorTokens(
        document,
        projectTransaction(snapshot, [...operations.values()]),
      )
    } catch {
      // A known token with a narrower domain must not silently change its representation.
      return {
        issues: edits.flatMap(({ changes, ...context }) =>
          changes.map((change) => ({ ...context, ...change })),
        ),
      }
    }
  }
  const { entries } = readTokens(canonical)
  const ruleset = visualRulesSchema.parse(rules)
  const activeTokens = new Set(
    ruleset.flatMap((rule) =>
      Object.values(rule.declarations).flatMap((recipe) => recipe.atoms.map(({ token }) => token)),
    ),
  )
  const records = new Map(
    entries
      .filter(
        (entry) =>
          entry.meta.kind !== 'component' ||
          entry.meta.collection !== 'visual' ||
          activeTokens.has(entry.id),
      )
      .map((entry) => [
        entry.id,
        {
          type: entry.type,
          value: entry.value,
          reference: entry.reference,
          meta: entry.meta,
          deprecated: entry.node.$deprecated,
        },
      ]),
  )
  for (const [id, { type, value, property, owner }] of values) {
    if (!activeTokens.has(id)) continue
    const primitive = 'primitive.visual.' + digest([property, type, value])
    records.set(primitive, {
      type,
      value,
      meta: { id: primitive, kind: 'primitive', collection: 'visual' },
    })
    records.set(id, {
      type,
      reference: primitive,
      meta: { id, kind: 'component', collection: 'visual', owner },
    })
  }
  const next = buildTokenDocument([...records.values()], {
    decisionPolicyVersion: canonical.$extensions[tokenExtension].decisionPolicyVersion,
    visualRules: ruleset,
  })
  readVisualTokenStyles(next)
  return { document: next, issues: [] }
}
