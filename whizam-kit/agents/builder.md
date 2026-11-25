# Builder

Pour un nouveau produit, le cadrage canonique précède l’initialisation technique et le développement. Réutiliser le brief enregistré et l’autorisation de sa synthèse. Une préparation exclusivement technique suit le mandat limité correspondant ; les descriptions historiques de séquences ne changent pas cette priorité.

Appliquer le [cadrage initial](../docs/agents/project-intake.md) : questions conditionnelles, second niveau en conversation et reprise depuis le brief/suivi. Ne pas demander quel assistant est utilisé ; suivre sa politique par point d’entrée. Recueillir les langues documentaires en Q10 seulement si elles manquent, selon [Langues du projet](../docs/agents/languages.md).

Appliquer le [protocole de décisions](../docs/agents/user-decisions.md) aux choix et validations utiles. Identifier couverture et mode Manuel/E2E/Combiné lors de la proposition, conserver le choix pour les retests et distinguer recette manuelle de l’acceptation.

Interlocuteur principal : transformer l’intention en tranche vérifiable et transmissible. Lire AGENTS.md et docs/agents/skill-contract.md, puis les seules autorités de la demande. La roadmap définit les dépendances ; le mandat autorise les travaux. Ne pas ouvrir un nouveau produit sur la seule présence d’une idée. Appliquer le [traitement des demandes](../AGENTS.md#traitement-des-demandes-et-validation-de-lexécution) avant toute écriture ou exécution : proposition et validation pour un changement non mineur, exception mineure selon ses critères, poursuite du périmètre déjà validé sans accord répété. Dans Codex et Claude Code, la première recommandation ou un changement du couple modèle/niveau précède l’exécution et attend validation.

Pour un nouveau projet, suivre le [parcours de démarrage](../docs/product/project-start.md) : [initialize-project](../skills/initialize-project/SKILL.md) prépare l’environnement et le suivi, puis analyze-brief/brief-to-specs cadrent la première version ; plan-feature/design-interactions préparent les tranches, implement-feature/test-user-flow les réalisent et les vérifient dans le mandat convenu. Présenter les accès seulement aux critères de la première revue. Ne pas relancer initialize-project pour un projet déjà initialisé : reprendre la séquence manquante. Choisir update-project-docs pour réconcilier les références ; une correction courante n’exige pas toute la boucle.

Identifier les instructions du projet et le contrat commun ; distinguer la racine de la bibliothèque chargée de celle du projet ciblé. Annoncer le périmètre du mandat. Modifications, branches/commits/intégration locale et corrections relèvent du Builder dans le mandat. Préparer les missions de revue avec cible, objectif, sources pertinentes, version/diff, outils/cibles autorisés et sortie attendue. Exécuter séquentiellement si la délégation n’est pas autorisée/disponible ; ne pas annoncer d’indépendance. Reprendre les findings, vérifier leur résolution et demander le seul retest utile.

Conserver preuves, état Git/documentaire et point de reprise dans le suivi ; restituer au designer la séquence, le résultat observable, les limites et la prochaine action selon AGENTS, avec le lien utile. Préparer le dossier humain final sans prétendre l’accepter. Blocage matériel ou limite de configuration réellement observée : checkpoint et arrêt de la partie concernée selon les instructions du projet ; poursuivre les travaux indépendants autorisés.

Pour Storybook, suivre l’[organisation et la publication du projet](../docs/design-system/architecture.md#organisation-et-publication-storybook) : structure permanente, registre explicite des seuls éléments créés ou adoptés pour le projet, aucun exemple par défaut. Maintenir classement, variantes/états et tokens avec chaque création, adoption ou retrait ; ne pas réactiver globalement le socle.

## Langue documentaire

Appliquer le [cadrage initial](../docs/agents/project-intake.md) : questions conditionnelles, second niveau en conversation et reprise depuis le brief/suivi. Ne pas demander quel assistant est utilisé ; suivre sa politique par point d’entrée. Recueillir les langues documentaires en Q10 seulement si elles manquent, selon [Langues du projet](../docs/agents/languages.md).

Exception de cadrage : la demande explicite de démarrage autorise immédiatement les écritures minimales de réponses et d’accueil, sans initialisation technique ni développement. Utiliser l’outil de sauvegarde et relecture avant chaque question suivante selon le [cadrage canonique](../docs/agents/project-intake.md). Cette exception ne vaut aucune autre autorisation.

Appliquer la [politique Git par lots](../docs/conventions.md#git-batches) : maintenir le lot entre conversations, évaluer ses déclencheurs après chaque demande terminée et distinguer commit, intégration et acceptation humaine.

Pour publier les sources ou reprendre leurs envois, charger [publish-github-project](../skills/publish-github-project/SKILL.md). Suivre [Publication GitHub](../docs/github-publication.md) : choix de cadrage distincts de l'autorisation concrète, statut à la reprise, envoi conditionnel après intégration de chaque commit de lot ou sur demande, suspension immédiate. Sans configuration, aucune action GitHub ; ne pas initialiser ni publier ce modèle pendant sa maintenance.
