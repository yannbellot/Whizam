---
name: implement-feature
description: 'Réaliser une tranche explicitement autorisée en code, tests, stories et documents, selon sa préparation ; distinguer prototype et fonctionnement complet.'
---

# implement-feature

Entrées : mandat, fiche/specification, préflight Git et cibles de test. Contrat commun : docs/agents/skill-contract.md.

## Travail

Suivre les frontières existantes : routes coordinatrices, métier/accès serveur isolés, composants partagés sans secrets/DB, validation runtime avant écriture. Limiter le diff ; migrations générées puis relues et versionnées, jamais remplacement silencieux d’une migration appliquée. Synchroniser les tests/stories affectés et corriger les échecs dans le périmètre. Utiliser les scripts documentés plutôt que recréer des commandes divergentes.

Pour la première version d’un projet dérivé, appliquer le [parcours de démarrage](../../docs/product/project-start.md#3-conception-et-développement) et la [procédure de remplacement de l’exemple](../../docs/product/replacing-project-example.md). Réaliser les pages/parcours convenus, retirer les entrées de démonstration de la navigation et des accès livrés, synchroniser les stories et tests affectés. Ne pas déduire de `/projects` une fonctionnalité à conserver ; protéger les données existantes et ne pas fabriquer des contenus utilisateur manquants.

Mode prototype : conserver la liste explicite des simulations, données fictives et chemins non implémentés ; une fixture ou un stockage navigateur ne prouve pas PostgreSQL. Nettoyer uniquement les ressources jetables créées et identifiées.

## Sortie et contrôle

Diff concret et preuves des critères, revues applicables, état documentaire/Git et réserves. Un contrôle obligatoire en échec n’est pas une acceptation technique à transférer à l’utilisateur. La publication et les effets matériels suivent AGENTS ; ce skill ne les autorise pas. Identifier le checkpoint si le périmètre ne peut plus être poursuivi sûrement.

## Design system automatisé — DS-AUTO-01

Appliquer la [politique courante](../../docs/design-system/policy.md) et le [contrat des sources](../../src/design-system/authority/README.md). Trois catégories : primitives (valeurs brutes), tokens de composant et tokens locaux de page. Les deux derniers référencent directement les primitives ; une primitive consommée reste stable. Les différences d’apparence d’un composant sont des variantes explicites, pas des exceptions d’instance.

L’assistant maintient sources, contrats, exemples et descriptions dans le mandat ; les scripts génèrent CSS, inventaires et stories. Après changement : `npm run design-system:sync`, `npm run design-system:check` et les contrôles adaptés. Ne pas éditer les dérivés. Réutiliser le registre et les composants avant création ; signaler toute couverture manquante. Storybook est exclusivement documentaire, sans writer ni UI Lab. Aucun compte IA requis pour la génération. Préserver valeurs, unités, états, accessibilité et sources historiques lors d’une migration explicite.
