# DS-EDIT-19 — Organisation Storybook et sens des tokens

**EN REVUE — qualification technique acquise, acceptation humaine différée. Doc updated.**

Cible : application, kit complet. Historique de préparation sur ea94ad8b14d5ac55de9660fcbb67ffb291584816, branche codex/prepare-ds-edit-19. La demande initiale « Prépare un chantier » autorisait uniquement inspection et documentation ; le mandat d’exécution reçu ensuite et son bilan figurent en fin de fiche. À la préparation, aucun code, autorité YAML, dérivé, dépendance, serveur ou recette locale modifié, aucun test/build lancé. Arbre suivi initial propre ; 85 fichiers non suivis préexistants, dont de nouvelles copies avec suffixe « 2 », à préserver. Les modèles ROADMAP et project-state de l’app restent non initialisés ; statut de fabrication consolidé dans le parent.

## Résultat attendu et règles retenues

Remplacer l’organisation courante par six sections natives ordonnées, sans navigation ajoutée à l’intérieur des catalogues et sans changement des valeurs résolues ni des rendus des composants.

| Ordre et intitulé exact | Responsabilité |
| --- | --- |
| 01 — Primitives | Valeurs brutes et échelles : color, space, size, radius, stroke, type… |
| 02 — Semantic Tokens | Intentions ou rôles explicites et documentés, indépendants d’un composant |
| 03 — Component Tokens | Réglages locaux par nom officiel du composant, variante, partie, propriété et état |
| 04 — Components | Éléments d’interface réutilisables et leurs variantes/états |
| 05 — Patterns | Assemblages et comportements récurrents effectivement démontrés |
| 06 — Templates | Structures de pages avec zones et emplacements de contenu |

Titres, catégories et identifiants techniques en anglais ; descriptions/documentation en français. Les numéros servent l’ordre de navigation, pas les identités des tokens. Prévoir explicitement le tri natif Storybook plutôt que dépendre de l’ordre de découverte des fichiers.

La règle de classement porte sur le sens démontré et la portée, jamais sur la seule propriété CSS, la valeur ou sa répétition :

- primitive : valeur brute sans intention ;
- sémantique : rôle/intention explicite, indépendant d’un composant, avec définition, usages identifiables et compatibilités ; la réutilisation seule ne suffit pas ;
- composant : décision locale, pouvant référencer un token sémantique si le sens est établi, ou directement une primitive sinon ; ces deux niveaux ne sont pas exclusifs dans une chaîne de références.

Une bordure signalant une erreur peut partager un rôle sémantique entre bouton et champ, si ces contextes sont préparés. Un padding uniquement visuel reste composant → primitive. Un espacement pourrait être sémantique si une relation transversale est effectivement définie ; aucun nouveau rôle n’est inventé pour conserver artificiellement un token. Ne pas supprimer tous les espacements, arrondis ou traits par principe ; auditer aussi couleurs et typographie. Intention, état et mode restent distincts : hover/disabled ne suffisent pas à établir une intention.

## Sources et écart constaté

Lire les [règles communes](../design-system/token-organization.md), le [nommage](../design-system/token-naming.md), le [modèle de migration](../design-system/token-migration.md), la [décision 021](../decisions/021-token-categories-and-common-rules.md), la [décision 020](../decisions/020-component-token-reference-model.md), le [contrat des autorités](../../src/design-system/authority/README.md) et les [preuves DS-EDIT-18](../reviews/ds-edit-18-native-sidebar.md). Les décisions antérieures restent historiques. Documenter leur évolution explicite avant l’implémentation ; ne pas réécrire leurs garanties de conservation comme si elles qualifiaient la nouvelle migration.

Observations sur la base inspectée :

