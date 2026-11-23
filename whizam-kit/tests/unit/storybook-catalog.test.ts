import { afterEach, describe, expect, it } from 'vitest'
import { cp, mkdtemp, readFile, rm, writeFile, mkdir, symlink } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import { readCatalog } from '../../scripts/storybook-catalog'

const roots: string[] = []
afterEach(async () => {
  for (const root of roots.splice(0)) await rm(root, { recursive: true, force: true })
})
async function fixture(sourceRoot = process.cwd()) {
  const root = await mkdtemp(resolve(tmpdir(), 'sb01-'))
  roots.push(root)
  for (const file of [
    '.storybook/starter-stories.json',
    'src/design-system/authority/components.yaml',
    'src/design-system/authority/tokens.tokens.json',
    'src/design-system/components/Button/Button.generated.stories.tsx',
  ]) {
    await mkdir(resolve(root, file, '..'), { recursive: true })
    await cp(resolve(sourceRoot, file), resolve(root, file))
  }
  await mkdir(resolve(root, 'app'))
  // Simuler un kit neuf indépendamment des éléments adoptés par le projet courant.
  const config = {
    version: 1,
    stories: [] as { file: string; component?: string }[],
    tokenIds: [] as string[],
    primitiveIds: [] as string[],
    rules: [] as string[],
    classification: { primitives: {}, tokens: {} } as {
      primitives: Record<string, string[]>
      tokens: Record<string, string>
    },
  }
  const save = () => writeFile(resolve(root, '.storybook/project.json'), JSON.stringify(config))
  await save()
  return { root, config, save }
}
describe('publication Storybook du projet', () => {
  it('ne publie aucune référence du kit neuf', async () => {
    const { root } = await fixture()
    expect(await readCatalog(root)).toEqual({ stories: [], rows: [], rules: [] })
  })
  it('isole le kit neuf du registre d’un projet déjà alimenté sans modifier ce dernier', async () => {
    const project = await fixture()
    const { loadTokens } = await import('../../scripts/design-system.mjs')
    const model = await loadTokens(project.root)
    const local = model.entries.find(
      (row) => row.meta.kind === 'local' && row.type === 'dimension',
    )!
    project.config.stories = [
      {
        file: 'src/design-system/components/Button/Button.generated.stories.tsx',
        component: 'Button',
      },
    ]
    project.config.tokenIds = [local.id]
    project.config.primitiveIds = [local.reference!]
    project.config.rules = ['Règle synthétique du projet de test']
    project.config.classification = {
      primitives: { [local.reference!]: ['space'] },
      tokens: { [local.id]: 'size.container' },
    }
    await project.save()
    const registry = await readFile(resolve(project.root, '.storybook/project.json'), 'utf8')
    const catalog = await readCatalog(project.root)
    expect(catalog.stories).toHaveLength(1)
    expect(catalog.rows.length).toBeGreaterThan(0)
    expect(catalog.rules).toEqual(project.config.rules)

    const isolated = await fixture(project.root)
    expect(await readCatalog(isolated.root)).toEqual({ stories: [], rows: [], rules: [] })
    expect(await readFile(resolve(project.root, '.storybook/project.json'), 'utf8')).toBe(registry)
    expect(await readCatalog(project.root)).toEqual(catalog)
  })
  it('adopte un composant avec ses seuls tokens et primitives, puis le retire', async () => {
    const { root, config, save } = await fixture()
    config.stories.push({
      file: 'src/design-system/components/Button/Button.generated.stories.tsx',
      component: 'Button',
    })
    await save()
    const catalog = await readCatalog(root)
    expect(catalog.stories[0].title).toBe('02 — Components/UI Components/Button')
    expect(catalog.rows.some((row) => row.owner === 'button')).toBe(true)
    expect(
      catalog.rows.filter((row) => row.kind !== 'primitive').every((row) => row.owner === 'button'),
    ).toBe(true)
    for (const row of catalog.rows.filter((row) => row.reference))
      expect(catalog.rows.some((primitive) => primitive.id === row.reference)).toBe(true)
    expect(catalog.rows.length).toBeLessThan(396)
    config.stories = []
    await save()
    expect((await readCatalog(root)).rows).toEqual([])
  })
  it('signale une story non classée même renommée, et classe un vrai pattern', async () => {
    const { root, config, save } = await fixture()
    const file = 'app/Actual.stories.tsx'
    await writeFile(
      resolve(root, file),
      "export default {title: '03 — Patterns/Interaction Patterns/Actual'}; export const Real = {}",
    )
    const warnings: string[] = []
    expect((await readCatalog(root, (s) => warnings.push(s))).stories).toEqual([])
    expect(warnings[0]).toContain(file)
    config.stories.push({ file })
    await save()
    expect((await readCatalog(root)).stories).toHaveLength(1)
    await writeFile(resolve(root, file), "export default {title: 'Pages et composants/Actual'}")
    await expect(readCatalog(root)).rejects.toThrow('classement')
  })
  it('refuse tokens inconnus, contrats incohérents, doublons et sorties de racine', async () => {
    const { root, config, save } = await fixture()
    config.tokenIds = ['unknown']
    await save()
    await expect(readCatalog(root)).rejects.toThrow('token inconnu')
    config.tokenIds = []
    config.stories = [{ file: 'src/design-system/components/Button/Button.generated.stories.tsx' }]
    await save()
    await expect(readCatalog(root)).rejects.toThrow('composant du registre requis')
    config.stories[0].component = 'Field'
    await save()
    await expect(readCatalog(root)).rejects.toThrow('incohérent')
    config.stories = [{ file: 'app/../outside.stories.tsx' }]
    await save()
    await expect(readCatalog(root)).rejects.toThrow('chemin invalide')
    await symlink(
      resolve('app/features/projects/ProjectSummary.stories.tsx'),
      resolve(root, 'app/Escape.stories.tsx'),
    )
    config.stories = [{ file: 'app/Escape.stories.tsx' }]
    await save()
    await expect(readCatalog(root)).rejects.toThrow('source hors kit')
  })
  it('filtre les tokens locaux et conserve leur propriétaire de page', async () => {
    const { root, config, save } = await fixture()
    const { loadTokens } = await import('../../scripts/design-system.mjs')
    const model = await loadTokens(root)
    const local = model.entries.find((row) => row.meta.kind === 'local')!
    config.tokenIds = [local.id]
    await save()
    const catalog = await readCatalog(root)
    expect(catalog.rows).toHaveLength(2)
    expect(catalog.rows.find((row) => row.id === local.id)?.owner).toBe(local.meta.owner)
  })
})

