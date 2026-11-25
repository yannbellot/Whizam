> Current DS-AUTO-01 architecture: standalone generation in `scripts/design-system.mjs` under the [policy](design-system/policy.md). Editor, snapshot and writer descriptions below are historical, not current runtime.

# Application architecture

**UI-ARCH-04 — new-project foundation adoption:** [decision 037](decisions/037-project-ui-foundation-adoption.md). Tailwind `project:` without extra Preflight, theme derived from project DTCG in the transactional writer; React Aria Button/Field with existing APIs/local aliases. Static utilities tied to bindings control consumption; no tool-value references. Creation/export qualification is separate; existing projects/old journals preserved; Electron out of scope. This adoption does not establish qualification, tracked in UI-ARCH-04.

**UI-ARCH-03 — bounded adoption:** [decision 036](decisions/036-first-ui-slice-adoption.md). New chrome surfaces consume tool DTCG authority/derived Tailwind styles; project values/historical rules stay unchanged. Tool checks cover classes/variables and absence of project references; no new writer capability. Project foundations/Electron out of slice.

**UI-ARCH-02 target framing, 14 November 2026:** [UI boundary contract](architecture/ui-architecture-boundaries.md) for Loomata and created sites/web apps. Documentary scoping only: current DTCG/authorities preserved, React Aria/Tailwind to implement in two independent design systems, Electron separately. Directions qualify no integration; effective rules below apply until explicitly aligned before code.

**Current design system authority — DS-ARCH-01:** DTCG JSON 2025.10 values/references; rules, presentations and CSS recipes in YAML contracts. [Design reference](design-system/architecture.md), [authority contract](../src/design-system/authority/README.md) and [decision 027](decisions/027-dtcg-authority-and-css-recipes.md) supersede historical YAML-value-source references below. The loader projects validated JSON into the common engine; the writer serializes under journal then regenerates without dual editable references. Model v4 retained, snapshot v4/manifest v27; UI Lab remains sole local editing host, Storybook reads the same fixtures/values for documentation.

**DS-EDIT-64 — current state:** standalone UI Lab workshop delivered in C/D under [decision 025](decisions/025-independent-design-editor.md), qualified in [E](reviews/ds-edit-64-e.md). Historical exclusive-Storybook hosting below is superseded: writer only in explicitly launched UI Lab development, documentary Storybook without addon/bootstrap/writer after [F](reviews/ds-edit-64-f.md). Its only consistency-service connection is a read participant. See [handoff](handoff.md).

Paths start from the application root regardless of folder name. React Router Framework Mode builds client/server through Vite; no separate backend.

| Location | Responsibility |
| --- | --- |
| `app/root.tsx`, `app/routes.ts`, `app/routes/` | HTML document, loader/action coordination and SSR UI. |
| `app/features/projects/` | Shared contract, server HTTP guards, Drizzle repository, forms/stories. |
| `app/server/` | Private configuration/PostgreSQL access exclusively `.server`. Lazy connection; no build-time database. |
| `src/design-system/` | Components, six historical YAML authorities, editor catalog/matrix, token resolution/validators. |
| `src/ui-lab/` | SSR/interaction integration lab. |
| `AGENTS.md`, `agents/`, `skills/`, `.agents/`, `.claude/`, `CLAUDE.md`, `GEMINI.md` | Shipped instructions, roles, library/adapters with internal references. |
| `docs/agents/`, `docs/compatibility.md` | Assistant contracts, practice references, procedures/limits. |
| `.storybook/` | Isolated rendering of shared components/tokens, documentation imported from `docs/design-system/`. |
| `drizzle/` | Versioned SQL migrations/metadata. |
| `scripts/`, `tests/` | Startup, migration, generation, isolated local checks. |
| `config/testing/` | Playwright/Vitest configuration; tests/reports resolved from kit root. |
| `config/typescript/`, `config/database/` | TypeScript projects/Drizzle configuration; npm commands/main tsconfig select paths. |
| `compose.yaml`, `config/docker/` | Compose entry, Dockerfiles and explicit host-development override; build context at kit root. |

Write flow: server action → HTTP guard/validation → server repository → PostgreSQL → Router response. Components load neither secrets nor DB drivers. Browser-side server imports are rejected by build and tested. Public errors hide internal details; see [security](security.md)/[data contract](product/project-data-contract.md).

YAML authorities are canonical; CSS properties/TypeScript catalog are generated before types/dev/build/Storybook and Git-ignored. No duplicate entry, Figma sync or design-environment dependency. UI principles have [their canonical document](design-system/principles.md).

