import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  schema: './app/server/db/schema.server.ts',
  out: './drizzle',
})
