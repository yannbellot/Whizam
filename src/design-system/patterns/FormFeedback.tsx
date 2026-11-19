import { useState, type ComponentPropsWithoutRef, type FormEvent } from 'react'
import { Button } from '../components/Button'
import { Field } from '../components/Field'
import { Notice, Panel } from '../components/Notice'

export function FormFeedback(props: ComponentPropsWithoutRef<'div'>) {
  const [result, setResult] = useState<'idle' | 'invalid' | 'success'>('idle')
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const valid = String(new FormData(form).get('pattern-name') ?? '').trim().length > 0
    setResult(valid ? 'success' : 'invalid')
    if (!valid) (form.elements.namedItem('pattern-name') as HTMLInputElement)?.focus()
  }
  return (
    <Panel {...props} data-loomata-definition="form-feedback">
      <h2>Validation de formulaire</h2>
      <p>
        Interaction Pattern : erreur reliée au champ, saisie conservée, correction et nouvelle
        soumission. Démonstration locale sans enregistrement de données.
      </p>
      <form noValidate onSubmit={submit}>
        <Field
          name="pattern-name"
          label="Nom du document"
          required
          error={result === 'invalid' ? 'Saisissez un nom pour continuer.' : undefined}
        />
        <Button type="submit" data-loomata-placement="de873e98-e6c0-46c1-8096-759448e17490">
          Valider l’exemple
        </Button>
      </form>
      {result === 'invalid' && (
        <Notice tone="error">
          Le formulaire contient une erreur. Corrigez le champ puis réessayez.
        </Notice>
      )}
      {result === 'success' && (
        <Notice tone="success">Exemple validé. Aucune donnée enregistrée.</Notice>
      )}
    </Panel>
  )
}
