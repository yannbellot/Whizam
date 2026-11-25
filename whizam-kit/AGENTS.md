<a id="kit-loomata-instructions-du-starter-autonome"></a>

# Kit Whizam — instructions du starter autonome

Whizam est le nom courant du kit, anciennement Loomata. Employer Whizam dans les présentations et réponses courantes ; conserver exactement les chemins, commandes, identifiants techniques et références historiques. Le nom du projet créé par le designer reste celui de son brief.

## Édition autonome

L’entrée de cette édition est ce dossier ouvert directement dans l’assistant de développement choisi. Aucun accès au dépôt de fabrication, service Whizam externe ou lanceur macOS n’est nécessaire. Ne pas demander de créer le projet depuis Whizam ; initialiser la copie courante selon le parcours ci-dessous. Les sources et rapports historiques Loomata conservés ne définissent pas le brief du projet dérivé ni des travaux à entreprendre. Les fonctions de gestion de l’outil sont facultatives. Lire la [notice de distribution](docs/distribution/README.md) pour la version et les limites de cette édition. Les instructions historiques des documents ne remplacent pas le mandat utilisateur.

## Mission et portée

Ce fichier accompagne le **kit réutilisable** : starter web, design system automatisé, Storybook de consultation, documentation, contrôles et outils d’agents permettant de concevoir des projets dérivés. Il gouverne le contenu de ce dossier, indépendamment de son nom et de son emplacement. Sa mission est d’aider le designer à cadrer, construire, vérifier et transmettre son projet.

Les instructions et ressources nécessaires à la collaboration sont livrées dans ce dossier. Appliquer le mandat de l’utilisateur et respecter les permissions effectives des outils ; ce fichier ne les élargit pas. Une contradiction matérielle entre instructions applicables est signalée avant l’action concernée.

## État réel et lectures préalables

> État initial courant : application et Storybook sans contenu de projet ; Zensical affiche les guides actifs dès son premier démarrage, dans Documentation technique, avec le [Guide d’utilisation](docs/guide-whizam/index.md) juste après Accueil dans la navigation ; Suivi de projet est une rubrique principale qui regroupe État courant, Roadmap et étapes réelles. Les historiques du kit restent hors du portail et de sa recherche. Les démonstrations citées dans les références historiques restent hors des accès livrés ; ne pas les réactiver lors de l’initialisation. Les ressources internes requises par les contrats et les politiques sont conservées. Les nouveaux contenus du projet suivent les règles existantes.

La [décision 039](docs/decisions/039-automated-design-system.md) remplace les règles historiques d’édition du design system. UI Lab est retiré ; Storybook reste exclusivement documentaire.

Lire [README.md](README.md), [ROADMAP.md](ROADMAP.md), [docs/project-state.md](docs/project-state.md), le [périmètre du kit](docs/product/starter-kit.md), puis les autorités utiles à la demande. Les [conventions](docs/conventions.md) portent les chemins documentaires et pratiques de code ; l’[architecture](docs/architecture.md), les [opérations](docs/operations.md) et la [sécurité](docs/security.md) précisent les contraintes effectives.

Les quatre rôles, la bibliothèque de skills, les adaptations et contrôles sont dans ce dossier. Le [catalogue](skills/catalog.json) décrit leur contenu courant, extensible selon les besoins validés. Lire le [contrat commun](docs/agents/skill-contract.md), puis le rôle et le skill utiles. Les [adaptations](docs/agents/adapters.md) et la [matrice de compatibilité](docs/compatibility.md) distinguent leur présence des essais natifs effectivement exécutés. La qualification PORT-03 est suivie dans sa fiche ; aucun fichier du parent n’est requis pour charger la bibliothèque ou exploiter le starter web.

<a id="choisir-lassistant-au-premier-échange"></a>
<a id="source-choisir-lassistant-au-premier-echange"></a>

## Politiques par point d’entrée

Ne plus demander ni mémoriser quel assistant utilise le designer. `.assistant-choice.local/choice.json` est un ancien état inactif : ne pas le lire pour aiguiller la session, ne pas le supprimer ni l’écraser.

