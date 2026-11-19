import { SelectField } from './Field'
import { Selection, SelectionDisabled } from './Field.examples'
import { TokenCatalog } from '../TokenCatalog'
const meta = {
  id: 'components-select-field',
  title: '02 — Components/UI Components/SelectField',
  component: SelectField,
  args: { name: 'choice', label: 'Choix simple', options: ['Option A', 'Option B'] },
  parameters: {},
}
export default meta
export const Default = { ...Selection, tags: ['autodocs'] }
export const Disabled = { ...SelectionDisabled, tags: ['autodocs'] }
export const Tokens = {
  name: 'Component Tokens',
  render: () => <TokenCatalog category="Component tokens / SelectField" />,
  parameters: {},
}
