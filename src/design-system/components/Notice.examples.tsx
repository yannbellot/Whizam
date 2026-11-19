import type { ComponentProps, ReactElement } from 'react'
import { Notice } from './Notice'
import { TokenCatalog } from '../TokenCatalog'

const meta = {
  id: 'components-notice',
  title: '02 — Components/UI Components/Notice',
  component: Notice,
  tags: ['autodocs'],
  parameters: {},
  args: { children: 'Aucun projet. Créez votre premier projet fictif.' },
}
export default meta
export const Tokens = {
  name: 'Component Tokens',
  render: () => <TokenCatalog category="Component tokens / Notice" />,
  parameters: {},
}
type Story = {
  args?: Partial<ComponentProps<typeof Notice>>
  parameters?: Record<string, unknown>
  render?: () => ReactElement
}
export const Empty: Story = {}
export const Success: Story = {
  args: { tone: 'success', children: 'Le projet fictif a été enregistré.' },
}
export const Error: Story = {
  args: { tone: 'error', children: 'Enregistrement impossible. Réessayez.' },
}
