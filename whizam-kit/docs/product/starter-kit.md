> État initial courant : application et Storybook sans contenu de projet ; Zensical affiche les guides actifs dès son premier démarrage, dans Documentation designer et Documentation technique ; Suivi de projet regroupe État courant, Roadmap et étapes réelles. Les historiques du kit restent hors du portail et de sa recherche. Les démonstrations citées dans les références historiques restent hors des accès livrés ; ne pas les réactiver lors de l’initialisation. Les ressources internes requises par les contrats et les politiques sont conservées. Les nouveaux contenus du projet suivent les règles existantes.

> Périmètre courant DS-AUTO-01 : UI Lab est retiré. Le design system est automatisé et Storybook exclusivement documentaire, selon la [politique](../design-system/policy.md). Les mentions de l’ancien éditeur dans les sections datées sont historiques.

> Périmètre courant DS-AUTO-01 : UI Lab est retiré ; le design system est automatisé selon la [politique](../design-system/policy.md). Storybook est exclusivement documentaire. Les mentions datées ci-dessous décrivent l’héritage.

# Périmètre du kit réutilisable

**Édition autonome — Kit Whizam :** ce dossier se consomme directement depuis Codex, sans créer de projet dans un outil externe. Whizam est le nouveau nom de Loomata ; les chemins techniques restent inchangés. Les sections historiques ci-dessous conservent la provenance du socle et ses limites. Le brief du projet dérivé détermine les fonctionnalités ; aucune roadmap historique du kit n’autorise leur réalisation. Voir la [notice de distribution](../distribution/README.md).

**UI-ARCH-04 — adoption du socle des nouveaux projets :** [décision 037](../decisions/037-project-ui-foundation-adoption.md). Tailwind `project:` sans nouveau Preflight, thème dérivé du DTCG projet dans le writer transactionnel ; Button/Field sur React Aria, API et alias locaux conservés. Consommation contrôlée par utilitaires statiques liés aux bindings ; pas de référence aux valeurs outil. Création/export à qualifier séparément, projets existants et anciens journaux préservés ; Electron hors mandat. Cette adoption ne constate pas la qualification, suivie dans la fiche UI-ARCH-04.

**Articulation courante — 12 novembre 2026 :** le kit décrit ici est une ressource de [Loomata](loomata-workspace.md), dont le MVP intégré utilise Codex seul. Les adaptations multi-assistants et l’exécution du starter sans compte IA restent conservées. Le moteur de traçabilité du MVP, lui, requiert Git pour ses sources et décisions durables ; il ne se déduit pas du simple démarrage web sans Git. [Décision 033](../decisions/033-loomata-mvp-scope-and-sequence.md).

**24 octobre 2026 — périmètre et autonomie documentaire précisés.** Ce document décrit l’objet livré ; il ne constate pas son achèvement. Les [instructions](../../AGENTS.md), la [roadmap](../../ROADMAP.md) et l’[état courant](../project-state.md) distinguent les règles, le suivi et la réalisation effective.

## Produit et utilisateurs

L’**app** est un starter destiné aux designers UX/UI et Product Designers pour produire des POC/MVP web vérifiables et transmissibles à un développeur. Le designer formule l’intention et accepte les choix matériels ; les agents assistent le cadrage, la conception, l’implémentation, les contrôles et la documentation. Les projets dérivés possèdent leurs propres fonctionnalités et références visuelles.

Le kit se présente comme un produit autonome. Ses instructions et documents d’usage décrivent ses propres responsabilités, prérequis et procédures ; leur compréhension ne suppose aucune connaissance de l’organisation qui l’a conçu. Le nom du produit et le UI Lab ne désignent pas une dépendance de fabrication.

## Éléments à livrer dans ce dossier

- Starter web intégré React Router SSR/React/TypeScript, PostgreSQL/Drizzle/Compose, configuration, migrations, données fictives et commandes de développement/exécution.
- Design system JSON DTCG à trois catégories, registre et recettes YAML, génération autonome des tokens et stories, Storybook de consultation.
- Fonctionnalité complète de référence : [gestion de projets](features/projects.md), avec parcours, persistance, états et contrôles. Le [brief de l’exemple](brief.md) concerne cette démonstration, pas tout le kit.
- AGENTS.md du kit, quatre rôles — Builder, Design Reviewer, Technical Reviewer / QA, Security Reviewer — et une bibliothèque extensible de skills communs selon le [catalogue](../../skills/catalog.json).
- Adaptations documentées pour Codex, Claude Code, Gemini CLI et Mistral Vibe, avec une source par règle/rôle/skill, des chemins internes et une matrice de compatibilité fondée sur des essais identifiés.
- Tests, scripts de contrôle, documentation de conception/exploitation/reprise, preuves utiles à la livraison et capacité CI inactive. Les activations et publications restent soumises à un mandat explicite.

Les instructions et skills sont livrés dans les sources mais ne sont pas des dépendances d’exécution du site, des tests ou de Storybook : ces derniers ne nécessitent ni compte IA ni clé de modèle. Aucun assistant ou modèle unique n’est imposé aux utilisateurs du kit. Une adaptation présente n’est pas une compatibilité démontrée.

## Démarrage d’un projet dérivé

Le [parcours de démarrage](project-start.md) distingue préparation technique, cadrage, conception/développement et revue de la première version. Le designer découvre à cette revue les liens vérifiés vers son application et les composants de son projet dans Storybook. Les démonstrations du kit, dont `/projects`, restent des références de fabrication ; leur retrait du parcours utilisateur dérivé suit la [procédure dédiée](replacing-project-example.md), sans suppression implicite de données. Une initialisation réussie ou un starter renommé ne constitue pas une application réalisée.

## Autonomie attendue

Le dossier complet doit pouvoir être distribué seul, renommé et déplacé sans modifier ses fichiers internes ni dépendre du nom, du chemin, des instructions ou des ressources de son parent. Cette autonomie couvre aussi le sens des instructions : aucune règle d’usage ne suppose un environnement de fabrication particulier. Les procédures et références nécessaires à la reprise sont livrées dans le kit ; les traces historiques restent identifiées par leur version, sans devenir des consignes actuelles. Voir la [décision d’autonomie documentaire](../decisions/001-self-contained-instructions.md).

Git sert à la traçabilité du développement ; le démarrage web reste possible sans dépôt Git. Les prérequis externes sont documentés. Les volumes Docker sont externes aux sources : suivre les [opérations](../operations.md) et la [sauvegarde/restauration](../backup-and-restore.md).

## État et limites

Le starter web et ses données ont une qualification historique sur une version identifiée ; cela ne démontre pas encore l’extraction du kit complet. AGENTS, rôles, skills, adaptations, contrat, matrice et validateur sont intégrés par [PORT-03](../work-items/port-03-autonomous-agent-kit.md), techniquement qualifié selon son [bilan](../reviews/port-03/README.md). Les preuves distinguent autonomie des fichiers, fonctionnement web/données, comportement des assistants et acceptation humaine ; les essais natifs/humains manquants restent ouverts.

Figma, comptes utilisateurs et hébergements restent conditionnels. Pas de nouveau framework d’orchestration, de catalogue UI exhaustif ni de garantie de préparation à la production. Le développeur repreneur peut adapter la stack et retirer les outils d’agents ; le site reste exécutable avec ses seuls prérequis techniques.
