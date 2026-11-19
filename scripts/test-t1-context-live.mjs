// Live opt-in qualification: dedicated Loomata account, synthetic project and isolated chat history.
import fs from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { fixture, chatFixture } from '../tests/helpers/workspace.mjs'
import { contextControl } from './agent-chat/context-control.mjs'
import { CodexProvider } from './agent-chat/provider.mjs'
import { installCodex } from './agent-chat/install.mjs'
import { stateDirectory } from './agent-chat/private.mjs'
if (process.argv[2] !== '--live') throw new Error('Explicit --live required')
const cleanup = [],
  t = { after: (f) => cleanup.push(f) }
const tool = path.resolve(
  process.env.LOOMATA_DEDICATED_TOOL ?? path.resolve(import.meta.dirname, '..'),
)
const dedicated = await stateDirectory(tool)
const configuration = path.join(dedicated, 'codex/config.toml')
const previous = await fs.readFile(configuration).catch((e) => {
  if (e.code === 'ENOENT') return null
  throw e
})
const report = { version: 1, cases: [], status: 'running' }
async function until(condition, label, timeout = 90000) {
  const limit = Date.now() + timeout
  while (!condition()) {
    if (Date.now() > limit) throw new Error('Live timeout: ' + label)
    await new Promise((r) => setTimeout(r, 100))
  }
}
try {
  const f = await fixture(t)
  const binary = await installCodex(dedicated)
  const c = await chatFixture(t, f, (o) => new CodexProvider({ ...o, binary, state: dedicated }))
  // install() is overridden by providerFactory; no authentication is copied into the test history.
  const command = (command, payload = {}) =>
    contextControl(c.manager, {
      operation: 'context',
      root: f.root,
      treeId: f.treeId,
      command,
      payload,
    })
  const conversation = (await command('new', { entityId: f.target })).conversation
  if ((await command('new', { entityId: f.target })).conversation !== conversation)
    throw new Error('Contextual conversation duplicated')
  if (!c.manager.connected) throw new Error('Dedicated Loomata account is not connected')
  report.cases.push('dedicated official account connected; private test history isolated')
  await command('send', {
    conversation,
    text: 'Qualification synthétique. Propose de remplacer uniquement page.txt par le texte exact WORKSPACE_LIVE_VERIFIED. Ne lance aucun autre outil. Utilise une action write avec reason « Qualification synthétique ».',
    requestId: randomUUID(),
  })
  await until(
    () => c.manager.approvals.size || (!c.manager.turn && c.manager.lastError),
    'write proposal',
  )
  const approval = [...c.manager.approvals.values()][0]
  if (
    approval.proposal.file !== 'page.txt' ||
    approval.proposal.text.trim() !== 'WORKSPACE_LIVE_VERIFIED'
  )
    throw new Error('Unexpected live proposal')
  await command('approve', { id: approval.id, decision: 'approve' })
  await until(() => !c.manager.turn, 'completion')
  if (
    (await fs.readFile(path.join(f.store.treeRoot(f.treeId), 'page.txt'), 'utf8')).trim() !==
    'WORKSPACE_LIVE_VERIFIED'
  )
    throw new Error('Draft not updated')
  if ((await fs.readFile(path.join(f.root, 'page.txt'), 'utf8')) !== 'original')
    throw new Error('Main changed')
  report.cases.push(
    'real contextual proposal approved through the finite shared control; main preserved',
  )
  const tree = (await f.store.snapshot()).trees.find((t) => t.id === f.treeId)
  await f.store.apply(f.treeId, {
    id: randomUUID(),
    revision: tree.revision,
    origin: 'inspector',
    targets: [f.target],
    edits: [],
    entities: tree.entities.map((e) =>
      e.id === f.target ? { ...e, label: 'Renamed real context' } : e,
    ),
  })
  const fresh = await command('snapshot')
  if (
    (await command('new', { entityId: f.target })).conversation !== conversation ||
    fresh.conversations.find((c) => c.id === conversation)?.title !== 'Renamed real context'
  )
    throw new Error('Rename lost conversation identity')
  report.cases.push(
    'same element conversation returned by micro-chat and Agents after an inspector rename',
  )
  const beforeQuestion = (await f.store.snapshot()).trees.find((t) => t.id === f.treeId).revision
  await command('send', {
    conversation,
    requestId: randomUUID(),
    text: 'Pour cette qualification, pose exactement la question « Quelle couleur souhaitez-vous pour ce bouton ? » dans ton message, puis attends ma réponse. Ne propose aucune écriture.',
  })
  await until(() => !c.manager.turn, 'real clarification question')
  if (
    !c.manager.index.conversations
      .find((r) => r.id === conversation)
      .messages.some(
        (m) =>
          m.role === 'assistant' && m.text.includes('Quelle couleur souhaitez-vous pour ce bouton'),
      )
  )
    throw new Error('Expected clarification question absent')
  if (
    c.manager.approvals.size ||
    (await f.store.snapshot()).trees.find((t) => t.id === f.treeId).revision !== beforeQuestion
  )
    throw new Error('Question unexpectedly changed sources')
  await command('send', {
    conversation,
    requestId: randomUUID(),
    text: 'Bleu. Confirme ma réponse sans proposer ni modifier aucun fichier.',
  })
  await until(() => !c.manager.turn, 'answer to real question')
  report.cases.push(
    'real contextual question and explicit user answer preserved in the same thread without source mutation',
  )

  await command('send', {
    conversation,
    text: 'Explique longuement les étapes de revue de ce projet synthétique, sans modifier de fichier.',
    requestId: randomUUID(),
  })
  await command('interrupt')
  if (c.manager.turn || c.manager.approvals.size) throw new Error('Interruption incomplete')
  report.cases.push('real turn interrupted without pending approval or duplicate write')
  await command('send', {
    conversation,
    text: 'Réponds uniquement : reprise confirmée. Ne modifie rien.',
    requestId: randomUUID(),
  })
  await until(() => !c.manager.turn, 'resume')
  if (c.manager.index.conversations.find((r) => r.id === conversation).status !== 'completed')
    throw new Error('Resume failed')
  report.cases.push('same official thread resumed after interruption')
  report.status = 'passed'
} catch (error) {
  report.status = 'failed'
  report.error = error.message
  process.exitCode = 1
} finally {
  for (const dispose of cleanup.reverse()) await dispose()
  if (previous) await fs.writeFile(configuration, previous, { mode: 0o600 })
  const output = path.resolve(import.meta.dirname, '../test-results/t1-context-live.json')
  await fs.writeFile(output, JSON.stringify(report, null, 2) + '\n')
  console.log(JSON.stringify(report))
}
