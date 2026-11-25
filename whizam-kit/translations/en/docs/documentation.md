# Consulting and maintaining documentation

The Zensical portal presents guides, project progress and technical references from the kit’s Markdown files. To read content, choose one of four entries: **Home**, **User guide**, **Project progress** or **Technical documentation**. The [user guide](guide-whizam/index.md) supports getting started; this page explains how to prepare, classify, translate and check documents.

Project progress collects the current state, roadmap and actual project stages. In a new kit, these templates remain uninitialized. Technical documentation has six domains: architecture and data, installation and operations, security and private configuration, design system, assistants and automation, documentation maintenance.

Internal agent instructions remain in sources independently of publication. Histories are preserved outside the portal and search. Active guides can be consulted without a business brief; Application, Storybook and Documentation remain three separate services.

The portal automatically follows the light or dark preference reported by the browser, on opening and whenever it changes. Legacy manual palette preferences are ignored without deleting their storage. There is no selector or setting to save; illustration colors remain unchanged.

Documentation and Design System share page backgrounds and a left sidebar: project identity, search and navigation, with the language selector in a fixed sidebar footer. On narrow screens, Menu opens this sidebar with the same fixed footer and Contents sits above the article. Project titles use the Q1 name recorded during intake (Kit Whizam otherwise); rebuild/restart the tools after renaming.

Clicking a heading’s link icon copies its URL and keeps the native section navigation, in Documentation and Storybook Docs. “Link copied” appears above the icon for two seconds, only after a successful copy. If the browser refuses clipboard access, a note reports the failure.

## Prepare and consult

With compatible Node/npm, kit dependencies installed and Docker running, run `npm run docs:dev`. Portal: `http://127.0.0.1:8000/`. `DOCS_PORT` selects another port; occupied ports are rejected without stopping their owner. Ctrl+C stops only this portal. Application/Storybook are independent; documentation needs no database.

Zensical 0.0.62 runs from the official image/digest pinned in `config/documentation/catalog.json`. No host Python, pip or uv installation. Docker may download the image on first build; subsequent generation is offline.

`npm run docs:build` creates static output. `npm run docs:check` compares inputs against current sources. `npm run docs:prepare` shows classification/diagnostics. Generated pages/assets remain under `.runtime.local/documentation/`, excluded from distribution/versioning. `current.json` selects active output only after success. Previous output stays available during rebuild; failures never replace the last complete version. After interruptions leaving `build.lock`, diagnose/preserve the attempt before resumption without deleting active-process locks.

Generated 404 pages retain a “Skip to content” link targeting their focusable heading. Tab followed by Enter bypasses navigation. Generation checks this target before publishing the site; legacy French URLs receive the same fix.

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

Presentation styles and the portal’s explicit resources are declared under `public/documentation/` and `config/documentation/catalog.json` (`presentationAssets`). Preparation copies them to `assets/typography/` for each locale and includes them in its digest. Relative paths also work for legacy French URLs. Storybook loads fonts in both manager and iframe; `.storybook/typography.css` sets documentation presentation. Design system tokens, authorities, components and styles remain unchanged.

Human publication is independent of instruction activity: `published: false` excludes a source from the portal, search and downloads while retaining its active `kind: guide` for agents. `audience` is `humans`, `agents` or `both` and describes the reader; it does not control publication. Without `published`, existing behavior is unchanged; `history` is always excluded. Preserve agent links to local sources. Human explanations describe these rules without creating a competing authority.
