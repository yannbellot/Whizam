# Assisted private configuration

## Assistant workflow

1. Identify fields actually needed for the mandate and explain their purpose. Reuse existing configurations; never request usable existing secrets. Check presence/nonempty status only, without displaying values or loading `.env.local` into context. Never read all of `process.env`.
2. From the real project root, launch the supplied script with field names/types only: `node scripts/configure-secrets.mjs ATLAS_SMTP_USER:email ATLAS_SMTP_APP_PASSWORD:password`. Atlas names are examples, not kit business features. Other projects use their server variable names. No secret in arguments, command variables or temporary files passed to the assistant. Use `sh scripts/with-runtime.sh node …` if compatible runtime requires it.
3. Keep the process alive and open its returned local URL in a browser tab. In Codex, discover `open_in_codex`, then pass `target: { type: "browser", url: RETURNED_URL }`. If unavailable, present the local link to the designer. No remote server or Sites for secret entry.
4. Let the designer enter values. Do not inspect DOM, photograph, record or automate sessions containing real secrets; tests use fictional values only. Never request values in chat/native questionnaires. The form prefills no existing values.
5. After confirmation, check only required fields’ present/nonempty status with redacted boolean diagnostics. No `cat`, diff or searches displaying file lines. No HTTP-body logging. Save confirmation is not SMTP connection evidence. Separately verify mandate for provider calls, sending, restart or deployment.

## Delivered behavior

The dependency-free Node script listens exclusively on `127.0.0.1` using a free port. A random per-session capability, exact Host, exact POST Origin, cross-site rejection, no CORS, CSP, frame protection and no caching restrict browser access. Session URLs are temporary: never publish them in documentation/reports.

Only explicitly named fields change in `.env.local`; other lines remain. Duplicate keys, symlinks, multiple hard links, nonregular files, complex/multiline configuration and changes detected since opening are refused. Writes use a private temporary file then atomic replacement in 0600 mode. Passwords are masked; existing values are never returned and responses never contain submitted values. Apostrophes, NUL and line breaks are rejected; single-quoted serialization preserves literal `$` characters. `VITE_`/`PUBLIC_` variables are forbidden in this private workflow.

Save/Cancel close the service. Sessions expire after twenty minutes; Ctrl+C/process shutdown also close listening. Cancellation/expiry preserves the original file. The tool starts no application, Docker or provider. Running application processes do not automatically reload their environment.

This mechanism stays local: `.env.local` is plaintext readable by equally privileged processes. It is neither a vault nor protection against a compromised machine. Avoid parallel edits: change checks cannot guarantee absence of races with external writers between final check/replacement. No secret, session state or `*.local` file may be distributed, exported, committed or published in the portal.

## Codex file fallback

If the form fails, configuration is complex or the designer prefers an editor, discover `open_in_codex` and pass `target: { type: "file", path: ABSOLUTE_ENV_LOCAL_PATH }`. UI opening does not ask the assistant to read it; do not inspect contents afterward. Explain secrets are visible in the editor. Normal machine/agent permissions still apply; this fallback prevents no later read technically.

Without an opening tool, supply a Markdown link labeled “Private configuration” with the real absolute path enclosed in angle brackets, without escapes/nested brackets, then wait only for save confirmation. Permission refusals require disclosure without bypassing. Do not describe fallback as masked entry or a guaranteed editable tab: rendering depends on client.

## Checks

From the kit: `node --test tests/private-configuration.test.mjs`. Tests use temporary folders/fictional values without real providers. Automation and actual client opening are separate evidence; only user review can accept entry comfort in their Codex version.
