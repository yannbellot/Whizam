import { defineConfig } from '@playwright/test'
import process from 'node:process'
import { resolve } from 'node:path'
import base, { kitRoot } from './playwright.config'

const runId = process.env.ADL_E2E_RUN_ID
const databaseUrl = process.env.ADL_PROJECTS_DATABASE_URL
if (
  process.env.ADL_PROJECTS_TEST !== '1' ||
  !runId ||
  !/^[a-f0-9]{32}$/.test(runId) ||
  !databaseUrl
)
  throw new Error('Use npm run test:projects for isolated database ownership')
const target = new URL(databaseUrl)
if (
  target.hostname !== '127.0.0.1' ||
  target.pathname !== `/adl_e2e_${runId}` ||
  target.username !== 'lab_test'
)
  throw new Error('Project test database isolation failed')

export default defineConfig({
  ...base,
  testDir: resolve(kitRoot, 'tests/project-e2e'),
  testMatch: process.env.ADL_E2E_RESTART === '1' ? 'restart.spec.ts' : 'flows.spec.ts',
  reporter: [
    ['list'],
    [
      'json',
      {
        outputFile:
          process.env.ADL_E2E_RESTART === '1'
            ? resolve(kitRoot, 'test-results/project-restart.json')
            : resolve(kitRoot, 'test-results/project-report.json'),
      },
    ],
  ],
  webServer: {
    cwd: kitRoot,
    command: 'npm run build && npm run start',
    url: `${base.use!.baseURL!}/health`,
    reuseExistingServer: false,
    timeout: 60000,
    gracefulShutdown: { signal: 'SIGTERM', timeout: 5000 },
    env: {
      PORT: process.env.ADL_E2E_PORT!,
      HOST: '127.0.0.1',
      ADL_CONTAINER: '',
      DATABASE_URL: databaseUrl,
    },
  },
})
