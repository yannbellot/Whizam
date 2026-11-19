# DS-EDIT-24 — Apparence harmonisée avec Storybook

31 octobre 2026 — cible application, **En revue : qualification technique acquise, acceptation humaine différée**. Mandat : proposition d’harmonisation validée par le porteur dans ce fil. Dépendance : panneau et parcours DS-EDIT-23 existants ; aucun changement d’opérations ou de persistance. Statut consolidé dans la roadmap du lab ; modèles de suivi applicatifs non initialisés.

## Préparation

Base `b0eb58ec6abcafc5e770bf8bfe7f2ccc9f2b6628`, branche initiale `main`, branche dédiée `codex/appearance-storybook-theme`. Racine Git canonique vérifiée avant écriture ; aucun changement suivi préexistant. Copies suffixées et `frontend/` non suivis préservés, sans nettoyage. La création de branche a nécessité l’autorisation sandbox pour `.git`, obtenue sans changer les protections.

Catalogue applicatif consulté ; procédures `design-interactions`, `implement-feature`, puis `review-design` sélectionnées à cette base qualifiée DS-EDIT-23. Mode séquentiel, même agent, non indépendant ; aucune délégation. GPT-6.1 Sol · Moyenne recommandé : changement local de présentation, thème fourni par la dépendance Storybook 10.6.3 installée, aucun contrat de données modifié. Configuration du client non inférée.

## Périmètre et choix délégués

Raccorder `.storybook/editor/Panel.tsx` et `panel.module.css` au thème actif du manager Storybook, y compris champs multiligne, liens, erreurs, survol/focus et désactivation. Rendre titres et espacements plus compacts. Adapter uniquement le contexte de thème du test de rendu existant ; compléter le guide `docs/design-system/editor-preview.md` et ce suivi avec les preuves utiles.

Le thème de l’outil possède ses variables CSS locales `--appearance-*`, alimentées par `storybook/theming` déjà installé. Retirer l’import des tokens du produit dans le manager. Les échantillons et la story conservent leurs valeurs exactes. Aucun thème forcé, nouveau token produit, dépendance, inférence, compte, source YAML, writer ou changement de navigation. Le choix visuel validé concerne la direction ; le rendu final reste à accepter humainement.

## Critères et contrôles prévus

- Fonds, textes, contrôles et messages suivent réellement le thème clair/sombre chargé par Storybook. Le manager observé reprend le thème système au chargement ; la campagne n’exige pas de lui une bascule automatique en session.
- Focus clavier visible, contrôles désactivés compréhensibles ; champs, réponses Codex et liens lisibles aux formats 1280×800 et 390×844, sans débordement horizontal du panneau.
- Couleurs des échantillons et du composant conservées ; états et gestes DS-EDIT-23 inchangés.
- Types, qualité/formatage ciblés, tests unitaires pertinents, builds application/Storybook et parcours navigateur isolés. Pas de nouvelle suite unitaire pour des règles CSS ; vérifier le rendu réel.
- Revue design, conclusion technique et sécurité ciblées, séquentielles et non indépendantes. Aucun essai de persistance ou fournisseur requis : moteurs et contrats inchangés.

## Reprise

[Bilan et preuves](../reviews/ds-edit-24-storybook-panel-theme.md) : types, 15 tests unitaires ciblés, qualité/formatage ciblés, builds application/Storybook et huit parcours navigateur conformes. Neuf sources éditables inchangées ; couleurs exactes et modèle/catalogue de recette conservés. Revues design, technique et sécurité satisfaisantes dans leur périmètre, séquentielles et non indépendantes. Diagnostics initiaux et limites conservés dans le bilan.

Nouvel aperçu isolé sur 54127, anciennes recettes/brouillons/comptes préservés, aucune connexion privée transférée. Prochaine action : recette humaine du rendu. **Doc updated.** Guide et suivi de fabrication synchronisés ; modèles applicatifs et G/J5 inchangés. Aucun push ou publication ; autres navigateurs/OS et thèmes personnalisés non vérifiés.
