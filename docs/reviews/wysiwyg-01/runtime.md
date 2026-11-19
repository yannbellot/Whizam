# WYSIWYG-01 — Inspecteur réalisé et qualification

16 novembre 2026. Cible application ; fabrication consolidée dans le lab. **En revue : qualification technique acquise sur la matrice ci-dessous, acceptation humaine différée.** Version réalisée **`cc4a25d`** ; base `0e7f946`, branche locale `codex/wysiwyg-01-runtime`. [Empreintes des sources](runtime-sources.json), [qualification des primitives Q](README.md), [fiche](../../work-items/wysiwyg-01-visual-inspector.md), [contrat livré](../../architecture/visual-intent-contract.md), [décision 039](../../decisions/039-visual-intent-inspector.md). Les preuves sont attachées aux sources, pas à un réglage du client que l’agent ne peut vérifier.

**Complément de recette :** les [ajustements UI](ui-refinements.md) remplacent désormais le bouton Aperçu par la modification immédiate et ajoutent la galerie. Les preuves initiales ci-dessous restent attachées à cc4a25d.

## Résultat observable

React Grab **0.2.0 est intégré comme dépendance réelle**, version exacte et lockfile. L’import public différé `react-grab/primitives` fournit hit-test et géométrie ; pas de gel React, collecte Fiber/HTML/chemins ni interface React Grab. GrapesJS, Puck, React Rewrite et Craft.js restent des références, sans dépendance ni code copié. La sonde Q fait 10 337 octets gzip, React exclu ; le chunk de primitives du build applicatif fait environ **28,11 ko gzip / 79,47 ko brut**. Ces mesures ne sont pas interchangeables.

Dans Pages, la vraie page React est exécutée. Survol, cible exacte, parent/premier enfant, arborescence et navigation clavier sont raccordés. L’inspection suspend les clics, formulaires et saisies métier ; quitter le mode les restitue. Les champs de l’inspecteur gardent leurs raccourcis. Apparence, Typographie, Dimensions, Espacements, Disposition, Responsive et Design system sont **sept sections fixes sans accordéons**. Le panneau reprend les tokens outil et les contrôles nommés de DS-UI-06, avec un défilement indépendant et un pied d’actions distinct.

Le tampon reste en mémoire. Les champs acceptent valeurs/unités, expressions CSS, couleur native et rail d’opacité ; côtés liés et saisie continue regroupent les gestes. Valeur calculée, déclaration accessible et binding DS vérifié sont distingués ; aucun token n’est déduit d’une égalité. Annulation, rétablissement, retrait inline et reset d’une propriété préservent les autres retouches. La projection possède des familles CSS et conserve les mutations concurrentes. Un conflit non restaurable reste signalé comme sale jusqu’à la recharge confirmée de l’aperçu. Cette recharge perd son état interactif non enregistré.

La transmission retire la projection après **persistance du reçu**, sans compte ni thread fournisseur. Les lots reçus montrent cible/page/portée/valeurs ; ils survivent à la recharge. L’action explicite d’application revalide arbre, révisions et identités, puis utilise la conversation native et les permissions existantes. Les états après tentative ne sont jamais rejoués automatiquement. Un reçu ne signifie ni source appliquée ni résultat validé.

## Preuves exécutées

Commandes depuis `application/`, avec Node local via `sh scripts/with-runtime.sh`. Les lancements browser et les services HTTP sont limités à loopback et aux fixtures possédées. Aucun compte, jeton ou échange personnel copié ; aucun appel fournisseur réel.

| Contrôle | Résultat et portée |
| --- | --- |
| Q, script `scripts/qualify-react-grab.mjs` | Six cas React dev/production × Chromium/WebKit/WKWebView natif réussis ; détails et échecs résolus dans le bilan Q. |
| `node --test tests/agent-chat.test.mjs tests/local-service.test.mjs tests/workspace-t1-context.test.mjs tests/visual-intents.test.mjs` | **37/37**. Réception hors connexion, persistance/reprise, déduplication contradictoire, faux identifiants, révisions, budgets, DS/bindings, interruption sans rejeu, refus sans compte, échec de sauvegarde invisible, approbation et écriture existantes. Journal local `wysiwyg-contracts-release9.log`. |
| `node scripts/test-visual-inspector-ui.mjs --application` | **Réussi, Chromium 156.0.8078.4**, 1280×900 et 1440×1000. [Résultat et empreintes](runtime-chromium.json). |
| Même commande avec `--webkit` | **Réussi, WebKit 27.2**, mêmes formats et mêmes empreintes des cinq modules runtime principaux. [Résultat](runtime-webkit.json). |
| `node scripts/test-exploration-ui.mjs --pages-only` | **Réussi**, 1280×800 et 1440×900 : Pages, deux routes réelles, arbre, sélection ambiguë, contexte micro-chat/Agents et demandes planifiées. Transport fournisseur simulé. [Résultat incluant les 503 transitoires](runtime-pages.json). |
| Régressions instantané/UI/exploration/variantes/export | **32/32**, journal local `wysiwyg-regressions-release.log` ; commande ci-dessous. |
| Types, build application et build Storybook | **Réussis** sur la copie isolée des sources suivies et des nouveaux fichiers du chantier, même PageWorkspace/VisualInspector que le checkout. Journaux locaux `wysiwyg-{typecheck,build,storybook}-release2.log`. Avertissements fontes à résolution runtime et poids de chunks conservés ; aucun échec masqué. |
| ESLint sur les fichiers JS/TS modifiés, Prettier ciblé, `git diff --check` | **Conformes**. Journal `wysiwyg-lint-release.log` pour le lint. |
| `npm run validate:agent-kit` | **Réussi** : manifeste et références du kit livré. |
| Création et ZIP avec le vrai manifeste | **Réussis** sur une copie dérivée : génération tokens/typegen/tsc/build ; nouveaux modules/contrat inclus, conversations et répertoires privés exclus. Résultat local `wysiwyg-export-release.log`, fixture `run-Jr74MS`. Dépendances locales réutilisées, aucune installation globale. |

