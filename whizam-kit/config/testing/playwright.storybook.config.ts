import { defineConfig } from '@playwright/test'
import { resolve } from 'node:path'
import base, { kitRoot } from './playwright.config'

export default defineConfig({
  ...base,
  outputDir: resolve(kitRoot, 'test-results/storybook'),
  projects: [
    { name: 'desktop', use: { viewport: { width: 1280, height: 900 } } },
    { name: 'large-desktop', use: { viewport: { width: 1600, height: 1000 } } },
  ],
  testDir: resolve(kitRoot, 'tests/storybook'),
  reporter: [
    ['list'],
    ['json', { outputFile: resolve(kitRoot, 'test-results/storybook-report.json') }],
  ],
  webServer: {
    cwd: kitRoot,
    command: 'npm run build-storybook && node scripts/serve-storybook.mjs',
    url: base.use!.baseURL!,
    reuseExistingServer: false,
    timeout: 90000,
    gracefulShutdown: { signal: 'SIGTERM', timeout: 5000 },
    env: { DATABASE_URL: '' },
  },
})
