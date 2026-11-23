# Questions à choix et décisions utilisateur

Autorité commune de présentation et de traitement des décisions, sous les [instructions](../../AGENTS.md). [Décision 043](../decisions/043-user-decision-protocol.md). Ce protocole utilise les outils du client ; il n’ajoute ni formulaire applicatif ni moteur d’exécution.

## Quand poser une question

Utiliser ce protocole pour une décision effectivement nécessaire : choix produit/visuel, mode de vérification, autorisation d’exécution, retour de recette, acceptation d’une version ou arbitrage bloquant. Une question ouverte de cadrage peut rester ouverte si des options seraient artificielles ; offrir les précisions libres adaptées. Ne pas créer de question pour une information seule, un compte rendu ou une petite correction déjà autorisée. Réutiliser les réponses et accords explicites ; ne pas reposer une décision sans changement matériel.

Pour chaque question, indiquer contexte, objet et périmètre ; présenter des options distinctes et compréhensibles. Préférer un choix unique. Réserver la sélection multiple à des décisions réellement cumulables, jamais aux états Oui/Non ou validé/non validé. Une recommandation de mode de vérification porte sur la couverture observée ; les recommandations modèle/niveau suivent les politiques existantes et ne sont répétées que si le couple change ou est inconnu.

## Présentation native et texte libre

Vérifier l’outil réellement disponible et ses règles dans le mode courant. Dans Codex, utiliser l’outil de demande utilisateur exposé par la session, tel que `request_user_input_async` ou `request_user_input` si autorisé. Dans Claude Code, utiliser `AskUserQuestion` si disponible. Ne pas changer de mode, de fournisseur, de permissions ou de configuration personnelle pour forcer un questionnaire.

Conserver la saisie libre ou les notes natives lorsque le client les propose. Leur absence ne justifie ni de remplacer un choix natif par du texte, ni de poser une question supplémentaire pour un commentaire facultatif. Si une précision indispensable manque après un choix, la recueillir dans un message normal ; sinon poursuivre sans réclamer de note. Le client décide de l’emplacement et de l’apparence des contrôles ; ne pas promettre un champ sous les boutons.

Ne pas ajouter « Autres demandes ou précisions — facultatif », d’exemple de note ou de fausse étiquette de champ dans le titre, les options, ou un paragraphe répété après chaque question. Utiliser la saisie libre native telle que le client la présente, sans tenter d’en déplacer ou d’en simuler le champ. Une précision fournie librement peut remplacer le choix si elle est explicite ; sinon demander uniquement l’arbitrage nécessaire. Cette règle vaut pour toutes les questions, y compris vérification, autorisation et acceptation.

### Appeler l’outil, sans simuler ses contrôles

Avant toute question à choix, vérifier les outils réellement exposés. Si un outil de demande utilisateur est disponible et autorisé pour la décision, **l’appeler** : écrire une liste dans la réponse ne satisfait pas cette règle. Dans Codex, privilégier `request_user_input_async` lorsqu’il est disponible ; ne pas appeler `request_user_input` si le mode courant l’interdit. Pour une validation de proposition de travail, utiliser une question native si les règles de cet outil l’autorisent ; ne pas la confondre avec une permission système ou d’outil, qui conserve son propre mécanisme.

Pour une validation, fournir par exemple le titre « Valides-tu la préparation d’Atlas et les vérifications décrites ?  » et les options « Oui, je valide » / « Non ». Les autres outils ont leur schéma propre ; ne pas leur transmettre ce JSON sans vérifier leur contrat.

Une question de cadrage est une décision en attente. Un appel asynchrone accepté signifie seulement que la question est envoyée : `accepted`, identifiant, présélection, fermeture ou expiration ne sont jamais une réponse. **Après l’appel asynchrone, garder le tour actif avec le mécanisme d’attente interruptible réellement exposé par le client. Ne pas terminer le tour, même par un message final vide, tant que la réponse manque.** Ne pas ajouter de conclusion, passer à une autre question, choisir une branche, générer une démonstration, initialiser le projet ou commencer un travail indépendant pendant cette attente.

Dans un client exposant `clock.sleep`, attendre par appels interruptibles d’au plus 60 secondes. Si l’attente est interrompue par une réponse explicite à la question, reprendre seulement la branche choisie. Si elle expire sans réponse, recommencer l’attente : sa durée n’est pas un délai de décision et ne déclenche ni hypothèse ni choix par défaut. Ne pas demander à nouveau la même question. Si un autre message arrive, le traiter sans inventer le choix manquant ; une annulation explicite arrête l’attente. Ne jamais remplacer cette attente par un `sleep` shell ou une boucle de calcul, qui ne reçoit pas les réponses du client.

