# Recommending Codex models and effort per work item

**Qualitative policy — 25 October 2026; request handling revised 19 November 2026.** Applies to Codex exchanges and work they prepare. [Adoption decision](../decisions/003-qualitative-model-routing.md). Guides manual choice; [revision 041](../decisions/041-request-validation.md) governs prior approval under [instructions](../../AGENTS.md) without expanding permissions, publication or project acceptance. Kit instructions remain applicable. No universally high setting.

Codex is optional for kit users. When used, policy applies to work prepared in these exchanges. It imposes no model on Claude Code, Gemini CLI or Mistral Vibe users and no AI account for site execution. No cross-provider equivalence inferred.

## Availability and verification limits

Documentary verification on **25 October 2026**, reading official [GPT-6.1 Sol](https://developers.openai.com/api/docs/models/gpt-6.1-sol), [GPT-6 Astra](https://developers.openai.com/api/docs/models/gpt-6-astra) and [Codex model](https://learn.chatgpt.com/docs/models) pages.

| Model | Identifier | Documented effort levels |
| --- | --- | --- |
| GPT-6.1 Sol | `gpt-6.1-sol` | `low`, `medium`, `high`, `xhigh`, `max` |
| GPT-6 Astra | `gpt-6-astra` | `low`, `medium`, `high`, `xhigh`, `max` |

Both models/levels are also advertised by tools in the drafting session. This proves neither availability in every client selector nor current model/effort selection. Access depends on account/client/settings. When revising policy or options are missing, recheck official sources/accessible options; disclose necessary adaptation without inventing equivalent substitutes or changing the client. Rules below are project policy, not API defaults.

Labels: Low (`low`), Medium (`medium`), High (`high`), Extra high (`xhigh`), Max (`max`). **Ultra** is a separate Codex mode using subagents, not a synonym for Max; policy authorizes no activation/delegation.

## Sources and five dimensions

Start from requested product result, project rules/priorities and targeted affected-path inspection. Examine localization/transversality, actually affected contracts/dependencies, security/data/migration boundaries, tests/evidence and technical unknowns. Follow relevant calls/imports/producers/consumers; failed searches do not prove absence of impact.

For each dimension, record short evidence with path/symbol/section, separating **confirmed fact**, **observed complexity** and **undetermined point**. Examples below use internal starter resources; the projects demonstration is removed from active routes. Reassess for real derived projects.

| Dimension | Inspection and reference evidence in this kit |
| --- | --- |
| 1. Result clarity and consistency | Compare mandate, [kit scope](../product/starter-kit.md), brief/specifications. Whole kit and projects example differ; a label request authorizes no new workflow. |
| 2. Paths and localization | [Active routes](../../app/routes.ts), then example resources: `saveProject` in [project-routes.server.ts](../../app/features/projects/project-routes.server.ts), read/validation in [project-http.server.ts](../../app/features/projects/project-http.server.ts), then [repository](../../app/features/projects/project-repository.server.ts). Establish actually changed dependents beyond file counts. |
| 3. Sensitive boundaries | `readProjectForm` rejects unauthorized methods/origins/formats/size; `readServerHost` in [env.server.ts](../../app/server/env.server.ts) restricts noncontainer exposure; [Compose](../../compose.yaml) fixes exposure/persistent identity. Check whether changes actually affect these guarantees. |
| 4. Contracts and evidence | [Zod](../../app/features/projects/project-contract.ts), [Drizzle schema](../../app/server/db/schema.server.ts), [SQL migration](../../drizzle/0000_initial_projects.sql) coordinate fields/constraints. [PostgreSQL tests](../../tests/integration/postgres.test.ts) require isolated databases and check repeated migration/seed; [server tests](../../tests/unit/server-environment.test.ts) cover refusals/diagnostics. For UI follow [YAML authorities](../../src/design-system/authority/README.md), [generation](../../scripts/generate-tokens.mjs), components/stories. |
| 5. Contradictions and unknowns | [Documented security](../security.md) describes a local account-free demo; [compatibility](../compatibility.md) separates files from executed native trials. Authentication additions or unperformed provider trials are not presumed covered. |

File count is not a difficulty score. “Security”, “migration”, “refactor”, “scale” or “governance” alone justify no increase. Actually modifying a contract and merely mentioning it are distinct observations.

## Choosing GPT-6.1 Sol effort

Prefer **GPT-6.1 Sol**, increasing its effort first according to observed difficulty. Qualitative thresholds combine stated conditions; they are not benchmarks. No phase automatically changes configuration. Recommendations concern a precise slice, not necessarily the entire project.

| Complete configuration | Conditions |
| --- | --- |
| **GPT-6.1 Sol — Low** (`gpt-6.1-sol`, `low`) | Simple bounded analysis, clear/coherent result, identified paths, localized scope, no affected sensitive boundaries, understood contracts/evidence, no material unknown. Simple scoping only, never ordinary development. |
| **GPT-6.1 Sol — Medium** (`gpt-6.1-sol`, `medium`) | In-depth technical exploration or ordinary development; known localized reversible scope, identifiable contracts/tests, no actual sensitive-boundary or several-dependent-contract modification. Ordinary-development floor. |
| **GPT-6.1 Sol — High** (`gpt-6.1-sol`, `high`) | Floor when actually modifying a listed sensitive surface or when security-evidence obligations apply. Name guarantees, dependents and evidence affected. |
| **GPT-6.1 Sol — Extra high** (`gpt-6.1-sol`, `xhigh`) | Particularly difficult joint analysis of dependencies, negative scenarios, migrations, evidence or rollback. Explain concrete difficulty; surface presence alone is insufficient. |
| **GPT-6.1 Sol — Max** (`gpt-6.1-sol`, `max`) | Exception: precise difficulty needs more analysis than extra high. Name difficulty, expected gain and evidence needed to resolve it. |

Actually affected surfaces requiring at least High:

- Authentication, authorization, isolation; permissions, sessions, cookies and fail-closed controls.
- Data migration/transformation.
- RAG, vector databases, provenance or AI providers.
- Proxies, containers, runtime, CI or environment contracts.
- Several dependent contracts requiring joint verification.
- Applicable security-evidence obligations.

Authentication, sessions, RAG and providers are conditional triggers, not declared starter features. HTTP safeguards/server-client boundaries are concrete here; accounts remain conditional. Changing origin guards requires High; label corrections may be Medium after inspection. Jointly modifying Zod, SQL and forms requires High; merely renaming a documentation heading containing “migration” does not.

Coordinated Compose identity, volume selection, relocation/restoration could justify Extra high when compatibility/recovery scenarios are difficult to assess together. Document missing information before concluding. Never raise effort to compensate for missing product information/access/checks; resolve decisions/blocks under existing instructions.

## Using GPT-6 Astra

**GPT-6 Astra — High** (`gpt-6-astra`, `high`) or **Extra high** (`gpt-6-astra`, `xhigh`) can be recommended when architecture/security/migrations are strongly coupled **and** unresolved architectural uncertainty, observed Sol limitations or exceptional reasoning needs justify Astra.

Coupling alone is insufficient. Explain why Sol Extra high or, where relevant, Sol Max would not reasonably cover the need. Do not require additional Sol Max trials when observed limitations already justify Astra. Choose High/Extra high for concrete difficulty and expected benefit; effort/performance equivalence is not assumed.

**GPT-6 Astra — Max** (`gpt-6-astra`, `max`) is reserved for exceptional constraints beyond reasonable Extra-high handling. Name them and expected evidence. This policy claims no measured repository-specific superiority; general benchmarks do not establish equivalence or local results.

## Justification and reuse

Record in the useful work item/report:

- Expected result, exact scope and inspected version.
- Five dimensions, facts/complexity/unknowns and repository evidence.
- Actually affected surfaces/contracts, necessary checks/limits.
- Full model/effort; for higher configurations, expected benefit and justifying difficulty. Otherwise: “no increase justified”.

Reuse analysis while result, scope, contracts and unknowns remain unchanged. Editorial clarifications trigger no full reinspection. Reassess only dimensions affected by new evidence, then update justification. Material unknowns remain visible even in provisional recommendations. No token savings/performance guaranteed: neither short-line costs nor selected effort costs were measured here.

## Prior assistant choice

Apply [initial scoping](../agents/project-intake.md): conditional questions, conversational follow-ups and resumption from the brief/checkpoint. Do not ask which assistant is used; use its entry-point policy. Collect missing documentation languages at Q10 according to [Project languages](../agents/languages.md).

## Recommendation display and approval

Apply [request handling](../../AGENTS.md#traitement-des-demandes-et-validation-de-lexécution), the common collaboration authority. Informative answers are direct. New non-minor changes need a chat proposal without writes/execution, then approval. Clarification/necessary operations in approved scope do not repeatedly seek approval if scope, consequences and recommended configuration stay stable.

Track the **model + effort pair**:

- Initial recommendation/history unknown: display pair/reason before affected change execution and await approval.
- Unchanged pair: omit recommendation, including after questions. Non-minor changes still require proposal approval.
- Changed model/effort, up or down: announce new recommendation/reason before affected work and await approval.
- Minor change meeting all AGENTS criteria with unchanged pair: execute without prior message/approval, verify/briefly confirm. Pair changes remove the exception.

Format: **For the next step: GPT-6.1 Sol · Medium — localized visual change.** Display once in useful proposal/question, including native input tools; not under every grouped question. For information-only answers, recommend only when preparing concrete next work; do not require approval of the answer.

Users manually select configuration. Compare recommendations without claiming actual client selection or modification. Approval authorizes presented scope, not evidence of selector changes. Do not request second configuration confirmation after agreement.

After write authorization retain approved scope, last recommendation, reason and unknowns in useful tracking. Reuse in new conversations; if missing, give an initial recommendation without inventing history. Material assumptions/decisions remain subject to stop conditions even at higher effort.

### Expected behavior examples

| Request / state | Expected response |
| --- | --- |
| “Explain startup”, Codex already selected | Direct answer, no changes/approval. |
| New feature, unchanged known pair | Proposal/approval request, no repeated recommendation. |
| Local verified color change, unchanged pair | Change/check/brief confirmation, no preamble. |
| Same color with no known recommendation | Proposal/initial recommendation, await approval. |
| Small change requiring different pair | New recommendation, await approval before execution. |
| “Yes” to concrete proposal | Implement/check approved scope, no second approval. |
| Clarification within approved scope, unchanged pair | Continue without repeated recommendation/approval. |
| Material scope expansion, unchanged pair | New proposal/approval, no repeated recommendation. |

These examples are documentary criteria, not native assistant trials.

## User questions and comments

Apply the [common protocol](../agents/user-decisions.md) for useful decisions/optional supplementary instructions. Initial selection offers Codex (OpenAI) / Claude Code (Anthropic), no requested supplementary field. Mode options/comments neither select models nor approve execution without explicit expression. Preserve pair-display rules; the protocol triggers no repeated recommendations.
