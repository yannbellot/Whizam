# Opérations locales

## Application et données

Les prérequis Node/npm sont déclarés dans package.json. Depuis la racine du kit, `node scripts/setup-local.mjs` prépare `.env.local` sans l’écraser. `docker compose --env-file .env.local up --build --detach --wait` construit et lance application et PostgreSQL. L’écoute applicative est locale ; aucun port PostgreSQL hôte par défaut. Le démarrage applique migrations et seed fictif configuré, sans remplacer les données existantes.

`docker compose --env-file .env.local down` conserve les données ; ne pas ajouter `--volumes` pour un arrêt ordinaire. Pour déplacer la même instance, conserver `.env.local` et l’identité Compose. Pour distribuer un kit neuf, exclure les états privés et transmettre `.env.example`. Les [sauvegardes](backup-and-restore.md) restent distinctes des sources.

Pour développer sur l’hôte, utiliser l’override `config/docker/compose.host.yaml` avec compose.yaml et lancer uniquement postgres avant les migrations et `npm run dev`. Ne pas publier la base hors loopback. Les données de test sont fictives et isolées ; aucune purge globale.

## Génération et documentation

Installer les dépendances avec `npm ci`. `npm run design-system:sync` prépare les sorties depuis le JSON DTCG, le registre et les exemples. Les précommandes de dev, build, typecheck et Storybook le font automatiquement. Le mode développement surveille les sources utiles sans IA.

`npm run storybook` démarre la consultation sur `127.0.0.1:6006` ; Ctrl+C arrête son serveur. `npm run build-storybook` prépare un dossier statique. Aucune interface ou API d’écriture du design system n’est montée. UI Lab est retiré ; les anciennes URL répondent 404. Les comptes ou journaux d’anciennes instances restent privés et ne sont jamais convertis ou effacés implicitement.

La [politique courante](design-system/policy.md) remplace les procédures d’inspecteur et de writer. Pendant une synchronisation, `.design-sync.local/` bloque les lectures des serveurs de développement. Une génération en échec avant publication conserve les sorties précédentes ; une publication interrompue impose une récupération explicite, avec préservation des sources et vérification du propriétaire. Ne pas lancer de processus concurrents pour contourner ce blocage.

Les utilitaires historiques d’un autre outil conservés dans les sources ne sont pas un parcours d’installation du kit ni une dépendance de la génération courante. Les lancer n’est pas nécessaire au site, aux tests, ni à Storybook.

## Saisie privée locale

Le [parcours de configuration privée](agents/private-configuration.md) fournit le formulaire local et le repli fichier ; les secrets restent hors conversation et hors distribution. Le service ne doit pas être exposé sur le réseau. L’enregistrement ne teste pas un fournisseur et ne recharge pas une application déjà démarrée.
