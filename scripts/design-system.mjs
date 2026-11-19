import { readFile, writeFile, mkdir, rename, rm, lstat, readdir } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { createHash } from 'node:crypto'
import { parseDocument } from 'yaml'
import { tokenCSS, validateTokenValue } from './token-values.mjs'
export const extension = 'org.agentic-design'
export const tokenFile = 'src/design-system/authority/tokens.tokens.json'
export const variable = (id) => '--adl-' + id.replaceAll('.', '-')
const safeName = /^[a-z][a-z0-9-]*(?:\.[a-z0-9][a-z0-9-]*)+$/
export function readTokens(document) {
  if (
    document.$extensions?.[extension]?.schemaVersion !== 2 ||
    document.$extensions?.[extension]?.dtcgVersion !== '2025.10'
  )
    throw new Error('Unsupported token policy')
  const entries = [],
    ids = new Map(),
    paths = new Map()
  function walk(group, segments = [], inherited) {
    for (const [key, node] of Object.entries(group)) {
      if (key.startsWith('$') && key !== '$root') continue
      if (!node || typeof node !== 'object' || /[.{}]/.test(key))
        throw new Error('Invalid token group')
      if (!('$value' in node)) {
        walk(node, [...segments, key], group.$type ?? inherited)
        continue
      }
      const meta = node.$extensions?.[extension]
      if (
        !meta ||
        !safeName.test(meta.id) ||
        !['primitive', 'component', 'local'].includes(meta.kind) ||
        !meta.id.startsWith(meta.kind + '.')
      )
        throw new Error('Invalid token identity/category')
      if (ids.has(meta.id)) throw new Error('Duplicate token: ' + meta.id)
      if (meta.kind !== 'primitive' && typeof meta.owner !== 'string')
        throw new Error('Missing token owner')
      if (meta.kind === 'local' && (!/^(app\/|src\/App\.)/.test(meta.owner) || meta.context))
        throw new Error('Local tokens belong to pages, never component instances')
      const entry = {
        id: meta.id,
        type: node.$type ?? group.$type ?? inherited,
        meta,
        node,
        path: [...segments, key].join('.'),
      }
      entries.push(entry)
      ids.set(entry.id, entry)
      paths.set(entry.path, entry)
    }
  }
  walk(document)
  if (!entries.length) throw new Error('Empty token authority')
  const names = new Set()
  for (const e of entries) {
    const v = variable(e.id)
    if (names.has(v)) throw new Error('CSS variable collision: ' + v)
    names.add(v)
    const reference =
      typeof e.node.$value === 'string' && e.node.$value.match(/^\{([^{}]+)\}$/)?.[1]
    if (e.meta.kind === 'primitive') {
      if (reference) throw new Error('Primitive must be a literal')
      validateTokenValue(e.type, e.node.$value)
      e.value = e.node.$value
    } else {
      const primitive = paths.get(reference)
      if (!primitive || primitive.meta.kind !== 'primitive')
        throw new Error('Token must reference a primitive: ' + e.id)
      if (e.type !== primitive.type) throw new Error('Token type mismatch: ' + e.id)
      e.reference = primitive.id
      e.value = primitive.node.$value
      validateTokenValue(e.type, e.value)
    }
    e.css = tokenCSS(e.type, e.value)
    e.variable = v
  }
  return { entries, ids, document }
}
export async function loadTokens(root) {
  return readTokens(JSON.parse(await readFile(path.join(root, tokenFile), 'utf8')))
}
export function ensurePrimitive(document, type, value) {
  validateTokenValue(type, value)
  const model = readTokens(document)
  const normalize = (v) =>
    Array.isArray(v)
      ? v.map(normalize)
      : v && typeof v === 'object'
        ? Object.fromEntries(
            Object.keys(v)
              .sort()
              .map((k) => [k, normalize(v[k])]),
          )
        : v
  const normalized = JSON.stringify(normalize(value))
  const same = model.entries.find(
    (e) =>
      e.meta.kind === 'primitive' &&
      e.type === type &&
      JSON.stringify(normalize(e.value)) === normalized,
  )
  if (same) return same.id
  const suffix = createHash('sha256')
    .update(type + ':' + normalized)
    .digest('hex')
    .slice(0, 16)
  const id = `primitive.${type.toLowerCase()}.value-${suffix}`
  document.primitive ??= {}
  document.primitive[type.toLowerCase()] ??= {}
  document.primitive[type.toLowerCase()]['value-' + suffix] = {
    $type: type,
    $value: value,
    $extensions: { [extension]: { id, kind: 'primitive' } },
  }
  return id
}
export function retargetToken(document, id, type, value) {
  const token = readTokens(document).ids.get(id)
  if (!token || token.meta.kind === 'primitive' || token.type !== type)
    throw new Error('Retarget a compatible component or page token')
  const primitive = ensurePrimitive(document, type, value)
  const target = readTokens(document).ids.get(primitive)
  token.node.$value = `{${target.path}}`
  readTokens(document)
  return primitive
}
async function yaml(root, file) {
  const doc = parseDocument(await readFile(path.join(root, file), 'utf8'), { uniqueKeys: true })
  if (doc.errors.length) throw new Error('Invalid YAML: ' + file)
  return doc.toJSON()
}
async function internal(root, file) {
  if (typeof file !== 'string' || path.isAbsolute(file) || file.split('/').includes('..'))
    throw new Error('Invalid source path')
  const full = path.join(root, file)
  let cursor = root
  for (const segment of file.split('/')) {
    cursor = path.join(cursor, segment)
    if ((await lstat(cursor)).isSymbolicLink()) throw new Error('Source symlink refused: ' + file)
  }
  return full
}
const kebab = (text) => text.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase())
const cssProperties = {
  background: 'background-color',
  foreground: 'color',
  fontSize: 'font-size',
  fontWeight: 'font-weight',
  fontFamily: 'font-family',
  lineHeight: 'line-height',
  borderRadius: 'border-radius',
  paddingBlock: 'padding-block',
  paddingInline: 'padding-inline',
  ringColor: 'outline-color',
  ringWidth: 'outline-width',
  ringOffset: 'outline-offset',
}
export async function prepare(root) {
  const model = await loadTokens(root)
  const registry = await yaml(root, 'src/design-system/authority/components.yaml')
  const outputs = new Map(),
    lines = []
  for (const e of model.entries)
    lines.push(`${e.variable}: ${e.reference ? `var(${variable(e.reference)})` : e.css};`)
  let css =
    '/* Generated; do not edit. */\n:root {\n' + lines.map((l) => '  ' + l).join('\n') + '\n}\n'
  const contexts = new Map(),
    utilities = new Map()
  for (const e of model.entries.filter((e) => e.meta.context)) {
    const c = e.meta.context
    if (
      ![c.target, c.variant, c.part, c.property, c.state].every(
        (x) => typeof x === 'string' && /^[a-zA-Z][a-zA-Z0-9-]*$/.test(x),
      )
    )
      throw new Error('Invalid component context')
    const key = `${c.target}/${c.variant}`,
      slot = `${c.part}-${kebab(c.property)}-${c.state}`
    const list = contexts.get(key) ?? []
    list.push(`  --adl-slot-${slot}: var(${e.variable});`)
    contexts.set(key, list)
    utilities.set(slot, cssProperties[c.property] ?? kebab(c.property))
  }
  for (const [key, list] of contexts) {
    const [target, variant] = key.split('/')
    css += `[data-design-target="${target}"][data-design-variant="${variant}"] {\n${list.join('\n')}\n}\n`
  }
  const recipes = await yaml(root, 'src/design-system/authority/recipes.yaml')
  if (
    recipes.schemaVersion !== 3 ||
    !Array.isArray(recipes.recipes) ||
    !Array.isArray(recipes.outputs)
  )
    throw new Error('Invalid recipes')
  const recipeValues = new Map(),
    recipeVariables = new Set()
  const words = new Set(
    'auto collapse currentColor min max minmax repeat auto-fit calc clamp linear-gradient to top right transparent solid translateX translate background transform uppercase'.split(
      ' ',
    ),
  )
  for (const recipe of recipes.recipes) {
    if (recipeValues.has(recipe.id) || !safeName.test(recipe.id))
      throw new Error('Invalid recipe identity')
    const value = recipe.parts
      .map((part) => {
        if (typeof part === 'string') {
          if (
            !/^[a-zA-Z\s(),+*/.-]*$/.test(part) ||
            [...part.matchAll(/[a-zA-Z][a-zA-Z-]*/g)].some(([w]) => !words.has(w))
          )
            throw new Error('Unprepared recipe grammar')
          return part
        }
        const token = model.ids.get(part.reference)
        if (
          !token ||
          token.meta.kind !== 'primitive' ||
          Object.keys(part).some((k) => !['reference', 'unit'].includes(k))
        )
          throw new Error('Invalid recipe parameter')
        if (
          part.unit !== undefined &&
          (token.type !== 'number' || !['em', 'vh', 'vw', 'fr', '%'].includes(part.unit))
        )
          throw new Error('Invalid recipe unit')
        return token.css + (part.unit ?? '')
      })
      .join('')
    if (!value || /[;{}]|var\(|url\(|@/i.test(value)) throw new Error('Invalid recipe value')
    recipeValues.set(recipe.id, value)
  }
  for (const output of recipes.outputs) {
    if (!safeName.test(output.id) || !recipeValues.has(output.reference))
      throw new Error('Invalid recipe output')
    const name = variable(
      output.id.startsWith('recipe.')
        ? output.id
        : 'recipe.' + output.id.replace(/^component\.composition\./, ''),
    )
    if (recipeVariables.has(name)) throw new Error('Duplicate recipe output')
    recipeVariables.add(name)
    css += `:root { ${name}: ${recipeValues.get(output.reference)}; }\n`
  }
  // Check actual CSS consumers, not just the shape of the registry.
  const declared = new Set([...model.entries.map((e) => e.variable), ...recipeVariables])
  async function auditCSS(file) {
    const text = await readFile(path.join(root, file), 'utf8')
    for (const [, name] of text.matchAll(/var\(\s*(--adl-[a-z0-9-]+)/g)) {
      if (name.startsWith('--adl-slot-')) continue
      if (!declared.has(name)) throw new Error('Unknown CSS token ' + name + ' in ' + file)
      if (name.startsWith('--adl-primitive-'))
        throw new Error('Direct primitive consumption in ' + file)
    }
  }
  async function cssDirectory(dir) {
    for (const entry of await readdir(path.join(root, dir), { withFileTypes: true })) {
      const file = dir + '/' + entry.name
      if (entry.isDirectory() && entry.name !== 'editor') await cssDirectory(file)
      else if (entry.isFile() && file.endsWith('.css') && !file.includes('.generated.'))
        await auditCSS(file)
    }
  }
  await cssDirectory('src/design-system')
  await cssDirectory('src/styles')
  await cssDirectory('app')
  await auditCSS('src/App.module.css')
  const fonts = JSON.parse(
    await readFile(
      path.join(root, 'src/design-system/authority/google-fonts.catalog.json'),
      'utf8',
    ),
  )
  for (const font of fonts.families)
    css += `@font-face { font-family: "${font.cssFamily}"; font-style: normal; font-weight: ${font.minWeight} ${font.maxWeight}; font-display: swap; src: url("/fonts/${font.id}-${font.files[0].sha256.slice(0, 16)}/font.ttf") format("truetype"); }\n`
  outputs.set('src/styles/tokens.generated.css', css)
  outputs.set(
    'src/styles/project-theme.generated.css',
    '/* Generated; do not edit. */\n' +
      [...utilities]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, prop]) => `@utility token-${key} { ${prop}: var(--adl-slot-${key}); }`)
        .join('\n') +
      '\n',
  )
  const plain = model.entries.map((e) => ({
    id: e.id,
    type: e.type,
    kind: e.meta.kind,
    owner: e.meta.owner ?? '',
    reference: e.reference ?? '',
    value: e.css,
    variable: e.variable,
  }))
  outputs.set(
    'src/design-system/tokens.generated.ts',
    '// Generated; do not edit.\nexport const inventory = ' +
      JSON.stringify(plain, null, 2) +
      ' as const\nexport const definitionStyles = []\n',
  )
  const storyIds = new Set(),
    implementations = new Set()
  for (const c of registry.designSystemComponents) {
    if (
      !/^[A-Z][A-Za-z0-9]*$/.test(c.id) ||
      !/^[a-z][a-z0-9-]*$/.test(c.target) ||
      !Array.isArray(c.requiredExamples) ||
      !c.requiredExamples.length
    )
      throw new Error('Incomplete component contract')
    implementations.add(c.implementation)
    await internal(root, c.implementation)
    const fixture = await readFile(await internal(root, c.examples), 'utf8')
    const exports = [...fixture.matchAll(/export const ([A-Za-z][A-Za-z0-9]*)\b/g)].map((m) => m[1])
    if (!exports.length || !fixture.includes('export default'))
      throw new Error('Missing example contract: ' + c.id)
    for (const state of c.requiredExamples ?? [])
      if (!exports.includes(state)) throw new Error('Missing state fixture: ' + c.id + '/' + state)
    if (storyIds.has(c.storyId)) throw new Error('Duplicate story id')
    storyIds.add(c.storyId)
    const relative = path.relative(path.dirname(c.story), c.examples).replace(/\.tsx$/, '')
    const from = relative.startsWith('.') ? relative : './' + relative
    const story =
      `// Generated from components.yaml and authored examples; do not edit.\nimport type { Meta, StoryObj } from '@storybook/react-vite'\nimport definition, * as examples from ${JSON.stringify(from)}\nconst meta = { ...definition, id: ${JSON.stringify(c.storyId)}, title: ${JSON.stringify(c.title)}, tags: ['autodocs'] } satisfies Meta<typeof definition.component>\nexport default meta\ntype Story = StoryObj<typeof meta>\n` +
      exports.map((e) => `export const ${e}: Story = { ...examples.${e} }`).join('\n') +
      '\n'
    if (!c.story.endsWith('.generated.stories.tsx'))
      throw new Error('Only generated story paths are owned')
    outputs.set(c.story, story)
    const contextsFor = model.entries.filter((e) => e.meta.context?.target === c.target)
    if (c.target && !contextsFor.length) throw new Error('Component without tokens: ' + c.id)
    for (const variant of new Set(contextsFor.map((e) => e.meta.context.variant))) {
      const example = c.variantExamples?.[variant]
      if (!example || !exports.includes(example))
        throw new Error('Missing variant fixture: ' + c.id + '/' + variant)
    }
  }
  // Every exported shared UI component must have a documentation contract.
  async function audit(dir) {
    for (const entry of await readdir(path.join(root, dir), { withFileTypes: true })) {
      const file = dir + '/' + entry.name
      if (entry.isDirectory()) await audit(file)
      else if (
        file.endsWith('.tsx') &&
        !/\.(examples|stories|generated)\./.test(file) &&
        /export (?:function|const) [A-Z]/.test(await readFile(path.join(root, file), 'utf8')) &&
        !file.endsWith('/text-content.tsx')
      ) {
        const text = await readFile(path.join(root, file), 'utf8')
        for (const [, name] of text.matchAll(/export (?:function|const) ([A-Z][A-Za-z0-9]*)/g))
          if (
            !registry.designSystemComponents.some(
              (c) => c.implementation === file && (c.export ?? c.id) === name,
            )
          )
            throw new Error('Undocumented shared component: ' + file + '/' + name)
      }
    }
  }
  await audit('src/design-system/components')
  const escape = (text) => String(text).replace(/[|<>\n]/g, ' ')
  outputs.set(
    'docs/design-system/style-inventory.md',
    '# Inventaire généré du design system\n\nConsultation uniquement. Sources : JSON DTCG et contrats des composants.\n\n| Token | Catégorie | Propriétaire | Primitive | Valeur |\n| --- | --- | --- | --- | --- |\n' +
      plain
        .map(
          (e) =>
            `| ${escape(e.id)} | ${e.kind} | ${escape(e.owner)} | ${escape(e.reference)} | ${escape(e.value)} |`,
        )
        .join('\n') +
      '\n',
  )
  outputs.set(
    'docs/design-system/semantic-catalog.md',
    '# Organisation des tokens\n\nDocument généré. Trois catégories : primitives (valeurs brutes), tokens de composant et tokens locaux de page. Les deux dernières référencent directement les primitives. Les anciennes décisions sémantiques ne sont plus une couche active.\n',
  )
  return { outputs, model }
}
export async function synchronize(root, { check = false } = {}) {
  // Single publisher, prepare entirely before replacing outputs. Servers are started after sync.
  const lock = path.join(root, '.design-sync.local')
  await mkdir(lock, { mode: 0o700 }).catch(() => {
    throw new Error('Generation already running or interrupted; inspect .design-sync.local')
  })
  await writeFile(path.join(lock, 'owner.json'), JSON.stringify({ pid: process.pid }))
  let publishing = false,
    completed = false
  try {
    const { outputs, model } = await prepare(root)
    const previous = await readFile(path.join(root, '.design-sync-manifest.local'), 'utf8')
      .then(JSON.parse)
      .catch((e) => {
        if (e.code === 'ENOENT') return []
        throw e
      })
    if (!Array.isArray(previous) || previous.some((f) => typeof f !== 'string'))
      throw new Error('Invalid generation manifest')
    const obsolete = previous.filter((file) => !outputs.has(file))
    if (check) {
      for (const [file, text] of outputs)
        if ((await readFile(path.join(root, file), 'utf8').catch(() => null)) !== text)
          throw new Error('Stale generated output: ' + file)
      if (obsolete.length) throw new Error('Obsolete generated outputs')
      return { count: model.entries.length, outputs: outputs.size }
    }
    for (const [file, text] of outputs) {
      if (path.isAbsolute(file) || file.split('/').includes('..'))
        throw new Error('Output escapes source root')
      const full = path.join(root, file)
      await internal(root, path.dirname(file))
      await mkdir(path.dirname(full), { recursive: true })
      // Never overwrite an authored file or follow a source symlink.
      try {
        if ((await lstat(full)).isSymbolicLink()) throw new Error('Output symlink refused')
        const old = await readFile(full, 'utf8')
        if (
          !old.startsWith('// Generated') &&
          !old.startsWith('/* Generated') &&
          ![
            'docs/design-system/style-inventory.md',
            'docs/design-system/semantic-catalog.md',
          ].includes(file)
        )
          throw new Error('Unowned output: ' + file)
      } catch (e) {
        if (e.code !== 'ENOENT') throw e
      }
      await writeFile(path.join(lock, createHash('sha256').update(file).digest('hex')), text)
    }
    publishing = true
    for (const [file] of outputs) {
      const candidate = path.join(lock, createHash('sha256').update(file).digest('hex'))
      if (
        (await readFile(path.join(root, file), 'utf8').catch(() => null)) ===
        (await readFile(candidate, 'utf8'))
      )
        continue
      await rename(candidate, path.join(root, file))
    }
    for (const file of obsolete) {
      if (!file.endsWith('.generated.stories.tsx')) continue
      const full = await internal(root, file)
      if (!(await readFile(full, 'utf8')).startsWith('// Generated'))
        throw new Error('Refusing to remove authored story')
      await rm(full)
    }
    await writeFile(path.join(lock, 'manifest.json'), JSON.stringify([...outputs.keys()]))
    await rename(path.join(lock, 'manifest.json'), path.join(root, '.design-sync-manifest.local'))
    completed = true
    return { count: model.entries.length, outputs: outputs.size }
  } finally {
    // An interrupted publication retains its lock; a completed/validation-only run releases it.
    if (!publishing || completed) await rm(lock, { recursive: true, force: true })
  }
}

export async function recoverGeneration(root) {
  const lock = path.join(root, '.design-sync.local')
  const owner = JSON.parse(await readFile(path.join(lock, 'owner.json'), 'utf8'))
  if (!Number.isSafeInteger(owner.pid) || owner.pid < 1)
    throw new Error('Invalid publication owner; inspect the retained state')
  try {
    process.kill(owner.pid, 0)
    throw new Error('Publication owner is still alive')
  } catch (error) {
    if (error.code !== 'ESRCH') throw error
  }
  const preserved = path.join(root, `.design-sync-recovery-${Date.now()}.local`)
  await rename(lock, preserved)
  try {
    return await synchronize(root)
  } catch (error) {
    await mkdir(lock, { recursive: true })
    await writeFile(path.join(lock, 'owner.json'), JSON.stringify(owner))
    throw error
  }
}
