# PORT-03 — Intégrer le kit d’agents dans l’app autonome

**24 octobre 2026 — En revue : qualification technique acquise, acceptation humaine différée. Mandat de réalisation exécuté après la préparation GOV-02.** Cible principale : app ; coordination lab limitée aux accès à la bibliothèque, renvois, contrôles et suivi de fabrication. Rattachement : complément J4/J5, autonomie du kit et critères REC-09/10/12/15 du cahier des charges de fabrication. Voir le [périmètre produit](../product/starter-kit.md), les [instructions de l’app](../../AGENTS.md) et la [roadmap](../../ROADMAP.md).

## Objectif et limites du mandat actuel

Livrer les quatre rôles, vingt skills et adaptations dans la racine autonome du kit, avec leurs contrats, contrôles et références utiles. Une extraction du seul dossier doit permettre leur lecture et leur validation sans fichier du lab. Conserver l’autonomie du starter web, son design system et ses données lors des renommages/déplacements.

Le mandat actuel autorise l’intégration, ses corrections, les contrôles locaux, les tests sur ressources fictives isolées et la documentation. Il n’autorise aucun achat, installation globale, publication ou appel fournisseur supplémentaire. La préparation précédente est conservée ci-dessous comme plan de réalisation. L’AGENTS de l’app et la documentation de périmètre ont été créés par la correction documentaire préalable GOV-02.

Exclusions de l’intégration : changement fonctionnel ou visuel du site, changement de stack/schéma, orchestrateur, bibliothèque canonique dupliquée, réglage global de l’hôte, publication, CI distante, nouvel achat/compte ou inférence fournisseur implicite. La formation et les archives du lab restent hors kit sauf sélection explicite d’un document utile à sa reprise.

## Inventaire préparatoire et dépendances — historique du plan

Inspection en lecture seule sur la base de fabrication `80fadf67f352c21f9686b75625e94461b553bb5e`, avant correction GOV-02. Les chemins source ci-dessous partent de la racine de fabrication ; les destinations partent de la racine du kit. Leur mention décrit une migration future, pas une dépendance d’exploitation au parent.

| Élément constaté | Écart à traiter dans PORT-03 |
|---|---|
| `agents/` : quatre Markdown de rôles | Transférer les sources ; adapter les références à l’AGENTS et au contrat internes, sans imposer la distinction lab/app aux projets dérivés. |
| `skills/` : vingt SKILL.md, README et catalog.json | Transférer une seule bibliothèque ; corriger les mentions de racine lab et références de pratique. |
| `.agents/skills/` et `.claude/skills/` : quarante liens relatifs vers les vingt sources | Reconstituer ou déplacer les liens internes ; contrôler leurs cibles réelles après extraction, renommage et déplacement. |
| `CLAUDE.md`, `GEMINI.md` | Transférer et adapter leurs lectures à l’AGENTS livré. L’usage actuel de Codex au lab ne remplace pas ces cibles de l’app. |
| Mistral Vibe : entrée documentée par lecture d’AGENTS et exposition `.agents/skills/` | Préserver le mode documenté et ses limites ; ne pas inventer un fichier de configuration ni déclarer une découverte native non testée. |
| `docs/agents/skill-contract.md`, `docs/agents/adapters.md`, `docs/compatibility.md` | Intégrer les contrats/procédures utiles et une matrice locale avec versions, modes et réserves ; retirer les obligations de retour au lab. |
| `scripts/validate-agent-kit.mjs` | Le script actuel calcule la racine du lab et charge YAML via `application/package.json` ; le rendre local au kit et exposer une commande cohérente. Aucun script modifié dans la préparation. |
| `skills/catalog.json` | Le champ `contract`, les rôles, sources et champs `practice` sont validés comme fichiers existants. Quatorze références de pratique distinctes pointent vers décisions 005/006/007, documents produit/DS et preuves P1/P2/P3. Prévoir des références locales utiles, versionnées, sans copier tout l’historique. |
| `application/package.json`, README, exclusions Docker/format/lint | Le package actuel n’a pas de commande `validate:agent-kit`. Vérifier l’exposition des contrôles, les scans de dossiers cachés et l’impact des fichiers livrés sur le build/contexte Docker sans changer les dépendances runtime. |
| Instructions et suivi du lab | Conserver son AGENTS et ses restrictions locales. Prévoir des renvois vers la bibliothèque canonique intégrée, sans maintenir une seconde source ni rendre le kit dépendant du lab. |

Préconditions : répartition validée ; correction des décisions 008/009 ; deux AGENTS distincts ; état Git propre pour les fichiers concernés ; préservation des copies ambiguës et caches préexistants. La référence fonctionnelle web historique est `94895a6dbf306a722c692a6c0a8b534403332606` ; ses preuves ne qualifient pas l’intégration future.

