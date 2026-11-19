# 032 — Interface Loomata desktop uniquement

**Date :** 11 novembre 2026. **Statut :** décision explicite du porteur.

## Décision

Loomata est destinée uniquement à un usage desktop, dans l’application macOS ou un navigateur de bureau. UI Lab, Storybook intégré, aperçu et assistance sont conçus et qualifiés pour ces usages. Les smartphones et tablettes ne constituent pas des cibles prises en charge.

Les prochaines modifications ne doivent ni concevoir une variante mobile, ni ajouter une exigence de recette ou de compatibilité mobile pour Loomata. Vérifier les tailles de fenêtres desktop retenues pour le chantier, le défilement, les textes longs, le clavier et le focus. La référence produit courante est l’[intention Loomata](../product/loomata-workspace.md#plateformes-et-formats-pris-en-charge).

## Portée et conséquences

Cette décision remplace pour Loomata l’exigence antérieure de recette mobile/desktop de QUA-03 et les prescriptions mobiles des anciennes fiches. Elle ne supprime pas rétroactivement les preuves, styles ou tests mobiles présents ; leur existence ne représente plus un engagement de support. Leur retrait éventuel relève d’un mandat d’implémentation distinct. Aucun filtrage réseau ou blocage par user-agent n’est ajouté par cette décision documentaire.

Le starter reste une ressource réutilisable : les formats d’une application créée avec lui sont définis par son brief et son propre mandat. Aucun support d’un autre système desktop n’est déclaré techniquement qualifié par cette décision.
