import { createHash } from 'node:crypto'
import { figmaFileSchema, figmaDependencies, type FigmaFile } from '../../src/core/figma-file.ts'
import { figmaNodeIdSchema } from '../../src/core/figma-reference.ts'

const digest = (value: unknown) => createHash('sha256').update(JSON.stringify(value)).digest('hex')
const record = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error('figma-response-invalid')
  return value as Record<string, unknown>
}
// Only concrete rendering/component data. Variable bindings, modes, styles' identities and plugin data are excluded.
const fields = new Set([
  'visible',
  'opacity',
  'blendMode',
  'fills',
  'strokes',
  'strokeWeight',
  'strokeAlign',
  'strokeDashes',
  'cornerRadius',
  'rectangleCornerRadii',
  'cornerSmoothing',
  'effects',
  'layoutMode',
  'layoutWrap',
  'primaryAxisSizingMode',
  'counterAxisSizingMode',
  'primaryAxisAlignItems',
  'counterAxisAlignItems',
  'counterAxisAlignContent',
  'layoutAlign',
  'layoutGrow',
  'layoutPositioning',
  'layoutSizingHorizontal',
  'layoutSizingVertical',
  'itemSpacing',
  'counterAxisSpacing',
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'paddingBottom',
  'minWidth',
  'maxWidth',
  'minHeight',
  'maxHeight',
  'clipsContent',
  'constraints',
  'relativeTransform',
  'rotation',
  'characters',
  'style',
  'characterStyleOverrides',
  'styleOverrideTable',
  'textAutoResize',
  'textAlignHorizontal',
  'textAlignVertical',
  'componentPropertyDefinitions',
  'componentProperties',
  'componentPropertyReferences',
  'fillGeometry',
  'strokeGeometry',
  'size',
  'booleanOperation',
])
const ignored = new Set([
  'boundVariables',
  'explicitVariableModes',
  'resolvedVariableModes',
  'variableCollectionId',
  'variableId',
  'styles',
  'pluginData',
  'sharedPluginData',
])
function clean(value: unknown, depth = 0): zJson {
  if (depth > 24) throw new Error('figma-property-budget')
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (Array.isArray(value)) return value.map((v) => clean(v, depth + 1))
  const object = record(value)
  if (object.type === 'VARIABLE_ALIAS') return null
  return Object.fromEntries(
    Object.keys(object)
      .sort()
      .filter((key) => !ignored.has(key))
      .map((key) => [key, clean(object[key], depth + 1)]),
  )
}
type zJson = null | string | number | boolean | zJson[] | { [key: string]: zJson }

/** Iterative traversal has no component-depth cutoff. Exceeding resource budgets rejects the whole read. */
export function normalizeFigmaFile(raw: unknown, fileKey: string): FigmaFile {
  const response = record(raw),
    components = response.components ? record(response.components) : {}
  if (record(response.document).type !== 'DOCUMENT') throw new Error('figma-document-required')
  const stack: { value: unknown; parentId: string | null }[] = [
    { value: response.document, parentId: null },
  ]
  const nodes: FigmaFile['nodes'] = [],
    seen = new Set<string>()
  while (stack.length) {
    if (nodes.length >= 50000) throw new Error('figma-file-budget')
    const { value, parentId } = stack.pop()!,
      node = record(value)
    const id = figmaNodeIdSchema.parse(node.id)
    if (seen.has(id)) throw new Error('figma-node-ambiguous')
    seen.add(id)
    const children = node.children === undefined ? [] : node.children
    if (!Array.isArray(children)) throw new Error('figma-response-invalid')
    const values: Record<string, zJson> = {}
    for (const key of [...fields].sort())
      if (node[key] !== undefined) values[key] = clean(node[key])
    // Canvas positions are presentation only. Width/height still affect the element's rendering.
    if (node.absoluteBoundingBox !== undefined) {
      const box = record(node.absoluteBoundingBox)
      values.bounds = { width: clean(box.width), height: clean(box.height) }
    }
    const metadata = components[id] ? record(components[id]) : {}
    nodes.push({
      id,
      parentId,
      name: node.name as string,
      type: node.type as string,
      children: children.map((c) => figmaNodeIdSchema.parse(record(c).id)),
      componentId:
        node.componentId === undefined ? null : figmaNodeIdSchema.parse(node.componentId),
      componentKey: typeof metadata.key === 'string' ? metadata.key : null,
      values,
      contentHash: digest(null),
    })
    for (const child of [...children].reverse()) stack.push({ value: child, parentId: id })
  }
  const index = new Map(nodes.map((node) => [node.id, node]))
  for (const node of nodes) {
    if (
      node.type === 'COMPONENT' &&
      node.parentId &&
      index.get(node.parentId)?.type === 'COMPONENT_SET'
    ) {
      const pairs = node.name.split(',').map((part) => part.split('=').map((v) => v.trim()))
      if (pairs.every((pair) => pair.length === 2 && pair[0] && pair[1]))
        node.values.variantSelection = Object.fromEntries(
          pairs.sort(([a], [b]) => a.localeCompare(b)),
        )
    }
  }
  // DFS visitation puts descendants after parents, so reverse order computes ordered subtree hashes.
  for (const node of [...nodes].reverse()) {
    const values = { ...node.values }
    if (['CANVAS', 'COMPONENT_SET', 'COMPONENT'].includes(node.type))
      delete values.relativeTransform
    node.contentHash = digest({
      type: node.type,
      values,
      componentId: node.componentId,
      children: node.children.map((id) => ({ id, hash: index.get(id)!.contentHash })),
    })
  }
  return figmaFileSchema.parse({
    fileKey,
    version: response.version,
    name: response.name,
    nodes,
    coverage: 'file-tree',
  })
}

/** Include referenced definitions in the fingerprint, including dependencies present only in another variant. */
export function figmaImportFingerprint(file: FigmaFile, nodeId: string) {
  const closure = figmaDependencies(file, nodeId)
  const ids = new Set(closure.nodeIds)
  return {
    ...closure,
    hash: digest(
      file.nodes
        .filter((n) => ids.has(n.id))
        .map((n) => ({ id: n.id, hash: n.contentHash }))
        .sort((a, b) => a.id.localeCompare(b.id)),
    ),
  }
}

export async function readFigmaFile(token: string, fileKey: string, request: typeof fetch = fetch) {
  if (!/^[A-Za-z0-9]{10,100}$/.test(fileKey)) throw new Error('figma-link-invalid')
  const url = new URL(`https://api.figma.com/v1/files/${fileKey}`)
  url.searchParams.set('geometry', 'paths')
  const response = await request(url, {
    headers: { 'X-Figma-Token': token },
    redirect: 'error',
    signal: AbortSignal.timeout(30000),
  })
  if (response.status === 429) throw new Error('figma-rate-limited')
  if (!response.ok || !response.body)
    throw new Error(
      [401, 403].includes(response.status) ? 'figma-access-denied' : 'figma-read-failed',
    )
  const reader = response.body.getReader(),
    chunks: Uint8Array[] = []
  let bytes = 0
  try {
    for (;;) {
      const result = await reader.read()
      if (result.done) break
      bytes += result.value.byteLength
      if (bytes > 16 * 1024 * 1024) throw new Error('figma-response-budget')
      chunks.push(result.value)
    }
  } finally {
    await reader.cancel()
  }
  return normalizeFigmaFile(JSON.parse(Buffer.concat(chunks).toString('utf8')), fileKey)
}
