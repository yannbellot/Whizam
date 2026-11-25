import { readIntake } from './project-intake.mjs'
export async function toolIdentity(root) {
  let state
  try {
    state = await readIntake(root)
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
  const answer = state?.answers.q1
  const name = answer && ['provided', 'proposed'].includes(answer.status) ? answer.value.trim() : ''
  return name || 'Kit Whizam'
}
