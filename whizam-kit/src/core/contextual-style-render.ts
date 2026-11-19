import {
  compileStyleTarget,
  contextualStates,
  type CompiledStyleTarget,
  type ContextualTarget,
  type RenderedContextualStyle,
} from './contextual-style.ts'
import type { Workspace } from './workspace-contract.ts'

const definitionRoots = '[data-loomata-definition], [data-design-target][data-design-part="root"]'
const boundaries = definitionRoots + ', [data-loomata-node], [data-loomata-placement]'
const partMarkers = '[data-design-part], [data-loomata-text]'
export const contextualStateAttribute = 'data-loomata-inspector-state'
const statePropertiesAttribute = 'data-loomata-style-properties-'
export function contextualPropertiesForState(element: Element | null, state: string) {
  return element?.getAttribute(statePropertiesAttribute + state)?.split(' ') ?? []
}
const definitionOf = (element: Element) =>
  element.getAttribute('data-loomata-definition') ?? element.getAttribute('data-design-target')

export function selectsSceneDefinition(element: HTMLElement, owner: string) {
  const root = element.ownerDocument
    .querySelector('[data-inspector-canvas]')
    ?.querySelector(definitionRoots)
  return (
    root !== undefined &&
    root !== null &&
    definitionOf(root) === owner &&
    element.closest(boundaries) === root
  )
}

export function renderedStyleTargets(
  doc: Document,
  target: CompiledStyleTarget,
  scope: ParentNode = doc,
) {
  let anchors: Element[] = []
  if (target.owner) {
    anchors = Array.from(scope.querySelectorAll(definitionRoots)).filter(
      (root) =>
        definitionOf(root) === target.owner &&
        (!target.variant ||
          (root.getAttribute('data-design-variant') ?? 'default') === target.variant),
    )
  } else {
    let parent: Element | null = null
    for (const marker of target.markers) {
      const found = scope.querySelectorAll(`[data-loomata-node="${marker}"]`)
      if (
        found.length !== 1 ||
        (parent && found[0].parentElement?.closest('[data-loomata-node]') !== parent)
      )
        return []
      parent = found[0]
    }
    if (parent) anchors = [parent]
  }
  return anchors.flatMap((anchor) => {
    let root = anchor
    for (const placement of target.placements) {
      const matches = Array.from(
        root.querySelectorAll(`[data-loomata-placement="${placement.id}"]`),
      ).filter((element) => element.parentElement?.closest(boundaries) === root)
      if (matches.length !== 1 || definitionOf(matches[0]) !== placement.definition) return []
      root = matches[0]
    }
    if (target.part === 'root') return [{ root, element: root }]
    const matches = Array.from(root.querySelectorAll(partMarkers)).filter(
      (element) =>
        element.closest(boundaries) === root &&
        (target.part === 'text'
          ? element.hasAttribute('data-loomata-text')
          : element.getAttribute('data-design-part') === target.part),
    )
    return matches.length === 1 ? [{ root, element: matches[0] }] : []
  })
}

export function resolveContextualSelection(
  model: Workspace,
  element: HTMLElement,
  context: { pageId: string } | { owner: string },
) {
  const contextRoot =
    'pageId' in context
      ? element.closest('[data-loomata-node]')
      : element.ownerDocument
          .querySelector('[data-inspector-canvas]')
          ?.querySelector(definitionRoots)
  if (!contextRoot || !contextRoot.contains(element)) return null
  const part =
    element === element.closest(boundaries)
      ? 'root'
      : element.hasAttribute('data-loomata-text')
        ? 'text'
        : element.getAttribute('data-design-part')
  if (!part) return null
  const placements: string[] = []
  for (
    let node: Element | null = element;
    node && node !== contextRoot;
    node = node.parentElement
  ) {
    const marker = node.getAttribute('data-loomata-placement')
    if (marker) placements.unshift(marker)
    else if (node.matches(definitionRoots) && 'pageId' in context) return null
  }
  let target: ContextualTarget
  if ('pageId' in context) {
    const pageId = context.pageId
    const anchor = model.entities.find(
      (entity) =>
        entity.kind === 'occurrence' &&
        entity.pageId === pageId &&
        entity.marker === contextRoot.getAttribute('data-loomata-node'),
    )
    if (!anchor) return null
    target = { kind: 'instance', pageId, occurrenceId: anchor.id, part, placements }
  } else {
    const owner = context.owner
    const anchor = model.entities.find(
      (entity) => entity.kind === 'component' && entity.sourceKey === owner,
    )
    if (!anchor || definitionOf(contextRoot) !== owner) return null
    target = placements.length
      ? { kind: 'placement', ownerId: anchor.id, part, placements }
      : {
          kind: 'definition',
          ownerId: anchor.id,
          part,
          variant: contextRoot.getAttribute('data-design-variant') ?? 'default',
        }
  }
  try {
    const definition = compileStyleTarget(model, target).rendered
    const scene = element.ownerDocument.querySelector('[data-inspector-canvas]')
    const found = renderedStyleTargets(
      element.ownerDocument,
      definition,
      'pageId' in context ? element.ownerDocument : (scene ?? element.ownerDocument),
    )
    if (found.filter((item) => item.element === element).length !== 1) return null
    return {
      target,
      definition: definition.definition,
      root: found.find((item) => item.element === element)!.root,
    }
  } catch {
    return null
  }
}

