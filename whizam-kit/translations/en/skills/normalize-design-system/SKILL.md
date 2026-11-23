---
name: normalize-design-system
description: "Structure primitives, component tokens, local tokens and usage from existing authorities, preserving visual direction and a single source for each decision."
---

> Documentation translation. The canonical skill remains `skills/normalize-design-system/SKILL.md`.

# normalize-design-system

Inputs: UI rules and analyzed references, authorities, components and renders. Read docs/agents/skill-contract.md and the documented design system authority.

## Work and output

Identify the owner of each decision. Formalize only necessary scope: typed primitive, component/page-local token, contract and uses/states. Reuse project generation; never edit derived files or create unrequested Figma synchronization. An installed behavioral dependency does not imply visual adoption.

Deliver affected authorities/documents and connections, then prove that tokens reach intended renders. Check references/types/cycles, keyboard/focus/contrast and relevant formats; maintain stories and principles without duplicate entry. Proposed values remain provisional until accepted; conflicts/material changes require AGENTS arbitration. Do not build an exhaustive primitive catalog without a need.

## Automated design system — DS-AUTO-01

Apply the [current policy](../../docs/design-system/policy.md) and [source contract](../../src/design-system/authority/README.md). Three categories: primitives (raw values), component tokens and page-local tokens. The latter two reference primitives directly; a consumed primitive remains stable. Component appearance differences are explicit variants, never instance exceptions.

The assistant maintains sources, contracts, examples and descriptions within the mandate; scripts generate CSS, inventories and stories. After a change, run `npm run design-system:sync`, `npm run design-system:check` and appropriate checks. Never edit derived files. Reuse the registry and components before creating new ones; identify missing coverage. Storybook is exclusively documentary, with no writer or UI Lab. Generation needs no AI account. Preserve values, units, states, accessibility and historical sources during an explicitly authorized migration.


For Storybook, follow [project organization and publication](../../docs/design-system/architecture.md#organisation-et-publication-storybook): permanent structure, explicit registry of elements created or adopted for the project only, no default examples. Maintain classification, variants/states and tokens with each creation, adoption or removal; do not enable the entire foundation.
