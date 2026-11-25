# Référence des rôles et skills

Lire d’abord le [fonctionnement des assistants](guide.md). Les chemins ci-dessous désignent les sources locales du kit ; leur lecture complète n’est pas obligatoire à chaque demande. Modifier les sources canoniques et préserver leurs adaptations internes.

## Rôles

| Rôle | Responsabilité | Source |
| --- | --- | --- |
| builder | Réaliser les changements autorisés | `agents/builder.md` |
| design-reviewer | Examiner fidélité visuelle et expérience | `agents/design-reviewer.md` |
| technical-reviewer | Examiner contrats, tests et régressions | `agents/technical-reviewer.md` |
| security-reviewer | Examiner accès, secrets et entrées | `agents/security-reviewer.md` |

## Skills

| Skill | Usage | Source locale |
| --- | --- | --- |
| `publish-github-project` | Préparer, publier et mettre à jour les sources du projet sur GitHub, après commit ou à la demande ; reprendre, changer de mode ou suspendre les envois. | `skills/publish-github-project/SKILL.md` |
| `initialize-project` | Préparer ou reprendre l’initialisation technique d’un projet depuis le starter : environnement, suivi et contrôles, puis relais vers le cadrage. Ne pas utiliser pour une fonctionnalité ou correction courante. | `skills/initialize-project/SKILL.md` |
| `analyze-brief` | Clarifier un brief nouveau ou incomplet en distinguant intention, contraintes, ambiguïtés et hypothèses ; ne pas implémenter pendant cette analyse. | `skills/analyze-brief/SKILL.md` |
| `brief-to-specs` | Formaliser des comportements et critères d’acceptation à partir d’un brief cadré, avant de construire un parcours ou changer ses règles. | `skills/brief-to-specs/SKILL.md` |
| `plan-feature` | Préparer une tranche implémentable avec dépendances, fichiers, contrôles et critères ; utiliser un mode court pour un petit changement ou un prototype borné. | `skills/plan-feature/SKILL.md` |
| `design-interactions` | Définir les parcours et transitions UI d’une fonctionnalité, dont validation, chargement, annulation, erreurs et récupération ; sans inventer de référence visuelle. | `skills/design-interactions/SKILL.md` |
| `implement-feature` | Réaliser une tranche explicitement autorisée en code, tests, stories et documents, selon sa préparation ; distinguer prototype et fonctionnement complet. | `skills/implement-feature/SKILL.md` |
| `test-user-flow` | Vérifier un parcours dans l’application réelle et ses effets, avec données isolées et preuves de persistance lorsque pertinentes ; ne pas remplacer cela par une story. | `skills/test-user-flow/SKILL.md` |
| `update-project-docs` | Réconcilier les documents directement affectés par un changement vérifié, en gardant une source par règle et les preuves longues hors suivi courant. | `skills/update-project-docs/SKILL.md` |
| `review-design` | Examiner la fidélité aux références et la qualité UX/UI d’un parcours ou composant avec deux lectures distinctes, sans valider le design au nom du designer. | `skills/review-design/SKILL.md` |
| `technical-review` | Revoir une version ou un diff pour vérifier contrats, chemins d’exécution, tests et régressions, avec findings reproductibles et retest après correction. | `skills/technical-review/SKILL.md` |
| `security-review` | Produire une revue de sécurité proportionnée d’une version ou surface, avec preuves d’entrées/accès/données, dépendances et limites ; sans certification ni test sur cible réelle. | `skills/security-review/SKILL.md` |
| `propose-architecture` | Vérifier l’adéquation du starter et proposer une adaptation d’architecture justifiée par un besoin concret ; sans rouvrir systématiquement la stack. | `skills/propose-architecture/SKILL.md` |
| `analyze-design-references` | Analyser des références visuelles réellement fournies (captures, croquis, Figma ou intentions décrites) en séparant observation, interprétation et question. | `skills/analyze-design-references/SKILL.md` |
| `normalize-design-system` | Structurer primitives, tokens de composant, tokens locaux et usages à partir des autorités existantes, en préservant la direction visuelle et une source par décision. | `skills/normalize-design-system/SKILL.md` |
| `map-figma-to-components` | Relier des éléments Figma accessibles aux composants et états du projet ; activer seulement lorsqu’une référence Figma est fournie et utilisable. | `skills/map-figma-to-components/SKILL.md` |
| `data-permissions-migrations` | Définir ou faire évoluer schéma, validations, propriété et permissions des données, avec migrations PostgreSQL/Drizzle rejouables et tests isolés. | `skills/data-permissions-migrations/SKILL.md` |
| `prepare-release` | Qualifier une version locale selon le niveau de livraison annoncé et rassembler les preuves, réserves et décisions finales ; sans publier implicitement. | `skills/prepare-release/SKILL.md` |
| `deploy-docker-compose` | Préparer et vérifier une exécution Docker Compose sur une cible identifiée et autorisée, avec données, configuration, vérifications et retour arrière explicites. | `skills/deploy-docker-compose/SKILL.md` |
| `diagnose-incident` | Relier un symptôme ou échec à des observations, hypothèses testées et une cause vérifiée, puis corriger dans le périmètre et retester. | `skills/diagnose-incident/SKILL.md` |
| `backup-and-rollback` | Préparer et vérifier sauvegarde, restauration isolée et retour de version en contrôlant la compatibilité du code et du schéma ; sans remise à zéro implicite. | `skills/backup-and-rollback/SKILL.md` |
| `prepare-handoff` | Préparer la reprise d’une version par un tiers avec le dépôt, ses prérequis, décisions, preuves et limites, sans historique de conversation. | `skills/prepare-handoff/SKILL.md` |

## Vérifier et reprendre

Exécuter `npm run validate:agent-kit` après modification de la bibliothèque. Reprendre depuis le brief, la roadmap et l’état courant. La [compatibilité](../compatibility.md) distingue validation structurelle et essais natifs des assistants.
