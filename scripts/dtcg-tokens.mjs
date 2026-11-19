import path from 'node:path'
import { readSafe } from './design-editor/files.mjs'
import { parseBounded } from './design-editor/parsing.mjs'
import Ajv from 'ajv/dist/2020.js'
import metadataSchema from '../src/design-system/authority/schemas/token-metadata.schema.json' with { type: 'json' }

export const tokenPath = 'src/design-system/authority/tokens.tokens.json'
export const tokenExtension = 'org.agentic-design'
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
const metadataValidator = new Ajv({ strict: true }).compile(metadataSchema)

/** Closed project profile of DTCG 2025.10; unsupported features fail explicitly. */
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

function metadata(meta) {
  if (!metadataValidator(meta)) fail('invalid-token-metadata')
  if (
    !exact(meta, [
      'id',
      'kind',
      'collection',
      'editor',
      'owner',
      'classification',
      'domain',
      'justification',
      'consumer',
      'provenance',
      'generated',
      'order',
    ]) ||
    !stableId.test(meta.id) ||
    meta.id.length > 240 ||
    !kinds.has(meta.kind) ||
    !collections.has(meta.collection)
  )
    fail('invalid-token-metadata')
  if (meta.order !== undefined && (!Number.isSafeInteger(meta.order) || meta.order < 0))
    fail('invalid-token-order')
  if (
    meta.kind !== 'decision' &&
    ('classification' in meta || 'justification' in meta || 'domain' in meta)
  )
    fail('unexpected-decision-classification')
  if (
    meta.domain !== undefined &&
    ![
      'color',
      'type',
      'space',
      'radius',
      'size',
      'stroke',
      'elevation',
      'motion',
      'opacity',
    ].includes(meta.domain)
  )
    fail('invalid-decision-domain')
  if (meta.kind !== 'component' && ('owner' in meta || 'consumer' in meta))
    fail('unexpected-component-ownership')
  if (meta.consumer && meta.owner !== meta.consumer.file + '#' + meta.consumer.selector)
    fail('component-owner-mismatch')
  if (
    (meta.collection === 'compatibility' && meta.kind !== 'alias') ||
    (meta.collection === 'parameter' && meta.kind !== 'primitive') ||
    (meta.collection === 'sample' && (meta.kind !== 'component' || meta.generated !== true))
  )
    fail('invalid-token-collection')
  if (
    meta.kind === 'decision' &&
    (!['semantic', 'non-semantic'].includes(meta.classification) ||
      typeof meta.justification !== 'string' ||
      !meta.justification.trim())
  )
    fail('missing-decision-classification')
  if (meta.kind === 'component' && (typeof meta.owner !== 'string' || !meta.owner))
    fail('missing-component-owner')
  if (
    meta.collection === 'visual' &&
    (meta.kind === 'component'
      ? !/^[a-z][a-z0-9-]{0,79}$/.test(meta.owner) ||
        !meta.id.startsWith('component.' + meta.owner + '.visual.')
      : meta.kind !== 'primitive' || !meta.id.startsWith('primitive.visual.'))
  )
    fail('invalid-visual-token')
  if (meta.collection === 'editor' && !object(meta.editor)) fail('invalid-token-metadata')
  if (meta.collection === 'editor' || meta.collection === 'compatibility') {
    const fields =
      meta.kind === 'primitive'
        ? ['type', 'family', 'provenance', 'origins']
        : meta.kind === 'decision'
          ? ['type', 'intention', 'role', 'state']
          : meta.kind === 'component'
            ? [
                'target',
                'variant',
                'part',
                'property',
                'state',
                'style',
                'baseReference',
                'provenance',
              ]
            : ['type']
    if (!exact(meta.editor, fields)) fail('invalid-editor-token-metadata')
    if (meta.kind === 'component' && meta.owner !== meta.editor.target)
      fail('component-owner-mismatch')
  }
}

