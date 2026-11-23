---
name: technical-review
description: "Review a version or diff for contracts, execution paths, tests and regressions with reproducible findings and retesting after fixes."
---

> Documentation translation. The canonical skill remains `skills/technical-review/SKILL.md`.

# technical-review

Inputs: objectives/criteria, immutable version/diff, supporting files and isolated environment. Read agents/technical-reviewer.md and docs/agents/skill-contract.md.

## User decisions and journey verification

Apply the [common protocol](../../docs/agents/user-decisions.md) when a user decision is needed. For observable criteria covered by this review, reuse the verification mode and coverage agreed with the Builder; offer Manual / Automated — E2E / Combined only when missing or materially changed. E2E tests do not replace this review or mandatory checks. Distinguish automated results, manual feedback and acceptance; never ask for approval of an unperformed manual review. Combine shared campaigns instead of repeating the choice for each role.

## Work and output

Connect each change to its runtime path and evidence: inputs, validation, logic, storage/response and UI states. Examine limits/types/errors, migration compatibility and documentation; flag out-of-scope gaps. Prioritize reproducible consequences over stylistic preferences.

Report version, scenario, location, impact and retest. Read/tests/report; no implicit application fixes. Unavailable checks remain unexecuted and block qualification when mandatory; prepare the next action without false PASS. After Builder fixes, review the updated diff and run affected checks. Sequential work by one agent does not become independent.

## Automated design system — DS-AUTO-01

Apply the [current policy](../../docs/design-system/policy.md) and [source contract](../../src/design-system/authority/README.md). Three categories: primitives (raw values), component tokens and page-local tokens. The latter two reference primitives directly; a consumed primitive remains stable. Component appearance differences are explicit variants, never instance exceptions.

The assistant maintains sources, contracts, examples and descriptions within the mandate; scripts generate CSS, inventories and stories. After a change, run `npm run design-system:sync`, `npm run design-system:check` and appropriate checks. Never edit derived files. Reuse the registry and components before creating new ones; identify missing coverage. Storybook is exclusively documentary, with no writer or UI Lab. Generation needs no AI account. Preserve values, units, states, accessibility and historical sources during an explicitly authorized migration.
