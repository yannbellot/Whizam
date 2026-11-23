import { useContext, useSyncExternalStore } from 'react'
import { DocsContext, type DocsContextProps } from '@storybook/addon-docs/blocks'
import { GLOBALS_UPDATED, UPDATE_GLOBALS } from 'storybook/internal/core-events'

declare const __DOCUMENTATION_LOCALES__: string[]
declare const __DOCUMENTATION_MESSAGES__: Record<string, Record<string, string>>
type Language = string
type Store = { language: Language; listeners: Set<() => void> }
const channels = new WeakMap<DocsContextProps['channel'], Store>()
function languageStore(context: DocsContextProps): Store {
  const known = channels.get(context.channel)
  if (known) return known
  const globals = new URLSearchParams(window.location.search).get('globals') ?? ''
  const selected = globals.match(/(?:^|;)documentationLanguage:([a-zA-Z0-9-]+)(?:;|$)/)?.[1]
  const store: Store = {
    language:
      selected && __DOCUMENTATION_LOCALES__.includes(selected)
        ? selected
        : String(context.projectAnnotations.initialGlobals?.documentationLanguage ?? 'fr'),
    listeners: new Set(),
  }
  channels.set(context.channel, store)
  // Keep the latest channel state across MDX remounts; iframe query parameters can be stale.
  const update = ({ globals }: { globals?: Record<string, unknown> }) => {
    const next = globals?.documentationLanguage
    if (
      typeof next === 'string' &&
      __DOCUMENTATION_LOCALES__.includes(next) &&
      next !== store.language
    ) {
      store.language = next
      for (const notify of store.listeners) notify()
    }
  }
  context.channel.on(UPDATE_GLOBALS, update)
  context.channel.on(GLOBALS_UPDATED, update)
  return store
}
export function useDocumentationLanguage(): Language {
  const context = useContext(DocsContext)
  const store = languageStore(context)
  return useSyncExternalStore(
    (notify) => {
      store.listeners.add(notify)
      return () => {
        store.listeners.delete(notify)
      }
    },
    () => store.language,
    () => store.language,
  )
}

export function useDocumentationText() {
  const language = useDocumentationLanguage()
  return (fr: string, en: string) =>
    language === 'fr'
      ? fr
      : language === 'en'
        ? en
        : (__DOCUMENTATION_MESSAGES__[language]?.[fr] ??
          `[${language}: translation unavailable] ${fr}`)
}
