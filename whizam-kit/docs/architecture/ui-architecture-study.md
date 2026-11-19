# Étude de l’architecture UI et du modèle de conception de Loomata

**14 novembre 2026 — Révision 4 : ordre d’adoption cadré, Electron dans une tranche séparée, sans implémentation.** Inspection du dépôt au commit `7758cad9064b0f83acfe0d08132e05672c3d27cd`. [Mandat et vérifications](../work-items/ui-arch-01-ui-architecture-study.md).

**Recommandation : Electron comme contenant desktop multiplateforme de Loomata ; React Aria Components comme bibliothèque interactive de référence et Tailwind CSS v4 comme convention de styles dans les deux architectures.** Les deux périmètres conservent leurs propres tokens DTCG, thèmes et composants. Pour Loomata, l’introduction serait progressive dans le code de présentation existant ; pour les nouvelles applications, Tailwind serait préparé dans le starter. Loomata UI appartient à l’outil et ne devient pas une dépendance d’exécution obligatoire des produits créés.

Conserver le générateur et les autorités DTCG/YAML ; formaliser Loomata UI à partir des composants utiles ; introduire React Aria progressivement avec qualification des comportements ; prolonger les contrats existants par références, sans créer un langage complet de description d’applications. Cette révision remplace l’évaluation préalable indéterminée de React Aria par une recommandation de fondation commune, et conserve la recommandation Tailwind de la révision 2. Elle ne modifie pas encore la stack effective ni ses autorités prescriptives.

Les produits créés visent les **sites web et web apps**, sans génération d’applications natives pures. Electron ne concerne que l’outil Loomata, pas leur livraison.

**Ordre proposé : cadrage commun → première tranche de l’interface Loomata → socle des projets créés. Electron fait l’objet d’une tranche séparée**, après cette séquence de référence. La première tranche UI conserve le contenant actuel ; elle ne dépend pas de la réalisation d’Electron. La section 8 précise les résultats et portes de passage.

Dans cette note, **constat** désigne une observation des sources inspectées, **proposition** une recommandation non adoptée et **hypothèse** un avantage ou comportement à vérifier. Les fonctionnalités décrites par un schéma ne sont pas présumées réalisées dans les écrans.

## 1. Diagnostic de l’existant

### Stack et contenant réels

| Constat vérifié | Preuve locale | Conséquence pour l’étude |
| --- | --- | --- |
| React 19.2.8, TypeScript 5.9.3, React Router 7.18.4 en Framework Mode, Vite 7.3.7 ; PostgreSQL/Drizzle pour l’exemple web | [package.json](../../package.json), [architecture](../architecture.md), [routes](../../app/routes.ts) | Le socle est une application web intégrée avec SSR, pas une SPA Tauri déjà constituée |
| Contenant macOS en Swift/AppKit avec WKWebView et services Node locaux | [Loomata.swift](../../macos/Loomata.swift), [lanceur](../../scripts/loomata.mjs), [guide macOS](../../macos/README.md) | **Le présupposé Tauri 2 du texte fourni ne correspond pas au code suivi inspecté.** Aucun manifeste Tauri/Cargo suivi trouvé ; une migration native serait un chantier distinct |
| Base UI 1.7.0 installé ; imports Dialog et Switch dans une démonstration | [manifest](../../package.json), [BaseUiDemos](../../src/ui-lab/demos/BaseUiDemos.tsx) | Dépendance présente ne signifie pas fondation généralisée de tous les contrôles |
| Button est un bouton HTML ; Field et SelectField utilisent input/textarea/select natifs | [Button](../../src/design-system/components/Button/Button.tsx), [Field](../../src/design-system/components/Field.tsx) | Leur remplacement doit préserver les contrats et comportements actuels |
| CSS Modules et variables CSS ; React Aria, Tailwind et shadcn/ui absents du manifeste et du lockfile inspectés | [styles atelier](../../src/ui-lab/editor/workspace.module.css), [lockfile](../../package-lock.json) | Introduire Tailwind ou React Aria constitue une évolution, pas une simple activation |
| Storybook 10.6.3, Vitest, Playwright, tests Node et pilotes natifs présents | [scripts npm](../../package.json), [pilote natif](../../macos/tests/LoomataE2E.swift) | Un socle de qualification existe ; aucune de ces campagnes n’est réexécutée par cette étude |

Le [cahier des charges](../../../CAHIER-DES-CHARGES.md), §6, prescrit CSS natif et variables personnalisées ; les sources inspectées conservent le contenant Swift et Base UI. Les recommandations Electron/React Aria/Tailwind de cette note n’altèrent pas ces autorités effectives. Un futur mandat de réalisation devra formaliser l’adoption et aligner les documents concernés avant code. La [cible produit](../product/loomata-workspace.md) est desktop uniquement pour Loomata ; les formats des sites et web apps créés suivent leur brief.

### Tokens, thèmes et composants

