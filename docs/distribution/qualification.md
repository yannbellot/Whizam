# Qualification DIST-01 — 18 novembre 2026

**En revue : qualification technique du périmètre de distribution acquise, acceptation humaine différée.** Édition locale autonome issue du commit `e81cabc78cd6c9d4263961dc03511dbec0e14ac1`. Contrôles exécutés sur macOS arm64, Node 24.22.0 et npm 11.19.1 (compatibles avec package.json), dans une copie isolée avec installation depuis le verrou, sans modules empruntés au parent.

## Résultats

| Contrôle                                                  | Résultat                                                                              |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| npm ci --ignore-scripts --no-audit --no-fund, cache isolé | Réussi, 503 paquets ; aucune installation globale                                     |
| npm run validate:agent-kit                                | Réussi : 21 skills, quatre rôles, références et liens internes                        |
| npm run tokens:generate                                   | Réussi                                                                                |
| npm run typecheck ; npm run lint                          | Réussis                                                                               |
| npm test                                                  | Réussi : 182 tests, 29 fichiers, après correction du test hérité                      |
| npm run test:design-system                                | Réussi : 115 tests                                                                    |
| npm run docs:design-system:check                          | Réussi                                                                                |
| npm run build ; npm run build-storybook                   | Réussis                                                                               |
| Chromium 1280 × 900, runtime compilé                      | Accueil, /health et /ui-lab : HTTP 200, aucun pageerror ; Button rendu dans Storybook |
| Préservation source                                       | 1 461 fichiers/liens suivis et non suivis visibles comparés : aucune différence       |

Les commandes ont été exécutées dans la copie de qualification, jamais dans le dossier source. Les états privés/caches historiques n’ont pas fait l’objet d’une comparaison exhaustive ; aucun outil d’écriture ni script applicatif n’a été lancé sur la source. L’inventaire final est contrôlé après copie. Les installations et builds de qualification ne sont pas livrés.

## Écarts diagnostiqués

Premier npm test : 180/182 ; le test de configuration exige des ports locaux interdits par le sandbox. Retest avec ces ports autorisés : 181/182. Le test hérité rejetait `#1234`, accepté par le contrat courant normalisant l’alpha et la migration WYSIWYG-02. Dans cette édition seulement, le cas invalide devient `#12345` et le cas valide vérifie la normalisation en `#11223344`. Retest complet : 182/182. Aucun changement runtime.

Le headless shell préinstallé échoue sur ses données ICU/GPU ; le Chromium complet déjà présent réussit le parcours. Ni réparation ni modification de cette installation. Une requête automatique /favicon.ico retourne 404, sans erreur JavaScript ni incidence sur les contrôles du parcours. Les avertissements d’outillage hérités restent visibles dans les journaux.

## Revue des instructions

Instruction Reviewer, séquentiel, même agent, non indépendant ; relecture statique, sans appel fournisseur. Initialisation par le nom : routage vers initialize-project. Préparation seule : reste documentaire. Projet existant : reprise sans réinitialisation. Nom contenant une instruction : reste une donnée selon le skill livré. Brief insuffisant : cadrage sans fonctionnalité inventée. Les ressources Loomata historiques sont déclarées facultatives et ne prescrivent aucun chantier au nouveau projet. Ces constats ne prouvent pas l’efficacité native dans un nouveau chat Codex.

## Revue de distribution et limites

Distribution Reviewer, séquentiel, même agent, non indépendant. Sources versionnées seules ; liens relatifs internes préservés ; guide technique complet conservé. Seulement cinq fichiers hérités changent : README, AGENTS, périmètre, inventaire d’export et test unitaire décrit ci-dessus. Les ajouts documentent cette édition. Les modèles de suivi du futur projet sont inchangés.

Pas de nouvelle campagne PostgreSQL/Docker, de transfert de données, de test sur machine vierge, de qualification d’un autre OS ou assistant, d’essai natif d’initialisation Codex, ni de reprise par un tiers. Les historiques conservés peuvent contenir des chemins et accès de recette datés : ils ne sont pas des dépendances d’exécution. Le socle technique reste complet ; aucune suppression structurelle des fonctions Loomata n’est revendiquée.

L’utilisateur peut ouvrir ce dossier dans Codex et demander son projet. Il devra préparer les prérequis locaux selon le README. La recette humaine de ce démarrage reste à observer ; aucune publication ni licence supplémentaire n’est accordée.
