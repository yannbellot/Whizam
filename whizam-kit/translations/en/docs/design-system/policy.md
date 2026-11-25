# Automated design system policy

The design system uses three token categories: primitives, component tokens and page-local tokens. The assistant maintains sources and examples; scripts generate and check styles, inventories and stories. This page defines the rules for changes, Storybook publication and recovery.

## Three token categories

| Category | Content | Scope |
| --- | --- | --- |
| Primitives | Typed literal raw values | Reuse by type, unit and exact canonical value. Consumed primitives remain stable. |
| Component tokens | Direct primitive reference | Explicit component, variant, part and state. No cross-component references. |
| Local tokens | Direct primitive reference | Composition of an identified page; no free-form exceptions on shared component instances. |

Values/references are in `src/design-system/authority/tokens.tokens.json`, closed DTCG JSON 2025.10 profile, `org.agentic-design` metadata version 2. Meaning comes from names, owners and descriptions; no intermediate semantic token layer. Retained technical names are traced in the migration table.

Changing a usage’s value creates/reuses a compatible primitive and retargets only affected tokens. Identical usages do not become shared intent. Global changes enumerate usages to retarget. `ensurePrimitive` and `retargetToken` in `scripts/design-system.mjs` perform these operations in memory; the assistant reviews/saves the authority within its mandate. They never modify consumed primitives.

Different component appearances are explicit documented/tested variants. CSS aliases `--adl-slot-*` are contextual generated component-token outputs, not local tokens or another category.

## Sources and generation

The `components.yaml` registry declares implementations, authored examples, Storybook identifiers and required states. Creating/changing components includes their tokens/examples. Checks reject exported shared components without contracts and missing required examples. Examples describe behavior; they are not invented from JSX.

Contextual recipes live in `recipes.yaml`: closed grammar, typed primitive references and controlled units. They are CSS rules, not opaque raw values or a fourth token category. Resets/structural keywords remain CSS. The font catalog retains assets/checksums and triggers no downloads.

`npm run design-system:sync` validates sources/consumers, then generates CSS, utilities, inventories and `*.generated.stories.tsx`. Authored `*.examples.tsx` stay protected. Changed exported examples automatically update corresponding stories. Removal deletes only tracked recognized generated outputs. App/Storybook startup/build synchronize first; development watches authority/examples without AI calls.

`npm run design-system:check` checks staleness without rewriting outputs. Scripts need no AI account. The assistant adapts sources to requests; the designer reviews effects without extra approval for every in-scope write.

## Read-only consultation and local publication

Storybook presents foundations, components, states and patterns from the same code as the application. Example interactions stay fictional/temporary. No appearance panel, UI Lab, AI connection, browser import/save or writer API is mounted in its servers. Static builds work without an editing backend. [Organization/publication](architecture.md#organisation-et-publication-storybook) stay visible even without content; the explicit project registry limits publication to created/adopted elements, without default examples.

Generation prepares/validates every output before publication. Only one generator publishes; `.design-sync.local/` identifies active generation. Development servers refuse reads during publication. After interruption, never blindly remove locks: stop owned servers, verify ownership, preserve generation and run `npm run design-system:sync -- --recover`. Recovery rejects a live owner, retains candidates in a private recovery folder, then regenerates/republishes everything from validated sources. Failed recovery keeps the read barrier. An unreadable owner or live process requires diagnosis, not forced deletion. Multi-file publication is not a filesystem transaction.

## Migration and recovery

[simple-token-migration.json](simple-token-migration.json) retains old identifiers, new tokens, primitives, values and recipes. Explicit migration `scripts/migrate-simple-tokens.mjs SOURCE DESTINATION` writes a fresh destination outside SOURCE and rejects existing private editing state. It does not update distributed projects, convert receipts or remove locks.

To return to the previous version, restore a complete source copy with compatible code/token model. Do not combine the old editor with new authority. Retained old schemas/utilities support historical reading/migration, not current editing of the new model.

## Storybook documentation classification

The current organization is Foundations (Architecture/Overview, Principles, Primitives, Tokens, Rules, Examples), Components (UI Components, Layout Components, Style inventory, Examples) and Patterns (Interaction Patterns). Destinations are permanent; components, Document, Reference fixtures and Form validation are published only after real project adoption. Architecture, Principles and Intentions explain the method without injecting product elements.

Primitive families are color/standalone, type/font-family, type/font-size, type/font-weight, type/line-height, radius, size, space and stroke. standalone means an individual color, including one in use. A primitive can appear in multiple relevant views without duplicating its identity; All counts it once. Uncovered types remain in All with a diagnostic until an explicit extension decision.

Tokens retain direct primitive references. Their primary classification is color/action, color/content, color/feedback, color/focus, color/surface, size/container, shape, space or type. Classification intention, property and state are distinct: button text can belong to color/action. The assistant documents the choice from real usage, never from the color alone, and creates no shared semantic decision. Intentions describes vocabulary, not values to create automatically.

The optional `classification` field in `.storybook/project.json` contains `primitives` (identifier → category list) and `tokens` (identifier → primary category). Controlled vocabulary lives in `.storybook/organization.ts`. Primitives with recognized family identifiers are classified automatically; others need explicit declarations. Tokens always require declarations. Unknown identifiers/categories, incompatible types and repeated primitive categories are rejected. Unclassified elements remain in All with a diagnostic; classification never grants publication. Only `stories`, `tokenIds` and `primitiveIds` retain that responsibility.

Example declaration for already adopted elements:

```json
{
  "classification": {
    "primitives": { "primitive.color.hex-ffffff": ["color.standalone"] },
    "tokens": { "component.button.default.root.background.default": "color.action" }
  }
}
```

When creating, adopting or retargeting an element, the Builder maintains this declaration and examines diagnostics. Variants and states remain with their component. Foundations/Examples hosts project documentation compositions; Document is a convention, not a required fixture. Components/Examples hosts cross-component project scenarios. Home pages keep empty families accessible.

All Storybook tables stay within the available page width. Cells, identifiers, values and code blocks allow wrapping; row heights follow their content. This rule covers catalogs, inventory, intentions, component documentation and tables rendered inside stories. No minimum width may force horizontal overflow. Primitives exposes Identifier, Type, Value; Tokens also retains Scope and Primitive. Each color has a bordered swatch and accessible text value. Token filters cover owner, property and state. Style inventory presents published tokens, categories, references, values and sources identified by component contract or page owner; it does not claim to analyze all CSS consumers or dynamic usages. No full historical foundation inventory is republished.

MDX files under `.storybook/structure/` declare destinations, checked against the shared catalog. Catalogs are documentation pages without empty controls panels; component stories remain interactive. Old manager links `/docs/01-foundations-primitives--docs` and `/docs/01-foundations-tokens--docs` redirect to their All views while preserving language parameters. Storybook remains read-only, without a writer, intermediate decision layer or implicit global propagation.
