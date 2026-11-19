# LOCAL-APP-01 — Ouvrir UI Lab depuis le Dock

**6 novembre 2026 — En revue : A–D réalisées, qualification technique du lanceur acquise sur les contrôles exécutés ; acceptation humaine différée.** [Bilan, preuves et réserves](../reviews/local-app-01.md), [guide](../operations/local-app.md), [décision 029](../decisions/029-local-dock-launcher.md). Le cadrage initial ci-dessous reste historique ; le mandat ultérieur de réalisation et l’exception Applications/Dock explicitement autorisée l’ont prolongé. Les exclusions GitHub/hébergement restent inchangées.

## Mandat et propriété

Environnement : application. Préparer l’ouverture de UI Lab comme une app locale macOS, à une adresse stable, avec démarrage automatique de UI Lab et Storybook. Le présent mandat est documentaire : aucune installation, implémentation, création de raccourci, modification du Dock, exécution de tests ou démarrage de services.

La fiche accompagne le kit ; le statut de fabrication appartient à la roadmap du lab. Les modèles `ROADMAP.md` et `docs/project-state.md` livrés dans l’app restent non initialisés. Dépendances : [atelier autonome](../decisions/025-independent-design-editor.md), [autorités DTCG/recettes](../decisions/027-dtcg-authority-and-css-recipes.md), [persistance](../design-system/editor-persistence.md), [architecture](../architecture.md), [opérations](../operations.md) et [passation](../handoff.md).

## Résultat attendu

Après une préparation initiale explicite du projet et du raccourci, cliquer sur une icône du Dock démarre les deux services locaux si nécessaire, attend leur disponibilité et ouvre ou réactive UI Lab dans une fenêtre dédiée, sans barre d’adresse ni onglets Safari habituels. Aucun terminal ni assistant IA ne doit être nécessaire à chaque ouverture. Storybook est accessible par une action identifiée ; il démarre sans ouvrir automatiquement une seconde fenêtre.

Une même instance retrouve les mêmes adresses après fermeture de la fenêtre ou redémarrage du Mac. Un port occupé par un tiers produit un diagnostic, jamais un basculement silencieux ou l’ouverture d’une autre instance. Une erreur de démarrage reste visible.

## État inspecté et limites

Base : `c166528dab2404dd2e845d9fdfd027ce4e217680`, branche initiale `codex/ds-arch-02-decision-system`. Branche de préparation : `codex/local-app-01-dock-launch-plan`. Aucun changement suivi préexistant. Des doublons non suivis suffixés ` 2`, `application/.storybook/editor/` et `frontend/` existent : hors périmètre, préservés et exclus de toute sélection Git. Le chantier DS-ARCH-02 reste à son point de reprise ; cette préparation ne reprend pas sa réalisation.

Observations dans le code :

- `scripts/ui-lab-local.mjs` lance le writer sur `127.0.0.1:5173` par défaut, accepte `--port`, impose un port strict et renouvelle le processus uniquement après arrêt de son prédécesseur. Il ne prépare pas les dérivés : cette absence protège la récupération d’une transaction interrompue.
- `scripts/design-editor/local.mjs` et `http.mjs` exigent une origine loopback exacte, une identité de racine et une capacité renouvelable. Ces protections restent applicables ; pas de proxy ou de nom de domaine ajouté pour rendre l’adresse stable.
- `scripts/with-runtime.sh` sélectionne un runtime compatible déjà installé. Le lancement depuis Finder ne doit pas dépendre du PATH d’un terminal interactif ni installer Node à la volée.
- `scripts/storybook-local.mjs` garde ses préférences privées dans le projet et retire les capacités d’écriture. `package.json` prévoit le port 6006 ; `prestorybook` déclenche une génération. Il faut éviter ce hook lors d’une reprise ou pendant un writer actif.
- Le lecteur Storybook partage la barrière de publication locale et recharge après une génération cohérente. Aucun second writer n’est nécessaire.
- Le bootstrap d’édition reste réservé au développement local ; le runtime compilé est en consultation/brouillon. Le lanceur doit conserver le mode d’édition effectif, pas simplement ouvrir un build sans sauvegarde.