Régressions : `node --test tests/design-editor-snapshot.test.mjs tests/ds-ui-06.test.mjs tests/workspace-exploration.test.mjs tests/workspace-variants.test.mjs tests/variant-recipes.test.mjs tests/exports.test.mjs`.

Les deux parcours d’inspection vérifient aussi Flex sur un vrai conteneur multi-enfants, identification d’une cible temporaire, expressions `calc`/`var` conservées, absence de transmission d’un changement sans effet, unités non inventées, côtés liés, restauration border/radius indépendante et collision de famille. La largeur de 390 px est centrée ; une condition CSSOM de largeur est observée puis invalidée en sortant de sa plage. Les portées instance/composant/DS sont admises avec leurs prérequis, et une demande reçue reste consultable après recharge.

Le parcours final prend un reçu **instance**, lance explicitement son application, vérifie le lot typé dans le fournisseur **simulé**, affiche l’accord existant et l’autorise. Une vraie transaction modifie seulement la source de la version isolée ; la source principale reste identique. Le rayon enregistré via la variable locale de la recette vaut **18 px**, avant et après recharge React ; la cible enregistrée redevient sélectionnable après cette recharge. HTTP, stockage, approbation et écriture sont réels ; l’interprétation sémantique par un modèle distant ne l’est pas. Les demandes composant/DS sont qualifiées comme intentions et reçus ; aucune propagation finale de source composant/DS à travers un writer UI actif n’est revendiquée.

## Revues séquentielles

Les rôles design, technique/QA et sécurité sont exercés successivement par le **même agent, sans indépendance**. Procédures du catalogue applicatif sélectionnées à la base du chantier ; aucun sous-agent ni audit externe.

- **Design, fidélité puis expérience** : comparaison aux recommandations issues de l’observation GrapesJS et à DS-UI-06 ; sections fixes, libellés, contexte, contrôles nommés, provenance et retour après transmission vérifiés dans les rendus clair/sombre. Parcours clavier, focus de lot reçu et récupération éprouvés. Les longues expressions/provenances réduisent l’espace visible dans 280 px ; défilement disponible, ergonomie et couleur native à accepter par le designer. Aucune conformité d’accessibilité exhaustive déduite.
- **Technique/QA** : entrée browser → schéma partagé → admission/context-control → historique privé → manager.send → approbation/writer existant → aperçu relu. Lecteur DS utilisant la réservation de lecture existante, sans second writer ; empreinte DS brute ou coordonnée contrôlée. Restauration limitée aux familles possédées, expressions originales distinctes de la canonisation CSSOM. Les changements de révision publique invalident les modules Vite pour relire la source isolée. Types/builds, contrôles négatifs et tests affectés relus après correction.
- **Sécurité proportionnée** : origines/capacités loopback existantes conservées, liste fermée de commandes/propriétés, 64 Kio par lot, historique borné, identités/racine device/inode et révisions vérifiées côté cœur. Le navigateur ne délivre aucun droit de fichier ; le lot est une donnée, pas un outil exécutable ni une permission. Tests de refus privé/externe/liens, accès interprojet, lot forgé, compte absent et échec de persistance passants. Pas de finding bloquant restant dans ce périmètre ; aucune certification ni scan externe implicite.

## Échecs observés et corrections

Les journaux de campagne restent locaux, y compris les essais échoués. Les correctifs principaux sont rééprouvés dans les parcours finaux :

