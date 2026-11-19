# 002 — Skill dédié à l’initialisation des projets

**25 octobre 2026 — décision approuvée par le porteur.** La validation porte sur la méthode ; les preuves d’exécution et l’acceptation du livrable restent distinctes.

## Contexte

Le démarrage depuis une copie du kit, éventuellement sur une machine sans outils, couvre environnement, prérequis, cadrage, documents, lancement et reprise. Le mode ajouté à plan-feature dans INIT-01 mélangeait ces responsabilités avec la planification d’une fonctionnalité. Le porteur a précisé que les vingt skills initiaux ne sont ni un plafond ni une raison de regrouper des responsabilités différentes.

## Décision

Créer [initialize-project](../../skills/initialize-project/SKILL.md), sélectionné par AGENTS et Builder pour « Initialise un nouveau projet [nom] » ou la reprise de son initialisation. Le skill porte le parcours et ses critères ; la référence d’environnement se charge seulement lorsqu’une initialisation technique doit être réalisée ou reprise. Réutiliser les scripts opérationnels et les skills de cadrage/planification utiles, sans dupliquer leurs procédures. Plan-feature retrouve sa responsabilité de préparation d’une tranche.

La bibliothèque est extensible selon les besoins validés. Le catalogue déclare les sources et ressources, les rôles et le nombre attendu de la livraison courante ; ce nombre est un contrôle de complétude, pas une limite universelle. Les adaptations exposent les mêmes sources canoniques. Une extension doit actualiser catalogue, expositions, références et preuves.

La [décision 004](004-guided-project-start.md) complète ce choix : initialize-project conserve sa séquence technique dans un parcours qui confie le cadrage et la réalisation aux procédures existantes, puis présente les accès à la première revue.

## Conséquences et alternatives

Un mode de plan-feature conserverait des responsabilités mêlées ; une simple procédure documentaire serait moins identifiable comme capacité de la bibliothèque. Le skill dédié permet une sélection et une évaluation propres au parcours. Il reste disponible pour reprendre une initialisation interrompue ; un projet terminé n’est pas réinitialisé à l’ouverture d’un chat ou pendant une tâche courante.

Les instructions n’installent pas implicitement des outils système et ne prouvent pas leur fonctionnement sur une machine vierge. Les permissions, les données existantes et l’autorisation distincte de publication restent applicables. [INIT-02](../work-items/init-02-dedicated-initialization-skill.md) porte la migration et ses contrôles ; INIT-01 reste historique sur sa version.
