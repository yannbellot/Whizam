import { intentionSchema, catalogForOperations, intentionKey } from './intentions.ts'
import { primitiveFamily, primitiveName } from './naming.ts'
import { z } from 'zod'
import {
  normalizeValue,
  bindingBase,
  semanticEligible,
  styleId,
  styleKey,
  cssVariable,
  validateCatalog,
  validateEditorModel,
} from './contract.ts'
import type {
  EditorModel,
  EditorOperation,
  EditorRequest,
  EditorPrimitive,
  PropertyDefinition,
  Provenance,
  ValueType,
} from './contract.ts'
import type { EditorSnapshot } from './snapshot'
import type { Changes } from './draft'

const bindingId = z
  .string()
  .regex(/^component(?:\.[a-z][a-z0-9]*(?:-[a-z0-9]+)*){2,}$/)
  .max(240)
const semanticId = z
  .string()
  .regex(/^semantic(?:\.[a-z][a-z0-9]*(?:-[a-z0-9]+)*){2,}$/)
  .max(240)
const value = z.union([z.string().min(1).max(160), z.number().finite()])
export const operationSchema = z.discriminatedUnion('kind', [
  z
    .object({
      kind: z.literal('restore-binding'),
      target: bindingId,
      reference: z.string().min(1).max(240),
      style: semanticId.nullable(),
      provenance: z
        .object({
          kind: z.enum(['designer-edit', 'agent-migration']),
          status: z.literal('proposed'),
          reason: z.string().min(1).max(400),
        })
        .strict()
        .optional(),
    })
    .strict(),
  z
    .object({
      kind: z.literal('define-and-assign'),
      target: bindingId,
      definition: intentionSchema,
      classification: z.enum(['semantic', 'non-semantic']).optional(),
      value,
    })
    .strict(),
  z.object({ kind: z.literal('assign'), target: bindingId, style: semanticId }).strict(),
  z
    .object({
      kind: z.literal('create-and-assign'),
      target: bindingId,
      intention: z
        .string()
        .regex(/^[a-z][a-z0-9-]*\.[a-z][a-z0-9-]*$/)
        .max(160),
      value,
    })
    .strict(),
  z
    .object({
      kind: z.literal('create-style'),
      target: bindingId,
      intention: z
        .string()
        .regex(/^[a-z][a-z0-9-]*\.[a-z][a-z0-9-]*$/)
        .max(160),
      value,
    })
    .strict(),
  z.object({ kind: z.literal('update-shared'), style: semanticId, value }).strict(),
  z.object({ kind: z.literal('set-component-token'), target: bindingId, value }).strict(),
  z.object({ kind: z.literal('restore'), target: bindingId }).strict(),
])
export const saveRequestSchema = z
  .object({
    protocolVersion: z.literal(4),
    requestId: z
      .string()
      .regex(/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/),
    baseRevision: z.string().regex(/^[a-f0-9]{64}$/),
    operations: z.array(operationSchema).min(1).max(100),
  })
  .strict()
