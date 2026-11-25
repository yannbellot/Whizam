# Backup, restoration and version rollback

Tested scope: PostgreSQL 18.6, schema/migration 0000, candidate code 1a33aee. Fictional data and dedicated resources only. Historical P5-03 report is not included; results summarized below do not qualify a new version. This documentation authorizes no real/shared-database procedures.

## Prepare a backup

Identify Compose project/source in private local configuration; check labels and absence of shared resources. Create ignored `.backups.local/` with 0700 permissions and a new 0600 file without overwriting. From the dedicated clone root, obtain the dump using:

```bash
(umask 077; set -C; docker compose --env-file .env.local exec -T postgres sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --format=custom --no-owner --no-acl' > .backups.local/synthetic-p5.dump)
```

Redirect binary output directly to the fresh overwrite-protected file; never display/version it. Verify return code, size and SHA-256. Keep code SHA, PostgreSQL version and migrations separately. A local copy is not a durable backup policy: separate storage/encryption/retention must be defined before using real data.

## Restore without replacing the source

Verify a fresh destination name does not exist; otherwise stop without deleting it. In the owned test cluster only, `createdb` creates this destination; `pg_restore --exit-on-error --no-owner --no-acl` reads the dump through stdin. Use the configured synthetic user without displaying its password. Do not use `--clean`, resets or volume replacement.

Compare exact content/counts, identifiers/dates; check constraints and Drizzle journal. Start a disposable instance of the **delivered compiled runtime** against the destination with DATABASE_URL supplied in the environment, checking idempotent migrations/bootstrap and readable journeys. P5 proved three restored rows, four in the source after post-snapshot addition, rejection of empty-name constraint violations and compiled application reading only the snapshot. The migrator provides no automatic downgrade.

## Rollback and destructive operations

Code rollback needs compatibility with the existing schema; the only current migration was tested with the same candidate, with no future compatibility promise. Prefer a separately verified restoration before switching. Replacing a database/volume, `down --volumes`, backup purge, data deletion or irreversible migration destroys state: identity, verified backup, impact and explicit authorization are prerequisites except for test resources created by the campaign. Ordinary shutdown uses `down` without volumes to preserve data.

P5 campaigns cleaned only identified containers/volume/network; synthetic dumps remain private/ignored. The initial check wrongly used source absent from the image: that failure is retained, followed by successful distributed-runtime retest. It proves neither restoration failure nor missing source in the expected distribution.
