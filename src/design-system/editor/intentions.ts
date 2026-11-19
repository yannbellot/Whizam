import { z } from 'zod'
import { canonicalJSON } from './canonical-json.ts'
import type { Catalog, EditorContract, EditorOperation, EditorModel } from './contract'

const key = z
  .string()
  .regex(/^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/)
  .max(80)
const text = z.string().trim().min(1).max(400)
export const intentionSchema = z
  .object({
    category: key,
    id: key,
    label: text,
    definition: text,
    examples: z.array(text).min(1).max(8),
    synonyms: z.array(text).min(1).max(12),
  })
  .strict()
export type IntentionDefinition = z.infer<typeof intentionSchema>
export function intentionKey(definition: IntentionDefinition) {
  return `${definition.category}.${definition.id}`
}
const equivalent = (text: string) =>
  text.normalize('NFKD').replace(/\p{M}/gu, '').trim().toLowerCase()
/** Additive data only: categories, taxonomy, executable compatibility and old definitions stay fixed. */
export function catalogForOperations(
  catalog: Catalog,
  model: EditorModel,
  contract: EditorContract,
  operations: EditorOperation[],
): Catalog {
  const next = structuredClone(catalog)
  for (const operation of operations) {
    if (operation.kind !== 'define-and-assign' || operation.classification === 'non-semantic')
      continue
    const definition = intentionSchema.parse(operation.definition)
    const category = next.categories.find((c) => c.id === definition.category)
    const binding = model.bindings.find((b) => b.id === operation.target)
    if (!category || !binding) throw new Error('unknown-reference')
    const property = contract.properties[binding.property]
    if (!category.compatibility.includes(`${property.type}:${property.role}`))
      throw new Error('incompatible-intention')
    const names = new Set([definition.id, definition.label, ...definition.synonyms].map(equivalent))
    if (
      next.categories.some((c) =>
        c.intentions.some((i) =>
          [i.id, i.label, ...i.synonyms].some((n) => names.has(equivalent(n))),
        ),
      )
    )
      throw new Error('intention-exists')
    const entry = {
      id: definition.id,
      label: definition.label,
      definition: definition.definition,
      examples: definition.examples,
      synonyms: definition.synonyms,
    }
    category.intentions.push(entry)
    next.semanticEligibility.push({
      intention: intentionKey(definition),
      role: property.role,
      definition: definition.definition,
    })
    if (category.intentions.length > 100 || next.semanticEligibility.length > 2000)
      throw new Error('budget-exceeded')
  }
  return next
}
/** Validate refreshed data against the compiled structural authority, allowing bounded additions only. */
export function assertCatalogExtension(
  candidate: Catalog,
  trusted: Catalog,
  contract: EditorContract,
): void {
  if (
    !candidate ||
    !Array.isArray(candidate.categories) ||
    !Array.isArray(candidate.semanticEligibility)
  )
    throw new Error('invalid-catalog-extension')
  const reduced = structuredClone(candidate)
  const additions = new Map<string, string>()
  if (candidate.categories.length !== trusted.categories.length)
    throw new Error('invalid-catalog-extension')
  for (let index = 0; index < trusted.categories.length; index++) {
    const base = trusted.categories[index],
      current = reduced.categories[index]
    if (
      !Array.isArray(current?.intentions) ||
      current.intentions.length < base.intentions.length ||
      current.intentions.length > 100
    )
      throw new Error('invalid-catalog-extension')
    for (const entry of current.intentions.slice(base.intentions.length)) {
      if (Object.keys(entry).sort().join(',') !== 'definition,examples,id,label,synonyms')
        throw new Error('invalid-catalog-extension')
      const parsed = intentionSchema.parse({ category: base.id, ...entry })
      additions.set(intentionKey(parsed), parsed.definition)
    }
    current.intentions = current.intentions.slice(0, base.intentions.length)
  }
  if (
    candidate.semanticEligibility.length > 2000 ||
    candidate.semanticEligibility.length < trusted.semanticEligibility.length
  )
    throw new Error('invalid-catalog-extension')
  for (const entry of candidate.semanticEligibility.slice(trusted.semanticEligibility.length)) {
    if (
      Object.keys(entry).sort().join(',') !== 'definition,intention,role' ||
      additions.get(entry.intention) !== entry.definition ||
      !Object.values(contract.properties).some((p) => p.role === entry.role)
    )
      throw new Error('invalid-catalog-extension')
  }
  for (const intention of additions.keys())
    if (!candidate.semanticEligibility.some((e) => e.intention === intention))
      throw new Error('invalid-catalog-extension')
  reduced.semanticEligibility = reduced.semanticEligibility.slice(
    0,
    trusted.semanticEligibility.length,
  )
  if (canonicalJSON(reduced) !== canonicalJSON(trusted))
    throw new Error('invalid-catalog-extension')
}
