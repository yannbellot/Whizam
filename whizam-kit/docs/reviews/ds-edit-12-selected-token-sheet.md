# DS-EDIT-12 — Bilan et revues

30 octobre 2026 — application, source `bd15932`, base `55cf462`. **En revue : qualification technique acquise, acceptation humaine différée.** [Fiche](../work-items/ds-edit-12-selected-token-sheet.md).

Styles présente uniquement la fiche sélectionnée, sur toute la largeur, avec nom et identifiant. Sans sélection, invitation vers Tokens. Liste, recherche et retour Apparence retirés ; commandes Nouveau style/Reprendre la création conservées dans la fiche. Tokens signale la ligne sélectionnée par bordure, graisse, mention Sélectionné et état aria-pressed. Réutiliser un style compatible remplace le libellé précédent, avec critères type/rôle/état inchangés.

La sélection du manager est publiée sur changement d’identité/génération et redemandée au montage du catalogue. Le listener est retiré au démontage. Le message accepte version/génération/identité connue ou null ; les messages périmés, inconnus ou supplémentaires sont ignorés. Une identité créée uniquement en brouillon ne devient pas une ligne enregistrée. Aucune attribution ni opération d’écriture ajoutée. Manifeste fermé et documentation synchronisés, valeurs YAML et modèles de suivi de l’app inchangés.

## Contrôles et revues

Copie privée `.local/ds-edit-12/check`, runtime Node 24.22.0/npm 11.8.0 existant. Journaux ignorés dans `.local/ds-edit-12/`.

| Commande | Résultat |
| --- | --- |
| `npm test` | 94 tests / 14 fichiers conformes : fiche, libellé, sélection unique, gardes du canal, resynchronisation au montage et nettoyage au démontage. |
| `npm run test:design-system` | 47 tests conformes, contrats et inventaire complets. |
| `npm run test:design-system:docs` | 5 tests conformes, dont sauvegarde/relecture en copie isolée et manifeste fermé. |
| `npm run typecheck`, `npm run lint`, `npm run format:check` | Conformes sur la version corrigée. |
| `npm run docs:design-system:check` | Conforme. |
| `npm run build`, `npm run build-storybook` | Conformes ; avertissement habituel de taille de chunks Storybook. |

146 tests distincts réussis. Premiers échecs conservés dans les journaux : copie de tests privée incomplète pour les adaptations, puis erreur de syntaxe lors de l’extraction du listener ; corrigés et contrôles rejoués. **Aucun E2E ni runner navigateur exécuté.** Source du parcours concerné adaptée sans exécution. Pas de nouvelle campagne serveur complète : opérations, schémas et accès inchangés.

Trois revues successives du même agent, **non indépendantes**, sur cette source :

- Technique satisfaisante : chemins sélection/catalogue/fiche examinés, contrats fermés, dépendance ajoutée au manifeste, sauvegarde existante conservée. Correction Builder de la grille à deux colonnes devenue inutile, puis types et build Storybook retestés.
- Design avec réserve humaine : fiche sans double liste, nom/identifiant explicites, repère visuel accompagné de texte et état accessible. Hypothèse réversible : commandes de création conservées dans la fiche. Rendu statique et chargement de livraison seulement ; navigation réelle, clavier/mobile et acceptation visuelle non qualifiés.
- Sécurité satisfaisante sur la surface : React échappe les données, message de sélection strict/génération connue ; la demande de resynchronisation publie seulement une identité, sans capacité ni donnée privée. Aucun nouveau chemin d’écriture ou service distant. Pas de certification globale.

Pas de revue d’instructions/distribution : procédures d’agents inchangées.

## Livraison

Brouillon détecté puis abandon explicitement autorisé pour ce chantier (« Abandonner ce brouillon »). Tout abandonner exécuté ; Génération chargée constatée avant bascule. Huit sources enregistrées copiées et comparées par empreintes avant/après génération et bascule ; 42 styles de l’instance conservés. Ancienne racine DS-EDIT-11 et historiques/reçus préservés, zéro reçu dans l’ancienne racine immédiate ; aucun journal/capacité transporté. Propriétaires des seuls serveurs locaux remplacés vérifiés par commande/répertoire, sans arrêt forcé.

Nouvelle racine `.local/ds-edit-12/designer`, Storybook 54086 et UI Lab 54085 répondent HTTP 200. Code de la copie comparé à la source qualifiée. Safari ouvert sur Tokens > Styles, tableau de 42 tokens et fiche vide invitant à sélectionner observés. Constat de chargement, sans clic de sélection ou d’édition et sans sauvegarde de l’agent. [Ouvrir la livraison](http://127.0.0.1:54086/?path=/story/design-system-foundations--tokens&addonPanel=adl/design-editor/styles).

Diff, liens et absence de signatures de secrets contrôlés ; 50 entrées non suivies préexistantes conservées. **Doc updated.** Aucune publication, push, Actions ou dépendance ajoutée. Reprise : recette humaine du périmètre livré ; G/J5 inchangés, aucun chantier supplémentaire.
