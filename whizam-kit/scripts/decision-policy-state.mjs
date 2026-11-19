import { lstat } from 'node:fs/promises'
import path from 'node:path'
export const migrationMarker = '.decision-policy-incomplete'
export async function assertDecisionMigrationComplete(root) {
  try {
    await lstat(path.join(root, migrationMarker))
  } catch (error) {
    if (error.code === 'ENOENT') return
    throw error
  }
  throw new Error('recovery-required')
}
