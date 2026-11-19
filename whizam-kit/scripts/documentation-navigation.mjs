// Publication et navigation sont indépendantes ; les chemins Markdown restent canoniques.
export const designer = 'Documentation designer'
export const technical = 'Documentation technique'
export const userGuide = 'Guide d’utilisation'
const follow = 'Suivi de projet'
const phases = [
  'Cadrage et objectifs',
  'Préparation et réalisation',
  'Vérifications et retours',
  'Décisions et validation',
]
const sections = {
  [userGuide]: [
    'Découvrir Whizam',
    'Bien démarrer',
    'Travailler avec l’assistant',
    'Concevoir et faire évoluer son projet',
    'Vérifier et décider',
    'Reprendre et transmettre',
    'Questions fréquentes',
  ],
  [designer]: [
    'Prendre en main le projet',
    'Produit et conception',
    'Design system — principes et usages',
    follow,
    'Livraison et transmission',
  ],
  [technical]: [
    'Architecture et données',
    'Installation et exploitation',
    'Sécurité et configuration privée',
    'Design system — implémentation',
    'Assistants et automatisations',
    'Maintenance de la documentation',
  ],
}
export function documentInfo(source, catalog, text = '') {
  const explicit = catalog.organization?.documents?.[source]
  if (explicit && !['guide', 'project', 'history'].includes(explicit.kind))
    throw new Error('Invalid documentation kind: ' + source)
  const project =
    /^(ROADMAP\.md|docs\/project-state\.md)$/.test(source) ||
    /^docs\/(work-items|reviews|decisions)\//.test(source)
  const info = { kind: project ? 'project' : 'guide', ...explicit }
  info.label ??= text.match(/^# (.+)$/m)?.[1] ?? source.split('/').at(-1).replace(/\.md$/, '')
  if (typeof info.label !== 'string' || !info.label.trim())
    throw new Error('Invalid documentation label: ' + source)
  if (source === 'docs/project-state.md') {
    info.section ??= [designer, follow]
    info.label = 'État courant'
    info.order = -2
  } else if (source === 'ROADMAP.md') {
    info.section ??= [designer, follow]
    info.label = 'Roadmap'
    info.order = -1
  } else if (!info.section) {
    info.section = project
      ? [designer, follow, 'Documents à classer']
      : source.startsWith('docs/product/')
        ? [designer, 'Produit et conception']
        : source.startsWith('docs/design-system/') || source.startsWith('src/design-system/')
          ? [technical, 'Design system — implémentation']
          : /^(agents\/|skills\/|docs\/(agents|codex|claude)\/)|^(AGENTS|CLAUDE|GEMINI)\.md$/.test(
                source,
              )
            ? [technical, 'Assistants et automatisations']
            : [technical, 'Architecture et données']
  }
  if (
    !Array.isArray(info.section) ||
    info.section.length < 1 ||
    (info.section.length === 1
      ? info.section[0] !== userGuide
      : !sections[info.section[0]]?.includes(info.section[1])) ||
    info.section.some((s) => typeof s !== 'string' || !s.trim())
  )
    throw new Error('Invalid documentation section: ' + source)
  if (!Number.isFinite(info.order ?? 0)) throw new Error('Invalid documentation order: ' + source)
  return info
}
export function isPublished(source, catalog, info) {
  if (catalog.organization) return info.kind !== 'history'
  return (catalog.publishDocs === true && source.startsWith('docs/')) || !catalog.archives?.[source]
}
export function navigation(pages, documents, catalog) {
  const stages = catalog.organization?.stages ?? []
  const ids = new Set()
  const titles = new Set()
  for (const stage of stages) {
    if (
      typeof stage.id !== 'string' ||
      !stage.id ||
      ids.has(stage.id) ||
      typeof stage.title !== 'string' ||
      !stage.title.trim() ||
      titles.has(stage.title) ||
      !Number.isFinite(stage.order ?? 0)
    )
      throw new Error('Invalid or duplicate documentation stage')
    ids.add(stage.id)
    titles.add(stage.title)
  }
  const root = new Map(),
    add = (parts, item) => {
      let node = root
      for (const part of parts) {
        if (!node.has(part)) node.set(part, new Map())
        node = node.get(part)
      }
      if (!node.has(null)) node.set(null, [])
      node.get(null).push(item)
    }
  for (const [source, target] of pages) {
    if (source === 'README.md') continue
    const info = documents.get(source)
    let parts = info.section
    if (info.stage) {
      const stage = stages.find((s) => s.id === info.stage)
      if (!stage) throw new Error('Unknown documentation stage: ' + source)
      if (!phases.includes(info.phase)) throw new Error('Invalid documentation phase: ' + source)
      parts = [designer, follow, 'Étapes du projet', stage.title, info.phase]
    }
    add(parts, { title: info.label, target, order: info.order ?? 0 })
  }
  add([designer, follow, 'Étapes du projet'], {
    title: 'Vue des étapes',
    target: '_portal/steps.md',
    order: -1,
  })
  const rank = (title, parents) => {
    if (!parents.length) return [userGuide, designer, technical].indexOf(title)
    if (parents.length === 1) return sections[parents[0]].indexOf(title)
    if (parents.at(-1) === 'Étapes du projet')
      return stages.find((s) => s.title === title)?.order ?? 0
    return phases.indexOf(title)
  }
  const entries = (node, parents = []) => [
    ...(node.get(null) ?? [])
      .sort(
        (a, b) =>
          a.order - b.order ||
          a.title.localeCompare(b.title, 'fr') ||
          a.target.localeCompare(b.target),
      )
      .map((x) => ({ [x.title]: x.target })),
    ...[...node]
      .filter(([key]) => key !== null)
      .sort(([a], [b]) => rank(a, parents) - rank(b, parents) || a.localeCompare(b, 'fr'))
      .map(([key, child]) => ({ [key]: entries(child, [...parents, key]) })),
  ]
  // Le guide mêle pages directes et groupes dans un seul ordre pédagogique.
  const originalEntries = entries
  const ordered = originalEntries(root).map((item) => {
    if (!item[userGuide]) return item
    const position = (title) => {
      const i = sections[userGuide].indexOf(title)
      return i < 0 ? 999 : i
    }
    item[userGuide].sort((a, b) => position(Object.keys(a)[0]) - position(Object.keys(b)[0]))
    return item
  })
  return [{ Accueil: 'index.md' }, ...ordered]
}
export function tomlNavigation(nav) {
  const value = (x) =>
    typeof x === 'string'
      ? JSON.stringify(x)
      : Array.isArray(x)
        ? '[' + x.map(value).join(',') + ']'
        : '{' +
          Object.entries(x)
            .map(([key, v]) => JSON.stringify(key) + ' = ' + value(v))
            .join(',') +
          '}'
  return 'nav = ' + value(nav) + '\n'
}
