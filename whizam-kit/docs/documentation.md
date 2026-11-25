# Consulter et maintenir la documentation

Le portail Zensical présente les guides, le suivi du projet et les références techniques à partir des fichiers Markdown du kit. Pour consulter les contenus, choisir l’une des quatre entrées : **Accueil**, **Guide d’utilisation**, **Suivi de projet** ou **Documentation technique**. Le [guide d’utilisation](guide-whizam/index.md) accompagne la prise en main ; cette page explique comment préparer, classer, traduire et vérifier les documents.

Le suivi rassemble l’état courant, la roadmap et les étapes réelles du projet. Dans un kit neuf, ses modèles restent non initialisés. La documentation technique est organisée en six domaines : architecture et données, installation et exploitation, sécurité et configuration privée, design system, assistants et automatisations, maintenance documentaire.

Les instructions internes des agents restent dans les sources, indépendamment de leur publication. Les historiques sont conservés hors du portail et de sa recherche. Les guides actifs sont consultables sans brief métier ; Application, Storybook et Documentation restent trois services distincts.

Le portail suit automatiquement le mode clair ou sombre transmis par le navigateur, dès l’ouverture et lors des changements. Les anciennes préférences manuelles de palette sont ignorées, sans suppression de leur stockage. Aucun sélecteur ni réglage à enregistrer ; les couleurs des illustrations restent inchangées.

Documentation et Design système partagent les fonds de page et une colonne gauche : identité du projet, recherche et navigation, avec le sélecteur de langue dans un pied de colonne fixe. Sur écran étroit, Menu ouvre cette colonne avec le même pied fixe et Sommaire précède l’article. Les titres utilisent le nom Q1 enregistré au cadrage (Kit Whizam sinon) ; reconstruire/relancer les outils après renommage.

Cliquer sur l’icône de lien d’un titre copie son adresse et conserve la navigation vers la section, dans Documentation comme dans les pages Docs de Storybook. La note « Lien copié » apparaît au-dessus de l’icône pendant deux secondes, uniquement après une copie réussie. Si le navigateur refuse l’accès au presse-papiers, une note signale l’échec.

## Préparer et consulter

Avec Node/npm compatibles, les dépendances npm du kit installées et Docker démarré, lancer `npm run docs:dev`. Le portail répond sur `http://127.0.0.1:8000/`. `DOCS_PORT` permet de choisir un autre port ; un port occupé est refusé sans arrêter son propriétaire. Ctrl+C arrête uniquement le portail. L’application et Storybook restent indépendants ; aucune base n’est requise pour la documentation.

Zensical 0.0.62 est exécuté avec l’image officielle et un digest épinglé dans `config/documentation/catalog.json`. Aucun Python, pip ou uv n’est installé sur le poste. Docker peut télécharger cette image lors du premier build ; sa génération s’effectue ensuite sans réseau.

`npm run docs:build` produit le site statique. `npm run docs:check` compare ses entrées aux sources courantes. `npm run docs:prepare` affiche le classement et les diagnostics. Les pages et ressources générées restent sous `.runtime.local/documentation/`, exclues de la distribution et du contrôle de version. La sortie active est désignée par `current.json` après succès uniquement. Les anciennes sorties restent disponibles pendant un rebuild ; les tentatives échouées ne remplacent pas la dernière version complète. Après une interruption laissant `build.lock`, diagnostiquer et préserver cette tentative avant reprise, sans retirer de verrou d’un processus actif.

Les pages 404 générées conservent un lien « Aller au contenu » vers leur titre, qui peut recevoir le focus. Tabulation puis Entrée permettent de passer la navigation. La génération vérifie cette cible avant de publier le site ; les anciennes URL françaises bénéficient du même correctif.

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

## Langues

Le portail prépare `/fr/` et `/en/` séparément, avec sélecteur et recherche par langue. Les anciennes URL françaises restent accessibles. Les contenus anglais absents ou périmés sont explicitement signalés ; la présence du sélecteur ne prouve pas la complétude des traductions. Voir [Langues du projet](agents/languages.md) pour les préférences, les sources de traduction et leur maintenance.

## Typographie des outils documentaires

Le portail et Storybook utilisent Inter pour les textes et Menlo pour le code et les identifiants. Inter est livrée localement dans `public/documentation/Inter.ttf`, avec sa licence OFL ; sa déclaration porte le nom exact `Inter`. Le fichier provient de la révision Google Fonts déjà épinglée dans le catalogue interne, avec empreinte SHA-256 vérifiée. Aucun téléchargement de police n’est nécessaire à l’ouverture, au build ou en usage hors ligne. Menlo utilise la police du poste, avec repli monospace lorsqu’elle n’est pas installée ; aucun fichier propriétaire Menlo n’est distribué.

Les feuilles de présentation et les ressources explicites du portail sont dans `public/documentation/` et `config/documentation/catalog.json` (`presentationAssets`). La préparation copie ces ressources sous `assets/typography/` pour chaque langue et les inclut dans son empreinte. Les chemins relatifs fonctionnent aussi dans les anciennes URLs françaises. Storybook charge ses polices dans le manager et l’iframe ; `.storybook/typography.css` définit la présentation des contenus documentaires. Les tokens, autorités, composants et styles du design system restent inchangés.

La publication humaine est indépendante de l’activité des instructions : `published: false` exclut une source du portail, de sa recherche et des téléchargements, tout en conservant son `kind: guide` actif pour les agents. `audience` vaut `humans`, `agents` ou `both` et décrit le lecteur ; il ne commande pas la publication. Sans champ `published`, le comportement existant reste inchangé ; `history` reste toujours exclu. Maintenir les liens des agents vers leurs sources locales. Les présentations humaines expliquent ces règles sans créer une autorité concurrente.
