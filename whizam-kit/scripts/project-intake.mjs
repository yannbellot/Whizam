import * as fs from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { fileURLToPath } from 'node:url'

const start = '<!-- whizam-intake:v1 -->'
const end = '<!-- /whizam-intake -->'
const ids = new Set([
  'entry',
  'demo',
  'translation',
  'verification',
  'approval',
  ...Array.from({ length: 10 }, (_, i) => `q${i + 1}`),
  'q6.platforms',
  'q6.other',
  'q6.computer',
  'q6.tablet',
  'q6.mobile',
  'q9.default',
  'q10.default',
])
const statuses = new Set(['provided', 'proposed', 'pending', 'deferred', 'skipped'])
const origins = new Set(['user', 'brief', 'assistant', 'branch'])
async function safe(root, relative) {
  let cursor = path.resolve(root)
  for (const part of relative.split('/')) {
    cursor = path.join(cursor, part)
    const info = await fs.lstat(cursor)
    if (info.isSymbolicLink()) throw new Error('Intake symlink refused')
  }
  return cursor
}
function decode(text) {
  if (!text.includes(start) && !text.includes(end))
    return { version: 1, welcomeShown: false, answers: {}, pending: null }
  const escaped = text.split(start)
  if (escaped.length !== 2 || text.split(end).length !== 2) throw new Error('Invalid intake block')
  const block = escaped[1].split(end)[0].trim()
  if (!block.startsWith('```json\n') || !block.endsWith('\n```'))
    throw new Error('Invalid intake block')
  const state = JSON.parse(block.slice(8, -4))
  if (
    Object.keys(state).some(
      (key) => !['version', 'welcomeShown', 'answers', 'pending'].includes(key),
    ) ||
    state.version !== 1 ||
    typeof state.welcomeShown !== 'boolean' ||
    !state.answers ||
    Array.isArray(state.answers) ||
    (state.pending !== null && !ids.has(state.pending))
  )
    throw new Error('Invalid intake state')
  for (const [id, answer] of Object.entries(state.answers)) {
    if (answer && Object.hasOwn(answer, 'id')) throw new Error('Invalid intake answer')
    validateAnswer({ id, ...answer })
  }
  return state
}
function validateAnswer(answer) {
  if (
    !answer ||
    !ids.has(answer.id) ||
    !statuses.has(answer.status) ||
    !origins.has(answer.origin) ||
    typeof answer.value !== 'string' ||
    answer.value.length > 20000 ||
    Object.keys(answer).some((key) => !['id', 'value', 'status', 'origin'].includes(key))
  )
    throw new Error('Invalid intake answer')
}
function replace(text, content) {
  if (!text.includes(start)) return text.trimEnd() + '\n\n' + content + '\n'
  const a = text.indexOf(start),
    b = text.indexOf(end, a)
  if (b < a) throw new Error('Invalid intake block')
  return text.slice(0, a) + content + text.slice(b + end.length)
}
async function atomic(file, text) {
  const temporary = file + '.' + randomUUID() + '.tmp'
  try {
    await fs.writeFile(temporary, text, {
      flag: 'wx',
      flush: true,
      mode: (await fs.stat(file)).mode & 0o777,
    })
    await fs.rename(temporary, file)
  } finally {
    await fs.rm(temporary, { force: true })
  }
}
export async function readIntake(root) {
  return decode(await fs.readFile(await safe(root, 'docs/product/brief.md'), 'utf8'))
}
export async function recordIntake(root, event) {
  if (
    !event ||
    Object.keys(event).some((key) => !['welcomeShown', 'answers', 'pending'].includes(key)) ||
    (event.welcomeShown !== undefined && typeof event.welcomeShown !== 'boolean') ||
    (event.pending !== undefined && event.pending !== null && !ids.has(event.pending)) ||
    (event.answers !== undefined && !Array.isArray(event.answers))
  )
    throw new Error('Invalid intake event')
  for (const answer of event.answers ?? []) validateAnswer(answer)
  const brief = await safe(root, 'docs/product/brief.md')
  const checkpoint = await safe(root, 'docs/project-state.md')
  const lock = path.join(path.dirname(brief), '.intake.lock')
  await fs.mkdir(lock).catch(() => {
    throw new Error('Intake write active or interrupted; inspect .intake.lock')
  })
  try {
    const original = await fs.readFile(brief, 'utf8')
    const progress = await fs.readFile(checkpoint, 'utf8')
    const state = decode(original)
    // Also refuse a damaged checkpoint before updating the canonical answers.
    if (
      (progress.includes(start) || progress.includes(end)) &&
      (progress.split(start).length !== 2 || progress.split(end).length !== 2)
    )
      throw new Error('Invalid intake checkpoint')
    if (event.welcomeShown !== undefined) state.welcomeShown = event.welcomeShown
    for (const { id, ...answer } of event.answers ?? []) state.answers[id] = answer
    if (event.pending !== undefined) state.pending = event.pending
    // Escape Markdown delimiters and HTML without changing decoded answer values.
    const json = JSON.stringify(state, null, 2).replace(
      /[<>`~]/g,
      (c) => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'),
    )
    await atomic(brief, replace(original, `${start}\n\`\`\`json\n${json}\n\`\`\`\n${end}`))
    await atomic(
      checkpoint,
      replace(
        progress,
        `${start}\nCadrage en cours — réponses de référence : [Brief](product/brief.md).\nAccueil présenté : ${state.welcomeShown ? 'oui' : 'non'}.\nProchaine décision : ${state.pending ?? 'synthèse à examiner'}.\nCe point ne vaut pas autorisation de développer.\n${end}`,
      ),
    )
    const saved = await readIntake(root)
    if (JSON.stringify(saved) !== JSON.stringify(state)) throw new Error('Intake reread mismatch')
    return saved
  } finally {
    await fs.rmdir(lock)
  }
}
if (process.argv[1] && (await fs.realpath(process.argv[1])) === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL('..', import.meta.url))
  if (process.argv[2] === 'show') console.log(JSON.stringify(await readIntake(root), null, 2))
  else if (process.argv[2] === 'record' && process.argv[3]) {
    await recordIntake(root, JSON.parse(await fs.readFile(process.argv[3], 'utf8')))
    console.log('Scoping answers saved and reread; no application initialization performed.')
  } else throw new Error('Usage: project-intake.mjs show | record <event.json>')
}
