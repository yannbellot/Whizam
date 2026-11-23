---
name: review-design
description: "Review reference fidelity and UX/UI quality as separate readings without accepting design on behalf of the designer."
---

> Documentation translation. The canonical skill remains `skills/review-design/SKILL.md`.

# review-design

Inputs: canonical target, actually accessible reference, criteria, version and formats. Read agents/design-reviewer.md and docs/agents/skill-contract.md in the kit; resolve product references/reports in the target project.

## User decisions and journey verification

Apply the [common protocol](../../docs/agents/user-decisions.md) when a user decision is needed. For observable criteria covered by this review, reuse the verification mode and coverage agreed with the Builder; offer Manual / Automated — E2E / Combined only when missing or materially changed. E2E tests do not replace this review or mandatory checks. Distinguish automated results, manual feedback and acceptance; never ask for approval of an unperformed manual review. Combine shared campaigns instead of repeating the choice for each role.

## Work and output

First compare the render with its reference: demonstrated defect, technical adaptation, approved decision or undetermined. Then examine experience: hierarchy/actions, labels/states, recovery, keyboard/focus, contrast and mobile/desktop behavior. A screenshot does not demonstrate interaction; an automated score does not prove exhaustive compliance.

Produce the common report with localized findings, available evidence and impact, distinguishing reservations from design proposals. Tests/report only. Do not invent missing references; identify the impossible reading and continue the possible one. After Builder corrections, identify the retested version and necessary checks only. Visual acceptance and independence are never implicit.

## Automated design system — DS-AUTO-01

Apply the [current policy](../../docs/design-system/policy.md) and [source contract](../../src/design-system/authority/README.md). Three categories: primitives (raw values), component tokens and page-local tokens. The latter two reference primitives directly; a consumed primitive remains stable. Component appearance differences are explicit variants, never instance exceptions.

The assistant maintains sources, contracts, examples and descriptions within the mandate; scripts generate CSS, inventories and stories. After a change, run `npm run design-system:sync`, `npm run design-system:check` and appropriate checks. Never edit derived files. Reuse the registry and components before creating new ones; identify missing coverage. Storybook is exclusively documentary, with no writer or UI Lab. Generation needs no AI account. Preserve values, units, states, accessibility and historical sources during an explicitly authorized migration.
