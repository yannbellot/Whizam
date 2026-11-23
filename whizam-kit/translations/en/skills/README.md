# Common skill library

Each folder contains its canonical SKILL.md in Agent Skills format. [catalog.json](catalog.json) indexes responsibilities, sources, required resources and the [four roles](../agents/builder.md). The library can grow with approved needs; its declared count checks completeness of the current delivery without imposing a maximum. All required sources, adapters and references are inside the kit regardless of its name/location.

Read only the useful skill and [common contract](../docs/agents/skill-contract.md). The Builder chooses proportionate procedures; small tasks do not require the entire library or four parallel processes. Reviewers retain read/test/report scope; files grant no permissions.

“Initialize a new project [name]” opens the [startup workflow](../docs/product/project-start.md). Load [initialize-project](initialize-project/SKILL.md) only for its technical sequence/resumption; the environment reference remains conditional and existing scripts remain execution authorities. The Builder then hands scoping to analyze-brief/brief-to-specs, slices to [plan-feature](plan-feature/SKILL.md), and implementation/verification to relevant procedures within the mandate. No new skill or systematic cycle for a correction. [Decision 002](../docs/decisions/002-dedicated-project-initialization.md) preserves that separation; [decision 004](../docs/decisions/004-guided-project-start.md) defines the workflow.

From the root after npm ci: `npm run validate:agent-kit`. [Adapters](../docs/agents/adapters.md), the [matrix](../docs/compatibility.md) and [selected practice history](../docs/agents/practice-history.md) distinguish structure, discovery and actually tested behavior. No return to the manufacturing project is required.