Apple documente les apps web Safari à partir de macOS Sonoma 14, leur ajout au Dock et le masquage des commandes de navigation : [documentation Apple](https://support.apple.com/fr-fr/104996), consultée le 6 novembre 2026. Cela ne prouve pas le fonctionnement avec notre adresse loopback ni le lancement des services. Aucun essai Safari/Finder/Dock réalisé pour ce chantier.

## Périmètre et exclusions

Inclus dans une future réalisation : lanceur local, supervision des deux processus, adresses persistantes, ouverture de la fenêtre, diagnostics, arrêt explicite, préparation/réparation du raccourci, documentation d’usage et contrôles isolés. Réutiliser Node, les lanceurs et les outils macOS disponibles ; aucun nouveau framework par défaut.

Exclus : intégration GitHub, commit/push automatique, hébergement, comptes/viewers, coédition, synchronisation de brouillons distants, application native réécrite, Electron/Tauri, mise à jour automatique, signature/notarisation de distribution publique, service au démarrage de session, modification globale du PATH, installation automatique de dépendances et lancement de PostgreSQL/Docker ou de données métier. L’édition déterministe doit rester indépendante d’un compte IA.

La future sauvegarde privée sur GitHub évoquée dans la discussion est un chantier distinct ; ce document n’autorise aucune opération distante et ne modifie aucune politique de publication.

## Solution proposée et hypothèses réversibles

### Adresse et instance

Conserver deux origines loopback directes, avec ports configurés une fois puis persistés dans un emplacement privé ignoré du projet. Valeurs candidates : UI Lab `http://127.0.0.1:5173/ui-lab` et Storybook `http://127.0.0.1:6006/`. Elles ne sont ni réservées ni garanties disponibles à ce stade. Pas de port choisi automatiquement à chaque ouverture ; un changement explicite de configuration actualise le raccourci et les liens.

Une icône désigne une seule instance et sa racine, sans sélecteur multi-projet initial. Ne pas adopter automatiquement une recette historique ou ses données. Un déplacement du dossier demande une réparation explicite du raccourci ; une autre copie n’hérite pas silencieusement de son identité. Configuration, chemins absolus et métadonnées de processus restent privés, jamais dans les sources distribuées.

### Clic dans le Dock

Le point d’entrée doit exécuter le lanceur, et pas seulement ouvrir l’URL. Une app web Safari ajoutée au Dock seule ne satisfait pas le démarrage à froid. Proposition : un petit bundle de lancement macOS généré localement, qui démarre les services puis ouvre/réactive l’app web Safari explicitement associée à cette instance.

La faisabilité de cette chaîne constitue la première porte de qualification : ouverture loopback, fenêtre sans chrome navigateur, réactivation, comportement lors d’un second clic et éventuelle seconde icône. Une seule entrée Dock de lancement est souhaitée ; ne pas promettre l’unicité de l’icône active sans essai. L’ajout Safari manuel peut être une préparation initiale documentée, jamais une étape à répéter à chaque utilisation.

Ne pas automatiser des menus Safari ou modifier ses préférences globales par défaut. Si la chaîne ne peut être fiable avec les outils disponibles, consigner un prototype et proposer un arbitrage ; une fenêtre navigateur classique ne satisfait pas le critère, et aucun autre conteneur natif n’est introduit silencieusement.

### Cycle de vie et conservation

1. Lire la configuration et vérifier la racine, le runtime et les dépendances déjà préparés ; afficher une erreur utile si un prérequis manque.
2. Sérialiser les invocations du lanceur. Reconnaître une instance par identité/racine/version et état des processus, pas par un simple HTTP 200 ou un PID réutilisable. Refuser un port étranger sans arrêter son propriétaire.
3. Démarrer ou retrouver le writer compatible ; le laisser effectuer sa récupération avant toute génération. Première préparation des dérivés uniquement dans une instance inactive sans transaction à récupérer. Refuser un journal incompatible sans purge, migration implicite ni mélange de versions.
4. Démarrer Storybook documentaire après disponibilité cohérente du writer, par une entrée évitant le hook de génération automatique. Préserver la barrière de lecture et garantir un port strict.
5. Attendre les deux services avec délais bornés et diagnostics distincts. Ouvrir UI Lab seulement quand l’édition et la documentation sont réellement disponibles ; en cas d’échec partiel, nettoyer uniquement les processus créés par cette tentative ou signaler explicitement leur maintien.
6. Réactiver la fenêtre lors des clics suivants, sans doublon de services. Fermer la fenêtre laisse les services disponibles jusqu’à un arrêt explicite ; cela ne rend pas le brouillon en mémoire durable. Conserver le garde de fermeture existant et rendre cette limite compréhensible.
7. Proposer un arrêt explicite des seuls processus possédés, avec fin de transaction et libération des lecteurs ; pas d’arrêt brutal automatique ni de redémarrage infini sur panne. Préserver les garanties de DS-EDIT-69.

L’enregistrement reste celui du writer existant. Ni une fermeture de fenêtre ni un clic Dock ne doit enregistrer un brouillon implicitement. Une panne ou un redémarrage du Mac peut perdre le brouillon non enregistré ; les sources enregistrées et la récupération transactionnelle sont les garanties à vérifier.

## Tranches de réalisation proposées

| Tranche | Travail | Porte de sortie |
| --- | --- | --- |
| A — Faisabilité macOS | Prototype isolé, choix du point d’entrée Dock et de l’ouverture Safari ; runtime hors shell interactif, configuration et permissions nécessaires | Clic à froid démontré, limites d’icônes connues ; décision applicative courte avant intégration |
| B — Supervision locale | Configuration stable, démarrage/réutilisation/arrêt et diagnostics ; journal privé ; respect récupération/barrière | Pas de doublon, de génération prématurée, de port aléatoire ni d’arrêt d’un tiers |
| C — Parcours d’ouverture | Génération locale du lanceur, association à l’instance, accès Storybook, préparation et réparation documentées | Ouverture/réactivation sans terminal, déplacement traité explicitement |
| D — Qualification et passation | Régressions, revues, recette humaine Dock et documentation autonome | Preuves de conservation, fiabilité et reprise ; qualification distincte de l’acceptation humaine |

Toutes les tranches sont proposées, non exécutées et nécessitent un mandat de réalisation. DS-ARCH-02 n’est pas un prérequis fonctionnel de ce lanceur, mais son état doit être réinspecté avant réalisation : ne pas modifier en parallèle ses contrats ou intégrer silencieusement sa branche. Les anciennes recettes actives et leurs brouillons ne sont pas des fixtures de test.

## Fichiers concernés lors de la réalisation

Chemins existants à examiner : `scripts/ui-lab-local.mjs`, `scripts/storybook-local.mjs`, `scripts/with-runtime.sh`, `scripts/editor-workshop.ts`, `scripts/editor-application-preview.ts`, `scripts/design-editor/`, `package.json`, `.gitignore`, `README.md`, `docs/operations.md` et `docs/handoff.md`. Toucher les adaptateurs/UI et le manifeste fermé uniquement si les dépendances effectives l’exigent ; ne pas modifier les tokens ou dérivés à la main.

Nouveaux fichiers candidats, à confirmer en A : `scripts/local-app.mjs` pour l’orchestration, `scripts/prepare-macos-launcher.mjs` pour l’artefact Dock et `tests/local-app.test.mjs` pour les scénarios de cycle de vie. Artefacts générés proposés sous `.runtime.local/local-app/`, hors Git. Aucun dossier vide à créer. Le choix n’impose aucune bibliothèque ni installation globale.

Sur le Mac, une installation dans Applications, un ajout au Dock ou des permissions d’automatisation sont des opérations distinctes à annoncer et autoriser explicitement si nécessaires. Préparer et vérifier d’abord les artefacts dans le dépôt ; cette fiche ne donne pas cette autorisation et ne fait pas de réglage global une dépendance cachée.

## Critères et preuves à produire

- Après redémarrage, clic Dock avec les deux services arrêtés : adresses identiques, UI Lab modifiable, Storybook prêt, aucune commande manuelle, aucun accès externe requis après préparation.
- Deux clics rapprochés, relance avec services déjà actifs, puis fermeture/réouverture : un seul writer et un seul Storybook pour la racine ; fenêtre réactivée sans réinitialisation volontaire du brouillon.
- Port étranger, autre racine, runtime absent, échec Storybook et journal incompatible : erreur compréhensible, aucun processus tiers touché, aucune modification canonique indue, aucune ouverture d’une mauvaise instance.
- Enregistrement synthétique dans UI Lab puis lecture Storybook : valeurs et composants actualisés après publication complète, sans seconde génération concurrente ni capacité d’écriture côté Storybook.
- Arrêt pendant une sauvegarde, interruption injectée puis relance : statut/réessai et récupération avec l’outillage compatible ; aucun journal purgé ni valeur perdue après succès confirmé.
- Quitter/réouvrir et redémarrer le Mac : valeurs enregistrées conservées ; limite du brouillon en mémoire explicitement observée et documentée.
- Déplacement/renommage d’une copie synthétique, chemin avec espaces et environnement Finder sans PATH de terminal : réparation contrôlée, bonne racine et runtime compatible.
- Bundle, état privé, journaux et suppression du raccourci examinés : aucun secret dans les arguments/URL/logs publics, aucune capacité transmise à Storybook ; retirer le lanceur ne supprime ni sources ni données.

Contrôles futurs, sur copies fictives dédiées et séquentielles par racine : scénarios du lanceur ; `npm run typecheck`, `npm run lint`, `npm run test:boundaries` ; suites `test:design-editor:server`, `test:design-editor:persistence`, `test:design-editor:live` et `test:design-editor:recovery` selon les chemins touchés ; builds app/Storybook sur copie inactive. Suites DS/unitaires si moteur, génération ou manifeste affectés. Consigner les commandes exactes, versions, durées, échecs/retests et captures. Aucun de ces contrôles n’a été exécuté pendant la préparation.

Revues prévues : Design Reviewer pour lancement/attente/erreurs/arrêt et fenêtre macOS ; Technical Reviewer / QA pour processus, récupération et packaging ; Security Reviewer pour loopback, capacités et lancement de commandes. Pas de scan global implicite. Mode par défaut : séquentiel, même agent, non indépendant. Recette réelle Safari/Dock et reprise par un tiers restent distinctes des tests Chromium. Qualification technique éventuelle : En revue, acceptation humaine différée ; aucune clôture J4/J5.

## Configuration Codex et bilan de préparation

Procédure sélectionnée explicitement dans `skills/catalog.json` : `plan-feature`, rôle Builder, fichiers versionnés à la base `c166528` ; aucune procédure de fabrication lab chargée et aucune bibliothèque d’instructions modifiée. Préparation : GPT-6.1 Sol · Moyenne, inspection approfondie mais documentaire. Réalisation recommandée : GPT-6.1 Sol · Élevée, pour les contrats de runtime/processus, la propriété du writer et les obligations de preuve de sécurité. Pas de difficulté observée justifiant Très élevée pour ce chantier ; la recommandation distincte de DS-ARCH-02 ne s’y transfère pas. Aucun réglage client prétendu vérifié ou modifié.

Cinq dimensions : résultat borné au lancement local ; chemins identifiés et kit autonome ; frontières loopback et processus à préserver ; contrats de récupération/publication existants à réutiliser ; inconnue principale limitée à la chaîne Dock/Safari, à trancher par prototype A avant intégration.

Résultat : fiche et suivi préparés, sans preuve de fonctionnement revendiquée. Relecture documentaire dans le même fil, non indépendante ; pas de procédure de fabrication ni de distribution modifiée, donc pas de revue Instruction/Distribution dédiée. Contrôles de préparation : inspection Git/code/docs, vérification des liens locaux et du diff uniquement. Les tests, builds, serveurs, modifications de poste et essais Dock sont non exécutés. Doc updated. Risque résiduel : faisabilité exacte du lanceur Safari et durée de préparation initiale à qualifier. Publication : aucune. Reprise : mandat de réalisation LOCAL-APP-01, commencer par A et réinspecter la base et les travaux préexistants.

## Réalisation du 6 novembre — remplace le statut de préparation

Mandat A–D exécuté depuis `bc885ba`, branche `codex/local-app-01-dock-launch`. Exception Applications/Dock explicitement autorisée par le porteur. Superviseur, lanceur et campagne implémentés ; neuf tests de refus/cycle de vie et six scénarios avec vrais services réussis, types/lint/frontières et deux builds conformes. App web Safari 27.0 sans navigation sur macOS 26.6, raccourci Dock installé et clic humain suivi d’un atelier complet observé. Les preuves et revues séquentielles non indépendantes sont dans le [bilan](../reviews/local-app-01.md).

Choix délégués : outils Apple existants, identité par instance, ports persistants, socket privé, aucun hook de génération au lancement et arrêt explicite. Pas de nouvelle dépendance, source DS ou API distante. Configuration recommandée de réalisation : GPT-6.1 Sol · Élevée ; aucune hausse supplémentaire justifiée ou réglage client modifié.

En revue, acceptation humaine différée. Réserves : premier chargement prolongé non expliqué, deux icônes, brouillon non durable, diagnostic manuel si superviseur interrompu ; redémarrage complet du Mac et reprise tierce non exécutés. Recette neuve dans le suivi privé, anciennes valeurs/recettes/comptes et DS-ARCH-02 préservés. Doc updated ; aucun push ni service distant. Prochaine action : recette humaine locale avec ces limites.
