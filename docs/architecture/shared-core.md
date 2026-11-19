# Cœur commun et deux livraisons

**Cible architecturale du MVP — 12 novembre 2026 :** [décision 033](../decisions/033-loomata-mvp-scope-and-sequence.md), [spécification](../product/loomata-workspace.md), [critères du socle commun](../work-items/mvp-01-three-stage-development.md#préalable-commun--mvp-01-socle). Le cœur existant est conservé et étendu : identités, inventaire et versions partagés, modèle demande/tâche/modification/commit/chantier, brouillon durable, conversations privées et projections reconstructibles depuis Git. Un seul moteur coordonne inspecteurs, Codex et réconciliation, en conservant le writer DS spécialisé. Qualifier ces contrats dès le début de T1 avant les fonctions, puis raccorder User Flow en T2 et Planification/pilotage en T3. Aucune nouvelle technologie ni implémentation de ces extensions n’est déclarée par cette note. Les sections ci-dessous restent l’inventaire des versions existantes ; leurs descriptions historiques sans Git ne couvrent pas le nouveau suivi durable.

CORE-01, 9 novembre 2026. L'application reste dans application/ ; aucun monorepo, duplication du starter ou déplacement massif n'est requis.

## Inventaire des responsabilités

| Surface actuelle | Responsabilité et consommateurs |
| --- | --- |
| src/design-system/editor/ | Moteur pur de projection, session, opérations et contrats ; indépendant de Storybook et du contenant natif |
| scripts/design-editor/ | Writer Node local, autorités, transactions et récupération ; une seule implémentation |
| src/ui-lab/editor/ | Interface web et scènes ; navigateur ou WKWebView |
| .storybook/ et *.examples.tsx | Documentation isolée et exemples partagés |
| scripts/local-app.mjs | Supervision existante, ports stricts, identité et socket privé ; conserve sa CLI compatible |
| scripts/core/projects.mjs et scripts/project-files.json | Création, préparation et sélection des sources du kit, sans dépendance Git ; utilisés par le même port |
| scripts/core/local-service.mjs | Port commun local : inspection et pilotage borné du superviseur, sans shell ; l’assistance possède son canal HTTP autorisé distinct |
| scripts/local-service.mjs | Adaptateur CLI JSON du même port ; point d'entrée du prototype natif |
| macos/Loomata.swift | Fenêtre courante D, quatre WKWebView persistantes, menus et confirmations ; mêmes services locaux |
| macos/Prototype.swift | Faisabilité isolée : choix de dossier, vue WebKit, démarrer/arrêter via le port commun ; pas un installateur |
| app/server/ et drizzle/ | Exemple métier et persistance ; les projets à fabriquer ne sont pas les lignes de l'exemple Projects |
| scripts/with-runtime.sh | Sélection d'outils déjà installés ; runtime source distinct des candidats E avec Node/npm embarqués |

Le port local nécessite un appelant de confiance. Ne pas l'exposer tel quel à du JavaScript navigateur ou à une entrée réseau. Un futur adaptateur HTTP doit porter l'autorisation et la validation des chemins ; le writer existant garde ses gardes d'origine/capacité. Le prototype ne reçoit pas de commandes arbitraires depuis la page et limite sa navigation à l'origine locale annoncée par le service. Sélectionner un projet local implique faire confiance à son code de développement.

## Contrat v1

Le client transmet un nom d'opération et une racine sélectionnée explicitement. Les arguments sont passés directement au processus Node, jamais interpolés dans un shell. Le résultat JSON inclut protocolVersion: 1. Pour runtime.start/status, les états et URLs viennent du superviseur existant ; aucun succès ne signifie qu'un brouillon a été sauvegardé.

| Opération | État | Contrat |
| --- | --- | --- |
| project.inspect | Implémentée | Résout la racine et vérifie les entrées locales requises ; ne démarre rien |
| runtime.start/status/stop | Implémentées | Appellent la même CLI/supervision ; délais et erreurs conservés |
| project.create | Implémentée C | Destination nouvelle distincte du kit, copie des sources sélectionnées sous réservation de lecture, aucun écrasement |
| project.open | Implémentée C | Valide et configure seulement une instance nouvelle ; conserve le dernier dossier choisi, sans réparation implicite |
| project.prepare | Implémentée C | Dépendances et dérivés d’un projet créé par Loomata, reprise bornée et refus sous writer actif |
| project.export | Implémentée E | Instantané des sources, version et exclusions ; distinct d'une sauvegarde avec données |
| tool.export | Implémentée E | Sources du cœur et des adaptateurs correspondant à une version de l'outil |
| ai.open/status/interrupt | Implémentées D | Canal privé de chat, projet sélectionné côté hôte ; même service pour dossier et macOS |
| ai.connect | Indisponible comme opération CLI | Connexion officielle via le bouton du canal de chat D, indépendante des fichiers distribués |

Les opérations encore prévues sont annoncées false dans capabilities et refusées avant accès aux fichiers. Ni IA ni GitHub ne conditionnent les opérations déterministes. Les sauvegardes DS restent exclusivement dans leur writer existant. Le broker D ne peut modifier ni ses autorités ni ses dérivés ; il traite les fichiers texte du projet après accord explicite.

Les réponses `runtime.start/status` en état ready fournissent désormais `workspace.uiLab`, `workspace.storybook` et `workspace.preview` après validation des origines locales ; l’ancien couple uiURL/storybookURL reste présent. L’aperçu utilise le `/` du même serveur que l’atelier, sans y ajouter une capacité d’écriture. La navigation est native ; les modules web et le writer restent communs. [Qualification B](../reviews/ui-final-01-b/README.md).

## Deux livraisons

Dossier source : kit complet autonome à extraire/copier, avec prérequis et préparation documentés. Ni Git parent, ni enveloppe macOS, ni compte IA nécessaires à son exécution. Les dépendances, Node et PostgreSQL/Docker restent explicitement à préparer. Copier les sources ne transporte pas les volumes de données.

Application macOS future : même interface et mêmes services ; enveloppe native, runtime Node/npm privé, menus et installation. Le prototype présent n'embarque pas Node et ne définit pas encore les règles de packaging, signature ou mises à jour. Le contenu mutable d'un projet ne devra jamais vivre dans le bundle signé de l'app.

Les projets créés seront des dossiers séparés de l'installation de l'outil. La livraison dossier est conservée comme voie de développement et de passation ; sa qualification ne sera pas remplacée par celle du contenant macOS.

## Ordre de réalisation

CORE-01 est clôturé le 10 novembre 2026 sur demande du porteur : contrat et port commun, extraction/relocalisation et faisabilité native limitée sont qualifiés. Les deux livraisons finales restent à réaliser.

**L’interface globale B est réalisée et techniquement qualifiée, en attente de recette humaine.** [Rapport](../reviews/ui-final-01-b/README.md) : vraie app Loomata construite depuis `/application`, UI Lab/Storybook/aperçu intégrés et brouillons protégés. La clarification du porteur reste l’autorité ; l’exercice Prêts d’objets ne remplace pas ce résultat. C est raccordée selon le contrat de projets ; D apporte le chat Codex borné décrit ci-dessous ; E ajoute exports/runtime privé, F reste à réaliser.

La [tranche C](../product/project-lifecycle.md) raccorde les opérations de projets et la supervision de leurs outils. Le travail assisté Codex est raccordé selon le [contrat D](../product/agent-chat.md), avec Claude indisponible par choix explicite du porteur. Les exports `project.export`/`tool.export` sont raccordés dans E selon le [contrat de livraison](../product/local-deliveries.md). Un projet existant n’est jamais écrasé ; les exports excluent secrets, caches et états privés. Les deux contenants consomment les mêmes opérations. Ces capacités encore absentes ne sont pas annoncées livrées.

L’enveloppe macOS et sa navigation font partie de la construction de Loomata dès cette reprise ; le packaging final et Node/npm embarqués relèvent de sa qualification de distribution. La connexion OpenAI suit les conditions du chantier d’assistance intégré. La sauvegarde vers GitHub privé pour un utilisateur reste une évolution du travail local, sans serveur distant ni collaboration directe à ce stade. La livraison dossier continue d'être qualifiée indépendamment de l'app macOS ; le dossier source actuel exige encore ses prérequis. Avant de promettre un dossier prêt à lancer ou une app autonome complète, décider de la base de données, du mode source/prêt-à-lancer du dossier, des plateformes CPU et des mises à jour du runtime. L’accès personnel Codex est qualifié sur ce Mac ; les modalités de distribution et les autres plateformes restent à qualifier.

Cette séquence est un point de reprise documentaire, pas un mandat d'implémentation ni un calendrier de livraison.

## Assistance D

`scripts/agent-chat/` possède l’installation officielle privée, le transport stdio durable, les conversations et le broker fermé. `scripts/core/agent-chat.mjs` adapte les appels courts du port ; `src/assistant/` fournit la même interface React au navigateur et à la quatrième WKWebView. L’état n’est pas créé dans les sources distribuées. Voir le [contrat détaillé](../product/agent-chat.md) et la [qualification réelle](../reviews/ui-final-01-d/README.md). Un seul processus fournisseur et un seul échange actif par installation ; changer de projet est refusé pendant un échange ou une connexion en cours.

## Livraisons E

Les candidats locaux macOS arm64 utilisent Node 24.22.0 et npm 11.19.1 embarqués, sans recherche de Node global. Le dossier a son lanceur relatif ; le bundle conserve un payload de sources/dépendances et prépare l’état mutable hors Resources. Les projets restent séparés du socle. L’identifiant des sources empêche une migration silencieuse d’installation privée. Les deux exports passent par `scripts/core/exports.mjs`, appelé par le menu et la CLI de confiance, sans endpoint web privilégié. Voir le [contrat](../product/local-deliveries.md) et les [preuves](../reviews/ui-final-01-e/README.md). Les paragraphes CORE-01 ci-dessus décrivent la livraison source/prototype historique ; signature de distribution et mise à jour restent F.

## Coordination du socle Loomata

Le [contrat de coordination locale](workspace-contract.md) précise les identités, traces Git, brouillons/worktrees, révisions, récupération, raccordement DS et conversations ajoutés par MVP-01-SOCLE. Les opérations `workspace.*` sont des opérations du port local de confiance ; leurs attestations et commandes Git ne sont pas des outils natifs du fournisseur. La création et l’exécution du starter web sans Git gardent leur contrat ; la coordination du projet créé nécessite Git. Les interfaces complètes des trois tranches restent distinctes de ce noyau.
