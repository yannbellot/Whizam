# Kit technical guide

Kit Whizam is a standalone foundation for building a web application with a development assistant. It includes React/React Router and TypeScript, PostgreSQL/Drizzle, an automated design system, Storybook and the Zensical documentation portal. Run all commands below from the kit root; no parent files are needed.

## Initial state

The application displays an empty page. Storybook exposes its structure without project content. Zensical publishes active guides and tracking templates awaiting initialization. `/projects` and UI Lab are absent from active routes; their internal resources do not define a project to build. The seed, a data initialization operation, inserts no rows. See the [scope](docs/product/starter-kit.md).

## Prerequisites and startup

Compatible Node and npm ranges are declared in [package.json](package.json); Docker and Compose are required for containerized startup. If tools are missing, follow [environment preparation](skills/initialize-project/references/environment-setup.md). With an already prepared local runtime, prefix Node/npm commands with `sh scripts/with-runtime.sh node` or `sh scripts/with-runtime.sh npm`.

```bash
node scripts/setup-local.mjs
docker compose --env-file .env.local up --build --detach --wait
```

Setup preserves existing private configuration and reports the application address. Stop without deleting data using `docker compose --env-file .env.local down`. Host development, port conflicts and recovery are described in [operations](docs/operations.md).

## Sources and generation

The [architecture](docs/architecture.md) describes routes, server modules and data. The [source contract](src/design-system/authority/README.md) identifies DTCG values, the component registry, authored examples and CSS recipes. Three token categories are active: primitives, component tokens and page-local tokens. The latter two reference primitives directly.

`npm run design-system:sync` validates and generates styles, utilities, inventories and stories. A story is an interactive component example. Never edit derivatives manually. Generation does not automatically publish a story in Storybook: project selection and classification are [separate](docs/design-system/architecture.md#organisation-et-publication-storybook). Interruptions and recovery follow the [policy](docs/design-system/policy.md).

## Browsing and checks

After `npm ci`, `npm run storybook` serves Storybook on `127.0.0.1:6006`; `npm run docs:dev` serves Zensical on `127.0.0.1:8000`, with Docker running. These services are separate from the application. Storybook is for consultation, without a writer or AI connection; Zensical needs neither PostgreSQL nor host Python.

| Changed area | Relevant checks |
| --- | --- |
| Instructions and library | `npm run validate:agent-kit` |
| Application code | `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`; boundary, data or flow tests according to impact |
| Design system sources | `npm run design-system:sync`, `npm run design-system:check`, `npm run test:design-system`, application/Storybook builds |
| Stories and component publication | `npm run build-storybook`, `npm run test:storybook` according to the affected flow |
| FR/EN documentation | `npm run test:documentation`, `npm run docs:translations:check`, `npm run docs:build`, `npm run docs:check`, plus link/rendering checks |

A passing check proves only its own scope. Dated results, native trials and limitations are distinguished in [compatibility](docs/compatibility.md). The site, tests, scripts and documentation tools run without an AI account; the development assistant uses its own access.

## Resumption and handoff

Follow the [handoff](docs/handoff.md) to distinguish a fresh copy, moving an instance and transferring data. Preserve required hidden files and relative links; exclude dependencies, builds and private state. Docker volumes need a [separate backup](docs/backup-and-restore.md). ROADMAP and project-state templates do not track kit maintenance.

<a id="automated-design-system"></a>
<a id="source-automated-design-system"></a>

<a id="checks-and-storybook"></a>
<a id="source-checks-and-storybook"></a>

<a id="controles-et-storybook"></a>
<a id="source-controles-et-storybook"></a>

<a id="demarrage-principal"></a>
<a id="source-demarrage-principal"></a>

<a id="design-system-automatise"></a>
<a id="source-design-system-automatise"></a>

<a id="guide-technique-du-kit"></a>
<a id="source-guide-technique-du-kit"></a>

<a id="main-startup"></a>
<a id="source-main-startup"></a>
