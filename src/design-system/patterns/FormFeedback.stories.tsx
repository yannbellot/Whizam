import type { Meta, StoryObj } from '@storybook/react-vite'
import definition, * as examples from './FormFeedback.examples'
const meta = {
  ...definition,
  id: 'patterns-form-feedback',
  title: '03 — Patterns/Interaction Patterns/Form validation',
} satisfies Meta<typeof definition.component>
export default meta
type Story = StoryObj<typeof meta>
export const Validation: Story = { ...examples.Validation }
