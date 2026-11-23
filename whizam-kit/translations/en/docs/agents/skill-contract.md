# Common role and skill contract

Procedure, role and adapter paths start from the **real kit root**, containing AGENTS.md, even when loaded through symlinks. All required references are internal. Read [kit instructions](../../AGENTS.md) and only mission-relevant authorities; no mandatory whole-library sequence.

## Source root and mission scope

Distinguish loaded-library root from mandate-target project root. In standalone use they normally coincide. Other projects using this library supply their own instructions/authorities; this does not authorize kit modification. Deliverables, commands, roadmap, state, decisions and evidence belong to the target project. Procedure paths alone authorize no parent writes.

[Conventions](../conventions.md) define internal tracking. [Kit scope](../product/starter-kit.md) describes the whole starter; the projects brief describes only its example. For explicit multi-root mandates, announce each root and distribute deliverables without duplication. Folder names are not environment identifiers.

## Mission inputs

Apply [initial scoping](project-intake.md): conditional questions, conversational follow-ups and resumption from the brief/checkpoint. Do not ask which assistant is used; use its entry-point policy. Collect missing documentation languages at Q10 according to [Project languages](languages.md).

User goal, project root, task/brief/specification reference, scope/exclusions, version/diff, actual available tools and expected result. For missing items choose a limited reversible assumption within mandate; material consequences follow AGENTS stop conditions. Analysis/preparation alone authorizes no implementation. [Request handling](../../AGENTS.md#traitement-des-demandes-et-validation-de-lexécution) precedes all writes, including documentation, and procedure execution: unapproved proposals stay in chat. Skill instructions do not waive approval; already covered operations/fixes need not request it again.

Apply [initial scoping](project-intake.md): conditional questions, conversational follow-ups and resumption from the brief/checkpoint. Do not ask which assistant is used; use its entry-point policy. Collect missing documentation languages at Q10 according to [Project languages](languages.md).

## Execution and evidence

The Builder selects skills, implements changes and completes technical checks. Reviewers read/test and edit only reports/isolated artifacts unless explicitly delegated. Every test identifies its fictional target/limits. State unavailable tools/unexecuted checks; never invent screenshots, Figma, results, persistence or compatibility.

Use native mode only if available/authorized; otherwise one role at a time in the thread, declaring **sequential, same agent, non-independent**. Reviewer application changes do not validate their own fixes. Subagents, models, external resources and publication retain existing authorization requirements; no implicit provider, global setting or additional permission.

Active guides are available from first Zensical startup. `config/documentation/catalog.json` separates guides (`guide`), project documents (`project`) and unpublished histories (`history`). Designer documentation contains Project progress with Current state, Roadmap and real stages; Technical documentation contains specialist references. The [User guide](../guide-whizam/index.md), first section after Home and before Designer/Technical documentation, explains the learning workflow without duplicating authorities/tracking. Classify new documents/stages under the [documentation guide](../documentation.md). Do not restore an empty portal or publish kit histories. Private files and outside-kit paths remain excluded.

## Common output

Technical tracking/reports retain project/root, reference/version and role, observation/assumption/proposal, result/deliverable, commands/findings/limits, classified issues (blocking or justified reservation), affected documentation and next action. Reviews conclude satisfactory / with reservations / blocking, with retest needs. Reuse existing useful work items/evidence rather than systematically creating one report per skill.

Designer messages follow [AGENTS communication](../../AGENTS.md#communication-avec-le-designer) without copying this technical format. At startup, the Builder follows [workflow](../product/project-start.md) sequences/criteria; successful environment checks do not prove a first version was built. Explain failures/limits that affect next steps.

Statuses/evidence belong to the change owner. Current tracking links version, block and next slice. [Practice references](practice-history.md) describe dated legacy/local procedures; they are neither destinations for new work nor new human acceptance.

## Library validation

From the kit root after npm ci: `npm run validate:agent-kit` or `node scripts/validate-agent-kit.mjs`. Checks cover catalog-declared completeness, canonical sources, declared required resources, frontmatter and internal adapters. Expected counts describe the current delivery without a universal ceiling; extensions update catalog/exposures under [decision 002](../decisions/002-dedicated-project-initialization.md). `--partial` is for incomplete construction only and does not qualify a full catalog. Structural validation proves neither effectiveness nor native discovery; follow [adapters](adapters.md) and [matrix](../compatibility.md) for actual trials.

## Documentation language

Apply [initial scoping](project-intake.md): conditional questions, conversational follow-ups and resumption from the brief/checkpoint. Do not ask which assistant is used; use its entry-point policy. Collect missing documentation languages at Q10 according to [Project languages](languages.md).

Scoping exception: an explicit start request immediately authorizes minimal answer/welcome recording, without technical initialization or development. Use the save-and-reread helper before every next question under [canonical scoping](project-intake.md). This grants no other authorization.
