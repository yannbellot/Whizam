---
name: test-user-flow
description: "Verify real application journeys and effects using isolated data and persistence evidence when relevant; do not substitute a story."
---

> Documentation translation. The canonical skill remains `skills/test-user-flow/SKILL.md`.

# test-user-flow

Inputs: criteria, served version, available environments/tools and synthetic data. Read docs/agents/skill-contract.md and docs/operations.md for the campaign.

## Work

For a first version, check [joint review criteria](../../docs/product/project-start.md#4-revue-de-la-première-version): application URL for the real project, agreed pages/journeys, Storybook entry for used components and relevant states, no demonstration passed off as the result. Working URLs without this content are insufficient.

Apply the [common protocol](../../docs/agents/user-decisions.md) and selected mode for approved coverage. In Manual, supply the checklist and wait for explicit feedback; do not present it as AI-executed. In E2E, adapt/run agreed scenarios; in Combined, separate those results from human review. Reuse the mode for same-scope retests.

Depending on mode, have the user check or automatically execute positive journeys and relevant refusals/errors, not merely final screenshots. Identify browser/formats, inputs/actions and observed results. Distinguish component, server and database; for writes, reread after loading and restart if requested. Use runners that own their resources; never target an existing database for convenience.

## Output and checks

Collect [manual review feedback](../../docs/agents/user-decisions.md#retour-de-recette-manuelle) in Manual/Combined and leave it pending without a reply. Successful E2E is not human acceptance; approved manual review does not hide failing automation.

A versioned report with commands/scenarios, PASS/FAIL/not executed, redacted evidence and limits. Check identity-based cleanup and retain initial failures and retests. Unavailable tools cannot produce invented screenshots; prepare missing review and continue independent checks. Agent tests are neither human review nor third-party handoff.
