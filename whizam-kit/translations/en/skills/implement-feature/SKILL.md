---
name: implement-feature
description: "Implement an explicitly authorized slice in code, tests, stories and documents; distinguish prototypes from complete functionality."
---

> Documentation translation. The canonical skill remains `skills/implement-feature/SKILL.md`.

# implement-feature

Inputs: mandate, work item/specification, Git preflight and test targets. Common contract: docs/agents/skill-contract.md.

## Work

Follow existing boundaries: coordinating routes, isolated business/server access, shared components without secrets/DB, runtime validation before writes. Keep the diff limited; generate, review and version migrations without silently replacing applied migrations. Synchronize affected tests/stories and fix failures within scope. Use documented scripts rather than divergent commands.

For a derived project’s first version, follow the [startup workflow](../../docs/product/project-start.md#3-conception-et-développement) and [example replacement procedure](../../docs/product/replacing-project-example.md). Implement agreed pages/journeys, remove demonstration entries from navigation and delivered access points, and synchronize affected stories/tests. Do not infer that `/projects` must be retained; protect existing data and do not fabricate missing user content.

Prototype mode: retain an explicit list of simulations, fictional data and unimplemented paths; fixtures or browser storage do not prove PostgreSQL behavior. Clean only identified disposable resources created for the task.

## Output and checks

A concrete diff and evidence for criteria, applicable reviews, documentation/Git state and reservations. A failed mandatory check is not technical acceptance to pass to the user. Publication and material effects follow AGENTS; this skill does not authorize them. Identify a checkpoint if work can no longer continue safely.

## Automated design system — DS-AUTO-01

Apply the [current policy](../../docs/design-system/policy.md) and [source contract](../../src/design-system/authority/README.md). Three categories: primitives (raw values), component tokens and page-local tokens. The latter two reference primitives directly; a consumed primitive remains stable. Component appearance differences are explicit variants, never instance exceptions.

The assistant maintains sources, contracts, examples and descriptions within the mandate; scripts generate CSS, inventories and stories. After a change, run `npm run design-system:sync`, `npm run design-system:check` and appropriate checks. Never edit derived files. Reuse the registry and components before creating new ones; identify missing coverage. Storybook is exclusively documentary, with no writer or UI Lab. Generation needs no AI account. Preserve values, units, states, accessibility and historical sources during an explicitly authorized migration.


For Storybook, follow [project organization and publication](../../docs/design-system/architecture.md#organisation-et-publication-storybook): permanent structure, explicit registry of elements created or adopted for the project only, no default examples. Maintain classification, variants/states and tokens with each creation, adoption or removal; do not enable the entire foundation.

## Documentation language

Apply [initial scoping](../../docs/agents/project-intake.md): conditional questions, conversational follow-ups and resumption from the brief/checkpoint. Do not ask which assistant is used; use its entry-point policy. Collect missing documentation languages at Q10 according to [Project languages](../../docs/agents/languages.md).