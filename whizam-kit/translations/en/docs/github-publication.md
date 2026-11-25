# Publishing source files on GitHub

This procedure preserves and synchronizes project sources on GitHub after a commit or on request. It describes repository selection, connection and authorization of uploads. Publishing sources and deploying the application are separate operations.

## Choices and authorization

Initial scoping records `github.repository` (`new`, `existing`, `none`), then `github.sync` (`after-commit`, `on-demand`) when GitHub is selected. These are non-secret preferences, not permission for remote changes. A refusal or deferral remains valid until a change is requested. Existing projects do not receive a mandatory retrospective questionnaire.

Load [publish-github-project](../skills/publish-github-project/SKILL.md). Ask only for missing details: personal or organization owner, repository name or URL, visibility for a new repository (private suggested), published branch (`main` suggested). Preserve existing visibility. This edition supports `github.com` over HTTPS using Git and GitHub CLI (`gh`); SSH remotes, GitHub Enterprise and multiple destinations require an explicit adaptation, never a silent conversion.

Prepare the actual history and files before approval: useful sources, internal links and example configuration; exclude secrets, private data, caches and the maintainer's `.git/`. A deleted file may remain in an earlier commit. For a copy without Git, obtain permission to initialize and create the first commit using the prepared selection and conventions. Do not publish the maintenance kit's history; work in the derived copy.

Present the exact repository, visibility, branch, history scope, known remote effects (including existing workflows) and update mode. Explicit approval of this summary may cover future sends to that destination. Do not repeat approval for every commit. A different account, destination, visibility or branch requires the relevant new agreement. Suspend immediately on request. Sending sources does not deploy the application.

## Connection and private entry

Reuse available access without reading its value. A sufficient connector may publish under this contract; the local helper uses `gh`. If no connection is usable, offer `gh auth login --hostname github.com --git-protocol https --web` in a terminal controlled by the designer. This changes tool state: obtain the relevant authorization and explain credential storage; never silently switch accounts or change global Git settings. Do not display `gh auth token`, secrets or debug logs.

If browser login is unavailable and a token is necessary, explain the minimum scope needed for the destination and operations; do not impose broad permissions. Run `node scripts/configure-secrets.mjs --github GH_TOKEN:password` from the project, then open the returned local URL following [Private configuration](agents/private-configuration.md). The user enters it alone, without inspection or capture after real entry. Cancellation and expiry change nothing.

This fallback stores only `GH_TOKEN` in `.github-token.local` (0600), separate from `.env.local`. It is neither a vault nor a connection test. The helper loads this file only with `credential: "form"` and passes the token to `gh`/Git processes without putting it in arguments or URLs. With `credential: "existing"`, it does not open this file. Never put the token in the brief, conversation or portal. File fallback opens only this private file without assistant reading, explaining that entry is visible; do not fall back to the application environment. Respect permission refusals.

Opening a Codex tab depends on available tools; otherwise provide the local link. In Claude, use available capabilities or a local browser. Script tests do not establish universal embedded support or native client qualification.

Official references checked on 24 November 2026: [GitHub CLI login and storage](https://cli.github.com/manual/gh_auth_login), [repository creation](https://cli.github.com/manual/gh_repo_create), [credential helper](https://cli.github.com/manual/gh_auth_setup-git). The helper sets credentials only for its Git commands, without running `gh auth setup-git` or changing global configuration.

## Commands and persistence

From the project root, `node scripts/github-project.mjs status` is local, without network access or secret output. `plan` reads `{ "branch": "main" }` on standard input and returns the commit, file list and `selectionHash`. It rejects private paths in history; it cannot detect a secret hidden in an ordinarily named file. Human/agent review of history and confidentiality is still required.

The `account` field identifies the connected acting account, distinct from the repository owner. Determine it with `gh api user --jq .login` within the connection mandate (public identifier only), then include it in the summary. The helper rechecks it before creation or sending; an account change blocks the operation.

After summary approval, `authorize` reads this non-secret object on standard input:

```json
{
  "repository": "owner/project",
  "account": "connected-account",
  "branch": "main",
  "visibility": "private",
  "mode": "after-commit",
  "credential": "existing",
  "reviewedHead": "COMMIT_RETURNED_BY_PLAN",
  "selectionHash": "HASH_RETURNED_BY_PLAN",
  "historyReviewed": true,
  "authorized": true,
  "approval": "Reference to explicit summary approval"
}
```

Prepare JSON with a file tool without shell interpolation of user text, pass it on stdin and never place secrets in arguments. Authorization neither creates nor sends anything. The private ignored operational state `.github-publication.local/state.json` stores destination, mode, approval, reviewed version and send receipt. Initial non-secret answers remain in the brief. Distributed copies exclude private state; resuming the same folder reads it. After moving a configured project, present a new summary and run `authorize` again rather than reusing another root's authorization.

`inspect` verifies the remote repository, visibility and write permission; this is network access requiring the relevant mandate. Only for a new repository, after creation approval, `create` reads `{ "createAuthorized": true }`: no implicit README, clone, remote or push. Resume with `inspect` if creation succeeded but verification failed; never automatically recreate or delete it.

After version checks, `sync` reads `{ "verifiedHead": "VERIFIED_COMMIT", "checksPassed": true, "requested": true }`. `after-commit` reads the same object without `requested` and sends nothing in on-demand mode. `suspend` disables sends without deleting the repository or secret. To change mode/destination, present a new summary and repeat `authorize` with a current plan; do not edit state manually to bypass refusals.

## Batches, sending and resumption

The Builder calls `status` on resumption. Without configuration, take no GitHub action. After each authorized batch closes and integrates locally, call `after-commit` in automatic mode with the verified published commit and successful checks. Batch thresholds stay unchanged: no commit per small edit. By default publish `main` after local integration; commits only on `codex/...` are not sent. Another branch may be explicitly designated and reviewed; this helper covers one branch/destination at a time.

In on-demand mode, keep track of local commits waiting to be sent and wait for a request; do not mutate the remote after a commit. No hook or permanent service watches manual commits outside sessions. The designer may ask “Send the latest commits to GitHub”, “Switch to on-demand updates” or “Suspend GitHub sends”.

The helper checks the exact repository root, history without private paths, descent from the reviewed commit, a clean worktree, HTTPS destination without URL rewriting, remote visibility and rights. A different existing `origin` is refused, never replaced. The push targets only the agreed commit and branch reference, without force or automatic tags, and rereads the remote reference before confirming success. No global Git identity is changed.

Expired access, unavailable network, protected branch or divergence: preserve the local commit and pending state, report the cause and next action. No force push, destructive rebase or retry loop. If a remote commit is unknown locally, diagnose and prepare an authorized reconciliation before retrying. An already present commit is recognized without another push. Local status is only a receipt; network verification establishes current remote state. Do not create a tracking commit after each receipt, which would create a send loop.

## Checks and limitations

Targeted checks: `node --test tests/github-project.test.mjs tests/project-intake.test.mjs tests/private-configuration.test.mjs`. Git tests use temporary repositories and local bare remotes; connection, creation and GitHub responses are simulated. They do not establish real account permissions, native skill activation or Codex/Claude rendering. A live trial requires its own test repository and mandate. Repository deletion remains a separate operation.

After adding or changing the skill: validate catalog and links, FR/EN translations, documentation build/freshness and an autonomous copy. Distinguish technical checks, client trials and human acceptance. Never claim real publication from a simulated test.