La présence/version des CLI, accès réseau et permissions natives devront être réévalués au lancement. Les limites historiques de découverte Codex et les essais Claude/Gemini/Mistral non réalisés restent non vérifiés. Aucun accès manquant n’est réputé fourni par cette fiche.

## Choix techniques préparés

1. Une racine applicative, un catalogue, quatre sources de rôles et vingt sources de skills ; aucune copie synchronisée ni générateur d’export. Conserver les liens relatifs internes lorsque la plateforme les supporte.
2. L’AGENTS du lab pilote la fabrication ; l’AGENTS du kit accompagne ses utilisateurs. Les particularités du poste, du modèle et des jalons historiques du lab ne sont pas des prérequis de l’app. Lors du travail imbriqué, les contraintes englobantes restent respectées.
3. Séparer les références nécessaires aux procédures des preuves historiques. Sélectionner les documents/preuves réellement utiles ou produire une synthèse locale avec versions et limites ; chaque référence de catalogue requise doit résoudre dans le kit. Conserver les originaux historiques au lab, sans les réécrire ni faire passer leur résumé pour un nouvel essai.
4. Le lab peut consommer les sources intégrées par des renvois relatifs. Inspecter la découverte de la session Codex avant de déplacer ses liens actifs ; préserver un point de reprise et déclarer tout rechargement nécessaire. Un lien du lab peut être actualisé après renommage ; l’app ne doit jamais pointer vers ce lien.
5. Les changements ne touchent pas la configuration privée ni l’identité Compose. Pas de reset, suppression de volume, nettoyage ambigu ou nouvelle migration de données. La version finale devra être qualifiée dans un export propre.

## Séquence de réalisation retenue

| Tranche | Fichiers et travail | Preuves de sortie |
|---|---|---|
| A — Inventaire et sélection | Relever version/état, autorisations et liens ; inventorier toutes les références des rôles, skills, catalogue et adaptateurs ; sélectionner documents et preuves utiles. | Correspondance source/destination complète ; exclusions et éléments non vérifiés explicites. |
| B — Intégration des sources | Déplacer rôles/skills/adaptations/contrat, adapter les références et le validateur ; compléter documentation et commande locale du package ; garder le lab utilisable par des renvois. | Quatre rôles, vingt skills, adaptations internes, aucun lien requis sortant ni racine absolue imposée ; une source par élément. |
| C — Qualification autonome | Exporter le seul kit sans parent ni .git, dans un chemin avec espaces ; installer les dépendances annoncées, valider la bibliothèque, rejouer les contrôles web et builds affectés ; renommer/déplacer puis retester les liens et procédures. | Commandes, versions, résultats et limites dans docs/reviews/port-03 ; sorties d’échec fiables et aucun recours au lab. |
| D — Données et revue | Instance fictive dédiée ; donnée témoin, arrêt sans volumes, renommage/déplacement avec même configuration, relance et comparaison ; seconde installation indépendante. Revues technique et sécurité des chemins/outils/adaptateurs. | Identité Compose/volume et contenu conservés ; pas d’altération des services existants ; risques et retests documentés. |
| E — Compatibilité et reprise | Essais des assistants réellement disponibles et autorisés, scénario commun et rapports des quatre rôles ; actualiser matrice, README, état et roadmap, ainsi que les renvois lab. | Distinguer présence, découverte native et comportement. Compléments externes/humains manquants conservés ouverts ; pas de clôture automatique J4/J5. |

## Contrôles à exécuter dans le futur mandat

Le plan ci-dessous est conservé pour la reprise. Les commandes effectivement exécutées et leurs résultats sont dans le [bilan de qualification](../reviews/port-03/README.md) ; ne pas déduire une réussite du seul plan. Partir de la racine réelle du kit ; figer le candidat et consigner le SHA de fabrication, même si l’export de test est sans Git.

- Structure : validateur intégré (`node scripts/validate-agent-kit.mjs`, commande future), vingt frontmatters, quatre rôles, unicité des sources, quarante liens locaux, références de catalogue et liens Markdown. Contrôler les cibles réelles des liens après chaque extraction/déplacement ; tester une référence invalide dans une copie isolée pour vérifier le code d’échec.
- Régression web : `npm ci`, `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run test:design-system`, `npm test`, `npm run test:boundaries`, `npm run test:integration`, `npm run test:e2e`, `npm run test:projects`, `npm run build`, `npm run build-storybook`, `npm run test:storybook`. Préparer Chromium via la commande documentée si nécessaire ; Docker et caches restent isolés. Consigner les commandes nouvelles du kit sans présenter leur existence actuelle comme acquise.
- Démarrage et données : setup et Compose selon le README, lecture/écriture réelle d’un projet fictif, snapshot avant/après relance et déplacement ; identité, volume et lignes identiques sur le même moteur. Nouvelle configuration pour l’installation indépendante. Ne pas utiliser une base de démonstration existante ; ne jamais journaliser les secrets.
- Assistants : scénario de brief incomplet sans implémentation, inventaire des skills avec provenance puis rapport de chaque rôle. Vérifier les conventions contre les documentations officielles au moment de l’essai ; noter versions/mode natif ou séquentiel, outils absents et autorisations. Aucun appel fournisseur non autorisé ; une absence d’essai reste non vérifiée pour REC-10.
- Reprise : lecture autonome des consignes et petite modification dans un clone isolé. Une vérification par le Builder ne remplace pas l’essai réel par un tiers ni l’acceptation humaine finale.

