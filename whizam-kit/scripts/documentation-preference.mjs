import * as fs from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { fileURLToPath } from 'node:url'
const values = new Set(['fr', 'en', 'bilingual'])
export function validLocale(value) {
  return (
    typeof value === 'string' &&
    /^[a-z]{2,3}(?:-[A-Z][a-z]{3})?(?:-(?:[A-Z]{2}|[0-9]{3}))?$/.test(value)
  )
}
export function documentationLocales(preference) {
  return typeof preference === 'object' && preference !== null
    ? preference.languages
    : preference === 'en'
      ? ['en']
      : preference === 'bilingual'
        ? ['fr', 'en']
        : ['fr']
}
export function publishedLocales(preference) {
  return [...new Set(['fr', 'en', ...documentationLocales(preference)])]
}
function validPreference(data) {
  return (
    data?.version === 2 &&
    Object.keys(data).every((key) =>
      ['version', 'languages', 'defaultLanguage', 'translation'].includes(key),
    ) &&
    Array.isArray(data.languages) &&
    data.languages.length > 0 &&
    data.languages.length <= 20 &&
    data.languages.every(validLocale) &&
    new Set(data.languages).size === data.languages.length &&
    data.languages.includes(data.defaultLanguage) &&
    ['now', 'later'].includes(data.translation)
  )
}
async function location(root) {
  const directory = path.join(root, '.documentation-language.local')
  for (const file of [directory, path.join(directory, 'choice.json')]) {
    try {
      if ((await fs.lstat(file)).isSymbolicLink())
        throw new Error('Language preference symlink refused')
    } catch (error) {
      if (error.code !== 'ENOENT') throw error
    }
  }
  return directory
}
export async function readDocumentationPreference(root) {
  const directory = await location(root)
  let content
  try {
    content = await fs.readFile(path.join(directory, 'choice.json'), 'utf8')
  } catch (error) {
    if (error.code === 'ENOENT') return null
    throw error
  }
  if (content.length > 4096) throw new Error('Invalid language preference: file too large')
  let data
  try {
    data = JSON.parse(content)
  } catch {
    throw new Error('Invalid language preference: malformed JSON')
  }
  if (validPreference(data)) return data
  if (data?.version !== 1 || !values.has(data.language))
    throw new Error('Invalid language preference: expected version 1 and fr, en or bilingual')
  return data.language
}
export async function writeDocumentationPreference(root, language) {
  if (!values.has(language) && !validPreference(language))
    throw new Error('Invalid documentation language')
  const directory = await location(root)
  // An invalid existing state is not overwritten by an automatic recovery.
  await readDocumentationPreference(root)
  await fs.mkdir(directory, { recursive: true, mode: 0o700 })
  const temporary = path.join(directory, '.' + randomUUID() + '.tmp')
  try {
    await fs.writeFile(
      temporary,
      JSON.stringify(typeof language === 'string' ? { version: 1, language } : language) + '\n',
      {
        mode: 0o600,
        flag: 'wx',
        flush: true,
      },
    )
    await fs.rename(temporary, path.join(directory, 'choice.json'))
  } finally {
    await fs.rm(temporary, { force: true })
  }
}
export const initialDocumentationLanguage = (language) =>
  typeof language === 'object' && language !== null
    ? language.defaultLanguage
    : language === 'en'
      ? 'en'
      : 'fr'
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL('..', import.meta.url))
  if (process.argv[2] !== 'set' && process.argv[2] !== 'set-locales')
    throw new Error('Usage: documentation-preference.mjs set fr|en|bilingual')
  await writeDocumentationPreference(
    root,
    process.argv[2] === 'set'
      ? process.argv[3]
      : {
          version: 2,
          languages: process.argv[3]?.split(','),
          defaultLanguage: process.argv[4],
          translation: process.argv[5],
        },
  )
}
