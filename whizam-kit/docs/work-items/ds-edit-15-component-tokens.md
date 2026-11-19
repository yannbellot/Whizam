# DS-EDIT-15 — Tokens de composant et primitives neutres

30 octobre 2026 — cible application. **En revue — qualification technique acquise, acceptation humaine différée.** Reprise explicitement autorisée avec GPT-6.1 Sol en réflexion très élevée. Base de reprise `7ff953e`, branche `codex/ds-edit-15-migration` ; sélection déclarée par le porteur, réglage client non vérifié par l’agent. Préparation initiale : base `45ac0dc`, branche `codex/component-token-rules`, aucun diff suivi initial, 50 entrées non suivies préexistantes préservées. Racine Git canonique vérifiée. Modèles de suivi applicatifs non initialisés.

## Résultat de la préparation initiale

La [décision 018](../decisions/018-complete-token-coverage.md) formalise la demande du porteur : tout style passe par un token sémantique ou de composant, chaque token atteint une primitive, les primitives ne portent pas de sens métier. La [décision 019](../decisions/019-token-naming-by-family-and-usage.md) précise les [règles de nommage cibles](../design-system/token-naming.md). Aucune de ces règles ne prétend avoir migré le parcours ouvert ni ses données.

Procédures plan-feature et normalize-design-system consultées explicitement à `45ac0dc`, rôle Builder, séquentiel, même agent non indépendant. Leurs mentions d’exceptions décrivent le modèle précédent : les synchroniser lors du raccordement, avec revue d’instructions ciblée. Aucun appel fournisseur implicite.

## Constats de départ et périmètre de réalisation

- `editor/contract.ts` impose intention et identité `semantic.*` ; une étiquette de catalogue ne suffit pas.
- `Binding.exception`, le snapshot et `set-exception` relient directement le réglage à une primitive ; remplacer cette branche par un token en conservant attribution d’origine et rétablissement.
- `style-decision.ts` ne propose pas de nouvelle identité quand le style sémantique existe déjà. Le réglage particulier doit produire un token de composant stable, sans doublon à chaque saisie.
- Les primitives mêlent usage/composant/valeur (`feedback.error`, `button-background`, `surface.default`, etc.). Renommer exige une table complète des références.
- Résolution, dérivés, catalogue et manifeste fermé de persistance dépendent des mêmes identités ; préserver les anciennes racines et leurs reçus avec leur version.

## Tranches et critères

| Tranche | Travail | Preuve attendue |
| --- | --- | --- |
| A — Modèle | Catégories, identité, familles/domaines distincts des types, propriétaire, portée, attribution d’origine et résolution. | Refus de valeur sans token, cycles, références absentes, types incompatibles et réutilisation hors portée ; collisions d’identités et de dérivés ; stratégie explicite pour anciens snapshots/opérations. |
| B — Migration | Primitives et sémantiques renommés selon 019, exceptions converties ; table ancien/nouveau et provenance. | Mêmes valeurs/rendus et intentions distinctes ; répétition sans doublon et reprise contrôlée. Cas réel `#b51a00` sur copie, sans écraser la recette. |
| C — Parcours | IA/règle locale, aperçu/sauvegarde, catégories Tokens et accès depuis Apparence. | `#b51a00` visible comme token de composant avant/après sauvegarde/rechargement ; Action principale et autres consommateurs préservés ; saisies successives sur une seule identité. |
| D — Qualification | Contrats, génération, persistance/HTTP, desktop/mobile/statique/sans IA, docs et skills. | Contrôles proportionnés et revues design/technique/sécurité/instructions ; extraction/reprise ; acceptation humaine distincte. |

Surfaces : autorités/fiches YAML ; `editor/contract.ts`, `operations.ts`, `draft.ts`, `snapshot.ts`, `style-decision.ts`, `token-resolution.ts` ; scripts validation/génération/documentation ; catalogue/panneaux `.storybook/editor/` ; serveur/manifeste et tests. Déterminer le stockage minimal compatible avant tout ajout à la liste fermée.

Exclusions : nouvelle direction visuelle, rouge promu automatiquement en erreur, refonte des intentions, nouvelle dépendance/backend, purge d’historique, transfert de compte et publication. Les thèmes, formats et clés de contenu illustrés par 019 ne sont pas de nouvelles capacités à implémenter en A–D.

## Vérification et reprise

### Complément du 30 octobre — règles de nommage

Mandat documentaire : faire évoluer les règles à partir de la référence fournie par le porteur, dont palettes, valeurs, collections et arborescences sont indicatives. Base `cf761933faba01feeacf266156f7a30eb114ae15`, branche `codex/token-naming-rules`, racine Git canonique vérifiée ; aucun changement suivi initial, 50 entrées non suivies préexistantes à préserver. Cible application ; le suivi de fabrication reste dans le parent. La préparation ci-dessous précède les changements de règles.

