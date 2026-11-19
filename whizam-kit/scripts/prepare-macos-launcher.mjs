import * as fs from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'
import { readConfig, shellQuote } from './local-app.mjs'

if (process.platform !== 'darwin') throw new Error('La création du lanceur Dock nécessite macOS.')
const root = await fs.realpath(process.argv[2] ?? fileURLToPath(new URL('..', import.meta.url)))
const config = await readConfig(root)
if (!config.webApp?.endsWith('.app'))
  throw new Error('Associer d’abord une app web Safari à cette instance.')
await fs.access(resolve(config.webApp, 'Contents/Info.plist'))
const destination = resolve(root, '.runtime.local/local-app')
// Each build gets its own directory; never overwrite a running launcher.
const generation = await fs.mkdtemp(resolve(destination, 'launcher-'))
const command = (action) =>
  [process.execPath, resolve(root, 'scripts/local-app.mjs'), action, '--root', root]
    .map(shellQuote)
    .join(' ')
const source = (action) =>
  [
    'on run',
    'try',
    'with timeout of 240 seconds',
    `do shell script ${JSON.stringify(command(action))}`,
    'end timeout',
    'on error errorMessage',
    'display alert "UI Lab indisponible" message errorMessage as critical',
    'end try',
    'end run',
  ].join('\n')
for (const [name, action] of [
  ['UI Lab', 'open'],
  ['Stop UI Lab', 'stop'],
  ['Storybook', 'storybook'],
]) {
  // Storybook action also starts the same instance, then opens its documentary URL.
  const bundle = resolve(generation, name + '.app')
  execFileSync('/usr/bin/osacompile', ['-o', bundle, '-e', source(action)])
  const plistPath = resolve(bundle, 'Contents/Info.plist')
  const plist = JSON.parse(
    execFileSync('/usr/bin/plutil', ['-convert', 'json', '-o', '-', plistPath], {
      encoding: 'utf8',
    }),
  )
  plist.CFBundleIdentifier = 'org.agentic-design.local-app.' + config.id + '.' + action
  // osacompile supplies generic prompts for calendars, contacts, camera, etc.
  // These launchers use none of those APIs and request none of those permissions.
  for (const key of Object.keys(plist))
    if (key.startsWith('NS') && key.endsWith('UsageDescription')) delete plist[key]
  await fs.writeFile(plistPath, JSON.stringify(plist))
  execFileSync('/usr/bin/plutil', ['-convert', 'xml1', plistPath])
  execFileSync('/usr/bin/codesign', ['--force', '--sign', '-', bundle])
}
console.log(generation)
