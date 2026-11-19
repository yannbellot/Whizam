# 013 — Deux onglets Storybook et deux entrées vers les styles

30 octobre 2026 — proposition étudiée puis approuvée pour implémentation par le porteur, avec tests techniques, sans E2E, et mise à jour du Storybook courant local. Remplace les restrictions d’accès de la [décision 012](012-component-and-semantic-style-workspaces.md), dont la première livraison utilisait deux boutons internes à UI design.

**Apparence** et **Styles** sont deux onglets natifs Storybook, au même niveau que Controls et Actions ; ils remplacent UI design. Apparence couvre les composants et les fondations de la story préparée. Styles ouvre directement la bibliothèque et la fiche du style, sans réattribuer le composant inspecté.

Apparence propose les quatre actions : Réutiliser un style existant ; Créer et appliquer un nouveau style ; Créer une exception locale ; Modifier le style partagé. Chaque action affiche ses réglages. La création utilise le contexte propriété/état courant et attribue le nouveau style dans le brouillon. Dans Styles, la création demeure sans attribution automatique ; son domaine est choisi parmi les contextes préparés.

Les deux chemins utilisent le même formulaire de création et la même édition partagée. Valeurs, erreurs, sélection de style et filtres persistent au changement d’onglet. Voir ce style ouvre l’onglet Styles sur le style attribué ; la bibliothèque ne change aucune attribution lors d’une simple consultation.

Les champs valides alimentent automatiquement le brouillon et l’aperçu. Aucun bouton permanent supplémentaire de création/confirmation n’est réintroduit. **Enregistrer** reste l’unique sauvegarde durable de tout le brouillon. Les usages et l’impact de la modification partagée sont visibles depuis les deux chemins ; les exceptions locales restent conservées.

Une seule création en préparation à la fois, sans nouvelle opération serveur : `create-style` et `assign` composent la création contextuelle. Contrastes, comparaisons, erreurs, concurrence, résultat inconnu, protections et limites du statique sont maintenus. Aucune valeur de référence ou permission nouvelle. La [fiche DS-EDIT-09](../work-items/ds-edit-09-native-style-panels.md) porte les contrôles et les limites ; aucune recette UI ou acceptation humaine déduite des tests techniques.
