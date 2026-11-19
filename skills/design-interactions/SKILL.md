---
name: design-interactions
description: 'Définir les parcours et transitions UI d’une fonctionnalité, dont validation, chargement, annulation, erreurs et récupération ; sans inventer de référence visuelle.'
---

# design-interactions

Entrées : spécification, composants/états disponibles et références réellement fournies. Contrat commun : docs/agents/skill-contract.md.

## Travail

Relier chaque action au changement d’état et à un retour observable ; prévoir focus/clavier, erreurs reliées aux champs, conservation de saisie, annulation et reprise quand pertinents. Choisir les composants existants avant un comportement complexe nouveau. Distinguer navigation (lien) et action (bouton) ; une story de chargement n’est pas une action serveur réelle.

## Sortie et contrôle

Ajouter les interactions/états à la spécification et identifier les stories/parcours à vérifier sur les formats retenus. Vérifier les libellés, refus et absence de faux succès ; ne pas prétendre tester ce qui reste dessiné. Une hypothèse visuelle réversible est consignée pour recette, un conflit d’autorité ou effet matériel exige l’arbitrage prévu. Ce skill n’autorise pas d’adopter implicitement une bibliothèque ni de modifier des données.

## Design system automatisé — DS-AUTO-01

Appliquer la [politique courante](../../docs/design-system/policy.md) et le [contrat des sources](../../src/design-system/authority/README.md). Trois catégories : primitives (valeurs brutes), tokens de composant et tokens locaux de page. Les deux derniers référencent directement les primitives ; une primitive consommée reste stable. Les différences d’apparence d’un composant sont des variantes explicites, pas des exceptions d’instance.

L’assistant maintient sources, contrats, exemples et descriptions dans le mandat ; les scripts génèrent CSS, inventaires et stories. Après changement : `npm run design-system:sync`, `npm run design-system:check` et les contrôles adaptés. Ne pas éditer les dérivés. Réutiliser le registre et les composants avant création ; signaler toute couverture manquante. Storybook est exclusivement documentaire, sans writer ni UI Lab. Aucun compte IA requis pour la génération. Préserver valeurs, unités, états, accessibilité et sources historiques lors d’une migration explicite.
