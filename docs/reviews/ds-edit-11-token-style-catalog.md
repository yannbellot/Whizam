# DS-EDIT-11 — Catalogue Tokens et navigation Styles

30 octobre 2026 — application, source `dfc54b9972c79fafe2bd426649856059f02bd75d`, base `f2cd188`. **En revue : qualification technique acquise, livraison locale effectuée, acceptation humaine différée.** [Fiche](../work-items/ds-edit-11-token-style-catalog.md), [décision 014](../decisions/014-token-catalog-style-entry.md). Même agent, rôles successifs, non indépendant ; aucun sous-agent.

## Résultat et périmètre

Tokens affiche les 41 styles canoniques des sources livrées, y compris sans usage, avec valeurs résolues, réglages liés et exceptions conservées. La copie locale actuelle contient 42 styles : son style supplémentaire enregistré est conservé. Le clic transmet uniquement une sélection validée version/génération/identité connue, depuis Foundations ; aucun changement d’attribution. Styles est filtré par le mécanisme natif Storybook et sa garde de rendu le limite à Tokens. Les raccourcis Voir ce style/Modifier le style partagé naviguent vers Tokens et sélectionnent sa fiche. Le changement vers une story de composant recale le panneau sur Apparence. Création contextuelle et exception restent dans Apparence ; le formulaire partagé reste dans Styles. Brouillon et opérations de persistance communs conservés.

Les pastilles de PrimitiveCatalog lisaient une variable CSS dynamique non déclarée : après régénération, cela rendait l’inventaire partiel et bloquait l’édition partagée. Première campagne : cinq tests en échec pour cette raison, non ignorés. Correction limitée : les pastilles lisent la valeur brute de la primitive, comme leur texte. La génération ne déclare plus cet usage fictif ; un test affirme l’inventaire complet. Aucune protection d’inventaire affaiblie.

Les primitives restent normalisées, réutilisées par type/valeur exacte ou allouées automatiquement par le moteur existant. Aucun YAML de valeur, schéma, opération serveur, nommage ou droit d’écriture modifié. Catalogue basé sur la génération enregistrée ; les valeurs du brouillon sont dans la fiche. Manifeste fermé et sources de parcours directement affectées synchronisés.

## Preuves techniques

Copie isolée `.local/ds-edit-11/check`, runtime existant Node 24.22.0/npm 11.8.0. Journaux ignorés `.local/ds-edit-11/`.

| Contrôle | Résultat |
| --- | --- |
| `npm test` | 92 tests / 14 fichiers conformes ; campagne finale après corrections. Catalogue complet, sélection sans mutation, refus d’identités/générations inconnues, contexte externe refusé, panneaux et rendu partagé couverts. |
| `npm run test:design-system` | 47 tests conformes et contrats valides ; inventaire complet, génération déterministe, refus d’usages inconnus. |
| `npm run test:design-system:docs` | 5 tests conformes, génération documentaire, échappement et sauvegarde/relecture. |
| `node --test --test-name-pattern=standalone tests/design-editor-store.test.mjs tests/design-editor-http.test.mjs` | 3 tests conformes : persistance/redémarrage, attribution ultérieure, reprise et refus HTTP. Campagne ciblée, pas un nouveau contrôle complet historique du serveur. |
| `npm run typecheck`, `npm run lint`, `npm run format:check` | Conformes ; rendu ciblé 3 tests rejoué après dernière clarification textuelle. |
| `npm run docs:design-system:check` | Conforme ; aucun dérivé édité manuellement. |
| `npm run build`, `npm run build-storybook` | Conformes ; avertissement habituel de taille des chunks Storybook, sans échec. Index Tokens/Primitives présent, ancienne Reference de Foundations absente. |

147 tests distincts réussis, plus retest de trois cas déjà comptés. **Aucun test E2E ni runner navigateur exécuté.** Les sources des parcours sont adaptées mais leur exécution reste non vérifiée. Pas d’acceptation mobile/clavier/visuelle déduite du rendu React statique.

## Revues successives

- **Technique — satisfaisant sur ce périmètre.** Chemin catalogue → canal strict → sélection de session → navigation native → fiche existante examiné. Lecture du filtrage `disabled(parameters)` dans le runtime Storybook installé, tests d’enregistrement et garde de rendu. Édition et persistance existantes réutilisées ; dépendances fermées actualisées. Le défaut d’inventaire constaté a été corrigé par le Builder, puis retesté.
- **Design — avec réserve de recette humaine.** Référence : évolution approuvée, sans maquette externe. Catalogue sémantique complet distinct des primitives, action au clavier via boutons natifs, noms/valeurs textuels, portée partagée déplacée. Rendu/table et libellés relus, sans parcours interactif ou qualification responsive. L’ouverture de livraison confirme seulement le chargement.
- **Sécurité — satisfaisant sur la surface modifiée.** Données rendues par React, aucune HTML injectée ; schéma de sélection strict et lié à la génération/style connu, garde du contexte local, aucun accès serveur ajouté. L’événement ne prépare aucune opération d’écriture. Refus HTTP existants éprouvés dans les tests ciblés. Pas de scan distant, audit général ni certification.

Aucune revue d’instructions/distribution : ni procédure d’agent ni adaptation modifiée. Modèles de suivi de l’app non initialisés.

## Livraison locale et reprise

Le porteur a autorisé « Abandonner ce brouillon » pour la présente mise à jour. Tout abandonner exécuté ; Génération chargée et commande désactivée constatées avant remplacement. Huit sources enregistrées comparées par SHA-256 avant/après génération et bascule. Ancienne racine DS-EDIT-10 et racines historiques/reçus conservées ; aucun journal/capacité transporté. Zéro reçu dans la racine précédente immédiate. Seuls les propriétaires vérifiés par commande et répertoire ont été arrêtés, sans terminaison forcée.

Nouvelle racine `.local/ds-edit-11/designer`, UI Lab 54085 et Storybook 54086, réponses HTTP 200. Safari ouvert sur Tokens > Styles ; tableau « Tokens sémantiques (42) » et « Instance locale prête à enregistrer » observés, sans clic de modification ni sauvegarde de l’agent. [Ouvrir Tokens](http://127.0.0.1:54086/?path=/story/design-system-foundations--tokens&addonPanel=adl/design-editor/styles). Descripteurs et empreintes locaux ignorés.

Diff, absence de signatures de secrets et liens du chantier contrôlés ; 50 entrées non suivies préexistantes conservées. **Doc updated.** Aucune publication, push, Actions ou ressource distante. Reprise : vérification humaine de cette évolution ; G/J5 et leurs réserves restent inchangés. Aucun chantier supplémentaire ouvert.
