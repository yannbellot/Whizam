# Kit technical guide

This guide describes the standalone kit. Former visual-editor guides are superseded by the [design system policy](docs/design-system/policy.md).

## Main startup

From the kit root with compatible Node/npm and Docker Compose:

```bash
node scripts/setup-local.mjs
docker compose --env-file .env.local up --build --detach --wait
```

Private configuration is not overwritten; volumes remain external to the folder. To stop without deleting data: `docker compose --env-file .env.local down`. See [operations](docs/operations.md) and [backup](docs/backup-and-restore.md).

If local runtime is needed, follow [environment preparation](skills/initialize-project/references/environment-setup.md) and prefix Node/npm invocations with `sh scripts/with-runtime.sh`. No automatic system installation.

## Checks and Storybook

After `npm ci`: `npm run validate:agent-kit`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run test:design-system`, `npm run design-system:check`, `npm run build` and `npm run build-storybook`.

`npm run storybook` serves documentation at `127.0.0.1:6006`. Component stories are generated from the registry and authored examples. Interactions are fictional; no source/business data is saved. The browser has neither writer nor AI connection.

UI Lab and its former routes are removed. Application, tests, generation and Storybook need no AI account. Settings are changed in sources with the assistant within its mandate.

## Automated design system

`npm run design-system:sync` validates/synchronizes CSS, utilities, catalogs and stories. `npm run design-system:check` detects staleness. Three active categories: primitives, component tokens and page-local tokens. DTCG JSON holds values/references; examples, expected states and recipes have contracts. See [sources](src/design-system/authority/README.md).

During development, authority/example changes synchronize outputs. Never edit generated files manually. Validation failures preserve previous outputs; interrupted publication retains a read barrier. See the [policy](docs/design-system/policy.md) for migration/recovery.
