import { open, readdir, lstat, realpath } from 'node:fs/promises'
import path from 'node:path'
import { constants } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { parseDocument, stringify } from 'yaml'
import { validateEditorModel as validateV3 } from '../src/design-system/editor/legacy-v3-contract.ts'
import {
  validateEditorModel,
  semanticEligible,
  validateCatalog,
} from '../src/design-system/editor/contract.ts'
import { withEditorRead } from './editor-reader.mjs'
import { loadEditorValidators, validateSheet } from './validate-editor-contract.mjs'
const currentValidators = await loadEditorValidators()
const historicalValidators = await loadEditorValidators(undefined, true)
import { readSafe, checkParents, sameIdentity, identity, syncDir } from './design-editor/files.mjs'

/** A pure migration. Unknown/unqualified custom styles require an explicit classification. */
export function migrateSources(primitives, semantic, registry, sheets, contract, catalog) {
  const versions = [primitives, semantic, registry, ...sheets].map((x) => x.schemaVersion)
  if (versions.some((v) => v !== 3 && v !== 4) || new Set(versions).size !== 1)
    throw new Error('mixed-authority-versions')
  validateCatalog(catalog, contract)
  if (
    sheets.length !== contract.targets.length ||
    sheets.some(
      (sheet, i) =>
        sheet.target !== contract.targets[i].id ||
        sheet.bindings.some((b) => b.target !== sheet.target),
    )
  )
    throw new Error('sheet-target-mismatch')
  const old = {
    schemaVersion: versions[0],
    primitives: primitives.primitives,
    styles: semantic.styles,
    bindings: sheets.flatMap((s) => s.bindings),
  }
  if (versions[0] === 4) {
    validateEditorModel(old, catalog, contract)
    for (const sheet of sheets)
      validateSheet(sheet, { contract, catalog, validators: currentValidators }, old)
    return { changed: false }
  }
  validateV3(old, catalog, contract)
  for (const sheet of sheets)
    validateSheet(
      sheet,
      { contract, catalog, validators: historicalValidators, legacyVersion: 3 },
      old,
    )
  const retired = new Set([
    'semantic.layout.neutral.border-width.default',
    'semantic.layout.neutral.radius.default',
    'semantic.layout.auxiliary.spacing.default',
    'semantic.layout.secondary.spacing.default',
    'semantic.layout.primary.spacing.default',
    'semantic.layout.tertiary.spacing.default',
    'semantic.layout.context.spacing.default',
    'semantic.type.hierarchy.neutral.font-size.default',
    'semantic.type.hierarchy.secondary.font-size.default',
    'semantic.type.hierarchy.neutral.font-weight.default',
    'semantic.type.hierarchy.primary.font-weight.default',
    'semantic.type.hierarchy.neutral.line-height.default',
    'semantic.type.hierarchy.neutral.font-family.default',
    'semantic.layout.neutral.content-width.default',
    'semantic.layout.primary.border-width.focus-visible',
    'semantic.layout.secondary.spacing.focus-visible',
    'semantic.layout.neutral.border-width.disabled',
    'semantic.layout.neutral.radius.disabled',
    'semantic.layout.auxiliary.spacing.disabled',
    'semantic.layout.secondary.spacing.disabled',
    'semantic.type.hierarchy.neutral.font-size.disabled',
    'semantic.type.hierarchy.neutral.font-weight.disabled',
    'semantic.type.hierarchy.neutral.line-height.disabled',
    'semantic.type.hierarchy.neutral.font-family.disabled',
  ])
  const nodes = new Map([...old.primitives, ...old.styles].map((x) => [x.id, x]))
  const leaf = (id, trail = new Set()) => {
    if (trail.has(id) || !nodes.has(id)) throw new Error('invalid-reference')
    const n = nodes.get(id)
    return n.reference ? leaf(n.reference, new Set([...trail, id])) : n
  }
  const styles = old.styles.filter((s) => !retired.has(s.id))
  for (const s of styles)
    if (!semanticEligible(catalog, s.intention, s.role))
      throw new Error('unclassified-custom-style')
  const retained = new Set(styles.map((s) => s.id))
  const nextSheets = sheets.map((sheet) => ({
    ...structuredClone(sheet),
    schemaVersion: 4,
    bindings: sheet.bindings.map((b) => {
      const next = {
        ...b,
        style: retained.has(b.style) ? b.style : null,
        baseReference: leaf(b.style).id,
        reference: retired.has(b.reference) ? leaf(b.reference).id : b.reference,
      }
      if (next.reference === (next.style ?? next.baseReference)) delete next.provenance
      return next
    }),
  }))
  for (const sheet of nextSheets) {
    const guidance = sheet.presentation?.semanticGuidance
    if (guidance)
      guidance.recommendations = guidance.recommendations
        .map((rule) => ({
          ...rule,
          properties: rule.properties.filter((property) =>
            rule.intentions.every((intention) =>
              semanticEligible(catalog, intention, contract.properties[property].role),
            ),
          ),
        }))
        .filter((rule) => rule.properties.length)
  }
  const model = {
    schemaVersion: 4,
    primitives: old.primitives,
    styles,
    bindings: nextSheets.flatMap((s) => s.bindings),
  }
  validateEditorModel(model, catalog, contract)
  for (const sheet of nextSheets)
    validateSheet(sheet, { contract, catalog, validators: currentValidators }, model)
  for (const b of model.bindings) {
    const before = old.bindings.find((x) => x.id === b.id)
    if (leaf(before.reference).value !== leaf(b.reference).value)
      throw new Error('migration-value-change')
  }
  const tokens = semantic.tokens.map((t) => ({
    ...t,
    value: {
      reference: retired.has(t.value.reference) ? leaf(t.value.reference).id : t.value.reference,
    },
  }))
  const report = {
    from: 3,
    to: 4,
    removedStyles: old.styles.filter((s) => retired.has(s.id)),
    bindings: old.bindings.map((before, i) => ({ before, after: model.bindings[i] })),
    aliases: semantic.tokens.map((before, i) => ({ before, after: tokens[i] })),
  }
  return {
    changed: true,
    primitives: { ...primitives, schemaVersion: 4 },
    semantic: { ...semantic, schemaVersion: 4, styles, tokens },
    registry: { ...registry, schemaVersion: 4 },
    sheets: nextSheets,
    report,
    model,
  }
}
export async function migrateRoot(input, { write = false, reportFile } = {}) {
  const root = path.resolve(input)
  if ((await realpath(root)) !== root) throw new Error('unsafe-migration-path')
  // Offline sources only: never reinterpret a journal or replace a running instance.
  for (const file of ['owner.json', 'owner', 'active', 'recovery-owner'])
    try {
      await lstat(path.join(root, '.design-editor.local', file))
      throw new Error('old-writer-state')
    } catch (e) {
      if (e.code !== 'ENOENT') throw e
    }
  try {
    if ((await readdir(path.join(root, '.design-editor.local/records'))).length)
      throw new Error('old-writer-state')
  } catch (e) {
    if (e.code !== 'ENOENT') throw e
  }
  return withEditorRead(root, async () => {
    const inputs = new Map()
    const yaml = async (file) => {
      const entry = await readSafe(root, file)
      inputs.set(file, entry)
      const { bytes } = entry
      const doc = parseDocument(bytes.toString(), { uniqueKeys: true })
      if (doc.errors.length) throw new Error('yaml-invalid')
      return doc.toJS({ maxAliasCount: 0 })
    }
    const base = 'src/design-system/authority/',
      contract = await yaml(base + 'editor-contract.yaml'),
      catalog = await yaml(base + 'semantic-catalog.yaml')
    const prim = await yaml(base + 'primitives.yaml'),
      sem = await yaml(base + 'semantic-tokens.yaml'),
      reg = await yaml(base + 'components.yaml'),
      sheets = await Promise.all(contract.targets.map((t) => yaml(t.sheet)))
    const result = migrateSources(prim, sem, reg, sheets, contract, catalog)
    if (!result.changed) return result
    const outputs = [
      [base + 'primitives.yaml', result.primitives],
      [base + 'semantic-tokens.yaml', result.semantic],
      [base + 'components.yaml', result.registry],
      ...contract.targets.map((t, i) => [t.sheet, result.sheets[i]]),
    ]
    if (write) {
      if (!reportFile) throw new Error('migration-report-required')
      const target = path.resolve(root, reportFile)
      if (
        !target.endsWith('.json') ||
        path.relative(root, target).split(path.sep).includes('.design-editor.local') ||
        !target.startsWith(root + path.sep) ||
        (await realpath(path.dirname(target))) !== path.dirname(target)
      )
        throw new Error('unsafe-migration-path')
      const serialized = outputs.map(([file, value]) => [
        file,
        Buffer.from(stringify(value, { lineWidth: 0, aliasDuplicateObjects: false })),
      ])
      if (serialized.some(([, bytes]) => bytes.length > 2 * 1024 * 1024))
        throw new Error('authority-too-large')
      // Persist the before/after report before touching this disposable copy's sources.
      const report = await open(
        target,
        constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW,
        0o600,
      )
      try {
        await report.writeFile(JSON.stringify(result.report, null, 2) + '\n')
        await report.sync()
      } finally {
        await report.close()
      }
      await syncDir(path.dirname(target))
      for (const [file, bytes] of serialized) {
        await checkParents(root, file)
        const before = inputs.get(file),
          current = await readSafe(root, file)
        if (current.hash !== before.hash || !sameIdentity(current, before))
          throw new Error('revision-conflict')
        const handle = await open(path.join(root, file), constants.O_WRONLY | constants.O_NOFOLLOW)
        try {
          const stat = await handle.stat()
          if (stat.nlink !== 1 || !sameIdentity(identity(stat), before))
            throw new Error('revision-conflict')
          await handle.truncate(0)
          await handle.writeFile(bytes)
          await handle.sync()
        } finally {
          await handle.close()
        }
      }
    }
    return result
  })
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2)
  let root = fileURLToPath(new URL('..', import.meta.url)),
    write = false,
    reportFile
  const seen = new Set()
  for (let i = 0; i < args.length; i++) {
    const flag = args[i]
    if (seen.has(flag)) throw new Error('invalid-migration-arguments')
    seen.add(flag)
    if (flag === '--write') write = true
    else if (
      ['--root', '--report'].includes(flag) &&
      args[i + 1] &&
      !args[i + 1].startsWith('--')
    ) {
      const value = args[++i]
      if (flag === '--root') root = value
      else reportFile = value
    } else throw new Error('invalid-migration-arguments')
  }
  const result = await migrateRoot(root, { write, reportFile })
  console.log(
    result.changed
      ? `v4 ${write ? 'written' : 'dry-run'}: ${result.model.styles.length} semantic styles, ${result.model.bindings.length} component tokens.`
      : 'Already v4; no write.',
  )
}
