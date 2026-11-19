---
name: technical-review
description: 'Revoir une version ou un diff pour vérifier contrats, chemins d’exécution, tests et régressions, avec findings reproductibles et retest après correction.'
---

# technical-review

Entrées : objectif/critères, version immuable ou diff, fichiers de support et environnement isolé. Lire agents/technical-reviewer.md et docs/agents/skill-contract.md.

## Décisions et vérifications de parcours

Appliquer le [protocole commun](../../docs/agents/user-decisions.md) si une décision utilisateur est nécessaire. Pour les critères observables concernés par cette revue, reprendre le mode et la couverture convenus avec le Builder ; proposer le choix Manuel / Automatisé — E2E / Combiné seulement s’il manque ou change matériellement. Les E2E ne remplacent pas cette revue ni ses contrôles obligatoires. Distinguer résultats automatisés, retours manuels et acceptation ; ne pas faire valider une recette manuelle non exécutée. Regrouper les campagnes communes plutôt que répéter le choix par rôle.

## Travail et sortie

Relier chaque changement au chemin runtime et à sa preuve : entrées, validation, logique, stockage/réponse et états UI concernés. Examiner limites/types/erreurs, compatibilité des migrations et documentation ; signaler les écarts hors périmètre. Prioriser les conséquences reproductibles plutôt que les préférences de style.

Rendre un rapport avec version, scénario, localisation, impact et retest. Lecture/tests/rapport ; aucune correction applicative implicite. Un contrôle indisponible reste non exécuté et bloque la qualification s’il est obligatoire ; préparer la prochaine action sans faux PASS. Après correction Builder, revoir le diff modifié et exécuter les contrôles affectés. Un même agent séquentiel ne devient pas indépendant.

## Design system automatisé — DS-AUTO-01

Appliquer la [politique courante](../../docs/design-system/policy.md) et le [contrat des sources](../../src/design-system/authority/README.md). Trois catégories : primitives (valeurs brutes), tokens de composant et tokens locaux de page. Les deux derniers référencent directement les primitives ; une primitive consommée reste stable. Les différences d’apparence d’un composant sont des variantes explicites, pas des exceptions d’instance.

L’assistant maintient sources, contrats, exemples et descriptions dans le mandat ; les scripts génèrent CSS, inventaires et stories. Après changement : `npm run design-system:sync`, `npm run design-system:check` et les contrôles adaptés. Ne pas éditer les dérivés. Réutiliser le registre et les composants avant création ; signaler toute couverture manquante. Storybook est exclusivement documentaire, sans writer ni UI Lab. Aucun compte IA requis pour la génération. Préserver valeurs, unités, états, accessibilité et sources historiques lors d’une migration explicite.
