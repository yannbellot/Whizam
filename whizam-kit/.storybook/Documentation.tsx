import React from 'react'
import { useDocumentationText } from './useDocumentationLanguage'
import { Markdown } from '@storybook/addon-docs/blocks'

// Decode only the punctuation escaped by our renderer, after Markdown parsing.
// The resulting React text is never reparsed as HTML or MDX.
const namedCodesToUnicode = Object.fromEntries(
  Array.from('&<>"\'`{}[]()|\\*_#!:@~').map((character) => [
    `#${character.charCodeAt(0)}`,
    character,
  ]),
)
function DocumentationTable(props: React.ComponentProps<'table'>) {
  const t = useDocumentationText()
  return (
    <div
      role="region"
      aria-label={t('Tableau du design system', 'Design system table')}
      tabIndex={0}
      style={{ maxWidth: '100%', overflowX: 'auto' }}
    >
      <table
        {...props}
        style={{ ...props.style, minWidth: 0, tableLayout: 'fixed', width: '100%' }}
      />
    </div>
  )
}
export function DesignDocumentation({ children }: { children: string }) {
  return (
    <div style={{ overflowWrap: 'anywhere' }}>
      <Markdown
        options={{
          disableParsingRawHTML: true,
          namedCodesToUnicode,
          overrides: { table: { component: DocumentationTable } },
        }}
      >
        {children}
      </Markdown>
    </div>
  )
}
