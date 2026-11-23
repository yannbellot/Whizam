# Design system migration

DS-AUTO-01 removes the semantic and non-semantic decision layer. See the [policy](policy.md) and [mapping/value table](simple-token-migration.json).

Work on a complete inactive copy without private editor state. From an equipped kit, `node scripts/migrate-simple-tokens.mjs SOURCE DESTINATION` prepares JSON sources and recipes in a new destination without changing SOURCE. Upgrading an already distributed project needs its own mandate and consumer checks.

Do not convert receipts or journals from old versions. To roll back, restore compatible sources and code together; never partially roll back the authority.
