# DS-EDIT-64 D — Édition persistante autonome

4 novembre 2026, base `becc992`, branche `codex/ds-edit-64-d`. **En revue — qualification technique acquise, acceptation humaine différée.** [Fiche](../work-items/ds-edit-64-ui-lab-migration.md), [décision 025](../decisions/025-independent-design-editor.md#réalisation-d). La version finale est le commit local portant ce bilan. E/F restent non engagées.

## Résultat

Le lancement explicite dev:editor active le service commun dans le serveur Vite applicatif, sans processus Storybook. Origine/port exacts sur loopback, capacité éphémère et identité de racine ; bootstrap SSR limité au document atelier, sans cache. Le transport ne consulte pas le parent, renouvelle sa capacité seulement pour la même racine et conserve l’identifiant d’une sauvegarde au résultat inconnu.

Le writer précède le participant de lecture : aucune API ne réserve un lecteur de sa propre transaction. Import natif du service hors du graphe de configuration Vite, fermeture propre et récupération du store existant. Publication complète avant notification ; brouillon et sélection verrouillés pendant sauvegarde/résultat inconnu. Sauvegarde commune, relecture durable, conflit explicite, vérification du statut et réessai identique.

Connexion Codex uniquement sur clic, popup isolée/no-referrer et adresse contrôlée ; interprétation déclenchée séparément, clarification éventuelle puis application explicite au brouillon et Enregistrer. Les réglages déterministes restent utilisables sans compte. Aucun compte réel connecté ni inférence fournisseur effectuée pendant ce chantier.

Storybook démarre sans writer par défaut. Son mode historique est un opt-in de compatibilité sur copie isolée, toujours sous verrou unique. Pas de retrait définitif de son addon (F) ni de nouvelle campagne complète de distribution (E). Le runtime compilé n’active ni writer ni bootstrap, même avec des indicateurs d’édition fictifs ; le helper serveur d’édition est exclu de la copie Docker runtime. Manifeste v15, modèles/protocole et valeurs produit inchangés ; neuf autorités produit identiques à la base, seuls les sélecteurs de consommateurs d’habillage sont étendus aux textarea.

**Démarrage et reprise :** préparation des dérivés dans une instance inactive avant le premier lancement, puis lancement seul. Le lanceur ne régénère jamais avant une récupération ou une seconde tentative de possession. Les anciennes racines/reçus et connexions restent attachés à leur version ; aucune purge ou conversion. Le clone et les instances de recette existants n’ont pas été lancés, régénérés ou actualisés.

## Preuves exécutées

Node 24.22.0 et Chromium déjà présents. Copies isolées sous `.local/ds-edit-64-d/`, sans secrets, comptes ou journaux du clone. Dépendances copiées localement pour les essais Vite, sans installation ni préférence globale. Les journaux restent ignorés ; preuves sélectionnées ci-dessous.

| Contrôle | Résultat / journal |
| --- | --- |
| Types, lint, documentation dérivée | Conformes ; `last-check.log`, `final-validation.log`. |
| Unitaires dont transport propre au document, refus d’autre racine et actions fermées | 152 réussis ; `last-check.log`. |
| Autorités/consommateurs et cas négatifs | 82 tests réussis ; `final-validation.log`. |
| API réelle, store, concurrence, idempotence, coupures et récupération | 85 réussis (77 store, huit HTTP), `server.log`. |
| Assistance serveur simulée et refus de plans malveillants | 13 réussis, `server.log`. |
| UI Lab autonome persistant desktop/mobile | 14 parcours réussis : bootstrap exclusif et gardes réelles, sauvegarde locale/partagée et rechargement, réponse perdue/statut, conflit externe, intention simulée validée puis enregistrée, popup bloquée sans connexion et refus d’un deuxième processus propriétaire ; `launch-qualified.log`. Préparation initiale séparée du lancement. |
| Runtime compilé desktop/mobile | Huit parcours réussis : brouillon, navigation, état, conflit simulé et absence de bootstrap/API, avec des indicateurs d’édition fictifs dans l’environnement ; `compiled.log`. |
| Arrêt brutal du véritable serveur autonome | SIGKILL injecté après un remplacement dans le seul bootstrap de la copie dédiée ; redémarrage avec la même version/racine, renouvellement de capacité dans l’ancien document, reprise par statut et un seul reçu durable ; `recovery-retest.log`, [résultat](ds-edit-64-d/recovery.json). |
| Builds application/Storybook et frontière serveur/client | Conformes ; `final-validation.log`. Recherche dans le build sans writer/connecteur serveur ; branche de bootstrap éliminée et aucune capacité injectée dans le runtime testé. Inspection du Dockerfile : helper d’édition exclu ; pas de nouveau build Docker exécuté. |

Le contrôle de reprise dédié utilise une modification de faute dans la copie, pas un mécanisme activable depuis l’API livrée. La campagne Node couvre les autres interruptions et récupérations ; panne physique, autres systèmes et fournisseurs réels restent hors couverture. La requalification complète d’extraction et de passation reste E.

## Diagnostics et corrections

- Le lien de dépendances partagé de la copie faisait refuser l’entrée client React Router par Vite : dépendances clonées localement, sans élargir la liste de fichiers autorisés.
- Des chunks de cache copiés ont produit des 504 au premier chargement : qualification sur cache local neuf et préoptimisation explicite des dépendances client déjà utilisées. Aucune protection retirée.
- Une dépendance du service importée dans la configuration Vite provoquait son redémarrage lors des écritures : import natif différé, cycle de fermeture corrigé ; sauvegardes et reprise réelles rejouées.
- Le scénario d’intention mobile utilisait le même libellé/synonyme que desktop et était justement refusé comme doublon : données fictives rendues distinctes, sans assouplir le moteur. Message de doublon rendu compréhensible dans l’atelier.
- Le premier essai de reprise sélectionnait le cache Chromium après l’import de Playwright : ordre corrigé, sans installation ; reprise réussie.
- Le lancement préparatoire a été séparé de la génération : régénérer avant le store aurait empêché la reprise d’un marqueur actif. Le lancement documenté est maintenant identique au chemin de reprise testé ; aucun dérivé n’est modifié avant la prise de possession.

Les journaux d’échec restent conservés dans les copies ; ils ne sont pas présentés comme des contrôles réussis.

## Revues

Procédures applicatives implement-feature/design-interactions/test-user-flow puis review-design, technical-review et security-review. **Séquentiel, même agent, non indépendant.**

- Design : sauvegarde explicite, portée conservée, progression/résultat inconnu visibles, commandes de statut/réessai, réglages verrouillés, assistance déclenchée et appliquée explicitement. Captures desktop/mobile examinées après sauvegarde réelle sur données fictives ; aucune recette humaine revendiquée.
- Technique : moteur/transactions réutilisés, service hors graphe de rechargement, API avant réservations de lecture, identités de corrélation/accusés d’aperçu et relecture durable conservées. Seconde possession refusée réellement, perte de réponse et SIGKILL/reprise éprouvés. Les clients compilés gardent uniquement la consultation/brouillon.
- Sécurité : contrôles Host/Origin/capacité/JSON et fichiers privés conservés ; document propriétaire seul, aucune capacité dans les scènes/pages ordinaires ; autre racine refusée au renouvellement sans réémission. Aucun endpoint de test de panne ajouté, aucune capacité ou connexion copiée. Same-origin reste une isolation de rendu, sans promesse contre du code hostile. Pas d’inférence réelle ni de certification de sécurité.

Aucun rôle/skill modifié : pas de nouvelle Instruction Review. Modèles applicatifs non initialisés, J4/J5 et acceptations humaines conservés. **Doc updated.** Aucun push, déploiement ou actualisation de recette. Prochaine action : E sur mandat distinct, qualification globale et passation ; F reste séparée.

Captures : [desktop](ds-edit-64-d/desktop.png), [mobile](ds-edit-64-d/mobile.png). [Résultats sélectionnés](ds-edit-64-d/qualification.json).
