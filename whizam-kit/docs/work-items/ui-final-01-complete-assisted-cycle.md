# UI-FINAL-01 — Construire l’application Loomata et intégrer ses outils

**12 novembre 2026 — articulation avec MVP-01 :** [décision 033](../decisions/033-loomata-mvp-scope-and-sequence.md), [nouveau périmètre](../product/loomata-workspace.md) et [préparation des trois tranches](mvp-01-three-stage-development.md) pilotent désormais les évolutions fonctionnelles. Les résultats A–E ci-dessous restent datés ; F et les réserves de distribution restent requis avant clôture, sans constituer une quatrième tranche fonctionnelle. Aucun résultat antérieur ne qualifie automatiquement les nouveaux espaces.

**10 novembre 2026 — A recadrée ; B, C, D Codex et E réalisées, techniquement qualifiées et En revue ; F à réaliser.** Cible : application Loomata dans le dépôt actuel ; suivi de fabrication dans la roadmap racine. Base de la correction : `b70360c`. Le précédent cadrage « cycle Prêts d’objets » ne répondait pas au livrable attendu ; sa conclusion de fin de chantier est retirée. Les correctifs et preuves réutilisables sont conservés, sans acceptation produit déduite.

## Mandat et résultat attendu

Autorité produit : [Loomata — application locale pour réaliser ses projets](../product/loomata-workspace.md). Créer l’application que l’utilisateur ouvre pour travailler : une interface globale, un projet actif et l’accès intégré à UI Lab, Storybook, l’aperçu du projet et aux capacités de création assistée prévues. Le livrable de ce chantier est Loomata ; aucune nouvelle application métier arbitraire n’est demandée.

Conserver un cœur commun dans le repo actuel et deux voies de livraison, dossier autonome et app macOS. Les étapes ci-dessous organisent la réalisation ; les fonctions encore absentes restent marquées comme telles. L’interface globale de Loomata est le travail immédiat, pas une exclusion renvoyée après un nouveau projet témoin.

Procédures : plan-feature et update-project-docs pour cette correction documentaire ; implement-feature, design-interactions, test-user-flow et revues applicables pour les tranches de code. Aucune modification des rôles ou skills.

## A — Périmètre et état réel, repris

| Élément existant | Réutilisation | Manque à réaliser |
| --- | --- | --- |
| `macos/Prototype.swift` | Fenêtre AppKit/WKWebView et sélection de dossier du prototype CORE-01 | Navigation de l’application Loomata, intégration de Storybook et des autres vues ; aucune app finale déduite de la faisabilité. |
| `src/ui-lab/editor/` | Atelier web et son état de travail | Intégration dans l’espace global sans perte silencieuse de brouillon. |
| `.storybook/` | Catalogue lecteur existant | Accès intégré dans l’app avec le bon contexte de projet. |
| `scripts/core/local-service.mjs` | Inspection et start/status/stop bornés | Opérations de projet et exports encore indisponibles ; pas de commande arbitraire. |
| `scripts/local-app.mjs` | Supervision et identité des services | Parcours d’ouverture/reprise porté par l’app ; pas de lancement manuel exigé de l’utilisateur. |
| AGENT-CHAT-01 | Préparation du chat et de ses conditions | Assistance intégrée réelle à raccorder/qualifier ; la conversation Codex externe ne la remplace pas. |

**Sortie A :** intention du porteur rétablie dans les autorités, inventaire établi et faux statut de livraison retiré. Cette correction n’a encore développé ni testé l’interface globale. L’historique de la [fiche précédente](ui-final-01-assisted-cycle-history.md) et du [rapport auxiliaire](../reviews/ui-final-01/README.md) reste identifiable.

## Tranches de réalisation corrigées

| Tranche | Résultat concret | Critère de sortie |
| --- | --- | --- |
| B — Interface Loomata | Une entrée et une fenêtre identifiées Loomata, contexte du projet et navigation cohérente vers UI Lab, Storybook et l’aperçu. Réutiliser le web et le contenant natif existants. | Lancer Loomata, utiliser les vues dans l’application et revenir à l’atelier sans perte non confirmée ; un catalogue externe ouvert à la main ne suffit pas. |
| C — Projets et orchestration | Choisir/ouvrir un projet ; raccorder la création dans un dossier choisi au cœur commun ; démarrage et arrêt propriétaires, erreurs/reprise lisibles. | Le dossier du projet est distinct de l’installation ; aucun dossier existant n’est écrasé ; mêmes opérations depuis les deux livraisons. |
| D — Travail assisté dans l’outil | Raccorder l’assistance prévue en s’appuyant sur AGENT-CHAT-01, avec autorisations, contexte et états réels. | Le parcours se déroule dans Loomata ; aucune simulation de fournisseur ou action de la présente conversation comptée comme intégration. |
| E — Exports et autonomie | Raccorder les exports du projet et de l’outil au cœur ; préparer le runtime Node/npm privé et les livraisons. | ZIP vérifiés, exclusions des secrets/caches/états privés ; absence de dépendance cachée à Node/npm global pour l’app autonome annoncée. |
| F — Recette de Loomata | Qualifier démarrage à froid, navigation, projet actif, reprise et les deux livraisons sur leurs capacités effectives. | E2E commençant par l’ouverture de Loomata, artefacts identifiés et réserves explicites ; acceptation humaine séparée. |

