# DS-EDIT-37 — Actions et rétablissement dans Apparence

1 novembre 2026 — cible application, En cours. Base 0664d522, branche codex/appearance-restore-controls. Mandat : espacer Comparer verticalement, conserver Rétablir visible et inactif sans changement, permettre le rétablissement après choix partagé, retirer les messages de portée. Analyser les états des trois choix sans modifier implicitement leur logique.

Périmètre : Panel.tsx, ScopeControls.tsx, panel.module.css, parcours assisted et documentation directement affectée. Préexistants non suivis préservés, dont SemanticStyles.tsx et copies suffixées 2 ; aucun changement des autorités, comptes ou données. Modèles app non initialisés ; suivi consolidé dans le lab.

Procédures applicatives implement-feature, review-design, technical-review à la version 0664d522, sélection explicite depuis le catalogue. Builder puis revues séquentielles, même agent, non indépendantes. Sol Moyenne suffit : présentation et annulation du geste existant, contrats et services inchangés.

Hypothèse réversible : marge verticale 1rem. Rétablir annule le geste du réglage courant puis restaure son attribution/base si nécessaire ; les autres gestes restent conservés. Critères : bouton toujours visible, inactif sans changement ; actif après choix partagé, local et intention ; comparaison verrouille les actions ; messages génériques absents, erreurs utiles conservées. Preuves prévues : types, qualité ciblée, unitaires assisted-session, parcours navigateur desktop/mobile dev et statique, revues du diff. Mise à jour ciblée de l’aperçu 54137 après constat d’absence de brouillon, sans transfert privé ni modification des sources de valeurs.

## Bilan

En revue, qualification technique acquise, acceptation humaine différée. [Preuves, états des boutons et réserves](../reviews/ds-edit-37-appearance-actions.md). Types isolés, qualité ciblée, 12 unitaires et 20 exécutions navigateur (10 dev/10 statiques) conformes. Types du clone bloqués par un fichier préexistant non suivi isolé sans modification. Aperçu 54137 actualisé, valeurs et configuration préservées. Doc updated. Reprise : recette humaine et éventuel arbitrage des états sélectionnés, sans nouvelle tranche ni publication.
