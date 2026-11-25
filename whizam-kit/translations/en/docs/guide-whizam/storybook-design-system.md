# Storybook and the design system

**The design system brings together the visual rules and reusable components of your project.** It helps you build a consistent interface and evolve it while preserving design choices.

**Storybook lets you consult this design system and examine components separately from application pages.** You can find their variants, states and usage examples.

## Open Storybook

In your conversation with the assistant, ask:

> Open Storybook to examine my project's components.

The assistant checks the service and provides access to your project's catalog.

In a fresh kit, **the sections are present but may be empty**. The catalog grows with elements created or adopted for your project.

## Find your way around Storybook

The catalog is organized into three sections.

### Foundations — The foundations

This section presents the principles and construction rules of your interface, along with its visual values: colors, typography, spacing, dimensions and corner radii.

You will find **primitives** and **tokens**, which describe the values used and how they are assigned in the interface.

### Components — The components

This section brings together reusable project elements: buttons, form fields, layout components and other elements developed for your needs.

**Each component can offer several variants and states.** For example, a button may have primary and secondary variants, and hover, focus and disabled states.

Available variants and states depend on what has been implemented and documented for your project.

### Patterns — Reusable interactions

This section presents component compositions or reusable interaction sequences.

A pattern might describe form validation with error messages and confirmation.

## Understand primitives and tokens

The kit distinguishes three categories:

- **Primitives** define base values: a specific color, text size or spacing value.
- **Component tokens** assign these values to a component part, variant or state.
- **Local tokens** assign these values to the composition of a particular page.

For example, the background color of a primary button is defined by a component token referencing a color primitive.

**The same value may be used in several places without those uses always needing to change together.** When you request a change, the assistant must identify the affected elements to control its scope.

## Examine components

In Storybook, you can observe a component's appearance and try interactions offered by its examples.

During review, examine in particular:

- Visual hierarchy and readability.
- Consistency between variants.
- Understanding of states and feedback.
- Keyboard behavior and focus visibility.
- Long content, errors and documented special cases.

**Examples are isolated demonstrations.** A Storybook interaction does not prove that data is saved or a complete journey works in the application.

Complete your review in pages where the component is used.

## Evolve the design system

Ask the assistant for changes, specifying the desired result and affected elements:

> Increase spacing between the label and field for all form fields.

> Create a compact variant of this card for dense lists.

> Change only the primary button background, preserving the other variants.

The assistant examines existing uses, clarifies the scope if necessary, then updates the relevant sources, examples and documentation.

**A different appearance for a shared component becomes an explicit variant**, keeping the rule understandable and reusable.

The kit tools then generate the files needed by the application and Storybook from these sources.

## Consult and verify changes

**Storybook is a space for consultation and verification.** Its interactions let you examine examples; they do not save changes to the design system.

After an evolution, the assistant identifies the components and pages to examine. You can check the result in Storybook, then in the application to assess its effect in the real context of your product.
