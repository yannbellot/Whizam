import { compositionArtifacts } from './ui-composition.mjs'
import { readFile, readdir, lstat, realpath } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import path from 'node:path'
import { parse } from 'yaml'
import { canonicalJSON } from '../src/design-system/editor/canonical-json.ts'
import { loadTokens } from './dtcg-tokens.mjs'
import { localTokenKey } from './project-theme.mjs'
import { isDtcgRoot } from './validate-editor-contract.mjs'

export async function createEditorSnapshot(root, { model, context, authorities }) {
  if (Object.values(context.contract.properties).some((property) => !property.label))
    throw new Error('missing-property-label')
  const presentation = {}
  for (const target of context.contract.targets) {
    const sheet = parse(await readFile(path.join(root, target.sheet), 'utf8'))
    if (!sheet.presentation) throw new Error(`missing-presentation: ${target.id}`)
    presentation[target.id] = sheet.presentation
  }
  const files = []
  async function walk(relative) {
    for (const entry of await readdir(path.join(root, relative), { withFileTypes: true })) {
      if (
        entry.name.includes(' 2.') ||
        entry.name.includes('.generated.') ||
        entry.name.endsWith('.stories.tsx') ||
        entry.name === 'editor'
      )
        continue
      const file = relative + '/' + entry.name
      if (entry.isDirectory()) await walk(file)
      else if (entry.isFile() && /\.(css|tsx)$/.test(entry.name)) files.push(file)
      else if (entry.isSymbolicLink()) throw new Error('symlink-consumer')
    }
  }
  await walk('src')
  await walk('app')
  const source = new Map(
    await Promise.all(
      files.map(async (file) => [file, await readFile(path.join(root, file), 'utf8')]),
    ),
  )
  for (const local of Object.values(presentation))
    for (const file of local.consumerFiles) {
      if (
        file.split('/').includes('..') ||
        !source.has(file) ||
        (await lstat(path.join(root, file))).isSymbolicLink() ||
        path
          .relative(await realpath(root), await realpath(path.join(root, file)))
          .split(path.sep)
          .join('/') !== file
      )
        throw new Error('unknown-consumer-file')
    }
  const references = new Map()
  for (const binding of model.bindings)
    references.set('--adl-' + binding.id.replaceAll('.', '-'), binding.id)
  for (const token of authorities['semantic-tokens'].tokens)
    references.set('--adl-' + token.id.replace(/^semantic\./, '').replaceAll('.', '-'), token.id)
  const composition = await compositionArtifacts(root)
  const usages = [],
    inventoryIssues = []
  for (const [file, text] of source) {
    for (const match of text.matchAll(/project:(?:[a-z-]+:)*token-([a-z0-9-]+)/g)) {
      const matches = model.bindings.filter(
        (binding) =>
          presentation[binding.target].consumerFiles.includes(file) &&
          localTokenKey(binding) === match[1],
      )
      if (!matches.length) inventoryIssues.push(`Utilitaire projet non préparé : ${file}`)
      for (const binding of matches) usages.push({ reference: binding.id, file, kind: 'binding' })
    }

    for (const match of text.matchAll(/var\(\s*(--adl-[a-z0-9-]+)/g)) {
      const name = match[1]
      if (composition.variables.has(name)) {
        const token = composition.data.tokens.find(
          (t) => '--adl-' + t.id.replaceAll('.', '-') === name,
        )
        if (token.reference.startsWith('semantic.'))
          usages.push({ reference: token.reference, file, kind: 'alias' })
        continue
      }
      if (name.startsWith('--adl-local-')) {
        const matches = model.bindings.filter(
          (binding) =>
            presentation[binding.target].consumerFiles.includes(file) &&
            name ===
              `--adl-local-${binding.part}-${binding.property.replace(/[A-Z]/g, (letter) => '-' + letter.toLowerCase())}-${binding.state}`,
        )
        if (!matches.length) inventoryIssues.push(`Référence locale non préparée : ${file}`)
        for (const binding of matches) usages.push({ reference: binding.id, file, kind: 'binding' })
      } else {
        const reference = references.get(name)
        if (!reference) inventoryIssues.push(`Référence non préparée : ${file}`)
        else
          usages.push({
            reference,
            file,
            kind: reference.startsWith('component.') ? 'binding' : 'alias',
          })
      }
    }
    for (const match of text.matchAll(/var\(\s*\$\{([^}]+)\}/g)) {
      const registered = Object.values(presentation)
        .flatMap((local) => local.dynamicConsumers ?? [])
        .some((item) => item.file === file && item.group === 'legacy-tokens')
      if (
        file === 'src/design-system/Foundations.tsx' &&
        registered &&
        text.includes('tokens.map') &&
        match[1].trim() === 'token.variable'
      )
        for (const token of authorities['semantic-tokens'].tokens)
          usages.push({ reference: token.id, file, kind: 'dynamic' })
      else if (
        file === 'src/design-system/TokenCatalog.tsx' &&
        match[1].trim() === 'tokenVariables.get(style.id)' &&
        text.includes('semanticTokens, ...componentTokens')
      ) {
        for (const style of model.styles.filter((style) => style.type === 'color'))
          usages.push({ reference: style.id, file, kind: 'dynamic' })
        for (const binding of model.bindings.filter(
          (binding) => context.contract.properties[binding.property].type === 'color',
        ))
          usages.push({ reference: binding.id, file, kind: 'dynamic' })
      } else if (
        file === 'src/design-system/PrimitiveCatalog.tsx' &&
        match[1].trim() === 'primitiveSamples[primitive.id]' &&
        text.includes("import { primitiveSamples } from './tokens.generated'")
      ) {
        // Closed sample aliases are generated from the composition authority and primitive list.
      } else inventoryIssues.push(`Usage dynamique non préparé : ${file}`)
    }
  }
  const unique = [
    ...new Map(
      usages.map((item) => [`${item.reference}|${item.file}|${item.kind}`, item]),
    ).values(),
  ]
  for (const binding of model.bindings)
    if (!unique.some((usage) => usage.reference === binding.id))
      inventoryIssues.push(`Consommation non identifiée : ${binding.id}`)
  const data = {
    schemaVersion: 4,
    authorityGeneration: createHash('sha256')
      .update(
        canonicalJSON({
          tokens: (await isDtcgRoot(root)) ? (await loadTokens(root)).document : null,
          composition: composition.css,
        }),
      )
      .digest('hex'),
    model,
    contract: context.contract,
    catalog: context.catalog,
    presentation,
    legacy: authorities['semantic-tokens'].tokens,
    usages: unique,
    inventoryIssues: [...new Set(inventoryIssues)],
  }
  return { ...data, generation: createHash('sha256').update(canonicalJSON(data)).digest('hex') }
}
