# Design system sources

Current policy: [automated management](../../../docs/design-system/policy.md), DS-AUTO-01. It supersedes former UI Lab/decision-token instructions.

- `tokens.tokens.json`: unique DTCG JSON source of primitives, component tokens and page-local tokens. The latter two reference a same-type primitive directly.
- `components.yaml`: component registry, implementations, authored examples and Storybook coverage.
- `recipes.yaml`: closed CSS recipes with typed parameters; no opaque tokens.
- `google-fonts.catalog.json`: font asset/checksum catalog with no automatic download.

Retained former YAML authorities, adjacent records and editor schemas are historical resources for old contracts/migrations. Current generation does not read them. They add no editable fields or semantic layer to the current model.

After changes: `npm run design-system:sync`, `npm run design-system:check`, relevant tests/builds. Never edit derived files manually. Storybook is exclusively read-only.

Generating stories does not automatically publish them. Project membership follows [Storybook organization](../../../docs/design-system/architecture.md#organisation-et-publication-storybook), without default examples.
