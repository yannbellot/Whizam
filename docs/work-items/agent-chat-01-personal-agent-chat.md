# AGENT-CHAT-01 — Chat intégré avec compte personnel Codex ou Claude Code

**12 novembre 2026 — décision courante : MVP Codex uniquement.** [Décision 033](../decisions/033-loomata-mvp-scope-and-sequence.md), [séquence T1/T3](mvp-01-three-stage-development.md). Claude et ses essais sont reportés hors MVP, sans qualification ou déqualification de son accès par abonnement. Les conditions Claude et le « besoin complet » ci-dessous appartiennent au cadrage historique ; ils ne bloquent plus le MVP Codex. Le prototype isolé est conservé séparément sur `codex/claude-subscription-probe` (`e47c995`), sans activation dans le produit.

**10 novembre 2026 — Première livraison Codex réalisée dans UI-FINAL-01 D ; chantier complet non clôturé.** Voir [contrat courant](../product/agent-chat.md) et [qualification D](../reviews/ui-final-01-d/README.md). Le porteur a explicitement retenu « Codex d’abord, Claude indisponible ». Node/npm embarqués et distribution restent E–F.

**Préparation historique du 9 novembre 2026, avec conditions de faisabilité.** Cible : application. Réalisation : À faire ; parcours Claude sans clé API conditionné à la clarification décrite ci-dessous. Aucun code, dépendance, service ou compte modifié par cette préparation. Le suivi consolidé appartient à la roadmap de fabrication ; les modèles ROADMAP.md et docs/project-state.md livrés restent non initialisés.

## 1. Mandat et version examinée

Préparer l'ajout d'un chat permettant de choisir Codex ou Claude Code, connecter son propre compte sans clé API, sélectionner un dossier local, suivre les actions, répondre aux autorisations et retrouver les échanges après fermeture. Réutiliser le cœur commun et prendre en charge automatiquement les dépendances nécessaires.

La consigne initiale « Prépare ce chantier sans rien modifier dans le code » borne cette intervention. Le texte « puis implémente » décrit la réalisation à préparer, sans l'autoriser dans ce tour. Cette fiche ne vaut ni implémentation ni acceptation d'une architecture nouvelle.

Inspection : HEAD `4c3e834971ce78a471537b4deffa011ff278d29e`, branche initiale `codex/core-01-native-e2e`. Racine Git vérifiée conforme à AGENTS avant écriture. Branche documentaire : `codex/agent-chat-01-preparation`.

Préexistants hors périmètre : `application/package.json` modifié pour ajouter `test:macos-prototype`, tests macOS et script de recette non suivis, ancien fichier `.storybook/editor/SemanticStyles.tsx`, doublons suffixés ` 2` et restes frontend. Inventaire Git et empreintes de 89 fichiers préexistants relevés ; aucune absorption ni correction de ces travaux. CORE-01 D demeure en attente selon son suivi ; les tests locaux non suivis ne constituent pas une qualification acquise.

Activité concurrente constatée au contrôle final : `application/scripts/test-local-app.mjs` est devenu modifié ; les empreintes de `application/macos/tests/PrototypeE2E.swift` et `application/scripts/test-macos-prototype.mjs` ont évolué depuis le relevé initial. Ces trois fichiers n'ont été écrits par aucune action de cette préparation ; ils sont laissés dans leur état courant, hors sélection documentaire. Les 87 autres empreintes initiales sont identiques au premier contrôle. Ne pas restaurer les anciennes empreintes ni attribuer ces évolutions à ce chantier.

Procédure sélectionnée explicitement dans `skills/catalog.json` : [plan-feature](../../skills/plan-feature/SKILL.md), méthode de préparation à la version HEAD ci-dessus, issue du catalogue qualifié du kit ; aucun nouvel essai de découverte native revendiqué. [propose-architecture](../../skills/propose-architecture/SKILL.md) sert de procédure complémentaire pour la proposition ci-dessous. Rôle Builder, un seul agent. Aucun skill applicatif n'est ajouté à la bibliothèque de fabrication du lab.

## 2. Observations dans l'existant