Choisir le mécanisme AVANT d’envoyer la question : utiliser un questionnaire bloquant s’il est disponible et autorisé ; sinon un questionnaire asynchrone avec attente interruptible. Si cette combinaison n’est pas disponible ou si le contrat de l’outil réserve les questions aux décisions facultatives, poser la question en message final conversationnel avec repli textuel explicite et attendre le prochain message utilisateur. Ne pas envoyer un sélecteur asynchrone dont on sait qu’on doit clore le tour immédiatement. Aucun changement de mode, timeout, compte ou permissions du client pour forcer ce mécanisme. Le kit ne contrôle pas le cycle de vie graphique du sélecteur ; si celui-ci se ferme sans réponse, garder le choix indéterminé et proposer le repli conversationnel, jamais une branche supposée. Une interruption conserve la question en attente dans le suivi sans la marquer comme répondue.

Si aucun outil autorisé ne convient, annoncer explicitement « Choix en texte : réponds avec le libellé souhaité », puis afficher les options dans une liste numérotée. Ne pas utiliser les ronds `○`, cases à cocher ou faux champs de saisie dans ce repli, et ne pas le présenter comme interactif. Les illustrations ci-dessous servent uniquement à décrire les libellés et décisions ; elles ne sont jamais à recopier comme des boutons dans une réponse utilisateur.

Dans une validation, utiliser l’outil natif seulement si ses règles l’autorisent ; sinon poser la même question en texte. Une préférence n’est pas une autorisation d’exécuter. Les permissions natives du client restent distinctes.

