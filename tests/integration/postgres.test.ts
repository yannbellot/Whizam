import process from 'node:process'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { setTimeout as delay } from 'node:timers/promises'
import { beforeAll, afterAll, describe, expect, it } from 'vitest'
import { eq, sql } from 'drizzle-orm'
import { createDatabase } from '../../app/server/db/client.server.ts'
import { projects } from '../../app/server/db/schema.server.ts'
import { seedDemoProjects } from '../../app/server/db/seed.server.ts'
import { createProjectRepository } from '../../app/features/projects/project-repository.server.ts'

const databaseUrl = process.env.TEST_DATABASE_URL
if (process.env.ADL_TEST_ISOLATED !== '1' || !databaseUrl) {
  throw new Error('Use npm run test:integration to provision an isolated database')
}
const target = new URL(databaseUrl)
const databaseName = target.pathname.slice(1)
if (
  !/^adl_test_[a-f0-9]{32}$/.test(databaseName) ||
  target.pathname !== `/${process.env.TEST_DATABASE_NAME}` ||
  target.hostname !== `adl-postgres-test-${databaseName.slice('adl_test_'.length)}` ||
  target.hostname !== process.env.TEST_DATABASE_HOST
) {
  throw new Error('Test database isolation is not demonstrated')
}
const database = createDatabase({ DATABASE_URL: databaseUrl })

function runDatabaseCommand(operation: 'migrate' | 'seed') {
  const result = spawnSync(
    process.execPath,
    [fileURLToPath(new URL('../../scripts/database.ts', import.meta.url)), operation],
    {
      cwd: fileURLToPath(new URL('../../', import.meta.url)),
      env: { ...process.env, DATABASE_URL: databaseUrl },
      encoding: 'utf8',
      timeout: 15000,
    },
  )
  expect(result.status, result.stderr).toBe(0)
  return result.stdout
}

beforeAll(async () => {
  const deadline = Date.now() + 20000
  while (true) {
    try {
      await database.connection`select 1`
      break
    } catch {
      if (Date.now() >= deadline) throw new Error('Disposable PostgreSQL did not become ready')
      await delay(250)
    }
  }
  const [version] = await database.connection`show server_version`
  expect(version.server_version).toMatch(/^18\.6/)
  const [empty] = await database.connection`select to_regclass('public.projects') as name`
  expect(empty.name).toBeNull()
  expect(runDatabaseCommand('migrate')).toContain('Migrations appliquées')
  expect(runDatabaseCommand('migrate')).toContain('Migrations appliquées')
})

afterAll(async () => {
  await database.connection.end({ timeout: 5 })
})

