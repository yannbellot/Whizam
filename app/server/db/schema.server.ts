import { sql } from 'drizzle-orm'
import { check, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

export const projects = pgTable(
  'projects',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    description: text('description').notNull().default(''),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    check('projects_name_nonempty', sql`${table.name} ~ '[^[:space:]]'`),
    check('projects_description_length', sql`char_length(${table.description}) <= 2000`),
  ],
)

export type Project = typeof projects.$inferSelect
