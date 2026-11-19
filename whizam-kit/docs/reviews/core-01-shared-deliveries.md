# CORE-01 — Preuves et limites

**10 novembre 2026 — CORE-01 validé et clôturé sur demande explicite du porteur, au périmètre A–E.** Les distributions finales et J4/J5 restent hors de cette acceptation.

État qualifié D : [campagne E2E du prototype](core-01-native-e2e.md), douze scénarios réussis, puis validation réelle du sélecteur sur le prototype non instrumenté ; réserve levée. Le bilan ci-dessous conserve les étapes et limites initiales.

9 novembre 2026. Base db4ceee, branche codex/core-01-shared-delivery. [Fiche](../work-items/core-01-shared-deliveries.md), [architecture/contrats](../architecture/shared-core.md), [décision 031](../decisions/031-shared-core-two-deliveries.md).

## A — Inventaire et B — Contrats

Cartographie des moteurs, writer, interface et adaptateurs réalisée ; aucun déplacement du socle ni duplication de l'app. Un port Node borné inspecte les projets et pilote le superviseur existant ; adaptateur CLI JSON et prototype natif le consomment. Il ne crée pas un nouveau serveur d'écriture ni un endpoint navigateur privilégié. Les autres capacités de la feuille de route sont annoncées indisponibles et refusées, pas simulées comme des fonctions livrées.

Trois tests propres au port commun réussis : refus des opérations inconnues/non disponibles avant I/O, inspection/pilotage avec chemin contenant des espaces et arguments sans shell, refus de dossier incompatible avant exécution. Neuf tests existants du superviseur réussis : ports/concurrence/reprise/refus/conservation ; douze au total. Aucun nouveau contrat de sources DS ni modification du manifeste fermé.

## C — Dossier autonome

Extraction des seuls fichiers applicatifs sélectionnés par Git dans une copie ignorée, sans Git ni fichiers parent, ni état privé, ni doublons non suivis. Dépendances installées existantes réutilisées par copie ; Node compatible fourni comme prérequis externe. Pas de npm ci neuf ni preuve de dossier zéro-installation. La copie source ne transporte aucune donnée PostgreSQL.

Dans cette copie : génération, validation complète du kit d'agents, douze tests, types React Router/TypeScript, lint et frontières serveur réussis ; builds app et Storybook réussis. Le port commun a réellement démarré et arrêté UI Lab writer et Storybook lecteur sur deux ports loopback temporaires, avec état ready et édition présente. Aucun service humain ou ancienne recette touché.

Déplacement de la copie vers un chemin avec espaces puis inspection via le client commun : protocole 1 et nouvelle racine correcte. Réparation explicite du superviseur conservant sa configuration ; retour au chemin de test puis réparation. Le contrôle confirme l'absence de dossier .git. Les tests de transactions et de persistance du DS déjà qualifiés ne sont pas revendiqués comme réexécutés par cette campagne ; le moteur/writer n'a pas été modifié.

Journaux privés check-0 à check-8 dans .local/core-01 ; le chantier ne distribue ni ce dossier de travail ni ses dépendances. Tous les services de cette campagne ont été arrêtés.

## D — Faisabilité macOS

Prototype AppKit/WKWebView sans nouveau framework tiers : sélection native d'un dossier déjà préparé, démarrage/arrêt via le client commun, navigation limitée à l'origine locale de l'atelier. Les opérations longues sont hors du thread UI et les appels concurrents d'une même fenêtre sont bornés. Aucun pont JavaScript vers un shell, compte utilisateur ou jeton fourni à la page.

Premier build : SDK 27.0 par défaut compilé avec Swift 6.4, incompatible avec Swift 6.3.3 installé. Échec conservé. Diagnostic des SDK présents puis compilation réussie avec -sdk /Library/Developer/CommandLineTools/SDKs/MacOSX26.5.sdk et cache local au dépôt. Aucune installation ou modification de xcode-select. Le binaire a exécuté sa sonde --probe contre le client Node de la copie extraite : JSON protocolVersion 1, phase stopped.

La sonde native démontre l'appel du service commun ; la compilation démontre les API AppKit/WebKit disponibles. La fenêtre, la sélection réelle d'un dossier, les permissions GUI et la fermeture avec brouillon ne sont PAS vérifiées : aucun outil de contrôle macOS n'est disponible dans cette session. D reste partiellement qualifiée ; pas d'app native prête à utiliser, ni signature/distribution, ni Node/npm embarqués. Cette limite ne bloque pas A–C, elle bloque la qualification interactive de D.

## Revues et suite E

