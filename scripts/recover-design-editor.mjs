import { fileURLToPath } from 'node:url'
import { createStore } from './design-editor/store.mjs'
const root = fileURLToPath(new URL('..', import.meta.url))
const args = process.argv.slice(2)
if (
  args.length &&
  !(
    args.length === 2 &&
    args[0] === '--cancel' &&
    /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(args[1])
  )
)
  throw new Error('Usage: recover-design-editor.mjs [--cancel requestId]')
const store = await createStore(root, { cancelRequest: args[1] ?? null })
try {
  console.log('Récupération terminée ; génération complète disponible.')
} finally {
  await store.close()
}
