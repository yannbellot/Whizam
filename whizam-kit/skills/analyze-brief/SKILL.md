---
name: analyze-brief
description: 'Clarifier un brief nouveau ou incomplet en distinguant intention, contraintes, ambiguïtés et hypothèses ; ne pas implémenter pendant cette analyse.'
---

# analyze-brief

Entrées : demande, cible canonique et autorités déjà présentes, état courant. Lire AGENTS.md et docs/agents/skill-contract.md ; résoudre les autorités et livrables dans la cible selon ce contrat.

## Travail

Pour le démarrage d’un projet, appliquer la séquence de [cadrage de la première version](../../docs/product/project-start.md#2-cadrage-de-la-première-version) après la préparation technique : recueillir l’intention déjà connue ou manquante, puis définir les pages/parcours, contenus disponibles et direction visuelle nécessaires au premier résultat observable. Distinguer le périmètre convenu des propositions encore ouvertes ; une information produit manquante n’autorise pas son invention.

Reformuler le résultat observable et les exclusions ; chercher les contradictions avec le brief/spec existants. Séparer fait observé, hypothèse réversible et décision matérielle. Une information technique retrouvable dans le dépôt n’est pas une question produit. Ne pas inventer utilisateurs, budget, comptes ou services ; une ambiguïté non matérielle peut rester documentée jusqu’à la recette finale selon AGENTS.

## Sortie et contrôle

Brief court ou note de cadrage avec cible, objectif, limites, hypothèses, décisions réellement bloquantes et prochaine action. Mettre à jour docs/product/brief.md du projet seulement si le mandat porte sur cette intention, ou la source d’intention explicitement désignée. Consigner tout conflit ; arrêter la partie dépendante d’un arbitrage matériel. Aucune écriture applicative ni installation autorisée par ce skill seul.
