# Guide technique du kit

Ce guide décrit le kit autonome. Les anciens guides d’éditeur visuel sont remplacés par la [politique du design system](docs/design-system/policy.md).

## Démarrage principal

Depuis la racine du kit, avec Node/npm compatibles et Docker Compose disponibles :

```bash
node scripts/setup-local.mjs
docker compose --env-file .env.local up --build --detach --wait
```

La configuration privée n’est pas écrasée ; les volumes restent externes au dossier. Pour arrêter sans effacer les données : `docker compose --env-file .env.local down`. Voir les [opérations](docs/operations.md) et la [sauvegarde](docs/backup-and-restore.md).

Si un runtime local est nécessaire, suivre la [préparation de l’environnement](skills/initialize-project/references/environment-setup.md) et préfixer les invocations Node/npm par `sh scripts/with-runtime.sh`. Aucune installation système automatique.

## Contrôles et Storybook

Après `npm ci` : `npm run validate:agent-kit`, `npm run typecheck`, `npm run lint`, `npm test`, `npm run test:design-system`, `npm run design-system:check`, `npm run build` et `npm run build-storybook`.

`npm run storybook` sert la documentation sur `127.0.0.1:6006`. Les stories de composants sont générées depuis le registre et les exemples rédigés. Les interactions sont fictives ; aucun enregistrement de source ou de donnée métier. Le navigateur n’a ni writer ni connexion IA.

UI Lab et ses anciennes routes sont retirés. L’application, les tests, la génération et Storybook n’exigent pas de compte IA. Les réglages passent par la modification des sources avec l’assistant, dans son mandat.

## Design system automatisé

`npm run design-system:sync` valide puis synchronise CSS, utilitaires, catalogues et stories. `npm run design-system:check` contrôle leur péremption. Trois catégories actives : primitives, tokens de composant et tokens locaux de page. Les valeurs et références sont dans le JSON DTCG ; les exemples, états attendus et recettes ont leurs contrats. Voir les [sources](src/design-system/authority/README.md).

En développement, les changements d’autorité et d’exemples synchronisent les sorties. Les fichiers générés ne s’éditent pas à la main. Les erreurs de validation préservent les sorties précédentes ; une interruption de publication garde une barrière de lecture. Voir la [politique](docs/design-system/policy.md) pour migration et récupération.
