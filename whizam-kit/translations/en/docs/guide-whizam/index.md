# Getting started with Whizam

To begin, you need the **kit folder** and an AI assistant that can work with its files: **Claude Code or Codex**.

## 1. Prepare your folder

**Download the kit to your computer**, then put it in the folder of your choice. You can rename it after your project.

**Open this folder in Claude Code or Codex**, keeping all its files, including hidden files. Your assistant can then read the kit instructions and work on your project.

## 2. Start your project

In your conversation with the assistant, choose the starting point that suits you.

**You have a brief**

> I want to create a project with Whizam. Here is my brief: […]

You can attach your content, visual references and any documents that help explain it.

**You have an idea to clarify**

> I want to create [describe your idea]. Guide me through defining a first version.

**You simply want to try the kit**

> Suggest a fictional demonstration project so I can discover Whizam.

The assistant examines the files and checks the technical prerequisites. It explains the preparation needed and tells you whether installation or action on your part is required.

## 3. Choose whether to use GitHub

**GitHub lets you keep your project sources and history remotely**, then share them with the people who will contribute to development.

At the end of the scoping questionnaire, the assistant asks whether you want to:

- Create a new GitHub repository for your project.
- Use an existing repository.
- Continue without GitHub for now.

If you choose GitHub, also specify when to send changes: **after each commit**, which records a batch of changes, or **only on request**. You can change this choice later.

After scoping approval, the assistant helps connect the project to the selected repository. It reuses an available connection or guides you through signing in. If confidential access is still needed, enter it in a private form without sending it in conversation.

**Before repository creation and the first send, you approve the destination and the materials to transfer.** You can use the kit locally without GitHub and enable this option later.

<a id="3-definir-une-premiere-version"></a>
<a id="3-define-a-first-version"></a>

## 4. Define a first version

Whatever your initial requests, **the assistant helps you** clarify the information needed to build your project:

- The project objective and its users.
- Priority pages, features and journeys.
- Available content and content to prepare.
- References and design intentions.
- Target devices and languages to offer.
- Criteria for assessing the result.

**It reuses information already provided** and asks for missing details where necessary.

**Before development, it presents a summary:** what will be built, what remains out of scope, and any provisional content or behavior. **You approve this proposal to start implementation.**

<a id="4-concevoir-et-developper"></a>
<a id="4-design-and-develop"></a>

## 5. Design and develop

The assistant **organizes the work into stages** and implements the **agreed scope**. It uses the relevant **roles** and **skills** to design interactions, develop, test and review the quality of the result.

You can communicate choices and feedback in natural language:

> On this page, put the summary before the form and explain the consequences of this change.

When a decision significantly changes the project scope or operation, the assistant presents the options before continuing.

<a id="5-examiner-le-resultat-et-iterer"></a>
<a id="5-review-the-result-and-iterate"></a>

## 6. Review the result and iterate

When the version is ready for review, the assistant provides verified access to:

- **The application**, to explore pages and test interactions.
- **Storybook**, to examine components, their variants and states.
- **The documentation**, to find choices, decisions and project progress.

**Test the journeys and provide feedback.** The assistant makes the agreed adjustments and updates the relevant documents.

Automated tests provide **technical checks**; your review assesses whether the result matches your intention.

To help with the sometimes laborious task of testing user journeys for validation, Whizam can run them automatically using end-to-end testing, abbreviated E2E. Simply ask:

> Run E2E validation tests for the user journeys.

## Resume your work later

Your entire project stays in its folder. To continue working in a new conversation, ask:

> Read my project's current state and roadmap, then tell me where we are and the next step.

The assistant uses the saved information to resume work. **You do not need to reinitialize the project or repeat your entire brief.**
