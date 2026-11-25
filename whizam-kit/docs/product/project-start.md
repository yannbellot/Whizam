# Démarrer un projet jusqu’à sa première version

Ce parcours accompagne le cadrage, la préparation technique et la réalisation d’une première version disponible pour revue. Pour un nouveau produit, recueillir d’abord les informations manquantes et l’autorisation de la synthèse selon le cadrage canonique `docs/agents/project-intake.md`. La préparation technique et le développement suivent dans le périmètre autorisé.

Une demande explicitement limitée à la préparation technique peut suivre initialize-project sans inventer de périmètre métier. Cette préparation ne constitue pas une première version de l’application. Pour une présentation pas à pas destinée au designer, consulter [Démarrer avec Whizam](../guide-whizam/index.md).

## Mandat et progression

Appliquer le [cadrage initial](../agents/project-intake.md) : questions conditionnelles, second niveau en conversation et reprise depuis le brief/suivi. Ne pas demander quel assistant est utilisé ; suivre sa politique par point d’entrée. Recueillir les langues documentaires en Q10 seulement si elles manquent, selon [Langues du projet](../agents/languages.md).

Une demande « Initialise un nouveau projet [nom] » ouvre ce parcours. Le Builder cadre le produit, recueille l’autorisation de la synthèse, puis prépare l’environnement avec initialize-project. Le nom suffit pour analyser cette préparation et présenter une proposition ; avant toute écriture, installation ou lancement, appliquer la [validation de l’exécution](../../AGENTS.md#traitement-des-demandes-et-validation-de-lexécution). L’intention est recueillie lors du cadrage, en réutilisant les réponses déjà données ; une demande explicitement limitée à la préparation technique ne nécessite pas de questionnaire produit.

La réalisation porte seulement sur une première version suffisamment définie et couverte par le mandat utilisateur. Un brief détaillé permet de préparer une proposition concrète ; une demande initiale de réalisation ne remplace pas sa validation. Si cette proposition a déjà été validée, ne pas demander une seconde autorisation technique. Si le besoin ou l’autorisation de réaliser manque, présenter la proposition de périmètre et recueillir la décision produit nécessaire avant le développement concerné. Une demande limitée à la préparation reste documentaire ; une demande limitée à l’initialisation technique s’arrête après cette séquence.

Après validation de la proposition, enchaîner les opérations déjà autorisées lorsque leurs prérequis sont satisfaits et que la configuration recommandée reste identique. Dans Codex et Claude Code, présenter la première recommandation ou son changement avant le travail concerné et attendre validation ; ne pas répéter une recommandation inchangée. Les noms des séquences donnent des repères, sans créer d’arrêt humain obligatoire entre elles. Les hypothèses visuelles ou produit limitées et réversibles restent identifiées comme provisoires selon AGENTS ; une décision matérielle manquante bloque seulement la partie qui en dépend.

<a id="1-initialisation-du-projet"></a>
<a id="source-1-initialisation-du-projet"></a>
<a id="2-cadrage-de-la-premiere-version"></a>
<a id="source-2-cadrage-de-la-premiere-version"></a>

## 1. Cadrage de la première version

Suivre intégralement [le questionnaire canonique](../agents/project-intake.md) : entrée brief ou démonstration, Q1–Q10, reprise et validation finale.

**Résultat : périmètre observable de la première version.** Avec analyze-brief, brief-to-specs et les procédures de conception utiles, préciser objectif, public, pages/parcours, contenus disponibles, comportements et direction visuelle. Les références peuvent être fournies par le designer ; Figma n’est pas obligatoire. Poser seulement les questions qui conditionnent la suite, regroupées lorsque possible.

Reformuler ce qui sera réellement visible et utilisable, ce qui est exclu, ce qui reste provisoire et les critères de réussite. Ne pas inventer une identité, des réalisations, des contenus éditoriaux ou des services pour combler un manque. Les contenus manquants sont signalés ; des données synthétiques nécessaires aux tests restent isolées. Un prototype avec simulations est nommé comme tel et ses limites sont explicites.

Pour une tranche affectant les parcours, proposer le [mode de vérification](../agents/user-decisions.md#choisir-le-mode-de-vérification) avec sa couverture : Manuel, Automatisé — E2E ou Combiné. Les décisions utiles suivent les choix natifs et l’instruction complémentaire facultative du protocole. Le choix du mode ne vaut pas accord d’exécution.

## 2. Initialisation du projet

**Résultat : projet initialisé.** initialize-project vérifie l’état existant, prépare l’environnement et le suivi, puis exécute ses contrôles. Le fonctionnement de l’exemple du starter peut servir à ces vérifications internes ; il ne représente pas le projet demandé.

La restitution indique que la préparation est terminée et poursuit la réalisation autorisée, ou s’arrête pour une demande limitée à la préparation technique. Aucun lien vers la démonstration, Storybook n’est présenté comme résultat de cette séquence. Ne pas annoncer que l’application est prête. Les commandes, URL de diagnostic et résultats détaillés restent dans le suivi technique.

## 3. Conception et développement

**Résultat : première version réalisée et vérifiée sur le périmètre convenu.** plan-feature prépare les tranches ; design-interactions, implement-feature et test-user-flow prennent le relais selon le besoin. Le Builder conserve un point de reprise par séquence dans les documents existants, sans créer de fichier témoin ou imposer une nouvelle initialisation.

Dans le projet dérivé, suivre l’[adaptation des ressources de l’ancien exemple](replacing-project-example.md) : l’accueil est vide et les démonstrations sont déjà retirées des routes actives. Créer les parcours autorisés et adapter les ressources, stories, tests et documents réellement réutilisés. Une fonction de gestion de projets ne se déduit ni du nom de la route `/projects` ni de sa présence dans le kit. Ne supprimer aucune donnée, table, migration appliquée ou volume implicitement.

Conserver les composants réutilisables utiles et préparer dans Storybook une entrée pertinente vers les composants du projet, leurs variantes et leurs états. La documentation générique peut rester disponible pour le développement ; les démonstrations métier fictives du starter ne font pas partie de la première version présentée.

Les serveurs et URL peuvent servir aux contrôles internes avant cette revue. Leur démarrage ne déclenche pas une livraison et cette règle de présentation n’installe pas de blocage technique d’accès. Vérifier les pages/parcours convenus et les composants affectés, réaliser les revues applicables et consigner les limites ; un HTTP 200 ou un build réussi ne démontre pas à lui seul le résultat produit.

## 4. Revue de la première version

**Résultat : première version disponible pour revue.** Présenter ensemble les trois accès vérifiés : **Application** vers le projet réalisé, **Storybook — composants du projet** et **Documentation** vers les références et le suivi du projet. Une page générique renommée, `/projects` inchangé ou les seules stories du starter ne satisfont pas ce critère.

Vérifier les URL réellement servies et leur contenu avant de les présenter ; ne pas réutiliser un ancien port sans contrôle. Si un accès, une observation indispensable ou un contrôle requis manque, expliquer ce qui manque et comment reprendre ; ne pas annoncer cette séquence comme terminée. Un fonctionnement partiel peut être décrit avec ses limites, sans faux succès.

Indiquer ce que le designer peut parcourir, les contenus ou comportements provisoires et le point précis sur lequel ses retours seront utiles. Les retours portent sur la compréhension, la hiérarchie, les parcours ou la direction visuelle selon le travail réalisé. La revue de cette première version ne remplace pas l’acceptation finale, les contrôles complets applicables ou la reprise par un tiers.

Pour Manuel/Combiné, fournir la recette et recueillir le [retour explicite](../agents/user-decisions.md#retour-de-recette-manuelle), en laissant la partie manuelle en attente si nécessaire. Rapporter séparément les E2E. Recueillir l’[acceptation du résultat](../agents/user-decisions.md#acceptation-du-résultat) quand les critères le permettent ; un accord de recette seul ne vaut pas acceptation globale. Regrouper les deux uniquement si leur périmètre et la question le rendent explicite.

## Restitution et reprise

Appliquer la [communication avec le designer](../../AGENTS.md#communication-avec-le-designer) : séquence en cours, résultat concret, disponibilités/limites et prochaine action. Réserver les statuts internes et preuves détaillées au suivi. L’arrêt ou la relance sont proposés en langage naturel seulement si utiles à la situation ; aucune commande ou consigne de maintenance ajoutée systématiquement en fin de message.

Projet déjà initialisé : lire le suivi, retrouver la séquence réellement atteinte et les décisions produit encore ouvertes. Ne pas reprendre l’initialisation pour une nouvelle conversation ou une fonctionnalité ordinaire. Les preuves historiques du kit ne deviennent pas des preuves du projet. Une question sur le parcours n’autorise pas son exécution ; publication et services externes gardent leur autorisation distincte.

## Documentation du projet

La revue présente Application, Storybook et Documentation après vérification de leurs contenus. Le portail Zensical est livré dans le kit ; voir le [guide documentaire](../documentation.md). Il lit les Markdown courants et ne requiert ni parent de maintenance ni Python hôte.


Exception de cadrage : la demande explicite de démarrage autorise immédiatement les écritures minimales de réponses et d’accueil, sans initialisation technique ni développement. Utiliser l’outil de sauvegarde et relecture avant chaque question suivante selon le [cadrage canonique](../agents/project-intake.md). Cette exception ne vaut aucune autre autorisation.
