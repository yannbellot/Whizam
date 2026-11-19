import { resolveCssContract } from './css-value-domains.mjs'
import { readFile, realpath, lstat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Ajv2020 from 'ajv/dist/2020.js'
import { parseDocument } from 'yaml'
import {
  bindingId,
  cssVariable,
  validateCatalog,
  validateEditorModel,
  validateEditorRequest,
  semanticEligible,
} from '../src/design-system/editor/contract.ts'
import { validateEditorModel as validateLegacyModel } from '../src/design-system/editor/legacy-v3-contract.ts'
import { loadTokens, editorProjection, tokenPath } from './dtcg-tokens.mjs'

const kitRoot = fileURLToPath(new URL('..', import.meta.url))
async function readYamlFile(file) {
  const bytes = await readFile(file)
  if (bytes.length > 2 * 1024 * 1024) throw new Error('authority-too-large')
  const document = parseDocument(bytes.toString('utf8'), { uniqueKeys: true })
  if (document.errors.length) throw new Error('yaml-invalid')
  return document.toJS({ maxAliasCount: 0 })
}
export const readContractYaml = async (name, root = kitRoot) => {
  const value = await readYamlFile(path.join(root, 'src/design-system/authority', `${name}.yaml`))
  if (name === 'components' && value.tokenFormat !== undefined) {
    if (value.tokenFormat !== 'dtcg-2025.10') throw new Error('incompatible-token-format')
    if (
      value.designSystemComponents.some((component) => !['ui', 'layout'].includes(component.family))
    )
      throw new Error('missing-component-family')
    const { tokenFormat: removedFormat, ...registry } = value
    return registry
  }
  if (['primitives', 'semantic-tokens'].includes(name) && (await isDtcgRoot(root))) {
    if ('primitives' in value || 'styles' in value || 'tokens' in value)
      throw new Error('mixed-token-authorities')
    const projected = editorProjection((await loadTokens(root)).document)
    return name === 'primitives'
      ? { ...value, primitives: projected.primitives }
      : { ...value, tokens: projected.legacy, styles: projected.styles }
  }
  return name === 'editor-contract' ? resolveCssContract(value, root) : value
}

export async function isDtcgRoot(root = kitRoot) {
  const registry = await readYamlFile(
    path.join(root, 'src/design-system/authority/components.yaml'),
  )
  if (registry.tokenFormat === 'dtcg-2025.10') return true
  try {
    await lstat(path.join(root, tokenPath))
  } catch (error) {
    if (error.code === 'ENOENT') return false
    throw error
  }
  throw new Error('mixed-token-authorities')
}
export async function readDesignSheet(root, file) {
  const sheet = await readYamlFile(path.join(root, file))
  if (await isDtcgRoot(root)) {
    if ('bindings' in sheet) throw new Error('mixed-token-authorities')
    const projected = editorProjection((await loadTokens(root)).document)
    return {
      ...sheet,
      bindings: projected.bindings.filter((binding) => binding.target === sheet.target),
    }
  }
  return sheet
}

export async function loadPreparedModel(authorities, context, root = kitRoot) {
  if (
    ['primitives', 'semantic-tokens', 'components'].some(
      (name) => authorities[name].schemaVersion !== 4,
    )
  )
    throw new Error('mixed-authority-versions')
  const registry = authorities.components
  const sheets = []
  const canonicalRoot = await realpath(root)
  for (const target of context.contract.targets) {
    const declared =
      target.id === 'foundations'
        ? registry.foundationsSheet
        : registry.designSystemComponents.find((component) => component.id === target.component)
            ?.designSheet
    if (declared !== target.sheet) throw new Error('invalid-sheet-path')
    const file = path.resolve(root, declared)
    const relative = path.relative(canonicalRoot, await realpath(file))
    if (relative.startsWith('..') || path.isAbsolute(relative))
      throw new Error('invalid-sheet-path')
    let current = root
    for (const segment of declared.split('/')) {
      current = path.join(current, segment)
      if ((await lstat(current)).isSymbolicLink()) throw new Error('symlink-sheet-path')
    }
    const sheet = await readDesignSheet(root, declared)
    if (sheet.target !== target.id) throw new Error('sheet-target-mismatch')
    sheets.push(sheet)
  }
  const model = {
    schemaVersion: 4,
    primitives: authorities.primitives.primitives.map((primitive) => ({
      id: primitive.id,
      type: primitive.type,
      family: primitive.family,
      ...(primitive.origins ? { origins: primitive.origins } : {}),
      value: primitive.value,
      provenance: primitive.provenance ?? {
        kind: 'agent-migration',
        status: 'proposed',
        reason: `Référence historique conservée : ${primitive.source}.`,
      },
    })),
    styles: authorities['semantic-tokens'].styles,
    bindings: sheets.flatMap((sheet) => sheet.bindings),
  }
  const semanticIds = [
    ...model.styles.map((style) => style.id),
    ...authorities['semantic-tokens'].tokens.map((token) => token.id),
  ]
  if (new Set(semanticIds).size !== semanticIds.length) throw new Error('duplicate-id')
  const variableNames = [...model.primitives, ...model.styles, ...model.bindings].map((item) =>
    cssVariable(item.id),
  )
  variableNames.push(
    ...authorities['semantic-tokens'].tokens.map(
      (token) => '--adl-' + token.id.replace(/^semantic\./, '').replaceAll('.', '-'),
    ),
  )
  if (new Set(variableNames).size !== variableNames.length) throw new Error('css-collision')
  validateModel(model, context)
  for (const sheet of sheets) validateSheet(sheet, context, model)
  return model
}
export async function loadCanonicalEditorModel(root = kitRoot) {
  const context = await validateEditorAuthorities(root)
  const authorities = Object.fromEntries(
    await Promise.all(
      ['primitives', 'semantic-tokens', 'components'].map(async (name) => [
        name,
        await readContractYaml(name, root),
      ]),
    ),
  )
  return { context, authorities, model: await loadPreparedModel(authorities, context, root) }
}
export async function loadEditorValidators(root = kitRoot, legacy = false) {
  const ajv = new Ajv2020({ allErrors: true, strict: true })
  const validators = {}
  for (const name of [
    'semantic-catalog',
    'editor-contract',
    'editor-model',
    'component-design',
    'editor-request',
    'editor-response',
  ]) {
    validators[name] = ajv.compile(
      JSON.parse(
        await readFile(
          path.join(
            root,
            'src/design-system/authority/schemas',
            `${legacy && ['editor-model', 'component-design'].includes(name) ? 'legacy-v3/' : ''}${name}.schema.json`,
          ),
          'utf8',
        ),
      ),
    )
  }
  return validators
}
export function requireSchema(validator, document) {
  if (!validator(document)) throw new Error(`schema-invalid: ${JSON.stringify(validator.errors)}`)
}
export async function validateEditorAuthorities(root = kitRoot) {
  const validators = await loadEditorValidators(root)
  const catalog = await readContractYaml('semantic-catalog', root)
  const contract = await readContractYaml('editor-contract', root)
  requireSchema(validators['semantic-catalog'], catalog)
  requireSchema(validators['editor-contract'], contract)
  validateCatalog(catalog, contract)
  return { catalog, contract, validators }
}
export function validateRequest(request, context, model) {
  requireSchema(context.validators['editor-request'], request)
  validateModel(model, context)
  validateEditorRequest(request, model, context.catalog, context.contract)
}
export function validateSheet(sheet, context, model) {
  requireSchema(context.validators['component-design'], sheet)
  if (sheet.bindings.some((binding) => binding.target !== sheet.target))
    throw new Error('sheet-target-mismatch')
  validateModel({ ...model, bindings: sheet.bindings }, context)
  const target = context.contract.targets.find((target) => target.id === sheet.target)
  if (sheet.presentation) {
    for (const [field, expected] of [
      ['variants', target.variants],
      ['states', target.states],
      ['parts', [...new Set(target.cells.map((cell) => cell.part))]],
    ]) {
      if (
        JSON.stringify(Object.keys(sheet.presentation[field]).sort()) !==
        JSON.stringify([...expected].sort())
      )
        throw new Error('presentation-context-mismatch')
    }
    for (const intention of sheet.presentation.priorityIntentions ?? []) {
      const [category, id] = intention.split('.')
      if (
        !context.catalog.categories
          .find((item) => item.id === category)
          ?.intentions.some((item) => item.id === id)
      )
        throw new Error('unknown-priority-intention')
    }
    const guidance = sheet.presentation.semanticGuidance
    if (guidance) {
      const matched = new Set()
      for (const rule of guidance.recommendations) {
        for (const variant of rule.variants)
          for (const property of rule.properties)
            for (const state of rule.states) {
              const binding = sheet.bindings.find(
                (item) =>
                  item.variant === variant &&
                  item.part === rule.part &&
                  item.property === property &&
                  item.state === state,
              )
              if (!binding) throw new Error('unknown-guidance-context')
              if (matched.has(binding.id)) throw new Error('overlapping-guidance')
              matched.add(binding.id)
              const definition = context.contract.properties[property]
              for (const key of rule.intentions) {
                const category = context.catalog.categories.find((item) =>
                  key.startsWith(item.id + '.'),
                )
                if (!category?.intentions.some((item) => category.id + '.' + item.id === key))
                  throw new Error('unknown-guidance-intention')
                if (
                  (!context.legacyVersion &&
                    !semanticEligible(context.catalog, key, definition.role)) ||
                  !category.compatibility.includes(definition.type + ':' + definition.role)
                )
                  throw new Error('incompatible-guidance-intention')
              }
            }
      }
      if (
        sheet.bindings.some(
          (item) =>
            item.style &&
            model.styles.find((style) => style.id === item.style)?.classification !==
              'non-semantic' &&
            !matched.has(item.id),
        )
      )
        throw new Error('incomplete-guidance')
    }
    if (sheet.presentation.contrastParts.some((part) => !sheet.presentation.parts[part]))
      throw new Error('unknown-contrast-part')
  }
  const preparedIds = new Set(sheet.bindings.map((binding) => binding.id))
  for (const variant of target.variants)
    for (const cell of target.cells)
      for (const property of cell.properties)
        for (const state of cell.states) {
          if (
            !preparedIds.has(
              bindingId({ target: target.id, variant, part: cell.part, property, state }),
            )
          )
            throw new Error('incomplete-sheet')
        }
}
export function validateModel(model, context) {
  requireSchema(context.validators['editor-model'], model)
  ;(context.legacyVersion === 3 ? validateLegacyModel : validateEditorModel)(
    model,
    context.catalog,
    context.contract,
  )
}
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  validateEditorAuthorities()
    .then(({ catalog, contract }) => {
      console.log(
        `✓ Contrats éditeur : ${catalog.categories.length} catégories, ${catalog.categories.reduce((sum, category) => sum + category.intentions.length, 0)} intentions, ${contract.targets.length} cibles ; contrats chargés.`,
      )
    })
    .catch((error) => {
      console.error(error.message)
      process.exitCode = 1
    })
}
