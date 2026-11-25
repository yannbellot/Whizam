# Backup, restore and version rollback

Sources and data are transferred separately. A PostgreSQL volume is not contained in the kit folder. The procedures below require an identified target and appropriate authorization; their presence alone authorizes no operation on real or shared databases.

## Prepare a backup

Identify the Compose instance and database from private configuration without displaying secrets. Verify labels, ownership and absence of shared resources. Create an ignored `.backups.local/` directory with mode 0700 and choose a new file; this example produces a private synthetic dump without overwriting:

```bash
(umask 077; set -C; docker compose --env-file .env.local exec -T postgres sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --format=custom --no-owner --no-acl' > .backups.local/synthetic-p5.dump)
```

Redirect binary output straight to the file without displaying or versioning it. Verify exit status, size, 0600 permissions and SHA-256. Separately retain code, PostgreSQL and migration versions. Separate storage, encryption and retention must be defined for real data; a local copy alone is not a durable policy.

## Restore without replacing the source

Within an authorized owned target, choose a new destination name. If it exists, stop without removing it. Create the destination with `createdb`, then use `pg_restore --exit-on-error --no-owner --no-acl`, reading the dump from standard input. Do not use `--clean`, resets or volume replacement.

Compare expected content, identifiers, dates, constraints and the migration journal. Verify the compiled runtime and relevant flows against this destination with its private configuration. Neither file presence nor a successful dump command validates a restore. The migrator provides no automatic downgrade.

## Rollback and destructive operations

Restore code and sources compatible with the schema together. Prefer a verified separate restore before switching. Never assume an older version can read a newer schema.

Database/volume replacement, `down --volumes`, backup purges, data deletion or irreversible migrations require identity, impact, a verified backup and explicit authorization. Ordinary shutdown uses `down` without volumes; see [operations](operations.md). Design system rollback follows its [policy](design-system/policy.md), without mixing the former editor and new sources.

## Historical evidence scope

The previous P5 summary remains in historical sources. It concerns PostgreSQL 18.6, migration 0000, candidate `1a33aee`, synthetic data and dedicated resources. It reports a verified restore with exact content and the compiled runtime; the initial incorrect trial and retest remain preserved. This result qualifies neither a derived project's schema nor a new kit edition.

Checks for a new restore must identify their own version, target, expected data and limitations. This documentation revision performs no PostgreSQL backup or restore.

<a id="backup-restoration-and-version-rollback"></a>
<a id="source-backup-restoration-and-version-rollback"></a>

<a id="preparer-une-sauvegarde"></a>
<a id="source-preparer-une-sauvegarde"></a>

<a id="restaurer-sans-remplacer-la-source"></a>
<a id="source-restaurer-sans-remplacer-la-source"></a>

<a id="retour-arriere-et-operations-destructives"></a>
<a id="source-retour-arriere-et-operations-destructives"></a>

<a id="sauvegarde-restauration-et-retour-de-version"></a>
<a id="source-sauvegarde-restauration-et-retour-de-version"></a>
