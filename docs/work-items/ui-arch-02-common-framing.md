# UI-ARCH-02 — Cadrage commun de l’interface et du socle des projets

**14 novembre 2026 — En revue : cadrage documentaire réalisé, qualification documentaire acquise, acceptation humaine différée. Cible : application.** [Contrat v1](../architecture/ui-architecture-boundaries.md), [décision 035](../decisions/035-ui-architecture-boundaries.md), [bilan et revues](../reviews/ui-arch-02-common-framing.md). La préparation initiale ci-dessous reste historique ; le résultat courant est consigné en fin de fiche. Aucune réalisation UI/starter/Electron. Référence : [étude UI-ARCH-01, révision 4](../architecture/ui-architecture-study.md), section 8.

## Mandat et point de départ

Préparer la première étape de la séquence : **cadrage commun → première tranche de l’interface Loomata → socle des projets créés → tranche Electron séparée**. Le cadrage doit rendre les frontières et conventions suffisamment précises pour préparer puis réaliser la première tranche UI, sans attendre la refonte complète de Loomata.

Base inspectée : `626ba9d3e77f32bbcca8afeebd0cc24d747bccd0`, départ `main`, aucun changement suivi. Racine Git vérifiée dans le dépôt `loomata` attendu ; 75 entrées non suivies préexistantes exclues, dont copies suffixées ` 2`, `frontend/` et reliquats `.storybook/editor/`. Branche de préparation : `codex/ui-arch-02-common-framing-plan`. Aucun état vivant de recette ni configuration privée consulté.

Catalogue applicatif consulté explicitement ; procédures sélectionnées : `plan-feature` pour la préparation et méthode `propose-architecture` pour le futur cadrage, versions du kit au HEAD ci-dessus. Builder, sans sous-agent. Recommandation de configuration : GPT-6.1 Sol · Élevée pour le futur cadrage, car génération, writer, consommateurs UI et export sont liés ; aucune sélection du client prétendue vérifiée ou modifiée. Les procédures restent celles de l’app, sans modification de bibliothèque ni activation de skill de fabrication du lab.

Le suivi consolidé est dans la roadmap et l’état racine ; les modèles `application/ROADMAP.md` et `application/docs/project-state.md` restent non initialisés. Ce chantier ne remplace pas MVP-01-SOCLE ni les acquis de T1, ne lance pas T2/T3 et ne clôt pas J4/J5.

## Résultat attendu du cadrage

Un contrat documentaire de séparation et de fabrication, relié aux autorités existantes, avec inventaire des responsabilités, décisions explicites et préparation de la première tranche UI. Il doit répondre à cinq questions :

1. Quelles sources appartiennent à l’interface de Loomata, aux produits créés et au moteur de fabrication partagé ?
2. Comment produire variables CSS et thème Tailwind sans deuxième autorité de valeurs ni second writer ?
3. Comment employer React Aria de façon cohérente dans deux bibliothèques visuelles indépendantes ?
4. Quelles sources un projet neuf reçoit-il, et de quoi doit-il être indépendant pour fonctionner sans Loomata ?
5. Quel ensemble limité de navigation, formulaire d’inspecteur et dialogue permettra de qualifier ces conventions dans le contenant actuel ?

Le présent document prépare ces réponses ; ses pistes ne sont pas un contrat déjà adopté. L’adoption des recommandations de l’étude doit être formalisée et ses effets sur les autorités traités avant le futur code.

## Entrées et observations vérifiées

