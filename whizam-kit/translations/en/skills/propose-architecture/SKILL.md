---
name: propose-architecture
description: "Check starter suitability and propose architectural changes justified by concrete needs, without routinely reopening the stack."
---

> Documentation translation. The canonical skill remains `skills/propose-architecture/SKILL.md`.

# propose-architecture

Inputs: canonical target, brief/specification, constraints, existing architecture and decisions. Read docs/agents/skill-contract.md in the kit, then docs/architecture.md in the target project root.

## Work and output

Identify the unmet need, then compare the smallest adaptation with migration/recovery costs. Explain responsibilities, flows and boundaries before structural refactoring. Keep an integrated application unless a demonstrated need requires a separate backend; do not select technology merely for appeal.

Produce a proposal/decision with relevant alternatives, assumptions, consequences, migration items and checks. Undelegated structural decisions are submitted under AGENTS before implementation; investigation creates neither architecture nor empty files. Update target docs/decisions and architecture only within authorized scope, using links for decisions spanning explicitly authorized projects. When sources do not cover the need, state uncertainty and limit the proposal.
