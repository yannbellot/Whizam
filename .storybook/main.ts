import { readdirSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { StorybookConfig } from '@storybook/react-vite'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const excluded: string[] = JSON.parse(
  readFileSync(resolve(root, '.storybook/starter-stories.json'), 'utf8'),
)

const config: StorybookConfig = {
  // Les références initiales restent dans les sources, hors consultation.
  // Toute nouvelle story est découverte ; retirer une exclusion pour promouvoir une référence.
  stories: async () => {
    const entries = ['src/design-system', 'app', '.storybook'].flatMap((directory) =>
      readdirSync(resolve(root, directory), { recursive: true, encoding: 'utf8' })
        .map((file) => `${directory}/${file}`)
        .filter((file) => /\.(stories\.[jt]sx?|mdx)$/.test(file) && !excluded.includes(file))
        .map((file) => resolve(root, file)),
    )
    // Storybook accepte un glob sans résultat mais refuse une liste vide.
    return entries.length ? entries : ['../app/**/__empty__/*.stories.tsx']
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
