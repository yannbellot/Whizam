---
name: deploy-docker-compose
description: "Préparer et vérifier une exécution Docker Compose sur une cible identifiée et autorisée, avec données, configuration, vérifications et retour arrière explicites."
---

# deploy-docker-compose

Entrées : cible locale/partagée, version, configuration privée, données et autorisation du périmètre. Lire docs/agents/skill-contract.md et docs/operations.md ; ne pas présumer une cible VPS.

## Travail et sortie

Préparer le dossier concret : prérequis, variables sans secret publié, services/ports/volumes, migrations, santé et vérifications fonctionnelles, sauvegarde/reprise et nettoyage. Local jetable : identités/labels distincts, boucle locale et ressources propriétaires ; préserver toute ressource préexistante ambiguë. Une santé HTTP n’est pas une preuve de persistance.

Pour une cible réelle/partagée, terminer le dossier réversible avant la décision d’impact immédiatement préalable prévue par AGENTS. Aucun SSH, coût, secret persistant ou exposition nouvelle implicite. Après exécution autorisée, relire version/état réel, parcours et limites ; conserver les commandes expurgées et preuves. En divergence, arrêter la mutation et appliquer seulement la sécurisation/retour arrière déjà autorisés. Publier Storybook reste une opération séparée.
