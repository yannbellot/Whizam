# Périmètre du kit réutilisable

Le Kit Whizam est un starter autonome destiné aux designers UX/UI et Product Designers pour créer une application web vérifiable et transmissible. Le designer définit son intention et examine le résultat ; l'assistant aide au cadrage, à la réalisation, aux contrôles et à la documentation. Le brief du projet dérivé définit ses fonctionnalités.

## Contenu livré

- Socle React/React Router avec rendu serveur et navigateur, TypeScript, PostgreSQL, Drizzle et Docker Compose.
- Design system automatisé : primitives, tokens de composant et tokens locaux de page, contrats et exemples rédigés, génération des styles et stories.
- Storybook de consultation avec organisation permanente et sélection explicite des éléments du projet.
- Zensical pour les guides actifs et la documentation du projet, avec recherche et contenus FR/EN entretenus.
- Instructions, quatre rôles et bibliothèque de skills selon le [catalogue](../../skills/catalog.json), avec adaptations internes aux assistants.
- Scripts, tests, migrations et procédures de reprise. Leur présence n'active ni publication ni déploiement.

## État initial

L'application affiche une page vide ; `/projects` et UI Lab ne sont pas des routes actives. Le registre des définitions importées et les sélections de contenu Storybook sont vides. Le seed n'insère aucune donnée ; migrations et données préexistantes sont conservées. Les composants et anciens exemples utiles restent des ressources internes, sans définir le produit à réaliser.

Le portail propose Accueil, Guide d'utilisation, Suivi de projet et Documentation technique. Les historiques du kit sont exclus du site et de la recherche. ROADMAP.md et docs/project-state.md restent des modèles non initialisés ; aucune tâche de fabrication du kit ne doit y être reportée.

## Démarrage et évolution

Suivre le [parcours](project-start.md) et le [cadrage initial](../agents/project-intake.md) : réutiliser les informations connues, recueillir les réponses manquantes, valider le périmètre puis réaliser la première version autorisée. Une préparation technique réussie ne constitue pas un projet métier réalisé.

Les anciens exemples ne sont pas à réactiver pour démarrer. Leur [adaptation](replacing-project-example.md) préserve les données existantes et les migrations appliquées. Toute création ou adoption de composant comprend ses variantes, états, exemples, tokens et sélection documentaire selon la [politique](../design-system/policy.md).

## Autonomie et prérequis

Le dossier du kit fonctionne seul après copie, renommage ou déplacement, avec ses fichiers cachés utiles et liens relatifs. Ses instructions et références ne nécessitent aucun parent, service Whizam externe ou lanceur macOS. Node/npm et Docker suivent les [prérequis et opérations](../operations.md).

Le site, les tests, Storybook et la génération fonctionnent sans compte IA. L'assistant utilise son propre accès ; Figma reste conditionnel. Git sert à la traçabilité, sans être requis pour le simple démarrage web. Une copie neuve n'embarque ni dépôt Git du mainteneur, ni configuration privée, dépendance installée ou volume Docker ; voir la [passation](../handoff.md).

## Limites de qualification

Les plateformes, essais natifs et résultats sont identifiés dans la [compatibilité](../compatibility.md). Une adaptation livrée ne garantit ni découverte native ni comportement identique des assistants. Les preuves historiques ne qualifient pas automatiquement une nouvelle édition ou un projet dérivé.

Le kit ne fournit pas une application métier achevée, une authentification multi-utilisateur ou une garantie de préparation à la production. Les formats du projet dérivé suivent son brief ; les contraintes historiques de l'ancien outil ne déterminent pas son produit. Les revues techniques et l'acceptation humaine restent distinctes.

<a id="autonomie-attendue"></a>
<a id="source-autonomie-attendue"></a>

<a id="demarrage-dun-projet-derive"></a>
<a id="source-demarrage-dun-projet-derive"></a>

<a id="elements-a-livrer-dans-ce-dossier"></a>
<a id="source-elements-a-livrer-dans-ce-dossier"></a>

<a id="etat-et-limites"></a>
<a id="source-etat-et-limites"></a>

<a id="produit-et-utilisateurs"></a>
<a id="source-produit-et-utilisateurs"></a>
