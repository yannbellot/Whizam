export type Primitive = { id: string; type: string; value: string | number }
export type SemanticToken = { id: string; type: string; value: { reference: string } }

export function resolveTokenValues(primitives: Primitive[], tokens: SemanticToken[]) {
  const all = new Map<string, Primitive | SemanticToken>()
  for (const entry of [...primitives, ...tokens]) {
    if (all.has(entry.id)) throw new Error(`Duplicate token: ${entry.id}`)
    all.set(entry.id, entry)
  }
  function resolve(id: string, trail = new Set<string>()): string | number {
    if (trail.has(id)) throw new Error(`Token cycle: ${id}`)
    const entry = all.get(id)
    if (!entry) throw new Error(`Unknown token: ${id}`)
    if (typeof entry.value !== 'object') return entry.value
    const target = all.get(entry.value.reference)
    if (!target) throw new Error(`Unknown token: ${entry.value.reference}`)
    if (target.type !== entry.type) throw new Error(`Token type mismatch: ${id}`)
    return resolve(target.id, new Set([...trail, id]))
  }
  const names = new Set<string>()
  return tokens.map((token) => {
    const variable = `--adl-${token.id.replace(/^semantic\./, '').replaceAll('.', '-')}`
    if (names.has(variable)) throw new Error(`CSS variable collision: ${variable}`)
    names.add(variable)
    return { id: token.id, type: token.type, variable, value: resolve(token.id) }
  })
}

/** Dérivés v2 : valeurs résolues pour l’inventaire, références CSS pour la propagation. */
export function generateEditorTokenArtifacts(
  model: import('./editor/contract').EditorModel,
  contract: import('./editor/contract').EditorContract,
  legacy: SemanticToken[],
) {
  const primitiveValues = new Map(model.primitives.map((primitive) => [primitive.id, primitive]))
  const semantic = model.styles.map((style) => ({
    id: style.id,
    type: style.type,
    value: { reference: style.reference },
  }))
  const resolved = resolveTokenValues(model.primitives, [...legacy, ...semantic])
  const values = new Map(resolved.map((token) => [token.id, token.value]))
  const variable = (id: string) => `--adl-${id.replaceAll('.', '-')}`
  const styles = model.styles.map((style) => ({
    ...style,
    variable: variable(style.id),
    value: values.get(style.id)!,
  }))
  const bindings = model.bindings.map((binding) => {
    const type = contract.properties[binding.property].type
    const value = binding.reference.startsWith('primitive.')
      ? primitiveValues.get(binding.reference)?.value
      : values.get(binding.style ?? '')
    if (value === undefined) throw new Error(`Unknown component reference: ${binding.id}`)
    const source = binding.reference.startsWith('primitive.')
      ? primitiveValues.get(binding.reference)
      : styles.find((style) => style.id === binding.style)
    if (source?.type !== type) throw new Error(`Component type mismatch: ${binding.id}`)
    return { ...binding, type, variable: variable(binding.id), value }
  })
  const declarations = [
    ...model.primitives.map((primitive) => [variable(primitive.id), String(primitive.value)]),
    ...legacy.map((token) => [
      `--adl-${token.id.replace(/^semantic\./, '').replaceAll('.', '-')}`,
      `var(${variable(token.value.reference)})`,
    ]),
    ...model.styles.map((style) => [variable(style.id), `var(${variable(style.reference)})`]),
    ...model.bindings.map((binding) => [
      variable(binding.id),
      `var(${variable(binding.reference)})`,
    ]),
  ]
  const names = declarations.map(([name]) => name)
  if (new Set(names).size !== names.length) throw new Error('CSS variable collision')
  const scoped = contract.targets.flatMap((target) =>
    target.variants.map((variant) => {
      const aliases = model.bindings
        .filter((binding) => binding.target === target.id && binding.variant === variant)
        .map((binding) => {
          const property = binding.property.replace(
            /[A-Z]/g,
            (letter) => `-${letter.toLowerCase()}`,
          )
          return `  --adl-local-${binding.part}-${property}-${binding.state}: var(${variable(binding.id)});`
        })
      return `[data-design-target="${target.id}"][data-design-variant="${variant}"] {\n${aliases.join('\n')}\n}`
    }),
  )
  return {
    legacy: resolved.slice(0, legacy.length),
    styles,
    bindings,
    css: `/* Generated from YAML; do not edit. */\n:root {\n${declarations.map(([name, value]) => `  ${name}: ${value};`).join('\n')}\n}\n${scoped.join('\n')}\n`,
  }
}
