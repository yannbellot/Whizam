# 005 — Assist installation and resume the project runtime

**26 October 2026 — scope approved by the owner; per-platform qualification remains to be demonstrated.**

## Context

The kit should support designers without Node/npm or Docker once their assistant works and the kit is retrieved. Previously tested dependency installations used existing runtimes. setup-local only prepares configuration and requires Node. Decision 004’s four startup sequences stay unchanged.

## Decision

Specify macOS 26 on Apple Silicon and Ubuntu 24.04 LTS arm64 workflows in the [environment reference](../../skills/initialize-project/references/environment-setup.md), canonical source for diagnosis, assistance and recovery. Windows is a later slice; other platforms remain unqualified.

Preserve compatible Node/npm installations. Otherwise prefer an ignored project installation from verified official archives; machine installation remains an explicit choice/fallback. Version targets stay in .nvmrc/packageManager, compatible ranges in engines. Runtime belongs to the machine, not distributed sources.

POSIX helper `scripts/with-runtime.sh` rediscovers a compatible pair for each command, preserves arguments/failure codes, sets child paths and local npm cache without changing the parent terminal. Its necessity is supported by observed Node 24.13.1, below kit target: a path available in a former conversation is insufficient for resumption. The helper downloads/installs nothing and does not replace setup-local.

Docker assistance depends on OS: Desktop on Mac, Engine/Compose plugin on Ubuntu. Explain system operations/permissions; consent, secrets and restarts remain human. No implicit global changes, installation replacement or access expansion. VM testing is a manufacturer technique, never a user dependency.

## Qualification and consequences

Test complete installation, interruption, resumption and preservation separately per OS/architecture. Extraction, PATH simulations or Linux campaigns do not qualify a clean Mac. Technical trials prove neither assistant native effectiveness nor designer understanding. [Compatibility](../compatibility.md) retains these limits; no new skill, orchestrator or universal installer.
