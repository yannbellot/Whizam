# Opérations locales

Exécuter les commandes depuis la racine du kit avec les versions Node/npm déclarées dans [package.json](../package.json). La [préparation de l'environnement](../skills/initialize-project/references/environment-setup.md) décrit les outils manquants et le runtime local facultatif. Application, Storybook et Documentation sont des services distincts ; contrôler leur adresse et leur contenu avant présentation.

## Application et PostgreSQL avec Compose

Avec Docker et Compose disponibles :

```bash
node scripts/setup-local.mjs
docker compose --env-file .env.local up --build --detach --wait
```

La préparation crée `.env.local` sans écraser une configuration existante et affiche l'adresse retenue. Compose construit l'application, attend PostgreSQL puis applique les migrations. Le bootstrap peut appeler le seed configuré ; le seed courant n'insère aucune donnée. L'accueil reste vide tant qu'un projet n'est pas réalisé.

L'application est publiée sur `127.0.0.1` au port `APP_PORT` configuré. PostgreSQL n'a pas de port hôte par défaut. Pour arrêter l'instance en conservant les données :

```bash
docker compose --env-file .env.local down
```

Les volumes vivent dans Docker, hors des sources. Ne pas ajouter `--volumes` à un arrêt ordinaire.

## Développement applicatif sur l'hôte

Après la préparation locale, installer les dépendances et lancer seulement PostgreSQL avec l'override explicite :

```bash
npm ci
docker compose --env-file .env.local -f compose.yaml -f config/docker/compose.host.yaml up --detach --wait postgres
npm run db:migrate
npm run dev
```

L'override publie PostgreSQL sur `127.0.0.1` au `DB_PORT` configuré ; les scripts lisent `.env.local`. Le serveur Vite écoute sur la boucle locale ; vérifier l'adresse effectivement annoncée plutôt que supposer un ancien port. Ctrl+C arrête ce serveur. Arrêter ensuite la base de cette instance avec les mêmes fichiers Compose et `down`, sans volumes.

## Storybook et Documentation

Après `npm ci`, lancer chaque outil dans son terminal :

| Service | Commande | Adresse par défaut | Prérequis propres |
| --- | --- | --- | --- |
| Storybook | `npm run storybook` | `http://127.0.0.1:6006/` | Dépendances npm ; pas de base ni compte IA |
| Documentation | `npm run docs:dev` | `http://127.0.0.1:8000/` | Dépendances npm et Docker ; pas de base ni Python hôte |

`DOCS_PORT` choisit un autre port documentaire. Un port documentaire occupé est refusé sans arrêter son propriétaire. Ctrl+C arrête seulement le service concerné. `npm run build-storybook` et `npm run docs:build` construisent les sorties statiques ; le [guide documentaire](documentation.md) décrit leur publication et leur fraîcheur.

Storybook présente les seuls éléments sélectionnés pour le projet ; il n'enregistre aucun réglage visuel. UI Lab et `/projects` ne sont pas des accès à relancer.

## Synchronisation et reprise

`npm run design-system:sync` génère les sorties depuis les sources DTCG, le registre et les exemples rédigés. Les précommandes de développement, types et builds application/Storybook synchronisent ces sorties ; en développement, les sources utiles sont surveillées. Ne pas éditer les dérivés manuellement.

Une erreur de validation avant publication conserve les sorties précédentes. Une interruption de publication conserve la barrière `.design-sync.local/` ; vérifier le propriétaire et suivre la [récupération](design-system/policy.md#consultation-et-publication-locale), sans suppression forcée ni lancement concurrent. Le portail possède son propre verrou et ses sorties complètes précédentes selon le [guide documentaire](documentation.md).

Si un lancement échoue, distinguer runtime incompatible, Docker indisponible, configuration invalide, port occupé et erreur de génération. Préserver les états existants ; ne pas arrêter un processus étranger ni supprimer un volume pour résoudre un conflit.

## Configuration privée et déplacement

Utiliser le [parcours privé](agents/private-configuration.md) lorsqu'un accès manque ; ne jamais transmettre sa valeur dans la conversation. Un enregistrement ne teste pas un fournisseur et ne recharge pas un service déjà démarré.

Pour déplacer la même instance, conserver `.env.local`, son identité Compose et ses volumes. Pour transmettre une copie neuve, exclure les états privés selon la [passation](handoff.md). Un transfert des données vers un autre hôte ou moteur Docker suit la [sauvegarde/restauration](backup-and-restore.md).

<a id="application-et-donnees"></a>
<a id="source-application-et-donnees"></a>

<a id="generation-et-documentation"></a>
<a id="source-generation-et-documentation"></a>

<a id="saisie-privee-locale"></a>
<a id="source-saisie-privee-locale"></a>
