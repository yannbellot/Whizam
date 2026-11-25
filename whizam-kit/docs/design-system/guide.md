# Comprendre et faire évoluer le design system

Le design system relie les valeurs visuelles, les composants React et leurs exemples. Pour comprendre une modification, suivre son chemin : sources du projet → génération → application et Storybook. La [politique](policy.md) définit les règles ; l’[architecture](architecture.md) détaille les fichiers et la publication.

## Tokens et nommage

Une primitive porte une valeur brute typée. Un token de composant décrit un usage, avec propriétaire, variante, partie et état. Un token local décrit une composition de page. Les deux derniers référencent directement une primitive compatible. Par exemple, `component.button.default.root.background.default` référence `primitive.color.hex-1d4ed8`.

Une primitive consommée reste stable. Pour changer un usage, créer ou réutiliser une primitive, puis réaffecter uniquement le token concerné dans `src/design-system/authority/tokens.tokens.json`. Changer une couleur partagée demande d’identifier tous les usages à modifier. Une apparence différente d’un composant devient une variante explicite.

## Exemple : changer le fond d’un bouton

Demandez : « Change le fond du bouton dans son état par défaut, en conservant son survol et son focus. » L’assistant identifie le token ci-dessus et ses consommateurs, réutilise une primitive compatible ou en crée une, puis modifie sa référence. Il conserve les états non concernés et vérifie lisibilité, contraste et clavier. Les fonctions `ensurePrimitive` et `retargetToken` du générateur permettent de préparer cette réaffectation en mémoire ; la sauvegarde de l’autorité reste explicite.

Depuis la racine du kit :

```bash
npm run design-system:sync
npm run design-system:check
npm run test:design-system
npm run build
npm run build-storybook
```

La synchronisation génère CSS, utilitaires, inventaires et stories. Ne pas éditer ces sorties. Examiner le bouton dans l’application et dans les exemples du projet ; vérifier aussi les états conservés. Un build réussi ne remplace pas cet examen.

## Composants, variantes et exemples

Pour créer ou adopter un composant, l’assistant examine d’abord les composants existants. Il maintient l’implémentation dans `src/design-system/components/`, les tokens et le contrat dans `src/design-system/authority/components.yaml`. Les fichiers `*.examples.tsx` décrivent les variantes et états réellement disponibles ; ils sont rédigés, tandis que les stories sont générées. Toute modification conserve les interactions, libellés, erreurs et contrôles clavier/focus nécessaires.

Exemple : pour adopter Button dans le projet, adapter ses exemples aux usages convenus, vérifier les états default, hover, disabled et loading effectivement déclarés par son contrat, synchroniser, puis sélectionner sa story générée. Pour un nouveau composant, fournir de la même façon l’implémentation, le contrat et chaque exemple requis avant la synchronisation. Le générateur refuse un contrat ou un exemple requis manquant.

## Publier dans Storybook

Trois opérations distinctes sont nécessaires : générer les stories, sélectionner les éléments du projet dans `.storybook/project.json`, puis les classer. Ajouter à `stories` le chemin CSF généré et son identifiant `component` selon le contrat existant. `tokenIds`, `primitiveIds` et `rules` sélectionnent les autres contenus ; `classification` organise les éléments déjà sélectionnés sans les adopter ni changer leurs valeurs. Suivre les champs et destinations de l’[architecture Storybook](architecture.md#organisation-et-publication-storybook).

Relancer Storybook après ajout ou retrait de déclaration pour recalculer son index. Vérifier le composant, ses variantes, états et tokens dans sa destination. Un élément non classé peut apparaître dans All avec un diagnostic ; le classement seul ne publie rien. Storybook permet la consultation et les interactions fictives des exemples, sans enregistrer de réglage visuel.

## Ressources du kit et éléments de votre projet

Le kit neuf contient des ressources réutilisables mais sa sélection Storybook est vide. L’inventaire technique local `docs/design-system/style-inventory.md` couvre les sources présentes dans le kit, y compris des ressources héritées ; il ne décrit pas à lui seul les composants adoptés par votre projet. Le catalogue Storybook suit la sélection explicite du projet. Ces deux périmètres expliquent la présence de tokens dans les sources avant toute adoption.

Pour une ancienne copie équipée d’un éditeur, consulter la [migration](token-migration.md). Elle demande une copie compatible et des vérifications propres ; aucune mise à jour automatique des projets existants n’est effectuée.
