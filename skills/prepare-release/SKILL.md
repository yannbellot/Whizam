---
name: prepare-release
description: "Qualifier une version locale selon le niveau de livraison annoncé et rassembler les preuves, réserves et décisions finales ; sans publier implicitement."
---

# prepare-release

Entrées : version candidate, périmètre livré, critères et rapports applicables. Lire docs/agents/skill-contract.md et le cahier des charges du projet.

## Travail et sortie

Distinguer prototype démontrable, MVP transmissible et pilote exposé. Relier chaque critère à une preuve de la bonne version ; contrôler installation, données, parcours, builds, revues et documentation, y compris vérifications humaines non exécutées. Ne pas refaire une campagne hors changement sans raison, mais requalifier ce qui est invalidé.

Préparer dossier de version/tag proposé, matrice des résultats, limites et décisions utiles. Un contrôle obligatoire absent ou un défaut bloquant interdit l’annonce de livraison complète. Licences/confidentialité/attributions sont vérifiées avant diffusion ; une proposition de licence n’est pas une décision prise. Commit/intégration locale suivent AGENTS ; push, Actions, release, hébergement ou déploiement exigent leur autorisation distincte. Le dossier peut être préparé sans obtenir ces autorisations.
