# Design system migration

This procedure supports moving an older design system copy to the model of primitives, component tokens and page-local tokens. See the [policy](policy.md) and the [mapping and values table](simple-token-migration.json) to identify sources and uses to migrate.

Work on a complete inactive copy without private editor state. From an equipped kit, `node scripts/migrate-simple-tokens.mjs SOURCE DESTINATION` prepares JSON sources and recipes in a new destination without changing SOURCE. Upgrading an already distributed project needs its own mandate and consumer checks.

Do not convert receipts or journals from old versions. To roll back, restore compatible sources and code together; never partially roll back the authority.
