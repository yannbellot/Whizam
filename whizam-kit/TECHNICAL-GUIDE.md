# Guide technique du kit

Le Kit Whizam est un socle autonome pour créer une application web avec un assistant de développement. Il réunit React/React Router et TypeScript, PostgreSQL/Drizzle, un design system automatisé, Storybook et le portail documentaire Zensical. Toutes les commandes ci-dessous partent de la racine du kit ; aucun fichier du parent n'est nécessaire.

## État initial

L'application affiche une page vide. Storybook présente son organisation sans contenu de projet. Zensical publie les guides actifs et les modèles de suivi à initialiser. `/projects` et UI Lab sont retirés des routes actives ; leurs ressources internes ne constituent pas un projet à réaliser. Le seed, opération d'initialisation des données, n'insère aucune ligne. Voir le [périmètre](docs/product/starter-kit.md).

## Prérequis et démarrage

Les plages compatibles de Node et npm sont déclarées dans [package.json](package.json) ; Docker et Compose sont nécessaires au parcours conteneurisé. Si les outils manquent, suivre la [préparation de l'environnement](skills/initialize-project/references/environment-setup.md). Avec un runtime local déjà préparé, préfixer les commandes Node/npm par `sh scripts/with-runtime.sh node` ou `sh scripts/with-runtime.sh npm`.

```bash
node scripts/setup-local.mjs
docker compose --env-file .env.local up --build --detach --wait
```

La préparation conserve une configuration privée existante et indique l'adresse applicative. Pour arrêter sans supprimer les données : `docker compose --env-file .env.local down`. Le développement sur l'hôte, les conflits de ports et la reprise sont décrits dans les [opérations](docs/operations.md).

## Sources et génération

L'[architecture](docs/architecture.md) décrit les routes, modules serveur et données. Le [contrat des sources](src/design-system/authority/README.md) identifie les valeurs DTCG, le registre des composants, les exemples rédigés et les recettes CSS. Trois catégories de tokens sont actives : primitives, tokens de composant et tokens locaux de page. Les deux dernières référencent directement des primitives.

`npm run design-system:sync` valide et génère styles, utilitaires, inventaires et stories. Une story est un exemple interactif de composant. Ne pas modifier les dérivés manuellement. La génération ne publie pas automatiquement une story dans Storybook : la sélection du projet et son classement sont [distincts](docs/design-system/architecture.md#organisation-et-publication-storybook). Les interruptions et la récupération suivent la [politique](docs/design-system/policy.md).

## Consultation et contrôles

Après `npm ci`, `npm run storybook` sert Storybook sur `127.0.0.1:6006` ; `npm run docs:dev` sert Zensical sur `127.0.0.1:8000`, avec Docker démarré. Ces services sont distincts de l'application. Storybook est en consultation, sans writer ni connexion IA ; Zensical ne nécessite ni PostgreSQL ni Python hôte.

| Objet du changement | Contrôles à retenir |
| --- | --- |
| Instructions et bibliothèque | `npm run validate:agent-kit` |
| Code applicatif | `npm run typecheck`, `npm run lint`, `npm test`, `npm run build` ; tests de frontières, de données ou de parcours selon l'impact |
| Sources du design system | `npm run design-system:sync`, `npm run design-system:check`, `npm run test:design-system`, builds application/Storybook |
| Stories et publication des composants | `npm run build-storybook`, `npm run test:storybook` selon le parcours affecté |
| Documentation FR/EN | `npm run test:documentation`, `npm run docs:translations:check`, `npm run docs:build`, `npm run docs:check` et vérification des liens/rendus |

Un contrôle réussi ne prouve que sa portée. Les résultats datés, essais natifs et limites sont distingués dans la [compatibilité](docs/compatibility.md). Le site, les tests, les scripts et les outils documentaires fonctionnent sans compte IA ; l'assistant de développement utilise son propre accès.

## Reprise et transmission

Suivre la [passation](docs/handoff.md) pour distinguer copie neuve, déplacement d'une instance et transfert des données. Préserver fichiers cachés utiles et liens relatifs ; exclure dépendances, builds et états privés. Les volumes Docker nécessitent une [sauvegarde distincte](docs/backup-and-restore.md). Les modèles ROADMAP et project-state ne suivent pas la maintenance du kit.

<a id="controles-et-storybook"></a>
<a id="source-controles-et-storybook"></a>

<a id="demarrage-principal"></a>
<a id="source-demarrage-principal"></a>

<a id="design-system-automatise"></a>
<a id="source-design-system-automatise"></a>
