import { expect, it } from 'vitest'
import type { Database } from '../../app/server/db/client.server'
import { seedDemoProjects } from '../../app/server/db/seed.server'

it('does not access the database or insert initial content', async () => {
  const forbidden = new Proxy(
    {},
    {
      get() {
        throw new Error('Database access forbidden')
      },
    },
  )
  expect(await seedDemoProjects(forbidden as Database)).toBe(0)
  expect(await seedDemoProjects(forbidden as Database)).toBe(0)
})
