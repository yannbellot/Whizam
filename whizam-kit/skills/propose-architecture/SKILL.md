---
name: propose-architecture
description: "Vérifier l’adéquation du starter et proposer une adaptation d’architecture justifiée par un besoin concret ; sans rouvrir systématiquement la stack."
---

# propose-architecture

Entrées : cible canonique, brief/specification, contraintes, architecture et décisions existantes. Lire docs/agents/skill-contract.md dans le kit puis docs/architecture.md dans la racine du projet ciblé.

## Travail et sortie

Identifier le besoin qui ne rentre pas dans l’existant, puis comparer l’adaptation minimale à son coût de migration/reprise. Expliquer responsabilités, flux et frontières avant tout refactor structurel. Conserver une application intégrée si aucun besoin prouvé n’impose un backend distinct ; ne pas choisir une technologie pour son seul attrait.

Produire une proposition ou décision avec alternatives pertinentes, hypothèses, conséquences, éléments à migrer et vérifications. Une décision structurante non déléguée est soumise selon AGENTS avant implémentation ; une investigation ne crée pas d’architecture ni de fichiers vides. Mettre à jour docs/decisions et l’architecture de la cible seulement dans le périmètre autorisé, avec renvois si la décision couvre plusieurs projets explicitement autorisés. Si le besoin n’est pas couvert par les sources, signaler l’incertitude et limiter la proposition.
