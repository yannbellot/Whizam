# Design system architecture

The design system connects DTCG JSON values and references, React components and their examples. The [policy](policy.md) defines three token categories: primitives, component tokens and page-local tokens. Component and page settings reference primitives directly.

Shared components declare their variants and states. Patterns describe interaction coordination or reusable composition without being another token category. Grids and composition rules are documented for their actual uses.

The assistant maintains sources and examples; generation produces CSS, utilities, inventories and stories without AI. Storybook presents Foundations / Components / Patterns for consultation. Canonical sources are described in `src/design-system/authority/README.md`. Changes preserve keyboard, focus, labels, feedback and scrolling; migrations preserve values and states unless a visual change is explicit.

## Storybook organization and publication

Publication has three separate steps: generate stories from contracts and examples; select project elements in `.storybook/project.json`; classify selected elements with `classification`. Classification selects no elements and changes no values. A selected token without classification remains visible in All with a diagnostic.

The [classification policy](policy.md#storybook-documentation-classification) describes the permanent tree and current publication rules. `.storybook/organization.ts` defines vocabulary and checked destinations; `.storybook/project.json` declares only project elements.

`stories` contains CSF paths and the `component` identifier for generated stories; titles belong to Foundations/Examples, Components families or Interaction Patterns. Structural titles are reserved. Contracts and authored examples supply variants and states. Restart Storybook after additions/removals or declaration changes to recalculate its index.

`tokenIds` declares project tokens; registered component tokens are included by owner. `primitiveIds` declares established project primitives; primitives referenced by project tokens are included automatically. `rules` contains actual rules rendered as text. `classification` adds documentation classification without changing membership, values or references.

A new kit keeps these lists empty. References in `.storybook/starter-stories.json` and histories remain internal. Adoption requires adapting examples before registration; navigation does not reactivate fictional documents, components or patterns. Unclassified data is diagnosed and kept in All. No parent file is needed.
