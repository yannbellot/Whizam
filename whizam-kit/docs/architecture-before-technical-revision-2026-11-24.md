> Architecture courante DS-AUTO-01 : la génération est autonome dans `scripts/design-system.mjs`, selon la [politique](design-system/policy.md). Les descriptions d’éditeur, snapshots et writers ci-dessous sont historiques ; ils ne décrivent pas le runtime actuel.

# Architecture applicative

**UI-ARCH-04 — adoption du socle des nouveaux projets :** [décision 037](decisions/037-project-ui-foundation-adoption.md). Tailwind `project:` sans nouveau Preflight, thème dérivé du DTCG projet dans le writer transactionnel ; Button/Field sur React Aria, API et alias locaux conservés. Consommation contrôlée par utilitaires statiques liés aux bindings ; pas de référence aux valeurs outil. Création/export à qualifier séparément, projets existants et anciens journaux préservés ; Electron hors mandat. Cette adoption ne constate pas la qualification, suivie dans la fiche UI-ARCH-04.

**UI-ARCH-03 — adoption bornée :** [décision 036](decisions/036-first-ui-slice-adoption.md). Les nouvelles surfaces du chrome consomment leur autorité DTCG outil et leurs styles Tailwind dérivés ; les valeurs projet et règles historiques restent inchangées. Le contrôle outil couvre classes/variables et absence de références projet ; aucune nouvelle capacité du writer. Socle des projets et Electron hors tranche.

**Cadrage cible UI-ARCH-02, 14 novembre 2026 :** [contrat de frontières UI](architecture/ui-architecture-boundaries.md) pour Loomata et les sites/web apps créés. Cadrage documentaire seulement : DTCG et autorités courantes préservés, React Aria/Tailwind à réaliser dans deux design systems indépendants, Electron dans une tranche séparée. Ces orientations ne qualifient pas leur intégration ; les règles effectives ci-dessous restent applicables jusqu’à leur alignement explicite avant code.

**Autorité actuelle du design system — DS-ARCH-01 :** valeurs/références en JSON DTCG 2025.10 ; règles, présentations et recettes CSS dans leurs contrats YAML. Le [référentiel de conception](design-system/architecture.md), le [contrat d’autorité](../src/design-system/authority/README.md) et la [décision 027](decisions/027-dtcg-authority-and-css-recipes.md) remplacent les mentions historiques de source YAML des valeurs ci-dessous. Le chargeur projette le JSON validé vers le moteur commun, le writer le sérialise sous journal puis régénère, sans double référentiel éditable. Modèle v4 conservé, snapshot v4 et manifeste v27 ; UI Lab reste seul hôte d’édition locale, Storybook lit les mêmes fixtures/valeurs pour la documentation.

**DS-EDIT-64 — état courant :** atelier UI Lab autonome livré en C/D selon la [décision 025](decisions/025-independent-design-editor.md), qualifié en [E](reviews/ds-edit-64-e.md). Les obligations historiques d’hébergement exclusivement Storybook ci-dessous sont remplacées : writer dans le seul développement UI Lab explicitement lancé, Storybook documentaire sans addon, bootstrap ou writer après [F](reviews/ds-edit-64-f.md). Son seul raccordement au service de cohérence est un participant de lecture. Voir la [passation](handoff.md).

Les chemins de ce document partent de la racine applicative, indépendamment du nom du dossier. React Router Framework Mode produit les parties client/serveur avec Vite ; aucun backend séparé.

