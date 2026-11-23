# Starter conventions

## Initialize project tracking

Paths start from the application folder root regardless of its name. The [README](../README.md), [roadmap](../ROADMAP.md) and [current state](project-state.md) support resumption without the manufacturing context.

Supplied ROADMAP.md and docs/project-state.md are uninitialized. Complete them when starting a real derived project from its brief/mandate, without adopting historical starter work. Project intent/specifications live in `docs/product/`, work items in `docs/work-items/`, decisions in `docs/decisions/`, reviews/evidence in `docs/reviews/`. Create folders only with the first useful document. The roadmap carries consolidated statuses; current state stays short with version, verified results, limits and next action. Each rule/decision has one source.

The app means the whole kit, including [instructions](../AGENTS.md), roles, skills and adapters under its [scope](product/starter-kit.md). Canonical sources/usage references are internal. Useful delivery evidence is selected/versioned with it; historical evidence is not automatic acceptance of the current version. [PORT-03](work-items/port-03-autonomous-agent-kit.md) preserves integration/qualification history. For new features identify target, intent, constraints, criteria and mandate before implementation. Technically qualified work remains In review pending required human acceptance. Documentation tracking authorizes no publication, external access or data deletion.

## Code and responsibilities

- Strict TypeScript; English identifiers/commits; documentary text follows the [project language choice](agents/languages.md).
- `app/routes/` coordinates HTTP responses/UI; loader/action exports remain server-side, components can load in the browser.
- `src/design-system/components/` holds shared components; `src/ui-lab/` retains their demonstrations. Components import neither private configuration nor database drivers.
- Server-only processing lives in `.server.ts` modules. `app/server/env.server.ts` validates configuration input with Zod and diagnoses field names without values.
- Feature/data folders are added with their first useful implementation. Routes do not use the `.server` suffix.
- Native CSS, custom properties and CSS Modules; no implicit additional UI library/CSS framework.

## Contracts and checks

`GET /health` checks application liveness: JSON `{ "status": "ok" }`, no cache, secrets or version. It does not test PostgreSQL. Invalid configuration fails processing; public error documents hide internal detail. Write operations/contracts are defined before business implementation.

`npm run typecheck` generates Router types and checks application/tests/configuration. `npm test` runs Vitest in Node; tests grow with actual features. `npm run test:boundaries` checks rejection of `.server` imports from components in an isolated copy. Database/browser tests remain separate with isolated synthetic resources/data.

<a id="git-batches"></a>
<a id="source-git-batches"></a>

## Local Git — batches of small changes

Policy dated 22 November 2026. This section governs assistants working directly on kit or derived-project sources. It does not change the integrated workspace engine: its `loomata/<UUID>` branches, draft and integration modes remain specific to that engine. This policy installs no scheduler or automatic service; the assistant evaluates triggers while working and when resuming.

### Scope and batch formation

Within an authorized mandate, accumulate localized, reversible small changes serving one objective: text, spacing, alignment, documentation or minor fixes consistent with agreed behavior and direction. Data, permissions, dependencies, runtime configuration and architecture require a separate work item. Assess shared-token impact before classifying a change as small. Existing mandate approvals still apply.

Before the first write, inspect the Git root, branch, index and existing work. Create `codex/<subject>` from `main` or reuse a branch actually matching the batch; do not create one branch per adjustment. Never absorb unrelated work, move ambiguous work or overwrite an existing branch. If the repository or `main` is missing, record a resumption point and propose preparation: never implicitly initialize Git or create the main branch. A batch authorizes no changes to another project.

Project tracking records batch identity, objective, branch/base, included requests and count, affected files, completed/pending checks and next trigger. Maintenance tracking belongs to the maintenance root; derived-project tracking belongs to that project. Reuse the batch across conversations. Save files during work; an uncommitted batch exists only in the local copy and is not a remote backup.

### Closure and commit triggers

Evaluate triggers after each completed request, never midway through a change. Any one trigger suffices:

| Trigger              | Rule                                                                                                                                                                                                     |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Explicit request     | “Commit”, “finish this batch” or equivalent.                                                                                                                                                             |
| Accumulation         | 5 completed modification requests in the batch; each counts once regardless of tool calls, fixes or retests.                                                                                             |
| Size                 | At least 10 changed source files or 200 added and deleted lines combined in the current batch diff against its base. Include new files; exclude generated derivatives, lockfiles and generated evidence. |
| Subject change       | Before writing for a distinct objective, close the previous batch if coherent and verifiable.                                                                                                            |
| Explicit session end | “Let us stop here” or equivalent closes a coherent, verifiable batch unless explicitly instructed to perform no further operation or not to commit.                                                      |

