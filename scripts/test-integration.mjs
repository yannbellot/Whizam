import assert from 'node:assert/strict'
import { randomBytes, randomUUID } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const runId = randomUUID().replaceAll('-', '')
const label = 'org.agentic-design.test'
const databaseName = `adl_test_${runId}`
const password = randomBytes(24).toString('base64url')
let networkId
let containerId
let clientId
let imageId

function docker(args, options = {}) {
  const result = spawnSync('docker', args, { encoding: 'utf8', timeout: 30000, ...options })
  if (result.status !== 0) {
    throw new Error(
      `Docker operation failed (${args[0]}): ${result.stderr || result.error?.message || result.status}`,
    )
  }
  return result.stdout.trim()
}

try {
  const imageTag = `adl-integration-test:${runId}`
  const build = spawnSync(
    'docker',
    [
      'build',
      '--label',
      `${label}=${runId}`,
      '--tag',
      imageTag,
      '--file',
      'config/docker/Dockerfile.integration',
      '.',
    ],
    { cwd: projectRoot, stdio: 'inherit', timeout: 240000 },
  )
  assert.equal(build.status, 0, 'Isolated Linux test image build failed')
  imageId = docker(['image', 'inspect', '--format', '{{.Id}}', imageTag])
  networkId = docker([
    'network',
    'create',
    '--internal',
    '--label',
    `${label}=${runId}`,
    `adl-test-${runId}`,
  ])
  const databaseHost = `adl-postgres-test-${runId}`
  containerId = docker(
    [
      'run',
      '--detach',
      '--name',
      databaseHost,
      '--label',
      `${label}=${runId}`,
      '--network',
      networkId,
      '--memory',
      '512m',
      '--cpus',
      '1',
      '--tmpfs',
      '/var/lib/postgresql:rw,size=256m',
      '--env',
      'POSTGRES_USER=lab_test',
      '--env',
      `POSTGRES_DB=${databaseName}`,
      '--env',
      'POSTGRES_PASSWORD',
      '--env',
      'POSTGRES_INITDB_ARGS=--auth-host=scram-sha-256',
      'postgres:18.6-bookworm',
    ],
    { env: { ...process.env, POSTGRES_PASSWORD: password } },
  )

  const url = `postgresql://lab_test:${password}@${databaseHost}:5432/${databaseName}`
  clientId = docker(
    [
      'create',
      '--name',
      `adl-node-test-${runId}`,
      '--label',
      `${label}=${runId}`,
      '--network',
      networkId,
      '--memory',
      '512m',
      '--cpus',
      '1',
      '--env',
      'ADL_TEST_ISOLATED=1',
      '--env',
      `TEST_DATABASE_NAME=${databaseName}`,
      '--env',
      `TEST_DATABASE_HOST=${databaseHost}`,
      '--env',
      'TEST_DATABASE_URL',
      imageId,
    ],
    { env: { ...process.env, TEST_DATABASE_URL: url } },
  )
  const result = spawnSync('docker', ['start', '--attach', clientId], {
    stdio: 'inherit',
    timeout: 120000,
  })
  if (result.error) throw result.error
  assert.equal(result.status, 0, 'Integration tests failed')
  assert.equal(
    docker(['inspect', '--format', '{{.State.ExitCode}}', clientId]),
    '0',
    'Test container reported a failure',
  )
  console.log('PASS: isolated PostgreSQL integration campaign')
} finally {
  if (clientId) {
    assert.equal(
      docker(['inspect', '--format', `{{index .Config.Labels "${label}"}}`, clientId]),
      runId,
    )
    if (docker(['inspect', '--format', '{{.State.Running}}', clientId]) === 'true')
      docker(['stop', '--time', '5', clientId])
    docker(['rm', clientId])
  }
  if (containerId) {
    assert.equal(
      docker(['inspect', '--format', `{{index .Config.Labels "${label}"}}`, containerId]),
      runId,
    )
    docker(['stop', '--time', '5', containerId])
    docker(['rm', containerId])
  }
  if (networkId) {
    assert.equal(
      docker(['network', 'inspect', '--format', `{{index .Labels "${label}"}}`, networkId]),
      runId,
    )
    docker(['network', 'rm', networkId])
  }
  if (imageId) {
    assert.equal(
      docker(['image', 'inspect', '--format', `{{index .Config.Labels "${label}"}}`, imageId]),
      runId,
    )
    docker(['image', 'rm', imageId])
  }
  console.log('Disposable test resources removed; no pre-existing resource targeted')
}
