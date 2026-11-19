---
name: prepare-handoff
description: 'Préparer la reprise d’une version par un tiers avec le dépôt, ses prérequis, décisions, preuves et limites, sans historique de conversation.'
---

# prepare-handoff

Entrées : version livrée, état courant, README/opérations, critères et dettes. Lire docs/agents/skill-contract.md et la procédure de reprise du projet.

## Travail et sortie

Repérer ce qui permet d’installer, lancer, modifier et vérifier un petit changement avec les seuls fichiers. Rassembler version, architecture, données/migrations, parcours, procédures, limites, simulations et points encore non testés. Un contrôle technique du Builder connaissant le projet ne remplace pas l’essai d’une personne extérieure.

Préparer un exercice concret, résultats attendus, commandes et format de retour ; recueillir les obstacles réellement observés puis corriger la documentation utile. Livrer docs/handoff.md ou dossier équivalent avec dettes, décisions et prochaine action, en distinguant prototype/MVP/pilote. Aucun PASS humain, compatibilité globale ou acceptation finale déduit d’un test automatisé. Publication/licences restent des décisions distinctes selon AGENTS.

## Design system automatisé — DS-AUTO-01

Appliquer la [politique courante](../../docs/design-system/policy.md) et le [contrat des sources](../../src/design-system/authority/README.md). Trois catégories : primitives (valeurs brutes), tokens de composant et tokens locaux de page. Les deux derniers référencent directement les primitives ; une primitive consommée reste stable. Les différences d’apparence d’un composant sont des variantes explicites, pas des exceptions d’instance.

L’assistant maintient sources, contrats, exemples et descriptions dans le mandat ; les scripts génèrent CSS, inventaires et stories. Après changement : `npm run design-system:sync`, `npm run design-system:check` et les contrôles adaptés. Ne pas éditer les dérivés. Réutiliser le registre et les composants avant création ; signaler toute couverture manquante. Storybook est exclusivement documentaire, sans writer ni UI Lab. Aucun compte IA requis pour la génération. Préserver valeurs, unités, états, accessibilité et sources historiques lors d’une migration explicite.

## Portail documentaire

Maintenir les sources Markdown uniques et leur classement selon le [guide](../../docs/documentation.md). Après évolution, construire et contrôler le portail avec `docs:build` et `docs:check`. Les archives du socle restent identifiées, les fichiers privés exclus. Présenter les trois accès Application, Storybook et Documentation après vérification, sans exiger le parent ou Python hôte.
