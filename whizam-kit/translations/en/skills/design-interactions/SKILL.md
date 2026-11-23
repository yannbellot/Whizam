---
name: design-interactions
description: "Define UI journeys and transitions including validation, loading, cancellation, errors and recovery, without inventing visual references."
---

> Documentation translation. The canonical skill remains `skills/design-interactions/SKILL.md`.

# design-interactions

Inputs: specification, available components/states and supplied references. Common contract: docs/agents/skill-contract.md.

## Work

Connect each action to a state change and observable feedback; plan focus/keyboard behavior, field-linked errors, preserved input, cancellation and recovery where relevant. Choose existing components before new complex behavior. Distinguish navigation (link) from action (button); a loading story is not a real server action.

## Output and checks

Add interactions/states to the specification and identify stories/journeys to check at selected formats. Check labels, refusals and absence of false success; do not claim to test a design that remains a drawing. Record reversible visual assumptions for review; authority conflicts or material effects require the prescribed decision. This skill authorizes neither implicit library adoption nor data modification.

## Automated design system — DS-AUTO-01

Apply the [current policy](../../docs/design-system/policy.md) and [source contract](../../src/design-system/authority/README.md). Three categories: primitives (raw values), component tokens and page-local tokens. The latter two reference primitives directly; a consumed primitive remains stable. Component appearance differences are explicit variants, never instance exceptions.

The assistant maintains sources, contracts, examples and descriptions within the mandate; scripts generate CSS, inventories and stories. After a change, run `npm run design-system:sync`, `npm run design-system:check` and appropriate checks. Never edit derived files. Reuse the registry and components before creating new ones; identify missing coverage. Storybook is exclusively documentary, with no writer or UI Lab. Generation needs no AI account. Preserve values, units, states, accessibility and historical sources during an explicitly authorized migration.
