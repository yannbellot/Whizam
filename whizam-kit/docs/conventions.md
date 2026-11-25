# Conventions du starter

Ces conventions définissent l’organisation des sources, le suivi du projet, les pratiques de code et les lots Git locaux. Elles permettent de retrouver les décisions et de reprendre le travail depuis le dossier du projet. Les commandes s’exécutent depuis sa racine réelle.

## Initialiser le suivi du projet

Les chemins de ce document partent de la racine du dossier applicatif, indépendamment de son nom. Le [README](../README.md), la [roadmap](../ROADMAP.md) et l’[état courant](project-state.md) permettent sa reprise sans dépendre du cadre de fabrication.

La ROADMAP.md et le docs/project-state.md fournis sont non initialisés. Les renseigner au démarrage d’un projet dérivé réel à partir de son brief et de son mandat, sans reprendre les chantiers historiques du starter. Les évolutions du projet conservent leur intention et leurs spécifications dans `docs/product/`, leurs fiches dans `docs/work-items/`, leurs décisions dans `docs/decisions/` et leurs revues/preuves dans `docs/reviews/`. Créer ces dossiers seulement avec le premier document utile. La roadmap porte les statuts consolidés ; l’état courant reste court, avec version, résultats réellement vérifiés, limites et prochaine action. Chaque décision/règle garde une seule source.

L’app est le kit complet, dont les [instructions](../AGENTS.md), rôles, skills et adaptations font partie selon son [périmètre](product/starter-kit.md). Leurs sources canoniques et références d’usage sont internes à ce kit. Les preuves utiles à la livraison sont sélectionnées et versionnées avec lui ; une preuve historique ne constitue pas automatiquement une acceptation de la version actuelle. [PORT-03](work-items/port-03-autonomous-agent-kit.md) conserve l’historique de leur intégration et de leur qualification. Pour une nouvelle fonctionnalité, identifier cible, intention, contraintes, critères et mandat avant l’implémentation. Un statut techniquement qualifié reste En revue avec acceptation humaine différée tant que celle-ci manque. Aucun suivi documentaire n’autorise une publication, un accès externe ou une suppression de données.

## Code et responsabilités

- TypeScript strict, identifiants et commits en anglais ; textes documentaires selon le [choix linguistique du projet](agents/languages.md).
- `app/routes/` coordonne les réponses HTTP et l’interface ; les exports loaders/actions restent serveur, les composants peuvent être chargés dans le navigateur.
- `src/design-system/components/` porte les composants partagés existants ; `src/ui-lab/` conserve leurs démonstrations. Les composants n’importent ni configuration privée ni pilote de base.
- Les traitements exclusivement serveur vivent dans des modules suffixés `.server.ts`. `app/server/env.server.ts` valide les entrées de configuration avec Zod et fournit un diagnostic par noms de champs, sans reprendre leurs valeurs.
- Les dossiers de fonctionnalités et de données ne sont ajoutés qu’avec leur première implémentation utile. Les routes ne portent pas le suffixe `.server`.
- CSS natif, propriétés personnalisées et CSS Modules, avec utilitaires Tailwind préfixés `project:` sans nouveau Preflight. React Aria et Base UI figurent dans les dépendances ; les utiliser selon les composants et contrats réellement adoptés, sans généraliser leur usage à tout le kit. Aucun ajout de bibliothèque implicite.

## Contrats et contrôles

`GET /health` est un contrôle de vie applicative : JSON `{ "status": "ok" }`, sans cache, sans secret ni information de version. Il ne vérifie pas PostgreSQL. La configuration invalide fait échouer le traitement ; le document d’erreur public masque le détail interne. Les opérations d’écriture et leurs contrats seront définis avant leur implémentation métier.

`npm run typecheck` génère les types Router et contrôle application, tests et configurations. `npm test` exécute Vitest en environnement Node ; la base de tests grandira avec les fonctions effectives. `npm run test:boundaries` vérifie le refus d’un import `.server` par un composant dans une copie isolée. Les tests de base et navigateur seront distincts, avec ressources et données synthétiques isolées.

<a id="git-batches"></a>
<a id="source-git-batches"></a>

## Git local — lots de petites modifications

Politique du 22 novembre 2026. Cette section est l’autorité pour le travail direct de l’assistant sur les sources du kit ou d’un projet dérivé. Elle ne modifie pas le moteur intégré décrit dans le contrat workspace : ses branches `loomata/<UUID>`, son brouillon et ses modes d’intégration restent propres à ce moteur. Aucun ordonnanceur ni service automatique n’est installé par cette politique ; l’assistant applique les déclencheurs pendant son travail et à la reprise.

### Périmètre et constitution du lot

Dans un mandat autorisé, cumuler les petites modifications localisées et réversibles d’un même objectif : textes, espacements, alignements, documentation ou corrections mineures conformes à un comportement et une direction déjà convenus. Données, permissions, dépendances, configuration d’exécution et architecture relèvent d’un chantier distinct. Analyser l’impact d’un token partagé avant de le qualifier de petit changement. Les validations préalables du mandat restent applicables ; cette politique ne les remplace pas.

