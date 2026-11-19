import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { designSystemPlugin } from '../scripts/design-system-plugin'
import { sourceServer } from '../scripts/vite-source-boundary'

// Read-only publication barrier shared with the application; no editor service.

export default defineConfig({
  server: sourceServer(new URL('..', import.meta.url)),
  plugins: [tailwindcss(), designSystemPlugin()],
})
