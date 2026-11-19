# DS-AUTO-01 — Portée de la vérification

18 novembre 2026. Évolution locale sans HEAD Git courant ; politique validée, résultat à examiner par le designer.

UI Lab, ses routes et son bootstrap d’écriture sont retirés. La génération autonome utilise 152 primitives, 232 tokens de composant et 12 tokens locaux de page ; les 149 anciennes décisions intermédiaires ne constituent plus une catégorie active. Les recettes CSS typées restent distinctes des tokens.

Les 396 valeurs de tokens retenues sont comparées à la table de migration. Les tests couvrent références et types, portée locale, idempotence, péremption, protection des exemples, couverture des composants et variantes, retrait des stories générées obsolètes, interruption de publication et reprise refusant un propriétaire vivant.

Storybook est construit depuis les mêmes composants que l’application. Les contrôles navigateur couvrent consultation sans écriture, états, focus et patterns sur 1280 × 900 et 1600 × 1000. Sept états de composants ont les mêmes styles calculés et captures avant/après. L’accueil et la route de santé restent disponibles ; les anciennes routes UI Lab répondent 404.

Les tests ne constituent pas un audit exhaustif de l’accessibilité ou une garantie de conformité visuelle de toutes les pages. Les fontes externes non installées, avertissements de bundler et de Fast Refresh hérités restent des limites explicites. Aucun compte IA, projet utilisateur ou volume Docker n’a été transféré. Aucun essai natif d’un assistant autre que la session de travail ni nouvelle recette humaine déduit de ces contrôles.

La [politique](../design-system/policy.md) est l’autorité d’usage. Les rapports historiques d’éditeur ou de décisions sémantiques décrivent leur ancienne version. La nouvelle génération ne charge pas les services du writer historique. Les utilitaires historiques conservés ne sont pas un contrat de compatibilité de mise à niveau des projets déjà distribués.

Les anciennes entrées npm de writer, d’inspecteurs et de services d’orchestration dépendant de l’éditeur ont été retirées. Leurs sources historiques conservées ne sont pas un parcours actif du kit. Le lanceur local conservé démarre l’application ordinaire et Storybook, sans UI Lab ni session d’édition ; sa logique de supervision est testée sur fixtures isolées.