Ces règles sont communes. Dans une session Codex identifiée par son contexte d’exécution, appliquer `docs/codex/chantier-model-routing.md`. Dans Claude Code, `CLAUDE.md` fait appliquer `docs/claude/chantier-model-routing.md` et exclut la branche Codex, même après lecture d’AGENTS. Gemini/Mistral conservent leurs adaptations communes sans équivalence de modèles inventée. La seule présence d’un fichier d’entrée ne détecte pas l’assistant. Si le contexte d’entrée reste indéterminé, appliquer les règles communes sans recommandation spécifique ni questionnaire sur l’assistant. Les instructions prioritaires du client prévalent.

## Cadrage et langues

Q6 propose d’abord les trois plateformes ensemble. Après Non, poser successivement les trois questions natives Oui/Non du cadrage canonique : ordinateur, tablette, téléphone mobile. Un seul appareil par appel ; attendre, sauvegarder et relire chaque réponse avant la suivante. Ce parcours remplace les cases à cocher et sélecteurs cumulatifs. Réutiliser les réponses connues ; à la reprise, ne poser que la prochaine question manquante.

Démarrage d’un nouveau projet : premier message visible exactement égal à l’accueil à deux lignes défini dans le cadrage canonique, sans préambule technique. Ne pas ajouter de texte répétitif « Autres demandes ou précisions » aux questions : utiliser la saisie native sans la simuler. Toute question de premier niveau, y compris Q6 appareils, utilise les choix natifs ; Q6 suit le parcours successif ci-dessus ; un autre format peut être précisé dans la saisie native, sans question supplémentaire systématique. Les compléments de contenu restent conversationnels. Avant la question suivante, sauvegarder et relire le cadrage avec `scripts/project-intake.mjs` selon l’autorité canonique. Une demande de démarrage autorise ces seules écritures minimales dans le brief et l’état courant, avant l’accord de développement ; ne pas garder les réponses uniquement en mémoire. Ne jamais exécuter cet enregistrement dans le modèle pour le mainteneur.

Branchements du cadrage : Q7 Non passe directement à Q9 sans poser Q8. Q9 et Q10 sont des choix uniques natifs (Français / English / Français et English / Autre combinaison), pas une question ouverte justifiée par l’absence de multi-sélection. La traduction de contenus existants n’est proposée que pour des langues documentaires supplémentaires autres que fr/en avec traductions réellement manquantes ; jamais pour Français, English ou les deux seuls. Préserver les réponses déjà reçues.

Pour une question de cadrage en attente, suivre le protocole de décisions : garder le tour actif après l’appel asynchrone grâce à un outil d’attente interruptible, sans message final même vide. Les attentes expirées ne valent pas réponse et sont renouvelées. Si le client ne permet pas cette attente, poser la question en message final normal sans sélecteur asynchrone. Aucune branche ni opération indépendante avant la réponse explicite. Cette règle ne change pas la poursuite des mandats déjà définis.

Pour un nouveau projet, suivre [Cadrage initial](docs/agents/project-intake.md), autorité unique des questions : entrée brief/guidage/démonstration, puis Q1–Q10 et choix GitHub conditionnels seulement si les réponses manquent. Les langues de l’application sont Q9 ; la documentation/Storybook est Q10, jamais une question préalable obligatoire pour une demande informative. Les collectes de contenu de second niveau se font dans un message normal ; les arbitrages à options connues restent natifs. Lire le brief et le suivi avant toute question ou reprise ; ne pas réinitialiser un projet dans une nouvelle conversation. Appliquer [Langues du projet](docs/agents/languages.md) pour les préférences et traductions. La démonstration propose Q1–Q6, trois appareils, puis reprend à Q7 après accord. Aucun développement avant validation de la synthèse complète.

## Démarrer un nouveau projet

