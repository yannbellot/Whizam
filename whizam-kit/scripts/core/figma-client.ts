import { createHash } from 'node:crypto'
import {
  figmaReferenceSchema,
  figmaNodeIdSchema,
  type FigmaReference,
} from '../../src/core/figma-reference.ts'
const digest = (v: unknown) => createHash('sha256').update(JSON.stringify(v)).digest('hex')
const name = (v: unknown) => (typeof v === 'string' ? v.slice(0, 200) : '')
const dimension = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : null)
export function normalizeFigma(raw: unknown, fileKey: string, nodeId: string): FigmaReference {
  if (!raw || typeof raw !== 'object') throw new Error('figma-response-invalid')
  const response = raw as { version?: unknown; nodes?: Record<string, { document?: unknown }> }
  const root = response.nodes?.[nodeId]?.document
  const nodes: FigmaReference['nodes'] = []
  const stack = [{ value: root, parentId: null as string | null, depth: 0 }]
  const seen = new Set<string>()
  while (stack.length) {
    const { value, parentId, depth } = stack.pop()!
    if (
      !value ||
      typeof value !== 'object' ||
      Array.isArray(value) ||
      depth > 12 ||
      nodes.length >= 3000
    )
      throw new Error('figma-selection-budget')
    const n = value as Record<string, unknown>,
      id = figmaNodeIdSchema.parse(n.id)
    if (seen.has(id)) throw new Error('figma-node-ambiguous')
    seen.add(id)
    const fills = Array.isArray(n.fills) ? n.fills : []
    const fill = fills.find((f) => f && f.type === 'SOLID' && f.visible !== false)
    const c = fill?.color
    const rgba =
      c &&
      ['r', 'g', 'b'].every(
        (k) => typeof c[k] === 'number' && Number.isFinite(c[k]) && c[k] >= 0 && c[k] <= 1,
      )
        ? c
        : null
    const alpha = typeof fill?.opacity === 'number' ? fill.opacity : 1
    const color =
      rgba && alpha >= 0 && alpha <= 1
        ? '#' +
          [rgba.r, rgba.g, rgba.b, ...(alpha < 1 ? [alpha] : [])]
            .map((v) =>
              Math.round(v * 255)
                .toString(16)
                .padStart(2, '0'),
            )
            .join('')
        : null
    const box = n.absoluteBoundingBox as Record<string, unknown> | undefined
    const variables = new Set<string>()
    function aliases(value: unknown, level = 0) {
      if (level > 8) return
      if (Array.isArray(value)) {
        for (const e of value.slice(0, 100)) aliases(e, level + 1)
      } else if (value && typeof value === 'object') {
        const v = value as Record<string, unknown>
        if (v.type === 'VARIABLE_ALIAS' && typeof v.id === 'string')
          variables.add(v.id.slice(0, 200))
        else for (const e of Object.values(v).slice(0, 100)) aliases(e, level + 1)
      }
    }
    aliases(n.boundVariables)
    const scalar = (v: unknown) =>
      typeof v === 'boolean' || typeof v === 'number' ? String(v) : name(v)
    const definitions = Object.entries(
      n.componentPropertyDefinitions && typeof n.componentPropertyDefinitions === 'object'
        ? n.componentPropertyDefinitions
        : {},
    )
      .slice(0, 100)
      .map(([key, value]) => {
        const d = value as { type?: unknown; defaultValue?: unknown; variantOptions?: unknown }
        const options = Array.isArray(d?.variantOptions)
          ? d.variantOptions.slice(0, 50).map(scalar).join(' | ')
          : ''
        return {
          name: name('Definition: ' + key),
          value: name(
            `${scalar(d?.type)}; default=${scalar(d?.defaultValue)}${options ? '; options=' + options : ''}`,
          ),
        }
      })
    const properties = [
      ...definitions,
      ...Object.entries(
        n.componentProperties && typeof n.componentProperties === 'object'
          ? n.componentProperties
          : {},
      )
        .slice(0, 100)
        .map(([key, v]) => ({
          name: name(key),
          value: scalar((v as { value?: unknown })?.value).slice(0, 200),
        })),
    ].slice(0, 100)
    const visual = {
      type: name(n.type),
      color,
      width: dimension(box?.width),
      height: dimension(box?.height),
      layout: ['NONE', 'HORIZONTAL', 'VERTICAL'].includes(String(n.layoutMode))
        ? (n.layoutMode as 'NONE' | 'HORIZONTAL' | 'VERTICAL')
        : null,
      componentId:
        typeof n.componentId === 'string' ? figmaNodeIdSchema.parse(n.componentId) : null,
      properties,
      variableIds: [...variables].sort(),
      imageRefs: fills
        .filter((f) => f?.type === 'IMAGE' && typeof f.imageRef === 'string')
        .slice(0, 100)
        .map((f) => name(f.imageRef)),
      reactionCount: Array.isArray(n.reactions) ? Math.min(n.reactions.length, 1000) : 0,
    }
    nodes.push({ id, parentId, name: name(n.name), ...visual, visualHash: digest(visual) })
    if (n.children !== undefined && !Array.isArray(n.children))
      throw new Error('figma-response-invalid')
    for (const child of [...((n.children as unknown[]) ?? [])].reverse())
      stack.push({ value: child, parentId: id, depth: depth + 1 })
  }
  nodes.sort((a, b) => a.id.localeCompare(b.id))
  return figmaReferenceSchema.parse({
    fileKey,
    nodeId,
    version: response.version,
    contentHash: digest(nodes),
    nodes,
    coverage: {
      structure: 'bounded-selection',
      variables: 'aliases-only',
      assets: 'references-only',
      prototype: 'observed-only',
    },
  })
}
export async function readFigma(
  token: string,
  fileKey: string,
  nodeId: string,
  request: typeof fetch = fetch,
) {
  if (!/^[A-Za-z0-9]{10,100}$/.test(fileKey)) throw new Error('figma-link-invalid')
  figmaNodeIdSchema.parse(nodeId)
  const url = new URL(`https://api.figma.com/v1/files/${fileKey}/nodes`)
  url.searchParams.set('ids', nodeId)
  url.searchParams.set('depth', '8')
  const response = await request(url, {
    headers: { 'X-Figma-Token': token },
    redirect: 'error',
    signal: AbortSignal.timeout(30000),
  })
  if (!response.ok || !response.body)
    throw new Error(response.status === 403 ? 'figma-access-denied' : 'figma-read-failed')
  const reader = response.body.getReader(),
    chunks: Uint8Array[] = []
  let size = 0
  try {
    for (;;) {
      const next = await reader.read()
      if (next.done) break
      size += next.value.byteLength
      if (size > 16 * 1024 * 1024) throw new Error('figma-response-budget')
      chunks.push(next.value)
    }
  } finally {
    await reader.cancel()
  }
  return normalizeFigma(JSON.parse(Buffer.concat(chunks).toString('utf8')), fileKey, nodeId)
}
