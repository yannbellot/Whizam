# DS-EDIT-52 — Consommation UI par tokens

2 novembre 2026 — application, base 0862d5b, branche codex/tokenize-ui-composition.

Mandat validé : aucun consommateur UI ne référence directement une primitive ou une valeur visuelle brute ; rattacher les styles existants selon leur usage et distinguer absence de token partagé, inventaire incomplet et valeur incompatible. L’éditeur Storybook reste exclu ; aucun ajout de réglage éditable V1, changement de valeur ou publication.

Critères : références fermées et justifiées, valeurs conservées, génération reproductible, impact sémantique comprenant les nouveaux consommateurs, sauvegarde/récupération conservées, trois diagnostics distincts, règles transmissibles dans le kit.

Choix techniques délégués : autorité complémentaire de composition hors matrice V1 ; 98 tokens, 49 primitives CSS, réutilisation des primitives canoniques et de huit rôles de texte ; règle de nuanciers dérivant 9 alias de composant dans le socle. Les 188 tokens éditables existants sont déjà des tokens de composant et restent valides avec ou sans attribution sémantique. postcss 8.5.26 déjà installé/transitif est déclaré directement, sans installation ni nouvelle version. Décision [024](../decisions/024-tokenized-ui-composition.md), [contrat livré](../design-system/ui-token-consumption.md).

Procédures : lab-maintain-agent-kit pour le maintien d’instructions ; procédures applicatives implement-feature, normalize-design-system, review-design et technical-review sélectionnées dans le catalogue de l’app, version qualifiée 0862d5b. Revue d’instructions via lab-evaluate-instructions. Même agent successif, aucune indépendance revendiquée.

Contrôles et revue : [dossier de preuves](../reviews/ds-edit-52-tokenize-ui-composition.md). Préexistants non suivis et données des anciennes recettes conservés. Les modèles de suivi de l’app restent non initialisés ; statut consolidé dans le lab. En revue — qualification technique acquise, acceptation humaine différée. Reprise : recette visuelle sur 54138. Doc updated.
