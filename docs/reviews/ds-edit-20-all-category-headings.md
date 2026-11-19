# DS-EDIT-20 — Catégories lisibles dans les pages All

31 octobre 2026 — application, base 03894c5, branche codex/ds-edit-20-all-category-headings. **En revue — qualification technique acquise, acceptation humaine différée. Doc updated.** [Mandat](../work-items/ds-edit-20-all-category-headings.md).

Les deux catalogues présentent chaque catégorie sous un vrai titre h3 anglais, suivi de son tableau et de son compteur. Le chemin relatif conserve le contexte des sous-catégories (color / standalone, type / font-size). Cela couvre les All des collections et leurs All imbriqués. Les feuilles gardent leur présentation sans titre redondant ; leurs légendes indiquent désormais le nombre de lignes de leur catégorie. Le défilement horizontal reste propre à chaque tableau ; aucune navigation interne ajoutée.

Fichiers applicatifs : PrimitiveCatalog.tsx, TokenCatalog.tsx et synchronisation des parcours hierarchy.spec.ts/taxonomy.spec.ts. Aucune autorité, valeur, identité, règle de classement, CSS de composant ou opération d’écriture modifiée.

## Contrôles et revues

- npm run typecheck : réussi ; génération préalable conforme.
- npm run test:design-editor:dev -- hierarchy.spec.ts taxonomy.spec.ts : six parcours réussis sur Chromium desktop/mobile (16,9 s), titres anglais, conservation des nombres d’entrées, filtres, sélection/fiches et Rules. Assertions des titres ajoutées aux parcours existants ; attentes de tables adaptées au regroupement, sans retirer les assertions de lignes.
- Prettier --check et ESLint sur les quatre fichiers concernés : réussis ; git diff --check conforme. Pas de nouvelle campagne serveur/persistance/build complet : ni contrat, ni writer, ni style de composant affecté.
- Recette 54118 : copie neuve sous .local/ds-edit-20/recipe, modèle complet profondément égal à la recette DS-EDIT-19 (primitives, 17 styles, 188 tokens et valeurs enregistrées dont #b51a00). Ancienne racine conservée, aucune connexion, aucun journal ou reçu transféré. Dépendances partagées par lien local, aucune qualification de distribution revendiquée.
- Observation de la recette par navigateur : titres de primitives et six titres de composants présents, valeur #b51a00 conservée. [Primitives](ds-edit-20/all-primitives.png), [tokens de composants](ds-edit-20/all-component-tokens.png). La liaison de contrôle du navigateur a nécessité une réinitialisation, puis observation réussie. Logs locaux : .local/ds-edit-20/browser.log et .local/ds-edit-20-types.log.

Mode des revues : séquentiel, même agent, non indépendant. Design : satisfaisant pour cette présentation, vrais titres et sections, chemins explicites et tableaux mobiles consultables ; acceptation visuelle humaine différée. Technique/QA : satisfaisant, même classification et mêmes entrées, sélection stable et filtres préservés, types et parcours réussis. Sécurité : aucun nouveau transport, droit ou entrée externe ; textes React échappés, aucune modification du writer. Pas de revue d’instructions/distribution nécessaire, aucune procédure ou livraison autonome modifiée. Pas de conformité exhaustive d’accessibilité revendiquée.

85 fichiers non suivis préexistants conservés ; aucune configuration privée publiée. Intégration locale autorisée ; suite : recette humaine, sans nouveau chantier ouvert. Aucun push, déploiement ou publication. Modèles de suivi de l’app non initialisés, G/J5 inchangés.
