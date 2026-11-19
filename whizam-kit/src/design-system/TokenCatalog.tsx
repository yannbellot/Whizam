import { inventory } from './tokens.generated'
import styles from './foundations.module.css'
export function TokenCatalog({ category = '' }: { category?: string }) {
  const owner = category.split(' / ')[1]?.toLowerCase()
  const rows = inventory.filter((e) => e.kind !== 'primitive' && (!owner || e.owner === owner))
  return (
    <div className={styles.wrapper}>
      <p>Tokens de composant et tokens locaux de page. Consultation uniquement.</p>
      <table className={styles.table}>
        <caption>Tokens et références</caption>
        <thead>
          <tr>
            <th>Token</th>
            <th>Portée</th>
            <th>Primitive</th>
            <th>Valeur</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((e) => (
            <tr key={e.id}>
              <th scope="row">
                <code>{e.id}</code>
              </th>
              <td>{e.owner}</td>
              <td>{e.reference}</td>
              <td>{e.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
