# 035 — Cadrer deux design systems et une fondation interactive commune

**Application bornée UI-ARCH-03 :** l’alignement avant code est désormais couvert par la [décision 036](036-first-ui-slice-adoption.md) et le mandat explicite de réalisation ; les formulations initiales ci-dessous conservent leur état documentaire daté. Socle des projets et Electron restent hors tranche.

**14 novembre 2026 — Décision de cadrage documentaire, En revue ; aucune implémentation.** Réalisation UI-ARCH-02 demandée explicitement après l’étude et sa préparation. [Contrat v1](../architecture/ui-architecture-boundaries.md), [bilan](../reviews/ui-arch-02-common-framing.md).

## Origine et statut des orientations

Le porteur a explicitement demandé de recommander Tailwind dans les deux architectures, Electron pour Loomata et React Aria comme bibliothèque interactive de référence, puis l’ordre cadrage commun → première UI → starter, avec Electron séparé. Ces orientations sont conservées. Le mandat courant autorise leur cadrage documentaire ; il n’autorise ni installation ni réalisation de la nouvelle stack, et ne constitue pas une acceptation visuelle des composants.

## Choix de cadrage retenus

1. Deux autorités de design : référentiel courant du projet préservé, référentiel propre au chrome pour les surfaces nouvelles. Réutiliser les algorithmes de génération et les méthodes, pas les valeurs ou composants runtime. Pas de nouveau package obligatoire.
2. Variables projet historiques conservées ; variables outil distinctes `--loomata-ui-*`. Thèmes Tailwind générés, jamais deuxième source éditable. Writer projet inchangé dans sa compétence ; aucune commande projet pour modifier l’apparence de l’outil.
3. Entrées/scans CSS distincts, pas de Preflight global lors de la première tranche, portails rattachés au thème outil. Les CSS Modules hérités restent pour les surfaces non converties. Ne pas supprimer de token historique par simple reclassement.
4. React Aria fournit les comportements ; état et validation métier restent dans les contrôleurs existants. Un seul propriétaire comportemental par widget ; Base UI transitoire et compléments spécialisés hors catalogue permis sur besoin justifié.
5. Première tranche UI bornée au parcours Design System : SceneNavigation, saisie de valeur dans AppearancePanel et confirmation d’abandon du brouillon. Les boutons et champs des scènes prévisualisées restent des composants projet ; ils ne sont pas remplacés dans cette tranche.
6. Sources autonomes pour les produits web, sans contenant Electron imposé ; contrôler séparément création et export. Le starter complet ne sera adapté qu’après la première tranche UI qualifiée.

Ces choix sont des choix techniques documentés compatibles avec l’étude. Leurs détails de rendu restent provisoires jusqu’à la qualification et à la recette humaine ; aucune nouvelle esthétique ni capacité d’accès n’est approuvée par ce texte.

## Alternatives écartées et conséquences

Une autorité unique dont le projet pourrait modifier le chrome brouillerait ownership et reprise. Une copie éditable du même thème dans Tailwind dupliquerait les décisions. Une extraction de packages ou un remplacement global des composants augmenterait le périmètre sans nécessité pour la première tranche. Un couplage du changement de styles à Electron mélangerait régressions de composants et de moteur de rendu.

La séparation exige à terme une adaptation des imports, contrôles de consommation, profils d’export et dérivés du writer. Le contrat ne prétend pas que ces travaux sont déjà faits. Il n’autorise pas à supprimer des fichiers ou à changer un format de données sous couvert de séparation visuelle.

## Alignements préalables au code

| Autorité | Impact à traiter au mandat de réalisation | État dans ce cadrage |
| --- | --- | --- |
| Cahier des charges racine, §6 | Formaliser Tailwind/React Aria comme évolution de la stack ; conserver CSS natif spécialisé et DTCG | Propriété lab ; pas modifié. Alignement explicitement requis avant code, dans un mandat couvrant cette autorité |
| Architecture app et DS, règle 024, contrat d’autorité | Distinguer état courant et cible, consommation dans JSX/classes, scopes et dérivés | Renvois documentaires seulement ; règles effectives non réécrites silencieusement |
| Manifeste/writer et générateur | Déclarer les nouvelles entrées/sorties, révision, publication/reprise et contrôle de péremption | Adaptation exécutable réservée à la réalisation ; pas de numéro de version augmenté ici |
| Création/export | Qualifier les profils et les deux chemins de sélection | Réservé au chantier starter ; absence de dépendance projet à l’outil non encore démontrée |
| Contenant et distribution | Version Electron, permissions et supervision multiplateforme | Tranche séparée après UI et starter ; aucun changement du contenant actuel |

Le cadrage peut être livré avec cette porte de gouvernance explicite. La première tranche UI ne peut pas commencer tant que l’alignement prescriptif nécessaire n’est pas couvert ; aucun contournement par un import expérimental ou un prototype implicite.
