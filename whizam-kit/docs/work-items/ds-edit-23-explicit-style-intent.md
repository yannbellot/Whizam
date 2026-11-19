# DS-EDIT-23 — Portée explicite dans Apparence et intention sémantique assistée

31 octobre 2026 — cible **application**, kit complet. **EN REVUE — qualification technique acquise, acceptation humaine différée.** Suivi consolidé dans la roadmap du lab ; modèles de suivi livrés non initialisés. Les paragraphes de préparation ci-dessous conservent leur portée historique ; la réalisation est suivie en fin de fiche.

## Mandat, version et limites de cette intervention

Préparer l’évolution discutée avec le porteur : retirer l’éditeur Styles et la création manuelle depuis les catalogues ; proposer trois choix explicites lors d’un changement de réglage effectivement relié à un token sémantique ; confier à Codex l’interprétation d’une nouvelle intention ; conserver un token de composant unique par réglage, sans numérotation. Cette demande autorise uniquement inspection et documentation, sans installation, code, tests, builds, serveur, inférence ni modification de la recette.

Racine Git vérifiée : `/Users/yannbellot/Documents/GitHub/agentic-design`. Base inspectée `c7e51a5583db2281684cf5ce77f43cab14cdfc84`, branche initiale `main`, arbre suivi propre. Les 85 entrées non suivies préexistantes, dont les copies suffixées « 2 » et `frontend/`, restent hors périmètre. Branche documentaire `codex/prepare-ds-edit-23`. Le premier essai de création de branche a été refusé par le sandbox ; la création locale a ensuite réussi avec autorisation ciblée, sans retrait de protection.

Catalogue applicatif consulté ; rôle Builder et procédures `plan-feature` et `design-interactions` sélectionnés explicitement dans la version de la base inspectée. Réutilisation méthodologique sous les règles du lab, sans exposition ou activation de bibliothèque supplémentaire. Travail séquentiel, même agent, non indépendant ; aucune délégation. Les règles décrites ici sont le contrat cible du chantier, pas une capacité déjà livrée ni une réécriture des autorités exécutées.

## Résultat observable attendu

Le designer choisit une valeur dans Apparence. Si la référence effective du réglage est sémantique, DS-EDIT affiche systématiquement une question de portée sous ce réglage. Le designer choisit de modifier le sens partagé existant, de définir une nouvelle intention, ou de personnaliser uniquement le réglage. Codex n’arbitre plus silencieusement entre ces trois intentions.

Les catalogues Primitives, Semantic Tokens et Component Tokens restent consultables dans l’organisation native DS-EDIT-19/20/21. L’onglet Styles, la création manuelle et la sélection de ligne ouvrant cet éditeur disparaissent. Les définitions, références, usages et accès aux aperçus utiles sont disponibles depuis Apparence ; retirer l’éditeur ne doit pas supprimer ces informations.

## Autorités et constats locaux

- [Contrat DS-EDIT](../product/features/design-system-editor.md), [autorités YAML](../../src/design-system/authority/README.md), [nommage](../design-system/token-naming.md), [organisation](../design-system/token-organization.md), [persistance](../design-system/editor-persistence.md) et [assistance](../design-system/editor-assistance.md).
- [Décision 017](../decisions/017-assisted-style-decisions.md) : Codex choisit actuellement parmi des plans bornés ; le réglage particulier est un repli conservateur. La présence d’un plan partagé n’impose pas de question. Les preuves de question DS-EDIT-14 sont simulées, distinctes d’un vrai appel ayant sélectionné un plan local.
- [Décision 022](../decisions/022-semantic-meaning-and-component-baseline.md), DS-EDIT-19 : modèle v4, snapshot v3, écriture v3 et politique assistée v3. Chaque réglage est déjà un token de composant ; `reference`, attribution `style` nullable et `baseReference` sont distinctes. Un réglage propre peut conserver une attribution sémantique historique tout en référant effectivement à une primitive.
- [DS-EDIT-22](ds-edit-22-declarative-naming.md) : `authority/naming.yaml` porte les règles consommées par `editor/naming.ts`. L’identité composant est déterminée par composant, variante, partie, propriété et état.
- `.storybook/editor/SemanticStyles.tsx` calcule les usages avec `getImpact`, distingue les réglages propres masqués et fournit `onPreview`. `Panel.tsx` sélectionne la story et le réglage correspondants ; ces mécanismes sont réutilisables.
- `editor/operations.ts` applique déjà modification partagée, attribution, réglage de composant et rétablissement ; `primitiveFor` déduplique par famille/type/valeur canonique. La création sémantique actuelle exige une intention déjà connue et éligible dans le catalogue.
- Le writer transactionnel utilise huit sources fermées dans `.storybook/editor/server/manifest.mjs`. Le catalogue sémantique n’est actuellement pas une source modifiable par cette transaction. Ajouter une intention décrite librement exige de traiter catalogue, validation, plans, sérialisation, génération et récupération ensemble ; un champ texte et un prompt ne suffisent pas.

