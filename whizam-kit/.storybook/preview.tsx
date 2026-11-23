import type { Preview } from '@storybook/react-vite'
import '../src/styles/tokens.generated.css'
import '../src/styles/global.css'
import '../src/styles/project.css'
import './tables.css'
import './typography.css'

declare const __DOCUMENTATION_LANGUAGE__: string
declare const __DOCUMENTATION_LOCALES__: string[]

const preview: Preview = {
  initialGlobals: { documentationLanguage: __DOCUMENTATION_LANGUAGE__ },
  globalTypes: {
    documentationLanguage: {
      description: 'Documentation language',
      toolbar: {
        icon: 'globe',
        dynamicTitle: true,
        items: __DOCUMENTATION_LOCALES__.map((value) => ({
          value,
          title: value === 'fr' ? 'Français' : value === 'en' ? 'English' : value,
        })),
      },
    },
  },
  parameters: {
    layout: 'padded',
    options: {
      storySort: {
        order: [
          '01 — Foundations',
          [
            'Architecture',
            'Principles',
            'Primitives',
            [
              'All',
              'color',
              ['All', 'standalone'],
              'type',
              ['All', 'font-family', 'font-size', 'font-weight', 'line-height'],
              'radius',
              'size',
              'space',
              'stroke',
            ],
            'Tokens',
            [
              'Intentions',
              'All',
              'color',
              ['All', 'action', 'content', 'feedback', 'focus', 'surface'],
              'size',
              ['All', 'container'],
              'shape',
              'space',
              'type',
            ],
            'Rules',
            'Examples',
          ],
          '02 — Components',
          [
            'UI Components',
            ['Accueil', '*'],
            'Layout Components',
            ['Accueil', '*'],
            'Style inventory',
            'Examples',
            ['Accueil', '*'],
          ],
          '03 — Patterns',
          ['Interaction Patterns', ['Accueil', '*']],
        ],
      },
    },
  },
}
export default preview
