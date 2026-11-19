# UI-ARCH-01 — Étude de l’architecture UI

**Cible : application. Mandat du 14 novembre 2026 : étude préalable uniquement.**

## Objectif et limites

Évaluer la proposition utilisateur « Loomata — Proposition d’architecture UI et Design System » : DTCG, React Aria Components, Tailwind CSS v4, Loomata UI et Design Contract. Livrer un diagnostic vérifié, les alternatives, responsabilités, risques, adoption progressive et arbitrages. Aucune installation, modification du code, migration, serveur, inférence, publication ou refonte des autorités.

Livrable : [note d’architecture](../architecture/ui-architecture-study.md). Le suivi de fabrication reste dans la roadmap et l’état racine ; les modèles applicatifs ne sont pas initialisés. Aucun ADR d’adoption : les recommandations ne sont pas des décisions acceptées.

## Base et méthode de l’étude initiale

- Racine Git vérifiée : dépôt `loomata` attendu ; départ sur `main`, HEAD `7758cad9064b0f83acfe0d08132e05672c3d27cd`.
- 75 entrées non suivies préexistantes, notamment copies suffixées ` 2`, `frontend/` et `.storybook/editor/` : hors périmètre, aucune absorption ni suppression. Aucun changement suivi initial.
- Branche locale : `codex/ui-architecture-study`. Première création refusée par le sandbox en lecture seule sur `.git`, puis réussie après élévation autorisée ; aucune protection retirée.
- Lectures : instructions des deux environnements, README, cahier des charges, suivi, catalogue applicatif, architecture, décision 027, autorités DTCG/YAML, composants, contrats de coordination, rendu/import Figma, styles et enveloppe macOS.
- Procédure sélectionnée explicitement : `skills/propose-architecture/SKILL.md`, version du HEAD ci-dessus, rôle Builder. `pages:write-page` utilisé pour la rédaction ; destination documentaire du dépôt conservée. Aucun skill de fabrication du lab requis, puisque ni son kit d’instructions ni sa distribution ne changent.
- Recommandation de configuration : GPT-6.1 Sol · Élevée, pour comparer plusieurs contrats liés, une frontière de rendu natif et les autorités de conception. Aucune sélection du client prétendue vérifiée/modifiée ; aucun sous-agent.
- Documentation officielle consultée le 14 novembre 2026 ; liens dans la note. Les versions de ces sites ne prouvent pas les capacités de Base UI 1.7.0 installé.

## Critères et preuves

Les huit points du livrable utilisateur correspondent aux sections 1 à 8 de la note. Constats du code, propositions et hypothèses sont distingués ; la divergence Tauri/Swift est signalée, sans migration implicite. Les flux différencient interface Loomata et projets produits. Les recommandations restent compatibles avec le maintien des autorités courantes.

Contrôles exécutés : vérification Python des 31 liens locaux des deux nouveaux documents, tous résolus ; absence de React Aria/Tailwind/shadcn confirmée par lecture structurée du lockfile ; `git diff --check` conforme ; diff limité aux quatre documents annoncés. Relecture de la note et des ajouts de suivi, contrôle des fichiers sélectionnés et absence de contenu privé dans ces ajouts. Les tests applicatifs, builds, benchmarks, essais VoiceOver et WebView ne sont pas exécutés dans ce mandat d’étude ; aucun succès d’exécution n’en est déduit. Les preuves historiques du dépôt restent datées.

## Résultat et reprise

**En revue — étude livrée, arbitrages humains ouverts ; aucune qualification d’une nouvelle stack.** Doc updated. Fichiers du mandat : cette fiche, la note, `ROADMAP.md` et `docs/project-state.md` racine.

Relecture technique documentaire exercée séquentiellement, même agent, non indépendante : sources du code confrontées aux recommandations, absence d’autorité concurrente, préservation du writer et distinction hypothèse/preuve contrôlées. Revue design d’un parcours et revue sécurité d’une implémentation non applicables : aucun écran, comportement, accès ou schéma exécutable modifié. Les risques d’accessibilité, d’entrées Figma et de rendu restent explicités pour une éventuelle réalisation.

