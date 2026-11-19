# DS-EDIT-08 — Séparer Composant et Styles sémantiques

30 octobre 2026 — **En revue : réalisation livrée, contrôles hors E2E conformes, recette et acceptation humaines en attente.** [Bilan, contrôles et trois revues](../reviews/ds-edit-08-component-semantic-style-separation.md). Cible : application ; chantier de fabrication du kit rattaché à DS-EDIT-01 et aux preuves J2/J4/J5. Statut consolidé dans la roadmap de fabrication ; ROADMAP.md et docs/project-state.md livrés restent des modèles non initialisés.

## Réalisation autorisée et bilan

Nouveau mandat explicite du 30 octobre : réaliser la fiche et mettre à jour directement le Storybook local, **sans recette E2E**. Il remplace la limite de préparation décrite historiquement ci-dessous et exclut les commandes navigateur de la campagne prévue. Base `8846c8d`, branche `codex/separate-semantic-style-workspace` ; état initial sans diff suivi, préexistants inchangés.

Les tranches A–C sont réalisées : création `create-style` sans attribution, domaine dérivé côté serveur d’un binding connu (choix minimal plutôt que nouveaux champs libres), ordre création/attribution, états indépendants et deux espaces. Enregistrer reste commun ; création valide automatique, erreurs conservées et annulation ciblée. Aucune migration des valeurs, source YAML de référence ou dépendance nouvelle.

D livrée avec réserves explicites : 82 unitaires, 47 contractuels, 72 serveur et trois retests serveur ciblés (un recouvrement), types/lint/formatage, documents générés et builds conformes. Trois revues séquentielles du même agent, non indépendantes. C07 et l’ordre de C08, la conservation du brouillon de C11 et la persistance store de C12 sont éprouvés hors navigateur ; C01–C06/C09–C10 et les aspects UI de C08/C11–C13 restent à éprouver par recette. Aucune qualification E2E ou relecture compilée après sauvegarde revendiquée.

Storybook habituel 54086 et UI Lab associé 54085 actualisés sur une nouvelle racine commune, ancienne conservée ; huit sources identiques et sept reçus préservés dans l’ancienne racine. Safari rechargé après constat sans brouillon : entrées Composant/Styles sémantiques et #5e30eb retrouvées, sans interaction de recette ni sauvegarde. **Doc updated.** Prochaine action : recette du porteur ; aucune poursuite automatique G/J5 ni publication. Le détail des fichiers, échecs corrigés, hypothèses et limites est dans le bilan lié.

## Historique de préparation — mandat, version et méthode

Préparer le déplacement de la création et de la modification des styles partagés dans un onglet dédié, selon la [décision humaine 012](../decisions/012-component-and-semantic-style-workspaces.md). La présente demande autorise inspection en lecture seule, fiche, décision et suivi documentaire uniquement. Aucune installation, modification du code applicatif, génération, exécution de test, serveur, mise à jour de recette ou publication.

Base inspectée : `cc51557cae832e6834930a3362eedcb87522e421`, branche initiale `main`, sans diff suivi. Préexistants hors périmètre : copies non suivies suffixées ` 2` et `frontend/`, conservés sans lecture de leur contenu ni nettoyage. Racine Git canonique vérifiée avant écriture. Branche documentaire : `codex/prepare-semantic-style-workspace`.

Catalogue applicatif consulté ; rôle Builder et procédure `plan-feature` explicitement sélectionnés depuis l’app, version présente à la base inspectée, dernière modification du skill `3c5ed91`. Lecture du contrat commun et des autorités utiles ; aucune bibliothèque applicative chargée automatiquement comme procédure du lab. Préparation par un seul agent, sans sous-agent. Les versions qualifiées antérieures du kit restent des preuves historiques, pas une qualification du parcours proposé.

## Observations confirmées

- `.storybook/editor/Panel.tsx` possède déjà deux entrées internes mais elles partagent l’éditeur de réglage et ses actions `assign`, `create`, `local`, `shared`. Cliquer un style dans « Styles créés » sélectionne un binding consommateur, ou un compatible de repli, puis une story : ce n’est pas une fiche de style indépendante.
- « Choisir » attribue un style existant ou sélectionne seulement une intention. Le bouton de création appelle `planCreation`, prépare `create-and-assign`, retire le changement local de la cible et déclenche la projection ; il n’enregistre pas. Le blocage d’Enregistrer dépend actuellement de cette confirmation.
- `.storybook/editor/session.ts` stocke un seul `selected` de binding, un `query` partagé, un `plannedCreate` unique et un brouillon global. Une création reste attachée à un binding ; `candidateModel`, `plannedOperations`, `previewKey` et la sauvegarde dépendent de cet état.
- `src/design-system/editor/operations.ts` et `contract.ts` exposent cinq opérations. `update-shared` vise déjà un style ; `create-and-assign` exige une cible, dérive type/rôle/état et attribue aussitôt. Le modèle valide aussi des styles inutilisés ; cela ne démontre pas leur création autonome par le service actuel.
- La spécification §7 exige un brouillon unique conservé entre onglets et un enregistrement de l’ensemble. L’aperçu/contraste et les blocages de sauvegarde sont encore liés à une scène préparée. Leur adaptation est nécessaire pour une bibliothèque indépendante.
- La décision 011 a remplacé le catalogue sur demande de 010 : alternatives visibles et filtre limité aux alternatives ; les recommandations restent visibles. Ne pas rétablir les anciens libellés ou le bouton d’exploration sur la seule base des premiers échanges.

