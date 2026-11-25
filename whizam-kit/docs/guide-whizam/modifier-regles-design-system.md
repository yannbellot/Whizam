# Modifier les règles de gestion du design system

**Les règles du design system définissent la manière de créer, de réutiliser et de faire évoluer les éléments de votre interface.** Elles encadrent les primitives, les tokens, les composants, leurs variantes et leur documentation dans Storybook.

Vous pouvez adapter ces règles à votre projet. Une modification peut cependant affecter plusieurs composants ou pages : préparez avec l’assistant un point de retour avant de commencer.

## Distinguer une évolution visuelle d’une modification de règle

**Une évolution visuelle change l’interface.**

> Crée une variante compacte de cette carte pour les listes denses.

**Une modification de règle change la manière de gérer le design system.**

> Pour toute nouvelle variante, exige un exemple d’utilisation et une description des situations auxquelles elle répond.

La première demande utilise les procédures existantes. La seconde modifie les consignes que l’assistant devra appliquer aux prochaines évolutions.

## Comprendre les règles actuelles

Le design system du kit repose sur trois catégories de tokens :

- **Les primitives** définissent les valeurs de base : couleurs, tailles, espacements ou arrondis.
- **Les tokens de composant** référencent directement des primitives pour une partie, une variante ou un état de composant.
- **Les tokens locaux** référencent directement des primitives pour la composition d’une page particulière.

Les composants partagés possèdent des variantes et des états explicites. Leurs exemples permettent d’examiner leur apparence et leur comportement dans Storybook.

**L’assistant modifie les sources ; les outils du kit génèrent les fichiers utilisés par l’application et Storybook.** Les fichiers générés ne doivent pas être modifiés manuellement : une génération ultérieure remplacerait ces changements.

## Décrire la règle souhaitée

Indiquez le problème rencontré, le comportement attendu et les éléments concernés.

Par exemple :

> Pour chaque nouveau composant de formulaire, documente les états vide, renseigné, désactivé et en erreur.

> Avant de créer une variante, vérifie si une variante existante répond déjà au besoin.

> Pour toute modification partagée, indique les composants et les pages à examiner.

L’assistant recherche les règles existantes, identifie leur source de référence et propose les adaptations nécessaires.

**Précisez si la nouvelle règle concerne les prochaines créations ou également les éléments déjà réalisés.** Une règle ajoutée ne met pas automatiquement tout le design system en conformité.

## Évaluer les conséquences

Certaines adaptations complètent simplement une procédure : ajouter une description obligatoire, préciser un critère de revue ou demander un exemple supplémentaire.

D’autres changent la structure du design system : ajouter une catégorie de tokens, modifier leurs relations ou remplacer le mécanisme de génération.

**Une modification structurelle peut nécessiter une migration**, avec des changements dans les sources, les composants, les contrôles, Storybook et la documentation.

Demandez à l’assistant de préciser :

- Les éléments existants affectés.
- Les adaptations nécessaires dans les outils.
- Les risques de changement visuel ou de comportement.
- La méthode de vérification.
- La procédure de retour arrière.

Vous validez ce périmètre avant la réalisation.

## Maîtriser la portée des changements

**Deux éléments qui utilisent une même valeur ne doivent pas nécessairement évoluer ensemble.**

Dans le fonctionnement actuel du kit, une primitive déjà utilisée reste stable. Pour changer l’apparence d’un usage, l’assistant crée ou réutilise une primitive compatible, puis réaffecte les tokens concernés.

Par exemple :

> Modifie uniquement la couleur de fond du bouton principal. Préserve les autres composants qui utilisent actuellement cette couleur.

Une modification globale doit identifier explicitement les usages à faire évoluer.

De même, une différence d’apparence sur un composant partagé doit être représentée par une variante explicite, afin de conserver un fonctionnement compréhensible et réutilisable.

## Vérifier la nouvelle règle

Commencez par un cas limité :

> Applique cette règle à un composant représentatif et vérifie le résultat avant de l’étendre aux autres composants.

L’assistant actualise les sources concernées, adapte les contrôles si nécessaire et régénère les sorties.

Examinez ensuite :

- Le composant et ses états dans Storybook.
- Son utilisation dans l’application.
- La cohérence des tokens et des exemples.
- La documentation de la nouvelle règle.

**La réussite de la génération ne suffit pas à valider le résultat visuel.** Votre examen permet de vérifier que l’adaptation correspond à votre intention.

## Revenir au fonctionnement précédent

Pour annuler une adaptation, demandez :

> Compare les changements au point de retour et propose une restauration cohérente des règles, des sources et des outils concernés.

Selon la modification, il peut être nécessaire de restaurer les tokens, les composants, les exemples et le générateur dans des versions compatibles, puis de régénérer les sorties.

**Restaurer uniquement le texte de la règle ne rétablit pas les éléments déjà modifiés sous son influence.** L’assistant doit identifier ces changements et préserver les autres évolutions du projet avant toute restauration.
