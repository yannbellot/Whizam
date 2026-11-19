import { describe, expect, test } from 'vitest'
import {
  elementConversationKey,
  findSourceEntity,
  renameEntity,
  workspaceSchema,
} from '../../src/core/workspace-contract'
const id = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`
const revision = 'a'.repeat(64)
const base = (n: number) => ({ id: id(n), label: `Element ${n}`, revision })
function fixture() {
  return {
    schemaVersion: 1,
    projectId: id(99),
    revision,
    entities: [
      { ...base(1), kind: 'page' },
      { ...base(2), kind: 'page' },
      { ...base(3), kind: 'component', sourceKey: 'Button' },
      { ...base(4), kind: 'variant', definitionId: id(3) },
      { ...base(5), kind: 'occurrence', pageId: id(1), definitionId: id(3), variantId: id(4) },
      { ...base(6), kind: 'occurrence', pageId: id(2), definitionId: id(3), variantId: null },
      { ...base(7), kind: 'token', sourceKey: 'button.default.root.color.default' },
      {
        ...base(8),
        kind: 'flow',
        pageIds: [id(1), id(2)],
        edges: [
          { from: id(1), to: id(2), condition: 'Allowed' },
          { from: id(2), to: id(1), condition: null },
        ],
        realization: 'planned',
        evidence: null,
      },
      { ...base(9), kind: 'request' },
      { ...base(10), kind: 'request' },
      { ...base(11), kind: 'task', requestIds: [id(9), id(10)] },
      { ...base(12), kind: 'task', requestIds: [id(9)] },
      {
        ...base(13),
        kind: 'modification',
        taskIds: [id(11), id(12)],
        targetIds: [id(5), id(7), id(8)],
        state: 'applied',
        evidenceRevision: null,
      },
      {
        ...base(14),
        kind: 'modification',
        taskIds: [id(11)],
        targetIds: [id(6)],
        state: 'validated',
        evidenceRevision: revision,
      },
      { ...base(15), kind: 'commit', modificationIds: [id(13), id(14)], gitOid: 'b'.repeat(40) },
      { ...base(16), kind: 'commit', modificationIds: [id(14)], gitOid: 'c'.repeat(40) },
      {
        ...base(17),
        kind: 'workItem',
        taskIds: [id(11), id(12)],
        commitIds: [id(15), id(16)],
        state: 'pending',
      },
      {
        ...base(18),
        kind: 'decision',
        targetIds: [id(7), id(8)],
        outcome: 'defer',
        rationale: 'Review dependencies',
      },
    ],
  }
}
describe('workspace identities and durable relations', () => {
  test('renaming an implemented flow invalidates its evidence', () => {
    const input = fixture()
    Object.assign(input.entities[7], {
      realization: 'implemented',
      evidence: { revision, result: 'passed' },
    })
    const renamed = renameEntity(input, id(8), 'Changed flow', 'e'.repeat(64))
    expect(renamed.entities[7]).toMatchObject({ revision: 'e'.repeat(64), evidence: null })
  })
  test('renaming a validated modification returns it to applied', () => {
    const renamed = renameEntity(fixture(), id(14), 'Changed modification', 'e'.repeat(64))
    expect(renamed.entities[13]).toMatchObject({ state: 'applied', evidenceRevision: null })
  })

  test('round-trips representative many-to-many relations without a database', () => {
    const input = fixture()
    expect(workspaceSchema.parse(JSON.parse(JSON.stringify(input)))).toEqual(input)
  })
  test('renames without changing relations, source mapping or private conversation key', () => {
    const input = fixture()
    const key = elementConversationKey(input.projectId, id(3))
    const renamed = renameEntity(input, id(3), 'Renamed button', 'e'.repeat(64))
    expect(findSourceEntity(renamed, 'component', 'Button')).toBe(id(3))
    expect(elementConversationKey(renamed.projectId, id(3))).toBe(key)
    expect(renamed.entities.filter((e) => e.id !== id(3))).toEqual(
      input.entities.filter((e) => e.id !== id(3)),
    )
    expect(input.entities[2].label).toBe('Element 3')
    expect(renamed.revision).toBe('e'.repeat(64))
    expect(() => renameEntity(input, id(3), 'Again', revision)).toThrow('unchanged-revision')
    expect(findSourceEntity(renamed, 'token', 'Button')).toBeNull()
  })
  test.each([
    { index: 3, patch: { definitionId: id(1) } },
    { index: 4, patch: { pageId: id(88) } },
    { index: 4, patch: { variantId: id(3) } },
    { index: 10, patch: { requestIds: [id(3)] } },
    { index: 11, patch: { requestIds: [id(9), id(9)] } },
    { index: 12, patch: { targetIds: [id(11)] } },
    { index: 13, patch: { evidenceRevision: null } },
    { index: 13, patch: { evidenceRevision: 'd'.repeat(64) } },
    { index: 14, patch: { modificationIds: [id(11)] } },
    { index: 16, patch: { commitIds: [id(3)] } },
    { index: 17, patch: { targetIds: [id(88)] } },
    { index: 7, patch: { edges: [{ from: id(1), to: id(3), condition: null }] } },
    { index: 7, patch: { evidence: { revision, result: 'passed' } } },
  ])('refuses invalid references or evidence: $index $patch', ({ index, patch }) => {
    const input = fixture()
    Object.assign(input.entities[index], patch)
    expect(workspaceSchema.safeParse(input).success).toBe(false)
  })
  test('rejects a variant from another definition', () => {
    const input = fixture()
    input.entities.push({ ...base(19), kind: 'component', sourceKey: 'Panel' })
    Object.assign(input.entities[3], { definitionId: id(19) })
    expect(workspaceSchema.safeParse(input).success).toBe(false)
  })
  test('rejects duplicate identities and source mappings', () => {
    const input = fixture()
    input.entities.push({
      ...base(19),
      kind: 'token',
      sourceKey: 'button.default.root.color.default',
    })
    expect(workspaceSchema.safeParse(input).success).toBe(false)
    input.entities.pop()
    input.entities.push(input.entities[0])
    expect(workspaceSchema.safeParse(input).success).toBe(false)
  })
  test('refuses private state, unknown versions and extra entity fields', () => {
    expect(workspaceSchema.safeParse({ ...fixture(), conversations: [] }).success).toBe(false)
    expect(workspaceSchema.safeParse({ ...fixture(), schemaVersion: 2 }).success).toBe(false)
    const input = fixture()
    Object.assign(input.entities[0], { nativeId: 'private-session' })
    expect(workspaceSchema.safeParse(input).success).toBe(false)
  })
  test('fails closed on missing identity and invalid conversation keys', () => {
    expect(() => renameEntity(fixture(), id(88), 'Unknown', 'e'.repeat(64))).toThrow(
      'unknown-identity',
    )
    expect(() => elementConversationKey('../private', id(3))).toThrow()
  })
})
