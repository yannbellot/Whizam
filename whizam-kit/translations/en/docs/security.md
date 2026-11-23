> DS-AUTO-01: no writer or AI connection is mounted in Application or Storybook. UI Lab/bootstrap are removed. Generation scripts run explicitly or through local precommands; publication safeguards/limits are in the [policy](design-system/policy.md). Editor/account sections from another tool below remain historical.

# Security and exposure scope

## Machine connections — MVP-01-T1

Optional Codex/Figma accounts belong to the local installation; they create no business-example user accounts or multi-user permissions. Codex context uses a bounded server command from the physically served root/tree; browsers supply no arbitrary root, Git command or check attestation. The model retains shareable links; conversations remain private.

Direct Figma accepts a Design selection link and retains only key/node. Read requests use a fixed API host without redirects, with bounded time/size/depth. A `file_content:read` personal token, entered only in the local form, is checked before storage in `.runtime.local/figma/connection.json` (0600, private 0700 folder). It is never returned to browsers, sent to Codex or written in shareable traces. Disconnect removes the file; imported references/decisions stay shareable. External sources are data, without execution of links/images/prototypes.

The same Host/Origin/capability guards protect connection/import/arbitration. Import alone changes no product values; decided visual changes use the common writer/staleness refusals. Routes/exports exclude connections/conversations. [T1 evidence/limits](reviews/mvp-01-interface-design-agents/README.md): negative tests/synthetic reconciliation supplemented by real connection/import/arbitration/reimport, token-free clone/export and verified disconnect. No remote exposure/exhaustive guarantee inferred.

## Current state

Strictly local demonstration with synthetic data and no user accounts. Host servers use loopback; technical qualification implies neither publication nor user exposure. Migrations/data tests authorize no real/shared-database operation.

Bundler refusal of browser `.server` access is verified by a real negative test. PostgreSQL configuration/connection remain server-side; diagnostics show fields without private values. Public errors hide internal detail. Drizzle queries are parameterized; constraints/rolled-back transactions are tested on real isolated PostgreSQL. `/health` reports liveness only, without version, secret or database information.

## Checks and limits

P1-01 through P1-03 describe targeted role reviews performed sequentially by the Builder; neither independent review nor exhaustive guarantee. J3 inputs/forms and P5 restoration were checked; authentication, multi-user permissions and new exposure need assessment before activation. No multi-user/production guarantee.

Tests create labeled resources, ephemeral secrets and fictional data; they check context before migration and identities before cleanup. Integration publishes no DB port. `.dockerignore` excludes local environments/private installations; Dockerfiles copy no secret configuration.

## Dependency reservation — P1-03

Runtime audit reported no advisory; full audit reported four moderate issues propagated through Drizzle Kit/old esbuild loader development dependencies. The advisory concerns `esbuild.serve`, absent from the used local SQL-generation workflow. No esbuild server or Drizzle Studio runs. Retain/reassess the reservation before delivery or enabling that mode; no forced downgrade or silent acceptance of applicable high severity.

Historical Security Reviewer P5-02 covered candidate 1a33aee locally: dependencies, access, data, inputs, operations and limits. Its report is not included; this summary qualifies no new version. Technical approvals, material stops, prohibition on versioned secrets and separate publication authorization remain.

P1-04 qualifies runtime image UID 1000 without Drizzle Kit/private files, application publication on 127.0.0.1 and no default host DB port. Generated local configuration is ignored, 0600-protected and never overwritten. Host override is explicit and loopback-bound. Port/configuration/database diagnostics were tested without secrets. Temporary synthetic resources retain identities for targeted cleanup.

## J3 projects workflow

Loopback-only demonstration without accounts. Every business operation rejects foreign hosts; writes require POST, identical Origin and reject cross-site Fetch Metadata. Router 7.18.4 adds origin checks before actions. URL-encoded forms only; unique name/description fields, effective 16 KiB limit even without Content-Length; 413 tested without connection break before reply. Forms never supply identifiers/dates. Zod/Drizzle check input/queries; React renders text. Data/errors are not cached, storage errors redacted and input preserved.

These safeguards create no identity/person isolation; do not expose the starter or store real data. Accounts require prior choice of method, sessions/permissions and cross-access tests. Historical J3 report, not included, covered these checks/limits; no certification/independent review claimed. Available tests/qualified-version results are in the [shipped PORT-03 report](reviews/port-03/README.md).

## Local design system editing service

