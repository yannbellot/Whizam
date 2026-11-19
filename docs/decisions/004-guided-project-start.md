# 004 — Démarrage guidé et revue de la première version

**25 octobre 2026 — orientation approuvée par le porteur.** La qualification de l’implémentation et l’acceptation humaine restent distinctes.

> Révision du 19 novembre 2026 : la [décision 041](041-request-validation.md) impose une proposition validée avant l’exécution initiale. Le [parcours courant](../product/project-start.md) applique cette règle ; les dispositions initiales ci-dessous restent historiques.

## Contexte

Le parcours d’initialisation recueillait le type d’application mais ne réalisait que l’environnement et la démonstration. Sa restitution donnait une impression d’application livrée, avec des informations techniques imposées par plusieurs sources. La clarification de communication précédente ne suffisait pas à résoudre ce contrat de parcours.

## Décision

Le [parcours de démarrage](../product/project-start.md) distingue initialisation du projet, cadrage de la première version, conception/développement et revue de la première version. initialize-project conserve sa responsabilité technique selon la décision 002 ; le Builder transmet la suite aux procédures existantes, dans le périmètre suffisamment défini et autorisé. Aucune préparation seule ou initialisation technique seule ne devient une autorisation de réalisation.

Présenter ensemble les liens Application et Storybook — composants du projet à la première revue, après vérification du résultat convenu. Les serveurs peuvent servir auparavant aux contrôles internes. Conserver les preuves et statuts techniques dans le suivi ; les messages au designer rendent le résultat, les limites et la suite compréhensibles sans liste technique imposée.

Conserver `/projects` comme référence de fabrication du starter. Dans un projet dérivé, retirer les démonstrations de la navigation et des accès livrés, ou les remplacer selon les spécifications propres au projet, avec les tests/stories/documents concernés. Aucune suppression implicite de données. L’exemple du kit et les composants génériques restent disponibles pour fabriquer et tester.

## Conséquences

Pas de nouveau skill, orchestrateur, mécanisme d’accès, stack, service externe ou permission. Les instructions communes et les procédures concernées renvoient aux sources canoniques du parcours et de la communication. Les projets existants reprennent la séquence manquante sans réinitialisation. Les preuves historiques restent attachées à leur version. Une instruction écrite ne prouve ni comportement natif ni compréhension humaine.