describe('classement documentaire sans couche de tokens supplémentaire', () => {
  it('conserve les éléments non classés dans All et accepte plusieurs vues d’une primitive unique', async () => {
    const { root, config, save } = await fixture()
    const { loadTokens } = await import('../../scripts/design-system.mjs')
    const model = await loadTokens(root)
    const local = model.entries.find((e) => e.meta.kind === 'local' && e.type === 'dimension')!
    config.tokenIds = [local.id]
    const warnings: string[] = []
    await save()
    expect(
      (await readCatalog(root, (message) => warnings.push(message))).rows.find(
        (e) => e.id === local.id,
      )?.categories,
    ).toEqual([])
    expect(warnings.some((message) => message.includes(local.id))).toBe(true)
    config.classification = {
      primitives: { [local.reference!]: ['space', 'size'] },
      tokens: { [local.id]: 'size.container' },
    }
    await save()
    const catalog = await readCatalog(root)
    expect(catalog.rows.filter((e) => e.id === local.reference)).toHaveLength(1)
    expect(catalog.rows.find((e) => e.id === local.reference)?.categories).toEqual([
      'space',
      'size',
    ])
    expect(catalog.rows.find((e) => e.id === local.id)?.categories).toEqual(['size.container'])
    expect(catalog.rows.find((e) => e.id === local.id)?.consumer).toBe(local.meta.owner)
  })
  it('refuse catégories inconnues, identités incompatibles et types incohérents', async () => {
    const { root, config, save } = await fixture()
    config.classification = { primitives: {}, tokens: { unknown: 'color.action' } }
    await save()
    await expect(readCatalog(root)).rejects.toThrow('classification incompatible')
    config.classification = { primitives: { 'primitive.color.hex-ffffff': ['space'] }, tokens: {} }
    await save()
    await expect(readCatalog(root)).rejects.toThrow('type incompatible')
    config.classification = {
      primitives: {},
      tokens: { 'primitive.color.hex-ffffff': 'color.action' },
    }
    await save()
    await expect(readCatalog(root)).rejects.toThrow('classification incompatible')
    config.classification = {
      primitives: { 'primitive.color.hex-ffffff': ['unknown'] },
      tokens: {},
    }
    await save()
    await expect(readCatalog(root)).rejects.toThrow()
  })
  it('garde les destinations structurelles cohérentes et réserve leurs titres', async () => {
    const { catalogPages } = await import('../../.storybook/organization')
    const { readdir } = await import('node:fs/promises')
    const titles = await Promise.all(
      (await readdir('.storybook/structure'))
        .filter((f) => f.endsWith('.mdx'))
        .map(
          async (f) =>
            (await readFile('.storybook/structure/' + f, 'utf8')).match(
              /<Meta title="([^"]+)"/,
            )?.[1],
        ),
    )
    expect(titles.sort()).toEqual([...catalogPages].sort())
    const { root, config, save } = await fixture()
    await writeFile(
      resolve(root, 'app/Document.stories.tsx'),
      "export default { title: '01 — Foundations/Examples/Document' }; export const Overview = {}",
    )
    config.stories = [{ file: 'app/Document.stories.tsx' }]
    await save()
    expect((await readCatalog(root)).stories).toHaveLength(1)
    await writeFile(
      resolve(root, 'app/Document.stories.tsx'),
      "export default { title: '01 — Foundations/Examples/Accueil' }; export const Overview = {}",
    )
    await expect(readCatalog(root)).rejects.toThrow('réservé')
  })
})
