import React from 'react'
import { useDocumentationLanguage } from './useDocumentationLanguage'
export function LocalizedDocumentation({
  fr,
  en,
  translations = {},
}: {
  fr: React.ReactNode
  en: React.ReactNode
  translations?: Record<string, React.ReactNode>
}) {
  const language = useDocumentationLanguage()
  return (
    <div lang={language}>
      {language === 'fr'
        ? fr
        : language === 'en'
          ? en
          : (translations[language] ?? (
              <>
                <p role="status">Translation unavailable ({language})</p>
                <div lang="fr">{fr}</div>
              </>
            ))}
    </div>
  )
}
