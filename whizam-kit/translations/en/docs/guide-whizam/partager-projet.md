# Sharing your project

**Your project can be handed over to another person for review, further development or preparation for publication.** Its folder contains application sources, components, agent instructions and documentation.

The assistant helps prepare this handover so the recipient can understand and resume the work without your conversation history.

## Choose what to share

Tell the assistant the purpose of sharing and who will receive it:

> I want to hand this version over to a technical team for further development. Prepare the materials needed to take it over.

> I want my team to test the journeys. Suggest a way to share this version.

**Transferring project files and providing access to an online application are different operations.** The assistant proposes preparation suited to your objective.

A local address such as `127.0.0.1` works on your computer. It does not let another person access your application from theirs.

## Prepare the version to hand over

Before sharing, the assistant reviews the relevant version:

- Implemented features and journeys.
- Provisional content and any simulations.
- Checks performed and their results.
- Known problems and items still needing review.
- Pending decisions and next steps.

**You know what the recipient can use and what remains to be done.** A version can be shared for further development even if it is not ready to go online.

<a id="conserver-les-sources-sur-github"></a>
<a id="keep-sources-on-github"></a>

## Share the project through GitHub

**If you chose to keep sources on GitHub, the repository can support project handover.** Give access to the technical team continuing development, then share the repository link and the version to take over.

Before handover, ask the assistant to check that the intended changes have been sent and that the documentation explains how to install, start and understand the project.

You can ask:

> Prepare handover of my project through its GitHub repository. Check the available version and complete the instructions the team needs to take it over.

For a private repository, recipients need the appropriate access. **Each person uses their own credentials and confidential configuration.** Passwords and access keys stay out of the repository.

If the project uses a database, its data requires separate preparation. The repository contains sources and instructions; transferring data may require a backup.

Repository updates follow the selected mode: after each batch commit integrates into the main branch, or only on request. Automatic sending operates while working with the assistant; no permanent service watches manual commits.

**To let people test the application directly in a browser, also prepare to put it online**, as described in [Prepare to go online](#prepare-to-go-online).

## Prepare the project folder

The assistant identifies the files needed to take over: sources, sample configuration, declared dependencies, startup instructions and documentation.

It prepares a copy or selection suited to the agreed transfer method, preserving necessary hidden files and internal links.

**Passwords, access keys, personal connections and private settings must stay out of shared files.** The recipient provides their own configuration.

If your project uses a database, specify whether its data must be transferred. **Copying the folder is not enough to transfer a database stored in a Docker volume.** A separate backup and restore procedure may be needed.

Keep applicable licenses and notices in the version handed over. [License and reuse](../licence-reutilisation.md) explains the kit’s MIT License and third-party resources.

## Support the handover

Handover documentation lets the recipient find:

- Project objective and scope.
- Design choices and technical decisions.
- Prerequisites and installation steps.
- How to start the application, Storybook and documentation.
- Verification procedures.
- Known limits and upcoming work.

You can ask:

> Prepare a handover that lets a developer install the project, start it and make a first change without consulting our conversation.

**A takeover trial by the recipient helps identify missing information.** Their feedback helps complete instructions and resolve obstacles.

## Prepare to go online

To make your application accessible remotely, request specific preparation:

> I want to put this version online. Present the required steps, hosting choices, potential costs and checks to perform.

The assistant examines project needs: hosting, configuration, data, access, backups and operating conditions.

**You approve publication choices and operations before execution.** Preparing a delivery or passing tests does not automatically trigger deployment.

Storybook and documentation can also be shared as browsable sites. Their content and access must be examined before publication, based on what information you want to make available.

Connection, private entry and troubleshooting details are available in [GitHub publication](../github-publication.md).
