# 041 — Analyze requests and approve execution

**Date:** 19 November 2026.  
**Status:** logic approved by the kit owner; documentary application subject to review.

> Extension of 19 November 2026: [decision 042](042-assistant-choice-and-claude-routing.md) adds prior assistant choice and Claude Code policy. Codex-only references below describe initial scope; AGENTS defines current handling.

## Decision

Adopt [AGENTS request handling](../../AGENTS.md#traitement-des-demandes-et-validation-de-lexécution): direct informative answers; proposal/approval before new non-minor changes; direct minor execution under documented criteria followed by brief confirmation. Approval covers necessary checks/fixes within announced scope, without repeated approval for covered clarifications.

In Codex, track the model/effort pair from [current policy](../codex/chantier-model-routing.md). Display it for initial recommendations or changes, never routinely after every question. Initial/changed recommendations require approval before affected execution, including minor changes. Unchanged configuration does not waive approval of new non-minor scope.

## Scope and consequences

This supersedes decision 003’s systematic display and workflow 004’s immediate-execution provisions for initial requests. Qualitative model/effort thresholds remain. Other assistants apply common approval without invented equivalences. Manual client choice, priority instructions and permissions remain applicable; no technical blocking mechanism is added.

Tracking supports resumption of approved scope and last known recommendation. Its absence proves no client setting. Execution approval/structural checks are neither human acceptance nor native assistant qualification. Historical evidence stays dated and does not qualify this revision.
