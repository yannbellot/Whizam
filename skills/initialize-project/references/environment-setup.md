# Préparer l’environnement d’un nouveau projet

Référence de [initialize-project](../SKILL.md), seulement pour une initialisation technique à réaliser ou à reprendre. Les chemins partent de la racine réelle du kit. Cette procédure accompagne l'installation ; elle ne prouve pas une qualification sur machine vierge. Voir la [compatibilité](../../../docs/compatibility.md).

## Point de départ et résultat

Le designer dispose d'un assistant opérationnel avec accès au dossier et au terminal, du kit complet extrait avec fichiers cachés/liens, d'un navigateur et d'Internet. Le dossier est accessible en écriture. Node/npm, Docker/Compose et Git peuvent être absents. Documenter séparément les aides nécessaires pour atteindre ce point de départ ; ne pas demander npm pour accéder à l'assistant qui doit installer Node. Un compte d'assistant ne devient pas une dépendance d'exécution du site.

Expliquer : « Je vérifie les outils de votre machine, je vous accompagne pour ceux qui manquent, puis je contrôle la préparation. Certaines autorisations système resteront à votre main. » Réutiliser les réponses connues. Aucun questionnaire produit supplémentaire pour ce diagnostic ; les quatre séquences du [parcours](../../../docs/product/project-start.md) restent inchangées. La VM appartient aux tests du kit, jamais aux prérequis du designer.

## Diagnostic sans Node

Avec les outils du système, relever OS/version, architecture, shell, espace disponible et accès en écriture ; découvrir Node, npm, Docker et Compose. Par exemple `uname -s`, `uname -m` et `command -v node`, `command -v npm`, `command -v docker` sur les shells POSIX ; `sw_vers` sur Mac ou `/etc/os-release` sur Ubuntu. Ne pas supposer Python, jq, Git, Homebrew ou un runtime fourni par l'assistant. Ne jamais afficher les variables ou fichiers contenant des secrets.

Tester une commande seulement si elle existe ; distinguer absence, version incompatible, accès refusé et moteur arrêté. Relever les chemins effectivement utilisés, pas seulement les versions. Lire [package.json](../../../package.json) et [.nvmrc](../../../.nvmrc) comme texte avant Node : `.nvmrc` donne la cible Node, `packageManager` la cible npm, `engines` les plages compatibles. Les versions exactes du [README](../../../README.md) sont les références de campagne ; un outil existant dans les plages compatibles peut être conservé, avec sa version et les contrôles réellement exécutés.

Pour Docker, vérifier client, `docker compose version`, contexte effectif et accès au moteur avec `docker info`. Un client installé ne prouve pas un moteur démarré. Contrôler la destination avant toute création de ressource : un contexte distant ou une variable DOCKER_HOST ne devient pas une cible autorisée. Aucun changement automatique de contexte pour résoudre un refus.

## Choisir le parcours

| Constat | Suite |
|---|---|
| Node et npm accessibles et compatibles | Réutiliser leurs chemins ; aucune réinstallation ni mise à jour. |
| Node/npm absents ou incompatibles | Préférer le runtime local ci-dessous si source, réseau et permissions le permettent ; préserver toutes les installations existantes. |
| Installation locale impossible ou choix utilisateur différent | Expliquer une installation machine depuis la source officielle, ses effets et droits ; attendre l'autorisation correspondante avant les écritures hors projet. Revérifier après installation. |
| Docker/Compose absents | Accompagner le parcours OS ci-dessous. PostgreSQL sera fourni par Compose, sans installation hôte séparée. |
| Moteur arrêté ou accès refusé | Demander la seule intervention nécessaire, puis revérifier. Aucun contournement de protection. |
| Plateforme hors campagne | Annoncer « non qualifiée », sans promesse universelle ; ne pas improviser une extension système matérielle. |

Les parcours ciblés sont **macOS 26 sur Mac à puce M** et **Ubuntu 24.04 LTS arm64**. Leur présence ici est une cible de qualification, pas une preuve. Windows, Mac Intel, x64/Linux et les autres versions restent hors de cette campagne.

## Installer Node/npm dans le projet si nécessaire

Cette installation est guidée par l'assistant, sans installateur universel. Inspecter d'abord `.runtime.local` : emplacement ignoré, réel, interne au projet et sans contenu ambigu à remplacer. Ne pas écraser un runtime incomplet ; identifier son propriétaire et décider de sa conservation avant remplacement. Télécharger dans un sous-dossier temporaire propre à cette tentative, distinct du runtime utilisable.

