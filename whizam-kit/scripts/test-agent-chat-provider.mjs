import * as fs from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { CodexProvider } from './agent-chat/provider.mjs'
import { projectBinding, readFile, proposedWrite, applyWrite } from './agent-chat/broker.mjs'
import { installCodex } from './agent-chat/install.mjs'
import { stateDirectory } from './agent-chat/private.mjs'
const tool = fileURLToPath(new URL('..', import.meta.url))
const parent = resolve(tool, 'test-results/agent-chat-provider')
await fs.mkdir(parent, { recursive: true })
const output = await fs.mkdtemp(resolve(parent, 'run-'))
const root = resolve(output, 'project with spaces')
await fs.mkdir(root, { mode: 0o700 })
await fs.writeFile(resolve(root, 'allowed.txt'), 'allowed')
await fs.writeFile(resolve(root, '.env.private'), 'synthetic private')
await fs.writeFile(resolve(output, 'outside.txt'), 'synthetic outside')
await fs.symlink(resolve(output, 'outside.txt'), resolve(root, 'link.txt'))
await fs.link(resolve(output, 'outside.txt'), resolve(root, 'hard.txt'))
const binding = await projectBinding(root),
  binary = await installCodex(await stateDirectory(tool))
const provider = new CodexProvider({
  state: output,
  binary,
  binding,
  onNotification: () => {},
  onTool: () => {
    throw new Error('Tools unavailable in protocol diagnostic')
  },
})
const report = { status: 'running', version: '0.167.0', cases: [] }
try {
  await provider.start()
  const account = await provider.rpc('account/read', { refreshToken: false })
  if (account.account) throw new Error('Fresh diagnostic unexpectedly authenticated')
  report.cases.push('pinned real app-server initializes in a fresh disconnected private account')
  const targets = [
    ['outside read', '/bin/cat', resolve(output, 'outside.txt')],
    ['secret read', '/bin/cat', resolve(root, '.env.private')],
    ['native project read', '/bin/cat', resolve(root, 'allowed.txt')],
    ['outside write', '/usr/bin/touch', resolve(output, 'outside.txt')],
    ['native project write', '/usr/bin/touch', resolve(root, 'allowed.txt')],
    ['linked read', '/bin/cat', resolve(root, 'link.txt')],
    ['multiply linked read', '/bin/cat', resolve(root, 'hard.txt')],
  ]
  for (const [name, command, target] of targets) {
    const result = await provider.rpc('command/exec', {
      command: [command, target],
      timeoutMs: 5000,
      outputBytesCap: 500,
    })
    if (result.exitCode === 0 || !result.stderr.includes('Operation not permitted'))
      throw new Error('Expected actual OS refusal: ' + name)
    report.cases.push(name + ' denied by actual provider filesystem policy')
  }
  if ((await readFile(binding, 'allowed.txt')).text !== 'allowed')
    throw new Error('Broker read failed')
  for (const file of ['.env.private', '../outside.txt', 'link.txt', 'hard.txt']) {
    let denied = false
    try {
      await readFile(binding, file)
    } catch {
      denied = true
    }
    if (!denied) throw new Error('Unsafe broker read')
  }
  const proposal = await proposedWrite(binding, {
    file: 'allowed.txt',
    text: 'approved local content',
    reason: 'isolated diagnostic',
  })
  await applyWrite(binding, proposal)
  if ((await fs.readFile(resolve(root, 'allowed.txt'), 'utf8')) !== 'approved local content')
    throw new Error('Broker write failed')
  if ((await fs.readFile(resolve(output, 'outside.txt'), 'utf8')) !== 'synthetic outside')
    throw new Error('Outside witness changed')
  report.cases.push(
    'broker reads and writes the allowed project witness while private, external and linked witnesses are refused',
  )
  report.status = 'passed'
  console.log(JSON.stringify({ status: report.status, cases: report.cases, output }, null, 2))
} finally {
  provider.stop()
  await fs.writeFile(resolve(output, 'qualification.json'), JSON.stringify(report, null, 2) + '\n')
}
