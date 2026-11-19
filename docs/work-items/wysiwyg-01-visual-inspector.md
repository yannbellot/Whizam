# WYSIWYG-01 — Inspecteur visuel de la page React exécutée

**WYSIWYG-01 — En revue : qualification technique acquise, acceptation humaine différée.** Q puis C1–C3 et D réalisés dans la matrice explicitée ; sept sections fixes sans accordéons. [Bilan runtime](../reviews/wysiwyg-01/runtime.md). Les statuts datés ci-dessous retracent les étapes antérieures et ne décrivent pas l’état courant.

**Préparation C/D actualisée le 16 novembre 2026.** Qualification React Grab à exécuter en premier, selon la section finale ; réalisation et validation restent non exécutées. Les bilans A/B et UI ci-dessous conservent leurs versions.

**16 novembre 2026 — A réalisée et B proposée, En revue ; acceptation humaine différée.** [Étude comparative](../architecture/visual-inspector-study.md), [architecture proposée](../architecture/visual-inspector.md), [revues et limites](../reviews/wysiwyg-01-study-architecture.md). C/D restent À faire sur mandat distinct. La préparation initiale ci-dessous est conservée comme historique ; son mandat documentaire a été étendu à A/B par la demande du 16 novembre.

**Préparation initiale — CHANTIER PRÉPARÉ.** Cible canonique : application. Réalisation : **À faire**, sur mandat distinct. Cette préparation couvre uniquement l’inspection en lecture seule, cette fiche et le suivi de fabrication racine ; aucune étude externe, installation, implémentation, génération, test produit ou ouverture de serveur.

## Mandat et version de départ

Source : mission utilisateur « Étude et implémentation d’un inspecteur visuel WYSIWYG », fournie le 16 novembre 2026 ; le mandat courant est « Prépare ce chantier ». Les exigences utiles sont conservées ci-dessous pour une reprise sans pièce jointe privée. Identifiant proposé : WYSIWYG-01, évolution de l’espace Interface & Design System après MVP-01-T1 ; aucune requalification implicite de T1 ni réalisation de T2/T3.

Racine Git vérifiée : `/Users/yannbellot/Documents/GitHub/loomata`. Départ sur `main`, HEAD `1f00e22f816e386adf1887400fd1129ad2fc3d1c`, sans changement suivi. Branche documentaire : `codex/wysiwyg-01-preparation`. Nombreux fichiers non suivis préexistants, notamment copies avec suffixe ` 2`, `frontend/` et `application/.storybook/editor/` : hors mandat, sans nettoyage, absorption ni interprétation de leur origine. Relever à nouveau leur état avant réalisation.

Procédures du catalogue applicatif explicitement sélectionnées : [plan-feature](../../skills/plan-feature/SKILL.md) et [update-project-docs](../../skills/update-project-docs/SKILL.md), sources versionnées au HEAD ci-dessus. Méthode réutilisée pour l’app ; ce chargement ne les ajoute pas à la bibliothèque de fabrication du lab. Suivi consolidé dans la roadmap et l’état racine selon la décision 011 ; modèles applicatifs non initialisés conservés.

## Résultat attendu et limites

Dans la vraie prévisualisation React, activer l’inspection, survoler/sélectionner un élément imbriqué, lire ses valeurs, modifier plusieurs propriétés avec des contrôles graphiques et observer immédiatement le résultat. Annuler un geste, rétablir les valeurs initiales ou valider un lot structuré adressé à Loomata. L’inspecteur manipule une projection temporaire ; Loomata et ses agents interprètent la demande et assurent l’application définitive dans le moteur existant.

La mission demande trois intentions de portée : instance, composant et design system. Une portée ne prouve ni une correspondance de composant, ni un token, ni une autorisation d’écriture. Aucune information inconnue ne doit être inventée. La validation du lot signifie transmission, pas modification du code, commit ni validation technique du produit.

Pas de moteur de réécriture du code, page builder complet, modèle parallèle de composition, nouvel orchestrateur, backend distinct, dépendance Figma obligatoire, remplacement du contenant macOS ou chantier Electron. Pas de publication, accès fournisseur implicite, migration des projets existants ou manipulation des brouillons personnels. L’interface Loomata reste desktop ; les breakpoints du produit prévisualisé peuvent inclure des formats étroits sans ouvrir un support mobile du chrome.

## Autorités et constats locaux

À relire à la reprise : [périmètre Loomata](../product/loomata-workspace.md), [frontières UI](../architecture/ui-architecture-boundaries.md), [exploration des pages](../architecture/page-exploration.md), [contrat workspace](../architecture/workspace-contract.md), [autorités DS](../../src/design-system/authority/README.md), [décision 038](../decisions/038-foundations-inspector-chat.md), [bilan T1](../reviews/mvp-01-interface-design-agents/qualification.md). Les preuves de T1 et DS-UI-06 sont historiques et bornées ; elles ne qualifient pas ce futur inspecteur.

