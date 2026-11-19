# Loomata sur macOS

## Panneaux UI Lab — UI-LAB-02

Navigation et réglages flottent au-dessus d’un aperçu pleine surface sur desktop. Chaque panneau mesure 280 px de large, avec un retrait extérieur, un padding et un arrondi de 16 px. Voir [DS-UI-01](../docs/work-items/ds-ui-01-floating-panels.md). Les couleurs, la typographie compacte et les icônes se rapprochent du thème Storybook ; le clair/sombre suit le système. Les composants prévisualisés et leurs valeurs restent ceux du design system du projet. Voir [UI-LAB-02](../docs/work-items/ui-lab-02-storybook-style.md).

## Header simplifié — UI-MAC-01

La barre supérieure native regroupe **UI Lab**, **Aperçu** et **Codex**, avec le titre de fenêtre masqué. Storybook reste accessible dans **Présentation → Storybook** et conserve ses commandes Accueil/Actualiser. Le renommage de UI Lab est en attente de choix du porteur. Les messages informatifs de dossier/services sont retirés du cadre ; les erreurs restent accessibles sous forme d’alertes. Les commandes de projet restent dans le menu Projet. **Loomata → Compte Codex…** ouvre les commandes du compte UI Lab ; aucun bouton de connexion permanent dans l’atelier. Le navigateur conserve un menu Compte Codex. La page Laboratoire de référence et son lien sont supprimés ; les exemples partagés restent dans Storybook. Voir [UI-MAC-02](../docs/work-items/ui-mac-02-quiet-workspace.md).

## Application intégrée — UI-FINAL-01 B

Le contenant courant est `Loomata.swift` : UI Lab, Storybook et aperçu du dossier actif dans une même fenêtre, avec documents conservés lors d’un changement de vue. Après préparation des prérequis du socle et de ses dérivés sur une instance inactive, lancer depuis sa racine :

```sh
npm run loomata
```

Le bundle local courant est indiqué dans `.runtime.local/loomata/latest.json` ; il s’ouvre ensuite directement depuis Finder. Un deuxième lancement réutilise cette version. Une modification du code natif demande de traiter les brouillons explicitement, puis de fermer la version ouverte avant reconstruction. Le lanceur ne répare/purge aucun état privé existant. Les autorisations de dossiers sont accordées dans macOS ; les builds locaux signés ad hoc peuvent nécessiter une nouvelle confirmation.

Prérequis de ce mode source : macOS, Node/npm compatibles, dépendances préparées et outils Apple. Le build essaie les SDK déjà installés seulement si le compilateur signale une incompatibilité ; `LOOMATA_SDK` permet un choix explicite. Aucune installation ni préférence globale automatique. Le runtime n’est pas encore embarqué.

La vue UI Lab conserve ses données web dans un magasin temporaire propre à sa durée de vie. Son ouverture et Accueil ignorent le cache local ; Actualiser revalide depuis le serveur. Les fichiers du projet, tokens, reçus et compte Codex restent gérés par le service local, sans suppression de leurs états. Un changement de vue garde le même document et son brouillon ; recharger demande confirmation lorsqu’un brouillon existe. Le premier chargement peut encore afficher brièvement « Chargement des références… » : la disponibilité HTTP ne prouve pas la fin du montage de l’atelier. Voir la [qualification de chargement macOS et sa réserve causale](../docs/reviews/ui-arch-04-macos-loading/README.md).

Les trois vues utilisent les URLs du service commun. L’aperçu est le vrai `/` du dossier ; les pages demandant une DB ne sont pas rendues fonctionnelles par la seule supervision de l’atelier. Dans Présentation : accès aux vues, Accueil, Actualiser. Les confirmations conservent le travail par défaut. Quitter/Fermer n’enregistre rien et laisse les services actifs jusqu’à arrêt explicite.

Recette automatisée : `npm run test:loomata`, [preuves et limites](../docs/reviews/ui-final-01-b/README.md). Les campagnes utilisent des copies isolées et une identité d’app distincte ; leur pilote AppKit/WebKit ne vaut pas une recette physique. Pour une autre instance préparée, `node scripts/loomata.mjs --project-directory <dossier>` ; si une version est ouverte, utiliser son sélecteur ou fermer explicitement avant de changer de contexte depuis le lanceur.

