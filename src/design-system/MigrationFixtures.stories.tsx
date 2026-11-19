import type { Meta, StoryObj } from '@storybook/react-vite'
import definition, * as examples from './MigrationFixtures.examples'
const meta = {
  ...definition,
  id: 'design-system-migration',
  title: '02 — Components/Examples/Reference fixtures',
} satisfies Meta<typeof definition.component>
export default meta
type Story = StoryObj<typeof meta>
export const Reference: Story = { ...examples.Reference }
