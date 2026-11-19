# DS-EDIT-14 — Apparence directe et gestion des styles assistée

30 octobre 2026 — cible **application**. **En revue — qualification technique acquise, acceptation humaine différée.** Statut consolidé dans le suivi de fabrication ; les modèles ROADMAP et project-state livrés restent non initialisés.

## Résultat actuel et reprise

Politique, raccordement Codex macOS, Apparence directe et questions intégrées réalisés. [Dossier de vérification et revues](../reviews/ds-edit-14-assistance.md) : 121 unitaires, 47 contractuels, 74 serveur, 10 transport/HTTP synthétiques et 5 documentaires ; 42 parcours de développement desktop/mobile, couverture statique et quatre scénarios persistants ciblés avec relecture compilée. Vrai Codex authentifié, sauvegarde et rechargement vérifiés dans une copie isolée. Extraction renommée : compte natif absent sans copie d’identifiants. Chaque personne se connecte avec son propre compte ; pas de serveur multi-utilisateur livré.

Version : base `561fb9d`, candidat fonctionnel SHA256 `a6a4985f986339a87e188662ca3cf2f71c51d07276d00593f9300faeeb99c2bd` (24 fichiers code/tests/catalogue listés dans le manifeste du dossier de preuves). Types, lint, formatage, documentation générée, validateur de kit et builds conformes. Revues design/technique/sécurité/instructions séquentielles, même agent non indépendant. Fichiers : politique, session/interface, serveur d’assistance et confinement, gardes de fichiers privés, tests, décision/guide, six renvois de skills et catalogue ; aucune nouvelle dépendance, autorité YAML ou valeur modifiée dans le kit.

Hypothèses conservatrices : chaque propagation partagée demande une réponse explicite ; sans IA, réutilisation sémantique déterministe puis création guidée ou réglage particulier. Aucune sauvegarde automatique. Risques : compatibilité macOS/version CLI seulement, portée limitée aux usages connus, quota et disponibilité du compte ; seconde personne et acceptation visuelle non vérifiées. **Doc updated.** Aucune publication. Reprise : recette humaine du parcours et connexion d’une autre personne selon le guide, sans nouveau chantier implicite ; G/J5 et modèles livrés inchangés.

## Journal de réalisation

Base de réalisation `561fb9d`, branche `codex/assisted-appearance`, aucun diff suivi et les 50 entrées non suivies conservées. La préparation ci-dessous est historique ; le nouveau mandat autorise politique, contrats, implémentation et contrôles dans son périmètre. Procédures implement-feature et design-interactions consultées à cette base, séquentiellement ; aucune délégation. Leurs mentions historiques d’absence d’appel IA à l’usage s’appliquent au parcours livré précédent ; le mandat présent ouvre explicitement une assistance optionnelle, sans rendre le socle dépendant de l’IA.

Diagnostic initial en lecture seule : CLI Codex `0.165.0-alpha.1.2` présent, `exec --help` expose sandbox read-only, exécution éphémère et sortie structurée. Aucun accès modèle ni authentification vérifié. Choix du canal demandé au porteur (Codex local existant ou API séparée) avant activation/inférence ; politique et contrat indépendants poursuivis pendant l’attente. Aucun changement de configuration globale. Documentation officielle consultée : https://learn.chatgpt.com/docs/non-interactive-mode ; ce constat ne prouve pas l’intégration dans DS-EDIT.

Le porteur a choisi **Codex local avec son accès existant**, puis demandé de résoudre le raccordement sans supprimer les protections et de permettre à chacun d’utiliser son propre compte. Diagnostic : exec et app-server sur l’état habituel échouent avant inférence sous restriction d’écriture. Un état Codex neuf propre au projet permet `initialize` et `account/read`, avec la même interdiction d’écrire hors du répertoire privé. Choix : app-server stdio et authentification officielle dans `.runtime.local/design-agent/codex/`, sans copier les identifiants habituels. Une nouvelle connexion à son propre compte est nécessaire ; une page ouverte ne vaut pas authentification. Le premier lien de diagnostic a expiré sans connexion confirmée ; aucun accès modèle réel n’est revendiqué.

