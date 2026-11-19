import { useEffect, useRef } from 'react'
import { Form, Link, useNavigation } from 'react-router'
import { Button } from '../../../src/design-system/components/Button'
import { Field } from '../../../src/design-system/components/Field'
import { Notice } from '../../../src/design-system/components/Notice'
import type { ProjectInput } from './project-contract'
import styles from './projects.module.css'

export type ProjectFormFeedback = {
  values: ProjectInput
  errors: Record<string, string | undefined>
  message: string
}
export function ProjectForm({
  initial = { name: '', description: '' },
  feedback,
  cancelHref,
}: {
  initial?: ProjectInput
  feedback?: ProjectFormFeedback
  cancelHref: string
}) {
  const navigation = useNavigation()
  const busy = navigation.state === 'submitting'
  const summary = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (feedback) summary.current?.focus()
  }, [feedback])
  const values = feedback?.values ?? initial
  return (
    <Form method="post" className={styles.form}>
      {feedback && (
        <div ref={summary} tabIndex={-1}>
          <Notice tone="error">{feedback.message}</Notice>
        </div>
      )}
      <Field
        name="name"
        label="Nom du projet"
        hint="Requis, 100 caractères maximum."
        defaultValue={values.name}
        error={feedback?.errors.name}
        required
        maxLength={100}
      />
      <Field
        name="description"
        label="Description"
        hint="Facultative, 2000 caractères maximum."
        defaultValue={values.description}
        error={feedback?.errors.description}
        multiline
        maxLength={2000}
      />
      <div className={styles.actions}>
        <Button type="submit" loading={busy}>
          Enregistrer le projet
        </Button>
        <Link to={cancelHref}>Annuler</Link>
      </div>
    </Form>
  )
}
