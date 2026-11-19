---
name: plan-feature
description: 'Préparer une tranche implémentable avec dépendances, fichiers, contrôles et critères ; utiliser un mode court pour un petit changement ou un prototype borné.'
---

# plan-feature

Entrées : spécification ou correction cadrée, état Git, contrôles disponibles. Lire le contrat docs/agents/skill-contract.md.

## Travail

Pour une première version, reprendre le périmètre suffisamment défini et autorisé du [parcours de démarrage](../../docs/product/project-start.md). Prévoir les critères de revue conjointe Application/Storybook, le retrait des démonstrations du parcours utilisateur dérivé et les contrôles du vrai résultat. Un projet déjà initialisé reprend ici sans relancer initialize-project.

Inspecter les points d’exécution et définir le plus petit changement cohérent : surfaces, exclusions, dépendances, données, revues requises et preuves. Choisir les commandes pertinentes du package et leurs cibles isolées. Ne pas rouvrir la stack par défaut ni déclencher toute la bibliothèque de skills. Un plan court suffit pour quelques fichiers sans contrat nouveau.

Pour les parcours modifiés, appliquer le [protocole de décisions](../../docs/agents/user-decisions.md#choisir-le-mode-de-vérification) : préparer couverture et recommandation, proposer Manuel / Automatisé — E2E / Combiné si pertinent puis recueillir l’accord d’exécution utile. Réutiliser mode et couverture du périmètre déjà validé. Avant accord, garder la proposition dans la conversation. Les contrôles techniques obligatoires restent requis quel que soit le mode.

Mode prototype : nommer l’incertitude à trancher, les simulations/raccourcis, la durée ou condition de fin et les fichiers jetables identifiables ; ne pas présenter ce résultat comme un parcours complet persistant.

## Sortie et contrôle

Fiche dans le docs/work-items de la cible, avec environnement, étapes, critères, hypothèses et prochaine action, ou mise à jour de la fiche existante. Une mission explicitement autorisée sur plusieurs projets répartit les livrables selon le contrat commun. Vérifier les prérequis techniques avant implémentation. Une commande explicite de préparation seule s’arrête au livrable documentaire ; un périmètre d’exécution déjà validé peut poursuivre après préparation selon AGENTS. Avant cet accord, garder la proposition dans la conversation, sans créer de fiche ni modifier le projet ; la demande initiale seule ne dispense pas de validation. Arrêter uniquement la partie dépendante d’un prérequis obligatoire invérifiable ou arbitrage matériel.
