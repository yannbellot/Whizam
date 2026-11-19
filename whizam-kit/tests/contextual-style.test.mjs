import assert from 'node:assert/strict'
import test from 'node:test'
import { randomUUID } from 'node:crypto'
import { workspaceSchema } from '../src/core/workspace-contract.ts'
import {
  compileStyleTarget,
  contextualStyleRequest,
  styleRuleKey,
} from '../src/core/contextual-style.ts'

const [projectId, pageId, ownerId, childId, first, second, nested, occurrenceId, marker] =
  Array.from({ length: 9 }, () => randomUUID())
const revision = 'd'.repeat(64)
const model = workspaceSchema.parse({
  schemaVersion: 1,
  projectId,
  revision,
  entities: [
    { kind: 'page', id: pageId, revision, label: 'Page', path: '/' },
    {
      kind: 'component',
      id: ownerId,
      revision,
      label: 'Arbre',
      sourceKey: 'tree',
      placements: [
        { id: first, definitionId: ownerId },
        { id: second, definitionId: childId },
      ],
    },
    {
      kind: 'component',
      id: childId,
      revision,
      label: 'Feuille',
      sourceKey: 'leaf',
      placements: [{ id: nested, definitionId: ownerId }],
    },
    {
      kind: 'occurrence',
      id: occurrenceId,
      revision,
      label: 'Arbre sur la page',
      pageId,
      marker,
      variantId: null,
      definitionId: ownerId,
    },
  ],
})

test('self-nested components retain the whole registered path and the exact writer owner', () => {
  const path = [first, second, nested]
  const target = { kind: 'placement', ownerId, placements: path, part: 'text' }
  const placement = compileStyleTarget(model, target)
  assert.deepEqual(placement.writeIds, [ownerId])
  assert.deepEqual(placement.rendered.placements, [
    { id: first, definition: 'tree' },
    { id: second, definition: 'leaf' },
    { id: nested, definition: 'tree' },
  ])
  const instance = compileStyleTarget(model, {
    kind: 'instance',
    pageId,
    occurrenceId,
    placements: path,
    part: 'text',
  })
  assert.deepEqual(instance.writeIds, [occurrenceId])
  assert.deepEqual(instance.rendered.markers, [marker])
  assert.equal(instance.pagePath, '/')
  assert.throws(
    () => compileStyleTarget(model, { ...target, placements: [nested] }),
    /visual-target/,
  )
  assert.notEqual(
    styleRuleKey({ target, state: 'default', condition: null }),
    styleRuleKey({ target, state: 'hover', condition: null }),
  )
})

test('requests admit only bounded registered-path syntax and CSS declaration values', () => {
  const request = {
    id: randomUUID(),
    revision,
    target: { kind: 'placement', ownerId, placements: [second], part: 'root' },
    state: 'hover',
    condition: '(max-width: 800px)',
    changes: [{ property: 'background-color', value: '#12345680' }],
  }
  assert.deepEqual(contextualStyleRequest.parse(request), request)
  assert.equal(
    contextualStyleRequest.safeParse({ ...request, target: { ...request.target, placements: [] } })
      .success,
    false,
  )
  assert.equal(
    contextualStyleRequest.safeParse({
      ...request,
      changes: [{ property: 'color', value: 'red} body { color: blue' }],
    }).success,
    false,
  )
  assert.equal(contextualStyleRequest.safeParse({ ...request, condition: 'all' }).success, false)
})

