import type { ProjectView } from './project-contract'
import styles from './projects.module.css'

export function ProjectSummary({ project }: { project: ProjectView }) {
  const format = (value: string) =>
    new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'UTC',
    }).format(new Date(value))
  return (
    <>
      <p className={styles.description}>
        {project.description || 'Ce projet ne comporte pas encore de description.'}
      </p>
      <dl className={styles.metadata}>
        <div>
          <dt>Créé le</dt>
          <dd>
            <time dateTime={project.createdAt}>{format(project.createdAt)} UTC</time>
          </dd>
        </div>
        <div>
          <dt>Modifié le</dt>
          <dd>
            <time dateTime={project.updatedAt}>{format(project.updatedAt)} UTC</time>
          </dd>
        </div>
      </dl>
    </>
  )
}
