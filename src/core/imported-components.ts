import { z } from 'zod'
import { figmaFileSchema } from './figma-file.ts'

export const importedRoleSchema = z.enum(['action', 'input', 'container', 'text', 'graphic'])
export type ImportedRole = z.infer<typeof importedRoleSchema>
export const importedRegistrySchema = z
  .strictObject({
    version: z.literal(1),
    redirects: z
      .record(z.string().regex(/^[a-f0-9]{24}$/), z.string().regex(/^[a-f0-9]{24}$/))
      .default({}),
    overrides: z
      .array(
        z.strictObject({
          sourceDefinitionId: z.string().regex(/^[a-f0-9]{24}$/),
          targetId: z.string().regex(/^[a-f0-9]{24}$/),
          marker: z.string().uuid().nullable(),
          occurrenceId: z.string().uuid().nullable().default(null),
          variantId: z.string().uuid().nullable(),
        }),
      )
      .max(1000)
      .default([]),
    definitions: z
      .array(
        z.strictObject({
          id: z.string().regex(/^[a-f0-9]{24}$/),
          label: z.string().min(1).max(200),
          role: importedRoleSchema,
          localAdapted: z.boolean().default(false),
          dependencies: z.record(z.string(), z.string().regex(/^[a-f0-9]{24}$/)).default({}),
          fileKey: figmaFileSchema.shape.fileKey,
          nodeId: z.string().min(1).max(200),
          sourceHash: z.string().regex(/^[a-f0-9]{64}$/),
          sourceVersion: z.string().min(1).max(200).default('unknown'),
          rootId: z.string().min(1).max(240),
          variants: z
            .array(
              z.strictObject({
                id: z.string().min(1).max(240),
                label: z.string().max(200),
                identity: z.string().uuid().optional(),
              }),
            )
            .max(200),
          nodes: figmaFileSchema.shape.nodes.max(1000),
        }),
      )
      .max(100),
  })
  .superRefine((registry, context) => {
    const ids = new Set<string>(),
      sources = new Set<string>(),
      scopes = new Set<string>()
    const invalid = (message: string) => context.addIssue({ code: 'custom', message })
    for (const definition of registry.definitions) {
      const source = [definition.fileKey, definition.nodeId, definition.sourceHash].join(':')
      if (ids.has(definition.id) || sources.has(source)) invalid('duplicate-import-definition')
      ids.add(definition.id)
      sources.add(source)
      const nodes = new Set(definition.nodes.map((n) => n.id))
      if (
        nodes.size !== definition.nodes.length ||
        !nodes.has(definition.rootId) ||
        definition.variants.some((v) => !nodes.has(v.id)) ||
        definition.nodes.some((n) => n.children.some((id) => !nodes.has(id)))
      )
        invalid('invalid-import-structure')
    }
    for (const item of registry.overrides) {
      const scope = [item.sourceDefinitionId, item.occurrenceId, item.variantId].join(':')
      if (!!item.marker === !!item.variantId || scopes.has(scope)) invalid('invalid-import-scope')
      if (!!item.marker !== !!item.occurrenceId) invalid('invalid-import-occurrence')
      scopes.add(scope)
    }
  })
export type ImportedRegistry = z.infer<typeof importedRegistrySchema>
export type ImportedDefinition = ImportedRegistry['definitions'][number]
export function replacementCompatibility(before: ImportedRole | null, after: ImportedRole) {
  return before === null ? 'indeterminate' : before === after ? 'compatible' : 'incompatible'
}

export const importedRequestSchema = z.strictObject({
  protocolVersion: z.literal(6),
  requestId: z.string().uuid(),
  baseRevision: z.string().regex(/^[a-f0-9]{64}$/),
  registry: importedRegistrySchema,
})
export function importedNodeClass(definitionId: string, nodeId: string) {
  return (
    'loomata-import-' +
    definitionId +
    '-' +
    Array.from(nodeId)
      .map((c) => c.charCodeAt(0).toString(16))
      .join('-')
  )
}

export function resolveImportedDefinition(registry: ImportedRegistry, id: string) {
  const seen = new Set<string>()
  while (registry.redirects?.[id]) {
    if (seen.has(id)) throw new Error('import-component-cycle')
    seen.add(id)
    id = registry.redirects[id]
  }
  return registry.definitions.find((d) => d.id === id)
}

export function resolveImportedUsage(
  registry: ImportedRegistry,
  id: string,
  marker?: string | null,
  variantId?: string | null,
  occurrenceId?: string | null,
) {
  const overrides = registry.overrides.filter((o) => o.sourceDefinitionId === id)
  const override =
    overrides.find((o) => o.marker && o.marker === marker && o.occurrenceId === occurrenceId) ??
    overrides.find((o) => o.variantId && o.variantId === variantId)
  return resolveImportedDefinition(registry, override?.targetId ?? id)
}
