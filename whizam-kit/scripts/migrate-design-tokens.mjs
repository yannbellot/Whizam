import * as fs from 'node:fs/promises'
import { constants } from 'node:fs'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { stringify } from 'yaml'
import { readSafe, checkParents } from './design-editor/files.mjs'
import { parseBounded } from './design-editor/parsing.mjs'
import {
  tokenPath,
  buildTokenDocument,
  editorValue,
  colorValue,
  dimensionValue,
  readTokens,
} from './dtcg-tokens.mjs'

const namespace = 'src/design-system/authority/'
const hash = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex')

/** Pure conversion; no live journal, receipt, account or business data is read. */
export function convertTokenSources({
  primitives,
  semantic,
  sheets,
  composition,
  contract,
  catalog,
}) {
  const records = [],
    recipes = [],
    outputs = [],
    mapping = []
  const add = (record) => {
    records.push(record)
    mapping.push({ id: record.meta.id, kind: 'token' })
  }
  for (const [order, item] of primitives.primitives.entries()) {
    const { id, value, ...editor } = item
    // Historic source annotations not accepted by the editor are already migrated to provenance.
    add({
      ...editorValue(item.type, value),
      meta: { id, kind: 'primitive', collection: 'editor', editor, order },
    })
  }
  for (const [order, item] of semantic.styles.entries()) {
    const { id, reference, ...editor } = item
    const justification = catalog.semanticEligibility.find(
      (entry) => entry.intention === item.intention && entry.role === item.role,
    )?.definition
    if (!justification) throw new Error('missing-decision-classification')
    add({
      type: editorValue(item.type, primitives.primitives.find((p) => p.type === item.type).value)
        .type,
      reference,
      meta: {
        id,
        kind: 'decision',
        collection: 'editor',
        classification: 'semantic',
        justification,
        editor,
        order,
      },
    })
  }
  for (const [order, item] of semantic.tokens.entries())
    add({
      type: editorValue(item.type, primitives.primitives.find((p) => p.type === item.type).value)
        .type,
      reference: item.value.reference,
      deprecated: true,
      meta: {
        id: item.id,
        kind: 'alias',
        collection: 'compatibility',
        editor: { type: item.type },
        order,
      },
    })
  for (const [order, item] of sheets.flatMap((s) => s.bindings).entries()) {
    const { id, reference, ...editor } = item
    const type = contract.properties[item.property].type
    add({
      type: editorValue(type, primitives.primitives.find((p) => p.type === type).value).type,
      reference,
      meta: { id, kind: 'component', collection: 'editor', owner: item.target, editor, order },
    })
  }
  const parameters = new Map()
  function parameter(type, value) {
    const key = JSON.stringify([type, value])
    if (!parameters.has(key)) {
      const id = 'primitive.composition.parameter-' + hash([type, value]).slice(0, 20)
      parameters.set(key, id)
      add({
        type,
        value,
        meta: {
          id,
          kind: 'primitive',
          collection: 'parameter',
          provenance: {
            kind: 'agent-migration',
            status: 'proposed',
            reason: 'Paramètre extrait sans changement intentionnel de rendu ; DS-ARCH-01.',
          },
        },
      })
    }
    return parameters.get(key)
  }
  function recipeParts(value, properties) {
    const parts = [],
      matcher =
        /#[\da-fA-F]{6}|rgb\([^)]*\)|-?(?:\d+(?:\.\d+)?|\.\d+)(?:px|rem|em|vh|vw|fr|ms|s|%)?|system-ui|\bease\b/g
    let position = 0,
      numericIndex = 0
    for (const match of value.matchAll(matcher)) {
      if (match.index > position) parts.push(value.slice(position, match.index))
      const literal = match[0]
      let type, data, unit
      if (/^#|^rgb/.test(literal)) {
        type = 'color'
        data = colorValue(literal)
      } else if (literal === 'system-ui') {
        type = 'fontFamily'
        data = ['system-ui']
      } else if (literal === 'ease') {
        type = 'cubicBezier'
        data = [0.25, 0.1, 0.25, 1]
      } else {
        const quantity = /^(-?(?:\d+(?:\.\d+)?|\.\d+))(.*)$/.exec(literal)
        const amount = Number(quantity[1]),
          suffix = quantity[2]
        if (['px', 'rem'].includes(suffix)) {
          type = 'dimension'
          data = { value: amount, unit: suffix }
        } else if (['ms', 's'].includes(suffix)) {
          type = 'duration'
          data = { value: amount, unit: suffix }
        } else {
          type = properties.includes('font') && numericIndex === 0 ? 'fontWeight' : 'number'
          data = amount
          if (suffix) unit = suffix
        }
        numericIndex++
      }
      parts.push({ reference: parameter(type, data), ...(unit ? { unit } : {}) })
      position = match.index + literal.length
    }
    if (position < value.length) parts.push(value.slice(position))
    return parts
  }
  const recipeIds = new Set()
  for (const [order, primitive] of composition.primitives.entries()) {
    const value = primitive.value
    const properties = composition.tokens
      .filter((t) => t.reference === primitive.id)
      .map((t) => t.property)
    let type, data
    if (/^-?\d+(?:\.\d+)?(?:px|rem)$/.test(value)) {
      type = 'dimension'
      data = dimensionValue(value)
    } else if (/^#[\da-f]{6}$/i.test(value) || value === 'white' || /^rgb\(/.test(value)) {
      type = 'color'
      data = colorValue(value)
    } else if (
      properties.every((p) => p === 'font-weight') &&
      (/^[\d.]+$/.test(value) || ['normal', 'bold'].includes(value))
    ) {
      type = 'fontWeight'
      data = value === 'bold' ? 700 : value === 'normal' ? 400 : Number(value)
    } else if (properties.every((p) => p === 'opacity') && /^[\d.]+$/.test(value)) {
      type = 'number'
      data = Number(value)
    } else {
      const border = /^(\d+(?:\.\d+)?(?:px|rem)) solid (#[\da-f]{6})$/i.exec(value)
      const shadow = /^(\S+) (\S+) (\S+) (rgb\([^)]*\))$/.exec(value)
      if (border) {
        type = 'border'
        data = { width: dimensionValue(border[1]), style: 'solid', color: colorValue(border[2]) }
      } else if (properties.every((p) => p === 'box-shadow') && shadow) {
        type = 'shadow'
        data = {
          offsetX: dimensionValue(shadow[1]),
          offsetY: dimensionValue(shadow[2]),
          blur: dimensionValue(shadow[3]),
          spread: { value: 0, unit: 'px' },
          color: colorValue(shadow[4]),
        }
      }
    }
    if (type)
      add({
        type,
        value: data,
        meta: {
          id: primitive.id,
          kind: 'primitive',
          collection: 'composition',
          order,
          provenance: primitive.provenance,
        },
      })
    else {
      recipeIds.add(primitive.id)
      recipes.push({
        id: primitive.id,
        order,
        parts: recipeParts(value, properties),
        provenance: primitive.provenance,
      })
      mapping.push({ id: primitive.id, kind: 'css-recipe' })
    }
  }
  const lookup = new Map(records.map((r) => [r.meta.id, r]))
  for (const [order, item] of composition.tokens.entries()) {
    const { id, reference, ...consumer } = item
    if (recipeIds.has(reference)) {
      outputs.push({ ...item, order })
      mapping.push({ id, kind: 'css-recipe-output', reference })
    } else
      add({
        type:
          lookup.get(reference)?.type ??
          (() => {
            throw new Error('unknown-token-reference')
          })(),
        reference,
        meta: {
          id,
          kind: 'component',
          collection: 'composition',
          owner: consumer.file + '#' + consumer.selector,
          consumer,
          order,
        },
      })
  }
  for (const primitive of primitives.primitives.filter((p) => p.type === 'color'))
    add({
      type: 'color',
      reference: primitive.id,
      meta: {
        id: composition.primitiveColorSamples.tokenPrefix + '.' + primitive.id,
        kind: 'component',
        collection: 'sample',
        owner: 'primitive-catalog',
        generated: true,
      },
    })
  const document = buildTokenDocument(records)
  const { ids } = readTokens(document)
  for (const entry of mapping) if (entry.kind === 'token') entry.path = ids.get(entry.id).path
  return {
    document,
    composition: {
      schemaVersion: 2,
      primitiveColorSamples: composition.primitiveColorSamples,
      recipes,
      outputs,
    },
    mapping,
  }
}

