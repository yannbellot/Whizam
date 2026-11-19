import { normalizeValue } from '../../src/design-system/editor/contract.ts'
import { prepareIntentProposal } from '../../src/design-system/editor/intent-proposal.ts'
import { createHash } from 'node:crypto'
import { z } from 'zod'
import { canonicalJSON } from '../../src/design-system/editor/canonical-json.ts'
import { projectTransaction, operationSchema } from '../../src/design-system/editor/operations.ts'
import {
  decisionRequestSchema,
  prepareStyleDecision,
  agentDecisionInput,
  validateAgentDecision,
  resolveStyleDecision,
} from '../../src/design-system/editor/style-decision.ts'

const analysis = z
  .object({ request: decisionRequestSchema, operations: z.array(operationSchema).max(100) })
  .strict()
const answer = z
  .object({
    requestId: z.uuid(),
    choice: z.string().min(1).max(240),
    draftFingerprint: z.string().regex(/^[a-f0-9]{64}$/),
  })
  .strict()
export function createStyleAssistance({ store, agent, now = Date.now }) {
  const questions = new Map()
  let active = false
  function cleanup() {
    for (const [id, item] of questions) if (now() - item.time > 600000) questions.delete(id)
  }
  async function base(request, operations) {
    const loaded = await store.snapshot()
    if (loaded.rootId !== request.rootId || loaded.revision !== request.revision || store.busy)
      throw new Error('stale-decision')
    if (
      createHash('sha256').update(canonicalJSON(operations)).digest('hex') !==
      request.draftFingerprint
    )
      throw new Error('stale-decision')
    return projectTransaction(loaded.snapshot, operations)
  }
  async function current(request) {
    const loaded = await store.snapshot()
    if (loaded.rootId !== request.rootId || loaded.revision !== request.revision || store.busy)
      throw new Error('stale-decision')
  }
  return {
    async handle(action, input) {
      cleanup()
      if (['status', 'connect', 'disconnect'].includes(action)) {
        z.object({}).strict().parse(input)
        if (action === 'status' && !active)
          return { activated: false, connected: false, remaining: agent.remaining }
        if (action === 'connect') {
          active = true
          return { activated: true, ...(await agent.connect()) }
        }
        if (action === 'disconnect') {
          questions.clear()
          const result = await agent.disconnect()
          active = false
          return { activated: false, ...result }
        }
        return { activated: true, ...(await agent.status()) }
      }
      if (!active) throw new Error('agent-login-required')
      if (action === 'interpret') {
        const { request, operations, description, clarifications } = analysis
          .extend({
            description: z.string().trim().min(1).max(1600),
            intentProtocol: z.literal(1),
            clarifications: z
              .array(
                z
                  .object({
                    question: z.string().trim().min(1).max(400),
                    answer: z.string().trim().min(1).max(1600),
                  })
                  .strict(),
              )
              .max(5)
              .default([]),
          })
          .parse(input)
        const snapshot = await base(request, operations)
        const binding = snapshot.model.bindings.find((b) => b.id === request.target)
        if (!binding) throw new Error('unknown-reference')
        const property = snapshot.contract.properties[binding.property]
        const normalizedValue = normalizeValue(
          property,
          request.value,
          snapshot.contract.fontFamilies,
        )
        const categories = snapshot.catalog.categories
          .filter((c) => c.compatibility.includes(`${property.type}:${property.role}`))
          .map((c) => ({
            id: c.id,
            definition: c.definition,
            intentions: c.intentions.map((i) => ({
              id: i.id,
              definition: i.definition,
              synonyms: i.synonyms,
              eligible: snapshot.catalog.semanticEligibility.some(
                (e) => e.intention === `${c.id}.${i.id}` && e.role === property.role,
              ),
            })),
          }))
        const output = await agent.decide({
          task: 'semantic-intention',
          description,
          clarifications,
          value: normalizedValue,
          context: {
            component: binding.target,
            property: binding.property,
            type: property.type,
            role: property.role,
            state: binding.state,
            purpose: snapshot.presentation[binding.target].semanticGuidance?.purpose ?? '',
          },
          categories,
        })
        const proposal = prepareIntentProposal(snapshot, request.target, normalizedValue, output)
        await current(request)
        return {
          requestId: request.requestId,
          draftFingerprint: request.draftFingerprint,
          ...proposal,
        }
      }
      if (action === 'analyze') {
        const { request, operations } = analysis.parse(input)
        const snapshot = await base(request, operations)
        const context = prepareStyleDecision(snapshot, request)
        const decision = validateAgentDecision(
          context,
          await agent.decide(agentDecisionInput(context)),
          snapshot,
          request,
        )
        await current(request)
        if (decision.kind === 'select')
          return {
            requestId: request.requestId,
            draftFingerprint: request.draftFingerprint,
            kind: 'plan',
            operations: resolveStyleDecision(context, decision, snapshot, request),
            reason: decision.reason,
          }
        if (questions.size >= 20) throw new Error('agent-budget-exceeded')
        questions.set(request.requestId, { context, decision, operations, request, time: now() })
        return {
          requestId: request.requestId,
          draftFingerprint: request.draftFingerprint,
          kind: 'question',
          question: decision.question,
          choices: decision.choices.map((id) => ({
            id,
            label: context.choices.find((item) => item.id === id).label,
          })),
          impact: context.context.impact,
        }
      }
      if (action === 'answer') {
        const inputAnswer = answer.parse(input)
        const saved = questions.get(inputAnswer.requestId)
        if (!saved || saved.request.draftFingerprint !== inputAnswer.draftFingerprint)
          throw new Error('stale-decision')
        const snapshot = await base(saved.request, saved.operations)
        const operations = resolveStyleDecision(
          saved.context,
          saved.decision,
          snapshot,
          saved.request,
          inputAnswer.choice,
        )
        questions.delete(inputAnswer.requestId)
        return {
          requestId: saved.request.requestId,
          draftFingerprint: saved.request.draftFingerprint,
          kind: 'plan',
          operations,
          reason: 'Choix appliqué à la portée précisée.',
        }
      }
      throw new Error('forbidden')
    },
    close() {
      questions.clear()
      agent.close()
    },
  }
}
