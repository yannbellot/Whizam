export type InterfaceView = {
  revision: string
  occurrences: { id?: string; marker: string; variantId: string | null }[]
} | null

/** Only registered, unique rendered roots receive a variant, including deferred renders. */
export function bindInterface(document: Document, view: InterfaceView) {
  type Stamp = {
    before: string | null
    after: string | null
    beforeId: string | null
    afterId: string | null
  }
  const owned = new Map<HTMLElement, Stamp>()
  const restore = (element: HTMLElement, state: Stamp) => {
    if (element.getAttribute('data-loomata-variant') === state.after) {
      if (state.before) element.setAttribute('data-loomata-variant', state.before)
      else element.removeAttribute('data-loomata-variant')
    }
    if (element.getAttribute('data-loomata-occurrence') === state.afterId) {
      if (state.beforeId) element.setAttribute('data-loomata-occurrence', state.beforeId)
      else element.removeAttribute('data-loomata-occurrence')
    }
  }
  const reconcile = () => {
    const desired = new Map<HTMLElement, { variantId: string | null; id: string | null }>()
    for (const occurrence of view?.occurrences ?? []) {
      if (
        !/^[a-f0-9-]{36}$/.test(occurrence.marker) ||
        (occurrence.id && !/^[a-f0-9-]{36}$/.test(occurrence.id)) ||
        (occurrence.variantId && !/^[a-f0-9-]{36}$/.test(occurrence.variantId))
      )
        continue
      const nodes = document.querySelectorAll<HTMLElement>(
        `[data-loomata-node="${occurrence.marker}"]`,
      )
      if (nodes.length === 1)
        desired.set(nodes[0], { variantId: occurrence.variantId, id: occurrence.id ?? null })
    }
    for (const [element, state] of owned)
      if (!desired.has(element)) {
        restore(element, state)
        owned.delete(element)
      }
    for (const [element, desiredStamp] of desired) {
      const after = desiredStamp.variantId
      if (!owned.has(element))
        owned.set(element, {
          before: element.getAttribute('data-loomata-variant'),
          after,
          beforeId: element.getAttribute('data-loomata-occurrence'),
          afterId: desiredStamp.id,
        })
      if (after) element.setAttribute('data-loomata-variant', after)
      else element.removeAttribute('data-loomata-variant')
      if (desiredStamp.id) element.setAttribute('data-loomata-occurrence', desiredStamp.id)
      else element.removeAttribute('data-loomata-occurrence')
    }
  }
  reconcile()
  const observer = new MutationObserver(reconcile)
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['data-loomata-node'],
  })
  return () => {
    observer.disconnect()
    for (const [element, state] of owned) restore(element, state)
  }
}
