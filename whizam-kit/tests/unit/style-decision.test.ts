import { describe, expect, test } from 'vitest'
import { snapshot } from '../fixtures/legacy-editor-snapshot'
import { applyOperations } from '../../src/design-system/editor/operations'
import { emptyChanges, projectValues } from '../../src/design-system/editor/draft'
import {
  agentDecisionInput,
  conservativeStyleDecision,
  prepareStyleDecision,
  resolveStyleDecision,
  validateAgentDecision,
} from '../../src/design-system/editor/style-decision'

const target = 'component.button.default.root.background.default'
const request = {
  requestId: '12345678-1234-4123-8123-123456789abc',
  rootId: 'test-root',
  revision: 'a'.repeat(64),
  draftFingerprint: 'b'.repeat(64),
  target,
  value: '#abc',
}
const select = (choice: string) => ({
  kind: 'select',
  choice,
  reason: 'Choix dans le contexte préparé.',
})
const question = {
  kind: 'question',
  question: 'Étendre ce changement aux autres réglages liés ?',
  choices: ['local', 'shared'],
}

describe('bounded style decisions before persistence', () => {
  test('prepares without mutating any source, preserving exact visual intent', () => {
    const before = JSON.stringify(snapshot)
    const context = prepareStyleDecision(snapshot, request)
    const operations = resolveStyleDecision(context, select('local'), snapshot, request)
    const model = applyOperations(snapshot, operations)
    expect(projectValues({ ...snapshot, model }, emptyChanges()).bindings[target]).toBe('#aabbcc')
    expect(model.bindings.filter((item) => item.id !== target)).toEqual(
      snapshot.model.bindings.filter((item) => item.id !== target),
    )
    expect(model.styles).toEqual(snapshot.model.styles)
    expect(JSON.stringify(snapshot)).toBe(before)
  })
  test('equal effective value creates no operation, including an existing exception', () => {
    const base = {
      ...snapshot,
      model: applyOperations(snapshot, [{ kind: 'set-component-token', target, value: '#abc' }]),
    }
    const context = prepareStyleDecision(base, request)
    expect(context.choices.map((item) => item.id)).toEqual(['unchanged'])
    expect(
      resolveStyleDecision(context, conservativeStyleDecision(context), base, request),
    ).toEqual([])
  })
  test('reuses the existing meaning rather than creating a duplicate', () => {
    const base = {
      ...snapshot,
      model: applyOperations(snapshot, [{ kind: 'set-component-token', target, value: '#abc' }]),
    }
    const value = projectValues(snapshot, emptyChanges()).bindings[target]
    const input = { ...request, value }
    const context = prepareStyleDecision(base, input)
    const decision = conservativeStyleDecision(context)
    const operations = resolveStyleDecision(context, decision, base, input)
    expect(operations[0].kind).toBe('assign')
    expect(
      applyOperations(base, operations).bindings.find((item) => item.id === target)?.provenance,
    ).toBeUndefined()
  })
  test('does not reuse a different intention merely because the color matches', () => {
    const base = structuredClone(snapshot)
    base.model = applyOperations(base, [
      { kind: 'create-style', target, intention: 'actions.recovery', value: '#abc' },
    ])
    base.presentation.button.semanticGuidance = undefined
    const context = prepareStyleDecision(base, request)
    expect(context.choices.some((item) => item.id.startsWith('reuse.'))).toBe(false)
    expect(conservativeStyleDecision(context)).toMatchObject({ choice: 'local' })
  })
  test('creates only an absent identity established by unique contextual guidance', () => {
    const base = structuredClone(snapshot)
    const binding = base.model.bindings.find((item) => item.id === target)!
    base.presentation.button.semanticGuidance = {
      purpose: 'Action de récupération',
      recommendations: [
        {
          variants: [binding.variant],
          part: binding.part,
          properties: [binding.property],
          states: [binding.state],
          intentions: ['actions.recovery'],
          reason: 'Fonction explicitement préparée.',
        },
      ],
    }
    const context = prepareStyleDecision(base, request)
    const operations = resolveStyleDecision(context, select('create'), base, request)
    const model = applyOperations(base, operations)
    expect(model.styles).toHaveLength(base.model.styles.length + 1)
    expect(projectValues({ ...base, model }, emptyChanges()).bindings[target]).toBe('#aabbcc')
    expect(
      prepareStyleDecision({ ...base, model }, { ...request, value: '#def' }).choices.some(
        (item) => item.id === 'create',
      ),
    ).toBe(false)
  })
  test('an agent cannot self-authorize shared changes', () => {
    const context = prepareStyleDecision(snapshot, request)
    expect(() => resolveStyleDecision(context, select('shared'), snapshot, request)).toThrow(
      'decision-answer-required',
    )
    expect(() => resolveStyleDecision(context, question, snapshot, request)).toThrow(
      'decision-answer-required',
    )
    expect(resolveStyleDecision(context, question, snapshot, request, 'local')[0].kind).toBe(
      'set-component-token',
    )
    expect(resolveStyleDecision(context, question, snapshot, request, 'shared')[0].kind).toBe(
      'update-shared',
    )
  })
  test('explicit sharing restores the selected exception but preserves other exceptions', () => {
    const style = snapshot.model.bindings.find((item) => item.id === target)!.style
    const other = snapshot.model.bindings.find((item) => item.id !== target && item.style === style)
    const base = {
      ...snapshot,
      model: applyOperations(snapshot, [
        { kind: 'set-component-token', target, value: '#123456' },
        ...(other
          ? [{ kind: 'set-component-token' as const, target: other.id, value: '#234567' }]
          : []),
      ]),
    }
    const context = prepareStyleDecision(base, request)
    const model = applyOperations(
      base,
      resolveStyleDecision(context, question, base, request, 'shared'),
    )
    expect(projectValues({ ...base, model }, emptyChanges()).bindings[target]).toBe('#aabbcc')
    if (other)
      expect(projectValues({ ...base, model }, emptyChanges()).bindings[other.id]).toBe('#234567')
  })
  test('does not propose propagation with incomplete inventory', () => {
    const base = { ...snapshot, inventoryIssues: ['Usage inconnu'] }
    const context = prepareStyleDecision(base, request)
    expect(context.choices.some((item) => item.id === 'shared')).toBe(false)
    expect(() => validateAgentDecision(context, question, base, request)).toThrow(
      'unknown-decision-choice',
    )
  })
  test.each(['revision', 'draftFingerprint', 'rootId', 'target', 'requestId'] as const)(
    'rejects a stale %s',
    (key) => {
      const context = prepareStyleDecision(snapshot, request)
      const next = {
        ...request,
        [key]:
          key === 'rootId'
            ? 'other-root'
            : key === 'target'
              ? 'component.field.single-line.control.background.default'
              : key === 'requestId'
                ? '22345678-1234-4123-8123-123456789abc'
                : 'c'.repeat(64),
      }
      expect(() => resolveStyleDecision(context, select('local'), snapshot, next)).toThrow(
        'stale-decision',
      )
    },
  )
  test('rejects a changed generation and mutated host choice', () => {
    const context = prepareStyleDecision(snapshot, request)
    expect(() =>
      resolveStyleDecision(
        context,
        select('local'),
        { ...snapshot, generation: 'c'.repeat(64) },
        request,
      ),
    ).toThrow('stale-decision')
    context.choices.find((item) => item.id === 'local')!.operations = [{ kind: 'restore', target }]
    expect(() => resolveStyleDecision(context, select('local'), snapshot, request)).toThrow(
      'stale-decision',
    )
  })
  test('rejects unknown choices, duplicates, injected operations and irrelevant answers', () => {
    const context = prepareStyleDecision(snapshot, request)
    for (const input of [
      select('invented'),
      { ...select('local'), operations: [{ kind: 'restore', target }] },
      { ...question, choices: ['local', 'local'] },
    ])
      expect(() => validateAgentDecision(context, input, snapshot, request)).toThrow()
    expect(() =>
      resolveStyleDecision(context, select('local'), snapshot, request, 'shared'),
    ).toThrow('unexpected-answer')
    expect(() => resolveStyleDecision(context, question, snapshot, request, 'invented')).toThrow(
      'decision-answer-required',
    )
  })
  test('rejects unsupported targets and invalid visual values before analysis', () => {
    expect(() => prepareStyleDecision(snapshot, { ...request, value: 'url(file)' })).toThrow()
    const foundation = snapshot.model.bindings.find((item) => item.target === 'foundations')!
    expect(() => prepareStyleDecision(snapshot, { ...request, target: foundation.id })).toThrow(
      'assistance-target-unavailable',
    )
  })
  test('model view excludes operations, transport identities and filesystem paths', () => {
    const view = JSON.stringify(agentDecisionInput(prepareStyleDecision(snapshot, request)))
    for (const word of [
      'operations',
      'rootId',
      'requestId',
      'draftFingerprint',
      'consumerFiles',
      'revision',
    ])
      expect(view).not.toContain(`"${word}"`)
  })
})