Risque résiduel : l’essai comparatif n’est pas réalisé ; l’avantage ergonomique, les performances et la compatibilité VoiceOver de React Aria dans cette application restent à mesurer. Prochaine action : examiner les arbitrages de la note, puis donner un mandat distinct si un essai ou une adoption est souhaité. T2/T3, J4/J5 et publications restent hors mandat.


## Révision 2 — Deux périmètres et recommandation Tailwind

**14 novembre 2026 — En revue, révision documentaire livrée sur demande explicite.** Base `c459e14dc57981ec416a3fbaf99b6b02123dd06b`, départ sur main sans changement suivi ; 75 entrées non suivies préexistantes conservées. Branche locale `codex/ui-architecture-tailwind-recommendation`. Même procédure `propose-architecture`, sans sous-agent ; recommandation de configuration Moyenne pour cette modification documentaire cadrée, sans réglage du client modifié.

Le porteur demande Tailwind comme choix recommandé pour l’interface Loomata et le socle des applications créées. Cette orientation remplace le report proposé initialement ; elle n’autorise aucune implémentation. Pas d’ADR d’adoption ni de modification du cahier des charges ou des autorités effectives dans cette tranche. Leur alignement sera préalable au code dans un futur mandat de réalisation.

Critères : distinguer les deux chaînes de présentation, recommander Tailwind dans chacune, préserver DTCG comme autorité et l’autonomie des produits, séparer React Aria, expliquer que l’adaptation concerne les styles sans conversion des données ni mise à jour automatique des projets existants. Introduction, comparaison, architecture, bibliothèques, plan et arbitrages de la note actualisés ensemble ; roadmap et état de fabrication synchronisés. Les constats initiaux du code et leurs limites restent datés.

Revue documentaire : séquentielle, même agent, non indépendante. Contrôle de cohérence des recommandations ; 31 liens locaux des deux documents vérifiés par Python, tous résolus ; `git diff --check` conforme ; diff limité aux quatre fichiers prévus et 75 entrées non suivies préexistantes conservées. Revues design/sécurité d’implémentation non applicables : aucun écran, code, accès ou schéma exécutable modifié. Tests, builds, installations et serveurs non exécutés, conformément au mandat. Doc updated, aucune publication. Risques techniques inchangés : compatibilité WebKit, cascade et génération à qualifier lors d’une future réalisation. Reprise : lecture de l’étude révisée ; réalisation seulement sur mandat distinct.


## Révision 3 — Electron et fondation interactive React Aria

**14 novembre 2026 — En revue, révision documentaire livrée sur demande explicite.** Base `8537c181c5ff660c56f6be0ec39ba91c4c3afa56`, main sans changement suivi et 75 entrées non suivies préexistantes ; branche locale `codex/ui-architecture-electron-react-aria`. Procédure `propose-architecture` conservée, même version des sources du kit ; aucune délégation. Recommandation de configuration Moyenne pour cette transcription documentaire cadrée ; aucune sélection du client modifiée ou prétendue vérifiée.

Mandat : recommander Electron pour le contenant desktop de Loomata et React Aria Components comme bibliothèque interactive de référence dans les deux architectures, sans implémentation. Tailwind reste recommandé dans les deux périmètres. Les projets créés visent sites web et web apps, sans génération native pure. Ces orientations remplacent l’évaluation ouverte préalable de React Aria ; elles ne qualifient pas les bibliothèques en exécution. La prescription CSS actuelle et le contenant Swift restent les autorités effectives jusqu’au futur mandat d’adoption et à leur alignement ; aucun ADR ni changement prescriptif hors étude dans cette tranche.

