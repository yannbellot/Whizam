import { randomBytes } from 'node:crypto'
import { open } from 'node:fs/promises'
import { createServer } from 'node:net'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const output = resolve(root, '.env.local')
const port = () =>
  new Promise((resolvePort, reject) => {
    const server = createServer()
    server.once('error', reject)
    server.listen(0, '127.0.0.1', () => {
      const address = server.address()
      const value = typeof address === 'object' && address ? address.port : undefined
      server.close((error) => (error ? reject(error) : resolvePort(value)))
    })
  })

try {
  const appPort = await port()
  let dbPort = await port()
  while (dbPort === appPort) dbPort = await port()
  const password = randomBytes(24).toString('base64url')
  const file = await open(output, 'wx', 0o600)
  try {
    await file.writeFile(
      [
        `COMPOSE_PROJECT_NAME=adl-${randomBytes(6).toString('hex')}`,
        `APP_PORT=${appPort}`,
        `DB_PORT=${dbPort}`,
        'POSTGRES_DB=agentic_design',
        'POSTGRES_USER=agentic_lab',
        `POSTGRES_PASSWORD=${password}`,
        `DATABASE_URL=postgresql://agentic_lab:${password}@127.0.0.1:${dbPort}/agentic_design`,
        'SEED_DEMO_DATA=true',
        '',
      ].join('\n'),
    )
    console.log(
      `Configuration locale créée, secret non affiché. URL Compose : http://127.0.0.1:${appPort}`,
    )
  } finally {
    await file.close()
  }
} catch (error) {
  if (error && typeof error === 'object' && 'code' in error && error.code === 'EEXIST') {
    console.log('Configuration .env.local déjà présente ; aucun écrasement.')
  } else {
    console.error('Création de la configuration impossible ; vérifier droits et ports locaux.')
    process.exitCode = 1
  }
}
