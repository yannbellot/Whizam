# 006 — Raccordement des fiches de design sans changement visuel

**28 octobre 2026 — DS-EDIT-01 B, prolongement de la [décision 005](005-design-system-editor-authority.md).** Cette décision décrit la migration effective des cinq composants et des fondations. Elle ne livre ni panneau ni service d’écriture.

## Sources et compatibilité

Le registre `components.yaml` v2 référence les fiches adjacentes des cinq composants et `Foundations.design.yaml`, sans duplication d’attributions. Les fiches v2 contiennent 188 tokens de composants ; leur cible et leur complétude sont contrôlées contre la matrice centrale. Field/SelectField et Notice/Panel conservent leurs fichiers React/CSS partagés, mais ont chacun leur fiche et leur portée CSS. L’exception de nommage `PascalCase.design.yaml` est explicite dans naming.yaml.

Les 24 primitives historiques et leurs identifiants/valeurs/source/statut, ainsi que le registre de leurs sources, sont conservés. Les références déjà connues sont reprises explicitement, sans déduplication ni recherche ambiguë ; la sélection lexicale du protocole concerne les futures allocations à partir d’une valeur. Quatre primitives minimales ajoutent des valeurs déjà calculées par le navigateur (graisse normale, interligne, famille existante et épaisseur de bordure). La taille normale réutilise strictement la primitive dimension 1rem existante. Elles portent une provenance de migration proposée ; aucune police téléchargée ni identité de marque nouvelle.

`semantic-tokens.yaml` v2 sépare `styles` (41 styles créés, identité déterministe) et `tokens` (24 anciens noms, désormais alias explicites des styles). Ce maintien évite de migrer silencieusement les styles du UI Lab et autres consommateurs non préparés. Les noms anciens restent une interface de compatibilité, pas des styles supplémentaires à proposer dans l’éditeur. L’ensemble préparé est v2 ; il ne s’agit pas d’un assemblage de fichiers de versions mélangées. Les trois schémas de transition continuent d’accepter les anciennes formes v1 pour consultation/diagnostic.

L’assemblage en mémoire projette les primitives historiques avec une provenance de migration vers leur source conservée ; aucune copie persistée concurrente n’est créée. Les nouvelles primitives adoptent la forme du modèle v2 avec provenance. Les deux formes sont contrôlées, puis toutes les valeurs sont validées selon les domaines éditables.

## Correspondance des intentions

La correspondance est choisie explicitement pendant la migration, jamais inférée à l’usage depuis une couleur : action principale pour fond/texte du Button ; disponibilité indisponible pour son fond disabled ; information/résultat pour les textes succès/erreur et bordure d’erreur ; neutralité/hiérarchie pour surfaces, texte courant/secondaire, formes, typographie et espacements. Les rôles et états gardent des clés distinctes même quand les valeurs sont égales.

L’échelle spatiale est conservée : tertiaire = petit écart 0.5rem ; secondaire = écart moyen/padding horizontal 1rem ; principal = grand écart/padding de panneau 1.5rem ; contexte = marge de page 2rem ; auxiliaire = padding vertical du contrôle 0.7rem. Ces attributions de démonstration restent réversibles, sans acceptation produit inventée. Chaque référence est lisible dans la fiche et le catalogue des styles.

Les bindings d’un état préparé qui gardent la même valeur utilisent un style de cet état alias du défaut. Une évolution partagée continue ainsi à se propager, sauf exception. Les états/propriétés non préparés héritent normalement du défaut. Aucune nouvelle interaction ni variante introduite.

## Notice et sélecteur natif

**Notice :** le fond gris clair réellement affiché (`surface.muted`, #f1f5f9) est conservé et devient l’attribution explicite de chaque variante de sa fiche. L’ancien fond blanc du registre minimal v1 n’était pas consommé par son CSS. Le rapprochement corrige le contrat à rendu constant, sans choisir une nouvelle direction visuelle. Le ton error conserve sa petite taille de texte héritée de l’ancienne classe commune `.error`.

**SelectField :** la sonde de raccordement a montré que Chromium garde un interligne `normal` sur le contrôle natif, malgré une déclaration CSS différente. Les deux cellules control/lineHeight (default et disabled) prévues en A sont retirées de la matrice : aucun réglage sans effet ne sera annoncé éditable. Les autres propriétés restent préparées ; le comportement et l’apparence natifs sont préservés. Cette limite doit être requalifiée avant toute extension à d’autres moteurs ou tout changement d’apparence du select.

## Dérivés et usages

Le générateur existant produit les valeurs CSS de primitives/styles/tokens de composants, et les alias de portée sous `[data-design-target][data-design-variant]`. Les CSS Modules consomment ces alias locaux par partie/propriété/état ; les fondations utilisent directement leur token de composant. Ce mécanisme est un dérivé déterministe, pas une nouvelle autorité : aucune valeur visuelle ni attribution manuelle dans les règles de portée générées.

Les références CSS restent des `var()` jusqu’au token/primitive cible, pour préserver propagation et exceptions. Les valeurs résolues servent au catalogue TypeScript. `tokens` conserve les 24 alias historiques affichés par le UI Lab ; `styles` et `componentTokens` exposent séparément l’inventaire préparé pour la suite. Les sorties restent ignorées et reconstructibles, jamais éditées.

Les consommateurs de fondation sont explicites : document dans global.css ; largeur/marges desktop/mobile et trois écarts de layout dans projects.module.css ; table et cellules dans foundations.module.css. Les autres règles de page (marges de titres, liens, décoration) conservent leurs anciens alias et ne deviennent pas éditables par extension implicite.

La lecture des fiches impose les chemins exacts du contrat, l’appartenance à la racine réelle, l’absence de liens symboliques et l’identité de cible. La génération valide l’ensemble avant écriture de ses dérivés. Elle reste un outil local ordinaire : journal, publication multi-fichiers récupérable et coordination des lecteurs attendent D, sans garantie transactionnelle anticipée.

## Qualification attendue

Comparaison des captures/styles calculés avant/après, états combinés réels, sonde de chaque cellule, isolation entre voisins partageant le CSS, propagation partagée et rétablissement. Les tests de données vérifient aussi l’attribution conservée sous exception ; les sondes navigateur ne persistent aucune valeur. Une valeur de police synthétique peut servir à prouver le raccordement CSS sans être autorisée par le contrat de saisie.

La vérification d’une migration ne remplace pas une recette humaine ou une preuve de persistance de l’éditeur. Les autres moteurs, le panneau et le service restent à réaliser/qualifier dans leurs périmètres respectifs.
