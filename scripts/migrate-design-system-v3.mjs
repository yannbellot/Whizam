import { readFile, writeFile, lstat, readdir, realpath } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseDocument, stringify } from 'yaml'
import Ajv from 'ajv/dist/2020.js'
import { primitiveFamily, primitiveName } from '../src/design-system/editor/naming.ts'
import {
  styleId,
  validateCatalog,
  validateEditorModel,
  normalizeValue,
} from '../src/design-system/editor/legacy-v3-contract.ts'
import { withEditorRead } from './editor-reader.mjs'
import { readSafe } from './design-editor/files.mjs'
import { loadEditorValidators, validateSheet } from './validate-editor-contract.mjs'

const migrationValidators = await loadEditorValidators(undefined, true)

const legacyValidator = new Ajv({ strict: true }).compile(
  JSON.parse(
    await readFile(
      new URL(
        '../src/design-system/authority/schemas/legacy-editor-model-v2.schema.json',
        import.meta.url,
      ),
      'utf8',
    ),
  ),
)
const provenance = (p) =>
  p.provenance ?? {
    kind: 'agent-migration',
    status: 'proposed',
    reason: `Référence historique conservée : ${p.source}.`,
  }

/** Pure conversion; all references and values are checked before the caller writes anything. */
export function migrateSources(primitives, semantic, sheets, contract, catalog) {
  validateCatalog(catalog, contract)
  if (
    sheets.length !== contract.targets.length ||
    sheets.some(
      (sheet, index) =>
        sheet.target !== contract.targets[index].id ||
        sheet.bindings.some((binding) => binding.target !== sheet.target),
    )
  )
    throw new Error('sheet-target-mismatch')
  const original = {
    schemaVersion: 2,
    primitives: primitives.primitives.map((p) => ({
      id: p.id,
      type: p.type,
      value: p.value,
      provenance: provenance(p),
    })),
    styles: semantic.styles,
    bindings: sheets.flatMap((s) => s.bindings),
  }
  if (!legacyValidator(original)) throw new Error('legacy-schema-invalid')
  const nodes = new Map(
    [
      ...original.primitives,
      ...original.styles,
      ...semantic.tokens.map((t) => ({ ...t, reference: t.value.reference })),
    ].map((p) => [p.id, p]),
  )
  if (nodes.size !== original.primitives.length + original.styles.length + semantic.tokens.length)
    throw new Error('duplicate-id')
  function leaf(id, trail = new Set()) {
    if (trail.has(id)) throw new Error('forbidden-cycle')
    const item = nodes.get(id)
    if (!item) throw new Error('unknown-reference')
    if (!item.reference) return item
    const result = leaf(item.reference, new Set([...trail, id]))
    if (result.type !== item.type) throw new Error('type-mismatch')
    return result
  }
  for (const token of semantic.tokens) {
    if (
      !/^semantic(?:\.[a-z][a-z0-9]*(?:-[a-z0-9]+)*){2,}$/.test(token.id) ||
      !['color', 'dimension', 'font-weight'].includes(token.type) ||
      Object.keys(token).sort().join('|') !== 'id|type|value' ||
      !token.value ||
      Object.keys(token.value).join('|') !== 'reference'
    )
      throw new Error('legacy-schema-invalid')
    leaf(token.id)
  }
  const stylesMap = new Map(original.styles.map((s) => [s.id, styleId(s)]))
  const allocated = new Map(),
    primitiveMap = new Map()
  function allocate(oldId, family) {
    const p = leaf(oldId),
      id = primitiveName(family, p.value)
    const item = allocated.get(id)
    if (item && (item.family !== family || item.type !== p.type || item.value !== p.value))
      throw new Error('id-collision')
    if (!item)
      allocated.set(id, {
        id,
        family,
        type: p.type,
        value: p.value,
        provenance: p.provenance,
        origins: [],
      })
    const next = allocated.get(id)
    if (!next.origins.some((o) => o.id === p.id))
      next.origins.push({ id: p.id, provenance: p.provenance })
    const mapped = primitiveMap.get(p.id) ?? new Set()
    mapped.add(id)
    primitiveMap.set(p.id, mapped)
    return id
  }
  const styles = original.styles.map((s) => ({
    ...s,
    id: stylesMap.get(s.id),
    reference: stylesMap.get(s.reference) ?? allocate(s.reference, primitiveFamily(s.type, s.role)),
  }))
  const bindings = original.bindings.map((b) => {
    const property = contract.properties[b.property]
    if (!property) throw new Error('unprepared-target')
    const { exception, ...binding } = b
    const style = stylesMap.get(b.style)
    if (!style) throw new Error('unknown-reference')
    const reference = exception
      ? allocate(exception.reference, primitiveFamily(property.type, property.role))
      : style
    return {
      ...binding,
      style,
      reference,
      ...(exception ? { provenance: exception.provenance } : {}),
    }
  })
  // Preserve unused historical values and their origins; no palette is inferred.
  for (const p of original.primitives)
    if (!primitiveMap.has(p.id)) {
      const family =
        p.type === 'dimension'
          ? p.id.startsWith('primitive.radius.')
            ? 'radius'
            : p.id.startsWith('primitive.space.')
              ? 'space'
              : 'size'
          : primitiveFamily(p.type, '')
      allocate(p.id, family)
    }
  const legacyIds = new Set(semantic.tokens.map((t) => t.id))
  const tokens = semantic.tokens.map((t) => ({
    ...t,
    value: {
      reference:
        stylesMap.get(t.value.reference) ??
        (legacyIds.has(t.value.reference)
          ? t.value.reference
          : allocate(
              t.value.reference,
              t.type === 'dimension' ? 'size' : primitiveFamily(t.type, ''),
            )),
    },
  }))
  const model = { schemaVersion: 3, primitives: [...allocated.values()], styles, bindings }
  validateEditorModel(model, catalog, contract)
  const nextSheets = sheets.map((s) => ({
    ...s,
    schemaVersion: 3,
    bindings: bindings.filter((b) => b.target === s.target),
  }))
  for (const sheet of nextSheets)
    validateSheet(
      sheet,
      { catalog, contract, validators: migrationValidators, legacyVersion: 3 },
      model,
    )
  const nextNodes = new Map([...model.primitives, ...model.styles].map((p) => [p.id, p]))
  const resolve = (id) => {
    const p = nextNodes.get(id)
    if (!p) throw new Error('unknown-reference')
    return p.reference ? resolve(p.reference) : p.value
  }
  for (const s of original.styles)
    if (leaf(s.id).value !== resolve(stylesMap.get(s.id))) throw new Error('migration-value-drift')
  for (const b of original.bindings) {
    const next = bindings.find((i) => i.id === b.id),
      value = leaf(b.exception?.reference ?? b.style).value
    if (value !== resolve(next.reference)) throw new Error('migration-value-drift')
    if (normalizeValue(contract.properties[b.property], value, contract.fontFamilies) !== value)
      throw new Error('non-canonical-value')
  }
  const report = {
    version: 1,
    from: 2,
    to: 3,
    primitives: [...primitiveMap].map(([from, to]) => ({ from, to: [...to] })),
    styles: [...stylesMap].map(([from, to]) => ({ from, to })),
    bindings: bindings.map((b) => ({ from: b.id, to: b.id })),
    legacyPrimitives: primitives.primitives,
  }
  return {
    primitives: { schemaVersion: 3, primitives: model.primitives, sources: primitives.sources },
    semantic: { schemaVersion: 3, tokens, styles },
    sheets: nextSheets,
    report,
  }
}

