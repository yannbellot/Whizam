import { readFile, readdir, realpath } from 'node:fs/promises'
import { resolve, sep } from 'node:path'
import { z } from 'zod'
import { parse } from 'yaml'
import { loadCsf } from 'storybook/internal/csf-tools'
import { loadTokens } from './design-system.mjs'
import {
  primitiveCategories,
  tokenCategories,
  storyFamilies,
  catalogPages,
} from '../.storybook/organization'

const strings = z.array(z.string().min(1))
const schema = z
  .object({
    version: z.literal(1),
    stories: z.array(
      z
        .object({
          file: z.string(),
          component: z.string().optional(),
          tokenIds: strings.default([]),
        })
        .strict(),
    ),
    tokenIds: strings,
    primitiveIds: strings,
    rules: strings,
    classification: z
      .object({
        primitives: z.record(z.string(), z.array(z.enum(primitiveCategories)).min(1)).default({}),
        tokens: z.record(z.string(), z.enum(tokenCategories)).default({}),
      })
      .strict()
      .default({ primitives: {}, tokens: {} }),
  })
  .strict()

export async function readCatalog(root: string, warn: (message: string) => void = console.warn) {
  const project = schema.parse(
    JSON.parse(await readFile(resolve(root, '.storybook/project.json'), 'utf8')),
  )
  const registry = parse(
    await readFile(resolve(root, 'src/design-system/authority/components.yaml'), 'utf8'),
  )
  const model = await loadTokens(root)
  const ids = new Set([...project.tokenIds, ...project.primitiveIds])
  const files = new Set<string>()
  const titles = new Set<string>()
  const initial: string[] = JSON.parse(
    await readFile(resolve(root, '.storybook/starter-stories.json'), 'utf8'),
  )
  const stories: { file: string; title: string }[] = []
  const realRoot = await realpath(root)
  for (const item of project.stories) {
    if (
      !/^(app|src\/design-system)\/(?!.*(?:^|\/)\.)(?!.*\\).+\.stories\.[jt]sx?$/.test(item.file) ||
      item.file.split('/').includes('..') ||
      files.has(item.file)
    )
      throw new Error('Storybook : chemin invalide ou dupliqué : ' + item.file)
    const file = await realpath(resolve(root, item.file))
    if (!file.startsWith(realRoot + sep)) throw new Error('Storybook : source hors kit')
    const csf = loadCsf(await readFile(file, 'utf8'), {
      makeTitle: (title) => title ?? '',
      fileName: file,
    }).parse()
    const title = csf.meta?.title ?? ''
    if (
      !storyFamilies.some(
        (section) => title.startsWith(section + '/') && title.length > section.length + 1,
      )
    )
      throw new Error('Storybook : classement manquant ou invalide : ' + item.file)
    if (titles.has(title) || catalogPages.includes(title))
      throw new Error('Storybook : titre dupliqué ou réservé : ' + title)
    titles.add(title)
    if (item.component) {
      const component = registry.designSystemComponents.find(
        (c: { id: string }) => c.id === item.component,
      )
      if (!component || component.story !== item.file || component.title !== title)
        throw new Error('Storybook : contrat de composant incohérent : ' + item.component)
      for (const token of model.entries)
        if (token.meta.kind === 'component' && token.meta.owner === component.target)
          ids.add(token.id)
    } else if (item.file.endsWith('.generated.stories.tsx')) {
      throw new Error('Storybook : composant du registre requis : ' + item.file)
    }
    item.tokenIds.forEach((id) => ids.add(id))
    files.add(item.file)
    stories.push({ file: item.file, title })
  }
  for (const id of project.primitiveIds)
    if (model.ids.get(id)?.meta.kind !== 'primitive')
      throw new Error('Storybook : primitive inconnue : ' + id)
  for (const id of [...ids]) {
    const token = model.ids.get(id)
    if (!token) throw new Error('Storybook : token inconnu : ' + id)
    if (token.reference) ids.add(token.reference)
  }
  for (const directory of ['app', 'src/design-system']) {
    for (const name of await readdir(resolve(root, directory), { recursive: true })) {
      const file = directory + '/' + name
      if (/\.(stories\.[jt]sx?|mdx)$/.test(file) && !files.has(file)) {
        if (!initial.includes(file)) warn('Storybook : contenu non classé, non publié : ' + file)
      }
    }
  }
  for (const [kind, mapping] of Object.entries(project.classification)) {
    for (const [id, classification] of Object.entries(mapping)) {
      const entry = model.ids.get(id)
      if (!entry || (entry.meta.kind === 'primitive') !== (kind === 'primitives'))
        throw new Error('Storybook : classification incompatible : ' + id)
      const categories = typeof classification === 'string' ? [classification] : classification
      if (new Set(categories).size !== categories.length)
        throw new Error('Storybook : classification dupliquée : ' + id)
      for (const category of categories) {
        const allowed = category.startsWith('color.')
          ? ['color']
          : category === 'type.font-family'
            ? ['fontFamily']
            : category === 'type.font-weight'
              ? ['fontWeight']
              : category === 'type.line-height'
                ? ['number', 'dimension']
                : category === 'type'
                  ? ['fontFamily', 'fontWeight', 'number', 'dimension']
                  : category === 'stroke'
                    ? ['dimension', 'border']
                    : ['dimension']
        if (!allowed.includes(entry.type))
          throw new Error('Storybook : type incompatible avec la classification : ' + id)
      }
    }
  }
  const rows = model.entries
    .filter((token) => ids.has(token.id))
    .map((token) => {
      let categories: string[] = []
      if (token.meta.kind === 'primitive') {
        const family = primitiveCategories.find(
          (category) =>
            token.id.startsWith('primitive.' + category + '.') ||
            (category === 'color.standalone' && token.type === 'color'),
        )
        categories = project.classification.primitives[token.id] ?? (family ? [family] : [])
      } else {
        const category = project.classification.tokens[token.id]
        if (category) {
          categories = [category]
        }
      }
      if (!categories.length)
        warn('Storybook : élément sans classement, visible dans All : ' + token.id)
      const component = registry.designSystemComponents.find(
        (c: { target: string }) => c.target === token.meta.owner,
      )
      return {
        id: token.id,
        kind: token.meta.kind,
        owner: token.meta.owner ?? '',
        reference: token.reference ?? '',
        value: token.css,
        type: token.type,
        categories,
        property: token.meta.context?.property ?? '',
        state: token.meta.context?.state ?? '',
        consumer:
          token.meta.kind === 'local' ? token.meta.owner : (component?.implementation ?? ''),
      }
    })
  return { stories, rows, rules: project.rules }
}
