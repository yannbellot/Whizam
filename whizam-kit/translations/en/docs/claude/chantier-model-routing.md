# Recommending Claude Code models and effort per work item

This policy explains how to recommend a Claude Code model and effort level for the work at hand. It applies when Claude Code is the active entry point, without an assistant-selection questionnaire. Recommendations retain their provenance: a recommendation from another assistant does not become a current Claude recommendation.

## References and availability

Documentation read on 19 November 2026: [model configuration](https://code.claude.com/docs/en/model-config), [available levels](https://code.claude.com/docs/en/model-config#adjust-effort-level) and [manual settings](https://code.claude.com/docs/en/model-config#set-the-effort-level). Sonnet 5.5 (`claude-sonnet-5-5`) and Opus 5.5 (`claude-opus-5-5`) are documented with `low`, `medium`, `high`, `xhigh`, `max`. Aliases can resolve differently by provider. Actual availability in recipients’ selectors is not verified here. Efforts do not measure identical reasoning quantities across models.

Thresholds below are kit decisions, not measured equivalence with Codex or quality/cost/duration guarantees. This revision supplies no local benchmark/native Claude Code trial. Recheck documentation/accessible options when models/levels are missing; disclose differences and propose an adaptation for approval rather than silent replacement.

## Work analysis

Read-only inspection of relevant paths should distinguish facts, observed complexities and unknowns across five dimensions:

1. Requested result clarity/consistency with brief/specifications.
2. Localization, execution paths, affected producers/consumers.
3. Actually changed security, data, migration and environment boundaries.
4. Dependent contracts/required evidence including negative scenarios/recovery.
5. Remaining contradictions/unknowns.

File counts or words like “security” do not justify higher effort. Missing product information/access/tools needs decisions/diagnosis rather than default reasoning increases. [Authorities](../../AGENTS.md#autorités-et-périmètre) and stop conditions remain.

## Kit decision grid

Prefer Sonnet 5.5 and increase effort according to observed difficulty. No workflow sequence automatically increases effort.

| Recommended configuration | Conditions |
| --- | --- |
| **Claude Sonnet 5.5 · Low** (`low`) | Simple scoping/bounded explanation, clear outcome and no material unknown; simple analysis only, never ordinary development. |
| **Claude Sonnet 5.5 · Medium** (`medium`) | Ordinary development floor; known localized reversible scope, identifiable contracts/checks. |
| **Claude Sonnet 5.5 · High** (`high`) | Floor for actually changing sensitive surfaces below or applicable security evidence; name affected guarantees/evidence. |
| **Claude Sonnet 5.5 · Extra high** (`xhigh`) | Concrete difficulty analyzing dependencies, negative cases, migrations, evidence or rollback together. A sensitive surface alone is insufficient. |
| **Claude Opus 5.5 · High or Extra high** (`high` or `xhigh`) | Persistent architectural uncertainty or observed Sonnet limitation; justify why greater Sonnet effort would not reasonably cover the need and expected Opus benefit. |
| **Max** (`max`), with explicitly named model | Exception for a specific difficulty beyond reasonable extra-high handling; define expected evidence. No mandatory Max trial before an already justified Opus switch. |

Actually affected surfaces requiring at least high: authentication/authorization/isolation/sessions/permissions; data migration/transformation; RAG/provenance/AI providers; proxies/containers/runtime/CI/environment contracts; several dependent contracts; security-evidence obligations. Mere documentary mentions imply neither presence nor modification.

Examples: a verified local color change may use medium; data transformation requires at least high; uncertain architecture may justify Opus after inspection. Effort replaces neither review nor human validation.

## Recommendation, approval and resumption

Follow [common handling](../../AGENTS.md#traitement-des-demandes-et-validation-de-lexécution) and [display rules](../../AGENTS.md#affichage-et-reprise):

## Manual selection in Claude Code

Users open `/model` for model then `/effort` for effort. Compatible selectors use `s` for session-only selection. Then send approval/resumption for the work. Never automatically modify user/project settings or claim validation replies changed selectors. If unavailable/organization-limited, disclose and propose accessible configuration for approval.

Documentary reading proves neither actual selection nor native behavior. Policy activates no additional mode, provider or subagent. Client priority instructions/permissions remain applicable.

## User questions and comments

Apply the [common protocol](../agents/user-decisions.md) for useful decisions/optional supplementary instructions.Mode options/comments do not select client models or grant execution approval without explicit expression. Preserve established pair-display rules; this protocol triggers no repeated recommendations.
