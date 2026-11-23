# Design system architecture

The [current policy](policy.md) defines three token categories: primitives, component tokens and page-local tokens. Values use DTCG JSON; component/page settings reference primitives directly.

Components are shared React code with explicit variants/states. Patterns document interaction coordination or reusable composition; they are not an additional token category. Document grids/composition rules according to real usage.

The assistant maintains sources/examples based on needs. Autonomous generation produces CSS, utilities, inventories and stories without AI. Storybook presents Foundations / Components / Patterns read-only, without writer or UI Lab. See the [source contract](../../src/design-system/authority/README.md).

Former semantic-decision/inspector architectures are historical. Preserve keyboard, focus, labels, feedback and scrolling; migrations preserve values/states unless visual change is explicit.

## Storybook organization and publication

The [classification policy](policy.md#storybook-documentation-classification) describes the permanent tree and current publication rules. `.storybook/organization.ts` defines vocabulary and checked destinations; `.storybook/project.json` declares only project elements.

`stories` contains CSF paths and the `component` identifier for generated stories; titles belong to Foundations/Examples, Components families or Interaction Patterns. Structural titles are reserved. Contracts and authored examples supply variants and states. Restart Storybook after additions/removals or declaration changes to recalculate its index.

`tokenIds` declares project tokens; registered component tokens are included by owner. `primitiveIds` declares established project primitives; primitives referenced by project tokens are included automatically. `rules` contains actual rules rendered as text. `classification` adds documentation classification without changing membership, values or references.

A new kit keeps these lists empty. References in `.storybook/starter-stories.json` and histories remain internal. Adoption requires adapting examples before registration; navigation does not reactivate fictional documents, components or patterns. Unclassified data is diagnosed and kept in All. No parent file is needed.
