import { data, redirect } from 'react-router'
import {
  assertLocalRequest,
  parseProjectId,
  projectResponseHeaders,
  readProjectForm,
} from './project-http.server.ts'
import { projectRepository } from './project-repository.server.ts'

function unavailable() {
  return new Response('Stockage indisponible.', { status: 503, headers: projectResponseHeaders })
}

export async function loadProjects(request: Request) {
  assertLocalRequest(request)
  try {
    return data({ projects: await projectRepository().list() }, { headers: projectResponseHeaders })
  } catch {
    throw unavailable()
  }
}

export async function loadProject(request: Request, value: unknown) {
  assertLocalRequest(request)
  const id = parseProjectId(value)
  let project
  try {
    project = await projectRepository().find(id)
  } catch {
    throw unavailable()
  }
  if (!project)
    throw new Response('Projet introuvable.', { status: 404, headers: projectResponseHeaders })
  return data({ project }, { headers: projectResponseHeaders })
}

export async function saveProject(request: Request, value?: unknown) {
  const form = await readProjectForm(request)
  const id = value === undefined ? undefined : parseProjectId(value)
  if (!form.parsed.success)
    return data(
      { values: form.values, errors: form.errors, message: 'Vérifiez les champs indiqués.' },
      { status: 400, headers: projectResponseHeaders },
    )
  let project
  try {
    const repository = projectRepository()
    project = id
      ? await repository.update(id, form.parsed.data)
      : await repository.create(form.parsed.data)
  } catch {
    return data(
      {
        values: form.values,
        errors: {},
        message:
          'Enregistrement impossible : stockage indisponible. Votre saisie est conservée ; réessayez.',
      },
      { status: 503, headers: projectResponseHeaders },
    )
  }
  if (!project)
    throw new Response('Projet introuvable.', { status: 404, headers: projectResponseHeaders })
  return redirect(`/projects/${project.id}?notice=${id ? 'updated' : 'created'}`, {
    status: 303,
    headers: projectResponseHeaders,
  })
}
