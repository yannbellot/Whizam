# Consulter et maintenir la documentation

La documentation du projet est présentée par Zensical, depuis les Markdown du Kit Whizam. Trois accès complémentaires : Application, Storybook pour les composants React, et Documentation pour le produit, ses règles, sa réalisation et sa transmission.

Whizam est le nouveau nom de Loomata. Les chemins et identifiants techniques restent inchangés pour préserver les liens et les commandes. Les références et captures historiques conservent leur nom d’origine ; elles ne décrivent pas une nouvelle qualification du kit.

Le portail propose quatre entrées : **Accueil**, **Guide d’utilisation**, **Documentation designer** et **Documentation technique**. Le [guide d’utilisation](guide-whizam/index.md) accompagne la prise en main, la collaboration, les évolutions et la transmission ; ses pages sont classées sous cette rubrique, placée juste après Accueil, avec les groupes Bien démarrer et Concevoir et faire évoluer son projet. Le designer retrouve ses guides, les principes du design system et **Suivi de projet → État courant, Roadmap, Étapes du projet**. Les étapes réelles accueillent leurs préparations, revues et décisions dans des dossiers de navigation dédiés. Dans le kit neuf, les deux modèles restent non initialisés et la vue des étapes indique « Aucune étape définie ».

La documentation technique regroupe Architecture et données, Installation et exploitation, Sécurité et configuration privée, Design system — implémentation, Assistants et automatisations, Maintenance de la documentation. Les historiques du kit sont conservés dans les sources, mais ne sont publiés ni dans la navigation, ni dans la recherche, ni par accès direct à une ancienne URL du site reconstruit. Les guides actifs restent consultables sans brief métier. Application et Storybook gardent leur état initial propre.

## Préparer et consulter

Avec Node/npm compatibles, les dépendances npm du kit installées et Docker démarré, lancer `npm run docs:dev`. Le portail répond sur `http://127.0.0.1:8000/`. `DOCS_PORT` permet de choisir un autre port ; un port occupé est refusé sans arrêter son propriétaire. Ctrl+C arrête uniquement le portail. L’application et Storybook restent indépendants ; aucune base n’est requise pour la documentation.

Zensical 0.0.62 est exécuté avec l’image officielle et un digest épinglé dans `config/documentation/catalog.json`. Aucun Python, pip ou uv n’est installé sur le poste. Docker peut télécharger cette image lors du premier build ; sa génération s’effectue ensuite sans réseau.

`npm run docs:build` produit le site statique. `npm run docs:check` compare ses entrées aux sources courantes. `npm run docs:prepare` affiche le classement et les diagnostics. Les pages et ressources générées restent sous `.runtime.local/documentation/`, exclues de la distribution et du contrôle de version. La sortie active est désignée par `current.json` après succès uniquement. Les anciennes sorties restent disponibles pendant un rebuild ; les tentatives échouées ne remplacent pas la dernière version complète. Après une interruption laissant `build.lock`, diagnostiquer et préserver cette tentative avant reprise, sans retirer de verrou d’un processus actif.

## Sources uniques et couverture

Modifier les fichiers Markdown originaux ; jamais les pages préparées ou HTML. Les changements, ajouts, renommages et retraits sont détectés automatiquement pendant l’aperçu, puis le navigateur est rechargé après publication complète. L’assistant actualise les contenus avec la fonctionnalité ; aucun build ne lance d’inférence IA.

Le registre `config/documentation/catalog.json` sépare la publication de la navigation dans `organization` (version 1). Chaque entrée de `organization.documents`, indexée par son chemin canonique, porte :

- `kind` : `guide` pour une règle ou un guide actif du kit, `project` pour le projet utilisateur, `history` pour une source conservée hors du portail ;
- `section` : chemin de navigation avec une rubrique principale et une sous-rubrique parmi celles décrites plus haut ;
- `label` et `order`, facultatifs : titre lisible et ordre numérique dans sa rubrique ;
- `stage` et `phase`, pour un document rattaché à une étape réelle. Les phases admises sont « Cadrage et objectifs », « Préparation et réalisation », « Vérifications et retours », « Décisions et validation ».

Déclarer les étapes dans `organization.stages` avec `id`, `title` et `order`, en cohérence avec la roadmap. Le script ne déduit pas une étape à partir d’un nom de fichier ou d’un numéro de décision. Exemple à adapter à une étape réellement décidée :

```json
{
  "stages": [{ "id": "contact", "title": "Formulaire de contact", "order": 1 }],
  "documents": {
    "docs/work-items/contact.md": {
      "kind": "project",
      "label": "Préparer le formulaire",
      "stage": "contact",
      "phase": "Préparation et réalisation"
    }
  }
}
```

Ces objets complètent les entrées existantes ; ne pas remplacer le classement des autres documents. Les sous-rubriques sans document ne sont pas créées. Les sources restent aux emplacements des conventions : aucun déplacement ni deuxième copie de ROADMAP.md, docs/project-state.md, fiches, revues ou décisions. L’accueil et la vue des étapes sont générés, sans source Markdown concurrente à éditer.

Un document nouveau reste publié par défaut avec un diagnostic « Classement documentaire à compléter ». Les nouvelles fiches, revues et décisions vont provisoirement dans Suivi de projet → Documents à classer, jusqu’à attribution explicite d’une étape ou d’une destination transversale. Les autres documents utilisent leur domaine de chemin, avec Architecture et données comme repli. La publication ne déduit jamais qu’un nouveau document est historique du seul fait de son dossier. Corriger le classement dans le registre avec le changement concerné.

Le manifeste de préparation détaille chaque source, sa nature, sa destination et sa publication. `organization` fait autorité quand il existe ; `archives` conserve les annotations héritées et `publishDocs` le comportement des anciens registres sans `organization`. Ne pas utiliser `publishDocs` pour réexposer les historiques. Aucun contenu de maintenance extérieur au kit n’est inclus.

Les liens interpages et vers les sources publiques sont préparés automatiquement. Les liens vers des documents non publiés sont remplacés par une mention explicite non cliquable, sans proposer leur source comme téléchargement ; les références retirées et les ancres absentes apparaissent dans les diagnostics de préparation. Les liens privés ou hors périmètre des références du socle sont remplacés par une mention non cliquable, sans lire leur cible ; les autres sources conservent le refus strict de tels liens. Les sources techniques admises sont proposées comme texte téléchargeable, jamais exécutées. Les ressources privées, les chemins sortants et liens symboliques sont refusés.

## Autonomie et sécurité

Tout le nécessaire est dans ce dossier : configuration `zensical.toml`, registre, scripts et tests. Copier le kit avec ses fichiers cachés utiles puis suivre son README. Le conteneur ne reçoit que les pages préparées et sa configuration dans un espace jetable en écriture, distinct des sources originales ; ni environnement privé, ni parent, ni socket Docker, ni base métier. Le serveur local n’expose que le site construit et refuse les écritures HTTP.

Une installation initiale peut nécessiter Internet pour les outils et l’image. Ouvrir directement un HTML via `file://` n’est pas le parcours qualifié : utiliser le serveur local. Ni publication distante ni hébergement de production ne sont activés.
