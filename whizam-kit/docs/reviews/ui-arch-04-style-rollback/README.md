# UI-ARCH-04 — Design antérieur rétabli

**15 novembre 2026 — Annulation visuelle réalisée ; qualification technique acquise, acceptation visuelle différée.** [Mandat](../../work-items/ui-arch-04-style-rollback.md), [résultats](qualification.json), [sources sélectionnées](source-hashes.json).

## Résultat

Sur décision du porteur, les recettes utilisant l’habillage officiel React Aria sont retirées. UI Lab, ses inspecteurs, Figma/imports, Pages et les chats retrouvent leurs sources visuelles antérieures. Le projet fictif et sa story retrouvent le formulaire FormFeedback présenté avant cette normalisation. Les choix techniques Tailwind/React Aria de UI-ARCH-03/04 restent en place : annuler un habillage ne supprime pas ces bibliothèques.

Le retour visuel se réfère à ec4ab75 et aux six fichiers de la démonstration sauvegardés avant les styles officiels. Le correctif natif de chargement UI Lab, son magasin web temporaire, la politique de cache/rechargement et la préparation des dérivés de l’outillage sont conservés. Le code fonctionnel canonique était déjà sans normalisation ; il n’est pas réécrit.

Les deux copies fictives sont restaurées : user-test-1qr84x (51147/51148) et run-Ag62zM (59550/59551). 42 fichiers sources restaurés, 112 ajouts de normalisation archivés hors des sources actives. Aucun bundle ou autre fenêtre remplacé, aucun reset Git, push ou lancement d’Electron.

## Compatibilité et préservation

Le premier candidat de retour intégral des sources a compilé, mais le lecteur antérieur refuse les huit reçus créés pendant les essais du thème officiel : leurs chemins ne font pas partie de son manifeste. Ce résultat interdit de rétrograder le lecteur sous cet historique.

La solution retenue retire les branchements visuels tout en gardant le lecteur, le manifeste et les anciennes sources OfficialTheme nécessaires aux reçus. Les 675 nœuds DTCG restent identiques octet pour octet, dont les 641 tokens d’origine et 34 ajouts du thème désormais sans branchement dans le formulaire ou la scène de recette. Ces données historiques peuvent encore apparaître dans les inventaires techniques ; leur présence ne réactive pas l’habillage. Aucun reçu, schéma privé ou contrôle d’identité n’est converti, supprimé ou assoupli.

Une tentative de reprise du journal copié sur une autre racine est refusée par le contrôle d’identité, comme prévu. La reprise complète est ensuite vérifiée dans les racines d’origine, après arrêt propre de leurs seuls services. Les snapshots chargent (63 styles, 198 bindings), les huit reçus sont relus et leurs SHA-256 restent identiques ; la seconde copie n’a aucun reçu. Les autorités DTCG et les fichiers natifs contrôlés restent identiques.

Sauvegardes fermées et archives : .local/ui-arch-04/style-rollback/backup et archived, dans le dépôt ignoré. Elles permettent de retrouver les sources avant cette annulation. Les données privées restent dans leurs dossiers d’origine. Pas d’installation globale, secret ou appel fournisseur.

## Vérifications réalisées

| Vérification | Résultat |
| --- | --- |
| Contrôle des sources avant action | Empreintes des dernières recettes qualifiées concordantes ; aucun changement récent ambigu |
| Candidat isolé compatible : types, build app et build Storybook | Conformes |
| Génération des trois racines concernées | Conforme ; 63 styles/198 bindings dans les projets, 53/188 dans tool |
| Types de la seconde copie active après restauration | Conformes |
| Tests ui-composition et agent-chat sur candidat compatible | 18 réussis, 0 échec |
| Build Codex avec les dérivés réparés | Conforme, index statique remplacé atomiquement ; daemon et anciens assets conservés |
| Reprise des writers dans les racines d’origine | Snapshots chargés, huit reçus inchangés, aucun journal inachevé |
| Sources après restauration | Toutes les empreintes du plan concordent ; aucune modification des autorités DTCG |
| UI Lab dans WKWebView | Chargé, icônes et réglage hexadécimal visibles, aucun brouillon ; retour depuis Codex réussi |
| Codex dans WKWebView | Ancien habillage chargé ; pas de connexion ou message fournisseur |
| Formulaire app et même story | Vide refusé avec erreur, correction et succès sans stockage ; retour à l’état initial |
| Application à blanc du correctif de formulaire | Conforme |

Captures relues : [UI Lab natif](ui-lab-native.png), [Codex natif](codex-native.png), [formulaire](project.jpg), [Storybook](storybook.jpg). Les dimensions web effectives de l’IAB étaient 522 px malgré une demande d’override ; elles ne sont pas présentées comme recette desktop Loomata. La preuve desktop est la fenêtre macOS. L’override temporaire est réinitialisé.

Les états transitoires de chargement ont disparu après actualisation puis raccordement des vues aux serveurs relancés. Ce raccordement est accepté sans brouillon en mémoire, dans le bundle existant. Un clic de validation trop tôt avant hydratation du formulaire n’avait pas de résultat ; les parcours rejoués après chargement réussissent. Le premier test de copie avait une permission privée incorrecte, corrigée sur la seule copie isolée. Les premières hypothèses de comptage ne traitaient pas les tokens racines et les types hérités explicités ; la conclusion finale repose sur le fichier d’autorité inchangé et non sur ces comptages incomplets. Une erreur de chemin relatif et une lecture incorrecte de la forme du snapshot ont été corrigées ; les lectures finales dans les racines d’origine sont réussies.

## Reproduction et limites

Pour une nouvelle copie de ces recettes, annuler les correctifs de normalisation tool/project sélectionnés dans le dossier [de normalisation](../ui-arch-04-official-ui-styles/README.md), puis appliquer le [correctif du formulaire et des scènes](legacy-fixture.patch). Vérifier les empreintes avant/après dans le présent dossier. Conserver le lecteur et les sources de compatibilité du raccordement DTCG si des reçus ont été créés avec cette version ; ne pas appliquer ce retour sur un projet arbitraire. Régénérer les dérivés dans chaque racine et recompiler le chat. Le correctif a été vérifié à blanc sur les sept sources de la première copie.

Revues design, technique/QA et sécurité exercées successivement par le même agent, non indépendantes : aspect antérieur observé, contrats de formulaire et chargement exercés, garde des journaux préservée. Aucun nouvel accès ou mécanisme de restauration générique créé. Les limites visuelles historiques de Codex sont également rétablies ; cette intervention n’est pas leur correction. Pas de qualification exhaustive des anciens états, VoiceOver ou fournisseurs.

Les services des deux recettes restent actifs. Accès courant : [UI Lab](http://127.0.0.1:59550/ui-lab?scene=button%2FDefault), [projet fictif](http://127.0.0.1:59550/), [Storybook](http://127.0.0.1:59551/?path=/story/ui-arch-04-fixture--preview). La première copie reste aussi accessible sur 51147/51148.

**Doc updated.** Prochaine action : vérifier visuellement le retour demandé. Les anciennes preuves sont conservées comme historique ; elles ne décrivent plus l’habillage actif.
