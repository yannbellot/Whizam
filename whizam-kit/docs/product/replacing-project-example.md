# Adapter les ressources de l'ancien exemple

Le kit neuf ne monte plus `/projects` ni UI Lab. L'accueil est vide et le seed n'insère aucune donnée. Les ressources de l'ancien gestionnaire de fiches restent internes ; leur présence ne justifie ni leur réactivation ni une nouvelle suppression de routes. Le [périmètre](starter-kit.md) et la [table active](../../app/routes.ts) décrivent le point de départ.

## Définir le besoin du projet

Partir du brief et du [parcours de démarrage](project-start.md). Définir les pages, interactions, données, états et critères de la première version avant de choisir les ressources à réutiliser. Une fonction de gestion de projets n'appartient au produit que si elle figure dans le périmètre convenu.

L'ancien exemple comprend des contrats et traitements dans `app/features/projects/`, des éléments de schéma/migration et des tests dédiés. Ce sont des références à examiner, pas une architecture métier obligatoire. Réutiliser les composants partagés utiles et adapter leurs exemples avant publication dans Storybook.

## Adapter code, données et documentation

1. Examiner les imports et consommateurs réellement concernés ; ne pas supprimer un dossier de référence à l'aveugle.
2. Ajouter ou adapter les routes et traitements autorisés, avec validation HTTP/données, erreurs et tests négatifs. Les anciennes gardes ne s'appliquent pas automatiquement aux nouvelles routes.
3. Pour une base déjà initialisée, conserver les migrations appliquées et définir une nouvelle migration si nécessaire. Pour un nouveau domaine, concevoir son schéma avant initialisation. Vérifier cible, sauvegarde et compatibilité avant toute opération de données.
4. Maintenir composants, tokens, variantes, états, exemples et sélection `.storybook/project.json` selon l'[organisation Storybook](../design-system/architecture.md#organisation-et-publication-storybook). La génération courante ne passe ni par UI Lab ni par son ancien manifeste d'édition.
5. Adapter tests, stories et documentation aux parcours du projet ; ne plus imposer `/projects` comme scénario de réussite. Exécuter les contrôles pertinents du [guide technique](../../TECHNICAL-GUIDE.md), puis les revues applicables.

## Retirer une ressource devenue inutile

Une suppression complète des seuls fichiers inutilisés peut être réalisée dans le mandat, après examen des dépendants et de ses conséquences sur les tests. Distinguer retrait de code et suppression de données : aucune table, migration appliquée, sauvegarde ou volume n'est effacé implicitement.

Conserver les preuves historiques et leurs versions. Les anciens journaux d'éditeur ne sont pas à convertir ou purger pour adapter le kit. Une copie existante utilisant cet éditeur demande son propre chantier de migration selon la [politique](../design-system/policy.md), sans combiner code ancien et nouvelles autorités.

## Vérifier le résultat présenté

Présenter les parcours réalisés et les composants du projet, avec Application, Storybook et Documentation après vérification de leur disponibilité et contenu. Une page vide, une ancienne démonstration ou un succès de build ne constitue pas la première version métier. Documenter les limites et laisser l'acceptation au designer.

<a id="elements-de-lexemple"></a>
<a id="source-elements-de-lexemple"></a>

<a id="place-dans-un-projet-derive"></a>
<a id="source-place-dans-un-projet-derive"></a>

<a id="procedure-de-changement"></a>
<a id="source-procedure-de-changement"></a>

<a id="remplacer-lexemple-projets"></a>
<a id="source-remplacer-lexemple-projets"></a>
