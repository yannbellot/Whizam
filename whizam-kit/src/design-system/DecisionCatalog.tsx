import { all, chain, displayDecision } from './decision-catalog'
import styles from './foundations.module.css'
import navigation from './catalog-navigation.module.css'

export function DecisionCatalog({
  classification = 'non-semantic',
  domain = '',
}: {
  domain?: string
  classification?: 'semantic' | 'non-semantic'
}) {
  const entries = all.filter(
    (e) => e.classification === classification && (!domain || e.domain === domain),
  )
  const groups = [...new Set(entries.map((e) => e.domain))].sort()
  return (
    <div className={styles.wrapper}>
      <h2>{classification === 'semantic' ? 'Semantic Tokens' : 'Non-semantic Tokens'}</h2>
      <p>
        {entries.length} décisions enregistrées. Les conventions décrivent des niveaux abstraits ;
        une valeur identique ne suffit pas à partager une intention. Les décisions de composition
        sont en consultation ; les conventions de l’éditeur sont accessibles depuis Apparence.
      </p>
      {groups.map((group) => (
        <section key={group} aria-label={group + ' decisions'}>
          <h3>{group}</h3>
          <div className={navigation.scroll} tabIndex={0} aria-label="Decision table">
            <table className={styles.table} data-design-foundation="table">
              <caption>{group}</caption>
              <thead>
                <tr>
                  <th scope="col">Décision</th>
                  <th scope="col">Définition</th>
                  <th scope="col">Valeur</th>
                  <th scope="col">Références et usages</th>
                </tr>
              </thead>
              <tbody>
                {entries
                  .filter((e) => e.domain === group)
                  .map((entry) => (
                    <tr key={entry.id}>
                      <th scope="row">
                        <code>{entry.id}</code>
                        <p>
                          {entry.collection === 'editor'
                            ? 'Éditable dans Apparence'
                            : 'Composition — consultation'}
                        </p>
                      </th>
                      <td>{entry.definition}</td>
                      <td>{displayDecision(entry)}</td>
                      <td>
                        <ol>
                          {chain(entry)
                            .slice(1)
                            .map((e) => (
                              <li key={e.id}>
                                <code>{e.id}</code>
                              </li>
                            ))}
                        </ol>
                        {
                          all.filter(
                            (e) =>
                              e.id.startsWith('component.') &&
                              chain(e).some((v) => v.id === entry.id),
                          ).length
                        }{' '}
                        tokens de composants dépendants
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  )
}