Sources : [panneau](../../.storybook/editor/Panel.tsx), [session](../../.storybook/editor/session.ts), [moteur](../../src/design-system/editor/operations.ts), [contrat](../../src/design-system/editor/contract.ts), [spécification](../product/features/design-system-editor.md), [guide](../design-system/editor-preview.md), [persistance](../design-system/editor-persistence.md), [autorités](../../src/design-system/authority/README.md).

## Parcours cible et critères d’acceptation

| ID | Résultat observable attendu |
| --- | --- |
| C01 | Deux onglets nommés Composant et Styles sémantiques, utilisables au clavier, avec rôle et portée compréhensibles sur desktop et mobile. |
| C02 | Composant propose attribution d’un style compatible, exception locale et rétablissement. Aucune commande directe de création ou modification partagée, y compris dans le menu d’action. |
| C03 | Composant montre style attribué, valeur effective et exception éventuelle. Choisir un style existant retire l’exception en brouillon comme aujourd’hui ; la compatibilité reste type/rôle/état. |
| C04 | Voir ce style ouvre exactement le style attribué dans Styles sémantiques, sans mutation. Le retour retrouve le contexte du composant. |
| C05 | La bibliothèque possède sa sélection et sa recherche propres. Sélectionner un style ouvre sa fiche sans changer une attribution ni choisir implicitement un autre style via une story. Un style sans usage reste consultable et modifiable. |
| C06 | La fiche d’un style permet de modifier sa valeur partagée et montre les réglages dépendants, les exceptions préservées et la réserve d’inventaire. Ces usages ne sont pas un compteur d’instances dans les pages. |
| C07 | La création dans Styles sémantiques prépare intention, type/rôle/état compatibles et valeur normalisée. Pas d’attribution implicite à un composant. Un doublon propose le style existant sans l’écraser ; identité et primitive restent calculées/validées par le moteur. |
| C08 | Créer un style à partir de ce réglage… ouvre une préparation préremplie, sans mutation. Après préparation, le style apparaît dans le brouillon de bibliothèque ; un retour explicite à Composant permet de l’attribuer, avant ou après enregistrement. |
| C09 | Le guidage conserve les recommandations contextuelles si le formulaire vient d’un réglage. Sans ce contexte, aucune recommandation de composant n’est inventée ; les intentions compatibles restent explorables selon 011. Le filtre de bibliothèque ne masque pas les recommandations du formulaire. |
| C10 | La préparation valide alimente automatiquement le brouillon et l’aperçu ; aucun second bouton ambigu « Créer et appliquer » n’est requis. Une saisie incomplète reste visible et bloque explicitement la sauvegarde ; annuler le formulaire la retire sans perdre les autres modifications. |
| C11 | Navigation entre onglets, styles et stories : aucune perte du brouillon ou attribution silencieuse. Enregistrer récapitule et sauvegarde tout le brouillon, opérations locales et partagées comprises. Les boutons d’annulation précisent leur portée. |
| C12 | Après sauvegarde puis rechargement, style, valeur et attribution explicitement choisie sont conservés ; un style créé seul n’a modifié aucun binding. Comparaison, contraste insuffisant/non mesuré, erreurs et résultat inconnu restent explicites. |
| C13 | Le statique conserve consultation et possibilités d’aperçu déjà autorisées ; création durable et enregistrement indisponibles avec raison visible. Protection locale, conflits, idempotence et reprise inchangés dans leurs garanties. |

## Choix techniques proposés et limites

Ces choix sont délégués à la réalisation, pas des capacités constatées :

