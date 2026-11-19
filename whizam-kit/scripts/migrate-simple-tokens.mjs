// Explicit source-only migration. Never edits an installed source or its private journals.
import { readFile, writeFile, mkdir, access } from 'node:fs/promises'
import path from 'node:path'
import { parse, stringify } from 'yaml'
import { readTokens, tokenCSS } from './dtcg-tokens.mjs'
export async function migrate(source, destination) {
  source = path.resolve(source)
  destination = path.resolve(destination)
  if (source === destination || destination.startsWith(source + path.sep))
    throw new Error('Use a separate destination')
  for (const name of ['.design-editor.local', '.decision-policy-incomplete']) {
    try {
      await access(path.join(source, name))
      throw new Error('Private state present: migration refused')
    } catch (e) {
      if (e.code !== 'ENOENT') throw e
    }
  }
  try {
    await access(destination)
    throw new Error('Destination already exists')
  } catch (e) {
    if (e.code !== 'ENOENT') throw e
  }
  const document = JSON.parse(
    await readFile(path.join(source, 'src/design-system/authority/tokens.tokens.json'), 'utf8'),
  )
  const { entries, ids } = readTokens(document)
  const extension = 'org.agentic-design'
  const mapping = new Map()
  for (const e of entries) {
    let id = e.id
    if (e.meta.kind === 'decision') id = e.terminal
    if (e.meta.kind === 'alias')
      id = 'component.foundations.alias.' + e.id.replace(/^semantic\./, '')
    if (e.meta.consumer?.file?.startsWith('app/') || e.meta.consumer?.file === 'src/App.module.css')
      id = 'local.' + e.id.replace(/^component\.composition\./, '')
    mapping.set(e.id, id)
  }
  const result = { $extensions: { [extension]: { schemaVersion: 2, dtcgVersion: '2025.10' } } }
  const migration = []
  for (const e of entries) {
    if (e.meta.kind === 'decision') continue
    const id = mapping.get(e.id),
      primitive = e.meta.kind === 'primitive'
    const kind = primitive ? 'primitive' : id.startsWith('local.') ? 'local' : 'component'
    const meta = { id, kind }
    if (!primitive) {
      meta.owner = kind === 'local' ? e.meta.consumer.file : (e.meta.owner ?? 'foundations')
      if (e.meta.editor?.target) {
        const { target, variant, part, property, state } = e.meta.editor
        meta.context = { target, variant, part, property, state }
      }
      if (e.meta.consumer) meta.consumer = e.meta.consumer
    }
    if (e.meta.consumer?.file?.startsWith('src/ui-lab/')) continue
    let group = result
    const parts = id.split('.')
    for (const part of parts.slice(0, -1)) group = group[part] ??= {}
    group[parts.at(-1)] = {
      $type: e.type,
      $value: primitive ? e.value : `{${e.terminal}}`,
      $extensions: { [extension]: meta },
    }
    migration.push({
      from: e.id,
      to: id,
      type: e.type,
      primitive: e.terminal,
      value: e.value,
      css: tokenCSS(e.type, e.value),
      oldVariable:
        '--adl-' +
        (e.meta.kind === 'alias' ? e.id.replace(/^semantic\./, '') : e.id).replaceAll('.', '-'),
    })
  }
  const rules = parse(
    await readFile(path.join(source, 'src/design-system/authority/ui-composition.yaml'), 'utf8'),
  )
  for (const recipe of rules.recipes)
    for (const part of recipe.parts)
      if (part.reference) part.reference = ids.get(part.reference)?.terminal ?? part.reference
  rules.schemaVersion = 3
  delete rules.primitiveColorSamples
  for (const output of rules.outputs) {
    output.id = output.id.replace(/^component\.composition\./, 'recipe.')
  }
  // Closed expressions stay recipes, never masquerade as DTCG raw values.
  await mkdir(destination, { recursive: true })
  await writeFile(
    path.join(destination, 'tokens.tokens.json'),
    JSON.stringify(result, null, 2) + '\n',
  )
  await writeFile(path.join(destination, 'recipes.yaml'), stringify(rules))
  await writeFile(
    path.join(destination, 'migration.json'),
    JSON.stringify(
      {
        version: 1,
        tokens: migration,
        decisions: entries
          .filter((e) => e.meta.kind === 'decision')
          .map((e) => ({ from: e.id, primitive: e.terminal })),
        recipes: rules.outputs.map((o) => ({ id: o.id, reference: o.reference })),
      },
      null,
      2,
    ) + '\n',
  )
}
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const [source, destination] = process.argv.slice(2)
  if (!source || !destination)
    throw new Error('Usage: migrate-simple-tokens.mjs SOURCE DESTINATION')
  await migrate(source, destination)
}
