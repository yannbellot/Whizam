import { fileURLToPath } from 'node:url'
import { synchronize, recoverGeneration } from './design-system.mjs'
const args = process.argv.slice(2)
if (args.some((a) => !['--check', '--check-docs', '--recover'].includes(a)))
  throw new Error('Unknown generation option')
const root = fileURLToPath(new URL('..', import.meta.url))
if (args.includes('--recover') && args.length > 1)
  throw new Error('Recovery is a separate operation')
const result = args.includes('--recover')
  ? await recoverGeneration(root)
  : await synchronize(root, { check: args.length > 0 })
console.log(
  `Design system: ${result.count} tokens, ${result.outputs} outputs; ${args.length ? 'current' : 'synchronized'}`,
)
