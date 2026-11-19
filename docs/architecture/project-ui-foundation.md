# Socle UI du projet

Le projet possède son propre design system : valeurs et références en JSON DTCG dans `src/design-system/authority/tokens.tokens.json`, règles et présentations dans les YAML adjacents. Les identités et alias historiques `--adl-*` sont conservés. Aucun thème ni composant du chrome Loomata n’est requis pour exécuter les pages produit.

## Styles et composants

`src/styles/project.css` compile Tailwind v4 avec le préfixe `project:`, sans Preflight global. La détection vise les consommateurs explicitement déclarés. `project-theme.generated.css` expose un thème typé et des utilitaires fermés `token-<part>-<property>-<state>`, par exemple `project:token-root-background-default`. Ces utilitaires lisent `--adl-local-*` ; les variantes et substitutions par occurrence restent ainsi effectives. Les valeurs ne se recopient pas dans une configuration Tailwind.

Button utilise le hook React Aria `useButton` sur HTML et Field compose React Aria Components ; tous deux consomment ces utilitaires. Button conserve ses props HTML, `disabled`, `loading` et son `onClick` natif ; les appels ne sont pas réinterprétés en `onPress`. Field conserve nom, valeur initiale, required, aide/erreur et multiline, avec label et descriptions associés. HTML sémantique et CSS Modules restent autorisés pour les composants non convertis et les besoins spécialisés. Ne pas retirer une dépendance UI tant qu’un consommateur existe.

Pour étendre la famille : déclarer les consommateurs dans la fiche YAML, les sources détectées dans l’entrée CSS, puis les classes statiques et leurs états. Le contrôle du pipeline refuse les valeurs arbitraires, les références chrome et les utilitaires non préparés dans cette famille. Un nouveau consommateur contrôlé rejoint la liste `projectConsumers` du générateur. Le modèle conserve cinq responsabilités : Primitives, Decision Tokens, Component Tokens, Components et Patterns.

## Génération et enregistrement

`npm run tokens:generate` prépare les dérivés sur une instance inactive sans récupération en cours. Le writer existant enregistre les sources et le thème dérivé dans la même transaction, puis relit le résultat. Ne pas modifier un dérivé à la main, ajouter un watcher qui publie en parallèle, supprimer un verrou ou convertir un ancien reçu. Toute récupération utilise l’outillage de sa version.

## Exécution autonome

Depuis ce dossier, avec la version Node/npm déclarée et les dépendances installées par la procédure du README : `npm run build`, puis `npm run start` pour le runtime web ; `npm run build-storybook` pour la documentation statique et `npm run storybook` pour son développement. Aucun compte IA, contenant natif, installation ou service Loomata externe requis. Les composants et données métier d’un projet suivent son brief ; une page d’accueil initialisée n’est pas une première version métier réalisée. Les outils de conception conservés dans le dossier ne sont pas des imports runtime des pages produit.

Avant livraison : `npm run validate:design-system`, `npm run docs:design-system:check`, `npm run typecheck`, `npm run lint` et les tests adaptés ; vérifier les parcours clavier, erreurs et soumission ainsi que les composants non convertis. Les sites et web apps peuvent viser desktop et mobile selon leur brief. Les navigateurs et modes effectivement testés doivent être indiqués ; aucune compatibilité native n’est déduite du socle web.

## Création et exports

La création sélectionne `scripts/project-files.json` ; l’export projet sélectionne les sources sauvegardées avec ses filtres propres. Qualifier les deux séparément, avec dépendances internes complètes et sans état privé, installation parent ou chemins hôte. Un brouillon non enregistré n’est pas exporté comme source courante. L’export outil utilise l’inventaire fermé du kit et doit encore pouvoir créer un projet. Aucun projet existant n’est actualisé automatiquement par une évolution du socle ; ses journaux et valeurs restent sous sa version.
