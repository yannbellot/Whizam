import { importedRequestSchema } from '../../src/core/imported-components.ts'
import { compileImportedComponents, importsPath, importsCSSPath } from '../imported-components.mjs'
import { assertDecisionMigrationComplete } from '../decision-policy-state.mjs'
import * as fs from 'node:fs/promises'
import { constants } from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'
import Ajv from 'ajv/dist/2020.js'
const validateResponse = new Ajv({ strict: true }).compile(
  JSON.parse(
    await fs.readFile(
      new URL(
        '../../src/design-system/authority/schemas/editor-response.schema.json',
        import.meta.url,
      ),
      'utf8',
    ),
  ),
)
import { importFont, validateFontResources, readFontAsset } from './fonts.mjs'
import { canonicalJSON } from '../../src/design-system/editor/canonical-json.ts'
import { applyRequest, projectTransaction } from '../../src/design-system/editor/operations.ts'
import { variantRequestSchema } from '../../src/core/variant-recipes.ts'
import { applyVariantRules } from '../variant-recipes.mjs'
import { prepareEditorArtifacts, derivedPaths } from '../editor-artifacts.mjs'
import { parseBounded } from './parsing.mjs'
import { manifestPaths, sourcePaths, catalogPath, tokenPath, variantsPath } from './manifest.mjs'
import { updateEditorTokens } from '../dtcg-tokens.mjs'
import { visualWriteSchema } from '../visual-tokens.mjs'
import {
  hash,
  identity,
  sameIdentity,
  readSafe,
  privateDir,
  syncDir,
  durableReplace,
  checkParents,
} from './files.mjs'

export const stateName = '.design-editor.local'
const id = z.string().regex(/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/)
const digest = z.string().regex(/^[a-f0-9]{64}$/)
const meta = z
  .object({
    dev: z.number().int().nonnegative(),
    ino: z.number().int().nonnegative(),
    mode: z.number().int().min(0).max(4095),
  })
  .strict()
const info = meta.extend({ hash: digest }).strict()
const file = z
  .string()
  .refine((value) => manifestPaths.includes(value) || derivedPaths.includes(value))
const change = z
  .object({
    file: file.refine((value) => sourcePaths.includes(value) || derivedPaths.includes(value)),
    before: info,
    after: info,
    preimage: z.string().max(4 * 1024 * 1024),
    postimage: z.string().max(4 * 1024 * 1024),
    stage: z
      .string()
      .regex(/^\.design-editor\.local\/transactions\/[a-f0-9-]{36}\/(?:next|cancel-next)\/[0-9]+$/),
  })
  .strict()
const writes = [...sourcePaths, ...derivedPaths]
const journalSchema = z
  .object({
    version: z.literal(1),
    id,
    bodyHash: digest,
    baseRevision: digest,
    root: meta,
    parents: z.array(z.object({ file: z.string(), meta }).strict()).max(500),
    before: z.record(file, info),
    changes: z.array(change).max(writes.length),
    phase: z.enum(['pending', 'prepared', 'committed', 'failed']),
    progress: z.number().int().min(0).max(writes.length),
    revision: digest.optional(),
    response: z.unknown().optional(),
    cancelled: z.boolean().optional(),
  })
  .strict()
const ownerSchema = z
  .object({ version: z.literal(1), pid: z.number().int().positive(), nonce: id, root: meta })
  .strict()
const issue = (status, requestId, code, revision) => ({
  status,
  requestId,
  ...(revision ? { revision } : {}),
  issues: [
    {
      code,
      message:
        code === 'recovery-required'
          ? 'Récupération locale nécessaire ; les versions sont conservées.'
          : code === 'revision-conflict'
            ? 'Les sources ont changé ; votre brouillon est conservé.'
            : 'Opération refusée ; les sources et reçus doivent être vérifiés.',
    },
  ],
})
export const editorRevision = (entries) =>
  hash(
    canonicalJSON(
      Object.keys(entries)
        .sort()
        .map((file) => ({
          file,
          type: 'file',
          mode: entries[file].mode,
          hash: entries[file].hash,
        })),
    ),
  )
const revision = editorRevision
const publicInfo = (entries) =>
  Object.fromEntries(Object.entries(entries).map(([file, { bytes, ...meta }]) => [file, meta]))
