# Reusable kit scope

Kit Whizam is a standalone starter for UX/UI and Product Designers to build a verifiable web application that can be handed off. The designer defines intent and reviews results; the assistant helps with scoping, implementation, checks and documentation. The derived project's brief defines its features.

## Supplied contents

- React/React Router foundation with server and browser rendering, TypeScript, PostgreSQL, Drizzle and Docker Compose.
- Automated design system: primitives, component tokens and page-local tokens, contracts and authored examples, generated styles and stories.
- Storybook for consultation with permanent organization and explicit project-element selection.
- Zensical for active guides and project documentation, with search and maintained FR/EN content.
- Instructions, four roles and a skill library under the [catalog](../../skills/catalog.json), with internal assistant adapters.
- Scripts, tests, migrations and recovery procedures. Their presence activates neither publication nor deployment.

## Initial state

The application displays an empty page; `/projects` and UI Lab are not active routes. The imported-definition registry and Storybook content selections are empty. The seed inserts no data; migrations and existing data are preserved. Useful components and former examples remain internal resources without defining the product to build.

The portal provides Home, User guide, Project progress and Technical documentation. Kit history is excluded from the site and search. ROADMAP.md and docs/project-state.md remain uninitialized templates; kit-manufacturing tasks must not be copied into them.

## Startup and evolution

Follow the [workflow](project-start.md) and [initial intake](../agents/project-intake.md): reuse known information, collect missing answers, validate scope and implement the authorized first version. Successful technical preparation is not an implemented business project.

Do not reactivate former examples to start. Their [adaptation](replacing-project-example.md) preserves existing data and applied migrations. Creating or adopting a component includes its variants, states, examples, tokens and documentation selection under the [policy](../design-system/policy.md).

## Autonomy and prerequisites

The kit folder works alone after copying, renaming or moving, with required hidden files and relative links. Its instructions and references need no parent, external Whizam service or macOS launcher. Node/npm and Docker follow [prerequisites and operations](../operations.md).

The site, tests, Storybook and generation run without an AI account. The assistant uses its own access; Figma remains conditional. Git provides traceability but is not required for basic web startup. A fresh copy contains no maintainer Git repository, private configuration, installed dependency or Docker volume; see [handoff](../handoff.md).

## Qualification limits

Platforms, native trials and results are identified in [compatibility](../compatibility.md). A supplied adapter guarantees neither native discovery nor identical assistant behavior. Historical evidence does not automatically qualify a new edition or derived project.

The kit provides neither a finished business application, multi-user authentication nor a production-readiness guarantee. Derived-project formats follow its brief; historical constraints of the former tool do not determine its product. Technical reviews and human acceptance remain distinct.

<a id="autonomie-attendue"></a>
<a id="source-autonomie-attendue"></a>

<a id="demarrage-dun-projet-derive"></a>
<a id="source-demarrage-dun-projet-derive"></a>

<a id="elements-a-livrer-dans-ce-dossier"></a>
<a id="source-elements-a-livrer-dans-ce-dossier"></a>

<a id="etat-et-limites"></a>
<a id="source-etat-et-limites"></a>

<a id="perimetre-du-kit-reutilisable"></a>
<a id="source-perimetre-du-kit-reutilisable"></a>

<a id="produit-et-utilisateurs"></a>
<a id="source-produit-et-utilisateurs"></a>