Thresholds govern grouping, not Git limits. Count final differences rather than intermediate edits; a complete undo leaving no useful difference creates no commit. A response ending, new conversation, successful check or inactivity does not trigger a commit. Below thresholds, keep the batch open rather than closing it merely to deliver a response. If closure fails, preserve the batch; isolate a new subject only when existing work and dependencies remain protected.

At closure, review explicitly selected files, update relevant documentation/evidence, then run checks and reviews appropriate to the final batch. Fix failures within the mandate. If a mandatory check remains failed or unverifiable, preserve the resumption point without an automatic incomplete or `wip:` commit. Otherwise create a coherent English commit without another approval request. Closure tracking/evidence belongs to this batch: it is not a new request and must not trigger a loop of documentation commits.

### Local tracking helper

From the target project root, run `node scripts/git-batch.mjs diagnose .`: diagnostics only, with no Git writes or secret-value reads. A parent repository is reported without creating a nested repository. Opening a batch requires Git and an existing `main` branch. Without Git, prepare a public-source selection and obtain an explicit mandate for initialization and the first commit; never distribute the maintainer’s `.git/`. Do not change global Git identity.

After the assistant creates a `codex/<subject>` branch within the mandate, call `begin` with JSON on standard input: `{"objective":"Tables", "files":["src/example.ts"], "generated":[]}`. Command: `node scripts/git-batch.mjs begin .`. Selected files must be clean when opening; include planned new files and batch documentation. Private, ignored or linked paths are refused. To extend selection for the same objective before writing, call `node scripts/git-batch.mjs extend .` with `{"files":["new-file.md"]}` on standard input; already modified unselected files are refused. Never edit state to bypass a refusal. This limited helper does not replace that decision.

After each completed modification request, call `node scripts/git-batch.mjs record .` with `{"id":"request-001","event":"none"}` on standard input. Reuse the stable identifier when resuming: counting is deduplicated. Allowed events are `none`, `explicit`, `subject`, `session` and `stop`, according to the known trigger; never call a tool after an instruction to perform no further operation. `stop` is only for classifying state during a later authorized resumption. Do not record informational requests as modifications.

`node scripts/git-batch.mjs status .` rereads the batch and measures final differences for selected files. Thresholds come from this policy, without a second configuration. `generated` explicitly lists generated evidence/derivatives excluded from metrics; lockfiles and `.generated.` names are excluded automatically. Binary changes require review; changes outside selection are not qualified by the helper. `closureDue` requests closure checks: it never proves success or authorizes integration. An occupied index, changed branch/base or advanced main requires the diagnostics and safeguards in this policy.

Private `.git-batches.local/batch.json` stores objective, root/branch/base, requests, selection and last event. It is ignored by Git, excluded from distribution and does not replace human-readable check tracking in project documents. Concurrent calls refuse an occupied lock; never remove an ambiguous lock. After checking the actual commit and scope, `node scripts/git-batch.mjs archive .` preserves the old state in an archive and frees the next batch. This requires clean Git state and refuses commits containing unrelated files. The assistant then performs admissible integration through ordinary Git commands; the helper never runs add, commit, merge or initialization.

### Local integration and decisions

After committing, integrate automatically into `main` when the mandate/decisions are respected, applicable checks/reviews pass on this version, no recognized technical/functional conflict remains and no product, aesthetic or security decision is pending. A visible small adjustment consistent with an agreed direction does not systematically require human acceptance.

Verify that the `main` worktree and index are clean, then use fast-forward only (`--ff-only`), without squash, rebase or history rewriting. If `main` advanced, explicitly reconcile versions on the batch branch without overwriting or rewriting history and rerun affected checks before retrying fast-forward. Uncertain conflicts require human arbitration; never force integration. Respect hooks and tool permissions. Keep the branch after integration; do not implicitly delete it.

Critical changes always require human arbitration: hard-to-reverse data operations, access/security/privacy, unplanned services/costs or material scope/architecture changes. Never hide them in a minor batch. Integration is not human acceptance: retain In review status until acceptance is received. Briefly report whether the batch remains open, was committed or integrated, with useful limitations. No implicit push, GitHub Actions, release, publication, external service or deployment. Evidence identifies base/version, checks actually performed, results and limitations.

Operational TypeScript scripts use native Node 24 with explicit `.ts` imports; `erasableSyntaxOnly` prevents constructs needing extra runtime transformation. The production server validates PORT, defaults to loopback and permits HOST=0.0.0.0 only with an explicit container marker. Occupied ports fail without silent fallback.

## Formatting and browser

Prettier follows .prettierrc.json: `npm run format` fixes and `npm run format:check` checks. Exclusions are explicit in .prettierignore; ambiguous copies stay outside Git and are not changed. Playwright uses modern Chromium on two viewports without reused servers or personal profiles. Failed checks preserve nonzero exit codes.
