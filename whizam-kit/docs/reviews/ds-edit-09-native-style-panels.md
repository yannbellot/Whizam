# DS-EDIT-09 — Onglets natifs Apparence et Styles

30 octobre 2026 — cible application, base `656eaa6c4e7773115a6441dc3bacdf013866fae2`, candidat source `c8be528`, branche `codex/native-style-panels` intégrée localement dans main. **En revue : contrôles techniques hors E2E conformes, livraison courante effectuée, recette et acceptation humaines en attente.** [Mandat et critères](../work-items/ds-edit-09-native-style-panels.md), [décision approuvée 013](../decisions/013-appearance-and-styles-panels.md).

## Résultat et choix techniques

Deux panneaux sont enregistrés avec `types.PANEL` : Apparence conserve `adl/design-editor/panel` pour les liens existants ; Styles possède `adl/design-editor/styles`. La navigation interne de DS-EDIT-08 est retirée. Le panneau actif monte une seule instance de l’éditeur et du pont ; au passage vers l’autre panneau de design, le nettoyage conserve la projection. Fermer le panneau ou sélectionner une autre extension conserve la suspension d’aperçu existante. La nouvelle définition des identités est incluse dans le manifeste fermé.

Apparence retrouve les quatre actions et leurs réglages. Créer et appliquer ouvre le formulaire partagé dans le contexte courant et prépare `create-style` puis `assign` ; Styles prépare `create-style` seul. Les deux chemins utilisent le même moteur et le même formulaire, sans bouton permanent supplémentaire de création. Un seul brouillon est sauvegardé par Enregistrer.

Le choix d’intention contextuelle peut remplacer sa propre identité non enregistrée, tant qu’elle n’a pas été attribuée ailleurs ; aucune duplication ni réattribution d’autres réglages. Quitter l’action de création conserve les opérations déjà préparées mais détache son attribution automatique future : une modification ultérieure depuis Styles n’écrase pas un autre choix du composant. Annuler la création conserve les autres opérations et valide le candidat avant changement.

Les champs partagés, erreurs et usages sont les mêmes depuis Apparence et Styles. Le filtre des intentions et la clé d’acquittement sont dans la session pour survivre au remontage natif. Cette clé reste liée à la génération, aux opérations et à l’audit ; elle ne valide pas de nouvelles mesures par simple navigation. Voir ce style sélectionne le vrai panneau Styles sur la fiche attribuée. Pas de changement de schéma serveur, d’endpoint, de matrice, de valeur de référence ou de dépendance.

## Contrôles réellement exécutés

Copie privée `.local/ds-edit-09/check` dans le dépôt de fabrication ; Node 24.22.0/npm 11.8.0 déjà présents, aucune installation globale. Journaux ignorés sous `.local/ds-edit-09/`. Catalogue de l’app consulté et procédures sélectionnées à la version de base ; pas de sous-agent.

| Contrôle | Résultat et limite |
| --- | --- |
| `npm test` | 88 tests réussis : les deux enregistrements natifs distincts ; rendu React statique des quatre actions, absence de navigation interne ; même valeur/erreur/usages dans les deux entrées ; création contextuelle avec attribution, création directe sans attribution, remplacement d’identité en brouillon et conservation d’un autre choix lors d’une édition ultérieure. Aucun navigateur utilisé. |
| `npm run test:design-system` | 47 tests réussis ; données, graphes et contrats existants conservés. |
| `node --test --test-name-pattern="standalone" tests/design-editor-store.test.mjs tests/design-editor-http.test.mjs` | 3 tests serveur réussis sur les opérations réutilisées : persistance/redémarrage puis attribution, refus de capacité/origine, reprise après interruption et idempotence. Pas une nouvelle campagne complète des tests serveur historiques. |
| `npm run typecheck`, `npm run lint`, `npm run format:check` | Conformes. Sources des parcours/runners directement touchés adaptées aux nouveaux intitulés et chemins, sans les exécuter. |
| `npm run build`, `npm run build-storybook` | Conformes, avertissements d’outillage/chunks hérités sans échec. |
| `npm run docs:design-system:check` | Documents générés à jour ; aucun dérivé édité à la main. |
| Diff et documentation | Relecture du périmètre, des données de référence et des liens avant commit ; copies préexistantes et modèles applicatifs préservés. |

