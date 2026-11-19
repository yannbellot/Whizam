import { constants } from 'node:fs'
import { migrationMarker } from './decision-policy-state.mjs'
export { migrationMarker } from './decision-policy-state.mjs'
import * as fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseDocument } from 'yaml'
import { parseBounded } from './design-editor/parsing.mjs'
import { readTokens, buildTokenDocument, tokenPath } from './dtcg-tokens.mjs'
import { readSafe, checkParents, syncDir } from './design-editor/files.mjs'
import { validateFontResources } from './design-editor/fonts.mjs'
import { manifestPaths } from './design-editor/manifest.mjs'
import { prepareEditorArtifacts } from './editor-artifacts.mjs'

const kitRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)))
const namespace = 'src/design-system/authority/'
export async function policyPlan() {
  return JSON.parse(
    await fs.readFile(
      new URL('../docs/work-items/ds-arch-02/allocation.json', import.meta.url),
      'utf8',
    ),
  )
}
/** Only unchanged initial attributions are adopted. Every original value is checked. */
export function consolidateDecisions(document, plan) {
  const before = readTokens(document)
  if (plan.decisionRecords.some((r) => before.ids.has(r.meta.id)))
    throw new Error('already-consolidated-or-conflicting-decisions')
  const records = before.entries.map((e) => ({
    type: e.type,
    value: e.node.$value,
    reference: e.reference,
    meta: structuredClone(e.meta),
    deprecated: e.node.$deprecated,
  }))
  const ids = new Map(records.map((e) => [e.meta.id, e]))
  const changes = []
  for (const item of plan.tokens.filter((e) => e.action === 'attach-decision')) {
    const entry = ids.get(item.id)
    if (!entry) throw new Error('missing-migration-identity')
    const own = entry.meta.editor
    const designer = own?.provenance?.kind === 'designer-edit'
    if (
      entry.reference !== item.beforeReference ||
      designer ||
      (own && own.style !== item.beforeEditor.style)
    ) {
      if (own && entry.reference.startsWith('primitive.'))
        own.provenance ??= {
          kind: 'designer-edit',
          status: 'proposed',
          reason:
            'Attribution locale conservée lors de DS-ARCH-02 ; décision initiale non imposée.',
        }
      if (entry.meta.consumer && entry.reference.startsWith('primitive.'))
        entry.meta.consumer.usage = 'Exception locale conservée : ' + entry.meta.consumer.usage
      changes.push({ id: item.id, status: 'preserved-local-attribution' })
      continue
    }
    entry.reference = item.afterReference
    if (own) own.style = item.afterEditor.style
    changes.push({ id: item.id, status: 'adopted' })
  }
  for (const [id, reason] of Object.entries(plan.technicalExceptions))
    if (ids.has(id)) ids.get(id).meta.consumer.usage = reason
  for (const definition of [...plan.primitiveRecords, ...plan.decisionRecords])
    records.push(structuredClone(definition))
  const next = buildTokenDocument(records, { decisionPolicyVersion: 1 }),
    result = readTokens(next)
  for (const entry of before.entries)
    if (JSON.stringify(entry.value) !== JSON.stringify(result.ids.get(entry.id).value))
      throw new Error('migration-would-change-value:' + entry.id)
  return { document: next, changes }
}
export async function migrateDecisionCopy(inputRoot) {
  const root = await fs.realpath(inputRoot)
  if (root === kitRoot) throw new Error('use-clean-inactive-copy')
  for (const forbidden of ['.design-editor.local', migrationMarker]) {
    try {
      await fs.lstat(path.join(root, forbidden))
      throw new Error('use-clean-inactive-copy')
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
    }
  }
  const marker = await fs.open(path.join(root, migrationMarker), 'wx', 0o600)
  try {
    await marker.writeFile(JSON.stringify({ version: 1, copyOnly: true }))
    await marker.sync()
  } finally {
    await marker.close()
  }
  await syncDir(root)
  // A writer that passed its first check must see the marker after acquiring its state directory.
  try {
    await fs.lstat(path.join(root, '.design-editor.local'))
    throw new Error('use-clean-inactive-copy')
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
  const inputs = new Map()
  const readInput = async (file) => {
    const source = await readSafe(root, file)
    inputs.set(file, source.bytes)
    return source
  }
  const plan = await policyPlan(),
    source = await readInput(tokenPath)
  const result = consolidateDecisions(
    parseBounded(source.bytes.toString(), { format: 'json', depth: 32, nodes: 100000 }),
    plan,
  )
  const outputs = new Map([
    [tokenPath, Buffer.from(JSON.stringify(result.document, null, 2) + '\n')],
  ])
  const catalogPath = namespace + 'semantic-catalog.yaml',
    catalogSource = await readInput(catalogPath)
  const catalog = parseDocument(catalogSource.bytes.toString(), { uniqueKeys: true }),
    data = catalog.toJSON()
  if (catalog.errors.length) throw new Error('invalid-migration-catalog')
  for (const record of plan.decisionRecords.filter(
    (r) => r.meta.collection === 'editor' && r.meta.classification === 'semantic',
  )) {
    const [category, key] = record.meta.editor.intention.split('.'),
      original = plan.catalog.categories.find((c) => c.id === category)
    const group = data.categories.find((c) => c.id === category),
      wanted = original.intentions.find((i) => i.id === key)
    const existing = group.intentions.find((i) => i.id === key)
    if (existing && JSON.stringify(existing) !== JSON.stringify(wanted))
      throw new Error('conflicting-intention')
    if (!existing) group.intentions.push(wanted)
    const eligibility = plan.catalog.semanticEligibility.find(
      (e) => e.intention === record.meta.editor.intention && e.role === record.meta.editor.role,
    )
    const prior = data.semanticEligibility.find(
      (e) => e.intention === eligibility.intention && e.role === eligibility.role,
    )
    if (prior && JSON.stringify(prior) !== JSON.stringify(eligibility))
      throw new Error('conflicting-eligibility')
    if (!prior) data.semanticEligibility.push(eligibility)
  }
  catalog.set('categories', data.categories)
  catalog.set('semanticEligibility', data.semanticEligibility)
  outputs.set(catalogPath, Buffer.from(catalog.toString({ lineWidth: 0 })))
  const rulesPath = namespace + 'ui-composition.yaml',
    ruleSource = await readInput(rulesPath),
    rules = parseDocument(ruleSource.bytes.toString(), { uniqueKeys: true })
  if (rules.errors.length) throw new Error('invalid-migration-recipes')
  for (const [i, oldRecipe] of rules.toJSON().recipes.entries()) {
    const old = plan.recipesBefore.recipes.find((r) => r.id === oldRecipe.id),
      next = plan.recipesAfter.recipes.find((r) => r.id === oldRecipe.id)
    if (!old || !next) continue
    for (const [j, part] of oldRecipe.parts.entries())
      if (
        typeof part === 'object' &&
        typeof old.parts[j] === 'object' &&
        part.reference === old.parts[j].reference
      )
        rules.setIn(['recipes', i, 'parts', j, 'reference'], next.parts[j].reference)
  }
  outputs.set(rulesPath, Buffer.from(rules.toString({ lineWidth: 0 })))
  for (const sheet of plan.sheets) {
    const source = await readInput(sheet.file),
      doc = parseDocument(source.bytes.toString(), { uniqueKeys: true }),
      current = doc.toJSON().presentation.semanticGuidance
    if (doc.errors.length) throw new Error('invalid-migration-sheet')
    if (!current) continue
    const list = [...current.recommendations]
    for (const rule of sheet.recommendations)
      if (
        !list.some(
          (r) =>
            r.variants.some((v) => rule.variants.includes(v)) &&
            r.part === rule.part &&
            r.properties.some((p) => rule.properties.includes(p)) &&
            r.states.some((s) => rule.states.includes(s)),
        )
      )
        list.push(rule)
    doc.setIn(['presentation', 'semanticGuidance', 'recommendations'], list)
    outputs.set(sheet.file, Buffer.from(doc.toString({ lineWidth: 0 })))
  }
  // Build and validate the complete candidate on a separate source tree before publication.
  const staging = await fs.mkdtemp(path.join(root, '.decision-policy-stage-'))
  try {
    const preimages = new Map()
    for (const file of manifestPaths) {
      const info = await readSafe(root, file)
      if (inputs.has(file) && !inputs.get(file).equals(info.bytes))
        throw new Error('migration-source-changed')
      preimages.set(file, info.bytes)
      await fs.mkdir(path.dirname(path.join(staging, file)), { recursive: true })
      await fs.writeFile(path.join(staging, file), outputs.get(file) ?? info.bytes)
    }
    const prepared = await prepareEditorArtifacts(staging)
    await validateFontResources(root, prepared.snapshot.model)
    for (const [f, b] of prepared.outputs) outputs.set(f, b)
    for (const [f, b] of preimages)
      if (!(await readSafe(root, f)).bytes.equals(b)) throw new Error('migration-source-changed')
    for (const [file, bytes] of outputs) {
      await fs.mkdir(path.dirname(path.join(root, file)), { recursive: true })
      await checkParents(root, file)
      const existing = await fs.lstat(path.join(root, file)).catch((e) => {
        if (e.code === 'ENOENT') return null
        throw e
      })
      if (existing && (!existing.isFile() || existing.isSymbolicLink() || existing.nlink !== 1))
        throw new Error('unsafe-migration-output')
      const handle = await fs.open(
        path.join(root, file),
        constants.O_WRONLY | constants.O_CREAT | constants.O_TRUNC | constants.O_NOFOLLOW,
        0o644,
      )
      try {
        await handle.writeFile(bytes)
        await handle.sync()
      } finally {
        await handle.close()
      }
    }
    for (const parent of new Set([...outputs.keys()].map((f) => path.dirname(path.join(root, f)))))
      await syncDir(parent)
    await fs.unlink(path.join(root, migrationMarker))
    await syncDir(root)
    return result.changes
  } finally {
    await fs.rm(staging, { recursive: true, force: true })
  }
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.length !== 4 || process.argv[2] !== '--write-copy')
    throw new Error('Usage: node scripts/migrate-decision-policy.mjs --write-copy PATH')
  console.log(JSON.stringify(await migrateDecisionCopy(process.argv[3]), null, 2))
}
