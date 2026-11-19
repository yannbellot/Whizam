import { fileURLToPath } from 'node:url'
import { prepare } from './design-system.mjs'
export async function validateDesignSystem(root = fileURLToPath(new URL('..', import.meta.url))) {
  await prepare(root)
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await validateDesignSystem()
  console.log('Design system sources and documentation coverage valid')
}
