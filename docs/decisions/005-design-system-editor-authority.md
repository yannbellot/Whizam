# 005 — Autorités préparées pour l’éditeur du design system

**28 octobre 2026 — évolution autorisée dans le mandat DS-EDIT-01 A.** Qualification technique distincte de l’acceptation humaine du produit. Cette décision et la [spécification autonome](../product/features/design-system-editor.md) accompagnent le kit ; aucun document parent n’est requis.

## Problème et décision

Le contrat historique relie directement les propriétés des composants aux tokens sémantiques. Cette structure ne permet pas de distinguer une attribution partagée d’une exception de propriété tout en conservant l’attribution d’origine.

La chaîne cible est désormais **propriété → token de composant → token sémantique → primitive**. Les alias sémantiques compatibles restent possibles, sans cycle. Un token de composant possède une identité par composant, variante, partie, propriété et état ; il porte toujours son attribution sémantique. Une exception ajoute une référence de primitive et sa provenance, sans supprimer cette attribution. Rétablir retire uniquement l’exception et retrouve la valeur partagée courante. Aucun changement de primitive partagée pour modifier un seul usage.

Le catalogue central décrit les intentions possibles et leurs compatibilités, sans créer de styles. L’identité d’un style réunit intention qualifiée par catégorie, type, rôle et état. La valeur n’entre pas dans cette identité ; une intention déjà matérialisée avec une autre valeur exige réutilisation explicitée ou modification partagée explicite. Les références, valeurs et priorités sont précisées dans la spécification.

Les capacités V1 et domaines de valeurs sont détenus par `editor-contract.yaml`. Les fiches adjacentes portent la préparation du composant par référence à cette matrice, ses tokens de composants, attributions et exceptions. Le registre central les référencera sans recopier leurs données. Button conserve `components/Button/Button.design.yaml` ; les autres fiches sont adjacentes aux implémentations actuelles, sans réorganisation React imposée. Le cas Field/SelectField et Notice/Panel partageant un fichier React est assumé par deux fiches distinctes. Les fondations ont leur fiche au niveau du design system.

## Transition et compatibilité

A livre catalogue, matrice, schémas v2, types et validation pure. Les six autorités historiques conservent leur schéma v1, leurs données et leurs consommateurs. Les deux nouveaux YAML sont validés en plus des six historiques. Le schéma de modèle v2 décrit un assemblage en mémoire des futures autorités et fiches ; il n’introduit pas un second fichier de tokens à éditer. Aucun modèle v2 de production n’est instancié en A.

B devra créer les fiches, faire évoluer explicitement les schémas des sources canoniques et du registre, adapter résolution/génération et CSS puis prouver l’absence de changement visuel. Une lecture v1 reste un mode de consultation ; aucun enregistrement de l’éditeur n’est permis sur un ensemble partiellement migré. L’adaptation des anciennes intentions devra être explicite et versionnée, jamais déduite de la couleur ou du nom d’un composant.

**Écart Notice conservé :** `components.yaml` attribue `semantic.color.surface.default` (`#ffffff`) au fond, tandis que `.notice` consomme `semantic.color.surface.muted` (`#f1f5f9`). Cette décision ne choisit pas silencieusement entre les deux et ne change aucun rendu. B devra établir une base de captures/styles calculés et documenter la réconciliation sous son mandat ; aucune égalité d’autorités n’est revendiquée en A.

## Conséquences et limites

Les valeurs directes restent interdites hors primitives : même les exceptions référencent une primitive. La provenance `designer-edit` ou `agent-migration`, de statut `proposed`, est définie pour le modèle cible sans transformer un réglage en acceptation humaine. Le brouillon et le protocole local sont des contrats, sans panneau ni service livré ici. La récupération reste à éprouver sur fichiers isolés avant toute qualification d’écriture.

Les documents historiques J2 décrivent leur version ; ils ne sont pas réécrits rétroactivement. Le [README d’autorité](../../src/design-system/authority/README.md) explicite la transition et devient l’entrée courante. Les modèles de suivi d’un futur projet restent non initialisés.
