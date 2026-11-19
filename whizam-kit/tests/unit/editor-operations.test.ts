import { describe, test, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import Ajv from 'ajv/dist/2020.js'
import { snapshot } from '../fixtures/legacy-editor-snapshot'
import {
  applyOperations,
  applyRequest,
  operationsFromChanges,
  saveRequestSchema,
} from '../../src/design-system/editor/operations'
import {
  emptyChanges,
  setLocal,
  setShared,
  projectValues,
} from '../../src/design-system/editor/draft'
import type { EditorOperation } from '../../src/design-system/editor/contract'

const target = 'component.button.default.root.background.default'
const field = 'component.field.single-line.control.background.default'
const style = snapshot.model.bindings.find((item) => item.id === target)!.style!
const request = {
  protocolVersion: 4,
  requestId: '12345678-1234-4123-8123-123456789abc',
  baseRevision: 'a'.repeat(64),
  operations: [{ kind: 'set-component-token', target, value: '#123456' }],
}
const rendered = (model: typeof snapshot.model) =>
  projectValues({ ...snapshot, model }, emptyChanges())

describe('ordered editor operations without persistence', () => {
  test('creates a normalized exception without mutating base or original attribution', () => {
    const before = JSON.stringify(snapshot)
    const model = applyRequest(snapshot, {
      ...request,
      operations: [{ kind: 'set-component-token', target, value: '#abc' }],
    }).model
    const binding = model.bindings.find((item) => item.id === target)!
    expect(binding.style).toBe(style)
    expect(binding.provenance).toMatchObject({
      kind: 'designer-edit',
      status: 'proposed',
    })
    expect(rendered(model).bindings[target]).toBe('#aabbcc')
    expect(JSON.stringify(snapshot)).toBe(before)
  })
  test('reuses only exact normalized type/value without changing its origin', () => {
    const model = applyOperations(snapshot, [
      { kind: 'set-component-token', target, value: '#1d4ed8' },
    ])
    expect(model.primitives).toEqual(snapshot.model.primitives)
    expect(model.bindings.find((item) => item.id === target)!.provenance!.kind).toBe(
      'designer-edit',
    )
    const other = applyOperations(snapshot, [
      { kind: 'set-component-token', target, value: '#123456' },
    ])
    expect(other.primitives).toHaveLength(snapshot.model.primitives.length + 1)
    expect(other.primitives.at(-1)!.id).toBe('primitive.color.hex-123456')
    expect(
      applyOperations(snapshot, [{ kind: 'set-component-token', target, value: '#123456' }]),
    ).toEqual(other)
  })
  test('preserves local values under shared updates then restores current shared value', () => {
    const model = applyOperations(snapshot, [
      { kind: 'set-component-token', target, value: '#123456' },
      { kind: 'update-shared', style, value: '#345678' },
    ])
    expect(rendered(model).bindings[target]).toBe('#123456')
    const restored = applyOperations({ ...snapshot, model }, [{ kind: 'restore', target }])
    expect(rendered(restored).bindings[target]).toBe('#345678')
    expect(restored.bindings.find((item) => item.id === target)!.style!).toBe(style)
    expect(
      restored.primitives.filter((item) =>
        snapshot.model.primitives.some((old) => old.id === item.id),
      ),
    ).toEqual(snapshot.model.primitives)
  })
  test('creates and assigns one absent identity, then permits ordered reuse of that style', () => {
    const created = 'semantic.color.action.recovery.background.default'
    const model = applyOperations(snapshot, [
      { kind: 'create-and-assign', target, intention: 'actions.recovery', value: '#abc' },
      { kind: 'assign', target: field, style: created },
      { kind: 'update-shared', style: created, value: '#123456' },
    ])
    expect(model.styles.filter((item) => item.id === created)).toHaveLength(1)
    expect(rendered(model).bindings[field]).toBe('#123456')
    expect(rendered(model).bindings[target]).toBe('#123456')
    expect(() =>
      applyOperations(snapshot, [
        { kind: 'assign', target: field, style: created },
        { kind: 'create-and-assign', target, intention: 'actions.recovery', value: '#abc' },
      ]),
    ).toThrow('unknown-reference')
  })
  test('existing style identity rejects creation even at equal value with no partial effects', () => {
    const before = JSON.stringify(snapshot)
    expect(() =>
      applyOperations(snapshot, [
        { kind: 'set-component-token', target, value: '#abc' },
        { kind: 'create-and-assign', target, intention: 'actions.primary', value: '#1d4ed8' },
      ]),
    ).toThrow('style-exists')
    expect(JSON.stringify(snapshot)).toBe(before)
  })
  test('assignment removes an exception and isolates other component tuples', () => {
    const before = rendered(snapshot.model)
    const withException = applyOperations(snapshot, [
      { kind: 'set-component-token', target: field, value: '#123456' },
    ])
    const candidate = applyOperations({ ...snapshot, model: withException }, [
      { kind: 'assign', target: field, style },
    ])
    expect(candidate.bindings.find((item) => item.id === field)!.provenance).toBeUndefined()
    expect(rendered(candidate).bindings[field]).toBe(before.styles[style])
    expect(
      rendered(candidate).bindings['component.select-field.default.control.background.default'],
    ).toBe(before.bindings['component.select-field.default.control.background.default'])
  })
  test('rejects role, state, category, value and graph errors on the complete candidate', () => {
    const bad: unknown[] = [
      [{ kind: 'assign', target, style: 'semantic.color.action.primary.text.default' }],
      [{ kind: 'assign', target, style: 'semantic.color.action.primary.background.hover' }],
      [{ kind: 'create-and-assign', target, intention: 'unknown.intention', value: '#fff' }],
      [{ kind: 'set-component-token', target, value: 'url(file)' }],
      [{ kind: 'restore', target: 'component.unknown.default.root.background.default' }],
      [{ kind: 'update-shared', style: 'semantic.unknown.value.default', value: 1 }],
    ]
    for (const operations of bad) expect(() => applyOperations(snapshot, operations)).toThrow()
    const ring = snapshot.model.bindings.find((item) => item.property === 'ringOffset')!
    expect(() =>
      applyOperations(snapshot, [
        { kind: 'update-shared', style: ring.style, value: 'invalid-unit' },
      ]),
    ).toThrow()
  })
  test('does not convert units or mutate equal-valued primitives shared by unrelated styles', () => {
    const padding = snapshot.model.bindings.find(
      (item) => item.target === 'button' && item.property === 'paddingInline',
    )!
    const a = applyOperations(snapshot, [
      { kind: 'set-component-token', target: padding.id, value: '1rem' },
    ])
    const b = applyOperations({ ...snapshot, model: a }, [
      { kind: 'set-component-token', target: padding.id, value: '16px' },
    ])
    expect(b.bindings.find((item) => item.id === padding.id)!.reference).not.toBe(
      a.bindings.find((item) => item.id === padding.id)!.reference,
    )
    expect(b.primitives.slice(0, snapshot.model.primitives.length)).toEqual(
      snapshot.model.primitives,
    )
  })
  test('conversion matches the C projection for shared edits, assignments, values and restoration', () => {
    let changes = setShared(snapshot, emptyChanges(), style, '#123456')
    changes = setLocal(snapshot, changes, field, { kind: 'style', style })
    changes = setLocal(snapshot, changes, target, { kind: 'value', value: '#abc' })
    let model = applyOperations(snapshot, operationsFromChanges(changes))
    expect(rendered(model)).toEqual(projectValues(snapshot, changes))
    changes = setLocal(snapshot, changes, target, { kind: 'restore' })
    model = applyOperations(snapshot, operationsFromChanges(changes))
    expect(rendered(model)).toEqual(projectValues(snapshot, changes))
  })
  test('request envelope agrees with authority schema, including closed fields and budgets', () => {
    const schema = JSON.parse(
      readFileSync('src/design-system/authority/schemas/editor-request.schema.json', 'utf8'),
    )
    const validate = new Ajv({ strict: true }).compile(schema)
    const cases = [
      request,
      { ...request, path: '../file' },
      { ...request, operations: [] },
      { ...request, operations: Array.from({ length: 101 }, () => request.operations[0]) },
      { ...request, baseRevision: 'bad' },
      { ...request, operations: [{ kind: 'restore', target, css: 'bad' }] },
      { ...request, operations: [{ kind: 'set-component-token', target, value: NaN }] },
    ]
    for (const input of cases)
      expect(saveRequestSchema.safeParse(input).success).toBe(!!validate(input))
    expect(() =>
      operationsFromChanges({
        local: Object.fromEntries(
          Array.from({ length: 101 }, (_, index) => [
            'target' + index,
            { kind: 'restore' as const },
          ]),
        ),
        shared: {},
      }),
    ).toThrow('budget-exceeded')
    expect(operationsFromChanges(emptyChanges())).toEqual([])
    expect(() => applyOperations(snapshot, [] as EditorOperation[])).toThrow()
  })
})

test('standalone creation preserves every binding and exception, then explicit assignment reuses it', () => {
  const base = {
    ...snapshot,
    model: applyOperations(snapshot, [{ kind: 'set-component-token', target, value: '#234567' }]),
  }
  const created = 'semantic.color.action.recovery.background.default'
  const operation = {
    kind: 'create-style',
    target,
    intention: 'actions.recovery',
    value: '#abc',
  } as const
  const model = applyOperations(base, [operation])
  expect(model.bindings).toEqual(base.model.bindings)
  expect(rendered(model).styles[created]).toBe('#aabbcc')
  const assigned = applyOperations(base, [operation, { kind: 'assign', target, style: created }])
  expect(assigned.bindings.find((item) => item.id === target)?.provenance).toBeUndefined()
  expect(assigned.bindings.filter((item) => item.id !== target)).toEqual(
    base.model.bindings.filter((item) => item.id !== target),
  )
  expect(rendered(assigned).bindings[target]).toBe('#aabbcc')
  expect(() =>
    applyOperations(base, [{ kind: 'assign', target, style: created }, operation]),
  ).toThrow('unknown-reference')
  expect(() => applyOperations(snapshot, [operation, operation])).toThrow('style-exists')
  for (const invalid of [
    { ...operation, intention: 'unknown.value' },
    { ...operation, value: 'url(file)' },
    { ...operation, target: 'component.unknown.default.root.background.default' },
    { ...operation, style: created },
  ])
    expect(() => applyOperations(snapshot, [invalid])).toThrow()
  const authority = new Ajv({ strict: true }).compile(
    JSON.parse(
      readFileSync('src/design-system/authority/schemas/editor-request.schema.json', 'utf8'),
    ),
  )
  for (const input of [
    { ...request, operations: [operation] },
    { ...request, operations: [{ ...operation, path: '../escape' }] },
  ])
    expect(saveRequestSchema.safeParse(input).success).toBe(!!authority(input))
})

test('DS-UI-06 convention metadata and internal inverse agree with the JSON authority', () => {
  const authority = new Ajv({ strict: true }).compile(
    JSON.parse(
      readFileSync('src/design-system/authority/schemas/editor-request.schema.json', 'utf8'),
    ),
  )
  const binding = snapshot.model.bindings.find((b) => b.id === target)!
  const cases = [
    {
      ...request,
      operations: [
        {
          kind: 'define-and-assign',
          target,
          value: '#123456',
          classification: 'non-semantic',
          definition: {
            category: 'neutral-hierarchy',
            id: 'sample-convention',
            label: 'Convention',
            definition: 'Convention de démonstration',
            examples: ['Exemple'],
            synonyms: ['Démo'],
          },
        },
      ],
    },
    {
      ...request,
      operations: [
        { kind: 'restore-binding', target, reference: binding.reference, style: binding.style },
      ],
    },
  ]
  for (const input of cases) {
    expect(saveRequestSchema.safeParse(input).success).toBe(true)
    expect(authority(input)).toBe(true)
  }
})
