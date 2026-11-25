---
name: publish-github-project
description: 'Préparer, publier et mettre à jour les sources du projet sur GitHub, après commit ou à la demande ; reprendre, changer de mode ou suspendre les envois.'
---

# publish-github-project

Entrées : racine du projet ciblé, intention GitHub, version et accord disponibles. Lire le [contrat commun](../../docs/agents/skill-contract.md), puis [Publication GitHub](../../docs/github-publication.md), autorité du parcours et des commandes. Ne pas confondre publication des sources et déploiement de l'application.

Diagnostiquer d'abord sans mutation distante : état Git, préférences du brief et `node scripts/github-project.mjs status`. Sans Git, préparer la sélection et l'initialisation selon les conventions ; ne pas transporter le `.git/` du mainteneur. Compléter seulement destination/visibilité/branche/mode inconnus. Une préférence de cadrage n'est pas l'accord sur la publication concrète.

Préparer `plan`, examiner historique, fichiers et effets distants connus ; présenter le récapitulatif avant l'accord manquant. Réutiliser une autorisation persistante sur la même cible. Ne pas inventer une validation depuis une présélection ou une réponse de préférence. Après accord, `authorize` enregistre le contrat local ; `create` reste conditionné à l'accord de création, sans premier push implicite.

Réutiliser la connexion disponible ; sinon proposer la connexion navigateur `gh`, puis le formulaire privé dédié seulement si nécessaire. Suivre l'autorité pour stockage/permissions ; ne pas lire le jeton ni inspecter la page après saisie réelle. Les capacités d'ouverture de Codex/Claude sont conditionnelles.

Après chaque commit de lot intégré, le Builder appelle `after-commit` seulement si une cible est configurée et son mode actif ; fournir le commit effectivement vérifié et les contrôles réussis. En mode à la demande, appeler `sync` seulement sur demande explicite. Aucun hook permanent. Destination/branche/compte/visibilité modifiés : nouvel accord concret. `suspend` arrête les envois sans supprimer de ressources.

Restituer dépôt/branche, version réellement confirmée ou commits restant à envoyer, limites et prochaine action. Réseau, droits ou divergence bloquants : garder le commit local, état à envoyer, aucun force push ni tentative répétée. Aucun faux succès depuis un reçu local ou une simulation. Conserver les preuves dans le projet propriétaire, sans secret ni boucle de commits de suivi.