## Projets — UI-FINAL-01 C

La barre et le menu Projet proposent Nouveau projet, Ouvrir un projet et Préparer / Réessayer. Le [parcours et ses limites](../docs/product/project-lifecycle.md) décrit la création sans écrasement, les confirmations, le démarrage/arrêt du projet sélectionné et la reprise du dernier dossier. La création prépare les outils d’un dossier neuf, pas sa première version métier. L’orchestration reprend le port commun ; aucun nouveau serveur de commandes n’est ajouté.

La recette `npm run test:loomata:projects` prolonge B sur des copies isolées. Elle pilote le vrai sélecteur macOS avec un outil Accessibilité de test, puis AppKit/WKWebView, et vérifie une relance du même bundle. Elle nécessite une session graphique et les accès de test autorisés sur le poste. Elle ne modifie ni les préférences système ni le projet de travail.

Pour mettre à jour une version native déjà ouverte, enregistrer ses réglages puis la fermer avant de relancer Loomata. Le lanceur conserve ce refus de remplacement ; il ne ferme jamais une ancienne fenêtre pour reconstruire. Une nouvelle signature ad hoc peut demander de nouveau l’accès macOS aux dossiers. Les bundles de développement gardent des chemins locaux et ne sont pas une distribution autonome.

## Prototype historique CORE-01

Prototype de faisabilité CORE-01, pas application distribuable. Il réutilise scripts/local-service.mjs pour le pilotage et affiche l'interface existante via WKWebView. Pas d'IA, installation globale, service de session, écriture DS ou pont JavaScript privilégié ajouté.

Compiler avec les outils Apple et un cache de module dans un emplacement local ignoré. Si le SDK par défaut n'est pas compatible avec Swift, sélectionner un SDK déjà installé pour cette commande uniquement ; ne pas modifier les préférences globales.

```sh
swiftc -swift-version 5 -module-cache-path .runtime.local/swift-cache macos/Prototype.swift -o .runtime.local/UI-Lab-Prototype
```

Exécution interactive : binaire suivi du chemin absolu du Node compatible puis de scripts/local-service.mjs. Choisir une instance déjà préparée/configurée ; Démarrer et Arrêter utilisent le service commun. Fermer la fenêtre n'enregistre aucun brouillon et n'arrête pas implicitement les services. Aucun dossier utilisateur existant ne doit servir de fixture.

Sonde sans fenêtre : ajouter --probe avant ces deux chemins, puis le chemin du projet. Seul runtime.status est appelé. Cette sonde prouve l'appel natif du contrat, pas le comportement visuel, les permissions de sélection ou la fermeture avec un vrai brouillon. La création de menus finaux, l'arrêt au quit, l'ergonomie et la signature relèvent du chantier d'enveloppe définitive.

## Recette interactive CORE-01

Sur le poste de fabrication, ouvrir le lanceur privé `.local/core-01/launch-prototype.command` à la racine du dépôt ; il lance le binaire compilé avec Node et le client commun de la copie extraite. Le lanceur est un artefact de test local, pas une distribution. Il ne démarre les services qu'après la sélection explicite d'un dossier et Démarrer. Il ouvre aussi une fenêtre Terminal durant l'essai.

Choisir la copie isolée `.local/core-01/extracted kit`, pas l'application de fabrication ni une recette humaine. Vérifier au préalable que cette copie n'a pas l'attribut macOS masqué (`ls -ldO`) ; sur cette seule copie jetable, retirer cet attribut avec `chflags nohidden` si nécessaire. Le parent `.local` peut rester masqué : le rejoindre dans le sélecteur par ⌘⇧G, puis sélectionner explicitement la ligne `extracted kit` et valider Open/Ouvrir. Avant Démarrer, vérifier « Dossier sélectionné : extracted kit » ; la sélection seule ne lance rien. Relever le résultat de chaque étape :

