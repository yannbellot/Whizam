# DS-EDIT-59 — Nature des styles et composants liés dans Attribution

2 novembre 2026 — cible application, base `2e36ba2`, branche `codex/ds-edit-59-attribution-links`. En revue — qualification technique acquise, acceptation humaine différée. Mandat : réaliser les quatre situations approuvées dans Attribution et rendre chaque composant concerné accessible par un véritable lien vers son exemple Storybook. Périmètre : présentation, calcul de l’état depuis le graphe existant, navigation, tests, documentation et actualisation de la recette après préservation ou abandon expressément demandé de ses brouillons. Aucun changement de valeur, de modèle de token, d’opération d’écriture ni de libellé des boutons de portée dans cette tranche.

## Critères et choix

- Distinguer Style sémantique partagé, Style sémantique sans autre composant recensé, Style de composant, Style de composant — exception locale.
- Déterminer la valeur effective depuis reference et l’attribution conservée depuis style ; une exception ne devient pas une valeur héritée même si les valeurs sont égales.
- Compter des composants distincts utilisant effectivement le style ; plusieurs réglages d’un seul composant ne suffisent pas. Annoter les consommateurs avec exceptions, sans les annoncer comme modifiés par propagation. Ne pas transformer un inventaire incomplet en absence certaine d’autres usages.
- Afficher les composants concernés sous forme de liens nommés, avec href Storybook et navigation interne préservant le brouillon ; lien ouvrable dans un nouvel onglet avec les gestes habituels. Les références de destination sont celles du catalogue existant, sans duplication de route.
- Vérifier les quatre états, le filtre des usages, les liens et leur parcours clavier, la conservation des brouillons et le rendu desktop/mobile ; types/lint et contrôles de génération proportionnés.

Procédures applicatives sélectionnées depuis `skills/catalog.json`, version qualifiée `2e36ba2` : implement-feature, review-design, technical-review, security-review. Rôles séquentiels, même agent, non indépendants. GPT-6.1 Sol · Élevée, recommandation réutilisée pour graphe, état brouillon et navigation ; aucun réglage modifié. Branche/HEAD et préexistants relevés ; copies « 2 », SemanticStyles.tsx et frontend/ hors périmètre. Aucun modèle de suivi app initialisé ni publication. Doc updated. Résultats ajoutés après contrôles.


## Résultat et point de reprise

[Qualification et trois revues](../reviews/ds-edit-59-attribution-links.md) : quatre situations affichées et liens fonctionnels, contexte et retour au brouillon conservés. 146 unitaires, 82 DS, cinq documentaires, deux parcours dev/deux statiques/deux persistants réussis, types/build/lint isolés et formatage ciblé conformes. Fichiers : panneau, résumé d’attribution, calcul pur, manifeste, tests affectés, guide et preuves. Modèle et valeurs inchangés. Doc updated.

Recette 54138 : quatre fichiers de programme préparés, baseline vérifiée et dix hashes de valeurs enregistrés. Le premier point de reprise conservait le brouillon #791a3e ; le designer a ensuite demandé explicitement « Abandonner le brouillon et actualiser la recette ». Ce choix lève le seul préalable au rechargement, sans autoriser de modification des valeurs enregistrées.

## Actualisation autorisée de la recette

Programme `0a84822`, recette [54138 — Selection](http://127.0.0.1:54138/?path=/story/components-field--selection) actualisée. Arrêt propre du propriétaire identifié, récupération officielle, copie des quatre fichiers, génération et validation des autorités réussies, relance détachée persistante avec parent 1. Aucune protection supprimée manuellement. Dix hashes de sources de valeurs identiques avant/après ; aucun reçu ni transaction ajouté ; 18 styles et 188 tokens de composants propres à la recette conservés.

Safari : abandon autorisé du brouillon lors du rechargement depuis l’origine ; Génération chargée, Données à jour et valeur enregistrée #1d4ed8 retrouvées. Types Style sémantique, Style de composant et Style sémantique partagé observés sans nouvelle saisie. Liens Field, SelectField et Panel avec leurs href et contexte vérifiés dans Attribution ; clic SelectField ouvre réellement la story Selection. Aucun geste de test enregistré dans l’instance humaine. Les parcours isolés restent la preuve des exceptions locales et de la conservation de brouillons à travers les liens.

Preuves locales ignorées : `.local/ds-edit-59/recipe-check.json`, hashes avant/après, descripteur de processus et log. Qualification technique acquise, En revue, acceptation humaine différée. Doc updated. Prochaine action : recette humaine des libellés et liens ; aucun autre chantier, modèle app initialisé ou publication.
