# Internal kit adapters

The `skills/<name>/SKILL.md` sources declared in the [catalog](../../skills/catalog.json) and four `agents/*.md` roles are shared. Versioned relative links expose the same files in `.agents/skills/` and `.claude/skills/`. Targets stay internal after extraction, rename and relocation. Clones/exports must preserve links; if another platform converts them to text, discovery remains unverified. Do not overwrite existing configuration.

After npm ci, from the kit root: `npm run validate:agent-kit`. This structural check proves neither native discovery nor assistant behavior. Read AGENTS.md, the [common contract](skill-contract.md) and useful role. Files ship with the kit; no global settings are required. Native tool permissions remain applicable.

| Target assistant | Shipped entry / exposure | Native trial to record for the available version |
| --- | --- | --- |
| Codex | AGENTS.md; .agents/skills | Native inventory with provenance, then `$analyze-brief`; reload if needed. |
| Claude Code | CLAUDE.md; .claude/skills | Skill inventory then analyze-brief invocation according to CLI; check provenance if a global skill shares the name. |
| Gemini CLI | GEMINI.md; .agents/skills | Native listing/reload and invocation, retaining activation consent. |
| Mistral Vibe Code CLI | Initial instruction to read AGENTS.md; .agents/skills | In the approved project, load analyze-brief then useful role for that version; distinguish Vibe Code from Vibe Work. |

For Mistral, explicit AGENTS.md reading is the documented entry; no extra provider configuration is claimed installed. For each tool, load `agents/builder.md`, then the required reviewer. Without available authorized delegation: sequential, same agent, non-independent. This adapter adds no key, installation, inference, subagent or global permission.

[Request handling](../../AGENTS.md#traitement-des-demandes-et-validation-de-lexécution) is shared by all four assistants: direct informative responses, proposals before non-minor changes, minor exceptions and approved-scope resumption. Codex/Claude Code apply their own model/effort policies; Gemini/Mistral/Other use common rules without invented mappings. Instructions do not prove native adherence; provider permissions and priority instructions remain applicable.

## Policies by entry point

Apply [initial scoping](project-intake.md): conditional questions, conversational follow-ups and resumption from the brief/checkpoint. Do not ask which assistant is used; use its entry-point policy. Collect missing documentation languages at Q10 according to [Project languages](languages.md).

After Claude Code selection read [Claude policy](../claude/chantier-model-routing.md); after Codex read [Codex policy](../codex/chantier-model-routing.md). For Mistral/Other, explicit AGENTS reading remains necessary if not native. Adapter presence is not a user declaration or evidence of this step’s execution.

## Native choices and supplementary instructions

For useful decisions after welcome, use the tool exposed/authorized by the client: native user requests in Codex, AskUserQuestion in Claude Code when available. Apply the [common protocol](user-decisions.md): optional supplementary instructions through notes, free response or text, without promising a field beneath buttons. The kit changes no timeout setting; absent replies/automatic returns do not grant agreement. For Gemini/Mistral and tools without verified capabilities, use text fallback without claiming a native selector. E2E tests do not replace reviews.

## First request in an extracted kit

“Initialize a new project Atlas” is routed by [AGENTS.md](../../AGENTS.md#démarrer-un-nouveau-projet) to [initialize-project](../../skills/initialize-project/SKILL.md). The skill, environment reference and [standalone workflow](../product/project-start.md) travel with sources; both relative exposures remain unchanged. The skill prepares technical work; the Builder hands scoping/implementation to existing procedures. Application/Storybook access points appear at first review under that workflow; no globally installed prompt. If native discovery is absent, the assistant may explicitly read files after AGENTS without treating this as successful native discovery. Preserve Mistral’s explicit AGENTS entry above. This workflow/limits are distinct from the historical scenario below.

## Common scenario

In a disposable extracted kit, record version/OS/source SHA and list catalog skills with provenance. Ask: “Analyze this fictional brief with analyze-brief: I want a tool for my projects. Do not implement anything.” Expect intent, material ambiguities and a minimal assumption without implicit expansion. Load four roles under explicit missions and retain reports, mode, observations and limits. Successful installation/listing does not prove model behavior.

Additional inference trials need authorized access/scope. Without tools/access record unverified; do not activate providers or change host configuration to turn missing trials into successes. See the [actual matrix](../compatibility.md).

## Convention references

Conventions documented on 21 October 2026 and retained during integration; recheck official sources for native qualification/updates: [Codex skills](https://learn.chatgpt.com/docs/build-skills), [Claude skills](https://code.claude.com/docs/en/skills), [Gemini skills](https://geminicli.com/docs/cli/using-agent-skills/), [Vibe skills](https://docs.mistral.ai/vibe/code/cli/skills), [Vibe configuration](https://docs.mistral.ai/vibe/code/cli/configuration). Moving files does not reverify conventions.

## Documentation language

Apply [initial scoping](project-intake.md): conditional questions, conversational follow-ups and resumption from the brief/checkpoint. Do not ask which assistant is used; use its entry-point policy. Collect missing documentation languages at Q10 according to [Project languages](languages.md).