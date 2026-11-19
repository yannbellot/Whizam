---
name: normalize-design-system
description: 'Structurer primitives, tokens de composant, tokens locaux et usages à partir des autorités existantes, en préservant la direction visuelle et une source par décision.'
---

# normalize-design-system

Entrées : règles UI et références analysées, autorités, composants et rendus. Lire docs/agents/skill-contract.md et l’autorité documentée du design system.

## Travail et sortie

Identifier le propriétaire de chaque décision. Formaliser seulement le périmètre nécessaire : primitive typée, token de composant ou local de page, contrat et usages/états. Réutiliser le mécanisme de génération du projet, jamais éditer ses dérivés ni créer une synchronisation Figma non demandée. Une dépendance comportementale installée ne vaut pas adoption visuelle.

Livrer les autorités/documents et raccordements concernés, puis prouver qu’un token atteint les rendus prévus. Vérifier références/types/cycles, clavier/focus/contrastes et formats pertinents ; maintenir stories et principes sans double saisie. Les valeurs proposées restent provisoires si non acceptées ; un conflit ou changement matériel impose l’arbitrage AGENTS. Ne pas développer un catalogue exhaustif de primitives sans besoin.

## Design system automatisé — DS-AUTO-01

Appliquer la [politique courante](../../docs/design-system/policy.md) et le [contrat des sources](../../src/design-system/authority/README.md). Trois catégories : primitives (valeurs brutes), tokens de composant et tokens locaux de page. Les deux derniers référencent directement les primitives ; une primitive consommée reste stable. Les différences d’apparence d’un composant sont des variantes explicites, pas des exceptions d’instance.

L’assistant maintient sources, contrats, exemples et descriptions dans le mandat ; les scripts génèrent CSS, inventaires et stories. Après changement : `npm run design-system:sync`, `npm run design-system:check` et les contrôles adaptés. Ne pas éditer les dérivés. Réutiliser le registre et les composants avant création ; signaler toute couverture manquante. Storybook est exclusivement documentaire, sans writer ni UI Lab. Aucun compte IA requis pour la génération. Préserver valeurs, unités, états, accessibilité et sources historiques lors d’une migration explicite.
