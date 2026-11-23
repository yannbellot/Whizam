# Consulting and maintaining documentation

Zensical presents project documentation from Whizam Kit Markdown. Three complementary spaces: Application, Storybook for React components, and Documentation for product, rules, implementation and handoff.

Whizam is the new Loomata name. Technical paths/identifiers remain to preserve commands/links. Historical references/screenshots keep original names and do not qualify a new version.

Four portal entries: **Home**, **User guide**, **Designer documentation**, **Technical documentation**. The [User guide](guide-whizam/index.md) supports getting started, collaboration, evolution and handoff; it follows Home with Getting started and Designing and evolving your project groups. Designers find guides, design system principles and **Project progress → Current state, Roadmap, Project stages**. Real stages contain dedicated navigation folders for preparation/reviews/decisions. In new kits both templates remain uninitialized and stages show “No stages defined”.

Technical documentation groups Architecture and data, Installation and operations, Security and private configuration, Design system — implementation, Assistants and automation, Documentation maintenance. Kit histories remain in sources but outside navigation/search/direct old rebuilt-site URLs. Active guides work without business briefs. Application/Storybook retain clean initial state.

## Prepare and consult

With compatible Node/npm, kit dependencies installed and Docker running, run `npm run docs:dev`. Portal: `http://127.0.0.1:8000/`. `DOCS_PORT` selects another port; occupied ports are rejected without stopping their owner. Ctrl+C stops only this portal. Application/Storybook are independent; documentation needs no database.

Zensical 0.0.62 runs from the official image/digest pinned in `config/documentation/catalog.json`. No host Python, pip or uv installation. Docker may download the image on first build; subsequent generation is offline.

`npm run docs:build` creates static output. `npm run docs:check` compares inputs against current sources. `npm run docs:prepare` shows classification/diagnostics. Generated pages/assets remain under `.runtime.local/documentation/`, excluded from distribution/versioning. `current.json` selects active output only after success. Previous output stays available during rebuild; failures never replace the last complete version. After interruptions leaving `build.lock`, diagnose/preserve the attempt before resumption without deleting active-process locks.

## Unique sources and coverage

Edit original Markdown, never prepared pages/HTML. Preview detects changes/additions/renames/removals and reloads browsers after complete publication. The assistant updates content with features; builds perform no AI inference.

`config/documentation/catalog.json` separates publication/navigation in `organization` version 1. Each `organization.documents` entry keyed by canonical path has:

- `kind`: `guide` for active kit rules/guides, `project` for user project documents, `history` for sources kept outside the portal;
- `section`: main/subsection path from those listed above;
- optional `label`/`order`: readable title and numeric subsection order;
- `stage`/`phase` for real project-stage documents. Accepted phases are “Cadrage et objectifs”, “Préparation et réalisation”, “Vérifications et retours”, “Décisions et validation”.

Declare stages in `organization.stages` with `id`, `title`, `order`, consistent with roadmap. Scripts do not infer stages from filenames/decision numbers. Example to adapt to an actually agreed stage:

```json
{
  "stages": [{ "id": "contact", "title": "Contact form", "order": 1 }],
  "documents": {
    "docs/work-items/contact.md": {
      "kind": "project",
      "label": "Prepare the form",
      "stage": "contact",
      "phase": "Préparation et réalisation"
    }
  }
}
```

These objects extend existing entries; do not replace other classifications. Empty subsections are not created. Sources stay in conventional locations: no moving/second copies of ROADMAP.md, docs/project-state.md, work items/reviews/decisions. Home/stage views are generated with no competing editable Markdown.

New documents publish by default with “Documentation classification incomplete” diagnostics. New work items/reviews/decisions temporarily go to Project progress → Unclassified documents until explicit stage/transversal assignment. Other documents use path domain, falling back to Architecture and data. Publication never infers history solely from folder location. Fix registry classification with changes.

The preparation manifest records each source, nature, destination and publication. `organization` governs when present; `archives` retains legacy annotations and `publishDocs` legacy behavior without `organization`. Do not use `publishDocs` to reexpose histories. No outside-kit maintenance content is included.

Interpage/public-source links are prepared automatically. Unpublished documents become explicit non-clickable mentions without downloadable sources; removed references/missing anchors appear in diagnostics. Private/out-of-scope foundation references become non-clickable without reading targets; other sources strictly reject such links. Allowed technical sources become downloadable text, never executed. Private resources, escaping paths and symlinks are rejected.

## Autonomy and security

Everything is here: `zensical.toml`, registry, scripts/tests. Copy the kit with useful hidden files and follow README. The container receives only prepared public pages/configuration in a disposable writable space separate from original sources; no private environment, parent, Docker socket or business database. Local servers expose only built output and reject HTTP writes.

Initial installation may need Internet for tools/image. Direct `file://` HTML opening is unqualified; use the local server. No remote publication/production hosting is activated.

## Languages

The portal prepares `/fr/` and `/en/` separately with language selector and separate search. Old French URLs remain. Missing/stale English content is explicitly flagged; selector presence does not prove translation completeness. See [Project languages](agents/languages.md) for preferences, translation sources and maintenance.

## Documentation tools typography

The portal and Storybook use Inter for text and Menlo for code and identifiers. Inter is shipped locally at `public/documentation/Inter.ttf`, with its OFL license; its font-face declaration uses the exact name `Inter`. The file comes from the Google Fonts revision already pinned in the internal catalog, with verified SHA-256 integrity. No font download is needed when opening, building or using these tools offline. Menlo uses the workstation’s installed font, with a monospace fallback when unavailable; no proprietary Menlo file is distributed.

Presentation styles and the portal’s four explicit resources are declared under `public/documentation/` and `config/documentation/catalog.json` (`presentationAssets`). Preparation copies them to `assets/typography/` for each locale and includes them in its digest. Relative paths also work for legacy French URLs. Storybook loads fonts in both manager and iframe; `.storybook/typography.css` sets documentation presentation. Design system tokens, authorities, components and styles remain unchanged.
