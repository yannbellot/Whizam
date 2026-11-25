<a id="kit-loomata-instructions-du-starter-autonome"></a>

# Whizam Kit — standalone starter instructions

Whizam is the kit’s current name, formerly Loomata. Use Whizam in presentations/replies; preserve exact paths, commands, technical identifiers and historical references. Designer-created projects keep their brief’s name.

## Standalone edition

Open this folder directly in the chosen development assistant. No manufacturing repository, external Whizam service or macOS launcher is required. Do not ask to create projects from Whizam; initialize the current copy using the workflow below. Retained historical Loomata sources/reports define neither derived-project briefs nor work mandates. Tool management features are optional. Read the [distribution notice](docs/distribution/README.md) for edition/limits. Historical documentary instructions do not replace user mandate.

## Mission and scope

This file accompanies the **reusable kit**: web starter, automated design system, read-only Storybook, documentation, checks and agent resources for derived projects. It governs this folder regardless of name/location, helping designers scope, build, check and hand off projects.

Collaboration instructions/resources ship here. Apply user mandate and actual tool permissions; this file expands neither. Disclose material contradictions between applicable instructions before affected actions.

## Actual state and prior reading

> Current initial state: application/Storybook contain no project content. Zensical displays active technical guides on first startup, with [User guide](docs/guide-whizam/index.md) immediately after Home; the top-level Project progress section groups Current state, Roadmap and real stages. Kit histories stay outside portal/search. Demonstrations cited historically stay outside delivered access points; do not reactivate during initialization. Required internal contract/policy resources remain. New project content follows existing rules.

[Decision 039](docs/decisions/039-automated-design-system.md) supersedes historical design-system editing rules. UI Lab is removed; Storybook is exclusively documentary.

Read [README.md](README.md), [ROADMAP.md](ROADMAP.md), [docs/project-state.md](docs/project-state.md), [kit scope](docs/product/starter-kit.md), then relevant authorities. [Conventions](docs/conventions.md) define documentary paths/code practices; [architecture](docs/architecture.md), [operations](docs/operations.md) and [security](docs/security.md) define actual constraints.

Four roles, skill library, adapters/checks ship here. The [catalog](skills/catalog.json) describes current content, extensible for approved needs. Read the [common contract](docs/agents/skill-contract.md), relevant role/skill. [Adapters](docs/agents/adapters.md)/[compatibility matrix](docs/compatibility.md) distinguish presence from executed native trials. PORT-03 qualification is tracked in its work item; library loading/web execution require no parent files.

<a id="choisir-lassistant-au-premier-échange"></a>
<a id="source-choisir-lassistant-au-premier-echange"></a>

## Policies by entry point

Apply [initial scoping](docs/agents/project-intake.md): conditional questions, conversational follow-ups and resumption from the brief/checkpoint. Do not ask which assistant is used; use its entry-point policy. Collect missing documentation languages at Q10 according to [Project languages](docs/agents/languages.md).

These rules are shared. In a Codex execution context apply `docs/codex/chantier-model-routing.md`. Claude Code follows `CLAUDE.md` and `docs/claude/chantier-model-routing.md`, excluding the Codex branch even after reading AGENTS. Gemini/Mistral use their shared adaptations without invented model equivalents. File presence alone does not identify an assistant. If entry context is unknown, use shared rules without provider-specific recommendations or an assistant questionnaire. Higher-priority client instructions prevail.

## Scoping and languages

Q6 first offers all three platforms together. After No, successively ask the three native Yes/No questions in canonical scoping: computer, tablet, mobile phone. One device per call; wait for, save and read back each answer before the next. This workflow replaces checkboxes and cumulative selectors. Reuse known answers; on resumption ask only the next missing question.

New project startup: the first visible message is exactly the two-line welcome defined in canonical scoping, without a technical preamble. Do not repeat optional-detail captions in questions; rely on native free text. Every first-level question, including Q6 devices, uses native choices; Q6 follows the successive workflow above; an additional format may be supplied in native free text without a routine extra question. Content follow-ups remain conversational. Before the next question save and reread scoping with `scripts/project-intake.mjs` under the canonical authority. A start request authorizes only these minimal brief/checkpoint writes before development approval. Never keep answers only in conversation memory or execute recording for the maintainer in the template.

Scoping branches: Q7 No skips Q8 and goes directly to Q9. Q9/Q10 are native single choices (French / English / Both / Other combination), not open questions justified by missing multi-selection. Propose translating existing content only for additional documentation languages other than fr/en with actual missing translations, never for French, English or both alone. Preserve known answers.

