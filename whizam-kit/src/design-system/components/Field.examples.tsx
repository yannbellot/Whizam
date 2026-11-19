import type { ComponentProps, ReactElement } from 'react'
import { Field, SelectField } from './Field'
import { TokenCatalog } from '../TokenCatalog'

const meta = {
  id: 'components-field',
  title: '02 — Components/UI Components/Field',
  component: Field,
  tags: ['autodocs'],
  parameters: {},
  args: { name: 'demo', label: 'Nom du projet', hint: 'Donnée fictive.' },
}
export default meta
export const Tokens = {
  name: 'Component Tokens',
  render: () => <TokenCatalog category="Component tokens / Field" />,
  parameters: {},
}
type Story = {
  tags?: string[]
  args?: Partial<ComponentProps<typeof Field>>
  parameters?: Record<string, unknown>
  render?: () => ReactElement
}
export const Default: Story = {}
export const Invalid: Story = { args: { error: 'Saisissez un nom.', required: true } }
export const Disabled: Story = { args: { disabled: true } }
export const Multiline: Story = { args: { multiline: true, label: 'Description' } }
export const Selection: Story = {
  tags: ['!dev'],
  parameters: {},
  render: () => (
    <SelectField name="choice" label="Choix simple" options={['Option A', 'Option B']} />
  ),
}

export const MultilineInvalid: Story = {
  args: { multiline: true, error: 'Saisissez une description.' },
}
export const MultilineDisabled: Story = { args: { multiline: true, disabled: true } }
export const SelectionDisabled: Story = {
  tags: ['!dev'],
  parameters: {},
  render: () => (
    <SelectField
      name="disabled-choice"
      label="Choix indisponible"
      disabled
      options={['Option A']}
    />
  ),
}
