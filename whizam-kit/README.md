<a id="kit-de-conception-et-de-développement-dapplications-web"></a>

# Kit Whizam — conception et développement d’applications web

Whizam est le nouveau nom de Loomata. Les chemins, commandes et identifiants techniques existants sont conservés ; les documents et captures historiques gardent leur nom d’origine.

Un kit à installer sur votre ordinateur pour concevoir, construire et transmettre une application web avec l’assistant IA de votre choix : **Codex, Claude Code, Gemini CLI, Mistral Vibe Code CLI**, ou un autre assistant capable de lire et modifier les fichiers d’un projet local.

Destiné aux designers UX/UI et Product Designers, il réunit une application de départ, un design system automatisé, Storybook pour consulter les composants, Zensical pour consulter la documentation du projet et des méthodes de travail pour les assistants. Vous décrivez votre intention, définissez les choix de conception et examinez le résultat ; l’assistant vous accompagne dans le cadrage, la réalisation, les vérifications et la documentation.

Pour avancer pas à pas, consultez le [Guide d’utilisation](docs/guide-whizam/index.md).

## Ce que contient le kit

| Élément | Usage |
| --- | --- |
| **Application web** | Un socle React, React Router et TypeScript, avec PostgreSQL, Drizzle et Docker Compose pour la persistance. |
| **Design system automatisé** | Primitives, tokens de composant et tokens locaux de page ; génération des styles et inventaires depuis les sources du projet. |
| **Storybook** | Consultation des composants React, variantes, états et patterns ; stories actualisées depuis le registre et les exemples. |
| **Documentation Zensical** | Portail des Markdown du projet avec navigation, recherche et actualisation automatique ; exécuté via Docker, sans Python hôte. |
| **Instructions pour les assistants** | Quatre rôles et 21 skills pour cadrer, concevoir, développer, revoir et transmettre le projet. |
| **Contrôles et documentation** | Des tests, scripts de validation, migrations et guides pour vérifier et reprendre le travail. |

Le parcours `/projects` est un exemple de gestion de fiches fictives avec stockage en base. Il sert de référence technique et sera adapté ou remplacé selon votre brief. La roadmap et le point de reprise sont des modèles à renseigner pour votre projet.

## Installer le kit et choisir son assistant

1. Copiez ou décompressez le dossier complet dans l’emplacement de votre choix, en conservant les fichiers cachés et les liens internes.
2. Ouvrez ce dossier dans votre assistant de développement, ou lancez sa CLI depuis cette racine.
3. Demandez-lui de lire les instructions puis de démarrer votre projet. Fournissez un brief, demandez un guidage ou une démonstration. Le questionnaire reprend seulement les informations manquantes ; les réponses sont conservées entre conversations. Aucun choix d’assistant n’est demandé.

Le [cadrage initial](docs/agents/project-intake.md) précise les dix questions, les demandes complémentaires en conversation et la synthèse à valider avant développement. Les langues documentaires sont choisies en dernier.

Les entrées livrées sont les suivantes :

| Assistant | Instructions du projet |
| --- | --- |
| Codex | `AGENTS.md` et skills dans `.agents/skills/`. |
| Claude Code | `CLAUDE.md` et skills dans `.claude/skills/`. |
| Gemini CLI | `GEMINI.md` et skills dans `.agents/skills/`. |
| Mistral Vibe Code CLI | Demander explicitement la lecture d’`AGENTS.md`, puis le chargement du rôle et des skills utiles. |
| Autre assistant | Demander la lecture d’`AGENTS.md`, d’`agents/builder.md` et des procédures utiles dans `skills/`. La découverte automatique dépend de l’outil. |

Vous pouvez commencer avec cette demande :

> Lis les instructions AGENTS.md de ce dossier, puis initialise un nouveau projet Atlas. Accompagne-moi pour définir sa première version.

Le nom suffit pour analyser la préparation ; ajoutez votre intention si vous la connaissez déjà. L’assistant examine le dossier, présente le périmètre prévu et vous demande de valider son exécution avant de modifier les fichiers, installer ou démarrer les services. Après votre accord, il prépare le projet puis vous aide à cadrer et réaliser une première version dans le périmètre validé. Pour un projet commencé, demandez de lire son état et de poursuivre le travail sans le réinitialiser.

