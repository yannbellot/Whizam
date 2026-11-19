// Live opt-in qualification: dedicated Loomata account, synthetic project and isolated chat history.
import fs from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { fixture, chatFixture } from '../tests/helpers/workspace.mjs'
import { CodexProvider } from './agent-chat/provider.mjs'
import { installCodex } from './agent-chat/install.mjs'
import { stateDirectory } from './agent-chat/private.mjs'
if (process.argv[2] !== '--live') throw new Error('Explicit --live required')
const cleanup = [],
  t = { after: (f) => cleanup.push(f) }
const tool = path.resolve(import.meta.dirname, '..')
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
  const conversation = await c.manager.newConversation(c.project, f.target)
  if (!c.manager.connected) throw new Error('Dedicated Loomata account is not connected')
  report.cases.push('dedicated official account connected; private test history isolated')
  await c.manager.send(c.project, {
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
  await c.manager.approve(c.project, { id: approval.id, decision: 'approve' })
  await until(() => !c.manager.turn, 'completion')
  if (
    (await fs.readFile(path.join(f.store.treeRoot(f.treeId), 'page.txt'), 'utf8')).trim() !==
    'WORKSPACE_LIVE_VERIFIED'
  )
    throw new Error('Draft not updated')
  if ((await fs.readFile(path.join(f.root, 'page.txt'), 'utf8')) !== 'original')
    throw new Error('Main changed')
  report.cases.push('real contextual proposal approved through common draft; main preserved')
  await c.manager.send(c.project, {
    conversation,
    text: 'Explique longuement les étapes de revue de ce projet synthétique, sans modifier de fichier.',
    requestId: randomUUID(),
  })
  await c.manager.interrupt(c.project)
  if (c.manager.turn || c.manager.approvals.size) throw new Error('Interruption incomplete')
  report.cases.push('real turn interrupted without pending approval or duplicate write')
  await c.manager.send(c.project, {
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
  const output = path.join(tool, 'test-results/workspace-live.json')
  await fs.writeFile(output, JSON.stringify(report, null, 2) + '\n')
  console.log(JSON.stringify(report))
}
