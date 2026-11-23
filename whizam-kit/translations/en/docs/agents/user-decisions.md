# Multiple-choice questions and user decisions

Common decision-presentation/handling authority under [instructions](../../AGENTS.md). [Decision 043](../decisions/043-user-decision-protocol.md). Uses client tools; adds no application form/execution engine.

## When to ask

Use for genuinely needed decisions: product/visual decisions, verification mode, execution approval, review feedback, version acceptance or blocking decisions. Scoping questions may stay open when options would be artificial; allow suitable free clarification. Do not ask for information-only replies, reports or already authorized minor fixes. Reuse explicit answers/agreements; repeat no decision without material change.

State context, subject and scope; offer distinct understandable options. Prefer single selection. Reserve multiselect for actually cumulative decisions, never Yes/No or approved/not approved states. Verification recommendations concern observed coverage; model/effort recommendations follow existing policies and repeat only for changed/unknown pairs.

## Native presentation and free text

Check available tools/current-mode rules. In Codex use exposed user-request tools such as `request_user_input_async` or permitted `request_user_input`. In Claude Code use available `AskUserQuestion`. Never change mode/provider/permissions/personal configuration to force questionnaires.

Keep native free text or notes when supplied by the client. Their absence does not justify replacing native choices with text or asking another question for optional comments. If an essential detail is missing after a choice, collect it in normal conversation; otherwise continue without requesting notes. The client controls appearance and position; do not promise a field beneath buttons.

Do not add “Other requests or details — optional”, note examples or fake field labels to question titles, options or repeated paragraphs after questions. Use the native free-text input as provided by the client, without simulating or relocating it. An explicit free-text answer can replace a selected option; otherwise ask only necessary clarification. Apply this to every question, including verification, authorization and acceptance.

### Call the tool rather than simulate controls

Before multiple-choice questions inspect exposed tools. If an authorized available tool fits, **call it**: response lists do not satisfy this rule. In Codex prefer available `request_user_input_async`; do not call `request_user_input` in prohibited modes. For work-proposal approval use native questions only when tool rules permit; do not confuse it with system/tool permissions, which retain their mechanism.



For approval, for example title “Do you approve Atlas preparation and the described checks? ” with “Yes, I approve” / “No”. Other tools have their own schemas; never pass this JSON without checking contracts.

A scoping question is a pending decision. Acceptance of an asynchronous call means only that the question was sent: `accepted`, an identifier, preselection, dismissal or expiration is never an answer. **After the asynchronous call, keep the turn active using an interruptible waiting mechanism actually exposed by the client. Do not end the turn, even with an empty final message, while the answer is missing.** Add no conclusion, next question, assumed branch, demonstration, initialization or independent work during this wait.

In a client exposing `clock.sleep`, wait with interruptible calls of at most 60 seconds. When an explicit answer interrupts the wait, resume only the selected branch. If waiting expires without an answer, wait again: elapsed time is not a decision deadline and triggers neither assumptions nor defaults. Do not repeat the same question. Handle other incoming messages without inventing a choice; explicit cancellation stops the wait. Never substitute a shell sleep or busy loop, which cannot receive client answers.

Choose the mechanism BEFORE sending the question: an authorized blocking questionnaire if available; otherwise an asynchronous questionnaire with interruptible waiting. If neither is available, or the tool contract restricts it to optional decisions, ask in a normal final conversational message with an explicit text fallback and wait for the next user message. Do not send an asynchronous selector when the turn must immediately end. Change no client mode, timeout, account or permissions to force this mechanism. The kit does not control the selector's graphical lifecycle; if it closes unanswered, keep the choice unknown and offer conversational fallback, never an assumed branch. An interruption leaves the question pending in project progress, not answered.

Without a suitable authorized tool explicitly say “Text choice: reply with the desired label”, then give a numbered list. No `○` circles, checkboxes or fake inputs in fallback; never call it interactive. Illustrations below describe labels/decisions only and must never be copied as user-facing buttons.

For approval use native tools only when permitted, otherwise the same question in text. Preferences do not authorize execution. Native client permissions are separate.

