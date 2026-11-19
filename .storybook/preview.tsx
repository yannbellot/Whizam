import type { Preview } from '@storybook/react-vite'
import '../src/styles/tokens.generated.css'
import '../src/styles/global.css'
import '../src/styles/project.css'

const preview: Preview = { parameters: { layout: 'padded' } }
export default preview