- DS-EDIT-18 fournit sept fichiers CSF de catégories, 32 pages natives et deux anciens liens masqués. Les groupes restent sous Design system, Components, Patterns et Projects ; les titres MDX et quelques stories sont français.
- Les raccourcis utilisent toId et des préfixes de stories dans .storybook/editor/catalog-navigation.ts ; manager.tsx et Panel.tsx en dépendent. Renommer les titres sans traiter IDs, raccourcis, onglets et tests casserait les ouvertures de fiches.
- Binding.style est obligatoire dans src/design-system/editor/contract.ts ; la validation exige une entrée existante et compatible dans model.styles. Une référence primitive reste liée à ce style d’origine. operations.ts rétablit binding.reference = binding.style. Le graphe actuel ne représente donc pas un réglage local autonome dépourvu de faux style sémantique.
- Les espacements, arrondis et traits génériques classés aujourd’hui dans Semantic Tokens ne possèdent pas nécessairement un rôle démontré ; leur existence n’est pas une preuve de sens. La liste finale à conserver/reclasser reste à établir, aucune suppression préparatoire.
- ControlStates est une démonstration d’états, ProjectSummary un composant de l’exemple ; leur nom de groupe actuel ne prouve ni Pattern ni Template. Aucun template de page qualifié n’a été identifié dans l’inventaire ciblé des stories suivies.

## Périmètre et exclusions

Inclus pour une future réalisation : règles documentées, inventaire de classement, migration contrôlée des sources/modèle si nécessaire, validation et opérations d’édition, références/attributions, génération, fiches et guidage, catalogues, navigation native, stories/tests/documents directement affectés, puis copie de recette locale actualisée. Conserver les principes, Rules et inventaires documentaires accessibles au sein des sections appropriées ; ne pas les perdre en retirant les anciens groupes.

Exclus : redesign, modification de valeur/unité/contraste, nouvelles palettes, thèmes ou propriétés éditables, création d’un composant métier, nouveau framework/backend, fournisseur IA réel, compte transféré, modification globale de l’hôte, publication ou déploiement. Ne pas créer de dossier vide ni de faux Pattern/Template pour remplir les six sections.

Hypothèses minimales à confirmer par l’inventaire, sans bloquer la préparation : les six positions sont réservées, mais une section sans contenu réel n’a pas de page factice ; ProjectSummary relève de 04 — Components ; la démonstration ControlStates doit rester accessible mais ne devient pas un Pattern par simple renommage. Préparer son rattachement à une documentation d’états existante. Un vrai template ou un nouveau pattern nécessitant conception/contenu supplémentaire sort de cette tranche. Un arbitrage n’est demandé que si l’inventaire révèle une conséquence produit matérielle.

## Séquence de réalisation proposée

### A — Inventaire et contrat de migration

1. Relever la version, les préexistants et les instances locales réellement actives ; séparer les copies non suivies des sources canoniques sans les supprimer. Photographier les valeurs résolues, bindings, primitives, références, provenances, alias et rendus avant transformation, y compris la recette enregistrée.
2. Produire une matrice de chaque style : identité, type de valeur, rôle revendiqué, preuve de sens ou absence, consommateurs, décision conserver/reclasser, références avant/après et devenir de l’attribution d’origine. Les styles sans consommateur restent audités, sans suppression automatique.
3. Produire une table de routage des stories suivies : ancien ID/URL, section cible, ID stable ou redirection explicite, usages des liens. Affecter Rules, principes, inventaires, fixtures de migration et exemple sans groupes concurrents ni doublons visibles.
4. Formaliser l’évolution du contrat avant code : représenter un token de composant autonome et son rétablissement vers sa valeur/référence de base, sans conserver un faux token sémantique. Garder distincts valeur courante, attribution sémantique éventuelle et base de rétablissement ; éviter une ambiguïté entre absence d’attribution et exception locale.
5. Définir versions et compatibilité de modèle/snapshot/protocole selon les changements réels, ainsi que les correspondances des identités affectées. Préserver les identités primitives/composants et les styles sémantiques justifiés ; si un ancien style change de nature, tracer son remplacement et ses anciennes références hors catalogue actif. Ne pas qualifier la migration par égalité du graphe : seules les modifications déclarées dans la matrice sont permises, valeurs résolues et rendus devant rester identiques.

Sortie : décision documentée, matrices et protocole de reprise implémentables. Les choix techniques courants compatibles sont délégués ; un conflit matériel non couvert par les règles ci-dessus impose arbitrage avant transformation, sans le résoudre silencieusement.

