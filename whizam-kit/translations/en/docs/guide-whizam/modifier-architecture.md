# Changing the technical architecture

**Technical architecture defines the technologies used and how different parts of your project work together.** It covers the interface, server, data and external services.

You can evolve it to meet hosting constraints, integrate a service or help a technical team take over.

**These changes can affect the entire project.** Before starting, ask the assistant to examine consequences and prepare a rollback.

## Start from the need

Describe the objective or constraint to address. You can do so without knowing the technical solution.

> Our team uses Vue.js with Nuxt and TypeScript for the interface, and Python with Django and PostgreSQL for the back end. Examine adaptations needed to migrate this project to that architecture while preserving its features and data.

> We need to host the application and its PostgreSQL database on an OVHcloud VPS with Docker Compose. Examine adaptations needed and propose a configuration with HTTPS, backups and a restore procedure.

> We use Brevo for transactional emails. Propose an integration with its API to send registration confirmations and password reset requests, with error handling and tests without real sending.

If you already have a technical requirement, provide it with useful documents.

**The assistant examines existing architecture before proposing a solution.** It must distinguish necessary changes from optional adaptations.

## Understand the proposal

Ask for an explanation focused on consequences for your product:

- What changes for users.
- Project parts to modify.
- Affected data.
- Required services or accounts.
- Potential costs and operating constraints.
- Identified limits and risks.

> Present possible options and their consequences in accessible language. Give your recommendation and identify the decisions I need to make.

**A new technology is useful only if it addresses an identified need.** The assistant must explain the expected benefit and work needed to achieve it.

## Define the scope

An evolution may be limited to adding a service or require a larger transformation.

The assistant prepares a plan indicating:

- Implementation steps.
- Features to preserve.
- Possible service interruptions.
- Checks to perform.
- Documents and procedures to update.
- Rollback conditions.

**You approve structural choices and scope before implementation.** Installations, external access and publication operations remain subject to applicable authorizations.

## Preserve the project and its data

Before the intervention, the assistant checks file state and preserves ongoing work. It prepares an identified restore point.

**A version recorded with Git protects tracked files; it does not automatically back up the database, private files or external services.**

If the evolution concerns data, plan:

- A suitable backup.
- A transfer or migration method.
- Data verification after the operation.
- A restore procedure and its limits.

> Before any migration, explain how data will be preserved and how we will check that it is complete and usable.

Trials should use fictional data or a suitable copy where possible. Deletions and operations difficult to reverse must be identified before execution.

## Prepare service access

Some changes require an account, access key or provider configuration.

The assistant explains required elements and their use.

**Do not share passwords or keys in the conversation.** Request the kit's private configuration workflow to enter them in the appropriate location.

Preparing an integration does not authorize incurring costs, sending real messages or changing a production service. Those operations must be specified in the mandate.

## Implement and verify the evolution

The assistant performs authorized steps, adapts tests and updates affected procedures.

Checks must cover new behavior and affected existing features:

- User pages and journeys.
- Reading and saving data.
- Access rights.
- Errors and unavailability scenarios.
- Project installation, startup and operation.

Depending on the change, technical and security reviews supplement these checks.

**Successful startup does not prove that migration is complete.** The assistant must identify what was verified, what remains to examine and known limits.

## Update documentation

Architecture, prerequisites, configuration and startup procedures must match the new version.

The assistant also updates agent instructions and skills when their procedures depend on the old architecture.

> Check that another person can install, start and understand this version using the project files.

**Documentation must support takeover without depending on your conversation.** A trial by an outside person helps identify missing information.

## Restore the previous behavior

Rollback may require restoring code, dependencies, configuration and data together.

**Its feasibility must be studied before the change.** Some migrations are not directly reversible; restoring a backup can also lose data created since it was made.

If a problem occurs, ask:

> Suspend operations related to this evolution. Identify file, data and service state, then propose a rollback preserving other work.

The assistant must explain restoration consequences before executing it. **Returning to an older code version is not always enough to restore previous behavior.**
