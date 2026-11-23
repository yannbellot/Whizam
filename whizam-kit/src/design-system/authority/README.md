# Sources du design system

Politique courante : [gestion automatisée](../../../docs/design-system/policy.md), DS-AUTO-01. Elle remplace les anciennes instructions de UI Lab et de tokens de décision.

- `tokens.tokens.json` : source unique JSON DTCG des primitives, tokens de composant et tokens locaux de page. Les deux derniers référencent directement une primitive de même type.
- `components.yaml` : registre des composants, implémentations, exemples rédigés et couverture Storybook.
- `recipes.yaml` : recettes CSS fermées avec paramètres typés ; pas de tokens opaques.
- `google-fonts.catalog.json` : catalogue des ressources de fontes et empreintes, sans téléchargement automatique.

Les anciennes autorités YAML, fiches adjacentes et schémas de l’éditeur conservés sont des ressources historiques pour les anciens contrats et migrations. La génération actuelle ne les lit pas. Ils n’ajoutent aucun champ éditable ou couche sémantique au modèle courant.

Après un changement : `npm run design-system:sync`, `npm run design-system:check`, les tests et les builds pertinents. Ne jamais éditer les dérivés à la main. Storybook est exclusivement un outil de consultation.

La génération des stories ne les publie pas automatiquement. Leur appartenance au projet suit l’[organisation Storybook](../../../docs/design-system/architecture.md#organisation-et-publication-storybook), sans exemple par défaut.
