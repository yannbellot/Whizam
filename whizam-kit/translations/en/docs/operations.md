# Local operations

Run commands from the kit root using the Node/npm versions declared in [package.json](../package.json). [Environment preparation](../skills/initialize-project/references/environment-setup.md) covers missing tools and the optional local runtime. Application, Storybook and Documentation are separate services; check their address and content before presenting them.

## Application and PostgreSQL with Compose

With Docker and Compose available:

```bash
node scripts/setup-local.mjs
docker compose --env-file .env.local up --build --detach --wait
```

Setup creates `.env.local` without overwriting existing configuration and reports the selected address. Compose builds the application, waits for PostgreSQL and applies migrations. The bootstrap may invoke the configured seed; the current seed inserts no data. The home page stays empty until a project is implemented.

The application is published on `127.0.0.1` at the configured `APP_PORT`. PostgreSQL has no host port by default. Stop the instance while preserving data:

```bash
docker compose --env-file .env.local down
```

Volumes live in Docker, outside sources. Do not add `--volumes` to an ordinary shutdown.

## Application development on the host

After local setup, install dependencies and start PostgreSQL alone with the explicit override:

```bash
npm ci
docker compose --env-file .env.local -f compose.yaml -f config/docker/compose.host.yaml up --detach --wait postgres
npm run db:migrate
npm run dev
```

The override publishes PostgreSQL on `127.0.0.1` at the configured `DB_PORT`; scripts read `.env.local`. The Vite server listens on loopback; verify the reported address instead of assuming a previous port. Ctrl+C stops that server. Then stop this instance's database using the same Compose files and `down`, without volumes.

## Storybook and Documentation

After `npm ci`, start each tool in its own terminal:

| Service | Command | Default address | Specific prerequisites |
| --- | --- | --- | --- |
| Storybook | `npm run storybook` | `http://127.0.0.1:6006/` | npm dependencies; no database or AI account |
| Documentation | `npm run docs:dev` | `http://127.0.0.1:8000/` | npm dependencies and Docker; no database or host Python |

`DOCS_PORT` selects another documentation port. An occupied documentation port is rejected without stopping its owner. Ctrl+C stops only the relevant service. `npm run build-storybook` and `npm run docs:build` produce static output; the [documentation guide](documentation.md) describes publication and freshness.

Storybook shows only elements selected for the project; it saves no visual settings. UI Lab and `/projects` are not services to restart.

## Synchronization and recovery

`npm run design-system:sync` generates output from DTCG sources, the registry and authored examples. Development, type-check and application/Storybook build precommands synchronize that output; relevant sources are watched during development. Never edit derivatives manually.

A validation error before publication preserves previous output. An interrupted publication preserves the `.design-sync.local/` barrier; verify ownership and follow [recovery](design-system/policy.md#consultation-et-publication-locale), without forced deletion or concurrent launches. The portal has its own lock and previous complete output under the [documentation guide](documentation.md).

If startup fails, distinguish an incompatible runtime, unavailable Docker, invalid configuration, occupied port and generation error. Preserve existing state; do not stop unrelated processes or remove a volume to resolve a conflict.

## Private configuration and moving

Use the [private workflow](agents/private-configuration.md) when access is missing; never send its value in the conversation. Saving neither tests a provider nor reloads a running service.

To move the same instance, preserve `.env.local`, its Compose identity and volumes. To hand off a fresh copy, exclude private state under [handoff](handoff.md). Transferring data to another host or Docker engine follows [backup/restore](backup-and-restore.md).

<a id="application-and-data"></a>
<a id="source-application-and-data"></a>

<a id="application-et-donnees"></a>
<a id="source-application-et-donnees"></a>

<a id="generation-and-documentation"></a>
<a id="source-generation-and-documentation"></a>

<a id="generation-et-documentation"></a>
<a id="source-generation-et-documentation"></a>

<a id="local-private-entry"></a>
<a id="source-local-private-entry"></a>

<a id="operations-locales"></a>
<a id="source-operations-locales"></a>

<a id="saisie-privee-locale"></a>
<a id="source-saisie-privee-locale"></a>