**Constat.** Le [référentiel](../design-system/architecture.md) distingue déjà Primitives, Decision Tokens sémantiques/non sémantiques, Component Tokens, Components et Patterns. La [décision 027](../decisions/027-dtcg-authority-and-css-recipes.md) a adopté JSON DTCG 2025.10 comme autorité des valeurs et références. Le [contrat courant](../../src/design-system/authority/README.md) attribue les autres responsabilités aux YAML : intentions, matrice éditable, fiches de composants, variantes et recettes CSS. Il n’y a pas lieu de remplacer tous ces contrats par un fichier unique.

Le [générateur](../../scripts/generate-tokens.mjs) assemble les artefacts ; le writer existant publie les sources et dérivés sous contrôle transactionnel. Les champs de classification, provenance, attribution et base de rétablissement ne sont pas des détails facultatifs à perdre lors d’un changement d’outil. Le profil DTCG accepté est fermé, notamment sRGB et dimensions px/rem : « DTCG » ne signifie pas prise en charge de toute fonctionnalité du format.

Les thèmes clair/sombre de l’atelier utilisent `prefers-color-scheme` et des variables du chrome. Cela ne démontre ni un système de modes universel ni une séparation complète de tous les tokens Loomata/projet. Le [cœur commun](shared-core.md) et la création par kit partagent encore des fichiers de fabrication : l’indépendance future ne doit pas être présentée comme une séparation de packages déjà achevée.

Les composants adoptés incluent Button, Field, SelectField, Notice et Panel ; leurs stories et fiches existent. La validation de formulaire fournit un premier pattern documenté. Les pages, inspecteurs et explorateur Figma composent une interface plus large, sans constituer pour autant une bibliothèque stabilisée de tous les patterns proposés.

### Accessibilité et fragilités observables

**Constat.** Field associe label, aide et erreur par identifiants ; Button expose disabled/loading et `aria-busy`. Les pages disposent de zones nommées et boutons sélectionnés. Cela constitue un travail explicite d’accessibilité, pas une conformité complète. L’arborescence visuelle de [PageWorkspace](../../src/ui-lab/editor/PageWorkspace.tsx) est notamment rendue en boutons ; elle ne démontre pas un widget Tree avec navigation par flèches et sélection gérée.

Les principaux risques architecturaux sont déjà visibles : noms de variables de composition numérotés peu explicites pour les agents ; couches historiques et courantes juxtaposées dans la documentation ; plusieurs projections de sélection/rendu ; frontière encore partagée entre outils du kit et produit Loomata. Ce sont des risques de compréhension et de maintenance, pas des régressions observées en exécution. Une nouvelle bibliothèque ne les corrige pas automatiquement.

Le [registre d’import](../../src/core/imported-components.ts) conserve un sous-ensemble structuré de Figma et le [renderer](../../src/core/ImportedComponent.tsx) le traduit en React. Ce mécanisme est utile, mais constitue déjà une surface de maintien d’un modèle de rendu. La correspondance de rôles `action/input/container/text/graphic` ne suffit pas à déduire le comportement d’un Select, d’un Tree ou d’un Dialog accessible à partir de leur apparence.

## 2. Évaluation de React Aria et Tailwind

### Interactions et interfaces denses