Implémentation candidate : politique et plans bornés, validation serveur, routes protégées d’analyse/réponse/connexion, état Codex privé, valeurs directes dans Apparence et question sous le réglage, brouillon corrélé et annulation. Mode local déterministe sans compte IA ; trente analyses maximum par session, une à la fois, délai 45 secondes. Référence autonome : [guide d’assistance](../design-system/editor-assistance.md), [décision 017](../decisions/017-assisted-style-decisions.md). Les sources/runtime de la recette humaine précédente n’ont pas été modifiés.

Preuves intermédiaires historiques dans la copie privée `.local/ds-edit-14/check`, Node embarqué `24.22.1`, npm `11.8.0`, dépendances existantes : 119 unitaires, 10 tests de transport/contrat/HTTP synthétiques, types/lint/formatage conformes ; 47 contractuels conformes. La première campagne globale unitaire a signalé trois attentes d’ancien menu, adaptées au parcours demandé, et un refus d’ouverture de port sous sandbox ; campagne rejouée avec seuls ports locaux autorisés. Lint a détecté le nom trompeur `useLocalRule`, renommé `applyLocalRule`, puis conforme. Tests serveur/builds/parcours en cours, résultats définitifs à consigner.

Protection réelle : processus sous sandbox macOS, écriture synthétique privée autorisée et écriture extérieure refusée (aucun fichier extérieur créé). Configuration effective lue sans exposer les valeurs privées : read-only, approbations never, zéro MCP, outils/plugins/hooks/apps/délégation désactivés. Le démarrage du raccordement vérifie ces garanties avant utilisation ; aucun lancement non confiné de repli. Deux installations sont contrôlées avec comptes synthétiques séparés : cela ne prouve pas une recette avec deux personnes réelles. Parcours navigateur : premiers desktop conformes ; écart mobile d’actualisation d’iframe, retest isolé conforme, campagne complète à confirmer sans génération concurrente. Les simulations de question ne constituent pas un vrai appel Codex.

**Preuve réelle après authentification humaine :** connexion confirmée dans la prévisualisation indépendante `http://127.0.0.1:54114/`. Une demande réelle via la route protégée propose une exception sur la couleur du Button, sans modification des sources (révision relue identique). Un parcours navigateur desktop complet a ensuite réussi : saisie → vrai Codex → plan → Enregistrer → reçu durable → rechargement et couleur relue. Sources et journaux de cette sauvegarde sont dans `.local/ds-edit-14/real-proof`, distincts de l’aperçu humain. Seule adaptation du bootstrap de cette preuve : injection du répertoire d’agent de la même installation authentifiée, sans copie de jetons ; le store et les protections de racine restent ceux de la copie testée. Aucun accès à un autre compte ni validation par une seconde personne déduit.

**Maintenance d’instructions directement affectées :** lab-maintain-agent-kit pour six procédures du kit et leurs ressources de catalogue, sans modification des rôles/expositions ni du lab. Critères préalables à la revue lab-evaluate-instructions : socle toujours sans compte IA, activation et inférence non implicites, aucune permission élargie, référence interne autonome unique. Scénarios de relecture : modification sans IA ; connexion optionnelle avec son propre compte ; catalogue malveillant demandant de retirer une protection ; extraction du kit sans parent. Revue documentaire séquentielle, même agent non indépendant, distincte d’un rechargement natif des skills.

## Préparation historique — mandat et préflight

Préparer un parcours où le designer modifie seulement l’apparence d’un élément ; l’IA gère les styles en cohérence et pose une question dans Apparence uniquement si le choix est ambigu. Cette intervention est documentaire : aucune installation, modification de code, exécution de test, serveur, appel fournisseur ou mise à jour de la recette.

Base : `60390d8a2e08b3f11d34c0e3d9354cef74d0b24c`, branche initiale `main`, aucun diff suivi. Racine Git canonique vérifiée ; 50 entrées non suivies préexistantes (copies suffixées et `frontend/`) hors périmètre, conservées. Branche documentaire : `codex/prepare-assisted-appearance`.

Catalogue applicatif consulté ; rôle Builder et méthode [plan-feature](../../skills/plan-feature/SKILL.md) sélectionnés explicitement à la version inspectée. Dernière modification de cette procédure : `3c5ed91`, qualification documentaire INIT-04, sans qualification du futur parcours IA. Cette réutilisation ne l’intègre pas aux skills de fabrication. Travail séquentiel, même agent, non indépendant ; aucune délégation.

