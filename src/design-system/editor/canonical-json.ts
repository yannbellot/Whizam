/** Stable content fingerprint, independent of property insertion order. */
export function canonicalJSON(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJSON).join(',')}]`
  if (value !== null && typeof value === 'object')
    return `{${Object.entries(value)
      .sort(([left], [right]) => left.localeCompare(right, 'en'))
      .map(([key, item]) => `${JSON.stringify(key)}:${canonicalJSON(item)}`)
      .join(',')}}`
  const encoded = JSON.stringify(value)
  if (encoded === undefined) throw new Error('Unsupported snapshot value')
  return encoded
}
