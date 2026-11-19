import type { Database } from './client.server.ts'

// Kit vierge : aucune donnée initiale, aucune écriture sur une base existante.
export async function seedDemoProjects(_db: Database) {
  void _db
  return 0
}
