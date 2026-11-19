import * as fs from 'node:fs/promises'
import path from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { createHash, randomUUID } from 'node:crypto'
import { z } from 'zod'
import {
  workspaceSchema,
  identitySchema,
  revisionSchema,
} from '../../src/core/workspace-contract.ts'
import { privateDir, readSafe, durableReplace, syncDir } from '../design-editor/files.mjs'
import { inventory } from './workspace-inventory.ts'
import { recoverDesign } from './workspace-design.ts'
import { permittedPath } from '../agent-chat/broker.mjs'
import { contextualStylePath } from '../../src/core/contextual-style.ts'

const run = promisify(execFile)
const digest = (value: string | Buffer) => createHash('sha256').update(value).digest('hex')
const relativeState = '.runtime.local/workspace'
const publicFile = 'loomata/workspace.json'
const json = (value: unknown) => JSON.stringify(value, null, 2) + '\n'
const editSchema = z.strictObject({
  file: z.string().min(1).max(500),
  before: z
    .string()
    .max(2 * 1024 * 1024)
    .nullable(),
  after: z
    .string()
    .max(2 * 1024 * 1024)
    .nullable(),
})
const receiptEditSchema = z.union([
  editSchema,
  z.strictObject({ file: editSchema.shape.file, afterDigest: revisionSchema.nullable() }),
])
const operationSchema = z.strictObject({
  id: identitySchema,
  revision: revisionSchema,
  origin: z.enum(['inspector', 'codex', 'figma']),
  targets: z.array(identitySchema).min(1).max(1000),
  taskIds: z.array(identitySchema).max(1000).optional(),
  edits: z.array(editSchema).max(100),
  entities: workspaceSchema.shape.entities.optional(),
  requireSelected: z.boolean().optional(),
  promoteToWorkItem: z.boolean().optional(),
})
const treeSchema = z.strictObject({
  id: identitySchema,
  kind: z.enum(['draft', 'workItem']),
  base: z.string().regex(/^[a-f0-9]{40,64}$/),
  head: z.string().regex(/^[a-f0-9]{40,64}$/),
  proof: z
    .strictObject({ revision: revisionSchema, result: z.enum(['checking', 'passed', 'failed']) })
    .nullable(),
  model: workspaceSchema,
  receipts: z.record(
    z.string(),
    z.strictObject({
      chat: z
        .strictObject({ conversationId: identitySchema, turnId: z.string().min(1).max(200) })
        .optional(),
      design: z.boolean().optional(),
      launch: z.boolean().optional(),
      coverage: z.enum(['complete', 'partial']).optional(),
      inputHash: revisionSchema,
      revision: revisionSchema,
      state: z.enum(['applied', 'checking', 'validated']),
      targets: z.array(identitySchema),
      edits: z.array(receiptEditSchema),
      entityInverse: z
        .strictObject({
          restore: workspaceSchema.shape.entities,
          remove: z.array(identitySchema).max(10000),
        })
        .optional(),
    }),
  ),
})
export const stateSchema = z
  .strictObject({
    version: z.literal(1),
    projectId: identitySchema,
    selected: identitySchema.nullable(),
    trees: z.array(treeSchema),
    decisions: z.array(
      z.strictObject({ treeId: identitySchema, head: z.string(), outcome: z.string() }),
    ),
  })
  .transform((state) => {
    for (const tree of state.trees)
      for (const receipt of Object.values(tree.receipts)) {
        // Only the current design change can be undone. Older receipts still attest their files.
        if (!receipt.design || receipt.revision === tree.model.revision) continue
        receipt.edits = receipt.edits.map((edit) =>
          'afterDigest' in edit
            ? edit
            : { file: edit.file, afterDigest: edit.after === null ? null : digest(edit.after) },
        )
      }
    return state
  })
const journalSchema = z.strictObject({
  version: z.literal(1),
  treeId: identitySchema,
  before: stateSchema,
  after: stateSchema,
  edits: z.array(editSchema),
})
type State = z.infer<typeof stateSchema>
type Tree = z.infer<typeof treeSchema>
export type WorkspaceOperation = z.infer<typeof operationSchema>

