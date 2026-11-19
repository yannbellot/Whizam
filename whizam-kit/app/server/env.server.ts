import process from 'node:process'
import { z } from 'zod'

const serverEnvironment = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
})

export class ServerConfigurationError extends Error {}

export function readServerHost(source: NodeJS.ProcessEnv = process.env) {
  const host = source.HOST || '127.0.0.1'
  if (host !== '127.0.0.1' && !(host === '0.0.0.0' && source.ADL_CONTAINER === '1')) {
    throw new ServerConfigurationError(
      'Configuration serveur invalide : HOST doit rester local hors conteneur.',
    )
  }
  return host
}

export function readServerEnvironment(source: NodeJS.ProcessEnv = process.env) {
  const result = serverEnvironment.safeParse({
    NODE_ENV: source.NODE_ENV,
    PORT: source.PORT,
  })

  if (!result.success) {
    const fields = [...new Set(result.error.issues.map((issue) => issue.path.join('.')))]
    throw new ServerConfigurationError(`Configuration serveur invalide : ${fields.join(', ')}`)
  }

  return result.data
}

export function readDatabaseUrl(source: NodeJS.ProcessEnv = process.env) {
  const result = z
    .url()
    .refine((value) => {
      try {
        const url = new URL(value)
        return (
          (url.protocol === 'postgres:' || url.protocol === 'postgresql:') &&
          Boolean(url.hostname && url.username && url.password && url.pathname.length > 1)
        )
      } catch {
        return false
      }
    })
    .safeParse(source.DATABASE_URL)

  if (!result.success) {
    throw new ServerConfigurationError(
      'Configuration serveur invalide : DATABASE_URL manquante ou invalide',
    )
  }
  return result.data
}
