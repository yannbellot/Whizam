# Contrat de frontières UI de Loomata et des projets créés

**14 novembre 2026 — Cadrage documentaire UI-ARCH-02, version 1.** Cible à réaliser, non description d’un découplage déjà implémenté. [Décision de cadrage](../decisions/035-ui-architecture-boundaries.md), [preuves et limites](../reviews/ui-arch-02-common-framing.md). La stack effective et les garanties du writer restent celles de leurs autorités courantes jusqu’à leur alignement dans un futur mandat.

## Trois propriétaires, deux design systems

| Propriétaire | Responsabilité | Dépendances admises |
| --- | --- | --- |
| Interface Loomata | Chrome, navigation, inspecteurs, dialogues et activité des agents ; composants Loomata UI | Son propre DTCG, thème Tailwind dérivé, React Aria, contrats publics du cœur |
| Projet créé | Pages, composants, variantes, règles métier et identité visuelle du site/web app | Son propre DTCG, thème Tailwind dérivé, React Aria et compléments spécialisés justifiés ; aucun import runtime du chrome Loomata |
| Moteur partagé | Validation/résolution, transactions, génération, identités, coordination et export | Données d’entrée explicites ; aucune dépendance à une apparence Loomata ou au contenant Electron dans les algorithmes purs |

Le projet n’importe pas Loomata UI, le référentiel visuel du chrome, l’instance Electron ni son état privé. Le chrome ne consomme pas un token projet pour définir son apparence. Le cœur peut employer les deux modèles séparément ; il ne fusionne pas leurs autorités. Une valeur identique ne crée pas une intention commune.

La présence de scripts d’outillage dans les sources exportées n’est pas une dépendance runtime du site. L’autonomie signifie : modifier, construire et exécuter le produit sans processus Loomata ni accès à son installation ; les prérequis Node/npm et ceux du brief restent explicites. Les comptes d’agent et Figma ne conditionnent pas les fonctions déterministes.

## Inventaire effectif et couplages à défaire

Inspection des sources suivies à `5945d0e`, sans exécution. Les chemins sont des preuves existantes, pas une proposition de déplacement global.

| Surface | Consommateurs actuels | Propriétaire cible et adaptation future |
| --- | --- | --- |
| [tokens DTCG](../../src/design-system/authority/tokens.tokens.json), [règles YAML](../../src/design-system/authority/README.md) | Résolveur, catalogues, édition, composants et compositions de l’atelier | Projet pour ses valeurs/styles ; extraire seulement les conventions de chrome nécessaires vers l’autorité outil, sans supprimer ni renommer les identités projet existantes |
| [ui-composition](../../src/design-system/authority/ui-composition.yaml), [contrôle CSS](../../scripts/ui-composition.mjs) | App et atelier ; consommateurs décrits notamment par chemin CSS | Séparer l’appartenance des règles ; adapter le contrôle pour JSX/classes Tailwind, sans abandonner le contrôle des valeurs |
| [editor-artifacts](../../scripts/editor-artifacts.mjs), [generate-tokens](../../scripts/generate-tokens.mjs) | Génèrent un CSS concaténant tokens, composition, variantes et polices, plus modèles/snapshot/docs | Moteur partagé à entrées explicites ; sorties projet et outil distinctes |
| [app/root.tsx](../../app/root.tsx), [.storybook/preview.tsx](../../.storybook/preview.tsx) | Importent tous deux `tokens.generated.css` et `global.css` | Ne plus injecter les sorties outil dans les pages et stories produit ; le document atelier doit recevoir son style propre |
| [Workspace](../../src/ui-lab/editor/Workspace.tsx), [SceneNavigation](../../src/ui-lab/editor/SceneNavigation.tsx), [AppearancePanel](../../src/ui-lab/editor/AppearancePanel.tsx) | Hôte d’édition et interface de sélection/saisie ; CSS Modules existants | Outil, même lorsqu’ils sont copiés dans un kit de développement ; leurs données éditées restent celles du projet |
| [scènes](../../src/ui-lab/editor/scenes.tsx), composants/fiches/stories de `src/design-system/` | Même exemple affiché dans l’atelier et Storybook | Composants de référence du projet ; un bouton présenté dans une scène n’est pas le bouton de commande du chrome |
| [PageWorkspace](../../src/ui-lab/editor/PageWorkspace.tsx), [PageInspector](../../src/ui-lab/editor/PageInspector.tsx) | Navigation des pages/occurrences et demandes au cœur | Outil ; identités et attributions lues dans le projet. Hors première tranche représentative |
| [manifest](../../scripts/design-editor/manifest.mjs), [store](../../scripts/design-editor/store.mjs) | Sources/dérivés fermés, contrôle des révisions et publication/reprise | Writer projet conservé ; son manifeste v36 inspecté ne couvre pas encore un thème Tailwind nouveau |
| [ImportedComponent](../../src/core/ImportedComponent.tsx), [registre importé](../../src/core/imported-components.ts), [import](../../scripts/core/workspace-figma-import.mjs) | Rendu React fermé, valeurs/styles et propositions Figma du projet | Renderer/registre dans le produit, acquisition et décisions dans le moteur ; CSS dynamique du projet sans classes calculées non détectables |
| [création](../../scripts/core/projects.mjs), [sélection du kit](../../scripts/project-files.json) | Copie une liste fermée, incluant des sources d’outillage | Profil starter à qualifier ; ne pas enlever aujourd’hui des outils nécessaires à l’autonomie existante |
| [exports](../../scripts/core/exports.mjs) | `tool.export` utilise la liste du kit ; `project.export` parcourt les sources autorisées du projet et applique ses filtres | Deux chemins à contrôler séparément. La liste de création ne prouve pas à elle seule la sélection de l’export projet |
| [Loomata.swift](../../macos/Loomata.swift), [port](../../scripts/core/local-service.mjs) | Contenant actuel et opérations locales de confiance | Adaptateur système et cœur ; Electron reste une tranche ultérieure. Aucune API native dans le runtime des produits |

