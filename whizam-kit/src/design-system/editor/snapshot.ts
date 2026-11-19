import { assertCatalogExtension } from './intentions'
import { z } from 'zod'
import { editorCapability, editorFetch, type EditorHost } from './service'
import { canonicalJSON } from './canonical-json'
import { validateCatalog, validateEditorModel } from './contract'
import type { Catalog, EditorContract, EditorModel, SemanticToken } from './snapshot-types'

export type Presentation = {
  label: string
  parts: Record<string, string>
  variants: Record<string, string>
  states: Record<string, string>
  priorityIntentions?: string[]
  semanticGuidance?: {
    purpose: string
    recommendations: {
      variants: string[]
      part: string
      properties: string[]
      states: string[]
      intentions: string[]
      reason: string
    }[]
  }
  consumerFiles: string[]
  contrastParts: string[]
  dynamicConsumers?: { file: string; group: 'legacy-tokens' }[]
}
export type Usage = { reference: string; file: string; kind: 'binding' | 'alias' | 'dynamic' }
export type EditorSnapshot = {
  schemaVersion: 4
  authorityGeneration?: string
  generation: string
  model: EditorModel
  contract: EditorContract
  catalog: Catalog
  presentation: Record<string, Presentation>
  legacy: SemanticToken[]
  usages: Usage[]
  inventoryIssues: string[]
}
const id = z
  .string()
  .max(240)
  .regex(/^[a-z][a-z0-9-]*(?:\.[a-z][a-z0-9-]*)+$/)
const safeText = z.string().min(1).max(400)
const primitive = z
  .object({
    id,
    family: z.string().min(1).max(80),
    origins: z
      .array(
        z
          .object({
            id,
            provenance: z
              .object({
                kind: z.enum(['designer-edit', 'agent-migration']),
                status: z.literal('proposed'),
                reason: safeText,
              })
              .strict(),
          })
          .strict(),
      )
      .max(4096)
      .optional(),
    type: z.enum(['color', 'dimension', 'font-weight', 'line-height', 'font-family']),
    value: z.union([z.string().max(160), z.number().finite()]),
    provenance: z
      .object({
        kind: z.enum(['designer-edit', 'agent-migration']),
        status: z.literal('proposed'),
        reason: safeText,
      })
      .strict(),
  })
  .strict()
const style = z
  .object({
    classification: z.enum(['semantic', 'non-semantic']).optional(),
    justification: safeText.optional(),
    id,
    type: primitive.shape.type,
    intention: id,
    role: z.string().regex(/^[a-z-]+$/),
    state: z.enum(['default', 'hover', 'focus-visible', 'disabled', 'loading', 'error']),
    reference: id,
  })
  .strict()
const binding = z
  .object({
    id,
    target: z.string().regex(/^[a-z-]+$/),
    variant: z.string().regex(/^[a-z-]+$/),
    part: z.string().regex(/^[a-z-]+$/),
    property: z.string().regex(/^[a-z][A-Za-z]+$/),
    state: style.shape.state,
    style: id.nullable(),
    baseReference: id,
    reference: id,
    provenance: primitive.shape.provenance.optional(),
  })
  .strict()
const record = z.record(z.string().regex(/^[a-z][a-z0-9-]*$/), safeText)
const file = z
  .string()
  .max(200)
  .regex(/^(?:src|app)\/[A-Za-z0-9/.-]+\.(?:css|tsx)$/)
  .refine((value) => !value.split('/').includes('..'))
const presentation = z
  .object({
    label: safeText,
    parts: record,
    variants: record,
    states: record,
    priorityIntentions: z.array(id).max(20).optional(),
    semanticGuidance: z
      .object({
        purpose: safeText,
        recommendations: z
          .array(
            z
              .object({
                variants: z.array(z.string()).min(1).max(200),
                part: z.string(),
                properties: z.array(z.string()).min(1).max(200),
                states: z.array(z.string()).min(1).max(200),
                intentions: z.array(id).min(1).max(200),
                reason: safeText,
              })
              .strict(),
          )
          .min(1)
          .max(500),
      })
      .strict()
      .optional(),
    consumerFiles: z.array(file).max(20),
    contrastParts: z.array(z.string().regex(/^[a-z-]+$/)).max(20),
    dynamicConsumers: z
      .array(z.object({ file, group: z.literal('legacy-tokens') }).strict())
      .max(10)
      .optional(),
  })
  .strict()
