# 002 — Dedicated project initialization skill

**25 October 2026 — decision approved by the owner.** Approval concerns method; execution evidence and deliverable acceptance remain separate.

## Context

Starting from a kit copy, possibly on a machine without tools, covers environment, prerequisites, scoping, documents, startup and recovery. INIT-01’s plan-feature mode mixed these responsibilities with feature planning. The owner clarified that twenty initial skills are neither a ceiling nor a reason to combine different responsibilities.

## Decision

Create [initialize-project](../../skills/initialize-project/SKILL.md), selected by AGENTS/Builder for “Initialize a new project [name]” or resumption. It owns the workflow/criteria; load the environment reference only for technical initialization/resumption. Reuse operational scripts and useful scoping/planning skills without duplicating procedures. Plan-feature returns to slice preparation.

The library grows with approved needs. The catalog declares sources/resources, roles and current delivery’s expected count; the count checks completeness, not a universal limit. Adapters expose the same canonical sources. Extensions update catalog, exposures, references and evidence.

[Decision 004](004-guided-project-start.md) extends this: initialize-project retains its technical sequence while existing procedures handle scoping/implementation and present access points at first review.

## Consequences and alternatives

A plan-feature mode would keep mixed responsibilities; a plain document would be less identifiable as a library capability. A dedicated skill enables workflow-specific selection/evaluation. It remains available for interrupted initialization; completed projects are not reinitialized when opening chat or during ordinary work.

Instructions neither implicitly install system tools nor prove clean-machine behavior. Permissions, existing data and separate publication authorization remain applicable. [INIT-02](../work-items/init-02-dedicated-initialization-skill.md) covers migration/checks; INIT-01 remains historical for its version.
