import { runLocalService } from './core/local-service.mjs'
import { execFile } from 'node:child_process'
import path from 'node:path'
const root = path.resolve(import.meta.dirname, '..')
await runLocalService('project.open', { root })
const state = await runLocalService('runtime.start', { root })
execFile('/usr/bin/open', [state.workspace.uiLab], (error) => {
  if (error) {
    console.error(error.message)
    process.exitCode = 1
  }
})
console.log('Loomata : ' + state.workspace.uiLab + ' — Storybook : ' + state.workspace.storybook)
