import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { globalSettings } from 'storybook/internal/cli'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const settings = resolve(root, '.runtime.local/storybook/settings.json')
mkdirSync(dirname(settings), { recursive: true })
// The pinned CLI caches this explicit settings instance before its default initialization.
await globalSettings(settings)
// Storybook is documentary even if launched with stale editor environment variables.
for (const name of [
  'ADL_DESIGN_EDITOR_SESSION',
  'ADL_DESIGN_EDITOR_ORIGIN',
  'ADL_DESIGN_EDITOR_ROOT',
  'ADL_UI_EDITOR',
])
  delete process.env[name]
await import('storybook/internal/bin/dispatcher')
