# DS-EDIT-72 — Menu latéral du UI Lab

Cible : application. Mandat : remplacer le sélecteur de la colonne gauche par un véritable menu inspiré du menu Storybook. Base `1698b628a3b55d6258458985c0cc4f082ca16e68`, branche `codex/ds-edit-72-workshop-navigation`. Préexistants : fichiers non suivis (doublons « 2 », ancien `.storybook/editor/`, `frontend/`) hors périmètre, préservés.

## Préparation

Rubriques Fondations, Composants et Références ; groupes dépliables, variantes et états, recherche et sélection visible. Réutiliser les scènes et leur protocole existants, conserver le brouillon et le retour au réglage. Pas de dépendance ajoutée, pas de modification des valeurs produit, de la sauvegarde ou des accès. Hypothèse visuelle minimale réversible : navigation claire et compacte, groupe courant ouvert, consultation mobile dans la même colonne empilée ; à soumettre à la recette humaine.

Fichiers concernés : navigation extraite de Workspace, CSS et tokens de composition dédiés, tests atelier affectés, manifeste de révision pour la recette ; suivi racine. Les modèles de suivi app restent non initialisés.

Procédures du catalogue app explicitement sélectionnées à la version de base : implement-feature, design-interactions, test-user-flow, review-design, technical-review. Même agent, rôles séquentiels, non indépendants. GPT-6.1 Sol · Moyenne recommandé : navigation client localisée, états React et habillage tokenisé, sans nouvelle frontière serveur ou donnée.

Critères : chaque scène reste accessible ; hiérarchie dépliable au clavier ; filtre par groupe/variante, absence de résultat récupérable ; scène active identifiée ; brouillon préservé entre scènes et retour depuis les usages ; desktop/mobile sans débordement. Contrôles prévus : génération/contrôle DS, types/lint, parcours atelier existants adaptés et parcours navigation. Revue design/technique séquentielle ; sécurité ciblée au diff, aucune nouvelle entrée externe ni permission.

Statut : En revue — qualification technique acquise, acceptation humaine différée. [Revue, commandes, échecs et retests](../reviews/ds-edit-72-navigation.md). Types/lint, 82 contrôles DS, 22 parcours atelier existants et nouveau parcours desktop/mobile répété réussis ; build compilé réussi. Recette 54143 ouverte dans Safari, valeurs enregistrées conservées strictement (188 bindings/18 styles), anciennes instances préservées. Version : base et empreinte source du rapport, manifeste v24. Impact documentaire : Doc updated. Risque résiduel : appréciation visuelle et recette humaine ; pas de publication. Prochaine action : essai humain du menu.

Réalisation intégrée au commit local `ca5b3ef` ; le suivi consolidé reste dans la roadmap racine.
