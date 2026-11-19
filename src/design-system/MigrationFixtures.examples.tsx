/* eslint-disable react-refresh/only-export-components -- shared fixture definition */
import type { ComponentProps } from 'react'
import { Button } from './components/Button'
import { Field, SelectField } from './components/Field'
import { Notice, Panel } from './components/Notice'
import pageStyles from '../../app/features/projects/projects.module.css'
import tableStyles from './foundations.module.css'

function MigrationFixtures() {
  return (
    <div className={pageStyles.page} data-migration="page">
      <h1>Composants de référence</h1>
      <div className={pageStyles.navigation} data-migration="layout-medium">
        <Button>Action disponible</Button>
        <Button disabled>Action désactivée</Button>
        <Button loading>Action occupée</Button>
      </div>
      <div className={pageStyles.content} data-migration="layout-large">
        <Panel>
          <p>Contenu de panneau.</p>
          {([false, true] as const).map((multiline) => (
            <div key={String(multiline)}>
              <Field
                name={`valid-${multiline}`}
                label={`Saisie ${multiline ? 'longue' : 'courte'}`}
                hint="Aide de saisie."
                multiline={multiline}
              />
              <Field
                name={`error-${multiline}`}
                label={`Erreur ${multiline ? 'longue' : 'courte'}`}
                error="Saisissez une valeur."
                multiline={multiline}
              />
              <Field
                name={`disabled-${multiline}`}
                label={`Désactivée ${multiline ? 'longue' : 'courte'}`}
                disabled
                multiline={multiline}
              />
              <Field
                name={`combined-${multiline}`}
                label={`Combinée ${multiline ? 'longue' : 'courte'}`}
                disabled
                error="Valeur invalide."
                multiline={multiline}
              />
            </div>
          ))}
          <SelectField name="choice" label="Sélection" options={['Option A', 'Option B']} />
          <SelectField
            name="disabled-choice"
            label="Sélection désactivée"
            disabled
            options={['Option A']}
          />
        </Panel>
        <Notice>Information de référence.</Notice>
        <Notice tone="success">Opération réussie.</Notice>
        <Notice tone="error">Opération impossible.</Notice>
        <dl className={pageStyles.metadata}>
          <div data-migration="layout-small">
            <dt>Référence</dt>
            <dd>Donnée fictive</dd>
          </div>
        </dl>
        <table className={tableStyles.table}>
          <tbody>
            <tr>
              <th>Fondation</th>
              <td>Valeur de référence</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
const meta = {
  id: 'design-system-migration',
  title: '02 — Components/Examples/Reference fixtures',
  component: MigrationFixtures,
  parameters: {
    layout: 'fullscreen',
    designEditor: {
      targets: ['button', 'field', 'select-field', 'notice', 'panel', 'foundations'],
    },
  },
}
export default meta
export const Reference: { args?: Partial<ComponentProps<typeof MigrationFixtures>> } = {}