/** Trusted local port only. No shell strings, remote operations or arbitrary Git arguments. */
export class WorkspaceStore {
  designWriter?: Awaited<ReturnType<typeof import('./workspace-design-bridge.mjs').createStore>>
  designWriterTreeId?: string
  root: string
  statePath: string
  fault: (phase: string) => Promise<void>
  constructor(root: string, fault: (phase: string) => Promise<void> = async () => {}) {
    this.root = root
    this.statePath = path.join(root, relativeState)
    this.fault = fault
  }
  async git(args: string[], root = this.root) {
    const { stdout } = await run('git', ['-c', 'core.fsmonitor=false', ...args], {
      cwd: root,
      timeout: 30000,
      maxBuffer: 4 * 1024 * 1024,
      env: {
        PATH: process.env.PATH,
        LANG: 'C',
        GIT_CONFIG_NOSYSTEM: '1',
        GIT_CONFIG_GLOBAL: '/dev/null',
        GIT_AUTHOR_NAME: 'Loomata',
        GIT_AUTHOR_EMAIL: 'loomata@localhost',
        GIT_COMMITTER_NAME: 'Loomata',
        GIT_COMMITTER_EMAIL: 'loomata@localhost',
      },
    })
    return stdout.trim()
  }
  async read(file: string, root = this.root): Promise<string | null> {
    try {
      return (await readSafe(root, file, 8 * 1024 * 1024)).bytes.toString('utf8')
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null
      throw error
    }
  }
  async write(file: string, value: unknown) {
    const bytes = Buffer.from(json(value))
    if (bytes.length > 8 * 1024 * 1024) throw new Error('workspace-budget-exceeded')
    await durableReplace(this.root, file, bytes)
  }
  treeRoot(id: string) {
    identitySchema.parse(id)
    return path.join(this.statePath, 'trees', id)
  }
  async locked<T>(fn: () => Promise<T>): Promise<T> {
    if ((await fs.realpath(this.root)) !== this.root) throw new Error('workspace-root-link')
    await privateDir(path.join(this.root, '.runtime.local'))
    await privateDir(this.statePath)
    const lock = path.join(this.statePath, 'lock')
    // Wait only for acquisition, before invoking fn. Never replay an operation or remove a lock.
    for (let attempt = 0; ; attempt++) {
      try {
        await fs.mkdir(lock, { mode: 0o700 })
        break
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error
        if (attempt >= 20) throw new Error('workspace-busy-or-interrupted')
        await new Promise((done) => setTimeout(done, 25))
      }
    }
    const rootStat = await fs.stat(this.root)
    try {
      await durableReplace(
        this.root,
        relativeState + '/lock/owner.json',
        Buffer.from(
          json({ pid: process.pid, nonce: randomUUID(), dev: rootStat.dev, ino: rootStat.ino }),
        ),
      )
      return await fn()
    } finally {
      await fs.unlink(path.join(lock, 'owner.json'))
      await fs.rmdir(lock)
      await syncDir(this.statePath)
    }
  }
  async recover() {
    const raw = await this.read(relativeState + '/lock/owner.json')
    if (raw) {
      const owner = z
        .strictObject({
          pid: z.number().int().positive(),
          nonce: identitySchema,
          dev: z.number().int(),
          ino: z.number().int(),
        })
        .parse(JSON.parse(raw))
      const stat = await fs.stat(this.root)
      if (owner.dev !== stat.dev || owner.ino !== stat.ino)
        throw new Error('workspace-recovery-conflict')
      try {
        process.kill(owner.pid, 0)
        throw new Error('workspace-live-owner')
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ESRCH') throw error
      }
      const recovery = path.join(this.statePath, 'recovery')
      await fs.mkdir(recovery, { mode: 0o700 })
      try {
        if ((await this.read(relativeState + '/lock/owner.json')) !== raw)
          throw new Error('workspace-recovery-conflict')
        await fs.unlink(path.join(this.statePath, 'lock/owner.json'))
        await fs.rmdir(path.join(this.statePath, 'lock'))
      } finally {
        await fs.rmdir(recovery)
      }
    }
    return this.snapshot()
  }
  async state(): Promise<State> {
    const raw = await this.read(relativeState + '/state.json')
    if (!raw) throw new Error('workspace-not-initialized')
    return stateSchema.parse(JSON.parse(raw))
  }
  async save(state: State) {
    await this.write(relativeState + '/state.json', stateSchema.parse(state))
  }
  async assertRoot() {
    if ((await this.git(['rev-parse', '--show-toplevel'])) !== this.root)
      throw new Error('workspace-git-root-mismatch')
    const meta = JSON.parse((await this.read('loomata.project.json')) ?? 'null')
    if (meta?.phase !== 'created' || meta.version !== 1)
      throw new Error('workspace-project-required')
    return identitySchema.parse(meta.id)
  }
  async bootstrap(model: unknown) {
    return this.locked(async () => {
      const metadata = JSON.parse((await this.read('loomata.project.json')) ?? 'null')
      if (metadata?.version !== 1 || metadata.phase !== 'created')
        throw new Error('workspace-project-required')
      const parsed = workspaceSchema.parse(model)
      if (parsed.projectId !== identitySchema.parse(metadata.id))
        throw new Error('workspace-project-mismatch')
      try {
        await fs.lstat(path.join(this.root, '.git'))
        throw new Error('workspace-git-already-present')
      } catch (e) {
        if ((e as NodeJS.ErrnoException).code !== 'ENOENT') throw e
      }
      if ((await this.read(publicFile)) !== null) throw new Error('workspace-existing-trace')
      const { sourceFiles } = await import('./projects.mjs')
      const files = await sourceFiles(this.root)
      const selected = [...files.map((f) => f.path), 'loomata.project.json', publicFile]
      await fs.mkdir(path.join(this.root, 'loomata'), { recursive: true })
      await this.write(publicFile, await inventory(this, parsed))
      await this.git(['init', '-b', 'main'])
      await this.git(['check-ignore', '--quiet', relativeState])
      await this.git(['add', '--', ...new Set(selected)])
      await this.git(['commit', '-m', 'chore: initialize Loomata workspace'])
      await this.save({
        version: 1,
        projectId: parsed.projectId,
        selected: null,
        trees: [],
        decisions: [],
      })
      return this.snapshotUnlocked()
    })
  }
  async initialize(model: unknown) {
    return this.locked(async () => {
      const projectId = await this.assertRoot()
      if (await this.read(relativeState + '/state.json')) return this.snapshotUnlocked()
      const parsed = await inventory(this, workspaceSchema.parse(model))
      if (parsed.projectId !== projectId) throw new Error('workspace-project-mismatch')
      if (await this.read(publicFile)) throw new Error('workspace-existing-trace')
      await fs.mkdir(path.join(this.root, 'loomata'), { recursive: true })
      // This creates a durable source, not a commit or an automatic Git initialization.
      await this.write(publicFile, parsed)
      await this.save({ version: 1, projectId, selected: null, trees: [], decisions: [] })
      return this.snapshotUnlocked()
    })
  }
  async tree(state: State, id: string): Promise<Tree> {
    const tree = state.trees.find((t) => t.id === id)
    if (!tree) throw new Error('workspace-tree-unknown')
    const root = this.treeRoot(id)
    if (
      (await fs.realpath(root)) !== root ||
      (await this.git(['rev-parse', '--show-toplevel'], root)) !== root ||
      (await this.git(['rev-parse', 'HEAD'], root)) !== tree.head
    )
      throw new Error('workspace-tree-changed')
    return tree
  }
  async recoverOpening() {
    const raw = await this.read(relativeState + '/opening.json')
    if (!raw) return
    const entry = z
      .strictObject({
        id: identitySchema,
        kind: z.enum(['draft', 'workItem']),
        base: z.string().regex(/^[a-f0-9]{40,64}$/),
        model: workspaceSchema,
      })
      .parse(JSON.parse(raw))
    const state = await this.state()
    if (!state.trees.some((t) => t.id === entry.id)) {
      if ((await this.git(['rev-parse', 'HEAD'], this.treeRoot(entry.id))) !== entry.base)
        throw new Error('workspace-opening-recovery-required')
      state.trees.push({ ...entry, head: entry.base, proof: null, receipts: {} })
      state.selected = entry.id
      await this.save(state)
    }
    await fs.unlink(path.join(this.statePath, 'opening.json'))
  }
  async recoverDesign() {
    return recoverDesign(this)
  }
  async recoverJournal() {
    await this.recoverOpening()
    await this.recoverGit()
    await this.recoverDesign()
    const raw = await this.read(relativeState + '/journal.json')
    if (!raw) return
    const journal = journalSchema.parse(JSON.parse(raw))
    const current = await this.state()
    if (json(current) !== json(journal.before) && json(current) !== json(journal.after))
      throw new Error('workspace-recovery-conflict')
    await this.tree(journal.before, journal.treeId)
    const root = this.treeRoot(journal.treeId)
    // Validate every participant before resuming publication. Preserve all unknown bytes.
    for (const edit of journal.edits) {
      this.allowed(edit.file)
      const actual = await this.read(edit.file, root)
      if (actual !== edit.before && actual !== edit.after)
        throw new Error('workspace-recovery-conflict')
    }
    for (const edit of journal.edits) {
      await this.publish(root, edit)
    }
    await this.save(journal.after)
    await fs.unlink(path.join(this.statePath, 'journal.json'))
    await syncDir(this.statePath)
  }
  async publish(root: string, edit: z.infer<typeof editSchema>) {
    if (edit.after === null) {
      if ((await this.read(edit.file, root)) === null) return
      await fs.unlink(path.join(root, edit.file))
      await syncDir(path.dirname(path.join(root, edit.file)))
    } else await durableReplace(root, edit.file, Buffer.from(edit.after), 0o644)
  }
  allowed(file: string) {
    if (file.startsWith('loomata/') && file !== publicFile)
      throw new Error('workspace-trace-protected')
    if (file !== publicFile && file !== contextualStylePath) permittedPath(file, true)
    if (
      [...file].some((c) => c.charCodeAt(0) < 32) ||
      file.includes('\\') ||
      file.split('/').some((part) => !part || part === '..' || part === '.')
    )
      throw new Error('workspace-path-denied')
  }
  async reconstruct() {
    return this.locked(async () => {
      const projectId = await this.assertRoot()
      if (await this.read(relativeState + '/state.json')) throw new Error('workspace-state-exists')
      const model = workspaceSchema.parse(
        JSON.parse(await this.git(['show', 'HEAD:' + publicFile])),
      )
      if (model.projectId !== projectId) throw new Error('workspace-project-mismatch')
      await this.save({ version: 1, projectId, selected: null, trees: [], decisions: [] })
      const commits = await this.checkpoints()
      return { model, commits, ...(await this.snapshotUnlocked()) }
    })
  }
  async checkpoints() {
    const paths = (
      await this.git(['ls-tree', '-r', '--name-only', 'HEAD', '--', 'loomata/checkpoints'])
    )
      .split('\n')
      .filter(Boolean)
    const commits = []
    for (const file of paths) {
      if (!/^loomata\/checkpoints\/[a-f0-9-]{36}\.json$/.test(file))
        throw new Error('workspace-checkpoint-invalid')
      const entry = JSON.parse(await this.git(['show', 'HEAD:' + file]))
      const gitOid = (await this.git(['log', '--diff-filter=A', '--format=%H', '--', file]))
        .split('\n')
        .at(-1)
      commits.push({ ...entry, gitOid })
    }
    return commits
  }
  async openTree(kind: 'draft' | 'workItem') {
    return this.locked(async () => {
      await this.assertRoot()
      await this.recoverJournal()
      const state = await this.state()
      if (
        kind === 'draft' &&
        state.trees.some(
          (t) =>
            t.kind === 'draft' &&
            t.head === t.base &&
            !state.decisions.some((d) => d.treeId === t.id),
        )
      )
        throw new Error('workspace-draft-exists')
      if (!['draft', 'workItem'].includes(kind)) throw new Error('workspace-kind-invalid')
      const base = await this.git(['rev-parse', 'HEAD'])
      const raw = await this.git(['show', `${base}:${publicFile}`])
      const model = workspaceSchema.parse(JSON.parse(raw))
      if (model.projectId !== state.projectId) throw new Error('workspace-project-mismatch')
      const id = randomUUID()
      await privateDir(path.join(this.statePath, 'trees'))
      await this.write(relativeState + '/opening.json', { id, kind, base, model })
      await this.git(['worktree', 'add', '-b', 'loomata/' + id, this.treeRoot(id), base])
      state.trees.push({ id, kind, base, head: base, proof: null, model, receipts: {} })
      state.selected = id
      await this.save(state)
      await fs.unlink(path.join(this.statePath, 'opening.json'))
      return id
    })
  }
  async apply(treeId: string, input: unknown) {
    return this.locked(async () => {
      await this.assertRoot()
      await this.recoverJournal()
      const operation = operationSchema.parse(input)
      if (
        (!operation.edits.length && !operation.entities) ||
        operation.edits.some(
          (e) => (e.before?.length ?? 0) > 100000 || (e.after?.length ?? 0) > 100000,
        )
      )
        throw new Error('workspace-operation-invalid')
      const state = await this.state(),
        before = structuredClone(state)
      const tree = await this.tree(state, treeId)
      if (operation.requireSelected && state.selected !== treeId)
        throw new Error('workspace-selection-changed')
      const inputHash = digest(json(operation))
      if (tree.receipts[operation.id]) {
        if (tree.receipts[operation.id].inputHash !== inputHash)
          throw new Error('workspace-operation-reused')
        return tree.receipts[operation.id]
      }
      if (tree.head !== tree.base) throw new Error('workspace-draft-committed-create-new')
      if (tree.model.revision !== operation.revision) throw new Error('workspace-revision-conflict')
      if (
        new Set(operation.targets).size !== operation.targets.length ||
        operation.targets.some(
          (id) =>
            !tree.model.entities.some((e) => e.id === id) &&
            !operation.entities?.some((e) => e.id === id),
        )
      )
        throw new Error('workspace-target-unknown')
      if (
        operation.taskIds?.some(
          (id) => !tree.model.entities.some((e) => e.kind === 'task' && e.id === id),
        )
      )
        throw new Error('workspace-task-unknown')
      if (new Set(operation.edits.map((e) => e.file)).size !== operation.edits.length)
        throw new Error('workspace-duplicate-file')
      for (const edit of operation.edits) {
        if (edit.file === publicFile) throw new Error('workspace-trace-protected')
        if (edit.file === contextualStylePath && operation.origin !== 'inspector')
          throw new Error('workspace-trace-protected')
        this.allowed(edit.file)
        if ((await this.read(edit.file, this.treeRoot(treeId))) !== edit.before)
          throw new Error('workspace-file-conflict')
      }
      if ((await this.read(publicFile, this.treeRoot(treeId))) !== json(tree.model))
        throw new Error('workspace-trace-conflict')
      const revision = digest(json({ previous: tree.model.revision, operation }))
      const entities = operation.entities ?? tree.model.entities
      const priorEntities = tree.model.entities
      const incoming = new Map(entities.map((e) => [e.id, e]))
      const priorIds = new Set(priorEntities.map((e) => e.id))
      const entityInverse = operation.entities
        ? {
            restore: priorEntities.filter(
              (e) => !incoming.has(e.id) || json(e) !== json(incoming.get(e.id)),
            ),
            remove: entities.filter((e) => !priorIds.has(e.id)).map((e) => e.id),
          }
        : undefined
      if (operation.promoteToWorkItem) {
        if (
          !entities.some(
            (e) =>
              e.kind === 'workItem' && e.state === 'running' && operation.targets.includes(e.id),
          )
        )
          throw new Error('workspace-explicit-start-required')
        tree.kind = 'workItem'
      }
      tree.model = workspaceSchema.parse({
        ...tree.model,
        revision,
        entities: entities.map((entity) => {
          // Conservatively invalidate all recognized evidence after any source change.
          if (entity.kind === 'flow') return { ...entity, revision, evidence: null }
          if (entity.kind === 'modification')
            return { ...entity, revision, state: 'applied', evidenceRevision: null }
          return operation.targets.includes(entity.id) ? { ...entity, revision } : entity
        }),
      })
      if (!tree.model.entities.some((e) => e.id === operation.id))
        tree.model.entities.push({
          id: operation.id,
          kind: 'modification',
          label: 'Modification ' + operation.origin,
          revision,
          taskIds: operation.taskIds ?? [],
          targetIds: operation.targets.filter((id) =>
            tree.model.entities.some(
              (e) =>
                e.id === id &&
                ['page', 'component', 'variant', 'occurrence', 'token', 'flow'].includes(e.kind),
            ),
          ),
          state: 'applied',
          evidenceRevision: null,
        })
      tree.model = workspaceSchema.parse(tree.model)
      tree.proof = null
      for (const receipt of Object.values(tree.receipts)) receipt.state = 'applied'
      tree.receipts[operation.id] = {
        inputHash,
        coverage: operation.edits.every((edit) =>
          tree.model.entities.some((e) => e.files?.includes(edit.file)),
        )
          ? 'complete'
          : 'partial',
        revision,
        state: 'applied',
        targets: operation.targets,
        edits: operation.edits,
        ...(entityInverse ? { entityInverse } : {}),
        ...(operation.promoteToWorkItem ? { launch: true } : {}),
      }
      const edits = [
        ...operation.edits,
        {
          file: publicFile,
          before: await this.read(publicFile, this.treeRoot(treeId)),
          after: json(tree.model),
        },
      ]
      await this.write(relativeState + '/journal.json', {
        version: 1,
        treeId,
        before,
        after: stateSchema.parse(state),
        edits,
      })
      await this.fault('prepared')
      for (const edit of edits) {
        await this.publish(this.treeRoot(treeId), edit)
        await this.fault('file-published')
      }
      await this.save(state)
      await this.fault('state-published')
      await fs.unlink(path.join(this.statePath, 'journal.json'))
      await syncDir(this.statePath)
      return tree.receipts[operation.id]
    })
  }
  async undo(treeId: string, operationId: string, revision: string, requireSelected = false) {
    const state = await this.state(),
      tree = await this.tree(state, treeId)
    const receipt = tree.receipts[identitySchema.parse(operationId)]
    if (!receipt || tree.model.revision !== revision || receipt.revision !== revision)
      throw new Error('workspace-undo-conflict')
    if (receipt.launch) throw new Error('workspace-launch-not-undoable')
    if (receipt.design) throw new Error('workspace-use-design-undo')
    const receiptEdits = z.array(editSchema).parse(receipt.edits)
    if (tree.head !== tree.base) throw new Error('workspace-undo-after-commit')
    return this.apply(treeId, {
      id: randomUUID(),
      revision,
      origin: 'inspector',
      requireSelected,
      targets: receipt.targets,
      ...(receipt.entityInverse
        ? {
            entities: tree.model.entities
              .filter(
                (e) =>
                  !receipt.entityInverse!.remove.includes(e.id) &&
                  !receipt.entityInverse!.restore.some((old) => old.id === e.id),
              )
              .concat(receipt.entityInverse.restore),
          }
        : {}),
      edits: receiptEdits.map((edit) => ({
        file: edit.file,
        before: edit.after,
        after: edit.before,
      })),
    })
  }
  async check(
    treeId: string,
    operationId: string,
    revision: string,
    result: 'checking' | 'passed' | 'failed',
  ) {
    return this.locked(async () => {
      await this.recoverJournal()
      const state = await this.state(),
        tree = await this.tree(state, treeId)
      const receipt = tree.receipts[identitySchema.parse(operationId)]
      if (!receipt || tree.model.revision !== revision) throw new Error('workspace-proof-obsolete')
      if (!['checking', 'passed', 'failed'].includes(result))
        throw new Error('workspace-result-invalid')
      await this.assertSourceState(tree)
      tree.proof = { revision, result }
      for (const receipt of Object.values(tree.receipts))
        receipt.state =
          result === 'passed' ? 'validated' : result === 'checking' ? 'checking' : 'applied'
      await this.save(state)
    })
  }
  private async assertReceiptFiles(tree: Tree, conflict: string) {
    const expected = new Map(
      Object.values(tree.receipts)
        .flatMap((receipt) => receipt.edits)
        .map((edit) => [edit.file, edit]),
    )
    for (const [file, edit] of expected) {
      const actual = await this.read(file, this.treeRoot(tree.id))
      const matches =
        'afterDigest' in edit
          ? (actual === null ? null : digest(actual)) === edit.afterDigest
          : actual === edit.after
      if (!matches) throw new Error(conflict)
    }
    return expected
  }
  async assertSourceState(tree: Tree) {
    const root = this.treeRoot(tree.id)
    const expected = await this.assertReceiptFiles(tree, 'workspace-file-conflict')
    if ((await this.read(publicFile, root)) !== json(tree.model))
      throw new Error('workspace-trace-conflict')
    const paths = (
      await this.git(
        ['ls-files', '-z', '--modified', '--deleted', '--others', '--exclude-standard'],
        root,
      )
    )
      .split('\0')
      .filter(Boolean)
    if (paths.some((file) => file !== publicFile && !expected.has(file)))
      throw new Error('workspace-unrecognized-changes')
  }
  async commit(treeId: string, revision: string) {
    return this.locked(async () => {
      await this.assertRoot()
      await this.recoverJournal()
      const state = await this.state(),
        tree = await this.tree(state, treeId)
      if (tree.model.revision !== revision) throw new Error('workspace-revision-conflict')
      await this.assertSourceState(tree)
      const root = this.treeRoot(treeId)
      const files = [
        ...new Set([
          publicFile,
          ...Object.values(tree.receipts).flatMap((receipt) =>
            receipt.edits.map((edit) => edit.file),
          ),
        ]),
      ]
      if (await this.git(['diff', '--cached', '--name-only'], root))
        throw new Error('workspace-index-not-empty')
      const changed = (
        await this.git(
          ['ls-files', '-z', '--modified', '--deleted', '--others', '--exclude-standard'],
          root,
        )
      )
        .split('\0')
        .filter(Boolean)
      if (changed.some((file) => !files.includes(file)))
        throw new Error('workspace-unrecognized-changes')
      if (!changed.length) throw new Error('workspace-nothing-to-commit')
      const id = randomUUID()
      await fs.mkdir(path.join(root, 'loomata/checkpoints'), { recursive: true })
      const checkpoint = 'loomata/checkpoints/' + id + '.json'
      const taskIds = [
        ...new Set(
          tree.model.entities
            .filter((e) => e.kind === 'modification' && Object.keys(tree.receipts).includes(e.id))
            .flatMap((e) => (e.kind === 'modification' ? e.taskIds : [])),
        ),
      ]
      const workItemIds = tree.model.entities
        .filter((e) => e.kind === 'workItem' && e.taskIds.some((task) => taskIds.includes(task)))
        .map((e) => e.id)
      const checkpointData = {
        version: 1,
        id,
        groupId: workItemIds[0] ?? randomUUID(),
        revision,
        modifications: Object.keys(tree.receipts),
        taskIds,
        workItemIds,
        proof: tree.proof,
      }
      changed.push(checkpoint)
      await this.write(relativeState + '/git-action.json', {
        kind: 'commit',
        treeId,
        id,
        previous: tree.head,
        state,
        checkpointData,
      })
      await durableReplace(root, checkpoint, Buffer.from(json(checkpointData)), 0o644)
      await this.git(['add', '--', ...new Set(changed)], root)
      await this.fault('git-staged')
      await this.git(
        [
          'commit',
          '-m',
          'feat: record Loomata workspace changes',
          '-m',
          'Loomata-Operation: ' + id,
        ],
        root,
      )
      await this.fault('git-committed')
      await this.recoverGit()
      return this.git(['rev-parse', 'HEAD'], root)
    })
  }
  async integrate(
    treeId: string,
    options: {
      revision: string
      visible: boolean
      critical: boolean
      mode: 'automatic' | 'human' | 'e2e'
      humanApproved: boolean
      e2ePassed: boolean
      proofRevision: string
    },
  ) {
    return this.locked(async () => {
      await this.assertRoot()
      await this.recoverJournal()
      const state = await this.state(),
        tree = await this.tree(state, treeId)
      if (tree.model.revision !== options.revision || options.proofRevision !== options.revision)
        throw new Error('workspace-proof-obsolete')
      await this.assertSourceState(tree)
      const receipts = Object.values(tree.receipts)
      if (
        !receipts.length ||
        tree.proof?.result !== 'passed' ||
        tree.proof.revision !== tree.model.revision ||
        receipts.some((r) => r.state !== 'validated')
      )
        throw new Error('workspace-checks-required')
      if (
        tree.head === tree.base ||
        (await this.git(['status', '--porcelain'], this.treeRoot(treeId)))
      )
        throw new Error('workspace-commit-required')
      if (
        receipts.some((r) => r.coverage === 'partial') &&
        !(options.mode === 'human' && options.humanApproved)
      )
        throw new Error('workspace-coverage-human-required')
      if (options.critical && !(options.mode === 'human' && options.humanApproved))
        throw new Error('workspace-human-required')
      if (options.mode === 'automatic' && (options.visible || options.critical))
        throw new Error('workspace-human-required')
      if (options.mode === 'human' && !options.humanApproved)
        throw new Error('workspace-human-required')
      if (options.mode === 'e2e' && (!options.e2ePassed || options.critical))
        throw new Error('workspace-e2e-required')
      if (!['automatic', 'human', 'e2e'].includes(options.mode))
        throw new Error('workspace-mode-invalid')
      if ((await this.git(['rev-parse', 'HEAD'])) !== tree.base)
        throw new Error('workspace-base-conflict')
      if (await this.git(['status', '--porcelain'])) throw new Error('workspace-main-dirty')
      const integrationData = {
        version: 1,
        treeId,
        treeHead: tree.head,
        revision: options.revision,
        mode: options.mode,
        humanApproved: options.humanApproved,
        e2ePassed: options.e2ePassed,
      }
      await this.write(relativeState + '/git-action.json', {
        kind: 'integrate',
        treeId,
        previous: tree.base,
        state,
        integrationData,
      })
      await this.git(['merge', '--ff-only', tree.head])
      await this.fault('git-integrated')
      await this.recoverGit()
      return { head: await this.git(['rev-parse', 'HEAD']), integrated: true }
    })
  }
  async recoverGit() {
    const raw = await this.read(relativeState + '/git-action.json')
    if (!raw) return
    const record = z
      .strictObject({
        kind: z.enum(['commit', 'integrate']),
        treeId: identitySchema,
        id: identitySchema.optional(),
        previous: z.string().regex(/^[a-f0-9]{40,64}$/),
        state: stateSchema,
        checkpointData: z.unknown().optional(),
        integrationData: z.unknown().optional(),
      })
      .parse(JSON.parse(raw))
    const tree = record.state.trees.find((t) => t.id === record.treeId)
    if (!tree) throw new Error('workspace-recovery-conflict')
    if (record.kind === 'commit') {
      const root = this.treeRoot(tree.id)
      let head = await this.git(['rev-parse', 'HEAD'], root)
      if (head === record.previous) {
        if (
          !record.id ||
          !record.checkpointData ||
          (await this.read(publicFile, root)) !== json(tree.model)
        )
          throw new Error('workspace-recovery-conflict')
        const expected = await this.assertReceiptFiles(tree, 'workspace-recovery-conflict')
        const checkpoint = 'loomata/checkpoints/' + record.id + '.json'
        const existing = await this.read(checkpoint, root)
        if (existing !== null && existing !== json(record.checkpointData))
          throw new Error('workspace-recovery-conflict')
        await durableReplace(root, checkpoint, Buffer.from(json(record.checkpointData)), 0o644)
        const files = [publicFile, checkpoint, ...expected.keys()]
        const staged = (await this.git(['diff', '--cached', '--name-only', '-z'], root))
          .split('\0')
          .filter(Boolean)
        if (staged.some((file) => !files.includes(file)))
          throw new Error('workspace-index-conflict')
        await this.git(['add', '--', ...files], root)
        await this.git(
          [
            'commit',
            '-m',
            'feat: record Loomata workspace changes',
            '-m',
            'Loomata-Operation: ' + record.id,
          ],
          root,
        )
        head = await this.git(['rev-parse', 'HEAD'], root)
      }
      if (
        !(await this.git(['log', '-1', '--format=%B'], root)).includes(
          'Loomata-Operation: ' + record.id,
        ) ||
        (await this.git(['rev-parse', 'HEAD^'], root)) !== record.previous
      )
        throw new Error('workspace-recovery-conflict')
      const allowed = new Set([
        publicFile,
        'loomata/checkpoints/' + record.id + '.json',
        ...Object.values(tree.receipts).flatMap((r) => r.edits.map((e) => e.file)),
      ])
      const published = (
        await this.git(['diff-tree', '--no-commit-id', '--name-only', '-r', '-z', head], root)
      )
        .split('\0')
        .filter(Boolean)
      if (published.some((file) => !allowed.has(file)))
        throw new Error('workspace-commit-scope-conflict')
      tree.head = head
      await this.assertSourceState(tree)
    } else {
      const decision = z
        .strictObject({
          version: z.literal(1),
          treeId: identitySchema,
          treeHead: z.string().regex(/^[a-f0-9]{40,64}$/),
          revision: revisionSchema,
          mode: z.enum(['automatic', 'human', 'e2e']),
          humanApproved: z.boolean(),
          e2ePassed: z.boolean(),
        })
        .parse(record.integrationData)
      if (
        decision.treeId !== tree.id ||
        decision.treeHead !== tree.head ||
        decision.revision !== tree.model.revision
      )
        throw new Error('workspace-recovery-conflict')
      let head = await this.git(['rev-parse', 'HEAD'])
      if (head === record.previous) {
        await this.git(['merge', '--ff-only', tree.head])
        head = tree.head
      }
      const file = 'loomata/integrations/' + tree.id + '.json'
      if (head === tree.head) {
        const existing = await this.read(file)
        if (existing !== null && existing !== json(decision))
          throw new Error('workspace-recovery-conflict')
        await fs.mkdir(path.join(this.root, 'loomata/integrations'), { recursive: true })
        await durableReplace(this.root, file, Buffer.from(json(decision)), 0o644)
        const staged = (await this.git(['diff', '--cached', '--name-only', '-z']))
          .split('\0')
          .filter(Boolean)
        if (staged.some((name) => name !== file)) throw new Error('workspace-index-conflict')
        await this.git(['add', '--', file])
        await this.git(['commit', '-m', 'chore: record Loomata integration decision'])
        head = await this.git(['rev-parse', 'HEAD'])
      }
      if (
        (await this.git(['rev-parse', 'HEAD^'])) !== tree.head ||
        (await this.git(['show', 'HEAD:' + file])) !== json(decision).trim() ||
        (await this.git(['diff-tree', '--no-commit-id', '--name-only', '-r', 'HEAD'])) !== file
      )
        throw new Error('workspace-recovery-conflict')
      record.state.decisions.push({ treeId: tree.id, head, outcome: decision.mode })
    }
    await this.save(record.state)
    await fs.unlink(path.join(this.statePath, 'git-action.json'))
  }
  async preview() {
    return this.locked(async () => {
      await this.assertRoot()
      await this.recoverJournal()
      const state = await this.state()
      if (state.selected === null)
        return {
          root: this.root,
          treeId: null,
          head: await this.git(['rev-parse', 'HEAD']),
          revision: workspaceSchema.parse(JSON.parse((await this.read(publicFile)) ?? 'null'))
            .revision,
        }
      const tree = await this.tree(state, state.selected)
      return {
        root: this.treeRoot(tree.id),
        treeId: tree.id,
        head: tree.head,
        revision: tree.model.revision,
      }
    })
  }
  async conflicts(treeId: string) {
    return this.locked(async () => {
      await this.assertRoot()
      await this.recoverJournal()
      const tree = await this.tree(await this.state(), treeId)
      const base = workspaceSchema.parse(
        JSON.parse(await this.git(['show', tree.base + ':' + publicFile])),
      )
      const current = workspaceSchema.parse(
        JSON.parse(await this.git(['show', 'HEAD:' + publicFile])),
      )
      const touched = new Set(Object.values(tree.receipts).flatMap((r) => r.targets))
      const functional = current.entities
        .filter(
          (e) =>
            touched.has(e.id) && e.revision !== base.entities.find((b) => b.id === e.id)?.revision,
        )
        .map((e) => e.id)
      return {
        baseChanged: tree.base !== (await this.git(['rev-parse', 'HEAD'])),
        functional,
        versionsPreserved: true,
      }
    })
  }
  async snapshotUnlocked() {
    const state = await this.state()
    const uncertain = new Set<string>()
    for (const tree of state.trees) {
      try {
        await this.assertSourceState(tree)
      } catch {
        uncertain.add(tree.id)
      }
    }
    return {
      projectId: state.projectId,
      selected: state.selected,
      trees: state.trees.map(({ id, kind, head, model, receipts }) => ({
        id,
        kind,
        head,
        revision: model.revision,
        coverage:
          uncertain.has(id) || Object.values(receipts).some((r) => r.coverage === 'partial')
            ? 'partial'
            : 'complete',
        entities: model.entities,
        operations: Object.entries(receipts).map(([operationId, receipt]) => ({
          id: operationId,
          state: uncertain.has(id) ? 'applied' : receipt.state,
          revision: receipt.revision,
        })),
      })),
    }
  }
  async snapshot() {
    return this.locked(async () => {
      await this.assertRoot()
      await this.recoverJournal()
      return this.snapshotUnlocked()
    })
  }
  async select(id: string | null) {
    return this.locked(async () => {
      await this.recoverJournal()
      const state = await this.state()
      if (id !== null) await this.tree(state, identitySchema.parse(id))
      state.selected = id
      await this.save(state)
      return this.snapshotUnlocked()
    })
  }
}
