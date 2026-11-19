import type { ComponentProps } from 'react'
import { Panel } from './Notice'
import { TokenCatalog } from '../TokenCatalog'
const meta = {
  id: 'components-panel',
  title: '02 — Components/Layout Components/Panel',
  component: Panel,
  args: { children: 'Un panneau regroupe des contenus liés.' },
  parameters: {},
  tags: ['autodocs'],
}
export default meta
export const Tokens = {
  name: 'Component Tokens',
  render: () => <TokenCatalog category="Component tokens / Panel" />,
  parameters: {},
}
export const Default: { args?: Partial<ComponentProps<typeof Panel>> } = {}
