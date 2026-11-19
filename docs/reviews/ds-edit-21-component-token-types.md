# DS-EDIT-21 — Tokens de composants par type

31 octobre 2026 — application, base 762dd79. En revue — qualification technique acquise, acceptation humaine différée. Doc updated. [Mandat](../work-items/ds-edit-21-component-token-types.md).

TokenCatalog groupe les pages de chaque composant par primitiveFamily, à partir du type et du rôle existants du contrat. Titres anglais et tableaux distincts ; seuls les groupes peuplés sont présentés. Les pages All conservent leur organisation par composant. Aucune autorité, valeur, identité, attribution sémantique, opération serveur ni CSS de composant modifié. Le parcours hierarchy vérifie désormais les titres par type et conserve les assertions de comptage/sélection.

Contrôles exécutés : npm run typecheck réussi ; Prettier --check et ESLint ciblés conformes ; npm run test:design-editor:dev -- hierarchy.spec.ts taxonomy.spec.ts : six parcours desktop/mobile réussis (16,1 s). Premier lancement sans dossier de journal : commande non démarrée, dossier corrigé puis campagne réussie. git diff --check conforme. Logs locaux .local/ds-edit-21/browser.log et .local/ds-edit-21-types.log. Pas de nouveau build complet ni campagne de persistance pour ce changement de présentation seul.

Recette 54118 actualisée depuis une copie neuve sous .local/ds-edit-21/recipe ; modèle complet profondément égal à la recette précédente, #b51a00 conservé, aucun journal/reçu/compte transféré. Ancienne racine conservée. Dépendances partagées localement, aucune nouvelle qualification de distribution revendiquée. Observation réelle du bouton : color, radius, space, stroke et quatre sous-types typographiques présents, 15 entrées conservées. [Capture](ds-edit-21/button-types.png). Liaison du navigateur réinitialisée avant observation réussie.

Revues séquentielles, même agent, non indépendantes : Design satisfaisant (titres lisibles, familles anglaises, navigation inchangée) ; Technique/QA satisfaisant (groupement sans mutation, mêmes identités/valeurs et sélection, types et parcours conformes) ; Sécurité sans nouvelle surface (aucune entrée/permission/transport, textes React échappés). Acceptation visuelle humaine différée, pas de conformité exhaustive d’accessibilité revendiquée. Aucune instruction ou dépendance modifiée ; revue de distribution/instructions non requise.

85 fichiers non suivis préexistants vérifiés inchangés ; diff sélectionné sans configuration privée. Intégration locale autorisée ; suite : recette humaine, sans nouveau chantier. Aucun push/publication. G/J5 et modèles de suivi app inchangés.
