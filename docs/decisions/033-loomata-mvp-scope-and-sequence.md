# 033 — Périmètre MVP Loomata et réalisation en trois tranches

**Date :** 12 novembre 2026. **Statut :** décisions fonctionnelles et ordre de réalisation validés par le porteur ; réalisation non qualifiée par ce document.

## Décision

Loomata est l’application locale de conception et de pilotage destinée aux designers. Le starter reste une ressource du produit. La [spécification consolidée](../product/loomata-workspace.md) porte les comportements : quatre espaces, projets créés avec Loomata uniquement, Codex seul, Figma direct actualisé à la demande, brouillon unique et intégration proportionnée. Administration et Claude sont hors MVP. Les adaptations du kit pour d’autres assistants restent conservées ; elles ne constituent pas des fournisseurs intégrés au MVP.

Le porteur a validé successivement les arbitrages suivants :

| Sujet | Décision |
| --- | --- |
| Projets pris en charge | Créés avec Loomata, puis rouverts et modifiés ; pas d’adoption de projets hétérogènes existants. |
| Figma | Connexion directe, actualisation sur action utilisateur ; nouvelles pages/composants et évolution de l’existant. Pas de plugin exporteur comme voie MVP ni de synchronisation bidirectionnelle. |
| Conservation | Sources, décisions et traçabilité durable dans Git ; conversations complètes privées localement. |
| Espaces | Interface & Design System, User Flow, Planification et Agents IA ; Administration reportée. |
| Brouillon et aperçu | Un brouillon instantané actif par projet ; aperçu d’un état sélectionné et identifié à la fois. |
| User Flow | Prévu, réalisé et vérifié distingués ; proposition Figma distincte tant qu’elle n’est pas adoptée. |
| Fournisseur | Codex uniquement ; essais Claude reportés faute de compte approprié, sans qualification ni déqualification de la voie abonnement. |
| Annulation | Directement dans le brouillon ; après commit, retour arrière demandé à Codex et tracé. Restauration de données distincte. |
| Intégration | Automatique pour changement non critique sans effet visible, ou validation E2E explicitement choisie et réussie ; humaine pour les autres changements visibles et les arbitrages critiques/ambigus. |

## Séquence approuvée

1. **Interface & Design System et Agents IA**, avec le socle partagé qualifié avant ses fonctions métier.
2. **User Flow**, avec raccordement aux mêmes identités, conversations et modifications.
3. **Planification et Agents IA**, avec traitement des demandes, lancement explicite et pilotage des chantiers.

Le socle fait partie du début de la première tranche, sans quatrième tranche ni second moteur différé. Les contrats de planification, la persistance et la traçabilité nécessaires aux trois espaces sont éprouvés dès ce préalable. Leur interface complète est livrée en troisième tranche. Les détails de découpage interne et critères sont dans la [fiche de préparation](../work-items/mvp-01-three-stage-development.md). Les statuts de fabrication restent dans la roadmap racine du dépôt de fabrication ; les modèles livrés ne sont pas initialisés.

## Portée et remplacement

Cette décision remplace le cadrage courant de l’interface en trois vues et la proposition initiale de cinq espaces. Elle adapte FIGMA-RECON-01 : connexion directe au lieu du package/plugin proposé, fonctions réparties dans les quatre espaces, mêmes autorités et moteur commun. Le [chantier adapté](../work-items/figma-recon-01-design-reconciliation.md) distingue ces décisions des détails encore à qualifier.

UI-FINAL-01, CORE-01, AGENT-CHAT-01 et les qualifications antérieures restent des preuves de capacités identifiées, sans validation automatique du nouveau MVP. Les deux livraisons, la stack de référence, le desktop uniquement, les protections locales et les conditions de publication restent applicables. Ce document autorise la mise à jour documentaire demandée ; il n’ouvre pas un mandat de développement, un accès Figma, une inférence, une installation ou une publication.
