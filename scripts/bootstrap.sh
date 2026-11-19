#!/bin/sh
set -eu
node scripts/database.ts migrate
if [ "${SEED_DEMO_DATA:-false}" = "true" ]; then
  node scripts/database.ts seed
fi
exec node scripts/start.ts
