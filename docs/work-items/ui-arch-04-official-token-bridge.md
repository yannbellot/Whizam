# UI-ARCH-04 — Raccordement des exemples officiels aux tokens

> **Habillage retiré le 15 novembre 2026 sur demande du porteur.** [Retour au design antérieur et correctifs de chargement conservés](ui-arch-04-style-rollback.md). Les preuves ci-dessous restent historiques.

**Cible :** application, projet fictif de recette seulement.  
**Statut :** En revue ; raccordement réalisé et qualifié sur le web, acceptation humaine différée. Vérification de la fenêtre macOS non aboutie.  
**Base :** `ef91cd42757b9137ea6f48e46bac31b44da85535`, branche locale `codex/ui-arch-04-official-token-bridge`.  
**Date :** 14 novembre 2026.

## Mandat et périmètre

Raccorder les styles officiels React Aria aux tokens du projet fictif pour les modifier dans l'UI Lab et retrouver les changements dans Storybook, sans changer le rendu initial. Le mandat autorise la préparation, puis les adaptations nécessaires dans la seule copie `.local/ui-arch-04/user-test-1qr84x/project`. Il ne demande pas une adoption générale dans le starter ni une modification du contenant Loomata ou d'Electron.

[Recette visuelle précédente](ui-arch-04-official-example-styles.md) : CSS et composants Adobe issus de `360e35170568dfc99a2baaa78e6b7bdd36458d91`, thème Indigo clair/sombre. [Provenance](../reviews/ui-arch-04-official-example-styles/provenance.json) et [preuves précédentes](../reviews/ui-arch-04-official-example-styles/qualification.json). Ces preuves concernent les styles indépendants des tokens : elles ne démontrent pas le raccordement demandé ici.

