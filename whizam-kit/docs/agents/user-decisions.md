# Questions à choix et décisions utilisateur

Autorité commune de présentation et de traitement des décisions, sous les [instructions](../../AGENTS.md). [Décision 043](../decisions/043-user-decision-protocol.md). Ce protocole utilise les outils du client ; il n’ajoute ni formulaire applicatif ni moteur d’exécution.

## Quand poser une question

Utiliser ce protocole pour une décision effectivement nécessaire : assistant au premier échange, choix produit/visuel, mode de vérification, autorisation d’exécution, retour de recette, acceptation d’une version ou arbitrage bloquant. Une question ouverte de cadrage peut rester ouverte si des options seraient artificielles ; offrir les précisions libres adaptées. Ne pas créer de question pour une information seule, un compte rendu ou une petite correction déjà autorisée. Réutiliser les réponses et accords explicites ; ne pas reposer une décision sans changement matériel.

Pour chaque question, indiquer contexte, objet et périmètre ; présenter des options distinctes et compréhensibles. Préférer un choix unique. Réserver la sélection multiple à des décisions réellement cumulables, jamais aux états Oui/Non ou validé/non validé. Une recommandation de mode de vérification porte sur la couverture observée ; les recommandations modèle/niveau suivent les politiques existantes et ne sont répétées que si le couple change ou est inconnu.

## Présentation native et texte libre

Vérifier l’outil réellement disponible et ses règles dans le mode courant. Dans Codex, utiliser l’outil de demande utilisateur exposé par la session, tel que `request_user_input_async` ou `request_user_input` si autorisé. Dans Claude Code, utiliser `AskUserQuestion` si disponible. Ne pas changer de mode, de fournisseur, de permissions ou de configuration personnelle pour forcer un questionnaire.

Lorsqu’il est disponible, utiliser le champ natif de notes pour associer choix et instruction. Sinon, la saisie libre peut contenir à la fois le choix explicite et sa précision, par exemple « Combiné ; je vérifierai les messages moi-même ». Si le client ne permet pas ce format, demander la décision en texte avec les mêmes libellés et inviter à ajouter une précision facultative dans la réponse. Ne pas imposer une seconde question pour un commentaire facultatif, ni attendre une note quand le choix suffit. Le client décide de l’emplacement et de l’apparence des contrôles ; le kit ne garantit pas de champ sous des boutons radio.

Après les options, sauf pour l’assistant initial, présenter la mention **Instruction complémentaire — facultative**, avec un exemple adapté. Si le client permet un libellé de note, l’utiliser ; sinon porter cette mention dans la question ou le texte adjacent. Les ronds dans les modèles ci-dessous sont des illustrations, pas des contrôles Markdown. Ne pas ajouter soi-même une option « Autre » si le client fournit déjà la saisie libre.

### Appeler l’outil, sans simuler ses contrôles

Avant toute question à choix, vérifier les outils réellement exposés. Si un outil de demande utilisateur est disponible et autorisé pour la décision, **l’appeler** : écrire une liste dans la réponse ne satisfait pas cette règle. Dans Codex, privilégier `request_user_input_async` lorsqu’il est disponible ; ne pas appeler `request_user_input` si le mode courant l’interdit. Pour une validation de proposition de travail, utiliser une question native si les règles de cet outil l’autorisent ; ne pas la confondre avec une permission système ou d’outil, qui conserve son propre mécanisme.

Exemple de données pour `request_user_input_async`, uniquement si ce schéma est bien celui exposé dans la session :

```json
{
  "questions": [
    {
      "title": "Pour démarrer, peux-tu me dire quel assistant tu utilises ?",
      "options": ["Codex (OpenAI)", "Claude Code (Anthropic)"]
    }
  ]
}
```

Pour une validation, fournir par exemple le titre « Valides-tu la préparation d’Atlas et les vérifications décrites ? Instruction complémentaire — facultative : précise une contrainte si nécessaire. » et les options « Oui, je valide » / « Non ». Les autres outils ont leur schéma propre ; ne pas leur transmettre ce JSON sans vérifier leur contrat.

Après l’appel, ne pas recopier la question et les options dans un message final ou un second questionnaire. Un appel asynchrone retourne avant la réponse : il ne prouve pas que l’utilisateur a choisi. Utiliser le mécanisme d’attente autorisé par le client ou terminer le tour en laissant la question native en attente ; aucune exécution dépendante avant réception de la réponse. Les travaux indépendants déjà autorisés peuvent continuer. Une réponse ne doit pas provoquer une seconde demande identique.

Si aucun outil autorisé ne convient, annoncer explicitement « Choix en texte : réponds avec le libellé souhaité », puis afficher les options dans une liste numérotée. Ne pas utiliser les ronds `○`, cases à cocher ou faux champs de saisie dans ce repli, et ne pas le présenter comme interactif. Les illustrations ci-dessous servent uniquement à décrire les libellés et décisions ; elles ne sont jamais à recopier comme des boutons dans une réponse utilisateur.

Dans une validation, utiliser l’outil natif seulement si ses règles l’autorisent ; sinon poser la même question en texte. Une préférence n’est pas une autorisation d’exécuter. Les permissions natives du client restent distinctes.

