import { createHash } from 'node:crypto'
import {
  importedRegistrySchema,
  importedNodeClass,
  resolveImportedDefinition,
} from '../src/core/imported-components.ts'
import { readTokens, tokenCSS } from './dtcg-tokens.mjs'
export const importsPath = 'app/loomata-imports.json'
export const importsCSSPath = 'app/loomata-imports.css'
export const importIdentity = (fileKey, nodeId) =>
  createHash('sha256')
    .update(fileKey + ':' + nodeId)
    .digest('hex')
    .slice(0, 24)
const digest = (data) =>
  createHash('sha256').update(JSON.stringify(data)).digest('hex').slice(0, 20)
const ext = 'org.agentic-design'
/** Closed renderer family. Source text never becomes code; no CSS string accepted. */
export function compileImportedComponents(
  document,
  input,
  previous = { version: 1, definitions: [] },
) {
  const registry = importedRegistrySchema.parse(input),
    next = structuredClone(document)
  const base = readTokens(next),
    css = [],
    variables = []
  const activeTokens = new Set()
  const set = (id, type, value, meta) => {
    const segments = id.split('.')
    let group = next
    for (const part of segments.slice(0, -1)) group = group[part] ??= {}
    group[segments.at(-1)] = { $type: type, $value: value, $extensions: { [ext]: { id, ...meta } } }
  }
  for (const [from, to] of Object.entries(registry.redirects)) {
    const before = registry.definitions.find((d) => d.id === from)
    const after = resolveImportedDefinition(registry, to)
    if (!before || !after || before.role !== after.role)
      throw new Error('import-functional-incompatible')
    resolveImportedDefinition(registry, from)
  }
  for (const item of registry.overrides) {
    const before = resolveImportedDefinition(registry, item.sourceDefinitionId)
    const after = resolveImportedDefinition(registry, item.targetId)
    if (!before || !after || before.role !== after.role)
      throw new Error('import-functional-incompatible')
  }
  const sources = new Map(
    registry.definitions.flatMap((d) =>
      d.nodes
        .filter((n) => n.type === 'COMPONENT')
        .map((n) => [d.fileKey + ':' + n.id, { definition: d, node: n }]),
    ),
  )
  const graph = new Map(
    registry.definitions.map((d) => [
      d.id,
      new Set(
        d.nodes
          .filter((n) => n.componentId)
          .map((n) => {
            const id =
              d.dependencies?.[n.componentId] ??
              sources.get(d.fileKey + ':' + n.componentId)?.definition.id
            return id ? resolveImportedDefinition(registry, id)?.id : null
          })
          .filter(Boolean),
      ),
    ]),
  )
  const done = new Set(),
    active = new Set()
  function check(id) {
    if (active.has(id)) throw new Error('import-component-cycle')
    if (done.has(id)) return
    active.add(id)
    for (const next of graph.get(id) ?? []) check(next)
    active.delete(id)
    done.add(id)
  }
  for (const id of graph.keys()) check(id)
  for (const definition of registry.definitions.filter((d) =>
    ['action', 'input'].includes(d.role),
  )) {
    const pending = [...(graph.get(definition.id) ?? [])],
      visited = new Set()
    while (pending.length) {
      const id = pending.pop()
      if (visited.has(id)) continue
      visited.add(id)
      const child = registry.definitions.find((d) => d.id === id)
      if (child && ['action', 'input'].includes(child.role))
        throw new Error('import-node-unsupported')
      pending.push(...(graph.get(id) ?? []))
    }
  }
  function sameInstance(instance, source, instanceMap, sourceMap, isRoot = true) {
    const ignored = new Set([
      'componentProperties',
      'componentPropertyDefinitions',
      'componentPropertyReferences',
      'variantSelection',
    ])
    const values = (n) =>
      Object.fromEntries(
        Object.entries(n.values).filter(
          ([k]) => !ignored.has(k) && !(isRoot && k === 'relativeTransform'),
        ),
      )
    if (
      JSON.stringify(values(instance)) !== JSON.stringify(values(source)) ||
      instance.children.length !== source.children.length
    )
      return false
    return instance.children.every((id, i) => {
      const a = instanceMap.get(id),
        b = sourceMap.get(source.children[i])
      return a && b && a.type === b.type && sameInstance(a, b, instanceMap, sourceMap, false)
    })
  }
  for (const definition of registry.definitions) {
    const old = previous.definitions.find((d) => d.id === definition.id)
    const preserve = old && JSON.stringify(old.nodes) === JSON.stringify(definition.nodes)
    for (const node of definition.nodes) {
      if (
        ![
          'FRAME',
          'COMPONENT_SET',
          'COMPONENT',
          'INSTANCE',
          'TEXT',
          'RECTANGLE',
          'VECTOR',
          'GROUP',
        ].includes(node.type)
      )
        throw new Error('import-node-unsupported')
      if (node.type === 'INSTANCE') {
        const bound = registry.definitions.find(
          (d) => d.id === definition.dependencies?.[node.componentId],
        )
        const source = bound
          ? { definition: bound, node: bound.nodes.find((n) => n.id === node.componentId) }
          : sources.get(definition.fileKey + ':' + node.componentId)
        if (
          !source?.node ||
          !sameInstance(
            node,
            source.node,
            new Map(definition.nodes.map((n) => [n.id, n])),
            new Map(source.definition.nodes.map((n) => [n.id, n])),
          )
        )
          throw new Error('import-instance-adaptation-required')
      }
      const selector = '.' + importedNodeClass(definition.id, node.id) + '[data-import-node]'
      const declarations = [
        'border: 0;',
        'padding: 0;',
        'margin: 0;',
        'background: transparent;',
        'font: inherit;',
        'border-radius: 0;',
      ]
      const v = node.type === 'INSTANCE' ? { bounds: node.values.bounds } : node.values
      if (v.rotation && v.rotation !== 0) throw new Error('import-layout-unsupported')
      if (v.blendMode && !['NORMAL', 'PASS_THROUGH'].includes(v.blendMode))
        throw new Error('import-paint-unsupported')
      if (v.cornerSmoothing) throw new Error('import-node-unsupported')
      if (
        v.strokeDashes?.length ||
        (v.strokes?.length && v.strokeAlign && v.strokeAlign !== 'INSIDE')
      )
        throw new Error('import-paint-unsupported')
      if (node.type === 'VECTOR' && v.strokes?.length) throw new Error('import-paint-unsupported')
      if (
        v.layoutPositioning === 'ABSOLUTE' ||
        v.layoutAlign === 'STRETCH' ||
        v.layoutGrow > 0 ||
        v.layoutSizingHorizontal === 'FILL' ||
        v.layoutSizingVertical === 'FILL'
      )
        throw new Error('import-layout-unsupported')
      if (
        v.characterStyleOverrides?.length ||
        (v.styleOverrideTable && Object.keys(v.styleOverrideTable).length)
      )
        throw new Error('import-node-unsupported')
      if (node.type === 'TEXT') declarations.push('white-space: pre-wrap;')
      if (
        node.type === 'VECTOR' &&
        (!Array.isArray(v.fillGeometry) ||
          !v.fillGeometry.length ||
          v.fillGeometry.some(
            (p) =>
              typeof p.path !== 'string' || !/^[MmLlHhVvCcSsQqTtAaZz0-9., eE+-]+$/.test(p.path),
          ))
      )
        throw new Error('import-node-unsupported')
      if (v.clipsContent === true) declarations.push('overflow: hidden;')
      const parent = definition.nodes.find((n) => n.id === node.parentId)
      if (node.children.length) declarations.push('position: relative;')
      if (
        node.id !== definition.rootId &&
        node.type !== 'COMPONENT' &&
        parent &&
        !['HORIZONTAL', 'VERTICAL'].includes(parent.values.layoutMode)
      ) {
        const transform = node.values.relativeTransform
        if (
          !Array.isArray(transform) ||
          transform[0]?.[0] !== 1 ||
          transform[0]?.[1] !== 0 ||
          transform[1]?.[0] !== 0 ||
          transform[1]?.[1] !== 1
        )
          throw new Error('import-layout-unsupported')
        declarations.push('position: absolute;')
      }
      function token(property, type, value) {
        const id =
          'component.composition.imported.n' +
          definition.id +
          '.n' +
          digest(node.id) +
          '.' +
          property
        activeTokens.add(id)
        const primitiveId = 'primitive.composition.import-' + digest([id, type, value])
        if (preserve && base.ids.has(id)) {
          const entry = base.ids.get(id)
          const variable = '--adl-' + id.replaceAll('.', '-')
          variables.push(variable + ': ' + tokenCSS(entry.type, entry.value) + ';')
          declarations.push(property + ': var(' + variable + ');')
          return
        }
        set(primitiveId, type, value, { kind: 'primitive', collection: 'composition' })
        set(id, type, '{' + primitiveId + '}', {
          kind: 'component',
          collection: 'composition',
          owner: importsCSSPath + '#' + selector,
          consumer: {
            file: importsCSSPath,
            selector,
            property,
            usage:
              'Exception locale : valeur de référence du composant importé, sans convention partagée inférée.',
          },
        })
        const variable = '--adl-' + id.replaceAll('.', '-')
        variables.push(variable + ': ' + tokenCSS(type, value) + ';')
        declarations.push(property + ': var(' + variable + ');')
      }
      const dimension = (prop, value) => {
        if (value === undefined) return
        if (typeof value !== 'number' || !Number.isFinite(value) || Math.abs(value) > 100000)
          throw new Error('import-value-unsupported')
        token(prop, 'dimension', { value, unit: 'px' })
      }
      if (
        node.id !== definition.rootId &&
        node.type !== 'COMPONENT' &&
        parent &&
        !['HORIZONTAL', 'VERTICAL'].includes(parent.values.layoutMode)
      ) {
        dimension('left', node.values.relativeTransform[0][2])
        dimension('top', node.values.relativeTransform[1][2])
      }
      const color = (prop, paints) => {
        if (paints === undefined || !paints.length) return
        if (!Array.isArray(paints)) throw new Error('import-paint-unsupported')
        const visible = paints.filter((p) => p.visible !== false)
        if (!visible.length) return
        if (visible.length !== 1 || visible[0].type !== 'SOLID')
          throw new Error('import-paint-unsupported')
        const p = visible[0],
          c = p.color
        if (!c || ![c.r, c.g, c.b].every((v) => typeof v === 'number' && Number.isFinite(v)))
          throw new Error('import-paint-unsupported')
        token(prop, 'color', {
          colorSpace: 'srgb',
          components: [c.r, c.g, c.b],
          alpha: (c.a ?? 1) * (p.opacity ?? 1),
        })
      }
      color(
        node.type === 'TEXT' ? 'color' : node.type === 'VECTOR' ? 'fill' : 'background-color',
        v.fills,
      )
      color('border-color', v.strokes)
      if (v.strokes?.length) {
        dimension('border-width', v.strokeWeight)
        declarations.push('border-style: solid;')
      }
      dimension('border-radius', v.cornerRadius)
      if (Array.isArray(v.rectangleCornerRadii)) {
        if (v.rectangleCornerRadii.length !== 4) throw new Error('import-value-unsupported')
        for (const [index, property] of [
          'border-top-left-radius',
          'border-top-right-radius',
          'border-bottom-right-radius',
          'border-bottom-left-radius',
        ].entries())
          dimension(property, v.rectangleCornerRadii[index])
      }
      for (const [key, prop] of [
        ['paddingTop', 'padding-top'],
        ['paddingBottom', 'padding-bottom'],
        ['paddingLeft', 'padding-left'],
        ['paddingRight', 'padding-right'],
        ['itemSpacing', 'gap'],
      ])
        dimension(prop, v[key])
      if (v.bounds) {
        dimension('width', v.bounds.width)
        dimension('height', v.bounds.height)
      }
      for (const [key, prop] of [
        ['minWidth', 'min-width'],
        ['maxWidth', 'max-width'],
        ['minHeight', 'min-height'],
        ['maxHeight', 'max-height'],
      ])
        if (v[key] !== null) dimension(prop, v[key])
      if (v.layoutMode && v.layoutMode !== 'NONE') {
        declarations.push(
          'display: flex;',
          'flex-direction: ' + (v.layoutMode === 'VERTICAL' ? 'column' : 'row') + ';',
        )
        const align = {
          MIN: 'flex-start',
          MAX: 'flex-end',
          CENTER: 'center',
          SPACE_BETWEEN: 'space-between',
        }
        if (v.primaryAxisAlignItems && !align[v.primaryAxisAlignItems])
          throw new Error('import-layout-unsupported')
        if (v.counterAxisAlignItems && !align[v.counterAxisAlignItems])
          throw new Error('import-layout-unsupported')
        if (v.primaryAxisAlignItems)
          declarations.push('justify-content: ' + align[v.primaryAxisAlignItems] + ';')
        if (v.counterAxisAlignItems)
          declarations.push('align-items: ' + align[v.counterAxisAlignItems] + ';')
      }
      if (v.visible === false) declarations.push('display: none;')
      if (v.opacity !== undefined) token('opacity', 'number', v.opacity)
      if (v.style) {
        if (v.style.italic === true) declarations.push('font-style: italic;')
        const align = { LEFT: 'left', RIGHT: 'right', CENTER: 'center', JUSTIFIED: 'justify' }
        if (v.style.textAlignHorizontal) {
          if (!align[v.style.textAlignHorizontal]) throw new Error('import-node-unsupported')
          declarations.push('text-align: ' + align[v.style.textAlignHorizontal] + ';')
        }
        if (v.style.textAlignVertical && v.style.textAlignVertical !== 'TOP')
          throw new Error('import-node-unsupported')
        if (v.style.textCase && v.style.textCase !== 'ORIGINAL')
          throw new Error('import-node-unsupported')
        if (v.style.textDecoration && v.style.textDecoration !== 'NONE')
          throw new Error('import-node-unsupported')
        dimension('font-size', v.style.fontSize)
        if (v.style.fontWeight !== undefined) token('font-weight', 'fontWeight', v.style.fontWeight)
        if (v.style.fontFamily) {
          if (!['Inter', 'Roboto', 'Montserrat', 'Lora'].includes(v.style.fontFamily))
            throw new Error('import-font-unsupported')
          token('font-family', 'fontFamily', v.style.fontFamily)
        }
        if (v.style.lineHeightPx !== undefined) dimension('line-height', v.style.lineHeightPx)
        if (v.style.letterSpacing !== undefined) dimension('letter-spacing', v.style.letterSpacing)
      }
      if (v.effects?.some((e) => e.visible !== false)) throw new Error('import-effects-unsupported')
      if (v.layoutWrap && v.layoutWrap !== 'NO_WRAP') throw new Error('import-layout-unsupported')
      declarations.push('box-sizing: border-box;', 'flex-shrink: 0;')
      css.push(selector + ' { ' + declarations.join(' ') + ' }')
    }
  }
  for (const entry of base.entries) {
    if (entry.id.startsWith('component.composition.imported.') && !activeTokens.has(entry.id)) {
      let group = next
      for (const part of entry.segments.slice(0, -1)) group = group[part]
      delete group[entry.segments.at(-1)]
    }
  }
  const resolved = readTokens(next)
  if (resolved.entries.length > 8192) throw new Error('budget-exceeded')
  for (const entry of resolved.entries.filter((e) => !base.ids.has(e.id)))
    if (
      !entry.id.startsWith('primitive.composition.import-') &&
      !entry.id.startsWith('component.composition.imported.')
    )
      throw new Error('import-token-scope')
  const referenced = new Set(resolved.entries.flatMap((e) => (e.reference ? [e.reference] : [])))
  for (const entry of resolved.entries) {
    if (entry.id.startsWith('primitive.composition.import-') && !referenced.has(entry.id)) {
      let group = next
      for (const part of entry.segments.slice(0, -1)) group = group[part]
      delete group[entry.segments.at(-1)]
    }
  }
  readTokens(next)
  return {
    document: next,
    registry,
    css:
      '/* Imported component consumers; values live in canonical DTCG. */\n' +
      css.join('\n') +
      '\n',
    previewCSS: variables.join('\n') + '\n',
    className: (definition, node) => importedNodeClass(definition.id, node.id),
  }
}
