# DS-EDIT-18 — Sidebar native de Storybook

31 octobre 2026 — application, base c57fd25, candidat fonctionnel 9005b03 et finition 22d7394. [Mandat](../work-items/ds-edit-18-native-sidebar.md), [référence](../design-system/token-organization.md). **En revue — qualification technique acquise, acceptation humaine différée.**

## Résultat

Primitives, Semantic tokens et Component tokens sont des groupes natifs dans la sidebar de Storybook. Sept fichiers CSF exposent 32 pages de catégories anglaises peuplées, avec les pages All des parents. Le panneau interne Categories est supprimé. Les tableaux utilisent la largeur disponible ; aucune nouvelle valeur ni identité n’est introduite. Les réglages techniques de catégorie sont masqués dans Controls.

Les anciennes URL restent accessibles comme stories masquées dans la sidebar. Les raccourcis des fiches visent désormais la catégorie native du token. La sélection dans un catalogue conserve sa page et ouvre Styles avec le canal existant, toujours lié à la génération et refusé pour une référence externe. Les nouvelles stories et dépendances appartiennent au manifeste fermé v7. Une nouvelle catégorie effective se maintient dans les stories et ses tests, sans générateur supplémentaire.

## Preuves exécutées

macOS arm64, Node embarqué 24.22.1 et Chromium existant ; aucun compte IA, service externe ou installation globale. Logs privés sous .local/ds-edit-18.

- Types : conformes sur la finition 22d7394 ; build Storybook final réussi.
- Unitaires : 126 réussis dans 17 fichiers, incluant filtrage sans navigation interne et routage des raccourcis ; finition limitée au masquage des Controls, types/build retestés ensuite.
- Contrats design system : 62 réussis. Lint : zéro erreur et avertissement préexistant sur une copie non suivie conservée. Formatage conforme.
- Navigation en développement : quatre parcours réussis, desktop/mobile ; clic réel sur All dans la sidebar, filtres parent/feuille, sélection et compatibilité des anciennes URL.
- Persistance : deux cycles desktop/mobile réussis par les nouvelles pages natives : valeur propre #b51a00, sauvegarde, rechargement, seconde saisie et rétablissement ; build et relecture applicative compilée réussis ensuite.
- Recette finale 54118 : les 32 pages sont chargées et leurs nombres de lignes comparés à la taxonomie du modèle enregistré ; aucun groupe vide ni navigation interne. Sidebar desktop/mobile visible, valeur du bouton conservée, aucune erreur de page.
- Conservation : modèle canonique et CSS généré strictement identiques au témoin DS-EDIT-16 ; aucune modification des sources/styles des composants. Modèles enregistrés avant/après profondément identiques, huit sources copiées à l’identique, 61 préexistants conservés. Le bouton enregistré #b51a00 a des captures avant/après identiques octet par octet à 1280 et 390 px.
- Documentation générée à jour ; validateur du kit conforme : 21 skills, quatre rôles et références. Validation structurelle seulement.

Les premières vérifications de sélection ont révélé que manager.tsx n’acceptait que l’ancienne page Tokens. Les contrôles de provenance/génération sont conservés ; les nouvelles pages sont maintenant reconnues et retestées. Les premiers unitaires ont rencontré les restrictions de ports ; un second enchaînement a ensuite utilisé le Node hôte après la première commande seulement. La campagne finale utilise le même PATH compatible pour toutes les étapes et passe sans modifier les tests de runtime. Les logs initiaux sont conservés ; aucun seuil ni garde retiré.

## Recette et revues

La recette finale utilise une extraction de 22d7394, avec les huit sources enregistrées copiées sous réservation de lecture depuis DS-EDIT-17. Les anciennes racines DS-EDIT-17 et le premier candidat DS-EDIT-18 restent conservés avec leur outillage ; aucun journal, reçu ou compte transféré. Le serveur du port 54118 a été arrêté après vérification de sa racine puis remplacé par la copie finale. L’onglet courant est ouvert sur Component tokens / Button, avec le menu natif visible.

[Sidebar desktop](ds-edit-18/sidebar-1280.png), [sidebar mobile](ds-edit-18/sidebar-390.png), [onglet courant](ds-edit-18/current-sidebar.jpg), [preuve structurée](ds-edit-18/qualification.json). Les captures comparatives du bouton restent privées dans .local/ds-edit-18.

Revues applicables : **séquentielles, même agent, non indépendantes**, procédures review-design, technical-review et security-review à la base c57fd25. Design Reviewer : satisfaisant avec réserve d’acceptation humaine ; hiérarchie native et disparition du second panneau constatées, formats vérifiés. Technical Reviewer / QA : satisfaisant, filtres reliés à la taxonomie, routes et sélection raccordées, sauvegarde/relecture et conservation démontrées. Security Reviewer : satisfaisant pour ce diff local ; catégories issues des sources contrôlées, rendu React échappé, mêmes canaux bornés et gardes, aucune écriture depuis un filtre, pas de nouveau transport ou permission. Aucun scan externe ni certification.

Limites : les 14 captures multi-états et 188 raccordements qualifiés en DS-EDIT-17 ne sont pas répétés ; les sources/styles des composants et leurs valeurs ne changent pas, et le bouton enregistré est comparé sur les deux formats. Suites complètes HTTP/récupération, SQL, installation autonome avec dépendances propres et autres plateformes non répétées. Les qualifications antérieures restent historiques. Instruction Reviewer et Distribution Reviewer non applicables : instructions et mécanisme de distribution inchangés.

**Doc updated.** Fichiers affectés : stories, deux catalogues et leur feuille scoped, preview/canal/manager/panneau, manifeste, tests et documents associés. Aucun push, publication, initialisation des modèles app ou changement G/J5. Prochaine action : recette humaine de la sidebar native sur 54118, sans autre chantier ouvert.
