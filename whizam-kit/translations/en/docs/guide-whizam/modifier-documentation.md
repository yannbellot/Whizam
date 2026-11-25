# Changing the documentation

**You can adapt documentation content, organization and maintenance rules to your project.** The assistant can correct a page, add a section or evolve documentation instructions.

Changes are made in project source files. The portal is then rebuilt to make them available.

## Choose the type of change

Specify whether you want to change content, its classification or how the project is documented.

**Change content**

> Rewrite this feature presentation to explain available actions and error states.

**Change organization**

> Add an “Editorial principles” section to project documentation and group relevant pages there.

**Change a documentation rule**

> For each new feature, document business rules, provisional content and verification criteria.

The assistant examines existing content and identifies affected files before proposing necessary adaptations.

## Edit a page

Identify the page title and expected change. You can provide a complete text or request a draft.

> Replace the introduction to the “Registration” page with the following text, preserving other sections.

> Propose a new version of this page for readers without technical knowledge.

**The assistant edits the corresponding source file.** It checks links, heading hierarchy and directly affected references.

Some views, such as the portal home and design system inventories, are generated. In those cases, the assistant must edit the generation source rather than its output.

## Add a page or section

Describe the topic, target audience and desired location:

> Create a page about user roles in project documentation. Present their permissions and accessible journeys.

The assistant checks whether an existing page already covers the need. It prepares content, adds its navigation classification and creates useful links from other pages.

**A page must have an understandable location and clear responsibility.** Avoid spreading one rule across documents that might evolve differently.

Detailed information can remain in a reference page, linked from guides explaining it.

## Adapt project tracking

The roadmap, current state and stage documents have different functions:

- **The roadmap** presents objectives, work items and progress.
- **Current state** supports resumption with recent results, pending decisions and the next action.
- **Stage documents** preserve preparation, verification and detailed decisions.

You can adapt their presentation while retaining this distinction.

**Evidence for an earlier version must retain its historical scope.** A new check supplements previous results; it must not rewrite them as if they applied to the current version.

## Change maintenance rules

To make a practice lasting, ask the assistant to record it in the appropriate instructions or procedure.

> After changing a journey, update pages describing its behavior and verification criteria.

Specify the trigger, expected information and affected documents.

**The rule must remain proportionate to the change.** A label correction may need a targeted update; a functional evolution may affect several pages and project tracking.

A trial on a representative request checks whether the assistant follows the new instruction.

## Manage languages

If your documentation exists in several languages, specify your request's scope:

> Edit this page in French and update its English version.

The assistant must check affected translations and flag those still needing completion or review.

**A language selector does not guarantee that every page is translated and current.** A source edit can make its translation outdated.

## Verify the result

After a change, the assistant rebuilds the portal and runs appropriate checks.

You can then examine:

- Content readability and hierarchy.
- The page's location in navigation.
- Links to other documents.
- The page's presence in search.
- Affected translations, where applicable.

Ask:

> Open the edited page and identify points to examine.

**Successful generation verifies portal construction; your review assesses content clarity and accuracy.**

## Restore the previous version

For significant reorganization or changes to documentation rules, prepare a restore point before the intervention.

If a problem occurs, ask:

> Compare the documentation with the restore point and propose restoring affected pages, classification and links while preserving other work.

The assistant must restore a coherent set, then rebuild and verify the portal.

**Removing a page from navigation does not necessarily mean it is no longer published.** If you want content removed from the portal and search, say so explicitly so the assistant can check its effective exclusion.