**Non exécuté sur instruction explicite** : tout parcours E2E (éditeur dev/statique, persistance navigateur, live, récupération navigateur, Storybook et application), mesure/capture de rendu desktop/mobile, test clavier interactif et sauvegarde dans l’instance humaine. Les tests React statiques et de session ne prouvent pas le comportement interactif du manager réel. Les 72 tests serveur de DS-EDIT-08 ne sont pas réattribués à cette version.

## Trois revues, même agent séquentiel et non indépendant

- **Design — avec réserve de recette.** Conformité des sources à 013 : deux vrais onglets, quatre actions contextuelles, aucune confirmation de création redondante, création directe sans attribution et usages partagés. Le test de rendu vérifie structure et libellés ; aucune conformité visuelle ou clavier réelle déduite. La vérification du designer reste nécessaire.
- **Technique — satisfaisant sur les contrôles exécutés.** Flux panneau → session → création/attribution → moteur et projection examiné ; tests des deux chemins et des éditions partagées. Réserve de montage/interaction native non éprouvée par E2E. La revue a identifié le cas de fermeture du panneau : le maintien de projection dépend aussi de `getIsPanelShown`, afin de ne pas conserver l’aperçu à panneau caché. Correction Builder puis types/tests/build relus.
- **Sécurité — satisfaisant sur ce périmètre inspecté.** Identités de panneaux fixes, aucun accès supplémentaire ; opérations, budgets, normalisation, schémas fermés et gardes HTTP conservés. Ni données du catalogue exécutées, ni commande/chemin fourni par le client, ni journal supprimé ou transporté pour la livraison. Pas de nouveau scan externe ou de dépendances, ni certification globale.

Rôles/procédures relus : Builder, plan-feature, design-interactions, implement-feature ; Design Reviewer/review-design, Technical Reviewer/technical-review, Security Reviewer/security-review. Pas de revue d’instructions/distribution : aucune procédure d’agent ni adaptation/paquet modifié. Recommandation Sol · Élevée motivée dans la fiche ; pas de réglage client modifié.

## Livraison locale et point de reprise

La nouvelle copie `.local/ds-edit-09/designer` est préparée avec les huit sources enregistrées de `.local/ds-edit-08/designer`. Empreintes identiques avant/après préparation et génération ; zéro reçu dans cette racine courante, racine antérieure et reçus historiques conservés. Le Storybook courant et son UI Lab associé n’ont pas été arrêtés pendant cette préparation.

Le contrôle de préservation dans Safari a d’abord été empêché par le verrouillage du Mac. Après déverrouillage confirmé par le porteur, lecture du Storybook existant : Génération chargée, Tout abandonner désactivé, aucune requête active. Aucun état de brouillon n’a été déduit du seul verrouillage ou supprimé.

Identités de processus et répertoires contrôlées avant arrêt des seuls propriétaires de ces accès. La nouvelle copie est activée au [Storybook habituel](http://127.0.0.1:54086/?path=/story/components-button--default&addonPanel=adl/design-editor/panel), avec accès direct à [Styles](http://127.0.0.1:54086/?path=/story/components-button--default&addonPanel=adl/design-editor/styles) et [UI Lab associé](http://127.0.0.1:54085/ui-lab) depuis la même racine. Deux réponses HTTP 200 ; huit sources identiques après bascule, zéro reçu dans la racine précédente, anciennes racines et reçus historiques conservés. Aucun journal ni capacité copié dans la nouvelle racine. Empreintes/descripteur ignorés sous `.local/ds-edit-09/` ; accès habituel pointé sur cette livraison.

Rechargement de livraison dans l’onglet Safari existant après constat sans brouillon : Apparence sélectionné et Styles disponible dans la même liste native que Controls/Actions ; service prêt, valeur précise `#5e30eb` retrouvée et Tout abandonner désactivé. Cette observation de chargement n’est pas une recette E2E : aucune sélection d’action, création, modification, sauvegarde ou interaction de parcours exécutée. Les preuves interactives/visuelles restent à établir par le designer.

**Doc updated.** Aucun push, Actions, publication ou service distant. Aucun autre chantier ouvert ; G/J5 et acceptation humaine restent inchangés. Prochaine action : vérification du porteur sur le Storybook courant, sans nouvelle campagne E2E ni chantier implicite.