Revues technique/sécurité et design proportionnées, séquentielles, même agent, non indépendantes. Technique : une supervision et un writer, arguments explicites, protocole versionné et refus de capacités absentes. Sécurité : accès réservé aux appelants locaux de confiance, pas d'exposition HTTP, aucun secret dans la page ou l'extraction ; tout futur adaptateur réseau devra contrôler les capacités et les chemins. Design : aucun changement au rendu de UI Lab ; interaction du prototype non vérifiée, donc aucune validation visuelle revendiquée.

Résultat : A–C techniquement qualifiées, E documentée ; D compilée et sondée mais essai interactif restant. Acceptation humaine différée. Risque résiduel : choix d'un dossier non fiable implique du code local, ergonomie/fermeture du prototype, prérequis externes du dossier source, runtime/base de données de la distribution finale. Aucune installation globale, publication ou connexion IA/GitHub. Doc updated. Reprise : essai macOS interactif, puis réalisation des étapes post-stabilisation sur mandat ; pas de bascule implicite vers le produit natif complet.

## Préparation de la recette interactive

Vérification préalable : copie extraite présente, runtime disponible, services stopped ; adresses de test 53196/53197 sur ce poste. Le lanceur privé launch-prototype.command prépare l'essai sans modification du Dock ou d'Applications. Ajout d'une confirmation systématique au bouton de fermeture, refus pendant une opération et terminaison de l'hôte après la dernière fenêtre. Elle ne garantit pas les arrêts forcés ou les menus Quitter non implémentés. Recompilation avec SDK 26.5 et sonde sans fenêtre réussies ; syntaxe du lanceur shell conforme ; aucune étape graphique acceptée avant retour utilisateur. Le [parcours numéroté](../../macos/README.md#recette-interactive-core-01) sert au relevé. D reste ouverte.

## Ouverture directe pour la recette

À la demande du porteur, ajout d'une racine optionnelle au prototype pour ouvrir directement la copie synthétique. Binaire distinct Prototype-test compilé et sondé ; l'instance déjà ouverte n'a pas été arrêtée. Nouvelle fenêtre UI Lab — copie de test CORE-01 lancée. Le callback WKWebView confirme le chargement du document local ; le service commun confirme ready pour UI Lab 53196 et Storybook 53197. Cela ne démontre pas l'hydratation complète ni la réussite des interactions : D reste en attente du retour utilisateur. Métadonnées et journal privés dans .local/core-01 ; aucun brouillon manipulé ou enregistré.

## Qualification E2E du prototype

À la demande du porteur, ajout d'un pilote instrumenté AppKit/WKWebView avec les vrais services sur une nouvelle copie jetable. [Rapport, anomalies, captures et réserve](core-01-native-e2e.md). Douze scénarios passent : hydratation, brouillon/confirmation, sauvegarde et propagation dans Storybook déjà ouvert, arrêt/redémarrage avec relecture, fermeture annulée conservant le brouillon, fermeture confirmée laissant les services disponibles, puis arrêt final des deux ports. Deux défauts du prototype sont corrigés : confirmation JavaScript absente et réutilisation du contexte WebKit au redémarrage. Le choix de dossier via la validation du dialogue système reste à contrôler manuellement ; validité/refus sont testés par l'ouverture directe de production. D est qualifiée sur les parcours exécutés, sans clôture de cette réserve ni acceptation humaine. Anciennes fenêtres/recettes préservées ; aucune app distribuable ou dépendance embarquée revendiquée. Doc updated.

## Complément du sélecteur

[Contrôle natif et preuve](core-01-native-e2e.md) : après correction de l'attribut masqué de la seule copie de test, validation du vrai NSOpenPanel via Accessibilité. Sélection incompatible refusée, copie `extracted kit` sélectionnée puis atelier ready avec aperçu et champ activé. Services 53196/53197 réutilisés sans édition ; réserve technique du sélecteur levée, acceptation humaine différée. A–E techniquement qualifiées au périmètre CORE-01, sans distribution finale ou runtime embarqué déduits. Doc updated.

## Clôture du 10 novembre 2026

Le porteur demande explicitement la clôture de CORE-01 après la levée de la réserve du sélecteur. Mandat A–E accepté et clos : preuves de réalisation `4eb361d`, complément natif `27ce176`. Les mentions d'acceptation différée ci-dessus décrivent les étapes antérieures ; les preuves historiques ne sont pas réécrites.

Contrôle documentaire de clôture : cohérence des statuts, liens et références de preuves, séparation entre prototype qualifié et distributions futures. Aucun nouveau test runtime, build ou essai humain revendiqué ; aucune installation, modification du code, arrêt de recette ou publication. Les limites de plateformes, de clavier/focus prolongé, de Dock/redémarrage du Mac et de distribution restent attachées aux preuves et ne bloquent pas ce périmètre borné. J4/J5 ne sont pas clos.

Relais : [finalisation de UI Lab puis création de projets et exports sur le cœur commun](../architecture/shared-core.md#ordre-de-réalisation), avant les livraisons définitives. Doc updated.
