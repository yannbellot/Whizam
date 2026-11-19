import { z } from 'zod'
import {
  identitySchema,
  revisionSchema,
  workspaceSchema,
  type Workspace,
} from './workspace-contract.ts'
import { variantRecipeSchema } from './variant-recipes.ts'

export const renderReportSchema = z.strictObject({
  pageId: identitySchema,
  revision: revisionSchema,
  markers: z.array(z.string().max(80)).max(4000),
})
export const explorationStateSchema = z.discriminatedUnion('available', [
  z.strictObject({ available: z.literal(false) }),
  z.strictObject({
    available: z.literal(true),
    model: workspaceSchema,
    treeId: identitySchema.nullable(),
    selected: z.boolean(),
    writable: z.boolean(),
    legacyDefinitionStyles: z.boolean().default(false),
    variants: z.array(variantRecipeSchema).max(1000).default([]),
    lastOperation: z
      .strictObject({ id: identitySchema, revision: revisionSchema, design: z.boolean() })
      .nullable()
      .default(null),
  }),
])

/** Registered source identity, never DOM position, is the selection authority. */
export function resolvePage(input: unknown, reportInput: unknown) {
  const model = workspaceSchema.parse(input),
    report = renderReportSchema.parse(reportInput)
  if (model.revision !== report.revision) throw new Error('exploration-stale-render')
  const page = model.entities.find((e) => e.id === report.pageId)
  if (page?.kind !== 'page' || page.path === undefined) throw new Error('exploration-page-unknown')
  const counts = new Map<string, number>()
  for (const marker of report.markers) counts.set(marker, (counts.get(marker) ?? 0) + 1)
  const occurrences = model.entities
    .filter((e) => e.kind === 'occurrence' && e.pageId === page.id)
    .map((e) => {
      if (e.kind !== 'occurrence') throw new Error('exploration-occurrence-unknown')
      const count = e.marker ? (counts.get(e.marker) ?? 0) : 0
      return {
        ...e,
        status: !e.marker
          ? ('unmapped' as const)
          : count === 1
            ? ('present' as const)
            : count === 0
              ? ('missing' as const)
              : ('ambiguous' as const),
      }
    })
  const known = new Set(occurrences.map((e) => e.marker))
  const unknown = report.markers.filter((m) => !known.has(m)).length
  return {
    page,
    occurrences,
    unknown,
    coverage:
      !occurrences.length || unknown || occurrences.some((e) => e.status !== 'present')
        ? ('partial' as const)
        : ('registered' as const),
  }
}

export function resolveSelection(model: Workspace, report: unknown, occurrenceId: string) {
  const page = resolvePage(model, report)
  const selected = page.occurrences.find((e) => e.id === occurrenceId)
  if (!selected || selected.status !== 'present')
    throw new Error('exploration-selection-unavailable')
  return selected
}
