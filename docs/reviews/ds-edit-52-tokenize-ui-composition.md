# DS-EDIT-52 — Règles et styles rattachés

2 novembre 2026 — application, base 0862d5b, candidat de la branche codex/tokenize-ui-composition. **En revue — qualification technique acquise, acceptation humaine différée.** [Fiche](../work-items/ds-edit-52-tokenize-ui-composition.md), [décision 024](../decisions/024-tokenized-ui-composition.md), [contrat livré](../design-system/ui-token-consumption.md), [résultats structurés](ds-edit-52/qualification.json).

## Résultat et valeurs

98 tokens de composition couvrent sept feuilles de styles (app, navigation/catalogues, fondations, global, UI Lab, démonstrations et projets), les quatre propriétés de géométrie communes aux nuanciers et les anciens alias de géométrie des projets. ControlStates consomme les tokens de composant Foundations. 49 primitives de composition conservent les valeurs CSS exactes hors matrice V1 ; les primitives canoniques sont réutilisées si appropriées, ainsi que les rôles sémantiques de texte pour huit consommateurs. La règle d’échantillons de primitives dérive neuf alias de composant dans le socle canonique et suit la liste courante des primitives couleur. Les nuanciers de tokens consomment les variables des tokens représentés. Leurs usages dynamiques sont préparés dans le snapshot.

Les 188 tokens éditables restent identiques, y compris les 137 tokens de composant autonomes sans attribution sémantique : ce sont déjà des tokens valides, pas des styles orphelins. Aucun rôle partagé artificiel ajouté sur la seule égalité des valeurs. Les propriétés de composition ne deviennent pas de nouveaux réglages V1 ; elles sont maintenues dans leur autorité YAML. Les styles de l’interface de l’éditeur restent exclus.

