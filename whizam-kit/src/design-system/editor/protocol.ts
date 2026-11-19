import { z } from 'zod'
import { operationSchema, projectTransaction } from './operations'
import { getBinding, setLocal, setShared, emptyChanges } from './draft'
import type { Changes } from './draft'
import type { EditorSnapshot } from './snapshot'

export const CHANNEL = {
  ready: 'adl-design-editor/ready',
  request: 'adl-design-editor/request',
  applied: 'adl-design-editor/applied',
  refresh: 'adl-design-editor/refresh',
  probe: 'adl-design-editor/probe',
} as const
const identity = z
  .string()
  .min(1)
  .max(240)
  .regex(/^[a-zA-Z0-9_.:/-]+$/)
const base = {
  version: z.literal(1),
  generation: z.string().regex(/^[a-f0-9]{64}$/),
  storyId: identity,
  renderId: z.string().uuid(),
}
export const contextSchema = z
  .object({
    target: z
      .string()
      .regex(/^[a-z-]+$/)
      .max(80),
    variant: z
      .string()
      .regex(/^[a-z-]+$/)
      .max(80),
    parts: z
      .array(
        z
          .string()
          .regex(/^[a-z-]+$/)
          .max(80),
      )
      .max(30),
    states: z.array(z.enum(['default', 'disabled', 'loading', 'error'])).max(4),
  })
  .strict()
export const readySchema = z
  .object({
    ...base,
    contexts: z.array(contextSchema).max(100),
    prepared: z.boolean(),
    sessionId: z.string().uuid().nullable(),
    probeId: z.string().uuid().nullable(),
    error: z.string().max(240).optional(),
  })
  .strict()
const choice = z.discriminatedUnion('kind', [
  z
    .object({
      kind: z.literal('value'),
      value: z.union([z.string().max(160), z.number().finite()]),
    })
    .strict(),
  z.object({ kind: z.literal('style'), style: identity }).strict(),
  z.object({ kind: z.literal('restore') }).strict(),
])
export const requestSchema = z
  .object({
    ...base,
    sessionId: z.string().uuid(),
    sequence: z.number().int().nonnegative(),
    bindingId: identity.nullable(),
    compare: z.boolean(),
    operations: z.array(operationSchema).min(1).max(100).optional(),
    changes: z
      .object({
        local: z.record(identity, choice),
        shared: z.record(identity, z.union([z.string().max(160), z.number().finite()])),
      })
      .strict(),
  })
  .strict()
const contrastSchema = z
  .object({
    status: z.enum(['pass', 'warning', 'unmeasured']),
    ratio: z.number().finite().min(1).max(21.01).optional(),
    minimum: z.number().finite().optional(),
    enhancedMinimum: z.number().finite().optional(),
    editableColor: z
      .string()
      .regex(/^#[a-f\d]{6}$/i)
      .optional(),
    against: z
      .array(z.string().regex(/^#[a-f\d]{6}$/i))
      .min(1)
      .max(8)
      .optional(),
  })
  .strict()
export const appliedSchema = z
  .object({
    ...base,
    sessionId: z.string().uuid(),
    sequence: z.number().int().nonnegative(),
    bindingId: identity.nullable(),
    available: z.boolean(),
    message: z.string().max(400),
    unitContext: z
      .object({
        rootFontPx: z.number().finite().nonnegative(),
        fontPx: z.number().finite().nonnegative(),
        viewportWidth: z.number().finite().positive(),
        viewportHeight: z.number().finite().positive(),
      })
      .strict()
      .optional(),
    contrast: contrastSchema,
    audit: z
      .array(z.object({ bindingId: identity, contrast: contrastSchema }).strict())
      .max(8192)
      .optional(),
  })
  .strict()
export type Ready = z.infer<typeof readySchema>
export type Request = z.infer<typeof requestSchema>
export type Applied = z.infer<typeof appliedSchema>
export type StoryPreparation = { targets: string[] }
export function validateChanges(snapshot: EditorSnapshot, input: Changes): Changes {
  if (
    Object.keys(input.local).length > snapshot.model.bindings.length ||
    Object.keys(input.shared).length > snapshot.model.styles.length
  )
    throw new Error('Budget de brouillon dépassé.')
  let changes = emptyChanges()
  for (const [id, choice] of Object.entries(input.local))
    changes = setLocal(snapshot, changes, id, choice)
  for (const [id, value] of Object.entries(input.shared))
    changes = setShared(snapshot, changes, id, value)
  return changes
}
export function readRequest(
  snapshot: EditorSnapshot,
  input: unknown,
  storyId: string,
  renderId: string,
): Request {
  const request = requestSchema.parse(input)
  if (
    request.generation !== snapshot.generation ||
    request.storyId !== storyId ||
    request.renderId !== renderId
  )
    throw new Error('Ancien contexte.')
  if (request.bindingId) getBinding(snapshot, request.bindingId)
  const candidate = request.operations ? projectTransaction(snapshot, request.operations) : snapshot
  request.changes = validateChanges(candidate, request.changes)
  return request
}