| Source inspectée | Constat | Point de raccordement prévu |
| --- | --- | --- |
| [Cœur commun](../architecture/shared-core.md), [décision 031](../decisions/031-shared-core-two-deliveries.md), [CORE-01](core-01-shared-deliveries.md) | Une interface web, un writer, un superviseur ; enveloppe macOS encore prototype. Nouvelle connexion OpenAI et runtime embarqué explicitement ultérieurs. | Ajouter une capacité optionnelle du cœur, sans dupliquer les services dans Swift. Faire consigner cette extension avant réalisation ; ne pas réécrire les qualifications CORE-01. |
| [Port local](../../scripts/core/local-service.mjs), [CLI JSON](../../scripts/local-service.mjs) | `ai.connect` vaut false ; appels courts de confiance, sans abonnement aux événements. `inspectProject` exige un kit UI Lab préparé. | Contrat durable de sessions/événements à ajouter. Distinguer racine d'installation de l'outil et dossier cible de l'agent ; ne pas appliquer le validateur UI Lab à tout dossier de projet. |
| [Prototype](../../macos/Prototype.swift) | Choix de dossier et WKWebView ; aucune sandbox produit, aucun pont privilégié pour la page. Navigation limitée à l'origine locale ; fenêtres OAuth externes non prises en charge par ce prototype. | Sélection explicite côté hôte et ouverture du navigateur système pour l'authentification. Ne pas permettre au DOM d'exécuter une commande ou de choisir librement une racine. |
| [Routes](../../app/routes.ts), [atelier](../../src/ui-lab/editor/Workspace.tsx) | Pas de chat général ou de stockage de conversations dans les surfaces suivies inspectées. L'assistance d'intention du DS est un parcours spécialisé. | Créer une surface de chat réutilisable dans l'interface React existante, accessible dans l'enveloppe et dans le mode local autorisé. Aucun chat « déjà intégré » à simplement brancher. |
| [Agent Codex DS](../../scripts/design-editor/codex.mjs), [assistance](../../scripts/design-editor/assistance.mjs) | `createCodexDecisionAgent` : connexion officielle, état privé par installation, stdio ; threads éphémères, réponses structurées, outils désactivés et demandes d'outils/autorisations refusées. macOS uniquement. | Réutiliser les principes de transport/diagnostic, pas relâcher les protections de cet agent pour en faire un chat. Adaptateur de conversation distinct ; conserver l'assistance DS et sa connexion existantes. |
| [Transport atelier](../../src/ui-lab/editor/transport.ts), [HTTP](../../scripts/design-editor/http.mjs), [supervision](../../scripts/local-app.mjs) | Capacités, Host/Origin stricts, budgets, cycle de vie local ; le writer n'est pas un proxy IA général. | Reprendre les gardes dans un canal de chat distinct, avec sa propre capacité et durée de vie. Ne pas réutiliser la capacité d'enregistrement du DS. |
| [Sécurité](../security.md), [README](../../README.md), [.gitignore](../../.gitignore), [.dockerignore](../../.dockerignore) | Exécution locale sans comptes applicatifs ; état privé exclu des sources/images. Node/npm et outils fournisseurs ne sont pas embarqués. | État privé du chat et dépendances gérés par l'outil ; aucune identité SaaS ou migration des fiches Projects nécessaire. |

La recherche ciblée `git grep` n'a trouvé aucune occurrence de chat/conversation/Claude dans les routes, UI Lab, port commun et prototype suivis. Ce constat est recoupé avec leurs entrées d'exécution ; il ne qualifie pas les fichiers non suivis ou les copies externes, laissés intacts.

## 3. Faisabilité et sources officielles

Sources ouvertes le **9 novembre 2026**, sans connexion, installation ou inférence. Leur contenu peut évoluer : revérification requise avant de figer les versions et de distribuer.

### Codex : faisabilité documentée, qualification réelle à réaliser

