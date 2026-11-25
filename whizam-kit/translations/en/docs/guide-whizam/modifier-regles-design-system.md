# Changing design system management rules

**Design system rules define how to create, reuse and evolve interface elements.** They govern primitives, tokens, components, their variants and their Storybook documentation.

You can adapt these rules to your project. A change may affect several components or pages: prepare a restore point with the assistant before beginning.

## Distinguish a visual evolution from a rule change

**A visual evolution changes the interface.**

> Create a compact variant of this card for dense lists.

**A rule change alters how the design system is managed.**

> Require a usage example and a description of intended situations for every new variant.

The first request uses existing procedures. The second changes instructions the assistant must apply to future developments.

## Understand the current rules

The kit design system uses three token categories:

- **Primitives** define base values: colors, sizes, spacing and corner radii.
- **Component tokens** reference primitives directly for a component part, variant or state.
- **Local tokens** reference primitives directly for a particular page composition.

Shared components have explicit variants and states. Their examples let you examine appearance and behavior in Storybook.

**The assistant edits sources; kit tools generate files used by the application and Storybook.** Generated files must not be edited manually: subsequent generation would replace those changes.

## Describe the desired rule

Explain the problem, expected behavior and affected elements.

For example:

> For every new form component, document empty, filled, disabled and error states.

> Before creating a variant, check whether an existing variant already meets the need.

> For every shared change, identify components and pages to examine.

The assistant finds existing rules, identifies their reference source and proposes the necessary adaptations.

**Specify whether the new rule concerns future creations or existing elements as well.** Adding a rule does not automatically bring the entire design system into compliance.

## Assess consequences

Some adaptations simply extend a procedure: adding a required description, clarifying a review criterion or requesting another example.

Others change the design system structure: adding a token category, changing relationships or replacing the generation mechanism.

**A structural change may require migration**, affecting sources, components, checks, Storybook and documentation.

Ask the assistant to specify:

- Affected existing elements.
- Required tooling adaptations.
- Risks of visual or behavioral changes.
- Verification method.
- Rollback procedure.

You approve this scope before implementation.

## Control the scope of changes

**Two elements using the same value do not necessarily need to evolve together.**

Under current kit rules, a consumed primitive remains stable. To change a use's appearance, the assistant creates or reuses a compatible primitive, then retargets the affected tokens.

For example:

> Change only the primary button background color. Preserve other components currently using this color.

A global change must explicitly identify uses to update.

Likewise, a different appearance for a shared component must be represented by an explicit variant to keep behavior understandable and reusable.

## Verify the new rule

Start with a limited case:

> Apply this rule to a representative component and check the result before extending it to other components.

The assistant updates relevant sources, adapts checks if needed and regenerates outputs.

Then examine:

- The component and its states in Storybook.
- Its use in the application.
- Token and example consistency.
- Documentation of the new rule.

**Successful generation does not validate the visual result.** Your review checks whether the adaptation matches your intention.

## Restore the previous behavior

To undo an adaptation, ask:

> Compare changes with the restore point and propose a coherent restoration of the relevant rules, sources and tools.

Depending on the change, tokens, components, examples and the generator may need to be restored to compatible versions, then outputs regenerated.

**Restoring only the rule text does not restore elements already changed under its influence.** The assistant must identify those changes and preserve other project developments before restoring anything.
