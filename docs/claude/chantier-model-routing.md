# Recommander le modèle Claude Code et l’effort par chantier

**Politique qualitative — 19 novembre 2026.** [Décision 042](../decisions/042-assistant-choice-and-claude-routing.md). Appliquer d’abord le [choix de l’assistant](../../AGENTS.md#choisir-lassistant-au-premier-échange). Cette politique concerne le choix Claude Code ; les autres outils suivent leurs propres règles. Aucun compte Claude n’est requis pour exécuter l’application, Storybook ou le portail documentaire.

## Références et disponibilité

Lecture documentaire du 19 novembre 2026 : [configuration des modèles](https://code.claude.com/docs/en/model-config), [niveaux disponibles](https://code.claude.com/docs/en/model-config#adjust-effort-level) et [réglages manuels](https://code.claude.com/docs/en/model-config#set-the-effort-level). Sonnet 5.5 (`claude-sonnet-5-5`) et Opus 5.5 (`claude-opus-5-5`) sont documentés avec `low`, `medium`, `high`, `xhigh`, `max`. Les alias peuvent résoudre vers des versions différentes selon le fournisseur. La présence réelle dans le sélecteur du destinataire n’est pas vérifiée ici. Les niveaux ne mesurent pas une quantité identique de réflexion entre modèles.

Les seuils ci-dessous sont une décision du kit, pas une équivalence mesurée avec Codex ni une garantie de qualité, coût ou durée. Cette révision ne fournit aucun benchmark local ni essai natif Claude Code. Recontrôler la documentation et les options accessibles si un modèle ou niveau manque ; signaler l’écart et proposer une adaptation à valider plutôt qu’un remplacement silencieux.

## Analyse du travail

Inspecter en lecture seule les chemins utiles, puis distinguer faits, complexités constatées et inconnues sur cinq dimensions :

1. Clarté et cohérence du résultat demandé avec brief et spécifications.
2. Localisation, chemins d’exécution, producteurs et consommateurs concernés.
3. Frontières de sécurité, données, migrations et environnement effectivement modifiées.
4. Contrats dépendants et preuves nécessaires, y compris scénarios négatifs et reprise.
5. Contradictions et inconnues restantes.

Le nombre de fichiers ou un mot comme « sécurité » dans un texte ne justifie pas une hausse. Une information produit, un accès ou un outil absent demande un arbitrage ou un diagnostic, pas davantage de réflexion par défaut. Les [autorités](../../AGENTS.md#autorités-et-périmètre) et les conditions d’arrêt restent applicables.

## Grille de décision du kit

Privilégier Sonnet 5.5 et augmenter son effort selon les difficultés constatées. Aucune séquence du parcours ne déclenche automatiquement une hausse.

| Configuration recommandée | Conditions |
| --- | --- |
| **Claude Sonnet 5.5 · Faible** (`low`) | Cadrage simple ou explication bornée, résultat clair, aucune inconnue matérielle ; réservé à l’analyse simple, jamais au développement courant. |
| **Claude Sonnet 5.5 · Moyenne** (`medium`) | Plancher du développement courant ; périmètre connu, localisé, réversible, contrats et contrôles identifiables. |
| **Claude Sonnet 5.5 · Élevée** (`high`) | Plancher lorsqu’une surface sensible ci-dessous est effectivement modifiée ou qu’une preuve de sécurité s’applique ; nommer les garanties et preuves concernées. |
| **Claude Sonnet 5.5 · Très élevée** (`xhigh`) | Difficultés concrètes d’analyse conjointe des dépendances, cas négatifs, migrations, preuves ou retour arrière. La seule présence d’une surface sensible ne suffit pas. |
| **Claude Opus 5.5 · Élevée ou Très élevée** (`high` ou `xhigh`) | Incertitude d’architecture persistante ou limite constatée de Sonnet ; justifier pourquoi davantage d’effort sur Sonnet ne couvrirait pas raisonnablement le besoin et le gain attendu d’Opus. |
| **Max** (`max`), sur le modèle explicitement nommé | Exception pour une difficulté précise que très élevée ne permettrait pas raisonnablement de traiter ; définir la preuve attendue avant de recommander. Aucun essai de Max imposé avant un passage à Opus déjà justifié. |

Surfaces imposant au moins élevée lorsqu’elles sont réellement touchées : authentification, autorisation, isolation, sessions ou permissions ; migration ou transformation de données ; RAG, provenance ou fournisseur IA ; proxy, conteneurs, runtime, CI ou contrat d’environnement ; plusieurs contrats dépendants ; obligation de preuve de sécurité. Leur mention dans la documentation ne signifie pas qu’elles sont présentes ou modifiées dans le projet.

Exemples : une couleur locale vérifiée peut relever de moyenne ; une transformation de données exige au moins élevée ; une architecture incertaine peut justifier Opus après inspection. L’effort ne remplace aucune revue ni validation humaine.

## Recommandation, validation et reprise

Suivre le [traitement commun](../../AGENTS.md#traitement-des-demandes-et-validation-de-lexécution) et l’[affichage commun](../../AGENTS.md#affichage-et-reprise) :

- Première recommandation connue pour cet assistant ou changement du couple modèle/niveau : présenter le couple et son motif, puis attendre validation avant l’exécution concernée, même mineure.
- Couple inchangé : omettre la recommandation. Une nouvelle modification non mineure attend néanmoins la validation de sa proposition.
- Modification mineure répondant à tous les critères, choix d’assistant déjà recueilli et couple inchangé : exécuter directement, vérifier et confirmer brièvement.
- Information seule, après le choix d’assistant : répondre directement sans validation ; recommander seulement si une suite concrète est préparée.
- Précision dans un périmètre validé : poursuivre sans accord répété tant que périmètre, conséquences et configuration restent stables.

Format : **Pour la suite : Claude Sonnet 5.5 · Moyenne — modification visuelle localisée.** Une indication utile par proposition, sans répétition sous chaque question. Avant validation, conserver l’analyse dans la conversation sans écrire de fiche. Après autorisation d’écriture, conserver dans le suivi utile périmètre validé, assistant d’origine, dernier couple recommandé, faits justifiant le choix et inconnues. Réutiliser cette analyse si rien de matériel ne change. Un historique Codex ne vaut pas historique Claude ; une nouvelle conversation redemande le choix de l’assistant avant la reprise du suivi.

## Choisir manuellement dans Claude Code

L’utilisateur ouvre `/model` pour choisir le modèle, puis `/effort` pour le niveau. Dans les sélecteurs compatibles, `s` limite le choix à la session. Envoyer ensuite un message de validation ou de reprise pour le travail concerné. Ne modifier automatiquement aucun réglage utilisateur ou projet ; ne pas affirmer que le sélecteur a changé sur la seule base d’une réponse de validation. Si le choix est indisponible ou limité par l’organisation, signaler la limite et proposer une configuration accessible à valider.

La lecture documentaire ne prouve ni sélection effective ni comportement natif. Aucun mode supplémentaire, fournisseur ou sous-agent n’est activé par cette politique. Les instructions prioritaires et permissions du client restent applicables.

## Questions et commentaires utilisateur

Appliquer le [protocole commun](../agents/user-decisions.md) pour les décisions utiles et leur instruction complémentaire facultative. Le choix initial propose Codex (OpenAI) / Claude Code (Anthropic), sans champ complémentaire demandé. Une option de mode ou un commentaire ne sélectionne pas le modèle dans le client et ne vaut pas accord d’exécution sans expression explicite. Conserver les règles d’affichage du couple déjà définies ; ce protocole ne déclenche aucune recommandation répétée.
