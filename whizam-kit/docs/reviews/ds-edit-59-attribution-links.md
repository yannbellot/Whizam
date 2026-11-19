# DS-EDIT-59 — Qualification d’Attribution et des liens de composants

2 novembre 2026 — application, base `2e36ba2`, diff DS-EDIT-59. Qualification technique acquise, En revue, acceptation humaine différée. [Mandat](../work-items/ds-edit-59-attribution-links.md). Revues **séquentielles, même agent, non indépendantes** : design, technique et sécurité proportionnée, après réalisation Builder.

## Résultat

Quatre états explicites décrivent la valeur effective : Style sémantique partagé, Style sémantique, Style de composant, Style de composant — exception locale. La référence sémantique reste nommée lorsqu’une valeur propre la remplace. Le calcul utilise les identités des références et les dépendances du graphe, pas la simple égalité de valeurs. Plusieurs réglages d’un même composant ne constituent pas un partage entre composants ; les usages masqués n’augmentent pas le nombre de composants utilisant effectivement la valeur sémantique.

Les composants concernés sont des liens vers leurs exemples Storybook préparés, déduits du catalogue existant. Chaque composant apparaît une seule fois, avec annotation des valeurs propres ou exceptions mixtes ; la destination privilégie un usage effectif lorsqu’il existe. Le contexte est disponible dans le titre du lien. Clic ou Entrée ouvre le réglage et permet de revenir au réglage initial sans perdre sa valeur en brouillon ; clic central ouvre un onglet distinct. Les inventaires incomplets sont signalés, et les liens couvrent les composants préparés recensés, sans prétendre dénombrer tous les consommateurs externes ou les exemplaires DOM.

Les boutons de portée, opérations d’écriture, autorités de valeurs, domaines et identités de tokens restent inchangés. Deux modules sont ajoutés au manifeste fermé de révision. Le guide courant est synchronisé ; aucun modèle de suivi app initialisé.

## Preuves exécutées

Runtime local Node 24.22.0 existant, aucune installation ni nouvelle dépendance.

| Contrôle | Résultat |
| --- | --- |
| `npm test` | 146 tests réussis, dont trois nouveaux tests de classification, dédoublonnage, usages masqués et valeur égale avec exception conservée. |
| `npm run test:design-system` | 82 tests réussis. |
| `npm run docs:design-system:check` ; `npm run test:design-system:docs` | Documents générés actuels ; cinq tests réussis. |
| `npm run test:design-editor:dev -- --grep 'attribution identifies'` | Deux parcours réussis, desktop 1280×800 et mobile 390×844 : quatre états, liens nommés/href, activation au clavier, navigation/retour, valeur en brouillon conservée et onglet séparé. |
| `npm run test:design-editor -- --grep 'attribution identifies'` | Les mêmes deux parcours réussis sur la distribution compilée. |
| `npm run test:design-editor:persistence -- component-tokens.spec.ts --grep 'autonomous padding'` | Deux parcours réussis avec le nouveau texte, sauvegarde/rechargement/rétablissement ; relecture séparée des valeurs enregistrées et application compilée aux deux formats par le runner. |
| `npm run typecheck` ; `npm run lint` ; `npm run build` | Réussis sur copie isolée des fichiers suivis et nouveaux modules/tests, sans consommer les préexistants non suivis du clone. |
| Formatage ciblé ; `git diff --check` | Conformes. Aucun succès global de formatage revendiqué. |

Échecs intermédiaires conservés dans les logs locaux : import devenu inutilisé corrigé, lint retesté ; le scénario initial attendait un événement popup après Control/Command-clic, non observé. Le retest avec clic central et événement de création de page du contexte réussit ; la combinaison Control/Command n’est pas déclarée qualifiée automatiquement. Les gestes de lien ne sont pas remplacés par des boutons, et les clics modifiés ne sont pas interceptés par le nouveau gestionnaire. Logs et sorties dans `.local/ds-edit-59/` et `application/test-results/`, hors livraison.

## Revues

Design : satisfaisant pour les critères approuvés. [Capture desktop](ds-edit-59/desktop.png) et [capture mobile](ds-edit-59/mobile.png) examinées : nature du style visible avant les valeurs, référence d’origine conservée explicite, liens identifiables et annotations lisibles. Aucun Figma fourni. Les interactions sont prouvées par parcours, pas par les seules captures ; acceptation visuelle finale non présumée.

Technique : satisfaisant. Réutilisation de getImpact et exampleStory, aucune seconde table de routes ou de données d’autorité. Les identités de composant, référence effective et attribution conservée sont traitées séparément. Les liens internes choisissent le binding visé ; inspectOrigin retrouve l’origine et les gestes existants conservent le brouillon. Les annulations de correction de contraste en attente évitent de transporter une correction sur une autre paire après navigation. Les tests de persistance vérifient le chemin de texte modifié sans changer le moteur.

Sécurité proportionnée : satisfaisant sur le diff. Les destinations sont relatives, construites depuis des sélecteurs fermés déjà validés ; aucun URL externe libre, HTML brut, nouveau service, secret, accès ou fournisseur. Les noms/titres sont rendus comme texte React ; les liens n’enregistrent aucune modification. La liste des sources mutables est inchangée. Cette lecture ne constitue pas un audit exhaustif.

Limites : Chromium macOS avec viewports desktop/mobile ; appareils tactiles et lecteurs d’écran réels non testés. La recette contenait initialement un brouillon #791a3e, préservé jusqu’au choix explicite du designer. L’actualisation autorisée est consignée ci-dessous. Doc updated. Reprise : recette humaine ; aucune publication.


## Recette actualisée après autorisation

Version `0a84822`, port 54138. Le designer a autorisé l’abandon du brouillon #791a3e et l’actualisation ; le rechargement depuis l’origine retrouve la génération enregistrée et #1d4ed8. Arrêt propre, récupération officielle et relance détachée vérifiés ; génération et validation des autorités conformes. Quatre fichiers de programme alignés, dix sources de valeurs inchangées par hash, aucun reçu/transaction ajouté, 18 styles et 188 tokens propres à l’instance conservés.

Dans Safari, les types sémantique, composant et sémantique partagé sont visibles. Le fond de Field/Contrôle liste les liens Field, SelectField et Panel, avec leur contexte ; activer SelectField ouvre bien l’exemple Selection. Aucune nouvelle valeur saisie ni sauvegardée. La vérification native complète les parcours Chromium ; elle ne revendique pas de nouvelle qualification tactile ou lecteur d’écran. Les preuves locales de recette sont recensées dans la fiche. Doc updated ; reprise : test humain.
