# Whizam

[Version Français](README.md)

**Design, build and evolve your web applications with AI assistants.**

Whizam is an open-source kit for digital, UX/UI and Product Designers who want to turn an idea into a working prototype or a first product version.

It combines a technical foundation, instructions for AI assistants, a design system, and tools for testing and documentation. You can work with **Claude Code or Codex**, without prior programming knowledge, by describing your intentions and requests in natural language.

**You remain in control of your product: its goals, content, design choices and acceptance of the result.** The assistant helps you scope, build, verify and document your project.

📖 **[Read the documentation](https://yannbellot.github.io/Whizam/en/)**

## From idea to handover

### Start your project

Bring a brief, describe an idea you want to clarify, or request a fictional demonstration project to explore the kit.

The assistant helps you define a first version: users, pages, features, content, visual references and success criteria. It presents the proposed scope and steps before implementation begins.

### Build and iterate

Describe the pages, interactions and adjustments you want. The assistant examines the sources, prepares changes and implements the agreed scope.

You can follow the result in three spaces:

- **The application**, to explore pages and test interactions.
- **Storybook**, to browse components, their variants and states.
- **The documentation**, to find decisions, references and project progress.

Technical checks accompany development. Your review determines whether the result matches your intention.

### Hand over and share

The sources and documentation stay in your project folder. They help you resume work later or prepare a handover to a technical team.

You can also use GitHub to preserve history and share the sources. Deploying your application is a separate step, to prepare according to its needs.

## What the kit includes

| Element | Purpose |
| --- | --- |
| **Web application** | React, React Router and TypeScript foundation, with PostgreSQL and Docker Compose for persistence. |
| **Automated design system** | Reusable components, variants and tokens maintained with the assistant. |
| **Storybook** | Browsing the project's components and their states. |
| **Zensical documentation** | French/English guides, project progress and technical references. |
| **Instructions, roles and skills** | Procedures for scoping, designing, developing, verifying and handing over the work. |
| **Technical checks** | Tools to verify sources and relevant user journeys. |

The kit starts **without an initialized product project**: the application is empty, the seed inserts no data, and Storybook has no project components selected. Guides are available from the first launch of the documentation portal.

## 1. Get the kit

Cloning the repository with Git is recommended: it preserves hidden files and skill symlinks.

```bash
git clone https://github.com/yannbellot/Whizam.git
cd Whizam/whizam-kit
```

If Git is not installed, ask your assistant to help you set it up.

The self-contained kit is in **`whizam-kit/`**. You can work in this folder or copy it elsewhere and rename it for your project.

Keep the entire folder, including `.agents/`, `.claude/`, `.storybook/`, `.env.example` and the internal symlinks. Keep an untouched copy of the kit for future projects.

## 2. Open the right folder

Open **`whizam-kit/` as the workspace root** in your development assistant. If you moved or renamed your copy, open that folder instead.

The instructions, dependencies and commands are in this folder. The GitHub repository root does not contain an npm project to install.

The main workflows cover Claude Code and Codex. The kit also provides adaptations for other assistants; support and skill discovery limitations are described in [compatibility](https://yannbellot.github.io/Whizam/en/docs/compatibility/).

## 3. Start the conversation

Choose the starting point that suits you.

**You have a brief:**

> I want to create a project with Whizam. Here is my brief: […]

**You have an idea to clarify:**

> I want to create a digital designer portfolio. Guide me through defining a first version.

**You want to explore the kit:**

> Suggest a fictional demonstration project so I can discover Whizam.

You can attach your content, visual references and any documents relevant to your project.

The assistant examines the files and checks the prerequisites. It clarifies the scope with you and identifies the actions to approve before implementation. Getting the kit does not automatically create a product application.

## 4. Prepare and start the environment

You will need **Node.js**, **npm**, **Docker running** and **Docker Compose**. Compatible versions are listed in [package.json](whizam-kit/package.json).

You can ask the assistant to check these prerequisites and prepare the environment.

For manual setup, run all the following commands **from `whizam-kit/`**, or from the root of your renamed copy.

### Application

```bash
node scripts/setup-local.mjs
docker compose --env-file .env.local up --build --detach --wait
```

Setup preserves an existing private configuration and displays the application address. A fresh kit shows an empty page until your project has been built.

To stop the application while keeping its data:

```bash
docker compose --env-file .env.local down
```

### Storybook and documentation

Install the dependencies once:

```bash
npm ci
```

Then start each tool in its own terminal:

| Space | Command | Default local address |
| --- | --- | --- |
| Storybook | `npm run storybook` | [localhost:6006](http://127.0.0.1:6006/) |
| Documentation | `npm run docs:dev` | [localhost:8000](http://127.0.0.1:8000/) |

Docker must be running for the documentation portal. These addresses are available when the corresponding services are running; check the displayed address if the port changes.

The application, Storybook and documentation work without an AI model key. Your development assistant uses its own access. Figma is optional.

**Do not send passwords or keys in the conversation.** If confidential access is needed, follow the private entry process proposed by the assistant.

## Resume and evolve your project

Your folder keeps the sources, decisions and progress records needed to resume work.

In a new conversation, you can ask:

> Read my project's current state and roadmap, then tell me where we are and the next step.

You do not need to reinitialize the project. The assistant uses the saved information to continue the work.

Use a separate copy of the kit for each new project. Private configurations, installed dependencies, caches, builds and local data are not part of a fresh kit to hand over.

## Further reading

- **Online documentation**: [English](https://yannbellot.github.io/Whizam/en/) · [Français](https://yannbellot.github.io/Whizam/fr/)
- [User guide](https://yannbellot.github.io/Whizam/en/docs/guide-whizam/)
- [Technical documentation](https://yannbellot.github.io/Whizam/en/TECHNICAL-GUIDE/)
- [Detailed kit README (French)](whizam-kit/README.md)
- [Environment setup](whizam-kit/translations/en/skills/initialize-project/references/environment-setup.md)
- [Sharing your project](https://yannbellot.github.io/Whizam/en/docs/guide-whizam/partager-projet/)
- [Compatibility and limitations](https://yannbellot.github.io/Whizam/en/docs/compatibility/)
- [License and reuse](https://yannbellot.github.io/Whizam/en/docs/licence-reutilisation/)

## License

Whizam is distributed under the **MIT license**. Third-party resource notices and licenses remain applicable.

The kit is a starting point to adapt and verify for your application. It does not, by itself, establish production readiness.
