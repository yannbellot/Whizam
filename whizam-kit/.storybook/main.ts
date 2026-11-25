import { toolIdentity } from '../scripts/tool-identity.mjs'
import {
  publishedLocales,
  readDocumentationPreference,
  initialDocumentationLanguage,
} from '../scripts/documentation-preference.mjs'
import { readdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { StorybookConfig } from '@storybook/react-vite'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const config: StorybookConfig = {
  managerHead: async (head) => {
    const preference = await readDocumentationPreference(root)
    const config = {
      name: await toolIdentity(root),
      locales: publishedLocales(preference),
      language: initialDocumentationLanguage(preference),
    }
    return (
      head +
      '<script>window.__WHIZAM_TOOLS__=' +
      JSON.stringify(config).replaceAll('<', String.fromCharCode(92) + 'u003c') +
      '</script>'
    )
  },
  stories: async () => {
    const { readCatalog } = await import('../scripts/storybook-catalog.ts')
    const catalog = await readCatalog(root)
    return [
      ...readdirSync(resolve(root, '.storybook/structure'))
        .filter((file) => file.endsWith('.mdx'))
        .map((file) => resolve(root, '.storybook/structure', file)),
      ...catalog.stories.map((story) => resolve(root, story.file)),
    ]
  },
  addons: ['@storybook/addon-docs'],
  features: { sidebarOnboardingChecklist: false, menuOnboardingChecklist: false },
  staticDirs: ['../public'],
  framework: '@storybook/react-vite',
  core: {
    disableTelemetry: true,
    enableCrashReports: false,
    builder: {
      name: '@storybook/builder-vite',
      options: { viteConfigPath: '.storybook/vite.config.ts' },
    },
  },
}
export default config