Operational paths are relative to files/root. `.env.local` stays private here. Persistent Compose identity is path-independent; volumes live in Docker. Moving/renaming an instance differs from independent installation: [procedure](../README.md). `build/`, `storybook-static/`, installations/caches are rebuildable/ignored. Non-root runtime image contains only build, production dependencies and necessary scripts/migrations.

[Prepared editor contracts](product/features/design-system-editor.md) add v2 schemas/pure checks in `src/design-system/editor/contract.ts`. [Component-record migration](decisions/006-component-token-migration.md) connects five components/foundations to v2 outputs while preserving 24 historical aliases. Validators stay in tooling without component server imports. [Decision 007](decisions/007-storybook-memory-preview.md) manager panel/memory projection consume validated generated snapshots without browser Node imports. Stories explicitly declare targets; iframe owns CSS layer. Writing service ships only in development Storybook tooling without extra application routes.

## Persistent design system editing

Pure `src/design-system/editor/operations.ts` engine is shared by projection/persistence. `.storybook/editor/server/` loads only through development middleware; no business routes/database. The generator first creates buffers in an isolated root; store publishes sources/six derivatives under journal with reader reservations/HMR barrier. The [save contract](design-system/editor-persistence.md) describes manifest, receipts, recovery/limits; static mode retains consultation/preview C.

## Derived documentation

`scripts/editor-documentation.mjs` renders validated data as escaped Markdown; `prepareEditorArtifacts` reuses token resolver/consumer snapshot. Two versioned outputs — [catalog](design-system/semantic-catalog.md)/[inventory](design-system/style-inventory.md) — complement four ignored CSS/TS/JSON derivatives. They follow the same save preparation/publication/recovery. Closed manifest v2 includes renderer/MDX entries importing these texts; no new editable source/HTTP route. Generator reads use existing coordination. `docs:design-system:check` compares without rewriting under private read reservation.

## Optional style assistance

DS-EDIT-14 adds pure policy in `src/design-system/editor/style-decision.ts`, draft controller `src/design-system/editor/assisted.ts` and app-server stdio connection only in Storybook middleware. No business backend/additional dependency. The service prepares plans from validated snapshots and checks replies before projection; writer retains canonical writes only. Connection, installation isolation and limits are in the [assistance contract](design-system/editor-assistance.md). Application runtime/static builds do not start Codex.

The [DS-EDIT-15 model](decisions/020-component-token-reference-model.md) retains binding as component-token authority (effective `reference`, original `style`); sources/model v3, snapshot/save protocol v2. `editor/naming.ts` computes family/usage names and participates in closed manifest v4. The [explicit migrator](design-system/token-migration.md) converts v2 sources on copies without replaying old receipts; historical schema/fixture are not active runtime contracts.

## Explicit scope and transactional catalog — DS-EDIT-23

`editor/operations.ts::projectTransaction` projects model/catalog together for session, preview channel, assistance and writer. `intentions.ts` limits additions to documented intents/eligibility without changing existing categories, taxonomy, domains or definitions; reread snapshots verify extension against compiled authority. `intent-proposal.ts` prepares only authorized structured-reply operations. The engine, not model, derives identifiers.

Manifest v9 includes catalog as ninth editable source; its serialization differs from component records and publication shares token journals/receipts/recovery. Write v4; v3 requests rejected, old receipts not converted. Model v4/snapshot envelope v3 keep their shape. Intent interpretation v1 remains development-service-only under the [guide](design-system/editor-assistance.md).

## UI Lab workshop — DS-EDIT-64 C

`src/ui-lab/editor/` assembles shared React fixtures, scene channel and draft controllers. `/ui-lab` initializes client sessions; `/ui-lab/preview` loads only authorized scenes. UI-MAC-02 removes `/ui-lab/reference`/historical presentation; shared components/examples remain in Storybook. No Storybook runtime dependency; public snapshot reads, correlated iframe transport, no writer/account in the new host. Vite-generation changes notify without destroying sessions. Contract/limits: decision 025; C does not activate D.

## Standalone connection — DS-EDIT-64 D

scripts/editor-workshop.ts mounts the common service before Vite reader only through explicit local startup. app/server/editor-bootstrap.server.ts supplies development workshop-document-only metadata; transport.ts uses that document exclusively. The service imports natively outside the Vite configuration graph so saved derivatives do not restart it. Shutdown/resumption use existing store. Storybook defaults to no writer with explicit historical compatibility; no new backend. Compiled runtime stays consultation/draft-only.

## Shared core and deliveries — CORE-01

The [separation contract](architecture/shared-core.md) retains the autonomous folder and plans a macOS shell without duplicating the engine. Local port scripts/core/local-service.mjs is shared by a JSON CLI/WebKit prototype; future creation/export/connection functions remain unavailable.
