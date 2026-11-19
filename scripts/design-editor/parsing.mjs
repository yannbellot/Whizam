import { parseDocument, isMap, isSeq, isAlias } from 'yaml'
/** Le parseur YAML reconnaît aussi JSON et permet de refuser ses doublons avant conversion. */
export function parseBounded(text, { format = 'yaml', depth = 32, nodes = 20000 } = {}) {
  const doc = parseDocument(text, { uniqueKeys: true, strict: true })
  if (doc.errors.length) throw new Error('schema-invalid')
  let count = 0
  function walk(node, level) {
    if (++count > nodes || level > depth) throw new Error('budget-exceeded')
    if (!node || typeof node !== 'object') return
    if (
      isAlias(node) ||
      node.anchor ||
      (node.tag &&
        !['str', 'int', 'float', 'bool', 'null', 'map', 'seq'].some(
          (type) => node.tag === 'tag:yaml.org,2002:' + type,
        ))
    )
      throw new Error('schema-invalid')
    if (isMap(node))
      for (const pair of node.items) {
        walk(pair.key, level + 1)
        walk(pair.value, level + 1)
      }
    else if (isSeq(node)) for (const item of node.items) walk(item, level + 1)
  }
  walk(doc.contents, 0)
  const value = doc.toJS({ maxAliasCount: 0 })
  if (format === 'json') {
    // JSON.parse demeure l’autorité de syntaxe JSON, YAML n’autorise aucune extension ici.
    const json = JSON.parse(text)
    if (JSON.stringify(json) !== JSON.stringify(value)) throw new Error('schema-invalid')
    const finite = (value) => {
      if (typeof value === 'number' && !Number.isFinite(value)) throw new Error('schema-invalid')
      if (value && typeof value === 'object') Object.values(value).forEach(finite)
    }
    finite(json)
    return json
  }
  return doc
}
