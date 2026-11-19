# DS-EDIT-58 — Liste de propriétés groupée

2 novembre 2026 — cible application. Base `248cd4d`, branche locale `codex/ds-edit-58-grouped-properties`. Mandat : implémenter les groupes, libellés courts sans répétition du groupe et aide CSS au survol et au clavier, puis actualiser la recette 54138 en préservant valeurs et brouillons. Statut : En revue — qualification technique acquise, acceptation humaine différée.

## Périmètre et choix

Autorité : `editor-contract.yaml` porte les groupes ordonnés et leurs propriétés ordonnées. Les libellés courts restent dans chaque définition ; `cssProperty` fournit l’aide sans copie. Schéma et validation imposent une couverture unique complète. Les contrats historiques sans présentation restent lisibles. Groupes vides masqués selon les cellules du contexte.

Menu : combobox ARIA à liste groupée ciblée, titres non sélectionnables, focus maintenu sur le déclencheur avec aria-activedescendant et navigation par flèches/Home/End/saisie rapide. Aucune dépendance ajoutée. Essai initial de Select Base UI 1.7.0 abandonné : son runtime JSX React 19 est incompatible avec le manager Storybook React 18 ; ne pas modifier le bundling global pour ce seul menu. Le popup reprend le thème Storybook et évite le rognage du panneau. Il utilise les limites du viewport ; sur mobile il appartient à l’arbre du dialogue Storybook et dépasse son niveau de superposition, sans être rogné par le panneau interne. Le premier essai portallé dans body était inaccessible au clic sous le dialogue mobile : corrigé avant qualification. Aide CSS révélée pour l’option survolée ou atteinte au clavier, sans déplacement des lignes. Les autres sélecteurs restent inchangés.

La proposition DS-EDIT-56 a identifié la métadonnée pageMargin/padding-inline alors que les consommateurs utilisent padding. Le mandat de mise en œuvre inclut sa réconciliation : métadonnée alignée sur padding avec le même domaine de longueur positive, sans changer le rendu, les valeurs ou les identités.

Procédures applicatives sélectionnées explicitement depuis le catalogue : implement-feature, review-design, technical-review, security-review, version qualifiée `248cd4d`. Revues séquentielles, même agent, non indépendantes. Recommandation réutilisée : GPT-6.1 Sol · Élevée — autorité, contrat, interaction clavier et recette persistante. Aucun changement de configuration effectué.

## Critères et preuves prévues

- Six groupes, dix-huit propriétés couvertes sans ambiguïté ; labels courts approuvés, ordre stable et aucune rubrique vide.
- Aide CSS fidèle au survol et au clavier ; titres non sélectionnables ; sélection, flèches, saisie rapide, Échap et Tab utilisables, focus conservé.
- Valeurs, conversion d’unités, correction de contraste et sauvegarde inchangées.
- Contrôles d’autorité, tests unitaires et parcours desktop/mobile ; types et build sur copie isolée des préexistants.
- Recette : absence de brouillon avant rechargement, hashes des dix sources préservés, récupération officielle et relance persistante.

Préexistants non suivis (copies « 2 », SemanticStyles.tsx et frontend/) hors périmètre. Aucun fichier préexistant modifié, aucun modèle de suivi app initialisé. Publication désactivée. Doc updated. Résultats et reprise ajoutés après qualification.


## Résultat et reprise

Les critères sont démontrés dans la [qualification et les trois revues](../reviews/ds-edit-58-grouped-properties.md). Groupes et libellés du contrat implémentés, aide CSS au survol et au parcours clavier, choix et brouillons conservés. 143 unitaires, 82 DS, cinq documentaires ; quatre parcours statiques et quatre persistants réussis. Neuf scénarios dev réussis et retest isolé desktop/mobile du focus réussi après un échec intermittent, conservé comme réserve. Types, build isolé, lint et formatage ciblé conformes. Fichiers : contrat/schéma/registre, validation/types, panneau/menu/thème/CSS/manifeste, helpers et parcours affectés, guide/autorité et suivi. Les sources de valeurs sont intactes. Doc updated. Programme `a1fffa9`, complément Safari `5cabf5d`. Recette 54138 actualisée : dix sources de valeurs préservées, service détaché vérifié, groupes et focus contrôlés dans Safari sans brouillon. Prochaine action : test humain ; aucune publication.


## Recette finale disponible

[Storybook de recette](http://127.0.0.1:54138/?path=/story/components-button--default). Avant rechargement : Génération chargée et Enregistrer désactivé, aucun brouillon. Rechargement depuis l’origine, groupes/noms courts/aide CSS et focus vérifiés dans Safari ; Échap laisse la valeur initiale et le focus sur Propriété. Dix hashes de valeurs inchangés, dix fichiers de programme alignés, aucun reçu ajouté ; conservation des styles propres à cette instance. Arrêt et récupération reconnus, relance persistante avec parent 1. Les modèles app et tous les préexistants restent intacts. Doc updated ; reprise : recette humaine des libellés et interactions.
