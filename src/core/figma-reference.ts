import { z } from 'zod'
const text = z.string().max(200)
export const figmaNodeIdSchema = z
  .string()
  .min(1)
  .max(200)
  .regex(/^[A-Za-z0-9:;_-]+$/)
export const figmaNodeSchema = z.strictObject({
  id: figmaNodeIdSchema,
  parentId: figmaNodeIdSchema.nullable(),
  name: text,
  type: text,
  visualHash: z.string().regex(/^[a-f0-9]{64}$/),
  color: z
    .string()
    .regex(/^#[a-f0-9]{6}(?:[a-f0-9]{2})?$/)
    .nullable(),
  width: z.number().finite().nonnegative().nullable(),
  height: z.number().finite().nonnegative().nullable(),
  layout: z.enum(['NONE', 'HORIZONTAL', 'VERTICAL']).nullable(),
  componentId: figmaNodeIdSchema.nullable(),
  properties: z.array(z.strictObject({ name: text, value: text })).max(100),
  variableIds: z.array(text).max(100),
  imageRefs: z.array(text).max(100),
  reactionCount: z.number().int().nonnegative().max(1000),
})
export const figmaReferenceSchema = z.strictObject({
  fileKey: z.string().regex(/^[A-Za-z0-9]{10,100}$/),
  nodeId: figmaNodeIdSchema,
  version: z.string().min(1).max(200),
  contentHash: z.string().regex(/^[a-f0-9]{64}$/),
  nodes: z.array(figmaNodeSchema).min(1).max(3000),
  coverage: z.strictObject({
    structure: z.literal('bounded-selection'),
    variables: z.literal('aliases-only'),
    assets: z.literal('references-only'),
    prototype: z.literal('observed-only'),
  }),
})
export type FigmaReference = z.infer<typeof figmaReferenceSchema>
export function compareFigma(previous: FigmaReference, next: FigmaReference) {
  if (previous.fileKey !== next.fileKey || previous.nodeId !== next.nodeId)
    throw new Error('figma-selection-changed')
  const old = new Map(previous.nodes.map((n) => [n.id, n]))
  return next.nodes.map(
    (node) =>
      ({
        id: node.id,
        state: !old.has(node.id)
          ? 'added'
          : old.get(node.id)!.visualHash !== node.visualHash
            ? 'changed'
            : old.get(node.id)!.name !== node.name
              ? 'renamed'
              : 'unchanged',
      }) as const,
  )
  // Absence from a bounded selection is never interpreted as a deletion.
}

/** A pasted selection link identifies data; its host is never fetched by the application. */
export function parseFigmaLink(value: string) {
  const url = new URL(value)
  if (
    url.protocol !== 'https:' ||
    !['figma.com', 'www.figma.com'].includes(url.hostname) ||
    url.port ||
    url.username ||
    url.password
  )
    throw new Error('figma-link-invalid')
  const parts = url.pathname.split('/').filter(Boolean)
  if (
    !['design', 'file'].includes(parts[0]) ||
    !/^[A-Za-z0-9]{10,100}$/.test(parts[1] ?? '') ||
    parts[2] === 'branch' ||
    url.searchParams.getAll('node-id').length !== 1
  )
    throw new Error('figma-selection-link-required')
  const selected = url.searchParams.get('node-id')!
  const nodeId = /^\d+-\d+$/.test(selected) ? selected.replace('-', ':') : selected
  return { fileKey: parts[1], nodeId: figmaNodeIdSchema.parse(nodeId) }
}
