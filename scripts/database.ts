import process from 'node:process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import { createDatabase } from '../app/server/db/client.server.ts'
import { seedDemoProjects } from '../app/server/db/seed.server.ts'
import { ServerConfigurationError } from '../app/server/env.server.ts'

const operation = process.argv[2]
if (operation !== 'migrate' && operation !== 'seed') {
  throw new Error('Commande attendue : migrate ou seed')
}

let database: ReturnType<typeof createDatabase> | undefined
try {
  database = createDatabase()
  if (operation === 'migrate') {
    await migrate(database.db, {
      migrationsFolder: resolve(dirname(fileURLToPath(import.meta.url)), '../drizzle'),
    })
    console.log('Migrations appliquées.')
  } else {
    console.log(
      `Données initiales : ${await seedDemoProjects(database.db)} ajout(s), aucune donnée existante écrasée.`,
    )
  }
} catch (error) {
  console.error(
    error instanceof ServerConfigurationError
      ? error.message
      : 'Opération de base échouée. Vérifier le service, les accès et la compatibilité du schéma ; contrôler l’état des migrations avant toute reprise.',
  )
  process.exitCode = 1
} finally {
  await database?.connection.end({ timeout: 5 })
}