Avant la première écriture, inspecter racine Git, branche, index et travaux préexistants. Créer `codex/<sujet>` depuis `main` ou réutiliser une branche correspondant réellement au lot ; ne pas créer une branche par retouche. Ne jamais absorber un travail étranger, déplacer un travail ambigu ni écraser une branche existante. Si le dépôt ou `main` manque, conserver un point de reprise et proposer sa préparation : aucune initialisation Git ni création de branche principale implicite. Un lot n’autorise pas à modifier un autre projet.

Le suivi du projet conserve un identifiant de lot, objectif, branche et base, demandes incluses et compteur, fichiers concernés, contrôles réalisés/restants et prochain déclencheur. En maintenance, ce suivi appartient à la racine de maintenance ; dans un projet dérivé, à son propre suivi. Réutiliser ce lot entre conversations. Enregistrer les fichiers pendant le travail ; un lot non commité reste uniquement dans la copie locale et ne constitue pas une sauvegarde distante.

### Déclencheurs de clôture et de commit

Évaluer les déclencheurs après chaque demande terminée, jamais au milieu d’une modification. Un seul déclencheur suffit :

| Déclencheur             | Règle                                                                                                                                                                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Demande explicite       | « Commite », « termine ce lot » ou équivalent.                                                                                                                                                                                 |
| Accumulation            | 5 demandes de modification terminées dans le lot ; une demande compte une fois, indépendamment des appels d’outils, corrections et retests.                                                                                    |
| Taille                  | Au moins 10 fichiers sources modifiés ou 200 lignes ajoutées et supprimées au total dans le diff courant du lot par rapport à sa base. Inclure les nouveaux fichiers ; exclure dérivés générés, lockfiles et preuves générées. |
| Changement de sujet     | Avant les écritures d’un objectif distinct, clôturer le lot précédent s’il est cohérent et vérifiable.                                                                                                                         |
| Fin explicite de séance | « On s’arrête ici » ou équivalent clôt le lot cohérent et vérifiable, sauf instruction explicite de ne plus effectuer d’opération ou de ne pas commiter.                                                                       |

Les seuils sont des règles de regroupement, pas des limites Git. Compter les différences finales, pas le cumul des éditions intermédiaires ; une annulation complète sans différence utile ne crée aucun commit. Une fin de réponse, une nouvelle conversation, un contrôle réussi ou une durée d’inactivité ne déclenche pas de commit. En dessous des seuils, poursuivre le lot sans le clôturer pour la seule livraison d’une réponse. Si une clôture échoue, conserver le lot ; isoler un nouveau sujet uniquement si cela préserve les travaux et leurs dépendances.

À la clôture, relire la sélection explicite des fichiers, actualiser documentation et preuves utiles, puis exécuter les contrôles et revues adaptés au lot final. Corriger les échecs dans le mandat. Si un contrôle obligatoire reste en échec ou invérifiable, conserver le point de reprise sans commit automatique incomplet ni commit `wip:`. Si tout est satisfaisant, créer un commit cohérent en anglais, sans nouvelle demande d’accord. Le suivi et les preuves de cette clôture font partie du lot : ils ne comptent pas comme nouvelles demandes et ne déclenchent pas une boucle de commits documentaires.

### Aide locale au suivi

Depuis la racine du projet ciblé, utiliser `node scripts/git-batch.mjs diagnose .` : diagnostic seul, sans écriture Git ni lecture de la valeur des secrets. Une racine située dans un dépôt parent est signalée, sans création de dépôt imbriqué. Git et une branche `main` existante sont nécessaires pour ouvrir un lot. Dans une copie sans Git, préparer la sélection des sources publiques et obtenir un mandat explicite pour l’initialisation et le premier commit ; ne jamais transmettre le `.git/` du mainteneur. Ne pas changer l’identité Git globale.

Après création manuelle par l’assistant d’une branche `codex/<sujet>` dans le mandat, appeler `begin` avec un objet JSON sur l’entrée standard : `{"objective":"Tableaux", "files":["src/example.ts"], "generated":[]}`. Commande : `node scripts/git-batch.mjs begin .`. La sélection doit être propre à l’ouverture ; inclure les nouveaux fichiers prévus et la documentation du lot. Les chemins privés, ignorés ou traversant des liens sont refusés. Pour élargir la sélection du même objectif avant toute écriture, appeler `node scripts/git-batch.mjs extend .` avec `{"files":["nouveau-fichier.md"]}` sur l’entrée standard ; un fichier déjà modifié hors sélection est refusé. Ne pas modifier le fichier d’état pour contourner un refus. Une aide limitée ne remplace pas cet arbitrage.

Après chaque demande réellement terminée, appeler `node scripts/git-batch.mjs record .` avec `{"id":"request-001","event":"none"}` sur l’entrée standard. Conserver le même identifiant stable à la reprise : le compteur est dédupliqué. `event` accepte `none`, `explicit`, `subject`, `session` ou `stop` selon le déclencheur connu ; ne jamais appeler un outil après un ordre de ne plus effectuer d’opération. `stop` permet seulement de qualifier un état lors d’une reprise ultérieure autorisée. Une demande informative n’est pas enregistrée comme modification.

