import { readSafe } from './design-editor/files.mjs'
import { parseBounded } from './design-editor/parsing.mjs'
import { variantRulesSchema, variantRequestSchema } from '../src/core/variant-recipes.ts'
import { projectTransaction } from '../src/design-system/editor/operations.ts'
export const variantsPath = 'src/design-system/authority/variants.yaml'
export async function loadVariantDefinitions(root) {
  const text = (await readSafe(root, variantsPath)).bytes.toString('utf8')
  return variantRulesSchema.parse(parseBounded(text).toJSON()).variants
}
export function validateVariantRules(input, snapshot) {
  const rules = variantRulesSchema.parse(input)
  for (const recipe of rules.variants) {
    if (!snapshot.contract.targets.some((t) => t.id === recipe.owner))
      throw new Error('unknown-variant-owner')
    for (const binding of recipe.bindings) {
      const target = snapshot.model.bindings.find((b) => b.id === binding.target)
      if (target?.target !== recipe.owner) throw new Error('incompatible-variant-binding')
      // Use the same semantic/type/role compatibility as the existing inspector.
      projectTransaction(snapshot, [
        { kind: 'assign', target: binding.target, style: binding.style },
      ])
    }
  }
  return rules
}
export function applyVariantRules(input, requestInput, snapshot) {
  const rules = variantRulesSchema.parse(input),
    request = variantRequestSchema.parse(requestInput)
  for (const { variant } of request.operations) {
    const existing = rules.variants.find((v) => v.id === variant.id)
    if (existing && existing.owner !== variant.owner) throw new Error('variant-owner-changed')
    rules.variants = rules.variants.filter((v) => v.id !== variant.id).concat(variant)
  }
  return validateVariantRules(rules, snapshot)
}
export async function readVariantRules(root, snapshot) {
  const text = (await readSafe(root, variantsPath)).bytes.toString('utf8')
  const rules = parseBounded(text).toJSON()
  return validateVariantRules(rules, snapshot)
}
export async function variantArtifacts(root, snapshot) {
  const rules = await readVariantRules(root, snapshot)
  const css = rules.variants
    .map((recipe) => {
      const declarations = recipe.bindings.map((item) => {
        const binding = snapshot.model.bindings.find((b) => b.id === item.target)
        const property = binding.property.replace(/[A-Z]/g, (l) => '-' + l.toLowerCase())
        return `  --adl-local-${binding.part}-${property}-${binding.state}: var(--adl-${item.style.replaceAll('.', '-')});`
      })
      return `[data-loomata-variant="${recipe.id}"][data-design-target="${recipe.owner}"] {\n${declarations.join('\n')}\n}`
    })
    .join('\n')
  return { rules, css }
}