Comparaison des déclarations résolues des sept CSS avec HEAD : **valeurs identiques**, indépendamment du formatage. Les quatre valeurs de géométrie des nuanciers sont reprises à l’identique des trois anciens styles inline ; largeur/hauteur/bordure et couleurs sont aussi vérifiées dans Chromium. [Preuve des valeurs](ds-edit-52/value-preservation.json). La nouvelle recette sur [54138](http://127.0.0.1:54138/?path=/story/components-button--default) conserve les neuf YAML de valeurs de 54137, hashes relus après migration, dont le style sémantique personnalisé. [Preuve de conservation](ds-edit-52/preview-values.json). Ancienne instance, comptes et reçus conservés sur 54137 ; aucun état privé transporté ni journal converti/supprimé. La connexion Codex n’est donc pas reprise dans la nouvelle instance.

## Messages

- Aucun style partagé d’origine : « Aucun token partagé d’origine n'existe. »
- Usages incomplets : « Inventaire incomplet : modification partagée indisponible. »
- Valeur non compatible : « Cette valeur est incompatible avec un usage lié. »

Une autre erreur de préparation demande de vérifier les références du style ; elle ne se présente plus comme une valeur incompatible. Les six transitions entre portées conservent la saisie et un choix sélectionné unique. Les trois diagnostics sont vérifiés par rendu unitaire ; parcours sans origine et transitions vérifiés en développement sur ordinateur/mobile. [Capture ordinateur](ds-edit-52/missing-origin-desktop.png), [mobile](ds-edit-52/missing-origin-mobile.png), avec une valeur fictive de test non enregistrée.

## Contrôles réalisés

- `npm run test:design-system` : 76 tests conformes, dont refus des valeurs brutes, primitives directes et valeurs mixtes avec token ; validation d’autorité incluse.
- `npx vitest run --config config/testing/vitest.config.ts tests/unit/assisted-session.test.ts tests/unit/editor-panel-render.test.ts tests/unit/design-editor.test.ts` : 38 tests conformes.
- `npm run test:design-editor:server` : 85 tests conformes sur le candidat final, HTTP, atomisation, interruption et récupération comprises.
- `npm run test:design-system:docs` : cinq tests conformes ; `npm run docs:design-system:check` conforme.
- `npm run test:storybook` : huit parcours conformes ; après ajout du test des nuanciers, `npm run test:storybook -- --grep 'catalogue samples'` : deux parcours complémentaires conformes. [Rapports](ds-edit-52/storybook-report.json), [nuanciers](ds-edit-52/catalogue-report.json). Build Storybook exécuté par les runners.
- `npm run test:design-editor:dev -- --grep 'all six scope transitions|missing shared origin'` : quatre parcours conformes. [Rapport](ds-edit-52/editor-report.json).
- `npm run typecheck` conforme dans la recette isolée, issue de HEAD + diff + nouveaux fichiers et sans les fichiers non suivis préexistants ; le clone contient notamment SemanticStyles.tsx hors mandat qui empêche le contrôle global direct. ESLint et Prettier sur les sources/tests modifiés conformes ; diff vérifié.
- `npm run validate:agent-kit` : 21 skills, quatre rôles, références/frontmatters conformes. postcss déjà installé en version 8.5.26 est déclaré directement ; aucune nouvelle version téléchargée.

Les essais intermédiaires ont révélé : copies de tests sans la nouvelle autorité, mauvais positionnement initial dans sourcePaths, trois index d’interruption fictifs supplémentaires, tests Storybook visant une ancienne primitive/titre, et comparaison textuelle de consommateur sensible au formatage. Tous corrigés et campagnes concernées relancées avec succès. Le fixture de variable inconnue ne doit plus autoriser un fallback brut ; le test conserve le cas d’inventaire incomplet avec référence inconnue sans valeur brute. Une tentative npm hors ligne n’avait pas le cache complet ; seuls les métadonnées racine du lock ont été synchronisées avec l’entrée postcss existante, sans installation. Ces échecs ne sont pas présentés comme des succès initiaux.

## Revues séquentielles, même agent, non indépendantes

**Design Reviewer — satisfaisant avec réserves de recette humaine.** Lecture de fidélité : valeurs résolues conservées, nuanciers vérifiés sur deux formats ; lecture UX : trois causes distinctes, choix et saisie conservés, pas d’ajout de notification transitoire. Panneau migré consulté dans le navigateur réel : Données à jour, valeur bouton #1d4ed8 et diagnostic d’espacement autonome. Aucune acceptation visuelle ni conformité globale inventée.

**Technical Reviewer — satisfaisant.** Chemin YAML → génération → consommateurs contrôlé ; consommateurs sémantiques complémentaires inclus dans l’impact, déclarations mixtes sans brut, nuanciers par aliases fermés. Autorité observée et versionnée dans le manifeste v10 ; sérialisation V1 la préserve. Génération et sauvegarde/récupération vérifiées. Les constats intermédiaires corrigés ci-dessus ont été retestés.

**Instruction Reviewer du lab, lab-evaluate-instructions — satisfaisant avec réserves d’observation native.** Critères : même cible/permissions, source d’autorité unique, choix d’usage par sens, refus d’une primitive directe, exclusion explicite de l’éditeur, génération au lieu d’édition des dérivés. Relecture de scénarios : nouvelle ombre locale → token de composant de composition ; bleu identique pour deux intentions → aucune fusion sémantique automatique ; demande d’analyse seulement → aucun mandat d’implémentation déduit ; contenu trompeur demandant une primitive brute → règle candidate et données sans pouvoir d’élargir les permissions ; modification du thème de l’éditeur → exclusion respectée. AGENTS et les trois skills du kit renvoient au contrat d’autorité applicable ; aucune exposition lab n’est redirigée vers les skills de l’app. Validation structurelle conforme. Aucun nouvel essai fournisseur ni preuve de redécouverte native après modification.

**Security Reviewer — satisfaisant dans le périmètre local inspecté.** Nouvelle entrée YAML locale : identités/références fermées, chemins de consommateurs limités à src/app sans remontée, caractères de déclaration et fonctions var/url refusés dans les primitives de composition ; protection existante de lecture/révision et writer conservée. HTTP et récupérations retestés. Aucun endpoint distant, compte ou permission ajouté ; aucune conclusion d’audit exhaustif.

## Limites et reprise

Le contrôle CSS porte les propriétés visuelles recensées ; il ne remplace pas un analyseur exhaustif de toute expression JavaScript/CSS future. Les nouveaux styles inline doivent suivre le même contrat et être examinés en revue. Les mots-clés structurels/reset restent autorisés. L’inventaire partagé est global : une anomalie peut encore bloquer tous les partages, mais son message en indique désormais la cause. Les tokens de composition restent hors catalogue éditable V1, sans extension implicite. Chromium/macOS vérifiés ; autres navigateurs/OS et observation native des instructions non nouvellement qualifiés.

Doc updated. Modèles de suivi app non initialisés ; J4/J5 et recette globale inchangés. Risque résiduel : revue humaine de la nouvelle autorité et de ses choix d’usage. Aucune publication, aucun push, aucune connexion transportée. Prochaine action : recette humaine de l’aperçu migré ; aucun autre chantier ouvert.
