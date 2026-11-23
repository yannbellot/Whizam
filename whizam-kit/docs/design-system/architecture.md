# Architecture du design system

La [politique courante](policy.md) définit trois catégories de tokens : primitives, tokens de composant et tokens locaux de page. Les valeurs sont en JSON DTCG ; les réglages des composants/pages référencent directement les primitives.

Les composants sont du code React partagé, avec variantes et états explicites. Les patterns documentent une coordination d’interactions ou une composition réutilisable ; ils ne sont pas une catégorie supplémentaire de tokens. La grille et les règles de composition se documentent selon leurs usages réels.

L’assistant maintient les sources et exemples à partir du besoin. La génération autonome produit CSS, utilitaires, inventaires et stories sans IA. Storybook présente Foundations / Components / Patterns en consultation, sans writer ni UI Lab. Voir le [contrat des sources](../../src/design-system/authority/README.md).

Les anciennes architectures à décisions sémantiques et inspecteurs sont historiques. Préserver clavier, focus, libellés, retours et défilement ; une migration conserve les valeurs et états sauf changement visuel explicite.

## Organisation et publication Storybook

La [politique de classement](policy.md#classement-documentaire-storybook) décrit l’arborescence permanente et les règles de publication courantes. `.storybook/organization.ts` définit le vocabulaire et les destinations contrôlées ; `.storybook/project.json` déclare les seuls éléments du projet.

`stories` contient les chemins CSF et l’identifiant `component` pour les stories générées ; leurs titres appartiennent à Foundations/Examples, aux familles de Components ou à Interaction Patterns. Les titres structurels sont réservés. Les contrats et exemples rédigés fournissent les variantes et états. Après ajout/retrait ou changement de déclaration, relancer Storybook pour recalculer son index.

`tokenIds` déclare les tokens du projet ; ceux des composants inscrits sont inclus par propriétaire. `primitiveIds` déclare les primitives établies pour le projet ; les primitives référencées par ses tokens sont incluses automatiquement. `rules` contient les règles établies, rendues comme texte. `classification` ajoute le classement documentaire sans changer l’appartenance, les valeurs ni les références.

Le kit neuf conserve ces listes vides. Les références de `.storybook/starter-stories.json` et les historiques restent internes. Adopter un élément nécessite d’adapter ses exemples avant inscription ; aucun document, composant ni pattern fictif n’est réactivé par la navigation. Les données non classées sont diagnostiquées et conservées dans All. Aucun fichier du parent n’est nécessaire.