| Source inspectée | Constat utile | Conséquence à traiter au cadrage |
| --- | --- | --- |
| [Étude UI](../architecture/ui-architecture-study.md) | Electron recommandé pour l’outil ; React Aria et Tailwind dans les deux architectures ; produits orientés sites web/web apps | Ne pas rouvrir ces orientations sans motif matériel ; formaliser leur adoption et leur portée |
| [Contrat d’autorité](../../src/design-system/authority/README.md), [architecture DS](../design-system/architecture.md), [décision 027](../decisions/027-dtcg-authority-and-css-recipes.md) | DTCG détient valeurs/références ; YAML détient règles, fiches, variantes et recettes | Garder les cinq responsabilités, références typées, identités, provenance, attribution et base de rétablissement |
| [Artefacts](../../scripts/editor-artifacts.mjs), [générateur](../../scripts/generate-tokens.mjs) | Assemblage commun des tokens, compositions, variantes et documentation | Identifier les points d’extension pour le thème Tailwind et les scopes, sans décider d’un second pipeline |
| [Supervision et cœur](../architecture/shared-core.md), [port local](../../scripts/core/local-service.mjs) | Services communs, writers spécialisés et frontières de confiance existants | Réutiliser leur rôle ; ni élargissement des commandes ni réécriture du cœur |
| [Création des projets](../../scripts/core/projects.mjs), [liste des sources](../../scripts/project-files.json) | La création et les exports utilisent une liste fermée de fichiers, comprenant des outils et ressources du kit | Ne pas confondre séparation logique cible et extraction physique déjà accomplie ; déterminer ce qui doit être livré, exclu ou seulement utilisé à la fabrication |
| [Styles atelier](../../src/ui-lab/editor/workspace.module.css), [composants](../../src/design-system/components/Field.tsx), [manifest](../../package.json) | CSS Modules et variables ; contrôles HTML et Base UI présents, React Aria/Tailwind non installés | Préparer la transition par surface, sans masquer la coexistence ni convertir les données |
| [Contenant macOS](../../macos/Loomata.swift) | Interface actuelle dans Swift/AppKit et WKWebView | Première tranche UI qualifiée dans ce contenant ; Electron n’est pas son prérequis |

Ces constats portent sur les sources suivies, sans exécution des mécanismes. La copie/export autonome et la compatibilité d’une future stack ne sont pas nouvellement qualifiées par cette inspection.

## Périmètre et exclusions

Le futur **cadrage UI-ARCH-02 reste documentaire** : inventaire, responsabilités, choix de représentation et de dépendances, propositions d’API/conventions, impacts sur les autorités, critères et fiche de première tranche. Les références et exemples de contrats peuvent être proposés dans les documents, sans créer de schéma exécutable ou de composant factice.

Sont exclus de la préparation et du cadrage : installation, modification de dépendances/lockfile, code applicatif, nouveau générateur, déplacement de sources, changement du writer/manifeste transactionnel, régénération des dérivés, tests applicatifs, serveurs, modification de recette, accès Figma ou fournisseur, conversion de données, mise à jour de projet existant, packaging et implémentation Electron. Pas de nouveau package/monorepo, catalogue exhaustif React Aria ou abstraction universelle imposée. Aucun changement de rôle, skill, adaptation, permission ou instruction d’agent.

Les travaux UI, starter et Electron seront des mandats distincts. La dépendance logique impose un cadrage clos avant UI ; elle n’autorise aucune exécution automatique des tranches suivantes.

## Déroulement proposé

| Étape du cadrage | Travail documentaire à réaliser | Livrable et porte de sortie |
| --- | --- | --- |
| A — Inventaire et propriété | Suivre autorités → génération → imports CSS/React → stories → création/export ; classer les surfaces outil/projet/moteur partagé, y compris imports Figma et styles injectés | Matrice sources/consommateurs/exports et liste des couplages, avec preuves et inconnues ; aucune séparation prétendue démontrée par simple nom de dossier |
| B — Contrats communs | Proposer scopes des tokens/CSS/thèmes, rattachement du thème Tailwind au générateur et writer, règles de consommation et versionnement | Contrat de frontière minimal : source par information, sorties dérivées, dépendances autorisées, détection de fuite et stratégie de compatibilité ; aucune seconde valeur éditable |
| C — Conventions interactives et choix | Définir usage React Aria, HTML sémantique, conventions d’état/API/focus, compléments spécialisés et transition Base UI/CSS Modules ; relever les conséquences matérielles | Décisions documentaires explicites et tableau d’impact des autorités à aligner ; un arbitrage nécessaire reste ouvert et bloque uniquement sa dépendance |
| D — Préparation de la première tranche UI | Choisir les surfaces exactes et leur couverture, l’ordre technique, le retour arrière et les revues ; définir les preuves attendues | Fiche de tranche UI limitée et réalisable dans Swift/WKWebView, sans implémentation ; dépendance du starter et séparation Electron rappelées |

