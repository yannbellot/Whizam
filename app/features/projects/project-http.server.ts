import { projectIdSchema, projectInputSchema } from './project-contract.ts'

export function assertLocalRequest(request: Request) {
  const url = new URL(request.url)
  if (!['127.0.0.1', 'localhost'].includes(url.hostname)) {
    throw new Response('Requête locale requise.', { status: 403 })
  }
}

export function parseProjectId(id: unknown) {
  const result = projectIdSchema.safeParse(id)
  if (!result.success) throw new Response('Identifiant invalide.', { status: 400 })
  return result.data
}

export async function readProjectForm(request: Request) {
  assertLocalRequest(request)
  if (request.method !== 'POST')
    throw new Response('Méthode refusée.', { status: 405, headers: { Allow: 'POST' } })
  if (
    request.headers.get('origin') !== new URL(request.url).origin ||
    request.headers.get('sec-fetch-site') === 'cross-site'
  ) {
    throw new Response('Origine refusée.', { status: 403 })
  }
  if (
    request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !==
    'application/x-www-form-urlencoded'
  ) {
    throw new Response('Format refusé.', { status: 415 })
  }
  const declaredSize = Number(request.headers.get('content-length'))
  if (Number.isFinite(declaredSize) && declaredSize > 16384) {
    throw new Response('Formulaire trop volumineux.', {
      status: 413,
      headers: { Connection: 'close' },
    })
  }
  const reader = request.body?.getReader()
  const chunks: Uint8Array[] = []
  let size = 0
  if (reader) {
    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        size += value.byteLength
        if (size > 16384) {
          throw new Response('Formulaire trop volumineux.', {
            status: 413,
            headers: { Connection: 'close' },
          })
        }
        chunks.push(value)
      }
    } finally {
      reader.releaseLock()
    }
  }
  const body = new Uint8Array(size)
  let offset = 0
  for (const chunk of chunks) {
    body.set(chunk, offset)
    offset += chunk.byteLength
  }
  let text: string
  try {
    text = new TextDecoder('utf-8', { fatal: true }).decode(body)
  } catch {
    throw new Response('Formulaire invalide.', { status: 400 })
  }
  const fields = new URLSearchParams(text)
  const seen = new Set<string>()
  for (const key of fields.keys()) {
    if (!['name', 'description'].includes(key) || seen.has(key))
      throw new Response('Champs invalides.', { status: 400 })
    seen.add(key)
  }
  const values = { name: fields.get('name') ?? '', description: fields.get('description') ?? '' }
  const parsed = projectInputSchema.safeParse(values)
  const errors = parsed.success
    ? {}
    : Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).map(([key, messages]) => [
          key,
          messages?.[0],
        ]),
      )
  return { values, parsed, errors }
}

export const projectResponseHeaders = { 'Cache-Control': 'no-store' }