Le partage actuel du CSS et de certaines sources est constaté. Il ne démontre pas une fuite exploitable ni un défaut runtime : aucun parcours n’est exécuté ici. Il interdit en revanche de présenter l’indépendance cible comme déjà acquise.

## Sources et sorties retenues

Choix minimal : conserver le référentiel DTCG courant pour le projet et ses identités ; prévoir un référentiel distinct pour les seuls besoins de chrome introduits. Pas de package séparé ni monorepo nécessaire.

| Scope | Chemins cibles proposés, non créés | Autorité et édition |
| --- | --- | --- |
| Projet | `src/design-system/authority/tokens.tokens.json` et règles YAML existantes ; variables/recettes dans `src/styles/tokens.generated.css`, thème dans `src/styles/project-theme.generated.css` | DTCG/YAML du projet, writer projet unique. Les variables historiques `--adl-*` restent stables pour ce scope |
| Outil | `src/loomata-ui/authority/tokens.tokens.json`, règles de présentation nécessaires à côté ; sorties `src/loomata-ui/styles/tokens.generated.css` et `theme.generated.css` | Sources versionnées de l’outil, non éditables depuis le writer du projet. Variables `--loomata-ui-*`, sans alias vers les valeurs projet |
| Compilation | Entrées CSS et périmètres de détection distincts outil/projet | Tailwind compile des dérivés ; il ne devient pas source des valeurs, des variantes ou de la sémantique |

Ces noms rendent la préparation concrète ; ils ne créent aucun fichier ni nouveau type éditable. Une identité courante ne doit pas être déplacée ou supprimée pour obtenir la séparation. Les sources héritées de chrome peuvent rester temporairement documentées comme compatibilité ; les nouvelles surfaces ne doivent plus en dépendre. Toute suppression ultérieure exige inventaire et mandat propre.

Le générateur commun réutilise le résolveur et les fonctions pures, mais reçoit explicitement le scope et les sources. La génération outil intervient à la préparation/build de l’outil, sans writer supplémentaire accessible dans l’UI. La génération projet reste coordonnée avec son writer : ajouter le thème aux dérivés fermés et les entrées pertinentes au manifeste, avec relecture et reprise, avant d’autoriser l’enregistrement dans une future réalisation. Aucun second watcher ne publie directement ces mêmes dérivés.

Le CSS Tailwind compilé est un artefact de build/dev reconstructible, distinct des sources et thèmes publiés par le writer. Il ne justifie pas une écriture parallèle dans les tokens. Préserver les notifications HMR et le brouillon ; un état non recompilé n’est pas annoncé comme aperçu à jour.

## Conventions Tailwind et coexistence CSS

- Produire un mapping explicite identité de token → variable CSS → nom d’utilitaire. Valider collisions, types et références ; employer `@theme inline` pour les alias qui en ont besoin. Ne pas importer une palette par défaut comme deuxième autorité. Les valeurs visuelles autorisées proviennent des décisions du scope, pas d’une correspondance approximative avec une échelle Tailwind.
- Séparer les entrées CSS, les sources scannées et les namespaces d’utilitaires. Le préfixe empêche les collisions mais ne constitue pas à lui seul un isolement des sélecteurs ou de l’héritage. Qualifier la CSS émise dans le document atelier, les portails et l’iframe projet.
- Pour la première tranche, ne pas injecter Preflight globalement : utiliser une entrée sans reset global et des règles de base bornées aux nouvelles surfaces outil. Monter les portails du dialogue dans un conteneur outil portant son thème. Les anciens consommateurs gardent leurs CSS Modules ; une propriété visuelle n’a qu’un propriétaire actif par surface.
- Les classes employées sont statiquement énumérables. Les valeurs issues des imports Figma restent des variables/règles générées bornées du projet, pas des noms de classes assemblés à l’exécution.
- Étendre le contrôle actuel aux classes JSX et styles inline : valeurs arbitraires visuelles interdites sans token ou recette déclarée ; mots-clés structurels et opérations permis explicitement. Les paramètres contextuels tels que `clamp`, grilles et `currentColor` restent des recettes YAML, pas de faux types DTCG.
- Clair/sombre et densité sont résolus par scope : la préférence du chrome ne réécrit pas le thème du produit. Conserver l’apparence initiale attendue ; ne pas introduire de nouvelle palette ou de mode produit dans cette tranche.