export type { RenderedContextualStyle } from './contextual-style.ts'
const stateSelectors = {
  default: '',
  hover: ':hover',
  'focus-visible': ':focus-visible, :has(:focus-visible)',
  disabled:
    ':disabled:not([aria-busy="true"]), :has([data-design-part="control"]:disabled:not([aria-busy="true"]))',
  loading: '[aria-busy="true"], :has([data-design-part="control"][aria-busy="true"])',
  error: '[aria-invalid="true"], :has([data-design-part="control"][aria-invalid="true"])',
}

export function bindContextualStyles(doc: Document, rules: RenderedContextualStyle[]) {
  if (!rules.length || !doc.head) return
  const sheetElement = doc.createElement('style')
  // Project utilities are layered and important. Put contextual rules in the
  // first layer so their importance wins without changing authored utilities.
  doc.head.prepend(sheetElement)
  const sheet = sheetElement.sheet
  if (!sheet) return () => sheetElement.remove()
  const stamps = new Map<Element, Map<string, string | null>>()
  const stamp = (element: Element, attribute: string, id: string) => {
    const old = stamps.get(element) ?? new Map()
    if (!old.has(attribute)) old.set(attribute, element.getAttribute(attribute))
    stamps.set(element, old)
    const value = element.getAttribute(attribute)
    element.setAttribute(attribute, value ? value + ' ' + id : id)
  }
  function restore() {
    for (const [element, attributes] of stamps)
      for (const [attribute, value] of attributes)
        if (value === null) element.removeAttribute(attribute)
        else element.setAttribute(attribute, value)
    stamps.clear()
  }
  const ordered = [...rules].sort(
    (a, b) =>
      a.level - b.level ||
      a.target.placements.length - b.target.placements.length ||
      contextualStates.indexOf(a.state) - contextualStates.indexOf(b.state) ||
      Number(Boolean(a.condition)) - Number(Boolean(b.condition)),
  )
  function reconcile() {
    if (!sheet) return
    restore()
    for (let i = sheet.cssRules.length - 1; i >= 0; i--) sheet.deleteRule(i)
    for (const [index, rule] of ordered.entries()) {
      const id = 'w' + index
      const matches = renderedStyleTargets(doc, rule.target)
      if (!matches.length) continue
      for (const { root, element } of matches) {
        stamp(root, 'data-loomata-style-root', id)
        stamp(element, 'data-loomata-style-part', id)
        stamp(
          element,
          statePropertiesAttribute + rule.state,
          Object.keys(rule.declarations).join(' '),
        )
      }
      const state =
        rule.state === 'default'
          ? ''
          : `:where([${contextualStateAttribute}="${rule.state}"], :not([${contextualStateAttribute}]):where(${stateSelectors[rule.state]}))`
      const root = `:where([data-loomata-style-root~="${id}"]${state})`
      const part = `[data-loomata-style-part~="${id}"]`
      const declarations = Object.entries(rule.declarations)
        .map(([property, value]) => `${property}:${value} !important`)
        .join(';')
      const css = `:is(${root}${part}, ${root} ${part}){${declarations}}`
      try {
        const scoped = rule.condition ? `@media ${rule.condition}{${css}}` : css
        sheet.insertRule(`@layer loomata-contextual{${scoped}}`, sheet.cssRules.length)
      } catch {
        // A syntactically unsupported declaration is ignored by this browser.
      }
    }
  }
  reconcile()
  const observer = new MutationObserver(reconcile)
  observer.observe(doc.documentElement, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeFilter: [
      'data-loomata-node',
      'data-loomata-placement',
      'data-loomata-definition',
      'data-design-target',
      'data-design-variant',
      'data-design-part',
      'data-loomata-text',
    ],
  })
  return () => {
    observer.disconnect()
    restore()
    sheetElement.remove()
  }
}
