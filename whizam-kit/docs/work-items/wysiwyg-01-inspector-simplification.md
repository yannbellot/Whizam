# WYSIWYG-01 — Simplification de l’inspecteur

Cible : application. Mandat du 16 novembre 2026 : placer « Mode édition » au-dessus du panneau droit, retirer les commentaires techniques permanents, simplifier les noms des champs et réserver chaque partie à une sélection explicite.

Base : main `db4609e66e1a8be260d367d12140e72afcb2c46a`, branche locale codex/wysiwyg-01-simplify-inspector. Racine Git vérifiée ; changements suivis initiaux absents. Copies non suivies « 2 », application/.storybook/editor/ et frontend/ préexistants exclus et préservés.

Périmètre : Controls, inspecteur visuel et styles, intégration Workspace, TokenInspector, parcours de qualification existant et guide du panneau. Suivi de fabrication dans la roadmap et l’état racine ; modèles applicatifs non initialisés. Aucun changement de tokens, projection, permissions, fournisseur, dépendances ou données utilisateur.

Critères : un seul switch nommé Mode édition au-dessus de la carte dans DS et Pages, disponible lorsque désactivé ; commentaires CSS/provenance/état et aides permanentes retirés ; erreurs et confirmations de perte conservées ; champs courts ; aucune liste permettant de modifier une autre partie sans la sélectionner dans l’aperçu.

Choix délégués : conserver les sept groupes et les actions existantes ; conserver le contexte sélectionné, les erreurs et l’état de brouillon utiles. Les réglages enregistrés sont limités au target/variant/part réellement sélectionné ; les états de cette partie restent accessibles. Hypothèse réversible : les libellés courts concernent aussi les champs enregistrés, sans changer leurs identifiants.

Procédures du catalogue applicatif à la base ci-dessus : implement-feature, review-design, technical-review. Revues séquentielles, même agent, non indépendantes. Configuration conseillée : GPT-6.1 Sol · Moyenne ; surface UI localisée, contrats existants préservés, aucune hausse justifiée. Vérifications prévues : parcours Chromium et WebKit 1280×900 / 1440×1000, édition/reset/modes/sélection parent-enfant, génération, lint ciblé, types/build sur sources suivies isolées (copies préexistantes exclues).

**Statut : En revue, qualification technique acquise, acceptation humaine différée.** [Résultats, revues, incidents résolus et reprise](../reviews/wysiwyg-01/inspector-simplification.md). Types, builds Application/Storybook, génération/documentation, 16 contrats/composition et parcours complets Chromium/WebKit aux deux formats réussis. Diff et empreintes revus ; avertissement useEffect préexistant consigné. Doc updated. Aucune publication ; prochaine action : recette visuelle humaine sur l’aperçu isolé 58383. Préexistants et modèles applicatifs préservés.
