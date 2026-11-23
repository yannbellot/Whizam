import React, { useState } from 'react'
import { useDocumentationText } from './useDocumentationLanguage'
import { intentionDefinitions } from './organization'
import catalog from 'virtual:project-catalog'
import './catalog.css'

function Value({ row }: { row: (typeof catalog.rows)[number] }) {
  return row.type === 'color' ? (
    <span className="whizam-color-value">
      <span
        aria-hidden="true"
        className="whizam-swatch"
        style={{ backgroundColor: row.value, marginInlineEnd: '0.5em' }}
      />
      {row.value}
    </span>
  ) : (
    <>{row.value}</>
  )
}
export function ProjectCatalog({ section }: { section: string }) {
  const t = useDocumentationText()
  const [owner, setOwner] = useState('')
  const [property, setProperty] = useState('')
  const [state, setState] = useState('')
  const path = section.split('/').slice(1)
  const name = path[0]
  const category = path
    .slice(1)
    .filter((part) => part !== 'All')
    .join('.')
  const inventory = name === 'Style inventory'
  const primitives = name === 'Primitives'
  const empty = t(
    'Aucun élément du projet n’est encore documenté dans cette rubrique.',
    'No project elements have been documented in this section yet.',
  )
  if (name === 'Architecture')
    return (
      <div className="whizam-catalog">
        <p>
          {t(
            'Foundations décrit les valeurs et règles ; Components expose les composants ; Patterns documente les interactions récurrentes.',
            'Foundations describes values and rules; Components presents components; Patterns documents recurring interactions.',
          )}
        </p>
        <ol>
          <li>
            {t(
              'Primitives : valeurs brutes typées, littérales et stables une fois consommées.',
              'Primitives: typed literal values, stable once consumed.',
            )}
          </li>
          <li>
            {t(
              'Tokens de composant : composant, variante, partie, propriété et état identifiés → primitive.',
              'Component tokens: identified component, variant, part, property and state → primitive.',
            )}
          </li>
          <li>
            {t(
              'Tokens locaux : composition d’une page identifiée → primitive.',
              'Local tokens: composition of an identified page → primitive.',
            )}
          </li>
          <li>
            {t(
              'Composants : code partagé avec l’application ; variantes et états explicites.',
              'Components: shared application code with explicit variants and states.',
            )}
          </li>
          <li>
            {t(
              'Patterns : coordination réutilisable de composants et d’interactions.',
              'Patterns: reusable coordination of components and interactions.',
            )}
          </li>
        </ol>
        <p>
          {t(
            'Les intentions classent les usages ; elles ne créent ni valeur partagée intermédiaire ni modification collective automatique. Storybook est en consultation uniquement.',
            'Intentions classify usages; they create neither intermediate shared values nor automatic collective changes. Storybook is read-only.',
          )}
        </p>
      </div>
    )
  if (name === 'Principles')
    return (
      <ul>
        <li>
          {t(
            'Privilégier les usages réels du projet ; adopter explicitement chaque élément publié.',
            'Prefer real project usages; explicitly adopt every published element.',
          )}
        </li>
        <li>
          {t(
            'Réutiliser une primitive compatible ; réaffecter les tokens ciblés plutôt que modifier une primitive consommée.',
            'Reuse compatible primitives; retarget selected tokens instead of changing consumed primitives.',
          )}
        </li>
        <li>
          {t(
            'Documenter les variantes, états, libellés, erreurs et possibilités de récupération.',
            'Document variants, states, labels, errors and recovery paths.',
          )}
        </li>
        <li>
          {t(
            'Préserver clavier, focus visible, contrastes et défilement. Accompagner les couleurs de texte.',
            'Preserve keyboard access, visible focus, contrast and scrolling. Accompany colors with text.',
          )}
        </li>
        <li>
          {t(
            'Respecter les formats du brief. Whizam est conçu pour les fenêtres desktop.',
            'Respect the brief’s formats. Whizam targets desktop windows.',
          )}
        </li>
        <li>
          {t(
            'Modifier les sources canoniques puis générer ; ne jamais éditer les dérivés manuellement.',
            'Edit canonical sources then generate; never manually edit derived files.',
          )}
        </li>
      </ul>
    )
  if (name === 'Tokens' && category === 'Intentions')
    return (
      <div className="whizam-catalog">
        <p>
          {t(
            'Une intention décrit l’usage principal. La propriété (texte, fond, bordure…) et l’état restent des axes distincts. Une couleur identique ne prouve pas une intention commune.',
            'An intention describes the primary usage. Property (text, background, border…) and state remain separate axes. Identical colors do not prove a shared intention.',
          )}
        </p>
        <table>
          <thead>
            <tr>
              <th>{t('Catégorie', 'Category')}</th>
              <th>{t('Définition', 'Definition')}</th>
            </tr>
          </thead>
          <tbody>
            {intentionDefinitions.map(([id, fr, en]) => (
              <tr key={id}>
                <th scope="row">color.{id}</th>
                <td>{t(fr, en)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          {t(
            'Le classement principal est déclaré dans le registre du projet. Les familles size/container, shape, space et type regroupent les autres réglages. Ce vocabulaire ne crée aucun token.',
            'Primary classification is declared in the project registry. The size/container, shape, space and type families group other settings. This vocabulary creates no tokens.',
          )}
        </p>
      </div>
    )
  if (name === 'Rules')
    return catalog.rules.length ? (
      <ul>
        {catalog.rules.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ul>
    ) : (
      <p>
        {t(
          'Aucune règle du projet n’est encore documentée.',
          'No project rules have been documented yet.',
        )}
      </p>
    )
  if (primitives || name === 'Tokens' || inventory) {
    const all = catalog.rows.filter((row) =>
      primitives ? row.kind === 'primitive' : row.kind !== 'primitive',
    )
    const selection = all.filter(
      (row) =>
        !category || row.categories.some((c) => c === category || c.startsWith(category + '.')),
    )
    const rows = selection.filter(
      (row) =>
        (!owner || row.owner === owner) &&
        (!property || row.property === property) &&
        (!state || row.state === state),
    )
    return (
      <div className="whizam-catalog">
        <p>
          {t('Éléments publiés du projet', 'Published project elements')} : {selection.length}
        </p>
        {primitives && (
          <p>
            {t(
              'Valeurs brutes. standalone désigne une couleur individuelle, y compris lorsqu’elle est utilisée. All compte chaque identité une seule fois.',
              'Raw values. standalone means an individual color, including one in use. All counts each identity once.',
            )}
          </p>
        )}
        {inventory && (
          <p>
            {t(
              'Usages identifiés par les contrats et propriétaires déclarés ; cet inventaire ne prouve pas tous les usages dynamiques.',
              'Usages identified by declared contracts and owners; this inventory does not prove every dynamic usage.',
            )}
          </p>
        )}
        {!primitives && selection.length > 0 && (
          <div className="whizam-catalog-filters">
            {[
              [t('Composant ou page', 'Component or page'), owner, setOwner, 'owner'],
              [t('Propriété', 'Property'), property, setProperty, 'property'],
              [t('État', 'State'), state, setState, 'state'],
            ].map(([label, value, setter, key]) => (
              <label key={String(key)}>
                {String(label)}{' '}
                <select
                  aria-label={String(label)}
                  value={String(value)}
                  onChange={(event) => (setter as (value: string) => void)(event.target.value)}
                >
                  <option value="">{t('Tous', 'All')}</option>
                  {[
                    ...new Set(
                      selection
                        .map((row) => row[key as 'owner' | 'property' | 'state'])
                        .filter(Boolean),
                    ),
                  ]
                    .sort()
                    .map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                </select>
              </label>
            ))}
          </div>
        )}
        {rows.length ? (
          <div
            role="region"
            aria-label={primitives ? 'Primitives' : inventory ? 'Style inventory' : 'Tokens'}
            tabIndex={0}
            className="whizam-catalog-scroll"
          >
            <table data-kind={primitives ? 'primitives' : inventory ? 'inventory' : 'tokens'}>
              <caption>
                {primitives ? 'Primitives' : inventory ? 'Style inventory' : 'Tokens'} —{' '}
                {t('du projet', 'in the project')} ({rows.length})
              </caption>
              <thead>
                <tr>
                  <th>{t('Identifiant', 'Identifier')}</th>
                  {!primitives && <th>{t('Portée', 'Scope')}</th>}
                  <th data-column="type">{t('Type', 'Type')}</th>
                  {!primitives && <th>{t('Primitive', 'Primitive')}</th>}
                  <th data-column="value">{t('Valeur', 'Value')}</th>
                  {inventory && (
                    <>
                      <th>{t('Catégorie', 'Category')}</th>
                      <th>{t('Propriété / état', 'Property / state')}</th>
                      <th>{t('Source identifiée', 'Identified source')}</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <th scope="row">
                      <code>{row.id}</code>
                    </th>
                    {!primitives && (
                      <td>
                        {row.kind === 'local' ? t('Page : ', 'Page: ') : ''}
                        {row.owner}
                      </td>
                    )}
                    <td data-column="type">{row.type}</td>
                    {!primitives && (
                      <td>
                        <code>{row.reference}</code>
                      </td>
                    )}
                    <td data-column="value">
                      <Value row={row} />
                    </td>
                    {inventory && (
                      <>
                        <td>{row.categories.join(', ') || t('À classer', 'Unclassified')}</td>
                        <td>{[row.property, row.state].filter(Boolean).join(' / ')}</td>
                        <td>{row.consumer || t('Non identifiée', 'Unidentified')}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>
            {selection.length
              ? t('Aucun résultat pour ces filtres.', 'No results for these filters.')
              : empty}
          </p>
        )}
        {!category && all.some((row) => !row.categories.length) && (
          <p role="status">
            {t(
              'Des éléments restent à classer ; ils sont conservés dans All.',
              'Some elements need classification; they remain in All.',
            )}
          </p>
        )}
      </div>
    )
  }
  const family = section.endsWith('/Accueil') ? section.slice(0, -8) : section
  const stories = catalog.stories.filter((story) => story.title.startsWith(family + '/'))
  return stories.length ? (
    <ul>
      {stories.map((story) => (
        <li key={story.file}>{story.title.slice(family.length + 1)}</li>
      ))}
    </ul>
  ) : (
    <p>{empty}</p>
  )
}