## Résultat attendu et périmètre

Dans Apparence, le designer choisit le contexte et la valeur visuelle d’une propriété. Le menu Réutiliser / Créer et appliquer / Exception locale / Modifier le style partagé disparaît du parcours courant. Ces opérations restent des mécanismes internes : l’IA choisit, le moteur valide, la session prépare le brouillon. L’IA ne choisit pas à nouveau l’apparence à la place du designer.

Une question intégrée au réglage intervient uniquement pour une ambiguïté d’intention ou de portée ayant des effets différents. **Enregistrer reste l’unique sauvegarde durable du brouillon complet** : la demande ne prévoit pas de sauvegarde automatique. Analyse et question précèdent l’enregistrement, contrairement à un traitement déclenché seulement après sauvegarde.

Périmètre initial proposé : propriétés déjà raccordées des cinq composants et leurs variantes, parties et états réellement préparés. Tokens/Styles et les fondations conservent leurs parcours existants, sans refonte supplémentaire. Exclusions : CSS libre, nouvelles variantes, thèmes, fusion/suppression globale de styles, modification métier, backend distinct, framework d’orchestration, publication et commit automatique depuis Storybook. Aucune connexion implicite au chat ouvert de l’assistant.

## Constats et autorités

Sources : [spécification DS-EDIT](../product/features/design-system-editor.md), [autorités YAML](../../src/design-system/authority/README.md), [persistance](../design-system/editor-persistence.md), [architecture](../architecture.md), [sécurité](../security.md), [décision 013](../decisions/013-appearance-and-styles-panels.md), [décision 014](../decisions/014-token-catalog-style-entry.md) et [DS-EDIT-13](ds-edit-13-catalog-create.md).

| Observation dans les sources | Conséquence |
| --- | --- |
| `draft.ts` expose guidage sémantique, compatibilités et `getImpact`, avec réserves d’inventaire. | Utiliser ces données ; ne pas déduire la fonction du seul nom ou du DOM ni promettre tous les usages réels. |
| `operations.ts` valide `assign`, `create-style`, `create-and-assign`, `set-exception`, `update-shared`, `restore`. | Réutiliser ce moteur déterministe pour vérifier le plan ; pas d’écriture de code libre par l’agent. |
| `session.ts` détient brouillon commun, projection, contexte, création et sauvegarde. | Ajouter analyse/questions dans la même session ; traiter la limite actuelle d’une seule création préparée à la fois. |
| `server/http.mjs` expose seulement `snapshot`, `status`, `save`, protégés par Host/Origin/capacité ; le store contrôle révision et reçus. | Aucun canal agent prêt à l’emploi n’est établi. Conserver les protections. |
| 013 décrit quatre actions ; 014 déplace l’édition partagée vers Tokens. | Une décision successeur devra cadrer le nouveau parcours et sa portée avant implémentation. Les autorités actuelles ne sont pas remplacées par cette fiche. |
| CAD-05/REC-02, AGENTS et le périmètre du kit exigent un socle utilisable sans compte IA. | Préparer une assistance optionnelle de développement. Une dépendance obligatoire à l’IA nécessiterait un arbitrage préalable. |

La demande autorise cette préparation d’évolution, pas la réécriture des autorités comme si la capacité était livrée. Les adaptations d’assistants ne prouvent pas un canal invocable depuis Storybook.

## Politique proposée pour les décisions

À formaliser en tranche A dans une source versionnée unique, puis à contrôler par des règles exécutables. Ces propositions ne sont pas une acceptation visuelle.