const provenance = (reason: string): Provenance => ({
  kind: 'designer-edit',
  status: 'proposed',
  reason,
})
function budget(model: EditorModel) {
  if (model.primitives.length > 4096 || model.styles.length > 4096 || model.bindings.length > 8192)
    throw new Error('budget-exceeded')
}
/** Allocation locale déterministe ; aucun accès à un système de fichiers. */
function primitiveFor(
  model: EditorModel,
  type: ValueType,
  role: string,
  value: string | number,
): EditorPrimitive {
  const family = primitiveFamily(type, role)
  const existing = model.primitives
    .filter((item) => item.type === type && item.family === family && item.value === value)
    .sort((a, b) => a.id.localeCompare(b.id, 'en'))[0]
  if (existing) return existing
  const id = primitiveName(family, value)
  if (
    [...model.primitives, ...model.styles, ...model.bindings].some(
      (item) => item.id === id || cssVariable(item.id) === cssVariable(id),
    )
  )
    throw new Error('id-collision')
  const primitive = {
    id,
    family,
    type,
    value,
    provenance: provenance('Valeur créée lors d’un réglage du design system.'),
  }
  model.primitives.push(primitive)
  return primitive
}
function normalizeStyle(
  snapshot: EditorSnapshot,
  definitions: PropertyDefinition[],
  input: string | number,
) {
  for (const definition of definitions) {
    try {
      return normalizeValue(definition, input, snapshot.contract.fontFamilies)
    } catch {
      /* Essayer le domaine compatible suivant. */
    }
  }
  throw new Error('invalid-value')
}
/** Applique une transaction ordonnée à une copie, puis valide tout son graphe. */
export function applyOperations(snapshot: EditorSnapshot, input: unknown): EditorModel {
  const operations = z.array(operationSchema).min(1).max(100).parse(input)
  budget(snapshot.model)
  validateCatalog(snapshot.catalog, snapshot.contract)
  validateEditorModel(snapshot.model, snapshot.catalog, snapshot.contract)
  const catalog = catalogForOperations(
    snapshot.catalog,
    snapshot.model,
    snapshot.contract,
    operations,
  )
  const model = structuredClone(snapshot.model)
  for (const original of operations) {
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
      const style = model.styles.find((item) => item.id === operation.style)
      if (!style) throw new Error('unknown-reference')
      const definitions = Object.values(snapshot.contract.properties).filter(
        (item) => item.type === style.type && item.role === style.role,
      )
      style.reference = primitiveFor(
        model,
        style.type,
        style.role,
        normalizeStyle(snapshot, definitions, operation.value),
      ).id
      continue
    }
    const binding = model.bindings.find((item) => item.id === operation.target)
    if (!binding) throw new Error('unknown-reference')
    const definition = snapshot.contract.properties[binding.property]
    if (operation.kind === 'restore-binding') {
      binding.reference = operation.reference
      binding.style = operation.style
      if (operation.provenance) binding.provenance = operation.provenance
      else delete binding.provenance
      continue
    }
    if (operation.kind === 'restore') {
      binding.reference = bindingBase(binding)
      delete binding.provenance
      continue
    }
    if (operation.kind === 'set-component-token') {
      const primitive = primitiveFor(
        model,
        definition.type,
        definition.role,
        normalizeValue(definition, operation.value, snapshot.contract.fontFamilies),
      )
      binding.reference = primitive.id
      if (binding.reference === bindingBase(binding)) delete binding.provenance
      else
        binding.provenance = provenance(
          'Réglage local ; attribution éventuelle et base conservées.',
        )
      continue
    }
    if (operation.kind === 'create-and-assign' || operation.kind === 'create-style') {
      if (
        !(original.kind === 'define-and-assign' && original.classification === 'non-semantic') &&
        !semanticEligible(catalog, operation.intention, definition.role)
      )
        throw new Error('undemonstrated-semantic-role')
      const style = {
        id: '',
        type: definition.type,
        role: definition.role,
        state: binding.state,
        intention: operation.intention,
        reference: '',
      }
      style.id = styleId(style)
      if (model.styles.some((item) => styleKey(item) === styleKey(style)))
        throw new Error('style-exists')
      // La compatibilité de l’intention est contrôlée avec le graphe final.
      style.reference = primitiveFor(
        model,
        definition.type,
        definition.role,
        normalizeValue(definition, operation.value, snapshot.contract.fontFamilies),
      ).id
      model.styles.push({
        ...style,
        ...(original.kind === 'define-and-assign'
          ? {
              classification: original.classification ?? 'semantic',
              justification: original.definition.definition,
            }
          : {}),
      })
      if (operation.kind === 'create-and-assign') {
        binding.style = style.id
        binding.reference = binding.style
        delete binding.provenance
      }
    } else {
      const style = model.styles.find((item) => item.id === operation.style)
      if (!style) throw new Error('unknown-reference')
      if (
        style.type !== definition.type ||
        style.role !== definition.role ||
        style.state !== binding.state
      )
        throw new Error('incompatible-style')
      binding.style = style.id
      binding.reference = binding.style
      delete binding.provenance
    }
  }
  budget(model)
  validateEditorModel(model, catalog, snapshot.contract)
  const variables = [...model.primitives, ...model.styles, ...model.bindings].map((item) =>
    cssVariable(item.id),
  )
  variables.push(
    ...snapshot.legacy.map(
      (item) => '--adl-' + item.id.replace(/^semantic\./, '').replaceAll('.', '-'),
    ),
  )
  if (new Set(variables).size !== variables.length) throw new Error('css-collision')
  return model
}
export function applyRequest(
  snapshot: EditorSnapshot,
  input: unknown,
): { request: EditorRequest; model: EditorModel; catalog: EditorSnapshot['catalog'] } {
  const request = saveRequestSchema.parse(input)
  return { request, ...applyTransaction(snapshot, request.operations) }
}
/** Choix valides uniquement : les saisies brutes/erreurs du panneau ne sont jamais enregistrées. */
export function operationsFromChanges(changes: Changes): EditorOperation[] {
  const operations: EditorOperation[] = Object.keys(changes.shared)
    .sort()
    .map((style) => ({ kind: 'update-shared', style, value: changes.shared[style] }))
  for (const target of Object.keys(changes.local).sort()) {
    const choice = changes.local[target]
    operations.push(
      choice.kind === 'style'
        ? { kind: 'assign', target, style: choice.style }
        : choice.kind === 'restore'
          ? { kind: 'restore', target }
          : { kind: 'set-component-token', target, value: choice.value },
    )
  }
  if (operations.length > 100) throw new Error('budget-exceeded')
  return operations
}

/** One pure transaction is shared by manager, preview and durable writer. */
export function applyTransaction(snapshot: EditorSnapshot, operations: EditorOperation[]) {
  return {
    model: operations.length ? applyOperations(snapshot, operations) : snapshot.model,
    catalog: catalogForOperations(snapshot.catalog, snapshot.model, snapshot.contract, operations),
  }
}
export function projectTransaction(
  snapshot: EditorSnapshot,
  operations: EditorOperation[],
): EditorSnapshot {
  return { ...snapshot, ...applyTransaction(snapshot, operations) }
}
