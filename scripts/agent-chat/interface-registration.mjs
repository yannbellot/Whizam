import { z } from 'zod'
import { workspaceSchema } from '../../src/core/workspace-contract.ts'
const candidate = z.strictObject({
  schemaVersion: z.literal(1),
  entities: workspaceSchema.shape.entities.refine((entities) =>
    entities.every((e) => ['page', 'component', 'occurrence'].includes(e.kind)),
  ),
})
/** An approved source declaration proposes registrations; it cannot attest checks or invoke Git. */
export function registerInterface(model, text) {
  const input = candidate.parse(JSON.parse(text))
  if (new Set(input.entities.map((e) => e.id)).size !== input.entities.length)
    throw new Error('workspace-identity-conflict')
  const byId = new Map(model.entities.map((e) => [e.id, e]))
  for (const entity of input.entities) {
    const old = byId.get(entity.id)
    if (old && old.kind !== entity.kind) throw new Error('workspace-identity-conflict')
    byId.set(entity.id, { ...entity, revision: model.revision })
  }
  return workspaceSchema.parse({ ...model, entities: [...byId.values()] }).entities
}