Une demande telle que « Initialise un nouveau projet Atlas » ouvre le [parcours de démarrage](docs/product/project-start.md), sous le rôle [Builder](agents/builder.md) : initialisation du projet, cadrage de la première version, conception et développement, puis revue de la première version. [initialize-project](skills/initialize-project/SKILL.md) assure la préparation technique et son suivi ; les procédures existantes prennent le relais. Le nom suffit pour analyser la préparation et en proposer le périmètre ; attendre sa validation avant l’initialisation effective. Recueillir l’intention au cadrage, sans reposer les questions déjà résolues ni inventer les fonctionnalités. Réaliser seulement le périmètre suffisamment défini et autorisé ; une demande limitée à l’initialisation technique s’arrête à cette séquence.

Charger initialize-project seulement pour un nouveau projet ou la reprise explicite d’une initialisation technique incomplète. Pour un projet déjà initialisé, préserver son état, suivre son mandat courant et reprendre la séquence manquante ; ne pas relancer la préparation technique lors d’une correction ou d’une nouvelle conversation. Une demande limitée à la préparation reste documentaire. Si la découverte native des skills est absente, lire les fichiers indiqués explicitement, sans prétendre avoir prouvé leur activation native.

## Autorités et périmètre

Interpréter les sources dans cet ordre : brief, spécifications, références visuelles réellement fournies, design system documenté, architecture, code/migrations, tests. Ne pas résoudre silencieusement leurs contradictions. Les spécifications de l’exemple de projets ne définissent pas à elles seules le périmètre du kit complet.

Une demande de modification suit le traitement ci-dessous avant exécution. Une préparation seule produit la réponse de préparation ; les écritures documentaires demandées suivent la même règle de validation, sans installation, implémentation ni lancement de services. Une roadmap n’autorise pas un chantier. Documenter une hypothèse minimale et réversible ; demander un arbitrage préalable si le choix affecte matériellement produit, données, sécurité, coût, ressource externe ou réversibilité.

Les chemins se résolvent depuis la racine réelle du kit ou le fichier qui les utilise, jamais depuis un nom de dossier imposé. L’alias `app` ou `application` désigne ce kit complet ; il ne désigne pas uniquement le sous-dossier technique `app/` ni le seul exemple web.

## Traitement des demandes et validation de l’exécution

Analyser chaque demande avec une inspection ciblée en lecture seule. Distinguer information, modification nouvelle et continuation d’un travail déjà validé. Avant validation, présenter l’analyse dans la conversation : ne modifier ni code, ni documentation, ni configuration, ne pas installer, démarrer de service ou lancer de contrôle susceptible de modifier l’état. Une demande informative reçoit directement sa réponse, sans validation d’exécution.

Pour une modification dépassant le seuil mineur, exposer le résultat observable prévu, le périmètre, les limites ou hypothèses utiles et les vérifications envisagées, puis demander la validation de l’exécution. Une demande initiale de réalisation ne remplace pas cette validation de la proposition concrète. Une validation explicite déjà donnée sur cette proposition suffit : ne pas la redemander. La validation couvre réalisation, vérifications, documentation et corrections nécessaires dans le périmètre annoncé ; elle ne vaut ni acceptation du résultat ni mandat de publication ou de déploiement.

Une modification est mineure seulement si l’intention est claire, l’effet localisé, le retour arrière simple, sans modification de comportement, données, permissions, dépendances ou configuration d’exécution. Une couleur locale peut convenir ; un token partagé qui affecte plusieurs vues exige d’en examiner la portée. En cas de doute matériel, présenter la proposition et attendre la validation.

Exécuter directement une modification mineure, sans message préalable ni demande de validation, puis vérifier et confirmer brièvement le résultat ou l’échec. Dans Codex et Claude Code, cette exception suppose que le couple modèle/niveau recommandé reste identique à la dernière recommandation connue pour ce travail. Si ce couple change, ou si aucune recommandation précédente n’est connue, l’annoncer avant l’exécution et attendre la validation, même pour une petite modification. Les permissions natives et conditions d’arrêt restent prioritaires.

