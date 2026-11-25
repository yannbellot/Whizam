# Architecture applicative

Le kit est une application React/React Router en Framework Mode, écrite en TypeScript. Vite construit les parties serveur et navigateur ; aucun backend séparé n'est nécessaire. Le [périmètre](product/starter-kit.md) distingue le socle livré du projet métier à construire.

## Application et routes

[app/routes.ts](../app/routes.ts) déclare les routes actives :

| Route | Responsabilité dans le kit neuf |
| --- | --- |
| `/` | Accueil vide rendu par `src/App.tsx` |
| `/imported/:definitionId` | Affichage d'une définition présente dans le registre `app/loomata-imports.json`, initialement vide ; message d'indisponibilité si elle manque |
| `/health` | État de vie `{ "status": "ok" }`, sans contrôle PostgreSQL |

Les anciennes routes `/projects` et UI Lab ne sont plus montées. Les composants et ressources historiques conservés ne sont pas des fonctionnalités exposées. Toute nouvelle route métier suit le brief, ses contrats et ses tests.

## Responsabilités des sources

| Emplacement | Responsabilité |
| --- | --- |
| `app/root.tsx`, `app/routes/` | Document HTML, rendu serveur/client et coordination HTTP |
| `app/server/` | Configuration privée, accès PostgreSQL et traitements exclusivement serveur |
| `app/features/projects/` | Ressources internes de l'ancien exemple ; aucune route active de gestion de projets |
| `src/design-system/components/` | Composants React partagés et exemples rédigés |
| `src/design-system/authority/` | Valeurs/références JSON DTCG, registre de composants et recettes YAML |
| `src/styles/` | CSS, styles générés et utilitaires Tailwind `project:` sans nouveau Preflight |
| `.storybook/` | Organisation, sélection du projet et présentation documentaire des composants |
| `docs/`, `translations/`, `config/documentation/` | Markdown canoniques, traductions et classement Zensical |
| `drizzle/`, `config/database/` | Migrations SQL, métadonnées et configuration Drizzle |
| `scripts/`, `tests/`, `config/testing/` | Génération, exploitation et contrôles isolés |
| `agents/`, `skills/`, `.agents/`, `.claude/` | Rôles, skills et expositions par liens relatifs internes |
| `compose.yaml`, `config/docker/` | Application et PostgreSQL conteneurisés ; override explicite pour la base sur l'hôte |

## Frontière serveur et données

Les modules `.server.ts` portent les accès sensibles ; les composants n'importent ni configuration privée ni pilote PostgreSQL. Zod valide la configuration. La connexion est créée à la demande ; une base disponible n'est pas nécessaire à la construction applicative.

Pour une écriture métier, définir le flux route/action → validation HTTP et données → traitement/repository serveur → PostgreSQL → réponse. Les gardes de l'ancien exemple ne protègent pas automatiquement une nouvelle route. Voir les [conventions](conventions.md) et la [sécurité](security.md).

Les migrations versionnées et données préexistantes sont conservées. Le bootstrap Compose applique les migrations puis peut appeler le seed configuré ; `seedDemoProjects` ne réalise actuellement aucune insertion. Un changement de schéma exige une migration et une cible autorisée, jamais la réécriture d'une migration déjà appliquée.

## Design system et documentation

Les [sources du design system](../src/design-system/authority/README.md) alimentent `scripts/design-system.mjs`. Le générateur valide les trois catégories de tokens, les consommateurs, les contrats et les exemples, puis publie CSS, utilitaires, inventaires et stories. La [politique](design-system/policy.md) définit la stabilité des primitives, les variantes et la récupération après interruption. Aucun éditeur navigateur ni writer n'est monté dans l'application ou Storybook.

Une story générée n'est visible qu'après sélection pour le projet. Le [registre Storybook](design-system/architecture.md#organisation-et-publication-storybook) sépare appartenance, classement et valeurs. Zensical prépare les Markdown publiés à partir de son registre, avec traductions, recherche et exclusions ; voir le [guide documentaire](documentation.md). Les historiques restent dans les sources, hors portail.

## Exécution et autonomie

Les commandes partent de la racine réelle du kit. Le développement hôte, l'application Docker et les serveurs Storybook/Zensical sont distincts ; leurs prérequis et arrêts sont dans les [opérations](operations.md). L'image applicative utilise l'utilisateur `node` et les dépendances de production, avec build, scripts et migrations nécessaires.

Les builds et caches sont reconstructibles. La configuration locale et les volumes Docker ne font pas partie d'un kit neuf. Renommer une instance conserve son identité Compose ; transférer ses données demande une [sauvegarde](backup-and-restore.md). Aucun lien ou import du kit ne doit nécessiter son parent.

<a id="assistance-de-styles-optionnelle"></a>
<a id="source-assistance-de-styles-optionnelle"></a>

<a id="atelier-ui-lab-ds-edit-64-c"></a>
<a id="source-atelier-ui-lab-ds-edit-64-c"></a>

<a id="cur-commun-et-livraisons-core-01"></a>
<a id="source-cur-commun-et-livraisons-core-01"></a>

<a id="documentation-derivee"></a>
<a id="source-documentation-derivee"></a>

<a id="edition-persistante-du-design-system"></a>
<a id="source-edition-persistante-du-design-system"></a>

<a id="portee-explicite-et-catalogue-transactionnel-ds-edit-23"></a>
<a id="source-portee-explicite-et-catalogue-transactionnel-ds-edit-23"></a>

<a id="raccordement-autonome-ds-edit-64-d"></a>
<a id="source-raccordement-autonome-ds-edit-64-d"></a>