async function yaml(root, file) {
  const full = path.resolve(root, file)
  if (
    !full.startsWith(root + path.sep) ||
    (await realpath(full)) !== full ||
    (await lstat(full)).isSymbolicLink()
  )
    throw new Error('unsafe-migration-path')
  const source = (await readSafe(root, file, 2 * 1024 * 1024)).bytes.toString('utf8')
  const document = parseDocument(source, { uniqueKeys: true })
  if (document.errors.length) throw new Error('yaml-invalid')
  return document.toJS({ maxAliasCount: 0 })
}
export async function migrateRoot(inputRoot, { write = false, reportFile } = {}) {
  const root = await realpath(inputRoot)
  if (root !== path.resolve(inputRoot)) throw new Error('unsafe-migration-path')
  try {
    const state = await lstat(path.join(root, '.design-editor.local'))
    if (!state.isDirectory() || state.isSymbolicLink()) throw new Error('unsafe-migration-path')
  } catch (e) {
    if (e.code !== 'ENOENT') throw e
  }
  // An old writer is never upgraded in place, including when all its receipts are committed.
  for (const file of ['active', 'recovery-owner'])
    try {
      await lstat(path.join(root, '.design-editor.local', file))
      throw new Error('old-writer-state')
    } catch (e) {
      if (e.code !== 'ENOENT') throw e
    }
  try {
    const ownerFile = path.join(root, '.design-editor.local/owner.json')
    const ownerMeta = await lstat(ownerFile)
    if (!ownerMeta.isFile() || ownerMeta.isSymbolicLink() || ownerMeta.size > 4096)
      throw new Error('old-writer-state')
    const owner = JSON.parse(await readFile(ownerFile, 'utf8')),
      meta = await lstat(root)
    if (
      owner.version !== 1 ||
      !Number.isSafeInteger(owner.pid) ||
      owner.pid < 1 ||
      typeof owner.nonce !== 'string' ||
      !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(owner.nonce) ||
      owner.root?.dev !== meta.dev ||
      owner.root?.ino !== meta.ino ||
      owner.root?.mode !== (meta.mode & 0o7777)
    )
      throw new Error('old-writer-state')
    try {
      process.kill(owner.pid, 0)
      throw new Error('old-writer-state')
    } catch (e) {
      if (e.code !== 'ESRCH') throw e
    }
  } catch (e) {
    if (e.code !== 'ENOENT') throw e
  }
  try {
    if ((await readdir(path.join(root, '.design-editor.local/records'))).length)
      throw new Error('old-writer-state')
  } catch (e) {
    if (e.code !== 'ENOENT') throw e
  }
  const base = 'src/design-system/authority/',
    contract = await yaml(root, base + 'editor-contract.yaml'),
    catalog = await yaml(root, base + 'semantic-catalog.yaml')
  const primitives = await yaml(root, base + 'primitives.yaml'),
    semantic = await yaml(root, base + 'semantic-tokens.yaml')
  const sheets = await Promise.all(contract.targets.map((t) => yaml(root, t.sheet)))
  if (
    primitives.schemaVersion === 3 &&
    semantic.schemaVersion === 3 &&
    sheets.every((s) => s.schemaVersion === 3)
  ) {
    const model = {
      schemaVersion: 3,
      primitives: primitives.primitives,
      styles: semantic.styles,
      bindings: sheets.flatMap((s) => s.bindings),
    }
    validateCatalog(catalog, contract)
    validateEditorModel(model, catalog, contract)
    for (const sheet of sheets)
      validateSheet(
        sheet,
        { catalog, contract, validators: migrationValidators, legacyVersion: 3 },
        model,
      )
    return { changed: false }
  }
  if (
    primitives.schemaVersion !== 2 ||
    semantic.schemaVersion !== 2 ||
    sheets.some((s) => s.schemaVersion !== 2)
  )
    throw new Error('mixed-authority-versions')
  const result = migrateSources(primitives, semantic, sheets, contract, catalog)
  const outputs = [
    [base + 'primitives.yaml', result.primitives],
    [base + 'semantic-tokens.yaml', result.semantic],
    ...contract.targets.map((t, i) => [t.sheet, result.sheets[i]]),
  ]
  let reportPath
  if (reportFile) {
    reportPath = path.resolve(reportFile)
    if (
      !reportPath.startsWith(root + path.sep) ||
      !reportPath.endsWith('.json') ||
      (await realpath(path.dirname(reportPath))) !== path.dirname(reportPath)
    )
      throw new Error('unsafe-migration-path')
    try {
      await lstat(reportPath)
      throw new Error('migration-report-exists')
    } catch (e) {
      if (e.code !== 'ENOENT') throw e
    }
  }
  if (write)
    await withEditorRead(root, async () => {
      for (const [file, value] of outputs)
        await writeFile(
          path.join(root, file),
          stringify(value, { lineWidth: 0, aliasDuplicateObjects: false }),
        )
      if (reportPath)
        await writeFile(reportPath, JSON.stringify(result.report, null, 2) + '\n', { flag: 'wx' })
    })
  return { changed: true, report: result.report, outputs }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2),
    options = {},
    seen = new Set()
  for (let index = 0; index < args.length; index++) {
    const flag = args[index]
    if (!['--root', '--report', '--write'].includes(flag) || seen.has(flag))
      throw new Error('invalid-migration-arguments')
    seen.add(flag)
    if (flag !== '--write') {
      const value = args[++index]
      if (!value || value.startsWith('--')) throw new Error('invalid-migration-arguments')
      options[flag] = value
    }
  }
  const root = options['--root'] ?? fileURLToPath(new URL('..', import.meta.url))
  const result = await migrateRoot(root, {
    write: args.includes('--write'),
    reportFile: options['--report'],
  })
  console.log(
    result.changed
      ? `Migration ${args.includes('--write') ? 'écrite' : 'vérifiée sans écriture'} : ${result.report.primitives.length} références primitives, ${result.report.styles.length} styles, ${result.report.bindings.length} tokens de composant.`
      : 'Déjà migré ; aucune écriture.',
  )
}
