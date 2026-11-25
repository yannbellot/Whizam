# Comprendre le fonctionnement des assistants

Vous définissez l’intention et examinez les résultats. L’assistant prépare, réalise et vérifie le périmètre autorisé. Pour démarrer, suivre le [guide d’utilisation](../guide-whizam/index.md). Cette page explique les responsabilités ; les instructions canoniques restent dans les fichiers locaux du kit.

## Rôles et procédures

Le Builder réalise le travail. Les reviewers design, technique/QA et sécurité examinent la version et ses preuves selon leur spécialité. Une revue exercée successivement par le même agent est déclarée non indépendante. Un skill décrit une procédure ciblée ; toute la bibliothèque n’est pas nécessaire à chaque demande. La [référence des rôles et skills](reference.md) permet de choisir quoi modifier.

## Cadrage, reprise et décisions

Pour un nouveau projet, l’assistant recueille les informations manquantes, conserve les réponses et présente une synthèse à autoriser avant développement. Les appareils, langues de l’application et langues documentaires sont des choix distincts. Une demande limitée à l’installation conserve son périmètre technique. Dans une nouvelle conversation, l’assistant lit le brief et le suivi pour reprendre sans réinitialiser le projet.

Une question informative reçoit une réponse directe. Une nouvelle modification non mineure fait l’objet d’une proposition concrète à valider ; un accord acquis couvre les corrections et contrôles nécessaires dans ce périmètre. Les contrôles techniques et votre acceptation du résultat restent distincts. Les fichiers `AGENTS.md`, `docs/agents/project-intake.md` et `docs/agents/user-decisions.md` définissent ces règles pour les agents.

## Adaptations par assistant

Codex entre par `AGENTS.md`, Claude Code par `CLAUDE.md`, Gemini CLI par `GEMINI.md`. Mistral utilise la lecture explicite d’`AGENTS.md`. Le contexte du client détermine la politique applicable ; aucun questionnaire d’assistant n’est requis. Les instructions et skills sont livrés localement, avec des liens relatifs internes. Leur présence ne démontre pas leur découverte native : voir la [compatibilité](../compatibility.md).

Les références avancées [Codex](../codex/chantier-model-routing.md) et [Claude](../claude/chantier-model-routing.md) décrivent les recommandations de modèle. Elles ne modifient pas le réglage du client. Gemini et Mistral utilisent les règles communes sans équivalence de modèles inventée.

## Configuration, langues et sources partagées

Utiliser la [configuration privée](private-configuration.md) pour les secrets, les [langues du projet](languages.md) pour les traductions et la [publication GitHub](../github-publication.md) pour conserver les sources. Ne jamais transmettre un jeton dans une conversation. L’envoi des sources sur GitHub et le déploiement sont deux opérations distinctes.

## Modifier une instruction

Exemple : pour préciser une responsabilité du reviewer design, demander une modification de `agents/design-reviewer.md`, puis vérifier sa cohérence avec `docs/agents/skill-contract.md` et le skill `review-design`. L’assistant conserve les obligations utiles, adapte la traduction et exécute `npm run validate:agent-kit`. Un nouveau comportement demande des scénarios adaptés ; un contrôle de fichiers ne prouve pas le comportement d’un modèle.

La publication humaine et les instructions actives ont des fonctions différentes. Une instruction peut rester interne sans devenir historique. La référence du portail explique où se trouvent les sources, sans en recopier toutes les obligations. Les anciens choix et preuves restent conservés dans les sources historiques, hors du parcours courant.
