import path from 'node:path'
import fs from 'node:fs/promises'
import { randomUUID, createHash } from 'node:crypto'
import { z } from 'zod'
import { explorationStore, explorationSnapshot } from './workspace-exploration.ts'
import { applyDesign } from './workspace-design.ts'
import { figmaFileSchema, figmaDependencies } from '../../src/core/figma-file.ts'
import {
  importedRegistrySchema,
  importedRoleSchema,
  replacementCompatibility,
  resolveImportedDefinition,
} from '../../src/core/imported-components.ts'
import { figmaImportFingerprint } from './figma-file-client.ts'
import { compileImportedComponents, importIdentity, importsPath } from '../imported-components.mjs'
import { tokenPath, readTokens } from '../dtcg-tokens.mjs'
import { durableReplace, privateDir, readSafe } from '../design-editor/files.mjs'
const proposalPath = '.runtime.local/figma/proposal.json'
const revision = z.string().regex(/^[a-f0-9]{64}$/)
const workspaceIdentity = (key) => {
  const hex = createHash('sha256').update(key).digest('hex')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-8${hex.slice(17, 20)}-${hex.slice(20, 32)}`
}
const commands = z.discriminatedUnion('kind', [
  z.strictObject({
    kind: z.literal('import-plan'),
    fileKey: figmaFileSchema.shape.fileKey,
    revision,
    nodeId: z.string().min(1).max(200),
    version: z.string().min(1).max(200),
    role: importedRoleSchema,
    replaceId: z.string().uuid().nullable().default(null),
    scope: z.enum(['definition', 'occurrence', 'variant']).default('definition'),
    variantId: z.string().uuid().nullable().default(null),
  }),
  z.strictObject({ kind: z.literal('import-status') }),
  z.strictObject({ kind: z.literal('import-cancel'), id: z.string().uuid() }),
  z.strictObject({
    kind: z.literal('import-assign-variant'),
    revision,
    occurrenceId: z.string().uuid(),
    variantId: z.string().uuid().nullable(),
  }),
  z.strictObject({
    kind: z.literal('import-adjust'),
    id: z.string().uuid(),
    definitionId: z.string(),
    nodeId: z.string(),
    property: z.enum([
      'width',
      'height',
      'paddingLeft',
      'paddingRight',
      'paddingTop',
      'paddingBottom',
      'itemSpacing',
      'cornerRadius',
    ]),
    value: z.number().finite().min(0).max(100000),
  }),

  z.strictObject({
    kind: z.literal('import-accept'),
    id: z.string().uuid(),
    revision,
    acknowledgeStructure: z.boolean().default(false),
  }),
  z.strictObject({
    kind: z.literal('import-prepare'),
    fileKey: figmaFileSchema.shape.fileKey,
    revision,
    nodeId: z.string().min(1).max(200),
    version: z.string().min(1).max(200),
    role: importedRoleSchema,
    replaceId: z.string().uuid().nullable().default(null),
    scope: z.enum(['definition', 'occurrence', 'variant']).default('definition'),
    variantId: z.string().uuid().nullable().default(null),
  }),
])
const proposalSchema = z.strictObject({
  id: z.string().uuid(),
  revision,
  designRevision: revision,
  registry: importedRegistrySchema,
  definitionId: z.string(),
  targets: z.array(z.string().uuid()),
  registration: z.array(z.unknown()),
  comparison: z
    .strictObject({
      beforeId: z.string(),
      beforeLabel: z.string(),
      beforeNodes: z.number(),
      afterNodes: z.number(),
      structural: z.boolean(),
      localAdaptation: z.boolean(),
    })
    .nullable()
    .default(null),
  sourceHash: revision,
})
const queues = new Map()
export async function workspaceFigmaImport(
  root,
  writer,
  value,
  authority,
  chat,
  expectedFingerprint,
) {
  const previous = queues.get(root) ?? Promise.resolve()
  const result = previous
    .catch(() => {})
    .then(() => runImport(root, writer, value, authority, chat, expectedFingerprint))
  queues.set(root, result)
  try {
    return await result
  } finally {
    if (queues.get(root) === result) queues.delete(root)
  }
}
async function runImport(root, writer, value, authority, chat, expectedFingerprint) {
  const input = commands.parse(value),
    { store, treeId } = explorationStore(root)
  await store.assertRoot()
  const readJSON = async (file, limit = 2 * 1024 * 1024) => {
    try {
      return JSON.parse((await readSafe(root, file, limit)).bytes.toString('utf8'))
    } catch (e) {
      if (e.code === 'ENOENT') return null
      throw e
    }
  }
  const registry = importedRegistrySchema.parse(await readJSON(importsPath))
  const publicProposal = async (proposal) => {
    if (!proposal) return null
    const p = proposalSchema.parse(proposal)
    const tokens = await readJSON(tokenPath)
    const compiled = compileImportedComponents(tokens, p.registry, registry)
    return { ...p, css: compiled.css, variables: compiled.previewCSS }
  }
  if (input.kind === 'import-status') {
    let proposal = await readJSON(proposalPath)
    if (proposal && treeId) {
      const state = await store.state()
      if (state.trees.find((tree) => tree.id === treeId)?.receipts[proposal.id]?.design) {
        await fs.unlink(path.join(root, proposalPath))
        proposal = null
      }
    }
    return {
      registry,
      css: compileImportedComponents(await readJSON(tokenPath), registry, registry).css,
      variables: compileImportedComponents(await readJSON(tokenPath), registry, registry)
        .previewCSS,
      proposal: await publicProposal(proposal),
    }
  }
  if (input.kind === 'import-adjust') {
    const proposal = proposalSchema.parse(await readJSON(proposalPath))
    if (proposal.id !== input.id) throw new Error('revision-conflict')
    const definition = proposal.registry.definitions.find((d) => d.id === input.definitionId)
    if (registry.definitions.some((d) => d.id === input.definitionId))
      throw new Error('import-adjustment-shared')
    const node = definition?.nodes.find((n) => n.id === input.nodeId)
    if (!node) throw new Error('import-node-unsupported')
    definition.localAdapted = true
    if (['width', 'height'].includes(input.property)) {
      node.values.bounds = { ...(node.values.bounds ?? {}), [input.property]: input.value }
    } else node.values[input.property] = input.value
    compileImportedComponents(await readJSON(tokenPath), proposal.registry, registry)
    await durableReplace(root, proposalPath, Buffer.from(JSON.stringify(proposal)))
    return { proposal: await publicProposal(proposal) }
  }
  if (input.kind === 'import-cancel') {
    const existing = await readJSON(proposalPath)
    if (existing && existing.id !== input.id) throw new Error('revision-conflict')
    await fs.unlink(path.join(root, proposalPath)).catch((e) => {
      if (e.code !== 'ENOENT') throw e
    })
    return { cancelled: true }
  }
  if (input.kind === 'import-accept' && treeId) {
    const state = await store.state()
    const receipt = state.trees.find((tree) => tree.id === treeId)?.receipts[input.id]
    if (receipt?.design) {
      if ((await readJSON(proposalPath))?.id === input.id)
        await fs.unlink(path.join(root, proposalPath))
      return { accepted: true, revision: receipt.revision, repeated: true }
    }
  }
  const view = await explorationSnapshot(root)
  if (
    !view.available ||
    !treeId ||
    !view.selected ||
    !view.writable ||
    input.revision !== view.model.revision
  )
    throw new Error('revision-conflict')
  if (input.kind === 'import-accept') {
    if (expectedFingerprint) {
      const raw = await store.read(proposalPath, root)
      if (!raw || createHash('sha256').update(raw).digest('hex') !== expectedFingerprint)
        throw new Error('chat-proposal-stale')
    }
    const proposal = proposalSchema.parse(await readJSON(proposalPath))
    if (proposal.id !== input.id || proposal.revision !== input.revision)
      throw new Error('revision-conflict')
    const cached = await readJSON('.runtime.local/figma/file.json', 32 * 1024 * 1024)
    const definition = proposal.registry.definitions.find((d) => d.id === proposal.definitionId)
    if (!cached?.file || cached.file.fileKey !== definition?.fileKey)
      throw new Error('figma-source-stale')
    const file = figmaFileSchema.parse(cached.file)
    if (
      !file.nodes.some((n) => n.id === definition.nodeId) ||
      figmaImportFingerprint(file, definition.nodeId).hash !== proposal.sourceHash
    )
      throw new Error('figma-source-stale')
    if (
      proposal.comparison &&
      (proposal.comparison.structural || proposal.comparison.localAdaptation) &&
      !input.acknowledgeStructure
    )
      throw new Error('import-structure-confirmation-required')
    store.designWriter = { ...writer, close: async () => {} }
    const result = await applyDesign(
      store,
      treeId,
      {
        id: proposal.id,
        ...(chat ? { chat } : {}),
        revision: proposal.revision,
        requireSelected: true,
        targets: proposal.targets,
        registration: proposal.registration,
        request: {
          protocolVersion: 6,
          requestId: proposal.id,
          baseRevision: proposal.designRevision,
          registry: proposal.registry,
        },
      },
      authority,
    )
    // A lost response is detectable by the persisted operation id. No speculative cleanup on failure.
    await fs.unlink(path.join(root, proposalPath))
    return { accepted: true, revision: result.revision }
  }
  if (input.kind === 'import-assign-variant') {
    const occurrence = view.model.entities.find(
      (e) => e.kind === 'occurrence' && e.id === input.occurrenceId,
    )
    const owner = view.model.entities.find(
      (e) => e.kind === 'component' && e.id === occurrence?.definitionId,
    )
    const definition =
      owner && registry.definitions.find((d) => owner.sourceKey === 'import-' + d.id)
    if (
      !occurrence?.marker ||
      !definition ||
      (input.variantId && !definition.variants.some((v) => v.identity === input.variantId))
    )
      throw new Error('import-scope-unverified')
    return store.apply(treeId, {
      id: randomUUID(),
      revision: input.revision,
      requireSelected: true,
      origin: 'inspector',
      targets: [occurrence.id],
      edits: [],
      entities: view.model.entities.map((e) =>
        e.id === occurrence.id ? { ...e, variantId: input.variantId } : e,
      ),
    })
  }
  if (input.kind === 'import-prepare' && input.scope !== 'definition' && !input.replaceId)
    throw new Error('import-scope-unverified')
  const cached = await readJSON('.runtime.local/figma/file.json', 32 * 1024 * 1024)
  const file = figmaFileSchema.parse(cached?.file)
  if (file.version !== input.version || file.fileKey !== input.fileKey)
    throw new Error('figma-source-stale')
  const node = file.nodes.find((n) => n.id === input.nodeId)
  if (!node || !['FRAME', 'COMPONENT', 'COMPONENT_SET'].includes(node.type))
    throw new Error('import-node-unsupported')
  if (
    input.kind === 'import-prepare' &&
    node.type === 'FRAME' &&
    !(await store.read('app/routes.ts', root))?.includes('routes/imported-page.tsx')
  )
    throw new Error('import-page-plan-required')
  const closure = figmaDependencies(file, node.id)
  if (!closure.complete && input.kind === 'import-prepare')
    throw new Error('import-dependencies-incomplete')
  if (input.kind === 'import-plan') {
    const target = view.model.entities.find((e) => e.id === input.replaceId)
    const owner =
      target?.kind === 'occurrence'
        ? view.model.entities.find((e) => e.id === target.definitionId)
        : target
    const previous =
      owner?.kind === 'component' &&
      registry.definitions.find((d) => owner.sourceKey === 'import-' + d.id)
    const known = {
      button: 'action',
      field: 'input',
      'select-field': 'input',
      panel: 'container',
      notice: 'container',
    }
    const role = previous?.role ?? known[owner?.sourceKey]
    if (input.replaceId && replacementCompatibility(role ?? null, input.role) === 'incompatible')
      throw new Error('import-functional-incompatible')
    if (input.replaceId && !target) throw new Error('import-scope-unverified')
    const id = randomUUID(),
      contextPath = 'app/figma-request-' + id + '.json'
    const context =
      JSON.stringify(
        {
          version: 1,
          source: {
            fileKey: file.fileKey,
            nodeId: node.id,
            version: file.version,
            hash: figmaImportFingerprint(file, node.id).hash,
          },
          role: input.role,
          replaceId: input.replaceId,
          scope: input.scope,
          variantId: input.variantId,
          status: 'adaptation-required',
          variables: 'ignored',
          coverage: closure.complete ? 'selected-dependency-closure' : 'incomplete',
          missingIds: closure.missingIds,
          nodes: file.nodes.filter((n) => closure.nodeIds.includes(n.id)),
        },
        null,
        2,
      ) + '\n'
    if (context.length > 95000) throw new Error('budget-exceeded')
    const receipt = await store.apply(treeId, {
      id: randomUUID(),
      revision: input.revision,
      origin: 'figma',
      requireSelected: true,
      targets: [id],
      edits: [{ file: contextPath, before: null, after: context }],
      entities: [
        ...view.model.entities,
        {
          id,
          kind: 'request',
          label: ('Adapter depuis Figma : ' + node.name).slice(0, 200),
          revision: view.model.revision,
          files: [contextPath],
        },
      ],
    })
    return { planned: true, requestId: id, revision: receipt.revision }
  }
  if (await readJSON(proposalPath)) throw new Error('import-proposal-exists')

  let replacement = null,
    replacementTarget = null,
    replacementVariant = null
  if (input.replaceId) {
    const target = view.model.entities.find((e) => e.id === input.replaceId)
    const targetDefinition =
      target?.kind === 'occurrence'
        ? view.model.entities.find((e) => e.id === target.definitionId)
        : target
    const owner = targetDefinition?.kind === 'component' ? targetDefinition.sourceKey : null
    const logical = registry.definitions.find((d) => owner === 'import-' + d.id)
    const previous = logical && resolveImportedDefinition(registry, logical.id)
    const known = {
      button: 'action',
      field: 'input',
      'select-field': 'input',
      panel: 'container',
      notice: 'container',
    }
    const compatible = replacementCompatibility(previous?.role ?? known[owner] ?? null, input.role)
    if (compatible === 'incompatible') throw new Error('import-functional-incompatible')
    if (compatible === 'indeterminate' || !previous)
      throw new Error('import-replacement-unverified')
    if (input.scope === 'occurrence' && (target?.kind !== 'occurrence' || !target.marker))
      throw new Error('import-scope-unverified')
    if (input.scope === 'variant') {
      replacementVariant =
        input.variantId ?? (target?.kind === 'occurrence' ? target.variantId : null)
      if (!replacementVariant || !logical.variants.some((v) => v.identity === replacementVariant))
        throw new Error('import-scope-unverified')
    }
    replacement = logical.id
    replacementTarget = target
  }
  const next = structuredClone(registry),
    registration = [],
    definitions = [],
    ids = new Set()
  const map = new Map(file.nodes.map((n) => [n.id, n]))
  const family = (n) =>
    n.type === 'COMPONENT' && map.get(n.parentId)?.type === 'COMPONENT_SET'
      ? map.get(n.parentId)
      : n
  for (const id of [node.id, ...closure.definitionIds]) {
    const selected = family(map.get(id)),
      key = importIdentity(file.fileKey, selected.id)
    if (ids.has(key)) continue
    ids.add(key)
    const fingerprint = figmaImportFingerprint(file, selected.id)
    const exact = registry.definitions.find(
      (d) =>
        d.fileKey === file.fileKey && d.nodeId === selected.id && d.sourceHash === fingerprint.hash,
    )
    if (exact) {
      if (selected.id === family(node).id && exact.role !== input.role)
        throw new Error('import-functional-incompatible')
      definitions.push(exact)
      continue
    }
    const old = registry.definitions.find(
      (d) => d.fileKey === file.fileKey && d.nodeId === selected.id,
    )
    if (old && !replacement) throw new Error('import-source-change-review-required')
    const identity = old ? importIdentity(file.fileKey, selected.id + ':' + fingerprint.hash) : key
    const descendants = [],
      pending = [selected.id],
      seen = new Set()
    while (pending.length) {
      const id = pending.pop()
      if (seen.has(id)) continue
      seen.add(id)
      const n = map.get(id)
      if (!n) throw new Error('import-dependencies-incomplete')
      descendants.push(n)
      pending.push(...n.children)
    }
    if (descendants.length > 1000) throw new Error('budget-exceeded')
    const variants =
      selected.type === 'COMPONENT_SET'
        ? selected.children.map((id) => ({
            id,
            label: map.get(id).name.slice(0, 200),
            identity: workspaceIdentity(identity + ':' + id),
          }))
        : []
    const definition = {
      id: identity,
      label: selected.name.slice(0, 200),
      role: selected.id === family(node).id ? input.role : (old?.role ?? 'container'),
      fileKey: file.fileKey,
      nodeId: selected.id,
      rootId: variants[0]?.id ?? selected.id,
      variants,
      sourceHash: fingerprint.hash,
      sourceVersion: file.version,
      dependencies: {},
      nodes: descendants,
    }
    next.definitions = next.definitions.filter((d) => d.id !== identity).concat(definition)
    definitions.push(definition)
  }
  for (const definition of definitions) {
    if (registry.definitions.some((d) => d.id === definition.id)) continue
    for (const instance of definition.nodes.filter((n) => n.componentId)) {
      const bound = definitions.find((d) =>
        d.nodes.some((n) => n.type === 'COMPONENT' && n.id === instance.componentId),
      )
      if (!bound) throw new Error('import-dependencies-incomplete')
      definition.dependencies[instance.componentId] = bound.id
    }
  }
  const selectedDefinition = definitions.find((d) => d.nodeId === family(node).id)
  if (!selectedDefinition) throw new Error('import-dependencies-incomplete')
  if (replacement && input.scope === 'definition') {
    const logical = registry.definitions.find((d) => d.id === replacement)
    const owner = view.model.entities.find(
      (e) => e.kind === 'component' && e.sourceKey === 'import-' + replacement,
    )
    const used = view.model.entities.filter(
      (e) => e.kind === 'occurrence' && e.definitionId === owner?.id && e.variantId,
    )
    if (
      used.some((e) => {
        const variant = logical.variants.find((v) => v.identity === e.variantId)
        return (
          !variant ||
          logical.fileKey !== selectedDefinition.fileKey ||
          !selectedDefinition.variants.some((v) => v.id === variant.id)
        )
      })
    )
      throw new Error('import-scope-unverified')
  }
  if (replacement && selectedDefinition.id !== replacement) {
    if (input.scope === 'definition') next.redirects[replacement] = selectedDefinition.id
    else {
      const marker = input.scope === 'occurrence' ? replacementTarget.marker : null
      const variantId = input.scope === 'variant' ? replacementVariant : null
      const occurrenceId = input.scope === 'occurrence' ? replacementTarget.id : null
      next.overrides = next.overrides.filter(
        (o) =>
          !(
            o.sourceDefinitionId === replacement &&
            o.occurrenceId === occurrenceId &&
            o.variantId === variantId
          ),
      )
      next.overrides.push({
        sourceDefinitionId: replacement,
        targetId: selectedDefinition.id,
        marker,
        occurrenceId: input.scope === 'occurrence' ? replacementTarget.id : null,
        variantId,
      })
    }
  }
  if (JSON.stringify(importedRegistrySchema.parse(next)) === JSON.stringify(registry))
    return { reused: true, definitionId: selectedDefinition.id }
  const compiled = compileImportedComponents(await readJSON(tokenPath), next, registry)
  for (const definition of definitions) {
    const existing = view.model.entities.find(
      (e) => e.kind === 'component' && e.sourceKey === 'import-' + definition.id,
    )
    const componentId = existing?.id ?? randomUUID()
    registration.push({
      id: componentId,
      kind: 'component',
      label: definition.label,
      sourceKey: 'import-' + definition.id,
      revision: view.model.revision,
      files: [importsPath, 'app/loomata-imports.css'],
    })
    for (const variant of definition.variants)
      registration.push({
        id: variant.identity,
        kind: 'variant',
        definitionId: componentId,
        label: variant.label,
        revision: view.model.revision,
        files: [importsPath],
      })
  }
  if (replacementTarget && !registration.some((e) => e.id === replacementTarget.id))
    registration.push(replacementTarget)
  if (node.type === 'FRAME' && !replacement) {
    const definitionId = replacement ?? selectedDefinition.id
    const definitionEntity =
      registration.find((e) => e.sourceKey === 'import-' + definitionId) ??
      view.model.entities.find(
        (e) => e.kind === 'component' && e.sourceKey === 'import-' + definitionId,
      )
    const existingPage = view.model.entities.find(
      (e) => e.kind === 'page' && e.path === '/imported/' + definitionId,
    )
    const pageId = existingPage?.id ?? randomUUID()
    registration.push({
      id: pageId,
      kind: 'page',
      path: '/imported/' + definitionId,
      label: node.name.slice(0, 200),
      revision: view.model.revision,
      files: [importsPath],
    })
    registration.push({
      id: randomUUID(),
      kind: 'occurrence',
      pageId,
      definitionId: definitionEntity.id,
      variantId: null,
      marker: '11111111-1111-4111-8111-' + definitionId.slice(0, 12),
      label: node.name.slice(0, 200),
      revision: view.model.revision,
    })
  }
  const design = await writer.snapshot()
  const beforeDefinition = replacement && resolveImportedDefinition(registry, replacement)
  const afterDefinition = selectedDefinition
  let localAdaptation = false
  if (beforeDefinition) {
    const affected = new Set(),
      pending = [beforeDefinition.id]
    while (pending.length) {
      const id = pending.pop()
      if (affected.has(id)) continue
      affected.add(id)
      const d = resolveImportedDefinition(registry, id)
      if (d) {
        localAdaptation ||= d.localAdapted
        pending.push(...Object.values(d.dependencies))
      }
    }
    const document = await readJSON(tokenPath),
      current = readTokens(document)
    const source = readTokens(compileImportedComponents(document, registry).document)
    for (const entry of current.entries) {
      if (
        [...affected].some((id) =>
          entry.id.startsWith('component.composition.imported.n' + id + '.'),
        ) &&
        JSON.stringify(entry.value) !== JSON.stringify(source.ids.get(entry.id)?.value)
      )
        localAdaptation = true
    }
  }
  const shape = (d) => JSON.stringify(d.nodes.map((n) => [n.type, n.children.length]))
  const p = proposalSchema.parse({
    id: randomUUID(),
    revision: view.model.revision,
    designRevision: design.revision,
    registry: next,
    definitionId: selectedDefinition.id,
    targets: registration.map((e) => e.id),
    registration,
    comparison:
      beforeDefinition && afterDefinition
        ? {
            beforeId: replacement,
            beforeLabel: beforeDefinition.label,
            beforeNodes: beforeDefinition.nodes.length,
            afterNodes: afterDefinition.nodes.length,
            structural: shape(beforeDefinition) !== shape(afterDefinition),
            localAdaptation,
          }
        : null,
    sourceHash: figmaImportFingerprint(file, node.id).hash,
  })
  await privateDir(path.join(root, '.runtime.local/figma'))
  const proposalBytes = Buffer.from(JSON.stringify(p))
  if (proposalBytes.length > 2 * 1024 * 1024) throw new Error('budget-exceeded')
  await durableReplace(root, proposalPath, proposalBytes)
  return { proposal: { ...p, css: compiled.css, variables: compiled.previewCSS } }
}