test('definition values use canonical existing bindings and typed tokens for new properties', async () => {
  const { loadTokens, readTokens } = await import('../scripts/dtcg-tokens.mjs')
  const { loadCanonicalEditorModel } = await import('../scripts/validate-editor-contract.mjs')
  const { planVisualDefinitionTokens, readVisualTokenStyles } =
    await import('../scripts/visual-tokens.mjs')
  const root = new URL('..', import.meta.url).pathname
  const source = await loadTokens(root)
  const base = await loadCanonicalEditorModel(root)
  const snapshot = {
    model: base.model,
    contract: base.context.contract,
    catalog: base.context.catalog,
    legacy: base.authorities['semantic-tokens'].tokens,
  }
  const context = {
    owner: 'button',
    variant: 'default',
    part: 'root',
    state: 'default',
    condition: null,
  }
  const edits = [
    {
      ...context,
      changes: [
        { property: 'background-color', value: '#22446680' },
        { property: 'opacity', value: '0.75' },
        { property: 'box-shadow', value: '0 2px 8px #00000080, inset 0 0 2px #112233' },
        { property: 'padding', value: '4px 1rem 6px 10%' },
        { property: 'grid-template-columns', value: 'repeat(2, minmax(0, 1fr))' },
      ],
    },
  ]
  const plan = planVisualDefinitionTokens(source.document, snapshot, edits)
  assert.deepEqual(plan.issues, [])
  const next = readTokens(plan.document)
  const background = next.ids.get('component.button.default.root.background.default')
  assert.equal(background.value.alpha, 128 / 255)
  assert.equal(background.meta.collection, 'editor')
  const shared = source.ids.get('semantic.color.action.primary.background.default')
  assert.deepEqual(next.ids.get(shared.id).value, shared.value)
  const visual = next.entries.filter(
    (entry) => entry.meta.kind === 'component' && entry.meta.collection === 'visual',
  )
  assert.ok(visual.some((entry) => entry.type === 'shadow' && entry.value.length === 2))
  const [rule] = readVisualTokenStyles(plan.document)
  assert.equal(rule.declarations.opacity, '0.75')
  assert.equal(rule.declarations.padding, '4px 1rem 6px 10%')
  assert.equal(rule.declarations['grid-template-columns'], 'repeat(2, minmax(0, 1fr))')
  const repeat = planVisualDefinitionTokens(plan.document, snapshot, edits)
  assert.deepEqual(repeat.document, plan.document)

  const refused = planVisualDefinitionTokens(source.document, snapshot, [
    {
      ...context,
      changes: [
        { property: 'opacity', value: '0.5' },
        { property: 'background-color', value: 'var(--mixed-source)' },
      ],
    },
  ])
  assert.equal(refused.document, undefined)
  assert.deepEqual(refused.issues, [
    { ...context, property: 'background-color', value: 'var(--mixed-source)' },
  ])
  assert.deepEqual(readVisualTokenStyles(source.document), [])
})

