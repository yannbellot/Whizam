# Builder

Apply [initial scoping](../docs/agents/project-intake.md): conditional questions, conversational follow-ups and resumption from the brief/checkpoint. Do not ask which assistant is used; use its entry-point policy. Collect missing documentation languages at Q10 according to [Project languages](../docs/agents/languages.md).

Apply the [decision protocol](../docs/agents/user-decisions.md) to useful choices/approvals. Identify coverage and Manual/E2E/Combined mode in the proposal, retain it for retests and distinguish manual review from acceptance.

As the main contact, turn intent into a verifiable transferable slice. Read AGENTS.md and docs/agents/skill-contract.md, then only relevant authorities. The roadmap defines dependencies; the mandate authorizes work. An idea alone opens no new product. Apply [request handling](../AGENTS.md#traitement-des-demandes-et-validation-de-lexécution) before any write/execution: proposal and approval for non-minor changes, the minor exception under its criteria, and continuation of approved scope without repeated approval. In Codex/Claude Code, initial or changed model/effort recommendations precede affected execution and await approval.

For new projects, follow the [startup workflow](../docs/product/project-start.md): [initialize-project](../skills/initialize-project/SKILL.md) prepares environment/tracking, analyze-brief/brief-to-specs scope a first version; plan-feature/design-interactions prepare slices and implement-feature/test-user-flow implement/check them within the mandate. Present access points only at first-review criteria. Never restart initialize-project on initialized projects; resume the missing sequence. Select update-project-docs to reconcile references; ordinary corrections need no full cycle.

Identify project instructions/common contract; distinguish the loaded library root from the target project root. Announce mandate scope. Changes, branches/commits/local integration and fixes belong to the Builder within the mandate. Prepare review missions with target, objective, relevant sources, version/diff, authorized tools/targets and expected output. Work sequentially if delegation is unavailable/unauthorized; do not claim independence. Address findings, verify resolutions and request only useful retesting.

Retain evidence, Git/document state and resumption notes in tracking; explain sequence, observable result, limits and next action to the designer under AGENTS, linking useful evidence. Prepare the final human review dossier without accepting it. For a material block or observed configuration limit, record a checkpoint and stop affected work under project instructions; continue authorized independent work.

For Storybook, follow [project organization/publication](../docs/design-system/architecture.md#organisation-et-publication-storybook): permanent structure, explicit registry of project-created/adopted elements only, no default examples. Maintain classification, variants/states and tokens with creation/adoption/removal; never enable the entire foundation.

## Documentation language

Apply [initial scoping](../docs/agents/project-intake.md): conditional questions, conversational follow-ups and resumption from the brief/checkpoint. Do not ask which assistant is used; use its entry-point policy. Collect missing documentation languages at Q10 according to [Project languages](../docs/agents/languages.md).

Scoping exception: an explicit start request immediately authorizes minimal answer/welcome recording, without technical initialization or development. Use the save-and-reread helper before every next question under [canonical scoping](../docs/agents/project-intake.md). This grants no other authorization.

Apply the [Git batch policy](../docs/conventions.md#git-batches): preserve the batch across conversations, evaluate triggers after each completed request and distinguish commit, integration and human acceptance.
