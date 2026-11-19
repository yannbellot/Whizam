import { catalogForOperations, intentionKey } from './intentions.ts'
import type { IntentionDefinition } from './intentions'
import { validateTaxonomy, validateModelCategories } from './taxonomy.ts'
import type { Taxonomy } from './taxonomy.ts'
import {
  componentName,
  primitiveFamily,
  primitiveName,
  semanticName,
  semanticTemplate,
} from './naming.ts'
/** Contrats purs de DS-EDIT-01 A : aucune écriture, génération ou interface. */
export type ValueType = 'color' | 'dimension' | 'font-weight' | 'line-height' | 'font-family'
export type PropertyDefinition = {
  cssProperty?: string
  label?: string
  type: ValueType
  role: string
  min?: number
  max?: number
  units?: string[]
}
export type Catalog = {
  semanticEligibility: { intention: string; role: string; definition: string }[]
  taxonomy: Taxonomy
  schemaVersion: 1
  categories: {
    id: string
    label: string
    definition: string
    examples: string[]
    compatibility: string[]
    identifierTemplate: string
    intentions: {
      id: string
      label: string
      definition: string
      examples: string[]
      synonyms: string[]
    }[]
  }[]
}
export type EditorContract = {
  schemaVersion: 1
  propertyGroups?: { id: string; label: string; properties: string[] }[]
  properties: Record<string, PropertyDefinition>
  fontFamilies: string[]
  targets: {
    id: string
    component: string
    sheet: string
    variants: string[]
    states: string[]
    cells: { part: string; properties: string[]; states: string[] }[]
  }[]
}
export type Provenance = {
  kind: 'designer-edit' | 'agent-migration'
  status: 'proposed'
  reason: string
}
export type EditorPrimitive = {
  id: string
  family: string
  type: ValueType
  value: string | number
  provenance: Provenance
  origins?: { id: string; provenance: Provenance }[]
}
export type EditorStyle = {
  classification?: 'semantic' | 'non-semantic'
  justification?: string
  id: string
  type: ValueType
  intention: string
  role: string
  state: string
  reference: string
}
export type Binding = {
  id: string
  target: string
  variant: string
  part: string
  property: string
  state: string
  style: string | null
  baseReference: string
  reference: string
  provenance?: Provenance
}
export type EditorModel = {
  schemaVersion: 4
  primitives: EditorPrimitive[]
  styles: EditorStyle[]
  bindings: Binding[]
}
export type EditorOperation =
  | {
      kind: 'restore-binding'
      target: string
      reference: string
      style: string | null
      provenance?: Provenance
    }
  | {
      kind: 'define-and-assign'
      target: string
      definition: IntentionDefinition
      classification?: 'semantic' | 'non-semantic'
      value: string | number
    }
  | { kind: 'assign'; target: string; style: string }
  | { kind: 'create-and-assign'; target: string; intention: string; value: string | number }
  | { kind: 'create-style'; target: string; intention: string; value: string | number }
  | { kind: 'update-shared'; style: string; value: string | number }
  | { kind: 'set-component-token'; target: string; value: string | number }
  | { kind: 'restore'; target: string }
export type EditorRequest = {
  protocolVersion: 4
  requestId: string
  baseRevision: string
  operations: EditorOperation[]
}

export type DraftStatus =
  'clean' | 'dirty' | 'validating' | 'saving' | 'conflict' | 'failed' | 'unknown-outcome'
export type EditorIssue = { code: string; message: string; target?: string; style?: string }
export type EditorResponse =
  | { status: 'saved'; requestId: string; revision: string }
  | { status: 'invalid'; requestId?: string; issues: EditorIssue[] }
  | {
      status: 'conflict' | 'failed' | 'recovery-required'
      requestId: string
      revision?: string
      issues: EditorIssue[]
    }
  | { status: 'pending' | 'unknown'; requestId: string; revision?: string }

export const styleKey = (style: Pick<EditorStyle, 'intention' | 'type' | 'role' | 'state'>) =>
  [style.intention, style.type, style.role, style.state].join('|')
export const styleId = (style: Pick<EditorStyle, 'intention' | 'type' | 'role' | 'state'>) =>
  semanticName(style)