1. La fenêtre contient Ouvrir un dossier, Démarrer, Arrêter les services et un état lisible. Avant sélection, Démarrer demande un dossier.
2. Annuler le sélecteur ne démarre rien. Choisir le dossier de travail `.local/core-01` (incompatible), puis Démarrer : refus compréhensible, pas d'atelier ouvert. Choisir ensuite la copie extraite : dossier reconnu au lancement.
3. Démarrer : attente sans gel de la fenêtre, état ready, atelier complet avec arbre, aperçu et champ de valeur activé. Deux clics ne créent pas une seconde instance.
4. Dans cette copie, préparer une modification de couleur et l'annuler ; l'aperçu suit le brouillon et le retour. Préparer une autre modification, Enregistrer puis vérifier Storybook au port de la configuration privée de cette copie. Relever la valeur et le message de confirmation.
5. Arrêter les services après enregistrement, puis Démarrer : valeur enregistrée conservée, aucun processus supplémentaire. Un rechargement de l'aperçu ne vaut pas sauvegarde.
6. Avec un brouillon non enregistré, fermer via le bouton rouge : confirmation explicite. Conserver la fenêtre maintient le brouillon. Après Annuler le brouillon, fermer et confirmer : fenêtre et processus du prototype se terminent, services encore disponibles. Relancer puis choisir la même copie ne crée pas un autre writer.
7. Finir par Arrêter les services et fermer le prototype. Confirmer que les URL de la copie ne répondent plus, sans arrêter les autres recettes.

La confirmation de fermeture est volontairement systématique : le prototype ne lit pas l'état privé du brouillon depuis le DOM. Elle protège le bouton rouge, pas un arrêt forcé du Mac ou une terminaison depuis le Terminal. Menus natifs de production et gestion complète de Quitter restent ultérieurs. Une étape échouée garde sa réserve ouverte ; compilation et sonde ne remplacent pas ces observations.

Le binaire accepte aussi un troisième chemin optionnel, celui du projet : il démarre cette instance via le service commun et affiche directement l'atelier. Sans ce chemin, le sélecteur reste manuel. La fenêtre directe se nomme UI Lab — copie de test CORE-01. Utiliser uniquement une copie de test pour la recette.

## E2E automatisé du prototype

Depuis la racine du kit, `npm run test:macos-prototype` compile une copie instrumentée et exerce AppKit/WKWebView avec les vrais services sur une copie jetable. Une session graphique macOS, les outils Apple, les dépendances et Chromium Playwright sont requis. Fournir `CORE_E2E_SDK` si le SDK par défaut est incompatible avec Swift. Le runner ne change aucune préférence globale et conserve ses preuves dans `test-results/native-e2e/`.

Le [rapport de campagne](../docs/reviews/core-01-native-e2e.md) distingue les scénarios exécutés et les réserves, dont la validation réelle du sélecteur de dossier désormais qualifiée par un contrôle Accessibilité distinct. Le pilotage interne des contrôles ne vaut pas recette humaine, clic physique ou test du Dock. Les confirmations JavaScript d'abandon du brouillon sont relayées vers une feuille native, avec conservation par défaut.


## Palette de l’atelier — DS-UI-02

Le mode sombre utilise la [palette documentée de l’atelier](../docs/design-system/editor-preview.md#palette-sombre--ds-ui-02). Le bundle embarque `loomata-ui.tokens.json`, copie validée de l’autorité de l’outil au moment de sa compilation ; ses couleurs natives sont indépendantes des tokens du projet. Le sélecteur AppKit conserve sa navigation et reçoit la couleur active #3B3B3B par `selectedSegmentBezelColor`. Le fond principal est #171717 ; les champs/boutons sont #1F1F1F. Aucun réglage global de macOS n’est modifié.


Pendant le chargement d’un composant, la vue UI Lab utilise aussi le fond natif `underPageBackgroundColor` issu du rôle `main`. Les documents de l’atelier et de son aperçu portent leur fond sombre dès le SSR ; ils n’attendent pas le montage React. Le sélecteur des trois vues conserve son style natif automatique d’origine ; aucun calque de fond rectangulaire ou style `.rounded` n’est forcé.