1. Identifier composant, variante, partie, propriété et état. « Ici » désigne ce réglage du composant et ses consommateurs, pas une instance DOM. Montrer aussi les effets hérités dans les autres états ; une exception n’isole pas nécessairement un seul rendu.
2. Normaliser et valider la valeur. Une saisie invalide produit une erreur de champ, pas une question IA. Revenir à la valeur effective sans autre intention ne crée pas d’opération. Montrer immédiatement un aperçu local provisoire ; analyser une valeur valide stabilisée, pas chaque mouvement de curseur.
3. Réutiliser un style si valeur canonique, type, rôle et intention concordent avec le contexte. Même couleur ne signifie pas même sens. Départager les candidats équivalents par une priorité documentée ; des sens distincts ne se départagent pas par le premier résultat ou une confiance chiffrée du modèle.
4. Créer et attribuer un style lorsque l’intention réutilisable est établie dans le catalogue et qu’aucun style approprié n’existe. Pas d’intention inventée hors catalogue, collision d’identité ou style créé pour chaque valeur intermédiaire. Primitives dédupliquées par le moteur ; provenance proposée conservée.
5. Préparer une exception lorsque le contexte établit un besoin particulier sans règle commune nouvelle. Aucune question technique systématique. Ne pas généraliser dans le seul but de réduire le nombre d’exceptions.
6. Modifier un style partagé automatiquement seulement si sa portée commune est établie par une règle ou une réponse utilisateur encore valide, et les usages concernés compatibles. Conserver les exceptions. Un nombre faible d’usages ou la seule préférence du modèle ne constitue pas cette preuve.
7. Si plusieurs intentions plausibles changent matériellement sens, portée ou états, demander la précision minimale dans Apparence. Sans réponse, conserver l’aperçu particulier comme provisoire, sans propagation ni plan enregistrable indéterminé.

Calculer alias, héritages, usages masqués et réserves de couverture. Ne pas promettre la cohérence d’usages inconnus. Contrastes mesurés/non mesurés et avertissements actuels restent visibles : aucune correction silencieuse de la valeur choisie. Une panne ou indisponibilité agent est un diagnostic technique, pas une ambiguïté produit.

## Parcours et question dans Apparence

Saisie → aperçu provisoire → analyse → plan validé en brouillon, ou question → réponse → plan validé. Un retour court explique le résultat et la portée ; pas de confirmation supplémentaire systématique, ni menu des quatre mécanismes réintroduit sous une autre forme.

La question apparaît **sous le réglage concerné**, sans modal ni passage dans le chat. Exemple : « Ce changement concerne-t-il ce réglage du bouton ou les autres réglages liés au même style ? » Choix : « Ce réglage » / « Tous les réglages liés », avec usages connus, exceptions et réserves. Un nombre de bindings n’est pas présenté comme un nombre de boutons DOM ou de composants.

Si le doute porte sur le sens, poser une question de conception, par exemple « Cette couleur indique-t-elle une action destructive ? », avec les alternatives utiles. Ne jamais demander au designer de choisir une primitive, un identifiant ou un discriminant d’opération. Une seule question active pour le geste courant.

Chaque réponse reste liée à la cible, la valeur et l’empreinte du brouillon ; aucun consentement général mémorisé implicitement. Nouvelle saisie ou nouvelle révision invalide les réponses devenues inapplicables. Changer de panneau/story conserve la question en session, la réaffiche au retour et ne l’attribue pas au nouveau composant. Vérifier annonces accessibles, clavier, focus et affichage mobile.

Annuler un geste retire son aperçu, son plan et sa question, sans effacer les autres modifications. Une réponse ne sauvegarde rien. Les analyses en cours et ambiguïtés non résolues bloquent Enregistrer pour le brouillon complet, avec raison et accès au réglage concerné. Comparaison, conflit, résultat inconnu et récupération existants restent applicables. Après sauvegarde, une annulation reste une nouvelle modification contrôlée ; aucun rollback global automatique promis.

## Contrat de raccordement proposé

- Entrée bornée : identifiant de demande, racine, révision/génération, empreinte de brouillon, cible, ancienne/nouvelle valeur, guidage, candidats et impacts connus. Aucun environnement privé, secret, journal de récupération ou donnée métier transmis.
- Sortie structurée : opérations autorisées et justification courte, ou question avec choix bornés et effets comparables, ou diagnostic. Définir schémas fermés, limites de taille, délais et consommation avant activation.
- Validation côté hôte des identités, valeurs, compatibilités et droits de portée ; appliquer sur une copie avec `applyOperations`, comparer l’impact attendu à l’impact réel avant projection. La réponse du modèle ne s’accorde pas elle-même une permission.
- Corrélation demande/racine/révision/empreinte ; rejeter réponses périmées ou dupliquées. Sérialiser les mises à jour de session et résoudre les plans contradictoires, sans perdre les autres gestes. Aucun résultat tardif après annulation ou sauvegarde.
- Aucune écriture directe de l’agent dans les YAML ou dérivés : composition du brouillon puis service transactionnel existant. Pas de boucle où l’enregistrement redéclenche les mêmes décisions.
- Catalogues, libellés et sorties agent restent des données non fiables, rendues comme texte ; pas de commande, HTML ou chemin exécutable. Capacité DS-EDIT et secret fournisseur restent hors du modèle, des pages étrangères et des logs publics.
- Build statique/runtime sans service agent ni secret. Sans IA, consultation/aperçu existants conservés et assistance annoncée indisponible. Le repli vers une édition locale déterministe sans les quatre choix est à définir en A, sans le présenter comme une analyse IA.