describe('real PostgreSQL persistence', () => {
  it('keeps the initial database empty and preserves existing records on seed', async () => {
    expect(await seedDemoProjects(database.db)).toBe(0)
    expect(await database.db.select().from(projects)).toHaveLength(0)
    await database.db
      .insert(projects)
      .values({ id: '11111111-1111-4111-8111-111111111111', name: 'Modification synthétique' })
    expect(await seedDemoProjects(database.db)).toBe(0)
    expect(await database.db.select().from(projects)).toHaveLength(1)
  })

  it('writes and reads a generated identifier, defaults and timestamps', async () => {
    const [created] = await database.db
      .insert(projects)
      .values({ name: 'Projet synthétique' })
      .returning()
    expect(created.id).toMatch(/^[0-9a-f-]{36}$/)
    expect(created.description).toBe('')
    expect(created.createdAt).toBeInstanceOf(Date)
    const [read] = await database.db.select().from(projects).where(eq(projects.id, created.id))
    expect(read.name).toBe('Projet synthétique')
  })

  it.each(['', '   ', '\t\n'])(
    'rejects an empty name at the database boundary: %j',
    async (name) => {
      await expect(database.db.insert(projects).values({ name })).rejects.toMatchObject({
        cause: { code: '23514' },
      })
    },
  )

  it('rejects names longer than 100 characters', async () => {
    await expect(
      database.db.insert(projects).values({ name: 'x'.repeat(101) }),
    ).rejects.toMatchObject({ cause: { code: '22001' } })
  })

  it('rejects descriptions longer than 2000 characters', async () => {
    await expect(
      database.db.insert(projects).values({ name: 'Limite', description: 'x'.repeat(2001) }),
    ).rejects.toMatchObject({ cause: { code: '23514' } })
  })

  it('keeps SQL-like input as data and preserves the table', async () => {
    const name = "fixture'); DROP TABLE projects;--"
    const [created] = await database.db.insert(projects).values({ name }).returning()
    expect(created.name).toBe(name)
    const [{ count }] = await database.db
      .select({ count: sql<number>`count(*)::int` })
      .from(projects)
    expect(count).toBeGreaterThanOrEqual(1)
  })

  it('rolls back an interrupted transaction', async () => {
    const name = 'Transaction annulée'
    await expect(
      database.db.transaction(async (transaction) => {
        await transaction.insert(projects).values({ name })
        throw new Error('fixture rollback')
      }),
    ).rejects.toThrow('fixture rollback')
    expect(await database.db.select().from(projects).where(eq(projects.name, name))).toHaveLength(0)
  })

  it('runs the seed command through native Node TypeScript without overwriting data', async () => {
    expect(runDatabaseCommand('seed')).toContain('0 ajout(s)')
    const [preserved] = await database.db
      .select()
      .from(projects)
      .where(eq(projects.id, '11111111-1111-4111-8111-111111111111'))
    expect(preserved.name).toBe('Modification synthétique')
  })

  it('reports an unavailable isolated database without leaking the connection value', () => {
    const unavailable = new URL(databaseUrl)
    unavailable.pathname = '/adl_missing_fixture'
    const result = spawnSync(
      process.execPath,
      [fileURLToPath(new URL('../../scripts/database.ts', import.meta.url)), 'migrate'],
      {
        cwd: fileURLToPath(new URL('../../', import.meta.url)),
        env: { ...process.env, DATABASE_URL: unavailable.href },
        encoding: 'utf8',
        timeout: 15000,
      },
    )
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('Opération de base échouée')
    // Boolean assertions avoid printing even ephemeral credentials on failure.
    expect(result.stderr.includes(unavailable.href)).toBe(false)
    expect(result.stderr.includes(unavailable.password)).toBe(false)
  })

  it('creates, reads and updates through the validated project repository', async () => {
    const repository = createProjectRepository(database.db)
    const created = await repository.create({
      name: '  Projet métier fictif  ',
      description: ' <b>Texte littéral</b> ',
    })
    expect(created.name).toBe('Projet métier fictif')
    expect(created.description).toBe('<b>Texte littéral</b>')
    expect(await repository.find(created.id)).toEqual(created)
    await delay(10)
    const updated = await repository.update(created.id, {
      name: 'Modification métier',
      description: '',
    })
    expect(updated?.id).toBe(created.id)
    expect(updated?.createdAt).toBe(created.createdAt)
    expect(updated?.name).toBe('Modification métier')
    expect(new Date(updated!.updatedAt).getTime()).toBeGreaterThanOrEqual(
      new Date(created.createdAt).getTime(),
    )
    expect(await repository.find(created.id)).toEqual(updated)
  })

  it('reports absence and rejects invalid repository input without a write', async () => {
    const repository = createProjectRepository(database.db)
    const missing = '99999999-9999-4999-8999-999999999999'
    expect(await repository.find(missing)).toBeUndefined()
    expect(await repository.update(missing, { name: 'Absent', description: '' })).toBeUndefined()
    const before = (await repository.list()).length
    await expect(repository.create({ name: ' ', description: '' })).rejects.toThrow()
    await expect(
      repository.create({ name: 'Valid', description: '', id: missing }),
    ).rejects.toThrow()
    expect((await repository.list()).length).toBe(before)
  })

  it('lists projects in deterministic creation and identifier order', async () => {
    const repository = createProjectRepository(database.db)
    const rows = await repository.list()
    const sorted = [...rows].sort(
      (a, b) => b.createdAt.localeCompare(a.createdAt) || a.id.localeCompare(b.id),
    )
    expect(rows).toEqual(sorted)
  })
})
