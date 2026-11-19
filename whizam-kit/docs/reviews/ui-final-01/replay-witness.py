"""Reconstitue les sources qualifiées ; ne copie ni dépendances, ni configuration, ni base."""
import argparse
import hashlib
import io
import json
import os
from pathlib import Path
import subprocess
import tarfile

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--repository', required=True, type=Path)
parser.add_argument('--destination', required=True, type=Path)
args = parser.parse_args()
evidence = Path(__file__).resolve().parent
manifest = json.loads((evidence / 'source-manifest.json').read_text())
patch = evidence / 'witness.patch'
if hashlib.sha256(patch.read_bytes()).hexdigest() != manifest['patchSHA256']:
    raise SystemExit('Le patch ne correspond pas au manifeste.')
archive = subprocess.check_output([
    'git', '-C', str(args.repository.resolve()), 'archive', manifest['kitBase'] + ':application',
])
destination = args.destination.resolve()
destination.mkdir(parents=False, exist_ok=False)
with tarfile.open(fileobj=io.BytesIO(archive)) as source:
    source.extractall(destination, filter='data')
env = {**os.environ, 'GIT_CEILING_DIRECTORIES': str(destination.parent)}
subprocess.run(['git', 'apply', '--check', str(patch)], cwd=destination, env=env, check=True)
subprocess.run(['git', 'apply', str(patch)], cwd=destination, env=env, check=True)
for name, expected in manifest['sourceHashes'].items():
    target = destination / name
    if target.is_symlink():
        actual = 'symlink:' + os.readlink(target)
    else:
        actual = hashlib.sha256(target.read_bytes()).hexdigest()
    if actual != expected:
        raise SystemExit('Source différente du témoin : ' + name)
print('Sources du témoin reconstituées et vérifiées : ' + str(destination))
print('Configurer séparément Node/npm, les dépendances et PostgreSQL selon son README.')
