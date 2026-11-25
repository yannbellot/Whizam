# Recommander le modèle Codex et l’effort par chantier

Cette politique aide à choisir manuellement le modèle Codex et son niveau d’effort selon le travail à réaliser. La recommandation s’appuie sur les difficultés observées, les contrats concernés et les vérifications nécessaires ; aucun réglage élevé n’est prescrit pour toutes les activités. Les [instructions du kit](../../AGENTS.md) définissent la validation des demandes, les permissions et les conditions d’acceptation.

Codex reste un choix facultatif. Cette politique ne détermine pas le modèle des autres assistants et ne requiert aucun compte IA pour exécuter le site. Aucune équivalence entre fournisseurs n’est déduite.

## Disponibilité et limites de vérification

Vérification documentaire du **25 octobre 2026**, par lecture des pages officielles [GPT-6.1 Sol](https://developers.openai.com/api/docs/models/gpt-6.1-sol), [GPT-6 Astra](https://developers.openai.com/api/docs/models/gpt-6-astra) et [modèles dans Codex](https://learn.chatgpt.com/docs/models).

| Modèle | Identifiant | Efforts documentés |
| --- | --- | --- |
| GPT-6.1 Sol | `gpt-6.1-sol` | `low`, `medium`, `high`, `xhigh`, `max` |
| GPT-6 Astra | `gpt-6-astra` | `low`, `medium`, `high`, `xhigh`, `max` |

Les deux modèles et ces efforts sont également annoncés par les outils de la session de rédaction. Cela ne prouve ni leur présence dans le sélecteur de chaque utilisateur, ni le modèle/effort actuellement sélectionné. L’accès dépend du compte, du client et des réglages. Lors d’une révision de cette politique ou si une option manque, recontrôler les sources officielles et les options effectivement accessibles ; signaler l’adaptation nécessaire, sans inventer de remplacement équivalent ni modifier le client. Les prescriptions ci-dessous sont celles du projet, pas les valeurs par défaut de l’API.

Libellés utilisés : faible (`low`), moyenne (`medium`), élevée (`high`), très élevée (`xhigh`), max (`max`). **Ultra** est un mode Codex distinct utilisant des sous-agents, pas un synonyme de max ; aucune activation ni délégation n’est autorisée par cette politique.

## Sources et cinq dimensions

Partir du résultat produit demandé, des règles/priorités du projet et d’une inspection ciblée des chemins concernés. Examiner localisation/transversalité, contrats et dépendances réellement touchés, frontières de sécurité/données/migrations, tests et preuves nécessaires et inconnues techniques restantes. Suivre appels, imports, producteurs et consommateurs pertinents ; une recherche sans résultat ne démontre pas l’absence d’impact.

Pour chaque dimension, noter une preuve courte avec chemin et symbole/section utile, puis distinguer **fait confirmé**, **complexité constatée** et **point indéterminé**. Les exemples ci-dessous proviennent des ressources internes du starter ; la démonstration de projets est retirée des routes actives. Ils sont à réexaminer pour le projet dérivé réel.

| Dimension | Inspection et preuve de référence dans ce kit |
| --- | --- |
| 1. Clarté du résultat et cohérence | Confronter mandat, [périmètre du kit](../product/starter-kit.md), brief et spécifications. Le kit complet et l’exemple de projets ont des périmètres distincts ; une demande de libellé n’autorise pas un nouveau parcours. |
| 2. Chemins et localisation | [Table des routes actives](../../app/routes.ts), puis ressources internes de l’exemple : action `saveProject` dans [project-routes.server.ts](../../app/features/projects/project-routes.server.ts), lecture/validation dans [project-http.server.ts](../../app/features/projects/project-http.server.ts), puis [repository](../../app/features/projects/project-repository.server.ts). Établir les dépendants réellement modifiés, au-delà du nombre de fichiers. |
| 3. Frontières sensibles | `readProjectForm` refuse méthodes/origines/formats/taille non autorisés ; `readServerHost` dans [env.server.ts](../../app/server/env.server.ts) limite l’écoute hors conteneur ; [Compose](../../compose.yaml) fixe exposition et identité persistante des ressources. Vérifier si le changement modifie effectivement une de ces garanties. |
| 4. Contrats et preuves | [Zod](../../app/features/projects/project-contract.ts), [schéma Drizzle](../../app/server/db/schema.server.ts) et migration SQL `drizzle/0000_initial_projects.sql` coordonnent champs/contraintes. Les [tests PostgreSQL](../../tests/integration/postgres.test.ts) exigent une base isolée et vérifient migration répétée/seed ; les [tests serveur](../../tests/unit/server-environment.test.ts) couvrent refus et diagnostics. Pour l’UI, suivre [sources DTCG et contrats YAML](../../src/design-system/authority/README.md), [génération](../../scripts/generate-tokens.mjs), composants et stories. |
| 5. Contradictions et inconnues | La [sécurité documentée](../security.md) décrit une démonstration locale sans comptes ; la [compatibilité](../compatibility.md) distingue fichiers et essais natifs. Un ajout d’authentification ou un essai fournisseur absent ne peut être présumé couvert par les preuves existantes. |

Le nombre de fichiers n’est pas un score de difficulté. Les mots « sécurité », « migration », « refactor », « scale » ou « gouvernance » ne justifient seuls aucune hausse. Une modification effective d’un contrat et sa simple mention dans un texte sont deux observations différentes.

## Choix de l’effort pour GPT-6.1 Sol

Privilégier **GPT-6.1 Sol** et augmenter d’abord son effort selon les difficultés constatées. Les seuils sont qualitatifs et cumulent les conditions décrites ; ils ne sont pas des résultats de benchmark. Aucune phase ne déclenche automatiquement un changement. La recommandation porte sur une tranche précise, pas nécessairement sur tout le projet.

| Configuration complète | Conditions |
| --- | --- |
| **GPT-6.1 Sol — faible** (`gpt-6.1-sol`, `low`) | Analyse simple et bornée ; résultat clair/cohérent, chemins identifiés, périmètre localisé, aucune frontière sensible concernée par le changement, contrats/preuves compris, aucune inconnue matérielle. Réservé au cadrage simple ; jamais le développement courant. |
| **GPT-6.1 Sol — moyenne** (`gpt-6.1-sol`, `medium`) | Exploration technique approfondie ou développement courant ; périmètre connu, localisé et réversible ; contrats et tests identifiables ; aucune modification effective d’une frontière sensible ou de plusieurs contrats dépendants. Plancher du développement courant. |
| **GPT-6.1 Sol — élevée** (`gpt-6.1-sol`, `high`) | Plancher dès qu’une surface ci-dessous est effectivement modifiée ou qu’une obligation de preuve de sécurité s’applique au changement. Nommer la garantie, les dépendants et les preuves affectés. |
| **GPT-6.1 Sol — très élevée** (`gpt-6.1-sol`, `xhigh`) | Ces surfaces demandent une analyse particulièrement approfondie : dépendances, scénarios négatifs, migrations, preuves ou retour arrière difficiles à examiner ensemble. Décrire les difficultés concrètes ; la présence de la surface seule ne suffit pas. |
| **GPT-6.1 Sol — max** (`gpt-6.1-sol`, `max`) | Exception : une difficulté précise nécessite plus d’analyse que très élevée. Nommer cette difficulté, expliquer le gain attendu et la preuve permettant de la résoudre. |

Surfaces imposant au moins élevée lorsqu’elles sont effectivement touchées :

- Authentification, autorisation, isolation ; permissions, sessions, cookies et contrôles fermés par défaut.
- Migration ou transformation de données.
- RAG, base vectorielle, provenance ou fournisseur IA.
- Proxy, conteneurs, runtime, CI ou contrat d’environnement.
- Plusieurs contrats dépendants à vérifier ensemble.
- Obligation de preuve de sécurité applicable.

Authentification, sessions, RAG et fournisseur IA sont des déclencheurs conditionnels, pas des fonctions déclarées présentes par cette liste. Pour ce starter, les protections HTTP et frontières serveur/client sont concrètes ; les comptes restent conditionnels. Exemple : modifier une garde d’origine exige au moins élevée ; une correction de libellé pourrait relever de moyenne après inspection. Modifier ensemble Zod, SQL et formulaire impose au moins élevée ; le seul renommage d’un titre documentaire contenant « migration » ne l’impose pas.

L’évolution coordonnée de l’identité Compose, du choix du volume, du déplacement et de la restauration pourrait justifier très élevée si les compatibilités et scénarios de reprise sont difficiles à examiner ensemble. Documenter ce qui manque avant de conclure. Ne jamais augmenter l’effort pour compenser une information produit absente, un accès manquant ou une vérification indisponible ; traiter l’arbitrage ou le blocage selon les instructions existantes.

## Recours à GPT-6 Astra

**GPT-6 Astra — élevée** (`gpt-6-astra`, `high`) ou **très élevée** (`gpt-6-astra`, `xhigh`) peut être recommandé lorsque architecture, sécurité et migrations sont fortement couplées **et** qu’une incertitude d’architecture non résolue, une limite constatée de Sol ou un besoin de raisonnement exceptionnel justifie le recours à Astra.

Le couplage seul ne suffit pas. Expliquer pourquoi Sol très élevée ou, si pertinent, Sol max ne couvrirait pas raisonnablement le besoin. Ne pas imposer d’essai supplémentaire de Sol max si une limite déjà constatée justifie directement Astra. Choisir élevée ou très élevée selon la difficulté concrète à traiter et expliciter le gain attendu ; aucune équivalence d’effort/performance entre modèles n’est supposée.

**GPT-6 Astra — max** (`gpt-6-astra`, `max`) est réservé à des contraintes exceptionnelles que très élevée ne permettrait pas raisonnablement de traiter. Les nommer et définir la preuve attendue. Cette politique n’affirme aucune supériorité mesurée sur ce dépôt ; un benchmark général ne permet pas d’en déduire une équivalence ou un résultat local.

## Justification et réutilisation

Dans la fiche du chantier ou le compte rendu utile, consigner :

- Résultat attendu, périmètre exact et version inspectée.
- Cinq dimensions, faits/complexités/inconnues et preuves tirées du dépôt.
- Surfaces et contrats effectivement concernés, contrôles nécessaires et limites.
- Modèle et effort complets ; pour une configuration supérieure, gain attendu et difficulté qui justifie la hausse. Sinon : « aucune hausse justifiée ».

Réutiliser cette analyse tant que résultat, périmètre, contrats et inconnues restent inchangés. Une précision rédactionnelle ne déclenche pas une nouvelle inspection complète. Réexaminer seulement les dimensions affectées par un nouvel élément, puis actualiser la justification. Une inconnue matérielle reste visible, même si la recommandation est provisoire. Aucune quantité de tokens économisés ni performance n’est garantie : le coût de la ligne courte et celui de l’effort choisi n’ont pas été mesurés ici.

## Choix préalable de l’assistant

Appliquer la politique correspondant au point d’entrée actif selon AGENTS, sans question d’assistant ni lecture de son ancien choix local. Conserver la provenance des recommandations ; une ancienne recommandation d’un autre assistant ne vaut pas recommandation courante.

## Affichage de la recommandation et validation

Appliquer le [traitement des demandes](../../AGENTS.md#traitement-des-demandes-et-validation-de-lexécution), autorité commune de collaboration. Une réponse informative est directe. Une modification nouvelle dépassant le seuil mineur fait l’objet d’une proposition en conversation, sans écriture ni exécution, puis d’une validation. Une demande ou réponse de clarification dans un périmètre déjà validé n’impose pas de nouvelle validation tant que périmètre, conséquences et configuration recommandée restent stables.

Suivre le **couple modèle + niveau**, pour le travail concerné :

- Première recommandation ou historique inconnu : afficher le couple et son motif avant toute exécution du changement, puis attendre validation.
- Couple identique à la dernière recommandation connue : omettre la recommandation, y compris après une nouvelle question. Une modification non mineure attend néanmoins la validation de sa proposition.
- Modèle ou niveau différent, à la hausse comme à la baisse : annoncer la nouvelle recommandation et son motif avant le travail concerné, puis attendre validation pour l’exécuter.
- Petite modification répondant à tous les critères d’AGENTS et couple inchangé : exécuter sans message préalable, vérifier, puis confirmer brièvement. Un changement de couple supprime cette exception.

Format : **Pour la suite : GPT-6.1 Sol · Moyenne — modification visuelle localisée.** Afficher cette indication une seule fois dans la proposition ou la question utile, y compris avec un outil d’entrée utilisateur ; ne pas la répéter sous chaque question regroupée. Pour une réponse informative, afficher une recommandation seulement si une suite concrète est préparée ; ne pas créer une validation pour la réponse elle-même.

L’utilisateur sélectionne manuellement son réglage. Comparer les recommandations entre elles sans prétendre connaître le modèle/niveau effectif du client ni avoir modifié ce réglage. Une validation autorise l’exécution du périmètre présenté, pas la preuve d’un changement de sélecteur. Ne pas demander une seconde confirmation de réglage après cet accord.

Après autorisation d’écriture, conserver dans le suivi utile le périmètre validé, la dernière recommandation, son motif et les inconnues restantes. Réutiliser ce point de reprise lors d’une nouvelle conversation ; si absent, présenter une recommandation initiale sans inventer d’historique. Les hypothèses et arbitrages matériels restent soumis aux conditions d’arrêt, même avec un effort supérieur.

### Exemples de comportement attendu

| Demande / état | Réponse attendue |
| --- | --- |
| « Explique le démarrage », choix Codex déjà recueilli | Réponse directe, aucune modification ni validation. |
| Nouvelle fonctionnalité, couple déjà connu inchangé | Proposition et demande de validation, sans recommandation répétée. |
| Couleur d’un seul bloc, portée locale vérifiée, couple inchangé | Modification, vérification et brève confirmation ; aucun préambule. |
| Même couleur mais aucune recommandation précédente connue | Proposition avec recommandation initiale, puis attente de validation. |
| Petite modification nécessitant un autre couple | Nouvelle recommandation et attente de validation avant exécution. |
| Réponse « oui » à la proposition concrète | Réalisation et contrôles dans le périmètre validé, sans seconde validation. |
| Précision dans le périmètre validé, couple inchangé | Poursuite ; aucune recommandation ni validation répétée. |
| Extension matérielle du périmètre, couple inchangé | Nouvelle proposition et validation ; aucune recommandation répétée. |

Ces exemples sont des critères documentaires ; ils ne constituent pas des essais natifs des assistants.

## Questions et commentaires utilisateur

Appliquer le [protocole commun](../agents/user-decisions.md) pour les décisions utiles et leur instruction complémentaire facultative. Une option de mode ou un commentaire ne sélectionne pas le modèle dans le client et ne vaut pas accord d’exécution sans expression explicite. Conserver les règles d’affichage du couple déjà définies ; ce protocole ne déclenche aucune recommandation répétée.
