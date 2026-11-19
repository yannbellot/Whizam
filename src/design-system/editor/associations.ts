import type { EditorSnapshot } from './snapshot'
import { emptyChanges, projectValues, contrastRatio } from './draft.ts'

/** Declared same-part associations, with explicit default-state inheritance; no DOM inference. */
export function tokenAssociations(snapshot: EditorSnapshot) {
  const values = projectValues(snapshot, emptyChanges())
  const result = []
  for (const target of snapshot.contract.targets) {
    const bindings = snapshot.model.bindings.filter((item) => item.target === target.id)
    for (const variant of target.variants)
      for (const part of new Set(bindings.map((item) => item.part))) {
        const cells = bindings.filter((item) => item.variant === variant && item.part === part)
        for (const state of new Set(cells.map((item) => item.state))) {
          const properties = new Map(
            cells.filter((item) => item.state === 'default').map((item) => [item.property, item]),
          )
          for (const item of cells.filter((item) => item.state === state))
            properties.set(item.property, item)
          const foreground = properties.get('foreground')
          const background = properties.get('background')
          const icon = properties.get('iconColor')
          const ratio = (id?: string) =>
            id && background
              ? contrastRatio(String(values.bindings[id]), String(values.bindings[background.id]))
              : null
          result.push({
            component: target.component,
            variant,
            part,
            state,
            properties: [...properties.values()].map((item) => ({
              property: item.property,
              token: item.id,
              reference: item.reference,
              value: values.bindings[item.id],
            })),
            textContrast: ratio(foreground?.id),
            iconContrast: ratio(icon?.id),
            contrastScope: background ? 'declared-part-background' : 'background-not-declared',
          })
        }
      }
  }
  return result
}
