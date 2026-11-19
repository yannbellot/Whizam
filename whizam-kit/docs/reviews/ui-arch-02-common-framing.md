# UI-ARCH-02 — Bilan du cadrage et revues documentaires

**14 novembre 2026 — En revue, qualification documentaire acquise ; acceptation humaine différée.** Base inspectée `5945d0ed48d0ed1340cbb7f8a571021aa4bf8afc`, branche `codex/ui-arch-02-documentary-framing`. Réalisation limitée à la documentation, sans code, installation, génération, test applicatif ni service. Pas de capture ou preuve native inventée.

## Résultat

Le [contrat v1](../architecture/ui-architecture-boundaries.md) livre la matrice des sources, consommateurs et propriétaires, les scopes DTCG/CSS, la génération et les règles d’autonomie. La [décision 035](../decisions/035-ui-architecture-boundaries.md) distingue orientations demandées, choix techniques de cadrage et alignements préalables. La [fiche UI-ARCH-03](../work-items/ui-arch-03-first-ui-slice.md) prépare le parcours navigation des scènes → saisie dans Apparence → abandon du brouillon, dans le contenant actuel. Aucun de ces documents ne lance cette réalisation.

## Revues successives

Mode réel : **séquentiel, même agent, non indépendant**, un rôle après l’autre. Procédures applicatives `propose-architecture`, `plan-feature`, `technical-review`, `review-design`, `security-review` lues à la base inspectée ; aucune modification de ces procédures, aucun sous-agent ni service de scan.

| Revue | Couverture et résultat | Limite / réserve |
| --- | --- | --- |
| Technique | Sources et dérivés reliés aux imports app/Storybook et au writer ; types de sélection création/export distingués ; API de contrôle et critères de sortie documentés. Satisfaisant pour le cadrage | Compatibilité exacte des futures dépendances et publication atomique de nouvelles sorties non exécutées ; alignement prescriptif requis avant code |
| Design documentaire | Parcours existant représentatif, états, erreurs, focus, annulation et portées explicités ; pas de nouvelle esthétique ni fonction métier imposée. Satisfaisant pour la préparation | Aucun audit visuel ou parcours observé, aucune recette humaine ; formats et choix visuels de la tranche restent à vérifier |
| Frontières de confiance / autonomie | Aperçu sans privilèges outil, code de projet local non confondu avec sandbox, portails et CSS distingués, données privées et imports/exports explicités. Satisfaisant pour le contrat documentaire | Aucun test de sécurité, audit repository ou preuve d’isolement runtime ; contrôles de refus et d’export à exécuter dans les tranches concernées |

Deux écarts de formulation ont été corrigés avant conclusion : la préparation résumait création et exports comme une liste fermée unique alors que `project.export` parcourt les sources filtrées ; un contrôle limité au graphe d’imports ne prouverait pas l’isolement CSS. La matrice et les preuves futures traitent désormais les deux chemins d’export et les effets de cascade/portails. Le code existant n’a pas été modifié.

Les rôles lab Instruction Reviewer et Distribution Reviewer ne sont pas requis : aucune instruction d’agent ni qualification de distribution modifiée. Pas de certification de sécurité ou d’adoption visuelle déduite de ces lectures.

## Matrice CC-01 à CC-08

| Critère | Preuve livrée | Statut documentaire |
| --- | --- | --- |
| CC-01 | Contrat : trois propriétaires et inventaire des consommateurs/couplages | Satisfait ; découplage effectif non réalisé |
| CC-02 | Contrat : deux autorités, mapping Tailwind, génération et writer unique par responsabilité | Satisfait ; nouveaux dérivés non implémentés |
| CC-03 | Contrat : imports interdits, création/export distincts et preuves d’autonomie proposées | Satisfait ; autonomie cible non nouvellement testée |
| CC-04 | Contrat : API contrôlée, états/focus, HTML, compléments et transition Base UI/CSS Modules | Satisfait ; compatibilité des widgets non exécutée |
| CC-05 | UI-ARCH-03 : surfaces exactes, étapes, fichiers, critères UI-01 à UI-06, contrôles et retour arrière | Satisfait ; chantier préparé seulement |
| CC-06 | Contrat/fiche : Swift-WKWebView pour première UI, starter ensuite, Electron séparé | Satisfait |
| CC-07 | 035 : choix attribués, impacts d’autorités et porte d’alignement explicite | Satisfait pour le cadrage ; première UI interdite sans alignement prescriptif couvert par son mandat |
| CC-08 | Fiche UI-ARCH-02, présente revue, roadmap/état racine et documents reliés | Satisfait ; recette humaine différée |

## Contrôles et reprise

Inspection en lecture seule des fichiers suivis par `rg`, `sed` et `cat`, documentation officielle Tailwind/React Aria consultée sans compte ni donnée de projet. Les vérifications de liens et diff portent seulement sur les documents du mandat. Aucune commande npm, compilation, génération, installation, transaction ou requête vers une recette exécutée.

Les contrôles finaux de liens, périmètre et préexistants sont consignés dans la fiche UI-ARCH-02. Doc updated. Pas de secret, compte, accès ou configuration locale ajouté. Aucun changement dans les modèles de suivi applicatifs ni dans le cahier des charges racine.

**Reprise :** soumettre le contrat et les hypothèses au dossier humain ; un mandat distinct UI-ARCH-03 devra couvrir les alignements d’autorités avant code puis ses contrôles propres. Aucun chantier starter ou Electron n’est autorisé par cette clôture documentaire. Risques restants : découplage réel, cascade/Preflight, APIs/version des bibliothèques, reprise du writer et runtime multiplateforme à qualifier aux tranches correspondantes.
