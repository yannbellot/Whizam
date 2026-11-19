# DS-EDIT-25 — Simplification de l’onglet Apparence

31 octobre 2026 — cible application, **En revue : qualification technique acquise, acceptation humaine différée**. Mandat : appliquer les ajustements de présentation explicitement demandés par le designer. Dépendance : DS-EDIT-23/24 existants. Suivi consolidé dans la roadmap du lab ; modèles applicatifs non initialisés.

## Préparation et périmètre

Base `3c040f65fc62d43f13fe7dcb65cf92ed8c53fe77`, branche initiale `main`, branche dédiée `codex/appearance-panel-layout`. Racine Git canonique vérifiée ; aucun changement suivi préexistant. Copies suffixées et `frontend/` non suivis hors périmètre, préservés. Création de branche initialement refusée par le sandbox puis demandée avec autorisation ciblée.

Catalogue applicatif consulté ; procédures `implement-feature`, `test-user-flow`, `review-design`, `technical-review` et `security-review` sélectionnées à la base qualifiée. Mode séquentiel, même agent, non indépendant ; aucune délégation. GPT-6.1 Sol · Moyenne : présentation localisée, aucun contrat ni writer modifié. Configuration client non inférée.

Fichiers concernés : panneau et contrôles de portée `.storybook/editor/`, CSS associé, tests de rendu/parcours directement affectés, guide `editor-preview.md`, présente fiche, bilan de revue et suivi racine.

## Critères et choix

- Titre anglais conforme au nom du composant dans la sidebar, exemple conservé en italique.
- Retrait des informations de connexion/quota, disponibilité locale, succès durable et brouillon vide demandées ; conservation des erreurs, attentes et blocages utiles.
- Aucun contour ni légende visible « Réglage en brouillon » ; nom accessible conservé pour le groupe de contrôles.
- Comparaison immédiatement sous la saisie visuelle, accessible pour quitter ce mode.
- Actions de réglage compactes côte à côte, retour à la ligne si nécessaire, avant les références.
- Références visibles uniquement pendant la définition d’une intention ; liens de composants seuls, sans accordéon ni inventaire technique. Hypothèse réversible : un lien par composant concerné vers son exemple préparé ; le retour au réglage reste disponible.
- Enregistrer placé en pied de panneau. Retrait du résumé chiffré des contrastes ; avertissements et acquittement maintenus si nécessaires.

Contrôles prévus : types, tests ciblés existants adaptés, lint/formatage ciblés, build Storybook, parcours réel ordinateur/mobile et thèmes clair/sombre ; revue design, technique et sécurité proportionnée. Persistance et fournisseur inchangés : aucune inférence réelle ni compte transféré. Aperçu isolé pour préserver les anciennes recettes et brouillons.

## Reprise

[Bilan, captures et limites](../reviews/ds-edit-25-appearance-layout.md) : types, 16 unitaires ciblés, qualité ciblée, six parcours dev et six statiques conformes. Deux parcours persistants en copie jetable et relecture compilée ordinateur/mobile réussis. Quatre parcours clair/sombre de l’aperçu livré conformes ; modèle/catalogue identiques à la recette précédente, #b51a00 et 188 identités conservés.

Revues design, technique et sécurité satisfaisantes dans leur périmètre, séquentielles, même agent, non indépendantes. Aperçu isolé sur 54128, anciennes copies et états privés préservés ; aucun brouillon déposé. Prochaine action : recette visuelle humaine, dont le regroupement des liens par composant. Guide, fiche, bilan et suivi racine synchronisés. **Doc updated.** Risques résiduels : brouillon volatile, autres plateformes non testées. Aucun push/publication, modèles applicatifs et G/J5 inchangés.
