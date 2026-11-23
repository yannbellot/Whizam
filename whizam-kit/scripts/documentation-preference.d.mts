export type MultilingualPreference = {
  version: 2
  languages: string[]
  defaultLanguage: string
  translation: 'now' | 'later'
}
export type DocumentationPreference = 'fr' | 'en' | 'bilingual' | MultilingualPreference
export function validLocale(value: unknown): boolean
export function documentationLocales(language: DocumentationPreference | null): string[]
export function publishedLocales(language: DocumentationPreference | null): string[]
export function readDocumentationPreference(root: string): Promise<DocumentationPreference | null>
export function writeDocumentationPreference(
  root: string,
  language: DocumentationPreference,
): Promise<void>
export function initialDocumentationLanguage(language: DocumentationPreference | null): string
