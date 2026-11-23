# Contrat commun des rôles et skills

Les chemins des procédures, rôles et adaptations partent de la **racine réelle du kit**, où se trouve AGENTS.md, même lors d’un chargement par lien symbolique. Toutes leurs références nécessaires sont internes au kit. Lire les [instructions du kit](../../AGENTS.md) et seulement les autorités utiles à la mission ; aucune séquence obligatoire de toute la bibliothèque.

## Racine des sources et périmètre d’une mission

Distinguer la racine de la bibliothèque chargée de celle du projet visé par le mandat. Dans un usage autonome, elles coïncident normalement. Si un autre projet utilise cette bibliothèque, il fournit ses propres instructions et autorités ; cela ne l’autorise pas à modifier le kit. Les livrables, commandes, roadmap, état courant, décisions et preuves appartiennent au projet ciblé. Ne pas écrire dans le parent sur la seule base d’un chemin de procédure.

Les [conventions](../conventions.md) définissent le suivi interne. Le [périmètre du kit](../product/starter-kit.md) décrit le starter complet ; le brief de projets décrit son seul exemple. Lorsqu’une mission couvre plusieurs racines explicitement autorisées, annoncer chacune et répartir les livrables sans duplication. Un nom de dossier n’est pas un identifiant d’environnement.

## Entrée d’une mission

Appliquer le [cadrage initial](project-intake.md) : questions conditionnelles, second niveau en conversation et reprise depuis le brief/suivi. Ne pas demander quel assistant est utilisé ; suivre sa politique par point d’entrée. Recueillir les langues documentaires en Q10 seulement si elles manquent, selon [Langues du projet](languages.md).

But utilisateur, racine du projet, référence de tâche/brief/specification, périmètre/exclusions, version ou diff, outils réellement disponibles et résultat attendu. Si un élément manque, choisir une hypothèse limitée et réversible dans le mandat ; une conséquence matérielle suit les conditions d’arrêt d’AGENTS. Une analyse/préparation seule n’autorise pas l’implémentation. Le [traitement des demandes](../../AGENTS.md#traitement-des-demandes-et-validation-de-lexécution) précède les écritures, y compris documentaires, et l’exécution des procédures : une proposition non encore validée reste dans la conversation. Une instruction de skill ne dispense pas de cette validation ; les opérations et corrections déjà couvertes par un périmètre validé ne la redemandent pas.

Les choix, validations d’exécution, retours de recette et acceptations suivent le [protocole commun](user-decisions.md) : choix natifs autorisés et instruction complémentaire facultative, repli texte, aucune question répétée inutile. Une note contradictoire ou conditionnelle ne vaut pas accord sans réserve.

## Exécution et preuves

Le Builder choisit les skills, réalise le changement et ferme les contrôles techniques. Un reviewer lit/teste ; il n’édite que son rapport et ses artefacts isolés sauf délégation explicite. Tout test identifie sa cible fictive et ses limites. Déclarer un outil indisponible ou un contrôle non exécuté ; ne jamais inventer capture, Figma, résultat, persistance ou compatibilité.

Mode natif seulement si disponible et autorisé ; sinon adopter un rôle à la fois dans le fil, marquer **séquentiel, même agent, non indépendant**. Un changement applicatif par un reviewer ne valide pas sa propre correction. Sous-agents, modèles, ressources externes et publications gardent leurs autorisations existantes ; aucun fournisseur, réglage global ou permission supplémentaire implicite.

Les guides actifs sont consultables dès le premier démarrage Zensical. Le registre `config/documentation/catalog.json` sépare guides (`guide`), documents du projet (`project`) et historiques non publiés (`history`). Documentation designer contient Suivi de projet avec État courant, Roadmap et les étapes réelles ; Documentation technique accueille les références spécialisées. Le [Guide d’utilisation](../guide-whizam/index.md), première rubrique après Accueil, avant Documentation designer et Documentation technique, décrit le parcours pédagogique sans dupliquer les autorités ni le suivi. Classer les nouveaux documents et leur étape dans ce registre selon le [guide documentaire](../documentation.md). Ne pas rétablir un portail vide ni publier les historiques du kit. Les fichiers privés et chemins hors kit restent exclus.

## Sortie commune

Le suivi ou rapport technique conserve projet/racine, référence/version et rôle, observation/hypothèse/proposition, résultat ou livrable, commandes/constats et limites, anomalies classées (bloquante ou réserve motivée), documentation affectée et prochaine action. Pour une revue : conclusion satisfaisant / avec réserves / bloquant et besoin de retest. Réutiliser la fiche ou preuve existante ; ne pas fabriquer un rapport par skill systématiquement.

Le message au designer suit la [communication définie dans AGENTS](../../AGENTS.md#communication-avec-le-designer), sans reprendre ce format technique. Pour un démarrage, le Builder applique les séquences et critères du [parcours](../product/project-start.md) ; un contrôle d’environnement réussi ne prouve pas une première version réalisée. Les échecs et limites qui conditionnent la suite restent expliqués.

Les statuts et preuves se rangent chez le propriétaire du changement. Le suivi courant pointe vers version, blocage et prochaine tranche. Les [références de pratique](practice-history.md) décrivent un héritage daté et des procédures locales ; elles ne sont pas les destinations des nouveaux chantiers ni une nouvelle acceptation humaine.

## Validation de la bibliothèque

Depuis la racine du kit, après npm ci : `npm run validate:agent-kit` ou `node scripts/validate-agent-kit.mjs`. Le contrôle vérifie la complétude déclarée par le catalogue, les sources canoniques, ressources requises déclarées, frontmatters et adaptations internes. Le nombre attendu décrit la livraison courante, sans plafond universel ; toute extension actualise le catalogue et les expositions selon la [décision 002](../decisions/002-dedicated-project-initialization.md). Pendant une construction partielle seulement, `--partial` ne qualifie pas le catalogue complet. La validation structurelle ne prouve ni efficacité ni découverte native ; suivre les [adaptations](adapters.md) et la [matrice](../compatibility.md) pour les essais effectifs.

## Langue documentaire

Appliquer le [cadrage initial](project-intake.md) : questions conditionnelles, second niveau en conversation et reprise depuis le brief/suivi. Ne pas demander quel assistant est utilisé ; suivre sa politique par point d’entrée. Recueillir les langues documentaires en Q10 seulement si elles manquent, selon [Langues du projet](languages.md).

Exception de cadrage : la demande explicite de démarrage autorise immédiatement les écritures minimales de réponses et d’accueil, sans initialisation technique ni développement. Utiliser l’outil de sauvegarde et relecture avant chaque question suivante selon le [cadrage canonique](project-intake.md). Cette exception ne vaut aucune autre autorisation.
