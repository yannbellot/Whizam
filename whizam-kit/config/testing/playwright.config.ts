import { defineConfig } from '@playwright/test'
import process from 'node:process'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const kitRoot = fileURLToPath(new URL('../..', import.meta.url))

const port = Number(process.env.ADL_E2E_PORT)
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('Use npm run test:e2e to allocate an isolated local port')
}
const baseURL = `http://127.0.0.1:${port}`

export default defineConfig({
  testDir: resolve(kitRoot, 'tests/e2e'),
  outputDir: resolve(kitRoot, 'test-results'),
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list'], ['json', { outputFile: resolve(kitRoot, 'test-results/report.json') }]],
  use: {
    baseURL,
    browserName: 'chromium',
    channel: 'chromium',
    headless: true,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1280, height: 800 } } },
    { name: 'mobile', use: { viewport: { width: 390, height: 844 } } },
  ],
  webServer: {
    cwd: kitRoot,
    command: 'npm run build && npm run start',
    url: `${baseURL}/health`,
    reuseExistingServer: false,
    timeout: 60000,
    gracefulShutdown: { signal: 'SIGTERM', timeout: 5000 },
    env: { PORT: String(port), HOST: '127.0.0.1', ADL_CONTAINER: '', DATABASE_URL: '' },
  },
})
