> Current initial state: application and Storybook have no project content; Zensical displays existing `docs/` documentation from first startup. Demonstrations cited in historical references stay outside delivered access points; do not reactivate them at initialization. Internal resources required by contracts/policies remain. New project content follows existing rules.

# Replacing the projects example

The mini-manager is an explicit demonstration; the starter functions without an AI agent. Its [specification](features/projects.md) defines rules; the [shipped PORT-03 report](../reviews/port-03/README.md) identifies version, journey checks and limits.

## Role in a derived project

In the [startup workflow](project-start.md), `/projects` supports checks/manufacturing reference. It creates fictional database records, not applications/folders. Never present this example, UI Lab or generic welcome as the project’s first version.

At the first authorized implementation slice, remove navigation/delivered access entries, adapt welcome and prepare Storybook around actually used components. Keep/adapt project-management functionality only within agreed scope. Useful development reference files may remain outside delivered journeys; this does not replace actual-result content/navigation checks. Technical URLs are not blocked by this rule and no data deletion follows. Checks/reports must not require `/projects` after replacement; target project journeys/relevant storage.

The reference starter retains its demonstration/tests; this procedure does not remove them from source kit. Complete example-code removal follows the explicit procedure below, preserving existing data.

## Example elements

- app/routes/projects-*.tsx and /projects block in app/routes.ts: HTTP/UI coordination.
- app/features/projects/: contract, HTTP guards, server repository, form/summary and CSS; stories use fixed data, not the repository.
- app/server/db/schema.server.ts, seed.server.ts and drizzle/0000_initial_projects.sql: table/fixtures/migration. The .server DB client/configuration remains a foundation capability.
- tests/unit/project-contract.test.ts, three repository cases in tests/integration/postgres.test.ts, tests/project-e2e/, scripts/test-projects.mjs and config/testing/playwright.projects.config.ts: example-specific evidence. Adapt other PostgreSQL tests if replacing the model.
- src/App.tsx: welcome link. docs/product/brief.md, features/projects.md and project-data-contract.md: product/data sources.

## Change procedure

1. Create a local branch; clarify new-domain brief/criteria; preserve SSR foundation, server modules and input protection. Define data before migrations.
2. Replace relevant business routes/links/components; retain J2 components/tokens. Avoid generic components without actual need.
3. For a new project without data, define schema/migrations before first initialization. For existing databases never modify applied migrations: generate/review new migrations, plan backup/compatibility and an authorized target. Never implicitly delete tables/volumes.
4. Adapt fictional seed, business tests, stories/documents in the same slice. Explicitly update the closed `scripts/design-editor/manifest.mjs`: remove only deleted paths and register new DS-consuming components/stories/routes. All declared paths must exist before restarting UI Lab; do not bypass revision checks by ignoring missing files or adding global discovery. Prepare the list before the derived project’s first DS save. If receipts already exist with another list, preserve old root/tooling for diagnosis/recovery; prepare an inactive source copy without private state, with new configuration and explicit data treatment. Never convert/purge receipts or remove locks to force manifest changes. The starter retains its example manifest; replacements apply only to the derived project. Keep cross-cutting checks: types, lint, format, boundaries, authorities, relevant tests and app/Storybook builds.
5. Run journeys against an isolated database, verify errors/restart; record removed functionality/new limits in tracking/handoff. Repeat applicable reviews. This procedure grants no push, publication or database reset.

For complete removal, explicitly remove route block/link, then only unused example business/test/story files. Preexisting storage remains until a separate data operation is authorized. Review versioned-file deletion in Git; never use global purges.
