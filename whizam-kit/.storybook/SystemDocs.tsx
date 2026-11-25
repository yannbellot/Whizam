import React, { useEffect, useSyncExternalStore } from 'react'
import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks'
import { toolTheme } from './tool-theme'
import './system-theme.css'
import { useDocumentationLanguage } from './useDocumentationLanguage'

const preference = window.matchMedia('(prefers-color-scheme: dark)')
const subscribe = (notify: () => void) => {
  preference.addEventListener('change', notify)
  return () => preference.removeEventListener('change', notify)
}

function HeadingCopyLanguage() {
  const language = useDocumentationLanguage()
  useEffect(() => {
    document.documentElement.dataset.whizamDocumentationLanguage = language
    return () => {
      delete document.documentElement.dataset.whizamDocumentationLanguage
    }
  }, [language])
  return null
}

export function SystemDocs(props: React.PropsWithChildren<DocsContainerProps>) {
  const dark = useSyncExternalStore(subscribe, () => preference.matches)
  return (
    <DocsContainer {...props} theme={toolTheme(dark)}>
      <HeadingCopyLanguage />
      {props.children}
    </DocsContainer>
  )
}
