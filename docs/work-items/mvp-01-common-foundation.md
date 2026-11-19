# MVP-01-SOCLE — Construire et qualifier le socle commun de Loomata

**12 novembre 2026 — En revue ; qualification technique acquise, acceptation humaine différée.** Cible canonique : application. Mandat S1–S6 exécuté jusqu’à qualification sur `7ff7f8c` ; [bilan final, douze critères, contrôles et réserves](../reviews/mvp-01-common-foundation/qualification.md). Le socle débloque techniquement T1, sans quatrième tranche ni lancement de T1 implicite. Statuts consolidés dans la roadmap racine du lab ; les modèles de suivi applicatifs restent non initialisés. La préparation et les arrêts ci-dessous sont historiques.

## Résultat attendu et autorités

Fournir un cœur partagé qui conserve les identités, les demandes et les changements, permet leur reprise et coordonne inspecteur, Codex et futurs arbitrages Figma sur une même version. Sa qualification débloque les fonctions de T1 ; elle ne qualifie ni leurs interfaces, ni User Flow, ni Planification.

Sources : [périmètre fonctionnel v2.0](../product/loomata-workspace.md), [décision 033](../decisions/033-loomata-mvp-scope-and-sequence.md), [préparation des trois tranches](mvp-01-three-stage-development.md), [cœur commun](../architecture/shared-core.md), [chat actuel et limites](../product/agent-chat.md), [autorités DS](../../src/design-system/authority/README.md). Les comportements restent définis par ces autorités ; cette fiche organise leur réalisation sans les remplacer.

Procédures applicatives sélectionnées après lecture du catalogue : `plan-feature` et `update-project-docs`, sources présentes et versionnées à `1ead31a9483c6b4207fd2e4ef823c5cdb7933824`, sans nouvelle qualification comportementale revendiquée. Rôle Builder pour la préparation. Aucun skill de fabrication lab applicable : ni instruction d’agent, ni adaptation, ni distribution modifiée. Aucune délégation.

## Version inspectée et acquis réutilisables

Base : `main`, HEAD `1ead31a9483c6b4207fd2e4ef823c5cdb7933824`. Branche documentaire : `codex/mvp-01-common-foundation-plan`. Aucun changement suivi préexistant. Nombreux éléments non suivis préexistants : copies nommées « 2 », `application/.storybook/editor/`, `frontend/` ; exclus, sans nettoyage ni incorporation. Réexaminer cet état avant toute réalisation ; une copie isolée issue des seuls fichiers suivis pourra servir aux contrôles si ces éléments perturbent la découverte des sources.

| Surface inspectée | Acquis constaté en lecture | Extension à qualifier |
| --- | --- | --- |
| `scripts/core/projects.mjs`, `scripts/core/local-service.mjs` | Identité de projet, copie contrôlée par `scripts/project-files.json`, sélection et services locaux ; création sans dépendance Git | Initialisation Git du suivi durable pour les projets Loomata, compatibilité des projets déjà créés et absence de Git signalée sans perte de données ; ne pas confondre projet Loomata et ligne de l’exemple `/projects` |
| `src/design-system/editor/`, `scripts/design-editor/store.mjs` | Projection DS, révisions, transactions et récupération spécialisées | Coordination avec le moteur transversal, sans élargir le writer DS à React ou aux autres fichiers |
| `scripts/agent-chat/{manager,broker,provider,private,http}.mjs` et `scripts/core/agent-chat.mjs` | Sessions privées et App Server dédié ; propositions texte bornées, révision par fichier, accord et interruption | Conversation par identité, contexte actualisé et actions reliées au moteur ; le broker actuel n’exécute ni Git, ni shell, ni migration |
| `scripts/core/exports.mjs`, `tests/exports.test.mjs` | Sélection de sources et exclusions privées existantes | Exclusion effective des nouveaux états privés, reconstruction des traces durables après copie Git |
| `tests/project-lifecycle.test.mjs`, `tests/agent-chat.test.mjs`, `tests/design-editor-store.test.mjs`, `tests/local-service.test.mjs` | Points de contrôle disponibles | Compléter par les cas transversaux ci-dessous ; leur présence ne prouve aucune réussite sur le nouveau socle |

Observation : ces surfaces ne démontrent pas le moteur transversal, le brouillon commun ou le modèle de suivi du MVP. L’inspection reste ciblée ; aucun audit exhaustif ni test exécuté dans cette préparation.

