import { asc, desc, eq } from 'drizzle-orm'
import type { Database } from '../../server/db/client.server.ts'
import { createDatabase } from '../../server/db/client.server.ts'
import { projects } from '../../server/db/schema.server.ts'
import type { Project } from '../../server/db/schema.server.ts'
import { projectIdSchema, projectInputSchema } from './project-contract.ts'
import type { ProjectView } from './project-contract.ts'

function view(project: Project): ProjectView {
  return {
    id: project.id,
    name: project.name,
    description: project.description,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
  }
}

export function createProjectRepository(db: Database) {
  return {
    async list() {
      return (
        await db.select().from(projects).orderBy(desc(projects.createdAt), asc(projects.id))
      ).map(view)
    },
    async find(id: string) {
      const [row] = await db
        .select()
        .from(projects)
        .where(eq(projects.id, projectIdSchema.parse(id)))
      return row ? view(row) : undefined
    },
    async create(input: unknown) {
      const [row] = await db.insert(projects).values(projectInputSchema.parse(input)).returning()
      return view(row)
    },
    async update(id: string, input: unknown) {
      const values = projectInputSchema.parse(input)
      const [row] = await db
        .update(projects)
        .set({ ...values, updatedAt: new Date() })
        .where(eq(projects.id, projectIdSchema.parse(id)))
        .returning()
      return row ? view(row) : undefined
    },
  }
}

let runtime: ReturnType<typeof createDatabase> | undefined
export function projectRepository() {
  runtime ??= createDatabase()
  return createProjectRepository(runtime.db)
}