/** Explicit source migration on an identified copy. Existing DTCG roots are never overwritten. */
export async function migrateTokenRoot(root, { write = false } = {}) {
  root = await fs.realpath(root)
  const state = '.design-editor.local'
  let hasState = false
  try {
    const directory = await fs.lstat(path.join(root, state))
    hasState = true
    if (!directory.isDirectory() || directory.isSymbolicLink())
      throw new Error('unsafe-editor-state')
    const entries = await fs.readdir(path.join(root, state))
    if (
      entries.some(
        (name) =>
          !['owner.json', 'records', 'transactions', 'work'].includes(name) &&
          !/^reader-[a-f0-9-]+\.json$/.test(name),
      )
    )
      throw new Error('editor-state-present-use-clean-copy')
    for (const name of ['records', 'transactions']) {
      const stat = await fs.lstat(path.join(root, state, name))
      if (
        !stat.isDirectory() ||
        stat.isSymbolicLink() ||
        (await fs.readdir(path.join(root, state, name))).length
      )
        throw new Error('editor-state-present-use-clean-copy')
    }
    for (const name of entries.filter((name) => name.endsWith('.json'))) {
      const { bytes } = await readSafe(root, state + '/' + name)
      const record = parseBounded(bytes.toString('utf8'), { format: 'json' })
      if (!Number.isSafeInteger(record.pid) || record.pid <= 0)
        throw new Error('unsafe-editor-state')
      try {
        process.kill(record.pid, 0)
        throw new Error('editor-service-alive-use-clean-copy')
      } catch (error) {
        if (error.code !== 'ESRCH') throw error
      }
    }
    // Empty, inactive state is preserved byte for byte; no lock or journal is removed.
  } catch (error) {
    if (error.code !== 'ENOENT' || hasState) throw error
  }
  const preimages = new Map()
  const read = async (file) => {
    const info = await readSafe(root, file)
    preimages.set(file, info)
    return parseBounded(info.bytes.toString('utf8')).toJS({ maxAliasCount: 0 })
  }
  const registry = await read(namespace + 'components.yaml')
  if (registry.tokenFormat) throw new Error('already-migrated-token-authority')
  try {
    await fs.lstat(path.join(root, tokenPath))
    throw new Error('existing-token-authority')
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
  const primitives = await read(namespace + 'primitives.yaml'),
    semantic = await read(namespace + 'semantic-tokens.yaml'),
    composition = await read(namespace + 'ui-composition.yaml'),
    contract = await read(namespace + 'editor-contract.yaml'),
    catalog = await read(namespace + 'semantic-catalog.yaml')
  const sheets = await Promise.all(
    contract.targets.map(async (target) => {
      const sheet = await read(target.sheet)
      if (
        Object.keys(sheet).some(
          (key) => !['schemaVersion', 'target', 'bindings', 'presentation'].includes(key),
        ) ||
        sheet.target !== target.id
      )
        throw new Error('invalid-migration-sheet')
      return { ...sheet, file: target.sheet }
    }),
  )
  const converted = convertTokenSources({
    primitives,
    semantic,
    sheets,
    composition,
    contract,
    catalog,
  })
  if (write) {
    // Preparation is performed before the first replacement; callers use an isolated copy.
    const files = new Map([[tokenPath, JSON.stringify(converted.document, null, 2) + '\n']])
    registry.tokenFormat = 'dtcg-2025.10'
    const families = { Button: 'ui', Field: 'ui', SelectField: 'ui', Notice: 'ui', Panel: 'layout' }
    for (const component of registry.designSystemComponents) {
      component.family ??= families[component.id]
      if (!component.family) throw new Error('unprepared-component-family')
    }
    files.set(namespace + 'components.yaml', stringify(registry))
    const { primitives: removedPrimitives, ...primitiveRules } = primitives
    files.set(
      namespace + 'primitives.yaml',
      '# Valeurs dans tokens.tokens.json ; règles de provenance uniquement.\n' +
        stringify(primitiveRules),
    )
    files.set(
      namespace + 'semantic-tokens.yaml',
      '# Références et décisions dans tokens.tokens.json.\n' +
        stringify({ schemaVersion: semantic.schemaVersion }),
    )
    for (const sheet of sheets) {
      const { file, bindings: removedBindings, ...presentation } = sheet
      files.set(
        file,
        '# Présentation uniquement ; tokens de composants dans tokens.tokens.json.\n' +
          stringify(presentation),
      )
    }
    files.set(namespace + 'ui-composition.yaml', stringify(converted.composition))
    for (const [file, before] of preimages)
      if ((await readSafe(root, file)).hash !== before.hash)
        throw new Error('migration-source-changed')
    for (const [file, text] of files) {
      await checkParents(root, file)
      const flags =
        file === tokenPath
          ? constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW
          : constants.O_RDWR | constants.O_NOFOLLOW
      const handle = await fs.open(path.join(root, file), flags, 0o644)
      try {
        if (file !== tokenPath) {
          const stat = await handle.stat(),
            before = preimages.get(file)
          if (
            !before ||
            stat.nlink !== 1 ||
            stat.dev !== before.dev ||
            stat.ino !== before.ino ||
            createHash('sha256')
              .update(await handle.readFile())
              .digest('hex') !== before.hash
          )
            throw new Error('migration-source-changed')
        }
        const bytes = Buffer.from(text)
        let offset = 0
        while (offset < bytes.length) {
          const { bytesWritten } = await handle.write(bytes, offset, bytes.length - offset, offset)
          if (!bytesWritten) throw new Error('migration-write-failed')
          offset += bytesWritten
        }
        await handle.truncate(bytes.length)
        await handle.sync()
      } finally {
        await handle.close()
      }
    }
  }
  return converted
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2)
  if (args.length !== 2 || args[0] !== '--write-copy')
    throw new Error('Usage: node scripts/migrate-design-tokens.mjs --write-copy PATH')
  await migrateTokenRoot(args[1], { write: true })
  console.log('DTCG sources migrated; qualify this copy before using its writer.')
}
