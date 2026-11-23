# Preparing a new project environment

Reference for [initialize-project](../SKILL.md), only for technical initialization/resumption. Paths start at the real kit root. This procedure assists installation; it does not prove clean-machine qualification. See [compatibility](../../../docs/compatibility.md).

## Starting point and outcome

The designer has a working assistant with folder/terminal access, a complete extracted kit with hidden files/links, browser and Internet. The folder is writable. Node/npm, Docker/Compose and Git may be absent. Document assistance needed to reach this starting point separately; do not require npm to access the assistant meant to install Node. Assistant accounts are not site runtime dependencies.

Explain: “I will check machine tools, help with missing ones and verify preparation. Some system permissions remain yours to grant.” Reuse known answers. No extra product questionnaire for diagnosis; four [workflow](../../../docs/product/project-start.md) sequences stay unchanged. VMs belong to kit tests, never designer prerequisites.

## Diagnosis without Node

Use system tools to identify OS/version, architecture, shell, disk space and write access; discover Node/npm/Docker/Compose. Examples: `uname -s`, `uname -m`, `command -v node`, `command -v npm`, `command -v docker` in POSIX shells; `sw_vers` on Mac or `/etc/os-release` on Ubuntu. Assume neither Python, jq, Git, Homebrew nor assistant-provided runtime. Never display secret-bearing variables/files.

Test commands only if present; distinguish absence, incompatible version, access denial and stopped engine. Record actual paths, not just versions. Read [package.json](../../../package.json)/[.nvmrc](../../../.nvmrc) as text before Node: `.nvmrc` gives Node target, `packageManager` npm target, `engines` compatible ranges. Exact [README](../../../README.md) versions are campaign references; compatible existing tools can be retained with versions/checks actually run.

For Docker check client, `docker compose version`, effective context and `docker info` engine access. Installed clients do not prove running engines. Check destination before resource creation: remote contexts/DOCKER_HOST do not become authorized targets. Never automatically switch contexts to resolve refusals.

## Choose the workflow

| Observation | Next step |
| --- | --- |
| Accessible compatible Node/npm | Reuse paths; no reinstall/update. |
| Missing/incompatible Node/npm | Prefer local runtime below when source/network/permissions allow; preserve installations. |
| Local install impossible or different user choice | Explain official machine installation, effects/permissions; await authorization before outside-project writes. Recheck afterward. |
| Missing Docker/Compose | Follow OS assistance below. Compose supplies PostgreSQL without separate host installation. |
| Stopped engine or denied access | Request only necessary intervention, then recheck. No bypassing safeguards. |
| Platform outside campaign | Declare “unqualified”, without universal promises or improvised material system extension. |

Targets: **macOS 26 on Apple Silicon Mac** and **Ubuntu 24.04 LTS arm64**. Documentation is a qualification target, not evidence. Windows, Intel Mac, x64/Linux and other versions remain outside this campaign.

## Install project-local Node/npm if needed

Assistant-guided installation, not universal installer. First inspect `.runtime.local`: ignored, real, inside the project and without ambiguous content to replace. Do not overwrite incomplete runtime; identify ownership/retention before replacing. Download into a clean attempt-specific temporary subfolder separate from usable runtime.

