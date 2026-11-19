import { drizzle } from 'drizzle-orm/postgres-js'
import process from 'node:process'
import postgres from 'postgres'
import { readDatabaseUrl } from '../env.server.ts'
import * as schema from './schema.server.ts'

export function createDatabase(source: NodeJS.ProcessEnv = process.env) {
  const connection = postgres(readDatabaseUrl(source), {
    max: 5,
    connect_timeout: 5,
    idle_timeout: 20,
  })
  return { db: drizzle(connection, { schema }), connection }
}

export type Database = ReturnType<typeof createDatabase>['db']
