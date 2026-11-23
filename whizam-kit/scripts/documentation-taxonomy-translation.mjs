import { createHash } from 'node:crypto'
// Presentation-only translation of the retained generated taxonomy; identifiers and measurements stay verbatim.
const primitive = {
  color: 'Raw colors without product intent.',
  space: 'Raw distances with units preserved.',
  size: 'Raw dimensions with units preserved.',
  radius: 'Raw radii without component references.',
  stroke: 'Raw stroke widths.',
  opacity: 'Transparency coefficients; family inactive without usage.',
  type: 'Raw typography properties.',
  motion: 'Raw timing parameters; family inactive without usage.',
  'color.neutral':
    'Explicitly defined neutral palette; no classification inferred from current colors.',
  'color.standalone':
    'Standalone colors without a documented palette; no function inferred from hue.',
  'type.font-family': 'Font family or stack preserved in full.',
  'type.font-size': 'Raw font size with unit.',
  'type.font-weight': 'Raw numeric font weight.',
  'type.line-height': 'Raw line height; coefficients distinct from dimensions.',
  'type.letter-spacing': 'Raw letter spacing with unit; conditional activation.',
  'motion.duration': 'Raw duration; conditional activation.',
  'motion.easing': 'Documented raw curve; conditional activation.',
}
const semantic = {
  color: 'Functional color decisions independent of hues.',
  'color.surface': 'Surface colors and neutral boundaries.',
  'color.content': 'Text or graphic content colors, including availability.',
  'color.action': 'Action intent, independent of hover or disabled.',
  'color.feedback': 'Meaning of feedback/results; error and success create no interactive states.',
  'color.selection': 'Expression of a choice or prepared selection.',
  'color.focus': 'Color marker for visible focus.',
  type: 'Reading decisions; shared styles without a more specific role stay at the parent.',
  'type.body': 'Body text style.',
  'type.heading': 'Structural heading styles with explicit levels.',
  'type.label': 'Label styles identifying elements or actions.',
  'type.caption': 'Caption and secondary-information styles.',
  'type.code': 'Code content styles.',
  space: 'Functional distances; spacing shared across contexts stays at the parent.',
  'space.page': 'Global inner page margins.',
  'space.section': 'Distances between sections.',
  'space.group': 'Distances between grouped elements.',
  'space.grid': 'Grid gutters and margins.',
  'space.surface': 'Inner surface spacing.',
  'space.control': 'Inner control spacing.',
  size: 'Functional dimensions independent of raw values.',
  'size.reading': 'Usable reading width.',
  'size.container': 'Composition container dimension.',
  'size.interactive-target': 'Interactive target dimension.',
  'size.icon': 'Icon element dimension.',
  shape: 'Functional geometry; rounding shared by surfaces and controls stays at the parent.',
  'shape.surface': 'Surface radius or shape.',
  'shape.control': 'Control radius or shape.',
  'shape.circle': 'Circular shape.',
  'shape.pill': 'Elongated pill shape.',
  stroke: 'Functional boundaries; shared strokes stay at the parent.',
  'stroke.divider': 'Structural separator stroke.',
  'stroke.surface': 'Surface outline.',
  'stroke.control': 'Control outline.',
  'stroke.focus': 'Focus marker thickness.',
  elevation: 'Visual depth; does not automatically define stacking order.',
  'elevation.raised': 'Surface slightly lifted from its context.',
  'elevation.floating': 'Element floating above content.',
  'elevation.modal': 'Visual relief of a modal surface.',
  layer: 'Stacking order independent of shadows.',
  'layer.content': 'Current content layer.',
  'layer.sticky': 'Fixed or persistent element layer.',
  'layer.dropdown': 'Floating menu layer.',
  'layer.dialog': 'Dialog layer.',
  'layer.notification': 'Notification layer.',
  opacity: 'Functional transparency; implies no accessibility compliance.',
  'opacity.muted': 'Visual attenuation of content.',
  'opacity.disabled': 'Attenuation associated with unavailability.',
  'opacity.scrim': 'Scrim transparency.',
  motion: 'Shared timing behaviors.',
  'motion.enter': 'Appearance transition.',
  'motion.exit': 'Disappearance transition.',
  'motion.transition': 'Transition between situations.',
  'motion.expand': 'Expansion or reduction.',
  'motion.feedback': 'Motion accompanying action feedback.',
  content: 'Optional message keys, separate from the visual graph and primitives.',
  'content.action': 'Reusable action labels.',
  'content.common': 'Common messages.',
  'content.form': 'Form messages.',
  'content.error': 'Error messages.',
  'content.notification': 'Notification messages.',
  'content.empty': 'Empty-state messages.',
  'content.dialog': 'Dialog messages.',
}
const vocabulary = {
  domain: 'Decision family; distinct from validation type.',
  usage: 'Reusable documented function; not inferred from a value.',
  property: 'Characteristic configured in the contract; technical form preserved.',
  intent: 'Expressed meaning; distinct from interactive situation.',
  variant: 'Local variation of the same usage.',
  state: 'Prepared control or interaction situation.',
  mode: 'Global context on a defined axis without a new identity.',
  primary: 'First reading/action priority level; means neither larger nor higher.',
  secondary: 'Priority subordinate to the primary level.',
  tertiary: 'Third priority level.',
  'level-1': 'First heading level, distinct from action priority.',
  'level-2': 'Second heading level.',
  'level-3': 'Third heading level.',
  compact: 'Tight density; explicitly selected local variant or global mode.',
  comfortable: 'Spacious density; explicitly selected local variant or global mode.',
  raised: 'Slightly lifted surface, not a priority.',
  floating: 'Relief of a floating element.',
  modal: 'Modal surface relief; layer retains its own order.',
  subtle: 'Low emphasis within a defined usage.',
  strong: 'High emphasis within a defined usage.',
  default: 'Reference situation of the prepared contract.',
  hover: 'Pointer hover; does not change intent.',
  'focus-visible': 'Visible focus according to keyboard/browser interaction.',
  disabled: 'Control unavailability.',
  loading: 'Control activity in progress; distinct from business progress status.',
  error:
    'Historical component validation-state name; distinct from information-result.error meaning and retained for compatibility.',
  selected: 'Selected choice; available only if prepared by the contract.',
  role: 'Technical property function in the matrix; distinct from presentation usage.',
  surface: 'Background color role; background is the contract property.',
  text: 'Text color role; foreground is the contract property.',
  border: 'Outline color role; distinct from border-width.',
  icon: 'Icon color role; activates no absent icons.',
  focus: 'Focus marker color role; width and offset remain distinct properties.',
  spacing:
    'Technical distance role shared by gap, padding and offset; primitive family remains space.',
  radius: 'Technical radius role; radius primitive family and shape semantic domain.',
  'border-width': 'Technical stroke thickness role, distinct from color.',
  'content-width': 'Technical content-width role; semantic container dimension.',
  'font-size': 'Font size; typographic dimension, not spacing.',
  'font-family': 'Font family or stack with complete value preserved.',
  'font-weight': 'Numeric text weight, distinct from action importance.',
  'line-height': 'Text line height; coefficients and dimensions remain distinct.',
}
const prose = {
  '# Catégories et règles communes': '# Shared categories and rules',
  'Document généré depuis les tokens JSON DTCG et les règles YAML ; ne pas éditer manuellement.':
    'Document generated from DTCG JSON tokens and YAML rules; do not edit manually.',
  'Régénérer avec `npm run tokens:generate` ; contrôler avec `npm run docs:design-system:check`.':
    'Regenerate with `npm run tokens:generate`; check with `npm run docs:design-system:check`.',
  '## Decision Tokens : classes explicites': '## Decision Tokens: explicit classes',
  '| Classe | Décisions éditables dans DS-EDIT | Justification |':
    '| Class | Editable decisions in DS-EDIT | Rationale |',
  '| Semantic | 29 | Rôle ou intention de design documentés. |':
    '| Semantic | 29 | Documented design role or intent. |',
  '| Non-semantic | 24 | Convention abstraite documentée, sans rôle d’usage spécifique. |':
    '| Non-semantic | 24 | Documented abstract convention without a specific usage role. |',
  'La classification canonique est dans le référentiel DTCG ; ni la valeur égale ni le nombre de consommateurs ne suffisent à créer une décision. Les décisions de composition, non éditables dans DS-EDIT, sont présentées dans le catalogue complet Non-semantic Tokens.':
    'Canonical classification is in the DTCG reference; equal values and consumer counts do not suffice to create a decision. Composition decisions, not editable in DS-EDIT, appear in the complete Non-semantic Tokens catalog.',
  'Les noms de catégories et termes de classement sont en anglais ; les définitions sont en français. Le classement ne renomme aucune identité, ne convertit aucune unité et ne modifie aucune référence. Les familles réservées sans consommateur ne créent pas de token.':
    'Category names and classification terms are English; definitions in the canonical source are French. Classification renames no identities, converts no units and changes no references. Reserved families without consumers create no token.',
  '## Classification enregistrée': '## Recorded classification',
  'Axes déclarés, non activés ; aucun thème, format ou langage supplémentaire n’est exécuté. Repli non défini tant que le mode reste inactif.':
    'Declared, inactive axes; no extra theme, format or language runs. Fallback remains undefined while a mode is inactive.',
  '| theme | dark ; light | false | Non activé &#58; définir sélection, repli et combinaisons avant tout raccordement. |':
    '| theme | dark ; light | false | Inactive &#58; define selection, fallback and combinations before connecting. |',
  '| viewport | desktop ; mobile ; tablet | false | Les bindings responsive existants sont conservés ; aucun nouveau moteur de modes. |':
    '| viewport | desktop ; mobile ; tablet | false | Existing responsive bindings retained; no new mode engine. |',
  '| density | comfortable ; compact | false | Non activé &#58; un contexte global exige une règle propre ; variante locale distincte. |':
    '| density | comfortable ; compact | false | Inactive &#58; global context needs its own rule; local variant is distinct. |',
  '| locale | en ; fr | false | Non activé &#58; content exige son mandat et ses données, sans primitive visuelle. |':
    '| locale | en ; fr | false | Inactive &#58; content needs its mandate and data, without visual primitives. |',
  '## Associations préparées': '## Prepared associations',
  'Même partie et même contexte, avec héritage explicite de default. Les paires sans fond déclaré sont non mesurées ; un fond hérité du DOM et les combinaisons réellement rendues demandent le contrôle navigateur. Les ratios sont des mesures, pas une certification ni une autorisation de changer les valeurs. Aucun token d’icône ou de mouvement n’est inventé.':
    'Same part and context with explicit default inheritance. Pairs without declared backgrounds are unmeasured; DOM-inherited backgrounds and actual rendered combinations require browser checks. Ratios are measurements, not certification or authorization to change values. No icon or motion tokens are invented.',
}
export function translateTaxonomy(source) {
  if (
    createHash('sha256').update(source).digest('hex') !==
    'e7bef222966e0880c492f23640bb8a2c58212b2eeec85b4899e680d0fa3d6168'
  )
    throw new Error('Untranslated generated taxonomy revision: review its presentation translation')
  let section = ''
  return source
    .split('\n')
    .map((line) => {
      if (line.startsWith('## ')) section = line.slice(3)
      if (Object.hasOwn(prose, line)) return prose[line]
      const dictionary =
        section === 'Primitives'
          ? primitive
          : section === 'Semantic tokens'
            ? semantic
            : section === 'Vocabulary'
              ? vocabulary
              : null
      if (!dictionary || !line.startsWith('| ') || line.startsWith('| ---')) {
        if (
          line &&
          !line.startsWith('| ') &&
          ![
            '## Primitives',
            '## Semantic tokens',
            '## Component tokens',
            '## Vocabulary',
            '## Modes',
          ].includes(line)
        )
          throw new Error('Untranslated generated taxonomy text: ' + line)
        if (
          section === 'Modes' &&
          line.startsWith('| ') &&
          !line.startsWith('| ---') &&
          !line.startsWith('| Axis |')
        )
          throw new Error('Untranslated generated taxonomy mode')
        return line
      }
      const cells = line.split('|').map((c) => c.trim()),
        column = section === 'Vocabulary' ? 3 : 2
      if (['Category', 'Term'].includes(cells[1])) return line
      if (!Object.hasOwn(dictionary, cells[1]))
        throw new Error('Untranslated generated taxonomy category: ' + cells[1])
      cells[column] = dictionary[cells[1]]
      return '| ' + cells.slice(1, -1).join(' | ') + ' |'
    })
    .join('\n')
}
