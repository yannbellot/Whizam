---
name: review-design
description: 'Examiner la fidélité aux références et la qualité UX/UI d’un parcours ou composant avec deux lectures distinctes, sans valider le design au nom du designer.'
---

# review-design

Entrées : cible canonique, référence réellement accessible, critères, version et formats. Lire agents/design-reviewer.md et docs/agents/skill-contract.md dans le kit ; résoudre les références produit et rapports dans le projet ciblé.

## Décisions et vérifications de parcours

Appliquer le [protocole commun](../../docs/agents/user-decisions.md) si une décision utilisateur est nécessaire. Pour les critères observables concernés par cette revue, reprendre le mode et la couverture convenus avec le Builder ; proposer le choix Manuel / Automatisé — E2E / Combiné seulement s’il manque ou change matériellement. Les E2E ne remplacent pas cette revue ni ses contrôles obligatoires. Distinguer résultats automatisés, retours manuels et acceptation ; ne pas faire valider une recette manuelle non exécutée. Regrouper les campagnes communes plutôt que répéter le choix par rôle.

## Travail et sortie

Comparer d’abord le rendu à sa référence : défaut démontré, adaptation technique, décision validée ou indéterminé. Puis examiner l’expérience : hiérarchie/actions, libellés/états, récupération, clavier/focus, contrastes et comportement mobile/desktop. Une capture ne démontre pas une interaction ; un score automatique ne prouve pas une conformité exhaustive.

Produire le rapport commun avec éléments localisés, preuve disponible et impact, en séparant réserve et proposition de design. Tests/rapport seulement. Ne pas inventer de référence absente ; signaler la lecture impossible et poursuivre celle qui reste possible. Après correction du Builder, identifier la version retestée et les seules vérifications nécessaires. L’acceptation visuelle et l’indépendance ne sont jamais implicites.

## Design system automatisé — DS-AUTO-01

Appliquer la [politique courante](../../docs/design-system/policy.md) et le [contrat des sources](../../src/design-system/authority/README.md). Trois catégories : primitives (valeurs brutes), tokens de composant et tokens locaux de page. Les deux derniers référencent directement les primitives ; une primitive consommée reste stable. Les différences d’apparence d’un composant sont des variantes explicites, pas des exceptions d’instance.

L’assistant maintient sources, contrats, exemples et descriptions dans le mandat ; les scripts génèrent CSS, inventaires et stories. Après changement : `npm run design-system:sync`, `npm run design-system:check` et les contrôles adaptés. Ne pas éditer les dérivés. Réutiliser le registre et les composants avant création ; signaler toute couverture manquante. Storybook est exclusivement documentaire, sans writer ni UI Lab. Aucun compte IA requis pour la génération. Préserver valeurs, unités, états, accessibilité et sources historiques lors d’une migration explicite.
