# Architecture du design system

La [politique courante](policy.md) définit trois catégories de tokens : primitives, tokens de composant et tokens locaux de page. Les valeurs sont en JSON DTCG ; les réglages des composants/pages référencent directement les primitives.

Les composants sont du code React partagé, avec variantes et états explicites. Les patterns documentent une coordination d’interactions ou une composition réutilisable ; ils ne sont pas une catégorie supplémentaire de tokens. La grille et les règles de composition se documentent selon leurs usages réels.

L’assistant maintient les sources et exemples à partir du besoin. La génération autonome produit CSS, utilitaires, inventaires et stories sans IA. Storybook présente Foundations / Components / Patterns en consultation, sans writer ni UI Lab. Voir le [contrat des sources](../../src/design-system/authority/README.md).

Les anciennes architectures à décisions sémantiques et inspecteurs sont historiques. Préserver clavier, focus, libellés, retours et défilement ; une migration conserve les valeurs et états sauf changement visuel explicite.
