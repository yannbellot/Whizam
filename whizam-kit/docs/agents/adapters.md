# Adaptations internes au kit

Les sources `skills/<name>/SKILL.md` déclarées dans le [catalogue](../../skills/catalog.json) et les quatre rôles `agents/*.md` sont communs. Les liens relatifs versionnés exposent les mêmes fichiers dans `.agents/skills/` et `.claude/skills/`. Leurs cibles restent internes après extraction, renommage et déplacement. Un clone/export doit préserver les liens ; s’ils deviennent du texte sur une autre plateforme, la découverte reste non vérifiée. Ne pas écraser une configuration existante.

Après npm ci, depuis la racine du kit : `npm run validate:agent-kit`. Ce contrôle structurel ne prouve ni découverte native ni comportement d’un assistant. Lire AGENTS.md, le [contrat commun](skill-contract.md) et le rôle utile. Ces fichiers sont livrés dans le kit ; aucun réglage global requis. Les permissions natives des outils restent applicables.

| Assistant cible       | Entrée livrée / exposition                              | Essai natif à consigner selon la version disponible                                                                           |
| --------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Codex                 | AGENTS.md ; .agents/skills                              | Inventaire natif avec provenance puis `$analyze-brief` ; rechargement si nécessaire.                                          |
| Claude Code           | CLAUDE.md ; .claude/skills                              | Inventaire des skills puis invocation de analyze-brief selon la CLI ; contrôler la provenance en cas de nom global identique. |
| Gemini CLI            | GEMINI.md ; .agents/skills                              | Liste/rechargement natifs et invocation, avec consentement d’activation conservé.                                             |
| Mistral Vibe Code CLI | Instruction initiale de lire AGENTS.md ; .agents/skills | Dans le projet approuvé, charger analyze-brief puis le rôle utile selon la version ; ne pas confondre Vibe Code et Vibe Work. |

Pour Mistral, l’entrée documentée est la lecture explicite d’AGENTS.md ; aucun fichier de configuration fournisseur supplémentaire n’est prétendu installé. Pour chaque outil, charger `agents/builder.md`, puis le reviewer requis. Sans délégation disponible et autorisée : mode séquentiel, même agent, non indépendant. Aucune clé, installation, inférence, sous-agent ou permission globale ajoutée par cette adaptation.

Le [traitement des demandes](../../AGENTS.md#traitement-des-demandes-et-validation-de-lexécution) est commun aux quatre assistants : réponse informative directe, proposition avant modification non mineure, exception mineure et reprise du périmètre validé. Codex et Claude Code appliquent leurs politiques respectives de modèle/niveau ; Gemini, Mistral et Autre conservent les règles communes sans correspondance inventée. Cette instruction ne prouve pas son respect natif par chaque fournisseur ; leurs permissions et instructions prioritaires restent applicables.

## Politiques par point d’entrée

Appliquer le [cadrage initial](project-intake.md) : questions conditionnelles, second niveau en conversation et reprise depuis le brief/suivi. Ne pas demander quel assistant est utilisé ; suivre sa politique par point d’entrée. Recueillir les langues documentaires en Q10 seulement si elles manquent, selon [Langues du projet](languages.md).

## Choix natifs et instructions complémentaires

Pour les décisions utiles après l’accueil, utiliser l’outil exposé et autorisé par le client : demande utilisateur native dans Codex, AskUserQuestion dans Claude Code si disponible. Appliquer le [protocole commun](user-decisions.md) : instruction complémentaire facultative via notes, réponse libre ou texte, sans garantir un champ sous les boutons. Le kit ne change aucun réglage de timeout ; absence de réponse ou retour automatique ne vaut pas accord. Pour Gemini/Mistral et les outils sans capacité vérifiée, repli textuel sans prétendre disposer d’un sélecteur natif. Les revues ne sont pas remplacées par les E2E.

## Première demande dans un kit extrait

Pour démarrer un projet, « Initialise un nouveau projet Atlas » est routé par [AGENTS.md](../../AGENTS.md#démarrer-un-nouveau-projet) vers [initialize-project](../../skills/initialize-project/SKILL.md). Le skill, sa référence d’environnement et le [parcours autonome](../product/project-start.md) voyagent avec la source ; les deux expositions relatives restent inchangées. Le skill prépare la séquence technique ; le Builder transmet le cadrage et la réalisation aux procédures existantes. Les accès applicatif/Storybook sont présentés à la première revue, selon ce parcours ; aucun prompt à installer globalement. Si le skill n’est pas découvert nativement, l’assistant peut lire ces fichiers explicitement après chargement d’AGENTS, sans assimiler cela à une découverte native réussie. Pour Mistral, conserver l’entrée explicite de lecture d’AGENTS décrite ci-dessus. Ce nouveau parcours et ses limites sont distincts du scénario historique ci-dessous.

## Scénario commun

Dans un kit extrait jetable, relever version/OS/SHA de la source et lister les skills du catalogue avec leur provenance. Demander : « Analyse ce brief fictif avec analyze-brief : Je veux un outil pour mes projets. N’implémente rien. » Attendre intention, ambiguïtés matérielles et hypothèse minimale, sans extension implicite. Charger les quatre rôles selon une mission explicite et conserver leurs rapports, mode, observations et limites. Une installation ou une liste réussie ne prouve pas le comportement du modèle.

Les essais d’inférence supplémentaires nécessitent des accès et un périmètre autorisés. Sans outil/accès, consigner non vérifié ; ne pas activer un fournisseur ou modifier la configuration de l’hôte pour transformer une absence d’essai en succès. Voir la [matrice réelle](../compatibility.md).

## Références de conventions

Conventions documentées le 21 octobre 2026, conservées lors de l’intégration ; recontrôler les sources officielles à toute qualification native ou mise à jour : [Codex skills](https://learn.chatgpt.com/docs/build-skills), [Claude skills](https://code.claude.com/docs/en/skills), [Gemini skills](https://geminicli.com/docs/cli/using-agent-skills/), [Vibe skills](https://docs.mistral.ai/vibe/code/cli/skills), [Vibe configuration](https://docs.mistral.ai/vibe/code/cli/configuration). Le déplacement des fichiers ne vaut pas nouvelle vérification de ces conventions.

## Langue documentaire

Appliquer le [cadrage initial](project-intake.md) : questions conditionnelles, second niveau en conversation et reprise depuis le brief/suivi. Ne pas demander quel assistant est utilisé ; suivre sa politique par point d’entrée. Recueillir les langues documentaires en Q10 seulement si elles manquent, selon [Langues du projet](languages.md).