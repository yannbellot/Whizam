# WYSIWYG-01 — Ajustements de recette

Cible application, mandat du 16 novembre : galerie globale sélectionnable des composants, champs Pages alignés sur le DS, édition immédiate sans bouton Aperçu et séparation nombre/unité. Base 1580572, branche codex/wysiwyg-01-ui-refinements, aucun changement suivi initial ; fichiers non suivis exclus. Procédures app implement-feature/test-user-flow/review-design/technical-review/update-project-docs réutilisées à cette version, revues séquentielles non indépendantes. Aucun sous-agent ni fournisseur réel.

Solution : nouvelle scène de galerie construite depuis les exemples et cibles existants, même pont de sélection/bindings ; contrôles et attributs compacts DS-UI-06 réutilisés. Les unités simples sont extraites visuellement puis recomposées pour CSS ; expressions complexes conservées. Choix réversible : un exemple par composant, variantes accessibles par navigation existante. Aucun nouveau writer, persistance ou droit.

Critères : tous les composants enregistrés visibles ensemble ; clic sélectionne leur contexte dans le panneau sans navigation ; saisie et unité modifient immédiatement le rendu ; nombres sans suffixe ; reset/historique/transmission conservés ; formats desktop et deux moteurs. Critères démontrés sous Chromium et WebKit ; galerie modifiée puis abandon confirmé, parcours Pages complet et écriture isolée relue après recharge. Types/builds app/Storybook isolés, six tests DS, Pages ciblé, lint et diff conformes. [Bilan, échecs corrigés et réserves](../reviews/wysiwyg-01/ui-refinements.md). En revue, acceptation humaine différée. Doc updated.

Recette : http://127.0.0.1:60723/ui-lab?scene=components%2FOverview (copie fictive neuve ; ancien 59977 conservé). Smoke de dimensionnement rem/nombre réussi et reset effectué. Prochaine action : retour visuel humain sur cette copie.

Version réalisée : `94650a0`, intégration locale après qualification. Aucun push.