## Périmètre et exclusions

Inclus : contrats d’identité et d’inventaire ; demande/tâche/modification/commit/chantier et décisions ; révisions et invalidation des preuves ; suivi durable dans Git ; états opérationnels et conversations privées ; brouillon unique ; coordination des écritures et annulation ; isolation et intégration ; projections et aperçu d’un état identifié ; raccordement Codex officiel et contrôles de passage. Les contrats nécessaires aux trois tranches seront éprouvés dans ce socle avec des jeux synthétiques.

Exclus : écrans complets Pages/DS, variantes et exploration réelle de T1 ; import Figma réel et réimport ; graphe User Flow de T2 ; interface et orchestration avancée de Planification de T3 ; Administration, Claude, adoption de projets hétérogènes, publication et déploiement. Les futurs appels Figma sont représentés comme entrée de coordination, sans ouvrir un accès Figma. Pas de nouvelle stack, backend distinct ou bibliothèque implicite. Les deux contenants réutilisent le même cœur ; ni signature ni qualification finale de distribution ajoutée ici.

## Découpage d’exécution proposé

Chaque étape produit ses contrats documentés, code, contrôles et point de reprise dans un futur mandat de réalisation. Les étapes sont dépendantes dans cet ordre ; ne pas commencer les fonctions T1 avant la sortie du socle.

| Étape | Travail borné | Critère de passage |
| --- | --- | --- |
| S1 — Contrats et identités | Définir schémas versionnés, identités stables, liens multiples, inventaire, révisions et erreurs ; mapper les identifiants DS existants ; distinguer définition, variante et occurrence | Jeux de pages, occurrences, tokens, parcours et tâches futures cohérents ; renommage sans rupture ; relations invalides refusées |
| S2 — Conservation et reconstruction | Séparer sources/décisions/traces Git, brouillon local durable, index reconstructibles et historique privé ; définir compatibilité et migrations des états existants avant écriture | Reconstitution depuis un dépôt sans base ni index ; reprise du brouillon après arrêt ; aucune conversation complète dans Git/export |
| S3 — Moteur commun | Préconditions, révision/portée/impacts, identifiant d’opération, transaction et déduplication ; adaptateurs inspecteur/DS/Codex ; états appliqué/en vérification/validé | Même contrat pour les origines ; requête périmée ou rejouée refusée ou rendue sans nouvel effet ; annulation sans écraser une évolution concurrente |
| S4 — Brouillon, isolation et intégration | Un brouillon par projet ; chantier sur branche/worktree isolé ; aperçu sur état unique ; commit distinct de l’intégration ; arbitrage des conflits techniques et fonctionnels reconnus | Arrêt/crash, annulation après réouverture, concurrence et conflit sans perte démontrés ; commit seul n’intègre rien ; règles d’intégration éprouvées |
| S5 — Conversations et Codex | Conversation unique par élément et conversations générales ; identité/portée/révision transmises ; progression, permissions, interruption/reprise ; raccordement borné au moteur | Renommage et réouverture retrouvent l’historique ; contexte périmé refusé ; interruption sans double action ; essai fournisseur réel dédié réussi |
| S6 — Projections et qualification | Révision partagée pour DS, pages, parcours et suivi ; invalidation et couverture ; scénario transversal, régressions, revues et dossier de reprise | Tous les critères obligatoires ci-dessous prouvés sur version identifiée ; aucun état incertain annoncé vérifié |

### Choix délégués et décisions à consigner à l’exécution

Retenir des schémas validés aux frontières, des fonctions de règles séparées des adaptateurs Node et une persistance atomique avec récupération, compatibles avec la stack actuelle. Il s’agit d’une direction minimale, pas d’un schéma ou d’un protocole déjà approuvé. Ne pas créer de seconde autorité pour les tokens ni un modèle temporaire de planification.

Avant S2, documenter formats et chemins des traces Git, journal privé du brouillon, reconstruction des projections et compatibilité des états antérieurs. Toute projection en base utilise la stack PostgreSQL/Drizzle existante ; ne pas ajouter SQLite ou un service séparé. Tester les migrations sur état vide et précédent, sans migrer les données personnelles pour qualifier le mécanisme.