Accès actuels : [projet fictif](http://127.0.0.1:51147/), [UI Lab](http://127.0.0.1:51147/ui-lab), [Storybook](http://127.0.0.1:51148/?path=/story/ui-arch-04-fixture--preview). Descripteur local : `.local/ui-arch-04/user-test-latest.json`. Ne pas remplacer le bundle ouvert ni fermer les fenêtres existantes.

## Inspection et difficulté constatée

| Dimension | Fait observé et conséquence |
| --- | --- |
| Résultat et cohérence | La fidélité initiale et l'édition persistante sont toutes deux requises. Un simple import des anciens tokens réintroduirait leurs valeurs historiques. Une surcharge uniquement lorsque la valeur change ne créerait pas une autorité initiale cohérente. |
| Producteurs et consommateurs | Dans la copie, `src/react-aria-examples/theme.css` définit les palettes OKLCH et les calculs relatifs ; `utilities.css` définit reliefs, bordures et états. Les composants officiels n'ont actuellement pas les marqueurs/bindings de l'éditeur. `src/ui-lab/editor/scenes.tsx` référence encore les exemples historiques. Le chargement page/Storybook est isolé des anciens styles. |
| Frontières | `scripts/design-editor/manifest.mjs` v38 sépare sources enregistrables et manifeste de code ; `scripts/editor-artifacts.mjs` produit ensemble CSS, thème, snapshot et documentation. Tout raccordement doit participer à cette génération et préserver lecture, enregistrement, révision et rétablissement. Aucun second fichier de valeurs ni écriture parallèle n'est retenu. |
| Contrats dépendants | `scripts/dtcg-tokens.mjs`, `validateTokenValue` : profil couleur structuré sRGB seulement. `src/design-system/editor/contract.ts`, `normalizeValue` : édition couleur limitée à `#rgb`/`#rrggbb`. `editor/naming.ts`, `primitiveName` : identité couleur basée sur l'hexadécimal. `AppearancePanel.tsx` transmet ces valeurs au sélecteur couleur natif. Les recettes CSS ont une grammaire fermée dans `scripts/token-composition.mjs`. Modifier seulement le CSS ne suffit donc pas. |
| Inconnues restantes | Stratégie exacte de représentation des paramètres et couleurs OKLCH, raccordement des palettes relatives et des états clair/sombre sans aplatir le thème, exposition compréhensible dans Apparence et aller-retour sans perte. La matrice n'ouvre pas implicitement de nouveaux formats ou modes. L'impact sur les validations et mesures de contraste doit être vérifié avant de choisir l'adaptation. |

Exemple concret dans le thème officiel : `--indigo: oklch(1 0.25049 284.23)` ; les nuances sont calculées à partir de cette teinte et de paramètres de luminosité/chroma, modifiés en sombre. Les convertir arbitrairement en hexadécimal, figer un seul mode ou stocker une expression opaque comme token ne satisfait pas le mandat. Ce constat vient des sources locales inspectées, pas d'une nouvelle qualification des formats.

## Plan de reprise dans le mandat existant

1. Vérifier de nouveau HEAD, état Git, identité de la copie, absence de travail humain concurrent et états/journaux de l'éditeur ; sauvegarder les fichiers concernés de cette copie. Capturer une référence actuelle app/Storybook, états et formats utiles. Les images historiques seules ne suffisent pas si le porteur a modifié la recette depuis.
2. Définir et documenter avant code une représentation typée compatible avec les calculs officiels : valeurs/références en JSON DTCG, règles/calculs chez leur propriétaire CSS/YAML ; préciser ce qui devient éditable et la conservation clair/sombre. Évaluer l'extension minimale des domaines et de l'affichage couleur, sans prétendre que l'éditeur les accepte déjà. Toute modification du produit canonique reste hors mandat.
3. Raccorder les composants réellement affichés, les fiches/consommateurs, les scènes de recette, le chargement page/Storybook et les dérivés au circuit existant. Conserver les sources officielles et leur provenance ; isoler et expliquer les seuls adaptateurs nécessaires. Ne pas réactiver l'habillage historique global.
4. Qualifier la normalisation/validation des valeurs, leurs identités, l'édition en brouillon, l'enregistrement, le rechargement et le rétablissement. Vérifier les refus et le circuit de révision affectés ; ne pas convertir ni effacer un ancien journal pour forcer la compatibilité.
5. Comparer le rendu initial avant/après sur les mêmes moteurs et formats ; exécuter types, lint ciblé, génération/vérification documentaire et builds app/Storybook. Vérifier dans l'UI Lab une modification visible de couleur et une modification de géométrie/typographie, leur propagation vers page/Storybook puis le retour exact à la référence. Remettre la recette à son rendu officiel initial pour le porteur.
6. Effectuer les revues design, technique/QA et sécurité applicables, séquentielles et non indépendantes faute de délégation ; conserver résultats, limites, captures et point de reprise. Intégrer seulement les tranches techniquement qualifiées, sans publication.

## Critères de sortie

- Le rendu officiel initial reste identique pour la page et les stories, y compris les états et le thème sombre déjà présents ; aucune approximation non signalée.
- Les contrôles exposés dans l'UI Lab correspondent aux paramètres réellement consommés par ces exemples, avec une source DTCG de référence et des règles de calcul identifiées.
- Une modification enregistrée est relue après rechargement dans la page et Storybook ; rétablir restaure le rendu initial. Aucun patch manuel d'un dérivé n'est nécessaire.
- Génération/manifeste/snapshot/documentation cohérents ; contrôles des domaines et refus affectés satisfaits. Un défaut bloquant reste à corriger avant qualification.
- Données métier, états privés, autres projets, starter canonique et contenant natif préservés. Acceptation visuelle humaine distincte de la qualification technique.

## Configuration et arrêt requis

**Recommandation révisée : GPT-6.1 Sol · Très élevée (`xhigh`) pour la partie d'adaptation des contrats.** La recommandation élevée initiale supposait un raccordement aux domaines existants ; l'inspection a démontré leur incompatibilité avec les valeurs et calculs officiels. Il faut résoudre ensemble fidélité des palettes, représentation typée, édition, identités et cycle transactionnel, avec une stratégie encore indéterminée. Ce n'est ni un échec ordinaire de test ni le seul nombre de fichiers qui motive la hausse.

L'[AGENTS du lab](../../../AGENTS.md#configuration) impose : « Si une difficulté observée justifie `très élevé` (`xhigh`) ou, exceptionnellement, `max`, conserver un point de reprise, expliquer le problème, les vérifications déjà réalisées et l’incertitude restante, recommander le niveau puis s’arrêter avant de poursuivre la partie concernée. Attendre la sélection manuelle et une demande explicite de reprise. » Le réglage client n'est ni modifié ni prétendu vérifié ; aucun sous-agent ou mode Ultra demandé.

Procédures applicatives `implement-feature` et `test-user-flow` consultées explicitement depuis le catalogue à la base `ef91cd4`, contrat et autorités utiles lus ; aucune procédure de fabrication lab modifiée. Rôle Builder pour l'inspection ; revue documentaire séquentielle, même agent, non indépendante.

## Bilan au point de reprise

Racine Git vérifiée : `/Users/yannbellot/Documents/GitHub/loomata`. Aucun changement suivi au départ, 75 entrées non suivies préexistantes conservées et exclues de la sélection. Lectures Git, sources et contrats réalisées. Seuls la présente fiche et les renvois de suivi racine sont modifiés ; aucun fichier de la copie fictive ou du starter, token, dérivé, journal ou configuration privée écrit. Aucun test applicatif, génération, build, interaction UI, installation, redémarrage de service ou publication exécuté dans cette intervention. Le rendu précédemment livré reste en place ; le raccordement demandé reste non réalisé et non qualifié.

**Doc updated.** Prochaine action : sélection manuelle du niveau recommandé, puis demande explicite de reprise de ce raccordement. Reprendre à l'étape 1 sur cette branche, sans relancer les précédents chantiers ni ouvrir Electron.

## Reprise autorisée et choix avant code

Le porteur indique avoir sélectionné Très élevée et demande explicitement la reprise. Base `92a1e06`, même branche et 75 entrées préexistantes. Cible maintenue : copie fictive seulement, suivi chez ses propriétaires. Procédures applicatives implement-feature/test-user-flow et revues déjà consultées réutilisées ; même agent, sans délégation.

Choix délégué : exposer un thème commun `OfficialTheme` dans Apparence, avec des propriétés personnalisées fermées et typées pour les paramètres officiels (teinte, neutres, erreur, espacement, rayons, tailles de texte et famille). Conserver les palettes relatives, modes et effets CSS officiels ; ne pas aplatir chaque nuance calculée ni convertir l'Indigo en hexadécimal. Les littéraux OKLCH sont ajoutés au profil local DTCG/éditeur, avec validation bornée, identité déterministe et aperçu de couleur explicite. Les valeurs restent dans le DTCG ; les adaptateurs CSS ne définissent aucune seconde palette. Le sélecteur hexadécimal reste disponible pour les valeurs hexadécimales ; une valeur OKLCH utilise la saisie précise et un témoin CSS, sans conversion implicite.

La scène de recette et les stories utilisent la même portée de thème et les mêmes dérivés. Les réglages éditables sont des paramètres de thème communs, pas de nouveaux réglages indépendants par occurrence ou par nuance calculée. Cette limite est annoncée dans la documentation de recette. Les autres réglages historiques et leur chaîne restent conservés ; aucune extension du starter canonique. Sauvegarde du code/autorités de la copie sous `.local/ui-arch-04/token-bridge/backup`, sans copie de l'état privé. Référence de rendu actuelle capturée avant changement sous `token-bridge/before` ; contrôler sa réussite avant adaptation.


## Réalisation et qualification

Le raccordement est réalisé dans la seule copie fictive. Dix paramètres officiels sont des conventions non sémantiques partagées et des tokens de composants : trois couleurs de palette, unité d'espacement, deux arrondis, trois tailles de texte et famille native. Les anciens 641 tokens conservent leurs identités, types, valeurs et références. Le nouvel ensemble expose 63 styles et 198 tokens de composants. La teinte n'est pas étiquetée comme couleur finale de chaque nuance : elle reste un paramètre de la palette relative officielle.

Le profil local accepte les couleurs opaques OKLCH littérales à trois canaux (six décimales au plus, L entre 0 et 1, C positif ou nul, H entre 0 et 360). Validation, conversion DTCG, nommage et saisie précise sont raccordés ; les identités hexadécimales antérieures restent identiques. Les expressions libres, canaux invalides/non numériques et alpha OKLCH sont refusés. Les propriétés personnalisées `--ra-*` sont déclarées dans les profils et réellement consommées par l'adaptateur. Les dix réglages sont regroupés dans **Projet fictif / Thème officiel React Aria**, sans prétendre exposer chaque nuance, ombre ou occurrence indépendamment.

Les règles du fournisseur gardent leurs calculs relatifs, états et reliefs ; leurs adaptateurs sont contrôlés par empreintes fermées, dans le manifeste v39. Toute modification de ces fichiers est refusée tant que sa revue de code n'est pas actualisée ; l'audit ordinaire reste actif sur les autres CSS. Les valeurs de départ éditables ont une seule source DTCG. La portée de thème recalcule les palettes dans le formulaire et les stories. Le style de page officiel est chargé uniquement pour la page fictive et le preview Storybook, afin de préserver le chrome de l'atelier. Les adaptations à haute densité suivent les paramètres communs avec les facteurs/décalages issus du thème initial.

### Contrôles exécutés

| Contrôle | Résultat constaté |
| --- | --- |
| Fidélité initiale et après sauvegardes | 24 vues app/story, Chromium/Firefox/WebKit, 1280 et 390 px, clair/sombre ; propriétés calculées et **24 PNG strictement identiques** avant/après, y compris après retour aux valeurs officielles |
| Parcours réel d'édition | Teinte OKLCH modifiée dans l'UI Lab, portée partagée choisie et Enregistrer ; valeur relue après rechargement dans UI Lab, page et Storybook ; arrondi modifié de la même manière ; valeurs initiales remises par le writer, sans réécriture manuelle des dérivés |
| Refus et densité | OKLCH invalide non enregistrable ; haute densité à DPR 3 : texte 17 px et contrôle 40 px, valeurs officielles attendues ; DPR 2 est sous le seuil officiel de 200 dpi |
| Génération et code | Génération DTCG, vérification des documents générés, TypeScript, ESLint ciblé, builds app et Storybook conformes ; aucun nouveau paquet installé |
| Contrats et writer | Campagne initiale 88 contrôles : 87 passent et une attente de test conserve encore les six anciens groupes ; attente mise à jour avec le septième groupe préparé, puis **9/9 retests ciblés conformes**, dont les trois nouveaux tests du profil/adaptateur. Les parcours writer testent notamment interruption, reprise, lecteurs concurrents, refus et idempotence |
| Reprise | Entrée dupliquée `scenes.tsx` corrigée dans le manifeste ; commande livrée `recover-design-editor.mjs` réussie, sans modification/suppression de journal ni retrait de verrou. Huit enregistrements fictifs des deux parcours restent conservés |
| Préservation | 641 anciens tokens comparés, source canonique et contenant natif intacts ; 75 entrées Git préexistantes exclues ; aucun transfert d'état privé, opération métier, push, Actions ou déploiement |
| Reproduction | Patch de **30 fichiers source** de cette copie, dérivés et état privé exclus ; préimages/empreintes conservées, application à sec sur la sauvegarde conforme |

[Qualification structurée](../reviews/ui-arch-04-official-token-bridge/qualification.json), [fidélité](../reviews/ui-arch-04-official-token-bridge/fidelity.json), [aller-retour](../reviews/ui-arch-04-official-token-bridge/roundtrip.json), [guide des réglages](../reviews/ui-arch-04-official-token-bridge/guide.md), [sources du raccordement](../reviews/ui-arch-04-official-token-bridge/fixture.patch) et [empreintes](../reviews/ui-arch-04-official-token-bridge/source-hashes.json). Captures relues : [UI Lab](../reviews/ui-arch-04-official-token-bridge/ui-lab.png), [Storybook pendant l'édition](../reviews/ui-arch-04-official-token-bridge/storybook-edited.png), [page restaurée](../reviews/ui-arch-04-official-token-bridge/app-restored.png). Le patch s'applique à la copie fictive aux styles officiels déjà préparée, **pas au starter canonique** ; régénérer ensuite par le script livré. Les documents générés ne sont pas des sources à éditer.

Commandes et traces locales : `scripts/generate-tokens.mjs`, `--check-docs`, `tsc -b`, ESLint ciblé, `react-router build`, `scripts/storybook-local.mjs build --disable-telemetry`, tests DTCG/domaines CSS/thème/writer ; journaux `user-test-1qr84x/token-bridge-*.log`. Runners propres à la campagne sous `.local/ui-arch-04/token-bridge/` : capture, roundtrip, color-profile et vérification finale de l'UI. Les erreurs initiales restent explicites : références directes de composants à remplacer par des conventions justifiées ; capacité supplémentaire à déclarer dans les schémas ; sérialisation YAML avec alias refusés, corrigée sans relâcher le lecteur ; frontière des règles fournisseur à contrôler ; doublon de manifeste ; attente de groupe de test historique ; hypothèse DPR 2 incorrecte, retest à DPR 3 conforme. Tous ces points de code/campagne sont corrigés sur le périmètre qualifié.

### Revues et limites

Trois revues séquentielles, même agent, non indépendantes : design satisfaisante sur le web, avec références et captures identiques ; technique/QA satisfaisante pour les domaines, dépendances, génération, édition persistante et restitution ; sécurité satisfaisante sur les entrées fermées, la frontière fournisseur vérifiée et la conservation des états privés. Aucun nouveau champ de texte CSS libre ni protocole d'écriture parallèle. La forme initiale est conservée, l'acceptation humaine du résultat reste à recueillir.

CUA : le navigateur réel a affiché la scène, les dix paramètres et la valeur OKLCH initiale dès présentation explicite de son panneau ; onglet de réglages conservé. La fenêtre macOS existante a été conservée et laissée en Aperçu. Son UI Lab est resté sur le chargement pendant l'observation ; la tentative d'activation via le contrôle natif a expiré (outil bloqué), sans permettre de conclure sur sa cause. Le diagnostic temporaire dans la page a été retiré ; aucun binaire natif ou réglage système n'a changé. **L'édition est qualifiée dans l'UI Lab web ; elle n'est pas nouvellement qualifiée dans cette fenêtre macOS.** Ne pas transformer l'essai WebKit automatisé en preuve de son fonctionnement. Cette réserve ne modifie pas le mandat du contenant.

VoiceOver physique, autres systèmes, export/création de cette démonstration modifiée et réglages indépendants par nuance/occurrence ne sont pas qualifiés. Le socle des nouveaux projets n'adopte pas implicitement ce thème. Aucun chantier Electron. Services de la seule recette laissés actifs sur les mêmes ports ; aucune fenêtre existante remplacée.

**Doc updated.** Reprise utilisateur : [ouvrir l'UI Lab web sur le thème](http://127.0.0.1:51147/ui-lab?scene=official-theme%2FFixture), modifier une propriété, choisir la portée puis Enregistrer ; comparer [la page](http://127.0.0.1:51147/) et [Storybook](http://127.0.0.1:51148/?path=/story/ui-arch-04-fixture--preview). Rendu remis à ses valeurs officielles, aucun brouillon laissé par la campagne. Un éventuel diagnostic macOS reste distinct de cette qualification web et ne doit pas fermer les fenêtres du porteur.

### Complément macOS — 14 novembre 2026

La réserve de chargement est reprise dans le [diagnostic macOS distinct](ui-arch-04-macos-loading.md). Une nouvelle fenêtre de recette affiche désormais l'atelier éditable, ses paramètres officiels et son aperçu ; les fichiers web de cette recette restent identiques aux 312 sources du manifeste fictif. La cause exacte de l'ancien document bloqué reste indéterminée. Cette preuve native complète la présente qualification web sans transformer ses tests en nouvelle campagne ni remplacer l'ancienne fenêtre.