## Règles cible retenues dans le mandat

### 1. Responsabilités et création

Supprimer les formulaires de création libre de token et les sélecteurs techniques de primitive/token depuis les catalogues. Ne pas réintroduire le choix d’un identifiant technique dans le parcours courant. La navigation par composants, propriétés et états reste nécessaire.

La règle « seul Codex crée » se traduit, selon l’ajustement proposé dans l’étude, par l’absence de fabrication manuelle d’identifiants : Codex interprète la description sémantique ; le moteur construit et valide les objets techniques, déduplique les primitives et enregistre exclusivement par le writer existant. Il ne faut pas appeler un modèle pour nommer une primitive déterministe ou modifier un token de composant existant. Le Codex connecté dans Storybook est distinct du chat de fabrication ; aucun accès implicite à ce chat.

Le socle reste utilisable sans compte IA : consultation, édition locale, choix explicite de portée partagée, aperçu et enregistrement disponibles dans les limites existantes. La création d’une intention depuis une description exige Codex ; en son absence ou en cas de panne, conserver la description et expliquer l’indisponibilité, sans simuler une interprétation ni créer automatiquement autre chose.

### 2. Déclenchement déterministe de la question

Après stabilisation d’une valeur valide réellement différente, si la **référence effective** pointe vers un token sémantique, afficher sous le réglage : « Ce réglage utilise le token sémantique [libellé]. Comment souhaites-tu appliquer cette modification ? » Trois choix restent visibles, avec leur éventuelle indisponibilité expliquée. Ce déclenchement est une règle du moteur/UI, sans inférence ; Codex ne peut ni l’omettre ni choisir à la place du designer.

Une saisie invalide affiche une erreur de champ ; une valeur inchangée ne crée ni question ni opération. Les cas de retour à une valeur attribuée, d’édition d’un geste en cours et de rétablissement doivent avoir des transitions explicites, sans question en boucle. Une réponse concerne ce geste seulement, avec cible, valeur et empreinte de brouillon ; aucun consentement de propagation général.

Si la référence effective pointe vers une primitive, l’édition est locale et directe, sans question sémantique automatique, même si `style` conserve une attribution pour rétablir. L’UI distingue alors le réglage propre et l’attribution conservée. Prévoir une action secondaire « Donner une intention sémantique à ce réglage », qui ouvre le même parcours de description, sans déduire le sens d’une couleur ou propriété.

### 3. Les trois choix

