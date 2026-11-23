---
name: update-project-docs
description: "Reconcile documents directly affected by verified changes, preserving one source per rule and keeping long evidence out of the current-state summary."
---

> Documentation translation. The canonical skill remains `skills/update-project-docs/SKILL.md`.

# update-project-docs

Inputs: change/version, actually executed results and affected references. Common contract: docs/agents/skill-contract.md.

## Work

Link actual behavior/contracts to specification, decision, procedure and evidence without copying every source. Apply the common contract: roadmap, tracking, decisions and reports belong to the target project. Do not write its tracking in the kit or parent; use links for explicitly authorized coordination. Do not turn assumptions, installation or file presence into human validation, compatibility or successful testing. Preserve archives and historical evidence.

## Output and checks

Change only useful documents, check links/commands/versions and status consistency; report Doc updated or justified No doc impact. Direct text corrections stay proportionate without unnecessary dossiers. Signal genuine conflicts and suspend dependent work under AGENTS; never silently rewrite the opposing authority.

## Automated design system — DS-AUTO-01

Apply the [current policy](../../docs/design-system/policy.md) and [source contract](../../src/design-system/authority/README.md). Three categories: primitives (raw values), component tokens and page-local tokens. The latter two reference primitives directly; a consumed primitive remains stable. Component appearance differences are explicit variants, never instance exceptions.

The assistant maintains sources, contracts, examples and descriptions within the mandate; scripts generate CSS, inventories and stories. After a change, run `npm run design-system:sync`, `npm run design-system:check` and appropriate checks. Never edit derived files. Reuse the registry and components before creating new ones; identify missing coverage. Storybook is exclusively documentary, with no writer or UI Lab. Generation needs no AI account. Preserve values, units, states, accessibility and historical sources during an explicitly authorized migration.

## Documentation portal

Maintain unique Markdown sources and their classification according to the [guide](../../docs/documentation.md). After changes, build and check the portal with `docs:build` and `docs:check`. Foundation histories stay outside the site and search; private files are excluded. Classify current project documents within their stage in the registry; do not hide them merely because they are in work-items/reviews folders. Present Application, Storybook and Documentation together after verification, without requiring the parent folder or host Python.

## Documentation language

Apply [initial scoping](../../docs/agents/project-intake.md): conditional questions, conversational follow-ups and resumption from the brief/checkpoint. Do not ask which assistant is used; use its entry-point policy. Collect missing documentation languages at Q10 according to [Project languages](../../docs/agents/languages.md).