Périmètre : référence autonome de nommage dans `docs/design-system/`, décision dédiée, renvois des principes, de la spécification et du README d’autorité ; précision de 018 et de cette fiche. Exclusions : YAML, schémas, code, dérivés, migration des identités, valeurs et rendus, thèmes, traduction, services, comptes, copies externes et publication. Le modèle courant doit rester décrit comme tel.

Procédure lab-maintain-agent-kit ; catalogue app consulté, méthode normalize-design-system sélectionnée explicitement à `cf761933` pour la seule organisation documentaire, sans l’activer comme skill du lab. Lab Maintainer puis Instruction Reviewer via lab-evaluate-instructions, séquentiel, même agent, non indépendant. Revue documentaire design/technique/sécurité ciblée ; pas de nouvelle campagne web pour ce changement de règles seul.

Critères préalables : primitives sans rôle métier ; familles techniques distinctes des types de validation ; tokens sémantiques nommés par usage et tokens de composants par réglage ; modes séparés des identités ; aucune palette ni fonctionnalité imposée par les exemples ; adaptation aux identifiants à points existants ; compatibilité et collisions explicitement à qualifier avant migration. Scénarios de revue : couleur isolée sans palette, dimensions d’unités différentes, même valeur pour deux intentions, thème/format, contenu facultatif et demande trompeuse de migration implicite.

Contrôles prévus : liens locaux des documents touchés, syntaxe des exemples, formatage ciblé, validateurs lab/app, diff et conservation des fichiers préexistants. Aucun test de propagation, build, serveur ou essai natif nécessaire pour ces seules règles ; leurs preuves restent à produire en A–D. Recommandation : GPT-6.1 Sol · Moyenne pour cette rédaction localisée ; Élevée pour la future migration multi-contrats. Réglage client non vérifié.

Résultat : **règles de nommage En revue, qualification documentaire acquise, acceptation humaine différée** ; réalisation A–D toujours À faire. [Revue et preuves](../reviews/ds-edit-15-token-naming.md) : validateurs lab/app conformes, six tests lab réussis, liens internes et exemples vérifiés, 61 fichiers préexistants identiques. Aucun changement runtime ni nouvelle capacité ; cas complexes et collisions à qualifier lors du raccordement. **Doc updated.**

Bilan de préparation initiale à `45ac0dc` : liens, diff et cohérence relus, même agent non indépendant. Aucun test, build, serveur, migration ni appel IA exécuté dans cette préparation ; aucune qualification runtime revendiquée. La valeur enregistrée `#b51a00` est préservée dans son instance.

Hypothèse de préparation conservée : rattachement à une primitive par résolution complète avec alias valides conservés. La proposition initiale de noms par type/valeur est remplacée par 019 ; la réutilisation doit aussi respecter la famille pertinente. Pour la réalisation : GPT-6.1 Sol · Élevée au minimum, car migration et contrats dépendants/persistance ; aucune hausse supplémentaire justifiée sur cette préparation. À résoudre en A : stockage des tokens de composant, compatibilité snapshots/opérations, correspondance des intentions et encodage des primitives complexes.

## Réalisation demandée — diagnostic et point de reprise

Mandat explicite du porteur : réaliser DS-EDIT-15 selon 019 sans modifier valeurs ni rendus. Base `96f917a048ec27ba646c51668a537c3e9bcaa451`, branche `codex/ds-edit-15-migration`. Racine Git canonique vérifiée avant écriture ; aucun diff suivi initial. Les 50 entrées non suivies initiales représentent 61 fichiers, dont les empreintes privées sont conservées sous `.local/ds-edit-15/preflight.local.json`. Aucune reprise des copies ambiguës. Périmètre annoncé : A–D, autorités et fiches, modèle/contrats, opérations, résolution/génération, catalogue/panneaux, persistance/manifeste, tests, documentation et procédures directement affectées. Exclusions initiales conservées.

Procédures lab-maintain-agent-kit et méthodes applicatives plan-feature, normalize-design-system et implement-feature consultées explicitement à `96f917a` après lecture du catalogue ; usage borné au mandat, sans exposition active de la bibliothèque app dans le lab. À ce stade, seul le diagnostic de préparation a été exercé par le Lab Maintainer, séquentiel, sans délégation. Les revues de réalisation ne sont pas encore effectuées.

### Cinq dimensions inspectées

