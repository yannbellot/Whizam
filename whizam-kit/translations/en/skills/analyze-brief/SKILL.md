---
name: analyze-brief
description: "Clarify a new or incomplete brief, separating intent, constraints, ambiguities and assumptions; do not implement during analysis."
---

> Documentation translation. The canonical skill remains `skills/analyze-brief/SKILL.md`.

# analyze-brief

Canonical scoping of a new product precedes installation; technical preparation mentioned below is a possible handoff for an explicitly technical-only request, not a prerequisite for collecting the brief.

Inputs: request, canonical target and existing authorities, current state. Read AGENTS.md and docs/agents/skill-contract.md; resolve authorities and deliverables in the target according to that contract.

## Work

When starting a project, follow [first-version scoping](../../docs/product/project-start.md#2-cadrage-de-la-première-version) before technical preparation for a new product: collect known or missing intent, then define pages/journeys, available content and visual direction needed for the first observable result. Separate agreed scope from open proposals; missing product information does not authorize invention.

Restate the observable outcome and exclusions; look for contradictions with existing briefs/specifications. Separate observed facts, reversible assumptions and material decisions. Technical information available in the repository is not a product question. Do not invent users, budgets, accounts or services; a non-material ambiguity can remain documented until final review under AGENTS.

## Output and checks

A short brief or scoping note containing target, objective, limits, assumptions, genuinely blocking decisions and next action. Update the project’s docs/product/brief.md only when the mandate covers that intent, or use the explicitly designated intent source. Record conflicts; stop the part dependent on a material decision. This skill alone authorizes no application changes or installation.


Scoping exception: an explicit start request immediately authorizes minimal answer/welcome recording, without technical initialization or development. Use the save-and-reread helper before every next question under [canonical scoping](../../docs/agents/project-intake.md). This grants no other authorization.