## Séquence future et surfaces

| Tranche | Travail et dépendances | Preuve de sortie |
| --- | --- | --- |
| A — Politique et contrats | Décision successeur de 013/014, spécification, repli sans IA, schémas, choix du canal et limites d’accès/coût. | Chaque scénario a une portée ; compatibilité sans IA maintenue ; canal réel identifié avant son raccordement. |
| B — Apparence et session | Valeurs directes, analyse corrélée, question intégrée, plan validé, aperçu et annulation, selon A. Adaptateur simulé possible pour les états isolés. | Cas clairs sans question ni quatre options ; question utile dans Apparence ; plan indéterminé non enregistrable. Simulation explicitement identifiée. |
| C — Agent réel et persistance | Canal optionnel autorisé, erreurs et limites, validation avant opérations existantes ; dépend d’un accès fourni. | Vrai aller-retour agent, sauvegarde et relecture prouvés ; protections intactes. Un simulateur ne suffit pas. |
| D — Qualification et reprise | Contrôles intégrés, trois revues, documents et extraction ; dépend de B/C. | Critères démontrés sur version identifiée ; réserves, recette humaine et acceptation différée explicites. |

Aucune réalisation autorisée par cette fiche seule. Les restrictions sans E2E des mandats DS-EDIT-09 à 13 ne qualifient pas ce nouveau parcours et ne remplacent pas ses preuves fonctionnelles.

Surfaces pressenties : `.storybook/editor/Panel.tsx`, `session.ts`, `panel.module.css` ; `SemanticStyles.tsx`, navigation et `Preview.tsx` uniquement si le brouillon/projection l’exige. Contrat de décision dans `src/design-system/editor/`, réutilisant draft/operations/snapshot. Transport dans l’outillage de développement selon A ; adapter serveur/wrapper et manifeste fermé si nécessaire, sans élargissement silencieux de CORS, écoute ou capacité. Aucun dérivé édité manuellement ni seconde autorité de valeurs.

Documents à synchroniser lors de la réalisation : spécification DS-EDIT, décision successeur, guides aperçu/persistance, architecture/sécurité, README et aides Storybook. Skills livrés seulement si directement affectés, avec revue d’instructions ciblée ; aucune activation automatique de bibliothèque. Modèles de suivi applicatifs non initialisés. Préserver sources, brouillon humain, reçus et anciennes racines de recette selon le changement de version documenté.

## Critères et vérifications futures

| Cas | Résultat exigé |
| --- | --- |
| Même valeur et même sens disponibles | Réutilisation sans question ni doublon. |
| Même valeur, sens différents | Aucune fusion par égalité seule ; clarification seulement si nécessaire au geste. |
| Besoin particulier / intention commune établie | Exception ou création appropriée sans question technique ; pas de style créé à chaque saisie intermédiaire. |
| Portée partagée établie / ambiguë | Plan cohérent automatique ou question avant propagation ; exceptions conservées. |
| Alias, héritages, inventaire incomplet | Effets indirects calculés et réserves visibles, sans portée exhaustive inventée. |
| Saisies rapides, navigation, annulation, réponses désordonnées | Aucun résultat périmé, aucune perte des autres gestes ; question au bon réglage. |
| Agent absent, lent, refusé ou sortie invalide | Saisie conservée, diagnostic et reprise explicites ; aucun faux succès ni écriture silencieuse. |
| Conflit, réponse perdue, interruption | Reçus, idempotence et reprise préservés ; sources et six dérivés cohérents après relecture dans Storybook et l’app. |
| Données/sorties malveillantes | Pas d’exécution, fuite de capacité ou opération hors périmètre. |
| Parcours réel | Saisie → agent réel → question éventuelle/réponse → aperçu → Enregistrer → relecture, clavier et desktop/mobile ; aucun menu des quatre choix. |
| Sans IA, statique et extraction | Démarrage/tests/builds sans compte IA ; absence d’écriture statique/runtime ; autonomie après extraction. |

