import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { parseDocument } from 'yaml'
import Ajv2020 from 'ajv/dist/2020.js'

/** Trusted local authorities only. Never fetch URLs or evaluate CSS here. */
export async function loadCssDomains(root) {
  const base = path.join(root, 'src/design-system/authority')
  const result = {}
  const ajv = new Ajv2020({ strict: true, allErrors: true })
  for (const name of ['css-support-profile', 'css-value-types', 'css-properties']) {
    const bytes = await readFile(path.join(base, name + '.yaml'))
    if (bytes.length > 2 * 1024 * 1024) throw new Error('css-authority-too-large')
    const yaml = parseDocument(bytes.toString(), { uniqueKeys: true })
    if (yaml.errors.length) throw new Error('css-authority-invalid-yaml')
    const value = yaml.toJS({ maxAliasCount: 0 })
    const schema = JSON.parse(
      await readFile(path.join(base, 'schemas', name + '.schema.json'), 'utf8'),
    )
    if (!ajv.validate(schema, value)) throw new Error('css-authority-invalid-schema: ' + name)
    result[name] = value
  }
  for (const definition of Object.values(result['css-properties'].properties)) {
    if (definition.types.some((type) => !result['css-value-types'].types[type]))
      throw new Error('css-unknown-type')
    const { minimum, maximum } = definition.range
    if (minimum !== null && maximum !== null && minimum > maximum)
      throw new Error('css-invalid-range')
    if (definition.capability === 'current' && definition.availability !== 'widely')
      throw new Error('css-feature-outside-profile')
  }
  return result
}

export async function resolveCssContract(contract, root) {
  const domains = await loadCssDomains(root)
  if (!contract.propertyGroups?.length) throw new Error('property-groups-missing')
  for (const property of Object.values(contract.properties)) {
    if (!property.cssProperty) throw new Error('css-property-missing')
    const domain = domains['css-properties'].properties[property.cssProperty]
    if (!domain || domain.capability !== 'current') throw new Error('css-property-not-editable')
    const type = {
      dimension: 'length',
      'font-weight': 'number',
      'line-height': 'number',
      'font-family': 'string',
      color: 'color',
    }[property.type]
    if (!domain.types.includes(type)) throw new Error('css-incompatible-property-type')
    // Bounds are derived, never copied to editable sources.
    delete property.min
    delete property.max
    if (domain.range.minimum !== null) property.min = domain.range.minimum
    if (domain.range.maximum !== null) property.max = domain.range.maximum
  }
  return contract
}
