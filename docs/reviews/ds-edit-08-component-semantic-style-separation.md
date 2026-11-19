# DS-EDIT-08 — Séparation des espaces de l’éditeur

30 octobre 2026 — cible application. **En revue : contrôles hors E2E conformes, recette et acceptation humaines en attente.** Base `8846c8de41271e8a6334206d0da8e623a171479c`, branche locale `codex/separate-semantic-style-workspace`. [Fiche et critères](../work-items/ds-edit-08-component-semantic-style-separation.md), [décision 012](../decisions/012-component-and-semantic-style-workspaces.md).

## Mandat et résultat

Le porteur autorise la réalisation et la mise à jour directe du Storybook local, avec exclusion explicite de la recette E2E. Cette exclusion remplace les campagnes navigateur prévues par la préparation ; elle ne vaut pas réussite des critères visuels ou des parcours non exécutés.

Composant conserve attribution, exception et rétablissement. Les commandes de création et de modification partagée ont quitté ce réglage. Styles sémantiques possède une bibliothèque recherchable, une sélection indépendante, la fiche du style, ses usages et sa modification partagée. Les valeurs de couleur sont accompagnées d’échantillons ; les dimensions conservent leur unité explicite.

Voir ce style ouvre la fiche sans attribution. Le raccourci Créer un style à partir de ce réglage… préremplit le formulaire dans l’autre espace. Une création valide entre automatiquement dans le brouillon ; son attribution reste une action explicite dans Composant. Les intentions recommandées du contexte et les alternatives compatibles se trouvent dans ce formulaire. Une seule création préparée à la fois ; navigation, recherche et consultation ne suppriment pas le brouillon. Un formulaire incomplet ou invalide bloque sa sauvegarde depuis les deux onglets.

## Choix et contrats

- `create-style` étend le protocole v1 et ses schémas fermés ; les cinq discriminants historiques restent acceptés. Son `target` est un binding connu utilisé comme domaine de validation, sans modification d’attribution. Ce choix conserve la dérivation serveur du type/rôle/état et évite de rendre ces champs librement configurables. Aucun nouvel endpoint, format de valeur ou domaine de matrice.
- La création précède les opérations partagées/locales qui la référencent. Le moteur, la validation de requête et la projection valident le candidat ordonné ; le canal d’aperçu valide aussi les attributions envers les styles nouvellement créés. Identités/primitives calculées côté moteur, doublons refusés.
- Le brouillon reste unique. La sélection du style et le formulaire sont distincts du binding courant ; les erreurs partagées utilisent un espace de noms distinct. Annuler la création retire ses attributions préparées, pas les autres changements. Une identité déjà attribuée en brouillon est verrouillée jusqu’à sauvegarde ou annulation, sa valeur reste ajustable.
- Une création inutilisée n’exige pas de story arbitraire pour être enregistrée : aucune valeur de binding ne change. Dès qu’un réglage est affecté, la confirmation d’aperçu et les avertissements de contraste restent nécessaires. Sans paire connue, aucun contraste réussi n’est inventé. Les usages de la fiche permettent d’ouvrir une scène préparée.
- `SemanticStyles.tsx` est ajouté aux dépendances fermées du manifeste v3. Pas de conversion des journaux anciens : la livraison utilise une nouvelle racine avec les sources sauvegardées et conserve l’ancienne racine complète avec ses reçus.

## Contrôles exécutés

Campagnes dans une copie privée du kit, données synthétiques et runtime local Node 24.22.0/npm 11.8.0. Aucune installation globale. Journaux ignorés sous `.local/ds-edit-08/` dans le dépôt de fabrication ; aucun contenu privé de session versionné.

| Contrôle | Résultat et limite |
| --- | --- |
| `npm run typecheck`, `npm run lint`, `npm run format:check` | Conformes ; les sources de parcours E2E adaptées sont compilées, sans exécution navigateur. |
| `npm test` | 82 tests réussis, dont création indépendante, ordre création/attribution, canal de projection, navigation du brouillon et annulation ciblée. |
| `npm run test:design-system` | 47 tests réussis, autorités et schémas contractuels conformes. |
| `npm run test:design-editor:server` | 72 tests réussis : persistance réelle, redémarrage, conflits, idempotence, refus HTTP et récupération. Inclut la création sans mutation des bindings puis attribution ultérieure ou dans la même transaction. |
| `node --test --test-name-pattern="standalone" tests/design-editor-store.test.mjs tests/design-editor-http.test.mjs` | 3 tests réussis après ajout des refus HTTP dédiés et de la reprise d’une création sans attribution après remplacement partiel ; recouvre un test de la campagne précédente. |
| `npm run docs:design-system:check` | Documents générés à jour, sans édition manuelle des dérivés. |
| `npm run build`, `npm run build-storybook` | Conformes ; dernier build Storybook effectué après les corrections finales de présentation. Avertissements Router/Storybook et taille de chunks hérités, sans blocage de build. |
| Diff, périmètre et liens | Relecture du diff et absence de valeurs/secrets/configuration locale ajoutés ; liens locaux documentaires vérifiés avant commit. |

