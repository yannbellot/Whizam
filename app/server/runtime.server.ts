import { readServerEnvironment } from './env.server'

export function getHealth() {
  readServerEnvironment()
  return { status: 'ok' as const }
}
