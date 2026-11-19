# DS-EDIT-31 — Champ Codex compact

31 octobre 2026 — cible application, **En revue : qualification technique acquise, acceptation humaine différée**. Base `d3588f5`, branche `codex/compact-codex-textarea`, [fiche](../work-items/ds-edit-31-compact-codex-field.md).

Les textarea d’intention et de précision commencent sur une ligne (`rows=1`), avec largeur CSS 50 % et suppression de la hauteur minimale de six rem. Le contenu multiligne, le défilement, le redimensionnement vertical et les limites de saisie restent conservés. Aucun changement de logique, source YAML, moteur ou compte.

Contrôles sur macOS arm64 avec Node 24.22.0 et Chromium verrouillé existants : types conformes ; ESLint et Prettier ciblés conformes ; parcours existant `Codex clarification` enrichi de mesures, **deux réussis** en développement (ordinateur/mobile, réponses simulées). Deux parcours `appearance layout` statiques réussis, build Storybook conforme. Aucun nouveau test unitaire de CSS, appel réel à Codex ou enregistrement de recette.

[Deux mesures de recette](ds-edit-31/qualification.json) : largeur exactement 50 % du parent et hauteur initiale 33,5 px aux deux formats ; saisie sur deux lignes conservée. Empreintes de ScopeControls/CSS identiques au dépôt, captures relues. [Modèle/catalogue et 188 identités conservés](ds-edit-31/preview-preservation.json), aucune connexion ni brouillon transféré. La saisie des captures reste synthétique et non enregistrée.

Revues **séquentielles, même agent, non indépendantes**, procédures applicatives à la base citée : Design Reviewer satisfaisant face aux dimensions demandées et aux captures ; Technical Reviewer satisfaisant, modification de présentation uniquement et parcours de clarification conservé ; sécurité ciblée sans nouvelle entrée, permission ni accès. Pas de scan général ni certification. Autres plateformes, persistance/récupération et inférence réelle non répétées.

[Aperçu local](http://127.0.0.1:54134/?path=/story/components-button--default&addonPanel=adl/design-editor/panel), copie isolée `.local/ds-edit-31/preview`, anciennes recettes et états préservés. Prochaine action : recette visuelle humaine du champ compact. Doc updated. Modèles app et G/J5 inchangés ; aucun push/publication.