### B — Modèle, migration et éditeur

Implémenter la solution minimale retenue dans les autorités, schémas, résolution et opérations. Migrer sur copie, avec diagnostic préalable, correspondances explicites, contrôle des références orphelines et collisions, idempotence et reprise. Conserver valeurs, unités, provenance et indépendance des réglages locaux ; aucune fusion sur égalité de valeur. Ne pas convertir/purger un ancien journal ou reçu.

Synchroniser Apparence et Styles : afficher le rôle sémantique seulement s’il est établi ; préserver édition locale, attribution sémantique compatible, propagation partagée et rétablissement dans les deux cas. Adapter le guidage et le contexte d’assistance borné pour ne plus exiger ou proposer un style sémantique pour une propriété seulement visuelle ; tests simulés, sans fournisseur réel. Régénérer les dérivés depuis les autorités, jamais les modifier à la main.

### C — Sidebar et documentation

Appliquer les six intitulés et leur ordre ; conserver catégories et noms officiels des composants. Supprimer les groupes visibles concurrents en répartissant leur contenu, garder les anciens liens utilisables ou redirigés explicitement. Adapter les raccourcis, le canal et la visibilité des panneaux aux pages cibles. Les catégories reflètent la migration effective, pas un masquage du modèle antérieur. Conserver filtre All, clavier natif, recherche, menu mobile et sélection/fiches.

### D — Qualification et recette locale

Exécuter les contrôles ci-dessous sur copies isolées. Vérifier les valeurs enregistrées dans la recette courante, conserver son ancienne racine/outillage/reçus et préparer une copie migrée sans connexion ni journal transféré. Actualiser l’accès courant seulement après qualification ; conserver point de retour et accès de reprise. Reporter résultats, versions, captures, limites et recette humaine dans docs/reviews puis le suivi parent. Aucune acceptation humaine implicite.

## Fichiers et dépendants à examiner lors de la réalisation

