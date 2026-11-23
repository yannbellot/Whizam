# Resuming work on the kit

Install/start from the [README](../README.md) with compatible prerequisites and kit files alone. The design system is automated under its [policy](design-system/policy.md). DTCG values/references are canonical; the registry/examples drive generated stories.

Component changes include tokens, variants, states and examples; synchronize, check, test, then review application and Storybook. Storybook is exclusively documentary. UI Lab/editing access are removed; no AI key is needed for scripts/consultation. ROADMAP/project-state templates belong to the future project.

To hand off a new kit, exclude installations, caches, builds, accounts, private configuration/journals and preserve internal links and `.env.example`. Docker volumes require separate backup. Moving the same instance preserves Compose identity/data under [operations](operations.md).

Older projects are not implicitly migrated. The [migration table](design-system/simple-token-migration.json) and [guide](design-system/token-migration.md) describe affected sources. Returning to older versions needs compatible code/sources; never convert a receipt or remove a lock.

Native assistant trials and human handoff remain distinct from builds/automation. See [compatibility](compatibility.md) and [distribution limits](distribution/README.md).

The [Resuming and handing off guide](guide-whizam/reprendre-transmettre.md) presents designer actions and links to these procedures.

## Project documentation

Review presents Application, Storybook and Documentation after checking content. Zensical ships inside the kit; see the [documentation guide](documentation.md). It reads current Markdown and requires neither maintenance parent nor host Python.
