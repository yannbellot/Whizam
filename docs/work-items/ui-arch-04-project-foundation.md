# UI-ARCH-04 — Socle des projets créés avec Loomata

**14 novembre 2026 — En revue : qualification technique acquise, acceptation humaine différée.** Préparation initiale datée conservée ci-dessous ; mandat courant consigné en fin de fiche. Cible canonique : application, fabrication suivie dans la [roadmap du lab](../../../ROADMAP.md). Préparation documentaire seule, sur `3f1796a10ac6b671301a028d3960999eb54d2c06`, branche `codex/ui-arch-04-project-foundation-plan`. Aucun code, installation, génération, test applicatif, serveur ou export exécuté ici.

## Résultat attendu et dépendances

Fournir aux **nouveaux sites web et web apps créés avec Loomata** un socle React / Tailwind / React Aria, avec leur propre design system DTCG, des composants modifiables et Storybook. Le projet doit pouvoir être compilé et exécuté sans installation, compte, service ou contenant Loomata externe. Son identité visuelle et ses formats restent ceux de son brief ; ce chantier ne réalise aucun métier de projet dérivé.

L’ordre reste celui de l’[étude](../architecture/ui-architecture-study.md#séquence-des-deux-périmètres-ui) : cadrage commun → première tranche UI → socle des projets ; Electron ensuite, dans une tranche séparée. [UI-ARCH-02](ui-arch-02-common-framing.md) apporte le [contrat de frontières](../architecture/ui-architecture-boundaries.md) et la [décision 035](../decisions/035-ui-architecture-boundaries.md). [UI-ARCH-03](ui-arch-03-first-ui-slice.md), correctif `7ffcc98` intégré dans `3f1796a`, apporte les preuves React Aria/Tailwind et le retour du porteur : fonctionnement constaté puis icônes revenues. Ce retour clôt cette réserve précise, sans valoir acceptation humaine globale de UI-ARCH-03 ou de J5. Sa qualification technique permet cette préparation et une future réalisation distinctement mandatée.

Ne pas confondre ce socle UI des produits avec le socle commun **MVP-01-SOCLE** déjà qualifié : ni nouvelle réalisation de ses fonctions ni ouverture de T2/T3. L’enveloppe Swift/WKWebView et les services actuels restent conservés ; Electron n’est pas un prérequis des produits web.

## État inspecté et conséquences

| Observation à la base inspectée | Conséquence pour la réalisation future |
| --- | --- |
| Tailwind/plugin Vite 4.3.5 et React Aria Components 1.22.1 sont déjà verrouillés pour le chrome ; `vite.config.ts` et `.storybook/vite.config.ts` préparent le thème outil | Réutiliser les dépendances compatibles, sans mise à jour générale. Leur présence ne prouve pas le raccordement du thème projet |
| `app/root.tsx` charge les sorties projet ; Button et Field consomment encore leurs CSS Modules | Raccorder une entrée Tailwind projet distincte et convertir une première famille bornée, sans changer les valeurs de référence |
| `scripts/editor-artifacts.mjs` produit les dérivés actuels ; manifeste de révision v37 et writer à sources/opérations fermées | Ajouter le thème projet dans le même calcul, la même publication transactionnelle et la reprise ; aucun watcher concurrent |
| `createProject` et `tool.export` utilisent `sourceFiles` / `scripts/project-files.json` ; `project.export` parcourt séparément les sources filtrées du projet | Qualifier séparément création, export projet et non-régression de l’export outil ; ne pas déduire leur complétude d’un seul inventaire |
| La création remplace l’accueil par une page neutre au nom du projet, sans copier les données privées | Préserver cette distinction entre dossier initialisé et première version métier ; aucun projet utilisateur réel à créer ou modifier |
| Le dossier du kit contient aussi des ressources de conception et de développement | Autonomie du runtime produit ≠ suppression de tous les outils du dossier. Les conserver lorsque nécessaires au kit autonome, sans import runtime du chrome dans les pages du produit |

Les observations sont issues de lecture de sources, sans nouvelle preuve d’exécution. Les tests/builds UI-ARCH-03 restent datés et limités à leur version ; ils ne qualifient pas ce futur socle.

## Périmètre et exclusions

Inclus dans une future réalisation explicitement mandatée : thème Tailwind dérivé du DTCG **projet**, consommation contrôlée, raccordement application/aperçu/Storybook, première famille Button et Field, stories/états et parcours de formulaire existant, création/préparation/export et documentation autonome directement affectées. Adapter la liste fermée des sources aux fichiers effectivement nécessaires fait partie de ce chantier ; l’exception minimale UI-ARCH-03 ne constitue pas sa qualification.

Préserver SelectField natif, Notice, Panel et autres composants non nécessaires à la première famille ; vérifier leur rendu et leurs interactions, sans conversion exhaustive. React Aria est la bibliothèque interactive de référence, avec HTML sémantique pour les contenus et contrôles appropriés. Les usages Base UI non remplacés restent transitoires : inventorier leurs consommateurs avant tout retrait de dépendance. Ne pas ajouter une autre fondation UI généraliste.

Exclus : Electron/Tauri et packaging natif ; refonte du chrome Loomata ; catalogue complet de widgets ; langage universel de layout ou second Design Contract ; nouveau backend/framework CSS ; refonte de l’import Figma ou des agents ; authentification, métier ou publication d’un projet ; migration automatique des projets existants, bases, journaux et reçus. Ni installation globale, appel fournisseur, Figma réel, push, Actions ou déploiement implicite.

## A — Alignement des autorités avant code

La [décision 036](../decisions/036-first-ui-slice-adoption.md) et le cahier des charges v1.16 adoptent Tailwind pour les seules surfaces UI-ARCH-03. **Un mandat de réalisation UI-ARCH-04 doit couvrir explicitement l’alignement des autorités avant code**, y compris le cahier des charges racine. La présente fiche ne réalise pas cette adoption supplémentaire.

| Propriétaire et sources | Alignement à réaliser avant le changement technique |
| --- | --- |
| Lab : `CAHIER-DES-CHARGES.md`, §6, suivi racine | Étendre l’adoption Tailwind au socle des nouveaux produits ; préserver React Router SSR, DTCG, React Aria et CSS spécialisé ; consigner la décision d’application bornée |
| App : `docs/architecture.md`, architecture du DS, décision 024 et contrat d’autorité | Désigner les entrées/sorties projet, la consommation des tokens via classes, les recettes autorisées, la coexistence CSS Modules et les règles de contrôle |
| App : périmètre du kit, cycle de vie et documentation de création/export | Préciser nouveaux projets concernés, autonomie, contenu et limites des exports ; conserver les anciennes versions et l’absence de mise à jour implicite |

Ne pas réécrire le cadrage 035 comme si la réalisation était déjà acquise. Au lancement : relire Git, les autorités, cette fiche et les preuves UI-ARCH-03 ; relever les versions exactes et leur compatibilité à partir du lockfile. Les vérifier dans les documentations officielles si un changement d’API/version est nécessaire. Pas de montée de version par défaut.

## B — Thème projet, génération et writer

Conserver `src/design-system/authority/tokens.tokens.json` comme autorité des valeurs/références, avec les YAML propriétaires des règles, variantes, présentations et recettes. Conserver les cinq responsabilités du DS, classifications et identités actuelles, ainsi que les variables projet `--adl-*`. Aucun alias vers `--loomata-ui-*`, aucune copie des valeurs de chrome ni deuxième table éditable Tailwind.

Produire `src/styles/project-theme.generated.css` depuis le pipeline actuel ; prévoir une entrée CSS projet dédiée et une détection limitée aux composants/pages/stories projet, séparée du préfixe `ui:`. Figer son nommage technique et le mapping token → variable → classe avant consommation. Valeurs visuelles par tokens/recettes, classes statiquement détectables ; valeurs importées ou variables par occurrence restent des variables/règles projet bornées, pas des classes assemblées avec des valeurs libres.

Choix minimal proposé : pas de nouveau Preflight global dans cette tranche, afin de préserver les composants et pages non convertis. Les règles de base utiles restent bornées au projet et documentées ; ne pas reprendre la palette ou les dimensions du chrome. Les modes/thèmes suivent les règles du produit : aucun nouveau sélecteur de thème ni jeu de tokens précréé sans besoin.

Étendre ensemble le calcul des dérivés, le manifeste fermé, sa révision et les vérifications de péremption, publication, relecture et récupération. Le thème dérivé doit participer à la même transaction que la source : une interruption ne doit pas laisser un thème d’une révision et des tokens d’une autre. Tester perte de réponse et interruption réelle sur copie fictive ; une relecture seule ne démontre pas la reprise.

Conserver les opérations existantes si elles suffisent. Pas de conversion d’ancien journal/reçu, de suppression de verrou, ni de régénération sur instance active pour forcer le passage. Les anciennes transactions restent sous leur outillage. Une nouvelle capacité éditable ou un changement de format durable non nécessaire au thème exige son propre arbitrage.

## C — Première famille de composants et stories

Adapter **Button et Field** à Tailwind projet et aux primitives React Aria pertinentes, en gardant la logique métier hors bibliothèque. Utiliser le pattern FormFeedback existant comme parcours représentatif de saisie/erreur/succès, sans créer une nouvelle application de démonstration livrée au designer.

Avant substitution : relever API publique, attributs `name`, valeur initiale/contrôlée, soumission native, états disabled/loading/required, aide/erreur, variantes et marqueurs `data-design-*`. Préserver les contrats utilisés par les formulaires React Router, les scènes et le renderer importé ; ne pas assimiler automatiquement `onClick` et `onPress`, ni HTML input et TextField. Documenter toute adaptation ; pas de rupture silencieuse de props ou d’identité.

Synchroniser fiches, bindings/consommateurs, exemples et stories de la famille touchée. Couvrir défaut, désactivation, chargement, aide, erreur et multiline lorsqu’ils existent. Préserver les styles/identités des composants non convertis, les attributions partagées et locales, les variantes par occurrence et les catalogues. Réutiliser les ressources existantes, dont les icônes : l’incident UI-ARCH-03 devient un point explicite de revue visuelle.

## D — Création, exports et autonomie

Adapter `scripts/project-files.json`, `scripts/core/projects.mjs` et la préparation uniquement pour livrer les nouvelles sources/dépendances et reconstruire les dérivés. Conserver destination neuve, liens internes contrôlés, identité propre, accueil neutre, refus de récupération en cours et préservation d’un dossier partiel. Aucun fichier privé, `node_modules` inconnu, connexion, historique IA ou base ne doit être transféré.

Qualifier trois chemins séparés sur la même référence :

1. **Création** : produire deux projets fictifs neufs, préparer leurs ressources puis modifier une valeur dans A ; B et le chrome ne doivent pas changer. Fermer l’outil de la copie de qualification et lancer directement le runtime web et Storybook de chaque dossier avec leurs commandes documentées.
2. **Export projet** : enregistrer les sources fictives, exporter vers une nouvelle destination, extraire puis installer/compiler/démarrer depuis ce dossier sans parent Loomata accessible. Retrouver valeurs, variantes, identités et stories ; un brouillon non enregistré n’est pas présenté comme exporté. Vérifier inventaire, liens, refus de mutation concurrente et absence d’état privé.
3. **Export outil** : vérifier que l’inventaire fermé reste complet et que la copie peut encore créer/préparer un projet. Ce contrôle ne lance pas une nouvelle distribution native ni un chantier Electron.

Aucun nouveau profil ou format d’export imposé pour cette tranche. Les fichiers d’atelier peuvent accompagner les sources de développement, sans dépendance des pages produit à leurs composants, CSS ou services. Qualifier le build complet dans un environnement qui ne peut résoudre ni chemins ni dépendances du dépôt parent ; un simple changement de dossier avec accès au parent ne suffit pas. Les limites macOS de l’export ZIP actuel restent explicites ; ne pas en déduire une qualification Windows/Linux du contenant.

## Fichiers et contrôles à préparer pour l’exécution

| Ensemble | Points d’intervention candidats, à limiter au diff nécessaire |
| --- | --- |
| Autorités et suivi | Cahier des charges racine ; documentation app citée en A ; décision d’adoption ; fiche et preuves UI-ARCH-04 ; roadmap/état racine |
| Génération et consommation | `scripts/editor-artifacts.mjs`, `generate-tokens.mjs`, `design-editor/manifest.mjs` et contrôles/store affectés ; entrées `src/styles/`, `app/root.tsx`, Vite et `.storybook/` |
| Composants | `src/design-system/components/Button/`, `components/Field.tsx`, styles/fiches associés et `patterns/FormFeedback*` ; consommateurs et stories touchés uniquement |
| Autonomie | `scripts/core/projects.mjs`, `core/exports.mjs`, `project-files.json`, documentation autonome ; package/lockfile seulement si un changement est démontré nécessaire |
| Preuves | Tests de génération/consommation, writer/reprise, formulaires, `project-lifecycle`, exports et complétude ; captures et inventaires sélectionnés dans `docs/reviews/` |

**Commandes futures, non exécutées dans cette préparation** : `npm run validate:design-system`, `test:design-system`, `docs:design-system:check`, `validate:loomata-ui`, `typecheck`, `lint`, `build`, `build-storybook`, `test:boundaries`. Tests ciblés existants : `npm run test:design-editor:server`, `test:design-editor:persistence`, `test:design-editor:recovery`, `test:project-lifecycle`, `test:exports`, plus tests UI/Storybook et nouveaux refus rendus nécessaires par le diff. Adapter les runners propriétaires aux copies neuves avant lancement ; ne jamais les pointer sur les fenêtres ou recettes du porteur. `validate:agent-kit` vérifie la livraison du kit si son inventaire ou ses références sont affectés ; pas de campagne fournisseur ou de modification des procédures lab déduite de ce contrôle.

Les tests métiers PostgreSQL ne sont requis que si un chemin de persistance métier est réellement touché ; alors base fictive isolée selon les procédures, sans migrations/seeds hôte implicites. Formats de qualification du **socle web** : 390×844 et 1280×800, clair/sombre quand déjà pris en charge ; ils ne modifient pas la cible desktop de Loomata. Prévoir le parcours clavier/formulaire sur Chromium et les vérifications correspondantes sur Firefox/WebKit disponibles dans l’environnement isolé ; toute couverture absente reste non vérifiée et se traite avant de revendiquer une compatibilité. Les futurs briefs fixent les formats de leurs produits.

## Critères de sortie de la réalisation

| Critère | Preuve attendue, non encore acquise |
| --- | --- |
| SP-01 — Autorités | Adoption du socle alignée avant code ; un propriétaire par valeur/règle ; pas de nouvelle stack implicite |
| SP-02 — Génération | Mapping déterministe et typé, thème issu du DTCG projet ; références invalides/classes non autorisées refusées, pas de fuite des tokens outil |
| SP-03 — Transactions | Enregistrer/recharger et rétablir une valeur conserve identités/attributions ; interruption et récupération réelles produisent une révision cohérente, sans conversion d’ancien état |
| SP-04 — Composants | Button/Field, variantes et marqueurs conservés ; formulaire SSR/hydratation, clavier, validation, focus et soumission contrôlés ; scènes et stories des non-convertis sans régression constatée |
| SP-05 — Création et séparation | Deux dossiers neufs complets, identités et valeurs indépendantes ; modifier le projet ou le chrome n’altère pas l’autre scope ; refus/destruction implicite exclus |
| SP-06 — Export et autonomie | Création, export projet extrait et export outil contrôlés séparément ; runtime et Storybook sans installation/service/compte Loomata externe ni résolution du parent ; aucun état privé livré |
| SP-07 — Qualification | Types/lint/tests/builds et revues applicables conformes sur la même référence ; rendu aux formats web définis, navigateurs réellement exécutés et limites consignés |
| SP-08 — Livraison | Documentation et inventaires complets, démonstration/choix provisoires/reprise ajoutés au dossier humain ; aucun projet existant actualisé ; acceptation humaine et publication distinctes |

Chaque étape B/C/D dépend des contrôles de son prédécesseur utiles à ses modifications ; pas de chantier parallèle sur les mêmes dérivés. Revues futures : design (rendu et interactions), technique/QA (contrats, SSR, autonomie, reprises) et sécurité (sélection/export de fichiers, isolation et état privé). Mode séquentiel, même agent, non indépendant tant qu’aucune délégation explicite n’est demandée. Les procédures de fabrication lab ne sont pas modifiées ; aucune revue indépendante fictive.

Retour arrière : conserver référence, copies et outillage de chaque manifeste ; revenir aux seules sources/dépendances de la tranche dans une copie identifiée. Ne pas rejouer un journal d’une autre version, remplacer un dossier utilisateur ou reconstruire une fenêtre ouverte. Les 75 entrées non suivies préexistantes restent hors sélection Git ; les copies et fenêtres actuelles restent intactes. Un critère obligatoire échoué ou invérifiable empêche la qualification de la dépendance concernée.

## Configuration Codex et point de reprise

**Pour l’exécution : GPT-6.1 Sol · Élevée — thème projet, writer transactionnel, composants et autonomie de création/export à qualifier ensemble.** Préparation documentaire : moyenne suffisante ; aucune hausse vers très élevée/max ni recours à Astra/Ultra justifié par l’inspection actuelle. Réglage client non modifié et non prétendu vérifié.

Les cinq dimensions examinées : résultat borné aux nouveaux produits web ; chemins identifiés dans les tableaux ; frontière sensible des sources/dérivés et fichiers exportés ; contrats dépendants DTCG/manifeste/API de formulaire/profils et preuves de reprise ; inconnues limitées au mapping exact, à l’adaptation des props et aux outils de qualification disponibles. Les traiter au préflight et par les étapes successives, sans inventer une migration de données ou une difficulté exigeant un arrêt de configuration.

Préparation sous le rôle Builder avec la procédure applicative `plan-feature`, révision `3c5ed91` qualifiée dans INIT-04 et inchangée à la base `3f1796a` ; catalogue et contrat commun consultés explicitement, sans activation d’un skill de fabrication lab. Lectures Git/sources et revue documentaire séquentielle, même agent, non indépendante : séquence, propriétaires, exclusions, dépendances et critères cohérents ; conclusion satisfaisante pour la préparation. Contrôles de cette préparation conformes : dix liens locaux/ancres résolus dans la fiche et ses nouveaux renvois, huit critères SP-01 à SP-08, diff sans erreur d’espacement, quatre documents seuls concernés et absence de nouvelle donnée privée. Les 75 entrées préexistantes sont exclues de la sélection ; modèles de suivi app inchangés. Aucun contrôle applicatif exécuté, aucune nouvelle compatibilité annoncée. **Doc updated.** Prochaine action : mandat distinct de réalisation UI-ARCH-04 couvrant l’alignement des autorités avant code ; Electron reste hors mandat. Aucun blocage documentaire identifié à cette base, aucune publication.


## Exécution — 14 novembre 2026

Mandat : réaliser UI-ARCH-04 avec alignement des autorités avant code. Base `0b8b4ab42a4fa2a8cb36116e1d211cdf62223c88`, branche `codex/ui-arch-04-project-foundation`, racine Git vérifiée ; aucun changement suivi initial, 75 entrées non suivies préexistantes exclues. Cible application, alignement/suivi lab explicitement inclus. Autorités alignées par 037 et cahier des charges v1.17 avant tout code ; anciens paragraphes d’adoption bornée restent datés. Procédures applicatives implement-feature et test-user-flow lues à cette base ; revues futures séquentielles non indépendantes. GPT-6.1 Sol · Élevée recommandé, réglage client non modifié. Préfixe `project:`, utilitaires token-part-propriété-état fermés et alias locaux conservés, sans reset global ; détails en 037. Pas d’opération writer supplémentaire, pas de migration de données, projets/fenêtres existants et Electron hors réalisation.


Adaptation API inspectée : RAC Button accepte une valeur string et des événements FocusEvent<Element>, alors que l’API actuelle ButtonHTMLAttributes autorise valeurs numériques/listes et événements HTMLButtonElement. Choix délégué : conserver le bouton HTML, utiliser `useButton` et `mergeProps` de React Aria 3.53.1, déjà dépendance transitive verrouillée, désormais déclarée directement. Aucun cast de props, mise à jour de version ou remplacement de callback onClick par onPress. Field reste composé avec React Aria Components 1.22.1 ; tests de formulaire et de soumission requis.


### Point de qualification

Thème projet dans le writer/manifeste v38 ; utilitaires fermés à alias locaux et inventaires de consommateurs adaptés. Button via hook useButton, Field via React Aria Components ; props HTML et marqueurs conservés. Sources de création/export : 1137 entrées, aucun nouveau profil. [Bilan, limites et recette humaine](../reviews/ui-arch-04-project-foundation.md). Sur instantané final : génération, 117 tests DS/thèmes, types/lint et deux builds conformes ; 12 parcours Storybook/14 PNG identiques et six parcours SSR rejoués sur trois moteurs. Contrôle final du writer conforme, 69/69 ; aucune acceptation humaine globale déduite. Les erreurs initiales, corrections et nouvelles vérifications sont conservées dans le bilan.


### Résultat final et reprise

Candidat d’implémentation `e6ab674beb8d3bbc202b24f70741fec590adc4db`, autorités préalables `a78a125`, cahier des charges v1.17. SP-01 à SP-08 satisfaits techniquement selon le bilan : 117 tests DS/thèmes, 69 writer/HTTP, 14 création/export, 12 parcours Storybook et six SSR sur Chromium/Firefox/WebKit, 14 PNG identiques, types/lint et builds conformes. Source de livraison fermée 1137 entrées, profils existants conservés, deux projets fictifs et export compilés/exécutés sous refus de lecture du parent ; export outil capable de créer/préparer un projet. Lockfile accepté en simulation npm ci hors ligne, dépendances réellement préparées par copie locale verrouillée.

Trois revues séquentielles non indépendantes satisfaisantes ; captures relues. Les erreurs initiales restent au bilan. Autorités canoniques du dépôt inchangées, modifications de tests confinées aux copies fictives ; aucune modification de données métier, d’anciens projets ou journaux ; aucun fichier du contenant natif changé. Les modèles de suivi app et 75 entrées préexistantes sont préservés. Les sorties régénérées viennent des autorités intactes, sans transfert des couleurs de tests de persistance. Processus dédiés arrêtés par leurs runners ; traces/copies ignorées conservées. Doc updated, aucune publication.

Retour humain à recueillir sur une nouvelle copie à ouvrir sur demande ; réserves macOS/VoiceOver/OS et installation réseau explicites dans le bilan. UI-ARCH-04 En revue, acceptation humaine différée ; aucune nouvelle tranche lancée. Pour une suite technique comparable : GPT-6.1 Sol · Élevée ; pas de changement du réglage client.


## Version compilée pour recette humaine — 14 novembre 2026

Mandat : compiler et ouvrir Loomata avec un projet fictif et son Storybook. Sources `9cdfc6503e400f4d56da0f99c80502743d00afdd`, branche de suivi `codex/ui-arch-04-user-test` ; racine Git vérifiée, 75 entrées préexistantes non suivies conservées. Procédure applicative test-user-flow réutilisée à cette version, sans sous-agent ni nouvelle fonctionnalité du produit.

Copie de l’outil issue de la liste fermée, puis projet **Recette UI-ARCH-04** réellement créé/préparé par createProject/prepareProject. Dans ce seul projet ignoré, la page « Projet fictif — UI-ARCH-04 » compose le formulaire FormFeedback existant (Button, Field, validation sans données métier) ; sa story dédiée présente le même App. Aucun compte, jeton, historique ou état privé transféré. Ce support de recette n’est pas une application métier livrée par défaut au starter.

Types, build application et build Storybook du projet fictif conformes. Bundle normal **Loomata UI ARCH 04 Test**, sans instrumentation, compilé depuis Swift/AppKit/WKWebView ; SDK 26.5 retenu après l’incompatibilité SDK 27.0/compilateur déjà gérée par le fallback existant, premier échec conservé localement. Signature stricte vérifiée avant et après ouverture ; seules les métadonnées Finder incompatibles peuvent être retirées par stripSigningMetadata, provenance/quarantaine et binaire conservés. Les services locaux de développement sont laissés actifs pour la recette ; il ne s’agit pas d’une nouvelle distribution de production.

Accès et reprise, chemins depuis la racine du dépôt :

- Bundle : `.local/ui-arch-04/user-test-1qr84x/Loomata UI ARCH 04 Test.app`.
- Outil isolé : `.local/ui-arch-04/user-test-1qr84x/tool` ; projet fictif : `.local/ui-arch-04/user-test-1qr84x/project`.
- [Page fictive — Aperçu](http://127.0.0.1:51147/) ; [UI Lab du projet](http://127.0.0.1:51147/ui-lab).
- [Storybook — même page fictive](http://127.0.0.1:51148/?path=/story/ui-arch-04-fixture--preview), rubrique Projet fictif / Recette UI-ARCH-04 ; les stories Button et Field restent disponibles.
- Descripteur privé ignoré : `.local/ui-arch-04/user-test-latest.json` ; identité du bundle `org.loomata.local.ui-arch-04.user-test-1qr84x`.

HTTP 200 sur health, page, UI Lab et index Storybook ; présence de ui-arch-04-fixture--preview vérifiée dans les index statique et servi. CUA : nouveau bundle ouvert, vue Aperçu sélectionnée, titre du projet fictif/champ Nom du document/bouton Valider l’exemple visibles. Storybook ouvert dans un nouvel onglet visible conservé comme livrable ; même titre, champ et bouton observés dans l’iframe de la story après chargement. L’instance précédente **Loomata UI ARCH 03 Icons Test** est toujours en cours d’exécution ; aucune fenêtre existante fermée ou remplacée. Aucun enregistrement de valeurs DS effectué pendant cette ouverture ; le dernier projet habituel n’est pas remplacé, car le client et son contexte appartiennent à la copie isolée.

Recette proposée : tester le champ vide puis une saisie fictive dans Aperçu ; comparer la même page et les états Button/Field dans Storybook ; utiliser UI Lab pour modifier/enregistrer uniquement les tokens de ce projet, puis comparer Aperçu et Storybook. Le formulaire ne sauvegarde aucune donnée métier ; l’enregistrement de design reste celui de l’UI Lab. Revue de livraison séquentielle non indépendante, même agent : identité/copie/services et contenu des deux vues conformes ; qualification UI-ARCH-04 existante conservée, acceptation humaine toujours différée. Doc updated, aucune publication ni chantier Electron. Prochaine action : retour humain dans cette version ; pour une continuation technique comparable, GPT-6.1 Sol · Élevée.