Documentary references: [Codex tool](https://github.com/openai/codex/blob/main/codex-rs/core/src/tools/handlers/request_user_input_spec.rs), [Claude Code tool](https://code.claude.com/docs/en/tools-reference#askuserquestion-tool-behavior). Consulted 19 November 2026; inspect actual capabilities without inferring native trials from documentation.

## Initial scoping

Follow [the canonical questionnaire](project-intake.md). Do not ask for the assistant. Do not add repeated detail prompts to question titles. Required follow-up material is collected through normal conversation, not another selector. Actual client capabilities determine the interface.

## Choose verification mode

Before implementation identify affected journeys/required reviews. Offer when changes affect navigation, forms, interaction, conditional rendering or persistence. Explain scenarios/recommended mode based on available tools/evidence. Combine journeys/reviews sharing campaigns; do not repeat choices per reviewer for identical coverage.

| Mode | Execution and evidence |
| --- | --- |
| **Manual** | Prepare short actions/expected-results checklist. User executes; pending until explicit feedback. Providing access proves no success. |
| **Automated — E2E** | Create/adapt/run useful scenarios on identified versions/authorized isolated resources. Report results/evidence/limits; script presence is not execution. |
| **Combined** | Behavioral E2E plus human understanding/rendering/comfort review. Report each separately. |

Example after coverage description:

> How would you like to check these journeys? I recommend Combined to verify behavior and examine rendering.
>
> ○ Manual  
> ○ Automated — E2E  
> ○ Combined
>

Choice replaces neither design/technical/security reviews nor mandatory technical checks. Do not ask for purely documentary changes or genuinely local colors without journey implications. Preserve AGENTS minor exception; material coverage decisions need prior proposals.

If E2E prerequisites are missing, disclose/propose alternatives for decision without silently switching to manual or claiming success. Unavailable required results block their qualification.

## Execution approval

Describe expected result, scope, coverage/selected mode. Mode choice is not execution agreement; request one approval if missing:

> I will use Combined for these scenarios. Do you approve project preparation, this page’s implementation and these checks?
>
> ○ Yes, I approve  
> ○ No
>

The question concerns “Execution approval”, not “Manual”, which is a verification mode. Already explicit agreement on this proposal, e.g. “Combined, I approve execution”, suffices without another question. Agreement covers implementation/checks/documentation/necessary fixes within announced scope, not publication or acceptance.

## Manual review feedback

For Manual/Combined provide version, verified access points, actions/expected results, then ask:

> After following this checklist, what is your feedback?
>
> ○ I approve the manual review  
> ○ Manual review not approved
>

Approval reports user observation, not AI browser observation. Without feedback mark pending. In Combined, approved manual review does not erase failed/unexecuted E2E. Refusal without comments suffices to withhold approval; request only diagnostic details needed. Existing bounded diagnosis applies without new attempt limits.

In Automated — E2E, report agreed results without asking users to attest an unselected manual checklist. Human review/milestone acceptance remain separate when required.

## Result acceptance

When required criteria/checks allow presenting a version for acceptance:

> Required checks are complete. Do you accept this version within agreed scope?
>
> ○ I accept this version  
> ○ Adjustments are still needed
>

Combine checklist/acceptance only for identical scope, passed other mandatory checks and questions explicitly naming both, e.g. “After review, do you accept this version within agreed scope?” Options must cover both decisions: “I approve review and accept this version” / “Adjustments remain necessary”. Checklist approval alone is not global acceptance. Missing mandatory checks require disclosing limits/collecting feedback without presenting qualification.

## Interpreting choices and instructions

| Reply | Action |
| --- | --- |
| Explicit unconditional agreement | Continue only within presented scope. |
| Agreement with compatible clarification | Incorporate limited reversible clarification into mandate and continue. |
| Agreement conditional on prerequisite/material change | Adjust proposal and obtain necessary approval before dependent execution; never ignore conditions. |
| Refusal or unapproved checklist | Do not cross the step; use comments/request only needed clarification. |
| Choice contradicts instruction | Clarify; never automatically prioritize Yes buttons. |
| Free note alone with explicit decision | Apply expressed decision/limits without requiring equivalent selection again. |
| Ambiguous note, silence, closing, expiry or mere preselection | No implicit agreement. Await useful decisions; automatic returns grant no authorization. |

Keep mode/coverage for slice corrections/retests. Ask again only for material scope/coverage/consequence changes or user requests. After write authorization retain decision/scope/reservation, source assistant, mode, coverage, version/evidence in project tracking; no extra decision marker files; local assistant preference follows AGENTS exception. Roadmap/resumption notes remain in the target project.

## Confidential data

Native questions/notes are not secret-entry channels. Passwords/tokens/keys use [private configuration](private-configuration.md): local entry outside chat or directly opened private files. Ask only save confirmation, never values.

## Documentation language

Apply [initial scoping](project-intake.md): conditional questions, conversational follow-ups and resumption from the brief/checkpoint. Do not ask which assistant is used; use its entry-point policy. Collect missing documentation languages at Q10 according to [Project languages](languages.md).