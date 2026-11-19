import { expect, test } from 'vitest'
import { snapshot } from '../fixtures/legacy-editor-snapshot'
import { describeAttribution } from '../../src/design-system/editor/attribution'
import { applyOperations } from '../../src/design-system/editor/operations'

const fieldId = 'component.field.single-line.control.background.default'
const selectId = 'component.select-field.default.control.background.default'
const binding = (s: typeof snapshot, id = fieldId) => s.model.bindings.find((b) => b.id === id)!

test('attribution distinguishes inherited semantic values, own tokens and semantic exceptions', () => {
  const solo = binding(snapshot, 'component.button.default.root.background.default')
  expect(describeAttribution(snapshot, solo).kind).toBe('semantic')
  const own = binding(snapshot, 'component.button.default.root.border-radius.default')
  expect(describeAttribution(snapshot, own).kind).toBe('shared')
  const autonomous = structuredClone(snapshot)
  const detached = binding(autonomous, own.id)
  detached.style = null
  detached.reference = detached.baseReference
  expect(describeAttribution(autonomous, detached).kind).toBe('component')
  expect(describeAttribution(snapshot, binding(snapshot)).kind).toBe('shared')
  const next = {
    ...snapshot,
    model: applyOperations(snapshot, [
      { kind: 'set-component-token', target: fieldId, value: '#123456' },
    ]),
  }
  const details = describeAttribution(next, binding(next))
  expect(details.kind).toBe('exception')
  expect(details.style?.id).toBe(binding(snapshot).style)
  expect(details.components.find((c) => c.target === 'select-field')?.allMasked).toBe(false)
})

test('semantic sharing counts distinct effective components, annotates masked uses and picks a valid destination', () => {
  const next = structuredClone(snapshot)
  const shared = binding(next).style!
  // Isolated graph of uses: two bindings of Field still constitute one component.
  next.model.bindings = [
    binding(next),
    { ...binding(next), id: fieldId + '-test' },
    binding(next, selectId),
  ]
  const details = describeAttribution(next, binding(next))
  expect(details.components).toHaveLength(2)
  next.model.bindings[2].reference = 'primitive.color.hex-123456'
  const masked = describeAttribution(next, binding(next))
  expect(masked.kind).toBe('semantic')
  expect(masked.components.find((c) => c.target === 'select-field')).toMatchObject({
    allMasked: true,
    hasExceptions: true,
  })
  expect(masked.style?.id).toBe(shared)
  next.model.bindings[0].reference = 'primitive.color.hex-123456'
  expect(describeAttribution(next, next.model.bindings[1]).components[0].binding.id).toBe(
    next.model.bindings[1].id,
  )
})

test('incomplete inventories stay explicit and equal values do not erase a local exception', () => {
  const next = {
    ...snapshot,
    inventoryIssues: ['Inventaire synthétique incomplet.'],
    model: applyOperations(snapshot, [
      { kind: 'set-component-token', target: fieldId, value: '#ffffff' },
    ]),
  }
  const details = describeAttribution(next, binding(next))
  expect(details.kind).toBe('exception')
  expect(details.complete).toBe(false)
})
