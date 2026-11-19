import {
  primitiveCategory,
  semanticCategory,
  componentCategory,
} from '../src/design-system/editor/taxonomy.ts'
import { tokenAssociations } from '../src/design-system/editor/associations.ts'
// Pure Markdown rendering of validated data. No MDX, HTML or link from a source is executed.
export const documentationPaths = [
  'docs/design-system/semantic-catalog.md',
  'docs/design-system/style-inventory.md',
  'docs/design-system/token-taxonomy.md',
]
export const markdownText = (value) =>
  String(value).replace(/[&<>"'`{}\[\]()|\\*_#!:@~\r\n]/g, (character) =>
    character === '\n' || character === '\r' ? ' ' : `&#${character.charCodeAt(0)};`,
  )
const table = (headings, rows) =>
  [headings, headings.map(() => '---'), ...rows]
    .map((row) => `| ${row.map(markdownText).join(' | ')} |`)
    .join('\n') + '\n'
const sorted = (items) => [...items].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))
const list = (items) => [...new Set(items)].sort().join(' ; ') || 'Aucun'
const preamble = (title) =>
  `# ${title}\n\nDocument généré depuis les tokens JSON DTCG et les règles YAML ; ne pas éditer manuellement.\nRégénérer avec \`npm run tokens:generate\` ; contrôler avec \`npm run docs:design-system:check\`.\n\n`