| Emplacement                                                                         | Responsabilité                                                                                                              |
| ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `app/root.tsx`, `app/routes.ts`, `app/routes/`                                      | Document HTML, coordination des loaders/actions et interface SSR.                                                           |
| `app/features/projects/`                                                            | Contrat partagé, gardes HTTP serveur, repository Drizzle, formulaires et stories.                                           |
| `app/server/`                                                                       | Configuration privée et accès PostgreSQL exclusivement `.server`. Connexion créée à la demande, sans base requise au build. |
| `src/design-system/`                                                                | Composants, six autorités YAML historiques, catalogue/matrice de l’éditeur, résolution des tokens et validateurs.           |
| `src/ui-lab/`                                                                       | Laboratoire d’intégration SSR et d’interactions.                                                                            |
| `AGENTS.md`, `agents/`, `skills/`, `.agents/`, `.claude/`, `CLAUDE.md`, `GEMINI.md` | Instructions livrées, rôles, bibliothèque et adaptations avec références internes au kit.                                   |
| `docs/agents/`, `docs/compatibility.md`                                             | Contrat, références de pratique, procédures et limites des assistants.                                                      |
| `.storybook/`                                                                       | Rendu isolé des mêmes composants/tokens, documentation importée de `docs/design-system/`.                                   |
| `drizzle/`                                                                          | Migrations SQL et métadonnées versionnées.                                                                                  |
| `scripts/`, `tests/`                                                                | Démarrage, migrations, génération et contrôles locaux isolés.                                                               |
| `config/testing/`                                                                   | Configurations Playwright et Vitest ; tests et rapports résolus depuis la racine du kit.                                    |
| `config/typescript/`, `config/database/`                                            | Projets TypeScript et configuration Drizzle ; commandes npm et tsconfig principal sélectionnent les chemins.                |
| `compose.yaml`, `config/docker/`                                                    | Entrée Compose, Dockerfiles et complément explicite pour le développement hôte ; contexte de build à la racine du kit.      |

Flux d’écriture : action serveur → garde HTTP/validation → repository serveur → PostgreSQL → réponse Router. Les composants ne chargent ni secrets ni pilote DB. Un import serveur utilisé côté navigateur est refusé par le build et testé. Les erreurs publiques ne révèlent pas les détails internes ; voir la [sécurité](security.md) et le [contrat de données](product/project-data-contract.md).

Les autorités YAML sont canoniques ; les propriétés CSS et le catalogue TypeScript sont générés avant types/dev/build/Storybook et ignorés par Git. Aucune double saisie, synchronisation Figma ou dépendance au cadre de conception. Les principes UI sont dans [leur document canonique](design-system/principles.md).

Les chemins opérationnels sont relatifs aux fichiers ou à cette racine. `.env.local` reste privé dans ce dossier. L’identité Compose persistante est indépendante du chemin ; les volumes vivent dans Docker. Renommage/déplacement d’une instance et installation indépendante sont distincts : [procédure](../README.md). Les sorties `build/`, `storybook-static/`, installations et caches sont reconstructibles et ignorés. L’image runtime non-root contient uniquement build, dépendances de production et scripts/migrations nécessaires.

Les [contrats préparés pour l’éditeur](product/features/design-system-editor.md) ajoutent des schémas v2 et un contrôle pur dans `src/design-system/editor/contract.ts`. La [migration des fiches](decisions/006-component-token-migration.md) raccorde les cinq composants et les fondations aux dérivés v2 générés, tout en conservant 24 alias historiques. Les validateurs restent dans l’outillage, sans import serveur dans les composants. Le panneau manager et la projection en mémoire de la [décision 007](decisions/007-storybook-memory-preview.md) consomment un instantané généré validé, sans import Node dans le navigateur. Les stories déclarent leurs cibles explicitement ; la couche CSS est possédée par l’iframe. Le service d’écriture est livré uniquement dans l’outillage Storybook de développement, sans route supplémentaire dans l’application.

## Édition persistante du design system

Le moteur pur `src/design-system/editor/operations.ts` est partagé par projection et persistance. Le service `.storybook/editor/server/` est chargé uniquement par le middleware de développement ; aucune route métier ni base de données n’est ajoutée. Le générateur produit d’abord des buffers dans une racine isolée ; le store publie sources et six dérivés sous journal, avec réservation des lecteurs et barrière HMR. Le [contrat d’enregistrement](design-system/editor-persistence.md) décrit manifeste, reçus, récupération et limites ; le mode statique conserve la consultation et l’aperçu C.

## Documentation dérivée

`scripts/editor-documentation.mjs` rend des données validées en Markdown échappé ; `prepareEditorArtifacts` réutilise le résolveur de tokens et le snapshot de consommateurs. Les deux sorties versionnées — [catalogue](design-system/semantic-catalog.md) et [inventaire](design-system/style-inventory.md) — complètent les quatre dérivés CSS/TS/JSON ignorés. Elles suivent préparation, publication et récupération du même enregistrement. Le manifeste fermé v2 inclut le renderer et les entrées MDX qui importent ces textes ; aucune nouvelle source éditable ni route HTTP. Les lectures du générateur utilisent la coordination existante. `docs:design-system:check` compare sans réécrire les documents, avec réservation privée de lecture.