- Séparer sélection du binding, sélection du style et formulaire de création ; conserver un seul journal de brouillon. Des filtres propres à chaque espace évitent le couplage actuel par `query`. L’onglet n’est pas une autorité de persistance.
- Préparer une opération de création sans attribution (nom de travail `create-style`) plutôt que créer puis rétablir un binding caché. La sélection des tuples autorisés doit venir de la matrice fermée, avec validation serveur ; aucune identité, référence primitive ou chemin libre accepté. Définir schémas, version de protocole et règles d’ordre avec `assign` avant implémentation. Conserver la lecture et la récupération des opérations antérieures selon leur version ; ne pas convertir les anciens journaux implicitement.
- Préparer le nouveau style dès que ses champs sont valides, avec mise à jour de la même identité de brouillon plutôt que doublons à chaque frappe. Conserver des bornes explicites ; ne pas imposer plusieurs créations simultanées pour cette tranche. Une attribution ultérieure dans la même sauvegarde doit référencer une création déjà validée dans l’ordre des opérations.
- Pour un style sans consommateur, présenter un aperçu de valeur adapté et « Aucun usage attribué ». Ne pas exiger une story arbitraire pour sauvegarder ce style ; ne pas déclarer son contraste validé sans paire mesurée. Pour une modification avec consommateurs, conserver les projections et contrôles réels sur scènes préparées, avec limites d’inventaire visibles.
- Réutiliser les mécanismes existants de validation, normalisation, allocation, projection et écriture. Pas de nouvel endpoint ou service par défaut, ni de nouvelle stack. Une extension du protocole fermé doit être couverte par les mêmes refus HTTP et garanties transactionnelles.

Hypothèses minimales réversibles : un brouillon commun et une création en préparation à la fois ; sélection et filtres mémorisés pendant la session ; libellé secondaire proposé « Créer un style à partir de ce réglage… ». Retest humain de compréhension à prévoir. La création indépendante et les attributions enchaînées sont le risque principal : aucune qualification déduite de l’inspection. Si leur solution impose une migration de données ou un autre élargissement matériel, consigner le point de reprise et obtenir l’arbitrage avant réalisation concernée.

Hors périmètre : suppression/fusion/renommage de styles, nouvelles catégories, nouvelles variantes/cellules, refonte des primitives, réglages d’autres applications, modification des valeurs existantes, données métier/PostgreSQL, installation globale, fournisseurs IA, distribution publique ou déploiement. Aucune intervention dans la copie externe ni dans l’instance humaine pendant cette préparation.

## Tranches de réalisation futures

1. **A — Contrats et parcours.** Reprendre la base Git réelle ; aligner la spécification et les schémas sur 012, définir création séparée, ordre création/attribution, aperçu sans usage et invariants du brouillon. Écrire les cas négatifs des identités/tuples/valeurs et de l’enchaînement avant raccordement UI. Dépendance : cette préparation et mandat de réalisation explicite.
2. **B — Moteur et session.** Implémenter la création séparée et les sélections indépendantes, préserver validations et états d’échec, adapter le candidat et la révision/manifeste si nécessaire. Prouver création sans mutation de binding, attribution explicite dans la même transaction, absence de doublon et conservation des exceptions. Dépendance : A cohérente et contrôlée.
3. **C — Interface et documentation.** Séparer les onglets et leurs commandes, relier Voir ce style et le raccourci prérempli, déplacer guidage et usages, adapter les blocages d’Enregistrer et les états vides. Synchroniser guide/autorités/README et procédures directement affectées seulement si leurs gestes changent. Dépendance : B qualifiée sur ses contrats.
4. **D — Qualification et reprise.** Parcours isolés dev/statique, vraie persistance et relecture compilée, captures examinées, revues et corrections. Préserver les sources/reçus/brouillons de recette ; toute mise à jour d’instance vérifie ces prérequis et suit le guide de changement de version. Aucun transfert automatique d’un journal ancien. Remettre bilan et recette humaine différée ; pas de clôture automatique G/J5.

## Surfaces à modifier lors de la réalisation

| Surface | Fichiers pressentis, à confirmer après A |
| --- | --- |
| Interface/session | `.storybook/editor/{Panel.tsx,panel.module.css,session.ts,Preview.tsx}`, `src/design-system/editor/{draft.ts,protocol.ts}` si projection affectée. |
| Contrats/moteur | `src/design-system/editor/{contract.ts,operations.ts}`, `src/design-system/authority/schemas/editor-request.schema.json`, dépendants de génération/snapshot si nécessaires ; schéma de réponse uniquement si sa forme change. |
| Persistance | `.storybook/editor/server/{manifest.mjs,store.mjs,files.mjs}` selon dépendants réels ; conserver la frontière de `http.mjs`, aucun assouplissement pour accepter la nouvelle opération. |
| Preuves | `tests/design-system-editor.test.mjs`, tests unitaires session/opérations existants, `tests/design-editor/editor.spec.ts`, `tests/editor-persistence/save.spec.ts`, tests store/HTTP et documentation directement affectés. |
| Documents | `docs/product/features/design-system-editor.md`, `docs/design-system/{editor-preview.md,editor-persistence.md}`, `src/design-system/authority/README.md`, `README.md`. Catalogue et inventaire générés uniquement via le générateur lors de la réalisation. |

