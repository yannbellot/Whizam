import { readDocumentationPreference, validLocale } from './documentation-preference.mjs'
import { translateTaxonomy } from './documentation-taxonomy-translation.mjs'
import * as fs from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { safe } from './documentation.mjs'
import { documentInfo, isPublished } from './documentation-navigation.mjs'
export const sourceHash = (text) => createHash('sha256').update(text).digest('hex')
export async function loadTranslations(root, sources, catalog, diagnostics, locale = 'en') {
  if (!validLocale(locale)) throw new Error('Invalid documentation language')
  const translated = new Map()
  const preference = await readDocumentationPreference(root)
  let registry = { version: 1, documents: {} }
  try {
    registry = JSON.parse(
      await fs.readFile(await safe(root, `translations/${locale}/registry.json`), 'utf8'),
    )
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
  if (registry?.version !== 1 || !registry.documents || Array.isArray(registry.documents))
    throw new Error('Invalid translation registry')
  for (const [file, text] of sources) {
    const info = documentInfo(file, catalog, text)
    if (!isPublished(file, catalog, info)) continue
    const sourceLanguage = info.language ?? 'fr'
    if (!validLocale(sourceLanguage))
      throw new Error('Invalid canonical documentation language: ' + file)
    if (sourceLanguage === locale) continue
    const required = ['fr', 'en'].includes(locale)
      ? info.kind !== 'project' ||
        preference === null ||
        preference === 'bilingual' ||
        preference === locale ||
        (typeof preference === 'object' &&
          preference !== null &&
          preference.languages.includes(locale) &&
          preference.translation === 'now')
      : typeof preference === 'object' &&
        preference !== null &&
        preference.languages.includes(locale) &&
        preference.translation === 'now'
    const name = locale === 'en' ? 'English' : locale === 'fr' ? 'French' : locale
    const generated = locale === 'en' ? generatedTranslation(file, text) : null
    const entry = registry.documents[file]
    let content
    if (generated !== null) content = generated
    else if (entry) {
      if (!/^[a-f0-9]{64}$/.test(entry.sourceHash ?? ''))
        throw new Error('Invalid translation source hash: ' + file)
      content = await fs.readFile(await safe(root, `translations/${locale}/` + file), 'utf8')
      if (entry.sourceHash !== sourceHash(text)) {
        diagnostics.push({ file, locale, required, reason: name + ' translation is outdated' })
        content =
          (locale === 'en'
            ? '> This translation needs updating. The canonical source has changed.\n\n'
            : '> Cette traduction doit être actualisée : la source canonique a changé.\n\n') +
          content
      }
    } else {
      diagnostics.push({ file, locale, required, reason: name + ' translation is missing' })
      content =
        locale === 'en'
          ? '# Translation unavailable\n\nThis document has not been translated into English yet. Use the language selector to read the French source.\n'
          : '# Traduction indisponible\n\nCe document est disponible en anglais. Utilisez le sélecteur de langue pour consulter sa source.\n'
    }
    if (entry || generated !== null) content = preserveSourceAnchors(text, content, file)
    translated.set(file, content)
  }
  return translated
}
export const headingSlug = (text) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .trim()
    .replace(/\s+/g, '-')
function headings(text) {
  let fence = false
  return text.split('\n').flatMap((line) => {
    if (/^\s*(```|~~~)/.test(line)) {
      fence = !fence
      return []
    }
    return !fence && /^#{1,6} /.test(line) ? [line.replace(/^#{1,6} /, '')] : []
  })
}
export function preserveSourceAnchors(source, translation, file) {
  const original = headings(source),
    target = headings(translation)
  if (original.length !== target.length)
    throw new Error('Translation heading structure differs: ' + file)
  let index = 0,
    fence = false
  return translation
    .split('\n')
    .map((line) => {
      if (/^\s*(```|~~~)/.test(line)) {
        fence = !fence
        return line
      }
      if (fence || !/^#{1,6} /.test(line)) return line
      const canonical = headingSlug(original[index++])
      return canonical === headingSlug(line.replace(/^#{1,6} /, ''))
        ? line
        : `<a id="${canonical}"></a>\n<a id="source-${canonical}"></a>\n\n${line}`
    })
    .join('\n')
}
const labels = {
  'Démarrer avec Whizam': 'Getting started with Whizam',
  'Consulter la documentation': 'Reading the documentation',
  'Storybook et le design system': 'Storybook and the design system',
  'Partager votre projet': 'Sharing your project',
  'Modifier le fonctionnement du kit': 'Customizing the kit',
  'Vue d’ensemble': 'Overview',
  'Modifier les rôles des agents et les skills': 'Changing agent roles and skills',
  'Modifier les règles de gestion du design system': 'Changing design system management rules',
  'Modifier la documentation': 'Changing the documentation',
  'Modifier l’architecture technique': 'Changing the technical architecture',

  Accueil: 'Home',
  'Guide d’utilisation': 'User guide',
  'Documentation technique': 'Technical documentation',
  'Suivi de projet': 'Project progress',
  'État courant': 'Current state',
  'Étapes du projet': 'Project stages',
  'Bien démarrer': 'Getting started',
  'Concevoir et faire évoluer son projet': 'Designing and evolving your project',
  'Prendre en main le projet': 'Getting started with the project',
  'Produit et conception': 'Product and design',
  'Design system — principes et usages': 'Design system — principles and usage',
  'Livraison et transmission': 'Delivery and handoff',
  'Architecture et données': 'Architecture and data',
  'Installation et exploitation': 'Installation and operations',
  'Licence et réutilisation': 'License and reuse',
  'Sécurité et configuration privée': 'Security and private configuration',
  'Design system — implémentation': 'Design system — implementation',
  'Assistants et automatisations': 'Assistants and automation',
  'Maintenance de la documentation': 'Documentation maintenance',
  'Documents à classer': 'Unclassified documents',
  'Cadrage et objectifs': 'Scope and objectives',
  'Préparation et réalisation': 'Preparation and implementation',
  'Vérifications et retours': 'Checks and feedback',
  'Décisions et validation': 'Decisions and acceptance',
  'Découvrir Whizam': 'Discover Whizam',
  'Travailler avec l’assistant': 'Working with your assistant',
  'Vérifier et décider': 'Checking and deciding',
  'Reprendre et transmettre': 'Resuming and handing off',
  'Questions fréquentes': 'Frequently asked questions',
}
export function localizeNavigation(nav) {
  return nav?.map((item) =>
    Object.fromEntries(
      Object.entries(item).map(([key, value]) => [
        labels[key] ?? key,
        Array.isArray(value) ? localizeNavigation(value) : value,
      ]),
    ),
  )
}
export const englishHome = (link) => `# Welcome to Whizam

Shape your web project, from your first idea to a version you can explore and improve.

Whizam helps UX/UI and Product Designers create a web application with an AI development assistant. It includes an application foundation, reusable components, guides and methods.

You provide the intent, content and design decisions. Your assistant helps clarify the need, implement agreed changes and verify the result. You review proposals and decide whether to accept a delivery.

Whizam also helps with roadmap planning, version management and updates, with source storage on GitHub if you choose.

## Where should I start?

- Discovering Whizam? ${link('docs/guide-whizam/index.md', 'Discover the kit')}.
- Starting a project? ${link('docs/guide-whizam/index.md', 'Prepare your kit')}.
- Resuming a project? ${link('docs/project-state.md', 'Check project progress')}.

## Start a new project

1. **Download** the Whizam kit folder to your computer.
2. **Open** it in your AI assistant, Claude or Codex.
3. Share a **brief**, request a **fictional demonstration project** or ask the assistant to **guide you** through scoping your project.
4. **Choose whether to use GitHub** to store and share project sources. The assistant can help create a repository or use an existing one, then send changes after each commit or only on request.

## Hand over and share

**If you chose to keep your project on GitHub, you can give repository access to the team taking over.** The assistant helps prepare an up-to-date version and the information needed for handover.

## Three spaces

- **Application**: explore the pages and interactions implemented for your project.
- **Storybook**: inspect project components, variants and documented states.
- **Documentation**: learn how to use Whizam, follow project decisions and progress, and consult technical references.

A new kit has no business content in the application or Storybook. You can already explore its guides and progress templates.

${link('docs/guide-whizam/index.md', 'User guide')} · ${link('docs/project-state.md', 'Project progress')} · ${link('TECHNICAL-GUIDE.md', 'Technical documentation')} · ${link('docs/guide-whizam/partager-projet.md', 'Sharing your project')} · ${link('docs/licence-reutilisation.md', 'License and reuse')}
`
export function englishSteps(stages, stageSources, documents) {
  return (
    '# Project stages\n\n' +
    (stages.length
      ? [...stages]
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
          .map(
            (stage) =>
              '## ' +
              stage.title +
              '\n\n' +
              (stageSources
                .filter(([source]) => documents.get(source).stage === stage.id)
                .map(
                  ([source, target]) =>
                    `- [${documents.get(source).label}](${path.posix.relative('_portal', target)})`,
                )
                .join('\n') || 'No documents for this stage.'),
          )
          .join('\n\n')
      : 'No stages defined. The roadmap will contain project stages after scoping.') +
    '\n'
  )
}
export async function installLanguageLinks(site, locales = ['fr', 'en']) {
  async function walk(dir, locale) {
    for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name)
      if (entry.isDirectory()) await walk(file, locale)
      else if (entry.name.endsWith('.html')) {
        const route = path
          .relative(path.join(site, locale), file)
          .split(path.sep)
          .join('/')
          .replace(/index\.html$/, '')
        let html = await fs.readFile(file, 'utf8')
        for (const target of locales)
          html = html.replaceAll(`href="/${target}/"`, `href="/${target}/${route}"`)
        await fs.writeFile(file, html)
      }
    }
  }
  for (const locale of locales) await walk(path.join(site, locale), locale)
}
export async function copyLegacyFrench(site) {
  for (const entry of await fs.readdir(path.join(site, 'fr'))) {
    if (['fr', 'en'].includes(entry)) throw new Error('Reserved language route')
    await fs.cp(path.join(site, 'fr', entry), path.join(site, entry), { recursive: true })
  }
}

// Translate generated presentation text without editing generated design-system files.
export function generatedTranslation(file, source) {
  if (file === 'docs/design-system/token-taxonomy.md') return translateTaxonomy(source)
  if (file === 'docs/design-system/style-inventory.md') {
    const header =
      '# Inventaire généré du design system\n\nConsultation uniquement. Sources : JSON DTCG et contrats des composants.\n\n| Token | Catégorie | Propriétaire | Primitive | Valeur |\n| --- | --- | --- | --- | --- |\n'
    if (
      !source.startsWith(header) ||
      source
        .slice(header.length)
        .split('\n')
        .some((line) => line && !line.startsWith('| '))
    )
      throw new Error('Untranslated generated inventory revision')
    return source
      .replace('# Inventaire généré du design system', '# Generated design system inventory')
      .replace(
        'Consultation uniquement. Sources : JSON DTCG et contrats des composants.',
        'Read-only. Sources: DTCG JSON and component contracts.',
      )
      .replace(
        '| Token | Catégorie | Propriétaire | Primitive | Valeur |',
        '| Token | Category | Owner | Primitive | Value |',
      )
  }
  if (file === 'docs/design-system/semantic-catalog.md') {
    if (sourceHash(source) !== 'b6bc0cc10e3a9bd8b29abeafcf2f68b3d10287ed7c45bad9fc8538a8a0f7ef8d')
      throw new Error('Untranslated generated organization revision')
    return '# Token organization\n\nGenerated document. Three categories: primitives (raw values), component tokens and page-local tokens. The latter two reference primitives directly. Former semantic decisions are no longer an active layer.\n'
  }
  return null
}

export async function localePresentation(root, locale) {
  if (!validLocale(locale) || ['fr', 'en'].includes(locale))
    throw new Error('Invalid additional locale')
  const data = JSON.parse(
    await fs.readFile(await safe(root, `translations/${locale}/presentation.json`), 'utf8'),
  )
  if (
    data.version !== 1 ||
    typeof data.name !== 'string' ||
    !data.name.trim() ||
    !validLocale(data.themeLanguage) ||
    typeof data.home !== 'string' ||
    !data.home.trim() ||
    !data.navigation ||
    typeof data.navigation !== 'object' ||
    Array.isArray(data.navigation) ||
    !data.pages ||
    typeof data.pages !== 'object' ||
    Array.isArray(data.pages)
  )
    throw new Error('Invalid locale presentation: ' + locale)
  return data
}
export function translateNavigation(nav, labels) {
  return nav?.map((item) =>
    Object.fromEntries(
      Object.entries(item).map(([key, value]) => {
        if (typeof labels[key] !== 'string' || !labels[key].trim())
          throw new Error('Missing navigation translation: ' + key)
        return [labels[key], Array.isArray(value) ? translateNavigation(value, labels) : value]
      }),
    ),
  )
}