## Assistance de styles optionnelle

DS-EDIT-14 ajoute une politique pure dans `src/design-system/editor/style-decision.ts`, un contrôleur de brouillon dans `src/design-system/editor/assisted.ts` et un raccordement app-server stdio dans le seul middleware Storybook. Il ne crée ni backend métier ni dépendance supplémentaire. Le service prépare les plans depuis le snapshot validé et vérifie les réponses avant projection ; le writer conserve les seules écritures canoniques. Connexion, isolation par installation et limites sont décrites dans le [contrat d’assistance](design-system/editor-assistance.md). Le runtime applicatif et le build statique ne démarrent pas Codex.


Le [modèle DS-EDIT-15](decisions/020-component-token-reference-model.md) conserve le binding comme autorité du token de composant (`reference` effective, `style` d’origine) ; les sources et le modèle sont v3, le snapshot et le protocole de sauvegarde v2. `editor/naming.ts` calcule les noms par famille/usage et participe au manifeste fermé v4. Le [migrateur explicite](design-system/token-migration.md) convertit les seules sources v2 sur copie, sans rejouer d’ancien reçu ; ses schéma/fixture historiques ne sont pas un contrat runtime actif.

## Portée explicite et catalogue transactionnel — DS-EDIT-23

`editor/operations.ts::projectTransaction` projette ensemble modèle et catalogue, utilisé par session, canal d’aperçu, assistance et writer. `intentions.ts` limite les ajouts aux intentions documentées et à leurs éligibilités, sans modifier catégories, taxonomie, domaines ou définitions existantes ; le snapshot relu vérifie cette extension contre l’autorité compilée. `intent-proposal.ts` prépare les seules opérations autorisées depuis une réponse structurée. Le moteur déduit les identifiants, pas le modèle.

Le manifeste v9 inclut le catalogue comme neuvième source modifiable ; sa sérialisation est distincte de celle des fiches et sa publication utilise les mêmes journaux/reçus et récupération que les tokens. Écriture v4 ; les requêtes v3 sont refusées, les anciens reçus ne sont pas convertis. Le modèle v4 et l’enveloppe snapshot v3 gardent leur forme. L’interprétation d’intention v1 reste dans le seul service de développement, selon le [guide](design-system/editor-assistance.md).

## Atelier UI Lab — DS-EDIT-64 C

`src/ui-lab/editor/` assemble les fixtures React communes, le canal de scène et les contrôleurs de brouillon. `/ui-lab` initialise la session côté client ; `/ui-lab/preview` charge uniquement une scène autorisée. UI-MAC-02 supprime la route `/ui-lab/reference` et sa présentation historique ; les composants et exemples partagés restent disponibles dans Storybook. Aucune dépendance d’exécution Storybook ; lecture publique du snapshot, transport iframe corrélé, aucun writer ou compte dans ce nouvel hôte. Les modifications de génération Vite sont notifiées sans détruire sa session. Contrat et limites : décision 025 ; C n’active pas D.

## Raccordement autonome — DS-EDIT-64 D

scripts/editor-workshop.ts monte le service commun avant le lecteur Vite, uniquement via le lancement local explicite. app/server/editor-bootstrap.server.ts fournit les métadonnées du seul document atelier en développement ; transport.ts utilise exclusivement ce document. Le service est importé nativement hors du graphe de configuration Vite, afin que les dérivés enregistrés ne déclenchent pas son redémarrage. Fermeture et reprise utilisent le store existant. Storybook sans writer par défaut, avec compatibilité historique explicite ; pas de nouveau backend. Le runtime compilé reste en consultation/brouillon.

## Cœur commun et livraisons — CORE-01

Le [contrat de séparation](architecture/shared-core.md) conserve le dossier autonome et prévoit une enveloppe macOS sans dupliquer le moteur. Le port local scripts/core/local-service.mjs est partagé par une CLI JSON et un prototype WebKit ; les fonctions de création/export/connexion futures restent indisponibles.
