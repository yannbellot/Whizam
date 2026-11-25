# Langues du projet

Les langues de l’application et celles de la documentation/Storybook se choisissent séparément. Cette page explique leur enregistrement, leur reprise et la maintenance des traductions. Le [cadrage initial](project-intake.md) recueille ces choix en Q9 et Q10 sous les instructions AGENTS ; la langue de conversation ne les détermine pas. Les commandes, identifiants et commits restent en anglais.

## Choix et reprise

Q9 et Q10 utilisent les choix uniques natifs Français / English / Français et English / Autre combinaison de langues selon le cadrage canonique ; aucune sélection multiple n’est nécessaire. La migration du stock n’est proposée que pour une langue documentaire supplémentaire autre que fr/en, après constat de traductions réellement manquantes et si aucune décision n’est connue. Français, English ou les deux seuls ne déclenchent jamais cette question. Ne pas proposer de traduction d’hypothétiques contenus. Sans migration du stock demandée, conserver les versions existantes et appliquer le choix aux nouveaux contenus ; un champ technique de préférence ne justifie pas une question supplémentaire. Pour le contrat v2, `translation: later` représente l’absence de migration du stock autorisée ; `now` exige une décision explicite de traduction.

Lire `.documentation-language.local/choice.json` dans la copie courante. Les anciens contrats `{ "version": 1, "language": "fr" }`, `en` et `bilingual` restent lisibles sans nouvelle question. Ne pas restaurer l’ancien choix d’assistant. Lire le brief et le point de reprise avant de demander une langue manquante.

Le nouveau contrat est `{ "version": 2, "languages": ["fr", "es"], "defaultLanguage": "fr", "translation": "now" }`. `translation` vaut `now` pour traduire le stock actif avant présentation, ou `later` pour conserver le stock et rédiger les nouveaux contenus dans les langues choisies. Identifiants normalisés : `fr`, `en`, `es`, `pt-BR`, `zh-Hant`, etc. Au moins une langue unique ; la langue initiale appartient à la sélection. Proposer la première sélectionnée comme langue initiale dans la synthèse sans question supplémentaire imposée. Les langues métier restent indépendantes dans le brief.

Après réponse explicite, enregistrer avec `node scripts/documentation-preference.mjs set-locales fr,es fr now`. Les anciennes commandes `set fr|en|bilingual` restent compatibles. Écriture minimale privée atomique ; état invalide ou lien symbolique refusé sans écrasement. Si l’écriture échoue, annoncer la limite de reprise. Aucune préférence du mainteneur dans le modèle distribué. La langue consultée dans le navigateur ne modifie pas la préférence de rédaction.

## Rédaction et traduction

Les sources canoniques et autorités restent uniques. Les historiques gardent leur langue et leur portée. Les guides FR/EN livrés restent entretenus. Un changement de préférence ne traduit pas silencieusement un stock ; sa traduction doit figurer dans le périmètre proposé et autorisé.

Pour chaque langue supplémentaire, l’assistant rédige après autorisation `translations/<locale>/registry.json` : version 1 et dictionnaire `documents` indexé par chemin canonique, chaque entrée contenant `sourceHash` (SHA-256 du texte canonique). Placer chaque traduction au même chemin sous `translations/<locale>/`. Déclarer la langue canonique dans `organization.documents[chemin].language` du catalogue documentaire si nécessaire. Conserver l’ordre et le nombre des titres, les liens relatifs et les ancres sources. Ne pas actualiser une empreinte sans réconcilier le texte.

## Portail et présentation

Ajouter `translations/<locale>/presentation.json` avec `version: 1`, `name` (nom affiché), `themeLanguage` (code supporté par le thème), `home` (Markdown de l’accueil), `navigation` (dictionnaire complet des titres canoniques de navigation) et `pages` (Markdown des pages structurelles générées, notamment `_portal/steps.md` si publiée). Traduire également les inventaires générés via le registre de cette langue, sans éditer leurs dérivés. Une entrée manquante échoue explicitement. Vérifier les ressources du thème et les écritures demandées, dont droite à gauche ; aucune prise en charge universelle du thème n’est garantie.

Chaque langue possède sa sortie et sa recherche. Préserver URL FR/EN, anciennes URL françaises et ancres. Les générations ne traduisent rien et n’appellent aucun fournisseur ; l’assistant prépare les traductions dans le projet. La publication reste atomique après réussite de tous les builds. `npm run docs:translations:check` contrôle la couverture ; un build seul ne prouve pas une traduction complète. Les sélecteurs ne doivent pas laisser croire qu’une traduction absente est achevée.

## Storybook

Le sélecteur contient les langues supplémentaires choisies. Ajouter pour chacune `translations/<locale>/storybook.json` avec `version: 1` et `messages`, dictionnaire indexé par le texte français des libellés structurels et descriptions d’accessibilité. Les valeurs sont rendues comme texte React, jamais exécutées comme HTML.

`LocalizedDocumentation` accepte `translations`, dictionnaire de contenus React par code de langue, en plus de `fr` et `en`. Les nouveaux composants du projet doivent documenter les langues choisies. Une traduction absente est signalée explicitement avec la source. Vérifier les libellés structurels et explications propres aux stories avant d’annoncer une traduction complète. Conserver identités et variantes des stories, composants et tokens. Les menus des extensions ne sont pas promis traduits.

## Première présentation et changement

Si la traduction du stock est acceptée à Q10, la réaliser et la contrôler avant la première présentation de Storybook et Documentation, ou signaler explicitement ce qui manque sans annoncer une qualification complète. L’application peut être présentée indépendamment. Si elle est reportée, conserver les contenus existants et appliquer les langues choisies aux nouveaux contenus. Après changement de préférence, reconstruire les sorties et redémarrer Storybook si nécessaire. La disponibilité d’un sélecteur ne prouve pas la couverture. Les réponses et décisions ouvertes sont réutilisées entre conversations.
