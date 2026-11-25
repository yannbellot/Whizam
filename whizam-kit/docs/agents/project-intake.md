# Cadrage initial et reprise du projet

Autorité du questionnaire sous [AGENTS](../../AGENTS.md) et le [protocole de décisions](user-decisions.md). S’applique à une demande de nouveau projet, pas à une question informative ou à une correction d’un projet existant. Lire d’abord le brief, le suivi et les réponses enregistrées dans la copie courante.

## Deux niveaux, sans répétition

Avant chaque question de cadrage, choisir le mécanisme de [question et attente](user-decisions.md#appeler-loutil-sans-simuler-ses-contrôles). Si elle est asynchrone, garder le tour actif au moyen de l’attente interruptible disponible, sans message final même vide. Les attentes expirées sont renouvelées sans choix par défaut. Sans mécanisme d’attente compatible, poser la question en message final conversationnel. Ne pas confondre fin d’un tour et attente effective d’une réponse au sélecteur.

Premier niveau : appeler le choix natif disponible et autorisé. La saisie libre native reste utilisable, sans aucune mention répétitive ni exemple ajouté à la question. Si l’outil ne le permet pas, repli conversationnel explicite. Aucun faux champ Markdown ou sélecteur de fichier dans une question. Une présélection, fermeture, expiration ou absence de réponse ne vaut jamais choix.

Collecte de second niveau (texte, nom, contenu, lien, fichier ou précision ouverte) : poser la demande dans la conversation, sans outil de questionnaire ni champ dédié ; attendre le message normal, texte, liens, chemins ou pièces jointes selon les possibilités du client. Une référence inaccessible reste signalée. Les arbitrages complémentaires à options connues (langue par défaut, décision de traduction) restent des choix natifs ; ils ne sont pas des collectes de contenu. Ne pas poursuivre silencieusement après un Oui sans élément fourni.

Les éléments du brief, les réponses mémorisées ou les précisions évitent les questions correspondantes. Ne jamais exiger un second message si les éléments sont déjà disponibles. Une contradiction exige clarification. Les combinaisons appareils/langues exigent au moins une valeur. Q6 utilise le parcours successif défini ci-dessous ; Q9 et Q10 utilisent leurs choix uniques natifs, sans question ouverte motivée par l’absence de multi-sélection. Aucune sélection recommandée d’appareil ou langue n’est imposée.

## Entrée — brief, seulement s’il manque au premier message

Pour le démarrage d’un nouveau projet, le tout premier message visible de l’assistant doit être exactement l’accueil ci-dessous, sans préambule « Je vais consulter/vérifier… ». Il peut être émis en commentaire avant les outils ; après les lectures nécessaires, appeler la question d’entrée native si le brief manque. Pour une reprise connue, ne pas répéter l’accueil. Les instructions prioritaires du client restent applicables :

> **👋 Bienvenue dans Whizam**  
> Créons votre application ensemble.

Cet accueil apparaît une seule fois par projet, pas à chaque conversation. Consigner « accueil présenté » dans le point de reprise existant après son affichage ; relire le suivi avant toute reprise. Ne pas créer de fichier local supplémentaire ni inscrire cette marque dans le modèle distribué. Pour un projet déjà engagé, reprendre directement sans imposer un accueil rétrospectif. Une demande informative ou de maintenance ne déclenche pas cet accueil. Si un brief est fourni d’emblée, passer à son analyse après l’accueil, sans question d’entrée inutile. Les autres questions restent sans icônes.

**Avez-vous un brief pour votre projet ?**

Un brief décrit ce que vous souhaitez créer, pour qui et dans quel but.

- Je n’ai pas de brief — je souhaite être guidé.
- J’ai un brief.
- Je souhaite créer un projet démo pour tester Whizam.


Après « J’ai un brief », s’il manque : « Transmettez votre brief dans votre prochain message. Vous pouvez saisir son texte, joindre un document ou indiquer un lien ou un chemin. » Attendre sa réception puis analyser les réponses disponibles. Sans brief, commencer Q1 ; une demande limitée à une information ne lance pas ce parcours.

## Q1 — Nom

**Avez-vous un nom pour votre projet ?**

- Oui — je souhaite fournir un nom.
- Je n’ai pas de nom — proposer un nom provisoire adapté au projet.


Si Oui et nom manquant : « Quel nom souhaitez-vous donner à votre projet ? » Sinon proposer un nom provisoire après connaissance de l’objectif. Ne pas renommer implicitement dossier, paquet ou ressources.

## Q2 — Objectif et utilisateurs

**Avez-vous défini l’objectif de votre application et les personnes auxquelles elle s’adresse ?**

- Oui — je souhaite décrire mon idée et ses utilisateurs.
- Je n’ai pas d’objectif précis — proposer une idée d’application et son public à partir du contexte disponible.


Si Oui et description manquante : « Décrivez ce que vous souhaitez créer, le besoin auquel l’application doit répondre et les personnes qui l’utiliseront. » Sinon préparer une proposition, sans transformer une invention en besoin réel ni la développer avant validation.

## Q3 — Première version

**Savez-vous ce que doit permettre la première version ?**

- Oui — je souhaite préciser mes besoins.
- Je n’ai pas de périmètre défini — proposer une première version adaptée à l’objectif du projet.


Si Oui et périmètre manquant : « Indiquez les fonctionnalités, pages ou parcours prioritaires pour la première version. » Sinon proposer un premier périmètre à valider.

## Q4 — Contenus

**Disposez-vous de contenus pour votre application ?**

Textes, photos, vidéos, données, etc.

- Oui — je souhaite fournir des contenus.
- Non — utiliser des contenus de substitution.


Si Oui et éléments manquants : « Transmettez vos contenus dans votre prochain message : textes, photos, vidéos, données, etc. Vous pouvez saisir du texte, joindre des fichiers ou indiquer des liens ou des chemins. » Les substitutions sont identifiées comme provisoires, jamais comme informations réelles du designer.

## Q5 — Références visuelles

**Disposez-vous de références visuelles pour guider la conception ?**

Maquettes, captures d’écran, sites d’inspiration, charte graphique, etc.

- Oui — je souhaite fournir des références visuelles.
- Non — je souhaite que l’assistant propose une direction visuelle.
- Je ne sais pas encore — je préciserai ce besoin plus tard.


Si Oui et références manquantes : « Transmettez vos références visuelles dans votre prochain message : maquettes, captures d’écran, sites d’inspiration, charte graphique, etc. Vous pouvez joindre des fichiers ou indiquer des liens ou des chemins. » Si Non, proposer une direction. Si report, conserver le point ouvert ; toute direction nécessaire est présentée comme provisoire dans la synthèse.

## Q6 — Appareils

Réutiliser les appareils déjà renseignés dans le brief ou les réponses conservées. Sinon, poser d’abord ce choix unique natif :

**Souhaitez-vous que votre application soit optimisée pour les principales plateformes ?**

- Oui — optimiser pour les écrans d’ordinateur, de tablette et de mobile.
- Non — je ne veux sélectionner que certains formats.

Après Oui, enregistrer `q6.platforms`, les trois appareils retenus et la combinaison finale `q6`, puis passer directement à Q7 sans question supplémentaire sur les appareils.

Après Non, enregistrer `q6.platforms`, puis poser les trois questions suivantes **successivement**, dans cet ordre, en choix uniques natifs Oui / Non. Chaque appel ne contient qu’une question d’appareil : attendre la réponse explicite, l’enregistrer et la relire avant de poser la suivante. Ne pas grouper les trois questions dans un même formulaire.

### Ordinateur

**Souhaitez-vous adapter votre application aux écrans d’ordinateur ?**

- Oui
- Non

### Tablette

**Souhaitez-vous adapter votre application aux écrans de tablette ?**

- Oui
- Non

### Téléphone mobile

**Souhaitez-vous adapter votre application aux écrans de téléphone mobile ?**

- Oui
- Non

Conserver la saisie libre native de chaque question, sans ajouter de texte répétitif « Autres demandes ou précisions », sans promettre sa position. Ce parcours remplace la sélection personnalisée à cases à cocher et tout sélecteur cumulatif, même si le client propose la sélection multiple. Un silence, une présélection, une expiration ou une fermeture ne vaut pas réponse ; appliquer le protocole d’attente avant toute progression. Si les choix natifs eux-mêmes sont indisponibles ou interdits, appliquer le repli conversationnel explicite du protocole, toujours une question à la fois.

Enregistrer les réponses sous `q6.computer`, `q6.tablet`, `q6.mobile`, puis la combinaison finale sous `q6`. Après chaque réponse, `pending` désigne le prochain appareil encore inconnu ; ne pas marquer Non un appareil non encore traité. Le Non initial signifie seulement une sélection personnalisée, pas un refus des trois appareils. Si un brief, une réponse antérieure ou une précision a déjà renseigné un appareil, conserver ce choix et sauter sa question. À la reprise, poser uniquement la prochaine question manquante ; ne pas recommencer Q6 pour un projet déjà cadré parce que les libellés ont changé.

Un autre format peut être précisé spontanément dans la saisie libre ; le conserver sous `q6.other`, sans ajouter une quatrième question d’appareil systématique. Demander un complément conversationnel seulement si ce format reste indéfini. Au moins un format explicite est requis : après trois Non, sans autre format connu, rester à Q6 et demander dans la conversation quel format doit être pris en charge, sans en imposer un ni passer à Q7. Une fois les choix manquants recueillis et au moins un format retenu, enregistrer la combinaison finale puis reprendre à Q7. La démonstration propose les trois appareils et saute cette question si ce choix est accepté. Définir tailles et critères de vérification dans la synthèse.

## Q7 — PWA

**Souhaitez-vous que l’application puisse être installée comme une application (PWA) sur les appareils compatibles ?**

- Oui
- Non — ou je préciserai ce besoin plus tard.


Si la réponse à Q7 est « Non — ou je préciserai ce besoin plus tard. », sauter Q8 et passer directement à Q9. Ne pas reposer Q8 dans une nouvelle conversation pour ce même choix. Noter Q8 « non posée — branche Q7 Non », sans inventer une réponse utilisateur. Préserver toute exigence hors connexion déjà fournie dans le brief ou une réponse précédente ; un besoin connu ne doit pas être effacé.

Le second choix exclut la PWA du périmètre actuel, sans engager un refus définitif ni entraîner une relance à chaque conversation. Une précision peut distinguer un report d’un refus ; ne pas ajouter une question obligatoire pour les départager.

## Q8 — Hors connexion

**Souhaitez-vous que l’application soit accessible sans connexion réseau ?**

- Non — ou je préciserai ce besoin plus tard. L’application doit simplement indiquer qu’une connexion est nécessaire pour fonctionner.
- Oui — uniquement pour les contenus conservés sur l’appareil, sans modification.
- Oui — pour travailler hors connexion, consulter et modifier des données, puis les synchroniser au retour du réseau.


Poser Q8 seulement après une réponse Oui à Q7 et si ce besoin n’est pas déjà renseigné. Après Non à Q7, ne pas poser Q8, même pour une démonstration. Si consultation et périmètre inconnu : « Quels contenus doivent rester consultables sans connexion réseau ? » Si modification : « Quelles données doivent rester consultables et modifiables hors connexion, puis être synchronisées au retour du réseau ? » Préciser avant développement les arbitrages matériels de synchronisation, conflits, échecs et données conservées. Le premier choix implique un message de connexion nécessaire, sans relance automatique du report.

## Q9 — Langues de l’application

**Dans quelle(s) langue(s) votre application doit-elle être disponible ?**

Choix unique natif, sans présélection demandée :

- Français
- English
- Français et English
- Autre combinaison de langues


Ces choix correspondent respectivement à `fr`, `en`, `fr` + `en`, ou aux langues à préciser. Si « Autre combinaison de langues » sans précision, demander dans un message normal : « Indiquez les langues dans lesquelles votre application doit être disponible, y compris Français ou English si souhaités. » Si plusieurs langues et défaut inconnu, poser un choix unique natif : « Parmi les langues retenues, laquelle doit être utilisée par défaut ? », avec les seules langues retenues comme options. Ne pas confondre langue de conversation, langue métier et langue documentaire.

## Q10 — Langues documentaires et Storybook

**Dans quelle(s) langue(s) souhaitez-vous la documentation et les explications Storybook ?**

Choix unique natif, sans présélection demandée :

- Français
- English
- Français et English
- Autre combinaison de langues


Pour « Autre combinaison de langues », si elles ne sont pas précisées : « Indiquez les langues souhaitées pour la documentation et les explications Storybook, y compris Français ou English si souhaités. » Cette demande complémentaire se fait dans la conversation.

La question de traduction du stock est strictement conditionnelle : au moins une langue documentaire supplémentaire autre que `fr` ou `en` doit avoir été choisie ET des contenus actifs existants doivent réellement manquer de traduction dans cette langue ET cette migration ne doit pas déjà avoir été décidée. Examiner les sources, registres et traductions concernés avant de la proposer ; ne pas invoquer d’« éventuels contenus » sans constat. Dans ce seul cas, poser une question native à deux choix (« Traduire les contenus concernés avant présentation » / « Conserver les contenus existants pour le moment ») : « Souhaitez-vous préparer la traduction de la documentation existante et des explications Storybook dans les langues supplémentaires choisies avant leur première présentation, ou conserver les contenus existants pour le moment et utiliser ces langues pour les nouveaux contenus ? »

Pour Français, English ou Français et English seuls : ne poser aucune question de traduction du stock, ne recommander aucune migration et ne confondre ni nouvelle rédaction ni choix de consultation avec une traduction des contenus livrés. Préserver les versions existantes. Sans stock à traduire ou avec décision connue, aucune question supplémentaire.

Pour Q9 et Q10, l’absence de sélection multiple native n’autorise plus un repli vers une simple question ouverte : appeler les choix uniques natifs et appliquer l’attente du protocole. Si le schéma autorisé limite la liste à trois options, utiliser « Français », « English », « Plusieurs langues ou autre langue », puis, pour la dernière, un second choix natif « Français et English » / « Autre combinaison de langues ». Réutiliser une réponse déjà fournie plutôt que relancer ces choix. Un repli textuel reste réservé à l’indisponibilité ou l’interdiction du mécanisme natif lui-même, jamais à la seule absence de cases à cocher. Les choix GitHub conditionnels ci-dessous suivent Q10 avant la synthèse.

## GitHub — choix conditionnels avant la synthèse

Après Q10 et ses compléments éventuels, si ce choix n'est pas déjà connu, poser **Souhaitez-vous conserver les sources de votre projet dans un dépôt sur GitHub ?**

- Oui — créer un nouveau dépôt (`new`).
- Oui — utiliser un dépôt existant (`existing`).
- Non — pour le moment (`none`).

Enregistrer et relire sous `github.repository`. Après Oui seulement, si le mode manque, poser **Quand souhaitez-vous envoyer vos commits sur GitHub ?**

- Après chaque commit local du projet (`after-commit`).
- Uniquement à ma demande (`on-demand`).

Enregistrer et relire sous `github.sync`. Après Non, passer à la synthèse sans poser le mode. Questions natives et attente suivent le protocole commun ; aucune présélection ne vaut réponse. Ne conserver ici que ces valeurs fermées non secrètes ; ni jeton ni autorisation de publication dans ces réponses.

Expliquer que les commits regroupent les modifications selon les lots : par défaut, envoi de chaque commit éligible après intégration locale dans `main`, pas à chaque retouche ni pour les seules branches de travail. Ce choix exprime une intention. Compte/organisation, nom/lien, visibilité et branche seront complétés si nécessaires après validation du cadrage, avec récapitulatif concret avant création ou premier envoi selon [Publication GitHub](../github-publication.md).

Réutiliser les réponses connues entre conversations ; ne pas imposer ces questions rétrospectivement aux projets engagés. Non/report reste acquis jusqu'à une demande de changement. Pour la démo aussi, poser les questions manquantes sans choisir GitHub par défaut ni créer de compte/dépôt. La synthèse couvre Q1–Q10 et ces préférences ; l'accord de développement ne vaut pas publication.

## Démonstration automatique et autorisation

Générer un brief couvrant Q1 à Q6 : nom, objectif/public, petite première version avec parcours principal, contenus fictifs, direction visuelle et **Ordinateur / Tablette / Mobile**. Respecter les précisions de l’utilisateur ; aucun compte externe, service payant ou donnée réelle requis par défaut. Ne pas choisir Q7 à Q10 dans ce brief. Ne pas imposer un secteur métier fixe ; une nouvelle proposition doit changer concrètement le concept ou le parcours, et non seulement le nom.

Présenter le brief puis **Ce projet de démonstration vous convient-il ?**

- Ce brief me convient — poursuivre avec les derniers choix avant réalisation.
- Proposer un autre brief de démonstration.


Accord : mémoriser le brief, reprendre à Q7 et recueillir les informations manquantes jusqu’à Q10 puis aux choix GitHub conditionnels en appliquant les branches : Q7 Non saute Q8, puis choix natifs Q9/Q10 et traduction seulement dans le cas conditionnel prévu. Refus : produire un autre brief tenant compte des précisions puis représenter le choix. Si des précisions modifient matériellement le brief, l’ajuster avant validation ; une contradiction exige clarification. Aucun développement avant validation de la synthèse complète. Ne pas livrer la démonstration comme contenu initial du kit ni réactiver les anciens exemples.

Après la réponse au mode de vérification, l’enregistrer sous l’identifiant `verification` avant de demander l’autorisation de réalisation. Ne pas confondre la préférence de vérification avec l’accord de développement.

Après cadrage, présenter résultat observable, inclusions/exclusions, hypothèses, contenus, direction visuelle, appareils, PWA, hors connexion, langues, portée de traduction, contrôles et mode de vérification selon le protocole existant. Recueillir une seule autorisation concrète lorsqu’elle manque. Un accord acquis sur le même périmètre reste valable à la reprise. L’acceptation de la première version et la publication restent distinctes.


## État persistant et autorisations

Une demande explicite de démarrage (« Démarrons », nouveau projet ou démo) autorise l’enregistrement minimal du cadrage et de l’accueil, sans installation ni développement. Cette exception remplace l’attente d’une validation d’exécution pour ces seules écritures. Ne pas attendre la synthèse finale pour mémoriser les réponses. Au début, exécuter `node scripts/project-intake.mjs show`. Après l’accueil, après chaque réponse reçue (même partielle) et avant d’appeler la question suivante, enregistrer puis relire avec `node scripts/project-intake.mjs record <fichier-evenement.json>`.

L’événement JSON contient `welcomeShown` (booléen facultatif), `answers` (liste facultative de `{ "id": "q1", "value": "…", "status": "provided", "origin": "user" }`) et `pending` (prochaine décision, ou null). Identifiants : `entry`, `demo`, `q1` à `q10`, `q6.platforms`, `q6.computer`, `q6.tablet`, `q6.mobile`, `q6.other`, `q9.default`, `q10.default`, `translation`, `verification`, `approval`, `github.repository`, `github.sync`. Statuts : `provided`, `proposed`, `pending`, `deferred`, `skipped`. Origines : `user`, `brief`, `assistant`, `branch`. Les propositions et questions sautées ne sont pas des réponses utilisateur. L’assistant prépare le JSON par un outil de fichier, sans interpoler les textes utilisateur dans une commande shell. Aucun secret ni contenu privé de pièce jointe dans cet état.

L’outil conserve l’autorité dans un bloc JSON géré de `docs/product/brief.md`, avec un pointeur de reprise dans `docs/project-state.md`, sans écraser le reste des documents ni la roadmap. Le bloc courant distingue l’intention du projet des paragraphes historiques de l’exemple. Il refuse les liens symboliques, écritures concurrentes et blocs invalides. Si la seconde écriture échoue, les réponses déjà sauvées dans le brief restent l’autorité : signaler l’échec et réparer le pointeur avant de poursuivre, sans les ressaisir. En cas de permission/outil indisponible, annoncer que la persistance n’est pas assurée et rester sur le point en cours ; ne pas annoncer un enregistrement fictif. Aucun appel d’enregistrement dans le modèle de maintenance pour y mettre les réponses du mainteneur.

Le brief dans `docs/product/brief.md` et son bloc « Réponses de cadrage » sont l’autorité produit lisible. Y conserver pour chaque question : valeur, origine (brief/utilisateur/proposition), statut (inconnu/proposé/fourni/à transmettre/reporté). Le point de reprise conserve la prochaine question ou demande de second niveau attendue et la portée de la synthèse autorisée ; il renvoie au brief sans recopier ses réponses. Mettre à jour après chaque réponse, avec permission d’écriture applicable. Si l’écriture échoue, annoncer la limite de reprise et ne pas prétendre mémoriser. Ne pas conserver de secret ni recopier les pièces jointes privées dans un document public.

Dans une nouvelle conversation, lire ces autorités avant toute question. Reprendre une transmission attendue sans reposer son premier niveau. Un report n’est rouvert que sur demande, contradiction ou décision matériellement nécessaire. Une nouvelle conversation ne réinitialise pas le projet ni son autorisation. Les préférences techniques documentaires suivent [Langues du projet](languages.md) : elles sont distinctes du brief produit, avec migration des anciennes valeurs.

Ne pas écrire les réponses d’un mainteneur dans le modèle distribué. Le suivi des projets dérivés n’est initialisé qu’après mandat. Les réponses de cadrage autorisent leur enregistrement minimal dans la copie visée par la demande explicite de démarrage, pas la réalisation de l’application. Avant développement, présenter une synthèse concrète couvrant Q1–Q10, préférences GitHub, hypothèses, exclusions, critères et vérifications puis attendre son autorisation, sauf accord explicite déjà acquis sur ce même périmètre. Pour la démonstration aussi, l’accord intermédiaire reprend à Q7 sans lancer le développement. Acceptation de la livraison et publication restent distinctes.

## Transmission aux procédures de réalisation

Appareils : définir les adaptations et essais pertinents ; les outils Whizam restent desktop. PWA : implémentation dédiée dans le projet si demandée, jamais activée dans le modèle par cette consigne. Hors connexion : vérifier message de perte réseau, lecture conservée ou écritures/synchronisation selon le périmètre ; clarifier conflits et échecs avant réalisation. Langues métier : traduction et changement de langue vérifiés séparément des langues documentaires. Un build seul ne prouve aucune de ces capacités.
