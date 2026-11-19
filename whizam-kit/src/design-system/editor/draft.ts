import { normalizeValue, cssVariable, bindingBase, semanticEligible } from './contract.ts'
import type { Binding } from './contract'
import type { EditorSnapshot } from './snapshot'

export type Value = string | number
export type LocalChoice =
  { kind: 'value'; value: Value } | { kind: 'style'; style: string } | { kind: 'restore' }
export type Changes = { local: Record<string, LocalChoice>; shared: Record<string, Value> }
export const emptyChanges = (): Changes => ({ local: {}, shared: {} })
export const hasChanges = (changes: Changes) =>
  Object.keys(changes.local).length + Object.keys(changes.shared).length > 0
export function getBinding(snapshot: EditorSnapshot, id: string): Binding {
  const binding = snapshot.model.bindings.find((item) => item.id === id)
  if (!binding) throw new Error('Réglage non préparé.')
  return binding
}
export function dependsOn(
  snapshot: EditorSnapshot,
  styleId: string | null,
  ancestor: string,
  trail = new Set<string>(),
): boolean {
  if (styleId === null) return false
  if (styleId === ancestor) return true
  if (trail.has(styleId)) throw new Error('Cycle de styles.')
  const style = snapshot.model.styles.find((item) => item.id === styleId)
  if (!style) return false
  return dependsOn(snapshot, style.reference, ancestor, new Set([...trail, styleId]))
}
function projectedDependsOn(
  snapshot: EditorSnapshot,
  changes: Changes,
  styleId: string | null,
  ancestor: string,
): boolean {
  if (styleId === null) return false
  if (styleId === ancestor) return true
  if (Object.hasOwn(changes.shared, styleId)) return false
  const style = snapshot.model.styles.find((item) => item.id === styleId)
  return !!style && projectedDependsOn(snapshot, changes, style.reference, ancestor)
}
export function activeNativeState(
  snapshot: EditorSnapshot,
  binding: Binding,
  states: string[],
): string {
  return (
    ['loading', 'error', 'disabled', 'default'].find(
      (state) =>
        states.includes(state) &&
        snapshot.model.bindings.some(
          (item) =>
            item.target === binding.target &&
            item.variant === binding.variant &&
            item.part === binding.part &&
            item.property === binding.property &&
            item.state === state,
        ),
    ) ?? 'default'
  )
}
export function validateLocal(
  snapshot: EditorSnapshot,
  id: string,
  choice: LocalChoice,
): LocalChoice {
  const binding = getBinding(snapshot, id)
  const property = snapshot.contract.properties[binding.property]
  if (choice.kind === 'value')
    return {
      kind: 'value',
      value: normalizeValue(property, choice.value, snapshot.contract.fontFamilies),
    }
  if (choice.kind === 'style') {
    const style = snapshot.model.styles.find((item) => item.id === choice.style)
    if (
      !style ||
      style.type !== property.type ||
      style.role !== property.role ||
      style.state !== binding.state
    )
      throw new Error('Style incompatible avec ce réglage.')
    const projected = projectValues(snapshot, emptyChanges())
    normalizeValue(property, projected.styles[style.id], snapshot.contract.fontFamilies)
  }
  return choice
}
export function setLocal(
  snapshot: EditorSnapshot,
  changes: Changes,
  id: string,
  choice: LocalChoice,
): Changes {
  const next = {
    ...changes,
    local: { ...changes.local, [id]: validateLocal(snapshot, id, choice) },
  }
  const binding = getBinding(snapshot, id)
  normalizeValue(
    snapshot.contract.properties[binding.property],
    projectValues(snapshot, next).bindings[id],
    snapshot.contract.fontFamilies,
  )
  return next
}
export function setShared(
  snapshot: EditorSnapshot,
  changes: Changes,
  id: string,
  value: Value,
): Changes {
  if (snapshot.inventoryIssues.length)
    throw new Error('Inventaire partiel : portée partagée indisponible.')
  const style = snapshot.model.styles.find((item) => item.id === id)
  if (!style) throw new Error('Style inconnu.')
  const property = Object.values(snapshot.contract.properties).find(
    (item) => item.type === style.type && item.role === style.role,
  )
  if (!property) throw new Error('Rôle inconnu.')
  const normalized = normalizeValue(property, value, snapshot.contract.fontFamilies)
  for (const binding of snapshot.model.bindings) {
    const local = changes.local[binding.id]
    const assigned = local?.kind === 'style' ? local.style : binding.style
    if (projectedDependsOn(snapshot, changes, assigned, id))
      normalizeValue(
        snapshot.contract.properties[binding.property],
        normalized,
        snapshot.contract.fontFamilies,
      )
  }
  return { ...changes, shared: { ...changes.shared, [id]: normalized } }
}
export function resetLocal(changes: Changes, id: string): Changes {
  const local = { ...changes.local }
  delete local[id]
  return { ...changes, local }
}
export function resetShared(changes: Changes, id: string): Changes {
  const shared = { ...changes.shared }
  delete shared[id]
  return { ...changes, shared }
}
export function projectValues(snapshot: EditorSnapshot, changes: Changes) {
  const styles: Record<string, Value> = {}
  const bindings: Record<string, Value> = {}
  const primitives = new Map(snapshot.model.primitives.map((item) => [item.id, item.value]))
  const definitions = new Map(snapshot.model.styles.map((item) => [item.id, item]))
  function resolve(id: string, trail = new Set<string>()): Value {
    if (Object.hasOwn(changes.shared, id)) return changes.shared[id]
    if (Object.hasOwn(styles, id)) return styles[id]
    const primitive = primitives.get(id)
    if (primitive !== undefined) return primitive
    const style = definitions.get(id)
    if (!style || trail.has(id)) throw new Error('Référence invalide.')
    return (styles[id] = resolve(style.reference, new Set([...trail, id])))
  }
  for (const style of snapshot.model.styles) styles[style.id] = resolve(style.id)
  for (const binding of snapshot.model.bindings) {
    const local = changes.local[binding.id]
    bindings[binding.id] =
      local?.kind === 'value'
        ? local.value
        : local?.kind === 'style'
          ? resolve(local.style)
          : binding.reference !== bindingBase(binding) && local?.kind !== 'restore'
            ? resolve(binding.reference)
            : resolve(bindingBase(binding))
  }
  return { styles, bindings }
}
export function projectionCSS(snapshot: EditorSnapshot, changes: Changes) {
  const values = projectValues(snapshot, changes)
  const declarations = [...Object.entries(values.styles), ...Object.entries(values.bindings)].map(
    ([id, value]) => `${cssVariable(id)}:${value};`,
  )
  return `:root{${declarations.join('')}}`
}
export function getImpact(snapshot: EditorSnapshot, changes: Changes, id: string) {
  const linked = snapshot.model.bindings.filter((binding) => {
    const local = changes.local[binding.id]
    return projectedDependsOn(
      snapshot,
      changes,
      local?.kind === 'style' ? local.style : binding.style,
      id,
    )
  })
  const masked = linked.filter((binding) => {
    const local = changes.local[binding.id]
    return local?.kind === 'value' || (!local && binding.reference !== bindingBase(binding))
  })
  const references = new Set(linked.map((binding) => binding.id))
  for (const style of snapshot.model.styles)
    if (projectedDependsOn(snapshot, changes, style.id, id)) references.add(style.id)
  for (const alias of snapshot.legacy)
    if (projectedDependsOn(snapshot, changes, alias.value.reference, id)) references.add(alias.id)
  const usages = snapshot.usages.filter((item) => references.has(item.reference))
  return { linked, masked, usages, complete: snapshot.inventoryIssues.length === 0 }
}
const fold = (value: string) =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('fr')
    .trim()