Les questions informatives reçoivent une réponse directe. Une petite modification claire, locale et réversible peut être exécutée directement, avec une brève confirmation après vérification. Dans Codex et Claude Code, cette exception suppose une recommandation modèle/niveau déjà connue et inchangée : la première recommandation ou son changement est présenté avant l’exécution et attend votre validation. Une recommandation identique n’est pas répétée. Vous choisissez manuellement votre réglage ; voir les [règles de collaboration](AGENTS.md#traitement-des-demandes-et-validation-de-lexécution) et les politiques [Codex](docs/codex/chantier-model-routing.md) ou [Claude Code](docs/claude/chantier-model-routing.md). Les règles communes restent applicables aux autres assistants sans correspondance de modèles inventée.

Chaque assistant s’installe et s’authentifie avec votre propre accès. Les adaptations livrées ne garantissent pas que tous les assistants découvrent automatiquement les skills ou se comportent de manière identique. Consultez les [adaptations](docs/agents/adapters.md) et la [matrice de compatibilité et d’essais](docs/compatibility.md) pour connaître les vérifications réalisées et leurs limites.

## Choix, vérifications et validation

Lorsqu’une décision est nécessaire, l’assistant présente les options avec les contrôles natifs disponibles, avec leur saisie libre native, sans légende répétitive. Vous pouvez préciser ou corriger votre choix ; une contradiction ou condition importante est clarifiée avant exécution. Si l’interface ne permet pas les notes associées, répondez en texte avec le choix et sa précision. L’apparence dépend du client ; aucun formulaire supplémentaire n’est nécessaire.

Pour les parcours concernés par une revue, trois modes sont proposés : **Manuel** (vous suivez une recette préparée), **Automatisé — E2E** (l’assistant exécute les scénarios convenus), **Combiné** (les deux). Le mode est conservé pour les retests du même périmètre. Ces choix ne remplacent pas les contrôles techniques obligatoires ni les revues design, technique et sécurité.

L’accord d’exécution, le retour de recette et l’acceptation de la version sont distincts. Une recette manuelle reste en attente de votre retour ; un succès E2E ne vaut pas votre acceptation. Aucun choix présélectionné, silence ou expiration ne vaut accord. Les petites corrections déjà autorisées gardent leur traitement direct et les questions ne sont pas répétées sans besoin. Voir le [protocole et les exemples](docs/agents/user-decisions.md).

## Renseigner un accès confidentiel

Quand une fonctionnalité nécessite un mot de passe ou une clé, l’assistant ouvre une page locale de saisie : vous remplissez les seuls champs nécessaires puis choisissez **Enregistrer** ou **Annuler**. Aucun fichier à éditer ; le mot de passe reste masqué et les valeurs ne sont pas transmises à l’assistant. Ne les collez pas dans le chat. Ce parcours utilise le navigateur intégré si disponible ; sinon votre navigateur local. L’enregistrement ne teste pas le fournisseur et n’effectue aucun envoi réel.

Si le formulaire est indisponible, l’assistant peut ouvrir la configuration privée directement dans un onglet fichier Codex. Les valeurs sont alors visibles dans l’éditeur. Voir le [parcours et ses limites](docs/agents/private-configuration.md).

## Lancer l’application en local

Prérequis de référence : **Node 24.22.0**, **npm 11.8.0**, **Docker** démarré et **Docker Compose**. Les plages acceptées figurent dans [package.json](package.json). Si ces outils manquent, l’assistant peut vous guider avec la [procédure de préparation de l’environnement](skills/initialize-project/references/environment-setup.md).

Depuis la racine du dossier :

```bash
node scripts/setup-local.mjs
docker compose --env-file .env.local up --build --detach --wait
```

La préparation crée une configuration privée `.env.local`, sans écraser une configuration existante, et affiche l’adresse locale à ouvrir. Le démarrage prépare la base de données et les données fictives de l’exemple. Docker construit l’application ; l’installation npm ci-dessous sert aux outils exécutés directement sur votre ordinateur.

Pour arrêter l’application en conservant les données :

```bash
docker compose --env-file .env.local down
```

L’application, Storybook, Zensical et les contrôles fonctionnent sans compte IA ni clé de modèle. L’assistant IA nécessite son propre accès. Figma reste facultatif.

## État initial vierge

L’application affiche une page vide ; la démonstration `/projects` est retirée et `db:seed` n’insère aucune donnée. Les migrations et données préexistantes sont conservées. Storybook ne présente aucun contenu initial de projet. Zensical présente dès le premier démarrage les guides utiles, séparés entre Documentation designer et Documentation technique. Le Suivi de projet regroupe État courant, Roadmap et Étapes du projet. Les historiques du kit restent dans les sources, hors du portail et de sa recherche.

Les politiques, instructions, composants et exemples requis par les contrats restent dans les sources internes. `.storybook/starter-stories.json` exclut explicitement les stories de référence initiales ; la publication exige maintenant une adoption explicite dans `.storybook/project.json`, après adaptation au projet. Les stories non classées sont signalées et restent masquées. Le registre documentaire sépare guides actifs, documents du projet et historiques non publiés ; les règles de classement sont dans le [guide documentaire](docs/documentation.md). Les nouveaux documents restent détectés et visibles, avec un diagnostic de classement à compléter. Les références privées ou extérieures du socle ne sont pas chargées. Les modèles de suivi restent à initialiser.

## Consulter Storybook

Storybook affiche toute son organisation avec des rubriques vides, sans exemple par défaut. Il accueillera les fondations, composants, variantes, états et patterns du projet. Il utilise les mêmes composants et tokens que l’application. Aucun réglage ne s’enregistre depuis son interface.

```bash
npm ci
npm run storybook
```

Ouvrez [Storybook local](http://127.0.0.1:6006). Les exemples rédigés et le registre des composants alimentent ses stories ; seuls les éléments déclarés pour le projet sont publiés. Voir l’[organisation et la publication](docs/design-system/architecture.md#organisation-et-publication-storybook). Les réglages du design system se maintiennent dans les sources avec l’assistant.

## Maintenir le design system avec l’assistant

Décrivez la création ou le changement souhaité. L’assistant maintient les sources, variantes et exemples dans le même travail ; les scripts génèrent les sorties et vérifient la cohérence, sans compte IA.

Trois catégories de tokens : **primitives** (valeurs brutes), **tokens de composant** (variantes et états explicites) et **tokens locaux** (composition propre à une page). Les deux dernières référencent directement une primitive. Une différence d’apparence sur un composant devient une variante explicite. Une primitive consommée reste stable ; une modification globale cible explicitement les usages à réaffecter.

Les valeurs et références sont centralisées en JSON DTCG ; le registre de composants et les recettes CSS sont en YAML. Ne pas éditer les dérivés à la main.

```bash
npm run design-system:sync
npm run design-system:check
npm run test:design-system
```

Les lancements et builds synchronisent automatiquement les sorties. En développement, les changements d’autorité et d’exemples mettent à jour la documentation. Voir la [politique du design system](docs/design-system/policy.md), le [registre des sources](src/design-system/authority/README.md) et la [migration](docs/design-system/token-migration.md).

## Consulter la documentation du projet

À la revue du projet, trois accès sont disponibles : **Application · Storybook · Documentation**. Le portail Zensical présente les Markdown du projet avec navigation et recherche, sans double saisie. Tout est livré dans ce dossier ; le parent de maintenance n’est pas nécessaire. Avec Docker démarré :

```bash
npm run docs:dev
```

Ouvrez [Documentation locale](http://127.0.0.1:8000/). La génération utilise une image officielle épinglée et ne demande pas de Python hôte, de compte IA ou de base métier. Les modifications des sources actualisent automatiquement le portail. Pour les builds, diagnostics et règles de classement, voir le [guide documentaire](docs/documentation.md).

## Vérifier et transmettre son projet

Après `npm ci`, les principaux contrôles disponibles sont :

```bash
npm run validate:agent-kit
npm run typecheck
npm run lint
npm test
npm run build
npm run build-storybook
npm run test:documentation
npm run docs:build
npm run docs:check
```

Ces commandes vérifient des aspects distincts du kit ; une réussite technique ne remplace pas votre revue du résultat. Le [parcours de démarrage](docs/product/project-start.md), les [conventions](docs/conventions.md) et les [opérations](docs/operations.md) précisent la réalisation, le suivi et la reprise.

## Renommer, déplacer ou transmettre

Vous pouvez renommer ou déplacer le dossier. Conservez notamment `.agents/`, `.claude/`, `.storybook/` et les liens relatifs des skills. Pour distribuer une nouvelle copie, transmettez les sources et `.env.example`, en excluant dépendances installées, builds, caches, configurations privées, connexions IA et données personnelles. Les volumes Docker sont externes au dossier : les déplacer ou transmettre leurs données nécessite une [sauvegarde distincte](docs/backup-and-restore.md).

Le kit est un point de départ à adapter et à vérifier pour votre application. Il ne constitue pas une application métier déjà réalisée ni une garantie de préparation à la production. La [notice de distribution](docs/distribution/README.md) précise la provenance, les contrôles et les limites de cette édition ; cette copie locale n’accorde pas de droits de redistribution supplémentaires.

## Langue documentaire

Appliquer le [cadrage initial](docs/agents/project-intake.md) : questions conditionnelles, second niveau en conversation et reprise depuis le brief/suivi. Ne pas demander quel assistant est utilisé ; suivre sa politique par point d’entrée. Recueillir les langues documentaires en Q10 seulement si elles manquent, selon [Langues du projet](docs/agents/languages.md).

Exception de cadrage : la demande explicite de démarrage autorise immédiatement les écritures minimales de réponses et d’accueil, sans initialisation technique ni développement. Utiliser l’outil de sauvegarde et relecture avant chaque question suivante selon le [cadrage canonique](docs/agents/project-intake.md). Cette exception ne vaut aucune autre autorisation.