function live(pid) {
  try {
    process.kill(pid, 0)
    return true
  } catch (error) {
    if (error.code === 'ESRCH') return false
    throw error
  }
}
function document(bytes) {
  return parseBounded(bytes.toString('utf8'))
}
function serializeSources(entries, transaction) {
  const result = new Map()
  if (transaction.visualDocument) {
    result.set(tokenPath, Buffer.from(JSON.stringify(transaction.visualDocument, null, 2) + '\n'))
    return result
  }
  if (transaction.imports) {
    result.set(tokenPath, Buffer.from(JSON.stringify(transaction.imports.document, null, 2) + '\n'))
    result.set(
      importsPath,
      Buffer.from(JSON.stringify(transaction.imports.registry, null, 2) + '\n'),
    )
    result.set(importsCSSPath, Buffer.from(transaction.imports.css))
    return result
  }
  if (transaction.variants) {
    const rules = parseBounded(entries[variantsPath].bytes.toString('utf8'))
    rules.set('variants', transaction.variants.variants)
    const bytes = Buffer.from(rules.toString({ lineWidth: 0 }))
    if (!bytes.equals(entries[variantsPath].bytes)) result.set(variantsPath, bytes)
    // A recipe-only transaction must not reserialize or normalize token authorities.
    return result
  }
  const document = parseBounded(entries[tokenPath].bytes.toString('utf8'), {
    format: 'json',
    nodes: 100000,
  })
  const next = updateEditorTokens(document, transaction)
  if (canonicalJSON(document) !== canonicalJSON(next))
    result.set(tokenPath, Buffer.from(JSON.stringify(next, null, 2) + '\n'))
  const catalogDoc = parseBounded(entries[catalogPath].bytes.toString('utf8'))
  if (canonicalJSON(catalogDoc.toJSON()) !== canonicalJSON(transaction.catalog)) {
    catalogDoc.set('categories', transaction.catalog.categories)
    catalogDoc.set('semanticEligibility', transaction.catalog.semanticEligibility)
    result.set(catalogPath, Buffer.from(catalogDoc.toString({ lineWidth: 0 })))
  }
  return result
}
/** Store local : aucune écoute réseau. Les hooks de panne sont injectés uniquement par les tests Node. */
export async function createStore(
  inputRoot,
  {
    fault = async () => {},
    onPause = async () => {},
    onResume = async () => {},
    io = {},
    cancelRequest = null,
  } = {},
) {
  const flush = io.syncDir ?? syncDir,
    durable = io.durableReplace ?? durableReplace
  const root = await fs.realpath(inputRoot)
  await assertDecisionMigrationComplete(root)
  if (
    root !== path.resolve(inputRoot) ||
    !constants.O_NOFOLLOW ||
    typeof process.getuid !== 'function'
  )
    throw new Error('forbidden')
  const rootMeta = identity(await fs.lstat(root)),
    state = path.join(root, stateName)
  await privateDir(state)
  await assertDecisionMigrationComplete(root)
  await flush(root)
  for (const directory of ['records', 'transactions', 'work'])
    await privateDir(path.join(state, directory))
  await flush(state)
  let closed = false,
    busy = false,
    blocked = false,
    queue = Promise.resolve(),
    immutableDigest,
    cached
  const owner = { version: 1, pid: process.pid, nonce: randomUUID(), root: rootMeta }
  const ownerPath = stateName + '/owner.json'
  const fullOwner = path.join(root, ownerPath)
  const readJournal = async (requestId) => {
    const { bytes } = await readSafe(
      root,
      `${stateName}/records/${requestId}.json`,
      64 * 1024 * 1024,
    )
    const record = journalSchema.parse(
      parseBounded(bytes.toString(), { format: 'json', depth: 32, nodes: 100000 }),
    )
    if (['failed', 'committed'].includes(record.phase) && !validateResponse(record.response))
      throw new Error('recovery-required')
    if (['prepared', 'committed'].includes(record.phase) && !record.revision)
      throw new Error('recovery-required')
    if (['pending', 'prepared'].includes(record.phase) && record.response !== undefined)
      throw new Error('recovery-required')
    if (
      record.changes.some((item) => {
        for (const [data, meta] of [
          [item.preimage, item.before],
          [item.postimage, item.after],
        ]) {
          const bytes = Buffer.from(data, 'base64')
          if (
            bytes.length > 2 * 1024 * 1024 ||
            bytes.toString('base64') !== data ||
            hash(bytes) !== meta.hash
          )
            return true
        }
        return false
      })
    )
      throw new Error('recovery-required')
    if (
      record.phase === 'committed' &&
      canonicalJSON(record.response) !==
        canonicalJSON(
          record.cancelled
            ? issue('failed', record.id, 'write-failed')
            : { status: 'saved', requestId: record.id, revision: record.revision },
        )
    )
      throw new Error('recovery-required')
    if (
      record.phase === 'failed' &&
      (!record.response ||
        !['failed', 'conflict', 'invalid'].includes(record.response.status) ||
        record.response.requestId !== record.id)
    )
      throw new Error('recovery-required')
    if (
      record.id !== requestId ||
      record.changes.some(
        (item, index) =>
          item.stage !==
          `${stateName}/transactions/${requestId}/${record.cancelled ? 'cancel-next' : 'next'}/${index}`,
      )
    )
      throw new Error('recovery-required')
    if (
      record.parents.some(
        (item) =>
          item.file.includes('..') ||
          path.isAbsolute(item.file) ||
          !manifestPaths.concat(derivedPaths).some((file) => file.startsWith(item.file + '/')),
      )
    )
      throw new Error('recovery-required')
    if (
      Object.keys(record.before).sort().join('|') !==
      manifestPaths.concat(derivedPaths).sort().join('|')
    )
      throw new Error('recovery-required')
    const expectedParents = [
      ...new Set(
        [...manifestPaths, ...derivedPaths].flatMap((file) => {
          const parts = file.split('/').slice(0, -1)
          return parts.map((_, index) => parts.slice(0, index + 1).join('/'))
        }),
      ),
    ].sort()
    if (
      record.parents
        .map((item) => item.file)
        .sort()
        .join('|') !== expectedParents.join('|') ||
      new Set(record.changes.map((item) => item.file)).size !== record.changes.length ||
      record.progress > record.changes.length ||
      record.changes.some(
        (item) =>
          !sameIdentity(item.before, record.before[item.file]) ||
          item.before.hash !== record.before[item.file].hash,
      )
    )
      throw new Error('recovery-required')
    if (['prepared', 'committed'].includes(record.phase)) {
      const expected = { ...record.before }
      for (const item of record.changes) expected[item.file] = item.after
      if (revision(expected) !== record.revision) throw new Error('recovery-required')
    }
    return record
  }
  async function records() {
    return (await fs.readdir(path.join(state, 'records')))
      .filter((file) => file.endsWith('.json'))
      .map((file) => id.parse(file.slice(0, -5)))
      .sort()
  }
  async function createOwner() {
    const handle = await fs.open(
      fullOwner,
      constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW,
      0o600,
    )
    try {
      await handle.writeFile(JSON.stringify(owner))
      await handle.sync()
    } finally {
      await handle.close()
    }
    await flush(state)
  }
  try {
    await createOwner()
  } catch (error) {
    if (error.code !== 'EEXIST') throw error
    const { bytes, ...oldMeta } = await readSafe(root, ownerPath),
      old = ownerSchema.parse(parseBounded(bytes.toString(), { format: 'json' }))
    if (live(old.pid) || !sameIdentity(old.root, rootMeta)) throw new Error('service-unavailable')
    // Création exclusive : deux repreneurs ne retirent jamais simultanément le même verrou.
    const recovery = path.join(state, 'recovery-owner')
    await fs.mkdir(recovery, { mode: 0o700 })
    try {
      for (const requestId of await records()) await readJournal(requestId)
      const current = await readSafe(root, ownerPath)
      if (!sameIdentity(oldMeta, current) || hash(bytes) !== current.hash || live(old.pid))
        throw new Error('recovery-required')
      await fs.unlink(fullOwner)
      await flush(state)
      await createOwner()
    } finally {
      await fs.rmdir(recovery)
      await flush(state)
    }
  }
  async function rootCheck() {
    if (
      closed ||
      !sameIdentity(rootMeta, identity(await fs.lstat(root))) ||
      (await fs.realpath(root)) !== root
    )
      throw new Error('recovery-required')
    const current = ownerSchema.parse(
      parseBounded((await readSafe(root, ownerPath)).bytes.toString(), { format: 'json' }),
    )
    if (current.nonce !== owner.nonce) throw new Error('recovery-required')
  }
  async function readAll() {
    await rootCheck()
    const entries = {}
    let size = 0
    const parents = new Map()
    for (const file of [...manifestPaths, ...derivedPaths]) {
      const data = await readSafe(root, file)
      entries[file] = data
      size += data.bytes.length
      if (size > 16 * 1024 * 1024) throw new Error('budget-exceeded')
      if (file.endsWith('.yaml')) document(data.bytes)
      const segments = file.split('/').slice(0, -1)
      for (let length = 1; length <= segments.length; length++) {
        const parent = segments.slice(0, length).join('/')
        if (!parents.has(parent))
          parents.set(parent, identity(await fs.lstat(path.join(root, parent))))
      }
    }
    return { entries, parents: [...parents].map(([file, meta]) => ({ file, meta })) }
  }
  async function assertEntries(expected, parents) {
    await rootCheck()
    for (const parent of parents) {
      const stat = await fs.lstat(path.join(root, parent.file))
      if (
        !stat.isDirectory() ||
        stat.isSymbolicLink() ||
        !sameIdentity(parent.meta, identity(stat))
      )
        throw new Error('revision-conflict')
    }
    const { entries } = await readAll()
    for (const [file, info] of Object.entries(expected))
      if (!sameIdentity(info, entries[file]) || info.hash !== entries[file].hash)
        throw new Error('revision-conflict')
    return entries
  }
  const immutable = (entries) =>
    hash(
      canonicalJSON(
        Object.entries(publicInfo(entries))
          .filter(([file]) => !writes.includes(file))
          .map(([file, info]) => ({ file, hash: info.hash, mode: info.mode })),
      ),
    )
  async function tree(entries, at) {
    await fs.mkdir(at, { mode: 0o700 })
    for (const [file, info] of Object.entries(entries)) {
      const full = path.join(at, file)
      await fs.mkdir(path.dirname(full), { recursive: true, mode: 0o700 })
      await fs.writeFile(full, info.bytes, { flag: 'wx', mode: 0o600 })
    }
  }
  async function prepare(entries, model, at) {
    await tree(entries, at)
    if (model)
      for (const [file, bytes] of serializeSources(entries, model))
        await fs.writeFile(path.join(at, file), bytes)
    const result = await prepareEditorArtifacts(at)
    return result
  }
  async function snapshot(includeFiles = false) {
    if (blocked) throw new Error('recovery-required')
    const active = await fs.lstat(path.join(state, 'active')).then(
      () => true,
      (error) => {
        if (error.code === 'ENOENT') return false
        throw error
      },
    )
    if (active) throw new Error('recovery-required')
    const { entries, parents } = await readAll()
    if (immutableDigest && immutable(entries) !== immutableDigest)
      throw new Error('service-unavailable')
    const currentRevision = revision(entries),
      rootId = hash(canonicalJSON({ dev: rootMeta.dev, ino: rootMeta.ino }))
    if (cached?.revision === currentRevision)
      return { ...cached, ...(includeFiles ? { entries, parents } : {}) }
    const at = path.join(state, 'work', randomUUID())
    try {
      const { snapshot } = await prepare(entries, null, at)
      await assertEntries(publicInfo(entries), parents)
      cached = { snapshot, revision: currentRevision, rootId }
      return { ...cached, ...(includeFiles ? { entries, parents } : {}) }
    } finally {
      await fs.rm(at, { recursive: true, force: true })
    }
  }
  const journalFile = (record) => `${stateName}/records/${record.id}.json`
  async function writeRecord(record) {
    await durable(root, journalFile(record), Buffer.from(JSON.stringify(record)))
  }
  async function active(record) {
    await durable(
      root,
      `${stateName}/active`,
      Buffer.from(JSON.stringify({ requestId: record.id })),
    )
    await onPause()
  }
  async function readers() {
    for (const file of await fs.readdir(state))
      if (file.startsWith('reader-') && file.endsWith('.json')) {
        const data = ownerSchema.parse(
          parseBounded((await readSafe(root, stateName + '/' + file)).bytes.toString(), {
            format: 'json',
          }),
        )
        if (live(data.pid)) throw new Error('service-unavailable')
        await fs.unlink(path.join(state, file))
        await flush(state)
      }
  }
  async function clearActive(record) {
    const file = path.join(state, 'active')
    try {
      const current = parseBounded((await readSafe(root, stateName + '/active')).bytes.toString(), {
        format: 'json',
      })
      if (current.requestId !== record.id) throw new Error('recovery-required')
      await fs.unlink(file)
      await flush(state)
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
    }
    await onResume()
  }
  async function publish(record, recovery = false) {
    const expected = { ...record.before }
    if (recovery) {
      const actual = await readAll()
      for (const item of record.changes) {
        const entry = actual.entries[item.file]
        if (sameIdentity(entry, item.after) && entry.hash === item.after.hash)
          expected[item.file] = item.after
        else if (!sameIdentity(entry, item.before) || entry.hash !== item.before.hash)
          throw new Error('recovery-required')
      }
    }
    await assertEntries(expected, record.parents)
    for (const [index, item] of record.changes.entries()) {
      if (expected[item.file] === item.after) continue
      await fault('before-replace', index)
      await assertEntries(expected, record.parents)
      const candidate = await readSafe(root, item.stage)
      if (
        !sameIdentity(candidate, item.after) ||
        candidate.hash !== item.after.hash ||
        candidate.bytes.toString('base64') !== item.postimage
      )
        throw new Error('recovery-required')
      await checkParents(root, item.file)
      await fs.rename(path.join(root, item.stage), path.join(root, item.file))
      await flush(path.dirname(path.join(root, item.file)))
      expected[item.file] = item.after
      await fault('after-replace', index)
      record.progress = index + 1
      await writeRecord(record)
      await fault('after-progress', index)
    }
    await assertEntries(expected, record.parents)
    if (revision(expected) !== record.revision) throw new Error('recovery-required')
    await fault('before-committed')
    record.phase = 'committed'
    record.response = record.cancelled
      ? issue('failed', record.id, 'write-failed')
      : { status: 'saved', requestId: record.id, revision: record.revision }
    await writeRecord(record)
    await fault('after-committed')
    await clearActive(record)
    return record.response
  }
  async function inspectPrepared(record) {
    const { entries } = await readAll()
    for (const item of record.changes) {
      const actual = entries[item.file]
      if (
        !(sameIdentity(actual, item.before) && actual.hash === item.before.hash) &&
        !(sameIdentity(actual, item.after) && actual.hash === item.after.hash)
      )
        throw new Error('recovery-required')
    }
    const expected = { ...record.before }
    for (const item of record.changes) {
      const current = entries[item.file]
      if (sameIdentity(current, item.after) && current.hash === item.after.hash)
        expected[item.file] = item.after
    }
    await assertEntries(expected, record.parents)
    const cancelling = cancelRequest === record.id && !record.cancelled
    const prospective = { ...entries }
    for (const item of record.changes)
      prospective[item.file] = {
        ...item.after,
        bytes: Buffer.from(cancelling ? item.preimage : item.postimage, 'base64'),
      }
    const at = path.join(state, 'work', randomUUID())
    try {
      const { outputs } = await prepare(prospective, null, at)
      for (const [file, bytes] of outputs)
        if (hash(bytes) !== hash(prospective[file].bytes)) throw new Error('recovery-required')
    } finally {
      await fs.rm(at, { recursive: true, force: true })
    }
    if (cancelling) {
      await durable(
        root,
        `${stateName}/transactions/${record.id}/original.json`,
        Buffer.from(JSON.stringify(record)),
      )
      await privateDir(path.join(state, 'transactions', record.id, 'cancel-next'))
      await flush(path.join(state, 'transactions', record.id))
      const original = record.changes
      record.before = publicInfo(entries)
      record.changes = []
      record.progress = 0
      record.cancelled = true
      const post = { ...record.before }
      for (const previous of original) {
        const bytes = Buffer.from(previous.preimage, 'base64')
        if (hash(bytes) === entries[previous.file].hash) continue
        const stage = `${stateName}/transactions/${record.id}/cancel-next/${record.changes.length}`
        await durable(root, stage, bytes, previous.before.mode)
        const after = await readSafe(root, stage)
        const item = {
          file: previous.file,
          before: record.before[previous.file],
          after: { ...identity(after), hash: after.hash },
          preimage: entries[previous.file].bytes.toString('base64'),
          postimage: bytes.toString('base64'),
          stage,
        }
        record.changes.push(item)
        post[item.file] = item.after
      }
      record.revision = revision(post)
      await writeRecord(record)
    }
  }
  async function recover() {
    const requestIds = await records()
    if (cancelRequest !== null) {
      id.parse(cancelRequest)
      if (!requestIds.includes(cancelRequest)) throw new Error('unknown-reference')
      const selected = await readJournal(cancelRequest)
      if (
        !['prepared', 'pending'].includes(selected.phase) &&
        !(selected.phase === 'committed' && selected.cancelled)
      )
        throw new Error('forbidden')
    }
    for (const requestId of cancelRequest === null ? requestIds : [cancelRequest]) {
      const record = await readJournal(requestId)
      if (!sameIdentity(record.root, rootMeta)) throw new Error('recovery-required')
      if (record.phase === 'prepared') {
        await active(record)
        await readers()
        await inspectPrepared(record)
        await publish(record, true)
      } else if (record.phase === 'pending') {
        await assertEntries(record.before, record.parents)
        record.phase = 'failed'
        record.response = issue('failed', record.id, 'write-failed')
        await writeRecord(record)
        await clearActive(record)
      } else if (record.phase === 'failed') {
        const marker = await fs.lstat(path.join(state, 'active')).then(
          () => true,
          (error) => {
            if (error.code === 'ENOENT') return false
            throw error
          },
        )
        if (marker) {
          const current = parseBounded(
            (await readSafe(root, stateName + '/active')).bytes.toString(),
            { format: 'json' },
          )
          if (current.requestId === record.id) {
            await assertEntries(record.before, record.parents)
            await clearActive(record)
          }
        }
      } else if (record.phase === 'committed') {
        // Une réponse perdue garde son reçu ; ne réapplique jamais ses opérations.
        const marker = await fs.lstat(path.join(state, 'active')).then(
          () => true,
          (error) => {
            if (error.code === 'ENOENT') return false
            throw error
          },
        )
        if (marker) {
          const a = parseBounded((await readSafe(root, stateName + '/active')).bytes.toString(), {
            format: 'json',
          })
          if (a.requestId === record.id) await clearActive(record)
        }
      }
    }
    if (
      await fs.lstat(path.join(state, 'active')).then(
        () => true,
        (error) => {
          if (error.code === 'ENOENT') return false
          throw error
        },
      )
    )
      throw new Error('recovery-required')
  }
  try {
    await recover()
    immutableDigest = immutable((await readAll()).entries)
  } catch (error) {
    blocked = true
    await close()
    throw error
  }
  async function save(request, variantMode = false, importMode = false, visualMode = false) {
    // La frontière HTTP doit déjà avoir validé taille, format et schéma.
    const { saveRequestSchema } = await import('../../src/design-system/editor/operations.ts')
    request = visualMode
      ? visualWriteSchema.parse(request)
      : importMode
        ? importedRequestSchema.parse(request)
        : variantMode
          ? variantRequestSchema.parse(request)
          : saveRequestSchema.parse(request)
    const bodyHash = hash(canonicalJSON(request))
    try {
      const old = await readJournal(request.requestId)
      if (old.bodyHash !== bodyHash)
        return issue('conflict', request.requestId, 'request-id-reused')
      if (old.phase === 'prepared' || old.phase === 'pending')
        return {
          status: blocked ? 'recovery-required' : 'pending',
          requestId: request.requestId,
          ...(blocked
            ? {
                issues: [{ code: 'recovery-required', message: 'Récupération locale nécessaire.' }],
              }
            : {}),
        }
      return old.response
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
    }
    if (blocked) return issue('recovery-required', request.requestId, 'recovery-required')
    const base = await snapshot(true)
    const entries = await assertEntries(publicInfo(base.entries), base.parents),
      parents = base.parents
    const record = {
      version: 1,
      id: request.requestId,
      bodyHash,
      baseRevision: request.baseRevision,
      root: rootMeta,
      parents,
      before: publicInfo(entries),
      changes: [],
      phase: 'pending',
      progress: 0,
    }
    await writeRecord(record)
    if (base.revision !== request.baseRevision) {
      record.phase = 'failed'
      record.response = issue('conflict', request.requestId, 'revision-conflict', base.revision)
      await writeRecord(record)
      return record.response
    }
    let model
    try {
      if (visualMode) {
        model = { ...projectTransaction(base.snapshot, []), visualDocument: request.document }
      } else if (importMode) {
        model = {
          ...projectTransaction(base.snapshot, []),
          imports: compileImportedComponents(
            JSON.parse(entries[tokenPath].bytes.toString('utf8')),
            request.registry,
            JSON.parse(entries[importsPath].bytes.toString('utf8')),
          ),
        }
      } else if (variantMode) {
        const rules = parseBounded(entries[variantsPath].bytes.toString('utf8')).toJSON()
        model = {
          ...projectTransaction(base.snapshot, []),
          variants: applyVariantRules(rules, request, base.snapshot),
        }
      } else model = applyRequest(base.snapshot, request)
      await validateFontResources(root, model.model)
    } catch (error) {
      const codes = [
        'style-exists',
        'unknown-reference',
        'incompatible-style',
        'incompatible-intention',
        'duplicate-id',
        'id-collision',
        'forbidden-cycle',
        'css-collision',
        'budget-exceeded',
      ]
      const code = codes.includes(error.message) ? error.message : 'invalid-value'
      record.phase = 'failed'
      record.response = issue('invalid', request.requestId, code)
      await writeRecord(record)
      return record.response
    }
    busy = true
    let prepared = false
    const transaction = path.join(state, 'transactions', record.id),
      at = path.join(transaction, 'tree')
    try {
      await active(record)
      await readers()
      await fault('pending')
      await fs.mkdir(transaction, { mode: 0o700 })
      await privateDir(path.join(transaction, 'next'))
      const result = await prepare(entries, model, at)
      const texts = serializeSources(entries, model)
      for (const [file, bytes] of result.outputs) texts.set(file, bytes)
      const post = { ...record.before }
      for (const [file, bytes] of texts) {
        if (!writes.includes(file)) throw new Error('forbidden')
        if (bytes.length > 2 * 1024 * 1024) throw new Error('budget-exceeded')
        if (hash(bytes) === entries[file].hash) continue
        await fs.access(path.dirname(path.join(root, file)), constants.W_OK | constants.X_OK)
        const index = record.changes.length,
          stage = `${stateName}/transactions/${record.id}/next/${index}`
        await durable(root, stage, bytes, entries[file].mode)
        const after = await readSafe(root, stage)
        record.changes.push({
          file,
          before: record.before[file],
          after: { ...identity(after), hash: after.hash },
          preimage: entries[file].bytes.toString('base64'),
          postimage: bytes.toString('base64'),
          stage,
        })
        post[file] = record.changes.at(-1).after
      }
      await flush(transaction)
      await flush(path.dirname(transaction))
      await fault('before-prepared')
      await assertEntries(record.before, parents)
      record.revision = revision(post)
      record.phase = 'prepared'
      await writeRecord(record)
      prepared = true
      await fault('prepared')
      return await publish(record)
    } catch (error) {
      if (prepared) {
        blocked = true
        return issue('recovery-required', record.id, 'recovery-required')
      }
      record.phase = 'failed'
      record.response = issue(
        error.message === 'revision-conflict' ? 'conflict' : 'failed',
        record.id,
        error.message === 'revision-conflict' ? 'revision-conflict' : 'write-failed',
      )
      await writeRecord(record)
      await clearActive(record)
      return record.response
    } finally {
      busy = false
    }
  }
  function serial(action) {
    const promise = queue.then(() => {
      if (closed) throw new Error('service-unavailable')
      return action()
    })
    queue = promise.catch(() => {})
    return promise
  }
  async function close() {
    if (closed) return
    closed = true
    try {
      const current = ownerSchema.parse(
        parseBounded((await readSafe(root, ownerPath)).bytes.toString(), { format: 'json' }),
      )
      if (current.nonce === owner.nonce) {
        await fs.unlink(fullOwner)
        await flush(state)
      }
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
    }
  }
  return {
    snapshot: () => serial(snapshot),
    readFontAsset: (pathname) => serial(() => readFontAsset(root, pathname)),
    importFont: (id) =>
      serial(async () => {
        if (blocked || busy) throw new Error('recovery-required')
        return importFont(root, id)
      }),
    save: (request) => serial(() => save(request)),
    saveVariant: (request) => serial(() => save(request, true)),
    saveImport: (request) => serial(() => save(request, false, true)),
    saveVisual: (request) => serial(() => save(request, false, false, true)),
    status: (requestId) =>
      serial(async () => {
        id.parse(requestId)
        try {
          const record = await readJournal(requestId)
          return (
            record.response ??
            (record.phase === 'prepared'
              ? issue('recovery-required', requestId, 'recovery-required')
              : { status: 'pending', requestId })
          )
        } catch (error) {
          if (error.code === 'ENOENT') return { status: 'unknown', requestId }
          throw error
        }
      }),
    close: () => queue.then(close),
    get busy() {
      return busy || blocked
    },
  }
}
