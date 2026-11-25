import { fileURLToPath } from 'node:url'
import { test } from 'node:test'
import assert from 'node:assert/strict'
import * as fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { collect, check } from '../scripts/documentation.mjs'
import {
  sourceHash,
  installLanguageLinks,
  copyLegacyFrench,
} from '../scripts/documentation-languages.mjs'
async function fixture(t) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'whizam-language-'))
  t.after(() => fs.rm(root, { recursive: true, force: true }))
  await fs.mkdir(path.join(root, 'config/documentation'), { recursive: true })
  await fs.mkdir(path.join(root, 'docs'))
  await fs.mkdir(path.join(root, 'translations/en/docs'), { recursive: true })
  await fs.writeFile(path.join(root, 'zensical.toml'), '[project]\nsite_name="Test"')
  await fs.writeFile(
    path.join(root, 'config/documentation/catalog.json'),
    JSON.stringify({ publishDocs: true, archives: { 'docs/history.md': 'Historical' } }),
  )
  await fs.writeFile(path.join(root, 'docs/guide.md'), '# Guide\n\nFrench source')
  await fs.writeFile(path.join(root, 'docs/history.md'), 'HISTORICAL_SENTINEL')
  await fs.writeFile(
    path.join(root, 'translations/en/docs/guide.md'),
    '# Guide\n\nEnglish translation',
  )
  await registry(root)
  return root
}
async function registry(root, source = '# Guide\n\nFrench source') {
  await fs.writeFile(
    path.join(root, 'translations/en/registry.json'),
    JSON.stringify({
      version: 1,
      documents: { 'docs/guide.md': { sourceHash: sourceHash(source) } },
    }),
  )
}
test('English is isolated, histories excluded and canonical French content unchanged', async (t) => {
  const r = await fixture(t)
  const fr = await collect(r),
    en = await collect(r, 'en')
  assert.match(fr.outputs.get('docs/guide.md').toString(), /French source/)
  assert.match(en.outputs.get('docs/guide.md').toString(), /English translation/)
  assert.ok(![...en.outputs.values()].join('').includes('HISTORICAL_SENTINEL'))
  assert.notEqual(en.digest, fr.digest)
})
test('source edits invalidate translations and checks even if English has not changed', async (t) => {
  const r = await fixture(t),
    a = await collect(r, 'en')
  await fs.writeFile(path.join(r, 'docs/guide.md'), '# Guide\nChanged source')
  const b = await collect(r, 'en')
  assert.notEqual(a.digest, b.digest)
  assert.ok(b.diagnostics.some((x) => x.reason === 'English translation is outdated'))
  assert.match(b.outputs.get('docs/guide.md').toString(), /translation needs updating/)
  await fs.mkdir(path.join(r, '.runtime.local/documentation'), { recursive: true })
  await fs.writeFile(
    path.join(r, '.runtime.local/documentation/current.json'),
    JSON.stringify({ digest: a.digest }),
  )
  await assert.rejects(check(r), /outdated/)
})
test('FR/EN pages omit the generic notice while reports retain their dated evidence limits', async (t) => {
  const root = await fixture(t)
  const report = 'docs/report.md'
  const fr = '# Rapport\n\nVersion candidate-123, 24 novembre 2026. Données fictives seulement.'
  const en = '# Report\n\nVersion candidate-123, 24 November 2026. Synthetic data only.'
  const catalogPath = path.join(root, 'config/documentation/catalog.json')
  const catalog = JSON.parse(await fs.readFile(catalogPath, 'utf8'))
  catalog.archives[report] = 'Dated reference'
  await fs.writeFile(catalogPath, JSON.stringify(catalog))
  await fs.writeFile(path.join(root, report), fr)
  await fs.writeFile(path.join(root, 'translations/en', report), en)
  const registryPath = path.join(root, 'translations/en/registry.json')
  const entries = JSON.parse(await fs.readFile(registryPath, 'utf8'))
  entries.documents[report] = { sourceHash: sourceHash(fr) }
  await fs.writeFile(registryPath, JSON.stringify(entries))
  for (const [locale, limit] of [
    ['fr', 'Données fictives seulement.'],
    ['en', 'Synthetic data only.'],
  ]) {
    const state = await collect(root, locale)
    assert.doesNotMatch(
      [...state.outputs.values()].join(''),
      /Référence fournie avec le kit|Kit reference: adapt project-specific information/,
    )
    const rendered = state.outputs.get(report).toString()
    assert.ok(rendered.includes('candidate-123'))
    assert.ok(rendered.includes(limit))
  }
  assert.equal(await fs.readFile(path.join(root, report), 'utf8'), fr)
  assert.equal(await fs.readFile(path.join(root, 'translations/en', report), 'utf8'), en)
})
test('missing translations have explicit English pages, deletion removes output', async (t) => {
  const r = await fixture(t)
  await fs.writeFile(path.join(r, 'docs/new.md'), 'FRENCH_UNTRANSLATED_SENTINEL')
  const s = await collect(r, 'en')
  assert.match(s.outputs.get('docs/new.md').toString(), /Translation unavailable/)
  assert.ok(![...s.outputs.values()].join('').includes('FRENCH_UNTRANSLATED_SENTINEL'))
  await fs.rm(path.join(r, 'docs/new.md'))
  assert.ok(!(await collect(r, 'en')).outputs.has('docs/new.md'))
})
test('translations preserve path and resource guards', async (t) => {
  const r = await fixture(t)
  await fs.writeFile(
    path.join(r, 'translations/en/docs/guide.md'),
    '# Guide\n\n[private](../.env.local)',
  )
  await assert.rejects(collect(r, 'en'), /Unsafe/)
  await fs.rm(path.join(r, 'translations/en/docs/guide.md'))
  await fs.symlink('/etc/passwd', path.join(r, 'translations/en/docs/guide.md'))
  await assert.rejects(collect(r, 'en'), /symlink/)
  await assert.rejects(collect(r, '../xx'), /Invalid documentation language/)
})
test('language links retain deep routes and legacy French views stay accessible', async (t) => {
  const r = await fs.mkdtemp(path.join(os.tmpdir(), 'whizam-site-'))
  t.after(() => fs.rm(r, { recursive: true, force: true }))
  for (const locale of ['fr', 'en']) {
    await fs.mkdir(path.join(r, locale, 'docs/topic'), { recursive: true })
    await fs.writeFile(
      path.join(r, locale, 'docs/topic/index.html'),
      '<a href="/fr/">Français</a><a href="/en/">English</a>',
    )
  }
  await installLanguageLinks(r)
  await copyLegacyFrench(r)
  const html = await fs.readFile(path.join(r, 'docs/topic/index.html'), 'utf8')
  assert.match(html, /href="\/en\/docs\/topic\/"/)
  assert.match(html, /href="\/fr\/docs\/topic\/"/)
})
test('canonical French fragments resolve inside English headings and changed structure fails closed', async (t) => {
  const r = await fixture(t)
  const source = '# Utilisation\n\n## Installation\n\n[Setup](guide.md#installation)'
  await fs.writeFile(path.join(r, 'docs/guide.md'), source)
  await registry(r, source)
  await fs.writeFile(
    path.join(r, 'translations/en/docs/guide.md'),
    '# Usage\n\n## Setup\n\n[Setup](guide.md#installation)',
  )
  const s = await collect(r, 'en')
  assert.match(s.outputs.get('docs/guide.md').toString(), /id="source-installation"/)
  assert.match(s.outputs.get('docs/guide.md').toString(), /guide.md#source-installation/)
  await fs.writeFile(path.join(r, 'translations/en/docs/guide.md'), '# Usage')
  await assert.rejects(collect(r, 'en'), /heading structure differs/)
})
test('generated inventories retain token values while historical taxonomy stays unpublished in both languages', async () => {
  const { translateTaxonomy } = await import('../scripts/documentation-taxonomy-translation.mjs')
  const { collect } = await import('../scripts/documentation.mjs')
  const root = fileURLToPath(new URL('..', import.meta.url))
  const en = await collect(root, 'en'),
    fr = await collect(root)
  const table = (text) =>
    text
      .toString()
      .split('\n')
      .filter((line) => line.startsWith('| component.') || line.startsWith('| primitive.'))
  const { generatedTranslation } = await import('../scripts/documentation-languages.mjs')
  const inventory = await fs.readFile(
    path.join(root, 'docs/design-system/style-inventory.md'),
    'utf8',
  )
  assert.deepEqual(
    table(generatedTranslation('docs/design-system/style-inventory.md', inventory)),
    table(inventory),
  )
  for (const state of [fr, en])
    assert.equal(state.outputs.has('docs/design-system/style-inventory.md'), false)
  const histories = [
    'docs/design-system/token-taxonomy.md',
    'docs/architecture-before-technical-revision-2026-11-24.md',
    'docs/security-before-technical-revision-2026-11-24.md',
    'docs/backup-and-restore-before-technical-revision-2026-11-24.md',
    'docs/product/starter-kit-before-technical-revision-2026-11-24.md',
    'docs/product/replacing-project-example-before-technical-revision-2026-11-24.md',
  ]
  for (const state of [fr, en]) {
    for (const file of histories) assert.equal(state.outputs.has(file), false, file)
  }
  // The historical translator still preserves its documented source contract.
  const taxonomy = await fs.readFile(path.join(root, histories[0]), 'utf8')
  assert.match(translateTaxonomy(taxonomy), /Raw colors without product intent/)
  assert.throws(
    () => translateTaxonomy('## Primitives\n| new-kind | Nouveau | example |'),
    /Untranslated/,
  )
  assert.throws(() => translateTaxonomy('Nouveau texte non traduit'), /Untranslated/)
})
test('English-authored project documents publish in English, with optional or required French counterparts', async (t) => {
  const root = await fixture(t)
  const catalogPath = path.join(root, 'config/documentation/catalog.json')
  await fs.writeFile(
    catalogPath,
    JSON.stringify({
      organization: {
        version: 1,
        stages: [],
        documents: {
          'docs/guide.md': { kind: 'project', language: 'en' },
          'docs/history.md': { kind: 'history' },
        },
      },
    }),
  )
  const source = '# Usage\n\nEnglish original'
  await fs.writeFile(path.join(root, 'docs/guide.md'), source)
  const { writeDocumentationPreference } = await import('../scripts/documentation-preference.mjs')
  await writeDocumentationPreference(root, 'en')
  const en = await collect(root, 'en'),
    fr = await collect(root)
  assert.match(en.outputs.get('docs/guide.md').toString(), /English original/)
  assert.match(fr.outputs.get('docs/guide.md').toString(), /Traduction indisponible/)
  assert.equal(fr.diagnostics.find((d) => d.locale === 'fr').required, false)
  await writeDocumentationPreference(root, 'bilingual')
  assert.equal((await collect(root)).diagnostics.find((d) => d.locale === 'fr').required, true)
  await fs.mkdir(path.join(root, 'translations/fr/docs'), { recursive: true })
  await fs.writeFile(
    path.join(root, 'translations/fr/registry.json'),
    JSON.stringify({
      version: 1,
      documents: { 'docs/guide.md': { sourceHash: sourceHash(source) } },
    }),
  )
  await fs.writeFile(
    path.join(root, 'translations/fr/docs/guide.md'),
    '# Utilisation\n\nTraduction française',
  )
  const translated = await collect(root)
  assert.match(translated.outputs.get('docs/guide.md').toString(), /Traduction française/)
  assert.match(translated.outputs.get('docs/guide.md').toString(), /id="source-usage"/)
  assert.equal(translated.diagnostics.filter((d) => d.locale === 'fr').length, 0)
})

test('changed generated explanatory text requires translation review instead of silently keeping old prose', async () => {
  const { generatedTranslation } = await import('../scripts/documentation-languages.mjs')
  const root = fileURLToPath(new URL('..', import.meta.url))
  for (const file of [
    'docs/design-system/style-inventory.md',
    'docs/design-system/semantic-catalog.md',
  ]) {
    const source = await fs.readFile(path.join(root, file), 'utf8')
    assert.ok(generatedTranslation(file, source))
    assert.throws(
      () => generatedTranslation(file, source + '\nUn nouveau paragraphe.'),
      /Untranslated/,
    )
  }
})

test('additional locale has independent content, strict presentation and coverage diagnostics', async (t) => {
  const root = await fixture(t)
  await fs.writeFile(
    path.join(root, 'config/documentation/catalog.json'),
    JSON.stringify({
      publishDocs: true,
      organization: {
        stages: [],
        documents: {
          'docs/guide.md': {
            kind: 'guide',
            section: ['Documentation technique', 'Assistants et automatisations'],
          },
          'docs/history.md': { kind: 'history' },
        },
      },
    }),
  )
  const { writeDocumentationPreference } = await import('../scripts/documentation-preference.mjs')
  await writeDocumentationPreference(root, {
    version: 2,
    languages: ['es'],
    defaultLanguage: 'es',
    translation: 'now',
  })
  await fs.mkdir(path.join(root, 'translations/es/docs'), { recursive: true })
  await fs.writeFile(
    path.join(root, 'translations/es/docs/guide.md'),
    '# Guía\n\nContenido español',
  )
  await fs.writeFile(
    path.join(root, 'translations/es/registry.json'),
    JSON.stringify({
      version: 1,
      documents: { 'docs/guide.md': { sourceHash: sourceHash('# Guide\n\nFrench source') } },
    }),
  )
  const pack = {
    version: 1,
    name: 'Español',
    themeLanguage: 'es',
    home: '# Bienvenido',
    navigation: {},
    pages: { '_portal/steps.md': '# Etapas\n\nProyecto de prueba.' },
  }
  // Legacy simple navigation in this synthetic project.
  const fr = await collect(root)
  const visit = (nav) =>
    nav?.forEach((item) =>
      Object.entries(item).forEach(([key, value]) => {
        pack.navigation[key] = 'ES ' + key
        if (Array.isArray(value)) visit(value)
      }),
    )
  visit(fr.nav)
  await fs.writeFile(path.join(root, 'translations/es/presentation.json'), JSON.stringify(pack))
  const es = await collect(root, 'es')
  assert.match(JSON.stringify(es.nav), /Guía/)
  assert.match(es.outputs.get('docs/guide.md').toString(), /Contenido español/)
  assert.doesNotMatch([...es.outputs.values()].join(''), /HISTORICAL_SENTINEL/)
  await fs.writeFile(path.join(root, 'docs/guide.md'), '# Guide\n\nChanged')
  assert.ok((await collect(root, 'es')).diagnostics.some((d) => d.locale === 'es' && d.required))
  await fs.writeFile(path.join(root, 'translations/es/presentation.json'), '{}')
  await assert.rejects(collect(root, 'es'), /Invalid locale presentation/)
})