export function renderEditorDocumentation(snapshot, artifacts) {
  const { catalog, model, presentation, usages, inventoryIssues, legacy } = snapshot
  let catalogue = preamble('Catalogue des intentions possibles')
  catalogue +=
    'Ce catalogue décrit des possibilités, jamais des styles créés automatiquement. Les styles réels sont dans l’inventaire des styles. Les statuts métier ne créent aucun état interactif ; les compatibilités de catégorie s’appliquent à toutes ses intentions. Les identifiants qualifient les homonymes.\n\n'
  catalogue +=
    'Une compatibilité technique ne démontre pas un sens : la création sémantique exige aussi un rôle qualifié dans semanticEligibility. Un réglage autonome reste au composant avec sa base primitive.\n\n'
  for (const category of sorted(catalog.categories)) {
    catalogue += `## ${markdownText(category.label)}\n\n${markdownText(category.definition)}\n\n`
    catalogue += `Catégorie : ${markdownText(category.id)}. Exemples : ${markdownText(list(category.examples))}.\n\n`
    catalogue += `Compatibilités type:rôle : ${markdownText(list(category.compatibility))}.\n\n`
    catalogue += `Modèle d’identifiant : ${markdownText(category.identifierTemplate)}.\n\n`
    catalogue += table(
      ['Intention qualifiée', 'Nom', 'Définition', 'Exemples', 'Synonymes'],
      sorted(category.intentions).map((item) => [
        `${category.id}.${item.id}`,
        item.label,
        item.definition,
        list(item.examples),
        list(item.synonyms),
      ]),
    )
    catalogue += '\n'
  }
  const nodes = new Map([
    ...model.primitives.map((item) => [item.id, item]),
    ...model.styles.map((item) => [item.id, item]),
    ...legacy.map((item) => [item.id, { ...item, reference: item.value.reference }]),
  ])
  // Trace references only; resolved values come from the shared token generator.
  const chain = (id) => {
    const ids = []
    while (id) {
      if (ids.includes(id) || !nodes.has(id)) throw new Error('invalid-documentation-reference')
      ids.push(id)
      id = nodes.get(id).reference
    }
    return ids
  }
  const provenance = (id) => {
    const trace = chain(id)
    const item = nodes.get(trace.at(-1)).provenance
    return `${item.kind} / ${item.status} : ${item.reason}`
  }
  const consumers = (references) =>
    list(usages.filter((usage) => references.includes(usage.reference)).map((usage) => usage.file))
  let inventory = preamble('Inventaire des styles et tokens de composants')
  inventory +=
    'Cet inventaire décrit la génération enregistrée, pas le brouillon en mémoire. Le JSON DTCG est canonique pour les valeurs et références ; les règles restent dans leurs contrats YAML. Les provenances proposées ne constituent pas une acceptation humaine. Les fichiers consommateurs identifiés ne comptent pas les exemplaires DOM ; une absence identifiée reste une réserve.\n\n'
  inventory += `Styles : ${model.styles.length}. Attributions : ${model.bindings.length}. Alias historiques : ${legacy.length}.\n\n`
  inventory += '## Réserves de consommation\n\n'
  inventory += inventoryIssues.length
    ? inventoryIssues.map((issue) => `- ${markdownText(issue)}\n`).join('') + '\n'
    : 'Aucune réserve détectée dans les consommateurs préparés. Ce résultat ne prouve pas tous les usages dynamiques possibles.\n\n'
  inventory += '## Styles créés\n\n'
  for (const style of sorted(artifacts.styles)) {
    const linked = model.bindings.filter((binding) =>
      chain(binding.style ?? binding.baseReference).includes(style.id),
    )
    const aliases = legacy
      .filter((item) => chain(item.id).includes(style.id))
      .map((item) => item.id)
    const descendants = model.styles
      .filter((item) => chain(item.id).includes(style.id))
      .map((item) => item.id)
    inventory += `### ${markdownText(style.id)}\n\n`
    inventory +=
      'Rôle démontré : ' +
      markdownText(
        catalog.semanticEligibility.find(
          (rule) => rule.intention === style.intention && rule.role === style.role,
        )?.definition ?? 'Non qualifié',
      ) +
      '.\n\n'
    inventory += 'Category : ' + markdownText(semanticCategory(catalog.taxonomy, style)) + '.\n\n'
    inventory += table(
      ['Intention', 'Type', 'Rôle', 'État', 'Valeur partagée', 'Chaîne', 'Provenance de valeur'],
      [
        [
          style.intention,
          style.type,
          style.role,
          style.state,
          style.value,
          chain(style.id).join(' → '),
          provenance(style.id),
        ],
      ],
    )
    inventory += `\nAttributions liées (directes ou indirectes) : ${markdownText(list(linked.map((item) => item.id)))}.\n\n`
    inventory += `Tokens de composants propres parmi ces attributions : ${markdownText(list(linked.filter((item) => item.reference !== (item.style ?? item.baseReference)).map((item) => item.id)))}. Ils ne suivent pas la valeur partagée tant qu’leur référence propre reste active.\n\n`
    inventory += `Alias liés : ${markdownText(list(aliases))}.\n\n`
    inventory += `Consommateurs identifiés : ${markdownText(consumers([...descendants, ...aliases, ...linked.filter((item) => item.reference === (item.style ?? item.baseReference)).map((item) => item.id)]))}.\n\n`
  }
  inventory += '## Tokens de composants par contexte\n\n'
  for (const target of sorted(snapshot.contract.targets)) {
    inventory += `### ${markdownText(target.component)}\n\n`
    inventory += table(
      [
        'Binding',
        'Variante / partie / propriété / état',
        'Style attribué conservé',
        'Valeur partagée',
        'Référence propre',
        'Valeur effective',
        'Chaîne effective',
        'Provenance effective',
        'Consommateurs',
      ],
      sorted(artifacts.bindings.filter((item) => item.target === target.id)).map((binding) => {
        const reference = binding.reference
        return [
          binding.id,
          [binding.variant, binding.part, binding.property, binding.state].join(' / '),
          binding.style ?? 'Aucune — base primitive',
          artifacts.styles.find((style) => style.id === binding.style)?.value ??
            nodes.get(binding.baseReference).value,
          binding.reference !== (binding.style ?? binding.baseReference)
            ? `${binding.reference} — ${binding.provenance?.kind} / ${binding.provenance?.status} : ${binding.provenance?.reason}`
            : 'Aucune',
          binding.value,
          [binding.id, ...chain(reference)].join(' → '),
          provenance(reference),
          consumers([binding.id]),
        ]
      }),
    )
    inventory +=
      '\nRétablir rejoint la valeur actuelle du style sémantique attribué, ou la primitive de base lorsque le composant est autonome.\n\n'
  }
  inventory += '## Alias historiques de compatibilité\n\n'
  inventory += table(
    ['Alias', 'Type', 'Valeur', 'Chaîne', 'Consommateurs'],
    sorted(artifacts.legacy).map((item) => [
      item.id,
      item.type,
      item.value,
      chain(item.id).join(' → '),
      consumers([item.id]),
    ]),
  )
  let taxonomy = preamble('Catégories et règles communes')
  taxonomy += '## Decision Tokens : classes explicites\n\n'
  taxonomy +=
    table(
      ['Classe', 'Décisions éditables dans DS-EDIT', 'Justification'],
      [
        [
          'Semantic',
          model.styles.filter((style) => style.classification !== 'non-semantic').length,
          'Rôle ou intention de design documentés.',
        ],
        [
          'Non-semantic',
          model.styles.filter((style) => style.classification === 'non-semantic').length,
          'Convention abstraite documentée, sans rôle d’usage spécifique.',
        ],
      ],
    ) +
    '\nLa classification canonique est dans le référentiel DTCG ; ni la valeur égale ni le nombre de consommateurs ne suffisent à créer une décision. Les décisions de composition, non éditables dans DS-EDIT, sont présentées dans le catalogue complet Non-semantic Tokens.\n\n'
  taxonomy +=
    'Les noms de catégories et termes de classement sont en anglais ; les définitions sont en français. Le classement ne renomme aucune identité, ne convertit aucune unité et ne modifie aucune référence. Les familles réservées sans consommateur ne créent pas de token.\n\n'
  for (const [collection, nodes] of Object.entries(catalog.taxonomy.collections)) {
    taxonomy += '## ' + (collection === 'primitive' ? 'Primitives' : 'Semantic tokens') + '\n\n'
    taxonomy +=
      table(
        ['Category', 'Definition', 'Examples'],
        nodes.map((item) => [item.path, item.definition, list(item.examples)]),
      ) + '\n'
  }
  taxonomy += '## Component tokens\n\n'
  taxonomy +=
    table(
      ['Category', 'Prepared tokens'],
      snapshot.contract.targets.map((target) => [
        target.component,
        model.bindings.filter((binding) => binding.target === target.id).length,
      ]),
    ) + '\n'
  taxonomy += '## Classification enregistrée\n\n'
  taxonomy +=
    table(
      ['Identity', 'Category'],
      [
        ...model.primitives.map((item) => [item.id, primitiveCategory(catalog.taxonomy, item)]),
        ...model.styles.map((item) => [item.id, semanticCategory(catalog.taxonomy, item)]),
        ...model.bindings.map((item) => [item.id, componentCategory(snapshot.contract, item)]),
      ],
    ) + '\n'
  taxonomy += '## Vocabulary\n\n'
  taxonomy +=
    table(
      ['Term', 'Axis', 'Definition', 'Scope', 'Examples'],
      catalog.taxonomy.vocabulary.map((term) => [
        term.term,
        term.axis,
        term.definition,
        list(term.scope),
        list(term.examples),
      ]),
    ) + '\n'
  taxonomy +=
    '## Modes\n\nAxes déclarés, non activés ; aucun thème, format ou langage supplémentaire n’est exécuté. Repli non défini tant que le mode reste inactif.\n\n'
  taxonomy +=
    table(
      ['Axis', 'Values', 'Active', 'Selection'],
      catalog.taxonomy.modes.map((mode) => [
        mode.axis,
        list(mode.values),
        mode.active,
        mode.selection,
      ]),
    ) + '\n'
  taxonomy +=
    '## Associations préparées\n\nMême partie et même contexte, avec héritage explicite de default. Les paires sans fond déclaré sont non mesurées ; un fond hérité du DOM et les combinaisons réellement rendues demandent le contrôle navigateur. Les ratios sont des mesures, pas une certification ni une autorisation de changer les valeurs. Aucun token d’icône ou de mouvement n’est inventé.\n\n'
  taxonomy += table(
    [
      'Component',
      'Variant / Part / State',
      'Properties / tokens / references / values',
      'Text contrast',
      'Icon contrast',
    ],
    tokenAssociations(snapshot).map((item) => [
      item.component,
      [item.variant, item.part, item.state].join(' / '),
      item.properties
        .map((property) =>
          [property.property, property.token, property.reference, property.value].join(' : '),
        )
        .join(' ; '),
      item.textContrast === null ? 'Not measured' : item.textContrast.toFixed(2) + ':1',
      item.iconContrast === null ? 'Not measured' : item.iconContrast.toFixed(2) + ':1',
    ]),
  )
  return [catalogue.trimEnd() + '\n', inventory.trimEnd() + '\n', taxonomy.trimEnd() + '\n']
}