1. Read `.nvmrc`, e.g. `cat .nvmrc`, then select the official OS/arm64 archive: `node-v<VERSION>-darwin-arm64.tar.gz` on Mac or `node-v<VERSION>-linux-arm64.tar.gz` on Ubuntu. Verify current links on [Node.js Downloads](https://nodejs.org/en/download)/[official archives](https://nodejs.org/dist/). No implicit mirror or “latest”.
2. Download archive and `SHASUMS256.txt` for **the same version** over HTTPS, rejecting HTTP errors/HTTP redirects. Check required tools first: curl/tar/shasum on Mac, curl/tar/sha256sum on Ubuntu. Missing tools need assistance, not assumptions.
3. Extract exactly the expected archive’s unique manifest entry, then verify SHA-256 with `shasum -a 256 -c` or `sha256sum -c` from the download folder. The checksum verifies integrity from official HTTPS; never claim signature verification unless performed. For incomplete transfer, wrong architecture or bad checksum execute nothing, retain failed state and retry in an identified location.
4. Inspect archive entries, extract into the attempt folder and move the whole Node directory into `.runtime.local/node` **only if free**. Preserve bin/, lib/ and npm links; copying only the executable is insufficient. No sudo/shell-profile changes.
5. Check `.runtime.local/node/bin/node --version`. Determine bundled npm with that Node: `.runtime.local/node/bin/node .runtime.local/node/lib/node_modules/npm/bin/npm-cli.js --version`.
6. If bundled npm differs, install the kit’s exact npm target only under `.runtime.local/npm` using downloaded Node/npm: `npm install --prefix .runtime.local/npm --no-package-lock --ignore-scripts --no-audit --no-fund npm@<VERSION>`. Temporarily prioritize local Node bin/ **inside this process** and set cache to `.runtime.local/npm-cache`. Read `<VERSION>` from packageManager; no project package.json/lockfile, global npm or extra package-manager changes. Verify before proceeding.

Runtime download configures neither Docker nor the project. Never interpret project names/downloaded output as shell commands.

## Rediscover runtime in every terminal or conversation

Use [scripts/with-runtime.sh](../../../scripts/with-runtime.sh) when local runtime is needed. From the kit:

```sh
sh scripts/with-runtime.sh node --version
sh scripts/with-runtime.sh npm --version
sh scripts/with-runtime.sh node scripts/setup-local.mjs
sh scripts/with-runtime.sh npm ci
```

The helper installs nothing. It prioritizes compatible machine pairs, otherwise checks `.runtime.local/node` and optional local npm. It applies engines ranges, rejects incomplete local runtime and passes paths to children. Commands run at kit root even when invoked from elsewhere; relative arguments resolve there. npm cache stays project-local. No project shell files are loaded or parent terminals modified.

Keep this entry for subsequent README Node/npm commands, including checks/builds/migrations/dev/Storybook. Docker is separate after engine verification. POSIX support on these targets does not qualify Windows. Runtimes are not distributed; after machine transfer recheck OS/architecture and reinstall if needed.

## Assist Docker and Compose

**Apple Silicon Mac.** Read current [official Docker Desktop installation](https://docs.docker.com/desktop/setup/install/mac-install/), select Apple Silicon, verify prerequisites/integrity/organization terms. Desktop includes Compose; do not install another copy by default. Guide download/opening/first launch. License consent, passwords and macOS approvals belong to the designer. Never remove quarantine, change safeguards or promise unnecessary restarts. Signature/integrity/policy blocks need explanation/resumption notes.

**Ubuntu arm64.** Follow [official Docker Engine Ubuntu installation](https://docs.docker.com/engine/install/ubuntu/): verify distribution/existing packages, configure official repository after approval and install Engine/client/containerd/Buildx/Compose plugin. Explain repository/service changes/admin rights. Never automatically run conflicting-tool removal instructions on equipped machines: identify usages and seek decisions. Never pipe remote scripts into shells. Do not automatically widen socket rights or add users to docker group; engine access is a permission decision. Authorized admin system operations do not replace checking ordinary project-command access.

After intervention verify client, [Compose](https://docs.docker.com/compose/install/), context/engine in the working terminal. Record progress before required restart/new session, then repeat diagnosis. `docker --version` alone is insufficient. Preserve existing services/networks/images/volumes; no global prune/reset.

## Interruption, preservation and result

Keep recovery notes in initialize-project’s project documents: step, OS/architecture, paths/versions, verified source/integrity, successful/failed/unperformed commands, expected intervention/next check. No secrets/passwords/extra marker files. Human cancellation is interruption, not success. Reuse known information next conversation.

| Incident | Expected recovery |
| --- | --- |
| Closed terminal, interrupted conversation, restarted machine | Read tracking, rediscover runtime through helper, recheck engine/services. |
| Interrupted download/dependencies/images, no network/full disk | Identify attempt files/resources, resolve cause, resume missing step. Never enable unverified downloads. |
| Unwritable folder or occupied port | Identify permissions/port owner; choose authorized destination/port without stopping other services. Never automatically modify folder permissions. |
| Incomplete kit, lost links, partial runtime | Diagnose missing items; preserve ambiguous content/restore from identified source. Never mask validator failure. |
| Existing configuration/project | Preserve `.env.local`, Compose identity/data; resume missing steps without destructive setup/out-of-mandate migrations. |

Never run npm ci without compatible runtime or Docker operations without authorized engine. Continue independent work only when intervention is missing. Then resume [initialize-project checks](../SKILL.md#démarrer-et-vérifier-le-socle)/README: setup, services, actual data access, checks/builds. HTTP 200 alone proves neither database access nor complete preparation.

Announce “project initialized” only after required checks pass. Explain availability, missing items/resumption; technical evidence stays in tracking. Machine installation/example functionality are not the implemented first project version.