1. Lecture DS dépendante de l’ordre de montage et collision avec un writer : hôte explicite différé, lecteur réservé sans acquisition de writer ; compatibilité de l’empreinte coordonnée conservée.
2. Restauration des shorthands, rayon/couleur et gestures liés : possession des familles, reset rebasé, mutations du projet préservées et conflit résiduel gardé sale. Une réinitialisation ne prétend plus réussir quand elle ne peut restaurer.
3. Valeur CSS canonisée envoyée ou unité devinée sur `display:flex` : expression proposée conservée séparément, unité uniquement sur valeur numérique unitaire. Les gestes sans effet sont compactés seulement quand la déclaration et le rendu sont équivalents.
4. Source sauvegardée mais aperçu resté à 8 px : invalidation du graphe Vite à la révision publique, proposition simulée utilisant la variable de recette existante ; résultat 18 px relu après recharge.
5. Rechargement testé avant hydratation : attente navigation/load, document actif et témoin React. Les aborts de navigation WebKit délibérés restent distingués des erreurs actives.
6. Reçu confirmé puis relecture transitoirement refusée : accusé conservé, lecture historique indépendante de l’arbre ; aucune relance automatique d’application. L’échec de persistance ne rend aucun lot visible. Son test de panne a d’abord échoué dans le teardown, car la sauvegarde simulée restait en panne ; restauration du stub avant fermeture, puis **37/37**.
7. Un build de la copie isolée a lu un fichier pendant son rafraîchissement : copie achevée avant relance séquentielle des trois contrôles, tous réussis. Le typecheck du checkout complet demeure affecté par les copies préexistantes « 2 » et leurs imports Storybook manquants ; elles n’ont pas été modifiées pour contourner cet état.

Le scénario historique complet `test-exploration-ui.mjs` échoue sur « Ajouter au projet », remplacé par le chat dans la décision 038. Ce bloc d’import n’est pas déclaré qualifié ; `--pages-only` borne explicitement la régression affectée. Une exécution élargie du store DS a été interrompue après 59 réussites et une annulation : ce n’est pas une suite exhaustive passée. L’algorithme de révision exporté reste inchangé ; ses dépendances d’instantané et les cas affectés sont testés. Le timeout ponctuel d’autorisation d’outil a été résolu par le retry permis, sans changement de protection.

## Limites et recette humaine restante

L’intégration complète est éprouvée sous Playwright Chromium/WebKit ; **seules les primitives Q ont été exécutées dans WKWebView natif**. Le contenant existant dispose de confirm et du garde `data-loomata-dirty`, vérifiés dans le code ; sa fermeture et ses gestes physiques avec ce nouvel inspecteur restent à essayer. Aucun build macOS ni nouvelle fenêtre personnelle n’a été installé par ce chantier.

Les feuilles inaccessibles, la cascade complète, DOM fermés, container queries, pseudo-états forcés et propagation visuelle globale ne sont pas démontrés. Le mode édité est default ; le DS exige des bindings root/default non conditionnels vérifiés. L’historique comporte au plus 100 lots par installation, sans purge automatique, dans le budget privé existant de 8 Mio partagé avec les conversations. Après tentative inconnue, consulter le chat ; ne pas considérer une nouvelle réception comme une reprise sûre de l’ancienne.

Recette finale : comparer les deux thèmes à la direction DS-UI-06, retoucher plusieurs propriétés, annuler/rétablir et changer de page, vérifier le refus d’abandon puis la sortie normale, transmettre hors connexion et retrouver le lot, observer les avertissements de conflit/fermeture dans le contenant natif. Un essai fournisseur réel et une application composant/DS de bout en bout nécessitent leur propre contexte de test explicite ; ils ne sont pas déduits du simulateur. Acceptation visuelle et reprise tierce P5-05/P5-08 restent ouvertes ; T2/T3 et J4/J5 ne sont pas clos.

## Captures sélectionnées

Captures de fixtures sans données personnelles ; versions clair et sombre montrent l’inspecteur, pas une maquette exportée. Les images sont conservées sans retouche.

| Preuve | Capture |
| --- | --- |
| Clair, 1280 px, après reçu | [Inspecteur](inspector-light-1280.png) |
| Sombre, 1440 px | [Inspecteur sombre](inspector-dark-1440.png) |
| Aperçu 390 px centré | [Responsive](inspector-responsive-390.png) |
| Collision de famille conservée | [Conflit](inspector-conflict.png) |
| Source isolée appliquée, rayon 18 px | [Résultat React](inspector-applied-source.png) |

**Doc updated.** Sources, dépendance/lockfile, contrats/guide/décision, manifeste, tests, preuves et suivi directement affectés seulement. Les fichiers préexistants restent hors sélection. Le relevé historique mentionnait 86 chemins ; le contrôle final distingue 75 entrées hors chantier dans git status, soit 100 fichiers non suivis avec inventaire récursif. Aucun hash initial complet n’étant disponible, une égalité octet pour octet n’est pas revendiquée ; les écritures et la sélection Git se limitent aux fichiers explicitement rattachés au chantier. Aucune publication, inférence réelle ni modification globale. Prochaine action : recette humaine sur cette version ; aucun chantier supplémentaire ouvert.
