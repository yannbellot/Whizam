import { z } from 'zod'
export type EditorHost = {
  capability: () => string | null
  request: (action: string, body: unknown) => Promise<Response>
}
let editorHost: EditorHost | null = null
/** Install only after client mount; disposal restores the previous host. */
export function configureEditorHost(host: EditorHost) {
  const previous = editorHost
  editorHost = host
  return () => {
    if (editorHost === host) editorHost = previous
  }
}
export function editorCapability(): string | null {
  return editorHost?.capability() ?? null
}
export async function editorFetch(
  action:
    | 'fonts/import'
    | 'version'
    | 'snapshot'
    | 'save'
    | 'status'
    | `agent/${'status' | 'connect' | 'disconnect' | 'analyze' | 'answer' | 'interpret'}`,
  body: unknown,
): Promise<Response> {
  if (!editorHost) throw new Error('Enregistrement indisponible dans cette vue.')
  return editorHost.request(action, body)
}

export const editorResponseSchema = z
  .object({
    status: z.enum([
      'saved',
      'invalid',
      'conflict',
      'failed',
      'recovery-required',
      'pending',
      'unknown',
    ]),
    requestId: z.string().uuid().optional(),
    revision: z
      .string()
      .regex(/^[a-f0-9]{64}$/)
      .optional(),
    issues: z
      .array(
        z
          .object({
            code: z.enum([
              'schema-invalid',
              'invalid-value',
              'unknown-reference',
              'incompatible-style',
              'incompatible-intention',
              'style-exists',
              'duplicate-id',
              'id-collision',
              'forbidden-cycle',
              'css-collision',
              'revision-conflict',
              'request-id-reused',
              'recovery-required',
              'write-failed',
              'service-unavailable',
              'forbidden',
              'budget-exceeded',
              'unsupported-format',
              'method-not-allowed',
            ]),
            message: z.string().min(1).max(400),
            target: z.string().max(240).optional(),
            style: z.string().max(240).optional(),
          })
          .strict(),
      )
      .min(1)
      .max(100)
      .optional(),
  })
  .strict()
  .superRefine((value, context) => {
    if (value.status !== 'invalid' && !value.requestId)
      context.addIssue({ code: 'custom', message: 'Identifiant absent.' })
    if (value.status === 'saved' && (!value.revision || value.issues))
      context.addIssue({ code: 'custom', message: 'Reçu incomplet.' })
    if (
      ['invalid', 'conflict', 'failed', 'recovery-required'].includes(value.status) &&
      !value.issues
    )
      context.addIssue({ code: 'custom', message: 'Diagnostic absent.' })
  })
export async function editorResponse(response: Response) {
  const text = await response.text()
  if (text.length > 65536) throw new Error('Réponse trop volumineuse.')
  return editorResponseSchema.parse(JSON.parse(text))
}
