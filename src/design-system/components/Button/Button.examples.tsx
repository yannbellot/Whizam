import { useState, type ComponentProps, type ReactElement, type FormEvent } from 'react'
import { Field } from '../Field'
import { Button } from './Button'
import { TokenCatalog } from '../../TokenCatalog'

const meta = {
  id: 'components-button',
  title: '02 — Components/UI Components/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {},
  args: { children: 'Enregistrer le projet' },
}
export default meta
export const Tokens = {
  name: 'Component Tokens',
  render: () => <TokenCatalog category="Component tokens / Button" />,
  parameters: {},
}
type Story = {
  args?: Partial<ComponentProps<typeof Button>>
  parameters?: Record<string, unknown>
  render?: () => ReactElement
}
export const Default: Story = {}
export const Disabled: Story = { args: { disabled: true } }
export const Loading: Story = { args: { loading: true } }

function FormContract() {
  const [clicks, setClicks] = useState(0)
  const [result, setResult] = useState('En attente')
  const [focused, setFocused] = useState(false)
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const button = (event.nativeEvent as SubmitEvent).submitter
    setResult(
      `${new FormData(event.currentTarget).get('contract-name')} · ${button?.getAttribute('name')}=${button?.getAttribute('value')}`,
    )
  }
  return (
    <form onSubmit={submit}>
      <Field name="contract-name" label="Valeur du formulaire" defaultValue="Initiale" />
      <Button
        type="submit"
        name="action"
        value={7}
        onClick={() => setClicks((n) => n + 1)}
        onFocus={() => setFocused(true)}
      >
        Soumettre
      </Button>
      <Button type="reset">Rétablir</Button>
      <p role="status">
        {result} · clics={clicks} · focus={String(focused)}
      </p>
    </form>
  )
}
export const HTMLForm = {
  tags: ['!dev'],
  name: 'Contrat de formulaire HTML',
  render: () => <FormContract />,
}
