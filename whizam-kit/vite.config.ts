import tailwindcss from '@tailwindcss/vite'
import { designSystemPlugin } from './scripts/design-system-plugin'
import { defineConfig } from 'vite'
import { reactRouter } from '@react-router/dev/vite'
import { sourceServer } from './scripts/vite-source-boundary'

export default defineConfig({
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react/jsx-runtime',
      'react-router',
      'react-router/dom',
      'zod',
      'react-aria-components',
      'react-grab/primitives',
      'react-aria/useButton',
      'react-aria/mergeProps',
      '@base-ui/react/dialog',
      '@base-ui/react/switch',
    ],
  },
  server: sourceServer(new URL('.', import.meta.url)),
  plugins: [
    tailwindcss(),
    designSystemPlugin(),
    reactRouter(),
    {
      name: 'application-router-dependencies',
      enforce: 'post',
      config(config) {
        // Router's optional package probe also searches ancestor node_modules.
        // This application imports react-router directly, without its compatibility package.
        if (config.optimizeDeps?.include) {
          config.optimizeDeps.include = config.optimizeDeps.include.filter(
            (name) => name !== 'react-router-dom',
          )
        }
      },
    },
  ],
})
