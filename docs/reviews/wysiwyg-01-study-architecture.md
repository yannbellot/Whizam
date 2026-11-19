# WYSIWYG-01 A/B — Revue de l’étude et de l’architecture

**16 novembre 2026 — En revue, livrables documentaires réalisés ; acceptation humaine différée.** Base `c562f24342af0fa7d64a1cc2ce9626c9dc18e56a`, branche `codex/wysiwyg-01-study-architecture`. Cible application ; suivi de fabrication racine. [Étude](../architecture/visual-inspector-study.md), [architecture](../architecture/visual-inspector.md), [fiche](../work-items/wysiwyg-01-visual-inspector.md).

## Mandat, méthode et périmètre

Demande : réaliser l’étude comparative des cinq bibliothèques puis proposer l’architecture. Procédures applicatives propose-architecture / update-project-docs, sources au HEAD de départ ; procédures de revue design/technique/sécurité utilisées pour une relecture documentaire seulement. Aucun sous-agent. Six fichiers documentaires du chantier ; aucune modification de dépendance, code, décision approuvée, manifeste d’export, modèle applicatif ou configuration locale.

Sources publiques obtenues par le connecteur GitHub ; cinq HEAD résolus puis lectures par commit. Racines de licences, manifestes et fichiers techniques explicitement liés dans l’étude. bippy examiné en complément pour le candidat d’intégration, avec version de source distincte de toute résolution npm future. Aucun clone, script amont exécuté, installation ou accès fournisseur agentique. Les métadonnées personnelles GitHub ne sont pas recopiées dans les livrables.

Le sous-module public React Grab contredit l’hypothèse d’un besoin de réimplémenter toute la sélection : intégration ciblée proposée en premier. Les autres projets ne sont pas rejetés par principe ; les dépendances à EditorModel, store, contrôleur de commit ou graphe sont localisées. Coûts qualitatifs et cadence observée distingués des performances et du support effectifs.

## Conclusions des revues

Mode réel pour chaque lecture : **séquentiel, même agent, non indépendant**. Les conclusions portent sur des documents et sources lus, pas sur un rendu inexistant.

| Lecture | Conclusion | Preuves / réserves et retest |
| --- | --- | --- |
| Design | Satisfaisant avec réserves d’exécution | Mode interaction/inspection, clavier/focus, catégories, annulation, limite locale de preview et états de transmission explicités. Aucune référence visuelle nouvelle ni capture produite ; densité, lisibilité et interaction à vérifier sur la réalisation desktop. |
| Technique / QA | Satisfaisant pour A et proposition B ; qualification runtime non acquise | API primitives publique identifiée, comparaison des couplages, révisions/identités et lot proposés. Passerelle actuelle réellement lue : elle ne reçoit pas le lot typé ; extension explicitement future. Bundling, conformité CSS, restauration shorthand, rerendu et admission atomique restent des portes avant C/D. |
| Sécurité documentaire | Satisfaisant avec réserves avant intégration | Origine/capacités et racine dérivée conservées, lot non fiable et schéma strict, URL CSS non éditable initialement, pas d’HTML/chemin privé/Fiber transmis. Pas de vulnérabilité runtime recherchée ou de scan revendiqué. Imports regroupés, licences transitives et effets réseau à qualifier sur la distribution retenue. |

Points clarifiés lors de la relecture : un descendant DOM ne devient pas la racine enregistrée de son ancêtre ; aucun JSON libre dans text comme substitut à l’admission ; délai sans réponse = état inconnu ; normalisation CSS ne transforme pas une observation calculée en déclaration source ; prototype responsive distinct de l’affichage desktop de Loomata.

La compatibilité avec 038 est proposée par séparation des contextes : portées de demande dans Pages seulement, parcours Foundations/Components et création par chat conservés. Aucun ADR d’adoption rédigé comme décision acceptée. Si cette séparation se révèle impossible lors de la réalisation, arbitrage avant le changement prescriptif concerné.

## Contrôles et limites

Contrôles documentaires exécutés : 29 liens locaux des trois nouveaux documents et de la fiche résolus par Python ; 39 liens de sources de l’étude sur commits immuables, correspondant aux fichiers/commits consultés via GitHub ; git diff --check conforme. Diff des suivis et des livrables relu, six fichiers exclusivement sélectionnés ; les 86 chemins non suivis initiaux restent présents hors sélection. Sources et contenu technique relus ; pas de données privées ajoutées.

Tests unitaires/contrats, builds, E2E, benchmark, paquet distribué npm et WKWebView : **non exécutés**. Ils ne sont pas nécessaires à une proposition documentaire, mais bloquent toute prétention de qualification d’intégration. Aucun serveur, publication, GitHub Actions, push, modification des recettes personnelles ou appel Codex réel.

## Sortie et reprise

A réalisée : cinq dépôts examinés, références de fichiers immuables, licences et dépendances directes relevées, réemploi argumenté. B proposée : modules, contrat, flux, frontières, alternatives, portées et portes de qualification. C/D restent À faire, sur mandat distinct ; aucune bibliothèque adoptée par cette étude.

Doc updated. Version documentaire : commit local contenant les six fichiers, identifiable dans l’historique par `docs: study visual inspector libraries and architecture`. Risque résiduel principal : adéquation réelle de l’import React Grab et coût de l’admission typée, à tester avant l’inspecteur complet. Prochaine action : examiner cette proposition, puis mandater C/D avec qualification du candidat et adoption bornée avant intégration. Configuration recommandée : GPT-6.1 Sol · Élevée, plusieurs contrats et frontière navigateur/agent ; aucune hausse supplémentaire justifiée par l’étude statique.
