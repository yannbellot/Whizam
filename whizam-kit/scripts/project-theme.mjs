import { readFile } from 'node:fs/promises'
import path from 'node:path'

export const projectConsumers = [
  'src/design-system/components/Button/Button.tsx',
  'src/design-system/components/Field.tsx',
]
const kebab = (value) => value.replace(/[A-Z]/g, (letter) => '-' + letter.toLowerCase())
export const localTokenKey = (binding) =>
  `${binding.part}-${kebab(binding.property)}-${binding.state}`

/** Derive contextual aliases, not values: instance/variant overrides remain effective. */
export function projectTheme(model, contract) {
  const aliases = new Map()
  for (const binding of model.bindings) {
    const property = contract.properties[binding.property]
    const key = localTokenKey(binding)
    if (!/^[a-z][a-z0-9-]*$/.test(key) || !/^[a-z-]+$/.test(property?.cssProperty ?? ''))
      throw new Error('Invalid project token mapping')
    const namespace =
      property.type === 'color'
        ? 'color'
        : property.type === 'font-family'
          ? 'font'
          : property.type === 'font-weight'
            ? 'font-weight'
            : property.type === 'line-height'
              ? 'leading'
              : binding.property === 'fontSize'
                ? 'text'
                : binding.property === 'borderRadius'
                  ? 'radius'
                  : 'spacing'
    const entry = { key, css: property.cssProperty, namespace }
    if (aliases.has(key) && JSON.stringify(aliases.get(key)) !== JSON.stringify(entry))
      throw new Error('Project alias collision')
    aliases.set(key, entry)
  }
  const entries = [...aliases.values()].sort((a, b) => a.key.localeCompare(b.key))
  return {
    utilities: new Set(entries.map(({ key }) => 'token-' + key)),
    css:
      '/* Generated from validated project DTCG and CSS contract; never edit. */\n' +
      '@theme inline {\n' +
      entries
        .map(({ key, namespace }) => `  --${namespace}-local-${key}: var(--adl-local-${key});`)
        .join('\n') +
      '\n}\n' +
      entries
        .map(({ key, css }) => `@utility token-${key} { ${css}: var(--adl-local-${key}); }`)
        .join('\n') +
      '\n',
  }
}

export async function validateProjectConsumers(root, utilities) {
  const structural = new Set([
    'grid',
    'min-w-0',
    'w-full',
    'm-0',
    'border-0',
    'border-solid',
    'outline-solid',
    'cursor-pointer',
    'cursor-not-allowed',
    'cursor-progress',
  ])
  for (const file of projectConsumers) {
    const text = await readFile(path.join(root, file), 'utf8')
    if (/--loomata-ui-|ui:|style\s*=/.test(text))
      throw new Error('Project chrome/style leakage: ' + file)
    for (const match of text.matchAll(/project:([^\s"'`]+)/g)) {
      const classes = match[1].split(':')
      const utility = classes.pop()
      if (
        classes.some(
          (state) =>
            !['hover', 'focus-visible', 'disabled', 'aria-invalid', 'aria-busy'].includes(state),
        ) ||
        (!utilities.has(utility) && !structural.has(utility))
      )
        throw new Error('Unapproved project utility: ' + match[0])
    }
  }
}