Cette table corrige l’orientation. Les contrats d’implémentation détaillés de création, IA et packaging se rattachent à leurs fiches ; aucune capacité n’est annoncée livrée par cette préparation. Conserver les conditions fournisseur et les décisions de distribution documentées, sans contourner une autorisation ou inventer une fonctionnalité active.

## Garde-fous d’architecture et de preuve

- Un cœur, deux contenants ; ni nouveau repo, ni deuxième writer, ni duplication du DS.
- Le choix de projet est explicite ; la navigation locale s’appuie sur les origines renvoyées par le service de confiance. Ne pas autoriser une navigation arbitraire ou exposer la CLI privilégiée à la page web.
- Le changement de vue, de projet ou la fermeture traite le brouillon explicitement. Un état de chargement n’est pas un succès.
- Les processus et données appartiennent à une instance identifiée ; préserver les anciennes recettes et les reçus. Pas de purge pour faire passer une migration.
- Aucune création de projet métier spécifique en remplacement du produit. Les démonstrations éventuellement nécessaires restent des fixtures minimales de recette.
- Les deux livraisons et leurs prérequis sont constatés séparément ; signature, architectures CPU, DB et mises à jour restent explicites avant toute promesse de distribution complète.

## Recette attendue

La première vérification observe l’ouverture de Loomata et sa navigation intégrée. Tester ensuite conservation du brouillon en changeant de vue, Storybook lecteur, contexte de projet, refus d’un dossier incompatible, services déjà ouverts, démarrage à froid et reprise. Ajouter les scénarios réels de création/assistance/export lorsque leurs opérations sont implémentées. Pas de succès anticipé sur un bouton, un mock ou une simple compilation.

Préserver les tests existants du kit. Les contrôles de code seront choisis selon les surfaces touchées, dont les tests du port commun, du prototype et les parcours UI Lab. Revues design/technique/sécurité séquentielles, même agent, non indépendantes sauf mandat contraire.

## Réflexion et point de reprise

Recommandation conservée : **GPT-6.1 Sol · Élevée** pour navigation native/web, brouillons, origines et supervision du cœur commun. Aucun modèle/réglage du client prétendu modifié ; réévaluer seulement sur difficulté démontrée.

Reprise : F, recette complète des deux livraisons, sur mandat distinct. A est recadrée ; B, C et D au périmètre Codex autorisé sont techniquement qualifiées selon les résultats ci-dessous ; E–F restent à réaliser, sans clôture globale déduite. CORE-01 garde sa clôture bornée ; J4/J5 inchangés. Aucune publication. **Doc updated.**

## Exécution B — contrat retenu

Base `1df3278`, branche `codex/ui-final-01-b-workspace`. Réutilisation du prototype sans réécrire sa preuve CORE-01 : nouveau contenant `macos/Loomata.swift`, trois WKWebView persistantes, navigation native et menus standard. Le port commun expose un groupe d’URLs locales validées provenant du superviseur : UI Lab, Storybook et `/` du même projet pour l’aperçu. Les changements de vue masquent les documents sans les détruire ; redémarrage, arrêt, changement de dossier et fermeture passent par une confirmation conservatrice. Aucune commande privilégiée provenant des pages.

Cette tranche ne crée pas de projet métier. L’aperçu lit le vrai accueil du socle choisi ; les routes nécessitant une base non configurée gardent leur erreur explicite. L’orchestration métier/DB complète appartient à C. Le contenant utilise Node déjà préparé et les outils Apple locaux ; l’embarquement du runtime et l’installateur final restent E. Le launcher et les essais restent dans les emplacements ignorés du dépôt, sans installation globale ni ajout au Dock.

Procédures implement-feature et test-user-flow appliquées à la version de base ; revues séquentielles du même agent. Contrôles prévus : service commun et refus d’URLs, compilation AppKit/WebKit, parcours natif réel de navigation/brouillon/annulation/sauvegarde/reprise/refus, garde des lecteurs et captures. Anciennes recettes et reçus inchangés. Cette préparation d’exécution n’est pas un résultat de tests.

## Résultat B

