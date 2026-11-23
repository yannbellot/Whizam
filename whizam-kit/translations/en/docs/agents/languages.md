# Project languages

This authority complements AGENTS and [initial scoping](project-intake.md). Q9 chooses application languages; Q10 chooses guide, design/technical documentation and Storybook explanation languages. Conversation language selects neither. Commands, identifiers and commits remain English.

## Selection and resumption

Q9/Q10 use native single choices French / English / Both / Other language combination under canonical scoping; no multi-selection is needed. Propose translating existing content only for an additional documentation language other than fr/en, after finding actual missing translations and only if no decision is known. French, English or both alone must never trigger that question. Do not propose translating hypothetical content. Without an authorized stock migration, retain existing versions and apply selected languages to new content; a technical preference field does not justify another question. For v2, `translation: later` means no stock migration is authorized; `now` requires explicit translation approval.

Read `.documentation-language.local/choice.json` in the current copy. Legacy version 1 with `language` equal to `fr`, `en` or `bilingual` remains readable without asking again. Do not restore the obsolete assistant choice. Read the brief/checkpoint before asking for missing languages.

Version 2 is `{ "version": 2, "languages": ["fr", "es"], "defaultLanguage": "fr", "translation": "now" }`. Use `now` for translating active existing content before presentation, or `later` to retain existing content and write new content in selected languages. Normalized codes include `fr`, `en`, `es`, `pt-BR`, `zh-Hant`. Require a nonempty unique list and a default belonging to it. Propose the first selected language as initial display language in the synthesis without imposing another question. Business languages remain separate in the brief.

After explicit input run `node scripts/documentation-preference.mjs set-locales fr,es fr now`. Legacy `set fr|en|bilingual` remains compatible. Writes are minimal, private and atomic. Invalid states and symlinks fail without overwrite. Disclose failed persistence. Never ship maintainer preferences. Browser selection does not change the writing preference.

## Writing and translation

Canonical sources and executable authorities remain unique. Histories retain their language and scope. Maintain delivered FR/EN guides. Preference changes do not silently translate existing content: include migration scope in the authorized proposal.

For each additional locale write `translations/<locale>/registry.json`, version 1 with `documents` keyed by canonical path, each entry carrying `sourceHash`, the canonical text's SHA-256. Store translated text at the same path below the locale directory. Declare canonical language through the documentation catalog's `organization.documents[path].language` when needed. Preserve heading count/order, relative links and source anchors. Never update a hash without reconciling content.

## Portal and presentation

Add `translations/<locale>/presentation.json` with `version: 1`, `name`, `themeLanguage` supported by the theme, `home` Markdown, a complete `navigation` dictionary keyed by canonical navigation labels, and `pages` containing generated structural Markdown, including `_portal/steps.md` when published. Translate generated inventories through the locale registry without editing derived files. Missing entries fail explicitly. Check theme resources and requested writing systems including right-to-left; universal theme coverage is not guaranteed.

Each locale has its own output and search. Preserve FR/EN URLs, legacy French URLs and anchors. Builds neither translate nor call providers; the assistant prepares translations in the project. Publish atomically after all builds succeed. `npm run docs:translations:check` checks coverage; a build alone does not prove completion. Selectors must not imply missing translations are complete.

## Storybook

The selector includes selected additional locales. For each add `translations/<locale>/storybook.json` with version 1 and `messages`, keyed by French structural labels and accessible descriptions. Values render as React text, never executable HTML.

`LocalizedDocumentation` accepts `translations`, a React-content dictionary indexed by locale, in addition to `fr` and `en`. New project components document selected languages. Missing translations show an explicit notice and the source. Check both structural messages and story-specific explanations before claiming complete coverage. Preserve story/component/token identities and variants. Extension menus are not promised translated.

## First presentation and changes

If translating existing content is accepted at Q10, implement and verify the authorized scope before first presenting Storybook/Documentation, or disclose missing work without claiming full qualification. Application presentation is independent. Deferral preserves existing content and sets writing languages for new content. Rebuild outputs and restart Storybook after preference changes when needed. A selector does not prove coverage. Reuse answers and open decisions across conversations.
