import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { toolIdentity } from '../scripts/tool-identity.mjs'
import { recordIntake } from '../scripts/project-intake.mjs'
test('tool identity follows the recorded project name and rename', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'whizam-identity-'))
  try {
    await mkdir(path.join(root, 'docs/product'), { recursive: true })
    await writeFile(path.join(root, 'docs/product/brief.md'), '# Brief')
    await writeFile(path.join(root, 'docs/project-state.md'), '# State')
    assert.equal(await toolIdentity(root), 'Kit Whizam')
    for (const name of ['Atlas', 'Équipe <script> & projet long']) {
      await recordIntake(root, {
        answers: [{ id: 'q1', value: name, status: 'provided', origin: 'user' }],
      })
      assert.equal(await toolIdentity(root), name)
    }
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