Une précision ou opération nécessaire dans un périmètre déjà validé ne relance pas une validation à chaque étape. Demander une nouvelle validation si le périmètre ou les conséquences changent matériellement ; dans Codex et Claude Code, un changement de configuration recommandée impose également une pause avant le travail concerné. Poursuivre les parties indépendantes déjà autorisées. Ne pas interpréter le silence ou le temps écoulé comme un accord.

Cette règle de traitement est commune aux assistants. Les recommandations nommées concernent Codex et Claude Code selon leurs politiques propres ; pour Gemini, Mistral et les autres assistants, ne pas inventer d’équivalence de modèle ou de niveau.

## Questions, vérifications et décisions utilisateur

Appliquer le [protocole commun](docs/agents/user-decisions.md) dès qu’une décision utilisateur est nécessaire : contexte et périmètre, question explicite, choix natifs si disponibles et autorisés, avec la saisie libre native du client, sans légende répétitive. Utiliser un repli textuel sans imposer d’interface ou de réglage supplémentaire.

Pour les revues portant sur un parcours observable, proposer **Manuel · Automatisé — E2E · Combiné**, avec couverture et recommandation motivée. Conserver mode et couverture pour les retests du même périmètre. Les E2E ne remplacent ni la revue design/technique/sécurité ni les contrôles obligatoires ; une recette manuelle attend le retour de l’utilisateur. Distinguer choix du mode, validation d’exécution, résultat des vérifications et acceptation du jalon.

Ne pas créer de confirmations supplémentaires : réponse informative directe, exception mineure préservée, accord explicite déjà reçu réutilisé. Une note compatible précise le mandat ; une condition préalable ou modification matérielle impose d’ajuster la proposition avant exécution. Une contradiction entre choix et note nécessite clarification. Un silence, une présélection ou une expiration ne vaut jamais accord.

## Saisie de configuration confidentielle

Quand un accès ou un secret manque, appliquer le [parcours de saisie privée](docs/agents/private-configuration.md). Ne jamais demander sa valeur dans la conversation, une question native ordinaire ou un argument de commande. Expliquer les seuls champs nécessaires et leur usage, lancer le formulaire local livré, puis l’ouvrir dans un onglet navigateur Codex avec `open_in_codex` si cet outil est disponible et autorisé. Aucune lecture, capture ou automatisation du formulaire après saisie réelle. Le serveur local enregistre les valeurs sans les retourner à l’assistant ; ne vérifier ensuite que la présence des champs, jamais leur contenu.

Si ce parcours est indisponible ou refusé, utiliser le repli fichier : ouvrir directement `.env.local` dans un onglet fichier Codex avec `open_in_codex`, sans lecture de contenu par l’assistant ; sinon fournir un lien Markdown local correctement formé. Expliquer que les valeurs y sont visibles. Ne pas contourner un refus de permission. Le mandat de configuration n’autorise pas un envoi réel, un appel fournisseur, un redémarrage ni un déploiement ; vérifier leur autorisation propre. Aucun secret dans les preuves ou le kit neuf.

<a id="cible-daffichage-de-loomata"></a>

## Cible d’affichage de Whizam