export function semanticGuidance(snapshot: EditorSnapshot, binding: Binding) {
  const guidance = snapshot.presentation[binding.target].semanticGuidance
  const rule = guidance?.recommendations.find(
    (rule) =>
      rule.variants.includes(binding.variant) &&
      rule.part === binding.part &&
      rule.properties.includes(binding.property) &&
      rule.states.includes(binding.state),
  )
  return {
    purpose: guidance?.purpose,
    reason: rule?.reason ?? 'Réglage local sans intention sémantique démontrée.',
    intentions: (rule?.intentions ?? []).filter((intention) =>
      semanticEligible(
        snapshot.catalog,
        intention,
        snapshot.contract.properties[binding.property].role,
      ),
    ),
  }
}
export function searchIntentions(snapshot: EditorSnapshot, binding: Binding, query: string) {
  const definition = snapshot.contract.properties[binding.property]
  const searched = fold(query)
  return snapshot.catalog.categories
    .filter((category) => category.compatibility.includes(`${definition.type}:${definition.role}`))
    .flatMap((category) =>
      category.intentions
        .filter(
          (intention) =>
            fold(
              [category.label, intention.label, intention.definition, ...intention.synonyms].join(
                ' ',
              ),
            ).includes(searched) &&
            semanticEligible(snapshot.catalog, `${category.id}.${intention.id}`, definition.role),
        )
        .map((intention) => ({
          key: `${category.id}.${intention.id}`,
          category: category.label,
          ...intention,
        })),
    )
}
const roleLabels: Record<string, string> = {
  surface: 'Fond',
  text: 'Texte',
  border: 'Bordure',
  icon: 'Icône',
  focus: 'Focus',
  radius: 'Arrondi',
  'border-width': 'Épaisseur',
  spacing: 'Espacement',
  'font-size': 'Taille du texte',
  'font-weight': 'Graisse',
  'line-height': 'Interligne',
  'font-family': 'Famille de police',
  'content-width': 'Largeur du contenu',
}
export function stateLabel(snapshot: EditorSnapshot, state: string): string {
  return (
    Object.values(snapshot.presentation)
      .map((item) => item.states[state])
      .find(Boolean) ?? state
  )
}
export function styleLabel(snapshot: EditorSnapshot, id: string | null): string {
  const component = snapshot.model.bindings.find((item) => item.id === id)
  if (component) return `Token de composant · ${bindingLabel(snapshot, component)}`
  const style = snapshot.model.styles.find((style) => style.id === id)
  if (!style) return id === null ? 'Aucune attribution sémantique' : 'Style inconnu'
  if (style.classification === 'non-semantic')
    return `Convention · ${style.intention} · ${roleLabels[style.role] ?? style.role} · ${stateLabel(snapshot, style.state)}`
  const [categoryId, intentionId] = style.intention.split('.')
  const category = snapshot.catalog.categories.find((category) => category.id === categoryId)
  const intention = category?.intentions.find((intention) => intention.id === intentionId)
  return `${intention?.label ?? 'Intention'} · ${category?.label ?? 'Catégorie'} · ${roleLabels[style.role] ?? style.role} · ${stateLabel(snapshot, style.state)}`
}
export function searchStyles(snapshot: EditorSnapshot, query: string) {
  const searched = fold(query)
  return snapshot.model.styles.filter((style) => {
    const [categoryId, intentionId] = style.intention.split('.')
    const category = snapshot.catalog.categories.find((item) => item.id === categoryId)
    const intention = category?.intentions.find((item) => item.id === intentionId)
    return fold(
      [
        styleLabel(snapshot, style.id),
        style.justification,
        intention?.definition,
        ...(intention?.synonyms ?? []),
      ].join(' '),
    ).includes(searched)
  })
}
export function bindingLabel(snapshot: EditorSnapshot, binding: Binding): string {
  const labels = snapshot.presentation[binding.target]
  return `${labels.label} · ${labels.variants[binding.variant]} · ${labels.parts[binding.part]} · ${snapshot.contract.properties[binding.property].label} · ${labels.states[binding.state]}`
}
export function contrastRatio(left: string, right: string): number | null {
  function luminance(value: string) {
    let channels: number[]
    if (/^#[\da-f]{6}$/i.test(value))
      channels = [1, 3, 5].map((index) => parseInt(value.slice(index, index + 2), 16))
    else {
      const match = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(value)
      if (!match) return null
      channels = match.slice(1).map(Number)
    }
    if (channels.some((channel) => channel < 0 || channel > 255)) return null
    const linear = channels.map((channel) => {
      const s = channel / 255
      return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
    })
    return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722
  }
  const a = luminance(left),
    b = luminance(right)
  return a === null || b === null ? null : (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
}