| Choix | Résultat et conditions |
| --- | --- |
| **Modifier le token sémantique partagé** | Afficher sa définition et les usages connus regroupés par composant, avec variante/partie/propriété/état. Chaque usage préparé est prévisualisable via un lien. Distinguer usages effectivement affectés, références de compatibilité et réglages propres préservés ; ne pas présenter un nombre de bindings comme un nombre d’exemplaires DOM. Un clic « Appliquer au token partagé » prépare le changement et l’aperçu, sans confirmation intermédiaire systématique. Inventaire incomplet ou domaine incompatible : choix visible mais indisponible avec raison ; aucune propagation silencieuse. |
| **Définir une nouvelle intention sémantique** | Demander « Quelle intention ce réglage doit-il exprimer, et dans quels usages ? ». Codex interprète cette description dans le contexte du projet et du catalogue. Il propose une intention définie indépendante du composant, une réutilisation existante ou une précision ciblée ; le moteur calcule le nom canonique. Afficher sens, identité proposée et portée avant « Appliquer cette intention ». Attribuer au seul réglage ciblé ; ne pas déplacer automatiquement d’autres consommateurs de l’ancien token. |
| **Personnaliser uniquement ce réglage** | Modifier la référence du token de composant existant vers la primitive appropriée ; réutiliser cette primitive si famille/type/valeur concordent, sinon la créer de façon déterministe. Préserver les autres réglages et le token sémantique partagé ; conserver l’attribution et la base nécessaires au rétablissement conformément au modèle v4. Aucun nouveau token de composant. |

La modification peut affecter des rendus hérités du réglage : les expliquer, sans promettre l’isolation d’un exemplaire DOM unique. En quittant Apparence pour voir un usage, conserver valeur, question, description et choix en brouillon ; prévoir un retour au geste d’origine qui ne réattribue pas sa question au composant visité.

### 4. Identités, doublons et sémantique nouvelle

**Un réglage possède un seul token de composant, dont le nom reste stable. Toute modification met à jour sa référence, sans créer de doublon ni ajouter de numéro.** Même composant/variante/partie/propriété/état signifie même token. Aucun contexte supplémentaire identifié ; ne pas étendre le modèle pour un cas hypothétique. Une collision technique est une anomalie à refuser et diagnostiquer, pas un arbitrage de design ou une proposition de suffixe.

Pour la sémantique, rechercher équivalences et synonymes avant création ; même valeur ne prouve jamais même intention. Si un équivalent existe, proposer sa réutilisation en expliquant ses conséquences. Ne pas modifier sa valeur partagée silencieusement lorsque la valeur souhaitée diffère : revenir à un choix explicite de portée ou conserver le réglage particulier. Ne pas créer un doublon renommé ou numéroté.

Une intention nouvelle documente définition, usages attendus et compatibilités rôle/type/état ; son identifiant suit les conventions existantes en anglais et son libellé explicatif reste français. Codex propose le sens et sa classification ; le moteur construit et valide le nom. Une description seulement décorative ne devient pas automatiquement une intention transversale. Si aucune intention valable n’est établie, demander la précision minimale ou proposer de revenir au choix local, sans changement imposé.

### 5. Brouillon, sauvegarde et protections

Un clic applique le choix au brouillon et à l’aperçu. **Enregistrer reste l’unique sauvegarde durable du brouillon complet.** Répondre ou prévisualiser un usage ne sauvegarde rien. Une question non résolue ou une interprétation en cours bloque Enregistrer avec raison et accès au réglage concerné. Annuler le geste conserve les autres modifications ; nouvelle valeur/révision invalide tout plan ou réponse périmé.

Préserver la comparaison, les annonces accessibles, clavier/focus, mobile, conflits, reçus, idempotence et reprise. Catalogue, description et réponse IA restent des données non fiables, sans HTML ni code exécutable. Aucune écriture libre par Codex, aucun élargissement de sa sandbox ou d’accès aux comptes. Le writer peut recevoir une extension fermée et versionnée pour les seules autorités nécessaires ; cela ne donne pas au modèle des chemins ou capacités d’écriture. Les limites de connexion, délais et budgets restent visibles et bornés.

## Réalisation future proposée