Proposition de rangement, à confirmer au démarrage du cadrage : matrice et résultats dans cette fiche ou une annexe réelle si leur volume le justifie ; contrat de frontière dans `docs/architecture/` ; décision dans `docs/decisions/` avec identifiant disponible au moment de l’écriture ; préparation UI dans `docs/work-items/`. Ne créer aucun dossier vide ni ADR présenté comme approuvé sans décision explicite.

## Points à résoudre sans changer les autorités implicitement

| Sujet | Direction minimale compatible avec l’étude | Question à fermer pendant le cadrage |
| --- | --- | --- |
| Séparation des design systems | Deux autorités de design et scopes indépendants, même méthode de fabrication possible | Quels identifiants, imports et variables appartiennent à chaque scope, et comment détecter une dépendance croisée ? |
| Fichiers du kit partagé | Classer par responsabilité avant de déplacer ; pas d’extraction de packages par défaut | Quels outils peuvent accompagner les sources sans devenir une dépendance de l’application produite ? |
| DTCG → Tailwind | Thème généré depuis les tokens ; recettes CSS contextuelles conservées chez leur propriétaire | Où et comment produire ce dérivé, préserver aliases/identités et inclure sa cohérence dans les garanties du writer ? |
| Valeurs libres, thèmes et densité | DTCG reste l’autorité des valeurs ; classes et styles spécialisés encadrés | Comment adapter le contrôle actuel des valeurs, gérer Preflight/cascade et valeurs importées dynamiques sans contourner les règles ? |
| React Aria | Fondation interactive de référence ; HTML pour structure/contenus et complément hors catalogue justifié | Conventions d’API, états, slots et focus ; un seul propriétaire comportemental par composant ; conditions de retrait des usages Base UI remplacés |
| Première tranche représentative | Navigation, formulaire d’inspecteur et dialogue comme candidats réversibles | Quel scénario existant et quelles surfaces exactes, sans nouvelle fonction métier, permettent de qualifier sélection, erreurs et retour du focus ? |
| Formats et environnements | Loomata desktop ; produits web selon leur brief | Fenêtres desktop utiles, thèmes et lecteurs d’écran de la tranche ; matrice web du futur starter distincte du contenant outil |
| Autonomie des produits | Sources modifiables, compilation sans Loomata UI/Electron ; pas de compte IA requis pour le déterministe | Liste d’export et preuves futures qui vérifient l’absence de dépendance d’exécution au contenant et au chrome |

Ne pas attribuer un token projet au chrome par simple égalité de valeur. Ne pas enrichir le Design Contract pour reproduire JSX ou tout le DOM. Les règles métier restent dans les spécifications et le code ; leurs liens et preuves peuvent être référencés par les contrats existants.

## Autorités et surfaces documentaires affectées par la suite

- L’étude reste la justification et la comparaison ; elle ne remplace pas le contrat courant des sources ni ne prouve leur migration.
- Le futur cadrage devra examiner `docs/architecture.md`, `docs/design-system/architecture.md`, le contrat d’autorité, la règle de consommation 024, les conventions de composition et le guide de création/export. Proposer des mises à jour ciblées et des renvois, sans réécrire les historiques.
- La prescription de stack du `CAHIER-DES-CHARGES.md` racine relève du lab : consigner l’alignement nécessaire et son propriétaire, sans traiter la seule cible application comme un droit de réécriture silencieuse. Un futur mandat devra couvrir cet alignement avant l’implémentation. Pas de modification du cahier des charges dans cette préparation.
- `scripts/project-files.json`, les schémas et les manifestes sont des surfaces de code à examiner, pas à modifier pendant le cadrage documentaire. Leur adaptation et les contrôles d’export appartiennent aux réalisations ultérieures.

