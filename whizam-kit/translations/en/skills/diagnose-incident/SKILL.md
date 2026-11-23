---
name: diagnose-incident
description: "Connect a symptom or failure to observations, tested hypotheses and a verified cause, then fix within scope and retest."
---

> Documentation translation. The canonical skill remains `skills/diagnose-incident/SKILL.md`.

# diagnose-incident

Inputs: symptom, version, command/journey, environment and redacted logs. Read docs/agents/skill-contract.md; usable from local development onward.

## Work and output

Retain the initial failure and distinguish fact, hypothesis and cause. Inspect the executed path; prefer a bounded discriminating trial before retrying. Do not turn fixture, access or tool errors into product defects without evidence. Keep target/data isolated; never purge, silently change ports or bypass a gate to get green results.

Document the cause and minimal correction with version, before/after result, retest and limitation. If the defect is in scope, fix and rerun only invalidated checks. If material access/decisions are missing, provide a checkpoint and precise next action; continue independent work. No secret details in diagnosis or implicit real provider calls.
