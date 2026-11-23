---
name: brief-to-specs
description: "Formalize behavior and acceptance criteria from a scoped brief before building a journey or changing its rules."
---

> Documentation translation. The canonical skill remains `skills/brief-to-specs/SKILL.md`.

# brief-to-specs

Inputs: canonical target, brief, constraints/authorities and existing rules. Common contract: docs/agents/skill-contract.md; resolve paths in the target.

## Work

Describe journeys, input/data rules, applicable permissions, errors and exclusions. Link every expected outcome to an observable check, including refusals/absence and persistence when relevant. Separate intended behavior from implementation detail; do not add accounts, deletion or technology merely to complete an example.

## Output and checks

Create/update the specification with assumptions and testable criteria in docs/product/features at the project root, or the source explicitly designated by the mandate. Check consistency with schema, design and scope without treating code as automatically authoritative. Contradictions or material decisions block their implementation; limited assumptions remain explicitly provisional. Technical planning follows if implementation is requested.
