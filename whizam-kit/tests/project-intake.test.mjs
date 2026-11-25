import { test } from 'node:test'
import assert from 'node:assert/strict'
import * as fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { readIntake, recordIntake } from '../scripts/project-intake.mjs'
async function fixture(t) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'whizam-intake-'))
  t.after(() => fs.rm(root, { recursive: true, force: true }))
  await fs.mkdir(path.join(root, 'docs/product'), { recursive: true })
  await fs.writeFile(path.join(root, 'docs/product/brief.md'), '# Brief existant\n\nÀ préserver.\n')
  await fs.writeFile(path.join(root, 'docs/project-state.md'), '# Suivi existant\n\nÀ préserver.\n')
  return root
}
test('answers survive new readers and relocation, with arbitrary text preserved safely', async (t) => {
  const root = await fixture(t)
  const value = 'Nom ```json\n<!-- /whizam-intake -->\n~~~ <img src=x> $(command)'
  await recordIntake(root, {
    welcomeShown: true,
    answers: [{ id: 'q1', value, status: 'provided', origin: 'user' }],
    pending: 'q2',
  })
  await recordIntake(root, {
    answers: [{ id: 'q2', value: 'À proposer', status: 'proposed', origin: 'assistant' }],
    pending: 'q3',
  })
  const moved = root + '-renamed'
  await fs.rename(root, moved)
  t.after(() => fs.rm(moved, { recursive: true, force: true }))
  const state = await readIntake(moved)
  assert.equal(state.answers.q1.value, value)
  assert.equal(state.welcomeShown, true)
  assert.equal(state.pending, 'q3')
  assert.match(
    await fs.readFile(path.join(moved, 'docs/product/brief.md'), 'utf8'),
    /# Brief existant/,
  )
  const progress = await fs.readFile(path.join(moved, 'docs/project-state.md'), 'utf8')
  assert.match(progress, /# Suivi existant/)
  assert.doesNotMatch(progress, /Nom ```json/)
})
test('invalid answers and damaged state are not overwritten', async (t) => {
  const root = await fixture(t)
  await assert.rejects(
    recordIntake(root, {
      answers: [{ id: 'q99', value: 'bad', status: 'provided', origin: 'user' }],
    }),
    /Invalid/,
  )
  const file = path.join(root, 'docs/product/brief.md')
  const damaged = '<!-- whizam-intake:v1 -->\ninvalid'
  await fs.writeFile(file, damaged)
  await assert.rejects(recordIntake(root, { pending: 'q1' }), /Invalid/)
  assert.equal(await fs.readFile(file, 'utf8'), damaged)
})
test('symlink targets and concurrent writes are refused', async (t) => {
  const root = await fixture(t),
    file = path.join(root, 'docs/product/brief.md')
  await fs.mkdir(path.join(root, 'docs/product/.intake.lock'))
  await assert.rejects(recordIntake(root, { pending: 'q1' }), /active or interrupted/)
  await fs.rmdir(path.join(root, 'docs/product/.intake.lock'))
  await fs.rename(file, file + '.original')
  await fs.symlink(file + '.original', file)
  await assert.rejects(recordIntake(root, { pending: 'q1' }), /symlink/)
})

test('standalone CLI saves and resumes in a fresh process without installed dependencies', async (t) => {
  const { spawnSync } = await import('node:child_process')
  const { fileURLToPath } = await import('node:url')
  const root = await fixture(t)
  await fs.mkdir(path.join(root, 'scripts'))
  const script = path.join(root, 'scripts/project-intake.mjs')
  await fs.copyFile(
    fileURLToPath(new URL('../scripts/project-intake.mjs', import.meta.url)),
    script,
  )
  const input = path.join(root, 'event.json')
  await fs.writeFile(
    input,
    JSON.stringify({
      welcomeShown: true,
      answers: [
        { id: 'q6.computer', value: 'Oui', status: 'provided', origin: 'user' },
        { id: 'q8', value: 'Q7 Non', status: 'skipped', origin: 'branch' },
      ],
      pending: 'q6.tablet',
    }),
  )
  const event = JSON.parse(await fs.readFile(input, 'utf8'))
  event.answers.push({ id: 'verification', value: 'Manuel', status: 'provided', origin: 'user' })
  await fs.writeFile(input, JSON.stringify(event))
  event.answers.push({
    id: 'q6.platforms',
    value: 'Formats personnalisés',
    status: 'provided',
    origin: 'user',
  })
  event.answers.push({ id: 'q6.other', value: 'Borne tactile', status: 'provided', origin: 'user' })
  await fs.writeFile(input, JSON.stringify(event))
  const write = spawnSync(process.execPath, [script, 'record', input], {
    cwd: root,
    encoding: 'utf8',
  })
  assert.equal(write.status, 0, write.stderr)
  const read = spawnSync(process.execPath, [script, 'show'], { cwd: root, encoding: 'utf8' })
  assert.equal(read.status, 0, read.stderr)
  const saved = JSON.parse(read.stdout)
  assert.equal(saved.welcomeShown, true)
  assert.equal(saved.answers.verification.value, 'Manuel')
  assert.equal(saved.answers['q6.other'].value, 'Borne tactile')
  assert.equal(saved.answers['q6.platforms'].value, 'Formats personnalisés')
  assert.equal(saved.answers['q6.computer'].value, 'Oui')
  assert.equal(saved.answers.q8.status, 'skipped')
  assert.equal(saved.answers.q8.origin, 'branch')
  assert.equal(saved.pending, 'q6.tablet')
  assert.equal(saved.answers['q6.tablet'], undefined)
})

test('GitHub choices persist without changing the previous framing or implying authorization', async (t) => {
  const root = await fixture(t)
  await recordIntake(root, {
    answers: [{ id: 'q10', value: 'Français', status: 'provided', origin: 'user' }],
    pending: 'github.repository',
  })
  await recordIntake(root, {
    answers: [{ id: 'github.repository', value: 'existing', status: 'provided', origin: 'user' }],
    pending: 'github.sync',
  })
  await recordIntake(root, {
    answers: [{ id: 'github.sync', value: 'on-demand', status: 'provided', origin: 'user' }],
    pending: 'verification',
  })
  const saved = await readIntake(root)
  assert.equal(saved.answers.q10.value, 'Français')
  assert.equal(saved.answers['github.sync'].value, 'on-demand')
  assert.equal(saved.answers.approval, undefined)
  await assert.rejects(
    recordIntake(root, {
      answers: [{ id: 'github.sync', value: 'fake-token', status: 'provided', origin: 'user' }],
    }),
    /Invalid/,
  )
  assert.deepEqual(await readIntake(root), saved)
})
