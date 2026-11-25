# Roles and skills reference

Read [how assistants work](guide.md) first. Paths below are local kit source locations, not mandatory reading for each request. Edit canonical sources and preserve their internal adapters.

## Roles

| Role | Responsibility | Source |
| --- | --- | --- |
| builder | Implement authorized changes | `agents/builder.md` |
| design-reviewer | Review visual fidelity and user experience | `agents/design-reviewer.md` |
| technical-reviewer | Review contracts, tests and regressions | `agents/technical-reviewer.md` |
| security-reviewer | Review access, secrets and input risks | `agents/security-reviewer.md` |

## Skills

| Skill | Purpose | Local source |
| --- | --- | --- |
| `publish-github-project` | Prepare, publish and update project sources on GitHub after commits or on demand; resume, change mode or suspend sends. | `skills/publish-github-project/SKILL.md` |
| `initialize-project` | Prepare or resume technical project initialization from the starter: environment, tracking and checks, then hand over to scoping. Not for ordinary features or corrections. | `skills/initialize-project/SKILL.md` |
| `analyze-brief` | Clarify a new or incomplete brief, separating intent, constraints, ambiguities and assumptions; do not implement during analysis. | `skills/analyze-brief/SKILL.md` |
| `brief-to-specs` | Formalize behavior and acceptance criteria from a scoped brief before building a journey or changing its rules. | `skills/brief-to-specs/SKILL.md` |
| `plan-feature` | Prepare an implementable slice with dependencies, files, checks and criteria; use a short format for small changes or bounded prototypes. | `skills/plan-feature/SKILL.md` |
| `design-interactions` | Define UI journeys and transitions including validation, loading, cancellation, errors and recovery, without inventing visual references. | `skills/design-interactions/SKILL.md` |
| `implement-feature` | Implement an explicitly authorized slice in code, tests, stories and documents; distinguish prototypes from complete functionality. | `skills/implement-feature/SKILL.md` |
| `test-user-flow` | Verify real application journeys and effects using isolated data and persistence evidence when relevant; do not substitute a story. | `skills/test-user-flow/SKILL.md` |
| `update-project-docs` | Reconcile documents directly affected by verified changes, preserving one source per rule and keeping long evidence out of the current-state summary. | `skills/update-project-docs/SKILL.md` |
| `review-design` | Review reference fidelity and UX/UI quality as separate readings without accepting design on behalf of the designer. | `skills/review-design/SKILL.md` |
| `technical-review` | Review a version or diff for contracts, execution paths, tests and regressions with reproducible findings and retesting after fixes. | `skills/technical-review/SKILL.md` |
| `security-review` | Perform a proportionate security review with evidence about inputs/access/data, dependencies and limitations; no certification or real-target testing. | `skills/security-review/SKILL.md` |
| `propose-architecture` | Check starter suitability and propose architectural changes justified by concrete needs, without routinely reopening the stack. | `skills/propose-architecture/SKILL.md` |
| `analyze-design-references` | Analyze supplied visual references, separating observation, interpretation and questions. | `skills/analyze-design-references/SKILL.md` |
| `normalize-design-system` | Structure primitives, component tokens, local tokens and usage from existing authorities, preserving visual direction and a single source for each decision. | `skills/normalize-design-system/SKILL.md` |
| `map-figma-to-components` | Map accessible Figma elements to project components and states; activate only for a supplied usable Figma reference. | `skills/map-figma-to-components/SKILL.md` |
| `data-permissions-migrations` | Define or evolve schemas, validation, ownership and data permissions with replayable PostgreSQL/Drizzle migrations and isolated tests. | `skills/data-permissions-migrations/SKILL.md` |
| `prepare-release` | Qualify a local version at its announced delivery level and collect evidence, reservations and final decisions without implicitly publishing. | `skills/prepare-release/SKILL.md` |
| `deploy-docker-compose` | Prepare and verify Docker Compose execution on an identified authorized target, with explicit data, configuration, checks and rollback. | `skills/deploy-docker-compose/SKILL.md` |
| `diagnose-incident` | Connect a symptom or failure to observations, tested hypotheses and a verified cause, then fix within scope and retest. | `skills/diagnose-incident/SKILL.md` |
| `backup-and-rollback` | Prepare and verify backups, isolated restoration and version rollback while checking code/schema compatibility; no implicit reset. | `skills/backup-and-rollback/SKILL.md` |
| `prepare-handoff` | Prepare a third-party handoff with repository, prerequisites, decisions, evidence and limits, without conversation history. | `skills/prepare-handoff/SKILL.md` |

## Verify and resume

Run `npm run validate:agent-kit` after changing the library. Resume from the brief, roadmap and checkpoint. See [compatibility](../compatibility.md) for the distinction between structural validation and native assistant tests.
