import { Button } from '../components/Button'
import { Field, SelectField } from '../components/Field'
import { Notice, Panel } from '../components/Notice'

export function ControlStates() {
  return (
    <div
      style={{
        display: 'grid',
        gap: 'var(--adl-component-foundations-default-layout-large-gap-default)',
      }}
    >
      <Panel>
        <h3>États de formulaire</h3>
        <Field
          name="example-name"
          label="Nom de démonstration"
          hint="Donnée fictive, aucune sauvegarde."
          required
        />
        <Field name="invalid-name" label="Nom invalide" error="Saisissez un nom." />
        <Field name="disabled-name" label="Champ désactivé" disabled />
        <SelectField
          name="demo-choice"
          label="Choix de démonstration"
          options={['Option A', 'Option B']}
        />
      </Panel>
      <div
        style={{
          display: 'flex',
          gap: 'var(--adl-component-foundations-default-layout-small-gap-default)',
          flexWrap: 'wrap',
        }}
      >
        <Button disabled>Indisponible</Button>
        <Button loading>Enregistrer</Button>
      </div>
      <Notice>
        Aucun projet pour le moment. La création sera proposée dans le parcours métier.
      </Notice>
      <Notice tone="success">Exemple de confirmation.</Notice>
      <Notice tone="error">Exemple d’erreur : vérifiez les champs puis réessayez.</Notice>
    </div>
  )
}