test('migration recovery publishes the saved token graph and preserves instance data', async (t) => {
  const fs = await import('node:fs/promises')
  const path = await import('node:path')
  const { fileURLToPath } = await import('node:url')
  const { copyFixture } = await import('../scripts/test-local-app.mjs')
  const { WorkspaceStore } = await import('../scripts/core/workspace.ts')
  const { applyDesign, designSnapshot, undoDesign, visualDesignAuthority } =
    await import('../scripts/core/workspace-design.ts')
  const { loadTokens, tokenPath } = await import('../scripts/dtcg-tokens.mjs')
  const { planVisualDefinitionTokens } = await import('../scripts/visual-tokens.mjs')
  const { contextualStylePath } = await import('../src/core/contextual-style.ts')
  const parent = fileURLToPath(new URL('../test-results/contextual-recovery/', import.meta.url))
  await fs.mkdir(parent, { recursive: true })
  const root = await fs.mkdtemp(path.join(parent, 'project-'))
  t.after(() => fs.rm(root, { recursive: true, force: true }))
  await copyFixture(root, { includeDependencies: false })
  const projectId = randomUUID(),
    owner = randomUUID(),
    page = randomUUID(),
    occurrence = randomUUID()
  const revision = 'a'.repeat(64)
  const context = {
    owner: 'button',
    variant: 'default',
    part: 'root',
    state: 'default',
    condition: null,
  }
  const retained = {
    target: {
      kind: 'instance',
      pageId: page,
      occurrenceId: occurrence,
      placements: [],
      part: 'root',
    },
    state: 'default',
    condition: null,
    declarations: { opacity: '0.52' },
  }
  const beforeStyles = JSON.stringify([
    {
      target: { kind: 'definition', ownerId: owner, variant: 'default', part: 'root' },
      state: 'default',
      condition: null,
      declarations: { opacity: '0.75' },
    },
    retained,
  ])
  const nextStyles = JSON.stringify([retained], null, 2) + '\n'
  await fs.writeFile(
    path.join(root, 'loomata.project.json'),
    JSON.stringify({ version: 1, phase: 'created', id: projectId }),
  )
  await fs.writeFile(path.join(root, contextualStylePath), beforeStyles)
  const store = new WorkspaceStore(root, async (phase) => {
    if (phase === 'design-saved') throw new Error('test-migration-interruption')
  })
  await store.git(['init', '-b', 'main'])
  await store.git(['add', '.'])
  await store.git(['commit', '-m', 'test: establish migration fixture'])
  await store.initialize({
    schemaVersion: 1,
    projectId,
    revision,
    entities: [
      { id: owner, kind: 'component', sourceKey: 'button', label: 'Button', revision },
      { id: page, kind: 'page', path: '/', label: 'Accueil', revision },
      {
        id: occurrence,
        kind: 'occurrence',
        definitionId: owner,
        pageId: page,
        variantId: null,
        marker: randomUUID(),
        label: 'Bouton',
        revision,
      },
    ],
  })
  await store.git(['add', 'loomata/workspace.json'])
  await store.git(['commit', '-m', 'test: register migration scope'])
  const treeId = await store.openTree('draft')
  const draft = store.treeRoot(treeId)
  const beforeAuthority = await store.read(tokenPath, draft)
  const initial = await designSnapshot(store, treeId)
  const document = (await loadTokens(draft)).document
  const plan = planVisualDefinitionTokens(document, initial.snapshot, [
    {
      ...context,
      changes: [{ property: 'opacity', value: '0.75' }],
    },
  ])
  assert.deepEqual(plan.issues, [])
  const id = randomUUID()
  const input = {
    id,
    revision,
    targets: [owner],
    requireSelected: true,
    request: {
      protocolVersion: 7,
      requestId: id,
      baseRevision: initial.revision,
      document: plan.document,
      previousStyles: beforeStyles,
      nextStyles,
    },
  }
  await assert.rejects(applyDesign(store, treeId, input), /visual-design-authority-required/)
  await assert.rejects(
    applyDesign(store, treeId, input, visualDesignAuthority),
    /test-migration-interruption/,
  )
  assert.equal(await store.read(contextualStylePath, draft), beforeStyles)
  const resumed = new WorkspaceStore(root)
  const project = await resumed.snapshot()
  const saved = project.trees.find((tree) => tree.id === treeId)
  assert.equal(await resumed.read(contextualStylePath, draft), nextStyles)
  assert.notEqual(await resumed.read(tokenPath, draft), beforeAuthority)
  const receipt = await applyDesign(resumed, treeId, input, visualDesignAuthority)
  assert.equal(receipt.revision, saved.revision)
  await undoDesign(resumed, treeId, id, saved.revision, true)
  assert.equal(await resumed.read(contextualStylePath, draft), beforeStyles)
  assert.equal(await resumed.read(tokenPath, draft), beforeAuthority)

  const undone = await resumed.tree(await resumed.state(), treeId)
  await resumed.apply(treeId, {
    id: randomUUID(),
    origin: 'inspector',
    revision: undone.model.revision,
    targets: [occurrence],
    edits: [{ file: contextualStylePath, before: beforeStyles, after: nextStyles }],
  })
  const latest = await resumed.tree(await resumed.state(), treeId)
  const pastDesignEdits = Object.values(latest.receipts)
    .filter((item) => item.design)
    .flatMap((item) => item.edits)
  assert.ok(pastDesignEdits.length > 0)
  assert.ok(pastDesignEdits.every((edit) => 'afterDigest' in edit))
  await resumed.assertSourceState(latest)
  await fs.appendFile(path.join(draft, tokenPath), '\n')
  await assert.rejects(resumed.assertSourceState(latest), /workspace-file-conflict/)
})