[Codex App Server](https://developers.openai.com/codex/app-server) documente stdio, connexion gérée `account/login/start` de type `chatgpt`, notifications de connexion, déconnexion, threads persistants et reprise par identifiant. Il expose les événements de message/action et les requêtes d'approbation. L'hôte ouvre l'URL officielle dans le navigateur système ; le fournisseur gère son callback et les identifiants. Ne pas employer le mode expérimental de jetons fournis par l'hôte.

L'adaptateur devra couvrir `initialize`/`initialized`, `thread/start`, `turn/start`, `turn/interrupt`, `thread/list`/`thread/read`/`thread/resume`, la pagination disponible et les réponses corrélées aux approbations. Générer et valider le contrat depuis la version retenue, plutôt que supposer la compatibilité du CLI historique `0.165.0-alpha.1.2` inspecté pour DS-EDIT-14. Les notifications de fin distinguent réussite, interruption et échec.

[Authentification Codex](https://developers.openai.com/codex/auth) : compte personnel et accès au service restent soumis au plan, aux quotas et aux politiques effectives. Aucune clé API à demander, aucun accès universel ou usage gratuit à promettre. Le premier tour réel sera une preuve distincte du seul état connecté.

Une autre voie existe : [Sign in with ChatGPT](https://developers.openai.com/siwc/quickstart) et sa [configuration app-server](https://developers.openai.com/siwc/token-sharing-open-source/codex-app-server). Elle a ses propres conditions d'éligibilité et de gestion OAuth ; elle n'est pas confondue avec la connexion gérée par le binaire. La publication open source du kit n'étant pas acquise, ne pas fonder ce chantier sur son éligibilité implicite. Cette alternative n'est pas nécessaire à la proposition principale.

### Claude Code : mécanismes techniques disponibles, autorisation de ce montage à clarifier

Trois indications officielles doivent rester visibles ensemble :

- [Legal and compliance](https://code.claude.com/docs/en/legal-and-compliance) permet, sous ses conditions commerciales, d'exécuter un binaire Claude Code non modifié dans un produit, avec authentification personnelle de chaque utilisateur. La même page interdit au développeur tiers de proposer sa propre connexion Claude.ai ou de collecter/intermédier les identifiants et jetons. Elle conserve expressément la connexion personnelle au binaire officiel ; aucune de ses méthodes d'authentification ne doit être retirée ou restreinte.
- [Agent SDK overview](https://code.claude.com/docs/en/agent-sdk/overview) exige une approbation préalable pour proposer connexion Claude.ai ou limites d'abonnement dans un produit tiers, et oriente sinon vers les méthodes avec clé API.
- Le [centre d'aide sur les abonnements et le SDK](https://support.claude.com/en/articles/15036540-use-the-claude-agent-sdk-with-your-claude-plan), mises à jour des 15 juin et 7 octobre 2026, indique que SDK, `claude -p` et applications tierces continuent à consommer les limites d'abonnement. Cette indication de consommation ne résout pas à elle seule les restrictions d'intégration.

**Conclusion de préparation :** le login officiel au CLI n'est pas interdit de façon générale ; cela ne démontre pas l'autorisation d'un chat tiers personnalisé utilisant un abonnement. L'articulation de ces textes ne permet pas de qualifier ce montage sans réserve. Bloquer l'activation de cette variante tant qu'une clarification officielle applicable, ou une approbation Anthropic couvrant précisément le chat local, n'est pas obtenue. Aucun contact commercial n'est envoyé par ce mandat. Une validation humaine interne ne remplace pas l'autorisation fournisseur requise.

Chemin technique candidat après résolution : lancer le binaire officiel intact, avec son [authentification](https://code.claude.com/docs/en/authentication), puis utiliser les [entrées/sorties documentées du CLI](https://code.claude.com/docs/en/cli-reference) et sa [reprise de sessions](https://code.claude.com/docs/en/headless). `stream-json` et les identifiants de session évitent le scraping de terminal. Les autorisations peuvent passer par le mécanisme officiel `--permission-prompt-tool` vers un outil MCP local strictement dédié, à qualifier avec la version retenue. Ne pas inventer un protocole de contrôle interne non documenté. Le SDK demeure une alternative uniquement si le droit d'usage de cette authentification est établi.

L'interface de l'outil pourra présenter ce fournisseur comme indisponible avec motif tant que ce point reste ouvert. Cela serait une livraison Codex partielle, pas l'accomplissement du besoin complet « Codex ou Claude ». L'exigence sans clé API porte sur le parcours livré ; elle n'autorise pas à supprimer la méthode par clé du binaire Claude officiel.

### Confinement et dépendances : conditions communes

Choisir `cwd` ne constitue pas une frontière d'accès. Les [profils de permissions Codex](https://learn.chatgpt.com/docs/permissions), les [restrictions de lecture par plateforme](https://learn.chatgpt.com/docs/agent-approvals-security) et le [sandbox Bash de Claude](https://code.claude.com/docs/en/sandboxing) sont à qualifier avec la configuration exacte. Ce dernier distingue commandes sandboxées, outils intégrés et autres processus : confiner seulement Bash ne protège pas toutes les lectures et tous les hooks. Le confinement actuel du connecteur DS refuse surtout les écritures externes ; il ne prouve pas la restriction de lecture demandée ici.

L'[installation Claude](https://code.claude.com/docs/en/setup) documente versions natives, sommes SHA256, manifeste signé et signatures de plateforme. Ce sont des éléments pour concevoir l'installation privée, pas une preuve que le packaging de cet outil existe ou qu'une redistribution est déjà qualifiée.

## 4. Proposition d'intégration minimale

Proposition à consigner comme extension de la décision 031 avant réalisation ; pas de nouveau backend distant, framework UI, service de comptes ou migration de la démonstration Projects. Première qualification proposée sur macOS arm64, cohérente avec l'enveloppe existante ; les autres architectures restent explicitement non vérifiées et ne peuvent pas être annoncées compatibles.

### Cœur et transports

1. Ajouter au cœur Node un gestionnaire durable de processus fournisseurs, distinct des appels courts `runLocalService`. Une instance par connexion/projet actif, verrous et budgets explicites ; ne pas lancer un app-server neuf par message. Le superviseur existant possède son cycle de vie ; un changement HMR de la page ne détruit pas une session.
2. Définir un contrat fermé : disponibilité/installation, connexion/annulation/déconnexion, liste/création/reprise de conversation, envoi/interruption, réponse à autorisation et abonnement aux événements. Les noms définitifs et schémas seront fixés en tranche A. Le client transmet des identifiants liés à la capacité, jamais un exécutable, des arguments shell ou une racine libre.
3. Dans le mode web local, prévoir commandes POST et flux HTTP local authentifié par capacité, avec reprise par curseur ; un flux POST permet de garder la capacité hors des URL. Gardes Host/Origin/Fetch-Metadata, tailles et consommateurs bornés, pas de CORS, pas de cache. Le serveur choisit les racines autorisées. Le natif appelle le même service ; les pages de prévisualisation et Storybook n'obtiennent aucun privilège.
4. Ajouter les composants React de sélection fournisseur, connexion, conversations, messages/actions et autorisations dans une fonctionnalité dédiée. Utiliser les composants et tokens existants ; emplacement précis du panneau réversible à préciser avant UI. Un changement de fournisseur crée une conversation distincte, sans transmettre l'historique à l'autre fournisseur implicitement.

### Dossier, permissions et cohérence avec le writer

- Enregistrer explicitement un dossier via l'hôte, puis résoudre son chemin réel et son identité. Revalider cette association au redémarrage et au changement de dossier. Une disparition ou substitution suspend les actions ; un déplacement nécessite une réassociation explicite.
- Le modèle et ses outils n'accèdent qu'aux données du projet choisi. Refuser lectures/écritures dans le parent, un autre projet, les dossiers personnels et les répertoires d'authentification, y compris via symlinks, hardlinks, outils internes ou sous-processus. Les fichiers privés du projet, dont `.env*` et l'état du chat, ne sont pas rendus accessibles simplement parce qu'ils sont sous la racine.
- Distinguer cette autorité sur les données des accès techniques indispensables du runtime aux bibliothèques système, fichiers temporaires privés et authentification. Documenter les exceptions étroites du processus de confiance ; elles ne deviennent jamais des capacités pour les commandes ou le modèle. Si la frontière effective ne peut pas être prouvée, refuser le lancement des outils ; ne pas présenter `workspace-write` seul comme une isolation de lecture.
- Refus fermé des demandes hors périmètre, y compris après un clic utilisateur d'approbation. Pas d'escalade globale, mode sans sandbox, désactivation des permissions, accès au socket Docker ou chargement de hooks/MCP/plugins arbitraires. Les instructions utiles du dossier restent des instructions de projet, sans élargir les droits de l'hôte ; éviter le chargement implicite de configurations parentes/personnelles. Les mécanismes précis dépendent des versions et doivent être vérifiés, sans modifier les préférences globales.
- Une autorisation affiche action, fichiers/dossier, motif, étendue et conséquence avant décision. Lier sa réponse à fournisseur/compte/projet/conversation/tour/requête/instance. Refus, annulation, expiration et résolution déjà reçue doivent être distincts ; un doublon ou une ancienne approbation n'exécute rien.
- Pour les autorités du design system, garder le writer existant comme seule voie d'enregistrement pendant l'atelier. Les outils de l'agent ne doivent pas écrire ces autorités ou dérivés en parallèle. Prévoir une proposition structurée passée au writer avec ses gardes, ou une séquence explicite de maintenance hors atelier ; ne pas contourner les verrous au nom du chat.

### Conversations et données privées

Conserver les sessions natives persistantes du fournisseur et un index local versionné de l'outil : identifiant de conversation, fournisseur, référence opaque de connexion, identité du projet, identifiant natif, titre, dates, curseur et état du tour. Aucun jeton d'authentification dans cet index. Stockage privé local, écritures atomiques et reprise de journal, permissions 0700/0600, verrou de propriétaire ; pas de nouvelle base requise uniquement pour ce chat.

Proposition de localisation : état dédié de l'outil, séparé des sources du projet et du bundle signé ; la résolution et la migration de son emplacement appartiennent à la tranche A. Les jetons restent gérés par les mécanismes officiels du fournisseur dans un espace privé dédié, jamais copiés depuis une autre installation ni lus par React. Pour Claude, aucune collecte ou intermédiaire de jetons par l'outil ; son authentification officielle documente `CLAUDE_CONFIG_DIR` et des entrées Keychain distinctes selon ce répertoire. Qualifier cette séparation avec le binaire retenu, sans lire ni migrer les identifiants de l'installation habituelle.

Après fermeture normale : arrêter ou interrompre proprement les tours et conserver les sessions, sans déconnexion automatique. Après crash : relire les événements natifs, marquer les résultats inconnus/interrompus, réconcilier les curseurs, ne pas rejouer une commande ou un envoi automatiquement. Une demande d'autorisation interrompue n'est jamais approuvée à la reprise. Deux fenêtres ne pilotent pas simultanément le même tour.

Déconnexion et suppression d'historique sont des opérations distinctes. Un changement de compte ne réattribue pas les conversations ; conserver au besoin une consultation locale sans les renvoyer au nouveau compte. Exclure comptes, transcripts, index et capacités des exports, de Git, des images, de la télémétrie et des fichiers servis. Un export volontaire d'historique serait un besoin distinct.

Hypothèse minimale : retrouver les conversations créées par cette intégration, sans importer l'historique global des autres applications ni synchroniser leurs comptes. L'authentification seule ne fournit pas cet historique. Rendre cette limite visible avant recette ; une demande d'import global nécessiterait un périmètre et une vérification fournisseur distincts.

### Dépendances automatiques

Le produit doit détecter, préparer et réparer ses dépendances depuis son interface ; aucune commande npm, installation de CLI, Homebrew ou réglage PATH manuel demandé à l'utilisateur. Le parcours d'authentification et le consentement aux conditions restent humains.

Proposition : Node/npm privés dans l'enveloppe, binaires fournisseurs officiels de version/architecture qualifiées et manifeste de compatibilité possédé par l'outil. Téléchargement depuis les sources officielles, intégrité et signature lorsqu'elles existent, extraction sans traversée de chemins, installation privée atomique, verrou concurrent, reprise après interruption, conservation de la dernière version fonctionnelle. Aucune installation globale ni modification d'un outil déjà installé par la personne. Vérifier les droits et notices avant embarquement ou téléchargement géré ; ne pas modifier le binaire Claude ou restreindre ses méthodes de connexion.

Le runtime embarqué n'est pas encore livré par CORE-01. Il constitue une dépendance de la promesse « sans installation manuelle » et doit être préparé dans une tranche identifiée, pas supposé présent. Qualifier aussi les utilitaires réellement nécessaires au confinement et aux actions proposées ; une dépendance manquante produit un état explicite et ne déclenche pas un repli non protégé. L'absence de réseau permet de consulter l'historique déjà disponible, pas de promettre une première installation ou une inférence hors ligne. Docker/PostgreSQL restent les prérequis distincts des fonctionnalités existantes ; ne pas les rendre obligatoires pour consulter ce chat.

## 5. Tranches proposées et conditions d'enchaînement

| Tranche | Résultat attendu | Prérequis et sortie |
| --- | --- | --- |
| A — Contrat et choix documentés | Spécification du chat, matrice fournisseur/versions, racines d'installation/projet/état, permissions, schémas et cycle de vie ; extension documentée de 031. | Nouveau mandat de réalisation. Clarification du périmètre Claude avant son activation ; dépendance CORE-01 D et plateformes rendues explicites. Aucun changement silencieux du cahier des charges V1. |
| B — Dépendances privées | Préparation automatique des runtimes et binaires, écran d'état/réparation et reprise sur machine sans CLI/Node préparés. | Packaging du cœur et droits de distribution définis. Installation isolée et refus d'intégrité/sandbox vérifiés ; pas de commande manuelle dans le parcours final. |
| C — Codex connecté et confiné | Connexion officielle, processus durable, session et échange texte avec événements. | Schéma de la version verrouillée, sandbox lecture/écriture effective et état privé vérifiés. Aucun compte de fabrication transféré. |
| D — Actions et autorisations | Cartes d'action, refus/annulation, réponses corrélées, interruption et écriture de projet bornée. | Négatifs hors dossier, accès secrets et coordination writer réussis avant activation des outils. |
| E — Historique et reprise | Liste persistante, fermeture/réouverture, crash/reconnexion et absence de double exécution. | Sessions durables et index réconciliés, isolation entre comptes/projets, corruption et versions traitées sans perte silencieuse. |
| F — Claude conditionnel | Même parcours utilisateur via le binaire officiel et une interface documentée. | Clarification/approbation fournisseur applicable, conditions commerciales et compatibilité technique établies ; sinon reste Bloqué et résultat explicitement partiel. Pas de remplacement par clé API implicite. |
| G — Qualification et passation | Parcours complet et installation automatique sur copie propre, revues design/technique/sécurité, reprise et documentation. | Versions/fichiers qualifiés identifiés ; essais réels personnels autorisés et recette humaine séparés des simulations. Extraction source sans état privé et régression du site sans compte IA. |

Les tranches C–E peuvent être préparées techniquement avec des transports simulés ; elles ne satisfont pas à elles seules B ou la recette réelle. Ne pas marquer le besoin complet livré tant que F ou une autre condition obligatoire manque. Chaque tranche garde ses contrôles et son point de reprise ; aucune exécution n'est ouverte par cette table.

## 6. Critères et preuves à produire lors de la réalisation

| Référence | Critère observable / scénario obligatoire |
| --- | --- |
| AC-01 | Choisir le fournisseur ; dépendance absente préparée automatiquement sur environnement propre ; progression, panne réseau, signature invalide et reprise compréhensibles. |
| AC-02 | Connexion officielle avec compte personnel sans clé API saisie ; succès confirmé par fournisseur, refus/annulation/expiration traités ; un tour réel prouve l'accès. Aucun secret dans page, logs, URLs de l'outil, rapports ou export. |
| AC-03 | Sélectionner un dossier avec espaces, refuser substitution/racine étrangère, lire et modifier un témoin autorisé. Tenter lecture et écriture d'un témoin hors racine et d'un secret interne : refus effectif, y compris via shell, lien et outil intégré. |
| AC-04 | Messages progressifs, actions et erreurs dans le chat ; clavier, focus, annonce d'attente et formats desktop/mobile vérifiés. Texte et sorties d'outils rendus comme données non exécutables. |
| AC-05 | Autorisation demandée puis acceptée/refusée/annulée ; doublon, requête périmée, demande étrangère et fermeture pendant attente n'exécutent rien indûment. Hors dossier refusé même après tentative d'approbation. |
| AC-06 | Fermer complètement l'outil, relancer et poursuivre la même conversation native ; crash pendant sortie/commande/autorisation, perte de connexion et index partiellement écrit sans duplication ni faux succès. |
| AC-07 | Deux projets, deux conversations et deux fenêtres isolés ; changement de fournisseur/compte et déconnexion sans transfert implicite d'historique ni accès croisé. |
| AC-08 | Les tours du chat ne contournent pas le writer DS. Sauvegarde, récupération, aperçu, Storybook et assistance bornée existants conservent leurs garanties. |
| AC-09 | Extraction/renommage/déplacement des sources sans compte ni transcript transmis ; instance neuve déconnectée, site/Storybook toujours utilisables sans IA. Même instance déplacée : réassociation explicite du projet sans choisir silencieusement un autre dossier. |
| AC-10 | Pour chaque fournisseur annoncé : version, méthode d'authentification autorisée, installation automatique, sandbox, autorisations et reprise réellement éprouvées. Fournisseur indisponible identifié ; aucune simulation annoncée comme compatibilité réelle. |

Contrôles futurs : unitaires des schémas/états et faux transports identifiés ; intégration des processus/stockages et scénarios négatifs sur témoins fictifs isolés ; vrais parcours navigateur et macOS ; tests de crash et copie propre sans outils fournisseurs préinstallés. Exécuter les contrôles existants pertinents (`typecheck`, `lint`, frontières, tests core/agent/éditeur affectés, builds app/Storybook) et ajouter les commandes de ce nouveau périmètre avec son implémentation. **Aucune de ces campagnes exécutée pendant la préparation.**

Revues futures applicables : Design Reviewer pour le nouveau parcours, Technical Reviewer / QA pour protocoles/processus/dépendances/persistance, Security Reviewer explicitement pour authentification, confinement et autorisations. Mode à déclarer réellement ; faute de délégation autorisée, séquentiel, même agent, non indépendant. Aucune revue de procédure de fabrication ou distribution du kit d'instructions requise ici : leurs contenus ne changent pas. La vérification documentaire de cette fiche ne qualifie aucun runtime.

## 7. Configuration conseillée, bilan et reprise

Préparation : GPT-6.1 Sol · Moyenne, exploration et documentation sans modification des frontières effectives. Pour l'implémentation : **GPT-6.1 Sol · Élevée**, en raison des frontières processus/authentification, permissions et contrats de reprise à modifier. Les cinq dimensions ont été examinées : résultat borné par le mandat ; chemins du cœur et de l'atelier identifiés ; protections fournisseur/dossier/HTTP à faire évoluer ; contrats événements/index/approbations et preuves associés ; inconnues Claude, packaging et confinement maintenues ouvertes. Aucune difficulté observée ne justifie Très élevée/max/Astra ni délégation. Aucun réglage effectif du client prétendu vérifié ou modifié.

**Résultat de cette intervention :** faisabilité documentaire conditionnelle et points d'intégration identifiés, tranches et critères préparés. Fichiers concernés par l'écriture : cette fiche, `ROADMAP.md` et `docs/project-state.md` du lab. Doc updated. Aucun fichier de code modifié par cette intervention ; travaux préexistants et concurrents laissés intacts. Aucun test, build, installation, lancement de service, login, inférence, achat, contact fournisseur ou publication exécuté par cette préparation. Aucun statut J4/J5 ou CORE-01 modifié.

Contrôles de préparation : relecture du mandat et des sources officielles ; 21 cibles de liens internes vérifiées, aucune absente ; `git diff --check` réussi ; diff documentaire examiné et empreintes préexistantes comparées, avec activité concurrente consignée ci-dessus. Relecture documentaire séquentielle par le même agent, non indépendante : préparation cohérente avec réserves fournisseur et qualification runtime non exécutée. Ces contrôles ne remplacent pas les preuves futures AC-01 à AC-10.

**Reprise :** nouveau mandat de réalisation, reprendre A en revérifiant Git et les textes officiels. Résoudre la variante Claude et fixer les conditions de packaging/confinement avant d'annoncer la réalisation complète. Une livraison Codex seule exige un périmètre explicitement partiel ; cette préparation ne le substitue pas au besoin des deux fournisseurs.

## Exécution rattachée à UI-FINAL-01 D

Le nouveau mandat du 10 novembre ouvre l’implémentation et les essais personnels. Le porteur a autorisé le périmètre Codex seul, puis réalisé la connexion officielle dédiée. Binaire privé 0.167.0 verrouillé, profil natif sans accès direct au projet, protocole JSON d’actions validées par le cœur, cartes d’accord et historique/reprise ont été implémentés et testés dans la vraie fenêtre macOS. Les simulations de transport restent des contrôles complémentaires distincts des échanges réels.

Les exigences initiales de distribution complètement autonome ne sont pas déclarées acquises : Node/npm sont encore prérequis, l’installation fournisseur est qualifiée uniquement sur ce Mac arm64, panne réseau et renouvellement après expiration réelle des identifiants non exhaustifs, autres plateformes et recette humaine non vérifiés. Claude F reste conditionné à sa clarification fournisseur. Le besoin complet n’est pas clôturé par cette livraison partielle autorisée. La matrice des résultats et les échecs conservés figurent dans le rapport D. **Doc updated.**
