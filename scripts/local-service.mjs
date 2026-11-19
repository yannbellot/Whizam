import { runLocalService } from './core/local-service.mjs'
import { fileURLToPath } from 'node:url'
const [operation, root = fileURLToPath(new URL('..', import.meta.url)), payload, ...extra] =
  process.argv.slice(2)
if (extra.length)
  throw new Error('Usage: local-service.mjs operation [project-directory] [options-json]')
runLocalService(operation, {
  root,
  options: payload === undefined ? undefined : JSON.parse(payload),
}).then(
  (result) => console.log(JSON.stringify(result)),
  (error) => {
    console.error(error.message)
    process.exitCode = 1
  },
)