## Critères de réussite du cadrage

| Critère | Preuve documentaire requise |
| --- | --- |
| CC-01 — Propriété | Chaque surface structurante inventoriée a un propriétaire outil/projet/moteur et des consommateurs identifiés ; ambiguïtés explicites |
| CC-02 — Autorité unique | Valeurs et références DTCG, règles/recettes YAML et thème Tailwind dérivé distingués ; aucun writer concurrent ni duplication éditable proposée |
| CC-03 — Autonomie | Contrat d’import/export décrit et dépendances d’exécution interdites explicites ; vérification future indépendante du produit définie |
| CC-04 — Interactions | React Aria, HTML, compléments spécialisés et transition Base UI/CSS Modules ont des responsabilités et règles de coexistence définies |
| CC-05 — Première tranche UI | Surfaces et scénario exacts, fichiers envisagés, limites, critères observables, retests et retour arrière définis ; pas de refonte complète requise |
| CC-06 — Séquence | Première UI dans Swift/WKWebView, starter après sa qualification, Electron séparé ensuite ; aucun prérequis Electron implicite |
| CC-07 — Gouvernance | Impacts d’autorités listés, recommandations/adoptions/implémentation distinguées, tout arbitrage matériel obtenu ou signalé bloquant avant la dépendance concernée |
| CC-08 — Reprise | Rapport/revues et suivi consolidés avec version, réserves et prochaine action ; aucune qualification runtime ou acceptation humaine fictive |

## Contrôles et revues prévus

**Pendant le cadrage documentaire :** cohérence entre étude, décisions et contrats, résolution des liens, sources citées, périmètre du diff et absence de contenu privé. Les critères CC-01 à CC-08 se vérifient par lecture et traçabilité ; aucune suite de tests, génération ou serveur nécessaire.

Prévoir une revue technique des dépendances/autorités, une revue design des conventions et de la représentativité de la première tranche, et une revue des frontières de confiance/autonomie pour les contrats concernés. Elles restent documentaires, sans audit de sécurité du code complet ni qualification native. Utiliser les procédures applicatives pertinentes ; déclarer « séquentiel, même agent, non indépendant » en l’absence de délégation autorisée. Instruction Reviewer et Distribution Reviewer du lab non requis tant qu’aucune procédure d’agent ni qualification de distribution n’est modifiée. Toute revue omise reste justifiée.

**Pour la future tranche UI, à inscrire dans sa fiche, non exécuté ici :** génération/validation DS, documentation dérivée, types/lint, tests ciblés d’interactions et stories, parcours dans le contenant WKWebView, états/thèmes, sauvegarde/annulation et préservation des données. Choisir les commandes existantes de `package.json` selon le diff ; ne pas lancer une campagne globale par défaut. La future tranche starter ajoutera création/export et compilation autonomes ; Electron aura sa propre matrice native/OS et ses contrôles de distribution.

## Hypothèses et conditions de passage

Les trois types de surfaces UI sont un échantillon proposé, pas un choix esthétique accepté ni une nouvelle fonctionnalité. Le cadrage choisira les occurrences exactes après inventaire. Pas de versions React Aria/Tailwind/Electron fixées sans vérification au moment utile ; leur compatibilité reste non vérifiée. Pas d’hypothèse de conversion automatique des données, des journaux, des reçus ou des anciens projets.

La préparation ne présente pas de blocage à sa livraison. Le futur cadrage devra obtenir un arbitrage si une séparation exige un changement matériel de périmètre, de droits, de données, de stockage ou d’autorité. Il peut traiter les parties indépendantes ; une inconnue architecturale nécessaire ne devient pas une réserve permettant de commencer le code.

## Résultat de la préparation et reprise

