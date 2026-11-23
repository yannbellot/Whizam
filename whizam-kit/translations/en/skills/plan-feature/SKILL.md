---
name: plan-feature
description: "Prepare an implementable slice with dependencies, files, checks and criteria; use a short format for small changes or bounded prototypes."
---

> Documentation translation. The canonical skill remains `skills/plan-feature/SKILL.md`.

# plan-feature

Inputs: scoped specification/correction, Git state and available checks. Read docs/agents/skill-contract.md.

## Work

For a first version, reuse the sufficiently defined authorized scope of the [startup workflow](../../docs/product/project-start.md). Include joint Application/Storybook review criteria, removal of demonstrations from the derived user journey and checks of the actual result. Initialized projects resume here without restarting initialize-project.

Inspect execution points and define the smallest coherent change: surfaces, exclusions, dependencies, data, required reviews and evidence. Choose relevant package commands and isolated targets. Do not reopen the default stack or invoke the entire skill library. A short plan suffices for a few files without new contracts.

For modified journeys, apply the [decision protocol](../../docs/agents/user-decisions.md#choisir-le-mode-de-vérification): prepare coverage and recommendation, offer Manual / Automated — E2E / Combined when relevant and collect useful execution approval. Reuse approved scope’s mode/coverage. Before agreement, keep the proposal in chat. Mandatory technical checks apply in every mode.

Prototype mode: identify the uncertainty to resolve, simulations/shortcuts, duration or exit condition and disposable files; never present it as a complete persistent journey.

## Output and checks

A work item in the target’s docs/work-items, containing environment, steps, criteria, assumptions and next action, or an update to an existing item. Explicit multi-project mandates distribute deliverables under the common contract. Check prerequisites before implementation. Preparation-only instructions stop at the document; an already approved execution scope can continue under AGENTS. Before agreement, keep proposals in chat without creating files or changing the project; an initial request alone does not waive approval. Stop only work dependent on an unverifiable mandatory prerequisite or material decision.