| Surface inspectée | Fait observé et conséquence |
| --- | --- |
| `src/ui-lab/editor/PageWorkspace.tsx`, fonction `attach` | Iframe de la vraie page, vérification origine/chemin/révision, observation des marqueurs. Les clics, pointerdown et soumissions sont actuellement interceptés ; prévoir un mode inspection explicite et restituer les interactions à sa désactivation. |
| `src/core/exploration.ts`, `resolvePage` / `resolveSelection` | Identités enregistrées, marqueurs uniques et révision commune ; absent, ambigu ou non relié ne vaut pas une sélection durable. Réutiliser cette autorité, pas un index DOM. |
| `src/ui-lab/editor/PageInspector.tsx` | Inspecteur actuel fondé sur les bindings DS ; la branche globale appelle directement `save`, les variantes passent par `project/variant`. Ne pas réutiliser cette voie comme validation du nouveau lot temporaire. |
| `src/ui-lab/editor/AppearancePanel.tsx`, `TokenInspector.tsx`, `Workspace.tsx` | Surfaces existantes à examiner pour réemploi des contrôles, rendu et session ; leur existence ne prouve pas une inspection CSS arbitraire. |
| `src/core/workspace-contract.ts`, `scripts/core/workspace-exploration.ts` | Entités page/occurrence/définition/token et projection publique depuis une racine validée ; conserver ces identités et révisions. |
| `scripts/core/workspace-design-bridge.mjs`, `workspace-design.ts`, `workspace-assistant.ts` | Passerelles du writer et de la coordination à raccorder ; validation fermée des protocoles existants, aucun droit universel issu du navigateur. |

### Compatibilité à résoudre avant le code concerné

La décision 038 donne la portée par sélection dans Foundations/Components, sans question technique systématique. La mission demande un choix instance/composant/design system. Proposition à étudier : une intention de portée dans l’inspection des pages seulement, sans remettre en cause le parcours Foundations/Components. Aucun formulaire de création de token ni contournement du chat. Si cette articulation exige de changer la décision 038, arrêter la partie concernée pour un arbitrage documenté avant implémentation ; cette préparation ne modifie pas l’autorité.

Le moteur commun conserve un brouillon persistant de modifications admises. Le futur tampon visuel avant transmission ne doit pas devenir un second brouillon de sources ou une seconde autorité. Hypothèse minimale, à confirmer en architecture : tampon éphémère, explicitement perdu à la fermeture/recharge, avec protection contre une perte non annoncée. La reprise durable après admission reste celle de Loomata. Toute exigence de persistance pré-transmission sera qualifiée séparément avant le choix de stockage.

## A — Étude technique des cinq projets

**Statut : À faire.** Ne pas choisir une bibliothèque sur sa seule notoriété. Pour chaque dépôt, relever date, commit/tag immuable, licence racine et licences des modules/dépendances envisagés, fichiers et symboles réellement lus, mécanisme, API publique ou interne, poids/dépendances React, maintenance observée et limites de build/production. Comparer intégrer, adapter avec attribution, et réimplémenter ; justifier toute réimplémentation lorsqu’un module léger réutilisable existe. Les licences et la maintenance ne sont pas vérifiées par cette préparation.

