import { z } from 'zod'
import { normalizeValue, styleId } from './contract.ts'
import type { EditorOperation } from './contract'
import type { EditorSnapshot } from './snapshot'
import { emptyChanges, getBinding, getImpact, projectValues, semanticGuidance } from './draft.ts'
import { applyOperations } from './operations.ts'
import { canonicalJSON } from './canonical-json.ts'

export const decisionPolicyVersion = 3 as const
const hash = z.string().regex(/^[a-f0-9]{64}$/)
const identifier = z.string().min(1).max(240)
export const decisionRequestSchema = z
  .object({
    requestId: z.uuid(),
    rootId: identifier,
    revision: hash,
    draftFingerprint: hash,
    target: identifier,
    value: z.union([z.string().min(1).max(160), z.number().finite()]),
  })
  .strict()
export type DecisionRequest = z.infer<typeof decisionRequestSchema>
export const agentDecisionSchema = z.discriminatedUnion('kind', [
  z
    .object({ kind: z.literal('select'), choice: identifier, reason: z.string().min(1).max(400) })
    .strict(),
  z
    .object({
      kind: z.literal('question'),
      question: z.string().min(1).max(240),
      choices: z.array(identifier).min(2).max(3),
    })
    .strict(),
])
export type AgentDecision = z.infer<typeof agentDecisionSchema>
type Choice = {
  id: string
  label: string
  intention: string
  requiresAnswer: boolean
  operations: EditorOperation[]
}
export type DecisionContext = ReturnType<typeof prepareStyleDecision>

/** The host computes all writable plans. Agent output can only refer to their IDs. */
export function prepareStyleDecision(snapshot: EditorSnapshot, input: unknown) {
  const request = decisionRequestSchema.parse(input)
  const binding = getBinding(snapshot, request.target)
  if (binding.target === 'foundations') throw new Error('assistance-target-unavailable')
  const property = snapshot.contract.properties[binding.property]
  const value = normalizeValue(property, request.value, snapshot.contract.fontFamilies)
  const normalized = { ...request, value }
  const values = projectValues(snapshot, emptyChanges())
  const assigned = snapshot.model.styles.find((item) => item.id === binding.style)!
  if (!assigned) {
    const same = values.bindings[binding.id] === value
    const restore =
      snapshot.model.primitives.find((p) => p.id === binding.baseReference)?.value === value
    const operations: EditorOperation[] = same
      ? []
      : restore
        ? [{ kind: 'restore', target: binding.id }]
        : [{ kind: 'set-component-token', target: binding.id, value }]
    return {
      policyVersion: decisionPolicyVersion,
      generation: snapshot.generation,
      request: normalized,
      context: {
        component: binding.target,
        variant: binding.variant,
        part: binding.part,
        property: binding.property,
        state: binding.state,
        purpose: snapshot.presentation[binding.target].semanticGuidance?.purpose ?? '',
        guidance: 'Réglage visuel autonome ; aucune intention sémantique démontrée.',
        currentIntention: null,
        previousValue: values.bindings[binding.id],
        impact: {
          linked: [] as string[],
          masked: [] as string[],
          complete: snapshot.inventoryIssues.length === 0,
        },
        inventoryIssues: snapshot.inventoryIssues,
      },
      choices: [
        {
          id: same ? 'unchanged' : 'local',
          label: same
            ? 'Conserver ce réglage'
            : restore
              ? 'Rétablir la valeur de base'
              : 'Ce réglage',
          intention: '',
          requiresAnswer: false,
          operations,
        },
      ],
    }
  }
  const guidance = semanticGuidance(snapshot, binding)
  const impact = getImpact(snapshot, emptyChanges(), assigned.id)
  const meanings = new Set([assigned.intention])
  if (guidance.intentions.length === 1) meanings.add(guidance.intentions[0])
  const choices: Choice[] = []
  const add = (choice: Choice) => {
    const model = choice.operations.length
      ? applyOperations(snapshot, choice.operations)
      : snapshot.model
    const projected = projectValues({ ...snapshot, model }, emptyChanges())
    if (projected.bindings[binding.id] !== value) throw new Error('decision-value-mismatch')
    if (choice.id !== 'shared') {
      // Local plans may change inherited rendering, never another binding's data.
      if (
        canonicalJSON(model.bindings.filter((item) => item.id !== binding.id)) !==
          canonicalJSON(snapshot.model.bindings.filter((item) => item.id !== binding.id)) ||
        canonicalJSON(model.styles.slice(0, snapshot.model.styles.length)) !==
          canonicalJSON(snapshot.model.styles)
      )
        throw new Error('decision-scope-mismatch')
    }
    choices.push(choice)
  }
  if (values.bindings[binding.id] === value) {
    add({
      id: 'unchanged',
      label: 'Conserver ce réglage',
      intention: assigned.intention,
      requiresAnswer: false,
      operations: [],
    })
  } else if (values.styles[assigned.id] === value) {
    add({
      id: 'reuse.0',
      label: 'Réutiliser le style attribué',
      intention: assigned.intention,
      requiresAnswer: false,
      operations: [{ kind: 'assign', target: binding.id, style: assigned.id }],
    })
  } else {
    for (const style of [...snapshot.model.styles].sort((a, b) => a.id.localeCompare(b.id))) {
      if (
        style.type === property.type &&
        style.role === property.role &&
        style.state === binding.state &&
        meanings.has(style.intention) &&
        values.styles[style.id] === value
      )
        add({
          id: `reuse.${choices.length}`,
          label: `Réutiliser ${style.intention}`,
          intention: style.intention,
          requiresAnswer: false,
          operations: [{ kind: 'assign', target: binding.id, style: style.id }],
        })
    }
    if (guidance.intentions.length === 1) {
      const intention = guidance.intentions[0]
      const identity = styleId({ ...property, intention, state: binding.state })
      if (!snapshot.model.styles.some((style) => style.id === identity))
        add({
          id: 'create',
          label: `Préparer un style pour ${intention}`,
          intention,
          requiresAnswer: false,
          operations: [{ kind: 'create-and-assign', target: binding.id, intention, value }],
        })
    }
    add({
      id: 'local',
      label: 'Ce réglage',
      intention: assigned.intention,
      requiresAnswer: false,
      operations: [{ kind: 'set-component-token', target: binding.id, value }],
    })
    if (impact.complete) {
      const operations: EditorOperation[] = [{ kind: 'update-shared', style: assigned.id, value }]
      if (binding.reference !== binding.style)
        operations.push({ kind: 'restore', target: binding.id })
      // Other consumers can have narrower domains than the selected property.
      try {
        applyOperations(snapshot, operations)
        add({
          id: 'shared',
          label: 'Tous les réglages liés',
          intention: assigned.intention,
          requiresAnswer: true,
          operations,
        })
      } catch {
        // An incompatible propagation is not an option the agent may offer.
      }
    }
  }
  return {
    policyVersion: decisionPolicyVersion,
    generation: snapshot.generation,
    request: normalized,
    context: {
      component: binding.target,
      variant: binding.variant,
      part: binding.part,
      property: binding.property,
      state: binding.state,
      purpose: guidance.purpose ?? '',
      guidance: guidance.reason ?? '',
      currentIntention: assigned.intention,
      previousValue: values.bindings[binding.id],
      impact: {
        linked: impact.linked.map((item) => item.id),
        masked: impact.masked.map((item) => item.id),
        complete: impact.complete,
      },
      inventoryIssues: snapshot.inventoryIssues,
    },
    choices,
  }
}