Références documentaires : [outil Codex](https://github.com/openai/codex/blob/main/codex-rs/core/src/tools/handlers/request_user_input_spec.rs), [outil Claude Code](https://code.claude.com/docs/en/tools-reference#askuserquestion-tool-behavior). Références consultées le 19 novembre 2026 ; vérifier les capacités réellement exposées, sans déduire un essai natif de leur documentation.

## Cadrage initial

Suivre [le questionnaire canonique](project-intake.md). Ne pas demander l’assistant. Ne pas ajouter de mention répétitive des précisions aux intitulés. Chaque collecte complémentaire se fait dans la conversation sans second sélecteur. Les capacités du client, pas les exemples Markdown, déterminent l’interface.

## Choisir le mode de vérification

Avant réalisation, identifier les parcours affectés et les revues nécessaires. Proposer ce choix lorsque le changement touche navigation, formulaire, interaction, rendu conditionnel ou persistance. Exposer les scénarios et le mode recommandé selon les outils et preuves possibles. Regrouper les parcours/revues partageant une même campagne ; ne pas répéter une question par reviewer quand la couverture est la même.

| Mode | Exécution et preuve |
| --- | --- |
| **Manuel** | Préparer une recette courte, actions et résultats attendus. L’utilisateur l’exécute. La recette reste en attente jusqu’à son retour explicite ; un accès fourni ne démontre pas sa réussite. |
| **Automatisé — E2E** | Créer/adapter puis exécuter les scénarios utiles sur une version identifiée et des ressources isolées autorisées. Rapporter les résultats, preuves et limites ; script présent ne signifie pas test exécuté. |
| **Combiné** | E2E sur les comportements, recette humaine sur compréhension, rendu et confort d’usage. Rapporter séparément chaque résultat. |

Exemple de question, après description de la couverture :

> Comment souhaites-tu vérifier les parcours décrits ? Je recommande Combiné pour vérifier les comportements et examiner le rendu.
>
> ○ Manuel  
> ○ Automatisé — E2E  
> ○ Combiné
>

Le choix ne remplace pas les revues design, technique ou sécurité, ni leurs contrôles techniques obligatoires. Ne pas proposer cette question pour un changement purement documentaire ou une couleur réellement locale sans enjeu de parcours. Conserver l’exception mineure d’AGENTS ; un besoin matériel de décision sur la couverture nécessite une proposition préalable.

En cas de prérequis E2E absent, annoncer le manque et proposer une alternative pour décision, sans basculer silencieusement en manuel ni annoncer un succès. Le résultat obligatoire indisponible bloque la qualification correspondante.

## Validation de l’exécution

Décrire le résultat prévu, son périmètre, la couverture et le mode retenu. Le choix de mode ne vaut pas accord d’exécution ; demander une seule validation si elle manque :

> Je retiens Combiné pour les scénarios décrits. Valides-tu la préparation du projet, la réalisation de cette page et ces vérifications ?
>
> ○ Oui, je valide  
> ○ Non
>

L’objet de cette question est « Validation de l’exécution » ; ne pas l’intituler « Manuel », qui désigne un mode de vérification. Un accord explicite déjà formulé sur cette proposition, par exemple « Combiné, je valide l’exécution », suffit sans seconde question. L’accord couvre réalisation, vérifications, documentation et corrections nécessaires dans le périmètre annoncé, pas une publication ou l’acceptation du résultat.

## Retour de recette manuelle

Pour Manuel ou Combiné, fournir la version et les accès vérifiés, les actions et résultats attendus, puis demander :

> Après avoir suivi cette recette, quel est ton retour ?
>
> ○ Je valide la recette manuelle  
> ○ Recette manuelle non validée
>

Une validation rapporte l’observation de l’utilisateur, pas une observation navigateur faite par l’IA. Sans retour, noter en attente. En Combiné, une recette validée n’efface pas un E2E échoué ou non exécuté. Un refus sans commentaire suffit à ne pas valider ; demander uniquement le détail nécessaire au diagnostic. Le diagnostic borné existant s’applique sans seuil de tentatives ajouté.

En mode Automatisé — E2E, restituer les résultats convenus sans demander d’attester une recette manuelle non choisie. La revue humaine ou l’acceptation du jalon reste distincte quand nécessaire.

## Acceptation du résultat

Lorsque les critères et contrôles requis permettent de présenter une version pour acceptation :

> Les vérifications requises sont terminées. Acceptes-tu cette version sur le périmètre convenu ?
>
> ○ J’accepte cette version  
> ○ Des ajustements restent nécessaires
>

Regrouper recette et acceptation seulement si leur périmètre est identique, les autres vérifications requises sont réussies et la question nomme explicitement les deux, par exemple « Après la recette, acceptes-tu cette version sur le périmètre convenu ? ». Ses options doivent couvrir les deux décisions : « Je valide la recette et j’accepte cette version » / « Des ajustements restent nécessaires ». Une simple validation de recette ne vaut pas acceptation globale. Si des contrôles obligatoires manquent, expliquer les limites et recueillir les retours sans présenter la version comme qualifiée.

## Interpréter choix et instruction

| Réponse reçue | Action |
| --- | --- |
| Accord explicite, sans réserve | Poursuivre uniquement dans le périmètre présenté. |
| Accord et précision compatible | Intégrer la précision dans le mandat si elle reste limitée et réversible, puis poursuivre. |
| Accord soumis à une condition préalable ou changement matériel | Ajuster la proposition et obtenir la validation nécessaire avant l’exécution concernée ; ne pas ignorer la condition. |
| Refus ou recette non validée | Ne pas franchir l’étape ; utiliser le commentaire ou demander la seule précision nécessaire. |
| Choix contradictoire avec l’instruction | Demander clarification ; ne pas donner priorité automatique au bouton Oui. |
| Note libre seule avec décision explicite | Traiter la décision exprimée et ses limites ; aucune obligation de sélectionner à nouveau une option équivalente. |
| Note ambiguë, silence, fermeture, expiration ou simple présélection | Pas d’accord implicite. Attendre la décision utile ; un retour automatique du client ne crée pas d’autorisation. |

Conserver le mode et la couverture pour les corrections/retests de la tranche. Reposer le choix seulement en cas de changement matériel de périmètre, couverture, conséquences ou demande utilisateur. Après autorisation d’écriture, le suivi du projet conserve décision, portée, réserve éventuelle, assistant d’origine, mode, couverture, version et preuves utiles ; aucun fichier témoin supplémentaire pour ces décisions . La roadmap et le point de reprise restent ceux du projet concerné.

## Données confidentielles

Les questions natives et leurs notes ne sont pas un canal de collecte de secrets. Pour les mots de passe, jetons et clés, suivre le [parcours de configuration privée](private-configuration.md) : saisie locale hors conversation, ou fichier privé ouvert directement si nécessaire. Demander seulement la confirmation de l’enregistrement, sans valeur.

## Langue documentaire

Appliquer [Langues du projet](languages.md) : recueillir en Q10 les langues documentaires manquantes, la mémoriser par projet et la reprendre sans nouveau questionnaire. Cette règle couvre aussi la documentation technique et les explications Storybook. Préserver les autorités uniques sans restaurer le choix d’assistant.