export const bindingId = (
  binding: Omit<Binding, 'id' | 'style' | 'baseReference' | 'reference' | 'provenance'>,
) => componentName(binding)
export const cssVariable = (id: string) => `--adl-${id.replaceAll('.', '-')}`

/** Domaines CSS résolus depuis les autorités ; aucune borne esthétique. */
export function normalizeValue(
  definition: PropertyDefinition,
  value: string | number,
  fontFamilies: string[],
): string | number {
  if (definition.type === 'color') {
    if (typeof value !== 'string' || !/^#(?:[\da-f]{3,4}|[\da-f]{6}|[\da-f]{8})$/i.test(value))
      throw new Error('invalid-color')
    const hex = value.slice(1).toLowerCase()
    return `#${hex.length <= 4 ? [...hex].map((digit) => digit + digit).join('') : hex}`.replace(
      /^(#[\da-f]{6})ff$/,
      '$1',
    )
  }
  if (definition.type === 'font-family') {
    if (typeof value !== 'string' || !fontFamilies.includes(value))
      throw new Error('invalid-font-family')
    return value
  }
  let number: number
  let unit = ''
  if (definition.type === 'dimension') {
    const match = typeof value === 'string' && /^(-?\d+(?:\.\d{1,6})?)(px|rem)$/.exec(value)
    if (!match || !definition.units?.includes(match[2])) throw new Error('invalid-dimension')
    number = Number(match[1])
    unit = match[2]
  } else {
    if (typeof value !== 'number' || !Number.isFinite(value)) throw new Error('invalid-number')
    number = value
    if (
      definition.type === 'line-height' &&
      Math.abs(number * 1e6 - Math.round(number * 1e6)) > 1e-8
    )
      throw new Error('invalid-precision')
  }
  if (!Number.isFinite(number)) throw new Error('invalid-number')
  const bounded = !definition.cssProperty && unit === 'rem' ? number * 16 : number
  if (
    (definition.min !== undefined && bounded < definition.min) ||
    (definition.max !== undefined && bounded > definition.max)
  )
    throw new Error('value-out-of-range')
  return unit ? `${number}${unit}` : number
}

function unique(values: string[], code: string) {
  if (new Set(values).size !== values.length) throw new Error(code)
}
export function validateCatalog(catalog: Catalog, contract: EditorContract) {
  // Historical frozen contracts predate presentation groups.
  if (contract.propertyGroups) {
    unique(
      contract.propertyGroups.map((group) => group.id),
      'duplicate-property-group',
    )
    const grouped = contract.propertyGroups.flatMap((group) => group.properties)
    unique(grouped, 'duplicate-grouped-property')
    if (
      grouped.length !== Object.keys(contract.properties).length ||
      grouped.some((id) => !Object.hasOwn(contract.properties, id))
    )
      throw new Error('incomplete-property-groups')
  }
  unique(
    catalog.categories.map((category) => category.id),
    'duplicate-category',
  )
  const compatibilities = new Set(
    Object.values(contract.properties).map((property) => `${property.type}:${property.role}`),
  )
  for (const category of catalog.categories) {
    unique(
      category.intentions.map((intention) => intention.id),
      'duplicate-intention',
    )
    if (category.identifierTemplate !== semanticTemplate)
      throw new Error('invalid-identifier-template')
    if (category.compatibility.some((item) => !compatibilities.has(item)))
      throw new Error('unknown-compatibility')
  }
  unique(
    contract.targets.map((target) => target.id),
    'duplicate-target',
  )
  unique(
    contract.targets.map((target) => target.component),
    'duplicate-component',
  )
  unique(
    contract.targets.map((target) => target.sheet),
    'duplicate-sheet',
  )
  const validPairs = new Set([
    'color:surface',
    'color:text',
    'color:border',
    'color:icon',
    'color:focus',
    'dimension:spacing',
    'dimension:radius',
    'dimension:border-width',
    'dimension:font-size',
    'dimension:content-width',
    'font-weight:font-weight',
    'line-height:line-height',
    'font-family:font-family',
  ])
  for (const property of Object.values(contract.properties)) {
    if (!validPairs.has(`${property.type}:${property.role}`))
      throw new Error('incompatible-property')
    if (
      ['dimension', 'font-weight', 'line-height'].includes(property.type) &&
      ((property.min !== undefined && !Number.isFinite(property.min)) ||
        (property.max !== undefined && !Number.isFinite(property.max)) ||
        (property.min !== undefined && property.max !== undefined && property.min > property.max) ||
        (property.type === 'dimension' && !property.units?.length))
    )
      throw new Error('invalid-domain')
  }
  for (const target of contract.targets) {
    const expected =
      target.component === 'Button'
        ? 'src/design-system/components/Button/Button.design.yaml'
        : target.component === 'Foundations'
          ? 'src/design-system/Foundations.design.yaml'
          : `src/design-system/components/${target.component}.design.yaml`
    if (target.id !== target.component.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase())
      throw new Error('invalid-target-id')
    if (target.sheet !== expected) throw new Error('invalid-sheet-path')
    if (!target.states.includes('default')) throw new Error('missing-default-state')
    const cells: string[] = []
    for (const cell of target.cells)
      for (const property of cell.properties)
        for (const state of cell.states) {
          if (!contract.properties[property] || !target.states.includes(state))
            throw new Error('invalid-matrix')
          cells.push(`${cell.part}|${property}|${state}`)
        }
    unique(cells, 'duplicate-cell')
  }
  if (!Array.isArray(catalog.semanticEligibility)) throw new Error('missing-semantic-eligibility')
  unique(
    catalog.semanticEligibility.map((rule) => rule.intention + '|' + rule.role),
    'duplicate-semantic-eligibility',
  )
  for (const rule of catalog.semanticEligibility) {
    const [category, intention] = rule.intention.split('.')
    const owner = catalog.categories.find((c) => c.id === category)
    if (
      !owner?.intentions.some((i) => i.id === intention) ||
      !owner.compatibility.some((pair) => pair.split(':')[1] === rule.role) ||
      !rule.definition.trim()
    )
      throw new Error('invalid-semantic-eligibility')
  }
  validateTaxonomy(catalog.taxonomy, contract, catalog)
}

export function validateEditorModel(
  model: EditorModel,
  catalog: Catalog,
  contract: EditorContract,
) {
  if (model.schemaVersion !== 4) throw new Error('incompatible-model-version')
  unique(
    [...model.primitives, ...model.styles, ...model.bindings].map((item) => item.id),
    'duplicate-id',
  )
  unique(
    [...model.primitives, ...model.styles, ...model.bindings].map((item) => cssVariable(item.id)),
    'css-collision',
  )
  unique(model.styles.map(styleKey), 'duplicate-style-identity')
  const primitives = new Map(model.primitives.map((item) => [item.id, item]))
  const styles = new Map(model.styles.map((item) => [item.id, item]))
  const definitions = (style: EditorStyle) =>
    Object.values(contract.properties).filter(
      (property) => property.type === style.type && property.role === style.role,
    )
  for (const style of model.styles) {
    if (style.id !== styleId(style)) throw new Error('invalid-style-id')
    if (
      style.classification !== undefined &&
      !['semantic', 'non-semantic'].includes(style.classification)
    )
      throw new Error('invalid-decision-classification')
    const nonSemantic = style.classification === 'non-semantic'
    if (nonSemantic && !style.justification?.trim())
      throw new Error('unjustified-non-semantic-decision')
    const [categoryId, intentionId] = style.intention.split('.')
    const category = catalog.categories.find((category) => category.id === categoryId)
    if (
      !nonSemantic &&
      (!category?.intentions.some((intention) => intention.id === intentionId) ||
        !category.compatibility.includes(`${style.type}:${style.role}`))
    )
      throw new Error('incompatible-intention')
    if (!nonSemantic && !semanticEligible(catalog, style.intention, style.role))
      throw new Error('undemonstrated-semantic-role')
    const visited = new Set<string>()
    let current = style
    for (;;) {
      if (visited.has(current.id)) throw new Error('forbidden-cycle')
      visited.add(current.id)
      const next = styles.get(current.reference)
      if (next) {
        if (next.type !== style.type || next.role !== style.role) throw new Error('type-mismatch')
        current = next
        continue
      }
      const primitive = primitives.get(current.reference)
      if (!primitive) throw new Error('unknown-reference')
      if (primitive.type !== style.type) throw new Error('type-mismatch')
      if (primitive.family !== primitiveFamily(style.type, style.role))
        throw new Error('family-mismatch')
      if (
        !definitions(style).some((definition) => {
          try {
            return (
              normalizeValue(definition, primitive.value, contract.fontFamilies) === primitive.value
            )
          } catch {
            return false
          }
        })
      )
        throw new Error('non-canonical-value')
      break
    }
  }
  const checkPrimitive = (style: EditorStyle, property: PropertyDefinition, reference?: string) => {
    let current = style
    while (styles.has(current.reference)) current = styles.get(current.reference)!
    const primitive = primitives.get(reference ?? current.reference)
    if (!primitive) throw new Error('unknown-reference')
    if (primitive.type !== property.type) throw new Error('type-mismatch')
    if (primitive.family !== primitiveFamily(property.type, property.role))
      throw new Error('family-mismatch')
    if (normalizeValue(property, primitive.value, contract.fontFamilies) !== primitive.value)
      throw new Error('non-canonical-value')
  }
  for (const binding of model.bindings) {
    if ('exception' in binding || typeof binding.reference !== 'string')
      throw new Error('invalid-component-token')
    const target = contract.targets.find((target) => target.id === binding.target)
    const property = contract.properties[binding.property]
    if (
      !target?.variants.includes(binding.variant) ||
      !target.cells.some(
        (cell) =>
          cell.part === binding.part &&
          cell.properties.includes(binding.property) &&
          cell.states.includes(binding.state),
      )
    )
      throw new Error('unprepared-target')
    if (binding.id !== bindingId(binding)) throw new Error('invalid-binding-id')
    const base = primitives.get(binding.baseReference)
    if (!base) throw new Error('unknown-base-reference')
    const check = (reference: string) => {
      const primitive = primitives.get(reference)
      if (!primitive) throw new Error('unknown-reference')
      if (primitive.type !== property.type) throw new Error('type-mismatch')
      if (primitive.family !== primitiveFamily(property.type, property.role))
        throw new Error('family-mismatch')
      if (normalizeValue(property, primitive.value, contract.fontFamilies) !== primitive.value)
        throw new Error('non-canonical-value')
    }
    check(binding.baseReference)
    if (binding.style !== null) {
      const style = styles.get(binding.style)
      if (!style) throw new Error('unknown-reference')
      if (
        style.type !== property.type ||
        style.role !== property.role ||
        style.state !== binding.state
      )
        throw new Error('incompatible-style')
      checkPrimitive(style, property)
    }
    const baseline = binding.style ?? binding.baseReference
    if (binding.reference !== baseline) {
      if (!binding.provenance) throw new Error('invalid-component-token')
      check(binding.reference)
    } else if (binding.provenance) throw new Error('invalid-component-token')
  }
  // Même les primitives inutilisées doivent rester des valeurs canoniques sûres.
  for (const primitive of model.primitives) {
    if (
      !Object.values(contract.properties).some(
        (property) =>
          property.type === primitive.type &&
          primitiveFamily(property.type, property.role) === primitive.family,
      )
    )
      throw new Error('family-mismatch')
    if (primitive.id !== primitiveName(primitive.family, primitive.value))
      throw new Error('invalid-primitive-id')
    if (
      !Object.values(contract.properties).some((property) => {
        if (property.type !== primitive.type) return false
        try {
          return (
            normalizeValue(property, primitive.value, contract.fontFamilies) === primitive.value
          )
        } catch {
          return false
        }
      })
    )
      throw new Error('non-canonical-value')
  }
  validateModelCategories(model, catalog, contract)
}

/** Ordre par propriété, cohérent avec les sélecteurs actuels ; focus reste orthogonal. */
export function stateOrder(target: string, active: string[], contract: EditorContract): string[] {
  const prepared = contract.targets.find((item) => item.id === target)
  if (!prepared || active.some((state) => !prepared.states.includes(state)))
    throw new Error('unprepared-state')
  if (target === 'button')
    return [
      'default',
      ...(active.includes('hover') && !active.includes('disabled') && !active.includes('loading')
        ? ['hover']
        : []),
      ...['disabled', 'loading', 'focus-visible'].filter((state) => active.includes(state)),
    ]
  return [
    'default',
    ...['disabled', 'error', 'focus-visible'].filter((state) => active.includes(state)),
  ]
}

/** Validation sémantique de requête sur snapshot, sans application ni écriture. */
export function validateEditorRequest(
  request: EditorRequest,
  model: EditorModel,
  catalog: Catalog,
  contract: EditorContract,
) {
  const styles = new Map(model.styles.map((style) => [style.id, style]))
  const bindings = new Map(model.bindings.map((binding) => [binding.id, binding]))
  const identities = new Set(model.styles.map(styleKey))
  const createdValues = new Map<string, string | number>()
  const validateValue = (style: EditorStyle, value: string | number) => {
    const definitions = Object.values(contract.properties).filter(
      (property) => property.type === style.type && property.role === style.role,
    )
    if (
      !definitions.some((definition) => {
        try {
          normalizeValue(definition, value, contract.fontFamilies)
          return true
        } catch {
          return false
        }
      })
    )
      throw new Error('invalid-value')
    for (const binding of model.bindings) {
      let current = binding.style ? styles.get(binding.style) : undefined
      while (current) {
        if (current.id === style.id) {
          normalizeValue(contract.properties[binding.property], value, contract.fontFamilies)
          break
        }
        const next = styles.get(current.reference)
        if (!next) break
        current = next
      }
    }
  }
  catalog = catalogForOperations(catalog, model, contract, request.operations)
  for (const original of request.operations) {
    const operation =
      original.kind === 'define-and-assign'
        ? {
            kind: 'create-and-assign' as const,
            target: original.target,
            intention: intentionKey(original.definition),
            value: original.value,
          }
        : original
    if (operation.kind === 'update-shared') {
      const style = styles.get(operation.style)
      if (!style) throw new Error('unknown-reference')
      validateValue(style, operation.value)
      if (createdValues.has(style.id)) createdValues.set(style.id, operation.value)
      continue
    }
    const binding = bindings.get(operation.target)
    if (!binding) throw new Error('unknown-reference')
    const property = contract.properties[binding.property]
    if (operation.kind === 'assign') {
      const style = styles.get(operation.style)
      if (!style) throw new Error('unknown-reference')
      if (
        style.type !== property.type ||
        style.role !== property.role ||
        style.state !== binding.state
      )
        throw new Error('incompatible-style')
      // Un style encore inutilisé doit respecter les bornes du nouveau consommateur.
      if (createdValues.has(style.id)) {
        normalizeValue(property, createdValues.get(style.id)!, contract.fontFamilies)
        continue
      }
      let current = style
      while (styles.has(current.reference)) current = styles.get(current.reference)!
      const primitive = model.primitives.find((primitive) => primitive.id === current.reference)!
      normalizeValue(property, primitive.value, contract.fontFamilies)
    } else if (operation.kind === 'set-component-token') {
      normalizeValue(property, operation.value, contract.fontFamilies)
    } else if (operation.kind === 'create-and-assign' || operation.kind === 'create-style') {
      const [categoryId, intentionId] = operation.intention.split('.')
      const category = catalog.categories.find((category) => category.id === categoryId)
      if (
        !(original.kind === 'define-and-assign' && original.classification === 'non-semantic') &&
        (!category?.intentions.some((intention) => intention.id === intentionId) ||
          !category.compatibility.includes(`${property.type}:${property.role}`))
      )
        throw new Error('incompatible-intention')
      if (
        !(original.kind === 'define-and-assign' && original.classification === 'non-semantic') &&
        !semanticEligible(catalog, operation.intention, property.role)
      )
        throw new Error('undemonstrated-semantic-role')
      const key = styleKey({
        intention: operation.intention,
        type: property.type,
        role: property.role,
        state: binding.state,
      })
      if (identities.has(key)) throw new Error('style-exists')
      identities.add(key)
      const value = normalizeValue(property, operation.value, contract.fontFamilies)
      const created = {
        id: '',
        type: property.type,
        role: property.role,
        state: binding.state,
        intention: operation.intention,
        reference: '',
      }
      created.id = styleId(created)
      styles.set(created.id, created)
      createdValues.set(created.id, value)
    }
  }
}

/** Semantic meaning is an explicit authority entry, never inferred from a CSS value/type. */
export function semanticEligible(catalog: Catalog, intention: string, role: string): boolean {
  return catalog.semanticEligibility.some(
    (rule) =>
      rule.intention === intention && rule.role === role && rule.definition.trim().length > 0,
  )
}
export const bindingBase = (binding: Binding) => binding.style ?? binding.baseReference
