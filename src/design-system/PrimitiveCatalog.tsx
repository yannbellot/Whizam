import { inventory } from './tokens.generated'
import styles from './foundations.module.css'
export function PrimitiveCatalog({ category = '' }: { category?: string }) {
  const rows = inventory.filter(
    (e) =>
      e.kind === 'primitive' && (!category || e.type === category.replace(/^Primitives \/ /, '')),
  )
  return (
    <div className={styles.wrapper}>
      <p>Valeurs brutes typées. Une primitive consommée reste stable.</p>
      <table className={styles.table}>
        <caption>Primitives</caption>
        <thead>
          <tr>
            <th>Primitive</th>
            <th>Type</th>
            <th>Valeur</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((e) => (
            <tr key={e.id}>
              <th scope="row">
                <code>{e.id}</code>
              </th>
              <td>{e.type}</td>
              <td>{e.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