Références documentaires : [outil Codex](https://github.com/openai/codex/blob/main/codex-rs/core/src/tools/handlers/request_user_input_spec.rs), [outil Claude Code](https://code.claude.com/docs/en/tools-reference#askuserquestion-tool-behavior). Références consultées le 19 novembre 2026 ; vérifier les capacités réellement exposées, sans déduire un essai natif de leur documentation.

## Assistant au premier échange

Appliquer les conditions de reprise d’[AGENTS](../../AGENTS.md#choisir-lassistant-au-premier-échange). Conserver la demande initiale sans la traiter avant le choix, sauf assistant déjà déclaré explicitement dans le premier message. Poser :

> Pour démarrer, peux-tu me dire quel assistant tu utilises ?
>
> ○ Codex (OpenAI)  
> ○ Claude Code (Anthropic)

Aucun champ complémentaire demandé par le kit pour ce choix initial, sans supprimer une zone libre que le client ajoute lui-même. Aucune préférence fournisseur. Le choix ne prouve pas le modèle effectivement sélectionné et ne vaut pas validation d’exécution. Une réponse libre déclarant Gemini, Mistral ou un autre outil reste recevable sous les règles communes, sans correspondance de modèles inventée.

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
> **Instruction complémentaire — facultative**  
> Exemple : je souhaite examiner moi-même les messages d’erreur.

Le choix ne remplace pas les revues design, technique ou sécurité, ni leurs contrôles techniques obligatoires. Ne pas proposer cette question pour un changement purement documentaire ou une couleur réellement locale sans enjeu de parcours. Conserver l’exception mineure d’AGENTS ; un besoin matériel de décision sur la couverture nécessite une proposition préalable.

En cas de prérequis E2E absent, annoncer le manque et proposer une alternative pour décision, sans basculer silencieusement en manuel ni annoncer un succès. Le résultat obligatoire indisponible bloque la qualification correspondante.

## Validation de l’exécution

Décrire le résultat prévu, son périmètre, la couverture et le mode retenu. Le choix de mode ne vaut pas accord d’exécution ; demander une seule validation si elle manque :

> Je retiens Combiné pour les scénarios décrits. Valides-tu la préparation du projet, la réalisation de cette page et ces vérifications ?
>
> ○ Oui, je valide  
> ○ Non
>
> **Instruction complémentaire — facultative**  
> Exemple : retire la sauvegarde du périmètre avant de commencer.

L’objet de cette question est « Validation de l’exécution » ; ne pas l’intituler « Manuel », qui désigne un mode de vérification. Un accord explicite déjà formulé sur cette proposition, par exemple « Combiné, je valide l’exécution », suffit sans seconde question. L’accord couvre réalisation, vérifications, documentation et corrections nécessaires dans le périmètre annoncé, pas une publication ou l’acceptation du résultat.

## Retour de recette manuelle

Pour Manuel ou Combiné, fournir la version et les accès vérifiés, les actions et résultats attendus, puis demander :

> Après avoir suivi cette recette, quel est ton retour ?
>
> ○ Je valide la recette manuelle  
> ○ Recette manuelle non validée
>
> **Instruction complémentaire — facultative**  
> Exemple : le total ne se met pas à jour quand je modifie la quantité.

Une validation rapporte l’observation de l’utilisateur, pas une observation navigateur faite par l’IA. Sans retour, noter en attente. En Combiné, une recette validée n’efface pas un E2E échoué ou non exécuté. Un refus sans commentaire suffit à ne pas valider ; demander uniquement le détail nécessaire au diagnostic. Le diagnostic borné existant s’applique sans seuil de tentatives ajouté.

En mode Automatisé — E2E, restituer les résultats convenus sans demander d’attester une recette manuelle non choisie. La revue humaine ou l’acceptation du jalon reste distincte quand nécessaire.

## Acceptation du résultat

Lorsque les critères et contrôles requis permettent de présenter une version pour acceptation :

> Les vérifications requises sont terminées. Acceptes-tu cette version sur le périmètre convenu ?
>
> ○ J’accepte cette version  
> ○ Des ajustements restent nécessaires
>
> **Instruction complémentaire — facultative**  
> Exemple : le fonctionnement convient, mais la présentation du total reste à ajuster.

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

Conserver le mode et la couverture pour les corrections/retests de la tranche. Reposer le choix seulement en cas de changement matériel de périmètre, couverture, conséquences ou demande utilisateur. Après autorisation d’écriture, le suivi du projet conserve décision, portée, réserve éventuelle, assistant d’origine, mode, couverture, version et preuves utiles ; aucun fichier témoin supplémentaire. La roadmap et le point de reprise restent ceux du projet concerné.

## Données confidentielles

Les questions natives et leurs notes ne sont pas un canal de collecte de secrets. Pour les mots de passe, jetons et clés, suivre le [parcours de configuration privée](private-configuration.md) : saisie locale hors conversation, ou fichier privé ouvert directement si nécessaire. Demander seulement la confirmation de l’enregistrement, sans valeur.
