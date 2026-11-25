# Changing agent roles and skills

**Roles and skills define how the assistant works on your project.** You can adapt them to clarify a responsibility, expand a procedure or address a recurring need.

These changes apply to your copy of the kit. Before beginning, prepare a restore point with the assistant to restore previous files if needed.

## Understand roles and skills

**A role defines a responsibility and its limits.** Whizam provides four:

- **Builder**: analyzes requests, proposes solutions, implements changes, tests and documents.
- **Design Reviewer**: examines fidelity to references, visual consistency and user experience.
- **Technical Reviewer / QA**: examines code, technical contracts, tests and regression risks.
- **Security Reviewer**: examines access, data, secrets and security risks.

**A skill describes a procedure for performing a task.** It specifies required information, work to perform and expected results.

One role can use several skills depending on the request. Four roles do not mean four agents run simultaneously: an assistant can perform them sequentially. In that case, reviews are not independent.

## Choose the right level of change

Before editing files, clarify whether your request concerns a one-off intervention or a lasting rule.

**For a one-off request**, a conversation instruction may suffice:

> For this review, also examine whether error messages are understandable.

**For a reusable rule**, request an adaptation of the relevant skill:

> For future design reviews, add a systematic check that error messages are understandable. Record this rule in the appropriate procedure.

The assistant first looks for an existing procedure to avoid multiplying skills covering the same need.

## Change a role

A role change concerns its mission, scope or limits.

For example:

> Specify that the Design Reviewer must flag provisional content that prevents assessment of a page's hierarchy.

The assistant examines consequences for other roles and proposes a coherent division of responsibilities.

**Keep a clear distinction between implementation and review.** Reviewers examine, test and report their conclusions. Corrections belong to the Builder unless explicitly delegated.

Changing a role does not give the assistant additional permissions. Tool authorizations and required decisions still apply.

## Change an existing skill

Describe expected behavior and how to verify it:

> Extend the handover procedure to include a list of provisional content and pending decisions.

The assistant identifies the relevant skill, examines its references and proposes necessary changes.

A procedure must remain specific enough to indicate:

- When to use it.
- What information to consult.
- What actions to perform.
- What result to produce.
- How to verify that result.

**The change must remain consistent with the kit's shared instructions.** If it contradicts another rule, the assistant must explain the conflict before proceeding.

## Add a new skill

A new skill is useful when a recurring task needs a distinct procedure.

> Propose a skill to check editorial content before each delivery: terminology, consistent labels and identification of provisional text.

Before creating it, the assistant clarifies its objective, responsible role and limits. It checks whether an existing skill already covers the need.

Canonical sources are in `agents/` and `skills/`. The skills catalog and relevant entry points must also be updated to preserve a coherent set.

**Adding a file does not guarantee automatic discovery by every assistant.** The assistant must explain how the procedure is accessible in your environment and distinguish its presence from verified use.

## Verify the new behavior

After the change, request a trial on a representative task:

> Apply this procedure to a limited example, then indicate which instructions were followed and which results verify this.

The assistant checks file structure, references and observed behavior. If the rule should be reused across sessions, a trial in a new conversation verifies resumption.

**Structural validation alone does not prove that the agent applies the procedure correctly.** Also examine the quality of the result.

## Restore the previous version

If the adaptation does not produce the expected behavior, ask:

> Compare this adaptation with the restore point and propose restoring the relevant roles, skills and references while preserving other changes.

**Restoring the procedure does not undo changes already made using it.** Code, content or data changed during the trial must be examined separately.