Commandes candidates depuis une copie privée du kit : `npm test`, `npm run test:design-system`, `npm run test:design-editor:server`, `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run docs:design-system:check`, `npm run build`, `npm run build-storybook`. Parcours : `npm run test:design-editor:dev`, `npm run test:design-editor`, `npm run test:design-editor:persistence`, `npm run test:design-editor:live` ; `npm run test:design-editor:recovery` si transaction affectée. Ajouter cas unitaires politique/session/rendu, refus de contrats et parcours agent sous `tests/design-editor/`/`tests/editor-persistence/`. Les commandes existantes seules ne prouvent pas le dialogue IA. Pas de campagne DB métier si sa frontière reste intacte. Ressources isolées, jamais la recette humaine.

Revues futures : design (simplicité, question, compréhension de portée et clavier), technique (contrats, concurrence, idempotence/reprise), sécurité (nouveau canal, secrets, réponses non fiables, droits). Séquentielles et non indépendantes sauf autorisation ultérieure de délégation. Pour la préparation seule : contrôle documentaire du Builder ; pas de revue complète runtime, instructions ou distribution, ces surfaces n’étant pas modifiées.

## Arbitrages, hypothèses et reprise

**Prérequis avant raccordement réel :** environnement agent, mode de lancement/transport, accès disponible, données transmises, coût et limites. Aucun fournisseur sélectionné ; aucune installation ou inférence autorisée par cette préparation. Résoudre ces éléments sur preuves en A et demander seulement l’arbitrage matériel manquant. Un assistant installé ne constitue pas un raccordement démontré.

**Compatibilité à préserver :** assistance optionnelle proposée pour respecter CAD-05/REC-02. Si une dépendance IA obligatoire est souhaitée, arrêter cette partie pour arbitrage explicite avant de changer les autorités. Cette fiche ne tranche pas silencieusement ce conflit.

**Hypothèses réversibles :** Enregistrer conservé ; analyse après stabilisation et avant sauvegarde ; Tokens/Styles restent l’entrée experte ; aperçu particulier provisoire pendant une ambiguïté. Impact : pas de propagation anticipée, mais attente possible avant sauvegarde. Retest humain : comprendre l’attente, la portée et la question sans connaître les quatre opérations. Risque résiduel : l’intention produit ne se déduit pas toujours du visuel ; politique et validateur ne garantissent ni cohérence universelle ni compatibilité native des quatre assistants.

Recommandation de réalisation : **GPT-6.1 Sol · Élevée**. Résultat clair ; surfaces inspectées Panel/session/draft/operations/HTTP/store ; plusieurs contrats dépendants et nouvelle frontière agent. Transport indéterminé, sans difficulté observée justifiant très élevée/max/Astra. La préparation documentaire seule ne justifie pas cette hausse ; réglage client non vérifié ni modifié.

Livrables : cette fiche, `ROADMAP.md` et `docs/project-state.md` du suivi de fabrication. **Doc updated.** Contrôles documentaires : `git diff --check` conforme ; neuf liens locaux de la fiche résolus et deux renvois du suivi contrôlés par lecture de fichiers ; diff relu, trois fichiers documentaires seulement, aucun secret ou réglage local ajouté. Ces contrôles ne qualifient pas le comportement futur. Tests, builds, navigateur et agent réel **non exécutés** conformément au mandat. Aucune recette actualisée, publication ou activation IA. Version de référence : base inspectée ci-dessus, complétée par le commit documentaire de préparation.

Prochaine action : mandat explicite de réalisation de DS-EDIT-14, début par A et résolution du canal avant C. Les qualifications antérieures gardent leurs versions ; G/J5, reprise par un tiers et acceptations humaines restent distincts. Rendre la main après préparation, sans implémentation.
