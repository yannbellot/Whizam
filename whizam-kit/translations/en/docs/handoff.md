# Resume and hand off the kit

The [technical guide](../TECHNICAL-GUIDE.md) describes current behavior; [operations](operations.md) describes startup. Distinguish the three situations below to preserve sources, configuration and data.

## Hand off a fresh copy

Transfer kit sources only, with required hidden files, `.env.example` and relative skill links. Exclude `.git/`, `node_modules/`, builds, caches, test results, private environments, accounts, AI connections, journals, backups and other `*.local` state. Examine uninventoried files too; do not archive an entire working folder without selection.

`docs/distribution/sources.json` describes supplied sources and their hashes or link targets. The recipient installs independent dependencies and uses their own access. The kit requires no parent files. ROADMAP and project-state templates stay uninitialized in a fresh kit; they must not be reset when resuming an existing project.

## Move the same instance

Preserve private configuration, Compose identity and access to existing volumes without distributing them as a fresh kit. A path change does not move Docker data. For another host or Docker engine, prepare and verify a [backup/restore](backup-and-restore.md). Do not delete volumes or regenerate an identity to resolve a move.

## Resume an existing project

Read its brief, roadmap, current state and instructions. Recover the mandate, version, decisions and pending checks; do not repeat complete initialization in a new conversation. Former examples and kit evidence do not define project goals or acceptance.

Changing a component includes tokens, variants, states and authored examples. Synchronize derivatives and maintain Storybook selection under the [policy](design-system/policy.md). Older copies are not implicitly migrated; code, sources and any historical journals must remain compatible.

## Verify before handoff

In a clean renamed copy, install independently with `npm ci`, then run checks from the [technical guide](../TECHNICAL-GUIDE.md) appropriate to changes, including FR/EN translations, builds and links. Verify no parent dependency, internal link resolution and exclusion of private state. Installation and a build alone prove neither functional flows nor native assistant discovery.

The review presents Application, Storybook and Documentation after verifying their availability and content. Record the version, checks actually run, limitations and next action. [Compatibility](compatibility.md) distinguishes historical evidence from current trials; human acceptance stays explicit. Local handoff authorizes neither publication nor deployment. See the [sharing guide](guide-whizam/partager-projet.md) for the designer workflow.

<a id="documentation-du-projet"></a>
<a id="source-documentation-du-projet"></a>

<a id="project-documentation"></a>
<a id="source-project-documentation"></a>

<a id="reprendre-le-kit"></a>
<a id="source-reprendre-le-kit"></a>

<a id="resuming-work-on-the-kit"></a>
<a id="source-resuming-work-on-the-kit"></a>