| Tranche | Travaux et dépendances | Preuve de sortie |
| --- | --- | --- |
| A — Contrat et compatibilité | Formaliser une décision successeur de 017 et des parcours Styles devenus historiques ; synchroniser spécification, flux et opérations. Définir schéma fermé d’intention proposée, persistance du catalogue, versions et refus d’anciens plans. Préserver règles DS-EDIT-19/22 et nommage. | Contrats implémentables couvrant les trois choix, les réglages autonomes, le mode sans IA et les données existantes, sans nouveau rôle fictif. |
| B — Apparence et suppression de l’ancien éditeur | Selon A, question déterministe, propagation explicite, réglage local, usages/retour d’aperçu et gestion du brouillon. Retirer onglet Styles, formulaires et événements de création/sélection associés ; conserver lecture des catalogues et informations depuis Apparence. | Question obtenue sans modèle sur référence sémantique ; aucune question automatique sur référence primitive ; mêmes identités et valeurs initiales. B seul n’est pas la livraison complète si l’interprétation de C manque. |
| C — Description et vraie interprétation Codex | Selon A, étendre le raccordement borné : description, recherche d’équivalent, clarification et proposition ; validation côté hôte puis attribution. Étendre la transaction/catalogue et les dérivés nécessaires, récupération comprise. Intégrer à B. | Nouvelle intention hors catalogue réellement persistée, réutilisation et refus prouvés ; vrai appel Codex sur copie isolée, sans simulation présentée comme preuve réelle. |
| D — Qualification, documentation et recette | Selon B/C, contrôles intégrés, revues, extraction autonome et comparaison des données initiales. Préparer la mise à disposition locale sans toucher à un brouillon humain actif. | Trois choix, consultation, sauvegarde/relecture et reprise qualifiés sur version identifiée ; recette humaine et acceptation différée explicites. |

Surfaces à examiner, sans obligation de toutes les modifier :

- UI/session : `.storybook/editor/{Panel,SemanticStyles,TokenCatalogPreview}.tsx`, `session.ts`, `assisted.ts`, `panels.ts`, `catalog-navigation.ts`, `panel.module.css`, `.storybook/manager.tsx` et `src/design-system/TokenCatalog.tsx`.
- Modèle et génération : `src/design-system/editor/{contract,operations,style-decision,draft,naming,snapshot}.ts`, autorités/catalogue/schémas concernés, `scripts/{editor-artifacts,editor-reader,editor-documentation,generate-tokens}.mjs`. Consommer `naming.yaml`, sans dupliquer les règles ni changer les noms existants.
- Service : `.storybook/editor/server/{codex,assistance,http,manifest,store}.mjs` ; sérialisation du catalogue, révision, validation et transaction fermées. Ne pas ajouter le catalogue à `sourcePaths` sans adapter les consommateurs qui traitent actuellement `sourcePaths.slice(2)` comme des fiches.
- Documents : décision successeur, spécification DS-EDIT, guides aperçu/persistance/assistance, architecture/sécurité et aides Storybook ; instructions livrées seulement si directement obsolètes, avec revue ciblée. Suivi de fabrication dans le lab, jamais dans les modèles livrés.

## Contrôles et critères de qualification futurs

**Non exécutés pendant cette préparation.** À réaliser sur copies isolées, jamais sur la recette humaine :

| Cas | Résultat exigé |
| --- | --- |
| Référence sémantique, nouvelle valeur valide | Trois choix systématiques, sans dépendre de la réponse du modèle ; sauvegarde bloquée avant décision. |
| Valeur invalide, inchangée, rétablissement, saisies rapides | Pas de faux appel, boucle de question ou opération périmée ; erreurs de champ et transitions explicites. |
| Référence primitive, avec ou sans attribution conservée | Édition locale directe ; une seule identité composant ; rétablissement vers attribution courante ou base selon v4. |
| Choix partagé | Usages cliquables, état/variante corrects et retour au geste initial ; valeurs propagées aux références effectives, exceptions et autres gestes conservés. Inventaire incomplet et incompatibilité refusés. |
| Choix local, modifications répétées | Référence mise à jour sans doublon, suffixe ou nouvelle identité ; primitives dédupliquées selon famille/type/valeur. |
| Description sémantique | Nouvelle intention réellement absente du catalogue créée et attribuée ; définition/compatibilités et nom valides après relecture. Équivalent, description vague/décorative et collision traités sans doublon ou propagation implicite. |
| Codex connecté/absent/lent/en erreur | Vrai aller-retour description → proposition → application → sauvegarde/relecture ; aucune inférence pour les choix déterministes. Sans IA, socle opérationnel et description conservée, sans faux succès. |
| Navigation, annulation, concurrence | Geste, question et description conservés au retour ; réponses tardives, anciennes révisions et double application refusées ; autres gestes préservés. |
| Transaction étendue | Catalogue et tokens atomiques après interruption, réponse perdue et récupération réelle ; aucun catalogue orphelin, reçu ancien converti ou référence absente. |
| UI retirée et consultation | Aucun onglet Styles ni création/sélection ouvrant l’ancien éditeur ; catalogues, catégories, documentation et informations utiles consultables. Clavier, annonces, focus et mobile vérifiés. |
| Sécurité, statique, extraction | Sorties malveillantes refusées, protections HTTP/confinement inchangées ; pas de service IA ou écriture en statique/runtime. Extraction renommée autonome et déconnectée, sans compte transféré. |
| Conservation initiale | Aucun changement de nom, valeur résolue ou rendu par le seul changement de parcours ; couleur enregistrée `#b51a00`, anciennes racines, reçus et connexion préservés. |

