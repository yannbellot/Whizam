import { test } from 'node:test'
import assert from 'node:assert/strict'
import * as fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'
import { fileURLToPath } from 'node:url'
import { collect, safe } from '../scripts/documentation.mjs'
import { tomlNavigation } from '../scripts/documentation-navigation.mjs'
async function fixture(t) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'docs-fixture-'))
  t.after(() => fs.rm(root, { recursive: true, force: true }))
  await fs.mkdir(path.join(root, 'config/documentation'), { recursive: true })
  await fs.mkdir(path.join(root, 'docs'))
  await fs.writeFile(path.join(root, 'zensical.toml'), '[project]\nsite_name="Test"')
  await fs.writeFile(
    path.join(root, 'config/documentation/catalog.json'),
    JSON.stringify({ archives: { 'docs/old.md': 'History' }, image: 'pinned' }),
  )
  await fs.writeFile(
    path.join(root, 'README.md'),
    '# Accueil\n[Guide](docs/guide.md#usage)\n[Archive](docs/old.md)',
  )
  await fs.writeFile(path.join(root, 'docs/guide.md'), '# Usage\nDocumentation fictive')
  await fs.writeFile(path.join(root, 'docs/old.md'), 'SECRET_HISTORY_SENTINEL')
  return root
}
test('preparation renders active sources and excludes archives, parent and private files', async (t) => {
  const r = await fixture(t)
  await fs.writeFile(path.join(r, '.env.local'), 'PRIVATE_SENTINEL')
  const s = await collect(r)
  assert.ok(s.outputs.has('index.md'))
  assert.ok(!s.outputs.has('docs/old.md'))
  const all = [...s.outputs.values()].join('')
  assert.ok(!all.includes('SECRET_HISTORY_SENTINEL'))
  assert.ok(!all.includes('PRIVATE_SENTINEL'))
  assert.match(s.outputs.get('index.md').toString(), /#source-usage/)
  assert.equal(s.classification.length, 3)
})
test('new, renamed and removed documents are tracked deterministically', async (t) => {
  const r = await fixture(t),
    a = await collect(r)
  assert.equal((await collect(r)).digest, a.digest)
  await fs.writeFile(path.join(r, 'docs/new.md'), 'New')
  assert.ok((await collect(r)).outputs.has('docs/new.md'))
  await fs.rename(path.join(r, 'docs/new.md'), path.join(r, 'docs/renamed.md'))
  assert.ok(!(await collect(r)).outputs.has('docs/new.md'))
  await fs.rm(path.join(r, 'docs/renamed.md'))
  assert.equal((await collect(r)).digest, a.digest)
})
test('private and escaping links are refused, including symlinks', async (t) => {
  const r = await fixture(t)
  for (const link of ['../outside.md', '.env.local']) {
    await fs.writeFile(path.join(r, 'README.md'), `[bad](${link})`)
    await assert.rejects(collect(r), /Unsafe/)
  }
  await fs.symlink('/etc/passwd', path.join(r, 'docs/leak.md'))
  await assert.rejects(safe(r, 'docs/leak.md'), /symlink/)
})
test('missing links and invalid anchors are explicit diagnostics', async (t) => {
  const r = await fixture(t)
  await fs.writeFile(
    path.join(r, 'README.md'),
    '[bad](docs/guide.md#absent)\n[missing](docs/missing.md)',
  )
  const s = await collect(r)
  assert.equal(s.diagnostics.length, 2)
  assert.ok(!s.outputs.get('index.md').toString().includes('#absent'))
})

test('two sources cannot silently share a route', async (t) => {
  const r = await fixture(t)
  await fs.writeFile(path.join(r, 'index.md'), 'Collision')
  await assert.rejects(collect(r), /route collision/)
})

test('fenced examples remain literal Markdown source', async (t) => {
  const r = await fixture(t)
  await fs.writeFile(path.join(r, 'docs/code.md'), '# Guide\n```bash\n# Shell comment\n```')
  const s = await collect(r)
  assert.ok(s.outputs.get('docs/code.md').toString().includes('```bash\n# Shell comment\n```'))
})

test('an empty portal keeps a blank entry and still publishes new documents by default', async (t) => {
  const r = await fixture(t)
  const catalogPath = path.join(r, 'config/documentation/catalog.json')
  const catalog = JSON.parse(await fs.readFile(catalogPath, 'utf8'))
  catalog.archives['README.md'] = 'Internal starter resource'
  catalog.archives['docs/guide.md'] = 'Internal starter resource'
  await fs.writeFile(catalogPath, JSON.stringify(catalog))
  const empty = await collect(r)
  assert.equal(empty.pages.size, 0)
  assert.deepEqual([...empty.outputs.keys()], ['index.md'])
  assert.equal(empty.outputs.get('index.md').length, 0)
  await fs.writeFile(path.join(r, 'docs/project.md'), '# Projet utilisateur')
  const active = await collect(r)
  assert.ok(active.pages.has('docs/project.md'))
  assert.equal(active.outputs.get('index.md').length, 0)
  assert.ok(!active.pages.has('README.md'))
})

test('docs publication includes existing references on first collection with a useful home', async (t) => {
  const r = await fixture(t)
  const config = path.join(r, 'config/documentation/catalog.json')
  const catalog = JSON.parse(await fs.readFile(config, 'utf8'))
  catalog.publishDocs = true
  catalog.archives['README.md'] = 'Internal resource'
  await fs.writeFile(config, JSON.stringify(catalog))
  const state = await collect(r)
  assert.ok(state.pages.has('docs/old.md'))
  assert.ok(state.pages.has('docs/guide.md'))
  assert.ok(!state.pages.has('README.md'))
  assert.match(state.outputs.get('index.md').toString(), /Documentation du kit/)
  assert.match(state.outputs.get('docs/old.md').toString(), /Référence fournie avec le kit/)
  assert.equal((await collect(r)).digest, state.digest)
})

test('published historical docs never fetch parent, private or unsupported references', async (t) => {
  const r = await fixture(t)
  const config = path.join(r, 'config/documentation/catalog.json')
  const catalog = JSON.parse(await fs.readFile(config, 'utf8'))
  catalog.publishDocs = true
  catalog.archives['docs/reviews/old.md'] = 'History'
  await fs.writeFile(config, JSON.stringify(catalog))
  await fs.mkdir(path.join(r, 'docs/reviews'))
  await fs.writeFile(path.join(r, '.env.local'), 'PRIVATE_DO_NOT_PUBLISH')
  await fs.writeFile(path.join(r, 'unsupported.exe'), 'UNSUPPORTED_DO_NOT_PUBLISH')
  await fs.writeFile(
    path.join(r, 'docs/reviews/old.md'),
    '# Rapport\n[parent](../../../outside.md)\n[private](../../.env.local)\n[unsupported](../../unsupported.exe)',
  )
  const state = await collect(r)
  const rendered = state.outputs.get('docs/reviews/old.md').toString()
  assert.match(rendered, /Référence fournie avec le kit/)
  assert.equal(state.diagnostics.length, 3)
  assert.ok(!rendered.includes(']('))
  const all = [...state.outputs.values()].join('')
  assert.ok(!all.includes('PRIVATE_DO_NOT_PUBLISH'))
  assert.ok(!all.includes('UNSUPPORTED_DO_NOT_PUBLISH'))
  await fs.writeFile(path.join(r, 'docs/new.md'), '[private](../.env.local)')
  await assert.rejects(collect(r), /Unsafe/)
})

async function organized(t) {
  const root = await fixture(t)
  const file = path.join(root, 'config/documentation/catalog.json')
  const catalog = JSON.parse(await fs.readFile(file, 'utf8'))
  catalog.publishDocs = true
  catalog.organization = {
    version: 1,
    stages: [],
    documents: {
      'README.md': { kind: 'history' },
      'docs/old.md': { kind: 'history' },
      'docs/guide.md': {
        kind: 'guide',
        section: ['Documentation technique', 'Architecture et données'],
      },
    },
  }
  const save = () => fs.writeFile(file, JSON.stringify(catalog))
  await save()
  return { root, catalog, save }
}
test('organized portal excludes historical pages and linked downloads while retaining current guides', async (t) => {
  const { root, catalog, save } = await organized(t)
  catalog.archives['docs/guide.md'] = 'Legacy label on a current guide'
  await save()
  await fs.writeFile(path.join(root, 'docs/guide.md'), '# Guide actif\n[Ancien](old.md)')
  const state = await collect(root)
  assert.ok(state.pages.has('docs/guide.md'))
  assert.ok(!state.pages.has('docs/old.md'))
  assert.ok(![...state.outputs.values()].join('').includes('SECRET_HISTORY_SENTINEL'))
  assert.match(state.outputs.get('docs/guide.md').toString(), /Ancien \(document non publié\)/)
  assert.ok(!JSON.stringify(state.nav).includes('Historique du kit'))
  assert.match(state.outputs.get('_portal/steps.md').toString(), /Aucune étape définie/)
})
test('project tracking has explicit labels and order without changing its canonical sources', async (t) => {
  const { root, catalog, save } = await organized(t)
  await fs.writeFile(path.join(root, 'ROADMAP.md'), '# Roadmap du projet\nNon initialisé')
  await fs.writeFile(
    path.join(root, 'docs/project-state.md'),
    '# État courant du projet\nNon initialisé',
  )
  catalog.archives['ROADMAP.md'] = 'Former exclusion'
  await save()
  const state = await collect(root)
  const nav = JSON.stringify(state.nav)
  assert.ok(state.pages.has('ROADMAP.md'))
  assert.ok(nav.indexOf('État courant') < nav.indexOf('Roadmap'))
  assert.ok(nav.indexOf('Roadmap') < nav.indexOf('Étapes du projet'))
  assert.match(
    state.outputs.get('index.md').toString(),
    /\[Retrouver le suivi de mon projet\]\(docs\/project-state.md\)/,
  )
  assert.equal(
    await fs.readFile(path.join(root, 'ROADMAP.md'), 'utf8'),
    '# Roadmap du projet\nNon initialisé',
  )
})
test('real project stages group current preparations, reviews and decisions in explicit order', async (t) => {
  const { root, catalog, save } = await organized(t)
  catalog.organization.stages = [
    { id: 'later', title: 'Seconde étape', order: 2 },
    { id: 'first', title: 'Première étape', order: 1 },
  ]
  for (const [dir, phase] of [
    ['work-items', 'Préparation et réalisation'],
    ['reviews', 'Vérifications et retours'],
    ['decisions', 'Décisions et validation'],
  ]) {
    await fs.mkdir(path.join(root, 'docs', dir))
    const name = `docs/${dir}/new.md`
    await fs.writeFile(path.join(root, name), '# Document ' + dir)
    catalog.organization.documents[name] = { kind: 'project', stage: 'first', phase }
  }
  catalog.organization.documents['docs/guide.md'] = {
    kind: 'project',
    stage: 'later',
    phase: 'Cadrage et objectifs',
  }
  await save()
  const state = await collect(root)
  const nav = JSON.stringify(state.nav)
  assert.ok(nav.indexOf('Première étape') < nav.indexOf('Seconde étape'))
  for (const dir of ['work-items', 'reviews', 'decisions']) {
    assert.ok(state.pages.has(`docs/${dir}/new.md`))
    assert.equal(nav.split(`docs/${dir}/new.md`).length, 2)
  }
  assert.match(state.outputs.get('_portal/steps.md').toString(), /Première étape/)
  assert.match(tomlNavigation(state.nav), /^nav = \[\{"Accueil" = "index.md"\}/)
  assert.equal((await collect(root)).digest, state.digest)
})
test('new project documents stay visible with a classification diagnostic, including renames and removals', async (t) => {
  const { root } = await organized(t)
  await fs.mkdir(path.join(root, 'docs/work-items'))
  const file = path.join(root, 'docs/work-items/current.md')
  await fs.writeFile(file, '# Nouvelle préparation')
  const state = await collect(root)
  assert.ok(state.pages.has('docs/work-items/current.md'))
  assert.match(JSON.stringify(state.nav), /Documents à classer/)
  assert.ok(
    state.diagnostics.some(
      (d) => d.file === 'docs/work-items/current.md' && /Classement/.test(d.reason),
    ),
  )
  await fs.rename(file, path.join(root, 'docs/work-items/renamed.md'))
  const renamed = await collect(root)
  assert.ok(!renamed.pages.has('docs/work-items/current.md'))
  assert.ok(renamed.pages.has('docs/work-items/renamed.md'))
  await fs.rm(path.join(root, 'docs/work-items/renamed.md'))
  assert.ok(!(await collect(root)).pages.has('docs/work-items/renamed.md'))
})
test('invalid stage metadata fails before publication', async (t) => {
  const { root, catalog, save } = await organized(t)
  catalog.organization.documents['docs/guide.md'].stage = 'missing'
  await save()
  await assert.rejects(collect(root), /Unknown documentation stage/)
  catalog.organization.stages = [
    { id: 'missing', title: 'Étape' },
    { id: 'missing', title: 'Doublon' },
  ]
  await save()
  await assert.rejects(collect(root), /duplicate documentation stage/)
})

test('organized home cannot silently overwrite a new source at index.md', async (t) => {
  const { root } = await organized(t)
  await fs.writeFile(path.join(root, 'index.md'), '# Nouvelle source')
  await assert.rejects(collect(root), /Reserved documentation route/)
})
test('organization does not relax private link and symlink protections for new project content', async (t) => {
  const { root } = await organized(t)
  await fs.writeFile(path.join(root, 'docs/new.md'), '[Privé](../.env.local)')
  await assert.rejects(collect(root), /Unsafe documentation link/)
  await fs.rm(path.join(root, 'docs/new.md'))
  await fs.symlink('/etc/passwd', path.join(root, 'docs/leak.md'))
  const state = await collect(root)
  assert.ok(!state.pages.has('docs/leak.md'))
  await assert.rejects(safe(root, 'docs/leak.md'), /symlink/)
})

test('Whizam guide publishes nine canonical pages in pedagogical order and keeps histories excluded', async () => {
  const root = fileURLToPath(new URL('..', import.meta.url))
  const state = await collect(root)
  assert.deepEqual(
    state.nav.map((x) => Object.keys(x)[0]),
    ['Accueil', 'Guide d’utilisation', 'Documentation designer', 'Documentation technique'],
  )
  const guide = state.nav[1]['Guide d’utilisation']
  assert.deepEqual(
    guide.map((x) => Object.keys(x)[0]),
    [
      'Découvrir Whizam',
      'Bien démarrer',
      'Travailler avec l’assistant',
      'Concevoir et faire évoluer son projet',
      'Vérifier et décider',
      'Reprendre et transmettre',
      'Questions fréquentes',
    ],
  )
  const sources = [...state.pages.keys()].filter((x) => x.startsWith('docs/guide-whizam/'))
  assert.equal(sources.length, 9)
  for (const source of sources) {
    assert.equal(JSON.stringify(guide).split(source).length, 2)
    assert.ok(!state.diagnostics.some((d) => d.file === source), source)
  }
  assert.match(state.outputs.get('index.md').toString(), /\[Découvrir Whizam\]/)
  const home = state.outputs.get('index.md').toString()
  assert.match(home, /# Bienvenue dans Whizam/)
  for (const [label, target] of [
    ['Découvrir Whizam', 'docs/guide-whizam/index.md'],
    ['Préparer mon premier projet', 'docs/guide-whizam/preparer-kit.md'],
    ['Retrouver le suivi de mon projet', 'docs/project-state.md'],
    ['Consulter les questions fréquentes', 'docs/guide-whizam/questions-frequentes.md'],
  ])
    assert.ok(home.includes(`[${label}](${target})`))
  for (const anchor of [
    'documentation-du-projet',
    'documentation-designer',
    'documentation-technique',
  ])
    assert.ok(home.includes(`id="${anchor}"`))
  assert.ok(!home.includes('anciennement Loomata'))
  for (const d of state.classification.filter((x) => x.kind === 'history'))
    assert.ok(!state.pages.has(d.source))
})
