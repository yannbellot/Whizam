import { collectAll } from './documentation.mjs'
import { fileURLToPath } from 'node:url'
const root = fileURLToPath(new URL('..', import.meta.url))
const states = (await collectAll(root)).map(([, state]) => state)
const incomplete = states.flatMap((state) =>
  state.diagnostics.filter((d) => d.locale && d.required !== false),
)
for (const issue of incomplete) console.error(`${issue.reason}: ${issue.file}`)
if (incomplete.length) {
  console.error(
    `${incomplete.length} missing or outdated translations; declared multilingual coverage is not qualified.`,
  )
  process.exitCode = 1
} else console.log('All required published documentation translations are current.')