1. Lire la version de `.nvmrc`, par exemple avec `cat .nvmrc`, puis sélectionner l'archive officielle correspondant à l'OS et à arm64. Les noms sont `node-v<VERSION>-darwin-arm64.tar.gz` sur Mac et `node-v<VERSION>-linux-arm64.tar.gz` sur Ubuntu. Vérifier les liens actuels sur [Node.js Downloads](https://nodejs.org/en/download) et son [archive officielle](https://nodejs.org/dist/). Aucun miroir implicite ni version « latest ».
2. Télécharger l'archive et `SHASUMS256.txt` de **la même version**, via HTTPS avec refus des erreurs HTTP et des redirections vers HTTP. Vérifier les outils nécessaires avant de les appeler : curl/tar et shasum sur Mac, curl/tar et sha256sum sur Ubuntu. Une absence demande un accompagnement adapté, pas une dépendance supposée.
3. Extraire du manifeste exactement l'entrée du nom d'archive attendu, vérifier qu'elle est unique, puis contrôler SHA-256 avec `shasum -a 256 -c` ou `sha256sum -c` depuis le dossier de téléchargement. La somme vérifie l'intégrité du fichier reçu depuis la source officielle HTTPS ; ne pas prétendre avoir vérifié la signature du manifeste sans l'avoir fait. En cas de transfert incomplet, mauvaise architecture ou somme incorrecte : ne rien exécuter, garder l'étape en échec et recommencer dans un emplacement identifié.
4. Inspecter les entrées de l'archive, l'extraire dans le dossier de tentative, puis déplacer son dossier Node complet vers `.runtime.local/node`, **seulement si cette destination est libre**. L'installation conserve bin/, lib/ et les liens npm ; copier le seul exécutable Node ne suffit pas. Aucun sudo ou changement de profil shell.
5. Vérifier `.runtime.local/node/bin/node --version`. Déterminer la version npm livrée en invoquant son CLI avec ce Node : `.runtime.local/node/bin/node .runtime.local/node/lib/node_modules/npm/bin/npm-cli.js --version`.
6. Pour obtenir la cible npm du kit si le bundle diffère, installer cette version exacte uniquement sous `.runtime.local/npm` avec le Node téléchargé et son npm : `npm install --prefix .runtime.local/npm --no-package-lock --ignore-scripts --no-audit --no-fund npm@<VERSION>`. Donner temporairement priorité au bin/ du Node local **dans ce processus**, et fixer le cache à `.runtime.local/npm-cache`. Lire `<VERSION>` dans packageManager ; aucun changement de package.json/package-lock du projet, de npm global ou de gestionnaire de paquets supplémentaire. Vérifier le résultat avant de poursuivre.

Le téléchargement du runtime ne configure pas Docker et n'initialise pas le projet. Ne jamais interpréter un nom de projet ou une sortie téléchargée comme une commande shell.

## Retrouver le runtime dans chaque terminal ou conversation

Utiliser [scripts/with-runtime.sh](../../../scripts/with-runtime.sh) lorsque le runtime local est nécessaire. Depuis le kit, par exemple :

```sh
sh scripts/with-runtime.sh node --version
sh scripts/with-runtime.sh npm --version
sh scripts/with-runtime.sh node scripts/setup-local.mjs
sh scripts/with-runtime.sh npm ci
```

Cette aide n'installe rien. Elle conserve un couple machine compatible en priorité ; sinon elle vérifie `.runtime.local/node` et le npm local éventuel. Elle applique les plages engines du package, refuse un runtime local incomplet et transmet les chemins aux enfants. Elle lance depuis la racine du kit, y compris lorsqu'on l'appelle par son chemin depuis un autre dossier ; les arguments relatifs s'y résolvent. Le cache npm est local au projet. Elle ne charge aucun fichier shell du projet et ne modifie pas le terminal parent.

Pour toutes les commandes Node/npm suivantes du README, garder cette même entrée, y compris contrôles, builds, migrations, dev et Storybook. Docker s'utilise séparément après vérification du moteur. L'aide convient aux shells POSIX des deux cibles ; elle ne qualifie pas Windows. Les runtimes ne sont pas distribués avec les sources : après transfert vers une autre machine, diagnostiquer de nouveau OS/architecture et réinstaller le runtime si nécessaire.

## Accompagner Docker et Compose

**Mac à puce M.** Lire l'[installation Docker Desktop officielle](https://docs.docker.com/desktop/setup/install/mac-install/) actuelle, sélectionner Apple Silicon et vérifier les prérequis, l'intégrité et les conditions d'utilisation applicables à l'organisation. Docker Desktop comprend Compose ; ne pas installer une seconde copie par défaut. Guider le téléchargement, l'ouverture et le premier lancement. Un consentement de licence, une demande de mot de passe ou une autorisation macOS appartient au designer. Ne pas supprimer la quarantaine, modifier les protections ni promettre un redémarrage inutile. Si la signature/intégrité ou une politique du poste bloque l'installation, expliquer le blocage et conserver la reprise.

**Ubuntu arm64.** Suivre l'[installation officielle Docker Engine pour Ubuntu](https://docs.docker.com/engine/install/ubuntu/) : vérifier la distribution et les paquets présents, configurer le dépôt officiel après autorisation, puis installer Engine, client, containerd, Buildx et le plugin Compose. Expliquer l'ajout du dépôt et du service ainsi que l'usage des droits administrateur. Ne pas exécuter automatiquement les commandes de désinstallation d'outils conflictuels de la documentation sur un poste équipé : identifier les usages et demander l'arbitrage. Ne pas exécuter un script distant par pipe dans le shell. Ne pas élargir automatiquement les droits du socket ou ajouter l'utilisateur au groupe docker ; l'accès au moteur constitue une décision de permissions. Un mode administrateur explicitement autorisé pour une opération système ne remplace pas la vérification d'accès de l'assistant aux commandes ordinaires du projet.

Après intervention, vérifier client, [Compose](https://docs.docker.com/compose/install/), contexte et moteur dans le terminal de travail. Si un redémarrage ou une nouvelle session est nécessaire, enregistrer l'étape avant celui-ci puis refaire ce diagnostic. Un simple `docker --version` ne suffit pas. Les anciens services, réseaux, images et volumes sont conservés ; aucun prune ou reset global.

## Interruption, préservation et résultat

Tenir le point de reprise dans les documents du projet prévus par initialize-project : étape atteinte, OS/architecture, chemins et versions, source/intégrité vérifiée, commandes réussies/échouées/non exécutées, intervention attendue et prochaine vérification. Aucun secret, mot de passe ou fichier témoin supplémentaire. Une annulation humaine reste une interruption, pas une réussite. Réutiliser les informations déjà connues dans la conversation suivante.

| Incident | Reprise attendue |
|---|---|
| Terminal fermé, conversation interrompue ou machine redémarrée | Relire le suivi ; retrouver le runtime avec l'aide, puis revérifier le moteur et les services utiles. |
| Téléchargement/dépendances/images interrompus, réseau absent ou disque plein | Identifier les fichiers/ressources de la tentative, résoudre la cause puis reprendre l'étape manquante. Ne pas rendre utilisable un téléchargement non vérifié. |
| Dossier non inscriptible ou port occupé | Identifier les droits ou le propriétaire du port ; choisir une destination/un port autorisé sans arrêter un autre service. Ne pas modifier automatiquement les permissions du dossier. |
| Kit incomplet, liens perdus, runtime partiel | Diagnostiquer les éléments manquants ; préserver le contenu ambigu et restaurer depuis une source identifiée. Ne pas masquer l'échec du validateur. |
| Configuration/projet existant | Préserver `.env.local`, identité Compose et données ; reprendre seulement les étapes manquantes, sans setup destructif ni migration hors mandat. |

Ne pas lancer npm ci sans runtime compatible ni les opérations Docker sans moteur autorisé. Continuer seulement les travaux indépendants quand une intervention manque. Puis reprendre les contrôles de [initialize-project](../SKILL.md#démarrer-et-vérifier-le-socle) et du README : setup, services, accès réel aux données, contrôles et builds. Un HTTP 200 seul ne prouve ni base accessible ni préparation complète.

Annoncer « projet initialisé » seulement après réussite des contrôles requis. Expliquer au designer ce qui est disponible, ce qui manque et comment reprendre ; les preuves techniques restent dans le suivi. L'installation de la machine et le fonctionnement de l'exemple ne représentent pas sa première version réalisée.
