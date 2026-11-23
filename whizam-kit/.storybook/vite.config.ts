import {
  readDocumentationPreference,
  initialDocumentationLanguage,
  publishedLocales,
} from '../scripts/documentation-preference.mjs'
import { readFile } from 'node:fs/promises'
import { safe } from '../scripts/documentation.mjs'
import tailwindcss from '@tailwindcss/vite'
import { readCatalog } from '../scripts/storybook-catalog'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import { designSystemPlugin } from '../scripts/design-system-plugin'
import { sourceServer } from '../scripts/vite-source-boundary'

// Read-only publication barrier shared with the application; no editor service.

const projectRoot = fileURLToPath(new URL('..', import.meta.url))
const preference = await readDocumentationPreference(projectRoot)
const defaultLanguage = initialDocumentationLanguage(preference)
const locales = publishedLocales(preference)
const messages: Record<string, Record<string, string>> = {}
for (const locale of locales.filter((code) => !['fr', 'en'].includes(code))) {
  const pack = JSON.parse(
    await readFile(await safe(projectRoot, `translations/${locale}/storybook.json`), 'utf8'),
  )
  if (
    pack.version !== 1 ||
    !pack.messages ||
    typeof pack.messages !== 'object' ||
    Array.isArray(pack.messages) ||
    Object.values(pack.messages).some((value) => typeof value !== 'string')
  )
    throw new Error('Invalid Storybook translation: ' + locale)
  messages[locale] = pack.messages
}

export default defineConfig({
  define: {
    __DOCUMENTATION_LANGUAGE__: JSON.stringify(defaultLanguage),
    __DOCUMENTATION_LOCALES__: JSON.stringify(locales),
    __DOCUMENTATION_MESSAGES__: JSON.stringify(messages),
  },
  server: sourceServer(new URL('..', import.meta.url)),
  plugins: [
    tailwindcss(),
    designSystemPlugin(),
    {
      name: 'project-storybook-catalog',
      resolveId(id) {
        if (id === 'virtual:project-catalog') return '\0virtual:project-catalog'
      },
      async load(id) {
        if (id !== '\0virtual:project-catalog') return
        const catalog = await readCatalog(fileURLToPath(new URL('..', import.meta.url)))
        return 'export default ' + JSON.stringify(catalog)
      },
      handleHotUpdate(context) {
        if (
          context.file.endsWith('/.storybook/project.json') ||
          context.file.endsWith('/.documentation-language.local/choice.json')
        ) {
          void context.server.restart()
        }
        if (context.file.includes('/authority/')) {
          const mod = context.server.moduleGraph.getModuleById('\0virtual:project-catalog')
          if (mod) context.server.moduleGraph.invalidateModule(mod)
          context.server.ws.send({ type: 'full-reload' })
        }
      },
    },
  ],
})
