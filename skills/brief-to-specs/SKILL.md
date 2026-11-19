---
name: brief-to-specs
description: "Formaliser des comportements et critères d’acceptation à partir d’un brief cadré, avant de construire un parcours ou changer ses règles."
---

# brief-to-specs

Entrées : cible canonique, brief, contraintes/autorités et règles existantes. Contrat commun : docs/agents/skill-contract.md ; résolution des chemins selon la cible.

## Travail

Décrire les parcours, règles de saisie/données, droits applicables, erreurs et exclusions. Relier chaque résultat attendu à une vérification observable, y compris refus/absence et persistance si pertinente. Distinguer comportement voulu et détail d’implémentation ; ne pas ajouter un compte, une suppression ou une technologie pour compléter artificiellement l’exemple.

## Sortie et contrôle

Créer/mettre à jour la spécification avec hypothèses et critères testables : docs/product/features dans la racine du projet, ou la source explicitement désignée par le mandat. Vérifier cohérence avec schéma, design et périmètre sans désigner le code comme vérité automatique. Une contradiction ou décision matérielle bloque son implémentation ; les hypothèses limitées restent explicitement provisoires. Le plan technique vient ensuite si une réalisation est demandée.
