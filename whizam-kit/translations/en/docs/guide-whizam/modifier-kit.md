# Customizing the kit

**You can adapt Whizam to your way of working and your project's needs.** Its instructions, roles, skills and rules are stored in the kit files.

You can ask the assistant to examine them and propose changes. These adaptations affect the copy of the kit you are working on.

## Before you begin

**These adaptations can affect how the assistant designs, develops and verifies your project.** A contradictory rule or incomplete procedure can cause errors in later requests.

Changing the architecture or generation rules can also affect the existing application.

Before any change, ask the assistant to:

- Check the project state and preserve ongoing changes.
- Prepare an identified restore point: a version recorded with Git or a backup copy.
- Explain potential consequences and the rollback procedure.
- Test the change on a limited case before applying it broadly.

> Before changing how the kit works, prepare a restore point and explain how to restore the previous behavior if the trial fails.

## Define what you want to change

Describe the expected result and, if possible, a concrete situation:

> I want every design review to include a check of content and error messages.

> I want to add a documentation rule for decisions made during the project.

**The assistant examines existing rules before proposing a change.** It identifies affected files, consequences for the work and required checks.

An instruction in the conversation may address a one-off need. To reuse a rule in future sessions, ask the assistant to record it in the appropriate files.

## Change agent roles and skills

**Roles define responsibilities; skills describe procedures.**

You can refine a role's duties, expand a procedure or add a skill for a recurring need.

For example:

> Add a check for consistent labels across the application, Storybook and documentation to the design review.

The assistant must preserve a clear division between implementation and review, then update references needed to use the procedure.

## Change design system management rules

**Design system rules govern the creation and evolution of primitives, tokens, components and their variants.**

You can adapt these rules to new design or contribution needs.

Distinguish an interface change from a methodology change:

- “Create a compact variant of this component” evolves the project's design system.
- “Require a usage example for every new variant” evolves its management rules.

The assistant examines consequences for sources, generation, checks and Storybook before changing a shared rule.

## Change the documentation

**You can evolve documentation content and organization**, along with instructions governing its maintenance.

For example:

> Add a section dedicated to our product's editorial principles.

> For each feature, document business rules and error states.

The assistant edits the relevant sources and adjusts their portal classification. It keeps one reference source for each piece of information to avoid contradictory versions.

## Change the technical architecture

**Architecture defines the technologies used and how different parts of the project work together.**

You can request an evolution to integrate a service, meet a hosting constraint or support product development.

> Our team uses a different storage service. Examine the adaptations needed and propose a migration plan.

The assistant presents consequences for code, data, configuration, tests and operations. Changes affecting existing data must plan for its preservation and rollback possibilities.

**You approve the scope and structural choices before implementation.**

## Verify and retain adaptations

After changing how the kit works, the assistant updates the relevant documents and runs appropriate checks.

**The presence of a new instruction does not prove that an agent applies it.** A trial on a representative request verifies the resulting behavior.

You can ask:

> Let's test this new rule on a concrete case, then check that it also works in a new conversation.

Adaptations remain in your project copy. Applying them to other projects or a new copy of the kit must be requested and verified separately.

## Restore the previous behavior

**Reversibility depends on the modified elements and the restore point prepared before the intervention.**

| Change | Rollback to plan |
| --- | --- |
| Instructions, roles, skills or documentation | Restore previous files, then check relevant references and links. |
| Design system or generation rules | Restore compatible sources and regenerate application and Storybook outputs. |
| Code, dependencies or technical configuration | Restore a coherent set, reinstall dependencies if needed and verify operation. |
| Data or external services | Prepare a backup and specific restore procedure before the intervention. |

**Restoring instructions does not undo actions already performed under their influence.** If the assistant changed code or data after a rule change, those changes must also be examined.

Git lets you retrieve files saved in a version. It does not automatically back up your database, private files or external service state.

If an error occurs, ask:

> Suspend changes related to this adaptation. Compare the current state with the restore point and propose a restoration that preserves other work.

The assistant must identify affected changes before restoring anything. **A rollback must not erase developments made in the meantime without your agreement.**