Avant S4, documenter les opérations Git permises, leurs arguments bornés, les verrous et la récupération ; préserver branches, modifications non commitées et worktrees existants. Avant S5, documenter les capacités strictement nécessaires au moteur. L’extension compatible de la coordination est prévue ; retirer une protection actuelle ou ajouter un accès, service ou coût non prévu nécessite un arbitrage préalable. La préparation ne vaut pas ce consentement.

Hypothèse réversible : démontrer les contrats par une interface de qualification minimale et des adaptateurs de contrôle, sans anticiper les écrans métier. Impact : la qualité UX finale reste à prouver en T1–T3. Retest attendu : mêmes contrats depuis les véritables inspecteurs et micro-chats. Le format exact de cette interface est délégué ; son affichage doit identifier projet, état, révision et résultat des contrôles.

## Critères de qualification et preuves attendues

Les critères suivants étaient tous non exécutés à la préparation. À la reprise courante, SOC-01 et SOC-02 ont des preuves partielles de contrat uniquement ; aucun critère transversal complet n’est qualifié, voir le rapport de reprise. Conserver avant/après, version, commande/procédure, résultat et limites dans `docs/reviews/mvp-01-common-foundation/` à créer avec les premières preuves réelles. Ne pas déposer de conversation privée ou d’accès dans ces preuves.

| Référence | Scénario obligatoire et résultat observable |
| --- | --- |
| SOC-01 | Inventaire avec deux pages, deux occurrences d’une définition, variante, token, parcours avec condition/retour et tâches futures ; renommage conserve identités, liens et conversation ; références incohérentes refusées |
| SOC-02 | Une demande produit plusieurs tâches, une tâche contribue à plusieurs modifications et un chantier à plusieurs commits ; demandes multiples regroupées sans doublon ; traitement des demandes ne lance pas un chantier ; lancement explicite exigé ; instantanés rattachés au commit sans perdre les liens antérieurs |
| SOC-03 | Sur clone local neuf du dépôt témoin, supprimer uniquement ses projections de test puis reconstruire inventaire, décisions et suivi depuis Git ; relations et versions conservées ; conversations et brouillon non commité explicitement absents de cette reconstruction |
| SOC-04 | Inspecteur et Codex soumettent une modification sur même révision ; conflit sur cible commune et refus de précondition périmée ; aucune application partielle silencieuse ; annulation refuse d’écraser une modification intervenue depuis |
| SOC-05 | Brouillon unique durable ; fermeture, arrêt du service puis crash injecté pendant transaction, réouverture et annulation ; récupération vers état cohérent connu, corruption signalée ; aucune perte des sources ni de version concurrente |
| SOC-06 | Chantier isolé et brouillon évoluent en parallèle ; conflit Git puis conflit fonctionnel reconnu sur token/parcours, y compris fusion textuelle possible ; conserver les versions et bloquer l’ambiguïté ; aperçu d’un seul état identifié ; commit et intégration séparément observables |
| SOC-07 | Conversation générale et conversation par élément ; ouverture depuis deux accès retrouve la même conversation contextualisée ; renommage, réouverture et reprise ; interruption avant accord et pendant exécution, reprise sans double application ; révision/contextes mis à jour |
| SOC-08 | Transport simulé pour les erreurs déterministes puis vrai Codex officiel connecté dans l’état privé dédié de Loomata, sur projet jetable synthétique : demande, action via moteur, interruption et reprise ; preuve expurgée, aucun identifiant copié depuis la fabrication |
| SOC-09 | Modification reconnue depuis chat général actualise les projections à même révision ; modification non interprétable signale couverture partielle ; changement ultérieur invalide le « vérifié » affecté ; états appliqué/en vérification/validé distincts |
| SOC-10 | Intégration automatique non critique sans effet visible après contrôles ; visible soumis à humain ; visible automatisable avec délégation E2E explicite et succès sur la version exacte ; échec ou preuve devenue périmée bloque ; cas critique reste humain malgré succès E2E ; changement visible sans délégation E2E attend la décision humaine |
| SOC-11 | Mauvaise origine/capacité, chemin extérieur, lien, fichier privé, action inconnue et rejeu refusés ; absence de shell arbitraire ; contextes transmis bornés ; conversations, authentification et capacités absentes de Git, sources copiées, exports et journaux de preuve |
| SOC-12 | Même cœur accessible depuis dossier autonome et raccordement macOS existant ; anciens projets créés avec Loomata préservés ; DS, sélection de projet et chat borné sans régression ; clavier/focus/défilement et erreurs compréhensibles de l’interface minimale vérifiés sur desktop |

