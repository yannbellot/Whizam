# MVP-01 — Préparer le périmètre et les trois tranches Loomata

**12 novembre 2026 — CHANTIER PRÉPARÉ.** Cible : application ; suivi de fabrication dans la roadmap racine. Mandat actuel : documentation et roadmap uniquement. Base `f9825de`, branche `codex/loomata-mvp-scope`. Prototype Claude conservé séparément sur `codex/claude-subscription-probe` (`e47c995`), sans reprise des essais ni intégration de son code. Fichiers non suivis préexistants exclus.

## Autorités et méthode

[Décision 033](../decisions/033-loomata-mvp-scope-and-sequence.md), [périmètre fonctionnel](../product/loomata-workspace.md), [Figma adapté](figma-recon-01-design-reconciliation.md), [cœur existant et cible](../architecture/shared-core.md). Procédures app sélectionnées explicitement : plan-feature et update-project-docs à `f9825de`, sans modification de leurs sources. GPT-6.1 Sol · Élevée : contrats transversaux et documents à réconcilier ; aucune hausse Très élevée/max ni sous-agent.

Le tableau ci-dessous prépare les réalisations ; tous ses critères techniques restent à exécuter. Les choix de schémas, formats de stockage, mécanismes Git, bibliothèques de graphe et protocole Figma seront arrêtés dans le mandat technique compatible avec la stack. Aucun backend distinct ni dépendance supplémentaire approuvée par cette préparation.

## Tranche 1 — Interface & Design System et Agents IA

### Préalable commun : MVP-01-SOCLE

Ce préalable est le début de la tranche 1, pas une quatrième tranche. Sa qualification technique bloque les fonctions qui en dépendent. La [préparation dédiée MVP-01-SOCLE](mvp-01-common-foundation.md) détaille les étapes, prérequis et preuves ; le socle est désormais techniquement qualifié selon son [bilan](../reviews/mvp-01-common-foundation/qualification.md), acceptation humaine différée.

| Contrat partagé | Preuve exigée avant les fonctions de la tranche 1 |
| --- | --- |
| Identités et inventaire | Identités stables de pages, occurrences, composants, variantes, tokens, parcours et objets de suivi ; renommage sans perte de liens ni de conversation. Ne pas confondre une définition avec son occurrence. |
| Modèle durable | Demande, tâche, modification, commit, chantier et décisions reliés sans correspondance un à un ; jeu représentatif comportant aussi des parcours et tâches futures, sérialisation et reconstruction depuis Git sans base préexistante. Historique privé exclu. |
| Moteur de modification | Même précondition/révision/portée pour inspecteur et Codex ; contrôle de péremption, transaction, annulation sans écrasement, états appliqué/en vérification/validé distincts. Le writer DS conserve sa compétence bornée. |
| Brouillon et isolation | Un brouillon instantané durable, reprise après arrêt/crash, annulation après réouverture ; chantier isolé concurrent, versions conservées en cas de conflit. Commit et intégration éprouvés séparément. |
| Conversations et exécution | Connexion Codex officielle dédiée, session persistante liée à une identité, contexte/version actualisés, interruption sans double action et autorisations réelles. Pas de droit ajouté implicitement au broker actuel. |
| Projections | Révision commune observable ; modification Codex générale reconnue répercutée, modification non interprétable signalée ; aperçu lié à un seul état ; aucune projection incertaine annoncée valide. |
| Règles de passage | Cas non critique automatique, cas visible humain, délégation E2E explicite, échec E2E et cas critique bloquant éprouvés sur versions identifiées. |

Les contrats fonctionnels des trois tranches sont fixés et testés ici avec des données synthétiques ; cela ne qualifie pas les futures interfaces User Flow et Planification. Les contrôles obligatoires de ce socle doivent être réellement exécutés avant sa qualification. Les incertitudes restantes ont un propriétaire et un impact ; une dépendance bloquante ne devient pas une réserve silencieuse.

### Fonctions de la tranche 1 : MVP-01-T1

[Préparation dédiée T1](mvp-01-interface-design-agents.md) : étapes, critères, contrôles et prérequis. Réalisation À faire sur mandat distinct ; cette fiche de séquence conserve son mandat documentaire initial.

- Modes Pages et Design System, navigation hiérarchique, sélection, inspecteur de style et micro-chat ; exploration des pages réelles au-delà des scènes préparées.
- Modification globale et variante locale réutilisable, impacts des tokens et composants connus, même brouillon pour gestes déterministes et Codex.
- Espace Agents IA : conversations générales et contextualisées, une conversation persistante par élément ; réponses pédagogiques et glossaire commun.
- [FIGMA-RECON-01](figma-recon-01-design-reconciliation.md) : accès direct en lecture, actualisation explicite, correspondances/arbitrages, premier réimport fiable ; création de pages et composants via Codex dans les conventions prises en charge.
- Demandes planifiées déjà conservées par le socle. Avant l’espace Planification, qualification et lancement explicite d’un chantier restent accessibles depuis Agents IA ; pas d’exécution implicite ni de second stockage temporaire. Cette présentation transitoire reste une hypothèse UI réversible à vérifier au cadrage technique, sans ajouter une nouvelle fonction.

