# DS-EDIT-58 — Qualification de la liste de propriétés

2 novembre 2026 — application, base `248cd4d`, réalisation `a1fffa9`, complément de focus `5cabf5d`. En revue : qualification technique acquise, acceptation humaine différée. Revues design, technique et sécurité proportionnée **séquentielles, même agent, non indépendantes**, après réalisation Builder. [Mandat et choix](../work-items/ds-edit-58-grouped-properties.md).

## Résultat démontré

Six groupes ordonnés couvrent exactement les dix-huit propriétés de l’autorité ; seules les options du contexte sont affichées, sans groupe vide. Les titres ne sont pas sélectionnables ; les options reprennent les noms courts demandés. Le nom CSS est révélé sur la ligne survolée ou parcourue au clavier, sans déplacement de contenu, et sert de description accessible. Le déclencheur garde son nom Propriété et le focus ; sélection explicite, flèches, Home/End, saisie rapide, Échap, Tab et clic extérieur contrôlés. Le popup est positionné dans le viewport, placé dans l’arbre du dialogue mobile lorsqu’il existe et au-dessus de son contenu (niveau Storybook 100000). Les autres sélecteurs restent natifs.

La métadonnée pageMargin indique désormais padding, propriété des consommateurs, avec le même domaine scalaire non négatif ; valeurs, identités, unités et rendu conservés. Les groupes restent distincts de la taxonomie des tokens. Le schéma borne la structure, la validation relationnelle impose unicité/couverture et le chargeur courant exige la présentation ; les fixtures historiques sans groupes restent lisibles. Les deux nouveaux modules appartiennent au manifeste fermé de révision ; aucune source mutable ajoutée.

## Contrôles exécutés

Runtime Node 24.22.0 déjà présent, npm 11.8.0 ; aucun ajout de dépendance ni installation globale.

| Commande ou parcours | Résultat |
| --- | --- |
| `npm test` | 143 tests réussis ; premier essai sandbox refusant le port du test local-setup, retest avec loopback autorisé conforme. |
| `npm run test:design-system` | 82 tests réussis, dont couverture des groupes, refus des doublons/inconnus/manquants, domaine de padding et persistance des grandes valeurs. |
| `npm run docs:design-system:check` et `npm run test:design-system:docs` | Documents générés à jour, cinq tests réussis. |
| `npm run test:design-editor:dev -- --grep 'groups properties\|uses keyboard controls\|contexts and preserves\|unit conversion uses\|contextual units'` | Neuf parcours réussis ; un échec intermittent de maintien du focus dans le champ Valeur précise du parcours existant. Retest isolé `--grep 'uses keyboard controls'` : deux parcours desktop/mobile réussis sans changement de code. Les dix scénarios sont donc couverts, sans prétendre que cette campagne complète est intégralement verte. |
| `npm run test:design-editor -- --grep 'groups properties\|uses keyboard controls'` | Quatre parcours statiques réussis, desktop 1280×800 et mobile 390×844. |
| `npm run test:design-editor:persistence -- component-tokens.spec.ts --grep 'autonomous padding\|converted units'` | Quatre parcours réussis : édition autonome, rétablissement, unités, contraste et rechargement. Relecture séparée des sources enregistrées et application compilée contrôlées par le runner aux deux formats. |
| `npm run typecheck`, `npm run build`, `npm run lint` | Réussis sur copie isolée des seuls fichiers suivis et des deux nouveaux modules. Les copies préexistantes non suivies, notamment SemanticStyles.tsx, restent intactes dans le clone. Types/lint rejoués sur le menu final ; build applicatif également éprouvé par la persistance finale. |
| Formatage ciblé, autorités incluses ; `git diff --check` | Conformes. Le contrôle global de formatage conserve sa réserve héritée sur panel-visibility.spec.ts et n’est pas revendiqué. |

Les traces/logs des essais sont conservés dans `.local/ds-edit-58*` du lab et les sorties de test locales de l’app. Essais intermédiaires non qualifiés : import React classique absent puis incompatibilité du runtime JSX Base UI avec le manager ; essai abandonné sans changement de dépendance. Première implantation hors dialogue mobile bloquée par sa superposition, corrigée après inspection du code Storybook et retest. Un scénario de clic extérieur visait initialement un titre couvert par le menu ; corrigé pour cliquer le bord du panneau. Une campagne dev traversée par des modifications de sources n’est pas retenue comme preuve finale. Lint : horodatage issu de l’événement et conteneur mémorisé hors rendu, sans suppression de règle.

## Revues

Design : satisfaisant pour les critères demandés. [Capture desktop](ds-edit-58/desktop.png) et [capture mobile](ds-edit-58/mobile.png) examinées ; hiérarchie de groupe lisible, labels non répétés, aide CSS visible, menu défilable et contenu dans le viewport. Interactions vérifiées par parcours ; aucun Figma fourni, aucune acceptation visuelle présumée.

Technique : satisfaisant avec réserve du focus intermittent ci-dessus, non reproduit au retest isolé et absent des quatre parcours compilés. Les changements du menu ne touchent pas le champ de valeur ; seul choose restaure le focus sur son déclencheur. Le code utilise les choix issus des bindings validés, garde le mécanisme de sélection et les opérations existants. La liste est démontée lors d’un changement de composant/variante/partie ; les autres brouillons sont conservés. Aucune migration de données.

Sécurité proportionnée : satisfaisant sur le diff ; aucun nouvel accès, service, fournisseur ou secret, aucune dépendance ajoutée. Labels et noms CSS sont rendus comme texte React depuis le contrat local validé et comparé à l’autorité compilée ; pas de HTML injecté, de CSS exécuté depuis un libellé ni de chemin libre ajouté. Le protocole d’écriture reste inchangé. Cette lecture n’est pas un audit exhaustif.

Limites : qualification automatisée Chromium sur macOS, formats desktop/mobile ; lecteur d’écran réel, geste tactile sur appareil et autres OS non vérifiés. La vérification Safari de recette est consignée dans la fiche. Doc updated. Reprise : recette humaine, sans autre chantier ni publication.


## Complément Safari et recette

Safari a révélé qu’une ouverture par clic n’attribuait pas le focus au bouton. Le complément `5cabf5d` concentre explicitement le focus à l’ouverture ; diff de trois lignes relu en technique/design, mêmes rôles séquentiels non indépendants. Deux nouveaux parcours statiques desktop/mobile avec assertion du focus, typecheck et lint isolés réussis ; aucun autre contrat ni valeur changé. Dans Safari, après actualisation, clic puis Home atteint Famille, Échap ferme la liste et rend le focus au déclencheur. Le thème sombre et les groupes sont visibles. Aucun contrôle sauvegardé dans l’instance humaine.

Recette 54138 actualisée en deux arrêts propres et récupérations officielles, sans suppression de protection. Programme final `5cabf5d`, dix fichiers contrôlés identiques ; dix hashes de sources de valeurs identiques avant/après, aucun reçu ni transaction ajouté. L’instance conserve ses 18 styles et 188 tokens de composants, dont les valeurs propres de recette. Service détaché vérifié avec parent 1. Safari affiche Données à jour et Génération chargée, sans brouillon ; recette prête pour le designer. Preuves locales : `.local/ds-edit-58/recipe-check.json`, fichiers de hashes, processus et log ; non livrées comme configuration du kit. Reprise : test humain uniquement, aucune publication.
