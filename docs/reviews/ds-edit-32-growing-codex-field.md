# DS-EDIT-32 — Hauteur automatique Codex

31 octobre 2026 — cible application, **En revue : qualification technique acquise, acceptation humaine différée**, base `a4a862c`, branche `codex/auto-growing-codex-field`. [Fiche](../work-items/ds-edit-32-growing-codex-field.md).

Les champs d’intention et de précision utilisent le dimensionnement natif `field-sizing: content` : les lignes saisies et les retours visuels font grandir le champ, leur suppression le réduit. Largeur 50 % et départ d’une ligne conservés. La poignée manuelle est retirée pour laisser la hauteur suivre le contenu. Aucun changement de logique, compte, limite de saisie ou opération.

## Preuves et limites

macOS arm64, Node 24.22.0 et Chromium verrouillé existants : types, ESLint et Prettier ciblés conformes. Parcours existant de clarification enrichi de mesures : deux réussis en développement, ordinateur/mobile, avec réponses Codex simulées ; deux parcours statiques appearance layout réussis, build Storybook compris. [Mesures et captures](ds-edit-32/qualification.json) : support natif constaté dans le navigateur livré, 33,5 px à vide puis 72,5 px sur trois lignes, retour à 33,5 px après suppression, ratio de largeur 0,5 aux deux formats. CSS et ScopeControls identiques au dépôt. [Modèle/catalogue conservés](ds-edit-32/preview-preservation.json), 188 identités et valeurs de 54134 ; aucun compte/brouillon transféré, aucune sauvegarde de recette.

Premier parcours mobile : proposition finale simulée non affichée à temps. Retest identique, sans changement applicatif supplémentaire : deux parcours complets réussis. Cause de cette intermittence non déterminée ; échec initial conservé ici, sans l’attribuer au fournisseur réel. L’agrandissement/réduction est démontré par les mesures de recette indépendamment de cette réponse simulée. Autres navigateurs/OS et support de field-sizing hors Chromium livré non qualifiés. Persistance/récupération et inférence réelle non répétées.

## Revues et reprise

Procédures applicatives à la base citée ; **séquentiel, même agent, non indépendant**. Design Reviewer : satisfaisant, trois lignes visibles sans défilement interne, réduction à vide et largeur conservée, captures relues. Technical Reviewer : satisfaisant, comportement assuré par CSS natif, propriétés et taille réelles contrôlées, aucune nouvelle gestion d’état ; réserve du parcours simulé intermittent ci-dessus. Sécurité ciblée : aucune nouvelle entrée, permission ni dépendance, aucun scan global ni certification.

[Aperçu local](http://127.0.0.1:54135/?path=/story/components-button--default&addonPanel=adl/design-editor/panel), copie isolée `.local/ds-edit-32/preview`. Anciennes recettes préservées. Prochaine action : recette visuelle humaine de la croissance/réduction. Doc updated. Modèles app et G/J5 inchangés, aucune publication.
