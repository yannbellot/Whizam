#!/bin/sh
# Select a compatible runtime without installing tools or changing the parent shell.
set -eu

root=$(CDPATH= cd -P -- "$(dirname -- "$0")/.." && pwd)
case "${1-}" in
  node|npm) tool=$1; shift ;;
  *) echo 'Usage: sh scripts/with-runtime.sh node|npm [arguments...]' >&2; exit 2 ;;
esac

# Relative PATH entries belong to the caller's directory, including empty entries.
# Resolve them before changing directory so child processes keep the same tools.
caller=$(pwd -P)
remaining=${PATH-}
resolved_path=''
while :; do
  entry=${remaining%%:*}
  case "$entry" in
    /*) ;;
    '') entry=$caller ;;
    *) entry="$caller/$entry" ;;
  esac
  resolved_path="${resolved_path:+$resolved_path:}$entry"
  case "$remaining" in
    *:*) remaining=${remaining#*:} ;;
    *) break ;;
  esac
done
PATH=$resolved_path
export PATH

compatible() {
  "$1" -e '
    const fs = require("node:fs")
    const [root, kind, version] = process.argv.slice(1)
    const range = JSON.parse(fs.readFileSync(root + "/package.json", "utf8")).engines[kind]
    const bounds = /^>=(\d+)\.(\d+)\.(\d+) <(\d+)$/.exec(range)
    const actual = /^v?(\d+)\.(\d+)\.(\d+)$/.exec(version)
    if (!bounds || !actual) process.exit(1)
    const current = actual.slice(1).map(Number)
    const minimum = bounds.slice(1, 4).map(Number)
    const firstDifference = current.findIndex((part, index) => part !== minimum[index])
    process.exit(current[0] < Number(bounds[4]) &&
      (firstDifference < 0 || current[firstDifference] > minimum[firstDifference]) ? 0 : 1)
  ' "$root" "$2" "$3" >/dev/null 2>&1
}

system_node=$(command -v node || :)
system_npm=$(command -v npm || :)
selected=''
if [ -n "$system_node" ] && [ -n "$system_npm" ]; then
  node_version=$("$system_node" --version 2>/dev/null || :)
  npm_version=$("$system_npm" --version 2>/dev/null || :)
  if compatible "$system_node" node "$node_version" && compatible "$system_node" npm "$npm_version"; then
    selected=system
  fi
fi

if [ -z "$selected" ]; then
  node_bin="$root/.runtime.local/node/bin"
  if [ ! -x "$node_bin/node" ]; then
    echo 'Node/npm compatibles indisponibles. Reprendre la préparation de l’environnement ; aucune installation effectuée.' >&2
    exit 1
  fi
  selected=local
fi

if [ "$selected" = local ]; then
  PATH="$node_bin:$PATH"
  export PATH
  if [ -f "$root/.runtime.local/npm/node_modules/npm/bin/npm-cli.js" ]; then
    npm_cli="$root/.runtime.local/npm/node_modules/npm/bin/npm-cli.js"
    npm_entry="$root/.runtime.local/npm/node_modules/.bin/npm"
  else
    npm_cli="$root/.runtime.local/node/lib/node_modules/npm/bin/npm-cli.js"
    npm_entry="$node_bin/npm"
  fi
  node_version=$(node --version 2>/dev/null || :)
  npm_version=$(node "$npm_cli" --version 2>/dev/null || :)
  if [ ! -x "$npm_entry" ] || ! compatible "$node_bin/node" node "$node_version" || ! compatible "$node_bin/node" npm "$npm_version"; then
    echo 'Runtime local incomplet ou incompatible. Reprendre la préparation de l’environnement ; aucun repli silencieux.' >&2
    exit 1
  fi
  # npm run must pass this same CLI and Node to nested npm/Node processes.
  if [ -f "$root/.runtime.local/npm/node_modules/npm/bin/npm-cli.js" ]; then
    PATH="$root/.runtime.local/npm/node_modules/.bin:$PATH"
    export PATH
  fi
fi

# Keep npm downloads local even when using a compatible machine installation.
npm_config_cache="$root/.runtime.local/npm-cache"
npm_config_update_notifier=false
export npm_config_cache npm_config_update_notifier
cd "$root"
if [ "$tool" = npm ] && [ "$selected" = local ]; then
  exec "$node_bin/node" "$npm_cli" "$@"
fi
if [ "$tool" = node ] && [ "$selected" = local ]; then
  exec "$node_bin/node" "$@"
fi
if [ "$tool" = node ]; then
  exec "$system_node" "$@"
fi
exec "$system_npm" "$@"
