---
name: deploy-docker-compose
description: "Prepare and verify Docker Compose execution on an identified authorized target, with explicit data, configuration, checks and rollback."
---

> Documentation translation. The canonical skill remains `skills/deploy-docker-compose/SKILL.md`.

# deploy-docker-compose

Inputs: local/shared target, version, private configuration, data and scope authorization. Read docs/agents/skill-contract.md and docs/operations.md; do not assume a VPS target.

## Work and output

Prepare a concrete dossier: prerequisites, variables without exposed secrets, services/ports/volumes, migrations, health and functional checks, backup/recovery and cleanup. For disposable local targets, use distinct identities/labels, loopback and owned resources; preserve ambiguous preexisting resources. HTTP health is not persistence evidence.

For real/shared targets, complete reversible preparation before the immediately preceding impact decision required by AGENTS. No implicit SSH, costs, persistent secrets or new exposure. After authorized execution, check actual version/state, journeys and limits; keep redacted commands and evidence. On divergence, stop mutation and perform only already authorized protective measures/rollback. Publishing Storybook remains separate.
