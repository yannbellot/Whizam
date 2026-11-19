import assert from 'node:assert/strict'
import { readFileSync, readdirSync, existsSync, realpathSync, statSync } from 'node:fs'
import { dirname, resolve, relative, isAbsolute } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'
import process from 'node:process'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const require = createRequire(resolve(root, 'package.json'))
const { parseDocument } = require('yaml')
function localFile(path) {
  assert.equal(typeof path, 'string', 'Reference must be a relative file path')
  assert.ok(
    !isAbsolute(path) && !relative(root, resolve(root, path)).startsWith('..'),
    'Reference escapes the repository',
  )
  const file = resolve(root, path)
  assert.ok(existsSync(file), `Missing referenced file: ${path}`)
  assert.ok(
    !relative(root, realpathSync(file)).startsWith('..'),
    'Reference resolves outside the repository',
  )
  assert.ok(statSync(file).isFile(), `Reference is not a file: ${path}`)
  return file
}
try {
  for (const path of [
    'AGENTS.md',
    'CLAUDE.md',
    'GEMINI.md',
    'docs/agents/adapters.md',
    'docs/compatibility.md',
  ])
    localFile(path)
  const catalog = JSON.parse(readFileSync(resolve(root, 'skills/catalog.json'), 'utf8'))
  const partial = process.argv.includes('--partial')
  assert.equal(catalog.schemaVersion, 1)
  assert.ok(
    Number.isSafeInteger(catalog.targetSkills) && catalog.targetSkills > 0,
    'Expected skill count must be a positive integer',
  )
  assert.equal(catalog.targetRoles, 4, 'The specification requires four roles')
  localFile(catalog.contract)
  assert.ok(catalog.skills.length > 0 && Object.keys(catalog.roles).length > 0)
  assert.ok(
    catalog.skills.length <= catalog.targetSkills,
    'Skill catalog exceeds its declared count',
  )
  if (!partial) {
    assert.equal(catalog.skills.length, catalog.targetSkills, 'Incomplete skill catalog')
    assert.equal(Object.keys(catalog.roles).length, catalog.targetRoles, 'Incomplete role catalog')
  }
  const names = new Set()
  for (const skill of catalog.skills) {
    assert.match(skill.name, /^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    assert.ok(!names.has(skill.name), `Duplicate skill: ${skill.name}`)
    names.add(skill.name)
    assert.equal(skill.source, `skills/${skill.name}/SKILL.md`)
    const content = readFileSync(localFile(skill.source), 'utf8')
    const frontmatter = content.match(/^---\r?\n([\s\S]+?)\r?\n---\r?\n/)
    assert.ok(frontmatter, `Missing skill frontmatter: ${skill.name}`)
    const document = parseDocument(frontmatter[1], { uniqueKeys: true })
    assert.equal(document.errors.length, 0, `Invalid YAML: ${skill.name}`)
    const meta = document.toJS()
    assert.equal(meta.name, skill.name)
    assert.ok(
      typeof meta.description === 'string' && meta.description.trim(),
      `Missing description: ${skill.name}`,
    )
    localFile(skill.practice)
    if (skill.resources !== undefined) {
      assert.ok(Array.isArray(skill.resources), `Invalid resources: ${skill.name}`)
      for (const resource of skill.resources) localFile(resource)
    }
    assert.ok(skill.roles.length > 0)
    for (const role of skill.roles) localFile(catalog.roles[role])
  }
  if (!partial) {
    const sources = readdirSync(resolve(root, 'skills')).filter((name) =>
      existsSync(resolve(root, 'skills', name, 'SKILL.md')),
    )
    assert.deepEqual(sources.sort(), [...names].sort(), 'Skill sources diverge from catalog')
  }
  for (const path of Object.values(catalog.roles)) localFile(path)
  for (const base of ['.agents/skills', '.claude/skills']) {
    if (!partial) {
      const exposed = readdirSync(resolve(root, base), { withFileTypes: true })
        .filter((entry) => entry.isDirectory() || entry.isSymbolicLink())
        .map((entry) => entry.name)
      assert.deepEqual(exposed.sort(), [...names].sort(), `Adapter entries diverge: ${base}`)
    }
    for (const skill of catalog.skills) {
      assert.equal(
        realpathSync(localFile(`${base}/${skill.name}/SKILL.md`)),
        realpathSync(localFile(skill.source)),
        `Adapter source diverges: ${base}/${skill.name}`,
      )
    }
  }

  console.log(
    `PASS: ${names.size} skills, ${Object.keys(catalog.roles).length} roles; references and frontmatter valid${partial ? ' (partial catalog)' : ''}`,
  )
  console.log('Structural validation only; native discovery and behavior require separate evidence')
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
