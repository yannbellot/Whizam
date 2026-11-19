# DS-EDIT-73 — Arborescence des catalogues Storybook dans UI Lab

5 novembre 2026. Application, base f83f074, branche codex/ds-edit-73-storybook-tree. [Mandat](../work-items/ds-edit-73-storybook-tree.md). Revues design puis technique : séquentielles, même agent, non indépendantes.

## Réalisation

Quatre racines numérotées, repliables, ordonnées comme Storybook ; arborescence récursive des catalogues (All, familles et sous-familles, composants), puis exemples existants sous Components. Titres, catégories, noms explicites et tags !dev proviennent des définitions .examples extraites des huit stories catalogue. Storybook les consomme également ; aucun générateur ni synchronisation de fichiers n’est ajouté. Les contrôles de catégories restent identiques. Les aliases historiques foundations/* sont préservés hors menu ; sceneFor et liens d’usage inchangés. Les pages MDX de documentation et le composant métier ProjectSummary restent dans Storybook, hors des scènes d’édition préparées du présent atelier. Aucun contenu produit, valeur, dépendance ou permission modifié ; manifeste v25, aucun token ajouté.

## Vérifications

Copie isolée .local/ds-edit-73/test depuis les seuls fichiers suivis et nouveaux fichiers du mandat ; doublons non suivis et frontend préservés. Node 24.22.0 et npm 11.8.0 déjà disponibles, aucune installation.

| Contrôle | Résultat |
| --- | --- |
| npm run typecheck | Réussite, types-retest.log puis types-final.log. Premier échec de typage de control:false après extraction corrigé par conservation du type littéral. |
| npm run lint | Réussite sur code final, lint-final.log. |
| npm run docs:design-system:check | Réussite, génération conforme ; generation.log. |
| Vitest tests/unit/workshop-navigation.test.ts | Un test réussi : quatre racines, descendants, identités uniques, absence des catégories !dev et maintien des liens historiques ; navigation-unit.log. |
| npm run test:design-editor | 26 parcours desktop/mobile réussis, workshop-final.log ; build app réussi. Premier lot : 25/26, saisie perdue dans le scénario combinant recherche et brouillon mobile. Scénario recentré sur la navigation ; la conservation du brouillon est vérifiée dans le nouveau scénario catalogue dédié aux deux formats, ainsi que dans les parcours préexistants. Aucun changement du moteur d’édition pour masquer cette limite de saisie ; échec conservé dans workshop.log. |
| npm run build-storybook | Réussite, storybook.log ; aucune modification de catégorie/nom/tag des stories. |
| npm run test:boundaries | Réussite, boundaries.log. |
| git diff --check | Réussite avant livraison. |

Les parcours vérifient l’accès aux vrais tableaux Primitives/color/standalone, Primitives/type/font-family, Semantic tokens/color/action et Component tokens/Button, puis le retour au brouillon du bouton. Entrée/Espace, recherche multi-mots, effacement, sélection et maintien du focus sont qualifiés. Les avertissements health/Zod du build et le 404 volontaire de l’endpoint d’écriture en build consultatif ne sont pas des échecs.

## Revues

Design satisfaisant sur le périmètre : [menu desktop](ds-edit-73/menu-desktop.png), [catalogue desktop](ds-edit-73/catalog-desktop.png), [catalogue mobile](ds-edit-73/catalog-mobile.png) inspectés. Hiérarchie et noms issus de Storybook ; habillage UI Lab conservé. Tables avec défilement horizontal interne sur mobile, sans élargissement du document. L’acceptation visuelle humaine reste différée.

Technique satisfaisante : définitions partagées sans import runtime Storybook dans l’atelier ; résolution et rendu de chaque catalogue avec ses arguments existants. Les parents se rouvrent sur changement de scène, les choix d’ouverture sont conservés et le brouillon commun reste intact. Sécurité ciblée satisfaisante : recherche locale, rendu React, aucune API ou permission ajoutée. Revue spécialisée de sécurité non déclenchée faute de nouvelle surface sensible. Pas de nouvelle campagne de persistance interrompue ni d’audit exhaustif d’accessibilité ; ces capacités ne sont pas modifiées.

## Recette et reprise

[UI Lab](http://127.0.0.1:54144/ui-lab), racine .local/ds-edit-73/recipe, manifeste v25. Sources de valeurs enregistrées lues sous barrière compatible depuis DS-EDIT-72 ; modèle strictement égal après génération : 188 bindings et 18 styles. Aucun compte, brouillon, journal ou reçu transféré. Ancienne recette 54143 préservée ; métadonnées dans .local/ds-edit-73/processes.json. Safari indisponible car Mac verrouillé ; recette ouverte et trois racines de tokens dépliées dans le navigateur intégré, structure visible et onglet conservé. Aucun réglage humain modifié. En revue — qualification technique acquise, acceptation humaine différée. Doc updated. Aucune publication. Prochaine action : essai visuel du menu et de ses catalogues par le designer.
