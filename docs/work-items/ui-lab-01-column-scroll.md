# UI-LAB-01 — Défilement des colonnes

10 novembre 2026 — cible application ; préparation puis réalisation autorisées par la demande de défilement interne aux trois colonnes du UI Lab. Base `623b3326d95b1d02f5e42e1af236c0986b09bc9d`, branche `codex/ui-lab-column-scroll`. Les fichiers non suivis préexistants (copies ` 2`, `.storybook/editor/`, `frontend/`) sont exclus.

## Périmètre et critères

Limiter l’atelier `/ui-lab` à la fenêtre, conserver son en-tête et rendre indépendants navigation, aperçu et réglages pour toutes ses scènes. À largeur mobile, conserver les vues Aperçu/Réglages et rendre navigation et vue active accessibles sans défilement de page. Les routes de référence et le document embarqué restent des contenus consultables ; leur défilement appartient à leur zone de contenu et non au cadre de l’atelier. Aucun changement des valeurs du design system, données, services ou distribution macOS déjà construite.

Hypothèse réversible : sur mobile, la navigation occupe un tiers de la hauteur restante et la vue active deux tiers. Revue humaine du confort à prévoir. Choix technique : flex et grille bornés, `min-height: 0`, défilement interne et confinement de la molette. Les mots-clés et dimensions de viewport sont structurels, sans nouveau token visuel.

Procédures applicatives explicitement retenues depuis le catalogue au HEAD de base : implement-feature, test-user-flow, review-design ; revue séquentielle, même agent, non indépendante. Développement localisé : GPT-6.1 Sol · Moyenne recommandé ; aucun réglage modifié ni vérifié.

## Contrôles prévus

Génération et contrôle documentaire du design system, TypeScript, lint ciblé ; navigateur Chromium desktop/mobile, scènes courtes/longues, ouverture des groupes et changement de vue, absence de débordement global et défilement indépendant. Revue design du rendu et technique du diff ; sécurité limitée à la constatation de l’absence de changement des frontières d’accès. Aucun compte ou publication.

## Résultat

**En revue — qualification technique acquise, acceptation humaine différée.** Version : diff de la branche sur la base citée, puis commit local de cette fiche. Doc updated.

Fichiers : `src/ui-lab/editor/workspace.module.css`, `navigation.module.css`, `tests/e2e/ui-lab.spec.ts`, `docs/design-system/editor-preview.md`, cette fiche ; consolidation dans ROADMAP et état racine du lab. Aucun token visuel ni dérivé modifié.

Contrôles exécutés avec `bash scripts/with-runtime.sh` depuis le kit :

- `npm run tokens:generate` et `npm run docs:design-system:check` : PASS.
- `npm exec -- eslint src/ui-lab/editor/Workspace.tsx tests/e2e/ui-lab.spec.ts` et Prettier ciblé : PASS.
- `npm run build` : PASS client/serveur ; avertissements existants sur fonts non résolues, annotations Zod, taille du bundle et options Router conservés.
- `npm run typecheck` : FAIL sur quatre copies non suivies `catalog-stories/* 2.tsx` important un ancien fichier Storybook absent. Diagnostic sans modification des copies : `npm exec -- tsc -p .local/tsconfig.column-scroll.json`, configuration ignorée étendant celle de l’app et excluant seulement les copies ` 2` de src/tests : PASS. Le contrôle global brut reste en échec préexistant ; les sources actives sont vérifiées.
- `npm run test:e2e -- --grep 'independently scrolling columns'` : **2 PASS**, Chromium 1280×800 et 390×844. Activation de toutes les entrées de scènes présentes dans le DOM et absence de défilement/débordement global ; attente d’un aperçu Button prêt, défilement effectif des réglages et de l’aperçu, navigation conservée, bascule mobile et captures. Les sélections rapides ne prouvent pas le chargement complet de chaque scène ; la structure commune et les contenus Button sont éprouvés. Preuves locales ignorées : `test-results/report.json` et dossiers `ui-lab-keeps-workshop-scen-378f3-pendently-scrolling-columns-{desktop,mobile}/column-scroll.png`.

Échecs de campagne conservés ici : première ouverture de port refusée par le sandbox, puis exécution autorisée ; première campagne perturbée par un build parallèle et attente insuffisante avant mesure (2 FAIL). Build supplémentaire terminé, attente du réglage prêt ajoutée ; retest isolé 2 PASS puis extension à l’aperçu et retest final 2 PASS. Aucun serveur existant utilisé comme cible.

Revues séquentielles, même agent, non indépendantes : **design satisfaisant** sur les captures desktop/mobile et les gestes testés ; en-tête et vues accessibles, contenu long borné. **Technique satisfaisante avec réserve préexistante TypeScript** : changement CSS structurel commun aux scènes, aucune dépendance/autorité de token changée ; routes de référence et aperçu embarqué conservent leur propre contenu. **Sécurité : aucune surface modifiée**, pas de nouvelle entrée, accès, connexion ou permission applicative ; audit complet non requis pour ce changement structurel. Aucun problème bloquant dans le diff.

Risque résiduel : autres navigateurs, zoom et fenêtres de très faible hauteur non qualifiés ; confort mobile à confirmer humainement. La distribution macOS déjà empaquetée n’est pas reconstruite. Aucun push, publication ou acceptation J4/J5. Reprise : recharger l’atelier issu des sources et recueillir le retour du designer.
