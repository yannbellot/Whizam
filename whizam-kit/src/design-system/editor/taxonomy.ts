import { z } from 'zod'
import { primitiveFamily } from './naming.ts'
import type {
  Binding,
  Catalog,
  EditorContract,
  EditorModel,
  EditorPrimitive,
  EditorStyle,
} from './contract'

const key = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[a-z][a-z0-9-]*(?:\.[a-z][a-z0-9-]*)*$/)
const text = z.string().min(1).max(400)
const node = z
  .object({ path: key, definition: text, examples: z.array(text).min(1).max(8) })
  .strict()
export const taxonomySchema = z
  .object({
    schemaVersion: z.literal(1),
    collections: z
      .object({
        primitive: z.array(node).min(1).max(120),
        semantic: z.array(node).min(1).max(120),
      })
      .strict(),
    vocabulary: z
      .array(
        z
          .object({
            term: key,
            axis: z.enum([
              'concept',
              'priority',
              'heading',
              'density',
              'elevation',
              'intensity',
              'state',
            ]),
            definition: text,
            examples: z.array(text).min(1).max(8),
            scope: z.array(key).min(1).max(20),
          })
          .strict(),
      )
      .min(1)
      .max(120),
    modes: z
      .array(
        z
          .object({
            axis: z.enum(['theme', 'viewport', 'density', 'locale']),
            values: z.array(key).min(1).max(10),
            active: z.literal(false),
            fallback: z.null(),
            selection: text,
          })
          .strict(),
      )
      .length(4),
    rules: z
      .array(
        z.enum([
          'controlled-vocabulary',
          'separate-intent-state',
          'explicit-hierarchy',
          'documented-associations',
          'separate-modes',
          'real-usages-only',
        ]),
      )
      .length(6),
    classification: z
      .object({
        primitiveFamilies: z.record(key, key),
        semanticRoles: z.record(key, key),
        colorIntentions: z.record(key, key),
      })
      .strict(),
  })
  .strict()
export type Taxonomy = z.infer<typeof taxonomySchema>

function unique(values: string[], code: string) {
  if (new Set(values).size !== values.length) throw new Error(code)
}
export function validateTaxonomy(input: unknown, contract: EditorContract, catalog: Catalog): void {
  const data = taxonomySchema.parse(input)
  unique(data.rules, 'duplicate-token-rule')
  unique(
    data.modes.map((mode) => mode.axis),
    'duplicate-mode-axis',
  )
  unique(
    data.vocabulary.map((term) => term.term),
    'duplicate-vocabulary-term',
  )
  for (const mode of data.modes) unique(mode.values, 'duplicate-mode-value')
  for (const collection of Object.values(data.collections)) {
    unique(
      collection.map((item) => item.path),
      'duplicate-taxonomy-category',
    )
    const paths = new Set(collection.map((item) => item.path))
    for (const item of collection)
      if (item.path.includes('.') && !paths.has(item.path.slice(0, item.path.lastIndexOf('.'))))
        throw new Error('missing-taxonomy-parent')
  }
  const requirePath = (collection: keyof Taxonomy['collections'], path: string) => {
    if (!data.collections[collection].some((item) => item.path === path))
      throw new Error('unknown-taxonomy-category')
  }
  for (const [family, path] of Object.entries(data.classification.primitiveFamilies)) {
    requirePath('primitive', path)
    if (family === 'color' ? !path.startsWith('color.') : path !== family)
      throw new Error('incompatible-primitive-category')
  }
  for (const path of Object.values(data.classification.semanticRoles)) requirePath('semantic', path)
  for (const [category, path] of Object.entries(data.classification.colorIntentions)) {
    if (!catalog.categories.some((item) => item.id === category))
      throw new Error('unknown-taxonomy-intention')
    requirePath('semantic', path)
    if (!path.startsWith('color.')) throw new Error('incompatible-taxonomy-intention')
  }
  const expected: Record<string, string> = {
    surface: 'color',
    text: 'color',
    border: 'color',
    icon: 'color',
    focus: 'color',
    spacing: 'space',
    radius: 'shape',
    'border-width': 'stroke',
    'content-width': 'size',
    'font-size': 'type',
    'font-family': 'type',
    'font-weight': 'type',
    'line-height': 'type',
  }
  for (const property of Object.values(contract.properties)) {
    if (!data.classification.primitiveFamilies[primitiveFamily(property.type, property.role)])
      throw new Error('missing-primitive-category')
    const path = data.classification.semanticRoles[property.role]
    if (!path || path.split('.')[0] !== expected[property.role])
      throw new Error('incompatible-taxonomy-role')
  }
}

export function primitiveCategory(taxonomy: Taxonomy, primitive: EditorPrimitive): string {
  const path = taxonomy.classification.primitiveFamilies[primitive.family]
  if (!path) throw new Error('unknown-primitive-category')
  return path
}
export function semanticCategory(taxonomy: Taxonomy, style: EditorStyle): string {
  const path =
    style.type === 'color' && style.role !== 'focus'
      ? (taxonomy.classification.colorIntentions[style.intention.split('.')[0]] ??
        taxonomy.classification.semanticRoles[style.role])
      : taxonomy.classification.semanticRoles[style.role]
  if (!path) throw new Error('unknown-semantic-category')
  return path
}
export function componentCategory(contract: EditorContract, binding: Binding): string {
  const component = contract.targets.find((target) => target.id === binding.target)?.component
  if (!component) throw new Error('unknown-component-category')
  return component
}
/** Each identity is listed once; only populated paths and their ancestors are exposed. */
export function categoryGroups<T>(items: readonly T[], category: (item: T) => string) {
  const groups = new Map<string, T[]>()
  for (const item of items) {
    const path = category(item)
    groups.set(path, [...(groups.get(path) ?? []), item])
  }
  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b, 'en'))
    .map(([path, entries]) => ({ path, entries }))
}
export function validateModelCategories(
  model: EditorModel,
  catalog: Catalog,
  contract: EditorContract,
) {
  for (const primitive of model.primitives) primitiveCategory(catalog.taxonomy, primitive)
  for (const style of model.styles) semanticCategory(catalog.taxonomy, style)
  for (const binding of model.bindings) componentCategory(contract, binding)
}