Code `8ec0562`, [rapport et réserves](../reviews/ui-final-01-b/README.md), [preuve structurée](../reviews/ui-final-01-b/qualification.json). Fenêtre Loomata et trois vues persistantes, protection des brouillons/rechargements, menus natifs, URLs locales validées et lancement du bundle sans arguments. 12 scénarios natifs, 34 web, 149 unités et 13 contrats/supervision réussis ; types/lint/format conformes. Bundle normal vérifié sur le vrai `/application` après autorisation Documents, trois captures et hydratation interactive confirmée. Acceptation visuelle humaine distincte ; C–F et les prérequis de distribution restent ouverts. Doc updated.

## Préparation d’exécution C

Mandat du 10 novembre 2026, base `9ad2876`, branche `codex/ui-final-01-c-projects`. Procédures du catalogue lues sur cette base : implement-feature, design-interactions et test-user-flow ; revues design/technique/sécurité séquentielles, même agent, non indépendantes. GPT-6.1 Sol · Élevée reste adapté : copie de fichiers, entrées de chemins, reprise, processus et vues natives ; aucun réglage du client modifié.

Contrat retenu : `project.create` copie une liste versionnée de sources sélectionnées du kit vers une destination nouvelle et distincte de l’installation ; aucune dépendance Git à l’exécution. Réservation de lecture du DS pendant copie, refus des symlinks hors kit et des états privés. Le projet reçoit une identité et un accueil neutre indiquant que son cadrage reste à faire ; aucune application métier inventée. `project.prepare` prépare les dépendances et dérivés uniquement pour ce nouveau projet identifié, avec reprise explicite après erreur. `project.open` valide le dossier et prépare sa configuration de supervision sans écraser son état. Ces mêmes opérations sont disponibles par CLI dans le dossier source et depuis AppKit, sans pont privilégié web.

Dans Loomata : Nouveau projet avec sélecteur de destination, Ouvrir un projet avec validation avant remplacement de l’atelier, Préparer / Réessayer, Démarrer et Arrêter. Annuler conserve le contexte et les brouillons ; confirmer le changement arrête les seuls services précédents avant d’ouvrir les nouveaux. Les erreurs précisent la prochaine action et le dossier reste disponible après une préparation échouée.

L’accueil initial et les outils du projet ne nécessitent pas de base. Les migrations et données métier du starter restent une référence technique ; aucune base existante, seed ou Docker démarré implicitement. L’orchestration de données d’un futur métier dépend de son cadrage ; ne pas transformer les lignes de démonstration `/projects` en projets Loomata. Node/npm restent les prérequis du mode source, leur embarquement relève de E. Pas de Git distant, export ni IA dans C.

Preuves prévues : tests des chemins, exclusions, collision/concurrence, compatibilité et reprise ; E2E créant réellement un projet jetable depuis le contenant natif, préparation, trois vues, sauvegarde et reprise, ouverture refusée sans perte, arrêt propriétaire. Ne pas modifier les anciennes recettes ni les autorités DS de fabrication.

## Résultat C

Code `73fc5b7`, [rapport et limites](../reviews/ui-final-01-c/README.md), [preuves](../reviews/ui-final-01-c/qualification.json). Création, ouverture, préparation/reprise, supervision et dernier contexte raccordés au même cœur. 22 scénarios natifs et une relance du même bundle, 21 contrats/supervision et 149 unités réussis ; format/lint/types conformes. Sélecteur réel validé par AX ; aucune première version métier inventée ni base existante utilisée. Le nouveau projet démarre ses outils sans base ; l’exemple PostgreSQL nécessite sa préparation distincte, sans lancement implicite. Source B ouverte préservée ; relance après fermeture requise pour afficher le nouveau contenant. Revues séquentielles non indépendantes, acceptation humaine distincte. D–F, runtime embarqué et distributions finales restent ouverts. Doc updated.

## Préparation d’exécution D

Mandat du 10 novembre 2026, base `57641cd`, branche `codex/ui-final-01-d-assistance`. Procédures implement-feature, design-interactions et test-user-flow du catalogue ; OpenAI Docs pour le protocole officiel. Revues séquentielles, même agent, non indépendantes. Recommandation GPT-6.1 Sol · Élevée conservée ; aucun réglage du client modifié.

Relecture AGENT-CHAT-01 et sources officielles du jour : App Server Codex et profils de permissions documentés ; Claude par abonnement dans un chat tiers reste conditionné. Question de périmètre partiel envoyée au porteur ; aucune activation Claude ni substitution par clé API. D ne sera pas marqué livré sur la seule base de transports simulés ou d’un état connecté.