L’import sélectif et la résolution des variables sont documentés par [Tailwind Preflight](https://tailwindcss.com/docs/preflight) et [Theme variables](https://tailwindcss.com/docs/theme) ; la détection est décrite dans [Detecting classes](https://tailwindcss.com/docs/detecting-classes-in-source-files). Ces capacités officielles ont été consultées le 14 novembre 2026 ; aucune configuration n’est éprouvée dans Loomata par ce cadrage.

## Conventions React Aria et comportements

React Aria est la fondation interactive de référence dans les deux scopes. Les composants propres à l’outil stabilisent seulement une convention utile ; les composants propres au projet restent modifiables et autonomes. Le choix d’une primitive suit sa sémantique réelle, pas sa ressemblance visuelle. [États et styles React Aria](https://react-aria.adobe.com/styling).

Les API de l’outil emploient des identifiants stables et des callbacks métier existants ; l’état contrôlé reste dans les sessions/contrôleurs actuels. React Aria détient focus, interactions et annonces de son widget ; aucune seconde implémentation clavier ne gère simultanément les mêmes touches. Une sélection, une expansion, une saisie et un enregistrement restent des opérations distinctes.

Conventions communes : nom accessible visible, aide et erreur reliées au champ, état occupé distinct du succès, erreur conservant la saisie, focus visible dans les deux thèmes, état désactivé justifié. Les attributs d’état React Aria servent de sélecteurs ; ne pas simuler le focus ou l’accessibilité par un seul changement de couleur.

Pour un arbre : identifiants du modèle, ouverture et sélection contrôlées, navigation clavier standard, recherche ne choisissant pas implicitement une autre scène. Pour un champ : conserver brouillon texte et dernière projection valide ; vérifier les données dans le domaine existant, sans déléguer la validation métier à la bibliothèque. Pour un dialogue d’abandon : titre/description explicites, annulation conservatrice, Échap et retour du focus ; seule l’action affirmative appelle l’abandon existant.

HTML sémantique reste la base des contenus et de la structure. Cartographie, graphiques ou éditeurs peuvent recourir à un complément documenté hors catalogue, sans autre fondation généraliste. Les usages Base UI non remplacés restent transitoires ; leur suppression et celle de la dépendance ne sont pas imposées avant inventaire des derniers consommateurs.

## Autonomie, confiance et traçabilité

Le navigateur produit ne reçoit pas de capacité d’écriture du writer, d’accès Node/Electron, de conversation privée ou de commande shell. Un projet local exécuté peut lui-même lancer du code avec les droits de son processus : la séparation des vues n’est pas un sandbox des outils de développement. Ce cadrage n’élargit aucun accès existant.

La création d’un nouveau projet utilise un profil de sources du starter, versionné et fermé ; le moteur et les bibliothèques peuvent être copiés pour le développement sans imports vers l’installation de l’outil. L’export projet conserve ses filtres et doit être vérifié indépendamment du profil de création. Les dépendances `loomata/`, données privées et ressources signées restent traitées par leurs contrats actuels ; aucune règle de suppression n’est déduite de ce document.

Preuves futures : compiler/démarrer le produit dans une copie dont l’installation Loomata n’est pas accessible ; examiner les imports et la CSS servie par les routes produit et Storybook ; vérifier les deux chemins création/export ; démontrer qu’une modification du chrome n’altère pas les tokens/rendus du projet et réciproquement. Tester aussi les portails et importations Figma. Une inspection du graphe d’imports seule ne prouve pas l’isolement CSS.

Les identités de tokens, occurrences et variantes restent celles du projet, sans préfixe UI réinterprétant leur sémantique. Le Design Contract conserve des liens vers sources, décisions et preuves de révision ; il n’importe ni React Aria ni Electron, et ne reproduit pas le DOM.

## Version, reprise et limites

Le présent contrat est documentaire v1. Il n’augmente aucun numéro de protocole, snapshot ou manifeste. Les versions précises des dépendances seront vérifiées au lancement de la réalisation ; aucun réglage global ou téléchargement ici. Toute nouvelle sortie writer impose son propre contrôle de compatibilité avant écriture, avec refus d’état mélangé et reprise sous l’outillage correspondant. Aucun ancien reçu, journal ou état privé n’est converti.

La première UI demeure dans Swift/WKWebView ; le starter vient après qualification de cette tranche, et Electron ensuite dans une tranche distincte. Le maintien du rendu, l’autonomie et les refus ci-dessus restent non vérifiés en exécution. Le cadrage est utilisable pour planifier les travaux ; il ne vaut ni adoption technique déjà livrée ni acceptation visuelle.