Ne pas modifier les fiches YAML ou les valeurs de référence pour faire passer les tests ; utiliser des données fictives isolées. Les modèles de suivi applicatifs restent non initialisés.

## Contrôles et revues à exécuter lors de la réalisation

Commandes à lancer depuis la racine applicative **dans une copie isolée identifiée**, jamais pendant un enregistrement humain : `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run test:design-system`, `npm test`, `npm run docs:design-system:check`, `npm run build`, `npm run build-storybook`. Ajouter `npm run validate:agent-kit` seulement si des procédures du kit changent. Les précommandes peuvent générer des dérivés : aucune exécution dans la présente préparation.

Parcours ciblés : `npm run test:design-editor:dev` et `npm run test:design-editor` pour C01–C11/C13 ; `npm run test:design-editor:persistence` pour C07/C08/C12 ; `npm run test:design-editor:server` pour schéma fermé, valeurs/tuples refusés, conflits et idempotence. Vérifier la vraie relecture compilée, pas seulement un succès HTTP. Si journal/manifeste/store changent, ajouter les campagnes `test:design-editor:recovery` et `test:design-editor:live` applicables à ces garanties. Conserver les échecs et limites, ne pas annoncer de succès global à partir d’un sous-ensemble.

Scénarios obligatoires : attribution existante avec exception, style sans usage, création indépendante puis attribution explicite, doublon et valeur invalide, navigation avec brouillon, annulation sans perte des autres changements, modification partagée avec exceptions masquées, enregistrement mixte, conflit, réponse perdue, clavier/focus, desktop/mobile et consultation statique sans service d’écriture. Comparer avant/après les bindings non visés et les valeurs initiales ; nouvelles valeurs seulement dans les fixtures.

Revues futures : Design Reviewer (compréhension des deux espaces, aperçu et portée), Technical Reviewer / QA (contrats, ordre des opérations et conservation du brouillon), Security Reviewer (extension de requête, validation fermée et reprise). Mode prévu : **séquentiel, même agent, non indépendant**, faute d’autorisation de délégation. Les rôles/skills de revue seront lus lors de la réalisation. Pas de revue formelle d’instructions ou de distribution pour cette préparation, qui n’en modifie aucune ; relecture documentaire par le préparateur seulement. Ni revue visuelle ni qualification d’exécution revendiquée maintenant.

## Recommandation Codex

Préparation documentaire : GPT-6.1 Sol · Moyenne. Réalisation A–D : **GPT-6.1 Sol · Élevée**, sans hausse supplémentaire justifiée par l’inspection.

| Dimension | Preuve et conséquence |
| --- | --- |
| Résultat/cohérence | Orientation validée dans 012 ; préparation seule, création/attribution distinctes. |
| Localisation | Panel/session/moteur/protocole/manifeste identifiés ; séparation au-delà d’un changement de titre. |
| Frontières | Création indépendante à introduire dans une requête fermée ; protections HTTP/journal à conserver. |
| Contrats/preuves | Schéma, validation pure, ordre, projection et stockage dépendent ensemble du nouveau type d’opération. |
| Inconnues | Adaptation de l’aperçu sans usage et compatibilité de version à éprouver en A/B ; pas de migration démontrée nécessaire. |

La sélection effective du client n’est pas vérifiable ici et n’est pas modifiée. Réévaluer uniquement si le périmètre ou une difficulté observée change ; une éventuelle hausse très élevée/max suit l’arrêt prévu par AGENTS.

## Bilan historique de préparation

Livrables : cette fiche et la décision 012 dans l’app ; entrée DS-EDIT-08 dans le suivi racine uniquement. **Doc updated.** Inspection du code et du package, relecture du périmètre/critères ; `git diff --check` conforme et lecture des 12 cibles de liens locaux des deux nouveaux documents, toutes présentes. Aucun test, build, génération ou serveur exécuté. Aucune garantie de fonctionnement futur acquise.

Risque résiduel explicite : la création actuelle ne peut pas être déplacée telle quelle en prétendant qu’elle est autonome ; B/C doivent être livrées ensemble avant qualification du parcours complet. Aucun blocage documentaire identifié. **Prochaine action : sur demande explicite de réalisation, reprendre A avec l’état Git du moment.** La préparation s’arrête ici, sans démarrer A ni modifier l’instance de recette.
