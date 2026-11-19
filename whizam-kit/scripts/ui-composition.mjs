import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { parseDocument } from 'yaml'
import postcss from 'postcss'
import { readContractYaml, isDtcgRoot } from './validate-editor-contract.mjs'
import { loadTokens } from './dtcg-tokens.mjs'
import { projectComposition } from './token-composition.mjs'

export async function compositionArtifacts(root) {
  const document = parseDocument(
    await readFile(path.join(root, 'src/design-system/authority/ui-composition.yaml'), 'utf8'),
    { uniqueKeys: true },
  )
  if (document.errors.length) throw new Error('Invalid composition YAML')
  const rules = document.toJSON()
  const modern = await isDtcgRoot(root)
  if (modern && rules.schemaVersion !== 2) throw new Error('mixed-token-authorities')
  const projected = modern
    ? projectComposition((await loadTokens(root)).document, rules)
    : { data: rules, parameters: [], decisions: [] }
  const data = projected.data
  if (data.schemaVersion !== 1 || !Array.isArray(data.primitives) || !Array.isArray(data.tokens))
    throw new Error('Invalid composition authority')
  const read = async (name) => readContractYaml(name, root)
  const main = await read('primitives'),
    semantic = await read('semantic-tokens')
  const known = new Set([...main.primitives, ...semantic.styles].map((p) => p.id))
  const ids = new Set()
  const variable = (id) => '--adl-' + id.replaceAll('.', '-')
  const lines = []
  for (const parameter of projected.parameters)
    lines.push(`${variable(parameter.id)}: ${parameter.value};`)
  const primitiveSamples = {}
  if (
    data.primitiveColorSamples?.tokenPrefix !== 'component.composition.catalog.primitive-sample' ||
    !data.primitiveColorSamples.usage
  )
    throw new Error('Invalid primitive sample authority')
  for (const primitive of main.primitives.filter((p) => p.type === 'color')) {
    const id = data.primitiveColorSamples.tokenPrefix + '.' + primitive.id
    primitiveSamples[primitive.id] = variable(id)
    lines.push(`${variable(id)}: var(${variable(primitive.id)});`)
  }
  for (const p of data.primitives) {
    if (
      !/^primitive\.composition\.[a-z0-9-]+$/.test(p.id) ||
      ids.has(p.id) ||
      typeof p.value !== 'string' ||
      /[;{}]|var\(|url\(|@/i.test(p.value)
    )
      throw new Error('Invalid composition primitive')
    ids.add(p.id)
    known.add(p.id)
    lines.push(`${variable(p.id)}: ${p.value};`)
  }
  for (const decision of projected.decisions) known.add(decision.id)
  for (const decision of projected.decisions) {
    if (
      !known.has(decision.reference) &&
      !projected.parameters.some((p) => p.id === decision.reference)
    )
      throw new Error('Unknown composition decision reference')
    lines.push(`${variable(decision.id)}: var(${variable(decision.reference)});`)
  }
  const consumers = new Map()
  for (const t of data.tokens) {
    if (
      !/^component\.composition\.[a-z0-9.-]+$/.test(t.id) ||
      ids.has(t.id) ||
      !known.has(t.reference) ||
      !t.usage ||
      !/^(src|app)\/[a-zA-Z0-9/.-]+\.css$/.test(t.file) ||
      t.file.includes('..')
    )
      throw new Error('Invalid composition token')
    ids.add(t.id)
    lines.push(`${variable(t.id)}: var(${variable(t.reference)});`)
    const text = consumers.get(t.file) ?? (await readFile(path.join(root, t.file), 'utf8'))
    consumers.set(t.file, text)
    let found = false
    postcss.parse(text).walkDecls((d) => {
      if (
        d.parent.selector === t.selector &&
        d.prop === t.property &&
        d.value.replace(/\s+/g, '').includes(`var(${variable(t.id)})`)
      )
        found = true
    })
    if (!found) throw new Error(`Missing composition consumer: ${t.id}`)
  }
  // Only declared decisions from the separate tool authority may style the tool chrome.
  const toolDocument = JSON.parse(
    await readFile(path.join(root, 'src/loomata-ui/authority/tokens.tokens.json'), 'utf8').catch(
      (error) => {
        if (error.code === 'ENOENT') return '{}'
        throw error
      },
    ),
  )
  const toolVariables = new Set(
    Object.keys(toolDocument.decision ?? {}).map((id) => '--loomata-ui-' + id),
  )
  async function audit(directory) {
    for (const entry of await readdir(path.join(root, directory), { withFileTypes: true })) {
      if (entry.name.includes(' 2') || entry.name === 'editor') continue
      const file = directory + '/' + entry.name
      if (entry.isDirectory()) await audit(file)
      else if (entry.isFile() && file.endsWith('.css') && !file.includes('.generated.'))
        assertTokenizedCSS(
          await readFile(path.join(root, file), 'utf8'),
          file,
          file.startsWith('src/loomata-ui/') ? toolVariables : new Set(),
        )
    }
  }
  await audit('src')
  await audit('app')
  return {
    data,
    primitiveSamples,
    variables: new Set(data.tokens.map((t) => variable(t.id))),
    css: `\n/* UI composition authority; outside the editable V1 matrix. */\n:root {\n${lines.join('\n')}\n}\n`,
  }
}

// Structural CSS keywords, percentages and resets carry no authored visual scale.
export function assertTokenizedCSS(text, file = '', toolVariables = new Set()) {
  const visual =
    /^(color|background(?:-.+)?|border(?:-.+)?|outline(?:-.+)?|box-shadow|font(?:-.+)?|line-height|letter-spacing|text-transform|text-decoration-color|text-decoration-thickness|text-shadow|fill|stroke|stroke-width|filter|animation(?:-.+)?|padding(?:-.+)?|margin(?:-.+)?|gap|row-gap|column-gap|width|height|min-width|min-height|max-width|max-height|grid-template-columns|transform|transition|opacity|z-index)$/
  const structural =
    /^(0(?: auto| 0)*|none|inherit|auto|transparent|currentColor|solid|unset|initial|100%|100vh|50%)$/
  postcss.parse(text).walkDecls((d) => {
    if (d.prop.startsWith('--')) return
    if (/var\(\s*--(?:adl|loomata-ui)-primitive-/.test(d.value))
      throw new Error(`Direct primitive consumption: ${file}:${d.source.start.line}`)
    if (visual.test(d.prop)) {
      const remaining = d.value
        .replace(/var\(\s*--adl-[\w-]+\s*\)/g, '')
        .replace(/var\(\s*(--loomata-ui-[\w-]+)\s*\)/g, (value, id) =>
          toolVariables.has(id) ? '' : value,
        )
        .replace(/!important\s*$/, '')
        .trim()
      if (remaining && !structural.test(remaining))
        throw new Error(`Untokenized visual value: ${file}:${d.source.start.line}`)
    }
  })
}