La simulation ne qualifie pas SOC-08. Une connexion manquante bloque sa preuve et donc la qualification finale du socle ; elle n’empêche pas les travaux indépendants sur les contrats. L’accès Figma ne bloque pas le socle ; il sera nécessaire pour les critères Figma de T1.

### Plan des contrôles locaux, à exécuter ultérieurement

Depuis `application/`, dans une copie de qualification isolée et avec runtime documenté : installation reproductible `npm ci`, puis `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm test`, `npm run test:boundaries`, `npm run test:integration`, `npm run build` et `npm run build-storybook`. Ajouter les tests ciblés du nouveau moteur et les parcours SOC-01 à SOC-12 ; créer leurs commandes explicites à l’exécution. Les commandes existantes ne couvrent pas seules ces nouveaux critères.

Régressions directement concernées : `npm run test:project-lifecycle`, `npm run test:core-host`, `npm run test:agent-chat`, `npm run test:design-editor:server`, `npm run test:design-system`, `npm run test:exports`. Pour les parcours, sélectionner les scénarios desktop utiles des scripts existants de chat, UI Lab, projets et contenant natif, puis compléter les scénarios manquants. Ne pas transformer les anciennes campagnes mobiles en exigence Loomata. Formats proposés pour l’interface minimale : 1280 × 800 et 1440 × 900, clavier et défilement compris ; hypothèse de qualification à ajuster selon sa composition.

Si des sources DS ou recettes changent, régénérer leurs dérivés et contrôler `npm run docs:design-system:check` ; si la sélection des sources livrées évolue, actualiser `scripts/project-files.json` et qualifier copie/exclusions. Ce manifeste n’est pas modifié par la préparation : cette fiche de fabrication n’a pas à être copiée dans chaque projet dérivé par défaut.

Ressources synthétiques seulement, sous les emplacements ignorés du dépôt ; pas d’écriture dans un vrai projet ni de redémarrage de l’instance personnelle. Docker et Chromium à vérifier avant les contrôles qui les exigent. Un échec ou prérequis absent reste visible et bloque les critères dépendants, sans suppression de protection pour réussir.

## Revues, sortie et reprise

Prévoir les trois revues sur la version candidate : design pour sélection d’état, statuts, erreurs et reprise ; technique/QA pour contrats, reconstruction, concurrence et preuves ; sécurité pour accès fournisseur, chemins, permissions, Git et confidentialité. Mode prévu : **séquentiel, même agent, non indépendant**, sans sous-agent autorisé. Les reviewers constatent ; les corrections relèvent ensuite du Builder, avec retest des critères affectés.

Sortie : SOC-01 à SOC-12 démontrés, contrôles applicables réussis, conclusions des trois revues sans anomalie bloquante, contrats et opérations documentés, version identifiée et reprise autonome possible. La réalisation passe alors En revue avec « qualification technique acquise, acceptation humaine différée ». L’intégration locale du socle ne constitue ni recette J5 ni autorisation de publication. T1 nécessite son propre mandat si elle n’est pas incluse dans le mandat de réalisation suivant.

### Configuration recommandée

Pour la réalisation initiale : **GPT-6.1 Sol · Élevée**. Résultat fonctionnel cadré par la décision 033 ; chemins existants inspectés ; frontières de persistance/permissions/isolation effectivement à étendre ; plusieurs contrats dépendants et scénarios négatifs à prouver ensemble ; connexion réelle et formats détaillés restant à qualifier. Aucune difficulté observée ne justifie Très élevée/max ou Astra à ce stade. Choix manuel de l’utilisateur, réglage courant non vérifié. Réévaluer seulement si le périmètre ou une difficulté concrète change.

### Bilan de cette préparation

Livrables : présente fiche, renvoi depuis la préparation MVP-01, roadmap et état de fabrication racine. Doc updated. Vérifications documentaires réussies : 486 liens locaux dans les quatre documents concernés sans cible absente (existence des fichiers, sans validation exhaustive des ancres) ; 14 commandes `npm run` distinctes présentes dans `package.json` ; `git diff --check` conforme. Relecture documentaire par le Builder, séquentielle, même agent, non indépendante : périmètre conforme à la décision 033, séparation préparation/réalisation et critères de passage explicites ; conclusion satisfaisante pour la préparation seule. Diff relu, sélection limitée aux quatre documents ; aucun secret, donnée personnelle ou configuration locale ajouté. Tests, builds, services, fournisseur et migrations : **non exécutés**, conformément au mandat de préparation. Revues d’implémentation non applicables à ce seul document ; prévues ci-dessus. Aucun changement de rôle, skill ou distribution.

