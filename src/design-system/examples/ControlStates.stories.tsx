import type { Meta, StoryObj } from '@storybook/react-vite'
import definition, * as examples from './ControlStates.examples'
const meta = {
  ...definition,
  id: 'patterns-tats',
  title: '02 — Components/Examples/States',
} satisfies Meta<typeof definition.component>
export default meta
type Story = StoryObj<typeof meta>
export const Reference: Story = { ...examples.Reference }
