import { z } from 'zod'
import { figmaNodeIdSchema } from './figma-reference.ts'

const hash = z.string().regex(/^[a-f0-9]{64}$/)
export const figmaFileSchema = z.strictObject({
  fileKey: z.string().regex(/^[A-Za-z0-9]{10,100}$/),
  version: z.string().min(1).max(200),
  name: z.string().max(1000),
  nodes: z
    .array(
      z.strictObject({
        id: figmaNodeIdSchema,
        parentId: figmaNodeIdSchema.nullable(),
        name: z.string().max(1000),
        type: z.string().max(100),
        children: z.array(figmaNodeIdSchema).max(50000),
        componentId: figmaNodeIdSchema.nullable(),
        componentKey: z.string().max(200).nullable(),
        values: z.record(z.string(), z.json()),
        contentHash: hash,
      }),
    )
    .min(1)
    .max(50000),
  coverage: z.literal('file-tree'),
})
export type FigmaFile = z.infer<typeof figmaFileSchema>

/** A link identifies a file, never a fetch destination. Legacy selection links keep their own parser. */
export function parseFigmaFileLink(value: string) {
  const url = new URL(value)
  const parts = url.pathname.split('/').filter(Boolean)
  if (
    url.protocol !== 'https:' ||
    !['figma.com', 'www.figma.com'].includes(url.hostname) ||
    url.port ||
    url.username ||
    url.password ||
    !['design', 'file'].includes(parts[0]) ||
    !/^[A-Za-z0-9]{10,100}$/.test(parts[1] ?? '') ||
    parts[2] === 'branch' ||
    url.searchParams.getAll('node-id').length > 1
  )
    throw new Error('figma-link-invalid')
  const selected = url.searchParams.get('node-id')
  return {
    fileKey: parts[1],
    nodeId:
      selected === null
        ? null
        : figmaNodeIdSchema.parse(
            /^\d+-\d+$/.test(selected) ? selected.replace('-', ':') : selected,
          ),
  }
}

/** Include whole variant sets and transitive dependencies; report incomplete sources, never infer definitions. */
export function figmaDependencies(file: FigmaFile, selectedId: string) {
  const nodes = new Map(file.nodes.map((n) => [n.id, n]))
  if (!nodes.has(selectedId)) throw new Error('figma-node-missing')
  const visited = new Set<string>(),
    missing = new Set<string>(),
    definitions = new Set<string>()
  const pending = [selectedId]
  while (pending.length) {
    const id = pending.pop()!
    if (visited.has(id)) continue
    visited.add(id)
    const node = nodes.get(id)
    if (!node) {
      missing.add(id)
      continue
    }
    if (node.type === 'COMPONENT' || node.type === 'COMPONENT_SET') {
      definitions.add(id)
      const parent = node.parentId ? nodes.get(node.parentId) : null
      if (parent?.type === 'COMPONENT_SET') pending.push(parent.id)
    }
    pending.push(...node.children)
    if (node.componentId) pending.push(node.componentId)
  }
  return {
    nodeIds: [...visited].filter((id) => nodes.has(id)).sort(),
    definitionIds: [...definitions].sort(),
    missingIds: [...missing].sort(),
    complete: missing.size === 0,
  }
}

export function compareFigmaImport(
  sourceChanged: boolean,
  localChanged: boolean,
  complete: boolean,
) {
  if (!complete) return 'indeterminate'
  if (sourceChanged) return localChanged ? 'conflict' : 'source-changed'
  return localChanged ? 'local-adaptation' : 'unchanged'
}
