import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { realpath, readFile, access } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { WorkspaceStore } from './workspace.ts'
import { workspaceCapabilities, workspacePort } from './workspace-port.ts'
import { createProject, openProject, prepareProject } from './projects.mjs'

const execute = promisify(execFile)
export const capabilities = Object.freeze({
  ...workspaceCapabilities,
  'project.inspect': true,
  'runtime.start': true,
  'runtime.status': true,
  'runtime.stop': true,
  'project.create': true,
  'project.open': true,
  'project.prepare': true,
  'project.export': true,
  'tool.export': true,
  'ai.connect': true,
  'ai.account': true,
  'ai.disconnect': true,
  'ai.open': true,
  'ai.status': true,
  'ai.interrupt': true,
})
export async function inspectProject(directory) {
  const root = await realpath(directory)
  const manifest = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'))
  if (manifest.type !== 'module' || !manifest.scripts?.dev)
    throw new Error('Dossier incompatible avec le contrat application/Storybook.')
  for (const file of ['scripts/local-app.mjs', 'scripts/storybook-local.mjs'])
    await access(resolve(root, file))
  return { protocolVersion: 1, root, name: manifest.name, version: manifest.version, capabilities }
}
/** Navigation comes only from the owned supervisor, never from page messages. */
export function workspaceURLs(uiURL, storybookURL) {
  const parse = (value) => {
    const url = new URL(value)
    const port = Number(url.port)
    if (
      url.protocol !== 'http:' ||
      url.hostname !== '127.0.0.1' ||
      !Number.isInteger(port) ||
      port < 1024 ||
      port > 65535 ||
      url.username ||
      url.password ||
      url.search ||
      url.hash
    )
      throw new Error('Adresses locales Loomata invalides.')
    return url
  }
  const ui = parse(uiURL),
    book = parse(storybookURL)
  if (ui.pathname !== '/' || book.pathname !== '/' || ui.origin === book.origin)
    throw new Error('Adresses locales Loomata invalides.')
  return { uiLab: ui.href, storybook: book.href, preview: new URL('/', ui).href }
}
/** Trusted local callers only. Never expose this directly as a browser command endpoint. */
export async function runLocalService(
  operation,
  {
    root,
    node = process.execPath,
    signal,
    options,
    source = fileURLToPath(new URL('../..', import.meta.url)),
  } = {},
) {
  if (!Object.hasOwn(capabilities, operation) || !capabilities[operation])
    throw new Error('Opération inconnue ou non disponible : ' + operation)
  if (operation.startsWith('workspace.'))
    return { protocolVersion: 1, result: await workspacePort(operation, root, options) }
  if (operation.endsWith('.export')) {
    const { exportSources } = await import('./exports.mjs')
    return exportSources(operation, { root, source, options })
  }
  if (operation.startsWith('ai.')) {
    const { agentChat } = await import('./agent-chat.mjs')
    return { protocolVersion: 1, ...(await agentChat(operation, { root, tool: source })) }
  }
  if (operation === 'project.create') return createProject(source, options)
  let effectiveRoot = root
  if (operation.startsWith('runtime.')) {
    const store = new WorkspaceStore(root)
    if (await store.read('.runtime.local/workspace/state.json')) {
      const preview = await store.preview()
      effectiveRoot = preview.root
      if (operation === 'runtime.start' && effectiveRoot !== root) {
        const prepared = await store.read('.runtime.local/project/state.json', effectiveRoot)
        if (!prepared || JSON.parse(prepared).phase !== 'prepared')
          await prepareProject(effectiveRoot, root, node, signal)
      }
    }
  }
  const project = await inspectProject(effectiveRoot)
  if (operation === 'project.open') return openProject(project.root, node, source)
  if (operation === 'project.prepare') return prepareProject(project.root, source, node, signal)
  if (operation === 'project.inspect') return project
  if (operation === 'runtime.start') {
    try {
      await access(resolve(project.root, 'src/styles/tokens.generated.css'))
    } catch {
      throw new Error(
        'Projet non préparé. Utiliser Préparer / Réessayer pour un projet créé par Loomata, ou suivre la préparation documentée du dossier existant.',
      )
    }
  }
  const action = operation.slice('runtime.'.length)
  const { stdout } = await execute(
    node,
    [resolve(project.root, 'scripts/local-app.mjs'), action, '--root', project.root],
    {
      cwd: project.root,
      env: { ...process.env, LOOMATA_TOOL_DIRECTORY: source },
      signal,
      timeout: 200000,
      maxBuffer: 32768,
    },
  )
  const state = action === 'stop' ? { phase: 'stopped' } : JSON.parse(stdout)
  return {
    protocolVersion: 1,
    ...state,
    project: { name: project.name, directory: project.root },
    ...(state.phase === 'ready'
      ? { workspace: workspaceURLs(state.uiURL, state.storybookURL) }
      : {}),
  }
}
