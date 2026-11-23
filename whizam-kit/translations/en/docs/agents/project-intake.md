# Initial scoping and project resumption

Questionnaire authority under [AGENTS](../../AGENTS.md) and the [decision protocol](user-decisions.md). Applies to a new project request, not an informational question or an existing project's routine correction. Read the current project's brief, progress and recorded answers first.

## Two levels without repetition

Before each scoping question choose the [question and wait mechanism](user-decisions.md#appeler-loutil-sans-simuler-ses-contrôles). For asynchronous questions keep the turn active with available interruptible waiting, without even an empty final message. Renew expired waits without default choices. Without compatible waiting, ask a final conversational question instead. Ending the turn does not mean waiting for the selector answer.

First level: use the available authorized native question tool. Native free text remains available without repeated captions or examples in question titles. Fall back explicitly to conversation when needed. Never simulate interactive Markdown controls. A preselection, dismissal, timeout or silence is not an answer. Device/language combinations require at least one explicit value. Q6 uses the successive workflow below; Q9/Q10 use their native single choices without an open question justified by missing multi-selection.

Second-level content collection (text, name, links, files or open details): ask in conversation without a questionnaire tool or dedicated field. Closed follow-up decisions such as default language and translation use native choices. Wait for a normal message containing text, links, paths or supported attachments. Report inaccessible references. A Yes without the promised material remains pending. Existing answers in the brief, notes or project records skip both levels. Clarify contradictions; never demand an optional note when the choice suffices.

## Entry — brief, only when absent from the first message

When starting a new project, the very first visible assistant message must be exactly the welcome below, without an “I will check/read…” preamble. It may be commentary before tools; after necessary reads, call the native entry question if the brief is missing. Do not repeat the welcome for a known resumption. Higher-priority client instructions still apply:

> **👋 Welcome to Whizam**  
> Let's create your application together.

Display this welcome once per project, not in every conversation. Record “welcome presented” in the existing checkpoint after displaying it and read progress before resumption. Create no additional local file and do not write this marker into the distribution template. For an already active project, resume directly without a retrospective welcome. Informational or maintenance requests do not trigger it. When a brief is supplied immediately, analyze it after the welcome without asking the entry question. Keep the other questions free of icons.

**Do you have a brief for your project?** A brief describes what you want to create, for whom and why.

- I don't have a brief — guide me.
- I have a brief.
- I want to create a demo project to try Whizam.


After “I have a brief”, if missing, ask in conversation: “Send your brief in your next message. You can enter text, attach a document or provide a link or path.” Wait and extract known answers. Without a brief start Q1. An informational request does not start this workflow.

## Q1 — Name

**Do you have a name for your project?**

- Yes — I want to provide a name.
- I don't have a name — suggest a suitable provisional name.


If Yes without a name: “What name would you like to give your project?” Otherwise suggest a provisional name after learning the objective. Never implicitly rename folders, packages or resources.

## Q2 — Objective and users

**Have you defined your application's objective and intended users?**

- Yes — I want to describe my idea and its users.
- I don't have a precise objective — suggest an application idea and audience from the available context.


If Yes without a description: “Describe what you want to create, the need it should address and the people who will use it.” Otherwise prepare a proposal, never present invented needs as accepted requirements or develop them before authorization.

## Q3 — First version

**Do you know what the first version should allow users to do?**

- Yes — I want to describe my requirements.
- I haven't defined the scope — suggest a first version suited to the project's objective.


If Yes without scope: “Describe the priority features, pages or journeys for the first version.” Otherwise propose a scope for validation.

## Q4 — Content

**Do you have content for your application?** Text, photos, videos, data, etc.

- Yes — I want to provide content.
- No — use placeholder content.


If Yes without content: “Send your content in your next message: text, photos, videos, data, etc. You can enter text, attach files or provide links or paths.” Clearly identify placeholder content as provisional, never as real designer information.

## Q5 — Visual references

**Do you have visual references to guide the design?** Mockups, screenshots, inspiration websites, brand guidelines, etc.

- Yes — I want to provide visual references.
- No — I want the assistant to suggest a visual direction.
- I don't know yet — I'll specify this later.


If Yes without references: “Send your visual references in your next message: mockups, screenshots, inspiration websites, brand guidelines, etc. You can attach files or provide links or paths.” Check accessibility. If No, propose a direction. If deferred, keep the decision open and identify any necessary direction as provisional in the synthesis.

## Q6 — Devices

Reuse device requirements already in the brief or saved answers. Otherwise first ask this native single choice:

**Would you like your application to be optimized for the main platforms?**

- Yes — optimize for computer, tablet and mobile screens.
- No — I want to select only certain formats.

After Yes, save `q6.platforms`, all three devices and the final combination `q6`, then proceed directly to Q7 without another device question.

After No, save `q6.platforms`, then ask the following three questions **successively**, in this order, with native single choices Yes / No. Each call contains only one device question: wait for the explicit answer, save it and read it back before asking the next. Do not group the three questions into one form.

### Computer

**Would you like to adapt your application to computer screens?**

- Yes
- No

### Tablet

**Would you like to adapt your application to tablet screens?**

- Yes
- No

### Mobile phone

**Would you like to adapt your application to mobile phone screens?**

- Yes
- No

Keep native free text available for each question without repeated “Other requests or details” captions or promises about its position. This workflow replaces custom checkboxes and cumulative selectors even when the client supports multi-selection. Silence, preselection, timeout or dismissal are not answers; follow the waiting protocol before progressing. If native choices themselves are unavailable or prohibited, use the protocol's explicit conversational fallback, still one question at a time.

Save answers as `q6.computer`, `q6.tablet`, `q6.mobile`, then the final combination as `q6`. After each answer, `pending` identifies the next unknown device; do not mark an unprocessed device No. The opening No requests custom selection, not rejection of all three devices. Reuse device choices already supplied in the brief, previous answers or free text and skip their questions. On resumption ask only the next missing question; changed wording must not restart Q6 for a scoped project.

An additional format may be supplied spontaneously in native free text; save it as `q6.other` without adding a fourth routine device question. Ask a conversational follow-up only if this format remains unspecified. Require at least one explicit format: after three No answers without another known format, stay at Q6 and ask conversationally which format should be supported, without imposing one or proceeding to Q7. Once missing choices are collected and at least one format is selected, save the final combination and resume at Q7. Demonstrations already propose all three and skip this question once accepted. Define sizes and verification criteria in the synthesis.

## Q7 — PWA

**Would you like the application to be installable as an application (PWA) on compatible devices?**

- Yes
- No — or I'll specify this need later.


If Q7 is No/deferred, skip Q8 and proceed directly to Q9. Do not ask Q8 again in a new conversation for that same choice. Record Q8 as “not asked — Q7 No branch”, not as a user answer. Preserve any existing offline requirement in the brief or previous replies; never erase known requirements.

The second answer excludes PWA installation from the current scope without permanently rejecting it or repeating the question in every conversation. Notes can distinguish a refusal from a deferral; do not require another question just for that distinction.

## Q8 — Offline access

**Would you like the application to be accessible without a network connection?**

- No — or I'll specify this later. The application should simply indicate that a connection is required.
- Yes — only to view content stored on the device, without modifications.
- Yes — to work offline, view and modify data, then synchronize when the network returns.


Ask Q8 only after Yes to Q7 and only if the answer is unknown. After No to Q7, skip Q8, including for demonstrations. If viewing scope is unknown: “Which content should remain accessible without a network connection?” If editing: “Which data should remain viewable and editable offline, then synchronize when the network returns?” Clarify material conflict, failure and retained-data decisions before implementation. The first choice requires a connection-needed message, without automatically reopening a deferral.

## Q9 — Application languages

**In which language(s) should your application be available?**

Native single choice, without a requested preselection:

- Français
- English
- Français et English
- Other language combination


These choices map to `fr`, `en`, both, or languages to specify. For Other without details, ask conversationally: “Specify the application languages, including French or English if desired.” For several languages without a known default, ask a native single choice: “Which selected language should be used by default?”, with only selected languages as options. Conversation, business and documentation languages are separate.

## Q10 — Documentation and Storybook languages

**In which language(s) would you like documentation and Storybook explanations?**

Native single choice, without a requested preselection:

- Français
- English
- Français et English
- Other language combination


For Other without details, ask conversationally: “Specify the documentation and Storybook languages, including French or English if desired.”

Ask about translating existing content only when at least one additional documentation language other than `fr`/`en` was selected AND actual active content lacks its translation AND the migration decision is unknown. Inspect the relevant sources, registries and translations first; never invoke hypothetical existing content. Only then ask a native two-option question (Translate the relevant content before presentation / Keep existing content for now): “Would you like to translate existing documentation and Storybook explanations into the selected additional languages before their first presentation, or retain existing content for now and use these languages for new content?”

For French, English or both alone, ask no existing-content translation question and recommend no migration. Preserve existing versions; writing and reading preferences do not imply translating delivered content. Without content to translate, or with a known decision, ask no additional question.

For Q9/Q10, missing native multi-selection no longer permits an open-text fallback: call native single choices and follow the waiting protocol. If the authorized schema permits at most three options, offer French / English / Several or another language, then a second native choice Both French and English / Other language combination for the last branch. Reuse known answers. Text fallback remains reserved for unavailable or prohibited native mechanisms themselves, not merely missing checkboxes. Q10 remains the last scoping question.

## Automatic demonstration and authorization

Generate a brief covering Q1–Q6: name, objective/audience, a small first version with a main journey, fictional content, visual direction and **Computer / Tablet / Mobile**. Respect user details. By default require no external account, paid service or real data. Do not decide Q7–Q10. A replacement proposal changes the actual concept or journey, not just its name.

Present the brief then ask **Does this demonstration project suit you?**

- This brief suits me — continue with the final choices before implementation.
- Suggest another demonstration brief.


Agreement stores the brief and resumes at Q7 through Q10 with the conditional branches: Q7 No skips Q8; Q9/Q10 use native choices; stock translation is restricted to the specified additional-language case. Rejection generates a different proposal taking notes into account and repeats the choice. Material changes require an updated proposal; clarify contradictory answers. Do not develop before authorization of the complete synthesis. Do not ship this demonstration as initial kit content or reactivate old examples.

After the verification-mode reply, record it under `verification` before asking for implementation authorization. A verification preference is not development approval.

After scoping present the observable result, inclusions/exclusions, hypotheses, content, visual direction, devices, PWA, offline access, languages, translation scope and verification coverage/mode. Obtain one concrete authorization if missing; reuse an explicit authorization for the same scope. Delivery acceptance and publication remain separate.

## Persistent state and authorization

An explicit start request (“Let’s start”, new project or demonstration) authorizes minimal recording of scoping answers and welcome status, without installation or development. This narrow exception does not await implementation approval. Do not defer recording until the final synthesis. Start with `node scripts/project-intake.mjs show`. After the welcome, after each received reply (including partial answers), and before the next question, save and reread using `node scripts/project-intake.mjs record <event.json>`.

The JSON event accepts optional `welcomeShown` (boolean), `answers` (list of `{ "id": "q1", "value": "…", "status": "provided", "origin": "user" }`) and `pending` (next decision or null). IDs: `entry`, `demo`, `q1`–`q10`, `q6.platforms`, `q6.computer`, `q6.tablet`, `q6.mobile`, `q6.other`, `q9.default`, `q10.default`, `translation`, `verification`, `approval`. Statuses: `provided`, `proposed`, `pending`, `deferred`, `skipped`. Origins: `user`, `brief`, `assistant`, `branch`. Proposals and skipped questions are not user answers. Prepare JSON through a file tool without interpolating user text into shell commands. Store no secrets or private attachment content.

The helper keeps canonical answers in a managed JSON block inside `docs/product/brief.md` and a resumption pointer inside `docs/project-state.md`, preserving other content and the roadmap. The managed block distinguishes current project intent from historical example prose. It rejects symlinks, concurrent writes and invalid blocks. If the second write fails, already saved brief answers remain authoritative: disclose the failure and repair the pointer before continuing, without asking again. If permissions or tooling are unavailable, report missing persistence and stay at the current step; never claim an unsaved answer was recorded. Do not execute recording in the maintenance template to save maintainer answers.

The brief in `docs/product/brief.md` and its “Scoping answers” block are the readable product authority. Record each answer's value, origin (brief/user/proposal) and status (unknown/proposed/provided/awaiting material/deferred). The progress checkpoint records the next question or pending conversational follow-up and the authorized synthesis scope; link to the brief rather than duplicating answers. Update after each answer with applicable write permission. If saving fails, disclose the resumption limitation; never claim persistence. Do not store secrets or copy private attachments into public documentation.

Read these authorities in every new conversation. Resume a pending transmission without asking its first-level question again. Reopen deferrals only on request, contradiction or material need. New conversations do not reset projects or authorization. Technical documentation preferences follow [Project languages](languages.md), including legacy migration, separately from product answers.

Do not write maintainer answers into the distribution template. Initialize derived-project progress only with a mandate. Scoping answers authorize minimal recording in the project targeted by the explicit start request, not application development. Present a concrete Q1–Q10 synthesis, hypotheses, exclusions, criteria and verification before development and await authorization unless already obtained for the exact scope. Demonstration agreement also resumes at Q7 without starting development. Delivery acceptance and publication are separate.

## Handoff to implementation procedures

Devices require actual adaptations and relevant tests; Whizam tools remain desktop. PWA requires dedicated implementation when requested, not activation in the template through instructions alone. Offline access requires testing the connection message, retained-content access or editing/synchronization according to scope, with conflicts and failures clarified first. Verify business languages separately from documentation languages. A build alone proves none of these capabilities.