| Dimension | Fait confirmé et conséquence |
| --- | --- |
| Résultat | 018/019 et la demande imposent conservation des valeurs, rendus, intentions, attribution d’origine et rétablissement. Ni thèmes ni traduction à ajouter. |
| Chemins | `editor/contract.ts`, `operations.ts`, `draft.ts`, `snapshot.ts`, `style-decision.ts`, `token-resolution.ts`, catalogue, fiches et panneaux partagent les identités. `TokenCatalog.tsx` ne liste actuellement que `model.styles`. |
| Frontières | `server/store.mjs` lie révisions et reçus aux octets/modes du manifeste et aux identités de fichiers/racine. `readJournal` exige la liste exacte des dépendances ; le guide de persistance impose de garder l’ancienne racine et son outillage. Aucune conversion de reçu ni transfert de compte autorisé. |
| Contrats et preuves | `styleId`, `styleKey` et `validateEditorModel` imposent une intention sémantique et refusent tout identifiant commun aux styles et bindings ; les snapshots Zod et schémas JSON sont fermés. Les opérations et la politique conservent encore `set-exception`. La migration doit faire évoluer ces producteurs/consommateurs ensemble. |
| Inconnues précises | Stockage du token de composant et de son attribution d’origine sans identité concurrente ; correspondance un-vers-plusieurs des primitives par famille ; compatibilité des anciennes opérations/snapshots et bascule vers une racine neuve sans perte de brouillon. Ces points restent à résoudre et à éprouver en A, pas à masquer par des remplacements de chaînes. |

### Difficulté constatée et arrêt de configuration

La primitive `primitive.space.button-inline` alimente à la fois les rôles `spacing` et `font-size`. La règle de famille pertinente exige donc une table qui peut scinder une référence historique, puis suivre toutes les chaînes sémantiques et les 24 alias sans modifier leur valeur. `primitive.color.feedback.error` est partagée entre texte et bordure : conserver ce partage de valeur ne fusionne pas leurs intentions.

Les 188 bindings ont déjà les identités cibles `component.<component>.<variant>.<part>.<property>.<state>`, mais `EditorStyle` n’accepte que des identités sémantiques et le graphe refuse tout doublon entre styles et bindings. Ajouter simplement un style de composant portant l’identité du binding échouerait. Le stockage et la résolution doivent préserver la distinction entre token, attribution et réglage tout en raccordant sélection, aperçu, rétablissement et sauvegarde. Hypothèse technique à examiner en A : utiliser le binding comme autorité du token de composant, avec référence et attribution d’origine explicites, sans seconde identité dupliquée ; ce choix n’est pas implémenté.

Enfin, le journal stocke des préimages/postimages et vérifie le manifeste exact. Les nouveaux schémas, identités et références ne peuvent pas être rejoués sur les anciens reçus. Il faut comparer une copie migrée aux valeurs rendues de l’ancienne racine, laisser ses journaux intacts et qualifier les nouvelles interruptions avec le nouveau contrat. La combinaison de ces transformations et des preuves de rétablissement/récupération justifie **GPT-6.1 Sol · Très élevée (`xhigh`)**, au-delà du plancher Élevée retenu lors de la préparation. Aucun besoin de max ou d’Astra établi.

Selon AGENTS du lab, cette hausse impose un arrêt avant la partie concernée, puis sélection manuelle et demande explicite de reprise. Le réglage actuel du client n’est pas accessible ; aucun changement de configuration ni sous-agent effectué. Le mandat A–D reste autorisé, sans nouvelle décision produit demandée.

### Contrôles réellement exécutés avant arrêt

- Depuis la racine app : `node scripts/validate-design-system.mjs --test-invalid` : six autorités conformes, quatre cas invalides rejetés, 188 bindings et 41 styles valides.
- Depuis la racine app : `node --test tests/design-system-editor.test.mjs tests/design-system-migration.test.mjs tests/design-editor-snapshot.test.mjs` : **47 tests réussis**. Preuve du modèle courant uniquement.
- Inspection Node en lecture seule via `loadCanonicalEditorModel` et `generateEditorTokenArtifacts` : sources du kit à 28 primitives, 41 styles et 188 bindings ; instance `.local/ds-edit-14/preview` à 29 primitives, 41 styles, 188 bindings et 24 alias. Le fond de Button y est résolu exactement en `#b51a00` via `primitive.color.designer-edit-1`, avec attribution d’origine `semantic.color.actions.primary.surface.default`. Aucune sauvegarde ni compte manipulé.
- Empreintes des huit sources enregistrées de cette instance relevées en lecture seule pour le point de reprise. Aucun test navigateur, build, migration, appel IA ou relecture de compte exécuté ; aucune équivalence du futur modèle revendiquée.

