---
name: map-figma-to-components
description: "Relier des éléments Figma accessibles aux composants et états du projet ; activer seulement lorsqu’une référence Figma est fournie et utilisable."
---

# map-figma-to-components

Entrées : référence Figma autorisée et réellement lisible, version/nœuds, critères et inventaire du design system. Lire docs/agents/skill-contract.md. Vérifier l’outil/accès avant de supposer une extraction possible.

## Travail et sortie

Cartographier élément → intention → composant/variante/état existant ou manquant. Relever les différences sans reproduire mécaniquement l’arborescence Figma. Séparer défaut, adaptation technique, décision validée et indéterminé ; les composants/contrats du projet restent explicites.

Produire une table de correspondance sourcée, impacts et prochaines vérifications. Aucun accès Figma fourni : marquer non exécuté/non applicable selon le besoin, sans faux nœud, capture ou token. Une capture utilisable peut être analysée comme telle, sans prétendre une lecture du fichier Figma. Aucune dépendance obligatoire Figma, synchronisation bidirectionnelle ou publication implicite. Mettre à jour uniquement les références concernées et laisser visibles les arbitrages matériels.
