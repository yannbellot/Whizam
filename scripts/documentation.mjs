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
export async function collect(root) {
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
  const documents = new Map(
    [...sources].map(([file, text]) => [file, documentInfo(file, catalog, text)]),
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
          label.replace(/^!?\[|\]$/g, '') + ' (référence hors périmètre non publiée)',
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
          label.replace(/^!?\[|\]$/g, '') + ' (document non publié)',
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
              label.replace(/^!?\[|\]$/g, '') + ' (référence indisponible)',
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
        '> Référence fournie avec le kit : adapter les informations propres au projet ; les preuves datées conservent leur portée historique.\n\n'
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
    outputs.set('_portal/steps.md', Buffer.from(steps))
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
    outputs.set('index.md', Buffer.from(home))
    nav = navigation(pages, documents, catalog)
  }
  const digest = hash(
    (await fs.readFile(await safe(root, 'zensical.toml'), 'utf8')) +
      JSON.stringify(catalog) +
      JSON.stringify([...outputs].map(([f, b]) => [f, hash(b)])),
  )
  return { outputs, classification, diagnostics, digest, catalog, pages, nav }
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
  const state = await collect(root),
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
  const nav = state.nav
    ? tomlNavigation(state.nav)
    : tomlNavigation([
        { Accueil: 'index.md' },
        ...[...state.pages]
          .filter(([, target]) => target !== 'index.md')
          .map(([source, target]) => ({ [source]: target })),
      ])
  const template = await fs.readFile(await safe(root, 'zensical.toml'), 'utf8')
  await fs.writeFile(
    path.join(attempt, 'zensical.toml'),
    template.replace('[project.theme]', nav + '[project.theme]'),
  )
  // The container sees only prepared public content, never the kit root or its private environment.
  let ready = false
  for (let retry = 0; retry < 3; retry++) {
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
        state.catalog.image,
        '-c',
        'cd /work && zensical build --clean -f /work/zensical.toml',
      ],
      root,
    )
    try {
      await fs.access(path.join(attempt, 'site/index.html'))
      ready = true
      break
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }
  if (!ready)
    throw new Error('Zensical did not produce a complete HTML site; previous publication retained')
  const manifest = {
    digest: state.digest,
    classification: state.classification,
    diagnostics: state.diagnostics,
    site: path.relative(base, path.join(attempt, 'site')),
  }
  await fs.writeFile(path.join(base, 'next.json'), JSON.stringify(manifest, null, 2))
  await fs.rename(path.join(base, 'next.json'), path.join(base, 'current.json'))
  console.log(
    `Documentation: ${state.outputs.size} pages/resources; ${state.diagnostics.length} explicit unavailable references.`,
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
  const state = await collect(root)
  const current = JSON.parse(
    await fs.readFile(path.join(root, '.runtime.local/documentation/current.json'), 'utf8'),
  )
  if (current.digest !== state.digest) throw new Error('Documentation outdated: run docs:build')
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
      const digest = (await collect(root)).digest
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
