# UI-FINAL-01 C — Projets et orchestration Loomata

10 novembre 2026 — **C réalisée et techniquement qualifiée ; acceptation humaine distincte.** Code `73fc5b7`, [preuve structurée](qualification.json), [contrat utilisateur](../../product/project-lifecycle.md). Le cœur et le contenant restent dans `/application` ; aucun nouveau dépôt de l’outil, projet métier ou service distant créé.

## Résultat observable

Nouveau projet choisit une destination nouvelle dans le sélecteur macOS, copie les sources sélectionnées du kit, prépare les dépendances et dérivés, puis ouvre UI Lab, Storybook et l’aperçu du projet. Un dossier existant est refusé sans écrasement. L’accueil indique le nom et le cadrage restant ; les sources de démonstration ne sont pas présentées comme une application métier réalisée.

Ouvrir un projet vérifie sa compatibilité avant de remplacer l’espace courant. Annuler conserve le document et son brouillon. Confirmer arrête les seuls services du projet précédent, puis démarre ceux du projet sélectionné. Préparer / Réessayer reprend un projet créé, sans recopie des sources ni purge ; les dépendances sont préparées dans une tentative privée. La prochaine ouverture du même bundle reprend le dernier dossier sélectionné. Les opérations de la CLI du dossier et de l’app native sont les mêmes.

## Preuves exécutées

[22 scénarios natifs](native-e2e.json), dont les 12 de B rejoués et 10 sur C. Le pilote utilise AppKit/WKWebView réels, le vrai NSSavePanel et un outil Accessibilité qui presse son vrai bouton. Les champs initiaux sont préparés dans le seul build instrumenté ; la réponse et l’URL viennent du sélecteur, sans faux résultat `.OK`. Annulation, création, préparation, trois vues, sauvegarde/relecture, propagation dans Storybook, collision, dossier incompatible, conservation du brouillon, changement confirmé et arrêt propriétaire, réouverture et échec/reprise de préparation ont réussi.

Une [relance du même bundle](resume-e2e.json), dans un nouveau processus avec son `launch.json` inchangé, retrouve le dernier projet et la valeur sauvegardée. Les gardes HTTP suivent ensuite ce projet actif : pas de bootstrap d’écriture dans les lecteurs, POST refusé en 403 côté aperçu et 404 côté Storybook. Le rapport du runner confirme le nettoyage des seuls processus de campagne, sans erreur de nettoyage.

21 tests du cœur/supervision et 149 tests unitaires réussis ; format, lint et typecheck conformes. Les contrôles web/code ont été exécutés sur la copie QA inactive ; les écritures natives n’ont visé que les fixtures. Aucun token de fabrication, ancienne recette, reçu ou base existante modifié. Les 34 tests web historiques de B ne sont pas présentés comme une nouvelle campagne C.

La liste finale de sources et sa documentation C ont aussi été extraites vers un nouveau dossier sans Git ni état privé, puis préparées par le même cœur CLI : réussite et validation de 21 skills / 4 rôles. Une première validation tentée avant préparation des dépendances a échoué en résolvant un YAML parent incompatible ; ce contrôle a été rejoué avec les dépendances du projet et a réussi. Aucun paquet global modifié.

Captures des vues réelles du projet jetable : [aperçu neutre](project-preview.png), [Storybook après sauvegarde](project-storybook.png), [UI Lab après reprise](project-retry.png). Ce sont des captures de WKWebView, pas des maquettes ni des preuves de recette humaine. Les états et confirmations du contenant sont couverts par les actions natives.

## Échecs conservés et corrections

Les premiers essais de pilote restent privés, sans suppression ni conversion en succès : appel `NSSavePanel ok:` non pris en charge par AppKit ; préselection du nom écrasée par la valeur par défaut du formulaire ; contrôle HTTP encore dirigé vers les services du projet quitté. Le pilote utilise maintenant le vrai bouton AX, prépare le champ après le défaut et lit les URLs du superviseur sélectionné. Le dossier jetable « Mon projet » du deuxième essai a été conservé et ses seuls services arrêtés.

Une tentative a aussi expiré à l’attente d’hydratation de UI Lab, avec services prêts et sans erreur JavaScript signalée. Elle reste un échec ; des diagnostics de document/capture ont été ajoutés au pilote. La campagne complète suivante et la relance du même bundle ont réussi sans modifier l’application pour contourner cette attente. Cela ne garantit pas toute situation de chargement WebKit sur un autre poste.

Le SDK 27 par défaut reste incompatible avec le compilateur installé ; le builder existant a sélectionné le SDK 26.5 installé. Aucun SDK, permission de confidentialité, préférence système ou outil global installé/modifié. L’accès Accessibilité déjà disponible a servi au seul pilote de test.

## Revues et limites

Revues design, technique et sécurité ciblée **séquentielles, même agent, non indépendantes** : transitions et confirmations, copie et chemins jusqu’aux fichiers, état privé, appels de processus sans shell, reprise, identité des services et absence de nouvelle commande web. Les refus et les cas positifs sont couverts. Aucun finding bloquant restant dans le parcours C qualifié ; pas de certification ou audit externe déduit.

La source sélectionnée est une liste versionnée de fichiers, sans lecture du dépôt Git à l’exécution. Les états privés/connexions ne sont pas transmis ; les liens des skills restent internes. Le dossier dérivé reçoit son propre writer et ses propres services. Préparer un dossier existant inconnu n’est jamais assimilé à un projet neuf géré par Loomata.

L’accueil neuf et les outils ne demandent pas de base. Le superviseur conserve son isolation sans DATABASE_URL ; il ne lance ni Docker, ni migration, ni seed. Les routes métier historiques demandant une base nécessitent leur préparation et le mandat de leur futur projet. L’orchestration qualifiée C porte sur les outils du dossier sélectionné ; aucune base métier universelle ou application déjà conçue n’est revendiquée. La voie de secours `npm ci` sans copie de dépendances n’a pas été exécutée ; le chemin avec lockfile identique et copie a été qualifié sur ce Mac.

L’ancienne fenêtre normale B a été laissée ouverte pour préserver tout travail en mémoire. Le lanceur a été contrôlé sur cette situation : refus explicite de remplacement avant reconstruction, sans changement de bundle ou de contexte. Après enregistrement et fermeture de cette ancienne version, la relance source construit/ouvre la nouvelle version. La vérification native C porte sur le build instrumenté et son vrai sélecteur ; aucune nouvelle qualification Finder/Dock de distribution finale n’en est déduite.

Node/npm restent externes ; IA, ZIP, packaging final et validation humaine restent D–F. Clavier physique et VoiceOver exhaustifs non exécutés. Aucun push ni publication. Reprise : D, travail assisté dans l’outil selon ses conditions fournisseur. **Doc updated.**
