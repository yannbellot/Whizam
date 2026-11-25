# Application architecture

The kit is a React/React Router Framework Mode application written in TypeScript. Vite builds the server and browser portions; no separate backend is needed. The [scope](product/starter-kit.md) distinguishes the supplied foundation from the business project to build.

## Application and routes

[app/routes.ts](../app/routes.ts) declares active routes:

| Route | Responsibility in a fresh kit |
| --- | --- |
| `/` | Empty home page rendered by `src/App.tsx` |
| `/imported/:definitionId` | Display of a definition in the initially empty `app/loomata-imports.json` registry; unavailable message if missing |
| `/health` | Liveness `{ "status": "ok" }`, without a PostgreSQL check |

The former `/projects` and UI Lab routes are no longer mounted. Preserved historical components and resources are not exposed features. Every new business route follows the brief, its contracts and tests.

## Source responsibilities

| Location | Responsibility |
| --- | --- |
| `app/root.tsx`, `app/routes/` | HTML document, server/client rendering and HTTP coordination |
| `app/server/` | Private configuration, PostgreSQL access and server-only processing |
| `app/features/projects/` | Internal resources from the former example; no active project-management route |
| `src/design-system/components/` | Shared React components and authored examples |
| `src/design-system/authority/` | JSON DTCG values/references, component registry and YAML recipes |
| `src/styles/` | CSS, generated styles and `project:` Tailwind utilities without a new Preflight |
| `.storybook/` | Organization, project selection and component documentation |
| `docs/`, `translations/`, `config/documentation/` | Canonical Markdown, translations and Zensical classification |
| `drizzle/`, `config/database/` | SQL migrations, metadata and Drizzle configuration |
| `scripts/`, `tests/`, `config/testing/` | Generation, operations and isolated checks |
| `agents/`, `skills/`, `.agents/`, `.claude/` | Roles, skills and exposure through internal relative links |
| `compose.yaml`, `config/docker/` | Containerized application and PostgreSQL; explicit override for host database access |

## Server boundary and data

`.server.ts` modules own sensitive access; components import neither private configuration nor PostgreSQL drivers. Zod validates configuration. Connections are created on demand; an available database is not required to build the application.

For business writes, define the flow route/action → HTTP and data validation → server processing/repository → PostgreSQL → response. Guards from the former example do not automatically protect a new route. See [conventions](conventions.md) and [security](security.md).

Versioned migrations and existing data are preserved. The Compose bootstrap applies migrations and may invoke the configured seed; `seedDemoProjects` currently inserts nothing. Schema changes require a migration and an authorized target, never rewriting an already applied migration.

## Design system and documentation

The [design system sources](../src/design-system/authority/README.md) feed `scripts/design-system.mjs`. The generator validates the three token categories, consumers, contracts and examples, then publishes CSS, utilities, inventories and stories. The [policy](design-system/policy.md) defines primitive stability, variants and recovery after interruption. No browser editor or writer is mounted in the application or Storybook.

A generated story is visible only after project selection. The [Storybook registry](design-system/architecture.md#organisation-et-publication-storybook) separates membership, classification and values. Zensical prepares published Markdown from its registry, with translations, search and exclusions; see the [documentation guide](documentation.md). Historical files remain in sources, outside the portal.

## Execution and autonomy

Commands start from the actual kit root. Host development, the Docker application and Storybook/Zensical servers are separate; prerequisites and shutdown are in [operations](operations.md). The application image uses the `node` user and production dependencies, with the required build, scripts and migrations.

Builds and caches are reproducible. Local configuration and Docker volumes are not part of a fresh kit. Renaming an instance preserves its Compose identity; transferring its data needs a [backup](backup-and-restore.md). No kit link or import may require its parent.

<a id="architecture-applicative"></a>
<a id="source-architecture-applicative"></a>

<a id="assistance-de-styles-optionnelle"></a>
<a id="source-assistance-de-styles-optionnelle"></a>

<a id="atelier-ui-lab-ds-edit-64-c"></a>
<a id="source-atelier-ui-lab-ds-edit-64-c"></a>

<a id="cur-commun-et-livraisons-core-01"></a>
<a id="source-cur-commun-et-livraisons-core-01"></a>

<a id="derived-documentation"></a>
<a id="source-derived-documentation"></a>

<a id="documentation-derivee"></a>
<a id="source-documentation-derivee"></a>

<a id="edition-persistante-du-design-system"></a>
<a id="source-edition-persistante-du-design-system"></a>

<a id="explicit-scope-and-transactional-catalog-ds-edit-23"></a>
<a id="source-explicit-scope-and-transactional-catalog-ds-edit-23"></a>

<a id="optional-style-assistance"></a>
<a id="source-optional-style-assistance"></a>

<a id="persistent-design-system-editing"></a>
<a id="source-persistent-design-system-editing"></a>

<a id="portee-explicite-et-catalogue-transactionnel-ds-edit-23"></a>
<a id="source-portee-explicite-et-catalogue-transactionnel-ds-edit-23"></a>

<a id="raccordement-autonome-ds-edit-64-d"></a>
<a id="source-raccordement-autonome-ds-edit-64-d"></a>

<a id="shared-core-and-deliveries-core-01"></a>
<a id="source-shared-core-and-deliveries-core-01"></a>

<a id="standalone-connection-ds-edit-64-d"></a>
<a id="source-standalone-connection-ds-edit-64-d"></a>

<a id="ui-lab-workshop-ds-edit-64-c"></a>
<a id="source-ui-lab-workshop-ds-edit-64-c"></a>
