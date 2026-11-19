import { spawn } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import {
  readServerEnvironment,
  readServerHost,
  ServerConfigurationError,
} from '../app/server/env.server.ts'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
try {
  const config = readServerEnvironment({ ...process.env, NODE_ENV: 'production' })
  const host = readServerHost()
  const build = resolve(root, 'build/server/index.js')
  if (!existsSync(build))
    throw new ServerConfigurationError(
      'Build manquant : exécuter npm run build avant npm run start.',
    )
  const packageRoot = resolve(root, 'node_modules/@react-router/serve')
  const { bin } = JSON.parse(readFileSync(resolve(packageRoot, 'package.json'), 'utf8'))
  const child = spawn(process.execPath, [resolve(packageRoot, bin['react-router-serve']), build], {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production', HOST: host, PORT: String(config.PORT) },
  })
  for (const signal of ['SIGINT', 'SIGTERM'] as const) process.on(signal, () => child.kill(signal))
  child.on('error', () => {
    console.error('Démarrage du serveur impossible.')
    process.exitCode = 1
  })
  child.on('exit', (code) => {
    process.exitCode = code ?? 1
  })
} catch (error) {
  console.error(
    error instanceof ServerConfigurationError ? error.message : 'Démarrage du serveur impossible.',
  )
  process.exitCode = 1
}