Commandes candidates depuis la copie isolée : `npm test`, `npm run test:design-system`, `npm run test:design-agent`, `npm run test:design-editor:server`, `npm run test:design-system:docs`, `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run docs:design-system:check`, `npm run build`, `npm run build-storybook`. Parcours : `npm run test:design-editor:dev`, `npm run test:design-editor`, `npm run test:design-editor:persistence`, `npm run test:design-editor:recovery` (transaction/catalogue affectés), `npm run test:design-editor:live`. `npm run validate:agent-kit` si documentation référencée ou instructions livrées modifiées. Ajouter les scénarios manquants avant qualification ; les suites existantes seules ne prouvent ni les trois choix ni une intention nouvelle.

Revues applicables à la réalisation : design (portée, usages, description et simplicité), technique/QA (graphe, catalogue, concurrence et transaction), sécurité (texte libre, sorties IA, extension fermée du writer et données privées). Instruction Reviewer si procédures livrées changées. Séquentielles, même agent, non indépendantes sauf autorisation de délégation ultérieure. Pour cette préparation : relecture documentaire Builder, sans prétendre à ces revues runtime.

## Exclusions, hypothèses et reprise

Exclus : nouvelle palette, thème, mode, variante ou propriété, redesign des composants, backend/framework supplémentaire, fournisseur alternatif, installation globale, déplacement d’une connexion, modification métier/DB, sauvegarde automatique, publication et acceptation de G/J5. Pas d’extension hypothétique de l’identité composant ou de système de numérotation.

Hypothèses minimales reprises de l’étude : référence effective comme déclencheur ; personnalisation préservant attribution/base v4 ; action secondaire d’intention pour un réglage autonome ; un clic prépare le brouillon, Enregistrer le rend durable ; retrait des commandes d’édition des catalogues mais conservation de leur lecture. Ces hypothèses de parcours restent à retester humainement ; elles ne constituent pas une acceptation visuelle. La décision successeur explicitera leur articulation avec les autorités historiques avant implémentation.

La préparation peut être achevée sans arbitrage bloquant. Une demande ultérieure exigeant littéralement une inférence pour toute primitive, une écriture directe par Codex ou une sauvegarde immédiate modifierait le contrat présenté ici et devra être cadrée avant cette partie. Aucun accès IA ni consentement de connexion n’est déduit de cette fiche.

### Recommandation de réalisation

**GPT-6.1 Sol · Élevée** pour A–D. Résultat défini ; UI/session, catalogue/validation, plans d’assistance et transaction ont plusieurs contrats dépendants à modifier ensemble. Les frontières observées sont le texte libre entrant dans une proposition persistante et l’ajout du catalogue au writer fermé. Les inconnues portent sur le schéma minimal, la compatibilité et la récupération à détailler en A ; aucun échec observé ou difficulté étayée ne justifie très élevée/max/Astra. La préparation documentaire seule ne modifie pas ces frontières. Réglage client ni vérifié ni modifié ; réutiliser cette analyse à périmètre inchangé.