- Navigation : .storybook/preview.tsx, manager.tsx, main.ts si nécessaire, editor/catalog-navigation.ts, Panel.tsx, TokenCatalogPreview.tsx ; src/design-system/catalog-stories/*.stories.tsx, Foundations.stories.tsx, MigrationFixtures.stories.tsx, components/*stories.tsx, src/ui-lab/ControlStates.stories.tsx, app/features/projects/ProjectSummary.stories.tsx et les MDX.
- Données : src/design-system/authority/{primitives,semantic-tokens,semantic-catalog,editor-contract,components}.yaml et fiches *.design.yaml ; editor/contract.ts, operations.ts, draft.ts, naming.ts, taxonomy.ts, snapshot et résolution des tokens.
- Publication locale : scripts de migration existants, editor-artifacts, snapshot, documentation, génération ; .storybook/editor/server/{manifest,store,http}.mjs, session et protocoles si leurs contrats changent.
- Documentation : token-organization, token-naming, token-migration, editor-preview, editor-persistence, editor-assistance, spécification design-system-editor et décision nouvelle ; références d’agents seulement si leurs instructions deviennent effectivement obsolètes, sans extension de procédure non demandée.
- Preuves : tests contractuels de tokens/migration, unitaires de résolution/éditeur/canal, tests serveur/documentation/assistance concernés, parcours Storybook et persistance. Le manifeste fermé et les listes de sources/dérivés doivent couvrir les nouvelles dépendances réelles.

Cette liste désigne des dépendants à inspecter, pas une obligation de modifier tous ces fichiers.

## Contrôles prévus et critères de réussite

Contrôles à exécuter pendant la réalisation, **non exécutés dans cette préparation** :

| Domaine | Preuves attendues |
| --- | --- |
| Classification | Matrice exhaustive des styles existants ; rôle justifié pour chaque style sémantique actif ; aucun faux rôle ajouté pour conserver un espacement ; aucune exclusion globale par type de valeur |
| Migration | Exécution à blanc puis migration isolée répétable ; valeurs résolues strictement identiques, unités/provenance conservées, correspondances exhaustives, aucun cycle/référence orpheline/collision ; reprise et refus des versions ambiguës |
| Régressions visuelles | Captures comparables desktop/mobile et états représentatifs de tous les composants, styles calculés et géométries ; vérifier aussi la valeur propre enregistrée du bouton, pas seulement les valeurs du dépôt |
| Parcours | Pages natives ordonnées, parent/feuille/All, clavier/recherche/mobile, anciens liens, raccourcis/fiches ; aucune navigation interne réintroduite ni contenu perdu |
| Édition | Réglage purement visuel sans attribution sémantique artificielle ; modification locale, sauvegarde/rechargement et rétablissement ; rôle d’erreur partagé entre consommateurs compatibles, propagation et réglage propre conservé |
| Contrats | npm run test:design-system, npm test, types, lint, formatage, documentation générée et tests documentaires ; builds application et Storybook |
| Persistance et refus | Tests store/HTTP, persistance et récupération sur copies ; sauvegarde/relecture des nouveaux dérivés, anciens reçus conservés, schémas fermés et capacités/origines inchangées ; retester les refus affectés |
| Assistance et livraison | Tests de contexte/plans simulés si contrats affectés ; validateur du kit et reprise d’une extraction autonome renommée avec ses dépendances propres si migration/contrats de livraison changent ; aucune inférence réelle |

Toute différence visuelle ou de valeur bloque la qualification. Ne pas assouplir un contrôle pour préserver un résultat vert. Les totaux historiques 32 pages/41 styles/188 bindings ne sont pas des objectifs de comptage : justifier les nouveaux totaux et chaque correspondance. Préserver la couverture réelle de chaque propriété, et les éventuels composants en état enregistré.

## Revues, risques et configuration

Prévoir Design Reviewer (fidélité puis expérience), Technical Reviewer / QA (migration, contrats et parcours) et Security Reviewer (entrées/compatibilité et publication locale). Mode prévu : séquentiel, même agent, non indépendant ; aucun sous-agent autorisé implicitement. Les reviewers documentent les constats ; le Builder corrige. Instruction Reviewer uniquement si des instructions livrées évoluent ; qualification de distribution ciblée si le contrat autonome change. Aucune revue de réalisation prétendue acquise dans cette préparation.

Risques principaux : masquer des styles sans retirer leur dépendance réelle ; casser restore ou les réglages enregistrés ; reclasser une couleur sur son apparence ; perdre les routes lors du renommage ; transférer un journal incompatible ; déplacer une démonstration dans Patterns/Templates sans contenu adéquat. Mesures : inventaires, migration isolée, double parcours d’attribution/rétablissement, comparaisons résolues/visuelles, anciens liens et anciennes racines conservés.

Recommandation pour la réalisation : **GPT-6.1 Sol · Élevée**. Résultat clair ; surfaces identifiées mais transversales. Le contrat Binding.style, la validation, restore, la génération et le writer devront être examinés ensemble : transformation de données et plusieurs contrats dépendants. Inconnues : liste finale des styles sémantiques justifiés et représentation minimale de la base de rétablissement ; la tranche A doit les résoudre. Aucune difficulté observée ne justifie à ce stade très élevée/max ou Astra. Aucun réglage client modifié ou prétendu vérifié.

## État de sortie

Préparation documentaire uniquement. Contrôle prévu ici : relecture des trois fichiers documentaires, liens locaux et diff ; aucun test applicatif, installation, serveur ou actualisation de recette. Les preuves DS-EDIT-18 restent attachées à leur version. Statuts de DS-EDIT-18, G/J5 et acceptation humaine inchangés. Prochaine action : demande explicite de réalisation de DS-EDIT-19 ; commencer par A, puis enchaîner les tranches du mandat dont les prérequis sont démontrés. Aucun push ni publication.

## Reprise du 31 octobre 2026 — exécution engagée

Mandat explicite reçu après préparation ; base d’exécution 5bc6792, branche codex/ds-edit-19. Les paragraphes décrivant la préparation ci-dessus restent historiques. [Point de reprise](../reviews/ds-edit-19/execution-checkpoint.md), [inventaire](../reviews/ds-edit-19/token-classification.md), [matrices](../reviews/ds-edit-19/token-classification.json), [routes](../reviews/ds-edit-19/story-routing.json) et [proposition 022](../decisions/022-semantic-meaning-and-component-baseline.md).

41 styles audités : 17 sémantiques justifiés, 24 à reclasser, 137 composants autonomes à migrer sur 188 ; 24 alias conservés. Aucun runtime/autorité/valeur transformé. L’inspection des chemins réels établit des hypothèses non nulles jusque dans les plans locaux d’assistance, la validation des opérations et le writer ; vérifier ensemble base autonome, attribution sémantique, alias et refus des versions demande une réflexion très élevée. **GPT-6.1 Sol · Très élevée** recommandé pour B et ses dépendants ; arrêt avant migration conformément à AGENTS.md du lab, attente de sélection manuelle et reprise explicite. La règle sémantique reste définie, sans nouvel arbitrage de sens. 85 préexistants et anciens modèles/recettes conservés. Aucun test applicatif, build, serveur, fournisseur ou publication dans cette tranche ; contrôles documentaires uniquement. La réalisation complète reste à qualifier.

## Reprise explicite — mise en œuvre v4

Le porteur a demandé « Poursuit » après le point de contrôle. La reprise a été engagée sans prétendre vérifier le réglage du client. Modèle v4 réalisé avec `style` nullable et `baseReference` explicite ; 17 styles sémantiques, 137 composants autonomes sur 188, 24 alias conservés. Les neuf documents préparés sont v4, snapshot v3, écriture v3 et politique assistée v3 ; les schémas/validateurs historiques sont isolés pour la conversion v3. Migration avec diagnostic/idempotence, rapport avant écriture, refus des journaux/versions mixtes et contrôle des identités. Six sections ordonnées ; 05 — Patterns et 06 — Templates restent réservées sans contenu factice. Anciens IDs conservés, catégories vides masquées.

Contrôles acquis à ce stade : 69 contrats, 126 unitaires, types/lint/formatage et build Storybook ; cinq tests documentaires, dix transports/assistance simulés, 79 store/HTTP, quatre cycles de persistance aux deux formats avec build/relecture compilée, 14 captures identiques et 188 raccordements, 44 parcours statiques et six sauts conditionnels ; développement 47 réussis, deux sauts et un délai de lecture, puis huit retests ciblés réussis sans assouplissement ; quatre récupérations réelles réussies. La qualification complète attend l’extraction installée/déplacée et la recette finale. Les six procédures de l’app mentionnant encore v3 ont été actualisées, sans nouvelle permission, modèle, outil ou fournisseur. Revues séquentielles non indépendantes ; extraction et évaluation documentaire des instructions suivent les procédures lab-qualify-distribution/lab-evaluate-instructions du lab, sans chargement de nouveaux agents.

## Qualification finale et reprise

Candidat 113f08d et correction CLI 1c807da ; [bilan et revues](../reviews/ds-edit-19-storybook-structure-and-token-meaning.md), [preuve structurée](../reviews/ds-edit-19/qualification.json). Critères démontrés : 70 contrats, 126 unitaires, cinq tests documentaires, dix assistances simulées, 79 tests serveur, huit retests dev ciblés après la campagne complète, 44 parcours statiques, quatre cycles de persistance et quatre récupérations réelles ; types/lint/formatage/builds conformes. 14 captures de composants identiques, 188 propriétés raccordées et deux captures du bouton enregistré identiques. Extraction installée avec dépendances propres puis déplacée, 426 sources finales identiques. Recette finale 54118 migrée avec mêmes valeurs enregistrées, 26 pages peuplées et padding autonome contrôlés desktop/mobile. 85 préexistants, anciennes racines/comptes/reçus et modèles app conservés. Doc updated.

Les paragraphes de préparation/arrêt précédent décrivent l’historique, pas une attente actuelle de réglage. Reprise : intégration locale puis recette humaine, sans autre chantier ouvert. Limites et diagnostics conservés dans le bilan ; autres plateformes, tiers et fournisseur réel non nouvellement vérifiés. Aucune publication ni clôture G/J5.
