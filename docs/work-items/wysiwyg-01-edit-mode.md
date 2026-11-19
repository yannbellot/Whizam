# WYSIWYG-01 — Sélection interne et mode Édition

Application, mandat du 16 novembre 2026. Base f0514cd, branche codex/wysiwyg-01-edit-mode ; aucun changement suivi initial, préexistants hors sélection. Catalogue app consulté : implement-feature/test-user-flow/review-design/technical-review/update-project-docs sélectionnés à cette version. Revues séquentielles, même agent, non indépendantes ; aucun sous-agent.

Objectif : Édition active par défaut à l’échelle du design, même état dans Design system et Pages. Hors édition, panneau droit limité au switch Édition sur off, gestes réels rendus aux composants. En édition, clic/sélection clavier dans les aperçus individuels et la galerie choisissent la partie enregistrée (root/label/control/hint/error) de la cible et variante réelles ; outils existants conservés. Aucun nouveau writer ni identité inventée. Les descendants d’une partie sont reliés à cette partie déclarée ; un élément sans correspondance ne reçoit aucun binding inventé. Hypothèse : les brouillons DS restent visibles en mode interactif, sans forçage de pseudo-état ; les projections Pages sont réinitialisées après confirmation avant désactivation, selon leur contrat éphémère.

Critères : sélection et modification d’un libellé/contrôle internes, blocage des actions et saisies en édition, retour aux actions/saisies hors édition, un seul switch dans le panneau off, retour des outils en on, propagation Pages/DS, historique et parcours existants conservés. Deux formats desktop sous Chromium/WebKit, types/builds isolés, lint et diff ; preuves et réserves consignées après exécution. Doc updated. Aucun accès fournisseur réel ni publication.

## Bilan

En revue, qualification technique acquise, acceptation humaine différée. Tous les critères ci-dessus éprouvés dans les deux formats sous Chromium/WebKit ; un exemple individuel de formulaire confirme la restitution des actions et une aide de Field Default sa sélection. Types/builds app/Storybook isolés, trois contrôles de composition, validation Loomata UI et lint conformes. [Preuves, sources, corrections et limites](../reviews/wysiwyg-01/edit-mode.md). Sélection DS bornée aux parties/propriétés déclarées ; aucun binding inventé pour du DOM arbitraire.

Recette fictive 61484, anciens aperçus préservés. Fichiers : Workspace/PageWorkspace/VisualInspector, projection Preview, contrôle partagé et story/styles, tests/guide/architecture/preuves et suivi racine. Doc updated ; aucune publication ni inférence réelle. Suite : retour humain, sans ouverture de T2/T3 ni clôture J4/J5.

Version réalisée `6e1afce`, intégration locale après qualification ; aucune publication.
