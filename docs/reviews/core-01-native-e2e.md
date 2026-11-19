# CORE-01 — E2E du prototype macOS

**Clôture au 10 novembre 2026 : CORE-01 accepté et clos sur demande du porteur, au périmètre A–E.** La réserve technique du sélecteur est levée ; les mentions d’acceptation différée et les JSON ci-dessous restent les relevés historiques du 9 novembre. [Clôture et limites](core-01-shared-deliveries.md#clôture-du-10-novembre-2026).

9 novembre 2026. Sources du prototype basées sur `4c3e834`, puis correctif et pilote de cette campagne. Cible application ; suivi de fabrication dans la roadmap racine. [Bilan CORE-01](core-01-shared-deliveries.md).

## Méthode et reproductibilité

Le runner compile une copie instrumentée du vrai `Prototype.swift`. Le pilote séparé déclenche les actions AppKit des boutons, ouvre le vrai NSOpenPanel et les vraies confirmations NSAlert, puis saisit et clique dans le DOM de WKWebView. Le bundle jetable est ouvert par LaunchServices ; le pilote maintient sa fenêtre visible pour éviter la suspension du rendu, et ignore les frappes physiques étrangères à la campagne. Aucun retour de sauvegarde, service Node, rendu de composant ou confirmation JavaScript n'est simulé. Ce pilotage interne ne prouve pas les clics physiques, le clavier, VoiceOver, le Dock ou une app signée.

Une nouvelle copie jetable avec espaces dans son chemin est créée par campagne, avec ses propres ports loopback, configuration, sources et états privés. Elle réutilise les dépendances installées par copie clone ; aucune installation ni connexion IA. Les recettes existantes et les fenêtres de test ouvertes pour le porteur sont préservées.

Depuis la racine du kit, avec Node compatible, dépendances et Chromium Playwright déjà disponibles, session graphique macOS et outils Apple installés :

```sh
CORE_E2E_SDK=/Library/Developer/CommandLineTools/SDKs/MacOSX26.5.sdk npm run test:macos-prototype
node --test tests/local-service.test.mjs tests/local-app.test.mjs
```

`CORE_E2E_SDK` est optionnel si le SDK sélectionné est compatible avec Swift. Aucun changement global de SDK. Le runner conserve ses journaux, sources compilées, captures et qualification sous `test-results/native-e2e/run-*`, ignoré par Git. Le résultat sélectionné versionné doit être expurgé de tout état privé.

## Anomalies corrigées

Le parcours révélait un défaut du prototype : sans WKUIDelegate, le `confirm()` utilisé pour abandonner un brouillon ne présentait pas sa confirmation et retournait un refus. Le bouton Annuler laissait le brouillon actif. Le prototype fournit désormais une vraie feuille NSAlert pour l'origine locale autorisée, avec conservation par défaut et abandon explicite. Aucun pont JavaScript privilégié n'est ajouté. Le retest contrôle les deux réponses.

Après arrêt/redémarrage, l'ancien WKWebView pouvait rester sur le HTML initial « Chargement des références… » malgré des sources sauvegardées et un document visible. Les journaux montraient plusieurs navigations durant la reconnexion du client HMR. Le simple rechargement sans cache essayé n'a pas résolu le défaut et n'est pas conservé. Le prototype retire maintenant l'ancien WKWebView et crée un nouveau contexte de page avant de charger la session du writer redémarré, en conservant sa configuration. Le retest relit effectivement `#234567` dans le champ et `rgb(35, 69, 103)` dans l'aperçu. L'interleaving exact des navigations n'a pas été isolé comme cause unique.

## Réserve initiale du sélecteur de dossier

Le vrai sélecteur s'ouvre et son annulation est automatisée. Les tentatives de validation par `NSOpenPanel.ok` n'ont pas produit de réponse OK exploitable avec ce pilote ; les watchdogs/arrêts ciblés de ces essais sont conservés. Ce n'est pas un PASS du choix de dossier, ni la preuve d'un défaut produit du sélecteur.

Les dossiers valides et incompatibles sont donc testés par le parcours d'ouverture directe déjà présent dans le prototype de production. La campagne initiale garde cette réserve D explicite. Le complément natif ci-dessous la lève après une vraie validation du sélecteur, sans modifier son résultat historique.

## Résultat de campagne

Campagne finale `run-xwK2MH`, Node local du lanceur `v24.22.0` (premier succès `run-TrNYph` avec Node système `v24.13.1`) : **PASS avec réserve**, douze scénarios exécutés, [résultat sélectionné](core-01-native-e2e/qualification.json). Le statut ne couvre pas la validation du sélecteur ni une recette humaine. Captures sélectionnées : [contenu WKWebView après sauvegarde](core-01-native-e2e/workshop.png), [Storybook actualisé](core-01-native-e2e/storybook-live.png).

| Scénario | Résultat observé |
| --- | --- |
| Barre native, démarrage sans sélection, annulation du vrai sélecteur | PASS |
| Ouverture directe d'un dossier incompatible | Refus natif, PASS |
| Démarrage et clics répétés | Atelier hydraté, services bornés, PASS |
| Brouillon `#123456`, confirmation conservée puis abandon | Valeur et aperçu initiaux rétablis, PASS |
| Sauvegarde `#234567` dans WKWebView | Confirmation après relecture durable, PASS |
| Storybook déjà ouvert avant l'édition | Mise à jour automatique sans rechargement piloté, PASS |
| Arrêt puis redémarrage natifs | `#234567` et rendu conservés, PASS |
| Brouillon `#345678` puis fermeture annulée | Fenêtre et brouillon conservés, PASS |
| Abandon du brouillon puis fermeture confirmée | Notification native, fin de l'hôte, PASS |
| Services après fermeture de l'hôte | Deux processus supervisés, état ready, PASS |
| Storybook relu après fermeture | Valeur sauvegardée, pas le brouillon abandonné, PASS |
| Arrêt final du service commun | Deux ports de test fermés, PASS |

Les douze tests existants de contrat/supervision passent également avec les deux runtimes ; syntaxe Node, ESLint ciblé et Prettier des scripts modifiés conformes. Le prototype non instrumenté est recompilé séparément et sa sonde retourne `protocolVersion: 1`, `phase: stopped`. Le lanceur privé ouvre ce binaire corrigé au prochain démarrage ; la fenêtre déjà ouverte reste intacte. Aucune modification du code web, du stockage DS, des dépendances ou de PostgreSQL ; leurs suites complètes et les builds web ne sont pas revendiqués comme rejoués dans cette campagne.

Échecs conservés dans les sorties privées : validation automatique du sélecteur non aboutie ; attente du rendu lorsque la fenêtre est masquée ; défaut de confirmation initial (`run-wj2wbV`) ; défaut de rechargement après redémarrage (`run-41jqhi`, `run-X0xmWT` et diagnostics suivants). Des essais interrompus restent des FAIL et ne qualifient aucun scénario supplémentaire. L'essai `run-11KsSu` a aussi révélé un clic de pilote trop précoce après réhydratation : le champ était déjà relu mais les actions pas encore activées. Le pilote attend maintenant un bouton réellement activé, sans modifier son état. Le retest final passe sur une nouvelle copie. La campagne positive finale utilise une nouvelle copie isolée et le pilote stabilisé ; elle ne réécrit pas ces résultats.

Revue technique et contrôle des frontières du correctif : **séquentiels, même agent, non indépendants**. Le service commun, les origines autorisées et l'unicité du writer sont conservés. Le seul retour de la confirmation native est un booléen pour l'origine locale attendue ; aucun shell, fichier ou compte n'est exposé à la page. Les PID des nettoyages sont vérifiés contre le chemin du binaire jetable ; aucun arrêt global par nom. Cette revue ciblée n'est pas un audit de sécurité complet ni une acceptation visuelle.

Ce résultat initial qualifiait D sur le périmètre E2E exécuté avec réserve du sélecteur. Le complément ci-dessous lève cette réserve ; clavier/focus prolongé et recette humaine restent distincts. Dock, redémarrage du Mac, signature, distribution, Node/npm embarqués et menus natifs finaux restent hors de cette preuve. A–C et les acceptations J4/J5 ne changent pas. Aucune publication. Doc updated.

## Complément : vrai sélecteur natif vérifié, réserve levée

Après le retour du porteur indiquant deux refus, contrôle sur le prototype corrigé **non instrumenté**, version `4eb361d`. L'accès Accessibilité et l'autorisation de capture déjà présents sur le poste ont été vérifiés ; aucune nouvelle permission système n'a été accordée. Les contrôles du vrai NSOpenPanel sont pilotés depuis un processus externe, sans assigner `Host.root` ni forcer une réponse OK au dialogue.

Le journal Terminal du lanceur montrait des tentatives sur Applications et Chrome Apps, pas sur la copie attendue. Le contrôle de la copie a révélé l'attribut macOS `UF_HIDDEN` : elle était masquée dans la liste normale du sélecteur. Correction limitée à `chflags nohidden` sur `.local/core-01/extracted kit` ; ses fichiers, l'état privé et les services existants sont conservés. Le parent `.local` reste masqué. Les instructions de recette antérieures ne signalaient pas cette difficulté.

Résultats effectivement observés par Accessibilité, [preuve sélectionnée](core-01-native-e2e/selector-qualification.json) :

- Sélection du vrai dossier `core-01`, validation par Open : « Dossier sélectionné : core-01 », puis refus de Démarrer ; absence de package.json dans ce dossier confirmée dans le journal.
- Sélection de la ligne désormais visible `extracted kit` dans la liste native, validation par Open : « Dossier sélectionné : extracted kit », puis « État : ready ».
- Atelier hydraté dans cette même fenêtre : bouton « Enregistrer le projet » présent et activé, champ « Valeur précise » activé avec `#1d4ed8`. Aucun réglage édité ni sauvegardé.
- Le service commun relit ready pour 53196/53197, avec les mêmes processus supervisés qu'avant le contrôle. Prototype et services laissés ouverts ; les autres fenêtres/recettes ne sont pas arrêtées.

Les premiers essais de commande du dialogue (actions sur un bouton désactivé ou masqué, saisie de chemin encore ouverte) ne sont pas des PASS ; les traces privées sont conservées sous `.local/core-01/selector-check`. Une tentative de capture de la fenêtre finale n'a pas produit d'image : aucune capture finale n'est revendiquée ni jointe. Les états natifs ci-dessus viennent des attributs Accessibilité et de la relecture du service, pas d'une capture inventée.

**Conclusion : réserve technique du sélecteur levée.** A–E sont techniquement qualifiées au périmètre CORE-01 ; acceptation humaine différée. Pas de nouvelle modification du code produit ou de dépendance : les tests natifs précédents restent leurs preuves propres, sans être revendiqués comme réexécutés dans ce complément. Les seuls changements versionnés de cette intervention sont le rapport, sa preuve et le suivi. Aucune publication. Doc updated.
