# DS-EDIT-17 — Navigation hiérarchique

31 octobre 2026 — cible application, base 61095ef, candidat runtime ff1738dac69c6ae5d7be273dac8c93c6587b2606, branche codex/ds-edit-17-hierarchical-navigation. [Mandat](../work-items/ds-edit-17-hierarchical-navigation.md), [règle de référence](../design-system/token-organization.md). **En revue — qualification technique acquise, acceptation humaine différée.**

## Résultat et conservation

Les catalogues ont une navigation distincte du tableau : catégories parentes et feuilles, dépliage/repliage natif au clavier, compteurs, filtre des descendants, catégorie active et retour All. Primitives, Semantic tokens et Component tokens utilisent uniquement les catégories anglaises déjà définies. Les catégories des tokens de composants sont leurs noms officiels. Aucun groupe vide ni nouvel axe n’est créé. Sur mobile, la navigation précède le tableau ; chaque zone défile dans son propre conteneur. Les longues identités restent intégrales, avec défilement horizontal du tableau.

Une sélection externe ouvre les ancêtres et révèle le token ; parcourir une catégorie ne modifie aucune attribution. Les primitives restent en consultation. La sauvegarde conserve les opérations et gardes existantes. Le manifeste fermé inclut les trois nouvelles dépendances ; son changement de révision impose de conserver les anciennes racines avec leurs reçus, sans les convertir.

Le modèle canonique est profondément identique au témoin DS-EDIT-16 et le CSS généré identique octet par octet. Les quatorze captures de composants, leurs géométries et styles calculés sont identiques au témoin conservé ; les 188 raccordements changent encore leur propriété réelle et restaurent leur état. Les modifications de présentation concernent les catalogues seulement. Aucune source de valeur, identité, référence, provenance ou feuille CSS des composants n’est changée.

## Contrôles exécutés

macOS arm64, Node embarqué 24.22.1 et Chromium existant ; aucune installation globale ni dépendance ajoutée. Logs et témoins privés dans .local/ds-edit-17.

| Contrôle | Résultat |
| --- | --- |
| npm run typecheck | Conforme, campagne finale |
| npm test | 124 tests réussis dans 17 fichiers, campagne finale |
| npm run test:design-system | 62 tests réussis |
| npm run lint | Zéro erreur ; avertissement préexistant sur une copie non suivie préservée |
| npm run format:check | Conforme |
| npm run docs:design-system:check | Documentation générée à jour |
| npm run build-storybook | Réussi |
| npm run test:design-editor:dev, ciblage hierarchy/taxonomy/rules | Deux cas desktop réussis initialement ; hierarchy corrigé puis réussi seul ; deux cas hierarchy/taxonomy mobile réussis sur le code final |
| npm run test:design-editor:persistence, ciblage component-tokens | Deux cycles réussis desktop/mobile, puis build et relecture applicative compilée |
| Comparaison isolée des composants | 14 PNG strictement identiques, styles/géométries identiques et 188 propriétés raccordées |
| npm run validate:agent-kit | 21 skills, quatre rôles et références conformes ; validation structurelle seulement |
| Recette réelle 54118 | Filtres parent/feuille, repli clavier, primitives et Button contrôlés à 1280 et 390 px ; aucune erreur de page |
| Conservation finale | 61 fichiers préexistants intacts ; huit sources YAML de recette identiques à l’ancienne racine ; modèle enregistré et modèle/CSS canoniques identiques |

Le premier parcours hierarchy comptait tous les tbody, incluant un groupe structurel sans catégorie. L’assertion cible maintenant les tbody nommés ; le nombre réel de tokens demeure vérifié. Le premier lint a refusé une mise à jour d’état dans un effet : le Builder l’a remplacée par une mise à jour gardée à réception d’une nouvelle sélection/révélation, puis types, unitaires, lint, mobile et persistance passent. Un contrôle manuel de conservation utilisait le mauvais chemin de CSS ; le chemin src/styles/tokens.generated.css a été corrigé avant le contrôle réussi. Les échecs initiaux restent dans les logs privés. Aucun seuil ni garde de sauvegarde n’a été réduit.

## Recette actualisée

La recette sur 54118 utilise une extraction du candidat, avec ses huit sources v3 enregistrées copiées sous réservation de lecture depuis la recette DS-EDIT-16. Modèles profondément identiques ; Button conserve #b51a00. Ni journal, reçu ni connexion ne sont transférés. L’ancien serveur de cette recette a été arrêté après vérification de sa racine ; sa racine reste intacte. Les autres recettes restent conservées.

L’onglet courant a été rechargé et le filtre Button vérifié avec ses quinze tokens et #b51a00. [Capture de l’onglet courant](ds-edit-17/current-recipe.jpg), [tokens desktop](ds-edit-17/catalog-desktop.png), [tokens mobile](ds-edit-17/catalog-mobile.png), [primitives desktop](ds-edit-17/primitives-desktop.png), [primitives mobile](ds-edit-17/primitives-mobile.png), [preuve structurée](ds-edit-17/qualification.json).

## Revues et limites

Mode réel : **séquentiel, même agent, non indépendant**, procédures review-design, technical-review et security-review à la base 61095ef.

Design Reviewer — satisfaisant avec réserve de recette humaine. Fidélité : valeurs et rendus des composants conservés par comparaison exacte ; la nouvelle navigation réalise le mandat. Expérience : hiérarchie lisible, parents/feuilles actifs, clavier natif et formats desktop/mobile contrôlés. Réserve : accepter humainement la densité et le défilement des longues identités ; aucune référence Figma ni conformité exhaustive d’accessibilité revendiquée.

Technical Reviewer / QA — satisfaisant dans le périmètre. La taxonomie existante alimente l’arbre et les filtres par frontière de chemin ; les parents totalisent leurs descendants. Le manifeste comprend toutes les nouvelles dépendances et le cycle de persistance/relecture fonctionne. Anciennes données et racines conservées. Les suites complètes HTTP/récupération, l’installation autonome avec dépendances propres, SQL et les autres plateformes ne sont pas répétées : protocoles, dépendances et stockage hors changement ; les qualifications précédentes restent historiques. La copie de recette réutilise les dépendances locales et ne constitue pas une nouvelle qualification de distribution.

Security Reviewer — satisfaisant pour ce diff local : libellés React échappés, chemins de catégories issus de la taxonomie validée, navigation sans écriture ni nouveau point d’entrée. Aucun domaine, permission, secret ou transport ajouté. Le manifeste reste fermé ; aucun compte ou journal ancien migré. Pas de scan externe ni certification. Instruction Reviewer et Distribution Reviewer non applicables à cette tranche : procédures d’agents et mécanisme de distribution inchangés.

**Doc updated.** Fichiers fonctionnels : CatalogNavigation, PrimitiveCatalog, TokenCatalog, category-tree, feuille scoped de navigation et manifeste ; tests unitaires/parcours et documentation correspondants. Aucun push, service distant, publication, compte IA ou modèle applicatif de suivi initialisé. G/J5 et recette humaine restent distincts. Prochaine action : intégration locale de la tranche qualifiée, puis recette humaine sur 54118, sans autre chantier ouvert.
