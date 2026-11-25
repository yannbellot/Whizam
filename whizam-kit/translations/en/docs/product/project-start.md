# Starting a project through its first version

This workflow covers scoping, technical preparation and implementation of a first version available for review. For a new product, first collect missing information and authorization of the summary under canonical scoping in `docs/agents/project-intake.md`. Technical preparation and development follow within the authorized scope.

An explicitly technical-only preparation request may use initialize-project without inventing product scope. This preparation is not a first application version. For a step-by-step presentation for designers, see [Getting started with Whizam](../guide-whizam/index.md).

## Mandate and progression

Apply [initial scoping](../agents/project-intake.md): conditional questions, conversational follow-ups and resumption from the brief/checkpoint. Do not ask which assistant is used; use its entry-point policy. Collect missing documentation languages at Q10 according to [Project languages](../agents/languages.md).

“Initialize a new project [name]” opens this workflow. The Builder scopes the product, obtains authorization of the summary, then prepares the environment through initialize-project. The name suffices to analyze preparation/present a proposal; before writes, installation or startup apply [execution approval](../../AGENTS.md#traitement-des-demandes-et-validation-de-lexécution). Collect intent during scoping, reusing known answers; an explicitly technical-only request does not require a product questionnaire.

Implement only a sufficiently defined first version covered by user mandate. Detailed briefs enable concrete proposals; initial implementation requests do not replace proposal approval. Approved proposals need no second technical authorization. If intent/implementation authorization is missing, propose scope and collect necessary product decisions before dependent development. Preparation-only stays documentary; technical-initialization-only stops after that sequence.

After approval, chain authorized operations when prerequisites are met and recommended configuration is unchanged. In Codex/Claude Code, present initial/changed recommendations before affected work and wait for approval; never repeat unchanged recommendations. Sequence names are landmarks, not mandatory human stops. Limited reversible product/visual assumptions stay explicitly provisional under AGENTS; missing material decisions block only dependent work.

<a id="1-initialisation-du-projet"></a>
<a id="source-1-initialisation-du-projet"></a>
<a id="2-cadrage-de-la-premiere-version"></a>
<a id="source-2-cadrage-de-la-premiere-version"></a>

## 1. First-version scoping

**Result: observable first-version scope.** With analyze-brief, brief-to-specs and relevant design procedures, clarify objective, audience, pages/journeys, available content, behavior and visual direction. Designers can supply references; Figma is optional. Ask only questions that affect next steps, grouped when possible.

Restate what will actually be visible/usable, exclusions, provisional items and success criteria. Never invent identity, achievements, editorial content or services to fill gaps. Flag missing content; isolate synthetic test data. Name simulated prototypes as such and state limits.

Apply [initial scoping](../agents/project-intake.md): conditional questions, conversational follow-ups and resumption from the brief/checkpoint. Do not ask which assistant is used; use its entry-point policy. Collect missing documentation languages at Q10 according to [Project languages](../agents/languages.md).

## 2. Project initialization

**Result: project initialized.** initialize-project checks existing state, prepares environment/tracking and executes checks. Starter-example functionality may support internal checks; it does not represent the requested project.

Explain that preparation is complete and continue the authorized implementation, or stop for a technical-only request. Do not present demonstration/Storybook links as this sequence’s result or claim the application is ready. Commands, diagnostic URLs and detailed results remain in technical tracking.

## 3. Design and development

**Result: first version implemented and checked within agreed scope.** plan-feature prepares slices; design-interactions, implement-feature and test-user-flow take over as needed. The Builder retains sequence-level resumption notes in existing documents without marker files or reinitialization.

In derived projects, follow [adaptation of former example resources](replacing-project-example.md): the home page is empty and demonstrations are already absent from active routes. Build authorized flows and adapt the resources, stories, tests and documents actually reused. Project-management features follow neither `/projects` naming nor its presence in the kit. Never implicitly delete data, tables, applied migrations or volumes.

Retain useful reusable components and prepare a relevant Storybook entry for project components, variants and states. Generic development documentation may remain available; fictional starter business demos are not part of the presented first version.

Servers/URLs may support internal checks before review. Startup triggers no delivery; this presentation rule creates no technical access barrier. Verify agreed pages/journeys and affected components, perform applicable reviews and record limits; HTTP 200 or successful builds alone prove no product outcome.

## 4. First-version review

**Result: first version available for review.** Present the three verified access points together: **Application** to the implemented project, **Storybook — project components**, and **Documentation** to project references and progress. Renamed generic pages, unchanged `/projects` or starter-only stories do not satisfy this criterion.

Check actual served URLs/content before presenting; never reuse an old port without checking. If access, indispensable observation or required checks are missing, explain what and how to resume; do not mark complete. Partial functionality may be described with limits, never false success.

Explain what the designer can explore, provisional content/behavior and precise useful feedback points. Feedback concerns understanding, hierarchy, journeys or visual direction as appropriate. First-version review replaces neither final acceptance, applicable full checks nor third-party handoff.

For Manual/Combined, provide the checklist and collect [explicit feedback](../agents/user-decisions.md#retour-de-recette-manuelle), leaving manual review pending when needed. Report E2E separately. Collect [result acceptance](../agents/user-decisions.md#acceptation-du-résultat) when criteria allow; checklist approval alone is not global acceptance. Combine only if scope/question explicitly say so.

## Reporting and resumption

Apply [designer communication](../../AGENTS.md#communication-avec-le-designer): current sequence, concrete result, availability/limits and next action. Keep internal statuses/detailed evidence in tracking. Offer natural-language stop/restart instructions only when relevant; do not append routine commands/maintenance directions.

For initialized projects, read tracking, recover actual sequence reached/open decisions. Do not reinitialize for new conversations or ordinary features. Historical kit evidence does not become project evidence. Workflow questions authorize no execution; publication/external services keep separate authorization.

## Project documentation

Review presents Application, Storybook and Documentation after checking content. Zensical ships with the kit; see the [documentation guide](../documentation.md). It reads current Markdown without maintenance parent or host Python.


Scoping exception: an explicit start request immediately authorizes minimal answer/welcome recording, without technical initialization or development. Use the save-and-reread helper before every next question under [canonical scoping](../agents/project-intake.md). This grants no other authorization.
