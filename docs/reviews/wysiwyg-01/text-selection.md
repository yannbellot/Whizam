# WYSIWYG-01 — Sélection du vrai libellé des composants

16 novembre 2026. Cible application, base `6544f4e`, version réalisée `40ac52e`, branche `codex/wysiwyg-01-text-selection`. **En revue : qualification technique acquise, acceptation humaine différée.** Mandat : rendre les sous-éléments réellement sélectionnables, en particulier le libellé du bouton dans Design system comme dans Pages.

## Diagnostic et correction

Le Button du kit rendait une chaîne directement dans button. Aucun élément interne ne pouvait recevoir une sélection CSS distincte. Le scénario Pages utilisait explicitement un span avec son marqueur : les preuves précédentes couvraient un enfant déjà présent, pas le texte direct du vrai composant. Ce cas manquant est désormais inclus dans les parcours.

Le helper de rendu renderTextContent, utilisé par Button, Notice et Panel, place les segments texte/nombre dans des spans stables. Les fragments sont parcourus et les éléments enfants existants restent des éléments distincts ; une composition n’est pas enfermée dans un nouveau conteneur. Le composant React possède cette structure en mode édition comme interactif : l’inspecteur n’injecte pas de wrapper ni ne réécrit les nœuds texte à son insu. Les classes de tokens, les rôles, attributs natifs, styles du panneau et autorités DS restent inchangés.

Ces spans n’inventent ni partie DS ni binding. Cliquer sur le libellé cible son élément ; « Sélectionner le parent » retrouve la racine du bouton. La projection porte uniquement sur le span ; le dimensionnement intrinsèque du bouton peut naturellement suivre celui du texte. Les réglages existants de racine restent hérités tant que le texte ne reçoit pas de retouche. Sans binding propre, la transmission reste une demande d’identification de cible temporaire, jamais une modification de racine annoncée à tort.

## Vérification

| Contrôle | Résultat démontré |
| --- | --- |
| [Chromium 156.0.8078.4](text-selection-chromium.json) | Réussi, run-TfqfAA : 1280×900 et 1440×1000. Libellé réel du bouton de galerie 24 px/orange, racine sans ces déclarations et police de racine conservée ; reçu session/span, retour au parent. Textes Notice/Panel modifiés indépendamment. |
| [WebKit 27.2](text-selection-webkit.json) | Réussi, run-fVUBs4 : mêmes formats et même code des composants. Exemple Button Default, Disabled et Loading, puis bouton de composition : libellé 23/22 px seulement ; racine retrouvée avec son état natif. |
| Pages | Dans les deux moteurs : un vrai Button avec children texte brut, sans span ajouté par la fixture, sélectionné à 25 px indépendamment de sa racine. Contenu mixte dans un fragment : deux segments texte ciblables et strong conservé. Le clic sur le libellé exécute le handler du bouton en mode interactif. |
| Parcours commun | Sept sections fixes, unités, navigation réelle, rechargement iframe, modes, historique, reçu/recharge et parcours Pages jusqu’à l’approbation et la source isolée puis rendu 18 px : réussis. Fournisseur explicitement simulé. |
| Qualité | Génération et documentation DS conformes ; huit contrôles composition/documentation réussis ; ESLint ciblé sans erreur ; types/build application/build Storybook réussis sur copie des sources suivies et du nouveau helper. |
| [Création/export réels](text-selection-manifest.json) | Nouveau helper inclus au manifeste fermé. Nouveau projet créé depuis une copie de ce manifeste, génération/types/build réussis ; helper et consommateurs présents dans le projet et le ZIP public. Dépendances locales réutilisées. |

[Galerie, texte seul sélectionné et modifié](text-selection-gallery-1280.png) ; [libellé de l’exemple Button](text-selection-button-1440.png). Les rapports contiennent les empreintes des composants réellement servis ; comparaison au code final réussie. Les tests initiaux de racine et d’enfant marqué sont conservés en plus des nouveaux scénarios de texte brut.

Commandes depuis application via sh scripts/with-runtime.sh : node scripts/test-visual-inspector-ui.mjs --application puis --webkit ; npm run tokens:generate ; node --test tests/ui-composition.test.mjs tests/design-editor-documentation.test.mjs ; npm run docs:design-system:check ; npm run validate:agent-kit. Types/build/build-storybook dans test-results/button-text-checks, sources sélectionnées et nouveau helper. Création/export via le runner local button-text-manifest.mjs. Journaux button-text-{chromium,webkit,builds,contracts,manifest}. Aucun contrôle obligatoire échoué dans cette tranche.

## Revues et limites

Design, technique/QA et sécurité : **séquentielles, même agent, non indépendantes**. Conclusion : satisfaisant dans le périmètre corrigé, avec acceptation humaine et compatibilité native complète différées. Fidélité : styles et métriques DS préservés, aucun changement du panneau. Usage : cible texte distincte de son parent, sélection et effets vérifiés sur le vrai composant. Technique : structure produite par React, éléments existants/fragments conservés, aucun faux binding ou changement de projection ; helper livré avec les consommateurs. Sécurité : contenu toujours rendu comme texte React, pas de HTML injecté, nouvelle ressource, permission ou endpoint.

L’ajout d’un span peut affecter un CSS externe qui dépendrait d’un nœud texte direct ; aucun tel consommateur courant n’a été trouvé. Un input ou select conserve sa structure native, sans wrapper dans ses valeurs/options. Pas d’édition du contenu textuel, de nouvelle matrice de tokens de libellé, de qualification exhaustive des lecteurs d’écran, de source DS canonique appliquée par fournisseur réel ou de parcours complet de la distribution macOS dans cette tranche.

Recette ouverte : [exemple Button](http://127.0.0.1:50436/ui-lab?scene=button%2FDefault). Essai direct dans le navigateur intégré : clic sur le texte → cible span ; taille du texte 16 → 24 px, police calculée du bouton conservée à 16 px ; contour du texte visible, puis réinitialisation. La lecture consultative des correspondances y a affiché une indisponibilité ; la sélection/projection reste vérifiée et les reçus/application sont qualifiés par les parcours isolés ci-dessus. Cet aperçu ne vaut pas preuve d’un fournisseur connecté. Métadonnées privées dans .local/wysiwyg-text-recipe/launch.json ; anciennes recettes préservées.

Doc updated : composants/helper, manifeste, guide, scénario, fiche, preuves et suivi racine. Aucun fichier d’autorité, cache, compte ou donnée préexistante intégré. Commits/intégration locaux uniquement, sans publication. Prochaine action : recette du clic sur le libellé dans cet exemple puis dans Tous les composants ; acceptation humaine conservée au porteur.
