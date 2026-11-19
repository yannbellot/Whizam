# Exports et livraisons locales de Loomata

UI-FINAL-01 E — macOS arm64, qualification locale. Le cœur reste dans /application. Aucune publication ni notarisation n’est impliquée.

## Exporter

Dans le menu Projet : Exporter les sources du projet ou Exporter les sources de Loomata. Le sélecteur rappelle la portée : sources enregistrées uniquement. Enregistrer auparavant les brouillons utiles dans UI Lab ; exporter ne sauvegarde et n’annule aucun brouillon. Choisir un nouveau ZIP hors du projet et de l’installation. Une collision est refusée sans écrasement, même si le sélecteur propose un remplacement.

Même cœur en mode dossier : `npm run core:host -- project.export /chemin/projet '{"destination":"/chemin/Projet.zip"}'` ; remplacer par `tool.export` pour le socle. La liste du socle est fermée et versionnée ; le projet inclut ses sources publiques et les nouveaux fichiers de ses répertoires applicatifs. Les liens de skills internes validés sont conservés ; les autres liens ne sont pas transportés. Une récupération DS non résolue bloque l’export. Les sources sont contrôlées avant publication et revérifiées ; un changement observé fait échouer la tentative.

Le ZIP contient un inventaire SHA256 `loomata-export.json`. Exclus : Git et son historique, connexions et conversations IA, fichiers cachés privés, secrets reconnus par leur chemin/nom, dépendances/caches/builds, fichiers usuels de base de données et stockage utilisateur. Les migrations source restent des sources. Aucun détecteur ne peut garantir qu’un secret placé dans un fichier public ordinaire sera reconnu : vérifier les sources avant transmission. Les données PostgreSQL et les brouillons ne sont pas exportés. Ce ZIP est une sauvegarde des sources à préparer, distincte des livraisons avec runtime décrites ci-dessous.

## Deux contenants, un cœur

Le dossier prêt à lancer contient les sources sélectionnées, dépendances et Node 24.22.0/npm 11.19.1 pour macOS Apple Silicon. Copier le dossier complet, puis ouvrir Lancer.command. Il démarre UI Lab et Storybook et ouvre UI Lab dans le navigateur. Les caches et états créés après usage sont privés : utiliser les exports de sources pour partager un projet, plutôt que recopier une installation déjà connectée.

L’app contient la même sélection et le même runtime dans Resources. Au premier lancement, elle crée une installation de travail privée sous `~/Library/Application Support/Loomata/installation-v1`, hors du bundle. Les projets créés sont choisis dans des dossiers distincts selon C. L’installation et son dernier contexte restent locaux ; aucun compte n’est transporté depuis la fabrication. Une installation interrompue ou d’une autre version est refusée avec conservation des données ; aucune migration ni mise à jour automatique n’est livrée. Le bundle peut être déplacé avant lancement. Les tests utilisent un emplacement privé de qualification explicite, sans écrire dans le dossier Application Support réel du porteur.

Construction locale sur le Mac de fabrication préparé : `npm run package:local -- /nouveau/dossier /archive/node-v24.22.0-darwin-arm64.tar.gz`. La somme attendue est verrouillée dans le script, issue des [sommes officielles Node](https://nodejs.org/dist/v24.22.0/SHASUMS256.txt). L’archive fournit Node, npm et leurs licences ; les dépendances de l’outil sont clonées depuis son installation préparée. Le Mac de fabrication requiert Swift/SDK Apple ; l’utilisateur de l’app construite ne compile rien et n’a pas besoin de Node/npm global. Les outils système macOS restent utilisés. La signature est ad hoc locale ; signature Developer ID, notarisation, mises à jour et diffusion externe restent à qualifier dans F. La construction ne télécharge aucune clé ni connexion personnelle.

`npm run test:exports` vérifie refus/exclusions/intégrité. `npm run test:deliveries -- /chemin/livraison` exerce un bundle déplacé, son runtime, l’atelier et les deux vrais sélecteurs d’export via Accessibilité. Une session graphique et les outils Apple sont requis pour ce pilote, pas pour utiliser le bundle normal. [Rapport et limites](../reviews/ui-final-01-e/README.md). **Doc updated.**