**Sortie T1 :** ouvrir Loomata, créer un projet, sélectionner une occurrence de page, expliquer puis modifier son style, créer une variante locale, retrouver impacts/conversation/brouillon après fermeture, commiter puis intégrer selon le mode prévu. Dans un fichier Figma réel pilote, récupérer une référence, adopter/combiner un écart, créer un élément nouveau pris en charge et réimporter sans proposer à nouveau les écarts déjà résolus. Les éléments non pris en charge sont explicitement signalés. Revues design/technique/sécurité et limites documentées.

## Tranche 2 — User Flow : MVP-01-T2

**Dépendance :** socle et tranche 1 techniquement qualifiés ; acceptation humaine différée selon les règles du lab. Réutiliser l’identité, les versions, les services et les conversations de T1.

Graphe orienté interactif, branches/conditions/boucles/retours, nœuds repliables ; arborescence gauche, description accessible et liens Markdown/ancrages à droite, micro-chat contextualisé. Prévu/réalisé/vérifié distincts, propositions importées non adoptées identifiées. Le graphe ne permet pas l’édition fonctionnelle directe : toute modification passe par le micro-chat et le moteur commun. Rapprocher les interactions Figma reconnues sans inférer des règles métier absentes.

**Sortie T2 :** un parcours représentatif avec condition et retour, sélection et navigation vers sa page/règle ; demande par micro-chat, réalisation dans le projet, contrôle comportemental, actualisation des états et reprise après fermeture. Une évolution Codex générale reconnue met à jour le parcours ; sinon un écart est signalé. Revues design/technique/sécurité proportionnées ; aucune preuve d’exhaustivité universelle déduite du graphe.

## Tranche 3 — Planification et Agents IA : MVP-01-T3

**Dépendance :** T2 techniquement qualifiée et identités/modèle conservés depuis T1. Agents IA existe dès T1 ; T3 ajoute son pilotage coordonné des demandes et des chantiers, pas un second agent.

Liste de demandes/tâches en attente, bouton « Traiter la liste », qualification et proposition de répartition dans des chantiers nouveaux ou existants. Lancement explicitement décidé par l’utilisateur, séparé du traitement de liste. Roadmap, tâches/chantiers sélectionnables, périmètre et liens Markdown, micro-chat, suivi des exécutions et preuves. Modifications instantanées visibles immédiatement comme brouillons sans chantier ; rubrique dédiée ; regroupement au commit et position chronologique au commit. Préserver les rattachements existants, sans dupliquer une tâche ni imposer un chantier par commit.

**Sortie T3 :** plusieurs demandes issues des espaces et d’un chat général, traitement sans lancement implicite, lancement explicite puis exécution isolée ; suivi cohérent d’une modification instantanée concurrente, commit et regroupement sans perte ; conflit ambigu soumis à arbitrage. Reprise complète, reconstruction durable, modes d’intégration et dossier de recette final des quatre espaces. Revues design/technique/sécurité et régression des tranches 1–2.

## Frontières et qualification finale

Administration, Claude, projets hétérogènes, import par plugin compagnon, synchronisation bidirectionnelle et interface de retour aux commits hors MVP. La connexion Figma, ses permissions, sa couverture (variables, composants, états, assets, prototypes) et le fichier pilote restent à qualifier ; pas de substitution silencieuse par un plugin. Aucun accès ni quota n’est acquis par cette fiche.

Conserver les exigences de livraison autonome, exports, confidentialité, données et reprise ; UI-FINAL-01 F et les réserves J4/J5 restent à traiter avant clôture/distribution, sans inventer une quatrième tranche fonctionnelle. J5 et l’acceptation finale ne sont pas acquis par des E2E. Les critères ci-dessus préparent la recette ; le périmètre est approuvé, les réalisations restent À faire.

## Compte rendu documentaire

Fichiers concernés : périmètre produit, décision 033, présente fiche et FIGMA-RECON-01, renvois des contrats existants, cahier des charges/README/roadmap/état racine et sélection des quatre documents nouveaux dans scripts/project-files.json. Modèles de suivi de projets dérivés inchangés. Contrôles : cohérence, liens locaux, périmètre du diff ; [revue documentaire](../reviews/mvp-01-scope-and-roadmap.md). Doc updated. Risque résiduel : faisabilité d’import et contrats détaillés à éprouver. Prochaine action : mandat distinct de réalisation du préalable commun et de T1 ; aucun développement de fonction, serveur produit ou installation par cette préparation ; seuls les contrôles ciblés de sélection/copie documentaire sont exécutés.