/** Returns stable identities and resolved terminal values; paths and identities stay distinct. */
export function readTokens(document) {
  if (
    !object(document) ||
    document.$extensions?.[tokenExtension]?.schemaVersion !== 1 ||
    document.$extensions[tokenExtension].dtcgVersion !== '2025.10'
  )
    fail('incompatible-token-format')
  const entries = [],
    paths = new Map(),
    ids = new Map()
  function walk(group, segments = [], inheritedType) {
    if (!object(group)) fail('invalid-dtcg-group')
    for (const [name, node] of Object.entries(group)) {
      if (['$type', '$description', '$extensions'].includes(name)) continue
      if (name.startsWith('$') && name !== '$root') fail('unsupported-dtcg-feature')
      if ((name !== '$root' && /[.{}]/.test(name)) || !object(node)) fail('invalid-dtcg-name')
      const parts = [...segments, name],
        tokenPath = parts.join('.')
      if ('$value' in node) {
        if (!exact(node, ['$value', '$type', '$extensions', '$description', '$deprecated']))
          fail('invalid-dtcg-token')
        if (node.$description !== undefined && typeof node.$description !== 'string')
          fail('invalid-dtcg-description')
        if (
          node.$deprecated !== undefined &&
          typeof node.$deprecated !== 'boolean' &&
          typeof node.$deprecated !== 'string'
        )
          fail('invalid-dtcg-deprecation')
        const meta = node.$extensions?.[tokenExtension]
        try {
          metadata(meta)
        } catch (error) {
          throw new Error(`${error.message}: ${String(meta?.id ?? tokenPath).slice(0, 240)}`)
        }
        if (ids.has(meta.id)) fail('duplicate-token-id')
        const entry = {
          path: tokenPath,
          segments: parts,
          node,
          meta,
          id: meta.id,
          type: node.$type ?? group.$type ?? inheritedType,
        }
        entries.push(entry)
        paths.set(tokenPath, entry)
        ids.set(meta.id, entry)
      } else {
        if (name === '$root') fail('invalid-dtcg-root')
        walk(node, parts, group.$type ?? inheritedType)
      }
    }
  }
  walk(document)
  if (!entries.length || entries.length > 8192) fail('invalid-token-count')
  function reference(value) {
    if (typeof value === 'string' && /^\{[^{}]+\}$/.test(value))
      return paths.get(value.slice(1, -1)) ?? fail('unknown-token-reference')
    if (exact(value, ['$ref']) && typeof value.$ref === 'string') {
      if (!value.$ref.startsWith('#/') || !value.$ref.endsWith('/$value'))
        fail('unsupported-token-pointer')
      const segments = value.$ref
        .slice(2, -7)
        .split('/')
        .map((v) => v.replaceAll('~1', '/').replaceAll('~0', '~'))
      return paths.get(segments.join('.')) ?? fail('unknown-token-reference')
    }
  }
  for (const entry of [...entries].sort((a, b) => (a.meta.order ?? 0) - (b.meta.order ?? 0))) {
    const target = reference(entry.node.$value)
    if (target) {
      entry.reference = target.id
      if (entry.meta.kind === 'primitive') fail('non-terminal-primitive')
      if (entry.meta.kind === 'component' && !['primitive', 'decision'].includes(target.meta.kind))
        fail('forbidden-component-reference')
      if (entry.meta.kind === 'decision' && !['primitive', 'decision'].includes(target.meta.kind))
        fail('forbidden-decision-reference')
      if (
        entry.meta.kind === 'alias' &&
        !['primitive', 'decision', 'alias'].includes(target.meta.kind)
      )
        fail('forbidden-alias-reference')
      if (
        entry.meta.kind === 'decision' &&
        target.meta.kind === 'decision' &&
        !entry.meta.justification.trim()
      )
        fail('unjustified-decision-reference')
    } else if (entry.meta.kind !== 'primitive') fail('non-primitive-literal')
  }
  const resolving = new Set(),
    resolved = new Set()
  function resolve(entry) {
    if (resolving.has(entry.id)) fail('forbidden-token-cycle')
    if (resolved.has(entry.id)) return
    resolving.add(entry.id)
    if (entry.reference) {
      const target = ids.get(entry.reference)
      resolve(target)
      if (entry.type === undefined) entry.type = target.type
      if (entry.type !== target.type) fail('token-type-mismatch')
      entry.value = target.value
      entry.terminal = target.terminal
    } else {
      validateTokenValue(entry.type, entry.node.$value)
      entry.value = entry.node.$value
      entry.terminal = entry.id
    }
    resolving.delete(entry.id)
    resolved.add(entry.id)
  }
  for (const entry of entries) resolve(entry)
  const policyVersion = document.$extensions[tokenExtension].decisionPolicyVersion
  if (policyVersion !== undefined && policyVersion !== 1) fail('unsupported-decision-policy')
  if (policyVersion === 1)
    for (const e of entries) {
      if (
        e.meta.kind !== 'component' ||
        ids.get(e.reference)?.meta.kind !== 'primitive' ||
        e.meta.collection === 'sample'
      )
        continue
      if (e.meta.collection === 'editor' && e.meta.editor?.provenance?.kind === 'designer-edit')
        continue
      if (e.meta.collection === 'visual' && ids.get(e.reference)?.meta.collection === 'visual')
        continue
      if (
        e.meta.collection === 'composition' &&
        /^Exception (technique|locale)/.test(e.meta.consumer?.usage ?? '')
      )
        continue
      fail('unjustified-direct-component-reference')
    }
  return { entries, ids, paths }
}

