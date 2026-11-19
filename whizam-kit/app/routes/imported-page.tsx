import registryData from '../loomata-imports.json'
import '../loomata-imports.css'
import { ImportedComponent } from '../../src/core/ImportedComponent'
import { importedRegistrySchema } from '../../src/core/imported-components'
import { useParams } from 'react-router'
export default function ImportedPage() {
  const { definitionId } = useParams()
  const registry = importedRegistrySchema.parse(registryData)
  const definition = registry.definitions.find((d) => d.id === definitionId)
  if (!definition)
    return (
      <main>
        <h1>Élément importé indisponible</h1>
      </main>
    )
  return (
    <main>
      <ImportedComponent
        definition={definition}
        registry={registry}
        data-loomata-node={'11111111-1111-4111-8111-' + definition.id.slice(0, 12)}
      />
    </main>
  )
}
