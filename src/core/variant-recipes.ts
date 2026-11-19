import { z } from 'zod'
import { identitySchema, revisionSchema } from './workspace-contract.ts'
export const variantRecipeSchema = z
  .strictObject({
    id: identitySchema,
    owner: z.string().regex(/^[a-z][a-z0-9-]{0,79}$/),
    label: z.string().trim().min(1).max(200),
    bindings: z
      .array(
        z.strictObject({
          target: z
            .string()
            .regex(/^component(?:\.[a-z][a-z0-9-]*){2,}$/)
            .max(240),
          style: z
            .string()
            .regex(/^semantic(?:\.[a-z][a-z0-9-]*){2,}$/)
            .max(240),
        }),
      )
      .max(64),
  })
  .superRefine((recipe, ctx) => {
    if (new Set(recipe.bindings.map((b) => b.target)).size !== recipe.bindings.length)
      ctx.addIssue({ code: 'custom', message: 'duplicate-variant-binding' })
  })
export const variantRulesSchema = z
  .strictObject({ schemaVersion: z.literal(1), variants: z.array(variantRecipeSchema).max(1000) })
  .superRefine((rules, ctx) => {
    if (new Set(rules.variants.map((v) => v.id)).size !== rules.variants.length)
      ctx.addIssue({ code: 'custom', message: 'duplicate-variant-identity' })
  })
export const variantRequestSchema = z
  .strictObject({
    protocolVersion: z.literal(5),
    requestId: identitySchema.refine((id) => id[14] === '4'),
    baseRevision: revisionSchema,
    operations: z
      .array(z.strictObject({ kind: z.literal('put-variant'), variant: variantRecipeSchema }))
      .min(1)
      .max(20),
  })
  .superRefine((request, ctx) => {
    if (new Set(request.operations.map((op) => op.variant.id)).size !== request.operations.length)
      ctx.addIssue({ code: 'custom', message: 'duplicate-variant-operation' })
  })
export type VariantRecipe = z.infer<typeof variantRecipeSchema>
export type VariantRequest = z.infer<typeof variantRequestSchema>
