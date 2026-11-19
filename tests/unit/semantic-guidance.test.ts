import { test, expect } from 'vitest'
import { snapshot } from '../fixtures/legacy-editor-snapshot'
import { semanticGuidance, searchIntentions } from '../../src/design-system/editor/draft'

test('each prepared context resolves only compatible recommendations without mutating values', () => {
  const before = JSON.stringify(snapshot)
  for (const binding of snapshot.model.bindings) {
    const guidance = semanticGuidance(snapshot, binding)
    expect(guidance.purpose).toBeTruthy()
    expect(guidance.reason).toBeTruthy()
    if (
      binding.style &&
      snapshot.model.styles.find((s) => s.id === binding.style)?.classification !== 'non-semantic'
    )
      expect(guidance.intentions.length).toBeGreaterThan(0)
    else expect(guidance.intentions).toEqual([])
    const compatible = searchIntentions(snapshot, binding, '').map((item) => item.key)
    for (const intention of guidance.intentions) expect(compatible).toContain(intention)
  }
  expect(JSON.stringify(snapshot)).toBe(before)
})

test('Notice tones, disabled Button and typography have their own semantic guidance', () => {
  const find = (target: string, variant: string, property: string, state = 'default') =>
    snapshot.model.bindings.find(
      (b) =>
        b.target === target &&
        b.variant === variant &&
        b.property === property &&
        b.state === state,
    )!
  for (const [variant, intention] of [
    ['info', 'information'],
    ['success', 'success'],
    ['error', 'error'],
  ]) {
    expect(semanticGuidance(snapshot, find('notice', variant, 'background')).intentions).toEqual([
      'information-result.' + intention,
    ])
  }
  expect(semanticGuidance(snapshot, find('button', 'default', 'background')).intentions).toEqual([
    'actions.primary',
    'actions.secondary',
  ])
  expect(
    semanticGuidance(snapshot, find('button', 'default', 'background', 'disabled')).intentions,
  ).toEqual(['availability-capacity.unavailable'])
  expect(semanticGuidance(snapshot, find('button', 'default', 'fontSize')).intentions).toEqual([])
})

test('old sheets do not fabricate recommendations from legacy global priorities', () => {
  const legacy = structuredClone(snapshot)
  delete legacy.presentation.button.semanticGuidance
  legacy.presentation.button.priorityIntentions = ['actions.primary']
  const binding = legacy.model.bindings.find((b) => b.target === 'button')!
  expect(semanticGuidance(legacy, binding).intentions).toEqual([])
  expect(searchIntentions(legacy, binding, 'récupération').map((i) => i.key)).toContain(
    'actions.recovery',
  )
})
