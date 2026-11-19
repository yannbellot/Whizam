# Distribution autonome du kit

Le Kit Whizam, anciennement Loomata, est livré dans ce dossier. Son nom visible évolue ; les chemins, commandes, formats de projet et identifiants techniques existants sont conservés. Les références historiques ci-dessous gardent leur portée datée.

Le portail documentaire Zensical est livré dans ce dossier, avec ses scripts et sa configuration Docker. Consulter le [guide d’utilisation](../documentation.md). Aucun fichier du parent ni Python hôte requis.

Édition DS-AUTO-01 du 18 novembre 2026 : design system automatisé à trois catégories de tokens, Storybook de consultation et retrait de UI Lab. La provenance historique reste `e81cabc78cd6c9d4263961dc03511dbec0e14ac1` ; cette référence ne représente pas les changements de cette édition locale sans dépôt Git.

Le dossier contenant cette notice est l’unité distribuable complète. Toutes les commandes du README s’exécutent depuis sa racine ; aucun dossier de maintenance externe n’est nécessaire. Préserver les fichiers cachés et liens relatifs des skills.

## Contenu et vérifications

`sources.json` inventorie les sources livrées, avec empreintes ou cibles des liens. Installations, caches, configuration privée, journaux, données et builds sont exclus. Les dépendances s’installent depuis le verrou npm ; aucun compte, volume Docker ni réglage système n’est transféré.

Le [bilan DS-AUTO-01](ds-auto-01.md) décrit les contrôles de cette évolution et leurs limites. La [qualification initiale DIST-01](qualification.md) reste une preuve historique sur son ancien périmètre. Les rapports datés ne qualifient pas automatiquement une nouvelle édition.

Le destinataire suit le README et utilise son propre assistant. Les instructions locales ne garantissent pas la découverte native par tous les outils ; voir la [compatibilité](../compatibility.md). Les projets déjà distribués ne sont pas migrés implicitement.

## Limites

Les utilitaires et sources historiques conservés d’autres parcours ne sont pas des étapes requises pour installer ce kit. L’ancien éditeur n’est plus un parcours actif ; ses journaux et reçus ne se convertissent pas avec la migration des sources.

La présence du kit ne vaut ni recette humaine, ni licence supplémentaire, ni publication, ni préparation à la production. Cette évolution ne transfère aucune donnée utilisateur et ne modifie pas les prérequis de PostgreSQL ou Docker.
