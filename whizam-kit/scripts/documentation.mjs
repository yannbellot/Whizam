import { validLocale, publishedLocales } from './documentation-preference.mjs'
import { localePresentation, translateNavigation } from './documentation-languages.mjs'
import {
  readDocumentationPreference,
  initialDocumentationLanguage,
} from './documentation-preference.mjs'
import {
  loadTranslations,
  localizeNavigation,
  englishHome,
  englishSteps,
  installLanguageLinks,
  copyLegacyFrench,
} from './documentation-languages.mjs'
import * as fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash, randomUUID } from 'node:crypto'
import { spawn } from 'node:child_process'
import { createServer } from 'node:http'
import { synchronize } from './design-system.mjs'
import {
  documentInfo,
  isPublished,
  navigation,
  tomlNavigation,
} from './documentation-navigation.mjs'
const root = fileURLToPath(new URL('..', import.meta.url))
const hash = (b) => createHash('sha256').update(b).digest('hex')
const privatePart = (s) =>
  s
    .split('/')
    .some(
      (p) =>
        p.endsWith('.local') ||
        ['node_modules', '.git', 'build', 'storybook-static', 'test-results'].includes(p) ||
        (p.startsWith('.env') && p !== '.env.example'),
    )
export async function safe(root, relative) {
  if (path.isAbsolute(relative) || relative.split('/').includes('..') || privatePart(relative))
    throw new Error('Excluded documentation path: ' + relative)
  let p = root
  for (const part of relative.split('/')) {
    p = path.join(p, part)
    if ((await fs.lstat(p)).isSymbolicLink())
      throw new Error('Documentation symlink refused: ' + relative)
  }
  return p
}
export async function collect(root, locale = 'fr') {
  if (!validLocale(locale)) throw new Error('Invalid documentation language')
  const catalog = JSON.parse(
    await fs.readFile(await safe(root, 'config/documentation/catalog.json'), 'utf8'),
  )
  const outputs = new Map(),
    classification = [],
    sources = new Map(),
    diagnostics = []
  const walk = async (dir) => {
    for (const e of (await fs.readdir(path.join(root, dir), { withFileTypes: true })).sort((a, b) =>
      a.name.localeCompare(b.name),
    )) {
      const f = dir ? dir + '/' + e.name : e.name
      if (privatePart(f)) continue
      if (e.isSymbolicLink()) continue
      if (
        e.isDirectory() &&
        ['docs', 'agents', 'skills', 'src', 'config', 'app'].some(
          (x) => f === x || f.startsWith(x + '/'),
        )
      )
        await walk(f)
      else if (e.isFile() && f.endsWith('.md'))
        sources.set(f, await fs.readFile(await safe(root, f), 'utf8'))
    }
  }
  await walk('')
  const originals = new Map(sources)
  const translations = await loadTranslations(root, sources, catalog, diagnostics, locale)
  for (const [file, translation] of translations) sources.set(file, translation)

  const slug = (s) =>
    s
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .trim()
      .replace(/\s+/g, '-')
  const anchors = new Map(
    [...sources].map(([f, text]) => [
      f,
      new Set([...text.matchAll(/^#{1,6} (.+)$/gm)].map((m) => slug(m[1]))),
    ]),
  )
  // Translations preserve the canonical source fragments as explicit aliases.
  for (const [file, text] of sources)
    for (const match of text.matchAll(/<a id="source-([^"]+)"><\/a>/g))
      anchors.get(file).add(match[1])
  const documents = new Map(
    [...sources].map(([file, text]) => {
      const info = documentInfo(file, catalog, text)
      if (locale === 'en' || translations.has(file))
        info.label =
          text.startsWith('# Translation unavailable') ||
          text.startsWith('# Traduction indisponible')
            ? (locale === 'en' ? 'Untranslated: ' : 'Non traduit : ') + file
            : (text.match(/^# (.+)$/m)?.[1] ?? info.label)
      return [file, info]
    }),
  )
  const pages = new Map(
    [...sources.keys()]
      .filter((f) => isPublished(f, catalog, documents.get(f)))
      .map((f) => [f, f === 'README.md' ? 'index.md' : f]),
  )
  if (new Set(pages.values()).size !== pages.size) throw new Error('Documentation route collision')
  if (catalog.organization && pages.has('index.md'))
    throw new Error('Reserved documentation route: index.md')
  for (const [file, text] of sources) {
    classification.push({
      source: file,
      status: pages.has(file) ? 'published' : 'archive',
      reason: documents.get(file).reason ?? catalog.archives?.[file] ?? null,
      ...documents.get(file),
    })
    if (!pages.has(file)) continue
    const target = pages.get(file)
    if (catalog.organization && !catalog.organization.documents?.[file])
      diagnostics.push({
        file,
        reason: 'Classement documentaire à compléter',
        section: documents.get(file).section,
      })
    const matches = [...text.matchAll(/(!?\[[^\]\n]*\])\(([^)\n]+)\)/g)]
    const kitReference =
      (!catalog.organization || documents.get(file).kind === 'guide') &&
      catalog.archives?.[file] &&
      (catalog.organization || (catalog.publishDocs === true && file.startsWith('docs/')))
    let rendered = text
    for (const match of matches) {
      const [whole, label, raw] = match
      if (/^(https?:|mailto:|#)/.test(raw)) continue
      const cleaned = raw.replace(/^<|>$/g, '')
      const at = cleaned.indexOf('#')
      const link = at >= 0 ? cleaned.slice(0, at) : cleaned,
        anchor = at >= 0 ? cleaned.slice(at) : ''
      let source = path.posix.normalize(path.posix.join(path.posix.dirname(file), link))
      if (path.isAbsolute(link) || source.startsWith('../') || privatePart(source)) {
        // Les références héritées sont affichées sans accès aux fichiers privés ou au parent.
        if (!kitReference) throw new Error('Unsafe documentation link: ' + file + ' → ' + raw)
        diagnostics.push({
          file,
          link: raw,
          reason: 'Référence du socle hors périmètre, non publiée',
        })
        rendered = rendered.replace(
          whole,
          label.replace(/^!?\[|\]$/g, '') +
            (locale === 'en'
              ? ' (reference outside publication scope)'
              : ' (référence hors périmètre non publiée)'),
        )
        continue
      }
      let replacement
      if (pages.has(source)) {
        let fragment = ''
        if (anchor) {
          const id = slug(decodeURIComponent(anchor.slice(1)))
          if (anchors.get(source).has(id)) fragment = '#source-' + id
          else
            diagnostics.push({
              file,
              link: raw,
              reason: 'Ancre absente : lien conservé vers la page',
            })
        }
        replacement = path.posix.relative(path.posix.dirname(target), pages.get(source)) + fragment
      } else if (sources.has(source) || catalog.archives?.[source]) {
        rendered = rendered.replace(
          whole,
          label.replace(/^!?\[|\]$/g, '') +
            (locale === 'en' ? ' (unpublished document)' : ' (document non publié)'),
        )
        continue
      } else {
        try {
          const full = await safe(root, source),
            stat = await fs.stat(full)
          if (!stat.isFile()) throw new Error('Not a resource')
          if (
            !/\.(md|json|yaml|yml|toml|ts|tsx|js|mjs|css|sh|svg|png|jpg|jpeg|webp|pdf)$/.test(
              source,
            ) &&
            !['.env.example', '.gitignore', '.nvmrc', 'Dockerfile'].includes(path.basename(source))
          )
            throw new Error('Unsupported resource: ' + source)
          const name =
            'assets/' +
            hash(source).slice(0, 12) +
            '-' +
            path.basename(source) +
            (/\.(ts|tsx|js|mjs|sh|toml|yaml|yml|json|css)$/.test(source) ? '.txt' : '')
          outputs.set(name, await fs.readFile(full))
          replacement = path.posix.relative(path.posix.dirname(target), name)
        } catch (e) {
          if (
            e.code === 'ENOENT' ||
            e.message === 'Not a resource' ||
            (kitReference && e.message.startsWith('Unsupported resource: '))
          ) {
            diagnostics.push({ file, link: raw, reason: 'Source absente ou retirée' })
            rendered = rendered.replace(
              whole,
              label.replace(/^!?\[|\]$/g, '') +
                (locale === 'en' ? ' (unavailable reference)' : ' (référence indisponible)'),
            )
            continue
          }
          throw e
        }
      }
      rendered = rendered.replace(whole, `${label}(${replacement})`)
    }
    let fence = false
    rendered = rendered
      .split('\n')
      .map((line) => {
        if (/^\s*(```|~~~)/.test(line)) {
          fence = !fence
          return line
        }
        if (!fence) {
          const heading = line.match(/^(#{1,6}) (.+)$/)
          if (heading) return `<a id="source-${slug(heading[2])}"></a>\n\n${line}`
        }
        return line
      })
      .join('\n')

    if (kitReference) {
      const notice =
        locale === 'en'
          ? '> Kit reference: adapt project-specific information; dated evidence retains its historical scope.\n\n'
          : '> Référence fournie avec le kit : adapter les informations propres au projet ; les preuves datées conservent leur portée historique.\n\n'
      rendered = notice + rendered
    }
    outputs.set(target, Buffer.from(rendered))
  }
  // Zensical exige une entrée d’accueil même si aucun document n’est publié.
  if (!outputs.has('index.md')) {
    const docs = [...pages].filter(([source]) => source.startsWith('docs/'))
    const home =
      catalog.publishDocs === true && docs.length
        ? '# Documentation du kit\n\nLes guides, règles et références existants sont consultables dès ce premier démarrage. Les comptes rendus historiques ne qualifient pas le nouveau projet.\n\n' +
          docs
            .filter(([source]) =>
              [
                'docs/documentation.md',
                'docs/product/project-start.md',
                'docs/operations.md',
                'docs/agents/user-decisions.md',
                'docs/design-system/policy.md',
                'docs/project-state.md',
              ].includes(source),
            )
            .map(([source, target]) => '- [' + source + '](' + target + ')')
            .join('\n') +
          '\n'
        : ''
    outputs.set('index.md', Buffer.from(home))
  }
  let nav
  if (catalog.organization) {
    if (sources.has('_portal/steps.md')) throw new Error('Reserved documentation route')
    const stages = catalog.organization.stages ?? []
    const stageSources = [...pages].filter(([source]) => documents.get(source).stage)
    const steps = stages.length
      ? '# Étapes du projet\n\n' +
        [...stages]
          .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || a.title.localeCompare(b.title, 'fr'))
          .map(
            (stage) =>
              '## ' +
              stage.title +
              '\n\n' +
              (stageSources
                .filter(([source]) => documents.get(source).stage === stage.id)
                .map(
                  ([source, target]) =>
                    '- [' +
                    documents.get(source).label +
                    '](' +
                    path.posix.relative('_portal', target) +
                    ')',
                )
                .join('\n') || 'Aucun document pour cette étape.'),
          )
          .join('\n\n') +
        '\n'
      : '# Étapes du projet\n\nAucune étape définie. La roadmap accueillera les étapes du projet après son cadrage.\n'
    outputs.set(
      '_portal/steps.md',
      Buffer.from(locale === 'en' ? englishSteps(stages, stageSources, documents) : steps),
    )
    const homeLink = (source, label) =>
      pages.has(source) ? `[${label}](${pages.get(source)})` : label
    const home = `<a id="documentation-du-projet"></a>

# Bienvenue dans Whizam

Donnez forme à votre projet web, de la première idée à une version que vous pouvez parcourir et faire évoluer.

Whizam est un kit conçu pour les designers UX/UI et Product Designers qui souhaitent créer une application web avec l’aide d’un assistant IA. Il réunit une base d’application, des composants réutilisables, des guides et des méthodes pour avancer étape par étape.

Vous apportez l’intention, les contenus et les choix de conception. L’assistant vous aide à préciser le besoin, réaliser les évolutions convenues et vérifier le résultat. Vous examinez les propositions et décidez de ce qui vous convient.

## Par où commencer ?

**Vous découvrez Whizam ?** Le guide vous présente le kit et la manière de travailler avec votre assistant. ${homeLink('docs/guide-whizam/index.md', 'Découvrir Whizam')}.

**Vous démarrez un projet ?** Préparez votre copie du kit, puis définissez une première version adaptée à votre idée. ${homeLink('docs/guide-whizam/preparer-kit.md', 'Préparer mon premier projet')}.

**Vous reprenez un projet ?** Retrouvez ce qui a été réalisé, les décisions à prendre et la prochaine étape. ${homeLink('docs/project-state.md', 'Retrouver le suivi de mon projet')}.

## Trois espaces pour avancer

- **Application** : parcourir les pages et les interactions réalisées pour votre projet.
- **Storybook** : consulter les composants, leurs variantes et leurs états documentés.
- **Documentation** : apprendre à utiliser Whizam, retrouver les choix et le suivi du projet, et consulter les références techniques.

Dans un kit neuf, l’application et Storybook n’ont pas encore de contenu métier. Vous pouvez déjà explorer les guides et les modèles de suivi pour préparer la suite.

## Besoin d’un repère ?

Le ${homeLink('docs/guide-whizam/index.md', 'Guide d’utilisation')} vous accompagne dans les gestes du quotidien.

<a id="documentation-designer"></a>

La ${homeLink('docs/project-state.md', 'Documentation designer')} rassemble les contenus, les choix de conception et le suivi de votre projet.

<a id="documentation-technique"></a>

La ${homeLink('TECHNICAL-GUIDE.md', 'Documentation technique')} détaille son fonctionnement et son exploitation.

${homeLink('docs/guide-whizam/questions-frequentes.md', 'Consulter les questions fréquentes')}.
`
    // L’accueil du portail est une vue ; README reste une source unique sans copie éditable.
    if (pages.has('README.md')) throw new Error('README must be classified outside the portal home')
    outputs.set('index.md', Buffer.from(locale === 'en' ? englishHome(homeLink) : home))
    nav = navigation(pages, documents, catalog)
  }
  if (!['fr', 'en'].includes(locale)) {
    const presentation = await localePresentation(root, locale)
    nav = translateNavigation(nav, {
      ...Object.fromEntries([...documents.values()].map((info) => [info.label, info.label])),
      ...presentation.navigation,
    })
    for (const file of ['index.md', '_portal/steps.md']) {
      if (!outputs.has(file)) continue
      const content = file === 'index.md' ? presentation.home : presentation.pages[file]
      if (typeof content !== 'string' || !content.trim())
        throw new Error('Missing generated page translation: ' + file)
      outputs.set(file, Buffer.from(content))
    }
  }
  if (locale === 'en') nav = localizeNavigation(nav)
  // Only explicit, local presentation resources are published; no network at build time.
  for (const name of catalog.presentationAssets ?? []) {
    if (typeof name !== 'string' || !/^[a-zA-Z0-9][a-zA-Z0-9.-]*\.(css|ttf|txt)$/.test(name))
      throw new Error('Invalid documentation presentation asset')
    const target = 'assets/typography/' + name
    if (outputs.has(target)) throw new Error('Documentation asset collision')
    outputs.set(target, await fs.readFile(await safe(root, 'public/documentation/' + name)))
  }
  // The pinned Zensical builder cannot resolve CSS @import dependencies reliably.
  // Publish one self-contained portal stylesheet from the two canonical sources.
  const portalStyle = outputs.get('assets/typography/portal.css')
  if (portalStyle) {
    const faces = outputs.get('assets/typography/fonts.css')
    if (!faces) throw new Error('Portal typography requires local font declarations')
    outputs.set(
      'assets/typography/portal.css',
      Buffer.concat([faces, Buffer.from('\n'), portalStyle]),
    )
  }
  // Include canonical sources in the digest even when an English translation is unchanged.
  const originalDigest = JSON.stringify([...originals])
  const preference = await readDocumentationPreference(root)
  const digest = hash(
    JSON.stringify(preference) +
      locale +
      originalDigest +
      (await fs.readFile(await safe(root, 'zensical.toml'), 'utf8')) +
      JSON.stringify(catalog) +
      JSON.stringify([...outputs].map(([f, b]) => [f, hash(b)])),
  )
  return { outputs, classification, diagnostics, digest, catalog, pages, nav, preference }
}
async function run(args, cwd) {
  await new Promise((resolve, reject) => {
    const child = spawn('docker', args, { cwd, stdio: 'inherit', shell: false })
    child.on('error', reject)
    child.on('exit', (code) =>
      code === 0 ? resolve() : reject(new Error('Docker documentation failed: ' + code)),
    )
  })
}
async function performBuild(root) {
  await synchronize(root)
  const localizedStates = await collectAll(root)
  const state = localizedStates[0][1],
    base = path.join(root, '.runtime.local/documentation')
  await fs.mkdir(base, { recursive: true })
  const attempt = path.join(base, 'attempt-' + randomUUID())
  await fs.mkdir(path.join(attempt, 'input'), { recursive: true })
  await fs.mkdir(path.join(attempt, 'site'))
  await fs.mkdir(path.join(attempt, '.cache'))
  for (const [file, bytes] of state.outputs) {
    const p = path.join(attempt, 'input', file)
    await fs.mkdir(path.dirname(p), { recursive: true })
    await fs.writeFile(p, bytes)
  }
  const template = await fs.readFile(await safe(root, 'zensical.toml'), 'utf8')
  // Each locale has its own index and search. Publish both only after both builds succeed.
  for (const [locale, localized] of localizedStates) {
    const input = path.join(attempt, locale)
    await fs.mkdir(input)
    for (const [file, bytes] of localized.outputs) {
      const destination = path.join(input, file)
      await fs.mkdir(path.dirname(destination), { recursive: true })
      await fs.writeFile(destination, bytes)
    }
    const nav = tomlNavigation(
      localized.nav ?? [{ [locale === 'fr' ? 'Accueil' : 'Home']: 'index.md' }],
    )
    const presentation = ['fr', 'en'].includes(locale)
      ? null
      : await localePresentation(root, locale)
    const alternates = await Promise.all(
      localizedStates.map(async ([code]) => ({
        name:
          code === 'fr'
            ? 'Français'
            : code === 'en'
              ? 'English'
              : (await localePresentation(root, code)).name,
        link: `/${code}/`,
        lang: code,
      })),
    )
    const config =
      template
        .replace('docs_dir = "input"', `docs_dir = "${locale}"`)
        .replace('site_dir = "site"', `site_dir = "site/${locale}"`)
        .replace('language = "fr"', `language = "${presentation?.themeLanguage ?? locale}"`)
        .replace('[project.theme]', nav + '[project.theme]') +
      '\n[project.extra]\nalternate = [' +
      alternates
        .map(
          (item) =>
            `{ name = ${JSON.stringify(item.name)}, link = ${JSON.stringify(item.link)}, lang = ${JSON.stringify(item.lang)} }`,
        )
        .join(', ') +
      ']\n'
    await fs.writeFile(path.join(attempt, `zensical-${locale}.toml`), config, { flush: true })
    await run(
      [
        'run',
        '--rm',
        '--network',
        'none',
        '--mount',
        `type=bind,source=${attempt},target=/work`,
        '--entrypoint',
        'sh',
        localized.catalog.image,
        '-c',
        `cd /work && zensical build --clean -f /work/zensical-${locale}.toml`,
      ],
      root,
    )
    await fs.access(path.join(attempt, 'site', locale, 'index.html'))
  }
  // Preserve the old French URLs; language switching retains the current page path.
  await installLanguageLinks(
    path.join(attempt, 'site'),
    localizedStates.map(([locale]) => locale),
  )
  await copyLegacyFrench(path.join(attempt, 'site'))
  const initial = initialDocumentationLanguage(state.preference)
  if (initial !== 'fr')
    await fs.writeFile(
      path.join(attempt, 'site/index.html'),
      `<!doctype html><html lang="${initial}"><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=/${initial}/"><title>Whizam documentation</title><a href="/${initial}/">${initial}</a></html>`,
    )
  const manifest = {
    digest: hash(localizedStates.map(([, state]) => state.digest).join('')),
    classification: state.classification,
    diagnostics: localizedStates.flatMap(([, state]) => state.diagnostics),
    site: path.relative(base, path.join(attempt, 'site')),
  }
  await fs.writeFile(path.join(base, 'next.json'), JSON.stringify(manifest, null, 2))
  await fs.rename(path.join(base, 'next.json'), path.join(base, 'current.json'))
  console.log(
    `Documentation: ${state.outputs.size} pages/resources per locale; ${manifest.diagnostics.length} diagnostics across published languages.`,
  )
  return manifest
}
export async function build(root) {
  const base = path.join(root, '.runtime.local/documentation')
  await fs.mkdir(base, { recursive: true })
  for (const dir of ['.runtime.local', '.runtime.local/documentation'])
    if ((await fs.lstat(path.join(root, dir))).isSymbolicLink())
      throw new Error('Private output symlink refused')
  const lock = path.join(base, 'build.lock')
  await fs.mkdir(lock).catch(() => {
    throw new Error('Documentation build active or interrupted; inspect build.lock')
  })
  try {
    return await performBuild(root)
  } finally {
    await fs.rmdir(lock)
  }
}
export async function check(root) {
  const localizedStates = await collectAll(root)
  const state = localizedStates[0][1]
  const current = JSON.parse(
    await fs.readFile(path.join(root, '.runtime.local/documentation/current.json'), 'utf8'),
  )
  if (current.digest !== hash(localizedStates.map(([, state]) => state.digest).join('')))
    throw new Error('Documentation outdated: run docs:build')
  return state
}
async function serve(root, port) {
  if (!Number.isInteger(port) || port < 1024 || port > 65535)
    throw new Error('Invalid documentation port')
  let current,
    working = false,
    closing = false
  const clients = new Set()
  const server = createServer(async (req, res) => {
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.writeHead(405).end()
      return
    }
    if (req.url === '/__docs_events') {
      res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-store' })
      clients.add(res)
      req.on('close', () => clients.delete(res))
      return
    }
    try {
      if (!current) {
        res.writeHead(503).end('Documentation en préparation')
        return
      }
      let name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
      if (name.endsWith('/')) name += 'index.html'
      const directory = path.resolve(root, '.runtime.local/documentation', current.site),
        file = path.resolve(directory, '.' + name)
      if (!file.startsWith(directory + path.sep)) {
        res.writeHead(403).end()
        return
      }
      if ((await fs.stat(file)).isDirectory()) {
        const requested = new URL(req.url, 'http://localhost')
        res.writeHead(308, { Location: requested.pathname + '/' + requested.search }).end()
        return
      }
      let body = await fs.readFile(file)
      const ext = path.extname(file)
      const mime = {
        '.html': 'text/html; charset=utf-8',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.svg': 'image/svg+xml',
        '.woff2': 'font/woff2',
        '.png': 'image/png',
        '.txt': 'text/plain; charset=utf-8',
      }
      if (ext === '.html')
        body = Buffer.from(
          body
            .toString()
            .replace(
              '</body>',
              `<script>new EventSource('/__docs_events').onmessage=()=>location.reload()</script></body>`,
            ),
        )
      res.writeHead(200, {
        'Content-Type': mime[ext] ?? 'application/octet-stream',
        'Cache-Control': 'no-store',
      })
      res.end(req.method === 'HEAD' ? undefined : body)
    } catch {
      res.writeHead(404).end('Page introuvable')
    }
  })
  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(port, '127.0.0.1', resolve)
  })
  try {
    current = await build(root)
  } catch (e) {
    server.close()
    throw e
  }
  console.log(`Documentation: http://127.0.0.1:${port}/`)
  let failedDigest
  const timer = setInterval(async () => {
    if (working || closing) return
    working = true
    try {
      const digest = hash((await collectAll(root)).map(([, state]) => state.digest).join(''))
      if (digest !== current.digest && digest !== failedDigest) {
        failedDigest = digest
        current = await build(root)
        for (const res of clients) res.write('data: reload\n\n')
      }
    } catch (e) {
      console.error(e.message)
    } finally {
      working = false
    }
  }, 1500)
  for (const signal of ['SIGINT', 'SIGTERM'])
    process.once(signal, () => {
      closing = true
      clearInterval(timer)
      for (const res of clients) res.end()
      server.close()
    })
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const action = process.argv[2]
  if (action === 'build') await build(root)
  else if (action === 'check') {
    await check(root)
    console.log('Documentation current')
  } else if (action === 'prepare') {
    const state = await collect(root)
    console.log(
      JSON.stringify(
        { classification: state.classification, diagnostics: state.diagnostics },
        null,
        2,
      ),
    )
  } else if (action === 'serve') await serve(root, Number(process.env.DOCS_PORT ?? 8000))
  else throw new Error('Usage: documentation.mjs prepare|build|check|serve')
}

export async function collectAll(root) {
  return Promise.all(
    publishedLocales(await readDocumentationPreference(root)).map(async (locale) => [
      locale,
      await collect(root, locale),
    ]),
  )
}