export function buildTokenDocument(records, { decisionPolicyVersion, visualRules } = {}) {
  const document = {
    $extensions: {
      [tokenExtension]: {
        schemaVersion: 1,
        dtcgVersion: '2025.10',
        ...(decisionPolicyVersion === undefined ? {} : { decisionPolicyVersion }),
        ...(visualRules?.length ? { visualRules } : {}),
      },
    },
  }
  const names = records.map((r) => r.meta.id)
  if (new Set(names).size !== names.length) fail('duplicate-token-id')
  const paths = new Map(
    names.map((id) => [
      id,
      id + (names.some((other) => other.startsWith(id + '.')) ? '.$root' : ''),
    ]),
  )
  for (const record of [...records].sort((a, b) => a.meta.id.localeCompare(b.meta.id, 'en'))) {
    const segments = paths.get(record.meta.id).split('.')
    let parent = document
    for (const segment of segments.slice(0, -1)) {
      if (!Object.hasOwn(parent, segment)) parent[segment] = Object.create(null)
      parent = parent[segment]
    }
    parent[segments.at(-1)] = {
      $type: record.type,
      $value: record.reference
        ? `{${paths.get(record.reference) ?? fail('unknown-token-reference')}}`
        : record.value,
      ...(record.deprecated ? { $deprecated: true } : {}),
      $extensions: { [tokenExtension]: record.meta },
    }
  }
  readTokens(document)
  return document
}
const parsedDocuments = new Map()
export async function loadTokens(root) {
  const { bytes, hash } = await readSafe(path.resolve(root), tokenPath)
  let parsed = parsedDocuments.get(hash)
  if (!parsed) {
    parsed = parseBounded(bytes.toString('utf8'), { format: 'json', nodes: 100000 })
    readTokens(parsed)
    if (parsedDocuments.size >= 4) parsedDocuments.delete(parsedDocuments.keys().next().value)
    parsedDocuments.set(hash, parsed)
  }
  // Each caller owns its copy; inode/size/hash checks still run for every read.
  const document = structuredClone(parsed)
  return { document, ...readTokens(document) }
}

export function editorProjection(document) {
  const { entries } = readTokens(document)
  const primitive = [],
    styles = [],
    bindings = [],
    legacy = []
  for (const entry of [...entries].sort((a, b) => (a.meta.order ?? 0) - (b.meta.order ?? 0))) {
    const { meta, id, reference } = entry
    if (meta.collection === 'editor') {
      if (meta.kind === 'primitive')
        primitive.push({
          id,
          ...meta.editor,
          value:
            meta.editor.type === 'line-height' || meta.editor.type === 'font-weight'
              ? entry.value
              : entry.type === 'fontFamily'
                ? (Array.isArray(entry.value) ? entry.value : [entry.value]).join(', ')
                : entry.type === 'color' && entry.value.alpha !== undefined && entry.value.alpha < 1
                  ? '#' +
                    [...entry.value.components, entry.value.alpha]
                      .map((channel) =>
                        Math.round(channel * 255)
                          .toString(16)
                          .padStart(2, '0'),
                      )
                      .join('')
                  : tokenCSS(entry.type, entry.value),
        })
      if (meta.kind === 'decision')
        styles.push({
          id,
          ...meta.editor,
          reference,
          ...(meta.classification === 'non-semantic'
            ? { classification: 'non-semantic', justification: meta.justification }
            : {}),
        })
      if (meta.kind === 'component') bindings.push({ id, ...meta.editor, reference })
    }
    if (meta.collection === 'compatibility')
      legacy.push({ id, type: meta.editor.type, value: { reference } })
  }
  return { primitives: primitive, styles, bindings, legacy }
}

export function updateEditorTokens(document, transaction) {
  const { entries } = readTokens(document)
  const records = entries
    .filter((e) => e.meta.collection !== 'editor' && e.meta.collection !== 'sample')
    .map((e) => ({
      type: e.type,
      value: e.node.$value,
      reference: e.reference,
      meta: e.meta,
      deprecated: e.node.$deprecated,
    }))
  const prior = new Map(entries.map((e) => [e.id, e]))
  for (const [order, primitive] of transaction.model.primitives.entries()) {
    const { id, value, ...editor } = primitive,
      converted = editorValue(primitive.type, value)
    records.push({
      ...converted,
      meta: { id, kind: 'primitive', collection: 'editor', editor, order },
    })
    if (primitive.type === 'color')
      records.push({
        type: 'color',
        reference: id,
        meta: {
          id: 'component.composition.catalog.primitive-sample.' + id,
          kind: 'component',
          collection: 'sample',
          owner: 'primitive-catalog',
          generated: true,
        },
      })
  }
  for (const [order, style] of transaction.model.styles.entries()) {
    const { id, reference, classification, justification, ...editor } = style
    const old = prior.get(id)?.meta
    const definition = transaction.catalog.semanticEligibility.find(
      (e) => e.intention === style.intention && e.role === style.role,
    )?.definition
    records.push({
      type: editorTypes[style.type],
      reference,
      meta: {
        id,
        kind: 'decision',
        collection: 'editor',
        editor,
        order,
        ...(old?.domain ? { domain: old.domain } : {}),
        classification: classification ?? old?.classification ?? 'semantic',
        justification:
          justification ??
          old?.justification ??
          definition ??
          fail('missing-decision-classification'),
      },
    })
  }
  for (const [order, binding] of transaction.model.bindings.entries()) {
    const { id, reference, ...editor } = binding
    const type = prior.get(id)?.type ?? fail('unknown-component-token')
    records.push({
      type,
      reference,
      meta: { id, kind: 'component', collection: 'editor', owner: binding.target, editor, order },
    })
  }
  return buildTokenDocument(records, {
    decisionPolicyVersion: document.$extensions[tokenExtension].decisionPolicyVersion,
    visualRules: document.$extensions[tokenExtension].visualRules,
  })
}
