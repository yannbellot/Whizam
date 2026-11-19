import { useEffect, useRef, useState, type HTMLAttributes, type ChangeEvent } from 'react'
import {
  importedNodeClass,
  resolveImportedDefinition,
  resolveImportedUsage,
  type ImportedDefinition,
  type ImportedRegistry,
} from './imported-components'

/** A closed React family: imported text never becomes executable source. */
export function ImportedComponent({
  definition,
  registry,
  variantId,
  inspect,
  onSelect,
  value: controlledValue,
  onChange,
  ...props
}: {
  definition: ImportedDefinition
  registry: ImportedRegistry
  variantId?: string
  inspect?: boolean
  onSelect?: (id: string, definitionId?: string) => void
  value?: string
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void
} & Omit<HTMLAttributes<HTMLElement>, 'onSelect' | 'onChange'>) {
  const [value, setValue] = useState('')
  const [activeVariant, setActiveVariant] = useState<string | null>(null)
  const initialOccurrence = (props as Record<string, unknown>)['data-loomata-occurrence']
  const [activeOccurrence, setActiveOccurrence] = useState<string | null>(
    typeof initialOccurrence === 'string' ? initialOccurrence : null,
  )
  const root = useRef<HTMLElement | null>(null)
  useEffect(() => {
    const node = root.current
    if (!node) return
    const read = () => {
      setActiveVariant(node.getAttribute('data-loomata-variant'))
      setActiveOccurrence(node.getAttribute('data-loomata-occurrence'))
    }
    const observer = new MutationObserver(read)
    observer.observe(node, {
      attributes: true,
      attributeFilter: ['data-loomata-variant', 'data-loomata-occurrence'],
    })
    const frame = requestAnimationFrame(read)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [definition.id])
  const marker = (props as Record<string, unknown>)['data-loomata-node']
  const effective =
    resolveImportedUsage(
      registry,
      definition.id,
      typeof marker === 'string' ? marker : null,
      activeVariant,
      activeOccurrence,
    ) ?? definition
  const map = new Map(effective.nodes.map((n) => [n.id, n]))
  function render(id: string, visited: Set<string>, isRoot = false): React.ReactNode {
    if (visited.has(id)) return null
    const n = map.get(id)
    if (!n) return null
    const next = new Set(visited).add(id)
    const common = {
      ...(isRoot ? props : {}),
      key: id,
      ref: isRoot
        ? (node: HTMLElement | null) => {
            root.current = node
          }
        : undefined,
      className: [importedNodeClass(effective.id, id), isRoot ? props.className : '']
        .filter(Boolean)
        .join(' '),
      'data-import-node': id,
      onClick: inspect
        ? (event: React.MouseEvent<HTMLElement>) => {
            event.preventDefault()
            event.stopPropagation()
            onSelect?.(id, effective.id)
          }
        : isRoot
          ? props.onClick
          : undefined,
    }
    if (n.componentId) {
      const bound = effective.dependencies[n.componentId]
      const other = bound
        ? resolveImportedDefinition(registry, bound)
        : registry.definitions.find(
            (d) =>
              d.fileKey === effective.fileKey &&
              d.nodes.some((node) => node.id === n.componentId && node.type === 'COMPONENT'),
          )
      if (other && other.id !== effective.id)
        return (
          <div {...common}>
            <ImportedComponent
              definition={other}
              registry={registry}
              variantId={n.componentId}
              inspect={inspect}
              onSelect={onSelect}
            />
          </div>
        )
    }
    const children = n.children.map((child) => render(child, next))
    if (isRoot && effective.role === 'action')
      return (
        <button {...common} type="button">
          {props.children ?? (children.length ? children : effective.label)}
        </button>
      )
    if (isRoot && effective.role === 'input')
      return (
        <input
          {...common}
          aria-label={props['aria-label'] ?? effective.label}
          value={controlledValue ?? value}
          onChange={(event) => {
            if (!inspect) {
              setValue(event.target.value)
              onChange?.(event)
            }
          }}
          readOnly={inspect}
        />
      )
    if (n.type === 'TEXT')
      return (
        <span {...common}>
          {typeof n.values.characters === 'string' ? n.values.characters : ''}
        </span>
      )
    if (n.type === 'VECTOR') {
      const paths = n.values.fillGeometry
      return (
        <div {...common}>
          <svg
            width="100%"
            height="100%"
            role="img"
            aria-label={n.name}
            viewBox={
              '0 0 ' +
              (n.values.bounds as { width?: number })?.width +
              ' ' +
              (n.values.bounds as { height?: number })?.height
            }
          >
            {Array.isArray(paths) &&
              paths.map((p, index) => {
                if (
                  !p ||
                  typeof p !== 'object' ||
                  !('path' in p) ||
                  typeof p.path !== 'string' ||
                  !/^[MmLlHhVvCcSsQqTtAaZz0-9., eE+-]+$/.test(p.path)
                )
                  return null
                return (
                  <path
                    key={index}
                    d={p.path}
                    fillRule={
                      'windingRule' in p && p.windingRule === 'EVENODD' ? 'evenodd' : 'nonzero'
                    }
                  />
                )
              })}
          </svg>
        </div>
      )
    }
    return <div {...common}>{props.children && isRoot ? props.children : children}</div>
  }
  const sourceVariant = definition.variants.find((v) => v.identity === activeVariant)?.id
  const selected = [variantId, sourceVariant].find(
    (id) => id && effective.variants.some((v) => v.id === id),
  )
  return render(selected ?? effective.rootId, new Set(), true)
}