Seuls cette fiche, le statut de fabrication racine et son point de reprise sont actualisés dans ce diagnostic. **Doc updated.** Aucune qualification de réalisation ni acceptation humaine. Contrôles finaux : `git diff --check` conforme ; 214 liens locaux/ancres des trois documents résolus ; 61 préexistants et huit sources de recette strictement identiques aux empreintes relevées. Aucun secret, compte, donnée personnelle ou état privé inclus dans le diff.

Reprise après sélection manuelle et instruction explicite : résoudre A (stockage, table de correspondance/familles, compatibilité et versionnement), créer les comparaisons des valeurs résolues et héritées avant/après sur copies isolées, puis enchaîner B–D dans le mandat. La bascule de l’instance doit vérifier absence de brouillon/requête en attente ; anciennes racines, reçus et état de connexion restent préservés. Aucun push ni publication. Le parcours ouvert conserve DS-EDIT-14 et `#b51a00`.

## Reprise de réalisation — A–D

Mandat et très élevée confirmés par le porteur. Version témoin autonome extraite sous `.local/ds-edit-15/before`, sans état privé ni compte, avec dépendances locales existantes raccordées. La recette DS-EDIT-14 reste intacte. Choix technique délégué : le binding est lui-même le token de composant canonique ; sa référence effective est explicite et son attribution sémantique d’origine est conservée pour le rétablissement. Aucun style de même identité n’est ajouté. Les primitives portent leur famille et conservent les provenances historiques lors d’une déduplication.

Versionner modèle/sources et protocole ; les anciens snapshots/opérations sont refusés par le nouveau service, et les reçus restent dans leur racine d’origine avec son outillage. Migrateur explicite sur sources isolées, table ancien/nouveau et comparaison des valeurs résolues avant toute écriture ; répétition sans changement. Critères A–D et revues du tableau initial maintenus. Les tests de conservation couvrent toutes les valeurs, héritages/rétablissement, les 188 raccordements et les 14 comparaisons navigateur desktop/mobile, ainsi que le cas enregistré `#b51a00`.

### Bilan runtime avant extraction finale

A–C réalisés et contrôlés, D en cours de clôture : [preuve et revues](../reviews/ds-edit-15-component-tokens.md), [décision 020](../decisions/020-component-token-reference-model.md), [migration autonome](../design-system/token-migration.md). Modèle/sources v3, snapshot v2, sauvegarde protocole 2, manifeste v4. 55 contrats/migration, 122 unitaires, 74 serveur, dix assistance simulée, cinq documentation, campagnes navigateur et quatre récupérations réelles réussis. Quatorze captures identiques et 188 propriétés câblées ; les huit sources réellement enregistrées sont migrées sur copie avec toutes leurs valeurs et `#b51a00` conservés. Les 61 préexistants et les huit empreintes de recette restent identiques. **Doc updated.** Pas de publication ni transfert de compte ; qualification de distribution du candidat immuable avant intégration locale, acceptation humaine distincte.

### Clôture technique A–D

**A–D réalisés et techniquement qualifiés**, candidat runtime `813a045`, contrôle de capture final `665b61e453e4bf05549cbbdd6724bcdf3b4c7cb6` ; arbre app `4a0160e6e3685170499a3f27402825c87d241eab`. Extraction installée hors ligne avec ses propres dépendances, types et deux builds conformes ; déplacement/renommage puis comparaison exacte des 373 sources. Retest final : 14 captures strictement identiques et 188 raccordements, sans tolérance ni modification de valeurs/styles. Le diagnostic des huit pixels du premier retest et sa résolution par modalité d’entrée explicite restent dans la [preuve finale](../reviews/ds-edit-15-component-tokens.md), avec les limites réelles des revues séquentielles non indépendantes.

Cas réel enregistré : 188 composants, 41 styles et 24 alias conservent leur valeur, dont Button `#b51a00`. Copie migrée disponible sur le port local 54116, couleur et catalogue vérifiés sans sauvegarde ni connexion de compte. Ancienne recette, reçus et compte intacts ; 61 préexistants et huit sources de recette inchangés. Les détails et empreintes sont dans la [qualification structurée](../reviews/ds-edit-15/qualification.json). Aucune publication, action distante, nouvelle campagne SQL ou efficacité native d’assistant revendiquée. **Doc updated.**

Intégration locale de cette tranche qualifiée dans `main`, puis restitution ; prochaine action : recette humaine finale du catalogue et de l’édition/rétablissement, avec acceptation différée conservée. Aucun autre chantier ouvert ; G/J5 et modèles de suivi applicatifs restent inchangés par cette clôture.