Risque résiduel : mécanismes transversaux et compatibilité des données à démontrer, connexion dédiée non vérifiée ; aucune qualification fonctionnelle revendiquée. Publication désactivée. Prochaine action : mandat distinct de réalisation de MVP-01-SOCLE, démarrant par S1 puis les étapes autorisées dont les prérequis sont satisfaits. Ne pas lancer T1 sur la seule foi de cette fiche.

## Exécution — point de reprise du 12 novembre

Contrats purs et 21 tests ciblés réalisés, contrôle TypeScript ciblé/lint/formatage réussis ; [contrat de travail](../architecture/workspace-contract.md) et [preuves/revues](../reviews/mvp-01-common-foundation/README.md). S1 reste partielle : pas de collecte réelle ni conversation persistante raccordée. S2–S6 non réalisées. Procédures implement-feature et test-user-flow sélectionnées à `2e8bc0b` ; aucun parcours UI à tester à ce stade. Arrêt de la partie persistance sur difficulté observée justifiant GPT-6.1 Sol · Très élevée : coordination des récupérations writer DS, broker et Git. Attente de sélection manuelle et reprise explicite selon AGENTS du lab ; la recommandation Élevée initiale est remplacée pour cette partie seulement. Doc updated. Aucun changement préexistant absorbé, aucune publication.

## Arrêt explicite du porteur après reprise

Le 12 novembre, reprise puis arrêt demandé (« stop. je reprendrai plus tard »). Journal/worktrees/port local en cours dans le diff non commité ; huit tests du store réussis et TypeScript ciblé conforme, qualification globale absente. Writer DS, conversations et contrôles finaux restent à compléter. [État précis des fichiers, contrôles et reprise](../reviews/mvp-01-common-foundation/README.md#reprise-puis-arrêt-demandé-par-le-porteur--12-novembre-2026). Aucune poursuite avant nouvelle demande explicite. La connexion Codex dédiée manque pour SOC-08, essai reporté par le porteur.

## Reprise jusqu’à qualification — mandat courant

Demande explicite du porteur : « Reprends MVP-01-SOCLE jusqu’à sa qualification. » Base `69a3fc6`, branche `codex/mvp-01-common-foundation`, changements non commités des reprises précédentes conservés et attribués à ce même chantier. Les autres fichiers non suivis préexistants restent exclus. Procédures applicatives implement-feature, test-user-flow, update-project-docs, puis technical-review, security-review et review-design utilisées séquentiellement, même agent, non indépendantes. Niveau recommandé conservé : GPT-6.1 Sol · Très élevée ; aucun réglage ni sous-agent activé.

S1–S6 réalisées et SOC-01 à SOC-12 satisfaits sur `7ff7f8c`, avec campagnes et retests versionnés dans le [rapport final](../reviews/mvp-01-common-foundation/qualification.md). Choix techniques délégués : worktrees isolés ; journal privé avant publication ; ordre coordination puis writer DS ; traces Git sans auto-référence de SHA ; compte fournisseur dédié, historique de test isolé ; version principale consultative ; frontière Vite stricte sous la racine sélectionnée. [Contrat autonome](../architecture/workspace-contract.md). Revues design/technique/sécurité satisfaisantes, séquentielles et non indépendantes. Réserve : un délai d’arrêt natif non reproduit au retest complet, à surveiller ; limites DS et interfaces T1–T3 explicites. Aucun choix produit matériel nouveau.

Doc updated. Changements : contrats, coordination/persistance, adaptateurs, aperçu natif, interface minimale de qualification, tests/manifeste et documentation directement liés ; valeurs DS et données personnelles préservées. Commits locaux et intégration dans main autorisés par le mandat, aucune publication. Dossier de recette humaine relié au suivi unique P5-05/P5-08. Reprise : acceptation humaine différée ; MVP-01-T1 peut recevoir son mandat propre, avec qualification du fichier pilote Figma. Fin du présent mandat, sans tranche supplémentaire.