React Aria Components est la bibliothèque interactive de référence recommandée pour Tree, Table, collections, sélection et glisser-déposer accessible. Ses composants n’imposent pas de style et acceptent CSS classique comme Tailwind ; le choix React Aria **n’entraîne pas** le choix Tailwind. [Styling](https://react-aria.adobe.com/styling), [Tree](https://react-aria.adobe.com/Tree), [Table](https://react-aria.adobe.com/Table).

**Proposition.** Utiliser React Aria pour les interactions qu’il couvre dans l’interface Loomata et dans le starter des sites/web apps créés. Ne pas maintenir Base UI comme seconde fondation concurrente à terme : ses usages seraient remplacés progressivement et retestés. Sa présence actuelle reste un constat, pas un motif pour conserver deux conventions. [Catalogue Base UI](https://base-ui.com/react/overview/quick-start).

React Aria fournit les comportements ; chaque design system fournit apparence et compositions. HTML sémantique reste approprié à la structure et aux contenus, particulièrement pour les sites éditoriaux. Les besoins hors catalogue, tels qu’éditeurs de code, cartes ou visualisations, peuvent recevoir un complément spécialisé documenté. Aucune surcouche miroir exhaustive n’est nécessaire. Le choix commun ne garantit pas une accessibilité complète : libellés, contrastes, parcours et intégration doivent être qualifiés.

La densité vient des dimensions, espacements et règles de composition ; aucune de ces bibliothèques ne garantit une interface d’IDE. Les panneaux redimensionnables, terminal, éditeur de code et diff Git resteraient des besoins spécialisés à qualifier. Les raccourcis globaux demandent une politique Loomata : priorité de la zone active, édition de texte/IME, conflits avec les menus natifs du contenant et commandes propres à chaque OS. Un contrôle de focus local ne remplace pas cette politique.

**Hypothèses à vérifier.** React Aria pourrait réduire le code comportemental spécifique et améliorer la cohérence clavier. Son avantage de performance n’est pas établi : mesurer taille compressée ajoutée, démarrage, coût de rendu/sélection, mémoire et longues sessions sur un volume représentatif. La virtualisation est à sélectionner et tester ; elle ne dispense pas de vérifier l’accessibilité des éléments non montés.

### Qualification du contenant et des navigateurs

L’interface actuelle reste dans WKWebView jusqu’à une éventuelle réalisation du contenant Electron. La cible recommandée devient Chromium embarqué sous macOS, Windows et Linux. Le changement de moteur sur Mac demande un retest de rendu, focus, portails et raccourcis ; les preuves WKWebView historiques ne qualifient pas Electron.

Tailwind v4 annonce Safari 16.4+, Chrome 111+ et Firefox 128+. La version Electron retenue et la matrice de navigateurs des produits web devront être vérifiées explicitement ; les projets créés ne se limitent pas au navigateur de l’aperçu Loomata. [Compatibilité Tailwind](https://tailwindcss.com/docs/compatibility).

Les vérifications porteront sur clavier/IME, retour du focus, défilement, thèmes, zoom du texte et lecteurs d’écran sur les plateformes visées. Les tests DOM seuls ne prouvent pas les menus natifs, permissions, installateurs ou accessibilité système. Aucun essai de cette intégration n’est exécuté ici.

### Tailwind pour l’interface de Loomata

**Avantages proposés :** composition rapide, vocabulaire partagé des layouts, états visuels proches du JSX et outillage connu. **Coûts dans ce dépôt :** nouveau compilateur CSS, cascade/Preflight à maîtriser, adaptation du contrôle des valeurs libres et raccordement à la génération transactionnelle. La [règle actuelle de consommation](../decisions/024-tokenized-ui-composition.md) inspecte les consommateurs ; l’ajout de classes arbitraires ne doit pas la contourner.

`@theme` peut exposer des noms d’utilitaires reliés aux variables canoniques ; utiliser `@theme inline` lorsque les références de variables l’exigent. Cette couche reste un dérivé, sans palette ni échelle concurrentes. Les classes doivent être détectables à la compilation : construire une classe depuis une valeur reçue à l’exécution ne garantit pas son émission. Les imports Figma dynamiques doivent conserver des règles CSS générées bornées ou des mappings statiques, plutôt qu’inventer une classe par valeur. [Theme variables](https://tailwindcss.com/docs/theme), [détection des classes](https://tailwindcss.com/docs/detecting-classes-in-source-files).

**Recommandation : retenir Tailwind comme convention cible de l’interface Loomata.** Ses espaces, panneaux, inspecteurs, formulaires, états et thèmes justifient un vocabulaire commun de composition. Ce choix est proportionné au produit ; le coût d’adaptation de l’existant ne constitue pas à lui seul une raison de le différer. Le gain de productivité reste une hypothèse à observer, sans performance promise.

Lors d’un futur mandat, introduire Tailwind sur les composants partagés et nouveaux écrans, puis adapter les styles existants par ensembles cohérents. Les CSS Modules peuvent rester temporairement ou pour des règles spécialisées, avec une responsabilité explicite par surface. Préserver les valeurs et le rendu attendus ; éviter une conversion générale immédiate et une coexistence sans règle.

### Tailwind pour le socle des applications créées

**Recommandation : proposer Tailwind par défaut dans le starter des nouvelles applications.** Il fournit une convention commune de composition aux développeurs et agents, personnalisable à partir du design system propre à chaque projet. Le socle devrait livrer la configuration de compilation, le thème dérivé des tokens, des composants d’exemple, les stories et les contrôles associés. Une application créée doit pouvoir être développée et compilée sans Loomata.

Le starter actuel contient déjà des CSS Modules : sa préparation future implique donc aussi une adaptation du code fourni. Cela ne justifie pas d’imposer la conversion des projets déjà créés. Ceux-ci conservent leur version du socle ; une évolution serait traitée dans leur propre mandat. Tailwind reste une convention par défaut modifiable selon le brief, sans devenir une dépendance du modèle de conception indépendant du rendu.

### Portée de l’adaptation des styles

L’introduction de Tailwind concerne la compilation CSS, les classes des composants et les contrôles de styles. **Elle n’exige pas de convertir les données des projets, leurs contenus, conversations ou valeurs de tokens.** DTCG reste leur autorité. Une éventuelle conversion de données liée à un autre changement de schéma serait une opération distincte, hors du présent choix. Les tests futurs vérifieraient l’équivalence visuelle attendue et les comportements, pas une migration métier.

## 3. Alternatives et complexité

| Option | Apport | Coût ou risque propre à Loomata | Avis proposé |
| --- | --- | --- | --- |
| Natif + Base UI existant + CSS Modules | Continuité, styles libres, réemploi des preuves | Les widgets complexes exigent une qualification spécifique ; éviter le comportement artisanal d’un Tree riche | Alternative de continuité, pas la convention cible recommandée |
| React Aria + CSS Modules | Collections et interactions riches sans changer le style | Deux systèmes de focus/portails si coexistence mal bornée ; migration des API et tests | Alternative de styles, sans changement de la fondation interactive recommandée |
| React Aria + Tailwind v4 | Même comportement, composition par utilitaires | Adaptation des styles et changement éventuel de primitives à qualifier séparément | Fondation cible recommandée dans les deux périmètres |
| Base UI + Tailwind | Conserve les interactions déjà employées, change le style | Ne répond pas seul au besoin de modèle de conception ou d’arbre riche | Coexistence transitoire seulement, pas une seconde fondation cible |
| shadcn/ui | Code composable repris dans le projet, accélération de composants et patterns | Personnaliser esthétique/tokens, suivre le code copié et ses dépendances ; ce n’est pas une autorité de design | Source ponctuelle d’inspiration, pas remplacement global recommandé |

shadcn/ui se présente comme une manière de construire son système à partir de code ouvert, et non comme une bibliothèque opaque obligatoire. Ne pas l’opposer artificiellement à Base UI comme s’ils avaient le même rôle ; examiner les primitives de la variante retenue lors d’un éventuel essai. [Introduction officielle](https://ui.shadcn.com/docs).

La complexité principale vient du nombre de modèles éditables et de chemins d’écriture. Conserver le writer et ajouter un adaptateur local est moins risqué que remplacer simultanément stockage, génération, composants et enveloppe native. La coexistence Base UI/React Aria doit être transitoire : une seule implémentation comportementale adoptée par composant, React Aria comme cible commune. Aucun chiffrage en jours ou taille de bundle n’est justifiable sans essai.

### Contenant desktop : Electron plutôt que Tauri

**Recommandation : Electron pour l’outil Loomata sur macOS, Windows et Linux.** Le cœur existant est largement Node : projets, supervision, agents, writer, exports et génération. Le [port commun](../../scripts/core/local-service.mjs) et le [superviseur](../../scripts/local-app.mjs) sont réutilisables dans leur rôle, mais pas encore entièrement portables. Le [packaging](../../scripts/package-deliveries.mjs) qualifie macOS arm64 et embarque déjà Node/npm dans ses candidats ; il ne démontre aucune livraison Electron ou multiplateforme.

| Critère | Electron | Tauri |
| --- | --- | --- |
| Cœur Node existant | Continuité TypeScript/JavaScript ; services séparables du processus principal | Réutilisable comme processus auxiliaire, avec enveloppe Rust et raccordement supplémentaire |
| Moteur de rendu | Chromium embarqué, version maîtrisée avec l’application | WebView2 sous Windows, WKWebView sous macOS, WebKitGTK sous Linux |
| Interface étudiée | React/React Aria/Tailwind conservés | Même compatibilité de principe, avec plusieurs moteurs à qualifier |
| Distribution | Coût fixe de Chromium/Node embarqués | Pas de Chromium embarqué ; avantage réduit si runtime Node et outillage sont distribués aussi |
| Qualification | Proximité avec Playwright existant ; support Electron documenté comme expérimental | WebDriver disponible, notamment via serveur embarqué pour macOS ; configuration spécifique |
| Portabilité métier | Adaptation nécessaire des chemins, processus, sockets et outils | Mêmes adaptations nécessaires ; le contenant ne les supprime pas |

Electron est privilégié pour limiter la diversité technique et les variations de moteur, davantage que pour une promesse de performance. Taille téléchargée/installée, mémoire et temps de démarrage sont trois mesures distinctes ; aucune valeur ni supériorité mesurée n’est revendiquée. Aucune limite forte de taille d’installateur n’a été définie pour Loomata. Tauri resterait pertinent si cette contrainte devenait prioritaire ou si une enveloppe Rust était délibérément recherchée. [Modèle Electron](https://www.electronjs.org/docs/latest/tutorial/process-model), [WebViews Tauri](https://v2.tauri.app/reference/webview-versions/), [processus auxiliaires Tauri](https://v2.tauri.app/develop/sidecar/).

Le Node embarqué d’Electron ne remplace pas automatiquement le runtime Node/npm requis par le kit : conserver initialement un outillage versionné explicite, puis qualifier toute mutualisation. Les services longs restent hors du processus principal ; `utilityProcess` est une option, pas une compatibilité déjà démontrée. Les sockets Unix, signaux, commandes macOS, chemins Codex et ressources de packaging actuels doivent être adaptés par OS. [Processus Node auxiliaires Electron](https://www.electronjs.org/docs/latest/api/utility-process), [tests Electron](https://www.electronjs.org/docs/latest/tutorial/automated-testing), [tests Tauri](https://v2.tauri.app/develop/tests/webdriver/).

Les aperçus de projets n’obtiennent ni intégration Node ni passerelle privilégiée de l’outil. Prévoir séparation des contextes, sandbox, isolation du contexte, API de commandes fermée et validation de l’émetteur. Le cœur garde la sélection du projet et les gardes du writer ; aucun accès arbitraire au shell n’est ajouté. Les projets et états mutables restent hors des ressources signées. Signature, mises à jour et reprise de processus devront être qualifiées sur chaque OS. [Sécurité Electron](https://www.electronjs.org/docs/latest/tutorial/security).

## 4. Architecture recommandée et autorités

### Interface de Loomata

```text
Enveloppe Electron → fenêtres, menus, dialogues et cycle de vie
  → passerelle contrôlée → cœur Node / writers / outils versionnés

Interface React de Loomata :
Tokens DTCG du chrome Loomata + règles/recettes de présentation
  → validation et générateur existants → variables CSS
  → thème Tailwind généré + Tailwind / CSS spécialisé
  → React Aria Components + HTML sémantique
  → composants Loomata UI → patterns d’atelier → écrans
```

Loomata UI serait d’abord une responsabilité nommée et une frontière d’import, sans nouveau package ni moteur. Il fixe les variantes, dimensions, libellés, slots, retours et règles de focus utiles au produit. Le thème Tailwind serait un dérivé des mêmes variables, sans valeurs éditables concurrentes. L’adaptation progressive des CSS Modules relève d’une future réalisation. Aucun Design Contract général n’est requis pour afficher le chrome de l’outil.

### Socle des applications créées et moteur de conception

```text
Spécifications → décisions et propositions structurées ┐
Figma → import borné + proposition de rapprochement   ├→ commandes validées du cœur
Code → déclaration des identités et rapport de rendu  ┘    → writer / transactions / Git
                                                          → tokens + sources du projet
                                                          → aperçu → tests + preuves
```

Le socle recommandé pour les nouveaux sites web et web apps est distinct du contenant Electron et du moteur de conception :

```text
Tokens DTCG propres au projet + recettes propres au projet
  → validation / génération → variables CSS + thème Tailwind du projet
  → React + Tailwind + React Aria Components / HTML sémantique
  → composants et patterns du projet → écrans autonomes
```

La convergence porte sur les identités, références et opérations vérifiables ; elle ne suppose pas qu’une spécification textuelle et un nœud Figma aient la même expressivité. Le code libre reste possible ; une zone non enregistrée apparaît comme couverture partielle, sans reconstruction fictive de son modèle.

| Information | Autorité recommandée | Projection ou lien |
| --- | --- | --- |
| Intentions métier et critères | Spécifications du projet | Identifiants cités par décisions, tâches et preuves |
| Valeurs et alias typés | JSON DTCG propre au projet | Variables CSS et thème Tailwind générés |
| Éligibilités, présentation, variantes et recettes | Contrats YAML existants, chacun dans son rôle | Modèle validé commun, documentation |
| Logique et rendu des composants | Code du projet | Catalogue d’API et liens vers les identités |
| Pages, occurrences, correspondances et révisions | Coordination workspace existante | Inspecteurs et marqueurs DOM |
| Source externe Figma | Instantané identifié par fichier/nœud/version/hash | Proposition d’import, jamais écriture aveugle |
| Résultat observé | Preuves liées à la révision testée | Statut de vérification, distinct de l’intention |

Les tokens et composants du chrome Loomata ne doivent pas être requis pour exécuter le produit exporté. **Proposition de frontière :** scopes de génération et CSS séparés pour chrome, preview et projet, sans partage de valeurs implicite ; conserver la possibilité de copier/versionner le socle d’un projet et de le faire fonctionner sans service Loomata. Ce découplage doit être vérifié dans l’export actuel avant toute promesse d’indépendance complète. Le moteur de fabrication peut être commun ; le design system de chaque produit garde son autorité propre.

## 5. Tokens et transformations

DTCG est pertinent comme format d’échange ouvert déjà adopté. Il s’agit d’un rapport final de Community Group, **pas d’une recommandation W3C**. La division Primitive/Decision/Component et les règles de dépendances sont des conventions Loomata, pas des contraintes universelles du format. [Spécification 2025.10](https://www.designtokens.org/tr/2025.10/format/).

Conserver les règles locales : décisions classifiées et justifiées ; Component→Primitive/Decision autorisé selon le contexte ; Component→Component et Decision→Component interdits ; pas de littéral non primitif ; références typées sans cycle. Densité et thèmes sont des axes contextuels, états et variantes sont des propriétés de composant : éviter le produit cartésien de tokens précréés sans usage. Ne pas forcer un token de composant à traverser une décision partagée artificielle.

**Proposition.** Définir progressivement les contextes réellement demandés, leur résolution et leur portée ; conserver les identités lors d’un changement de thème. Réserver DTCG aux valeurs qu’il représente ; `clamp`, grilles et `currentColor` restent des recettes. La densité compacte doit préserver lisibilité, cible interactive et navigation clavier, même si sa surface visible est petite.

Style Dictionary accepte le format DTCG et propose transformations et formats. Il peut suffire pour des sorties de tokens classiques ; cela ne démontre pas qu’il remplace les règles Loomata, métadonnées, recettes, transactions et reprise. **Conserver le générateur actuel ; comparer Style Dictionary seulement lorsqu’une cible d’export non couverte le justifie.** Pas de second pipeline autorisé à écrire les mêmes dérivés. [Configuration Style Dictionary](https://styledictionary.com/reference/config/).

L’intégration Figma requiert un mapping de types, alias, collections/modes et identités. Les accès à l’API Variables dépendent des permissions et du compte ; importer la géométrie ou les valeurs d’un fichier ne prouve pas un aller-retour fidèle des tokens. L’import actuel de valeurs brutes ne doit pas être annoncé comme une synchronisation sémantique. Préférer comparaison, proposition, arbitrage et réimport idempotent à une synchronisation bidirectionnelle. [API Variables Figma](https://developers.figma.com/docs/rest-api/variables-endpoints/).

## 6. Bibliothèques UI des deux périmètres

### Loomata UI pour l’interface de l’outil

| Niveau | Abstraction qui apporte une valeur Loomata | Ce qui peut rester direct |
| --- | --- | --- |
| Composants de base | Button et Field : conventions de taille, état occupé, aide/erreur, identité inspectable | HTML natif ; primitive React Aria locale lorsqu’aucune convention n’est partagée |
| Interactions composées | Dialog de décision, champ numérique d’inspecteur, sélection : focus, validation, densité et tokens communs | Slots internes, utilitaires et contrôleurs de collection propres à la bibliothèque |
| Patterns | Property Inspector, navigation de projet, décision avec impacts, activité d’agent : coordination et récupération récurrentes | Assemblage unique d’une page, logique métier et appels fournisseurs |

Éviter un composant miroir pour chaque export React Aria. Adopter une API Loomata seulement lorsqu’elle stabilise une convention ou un usage récurrent. Les types spécifiques de la bibliothèque peuvent rester internes aux composants partagés ; les primitives utilisées localement n’exigent pas une couche d’adaptation abstraite.

**Organisation proposée sans déplacement immédiat :** conserver `src/design-system/components/<Component>/` avec code, styles, fiche et story ; documenter les patterns réels dans la rubrique existante ; laisser les assemblages d’atelier dans `src/ui-lab/editor/` tant qu’ils ne sont pas réutilisables. Une extraction ultérieure du chrome serait guidée par les dépendances constatées, pas par la création d’une arborescence idéale.

Tests à prévoir lors d’une réalisation : états/variantes et clavier dans Storybook, logique pure dans les tests unitaires, intégration dans un inspecteur réel, retours de focus et erreurs, Electron et lecteurs d’écran pour chaque OS cible. Les régressions visuelles portent sur les états utiles et thèmes effectivement supportés ; ne pas multiplier exhaustivement les combinaisons sans usage.

### Composants du socle des applications créées

Le starter fournit des composants et patterns modifiables, reliés aux tokens du projet et composés avec Tailwind. Ils peuvent partager des principes et procédures de fabrication avec Loomata UI, mais leur identité visuelle et leur cycle de version sont propres au projet. React Aria est leur bibliothèque interactive de référence, sans dépendance au contenant Electron. Les sites éditoriaux peuvent utiliser davantage de HTML sémantique et moins de widgets interactifs ; les web apps riches peuvent composer plus largement ses primitives. Les compléments spécialisés répondent à des besoins hors catalogue, sans seconde fondation généraliste concurrente. Les tests incluent compilation autonome, thèmes, styles dynamiques importés et absence de dépendance d’exécution à Loomata UI ; les formats et parcours suivent le brief du produit créé.

## 7. Design Contract minimal et dette de modèle

**Constat.** [workspace-contract.ts](../../src/core/workspace-contract.ts) décrit déjà composants, tokens, variantes, pages, occurrences, parcours, demandes, tâches, modifications, commits, chantiers, décisions et correspondances Figma. Les UUID, révisions et relations sont contrôlés. [exploration.ts](../../src/core/exploration.ts) distingue présence, absence et ambiguïté des marqueurs ; [interface-binding.ts](../../src/core/interface-binding.ts) relie les occurrences enregistrées au rendu. Le [contrat de variantes](../../src/core/variant-recipes.ts) porte des attributions sans copier les valeurs. Le registre d’import conserve origine et version Figma.

Ces éléments sont le début du contrat recherché. **Ne pas ajouter un second arbre universel JSX/JSON à côté.** Ce qui manque n’est pas une nouvelle copie des couleurs ou de tout le DOM, mais une relation documentée et vérifiable entre intention, identité, API concrète et preuve. Le schéma existant de parcours ne prouve pas la réalisation de T2 ; le générateur texte/Figma universel n’est pas démontré.

### Extension minimale proposée

| Élément | Traitement proposé |
| --- | --- |
| Identité et provenance | Réutiliser UUID des entités ; conserver source Figma, nœud, version/hash comme provenance distincte |
| Liens vers code, tokens et variantes | Réutiliser `sourceKey`, fichiers et références ; ajouter seulement le lien typé manquant, sans valeur copiée |
| Spécifications et preuves | Références stables vers critères et preuves à une révision précise ; une preuve ancienne n’est pas un succès courant |
| Structure inspectable | Relations page/occurrence/parent déjà enregistrées ; ne pas inférer une identité durable depuis l’ordre du DOM |
| Interactions | Petits contrats d’attentes testables, tels que « Annuler restitue le focus et conserve la saisie » ; comportement exécutable dans le code |
| Capacités et limites | Déclarer ce qui est inspectable/modifiable et refuser l’opération non couverte, avec une raison explicite |

Un renommage conserve l’identité ; une copie reçoit une nouvelle identité avec provenance ; une suppression/récréation et un remplacement doivent avoir une règle explicite. Une ancre de source ou un hash de contenu seul ne suffit pas à assurer cette stabilité. Réutiliser les mécanismes d’identité actuels avant toute migration.

Le contrat doit rester sans import de React, Tailwind ou React Aria. Il référence un composant logique ; un adaptateur résout son implémentation. L’instantané Figma est un format d’entrée spécialisé, pas le langage canonique de tous les produits. Les comportements métier, calculs, callbacks, chargements et effets restent dans le code ; les critères d’acceptation restent dans les spécifications. Toute extension des champs exige validation, migration et test d’invalidation des projections.

Pour éviter les divergences : une commande vérifie la révision de base, applique le changement via les writers existants, régénère les projections puis relit l’état. Une modification libre du code peut rendre une correspondance manquante ou ambiguë ; afficher cette situation, sans réécrire silencieusement le contrat. Conserver la distinction intention déclarée, correspondance technique et comportement testé.

**Coût de maintenance :** chaque champ éditable durable ajoute schéma, sémantique, opérations, migration, reprise, UI et preuves à maintenir. Un graphe de liens limité reste proportionné ; un langage complet de layout et d’interactions demanderait en plus compilateur, interpréteur, éditeur, diagnostic et stratégie de compatibilité. Il ne serait justifié que par des transformations récurrentes impossibles à fiabiliser avec le modèle actuel. La réversibilité des décisions est réaliste ; l’interchangeabilité automatique de toute stack ne l’est pas sans adaptateurs qualifiés.

## 8. Adoption progressive et arbitrages

Le présent mandat s’arrête à l’étude. L’ordre ci-dessous prépare une future réalisation ; il ne lance aucun chantier et ne replanifie pas implicitement MVP-01.

Préparation de la première étape : [UI-ARCH-02 — cadrage commun](../work-items/ui-arch-02-common-framing.md), cadrage documentaire réalisé, sans implémentation ; [contrat v1](ui-architecture-boundaries.md), [décision 035](../decisions/035-ui-architecture-boundaries.md) et [première tranche UI préparée](../work-items/ui-arch-03-first-ui-slice.md).

### Séquence des deux périmètres UI

**Privilégier un enchaînement séquentiel initial.** Les deux périmètres partagent encore des contrats et outils de génération : les développer simultanément avant clarification des frontières risquerait d’introduire des conventions divergentes ou de modifier les mêmes sources. Le passage au socle des projets ne demande pas d’achever toute l’interface Loomata, mais de qualifier sa première tranche représentative.

| Ordre | Tranche et résultat attendu | Critères de passage |
| --- | --- | --- |
| 1 | **Cadrage commun** : définir les autorités et frontières des tokens, thèmes, composants, génération et exports des deux périmètres ; préciser les conventions DTCG → Tailwind, React Aria, API, tests et coexistence transitoire avec Base UI/CSS Modules | Responsabilités et dépendances explicites, absence de valeurs concurrentes, périmètre de la première tranche défini, adoption et autorités alignées dans le futur mandat avant code |
| 2 | **Première tranche de l’interface Loomata** : introduire Tailwind et React Aria sur un ensemble représentatif, par exemple navigation, formulaire d’inspecteur et dialogue ; conserver le cœur Node, les writers et le contenant Swift/WKWebView actuel | Conventions effectivement qualifiées : états, thèmes, clavier, sélection, validation, menus/portails et retour du focus ; génération unique, régressions et conservation des brouillons vérifiées ; aucun changement de contenant dans cette tranche |
| 3 | **Socle des projets créés** : préparer React Aria, Tailwind, thème dérivé, composants et stories autonomes dans le starter ; reprendre les méthodes qualifiées avec tokens et identité visuelle propres au projet | Création, compilation, Storybook et tests d’un site/web app neuf sans Loomata ni Electron ; formats/navigateurs selon le brief, séparation des tokens, absence de dépendance Loomata UI et projets existants préservés |

Après ces trois tranches, les extensions indépendantes peuvent être organisées en parallèle si leurs responsabilités, fichiers et critères sont distincts. Ce n’est ni une délégation actuelle ni une obligation de parallélisation. L’extension React Aria par famille retire les usages Base UI remplacés ; un lien ou une opération supplémentaire du contrat de conception n’est ajouté que pour une transformation concrète, avec contrôles d’identité, révision, reprise et couverture.

**Réalisation du socle, 14 novembre 2026 :** [UI-ARCH-04](../work-items/ui-arch-04-project-foundation.md) est qualifié techniquement après UI-ARCH-03 : [adoption 037](../decisions/037-project-ui-foundation-adoption.md), thème projet transactionnel, première famille React Aria et autonomie création/export vérifiés. [Bilan, revues et limites](../reviews/ui-arch-04-project-foundation.md), candidat `e6ab674` ; acceptation humaine différée. Les recommandations et l’ordre sont conservés ; Electron reste une tranche distincte, non lancée.

### Tranche distincte du contenant Electron

**Prévoir Electron séparément de l’introduction de Tailwind et React Aria.** Dans la séquence de référence, cette tranche suit les trois étapes ci-dessus ; elle ne bloque donc ni la première tranche UI ni le socle des projets. Elle remplace l’enveloppe Swift et le moteur WebKit par le contenant Electron/Chromium, sans refonte simultanée des conventions visuelles ou comportementales déjà qualifiées.

Son périmètre comprend passerelle contrôlée, isolation des aperçus, adaptation des ports système, supervision des processus, runtime d’outillage versionné, packaging, signature et mises à jour. Ses critères propres couvrent démarrage/arrêt et récupération, menus et raccourcis natifs, protection des brouillons, rendu/lecteurs d’écran et installation sur macOS, Windows et Linux. Les preuves acquises dans WKWebView restent datées et doivent être complétées pour Electron ; elles ne valent pas qualification du nouveau contenant.

Cette séparation permet d’attribuer une régression au changement de styles/composants ou au changement de contenant. Toute modification matérielle de cet ordre demande une décision documentée dans le futur mandat, sans rendre Electron implicitement préalable au socle web.

Pour chaque tranche de réalisation future, choisir d’abord les scénarios et budgets acceptables avec le besoin produit : taille/structure réelle de l’arbre, fréquence d’actualisation et matériel cible. Mesurer la référence et la nouvelle implémentation dans les mêmes conditions ; ne pas inventer de seuils ou promettre une amélioration sans résultats. Le retour arrière conserve code et sources de la référence, sans convertir les reçus existants.

| Arbitrage | Recommandation argumentée | Ce qui reste ouvert |
| --- | --- | --- |
| React Aria dans les deux architectures ? | Bibliothèque interactive de référence recommandée ; pas de seconde fondation généraliste à terme | Familles au-delà de la première tranche, conventions d’API et qualification progressive |
| Tailwind pour l’interface Loomata ? | Recommandé, proportionné aux espaces et composants du produit ; introduction progressive | Périmètre exact, cascade/Preflight et contrôles dans WKWebView ; retest Chromium dans la tranche Electron |
| Tailwind pour les applications créées ? | Recommandé par défaut dans le starter, avec thème et composants propres au projet | Préparation après la première tranche UI qualifiée, qualification autonome et exceptions justifiées par le brief |
| Loomata UI comme nouvelle bibliothèque ? | Oui comme frontière de conventions progressive, sans package imposé | Première famille ou premier pattern réellement partagé |
| Design Contract complet dès maintenant ? | Non ; prolonger les contrats existants avec des liens et opérations ciblés | Transformation concrète qui exige un champ nouveau |
| Générateur externe de tokens ? | Conserver le pipeline actuel ; Style Dictionary à comparer sur une cible d’export utile | Couverture réelle du profil DTCG et conservation des métadonnées/transactions |
| Interface outil et produits autonomes ? | Deux autorités de design et aucune dépendance d’exécution obligatoire à Loomata UI | Mesure des dépendances du kit exporté et éventuelle extraction du chrome |
| Electron ou Tauri pour Loomata ? | Electron recommandé : continuité Node et moteur commun sur les trois OS ; Tauri conservé comme alternative argumentée | Versions, portabilité des outils, isolation des aperçus, packaging, mises à jour et budgets mesurés |

La recommandation cible est **Electron pour le contenant de Loomata, React Aria et Tailwind dans les deux architectures, avec des design systems indépendants**, et un contrat de conception progressif. Les projets produits sont des sites web et web apps autonomes, pas des applications natives ni des applications Electron par défaut. Les arbitrages restants portent sur les modalités et versions de réalisation. Cette étude ne lance aucune installation, adaptation de code, conversion de données, ni mise à jour automatique de projet existant.