// The contract/catalog are checked relationally and against the trusted compiled domains below.
const envelope = z
  .object({
    schemaVersion: z.literal(4),
    authorityGeneration: z
      .string()
      .regex(/^[a-f0-9]{64}$/)
      .optional(),
    generation: z.string().regex(/^[a-f0-9]{64}$/),
    model: z
      .object({
        schemaVersion: z.literal(4),
        primitives: z.array(primitive).max(4096),
        styles: z.array(style).max(4096),
        bindings: z.array(binding).max(8192),
      })
      .strict(),
    contract: z.unknown(),
    catalog: z.unknown(),
    presentation: z.record(z.string().regex(/^[a-z-]+$/), presentation),
    legacy: z
      .array(
        z
          .object({ id, type: z.string().max(30), value: z.object({ reference: id }).strict() })
          .strict(),
      )
      .max(1000),
    usages: z
      .array(
        z.object({ reference: id, file, kind: z.enum(['binding', 'alias', 'dynamic']) }).strict(),
      )
      .max(20000),
    inventoryIssues: z.array(safeText).max(1000),
  })
  .strict()
export function assertSnapshot(input: unknown, trusted: EditorSnapshot): EditorSnapshot {
  const parsed = envelope.parse(input)
  // A generated asset may refresh values, never add executable domains or selectors.
  if (
    canonicalJSON(parsed.contract) !== canonicalJSON(trusted.contract) ||
    canonicalJSON(parsed.presentation) !== canonicalJSON(trusted.presentation)
  )
    throw new Error('La structure a changé : reconstruisez Storybook.')
  const candidate = parsed as EditorSnapshot
  assertCatalogExtension(candidate.catalog, trusted.catalog, trusted.contract)
  validateCatalog(candidate.catalog, candidate.contract)
  validateEditorModel(candidate.model, candidate.catalog, candidate.contract)
  for (const primitive of candidate.model.primitives)
    if (
      primitive.type === 'font-family' &&
      !/^[A-Za-z][A-Za-z0-9 ,_-]{0,150}$/.test(String(primitive.value))
    )
      throw new Error('Famille non sûre.')
  return candidate
}

export async function readEditorState(
  trusted: EditorSnapshot,
  publicOnly = false,
  host?: EditorHost,
): Promise<{ snapshot: EditorSnapshot; revision: string | null; rootId: string | null }> {
  const protectedRead = !publicOnly && !!(host ? host.capability() : editorCapability())
  const response = protectedRead
    ? await (host ? host.request('snapshot', {}) : editorFetch('snapshot', {}))
    : await fetch(new URL('/editor-snapshot.generated.json', window.location.href), {
        cache: 'no-store',
        credentials: 'omit',
      })
  if (!response.ok || !response.body) throw new Error('Données de design indisponibles.')
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let text = '',
    size = 0
  try {
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > 2 * 1024 * 1024) throw new Error('Données trop volumineuses.')
      text += decoder.decode(value, { stream: true })
    }
  } finally {
    await reader.cancel()
  }
  text += decoder.decode()
  const payload = JSON.parse(text) as Record<string, unknown>
  const raw = (protectedRead ? payload.snapshot : payload) as Record<string, unknown>
  const rootId = protectedRead
    ? z
        .string()
        .regex(/^[a-f0-9]{64}$/)
        .parse(payload.rootId)
    : null
  const revision = protectedRead
    ? z
        .string()
        .regex(/^[a-f0-9]{64}$/)
        .parse(payload.revision)
    : null
  const candidate = assertSnapshot(raw, trusted)
  const { generation, ...content } = raw
  const bytes = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(canonicalJSON(content)),
  )
  if (
    [...new Uint8Array(bytes)].map((byte) => byte.toString(16).padStart(2, '0')).join('') !==
    generation
  )
    throw new Error('Empreinte de génération invalide.')
  return { snapshot: candidate, revision, rootId }
}

export async function readGeneratedSnapshot(trusted: EditorSnapshot): Promise<EditorSnapshot> {
  return (await readEditorState(trusted)).snapshot
}

/** Retry only reads. Disposed/superseded work never publishes a result or an error. */
export async function retryRead<T>(
  read: () => Promise<T>,
  current: () => boolean = () => true,
): Promise<T> {
  const started = Date.now()
  let failures = 0
  const cancelled = () => new DOMException('Lecture remplacée.', 'AbortError')
  for (;;) {
    if (!current()) throw cancelled()
    try {
      const value = await read()
      if (!current()) throw cancelled()
      return value
    } catch (error) {
      if (!current()) throw cancelled()
      failures++
      if (failures >= 3 && Date.now() - started >= 5000) throw error
      await new Promise<void>((resolve) => setTimeout(resolve, 1000))
    }
  }
}
