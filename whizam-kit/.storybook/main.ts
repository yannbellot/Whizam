import { readdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { StorybookConfig } from '@storybook/react-vite'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const config: StorybookConfig = {
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
