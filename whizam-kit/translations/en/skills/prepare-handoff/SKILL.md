---
name: prepare-handoff
description: "Prepare a third-party handoff with repository, prerequisites, decisions, evidence and limits, without conversation history."
---

> Documentation translation. The canonical skill remains `skills/prepare-handoff/SKILL.md`.

# prepare-handoff

Inputs: delivered version, current state, README/operations, criteria and debt. Read docs/agents/skill-contract.md and the project’s resumption procedure.

## Work and output

Identify what enables installation, startup, modification and verification of a small change using files alone. Gather version, architecture, data/migrations, journeys, procedures, limits, simulations and untested points. A technical check by the Builder who knows the project does not replace a trial by an outsider.

Prepare a concrete exercise, expected results, commands and feedback format; collect observed obstacles and correct relevant documentation. Deliver docs/handoff.md or equivalent with debt, decisions and next action, distinguishing prototype/MVP/pilot. No human PASS, global compatibility or final acceptance is inferred from automation. Publication/licenses remain separate decisions under AGENTS.

## Automated design system — DS-AUTO-01

Apply the [current policy](../../docs/design-system/policy.md) and [source contract](../../src/design-system/authority/README.md). Three categories: primitives (raw values), component tokens and page-local tokens. The latter two reference primitives directly; a consumed primitive remains stable. Component appearance differences are explicit variants, never instance exceptions.

The assistant maintains sources, contracts, examples and descriptions within the mandate; scripts generate CSS, inventories and stories. After a change, run `npm run design-system:sync`, `npm run design-system:check` and appropriate checks. Never edit derived files. Reuse the registry and components before creating new ones; identify missing coverage. Storybook is exclusively documentary, with no writer or UI Lab. Generation needs no AI account. Preserve values, units, states, accessibility and historical sources during an explicitly authorized migration.

## Documentation portal

Maintain unique Markdown sources and their classification according to the [guide](../../docs/documentation.md). After changes, build and check the portal with `docs:build` and `docs:check`. Foundation archives remain identified and private files excluded. Present Application, Storybook and Documentation together after verification, without requiring the parent folder or host Python.