/** Read-only data view for a model: no save capability, path or executable operation. */
export function agentDecisionInput(context: DecisionContext) {
  return {
    policyVersion: context.policyVersion,
    value: context.request.value,
    context: context.context,
    choices: context.choices.map(({ id, label, intention, requiresAnswer }) => ({
      id,
      label,
      intention,
      requiresAnswer,
    })),
  }
}

function fresh(context: DecisionContext, snapshot: EditorSnapshot, request: DecisionRequest) {
  const current = prepareStyleDecision(snapshot, request)
  if (canonicalJSON(current) !== canonicalJSON(context)) throw new Error('stale-decision')
}

export function validateAgentDecision(
  context: DecisionContext,
  input: unknown,
  snapshot: EditorSnapshot,
  request: DecisionRequest,
) {
  fresh(context, snapshot, request)
  const decision = agentDecisionSchema.parse(input)
  const ids = decision.kind === 'select' ? [decision.choice] : decision.choices
  if (new Set(ids).size !== ids.length) throw new Error('duplicate-decision-choice')
  const choices = ids.map((id) => {
    const choice = context.choices.find((item) => item.id === id)
    if (!choice) throw new Error('unknown-decision-choice')
    return choice
  })
  if (decision.kind === 'select' && choices[0].requiresAnswer)
    throw new Error('decision-answer-required')
  return decision
}

export function resolveStyleDecision(
  context: DecisionContext,
  input: unknown,
  snapshot: EditorSnapshot,
  request: DecisionRequest,
  answer?: string,
): EditorOperation[] {
  const decision = validateAgentDecision(context, input, snapshot, request)
  if (decision.kind === 'select' && answer !== undefined) throw new Error('unexpected-answer')
  const id = decision.kind === 'select' ? decision.choice : answer
  if (!id || (decision.kind === 'question' && !decision.choices.includes(id)))
    throw new Error('decision-answer-required')
  // Return a fresh validated copy: callers cannot mutate the candidate through this result.
  return structuredClone(context.choices.find((choice) => choice.id === id)!.operations)
}

export function conservativeStyleDecision(context: DecisionContext): AgentDecision {
  const choice =
    context.choices.find((item) => item.id === 'unchanged') ??
    context.choices.find((item) => item.id.startsWith('reuse.')) ??
    context.choices.find((item) => item.id === 'create') ??
    context.choices.find((item) => item.id === 'local')!
  return {
    kind: 'select',
    choice: choice.id,
    reason: 'Règle locale déterministe ; aucune analyse IA effectuée.',
  }
}