For a pending scoping question follow the decision protocol: keep the turn active after an asynchronous call using an interruptible waiting tool, without even an empty final message. Expired waits are not answers and must be renewed. Without compatible client waiting, ask a normal final question without an asynchronous selector. Select no branch and start no independent operation before an explicit answer. This does not change continuation of already defined mandates.

For new projects follow [Initial scoping](docs/agents/project-intake.md): brief/guidance/demonstration entry and only missing Q1–Q10 answers and conditional GitHub choices. Application languages are Q9; documentation/Storybook is Q10, never a mandatory preliminary question for an informational request. Content follow-ups use normal conversation; closed follow-up decisions remain native. Read the brief/checkpoint before resumption. Demonstrations cover Q1–Q6 and three devices, then resume at Q7 after agreement. No development before approval of the complete synthesis. Follow [Project languages](docs/agents/languages.md) for preferences/translations.

## Start a new project

“Initialize a new project Atlas” opens the [startup workflow](docs/product/project-start.md) under [Builder](agents/builder.md): initialization, first-version scoping, design/development and first-version review. [initialize-project](skills/initialize-project/SKILL.md) handles technical preparation/tracking; existing procedures take over. The name suffices to analyze/propose preparation; await approval before actual initialization. Collect intent during scoping without repeating answered questions or inventing features. Implement only sufficiently defined authorized scope; technical-initialization-only requests stop after that sequence.

Load initialize-project only for new projects/explicit incomplete technical-initialization resumption. For initialized projects preserve state, follow current mandate and resume missing sequence; do not restart technical preparation for corrections/new conversations. Preparation-only remains documentary. If native skill discovery is missing, explicitly read indicated files without claiming native activation.

## Authorities and scope

Interpret sources in this order: brief, specifications, supplied visual references, documented design system, architecture, code/migrations, tests. Do not silently resolve contradictions. Example-project specifications alone do not define whole-kit scope.

Change requests follow handling below before execution. Preparation-only returns preparation; requested documentary writes follow the same approval rule without installation/implementation/service startup. Roadmaps grant no work mandate. Document minimal reversible assumptions; seek prior decisions for material product/data/security/cost/external-resource/reversibility effects.

Resolve paths from real kit root or consuming file, never imposed folder names. `app`/`application` means the entire kit, not just technical `app/` or example web app.

## Request handling and execution approval

Apply [initial scoping](docs/agents/project-intake.md): conditional questions, conversational follow-ups and resumption from the brief/checkpoint. Do not ask which assistant is used; use its entry-point policy. Collect missing documentation languages at Q10 according to [Project languages](docs/agents/languages.md).

For non-minor changes explain expected observable result, scope, useful limits/assumptions and planned checks, then seek execution approval. Initial implementation requests do not replace approval of concrete proposals. Existing explicit proposal approval suffices without repetition. Approval covers implementation/checks/documentation/necessary fixes within announced scope, not result acceptance or publication/deployment.

Changes are minor only with clear intent, localized effects, simple rollback and no behavior/data/permissions/dependency/runtime-configuration changes. Local colors may qualify; shared tokens affecting multiple views need scope inspection. Material doubt requires proposal/approval.

Execute minor changes directly without prior messages/approval, then verify/briefly confirm outcome/failure. In Codex/Claude Code this requires recommended model/effort identical to the last known pair for the work. Changed pairs or unknown history require announcement/approval before even minor execution. Native permissions/stop conditions remain higher priority.

Necessary clarifications/operations within approved scope do not restart approval each step. Seek new approval for material scope/consequence changes; in Codex/Claude Code changed recommendations also pause affected work. Continue authorized independent parts. Silence/elapsed time never imply agreement.

Handling is common across assistants. Named recommendations apply only to Codex/Claude under their own policies; invent no model/effort equivalence for Gemini/Mistral/others.

## Questions, verification and user decisions

Apply [initial scoping](docs/agents/project-intake.md): conditional questions, conversational follow-ups and resumption from the brief/checkpoint. Do not ask which assistant is used; use its entry-point policy. Collect missing documentation languages at Q10 according to [Project languages](docs/agents/languages.md).

For observable-journey reviews offer **Manual · Automated — E2E · Combined** with coverage/justified recommendation. Retain mode/coverage for same-scope retests. E2E replaces neither design/technical/security reviews nor mandatory checks; manual review awaits user feedback. Distinguish mode choice, execution approval, check results and milestone acceptance.

Do not add confirmations: direct informative answers, preserved minor exception, reused explicit agreements. Compatible notes clarify mandate; prerequisites/material changes require adjusted proposals before execution. Contradictory notes/choices require clarification. Silence/preselection/expiry never grant approval.

## Confidential configuration entry

