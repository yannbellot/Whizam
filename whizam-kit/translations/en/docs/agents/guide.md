# Understand how assistants work

You define intent and examine results. The assistant prepares, implements and checks the authorized scope. Start with the [user guide](../guide-whizam/index.md). This page explains responsibilities; canonical instructions remain in local kit files.

## Roles and procedures

The Builder implements the work. Design, technical/QA and security reviewers examine the version and evidence in their specialty. Successive reviews by the same agent are declared non-independent. A skill describes a focused procedure; every request does not require the whole library. The [roles and skills reference](reference.md) helps identify what to change.

## Scoping, resumption and decisions

For a new project, the assistant collects missing information, saves answers and presents a summary for authorization before development. Devices, application languages and documentation languages are separate choices. An installation-only request retains its technical scope. In a new conversation, the assistant reads the brief and checkpoint to resume without reinitializing the project.

An informational question receives a direct answer. A new non-minor change requires a concrete proposal to approve; existing authorization covers necessary corrections and checks within that scope. Technical checks and your acceptance of the result remain separate. Local files `AGENTS.md`, `docs/agents/project-intake.md` and `docs/agents/user-decisions.md` define these rules for agents.

## Assistant adaptations

Codex enters through `AGENTS.md`, Claude Code through `CLAUDE.md`, Gemini CLI through `GEMINI.md`. Mistral explicitly reads `AGENTS.md`. Client context determines the applicable policy; no assistant questionnaire is required. Instructions and skills are delivered locally with internal relative links. Their presence does not demonstrate native discovery: see [compatibility](../compatibility.md).

Advanced [Codex](../codex/chantier-model-routing.md) and [Claude](../claude/chantier-model-routing.md) references describe model recommendations. They do not change client settings. Gemini and Mistral use common rules without invented model equivalents.

## Configuration, languages and shared sources

Use [private configuration](private-configuration.md) for secrets, [project languages](languages.md) for translations and [GitHub publication](../github-publication.md) to preserve sources. Never provide a token in conversation. Sending sources to GitHub and deployment are separate operations.

## Change an instruction

For example, to clarify a design reviewer responsibility, request a change to `agents/design-reviewer.md`, then check consistency with `docs/agents/skill-contract.md` and the `review-design` skill. The assistant preserves useful obligations, updates the translation and runs `npm run validate:agent-kit`. A new behavior needs appropriate scenarios; a file check does not prove model behavior.

Human publication and active instructions serve different purposes. An instruction can stay internal without becoming historical. The portal reference explains source locations without repeating all obligations. Former choices and evidence remain in historical sources, outside the current reading path.