## Bilan de préparation

Livrables : cette fiche et les entrées de `ROADMAP.md` / `docs/project-state.md` du lab. **Doc updated.** Contrôles documentaires : `git diff --check` conforme ; neuf liens locaux de la fiche résolus et deux renvois du suivi vérifiés ; 85 entrées non suivies préexistantes conservées. Relecture Builder séquentielle du périmètre, des règles discutées et de la distinction préparation/réalisation : satisfaisante pour cette préparation, sans revue indépendante ni qualification runtime. Diff final limité à ces trois documents, sans secret, donnée personnelle ou configuration privée ajoutée. La version documentaire est portée par le commit local de préparation sur la base citée. Tests, builds, parcours navigateur et appel Codex **non exécutés**, conformément à la demande. Aucune modification applicative, recette, autorité, compte ou publication. Risque résiduel : le parcours et la création transactionnelle d’intentions nouvelles ne sont pas implémentés ; les preuves antérieures ne les qualifient pas.

Prochaine action : mandat explicite de réalisation de **DS-EDIT-23**, en commençant par A puis B/C et D selon leurs dépendances. Rendre la main après préparation ; ne pas démarrer ces tranches sur la seule inscription dans la roadmap.

## Réalisation — point de reprise

Mandat reçu : réaliser A–D jusqu’à qualification technique et mise à jour de la recette locale. Départ `0ee15a8932bda62d310a385f24615358f1589d18`, branche `codex/explicit-style-intent`, arbre suivi propre. Procédure `implement-feature` consultée explicitement ; rôle Builder, même agent séquentiel sans délégation. Les 85 préexistants restent hors périmètre.

Tranche A en cours : [décision 023](../decisions/023-explicit-style-intent.md), inspection des consommateurs de catalogue, plans, snapshot et transaction. Aucun code/runtime ou compte modifié à ce point. Contrôles de réalisation non exécutés ; recette locale non actualisée.

### Arrêt avant implémentation — réflexion Très élevée recommandée

L’inspection de réalisation précise une difficulté couplée, au-delà de la simple présence de plusieurs fichiers :

- `src/design-system/editor/snapshot.ts::assertSnapshot` exige l’égalité exacte du catalogue avec celui compilé de confiance, ainsi que du contrat et de la présentation. Un ajout valide d’intention serait donc refusé à la relecture après sauvegarde. Retirer simplement cette égalité ouvrirait aussi les catégories, compatibilités et taxonomie : cela n’est pas la solution retenue.
- `editor/operations.ts::applyOperations` et `applyRequest` renvoient actuellement un modèle de tokens, sans résultat de catalogue. La validation de `contract.ts::validateEditorRequest` suit un autre parcours ; tous deux supposent une intention déjà connue. Session, canal d’aperçu et service d’assistance reconstruisent eux aussi une projection en remplaçant seulement `model`. Il faut établir comment une extension d’intention traverse ces chemins sans mutation de la base ni mélange entre gestes.
- `server/store.mjs::serializeSources` suppose que les deux premières sources sont primitives et tokens sémantiques, et que toutes les suivantes sont des fiches. `prepare` régénère sur arbre isolé avant publication, puis la transaction rejoue les postimages. Ajouter le catalogue exige un résultat catalogue explicite, une sérialisation dédiée et des preuves d’interruption/récupération portant sur ce nouvel ensemble atomique, pas uniquement une extension de manifeste.
- Le raccordement Codex utilise actuellement un schéma de sélection de choix connus, traité dans `server/codex.mjs::decodeCodexDecision`. Une proposition libre et bornée d’intention n’est pas un choix connu ; sa corrélation, sa validation, son application explicite et son refus en cas de révision différente doivent être coordonnés avec les projections et le writer, sans accorder au modèle de nouveaux droits.

