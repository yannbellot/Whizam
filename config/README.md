# Configurations du starter

Lancer les commandes depuis la racine du kit, pas depuis ces sous-dossiers. Les scripts npm et l’entrée Compose sélectionnent les bons fichiers ; aucun nom de dossier parent imposé.

| Dossier       | Contenu                                                                                                           | Entrée habituelle                                                                                                                                                             |
| ------------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `testing/`    | Playwright : interface, projets persistants, Storybook et manager de l’éditeur ; Vitest : unitaires et PostgreSQL | `npm test`, `npm run test:integration`, `npm run test:e2e`, `npm run test:projects`, `npm run test:storybook`, `npm run test:design-editor`, `npm run test:design-editor:dev` |
| `typescript/` | Projets application et outils, référencés par le tsconfig.json racine                                             | `npm run typecheck`                                                                                                                                                           |
| `database/`   | Configuration Drizzle pour la génération de migrations                                                            | `npm run db:generate -- --name=<english-name>`                                                                                                                                |
| `docker/`     | Dockerfile applicatif, Dockerfile d’intégration et complément Compose hôte                                        | Compose racine ; complément `-f compose.yaml -f config/docker/compose.host.yaml`                                                                                              |

Les chemins TypeScript sont relatifs à leurs fichiers de configuration. Playwright et Vitest calculent la racine du kit depuis leurs fichiers ; leurs tests, serveurs et rapports ne se déplacent pas dans config/. Drizzle et Docker reçoivent la racine du kit comme répertoire de travail/contexte.

Les fichiers détectés par les outils restent à la racine : package/verrou npm, tsconfig principal, Vite/React Router, ESLint/Prettier, Compose et règles d’environnement. Les instructions d’assistants et README y restent accessibles. Storybook dispose déjà de `.storybook/`. Les configurations privées et sorties générées restent ignorées.
