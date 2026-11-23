---
name: update-project-docs
description: 'Réconcilier les documents directement affectés par un changement vérifié, en gardant une source par règle et les preuves longues hors suivi courant.'
---

# update-project-docs

Entrées : changement/version, résultats réellement exécutés et références concernées. Contrat commun : docs/agents/skill-contract.md.

## Travail

Relier le comportement/contrat effectif à sa spécification, décision, procédure et preuve sans recopier toutes les sources. Appliquer le contrat commun : roadmap, suivi, décisions et rapports appartiennent au projet ciblé. Ne pas écrire son suivi dans celui du kit ou d’un parent ; utiliser un renvoi pour une coordination explicitement autorisée. Ne pas convertir une hypothèse, une installation ou une existence de fichier en validation humaine, compatibilité ou test réussi. Préserver archives et preuves historiques.

## Sortie et contrôle

Modifier les seuls documents utiles, vérifier liens/commandes/versions et cohérence des statuts ; signaler Doc updated ou No doc impact motivé. Une correction de texte directe reste proportionnée, sans créer un nouveau dossier inutile. Signaler un conflit réel et suspendre la partie dépendante selon AGENTS ; ne pas le résoudre en réécrivant silencieusement l’autorité opposée.

## Design system automatisé — DS-AUTO-01

Appliquer la [politique courante](../../docs/design-system/policy.md) et le [contrat des sources](../../src/design-system/authority/README.md). Trois catégories : primitives (valeurs brutes), tokens de composant et tokens locaux de page. Les deux derniers référencent directement les primitives ; une primitive consommée reste stable. Les différences d’apparence d’un composant sont des variantes explicites, pas des exceptions d’instance.

L’assistant maintient sources, contrats, exemples et descriptions dans le mandat ; les scripts génèrent CSS, inventaires et stories. Après changement : `npm run design-system:sync`, `npm run design-system:check` et les contrôles adaptés. Ne pas éditer les dérivés. Réutiliser le registre et les composants avant création ; signaler toute couverture manquante. Storybook est exclusivement documentaire, sans writer ni UI Lab. Aucun compte IA requis pour la génération. Préserver valeurs, unités, états, accessibilité et sources historiques lors d’une migration explicite.

## Portail documentaire

Maintenir les sources Markdown uniques et leur classement selon le [guide](../../docs/documentation.md). Après évolution, construire et contrôler le portail avec `docs:build` et `docs:check`. Les historiques du socle restent hors du site et de la recherche, les fichiers privés exclus. Classer les documents courants du projet dans leur étape via le registre ; ne pas les masquer du seul fait de leur dossier work-items/reviews. Présenter les trois accès Application, Storybook et Documentation après vérification, sans exiger le parent ou Python hôte.

## Langue documentaire

Appliquer le [cadrage initial](../../docs/agents/project-intake.md) : questions conditionnelles, second niveau en conversation et reprise depuis le brief/suivi. Ne pas demander quel assistant est utilisé ; suivre sa politique par point d’entrée. Recueillir les langues documentaires en Q10 seulement si elles manquent, selon [Langues du projet](../../docs/agents/languages.md).