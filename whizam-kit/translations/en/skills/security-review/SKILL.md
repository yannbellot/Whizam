---
name: security-review
description: "Perform a proportionate security review with evidence about inputs/access/data, dependencies and limitations; no certification or real-target testing."
---

> Documentation translation. The canonical skill remains `skills/security-review/SKILL.md`.

# security-review

Inputs: scope/exposure, data/identities, version/diff and authorized tools. Read agents/security-reviewer.md, docs/agents/skill-contract.md and project security policy.

## User decisions and journey verification

Apply the [common protocol](../../docs/agents/user-decisions.md) when a user decision is needed. For observable criteria covered by this review, reuse the verification mode and coverage agreed with the Builder; offer Manual / Automated — E2E / Combined only when missing or materially changed. E2E tests do not replace this review or mandatory checks. Distinguish automated results, manual feedback and acceptance; never ask for approval of an unperformed manual review. Combine shared campaigns instead of repeating the choice for each role.

## Work and output

Identify relevant boundaries, then trace an input to its result: authentication/authorization where present, origin/method, validation, storage/rendering, errors/logs, secrets and dependencies. Use local negative evidence; do not invent exploitation from a function name or extrapolate an npm audit to the whole application.

For each finding: prerequisites, proven path, impact, justified severity, expected correction and retest. Distinguish confirmed vulnerabilities, hypotheses to validate and tool limitations irrelevant to current runtime. No secrets in reports. Read/isolated tests/report only; no external scan, real provider or code modification without existing authorization. Stop work dependent on missing access and record unperformed checks. After Builder corrections, verify the new version and state actual coverage/independence.
