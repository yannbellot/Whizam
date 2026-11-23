---
name: backup-and-rollback
description: "Prepare and verify backups, isolated restoration and version rollback while checking code/schema compatibility; no implicit reset."
---

> Documentation translation. The canonical skill remains `skills/backup-and-rollback/SKILL.md`.

# backup-and-rollback

Inputs: authorized data/target, code/schema version, recovery objective and operating procedure. Read docs/agents/skill-contract.md and docs/operations.md; an untested procedure remains unqualified.

## Work and output

Distinguish backup copies, data restoration, migrations and code rollback. Identify source/destination, permissions, format, confidentiality, storage and checksum; never log a real dump or secret. First test restoration on a synthetic database or identified new destination, compare content/constraints and rerun compatible code/migrator. Creating a dump file is not a verified restoration.

Deliver backup/restoration evidence, compatible versions, limitations and precise rollback steps. Do not modify an applied migration or promise destructive downgrades. Deleting/writing a preexisting or shared resource requires the AGENTS decision; without a safe target, prepare the dossier and stop before mutation. Clean only disposable trial resources; retain redacted evidence rather than private data in Git.
