# Adapt resources from the former example

A fresh kit no longer mounts `/projects` or UI Lab. The home page is empty and the seed inserts no data. Resources from the former record manager remain internal; their presence justifies neither reactivation nor another route-removal step. The [scope](starter-kit.md) and [active table](../../app/routes.ts) describe the starting point.

## Define project needs

Start from the brief and [startup workflow](project-start.md). Define pages, interactions, data, states and first-version criteria before choosing resources to reuse. Project management belongs to the product only when included in the agreed scope.

The former example includes contracts and processing in `app/features/projects/`, schema/migration elements and dedicated tests. These are references to examine, not a mandatory business architecture. Reuse useful shared components and adapt their examples before publishing in Storybook.

## Adapt code, data and documentation

1. Examine actual imports and affected consumers; do not blindly delete a reference folder.
2. Add or adapt authorized routes and processing, with HTTP/data validation, errors and negative tests. Former guards do not automatically apply to new routes.
3. For an initialized database, preserve applied migrations and define a new migration when needed. For a new domain, design its schema before initialization. Verify the target, backup and compatibility before data operations.
4. Maintain components, tokens, variants, states, examples and `.storybook/project.json` selection under [Storybook organization](../design-system/architecture.md#organisation-et-publication-storybook). Current generation uses neither UI Lab nor its former editing manifest.
5. Adapt tests, stories and documentation to project flows; stop requiring `/projects` as a success scenario. Run relevant checks from the [technical guide](../../TECHNICAL-GUIDE.md), then applicable reviews.

## Remove an unused resource

Unused files alone may be removed within the mandate after examining dependants and test implications. Distinguish code removal from data deletion: no table, applied migration, backup or volume is implicitly erased.

Preserve historical evidence and versions. Former editor journals must not be converted or purged to adapt the kit. An existing copy using that editor requires a separate migration under the [policy](../design-system/policy.md), without combining old code and new authorities.

## Verify the presented result

Present implemented flows and project components, with Application, Storybook and Documentation after verifying their availability and content. An empty page, former demonstration or passing build is not the first business version. Document limitations and leave acceptance to the designer.

<a id="change-procedure"></a>
<a id="source-change-procedure"></a>

<a id="elements-de-lexemple"></a>
<a id="source-elements-de-lexemple"></a>

<a id="example-elements"></a>
<a id="source-example-elements"></a>

<a id="place-dans-un-projet-derive"></a>
<a id="source-place-dans-un-projet-derive"></a>

<a id="procedure-de-changement"></a>
<a id="source-procedure-de-changement"></a>

<a id="remplacer-lexemple-projets"></a>
<a id="source-remplacer-lexemple-projets"></a>

<a id="replacing-the-projects-example"></a>
<a id="source-replacing-the-projects-example"></a>

<a id="role-in-a-derived-project"></a>
<a id="source-role-in-a-derived-project"></a>