**Incertitude à résoudre en A :** forme minimale d’un résultat transactionnel modèle + catalogue, validation d’une extension uniquement additive des intentions/éligibilités, frontières immuables conservées et versionnement des plans/écritures. Ne pas supposer qu’un changement de prompt ou d’une seule garde résout ces points. Les options ne changent pas le résultat produit demandé ; aucun nouvel arbitrage produit n’est sollicité.

**Recommandation révisée : GPT-6.1 Sol · Très élevée (`xhigh`)**, pour résoudre ce contrat puis réaliser et qualifier A–D. Motif : difficulté d’examen conjoint de la confiance du snapshot, des projections de brouillon et de la récupération atomique d’une nouvelle autorité modifiable. Aucune nécessité étayée d’Astra/max/Ultra ou de délégation. La recommandation Élevée de préparation reste historique ; le réglage client n’est ni vérifié ni modifié.

Conformément à AGENTS, arrêt avant modification du code et attente d’une sélection manuelle puis d’une demande explicite de reprise. Le mandat A–D reste établi ; il n’a pas à être redemandé. À la reprise : relire ce point, résoudre A et ses tests négatifs, puis poursuivre B/C/D et la recette. Ne pas refaire toute la préparation.

Bilan intermédiaire : trois documents de suivi et un projet de décision ; aucune qualification technique, aucun test/build/inférence, serveur ou parcours navigateur exécuté. Revue Builder documentaire séquentielle, même agent non indépendant. **Doc updated.** La recette 54118, ses données et sa connexion n’ont pas été manipulées ; sa présence et l’état du brouillon n’ont pas été revérifiés pendant cette réalisation. Les observations de la conversation précédente restent datées. Risque résiduel : évolution entièrement non implémentée ; A incomplet, B/C/D non commencées. Contrôles documentaires : `git diff --check` conforme ; treize liens ciblés résolus (dix dans la fiche, un dans la décision et deux renvois de suivi) ; diff de quatre documents relu, sans secret ni configuration privée ajoutée ; 85 préexistants conservés. Commit local du point de reprise, sans fusion de réalisation non qualifiée ni publication.

## Bilan de réalisation A–D

Reprise explicite reçue après le point d’arrêt ; aucune sélection client inaccessible n’est prétendue. A–D réalisés, avec [preuves et quatre revues](../reviews/ds-edit-23-explicit-style-intent.md) séquentielles, même agent non indépendant. La décision 023 et le guide courant portent le contrat ; le journal et l’arrêt ci-dessus restent historiques, sans action de configuration encore attendue.

Question déterministe à trois choix, usages cliquables/retour, description interprétée explicitement avec Codex, ajout transactionnel d’intention et token de composant unique sont réalisés. Formulaire manuel et onglet Styles retirés ; catalogues consultables. Modèle v4 / snapshot v3, écriture v4, interprétation v1 et manifeste v9. Anciennes autorités d’intention/domaines fixes ; ajouts bornés dans les catégories existantes. Aucun nom ou valeur initiale du kit changé.

Contrôles : 116 unitaires, 74 contractuels, 84 scénarios serveur qualifiés entre campagnes dont 48 frontières de remplacement avec catalogue ; 12 assistance synthétique, cinq documentaires, 42 parcours dev / 40 statiques entre campagne et retest, 12 persistants, quatre récupérations navigateur et SIGKILL de catalogue réels. Les exclusions et diagnostics restent dans le bilan. Vrai parcours navigateur Codex → proposition → application → sauvegarde/relecture réussi sur copie isolée ; nouvelle intention absente du catalogue également persistée. Types/lint/formatage/docs/kit et builds conformes ; extraction renommée déconnectée et actualisation de l’application active qualifiées.

Recette nouvelle **54123** chargée dans Safari, sans brouillon, avec les 188 identités et le modèle enregistré conservés, dont `#b51a00`. L’ancien onglet **54118**, ses données, reçus, connexion et brouillon d’essai `#2563eb` sont préservés ; pas de mise à jour en place d’une instance portant ce brouillon. Aucune connexion n’est transférée : l’interprétation sur la nouvelle recette demande sa connexion propre. Ce choix de livraison réversible évite un abandon humain non autorisé.

