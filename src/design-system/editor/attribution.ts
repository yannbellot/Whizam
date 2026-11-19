import type { Binding } from './contract'
import type { EditorSnapshot } from './snapshot'
import { emptyChanges, getImpact } from './draft'

/** Presentation of the current graph, including locally masked semantic attributions. */
export function describeAttribution(snapshot: EditorSnapshot, binding: Binding) {
  const style = snapshot.model.styles.find((item) => item.id === binding.style)
  const own = !style || binding.reference !== style.id
  const impact = style ? getImpact(snapshot, emptyChanges(), style.id) : null
  const masked = new Set(impact?.masked.map((item) => item.id))
  const linked = impact?.linked ?? []
  const otherEffectiveComponents = new Set(
    linked
      .filter((item) => item.target !== binding.target && !masked.has(item.id))
      .map((item) => item.target),
  )
  const components = [...new Set(linked.map((item) => item.target))].map((target) => {
    const points = linked.filter((item) => item.target === target)
    const effective = points.filter((item) => !masked.has(item.id))
    return {
      target,
      // Open a genuinely inherited use in preference to a masked one.
      binding: effective[0] ?? points[0],
      hasExceptions: effective.length < points.length,
      allMasked: effective.length === 0,
    }
  })
  return {
    kind: own
      ? style
        ? 'exception'
        : 'component'
      : otherEffectiveComponents.size
        ? 'shared'
        : 'semantic',
    style,
    components,
    complete: impact?.complete ?? true,
  } as const
}