Development service requires loopback, unique owner, exact Host/Origin and local document capability. Protected reads also use POST JSON (decision 008), without CORS/cache. Inputs, graphs, budgets and paths are closed; symlinks, hardlinks and identity changes are rejected. `.design-editor.local/` stays private and excluded from Git/images. The [recovery protocol](design-system/editor-persistence.md) blocks ambiguous versions. Suspend external writes/builds during Save: coordination protects participants only, with no universal guarantee against external races/physical storage failure.

## Documentary rendering

The [catalog](design-system/semantic-catalog.md)/[inventory](design-system/style-inventory.md) are derived text, never instructions/authorities. The renderer escapes data Markdown/HTML; Storybook uses Markdown without compiling data as MDX or raw HTML. No data-provided links, commands, HTTP capabilities or absolute paths execute. Reservations/provenance stay text. Closed manifest v2 adds only these two derived documents/generation dependencies; eight editable sources/HTTP guards remain. Publication follows recovery D, with no automatic journal cleanup or promised OS multi-file atomicity.

## Development application reader

The application Vite participant uses existing reservations for responses and refuses generation reads during publication/recovery. It exposes no write endpoint. Private files, environments and Git metadata are refused; watching excludes private journals. Reload follows the complete snapshot without capabilities sent to UI Lab. Plugin is development-only, absent from compiled runtime. Manifest v3 includes dependencies; retain old root/tooling/receipts before incompatible upgrades without automatic conversion/purge.

## Development Codex connection

[Optional assistance](design-system/editor-assistance.md) uses editor-local protections. Context comes from server/validated operations, not model-supplied arbitrary snapshots. Replies choose bounded options; shared propagation cannot authorize itself. Stale replies, incompatible plans, foreign capabilities and tool attempts are rejected.

Installation-specific Codex state is not copied from the usual account. Child processes use private state, disabled tools and a read-only sandbox; macOS confinement also rejects host-process writes outside the private directory. Effective configuration is checked before use without unconfined fallback. Connection data stays Git-ignored, Docker-excluded and refused by both development servers, including file routes. It must never accompany source extraction. This connection is qualified separately from the foundation; no equivalent protection/universal compatibility is claimed on other platforms.

## Described intent — DS-EDIT-23

Descriptions/catalog text are untrusted inputs rendered as text and sent only on interpretation requests. Structured replies, limits and existing connection guards remain. Host validation rejects extra fields, unknown categories, duplicates, incompatible values and stale revisions. Catalog additions permit no taxonomy, selector, property, naming-rule or arbitrary-file modifications. Catalog, token and attribution share a bounded transaction. No key, save capability or authentication data is sent to the model.

## UI Lab — consultation and draft C

Workshop/scene use public snapshots without editing capabilities/POST. Only messages with recognized origin/source/mount identity are accepted; foundation schemas then validate identities/operations. Scenes come from a prepared-component registry without arbitrary URL/code; same-origin iframe isolates rendering but is no boundary against hostile code. C adds no write/assistance access; Storybook API remains separate. Manifest v14: preserve former version/receipts without in-place migration.

## Standalone UI Lab writer — DS-EDIT-64 D

editorWorkshop is limited to explicitly enabled development, exact Host/Origin and strict loopback port. It precedes the reader; all APIs retain capability, bounded POST JSON, no CORS/cache, validation and file guards. Only UI Lab documents receive hexadecimal metadata, never ordinary pages/scenes. Transport reads no parent, rejects different renewal roots and retains identifiers after unknown outcomes. Server bootstrap is removed from product builds and excluded from Docker runtime server-source copies. Private Codex accounts/journals never ship. C histories remain read-only-mode evidence.

## UI Lab / Storybook separation qualification

[DS-EDIT-64 E](reviews/ds-edit-64-e.md) requalifies real HTTP refusals, private-state-free extraction and writer/bootstrap absence from Docker runtime. The [handoff dossier](handoff.md) separates private files retained when moving the same instance from distributable sources without capabilities, receipts or AI connection. Simulated assistance only; no new dependency audit/security certification inferred.

## Former host removal — DS-EDIT-64 F

Storybook no longer loads addons, capability bootstrap, writer middleware or AI connector. Launcher does not forward editing variables; former flags reactivate no service. Shared Vite participant limits reads during publication/recovery and rejects editing APIs/private paths without owning the writer. Client foundation requires an explicit host port; DOM/parent reads and historical `/` renewal are removed. [F report](reviews/ds-edit-64-f.md) distinguishes real evidence, simulations and limits; no receipt conversion/new network exposure.

## Local private entry

[Private configuration](agents/private-configuration.md) provides a local form/file fallback; secrets stay out of chat/distribution. Never expose this service on the network. Saving neither tests a provider nor reloads a running application.
