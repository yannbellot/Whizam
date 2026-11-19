import authority from './authority/tokens.tokens.json'
type Entry = {
  id: string
  path: string
  type: string
  value: unknown
  domain: string
  classification?: string
  definition?: string
  collection: string
}
/** Display-only view of the same validated source, never an additional editable registry. */
export function decisionEntries(document: unknown) {
  const entries: Entry[] = []
  function visit(node: unknown, path: string[] = []) {
    if (!node || typeof node !== 'object') return
    const data = node as Record<string, unknown>
    if ('$value' in data) {
      const meta = (data.$extensions as Record<string, Record<string, unknown>>)?.[
        'org.agentic-design'
      ]
      if (meta)
        entries.push({
          id: String(meta.id),
          path: path.join('.'),
          type: String(data.$type),
          value: data.$value,
          domain: String(meta.domain ?? 'unclassified'),
          classification: meta.classification as string | undefined,
          definition: meta.justification as string | undefined,
          collection: String(meta.collection),
        })
      return
    }
    for (const [key, value] of Object.entries(data))
      if (!key.startsWith('$') || key === '$root') visit(value, [...path, key])
  }
  visit(document)
  return entries
}
export const all = decisionEntries(authority)
const byPath = new Map(all.map((e) => [e.path, e]))
function target(entry: Entry): Entry | undefined {
  return typeof entry.value === 'string' && /^\{.+\}$/.test(entry.value)
    ? byPath.get(entry.value.slice(1, -1))
    : undefined
}
export function chain(entry: Entry) {
  const path: Entry[] = [],
    seen = new Set<string>()
  let current: Entry | undefined = entry
  while (current && !seen.has(current.id)) {
    seen.add(current.id)
    path.push(current)
    current = target(current)
  }
  return path
}
export function displayDecision(entry: Entry) {
  const last = chain(entry).at(-1)!
  const value = last.value
  if (
    value &&
    typeof value === 'object' &&
    'colorSpace' in value &&
    value.colorSpace === 'srgb' &&
    'components' in value &&
    Array.isArray(value.components)
  )
    return (
      '#' +
      value.components
        .map((c: number) =>
          Math.round(c * 255)
            .toString(16)
            .padStart(2, '0'),
        )
        .join('')
    )
  if (value && typeof value === 'object' && 'unit' in value && 'value' in value)
    return `${value.value}${value.unit}`
  if (Array.isArray(value)) return value.join(', ')
  return typeof value === 'object' ? JSON.stringify(value) : String(value)
}
