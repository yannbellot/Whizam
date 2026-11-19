import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
const root = fileURLToPath(new URL('..', import.meta.url))
export async function prepareLoomataUI(directory = root, check = false) {
  const base = path.join(directory, 'src/loomata-ui')
  const model = JSON.parse(await readFile(path.join(base, 'authority/tokens.tokens.json'), 'utf8'))
  const css = (token) => {
    const v = token.$value
    if (
      token.$type === 'fontFamily' &&
      Array.isArray(v) &&
      v.length &&
      v.every((name) => /^[a-z-]+$/.test(name))
    )
      return v.join(', ')
    if (token.$type === 'dimension' && v.unit === 'px' && Number.isFinite(v.value) && v.value >= 0)
      return `${v.value}px`
    if (
      token.$type === 'color' &&
      v.colorSpace === 'srgb' &&
      v.alpha === 1 &&
      v.components.length === 3 &&
      v.components.every((x) => Number.isFinite(x) && x >= 0 && x <= 1)
    )
      return `rgb(${v.components.map((x) => Math.round(x * 255)).join(' ')})`
    throw new Error('Invalid Loomata UI primitive')
  }
  const lines = []
  for (const [id, token] of Object.entries(model.primitive)) {
    if (!/^[a-z-]+$/.test(id)) throw new Error('Invalid UI identity')
    lines.push(`--loomata-ui-primitive-${id}: ${css(token)};`)
  }
  for (const [id, token] of Object.entries(model.decision)) {
    const match = /^\{primitive\.([a-z-]+)\}$/.exec(token.$value)
    if (
      !/^[a-z-]+$/.test(id) ||
      !match ||
      !token.$description ||
      !['semantic', 'non-semantic'].includes(
        token.$extensions?.['org.loomata.ui']?.classification,
      ) ||
      model.primitive[match[1]]?.$type !== token.$type
    )
      throw new Error('Invalid Loomata UI reference')
    lines.push(`--loomata-ui-${id}: var(--loomata-ui-primitive-${match[1]});`)
  }
  const theme = Object.entries(model.decision)
    .filter(([id]) => !id.startsWith('dark-'))
    .map(([id, t]) => {
      const kind =
        t.$type === 'fontFamily'
          ? 'font'
          : t.$type === 'color'
            ? 'color'
            : id === 'body'
              ? 'text'
              : id === 'radius'
                ? 'radius'
                : 'spacing'
      return `--${kind}-ui-${id}: var(--loomata-ui-${id});`
    })
  const outputs = {
    'tokens.generated.css': `/* Generated from tool DTCG. */\n:where(.loomata-ui) {\n${lines.join('\n')}\n}\n:where(.loomata-ui) :is(button,input) { font-family:var(--loomata-ui-sans)!important; font-size:var(--loomata-ui-body)!important; color:var(--loomata-ui-ink)!important; background:var(--loomata-ui-surface)!important; border:var(--loomata-ui-line) solid var(--loomata-ui-border)!important; border-radius:var(--loomata-ui-radius)!important; padding:var(--loomata-ui-space)!important; }\n:where(.loomata-ui) :disabled { color:var(--loomata-ui-muted)!important; }\n:where(.loomata-ui) label { margin:0!important; padding:0!important; gap:var(--loomata-ui-space)!important; color:var(--loomata-ui-ink)!important; }\n@media (prefers-color-scheme: dark) { :where(.loomata-ui) {\n${['surface', 'ink', 'border', 'selection'].map((id) => `--loomata-ui-${id}: var(--loomata-ui-dark-${id});`).join('\n')}\n} }\n`,
    'theme.generated.css': `/* Generated, never a value authority. */\n@theme { --*: initial; }\n@theme inline {\n--spacing: var(--loomata-ui-space);\n${theme.join('\n')}\n}\n`,
  }
  // Only static, token-backed visual utilities and structural utilities are accepted.
  const structural = new Set([
    'flex',
    'flex-col',
    'items-center',
    'justify-end',
    'justify-center',
    'min-h-0',
    'min-w-0',
    'w-full',
    'text-left',
    'overflow-y-auto',
    'shrink-0',
    'border-solid',
    'outline-solid',
    'outline-none',
    'cursor-pointer',
    'relative',
    'fixed',
    'inset-0',
    'border-0',
    'p-0',
    'm-0',
    'bg-transparent',
  ])
  const visual = new Set([
    'bg-ui-surface',
    'bg-ui-selection',
    'text-ui-ink',
    'text-ui-muted',
    'text-ui-body',
    'font-ui-sans',
    'border-ui-border',
    'outline-ui-accent',
    'rounded-ui-radius',
    'p-ui-space',
    'pl-ui-space',
    'pl-ui-indent-two',
    'pl-ui-indent-three',
    'pl-ui-indent-four',
    'pl-ui-indent-five',
    'px-ui-space',
    'py-ui-space',
    'gap-ui-space',
    'min-h-ui-row',
    'w-ui-dialog',
    'w-ui-icon',
    'h-ui-icon',
    'w-ui-chevron',
    'h-ui-chevron',
    'text-ui-icon-folder',
    'text-ui-icon-component',
    'text-ui-icon-story',
    'text-ui-icon-document',
  ])
  for (const name of ['src/loomata-ui/Controls.tsx']) {
    const source = await readFile(path.join(directory, name), 'utf8')
    if (/--adl-|style\s*=|ui:[^\s"']*\[/.test(source)) throw new Error('Unscoped UI style')
    for (const [, classes] of source.matchAll(/className="([^"]*)"/g)) {
      if (
        classes
          .split(/\s+/)
          .some((name) => name && name !== 'loomata-ui' && !name.startsWith('ui:'))
      )
        throw new Error('Unscoped UI class')
    }
    for (const match of source.matchAll(/ui:([a-zA-Z0-9:-]+)/g)) {
      const utility = match[1].split(':').at(-1)
      if (!structural.has(utility) && !visual.has(utility))
        throw new Error('Unapproved UI utility: ' + utility)
    }
  }
  for (const [name, bytes] of Object.entries(outputs)) {
    const file = path.join(base, 'styles', name)
    if (check) {
      if ((await readFile(file, 'utf8')) !== bytes) throw new Error('Stale tool theme')
    } else if ((await readFile(file, 'utf8').catch(() => null)) !== bytes)
      await writeFile(file, bytes)
  }
  return outputs
}
export async function nativeAppearanceTokens(directory = root) {
  await prepareLoomataUI(directory, true)
  return readFile(path.join(directory, 'src/loomata-ui/authority/tokens.tokens.json'))
}

if (process.argv[1] === fileURLToPath(import.meta.url))
  await prepareLoomataUI(root, process.argv.includes('--check'))