Choix de réalisation : surface React du chat servie par le cœur depuis l’installation, indépendante du code du projet et accessible au contenant natif et au dossier. Capacité propre, appels POST bornés et vérifiés, aucune capacité DS réutilisée. Processus fournisseur durable, connexion officielle dédiée, historique privé de cette installation, sessions natives et approbations corrélées. Les écritures projet passeront par un broker fermé et leur validation humaine ; les outils natifs du fournisseur restent sans droit d’écriture et les commandes arbitraires ne sont pas exposées. Les autorités/dérivés du DS et l’outillage restent protégés ; maintenance distincte hors atelier.

Preflight réel sans compte : binaire installé 0.167.0-alpha.3.2, schéma expérimental généré ; npm officiel annonce 0.167.0. Premier profil TOML invalide corrigé (collision clé/table) puis témoins réels : lecture autorisée réussie, lecture hors racine et secret `.env.private` refusés, écriture hors racine refusée. Ces tests ne prouvent pas encore tous les outils ni la connexion ; conserver leurs artefacts privés. La version stable privée et son intégrité seront fixées avant activation.

## Résultat D — périmètre Codex autorisé

Le porteur a choisi explicitement « Codex d’abord, Claude indisponible », puis confirmé sa connexion personnelle. [Rapport D et limites](../reviews/ui-final-01-d/README.md), [preuves](../reviews/ui-final-01-d/qualification.json), [contrat et lancement](../product/agent-chat.md). Quatrième vue Assistance, service durable du cœur commun, installation officielle privée 0.167.0, connexion gérée, messages progressifs, actions JSON validées, propositions avec accord unique, interruption, historique et reprise de session réels. Autorités DS/outillage protégés ; aucun transfert d’identifiants de fabrication.

Huit scénarios macOS avec vrai fournisseur, trois navigateur réels et une reprise après redémarrage ont réussi. Neuf cas du binaire déconnecté qualifient le profil OS ; 13 tests broker/sessions/HTTP et cinq parcours UI utilisent des transports simulés explicitement distingués. 149 unités, 21 contrats/supervision, génération/types/lint/format et trois cas d’extraction/préparation/CLI réussis. Revues séquentielles, même agent, non indépendantes ; acceptation humaine distincte. Le refus automatique d’activer le moteur de code a été résolu en le conservant désactivé et en qualifiant le protocole d’actions fermé ; aucun contournement.

**D techniquement qualifiée au périmètre partiel autorisé ; UI-FINAL-01 reste En cours.** AGENT-CHAT-01 complet, Claude, Node/npm embarqués, ZIP et distributions finales restent ouverts. macOS arm64 seulement ; anciennes recettes et fenêtre B préservées, aucun push/publication. Prochaine tranche : E, exports et autonomie, à exécuter sur mandat distinct. **Doc updated.**

## Préparation E — exports et autonomie

Mandat du 10 novembre 2026, base 45bdf24, branche codex/ui-final-01-e-delivery. Cible /application, cœur commun conservé. Procédures implement-feature, test-user-flow et prepare-release ; revues séquentielles non indépendantes. GPT-6.1 Sol · Élevée.

Exports de sources enregistrées seulement, projet et outil séparés, ZIP sans secrets connus, états privés, dépendances ou Git ; destination nouvelle extérieure, aucun écrasement. Présenter la portée avant export. Même port CLI et menu natif. Les données PostgreSQL et les brouillons ne sont pas des sources sauvegardées.

Livraisons de qualification macOS arm64 : dossier prêt à lancer avec Node/npm officiels verrouillés et dépendances privées, app avec les mêmes sources et runtime dans Resources ; état et projets mutables hors bundle. Aucun installateur global, changement du Dock, notarisation ou mise à jour automatique. Premier démarrage prépare une instance privée depuis la sélection fermée ; aucun compte copié. Qualification par déplacement et environnement sans Node/npm global, vrais services et archives relues. Les autres plateformes et la diffusion finale restent F.

## Résultat E

Exports de sources projet/socle raccordés au même cœur et au menu natif, destination exclusive, inventaire SHA256 et relecture ZIP. Deux candidats macOS arm64 avec Node 24.22.0/npm 11.19.1 embarqués : dossier à lanceur relatif et app à état privé hors Resources. Installation incomplète ou différente refusée sans remplacement ; aucune connexion de fabrication copiée. [Contrat](../product/local-deliveries.md), [qualification](../reviews/ui-final-01-e/README.md).

Dossier déplacé, trois lecteurs, runtime sans Node/npm global, vraie fenêtre WebKit et deux vrais sélecteurs d’export validés via AX ; tests d’exclusions, concurrence, intégrité, refus/reprise et régression documentés. Revues séquentielles non indépendantes ; acceptation humaine distincte. Signature ad hoc locale, aucune notarisation ni diffusion, autres plateformes/mises à jour non qualifiées. E techniquement qualifiée au périmètre local, F reste à exécuter sur mandat distinct. **Doc updated.**