## Critères de qualification

1. Le seul dossier livré contient ses instructions, quatre rôles, vingt skills, adaptations et contrôles, en plus du starter ; toutes les entrées requises résolvent à l’intérieur, sans nom de parent ou chemin de poste imposé.
2. Les AGENTS ont des missions distinctes ; les fichiers Claude/Gemini et le mode Mistral du kit lisent les sources internes. Aucun modèle universel, réglage global ou droit supplémentaire implicite.
3. Validation de bibliothèque, contrôles web et builds réussis sur le candidat extrait ; sources, liens et procédures restent valides après renommage/déplacement.
4. Données et identités conservées pour une même instance, installation indépendante isolée et ressources existantes préservées.
5. La matrice conserve exactement les réussites démontrées et les essais manquants ; une cible absente ne vaut pas compatible. Le socle intégré peut être qualifié avec ces réserves explicites, mais REC-10 et la clôture J4/J5 restent ouverts tant que leurs critères manquent.
6. Documentation de reprise et preuves sélectionnées accessibles localement ; aucune archive complète du lab imposée. Diff, secrets, traçabilité et revues applicables examinés avant commit/intégration locale.

## Revues, retour arrière et prochaine action

Prévoir une revue technique de la résolution des chemins, des dépendances et des commandes ; une revue sécurité ciblée des permissions, secrets, liens sortants et configurations d’assistants. Pas de revue visuelle requise si le mandat ne modifie aucune interface ; motiver toute évolution de ce périmètre. Déclarer le mode et l’indépendance réels des revues ; ne pas activer de sous-agent implicitement.

Travailler en commits courts sur une branche dédiée avec sélection exacte. En cas d’échec, conserver diagnostic et point de reprise ; revenir sur le changement concerné sans reset ni altération des données/archives. Ne pas réinstaller ni modifier la configuration globale pour rétablir une découverte native.

**Point de reprise au lancement :** base `710f5bba1861e0e4e5b20eaaa86f76f5ab1d6a79`, branche `codex/integrate-autonomous-agent-kit`. Racine Git vérifiée, aucun changement suivi préexistant ; 39 fichiers non suivis et deux archives relevés par SHA-256 dans un dossier local ignoré. Intégrer une source canonique dans le kit ; garder `agents/` et `skills/` du lab comme liens vers ces sources afin de préserver les accès de la session Codex existante. Les sources Claude/Gemini et .claude sont transférées dans l’app, sans adaptation active propre au lab. Les essais natifs historiques restent non vérifiés tant qu’ils ne sont pas exécutés.

## Bilan et prochain point de reprise

**Source qualifiée : `3e6ba795f862c84597c6f78a351987aa024b23a1`.** [Rapport, quatre rôles et limites](../reviews/port-03/README.md), [quinze commandes](../reviews/port-03/gates.json), [données et déplacements](../reviews/port-03/portability.json), [développement](../reviews/port-03/development.json), [préservation](../reviews/port-03/preservation.json).

Critères 1 à 4 démontrés : sources/contrats/contrôles internes, deux AGENTS distincts, quarante liens locaux, extraction sans Git, renommage/déplacement avec espaces, 82 tests et builds réussis, mêmes données/configuration/volume, installation indépendante isolée. Le validateur est lancé aussi depuis un autre cwd ; ses refus d’évasion et d’adaptation divergente sont testés. Les modules métier/UI, migrations, Compose, Dockerfile et lockfile restent identiques.

Critère 5 : matrice fidèle aux preuves ; découverte native et comportements supplémentaires des quatre assistants non nouvellement vérifiés, REC-10 ouvert. Critère 6 : références et preuves utiles locales, rapports technique/design/sécurité séquentiels par le même Builder, non indépendants ; contrôles documentaires et préservation des 39 fichiers non suivis et archives réalisés. Aucun nouvel appel fournisseur, réglage global, publication ou clôture humaine.

**Prochaine action :** recette humaine groupée et reprise réelle par un tiers sur le candidat, puis compléments natifs avec les accès déjà autorisés ou fournis explicitement. Le chantier d’intégration est techniquement qualifié ; ne pas ouvrir de nouvelle fonctionnalité ni clore J4/J5 sur la seule base de ce bilan.
