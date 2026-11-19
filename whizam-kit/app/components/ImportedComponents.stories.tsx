import registryData from '../loomata-imports.json'
import '../loomata-imports.css'
import { importedRegistrySchema } from '../../src/core/imported-components'
import { ImportedComponent } from '../../src/core/ImportedComponent'
export default { title: 'Components/Imported', parameters: { layout: 'padded' } }
export const Library = {
  render() {
    const registry = importedRegistrySchema.parse(registryData)
    return (
      <main>
        <h1>Composants importés</h1>
        {!registry.definitions.length && (
          <p>Aucun composant importé dans cette version du projet.</p>
        )}
        {registry.definitions.map((definition) => (
          <section key={definition.id}>
            <h2>{definition.label}</h2>
            {(definition.variants.length
              ? definition.variants
              : [{ id: definition.rootId, label: 'Base' }]
            ).map((v) => (
              <article key={v.id}>
                <h3>{v.label}</h3>
                <ImportedComponent registry={registry} definition={definition} variantId={v.id} />
              </article>
            ))}
          </section>
        ))}
      </main>
    )
  },
}
