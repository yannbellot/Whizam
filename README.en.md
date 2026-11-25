# Whizam

[Version Français](README.md)

**A starter kit for designing and building a web application with an AI assistant.**

Whizam is for digital, UX/UI and Product Designers who want to turn an idea into a working prototype or a first product version. You define the intent, design choices and success criteria; the assistant helps you scope, build and verify the result.

The ready-to-use kit is in **[`whizam-kit/`](whizam-kit/)**. This folder is self-contained: you can copy, move or rename it while keeping all its contents.

## Documentation

Read the [Whizam documentation](https://yannbellot.github.io/Whizam/en/) for user guides, technical references and explanations of how the kit works, in English and French.

## What the kit includes

- **A starter application** using React, React Router and TypeScript, with PostgreSQL and Docker Compose for persistence.
- **An automated design system** to maintain components, variants and tokens.
- **Storybook** to browse your project's components.
- **A Zensical documentation portal** for guides and project progress.
- **Instructions, roles and skills for assistants** to scope, build, review and hand over the work.
- **Technical checks** to verify the sources and prepare a handover.

The kit starts **without an initialized product project**: the application is empty, the seed inserts no data, and Storybook contains no initial project content. Guides are available as soon as you start the documentation portal. Historical references kept in the sources do not define your project.

## 1. Get the kit

Cloning the repository with Git is recommended: it preserves hidden files and skill symlinks.

```bash
git clone https://github.com/yannbellot/Whizam.git
cd Whizam/whizam-kit
```

If Git is not installed, ask your assistant to help you set it up and clone this repository.

You can work directly in `Whizam/whizam-kit/`, or copy **the entire folder** elsewhere for your project. Keep `.agents/`, `.claude/`, `.storybook/`, `.env.example` and the internal symlinks. Keep an untouched copy of the kit if you want to reuse it for other projects.

## 2. Open the right folder

Open **`whizam-kit/` as the workspace root** in your development assistant. If you moved or renamed the copy, open that folder instead.

The application instructions, dependencies and commands are in this folder. The GitHub repository root does not contain an npm project to install.

The kit provides instructions for Codex, Claude Code and Gemini CLI, plus an explicit reading path for Mistral Vibe and other assistants that can work with local files. Automatic skill discovery depends on the tool; see [compatibility](https://yannbellot.github.io/Whizam/en/docs/compatibility/).

## 3. Start your project

In a new conversation opened on the kit folder, you can write:

> I want to create a digital designer portfolio called “My Portfolio”. Help me scope its first version, then propose the setup and implementation steps.

Adapt the name and idea to your project. You can attach your brief and visual references.

The assistant examines the sources, clarifies the scope with you and presents the actions to approve before setup. **Getting the kit does not automatically create a product application.** To resume an existing project, ask the assistant to read its current state and continue without reinitializing it.

## 4. Prepare and start the local environment

The reference prerequisites are **Node.js 24.22.0**, **npm 11.8.0**, **Docker running** and **Docker Compose**. Supported version ranges are in [package.json](whizam-kit/package.json). Git is used to retrieve the repository.

You can ask the assistant to check these prerequisites and prepare the environment. For manual setup, run all the following commands **from `whizam-kit/`**, or from the root of your renamed copy.

### Application

```bash
node scripts/setup-local.mjs
docker compose --env-file .env.local up --build --detach --wait
```

Setup creates a private local configuration without overwriting an existing one and displays the application address. A fresh kit shows an empty page until your project has been built.

To stop the application while keeping its data:

```bash
docker compose --env-file .env.local down
```

### Storybook and documentation

Install the local tools' dependencies once:

```bash
npm ci
```

Then start each tool in its own terminal:

| Tool | Command | Default local address |
| --- | --- | --- |
| Storybook | `npm run storybook` | [localhost:6006](http://127.0.0.1:6006/) |
| Zensical documentation | `npm run docs:dev` | [localhost:8000](http://127.0.0.1:8000/) |

Docker must be running for the documentation portal. These addresses are available when the corresponding services are running; check the displayed address if the port changes.

Documentation and the design system tools automatically follow your browser's light or dark mode. Their left sidebar contains navigation and a language selector fixed at the bottom, also available in the mobile menu. The link icon next to headings copies the section address; a temporary confirmation indicates success.

The application, Storybook and documentation work without an AI model key. Your development assistant requires its own access. Figma is optional.

## Further reading

- **Online documentation**: [English](https://yannbellot.github.io/Whizam/en/) · [Français](https://yannbellot.github.io/Whizam/fr/)
- [User guide](https://yannbellot.github.io/Whizam/en/docs/guide-whizam/)
- [Technical documentation](https://yannbellot.github.io/Whizam/en/TECHNICAL-GUIDE/)
- [Detailed kit README (French)](whizam-kit/README.md)
- [Project startup workflow](https://yannbellot.github.io/Whizam/en/docs/product/project-start/)
- [Environment setup](whizam-kit/translations/en/skills/initialize-project/references/environment-setup.md)
- [Verification and iteration](https://yannbellot.github.io/Whizam/en/TECHNICAL-GUIDE/#consultation-et-controles)
- [Sharing your project](https://yannbellot.github.io/Whizam/en/docs/guide-whizam/partager-projet/)
- [License and reuse](https://yannbellot.github.io/Whizam/en/docs/licence-reutilisation/)

The kit is distributed under the [MIT license](https://yannbellot.github.io/Whizam/en/docs/licence-reutilisation/), with third-party resource notices to retain.

Use a separate copy for each new project. Private configurations, installed dependencies, caches, builds and local data are not part of a fresh kit to hand over. The kit is a starting point to adapt and verify for your application.
