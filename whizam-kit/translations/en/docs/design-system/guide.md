# Understand and evolve the design system

The design system connects visual values, React components and their examples. Follow a change from project sources through generation to the application and Storybook. The [policy](policy.md) defines the rules; the [architecture](architecture.md) describes files and publication.

## Tokens and naming

A primitive holds a typed raw value. A component token describes a use with an owner, variant, part and state. A local token describes a page composition. The latter two directly reference a compatible primitive. For example, `component.button.default.root.background.default` references `primitive.color.hex-1d4ed8`.

A consumed primitive remains stable. To change one use, create or reuse a primitive and retarget only the relevant token in `src/design-system/authority/tokens.tokens.json`. A shared color change requires identifying every use to change. A different component appearance becomes an explicit variant.

## Example: change a button background

Ask: “Change the default button background while preserving hover and focus.” The assistant identifies the token above and its consumers, reuses a compatible primitive or creates one, then changes its reference. It preserves other states and checks readability, contrast and keyboard behavior. The generator’s `ensurePrimitive` and `retargetToken` functions can prepare this change in memory; saving the authority remains explicit.

From the kit root:

```bash
npm run design-system:sync
npm run design-system:check
npm run test:design-system
npm run build
npm run build-storybook
```

Synchronization generates CSS, utilities, inventories and stories. Do not edit those outputs. Inspect the button in the application and project examples, including preserved states. A successful build does not replace that inspection.

## Components, variants and examples

To create or adopt a component, the assistant first examines existing components. It maintains the implementation in `src/design-system/components/`, tokens and the contract in `src/design-system/authority/components.yaml`. Authored `*.examples.tsx` files describe actual variants and states, while stories are generated. Changes preserve required interactions, labels, errors and keyboard/focus behavior.

For example, to adopt Button, adapt its examples to the agreed uses, check the default, hover, disabled and loading states actually declared by its contract, synchronize, then select its generated story. A new component similarly requires its implementation, contract and each required example before synchronization. The generator rejects a missing contract or required example.

## Publish in Storybook

Three distinct operations are required: generate stories, select project elements in `.storybook/project.json`, then classify them. Add the generated CSF path and its `component` identifier to `stories` following the existing contract. `tokenIds`, `primitiveIds` and `rules` select other content; `classification` organizes selected elements without adopting them or changing values. Follow the fields and destinations in the [Storybook architecture](architecture.md#organisation-et-publication-storybook).

Restart Storybook after adding or removing declarations to rebuild its index. Check the component, variants, states and tokens in their destination. An unclassified element can appear in All with a diagnostic; classification alone publishes nothing. Storybook supports consultation and fictional example interactions without saving visual settings.

## Kit resources and your project elements

A new kit contains reusable resources but its Storybook selection is empty. The local technical inventory `docs/design-system/style-inventory.md` covers kit sources, including inherited resources; it does not by itself describe components adopted by your project. The Storybook catalogue follows explicit project selection. These scopes explain why source tokens exist before adoption.

For an older copy with an editor, see [migration](token-migration.md). It requires a compatible copy and its own checks; existing projects are never updated automatically.
