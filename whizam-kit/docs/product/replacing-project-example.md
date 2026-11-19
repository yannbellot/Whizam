> État initial courant : application et Storybook sans contenu de projet ; Zensical affiche la documentation existante de `docs/` dès son premier démarrage. Les démonstrations citées dans les références historiques restent hors des accès livrés ; ne pas les réactiver lors de l’initialisation. Les ressources internes requises par les contrats et les politiques sont conservées. Les nouveaux contenus du projet suivent les règles existantes.

# Remplacer l’exemple projets

Le mini-gestionnaire est une démonstration explicite ; le starter fonctionne sans dépendre d’un agent IA. Sa [spécification](features/projects.md) définit les règles ; le [bilan PORT-03 livré](../reviews/port-03/README.md) identifie la version, les contrôles du parcours et leurs limites.

## Place dans un projet dérivé

Dans le [parcours de démarrage](project-start.md), `/projects` sert aux contrôles et comme référence de fabrication. Il crée des fiches fictives enregistrées en base, pas des applications ou des dossiers. Ne pas présenter cet exemple, le UI Lab ou l’accueil générique comme la première version du projet.

Lors de la première tranche de réalisation autorisée, retirer leurs entrées de la navigation et des accès livrés, adapter l’accueil au projet et préparer Storybook autour des composants réellement utilisés. Une fonctionnalité de projets n’est conservée ou adaptée que si elle appartient au périmètre convenu. Les fichiers de référence encore utiles au développement peuvent rester hors du parcours livré ; cela ne remplace pas la vérification de navigation et de contenu du résultat réel. Les URL techniques ne sont pas bloquées par cette règle et aucune suppression de données n’en découle. Les contrôles et rapports ne doivent pas imposer `/projects` après son remplacement : ils ciblent les parcours du projet et le stockage pertinent.

Le starter de référence conserve sa démonstration et ses tests ; cette procédure ne les retire pas du kit source. Une suppression complète du code de l’exemple suit la procédure explicite ci-dessous, avec conservation des données existantes.

## Éléments de l’exemple

- app/routes/projects-*.tsx et leur bloc /projects dans app/routes.ts : coordination HTTP et UI.
- app/features/projects/ : contrat, gardes HTTP, repository serveur, formulaire/résumé et CSS ; leurs stories utilisent des données fixes, pas le repository.
- app/server/db/schema.server.ts, seed.server.ts et drizzle/0000_initial_projects.sql : table/fixtures et migration. Le client DB/configuration .server reste une capacité du socle.
- tests/unit/project-contract.test.ts, trois cas repository dans tests/integration/postgres.test.ts, tests/project-e2e/, scripts/test-projects.mjs et config/testing/playwright.projects.config.ts : preuves propres à l’exemple. Les autres tests PostgreSQL restent à adapter si le modèle est remplacé.
- src/App.tsx : lien depuis l’accueil. docs/product/brief.md, features/projects.md et project-data-contract.md : sources produit/données.

## Procédure de changement

1. Créer une branche locale, préciser le brief et les critères du nouveau domaine ; conserver le socle SSR, les modules serveur et les protections d’entrée. Définir les données avant les migrations.
2. Remplacer les routes/liens et les composants métier utiles ; conserver les composants/tokens J2. Éviter un composant générique sans besoin réel.
3. Pour un nouveau projet sans donnée, définir son schéma et ses migrations avant sa première initialisation. Pour une base déjà créée, ne pas modifier une migration appliquée : générer/relire une nouvelle migration, prévoir sauvegarde/compatibilité et une cible autorisée. Ne supprimer aucune table ni volume implicitement.
4. Adapter seed fictif, tests métier, stories et documents dans la même tranche. Mettre à jour explicitement le manifeste fermé `scripts/design-editor/manifest.mjs` : retirer les seuls chemins supprimés et inscrire les nouveaux composants, stories et routes consommateurs du DS. Les chemins déclarés doivent tous exister avant de relancer UI Lab ; ne pas contourner son contrôle de révision en ignorant les fichiers manquants ou en ajoutant une découverte globale. Préparer cette liste avant la première sauvegarde DS du dérivé. Si des reçus existent déjà avec une autre liste, conserver l’ancienne racine et son outillage pour diagnostic/reprise ; préparer une copie source inactive sans état privé, avec configuration neuve et traitement explicite des données. Ne jamais convertir/purger les reçus ni retirer un verrou pour forcer un changement de manifeste. Le starter conserve son manifeste d’exemple ; seul le dérivé reçoit ces remplacements. Conserver les contrôles transversaux : types, lint, format, frontières, autorités, tests pertinents et builds application/Storybook.
5. Exécuter les parcours avec base isolée, vérifier erreurs et redémarrage ; consigner les fonctionnalités retirées et limites nouvelles dans le suivi/passation. Refaire les revues applicables. Aucun push, publication ou reset de base découle de cette procédure.

Pour retirer complètement l’exemple, supprimer explicitement son bloc de routes et son lien, puis ses seuls fichiers métier/tests/stories devenus inutilisés. Le stockage préexistant reste conservé tant qu’une opération de données distincte n’est pas autorisée. Une suppression de fichiers versionnés est relue dans Git ; ne pas employer de purge globale.
