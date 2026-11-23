# Kit instructions — Claude Code

Read `AGENTS.md`, the active collaboration authority, then `docs/agents/skill-contract.md` and `agents/builder.md`. Roles in `agents/` are sequential by default; this file adds no delegation or provider authorization.

Apply [initial scoping](docs/agents/project-intake.md): conditional questions, conversational follow-ups and resumption from the brief/checkpoint. Do not ask which assistant is used; use its entry-point policy. Collect missing documentation languages at Q10 according to [Project languages](docs/agents/languages.md).

Canonical skill sources are in `skills/`. Read `docs/agents/adapters.md` for discovery, activation and limitations. Skill content paths start from the repository root. Preserve native tool approvals; Markdown instructions do not replace them.

## Documentation language

Apply [initial scoping](docs/agents/project-intake.md): conditional questions, conversational follow-ups and resumption from the brief/checkpoint. Do not ask which assistant is used; use its entry-point policy. Collect missing documentation languages at Q10 according to [Project languages](docs/agents/languages.md).
## Entry policy

Claude Code: read `docs/claude/chantier-model-routing.md`; do not apply the Codex policy referenced by AGENTS. Do not use the old local assistant preference for routing.
