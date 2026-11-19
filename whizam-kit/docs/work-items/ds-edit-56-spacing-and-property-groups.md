# DS-EDIT-56 — Espace et proposition de groupes de propriétés

2 novembre 2026 — application, base 16789fb. Réalisation demandée : augmenter l’espace sous le message de non-partage. Hypothèse minimale réversible : marge basse de 1rem, sans autre espacement modifié. Proposition demandée pour catégories, traductions et nom CSS au survol ; aucune nomenclature ni nouveau menu implémenté sans choix du designer. Procédure applicative implement-feature et revues design/technique séquentielles non indépendantes, base qualifiée ci-dessus. Aucun impact sur données/accès. Préexistants et modèles app préservés. Statut initial En cours ; résultats ajoutés après contrôles.

## Proposition remplaçant la forme « attribut — contexte »

Le titre de groupe fournit le contexte ; les options traduisent la propriété CSS avec des noms stables et compréhensibles. Le groupe ne change ni rôle sémantique ni identifiant technique. Labels et groupes devront appartenir à editor-contract.yaml ; cssProperty existant fournit l’aide technique, sans seconde copie du nom CSS. Filtrer les groupes aux propriétés réellement éditables dans le contexte sélectionné, sans groupes vides.

| Groupe | Libellé proposé | CSS au survol |
| --- | --- | --- |
| Typographie | Famille de police | font-family |
| Typographie | Taille de police | font-size |
| Typographie | Graisse de police | font-weight |
| Typographie | Hauteur de ligne | line-height |
| Couleurs | Couleur d’arrière-plan | background-color |
| Couleurs | Couleur du texte | color |
| Couleurs | Couleur des icônes | color — appliqué à la partie icône |
| Bordures | Couleur de bordure | border-color |
| Bordures | Épaisseur de bordure | border-width |
| Bordures | Rayon des angles | border-radius |
| Espacements | Espacement intérieur — axe de bloc | padding-block |
| Espacements | Espacement intérieur — axe en ligne | padding-inline |
| Espacements | Espacement entre éléments | gap |
| Espacements | Espacement intérieur de la page | padding — consommateur actuel, à réconcilier |
| Dimensions | Largeur maximale | max-width |
| Contour de focus | Couleur du contour | outline-color |
| Contour de focus | Épaisseur du contour | outline-width |
| Contour de focus | Décalage du contour | outline-offset |

Les axes bloc/en ligne évitent de traduire incorrectement des propriétés logiques en vertical/horizontal pour toutes les écritures. Aide française complémentaire : vertical/horizontal dans l’écriture horizontale habituelle. Padding reste un espacement intérieur, distinct d’une marge extérieure (margin). Le contour ne participe pas aux dimensions comme une bordure. Incohérence constatée : la métadonnée cssProperty de pageMargin indique padding-inline, alors que Preview et projects.module.css utilisent padding. Ne pas afficher une aide trompeuse : réconcilier cette métadonnée avec la portée réelle avant la réalisation du menu. Ce chantier ne modifie ni cette autorité ni le rendu de la page ; le point est soumis avec la proposition de nomenclature.

Le menu natif actuel peut porter des groupes et un title sur l’option, mais l’infobulle individuelle n’est pas fiable dans tous les navigateurs. Pour garantir le CSS au survol de chaque entrée : proposer un menu accessible groupé, avec survol ET focus clavier affichant l’infobulle, fermeture Échap, navigation par flèches et maintien du focus. Pas de nouvelle bibliothèque requise par cette proposition ; préparer sa qualification séparément. Une alternative minimale reste le menu natif avec le nom CSS du choix courant affiché sous le champ et au survol du champ ; elle ne garantit pas le survol de chaque option.

Doc updated. Nomenclature soumise au designer, non considérée acceptée par la validation des conversions/contraste. Reprise : choix de cette présentation après recette de l’espacement. Publication désactivée.

## Résultat de la tranche d’espacement

En revue — qualification technique de l’espacement acquise, acceptation humaine différée. Marge basse portée à 1rem, vérifiée dans les parcours de DS-EDIT-57 sur desktop/mobile dev et statique, avec texte/couleur inchangés et position avant les actions conservée. Revues design/technique du même agent successives, non indépendantes ; aucune surface de sécurité ajoutée. Le guide est synchronisé. La liste groupée, ses nouveaux noms et l’infobulle restent une proposition documentée ci-dessus, pas une réalisation acceptée. Doc updated. Reprise : recette visuelle de l’espace et arbitrage de la proposition.

## Disponibilité de la recette

Recette 54138 actualisée après constat Safari sans brouillon (génération chargée, valeur d’arrondi 0.5rem). Arrêt propre, récupération reconnue sans suppression de protection, installation des sept fichiers de programme et génération, puis relance détachée persistante. Dix hashes de sources de valeurs inchangés et aucun reçu ajouté. Safari rechargé depuis l’origine : « Données à jour », badge AAA non conforme désormais bouton proposant la correction ; aucun geste de test enregistré dans cette instance humaine. Preuves locales ignorées dans `.local/ds-edit-57/` du lab. Reprise : test humain ; publication et anciens services hors recette inchangés.


## Suite approuvée

Le designer a demandé les titres de groupe sans répétition dans les options, puis leur réalisation. [DS-EDIT-58](ds-edit-58-grouped-properties.md) remplace la proposition ci-dessus par les noms courts effectifs et qualifie le menu, l’aide CSS et la réconciliation de pageMargin. Cette section conserve l’historique de la proposition initiale ; elle ne constitue plus le point de reprise courant.