| Dépôt à étudier | Questions et mécanismes ciblés |
| --- | --- |
| [React Grab](https://github.com/aidenybai/react-grab) | Survol, sélection DOM, overlays, événements, identification React et limites des noms/métadonnées en production. |
| [GrapesJS](https://github.com/GrapesJS/grapesjs) | Style Manager, groupes CSS, contrôles, unités, événements ; modules exploitables sans importer son modèle de pages. |
| [Puck](https://github.com/puckeditor/puck) | Propriétés éditables déclarées, champs personnalisés et callbacks ; indépendance possible de son modèle de composition. |
| [React Rewrite](https://github.com/donghaxkim/react-rewrite) | Overlay, inspection React, retouches temporaires et historique ; dépendances éventuelles aux internals React. |
| [Craft.js](https://github.com/prevwong/craft.js) | Sélection, état d’éditeur, événements, regroupement des gestes et undo/redo ; usage possible sans nouveau graphe de composants. |

Livrable futur : `docs/architecture/visual-inspector-study.md`, comparatif sourcé par liens vers fichiers à commit fixé, tableau licences/coût d’intégration/couverture/limites et recommandation motivée. Les noms exacts de modules externes seront établis par lecture, pas supposés ici. Pas de clonage ou dépendance vendored dans cette préparation. Toute copie de code future conserve les avis requis. Une licence incompatible ou indéterminée bloque la réutilisation concernée.

**Sortie A :** cinq projets effectivement examinés, alternative minimale comparée aux capacités locales, raisons documentées pour chaque intégration/adaptation/réimplémentation. Une difficulté d’accès doit rester visible ; aucune étude de dépôt inaccessible prétendue achevée.

## B — Architecture et contrat de transmission

**Dépendance : A.** Livrable futur : `docs/architecture/visual-inspector.md`, avec décision d’intégration si nécessaire, dépendances exactes et alignement des autorités affectées avant code. Modules proposés, non imposés :

1. Sélection/survol et cadre indépendant des styles du produit, gestion des parents et choix précis parmi les éléments imbriqués ; conservation de la sélection après retouche, défilement et rerendu.
2. Lecture CSS : distinguer valeur calculée, déclaration accessible, héritage et référence de token connue. Une valeur calculée seule ne permet pas de retrouver sûrement une déclaration, un token ou un breakpoint. Feuilles inaccessibles et provenance inconnue restent explicites.
3. Registre extensible de propriétés/contrôles : validation CSS, unités et variables, capacités éditables/consultatives. Réutiliser les contrôles et conventions Loomata, React Aria/Tailwind et tokens outil, sans introduire un second design system.
4. Projection temporaire possédée par l’inspecteur : sauvegarde exacte des déclarations/attributs touchés, annulation/réinitialisation et nettoyage ; ne pas effacer une mutation concurrente de l’app. Les hooks d’overlay et écouteurs sont retirés à la sortie.
5. Lot de changements : regroupement des gestes, anciennes/nouvelles valeurs et intention de portée, révision de départ ; adaptateur vers la coordination et la conversation contextualisée existantes, sans nouveau protocole d’orchestration général.

Le contrat proposé doit inclure : version de schéma, identité du projet/page et révision du rendu/modèle, identifiant de lot/demande, identité d’occurrence enregistrée si connue, référence de définition React si démontrée, cible DOM temporaire sinon, portée demandée, liste ordonnée des propriétés CSS et valeurs avant/après, unités, origine de chaque valeur et références de token connues. Conserver les expressions `var(...)`, `auto`, `%`, `calc(...)` et les valeurs sans unité sans conversion silencieuse. Préserver la distinction absence de déclaration / valeur explicite / rétablissement.

Un breakpoint porte son identité ou sa condition effectivement connue ; une largeur observée ne prouve pas une règle responsive. Prévoir état/variante quand nécessaire. Éviter les chemins privés et tout contenu de formulaire. La chaîne `elementId` de l’exemple utilisateur est indicative : un sélecteur CSS ou un UUID généré à chaque clic n’est pas une identité stable. Un DOM non enregistré peut être inspecté avec une identité de session explicitement temporaire ; aucune admission durable sous une identité inventée. Définir un résultat explicite lorsqu’une correspondance manque, sans l’assimiler au succès nominal.

La frontière de transmission valide le schéma, la taille, la portée, l’identité et les révisions. Les valeurs du navigateur sont des propositions, pas des attestations. Conserver hôte/origine/capacités existants ; ne transmettre aucune capacité de writer à la page. Définir accusé de réception, refus, péremption, interruption et déduplication d’un lot retransmis. « Transmis », « appliqué », « en vérification » et « validé » restent distincts.

Pour les portées composant/design system, afficher la couverture connue et les impacts. Aucune propagation vers tous les éléments ressemblants par classe CSS ou nom React seul. L’architecture doit définir si la projection temporaire reste locale ou couvre les seules correspondances démontrées ; montrer sa limite avant validation. Pas de réécriture de l’autorité DTCG depuis l’overlay.

**Sortie B :** contrat versionné et testable, articulation avec 038 résolue, méthode d’identification/réutilisation justifiée, absence de nouvel orchestrateur et d’écriture de sources par l’inspecteur démontrable. Toute contradiction d’autorité reste un préalable bloquant, sans arrêter les autres travaux documentaires indépendants.

## C — Implémentation progressive

**Dépendance : A/B qualifiées et mandat de réalisation.** Conserver les quatre étapes de la mission ; découper l’implémentation en petits ensembles contrôlables sans réduire silencieusement la couverture :

| Ensemble | Contenu et critère observable |
| --- | --- |
| C1 — Sélection | Activation/désactivation, survol/cadre, clic, navigation entre parents/enfants, identification React si disponible, maintien après modification ; mode normal fonctionnel après sortie. |
| C2 — Apparence et typographie | Couleurs/fonds, bordures/rayons/ombres/opacité ; police/taille/graisse/interligne/alignement ; contrôles adaptés, provenance et unités visibles. |
| C3 — Dimensions, espaces et disposition | Largeur/hauteur/min/max, margin/padding/gap, Flexbox/Grid/alignement/justification ; interactions shorthand/longhand et valeurs incompatibles traitées. |
| C4 — Responsive, DS et lot | Breakpoints connus, tokens/variantes/héritage/surcharges, trois intentions de portée ; modification multiple, undo/redo, réinitialisation et transmission avec accusé de réception. |

Régler le mode inspection pour intercepter les gestes de sélection sans déclencher navigation/soumission, tout en préservant l’état métier. Un même clic ne peut pas sélectionner et activer sans convention explicite. Hors inspection, interactions et focus sont restaurés. Définir le clavier de sélection, Échap et les raccourcis d’historique sans capturer ceux des champs éditables. Inspecter les limites de portals, SVG, Shadow DOM, iframes et pseudo-éléments ; signaler les cas non pris en charge au lieu d’annoncer un support universel.

La preview reste le produit exécuté, pas une reconstruction statique. Navigation, démontage de la cible, rechargement/HMR ou révision externe invalident les associations périmées ; conserver le lot comme non transmissible ou demander sa réconciliation, sans application automatique à une nouvelle cible. Un champ invalide conserve la dernière preview valide et explique le refus.

Fichiers candidats : les surfaces locales du tableau de constats, nouveaux modules bornés sous `src/ui-lab/editor/` et schémas sous `src/core/`, adaptateur dans `scripts/core/` seulement si nécessaire. `package.json`/lockfile uniquement pour les dépendances retenues et justifiées en A/B ; aucune installation globale. Actualiser styles, stories, tests et guides directement affectés ; ne jamais éditer les dérivés générés. Ne pas modifier l’inspecteur DS entier par commodité.

## D — Qualification et preuves prévues

Tout ce tableau est **non exécuté**. Tests sur projet fictif isolé avec deux pages réelles, composant réutilisé, occurrences imbriquées, token partagé, surcharge locale et règle responsive connue ; aucune modification de recette personnelle. Formats proposés : fenêtres desktop 1280 × 900 et 1440 × 1000, clair/sombre ; tailles de preview distinctes pour éprouver les breakpoints du projet.

| Critère | Preuve attendue |
| --- | --- |
| Sélection fiable | Survol/cadre après scroll/resize, parents/enfants, DOM non enregistré, marqueur absent/dupliqué, rerendu React, perte de cible, clavier/focus. |
| Lecture et contrôles | Cas représentatif de chacune des sept catégories de la mission ; valeur calculée/déclarée/token distincts, héritage, variables, unités et saisies invalides. |
| Projection réversible | Au moins deux propriétés modifiées avant validation ; retour immédiat, undo/redo regroupé par geste, réinitialisation exacte et sortie ; mutations concurrentes préservées. |
| Portées et responsive | Deux instances d’un composant et consommateurs d’un token ; couverture/limites affichées, portée et breakpoint corrects dans le lot, aucune correspondance inventée. |
| Transmission réelle | Inspection → lot → frontière de coordination existante → accusé et contexte agentique vérifiables ; refus, lot périmé, répétition et interruption. Un JSON affiché seul ne suffit pas. Aucun appel fournisseur implicite pour les tests. |
| Absence d’écriture de sources | Comparaison des sources/autorités avant/après sélection, retouches, annulation et transmission seule ; toute application définitive ultérieure appartient au circuit Loomata et à ses permissions. |
| Préservation du produit | Navigation, formulaires et état métier avant/après inspection ; aucune capacité writer exposée à l’iframe, aucune ressource externe déclenchée par une valeur CSS sans politique définie. |
| Intégration et reprise | Régression exploration/T1 et inspecteur DS, builds web/Storybook, autonomie d’un projet créé/exporté si instrumentation embarquée ; vérification WKWebView proportionnée dans le contenant actuel. |

Commandes candidates, à resserrer selon le diff et les scripts existants au départ : `npm run typecheck`, `npm run lint`, tests unitaires ciblés via `npm test -- <fichiers>`, `npm run test:exploration`, `npm run test:exploration:ui`, `npm run test:workspace`, `npm run build`, `npm run build-storybook`. Ajouter les nouveaux contrôles du contrat, de projection et de transmission ; utiliser les tests DS/writer seulement si affectés. Contrôles de génération/documentation si autorités ou consommateurs changent. Aucun succès déduit de cette liste ; pas de lancement lors de la préparation.

Revues futures : design (parcours, densité, clavier et focus), technique/QA (identité, CSS, histoire, concurrence, contrat et dépendances), sécurité (DOM/page, origine/capacités, messages et valeurs externes), puis contrôle des licences. Mode prévu : séquentiel, même agent, non indépendant ; pas de sous-agent autorisé par cette fiche. Un contrôle obligatoire échoué ou invérifiable bloque la qualification dépendante. Après contrôles, conserver « En revue — qualification technique acquise, acceptation humaine différée » ; démonstration finale par le designer distincte.

Preuves futures dans `docs/reviews/wysiwyg-01/` avec version, commandes, résultats, captures desktop, lot effectivement reçu et limites ; créer le dossier seulement avec son premier contenu réel. Dossier unique de recette finale enrichi par renvoi, sans clôturer J5 ou la reprise tierce.

## Configuration recommandée et risques

Préparation documentaire : GPT-6.1 Sol · Moyenne. Recommandation pour l’étude/architecture et l’intégration : **GPT-6.1 Sol · Élevée**. Justification : résultat explicite mais surfaces liées sélection/preview/identités/agent ; frontières DOM/origine et writer existantes à préserver ; plusieurs contrats dépendants ; preuves négatives et de réversibilité nécessaires ; internals React, extraction CSS, licences et réemploi restent indéterminés. Aucune difficulté observée n’impose Très élevée/max ou Astra à cette préparation. Réévaluer sur constats de l’étude, sans changer le réglage client ; si une hausse soumise à arrêt devient nécessaire, conserver le point de reprise avant la partie concernée.

Risques à lever : identité stable des éléments non instrumentés ; provenance CSS partielle ; rerendus écrasant une surcharge ; propriétés composites et `!important` ; interprétation de portée non démontrée ; dépendance forte à un builder ou à React interne ; compatibilité WebKit/production ; licence ou module non maintenu. Leur présence n’autorise aucun élargissement de mandat. Les bibliothèques ne sont ni retenues ni qualifiées à ce stade.

## Bilan de préparation et reprise

**CHANTIER PRÉPARÉ ; réalisation À faire. Doc updated.** Fichiers du mandat : cette fiche, `ROADMAP.md` racine et `docs/project-state.md` racine. Aucun code, dépendance, autorité produit ou modèle de suivi applicatif modifié. La fiche de fabrication n’est pas ajoutée au manifeste d’export : sélectionner les futurs guides/contrats utiles à la livraison lors de leur création, sans embarquer de pièce jointe privée.

Relecture documentaire : séquentielle, même agent, non indépendante ; cohérence du mandat avec T1/038, séparation projection temporaire/application définitive, exigences de la mission et dépendances contrôlées. Revues d’implémentation non applicables à cette préparation ; elles sont requises en D. Contrôles documentaires exécutés : neuf liens locaux de la fiche résolus par Python, `git diff --check` conforme, diff des deux suivis relu et nouvelle fiche examinée ; trois fichiers du mandat sélectionnés exclusivement. Les 86 chemins non suivis préexistants recensés avec `git status --porcelain=v1 -uall` sont toujours présents, sans ajout au chantier ; aucun contenu privé, secret ou configuration locale ajouté. Étude externe, licences, tests, builds, mesures de performance et disponibilité des anciennes recettes : non vérifiés dans cette préparation. Aucun serveur, installation, fournisseur, push ou publication.

**Prochaine action : mandat distinct pour réaliser WYSIWYG-01, en commençant par A puis B.** Cette préparation n’ouvre pas T2/T3, ne choisit pas définitivement de bibliothèque et ne remplace pas l’acceptation humaine des chantiers antérieurs.


## Réalisation A/B — 16 novembre 2026

Mandat explicite : étude des cinq bibliothèques et proposition d’architecture, sans implémentation. Base `c562f24`, branche `codex/wysiwyg-01-study-architecture`, aucun changement suivi initial et 86 chemins non suivis exclus. Procédures applicatives propose-architecture / update-project-docs et relectures documentaires sélectionnées à cette version ; aucun sous-agent.

**A réalisée ; B proposée ; En revue, acceptation humaine différée.** [Étude](../architecture/visual-inspector-study.md) : cinq commits fixés, modules et licences lus ; React Grab primitives recommandé pour sélection/géométrie, conventions des quatre autres adaptées sans adopter leurs moteurs. [Architecture](../architecture/visual-inspector.md) : identité workspace, registre de propriétés, projection locale réversible, lot typé et admission dans la passerelle existante. L’admission proposée n’existe pas encore ; runtime, coût bundlé et dépendances transitives non qualifiés. 038 conservée dans Foundations/Components ; menu d’intentions dans Pages seulement proposé.

Six fichiers : deux notes, bilan de revue, présente fiche, roadmap et état racine. Doc updated ; aucun ADR d’adoption ni manifeste de livraison modifié. [Contrôles et trois conclusions documentaires](../reviews/wysiwyg-01-study-architecture.md), séquentiels/même agent/non indépendants. Aucun test produit, build, installation, serveur ou fournisseur exécuté. Prochaine action : examiner l’architecture puis mandat distinct C/D ; qualifier l’import ciblé et aligner toute autorité affectée avant code. Aucun push/publication. Recommandation GPT-6.1 Sol · Élevée conservée pour les contrats DOM/identité/projection/admission, sans prétendre vérifier la sélection du client.

## Complément UI — Inspection GrapesJS, 16 novembre 2026

Mandat : inspection visuelle et interactive puis recommandations, sans implémentation. Base `0a51859`, branche `codex/wysiwyg-01-grapesjs-ui` ; état suivi initial propre, 86 non-suivis exclus. Skill Product Design audit et procédures applicatives propose-architecture/update-project-docs conservées, sans délégation. [Rapport, sept étapes et treize captures](../reviews/wysiwyg-01-grapesjs-ui/README.md). Démo officielle v0.22.2 observée, code v0.23.9 de l’étude distingué.

**En revue, observation livrée et recommandations proposées ; acceptation humaine différée.** Sélection/parent, dimensions/unités, typographie/reset/Tab, couleur, historique (redo exact non qualifié), état Hover et Flex/preview étroite documentés. Conserver les sections fixes et libellés DS-UI-06 ; aucune réintroduction d’accordéons. Étude et architecture complétées par provenance, contrôles nommés, contexte visible et pied de transmission du lot.

Fichiers : rapport et treize JPEG, étude, architecture, présente fiche, roadmap et état racine. Doc updated ; aucun code/dépendance/manifeste modifié, test produit/build/serveur lancé ou publication. Contrôles documentaires dans le rapport. Reprise : examen des recommandations puis mandat distinct C/D ; les gestes de démo ne qualifient pas le futur inspecteur Loomata. Recommandation Sol · Élevée conservée pour l’intégration.

## Préparation de la réalisation C/D — 16 novembre 2026

**CHANTIER PRÉPARÉ.** Demande : préparer WYSIWYG-01 selon l’architecture et les recommandations UI, commencer par qualifier React Grab puis réaliser/valider le parcours complet ; recommandation de réflexion Codex demandée. La présente passe formalise cet enchaînement, sans exécution, selon la règle de préparation documentaire du dépôt. Base `8ea77ac`, main sans changement suivi, 86 chemins non suivis préexistants exclus ; branche `codex/wysiwyg-01-execution-preparation`. Procédures applicatives plan-feature/update-project-docs à cette version.

### Ordre et portes de passage

| Tranche | Objectif / critère avant la suite | Statut de réalisation |
| --- | --- | --- |
| Q — React Grab | Figer une distribution disponible et son intégrité ; vérifier exports primitives, licences/dépendances et effets à l’import ; mesurer le bundle ciblé ; éprouver hit-test/géométrie en iframe same-origin sur React dev/build et WKWebView. Aucun gel React, proxy, writer ou appel réseau inattendu. Rapport reproductible avant adoption. | À faire |
| C1 — Contrats et admission | Schéma visual-intent-v1, correspondances enregistrées/temporaires, contexte/révisions/portées, reçu durable et déduplication dans la coordination existante. Rejet des faux identifiants, doublons contradictoires, mauvais arbre et versions périmées ; pas de JSON libre substitué au contrat. | À faire, après Q |
| C2 — Projection réversible | Sélection/survol/parents, lecture calculée/déclarée/token, tampon éphémère, historique par geste, reset exact et nettoyage. Préserver les mutations concurrentes, invalider HMR/cible perdue et ne jamais écrire les sources. | À faire, après Q ; contrat stabilisé avant raccordement |
| C3 — Interface complète | Sept catégories, sections fixes sans accordéons, contrôles valeur/unité, provenance lisible, commandes nommées, contexte sélection/état/breakpoint et pied de transmission. Respecter les critères P1/P2 du rapport UI et DS-UI-06 ; menu de portée de demande dans Pages seulement, 038 conservée. | À faire, après C1/C2 |
| D — Validation intégrée | Projet fictif à deux pages et composant répété : retoucher plusieurs propriétés, undo/redo/reset, transmettre, retrouver le reçu, demander explicitement l’application et vérifier le circuit Loomata existant. Refus/interruption/reprise, trois portées, responsive connu, régression T1/DS et autonomie création/export si affectée. | À faire, après C3 |

Une porte obligatoire échouée bloque sa dépendance. Diagnostiquer Q avant toute réimplémentation du hit-test ; pas de remplacement silencieux de React Grab. Les autres travaux indépendants du mandat de réalisation peuvent avancer sans anticiper l’adoption. Les commandes, cibles isolées et preuves restent celles des sections C/D et de l’architecture ; préciser la version réellement testée dans chaque bilan.

### Configuration et contrôles

**GPT-6.1 Sol · Élevée** recommandé pour Q puis le développement courant de C/D. Cinq dimensions : résultat et UI cadrés ; surfaces browser/core/agent identifiées ; origine/capacités et identités à préserver ; plusieurs contrats de projection/historique/admission liés ; distribution réelle et WKWebView encore inconnus. Code relu : workspace-assistant.ts et context-control.mjs restent des listes fermées, le lot n’y est pas admis aujourd’hui. Aucune difficulté nouvellement observée ne justifie Très élevée/max, Astra ou Ultra à cette préparation. Réévaluer sur l’essai Q et les premiers contrats ; une hausse soumise à arrêt exige son point de reprise et la sélection manuelle prévue par AGENTS. Réglage du client non vérifiable et non modifié.

Revues de réalisation : design, technique/QA et sécurité ; séquentielles, même agent, non indépendantes sauf autorisation ultérieure de délégation. Les tests simulés et l’essai fournisseur réel restent distincts ; aucun compte ou appel fournisseur implicite. Qualification technique et acceptation humaine différée restent séparées. Pas de publication.

**Doc updated.** Fichiers : présente fiche et suivi de fabrication racine. Relecture documentaire séquentielle/non indépendante : ordre, dépendances, absence d’accordéons et statut non exécuté vérifiés. Contrôles exécutés : 16 liens locaux de la fiche résolus, git diff --check conforme, diff limité aux trois documents relu et 86 chemins non suivis préexistants conservés hors sélection. Aucun code, dépendance, génération, test, build, installation ou serveur. Prochaine action de réalisation : Q, puis C/D dans l’ordre ci-dessus sur mandat de réalisation distinct de cette préparation.

## Réalisation Q et arrêt avant C1 — 16 novembre 2026

Mandat explicite de réalisation reçu : Q puis C/D, sections fixes sans accordéons. Base `ce89436`, branche `codex/wysiwyg-01-implementation`, état suivi initial propre et 86 chemins non suivis préexistants exclus. Procédures app implement-feature/test-user-flow/update-project-docs sélectionnées au catalogue courant ; aucun sous-agent.

**Q — En revue, qualification technique acquise dans la sonde, acceptation humaine différée.** Archive npm 0.2.0 figée et empreinte vérifiée ; imports publics hit-test/pile/géométrie passants sur six parcours React 19.2.8 dev/production × Chromium complet/WebKit/WKWebView. Bundle de la sonde 27 756 octets, 10 337 gzip, React exclu. Dépendances inspectées en installation isolée sans scripts ; bippy 0.6.1 et CLI 0.2.0, distincts du HEAD étudié. Aucun package ajouté aux dépendances applicatives. [Commandes, preuves, échecs résolus et limites](../reviews/wysiwyg-01/README.md).

**C1 — arrêt avant modification pour hausse justifiée à Très élevée.** Le manager existant exige connexion/thread fournisseur avant conversation, valide strictement nativeId/accountRef et persiste l’envoi avant turn/start ; le reçu doit au contraire être durable hors connexion, puis attaché sans double lancement après crash ou réponse perdue. Format privé, révisions, déduplication et cycle fournisseur sont à examiner ensemble avant l’extension. Les échecs d’outillage Q sont résolus et ne motivent pas cette hausse. Point de reprise détaillé dans le bilan ; aucune décision de stockage déléguée à l’utilisateur, seul changement manuel de réflexion puis reprise explicite requis par AGENTS.

Configuration : **GPT-6.1 Sol · Très élevée pour C1 et son raccordement**, sans modification du client ni sous-agent. Périmètre et sept catégories conservés. C2/C3/D restent non exécutés et le parcours complet non qualifié ; Q ne les remplace pas. Doc updated. Fichiers : script de qualification, bilan et deux JSON sélectionnés, présente fiche et suivi racine. Aucune fenêtre personnelle, donnée projet, source DS, autorité ou lockfile app modifié ; aucun fournisseur réel, push/publication.


## Reprise C/D — implémentation du 16 novembre 2026

Mandat : poursuivre la réalisation autorisée, selon l’architecture et les recommandations UI, sans accordéons. Base `0e7f946f75782602f12c85bfb412295bdb80e57c`, branche `codex/wysiwyg-01-runtime`. Racine Git vérifiée ; 86 chemins non suivis préexistants hors sélection. Procédures applicatives implement-feature, test-user-flow, update-project-docs puis review-design, technical-review et security-review explicitement utilisées à cette base ; rôles séquentiels, même agent, non indépendants. Aucun sous-agent. Reprise après la demande explicite ; aucune prétention de connaître ou modifier le réglage client.

Choix techniques délégués : [039](../decisions/039-visual-intent-inspector.md). Dépendance réelle React Grab exacte ; reçu privé distinct de la conversation native, rattaché seulement à l’action explicite ; lecteur DS réservé sans acquisition d’un second writer ; révision DS brute ou empreinte coordonnée avec la révision commune, vérifiée côté cœur. La lecture protégée du panneau utilise son hôte explicite pour ne pas dépendre de l’ordre de montage. Les changements d’une révision publique invalident aussi les modules compilés de l’aperçu. Les observations CSSOM responsive ne sont pas promues en registre d’autorité.

C1 : schéma fermé, admission durable hors connexion, déduplication, interruption et liaison contextualisée au moteur existant. C2 : projection possédée par famille CSS, gestes groupés, reset indépendant, mutation concurrente et lot périmé consultable. C3 : sept catégories fixes, tokens chrome Loomata et styles DS-UI-06, couleurs/rail d’opacité/unités/expressions, contexte et pied distinct. C4/D : trois intentions, responsive observé, commande explicite d’application, accord de source et relecture du rendu sur fixture ; statut final et réserves dans le bilan runtime.

Hypothèses réversibles de produit : entrée directe dans le mode inspection de Pages, couleur via contrôle natif du navigateur, regroupement d’un geste continu entre prise/perte de focus, conditions responsive limitées aux règles de largeur CSSOM correspondantes, aucune simulation de pseudo-état. La projection reste locale même pour les demandes composant/DS. Ces choix ne valent pas acceptation visuelle. Les propriétés sans provenance sûre restent calculées/partielles ; aucun token déduit d’une égalité. Un attribut style vide peut subsister après canonisation, les déclarations sont restaurées sans réécrire cssText. Source de règles et limites : contrat livré et guide, sélectionnés au manifeste ; note d’étude et preuves de fabrication non embarquées comme autorités de projet dérivé.

Contrôles, échecs, corrections, version, captures, limites natives et point de recette : [bilan C/D](../reviews/wysiwyg-01/runtime.md). Les modèles ROADMAP et project-state applicatifs restent non initialisés. Doc updated ; aucun compte fournisseur réel, push, publication ou déploiement. Acceptation humaine et reprise par un tiers restent celles de P5/J5, sans clôture implicite.

## Bilan C/D et point de reprise

**Qualification technique acquise ; En revue, acceptation humaine différée.** Version réalisée `cc4a25d`, sources de la base `0e7f946` complétées sur `codex/wysiwyg-01-runtime` ; [empreintes](../reviews/wysiwyg-01/runtime-sources.json) et [bilan détaillé](../reviews/wysiwyg-01/runtime.md). Les passages de préparation et l’arrêt Q ci-dessus sont historiques ; ils ne constituent plus un blocage de réalisation.

Critères démontrés : C1 reçu durable avant accusé, hors connexion, déduplication et reprise sans rejeu ; C2 sélection de la vraie page, projection possédée, historique/reset et concurrence ; C3 sept sections fixes, contrôles nommés, provenance et portées encadrées ; D parcours Chromium/WebKit jusqu’à l’accord et l’écriture réelle dans une source isolée puis rendu 18 px après recharge, avec fournisseur explicitement simulé. 37 contrats, 32 régressions ciblées, Pages aux deux formats, typecheck/build app/Storybook sur sources sélectionnées, ESLint, manifeste et export réussis. Les suites ne sont pas additionnées avec les campagnes antérieures.

Fichiers concernés : inspecteur/projection/CSSOM et schéma partagé ; admission, historique/contextualisation dans le chat existant ; lecteur DS réservé, invalidation de l’aperçu, intégration Pages ; dépendance/lockfile/manifeste ; tests, guide/contrat/décision 039, preuves et suivi de fabrication. Les autorités DTCG/YAML et le suivi modèle applicatif restent préservés. Revues design, technique/QA et sécurité réalisées successivement par le même agent, non indépendantes ; résultats, corrections et contrôles non passés sont explicités dans le bilan.

Réserves : l’ancien scénario complet d’import Figma reste obsolète ; typecheck du checkout pollué par les copies « 2 », conservées intactes ; gestes/fermeture du parcours natif complet, interprétation par fournisseur réel et application finale composant/DS non exécutés. Les choix visuels réversibles ci-dessus restent à accepter. Aucune qualification exhaustive de la cascade ou accessibilité. Les fichiers non suivis préexistants ne sont ni absorbés ni nettoyés ; inventaire final et limite de comparaison précisés dans le bilan.

**Doc updated.** Intégration et commits exclusivement locaux après revue du diff ; aucun push, service distant ou déploiement. Prochaine action : recette humaine de cette version et reprise tierce P5-05/P5-08, sans ouverture de T2/T3 ni clôture J4/J5.
