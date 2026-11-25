---
name: publish-github-project
description: 'Prepare, publish and update project sources on GitHub after commits or on demand; resume, change mode or suspend sends.'
---

# publish-github-project

Inputs: target project root, GitHub intent, version and available approval. Read the [common contract](../../docs/agents/skill-contract.md), then [GitHub publication](../../docs/github-publication.md), the authority for this journey and commands. Source publication and application deployment are distinct.

Start without remote changes: inspect Git, brief preferences and `node scripts/github-project.mjs status`. Without Git, prepare selection and initialization under the conventions; never transport the maintainer's `.git/`. Ask only for unknown destination/visibility/branch/mode. A scoping preference is not approval of a concrete publication.

Prepare `plan`, review history, files and known remote effects; present the summary before obtaining missing approval. Reuse persistent authorization for the same target. Never infer approval from a preselection or preference answer. After approval, `authorize` records the local contract; `create` still requires creation permission, without implicit first push.

Reuse available access; otherwise offer browser login through `gh`, then the dedicated private form only if needed. Follow the authority for storage/permissions; never read the token or inspect the page after real entry. Codex/Claude opening capabilities remain conditional.

After each integrated batch commit, the Builder calls `after-commit` only with a configured active target, supplying the actual verified commit and successful checks. In on-demand mode call `sync` only upon explicit request. No permanent hook. A different destination/branch/account/visibility needs concrete new approval. `suspend` stops sends without deleting resources.

Report repository/branch, remotely confirmed version or pending commits, limits and next action. Network, rights or divergence failures preserve the local commit and pending state, without force push or repeated attempts. No false success based on a local receipt or simulation. Keep evidence in the owning project without secrets or tracking-commit loops.