`node scripts/git-batch.mjs status .` relit le lot et calcule les différences finales des fichiers sélectionnés. Les seuils sont lus dans cette politique, sans seconde configuration. Le champ `generated` énumère explicitement les preuves/dérivés générés à exclure des métriques ; les lockfiles et noms `.generated.` sont exclus automatiquement. Les différences binaires exigent une revue ; les changements hors sélection ne sont pas qualifiés par l’aide. `closureDue` demande les contrôles de clôture : il ne prouve jamais leur succès ni une autorisation d’intégration. Un index occupé, un changement de branche/base ou une principale avancée impose le diagnostic et les protections de la politique.

Le fichier privé `.git-batches.local/batch.json` conserve objectif, racine/branche/base, demandes, sélection et dernier événement. Il est ignoré par Git, exclu de la distribution et ne remplace pas le suivi humain des contrôles dans les documents du projet. Les appels concurrents refusent un verrou occupé ; ne jamais supprimer un verrou ambigu. Après vérification du commit réel et de sa portée, `node scripts/git-batch.mjs archive .` conserve l’ancien état sous un nom d’archive et libère le prochain lot. Cette commande exige un état Git propre et refuse un commit contenant des fichiers étrangers au lot. L’assistant exécute ensuite l’intégration admissible par les commandes Git ordinaires ; l’aide ne lance ni `add`, ni commit, ni merge, ni initialisation.

### Intégration locale et arbitrages

Après le commit, intégrer automatiquement dans `main` si le mandat et les décisions sont respectés, si les contrôles/revues applicables sont satisfaisants sur cette version, si aucun conflit technique ou fonctionnel reconnu ne subsiste et si aucun arbitrage produit, esthétique ou de sécurité n’est attendu. Une petite retouche visible conforme à une direction convenue ne requiert pas une acceptation humaine systématique.

Vérifier que l’état de travail et l’index de `main` sont propres, puis utiliser une avance rapide (`--ff-only`), sans squash, rebase ni réécriture d’historique. Si `main` a avancé, rapprocher explicitement les versions sur la branche du lot sans écrasement ni réécriture et rejouer les contrôles affectés avant de retenter l’avance rapide. Un conflit aux conséquences incertaines exige un arbitrage ; ne jamais forcer l’intégration. Respecter les hooks et les permissions des outils. Conserver la branche après intégration, sans suppression implicite.

Un changement critique exige toujours un arbitrage humain : données difficilement réversibles, accès/sécurité/confidentialité, service ou coût non prévu, changement matériel de périmètre ou d’architecture. Ne pas le dissimuler dans un lot mineur. L’intégration ne vaut pas acceptation humaine du résultat : conserver le statut En revue tant que cette acceptation manque. Signaler brièvement lot conservé, commité ou intégré et les limites utiles. Aucun push, GitHub Actions, release, publication, service externe ou déploiement n’est autorisé implicitement. Les preuves identifient base/version, contrôles réellement exécutés, résultats et limites.

Les scripts opérationnels TypeScript utilisent Node 24 natif et des imports `.ts` explicites ; `erasableSyntaxOnly` empêche les formes nécessitant une transformation runtime supplémentaire. Le serveur de production valide PORT, utilise la boucle locale par défaut et n’autorise HOST=0.0.0.0 qu’avec le marqueur de conteneur explicite. Un port occupé échoue sans bascule silencieuse.

## Formatage et navigateur

Prettier utilise le style déclaré dans .prettierrc.json : `npm run format` corrige et `npm run format:check` vérifie. Les exclusions sont explicites dans .prettierignore ; les copies ambiguës restent hors Git et ne sont pas modifiées. Playwright utilise Chromium moderne sur deux viewports, sans serveur réutilisé ni profil personnel. Un échec de contrôle conserve son code non nul.

### Envoi GitHub après un lot

L'intégration locale reste distincte de l'envoi distant. Une autorisation explicite persistante sur le dépôt, la visibilité, la branche et le mode selon [Publication GitHub](github-publication.md) autorise les envois de ce périmètre sans accord répété. Une préférence de cadrage seule ne suffit pas. Après chaque commit intégré, le Builder applique le mode actif avec le skill dédié ; à la demande ou suspendu, aucun push automatique. Les reçus privés ne créent pas de nouveau commit de suivi. Aucun changement de seuil, envoi global de branches/tags ou service permanent implicite.

Exception limitée pour les sources de skills : seuls les liens terminaux `.agents/skills/<nom>` et `.claude/skills/<nom>`, déclarés au catalogue avec la cible exacte `../../skills/<nom>`, sont suivis comme entrées Git sans lire leur cible. Le catalogue, le dossier canonique et son `SKILL.md` doivent être internes et sans lien intermédiaire ; les liens non déclarés, traversés, externes ou alternatifs restent refusés.