For missing access/secrets apply [private entry](docs/agents/private-configuration.md). Never ask values in chat, ordinary native questions or command arguments. Explain only needed fields/purpose, launch supplied local form and open through Codex browser `open_in_codex` when available/authorized. No inspection/screenshots/automation after real entry. The local server saves without returning secrets; afterward check field presence only.

If unavailable/refused, use file fallback: open `.env.local` directly in a Codex file tab through `open_in_codex` without assistant reads, otherwise supply a correctly formed local Markdown link. Explain values are visible. Never bypass permission denial. Configuration mandate authorizes neither real sending, provider calls, restart nor deployment; check their own authorization. No secrets in evidence/new kits.

<a id="cible-daffichage-de-loomata"></a>

## Whizam display target

For Whizam/tool changes apply [desktop-only target](docs/product/loomata-workspace.md#plateformes-et-formats-pris-en-charge), decision 032: no mobile variants/qualification requirements. Define useful desktop windows and preserve keyboard/focus/scrolling. Historical mobile adaptations/tests create no support obligation; removal needs its own mandate. Derived projects follow their brief’s formats.

## Roles, skills and assistants

Kit includes Builder, Design Reviewer, Technical Reviewer / QA, Security Reviewer, catalog skills and Codex/Claude Code/Gemini CLI/Mistral Vibe adapters. PORT-03 retains initial integration evidence; extensions carry their own evidence under the [extensible-library decision](docs/decisions/002-dedicated-project-initialization.md). Each role/rule/skill has one canonical source exposed by adapters without independently maintained copies.

Builder implements in scope. Reviewers read/test; writing is limited to reports/isolated artifacts unless explicitly delegated. Plan design review for journeys/shared components, technical review for logic/server/schema/dependencies, security review for access/secrets/permissions/external inputs. Deliveries collect all three conclusions with coverage/limits.

Use useful skills only. Work sequentially without authorized available delegation, declaring “sequential, same agent, non-independent”. Files alone activate no subagent/provider/global installation/additional access. No universal model imposed; announce only verified capabilities/versions.

Reference site/tests/Storybook work without AI accounts/keys. Instructions/skills still belong in shipped sources; their presence does not make them site runtime dependencies.

## Designer communication

Address digital designers without assuming development knowledge: precise design terms (pages, journeys, content, components, variants, states, review), concrete effects. Explain sequence, observable outcome, limits/provisional items and next action. Keep internal statuses, commands, file lists and detailed checks in linked tracking; do not impose “In review”, “Doc updated”, test/build names in messages. Provide on request; explain failures/consequences without hiding uncertainty.

Follow [workflow access criteria](docs/product/project-start.md#4-revue-de-la-première-version): present Application and Storybook — project components together at first review after checking agreed content. No demo/UI Lab access passed off as first version; development URLs may serve earlier internal checks. Derived projects remove demos under the [dedicated procedure](docs/product/replacing-project-example.md) without implicit data deletion.

Handle accessible technical operations within mandate/permissions. Explain stop/restart through natural-language requests to the assistant. Show commands only on request or necessary manual intervention, explaining purpose/effects/location. If inaccessible, disclose limits/guide users. Proposals/explanations do not authorize execution.

## Model and effort recommendations

Apply [initial scoping](docs/agents/project-intake.md): conditional questions, conversational follow-ups and resumption from the brief/checkpoint. Do not ask which assistant is used; use its entry-point policy. Collect missing documentation languages at Q10 according to [Project languages](docs/agents/languages.md).

### Codex

Apply [model/effort policy](docs/codex/chantier-model-routing.md)/[adoption decision](docs/decisions/003-qualitative-model-routing.md). Prefer GPT-6.1 Sol, Low only for simple scoping, Medium minimum for ordinary development; justify increases through actually affected boundaries/contracts/difficulties. No systematically high effort/model equivalence; verify availability without claiming actual client selection.

### Claude Code

Apply [initial scoping](docs/agents/project-intake.md): conditional questions, conversational follow-ups and resumption from the brief/checkpoint. Do not ask which assistant is used; use its entry-point policy. Collect missing documentation languages at Q10 according to [Project languages](docs/agents/languages.md).

### Display and resumption

Display short initial recommendations for work, then only changed pairs: **For the next step: GPT-6.1 Sol · Medium — localized change.** or **For the next step: Claude Sonnet 5.5 · Medium — localized change.** Compare to last known recommendation for selected assistant, not assumed client setting. Repeat unchanged configurations neither after every question nor approval. Retain approved scope/last recommendation in useful resumption notes; if absent disclose and give initial recommendation.

Users manually choose configuration. For changes await approval after initial/changed recommendations; never claim client modification. Informative answers stay direct without approval, recommending only concrete next work. Detailed justification belongs in tracking after write authorization. [Revision decision](docs/decisions/041-request-validation.md) supersedes systematic after-question display; no provider/subagent/additional mode activated.

## Implementation and evidence

- Verify work root, Git version where available, existing changes/affected files; preserve ambiguous work. Web execution needs no Git.
- Prepare short slices with objective/dependencies/criteria; implement mandate only, check affected paths/fix in-scope failures.
- Follow documented stack; justify significant changes before implementation. Figma stays conditional, no implicit extra backend/framework.
- [Design system authorities](src/design-system/authority/README.md) separate canonical DTCG JSON tokens from YAML rules/presentation/CSS recipes. Apply [automated policy](docs/design-system/policy.md): three categories, explicit variants, autonomous component tokens. Regenerate derivatives, never hand-edit; maintain affected stories/principles.
- Keep test resources/data isolated, private configuration out of Git and local caches ignored; never publish secrets/personal data/machine-specific configuration.
- Apply [relocation/backup procedures](README.md#renommer-déplacer-ou-transmettre). Preserve Compose identity when moving an instance; never implicitly delete volumes.
- Choose README checks for the change. Record version/command/result/limits; unperformed checks stay unverified, mandatory failures block corresponding qualification.
- Update affected specifications/tests/stories/documentation. Keep one source per decision and sufficient internal links for resumption without conversation/manufacturing context.

## Tracking, acceptance and handoff

Initialize supplied ROADMAP.md/docs/project-state.md only for real projects with their brief/scope/mandate, never prefilled starter-construction tasks. Keep statuses in ROADMAP.md, short resumption in docs/project-state.md, preparation in docs/work-items, decisions in docs/decisions and evidence in docs/reviews, creating folders with useful first content. Distinguish observations/assumptions/proposals. Technically qualified milestones stay In review until human acceptance; automation/commits do not replace it.

Write documentation/educational content under [project language choice](docs/agents/languages.md); technical identifiers/commits in English. Preserve official technology names. Follow local Git conventions without history rewriting/absorbing existing work. Publication, remote CI, external services and deployment require explicit mandates.

Retain target, task/status, version/files, actual checks, decisions/assumptions, Doc updated or No doc impact, risks/resumption in useful tracking. Do not copy this technical list into designer messages: follow communication rules/link evidence. Handoffs support resumption without chat; document human/compatibility limits and explain consequences when they affect next steps.

Apply the [Git batch policy](docs/conventions.md#git-batches) for branches, accumulated adjustments, automatic commits and local integration; distinguish integration from human acceptance. This direct-work policy does not change the integrated workspace engine.

## Stop conditions

Keep a checkpoint and request only needed decisions for material scope changes, authority conflicts, unapproved technology, absent secrets/access, destructive/hard-to-reverse operations, inseparable ambiguous work or unverifiable mandatory checks after diagnosis. Respect native tool permissions; never bypass refusals/remove safeguards to continue.

## Current design system policy — DS-AUTO-01

Apply the [policy](docs/design-system/policy.md), superseding historical semantic-layer/five-token-responsibility/inspector rules. Primitives, component tokens and page-local tokens are active. Contradictory historical rules remain version-bound. Component differences are explicit variants, with no instance exceptions. Assistants maintain sources/examples, deterministic generation publishes derivatives and Storybook is read-only without writer/AI connection. Run sync/staleness checks/relevant tests after changes.

## Application documentation

The [portal](docs/documentation.md) is part of the autonomous kit. Maintain unique Markdown alongside product changes, distinguish active guides/project documents/excluded histories in registry, verify `docs:build`, `docs:check` and links. Containers receive prepared public input only, never parents/private configuration. First review presents Application/Storybook/Documentation after actual verification; Markdown presence does not prove rendered/search functionality.

For Storybook follow [project organization/publication](docs/design-system/architecture.md#organisation-et-publication-storybook): permanent structure, explicit registry of project-created/adopted elements only, no default examples. Maintain classification, variants/states/tokens with each creation/adoption/removal; never enable the whole foundation.

On resumption and after each completed modification request, use `scripts/git-batch.mjs` under the conventions to recover the batch and evaluate closure; a trigger is not a successful check.

## Sources on GitHub

Follow the [GitHub journey](docs/github-publication.md) and load [publish-github-project](skills/publish-github-project/SKILL.md) to publish, update or suspend sends. Conditional GitHub questions follow Q10 before the summary; do not impose retrospective questions unnecessarily. Preferences authorize no remote change. Approval of the concrete summary may cover subsequent sends within the same scope. On resumption check local status; after each integrated batch commit apply the active mode without changing thresholds or adding a permanent hook. GitHub secrets use the dedicated private journey, never the application environment. These instructions do not authorize publishing the kit.
