import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import Ajv2020 from 'ajv/dist/2020.js'
import { parseDocument } from 'yaml'

export const namingRulesPath = 'src/design-system/editor/naming-rules.generated.json'
export async function namingRulesBytes(root) {
  const directory = path.join(root, 'src/design-system/authority')
  const document = parseDocument(await readFile(path.join(directory, 'naming.yaml'), 'utf8'), {
    uniqueKeys: true,
  })
  if (document.errors.length) throw new Error('invalid-naming-yaml')
  const naming = document.toJS({ maxAliasCount: 0 })
  const schema = JSON.parse(
    await readFile(path.join(directory, 'schemas/naming.schema.json'), 'utf8'),
  )
  const validate = new Ajv2020({ allErrors: true, strict: true }).compile(schema)
  if (!validate(naming)) throw new Error(`invalid-naming-rules: ${JSON.stringify(validate.errors)}`)
  return JSON.stringify(naming, null, 2) + '\n'
}
export async function prepareNamingRules(root, { check = false } = {}) {
  const expected = await namingRulesBytes(root)
  const file = path.join(root, namingRulesPath)
  if (check) {
    const actual = await readFile(file, 'utf8').catch((error) => {
      if (error.code === 'ENOENT') return null
      throw error
    })
    if (actual !== expected) throw new Error('stale-naming-rules: run npm run tokens:generate')
  } else await writeFile(file, expected)
}
