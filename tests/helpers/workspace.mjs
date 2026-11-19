import fs from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { WorkspaceStore } from '../../scripts/core/workspace.ts'
import { manifestPaths } from '../../scripts/design-editor/manifest.mjs'
import { prepareEditorArtifacts } from '../../scripts/editor-artifacts.mjs'
import { ChatManager } from '../../scripts/agent-chat/manager.mjs'
const source = path.resolve(import.meta.dirname, '../..')
const revision = 'a'.repeat(64)
export async function fixture(t, design = false) {
  const parent = path.join(source, 'test-results/workspace-adapters')
  await fs.mkdir(parent, { recursive: true })
  const root = await fs.mkdtemp(path.join(parent, 'project-'))
  const disposers = []
  t.after(async () => {
    for (const dispose of disposers.reverse()) await dispose()
    await fs.rm(root, { recursive: true, force: true })
  })
  const store = new WorkspaceStore(root),
    projectId = randomUUID(),
    target = randomUUID()
  await fs.writeFile(
    path.join(root, 'loomata.project.json'),
    JSON.stringify({ version: 1, phase: 'created', id: projectId }),
  )
  await fs.writeFile(
    path.join(root, '.gitignore'),
    '*.local\n*.generated.*\npublic/editor-snapshot.generated.json\n',
  )
  await fs.writeFile(path.join(root, 'page.txt'), 'original')
  if (design) {
    for (const file of manifestPaths) {
      await fs.mkdir(path.dirname(path.join(root, file)), { recursive: true })
      await fs.copyFile(path.join(source, file), path.join(root, file))
    }
    const { outputs } = await prepareEditorArtifacts(root)
    for (const [file, bytes] of outputs) {
      await fs.mkdir(path.dirname(path.join(root, file)), { recursive: true })
      await fs.writeFile(path.join(root, file), bytes)
    }
  }
  await store.git(['init', '-b', 'main'])
  await store.git(['add', '.'])
  await store.git(['commit', '-m', 'test: establish isolated adapters'])
  await store.initialize({
    schemaVersion: 1,
    projectId,
    revision,
    entities: [
      {
        id: target,
        revision,
        label: 'Page',
        kind: 'page',
        files: ['page.txt', 'new.txt'],
      },
    ],
  })
  await store.git(['add', '--', 'loomata/workspace.json'])
  await store.git(['commit', '-m', 'test: record workspace'])
  const treeId = await store.openTree('draft')
  return { root, store, target, treeId, disposers }
}
class FakeCodex {
  constructor(options) {
    Object.assign(this, options)
    this.work = path.join(options.state, 'work')
    this.calls = []
  }
  async start() {}
  async rpc(method, params) {
    this.calls.push({ method, params })
    if (method === 'account/read') return { account: { type: 'chatgpt', id: 'synthetic' } }
    if (method === 'thread/start') return { thread: { id: randomUUID() } }
    if (method === 'turn/start') return { turn: { id: randomUUID() } }
    return {}
  }
  stop() {}
}
export async function chatFixture(t, f, providerFactory = (o) => new FakeCodex(o)) {
  const state = path.join(f.root, '.runtime.local/chat-qa')
  await fs.mkdir(state, { mode: 0o700 })
  const options = {
    state,
    tool: source,
    providerFactory,
    install: async () => '/synthetic/provider',
  }
  const manager = await ChatManager.open(options),
    project = await manager.register(f.root)
  f.disposers.push(() => manager.close())
  return { manager, project, options }
}
