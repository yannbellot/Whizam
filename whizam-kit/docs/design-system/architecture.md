# Architecture du design system

Le design system relie les valeurs et références JSON DTCG, les composants React et leurs exemples. La [politique](policy.md) définit trois catégories de tokens : primitives, tokens de composant et tokens locaux de page. Les réglages des composants et pages référencent directement les primitives.

Les composants partagés déclarent leurs variantes et états. Les patterns décrivent une coordination d’interactions ou une composition réutilisable, sans constituer une catégorie supplémentaire de tokens. La grille et les règles de composition se documentent selon leurs usages réels.

L’assistant maintient les sources et exemples ; la génération produit CSS, utilitaires, inventaires et stories sans IA. Storybook présente Foundations / Components / Patterns en consultation. Les sources canoniques sont décrites dans `src/design-system/authority/README.md`. Toute évolution préserve clavier, focus, libellés, retours et défilement ; une migration conserve les valeurs et états sauf changement visuel explicite.

## Organisation et publication Storybook

La publication comporte trois étapes distinctes : générer les stories depuis les contrats et exemples ; sélectionner les éléments du projet dans `.storybook/project.json` ; classer les éléments sélectionnés avec `classification`. Le classement ne sélectionne aucun élément et ne change aucune valeur. Un token sélectionné sans classement reste visible dans All avec un diagnostic.

La [politique de classement](policy.md#classement-documentaire-storybook) décrit l’arborescence permanente et les règles de publication courantes. `.storybook/organization.ts` définit le vocabulaire et les destinations contrôlées ; `.storybook/project.json` déclare les seuls éléments du projet.

`stories` contient les chemins CSF et l’identifiant `component` pour les stories générées ; leurs titres appartiennent à Foundations/Examples, aux familles de Components ou à Interaction Patterns. Les titres structurels sont réservés. Les contrats et exemples rédigés fournissent les variantes et états. Après ajout/retrait ou changement de déclaration, relancer Storybook pour recalculer son index.

`tokenIds` déclare les tokens du projet ; ceux des composants inscrits sont inclus par propriétaire. `primitiveIds` déclare les primitives établies pour le projet ; les primitives référencées par ses tokens sont incluses automatiquement. `rules` contient les règles établies, rendues comme texte. `classification` ajoute le classement documentaire sans changer l’appartenance, les valeurs ni les références.

Le kit neuf conserve ces listes vides. Les références de `.storybook/starter-stories.json` et les historiques restent internes. Adopter un élément nécessite d’adapter ses exemples avant inscription ; aucun document, composant ni pattern fictif n’est réactivé par la navigation. Les données non classées sont diagnostiquées et conservées dans All. Aucun fichier du parent n’est nécessaire.