**CHANTIER PRÉPARÉ — cadrage non exécuté.** Doc updated. Fichiers de cette préparation : cette fiche, renvoi dans l’étude, `ROADMAP.md` et `docs/project-state.md` racine. Aucune implémentation, installation, test applicatif, serveur, publication ou modification d’un état privé. Les preuves historiques restent datées ; aucune nouvelle qualification technique des bibliothèques.

Relecture de préparation : Builder, séquentiel, même agent, non indépendant ; périmètre, ordre et exclusions vérifiés. Les revues du cadrage décrit ci-dessus sont planifiées, pas réalisées. Contrôles exécutés : 49 liens locaux de l’étude et de la fiche vérifiés par Python, tous résolus ; `git diff --check` conforme ; quatre fichiers annoncés uniquement et 75 entrées non suivies préexistantes conservées. Lecture du diff et vérification des exclusions ; aucune suite de tests ni commande applicative exécutée.

**Prochaine action :** mandat explicite de réalisation du cadrage documentaire UI-ARCH-02. Ce mandat ne lancera pas la première tranche UI, le starter ou Electron ; leur mise en œuvre restera distincte.


## Réalisation documentaire — 14 novembre 2026

Mandat explicite reçu puis reprise après interruption, périmètre documentaire inchangé. Base `5945d0ed48d0ed1340cbb7f8a571021aa4bf8afc`, branche `codex/ui-arch-02-documentary-framing`, aucun changement suivi initial ; 75 entrées non suivies préexistantes conservées. État relu après interruption : aucun fichier partiellement écrit, branche déjà créée conservée. Racine Git attendue vérifiée avant écritures.

A–D réalisées : inventaire effectif et couplages, contrat des deux design systems et du moteur partagé, conventions DTCG/Tailwind/React Aria, choix 035 et préparation de la première tranche UI-ARCH-03. La qualification CC-01 à CC-08 et les trois revues documentaires sont dans le [bilan](../reviews/ui-arch-02-common-framing.md). Mode séquentiel, même agent, non indépendant ; pas de délégation. La procédure et la recommandation de configuration restent celles prévues ; aucune sélection client prétendue vérifiée ou modifiée.

Correction d’inventaire : contrairement au résumé de préparation, seuls création et export outil utilisent la sélection fermée du kit ; l’export projet parcourt les sources avec ses propres filtres. Le contrat suit les deux mécanismes. Le partage CSS actuel app/Storybook/atelier est constaté ; l’indépendance cible n’est pas déclarée réalisée.

Choix retenus : référentiel outil distinct pour les surfaces nouvelles, identités projet préservées, génération pure commune à entrées explicites, writer projet sans pouvoir sur le chrome ; première UI limitée à SceneNavigation, saisie de valeur précise dans AppearancePanel et dialogue d’abandon. Le cadre courant n’autorise pas encore de modification de la prescription de stack du cahier des charges, propriétaire lab ; son alignement est une porte obligatoire avant le code, pas un blocage de livraison du présent cadrage.

Documents du mandat : contrat, décision 035, fiche UI-ARCH-03 et bilan nouveaux ; présente fiche, étude UI-ARCH-01, architecture app et DS, roadmap/état racine reliés. Aucun manifeste, schéma, dérivé, package, instruction d’agent ou cahier des charges modifié. Aucun npm, test applicatif, génération, service, accès Figma/fournisseur ou opération sur une recette. Doc updated ; aucune publication.

**Statut : En revue — qualification documentaire acquise, acceptation humaine différée.** UI-ARCH-03 préparé, non exécuté. Le starter et Electron restent non ouverts. Prochaine action : examiner les documents ; un mandat distinct UI-ARCH-03 devra couvrir l’alignement des autorités et la réalisation bornée. Contrôles finaux : 90 références locales dans les six documents dédiés vérifiées par Python, toutes résolues ; `git diff --check` conforme ; dix documents du périmètre seulement, 75 entrées non suivies préexistantes conservées. Aucune modification du code ou des modèles de suivi applicatifs.
