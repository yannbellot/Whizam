# Storybook et le design system

**Le design system rassemble les règles visuelles et les composants réutilisables de votre projet.** Il permet de construire une interface cohérente et de la faire évoluer en conservant ses choix de conception.

**Storybook vous permet de consulter ce design system et d’examiner les composants séparément des pages de l’application.** Vous pouvez y retrouver leurs variantes, leurs états et des exemples d’utilisation.

## Ouvrir Storybook

Dans votre conversation avec l’assistant, demandez :

> Ouvre Storybook pour examiner les composants de mon projet.

L’assistant vérifie le service et vous donne un accès au catalogue de votre projet.

Dans un kit neuf, **les rubriques sont présentes, mais elles peuvent être vides**. Le catalogue s’enrichit avec les éléments créés ou adoptés pour votre projet.

## Se repérer dans Storybook

Le catalogue est organisé en trois rubriques.

### Foundations — Les fondations

Cette rubrique présente les principes et les règles de construction de votre interface, ainsi que ses valeurs visuelles : couleurs, typographie, espacements, dimensions ou arrondis.

Vous y retrouvez notamment les **primitives** et les **tokens**, qui décrivent les valeurs utilisées et leur affectation dans l’interface.

### Components — Les composants

Cette rubrique rassemble les éléments réutilisables de votre projet : boutons, champs de formulaire, composants de mise en page et autres éléments développés selon vos besoins.

**Chaque composant peut proposer plusieurs variantes et états.** Par exemple, un bouton peut avoir une variante principale ou secondaire, et des états au survol, au focus ou lorsqu’il est désactivé.

Les variantes et états disponibles dépendent de ce qui a été réalisé et documenté pour votre projet.

### Patterns — Les interactions réutilisables

Cette rubrique présente des compositions de composants ou des enchaînements d’interactions réutilisables.

Un pattern peut, par exemple, décrire la validation d’un formulaire avec ses messages d’erreur et sa confirmation.

## Comprendre les primitives et les tokens

Le kit distingue trois catégories :

- **Les primitives** définissent les valeurs de base : une couleur précise, une taille de texte ou une valeur d’espacement.
- **Les tokens de composant** associent ces valeurs à une partie, une variante ou un état d’un composant.
- **Les tokens locaux** associent ces valeurs à la composition d’une page particulière.

Par exemple, la couleur de fond d’un bouton principal est définie par un token de composant qui référence une primitive de couleur.

**Une même valeur peut être utilisée à plusieurs endroits sans que ces usages doivent toujours évoluer ensemble.** Lorsque vous demandez une modification, l’assistant doit donc identifier les éléments concernés pour en maîtriser la portée.

## Examiner les composants

Dans Storybook, vous pouvez observer l’apparence d’un composant et essayer les interactions proposées par ses exemples.

Lors de votre revue, examinez notamment :

- La hiérarchie visuelle et la lisibilité.
- La cohérence entre les variantes.
- La compréhension des états et des retours.
- Le comportement au clavier et la visibilité du focus.
- Les contenus longs, les erreurs et les situations particulières documentées.

**Les exemples sont des démonstrations isolées.** Une interaction dans Storybook ne prouve pas qu’une donnée est enregistrée ou qu’un parcours complet fonctionne dans l’application.

Complétez votre examen dans les pages où le composant est utilisé.

## Faire évoluer le design system

Vous demandez les modifications à l’assistant, en précisant le résultat souhaité et les éléments concernés :

> Augmente l’espacement entre le libellé et le champ pour tous les champs de formulaire.

> Crée une variante compacte de cette carte pour les listes denses.

> Modifie uniquement le fond du bouton principal, en conservant les autres variantes.

L’assistant examine les usages existants, précise la portée du changement si nécessaire, puis actualise les sources, les exemples et la documentation concernés.

**Une apparence différente d’un composant partagé devient une variante explicite**, afin de conserver une règle compréhensible et réutilisable.

Les outils du kit génèrent ensuite les fichiers nécessaires à l’application et à Storybook à partir de ces sources.

## Consulter et vérifier les changements

**Storybook est un espace de consultation et de vérification.** Les interactions proposées servent à examiner les exemples ; elles n’enregistrent pas de modifications dans le design system.

Après une évolution, l’assistant vous indique les composants et les pages à examiner. Vous pouvez vérifier le résultat dans Storybook, puis dans l’application pour juger son effet dans le contexte réel de votre produit.