Pour toute modification de Whizam et de ses outils, appliquer la [cible desktop uniquement](docs/product/loomata-workspace.md#plateformes-et-formats-pris-en-charge), décision 032 : ne pas concevoir de variante mobile ni ajouter d’exigence de qualification mobile. Définir les formats de fenêtres desktop utiles au chantier et préserver les contrôles clavier, focus et défilement. Les adaptations et tests mobiles historiques ne créent pas de support à maintenir ; leur suppression demande son propre mandat. Pour un projet dérivé, suivre les formats définis par son brief.

## Rôles, skills et assistants

Le kit fournit Builder, Design Reviewer, Technical Reviewer / QA et Security Reviewer, les skills communs du catalogue et les adaptations Codex, Claude Code, Gemini CLI et Mistral Vibe. PORT-03 conserve les preuves de leur intégration initiale ; les extensions suivent leurs propres preuves et la [décision de bibliothèque extensible](docs/decisions/002-dedicated-project-initialization.md). Chaque rôle, règle et skill garde une source canonique ; les adaptations exposent cette source sans copie indépendante à maintenir.

Le Builder réalise les changements dans le mandat. Les reviewers lisent et testent ; leur écriture est limitée aux rapports et artefacts isolés, sauf délégation explicite. Prévoir une revue design pour un parcours ou composant partagé, une revue technique pour logique/serveur/schéma/dépendance et une revue sécurité pour accès, secrets, permissions ou entrées externes. Une livraison rassemble les trois conclusions, avec couverture et limites.

Utiliser seulement les skills utiles. Exercer les rôles séquentiellement si la délégation est indisponible ou non autorisée, en déclarant « séquentiel, même agent, non indépendant ». Ne pas activer de sous-agent, fournisseur, installation globale ou accès supplémentaire sur la seule base d’un fichier. Aucun modèle particulier n’est imposé à tous les utilisateurs ; annoncer uniquement les capacités et versions effectivement vérifiées.

Le site de référence, les tests et Storybook fonctionnent sans compte IA ni clé de modèle. Les instructions et skills font néanmoins partie des sources à livrer ; leur présence n’en fait pas des dépendances d’exécution du site.

## Communication avec le designer

S’adresser à un designer numérique, sans supposer des connaissances de développement : employer les termes précis de conception (pages, parcours, contenus, composants, variantes, états, revue) et expliquer les effets concrets. Présenter la séquence, le résultat observable, les limites ou éléments provisoires et la prochaine action. Garder statuts internes, commandes, listes de fichiers et détail des contrôles dans le suivi lié ; ne pas imposer « En revue », « Doc updated », noms de tests ou builds dans le message. Les rendre disponibles sur demande ; expliquer tout échec et sa conséquence sans masquer l’incertitude.

Suivre les critères d’accès du [parcours](docs/product/project-start.md#4-revue-de-la-première-version) : présenter ensemble Application et Storybook — composants du projet à la première revue, après vérification du contenu convenu. Aucun accès à la démonstration ou au UI Lab présenté comme première version ; les URL de développement peuvent servir auparavant aux contrôles internes. Le projet dérivé retire les démonstrations de son parcours utilisateur selon la [procédure dédiée](docs/product/replacing-project-example.md), sans suppression implicite de données.

Prendre en charge les opérations techniques accessibles dans le mandat et les permissions. Pour expliquer comment arrêter ou relancer l’application, proposer une demande en langage naturel à adresser à l’assistant. Afficher les commandes seulement sur demande ou lorsqu’une intervention manuelle est nécessaire ; expliquer alors leur but, leur effet et où les exécuter. Si l’opération n’est pas accessible à l’assistant, indiquer la limite et guider l’utilisateur. Une proposition ou une explication n’autorise pas son exécution.

## Recommandations de modèle et de niveau

Charger seulement la politique correspondant au point d’entrée actif, sans questionnaire d’assistant. Les règles d’affichage et de validation de cette section sont communes à Codex et Claude Code. Les modèles et seuils sont propres à chaque politique ; aucune performance équivalente n’est présumée.

### Codex

Pour les échanges avec Codex, appliquer la [politique modèle/effort par chantier](docs/codex/chantier-model-routing.md) et sa [décision d’adoption](docs/decisions/003-qualitative-model-routing.md). Privilégier GPT-6.1 Sol, faible réservé au cadrage simple, moyenne au minimum pour le développement courant ; recommander davantage sur preuves des frontières, contrats et difficultés effectivement concernés. Aucun réglage élevé systématique ni équivalence avec d’autres modèles ; vérifier la disponibilité sans prétendre connaître la sélection effective du client.

### Claude Code

Appliquer la [politique Claude Code](docs/claude/chantier-model-routing.md) : Sonnet 5.5 privilégié, faible pour le cadrage simple, moyenne au minimum pour le développement courant, élevée au minimum pour les surfaces sensibles effectivement modifiées. Justifier très élevée, le recours à Opus 5.5 ou Max selon les difficultés constatées. La [décision 042](docs/decisions/042-assistant-choice-and-claude-routing.md) étend la méthode de décision, sans équivalence de performances ni activation automatique.

### Affichage et reprise

Afficher une recommandation courte à sa première occurrence pour le travail concerné, puis seulement si le couple modèle/niveau change : **Pour la suite : GPT-6.1 Sol · Moyenne — modification localisée.** ou **Pour la suite : Claude Sonnet 5.5 · Moyenne — modification localisée.** Selon l’assistant choisi, comparer à la dernière recommandation connue, pas à une sélection supposée du client. Une configuration identique ne se répète ni après chaque question, ni après une validation. Conserver périmètre validé et dernière recommandation dans le point de reprise utile ; si cette information manque, l’indiquer et présenter une recommandation initiale.

L’utilisateur choisit manuellement sa configuration. Pour un changement à exécuter, attendre la validation après une première recommandation ou son changement ; ne pas prétendre avoir changé le client. Une réponse informative reste directe et sans validation, avec une recommandation seulement si elle prépare une suite concrète. La justification détaillée reste dans le suivi utile après autorisation d’écriture. La [décision de révision](docs/decisions/041-request-validation.md) remplace l’affichage systématique après chaque question ; aucun fournisseur, sous-agent ou mode supplémentaire n’est activé.

## Réalisation et preuves

- Vérifier la racine de travail, la version Git lorsqu’elle existe, les changements préexistants et les fichiers concernés ; préserver tout travail ambigu. L’exécution web ne nécessite pas de dépôt Git.
- Préparer une tranche courte avec objectif, dépendances et critères ; implémenter seulement le mandat, contrôler les chemins affectés et corriger les échecs dans ce périmètre.
- Suivre la stack documentée ; justifier une évolution significative avant son implémentation. Figma reste conditionnel, aucun backend ou framework supplémentaire implicite.
- Les [autorités du design system](src/design-system/authority/README.md) séparent les tokens canoniques JSON DTCG des règles, présentations et recettes CSS en YAML. Appliquer la [politique automatisée](docs/design-system/policy.md) à trois catégories, les variantes explicites et l’autonomie des tokens de composants. Régénérer les dérivés, sans les éditer ; maintenir les stories et principes concernés.
- Garder données et ressources de test isolées, configurations privées hors Git et caches locaux ignorés ; ne jamais publier de secret, donnée personnelle ou configuration propre à un poste.
- Appliquer les [procédures de déplacement et de sauvegarde](README.md#renommer-déplacer-ou-transmettre). Préserver l’identité Compose pour déplacer une même instance ; ne pas supprimer de volume implicitement.
- Choisir les contrôles du README selon le changement. Consigner version, commande, résultat et limites ; un contrôle non exécuté reste non vérifié, un échec obligatoire bloque la qualification concernée.
- Actualiser spécifications, tests, stories et documentation directement affectés. Garder une source par décision et des renvois internes suffisants pour reprendre le projet sans historique de conversation ni connaissance de sa fabrication.

## Suivi, acceptation et transmission

La ROADMAP.md et le docs/project-state.md fournis sont à initialiser au démarrage d’un projet réel, avec son brief, son périmètre et son mandat ; ne pas préremplir ses tâches avec la construction du starter. Conserver les statuts dans ROADMAP.md, le point de reprise court dans docs/project-state.md, les préparations dans docs/work-items, décisions dans docs/decisions et preuves dans docs/reviews, avec un premier contenu utile. Distinguer observations, hypothèses et propositions. Un jalon techniquement qualifié reste En revue jusqu’à l’acceptation humaine ; une revue automatisée ou un commit ne la remplace pas.

Rédiger la documentation et les contenus pédagogiques selon le [choix linguistique du projet](docs/agents/languages.md), les identifiants techniques et messages de commit en anglais. Respecter les noms officiels des technologies. Suivre les conventions Git locales documentées, sans réécrire l’historique ni absorber des travaux préexistants. Publications, CI distante, services externes et déploiements nécessitent un mandat explicite.

Consigner dans le suivi utile cible, tâche/statut, version, fichiers, contrôles réellement exécutés, décisions/hypothèses, Doc updated ou No doc impact, risques et reprise. Ne pas recopier cette liste technique dans le message au designer : appliquer la règle de communication ci-dessus et lier la preuve utile. La passation doit permettre une reprise sans conversation préalable ; les limites humaines ou de compatibilité restent documentées, et leur conséquence est expliquée au designer lorsqu’elle conditionne la suite.

Appliquer la [politique Git par lots](docs/conventions.md#git-batches) pour les branches, le cumul des retouches, les commits automatiques et l’intégration locale ; distinguer intégration et acceptation humaine. Cette politique de travail direct ne modifie pas le moteur workspace intégré.

## Conditions d’arrêt

Conserver un point de reprise et demander seulement l’arbitrage nécessaire en cas de changement matériel de périmètre, contradiction d’autorités, technologie non approuvée, secret/accès absent, opération destructive ou difficilement réversible, travaux ambigus impossibles à isoler ou contrôle obligatoire invérifiable après diagnostic. Respecter les permissions natives des outils ; ne pas contourner un refus ni retirer une protection pour poursuivre.

## Politique courante du design system — DS-AUTO-01

Appliquer la [politique](docs/design-system/policy.md), qui remplace pour ce kit les prescriptions historiques de couche sémantique, de cinq responsabilités de tokens et d’inspecteur. Primitives, tokens de composant et tokens locaux de page sont les trois catégories actives. Les règles historiques contradictoires citées ailleurs sont conservées uniquement pour leur version. Les différences de composants sont des variantes explicites ; aucune exception visuelle d’instance. L’assistant maintient sources et exemples, la génération déterministe publie les dérivés, et Storybook permet la consultation sans writer ni connexion IA. Exécuter synchronisation, contrôles de péremption et tests pertinents après changement.

## Documentation de l’application

Le [portail documentaire](docs/documentation.md) fait partie du kit autonome. Maintenir les Markdown uniques avec le changement produit, distinguer guides actifs, documents du projet et historiques exclus dans le registre et vérifier `docs:build`, `docs:check` et les liens. Le conteneur ne reçoit que des entrées publiques préparées, jamais le parent ou les configurations privées. La première revue présente Application, Storybook et Documentation après vérification réelle ; la présence d’un fichier Markdown ne prouve pas que son rendu ou sa recherche fonctionne.

Pour Storybook, suivre l’[organisation et la publication du projet](docs/design-system/architecture.md#organisation-et-publication-storybook) : structure permanente, registre explicite des seuls éléments créés ou adoptés pour le projet, aucun exemple par défaut. Maintenir classement, variantes/états et tokens avec chaque création, adoption ou retrait ; ne pas réactiver globalement le socle.

À la reprise et après chaque demande de modification terminée, utiliser l’aide `scripts/git-batch.mjs` selon les conventions pour retrouver le lot et évaluer sa clôture ; ne pas confondre un déclencheur avec un contrôle réussi.

## Sources sur GitHub

Appliquer le [parcours GitHub](docs/github-publication.md) et charger [publish-github-project](skills/publish-github-project/SKILL.md) pour publier, mettre à jour ou suspendre les envois. Les questions conditionnelles GitHub suivent Q10 avant la synthèse ; ne pas les poser rétrospectivement sans besoin. Leur choix n'autorise aucune mutation distante. L'accord sur le récapitulatif concret peut autoriser les envois suivants au même périmètre. À la reprise, vérifier le statut local ; après chaque commit de lot intégré, appliquer le mode actif sans changer les seuils ni créer un hook permanent. Les secrets GitHub utilisent le parcours privé dédié, jamais l'environnement applicatif. Aucun mandat de publication du kit n'est déduit de ces instructions.
