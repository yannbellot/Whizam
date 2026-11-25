import { afterEach, describe, expect, it } from 'vitest'
import {
  cpSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs'
import { spawnSync } from 'node:child_process'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import process from 'node:process'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const scratch = join(root, '.runtime.local', 'agent-kit-tests')
const owned: string[] = []
afterEach(() => {
  for (const path of owned.splice(0)) rmSync(path, { recursive: true, force: true })
})

function fixture() {
  mkdirSync(scratch, { recursive: true })
  const parent = mkdtempSync(join(scratch, 'owned-'))
  owned.push(parent)
  const kit = join(parent, 'kit')
  mkdirSync(join(kit, 'scripts'), { recursive: true })
  for (const entry of [
    'AGENTS.md',
    'CLAUDE.md',
    'GEMINI.md',
    'package.json',
    '.nvmrc',
    'agents',
    'skills',
    '.agents',
    '.claude',
    'docs',
    'scripts/validate-agent-kit.mjs',
    'scripts/github-project.mjs',
    'scripts/configure-secrets.mjs',
    'scripts/with-runtime.sh',
  ]) {
    cpSync(join(root, entry), join(kit, entry), { recursive: true, verbatimSymlinks: true })
  }
  return { parent, kit }
}

function validate(kit: string, cwd = kit) {
  return spawnSync(process.execPath, [join(kit, 'scripts/validate-agent-kit.mjs')], {
    cwd,
    encoding: 'utf8',
  })
}

describe('portable agent kit validation', () => {
  it('validates the same internal sources from another cwd after a rename and move', () => {
    const { parent, kit } = fixture()
    const moved = join(parent, 'renamed kit with spaces')
    renameSync(kit, moved)
    const result = validate(moved, parent)
    expect(result.status, result.stderr).toBe(0)
    const catalog = JSON.parse(readFileSync(join(moved, 'skills/catalog.json'), 'utf8'))
    expect(result.stdout).toContain(`${catalog.skills.length} skills, 4 roles`)
  })

  it('accepts another complete skill beyond the current delivery without a validator change', () => {
    const { kit } = fixture()
    const path = join(kit, 'skills/catalog.json')
    const catalog = JSON.parse(readFileSync(path, 'utf8'))
    const name = 'additional-workflow'
    mkdirSync(join(kit, 'skills', name))
    writeFileSync(
      join(kit, 'skills', name, 'SKILL.md'),
      `---\nname: ${name}\ndescription: An additional workflow for a derived project.\n---\n`,
    )
    catalog.skills.push({
      name,
      source: `skills/${name}/SKILL.md`,
      roles: ['builder'],
      practice: 'docs/agents/practice-history.md',
    })
    catalog.targetSkills = catalog.skills.length
    writeFileSync(path, JSON.stringify(catalog))
    for (const base of ['.agents/skills', '.claude/skills']) {
      symlinkSync(`../../skills/${name}`, join(kit, base, name))
    }
    const result = validate(kit)
    expect(result.status, result.stderr).toBe(0)
  })

  it('rejects a delivery missing a declared skill', () => {
    const { kit } = fixture()
    const path = join(kit, 'skills/catalog.json')
    const catalog = JSON.parse(readFileSync(path, 'utf8'))
    catalog.skills.pop()
    writeFileSync(path, JSON.stringify(catalog))
    const result = validate(kit)
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('Incomplete skill catalog')
  })

  it.each([
    'skills/initialize-project/references/environment-setup.md',
    'scripts/with-runtime.sh',
    'scripts/github-project.mjs',
    'scripts/configure-secrets.mjs',
    '.nvmrc',
  ])('rejects a required initialization resource missing from the delivery: %s', (resource) => {
    const { kit } = fixture()
    rmSync(join(kit, resource))
    const result = validate(kit)
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('Missing referenced file')
  })

  it('rejects a canonical skill source missing from the catalog', () => {
    const { kit } = fixture()
    mkdirSync(join(kit, 'skills/uncataloged-workflow'))
    writeFileSync(join(kit, 'skills/uncataloged-workflow/SKILL.md'), 'Uncataloged skill')
    const result = validate(kit)
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('Skill sources diverge from catalog')
  })

  it('rejects an extra adapter entry absent from the catalog', () => {
    const { kit } = fixture()
    symlinkSync('../../skills/analyze-brief', join(kit, '.agents/skills/uncataloged-workflow'))
    const result = validate(kit)
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('Adapter entries diverge')
  })

  it('rejects a catalog reference leaving the kit even when the file exists', () => {
    const { parent, kit } = fixture()
    writeFileSync(join(parent, 'external.md'), 'External project data')
    const path = join(kit, 'skills/catalog.json')
    const catalog = JSON.parse(readFileSync(path, 'utf8'))
    catalog.skills[0].practice = '../external.md'
    writeFileSync(path, JSON.stringify(catalog))
    const result = validate(kit)
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('Reference escapes the repository')
  })

  it('rejects a link that resolves to a file outside the kit', () => {
    const { parent, kit } = fixture()
    writeFileSync(join(parent, 'external.md'), 'External project data')
    symlinkSync('../../external.md', join(kit, 'docs/external.md'))
    const path = join(kit, 'skills/catalog.json')
    const catalog = JSON.parse(readFileSync(path, 'utf8'))
    catalog.contract = 'docs/external.md'
    writeFileSync(path, JSON.stringify(catalog))
    const result = validate(kit)
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('Reference resolves outside the repository')
  })

  it('rejects an adapter exposing another skill in place of its canonical source', () => {
    const { kit } = fixture()
    const link = join(kit, '.agents/skills/analyze-brief')
    rmSync(link)
    symlinkSync('../../skills/brief-to-specs', link)
    const result = validate(kit)
    expect(result.status).toBe(1)
    expect(result.stderr).toContain('Adapter source diverges')
  })
})
