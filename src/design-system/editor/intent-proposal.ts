import { z } from 'zod'
import { intentionSchema } from './intentions.ts'
import { styleId, semanticEligible, normalizeValue } from './contract.ts'
import { projectValues, emptyChanges } from './draft.ts'
import { projectTransaction } from './operations.ts'
import type { EditorOperation } from './contract'
import type { EditorSnapshot } from './snapshot'

const text = z.string().trim().min(1).max(400)
export const intentProposalSchema = z
  .object({
    kind: z.enum(['create', 'reuse', 'clarify']),
    intention: z.string().max(160).nullable(),
    definition: intentionSchema.nullable(),
    question: text.nullable(),
  })
  .strict()
export function prepareIntentProposal(
  snapshot: EditorSnapshot,
  target: string,
  value: string | number,
  input: unknown,
) {
  const proposal = intentProposalSchema.parse(input)
  if (proposal.kind === 'clarify') {
    if (!proposal.question || proposal.intention !== null || proposal.definition !== null)
      throw new Error('agent-invalid-response')
    return { kind: 'clarification' as const, question: proposal.question }
  }
  if (proposal.question !== null) throw new Error('agent-invalid-response')
  const binding = snapshot.model.bindings.find((b) => b.id === target)
  if (!binding) throw new Error('unknown-reference')
  const property = snapshot.contract.properties[binding.property]
  value = normalizeValue(property, value, snapshot.contract.fontFamilies)
  let operations: EditorOperation[], name: string, definition: string
  if (proposal.kind === 'create') {
    if (!proposal.definition || proposal.intention !== null)
      throw new Error('agent-invalid-response')
    operations = [{ kind: 'define-and-assign', target, value, definition: proposal.definition }]
    name = styleId({
      ...property,
      state: binding.state,
      intention: `${proposal.definition.category}.${proposal.definition.id}`,
    })
    definition = proposal.definition.definition
  } else {
    if (
      !proposal.intention ||
      proposal.definition !== null ||
      !semanticEligible(snapshot.catalog, proposal.intention, property.role)
    )
      throw new Error('incompatible-intention')
    name = styleId({ ...property, state: binding.state, intention: proposal.intention })
    const existing = snapshot.model.styles.find((s) => s.id === name)
    if (existing && projectValues(snapshot, emptyChanges()).styles[name] !== value) {
      return {
        kind: 'clarification' as const,
        question:
          'Cette intention existe avec une autre valeur. Choisissez la modification du token partagé depuis le réglage concerné, ou conservez ce réglage particulier ; aucune valeur partagée n’a été modifiée.',
      }
    }
    operations = existing
      ? [{ kind: 'assign', target, style: name }]
      : [{ kind: 'create-and-assign', target, intention: proposal.intention, value }]
    const [category, id] = proposal.intention.split('.')
    definition = snapshot.catalog.categories
      .find((c) => c.id === category)!
      .intentions.find((i) => i.id === id)!.definition
  }
  const projected = projectTransaction(snapshot, operations)
  if (projectValues(projected, emptyChanges()).bindings[target] !== value)
    throw new Error('decision-value-mismatch')
  return { kind: 'proposal' as const, name, definition, operations }
}
