---
name: data-permissions-migrations
description: "Define or evolve schemas, validation, ownership and data permissions with replayable PostgreSQL/Drizzle migrations and isolated tests."
---

> Documentation translation. The canonical skill remains `skills/data-permissions-migrations/SKILL.md`.

# data-permissions-migrations

Inputs: business/data rules, exposure/accounts, current schema and versions to migrate. Read docs/agents/skill-contract.md, the data contract and operating procedures.

## Work and output

Define constraints and permissions before code/migrations; distinguish TypeScript validation from runtime input, and authentication from server authorization. Without accounts, state the local scope without inventing multi-user isolation. With accounts, select an authorized method and test refusals and cross-account access.

Generate, review and version SQL and metadata; apply to an empty database and, for changes, a previous-state dataset. Use repeatable synthetic seeds without overwriting; never deliver direct schema synchronization. Assess code compatibility, backup and recovery before actual transformation. Deliver synchronized contracts/tests/documents and redacted evidence. Non-isolated targets, real data or hard-to-reverse operations follow AGENTS material-decision rules; do not promise automatic migration rollback.
