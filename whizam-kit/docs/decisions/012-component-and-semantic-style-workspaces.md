# 012 — Séparer Composant et Styles sémantiques

30 octobre 2026 — orientation produit approuvée par le porteur : « Je valide cette dernière recommandation. App : prépare le chantier pour séparer Composant et Styles sémantiques, en déplaçant la création et la modification des styles partagés dans l’onglet dédié. » **Réalisation autorisée le 30 octobre 2026, avec mise à jour directe du Storybook local et sans recette E2E. Acceptation visuelle distincte.**

La [décision 013](013-appearance-and-styles-panels.md) remplace désormais la navigation et les restrictions d’accès décrites ci-dessous. Ce document conserve la décision à l’origine de DS-EDIT-08.

## Décision

L’onglet **Composant** permet d’attribuer un style existant compatible, de modifier localement une valeur et de retirer une exception locale. L’attribution et la valeur effective restent visibles. Il ne présente plus l’action ni le bouton « Créer et appliquer un nouveau style », ni la modification de la valeur du style partagé.

L’onglet **Styles sémantiques** accueille la bibliothèque, la création et la modification des styles partagés. La sélection d’un style y ouvre sa propre fiche, avec valeur, identité sémantique, usages dépendants et exceptions conservées ; elle n’attribue pas ce style au composant et ne se réduit pas à ouvrir un réglage consommateur.

Depuis Composant, **Voir ce style** ouvre cette fiche. Un accès secondaire **Créer un style à partir de ce réglage…** préremplit une préparation dans Styles sémantiques ; le changement d’onglet ne crée ni style ni attribution. La création d’un style et son attribution sont deux intentions distinctes ; revenir au composant pour le choisir rend cette seconde action explicite.

**Enregistrer** reste l’unique commande de sauvegarde durable, portant sur tout le brouillon de la racine et de la révision courantes. Les deux onglets ne deviennent pas deux transactions indépendantes. L’aperçu et les validations restent nécessaires, sans bouton permanent de création dans Composant.

## Articulation et conséquences

La [décision 011](011-visible-semantic-alternatives.md) reste la référence de présentation des recommandations et alternatives. Ce guidage accompagne la préparation d’un style dans l’espace sémantique ; Composant propose les styles réellement disponibles. Une intention sans style créé n’y déclenche plus un parcours de création implicite.

Cette décision fait évoluer, pour la réalisation future, la création et les commandes partagées décrites dans la [spécification actuelle](../product/features/design-system-editor.md). Elle ne prétend pas que les cinq opérations actuelles permettent déjà la création indépendante : `create-and-assign` exige un réglage et modifie son attribution. La forme technique de la création séparée doit être définie et éprouvée avant le raccordement de l’interface, sans attribution provisoire cachée ni retrait d’une protection.

Les identités, valeurs, attributions, exceptions et alias existants sont conservés. Aucune nouvelle catégorie d’intention, suppression de style, publication, installation, migration de données ou modification de la stack n’est décidée ici.

La [fiche DS-EDIT-08](../work-items/ds-edit-08-component-semantic-style-separation.md) porte les hypothèses techniques, les étapes et les critères. L’approbation de cette orientation ne vaut ni acceptation visuelle, ni qualification des parcours non exécutés.
