# FIGMA-RECON-01 — Import direct et réconciliation Figma

**12 novembre 2026 — CHANTIER PRÉPARÉ, adapté au MVP.** Cible : application. Préparation documentaire, pas d’import exécuté. La proposition initiale fournie au porteur utilisait un package local/plugin compagnon ; ce choix est remplacé par la connexion directe validée. [Périmètre de référence](../product/loomata-workspace.md#références-figma-et-réconciliation), [décision 033](../decisions/033-loomata-mvp-scope-and-sequence.md), [séquence commune](mvp-01-three-stage-development.md).

## Résultat et dépendances

Importer une sélection Figma à la demande, connaître sa couverture, rapprocher ses éléments du projet, arbitrer les écarts et réaliser les changements acceptés sans perdre les comportements existants. Figma est facultatif par projet. Ce chantier contribue à T1 pour l’interface et la réconciliation, à T2 pour les interactions/parcours et à T3 pour leur pilotage ; son état n’est pas une quatrième tranche.

Prérequis : socle MVP-01-SOCLE, projet Loomata pris en charge, fichier pilote représentatif et accès Figma approprié. Qualifier les droits, conditions et couverture des interfaces officielles : structure, variables/tokens, variantes/états, assets, layout et réactions de prototype. Une donnée inaccessible est signalée ; aucun abonnement, secret, accès REST ou MCP n’est présumé fourni. Choix détaillé d’adaptateur à documenter avant réalisation. Aucun accès fournisseur effectué dans ce mandat documentaire.

## Contrats à raccorder

| Objet | Responsabilité |
| --- | --- |
| DesignProvider | Lire une source directe et annoncer capacités/limites, sans générer de code. |
| DesignImport / DesignElement | Observations, identités source, sélection, provenance, empreinte/version disponible et diagnostics de couverture. |
| ProjectInventory | Inventaire commun au MVP : pages, occurrences, composants, variantes, tokens, parcours, usages, règles et tests avec leur version. Aucune seconde base concurrente. |
| DesignCodeMapping | Relations plusieurs-à-plusieurs entre identités externes et internes, indices et statut de confirmation. |
| ReconciliationDecision | Conserver/adopter/combiner/reporter, proposition combinée, raison, dépendances et versions examinées. |
| ChangePlan | Préconditions, impacts et contrôles reliés aux demandes/tâches/chantiers et au moteur commun, sans seconde chaîne d’exécution. |
| SyncBaseline | Dernière référence Figma et base projet après intégration conservées séparément ; prise en compte des adaptations locales intentionnelles. |

Ces noms constituent des responsabilités de modèle proposées, pas des schémas ou technologies déjà approuvés. Les valeurs adoptées restent dans les autorités JSON DTCG/YAML propriétaires ; le registre ajoute des liens, sans recopier leurs valeurs comme seconde autorité.

## Parcours adapté

Dans Interface & Design System : connexion directe, sélection, récupération explicite, couverture, correspondances, comparaison référence/produit/proposition, puis arbitrages. Une image reste une référence visuelle, sans être présentée comme interface fonctionnelle. Les nouveaux éléments peuvent être créés par Codex dans les conventions prises en charge ; les modifications structurelles vont dans un chantier explicite. Les gestes simples peuvent rejoindre le brouillon commun.

Dans User Flow : rapprochement des interactions documentées, avec leurs lacunes. Toute modification fonctionnelle passe par le micro-chat. Ne pas déduire règles métier, validations, sessions ou actions serveur depuis un prototype visuel.

Dans Planification et Agents IA : mêmes demandes, conversations par élément, tâches, chantiers, commits et preuves que les autres travaux. Les décisions d’adoption ne valent ni réalisation ni vérification. Les règles d’intégration sont celles du périmètre consolidé, y compris délégation E2E explicite et arbitrages critiques ; la proposition antérieure d’une validation humaine systématique de chaque lot n’est pas reconduite.

## Incréments dans les trois tranches

- **T1 :** connexion directe réelle et import d’un écran pilote, correspondances et quatre arbitrages persistants ; évolution visuelle, création d’une page/composant prise en charge et premier réimport différentiel fiable.
- **T2 :** rattachement des interactions de prototype et vérification des écarts de parcours dans le modèle commun.
- **T3 :** traitement et lancement depuis Planification, consolidation de la traçabilité et reprise de la chaîne complète.

Un premier essai peut utiliser des données synthétiques ; elles ne prouvent pas la connexion directe ni la couverture d’un vrai fichier. Réimport et concurrence sur le périmètre T1 sont requis avant sa qualification, pas reportés après le MVP.

## Critères de sortie à exécuter

- Import valide sans écriture produit avant arbitrage ; échec d’accès ou import interrompu sans état partiel présenté comme valide.
- Une absence dans une sélection ne supprime rien ; renommage avec identité conservée sans perte de correspondance. Duplication/détachement ou identité ambiguë explicitement signalés.
- Correspondances multiples, états manquants et couverture partielle visibles ; consommateurs partagés connus exposés.
- Réimport identique sans nouvel effet ; personnalisation locale adoptée non reproposée comme divergence accidentelle.
- Évolution simultanée Figma/projet/brouillon distinguée, préconditions vérifiées ; aucun écrasement silencieux.
- Aperçu fonctionnel distinct de la référence, comportements métier, clavier et accessibilité conservés ; modification postérieure invalidant ses preuves.
- Reconstruction des correspondances/décisions depuis Git sans historique privé ni accès vivant à Figma pour comprendre la provenance enregistrée.

Revues design/technique/sécurité applicables à l’import et à l’exécution, indépendance réelle déclarée. La préparation mentionnait « six situations du brief » sans les détailler : ne pas prétendre les couvrir ; les scénarios ci-dessus sont les critères explicites retenus pour la présente préparation, à compléter avec le fichier pilote.

Doc updated. État de réalisation : À faire. Aucun plugin, synchronisation bidirectionnelle, accès global ou nouvelle dépendance approuvé. Reprise : qualifier l’adaptateur direct et le fichier pilote dans le mandat T1, après le préalable commun.