La comparaison Electron/Tauri reprend l’inspection en lecture seule menée pendant l’échange précédent sur `8537c18` : port commun, superviseur, lanceur Swift, packaging et installation Codex. Node/npm versionnés, sockets Unix, signaux et chemins spécifiques sont explicités. Les documentations officielles ont été consultées pendant cet échange ; leurs liens sont intégrés à la note. Pas de benchmark, prototype, test applicatif, installation, serveur ou build exécuté.

Critères de relecture : introduction, comparaison, flux, bibliothèques, plan et arbitrages cohérents ; React Aria unique fondation généraliste cible avec HTML sémantique et compléments spécialisés ; Base UI seulement transitoire ; Electron limité à l’outil ; cœur Node/writers conservés ; aperçus sans privilèges ; runtime embarqué Electron distinct du runtime d’outillage à qualifier ; formats web des projets et tests natifs/OS distingués. Le Design Contract ne dépend ni d’Electron ni de React Aria.

Revue documentaire séquentielle, même agent, non indépendante : recommandations confrontées aux constats datés, 34 liens locaux vérifiés par Python, tous résolus ; `git diff --check` conforme ; diff limité aux quatre documents annoncés et 75 entrées non suivies préexistantes conservées. Revues design et sécurité d’implémentation non applicables : aucun code, parcours, accès ou schéma exécutable modifié ; risques de la future intégration explicités, sans audit de sécurité revendiqué. Les sections précédentes conservent les résultats et orientations historiques, remplacées sur ces points par cette révision. Doc updated ; quatre documents du mandat seulement, aucune publication. Reprise : lecture de la note révisée ; implémentation et qualification des trois OS sur mandat distinct.


## Révision 4 — Ordre d’adoption et tranche Electron distincte

**14 novembre 2026 — En revue, révision documentaire livrée sur demande explicite.** Base `9bc3c68e040f14f89b68b26cab9d36b027ffa60a`, départ main sans changement suivi ; 75 entrées non suivies préexistantes préservées. Branche locale `codex/ui-architecture-adoption-sequence`. Même procédure applicative `propose-architecture`, recommandation de configuration Moyenne pour modification documentaire localisée ; aucune délégation ni modification du réglage client.

Mandat : inscrire le cadrage commun, la première tranche de l’interface Loomata puis le socle des projets créés ; réserver Electron à une tranche séparée. Le scénario de référence place Electron après cette séquence, sans en faire un prérequis des tranches UI/starter. La première tranche UI utilise le contenant actuel et couvre Tailwind et React Aria ensemble sur un échantillon représentatif. Le starter réutilise les méthodes, avec son propre design system ; il ne dépend pas de l’achèvement de toute l’interface Loomata. Aucun chantier de réalisation ni parallélisation active ouvert ; une reprise en parallèle n’est envisageable qu’après stabilisation des frontières.

Critères : ordre explicite avec résultats et portes de passage ; cadrage des autorités avant code ; première qualification WKWebView distinguée du retest Electron/Chromium ; isolation des aperçus, processus, runtimes et distribution dans la seule tranche Electron. Introduction, section 8, roadmap et état synchronisés ; autres recommandations conservées. Aucun code, installation, service, test applicatif, build, donnée ou autorité prescriptive modifié. Aucun ADR d’adoption ajouté.

Revue documentaire séquentielle, même agent, non indépendante : contrôle de l’ordre, des dépendances et de l’absence de prérequis Electron implicite. Revues design et sécurité d’implémentation non applicables car aucun parcours ni accès exécutable modifié. Contrôles exécutés : 34 liens locaux des deux documents vérifiés par Python, tous résolus ; ordre des trois tranches et séparation Electron contrôlés ; `git diff --check` conforme ; quatre documents prévus seulement, 75 entrées non suivies préexistantes conservées. Doc updated ; aucune publication. Reprise : examiner l’étude révisée ; réalisation seulement sur mandat distinct, avec critères et autorités alignés.
