# Local operations

## Application and data

Node/npm prerequisites are declared in package.json. From the kit root, `node scripts/setup-local.mjs` prepares `.env.local` without overwriting. `docker compose --env-file .env.local up --build --detach --wait` builds/starts application and PostgreSQL. Application binding is local; no default host PostgreSQL port. Startup applies migrations and configured fictional seed without replacing existing data.

`docker compose --env-file .env.local down` preserves data; do not add `--volumes` for ordinary shutdown. To move the same instance, preserve `.env.local` and Compose identity. New-kit distribution excludes private state and includes `.env.example`. [Backups](backup-and-restore.md) are separate from sources.

For host development, use `config/docker/compose.host.yaml` with compose.yaml and start only postgres before migrations and `npm run dev`. Do not expose the database beyond loopback. Test data is fictional/isolated; no global purges.

## Generation and documentation

Install dependencies with `npm ci`. `npm run design-system:sync` prepares outputs from DTCG JSON, registry and examples. Precommands for dev, build, typecheck and Storybook run it automatically. Development watches useful sources without AI.

`npm run storybook` starts consultation on `127.0.0.1:6006`; Ctrl+C stops that server. `npm run build-storybook` prepares a static folder. No design system write UI/API is mounted. UI Lab is removed; old URLs return 404. Accounts/journals from older instances stay private and are never implicitly converted/deleted.

The [current policy](design-system/policy.md) replaces inspector/writer procedures. During sync, `.design-sync.local/` blocks development-server reads. Failed generation before publication retains previous outputs; interrupted publication requires explicit recovery, source preservation and ownership verification. Do not start concurrent processes to bypass this barrier.

Historical utilities from another tool retained in sources are neither the kit installation workflow nor current generation dependencies. They need not run for the site, tests or Storybook.

## Local private entry

The [private configuration workflow](agents/private-configuration.md) supplies a local form/file fallback; secrets stay out of chat/distribution. Never expose the service on the network. Saving configuration neither tests a provider nor reloads a running application.