Échecs conservés : premier typecheck refusé après une garde devenue impossible dans la branche d’attribution, corrigée puis recontrôlée ; premier lint signalant une variable de recommandations devenue inutilisée, retirée ; premier `npm test` échoué uniquement sur réservation loopback refusée par le sandbox, 81 autres tests réussis. Le retest avec réservations locales autorisées réussit à 82/82. Le wrapper de runtime initial constatait un Node hôte trop ancien ; utilisation du runtime compatible déjà présent dans le dépôt, sans installation. Une redirection de journal vers le parent a été refusée avant lancement d’une commande ; sortie replacée dans le dossier local du chantier.

**Non exécutés sur demande explicite** : `test:design-editor`, `test:design-editor:dev`, `test:design-editor:persistence`, `test:design-editor:recovery`, `test:design-editor:live`, `test:storybook`, captures/recette desktop-mobile et interactions de sauvegarde dans un navigateur. Les tests store/HTTP ne remplacent ni ces parcours ni une relecture de l’application compilée après sauvegarde. Leurs anciens résultats ne sont pas attribués à DS-EDIT-08.

## Trois revues séquentielles

**Même agent, non indépendant.** Procédures applicatives `design-interactions`, `implement-feature`, puis `review-design`, `technical-review`, `security-review`, sélectionnées depuis le catalogue à la base inspectée. Aucun sous-agent, fournisseur ni service de scan externe.

- **Design — avec réserves de recette.** Lecture des sources et de 012 : portées distinctes, navigation sans attribution, libellés d’annulation explicites, définitions et disponibilité des intentions conservées. Le lien de consultation d’un doublon ne supprime plus la préparation en cours. Réserve : rendu, clavier, responsive et compréhension réelle des deux espaces non qualifiés sans recette ; aucun Figma ou résultat visuel inventé.
- **Technique — satisfaisant sur les contrôles exécutés, réserves UI.** Chemin formulaire → session → opérations → validation → sources → relecture store examiné. La création sans mutation et l’attribution ordonnée sont éprouvées ; le canal accepte le style du candidat et conserve les contrôles de contexte. Les erreurs de formulaire et leur annulation sont conservées à travers les onglets. Les scénarios navigateur affectés sont réécrits, sans revendication de réussite. Pas de migration des valeurs ou de données métier.
- **Sécurité — satisfaisant sur le périmètre inspecté, limites de plateforme existantes.** Nouveau discriminant fermé sur cible connue, normalisation et validation du graphe, unicité et budgets conservés. Le service local et ses gardes Host/Origin/capacité ne sont pas assouplis ; refus dédiés testés. Aucun chemin/commande fourni par le client, rendu React textuel du catalogue et liste de dépendances explicite. Journaux/capacités privés non transportés vers la nouvelle racine. Aucune certification globale ni nouveau scan de dépendances revendiqué.

Les corrections signalées ont été réalisées sous le rôle Builder puis relues ; pas de correction implicite par un reviewer. Pas de revue d’instructions/distribution : aucune procédure d’agent ni adaptation ni paquet publié modifié.

## Livraison locale et préservation

[Storybook habituel](http://127.0.0.1:54086/?path=/story/components-button--default&addonPanel=adl/design-editor/panel), [UI Lab associé](http://127.0.0.1:54085/ui-lab). Nouvelle racine `.local/ds-edit-08/designer`, ancienne `.local/ds-edit-04/designer` conservée intacte. Les seuls processus des deux accès ont été identifiés par commande et répertoire, arrêtés puis remplacés ; aucun autre service touché.

Avant bascule : observation en lecture de l’onglet Safari existant, Génération chargée et Tout abandonner désactivé ; aucune transaction active, sept reçus terminaux et huit sources contrôlés par empreintes. Après copie et génération dans la nouvelle racine : huit sources identiques, sept reçus préservés dans l’ancienne racine, aucune reprise ou copie des journaux. Les deux accès répondent HTTP 200. Descripteur et empreintes avant/après ignorés sous `.local/ds-edit-08/` ; pointeur de l’accès habituel actualisé.

L’onglet Safari existant a été rechargé pour la livraison après constat du brouillon vide. Lecture du chargement uniquement : Composant et Styles sémantiques présents, service prêt et valeur précise `#5e30eb` retrouvée. Aucune sélection de style, création ou sauvegarde utilisateur testée ; ce constat ne constitue pas une recette E2E. Pas de nouveau jeu de données ou reçu humain.

**Doc updated.** Modèles de suivi applicatifs non initialisés et copies non suivies préexistantes préservés. Aucun push, Actions, publication ou déploiement distant. Risques résiduels : nouveaux parcours UI non éprouvés, mémoire volatile du brouillon, limites d’inventaire/contraste et de plateforme existantes. Prochaine action : recette du porteur sur l’accès habituel ; pas de qualification E2E ni acceptation globale G/J5 déduite.