Fichiers : moteur d’intentions/transactions, validation/snapshot/protocole, service Codex et writer, panneau/session/catalogues, retrait de SemanticStyles, tests/parcours, six paragraphes de procédures, décision/guides/spécification et preuves ; détail immuable dans le manifeste du bilan. **Doc updated.** Pas de nouvelle dépendance ni modification globale. Réserves : recette et acceptation humaine, second utilisateur, compatibilité hors macOS/CLI testé et interprétation sémantique au-delà des exemples vérifiés. Aucun push/publication ou clôture G/J5 ; modèles livrés non initialisés.

Prochaine action : recette humaine via le bilan lié ; mandat de réalisation achevé après intégration locale des fichiers qualifiés, sans ouvrir de nouveau chantier.

## Correction de recette — clarification Codex

Retour utilisateur : après « Interpréter avec Codex », aucun retour exploitable ni enregistrement. Observation dans la recette 54123 : Codex a répondu par une question, affichée comme un paragraphe ordinaire, sans champ de réponse. Le verrou d’enregistrement fonctionne mais le parcours de clarification est incomplet.

Tranche corrective autorisée dans l’app, base `d855b32`, branche locale `codex/fix-intent-clarification` ; arbre suivi propre et préexistants hors périmètre préservés. Procédures `implement-feature` et `design-interactions` du catalogue applicatif, versions de cette base. Périmètre : panneau, session d’interprétation, transmission bornée des précisions au service, tests et guide/preuves directement concernés. Aucun changement de tokens, de portée, du writer ou des comptes.

Choix délégué : distinguer explicitement question, réponse et erreur ; transmettre la description initiale avec au plus cinq échanges de clarification validés comme données, conserver la saisie en cas d’échec et invalider une réponse après modification. Une proposition reste à appliquer avant l’enregistrement. Vérifications prévues : tests session/serveur, parcours navigateur simulé question → précision → proposition → application, types/lint/formatage et build Storybook. Revues design, technique et sécurité séquentielles, même agent non indépendant. La recette ouverte et son brouillon restent conservés ; la livraison corrigée ne doit pas les recharger implicitement.

Correction réalisée et techniquement qualifiée : [bilan, captures et revues](../reviews/ds-edit-23-clarification-feedback.md), neuf sources identifiées par empreintes. Question/réponse dédiées, attente sur le bouton, erreur près du champ, contexte borné et conservé lors d’un échec, application explicite. Contrôles : 120 unitaires, 13 assistance, cinq documentaires, six parcours dev ordinateur/mobile, quatre statiques et deux exclusions IA statiques ; types/lint/formatage/build Storybook conformes. Les réponses du nouveau parcours navigateur sont simulées ; nouvel échange authentifié et sauvegarde après précision restent à retester humainement. Trois revues séquentielles, même agent non indépendant, satisfaisantes avec les réserves du bilan.

Recette corrigée **54124** prête : chargement de « Bouton · Disabled », Fond `#64748b`, entrée éditable et message « Instance locale prête à enregistrer » vérifiés dans le navigateur après redémarrage du seul nouveau service. Modèle et catalogue enregistrés identiques, 188 identités conservées ; aucune connexion ni reçu transféré. **54123** et son brouillon non enregistré sont laissés intacts ; **54118** reste également inchangée. La correction n’a pas été injectée dans ces services portant des brouillons. Aucun nouvel appel IA fournisseur, changement de dépendance, permission globale ou publication.

Fichiers affectés : panneau/session, assistance et prompt, trois suites de tests, guide, fiche, rapports/captures et suivi de fabrication racine. **Doc updated.** Les 85 préexistants restent hors sélection. En revue, qualification technique acquise, acceptation humaine différée. Intégration locale dans le commit de correction ; reprise : connecter son propre compte sur 54124, reproduire l’essai, préciser le sens réel de l’action, appliquer puis enregistrer, avec les contrôles de contraste habituels. Aucun autre chantier ouvert.
