> Archive du cadrage et du bilan antérieurs à la clarification du 10 novembre 2026. Ce périmètre a été mal interprété ; il ne définit plus le livrable UI-FINAL-01. Voir la [fiche corrigée](ui-final-01-complete-assisted-cycle.md). Les résultats de tests historiques restent conservés.

# UI-FINAL-01 — Finaliser UI Lab et qualifier un cycle de création assistée

**10 novembre 2026 — A–F réalisées ; qualification technique acquise, En revue pour acceptation humaine.** Cible : application ; suivi de fabrication dans la roadmap racine. Base inspectée `1a1481cf767a50ed485de7428e4d360a74931db7`, après clôture de CORE-01. Préparation initiale documentaire ; mandat de réalisation reçu ensuite : « Exécute le chantier UI-FINAL-01 en commençant par la tranche A. » Le [rapport courant](../reviews/ui-final-01/README.md) porte périmètre figé, matrice et preuves par tranche.

## Résultat attendu et définition de « finalisé »

Livrer une version identifiée de UI Lab permettant de parcourir le DS, préparer et annuler un brouillon, enregistrer via son writer, observer le résultat dans Storybook puis dans une vraie application dérivée, et reprendre après fermeture. Démontrer ensuite un cycle réel : intention → brief et critères → conception → réalisation assistée → réglage du DS → tests → revue conjointe Application/Storybook → correction → reprise.

Une version est techniquement qualifiée lorsque les critères ci-dessous passent sur le même candidat, qu'aucune anomalie bloquante ou majeure liée au parcours ne reste ouverte et que les limites de confort sont consignées. Cela ne signifie pas catalogue exhaustif, application macOS finale, zéro prérequis, validation de tous les assistants ou acceptation globale J4/J5. La recette humaine de cette version reste distincte.

Procédures retenues : [plan-feature](../../skills/plan-feature/SKILL.md) et [update-project-docs](../../skills/update-project-docs/SKILL.md), catalogue applicatif à la base ci-dessus. Pour la réalisation future : implement-feature, design-interactions, test-user-flow et les revues applicables. Pas de modification des instructions ou de la bibliothèque de skills par cette préparation.

## Mode de validation et hypothèses explicites

Le premier cycle utilise **Codex actuel comme assistant de fabrication**, avec UI Lab pour éditer le DS et Storybook comme lecteur. C'est une hypothèse de préparation cohérente avec le [parcours existant](../product/project-start.md), à figer en tranche A avant code. Le chat général dans UI Lab appartient à [AGENT-CHAT-01](agent-chat-01-personal-agent-chat.md), pas à cette fiche. Si le résultat demandé devient « tout réaliser depuis un chat intégré à UI Lab », ce chantier devient dépendant de sa qualification et ne peut pas être déclaré complet par un essai externe.

L'assistance spécialisée d'intention DS déjà présente reste distincte du chat général. Une inférence réelle peut être qualifiée via son parcours existant si ses accès sont disponibles et autorisés ; son absence ne désactive pas l'édition déterministe. Un transport simulé ou un simple état connecté ne prouve pas la création assistée. Aucun compte ou historique de fabrication n'est copié dans une installation de test.

Projet témoin proposé : **Prêts d'objets**, avec données synthétiques. Ce choix est une hypothèse réversible de recette, pas une nouvelle direction produit du kit. Aucun contenu personnel, marque ou besoin client n'est inventé.

- Trois pages : inventaire filtrable, ajout d'un objet, fiche d'objet avec prêt/restitution.
- Données : objet, catégorie, état disponible/prêté ; prêt avec alias synthétique et dates. PostgreSQL/Drizzle du socle conservés.
- Règles : titre obligatoire ; un objet ne peut pas avoir deux prêts actifs ; rendre un objet clôt son prêt et le rend disponible. Erreurs visibles et conservation des saisies lors d'un refus.
- Résultat présenté : ces pages et leurs composants documentés, pas le mini-gestionnaire Projects renommé. Le remplacement de l'exemple suit la [procédure livrée](../product/replacing-project-example.md), dans le seul projet dérivé ; aucune suppression implicite de table, migration appliquée ou volume.

## Constats et dépendances examinés

| Source / contrat actuel | Constat confirmé | Conséquence pour le chantier |
| --- | --- | --- |
| [CORE-01](core-01-shared-deliveries.md), [cœur commun](../architecture/shared-core.md) | Cœur, extraction/relocalisation et prototype qualifiés ; réserve native levée. | Réutiliser ces acquis et garder les deux livraisons sur le même cœur ; ne pas rouvrir l'enveloppe finale. |
| [Workspace](../../src/ui-lab/editor/Workspace.tsx), [AppearancePanel](../../src/ui-lab/editor/AppearancePanel.tsx) et [scènes](../../src/ui-lab/editor/scenes.tsx) | Navigation, aperçu, édition et état de session existent. | Auditer les parcours observables avant de décider les correctifs ; aucun besoin de refonte générale présumé. |
| [Autorités DS](../../src/design-system/authority/README.md), [writer HTTP](../../scripts/design-editor/http.mjs) | Sources DTCG/règles YAML, dérivés et sauvegarde transactionnelle ont des propriétaires distincts. | Le writer reste la seule voie de sauvegarde pendant l'atelier ; pas d'édition simultanée de ses autorités par l'agent. |
| [Port local](../../scripts/core/local-service.mjs) | `project.create`, `project.export`, `tool.export` et `ai.connect` restent false. | Préparer le dossier témoin par le parcours existant ; ne pas simuler des boutons de création/export livrés. |
| [Superviseur](../../scripts/local-app.mjs), fonction `start` | Il force `DATABASE_URL` à vide pour UI Lab et Storybook. | Un atelier ready ne prouve pas le fonctionnement métier ; prévoir un processus Application avec sa propre configuration PostgreSQL de test. |
| [Démarrage Application](../../scripts/start.ts), [configuration serveur](../../app/server/env.server.ts) | Application compilée et base configurée sont nécessaires au serveur métier. | Prévoir un troisième accès local, séparé des deux ports du superviseur ; ne pas relâcher son isolation DB par commodité. |
| [AGENT-CHAT-01](agent-chat-01-personal-agent-chat.md) | Préparation distincte avec dépendances de packaging, permissions et fournisseurs non toutes qualifiées. | Ne pas en faire une capacité déjà disponible ni l'implémenter implicitement ici. Ses sources officielles devront être revérifiées dans son propre mandat. |
| [Passation du kit](../handoff.md) | Acceptation humaine globale et reprise par un tiers restent distinctes des preuves d'agent. | Un exercice de reprise réalisé par Codex ne clôt pas REC-12/P5-05/P5-08. |

## Périmètre et ressources

Inclus : inventaire des défauts du parcours UI Lab, correctifs ciblés nécessaires, projet dérivé réel, réglages DS vérifiés chez ses consommateurs, tests/refus/reprise et dossier de revue. Conserver la stack, les composants utiles et les autorités actuelles. Un nouveau composant ou une nouvelle intention exige sa justification ; pas de refonte du DS pour les seuls besoins de la démonstration.

Exclus : nouveau chat général, nouveau fournisseur, installation globale, gestion automatique universelle des prérequis, implémentation de `project.create`/ZIP, GitHub distant, collaboration/viewers, nouvelle authentification applicative, Node/npm embarqués, menus/signature/installateur macOS ou publication. Ces fonctions ne sont pas des conditions à masquer par une simulation.

Pendant la réalisation, séparer une copie QA du kit candidat et un projet témoin dans des emplacements ignorés propres à UI-FINAL-01. Aucun ancien dossier CORE-01, recette DS personnalisée, brouillon ou compte n'est écrasé, resynchronisé ou arrêté. La base, les volumes, ports et processus ont une identité de campagne ; ne nettoyer que les ressources prouvées appartenir à cette campagne. Vérifier aussi les attributs macOS de visibilité du dossier proposé au sélecteur.

## Tranches de réalisation future

| Tranche | Travail et livrable | Condition de sortie |
| --- | --- | --- |
| A — Gel du périmètre | Vérifier Git, version, outils et ressources ; fixer le mode d'assistance et le brief témoin. Inventorier chaque fonction de UI Lab : existante, à corriger, exclue, avec preuve attendue. | Matrice de recette et liste de défauts priorisée ; hypothèses et accès réels explicites. Un manque de droit/outil ne devient pas un succès simulé. |
| B — Finalisation UI Lab | Sur le candidat du kit, corriger les défauts reproductibles de navigation, sélection, saisie/portée, annulation, sauvegarde, état de chargement/erreur et reprise. Contrôler clavier, noms accessibles et formats desktop/mobile. | Aucun défaut bloquant/majeur du cycle ; défauts de confort motivés. SHA du candidat figé et contrôles des surfaces modifiées réussis. |
| C — Application réellement fabriquée | Extraire le kit candidat sans parent ni état privé ; initialiser le projet par le parcours existant. Produire brief, données/règles, pages et tests avec Codex, puis remplacer les entrées métier d'exemple dans ce seul dérivé. | Application Prêts d'objets fonctionnelle, persistante et distincte du starter ; premier commit identifié, Storybook orienté vers ses composants/états. |
| D — Boucle DS et retours | Dans le dérivé, préparer/annuler une variation, enregistrer un réglage local puis partagé sur des composants réellement utilisés. Observer Storybook déjà ouvert ; reconstruire ensuite l'Application de manière contrôlée et vérifier son rendu. Consigner un retour de revue avec son auteur réel (designer ou Reviewer déclaré), puis sa correction avec l'assistant ; un retour d'agent n'est pas une acceptation humaine. | Valeurs enregistrées, périmètre d'impact et rendu de l'application concordants ; sources/consommateurs identifiés, pas de double writer. |
| E — Reprise et extraction | Fermer/redémarrer les seuls services de campagne ; rouvrir l'app, UI Lab et Storybook. Vérifier données métier et DS sauvegardé. Extraire/renommer le dossier dérivé et suivre les procédures de réparation et de données applicables. | Reprise sans double exécution ni perte ; autonomie du dossier source après prérequis et conservation de l'identité des données démontrées, limites de transfert explicites. |
| F — Revue finale | Rejouer les critères sur le candidat final, présenter Application + Storybook, fournir journal du cycle, preuves et passation. | Qualification technique avec réserves motivées, puis retour humain distinct ; pas de clôture globale du produit ou de J4/J5 implicite. |

Un défaut du kit découvert dans C–E est corrigé dans son propriétaire canonique puis requalifié avant propagation contrôlée au seul témoin. Ne pas déclarer le kit finalisé sur la base d'un correctif resté uniquement dans la copie. Pas de réinitialisation d'un projet déjà initialisé pour contourner un échec.

### Coordination Application / UI Lab / Storybook

La proposition minimale conserve les deux services du superviseur et ajoute pour la campagne le serveur métier compilé, en lecture du DS et avec sa base isolée. Elle évite deux serveurs Vite concurrents sur la même racine. Ne pas ajouter une capacité DS d'écriture au serveur Application ou à Storybook.

Pour D : sauvegarder et relire dans UI Lab, constater la propagation à chaud dans Storybook, puis arrêter les seuls services concernés avant génération/build et redémarrer l'Application sur le build neuf. Les hooks `prebuild`/`pretypecheck` génèrent des dérivés : ne pas les déclencher sur une racine dont le writer travaille. Reprendre ensuite les accès requis. **La mise à jour de l'Application après reconstruction n'est pas une preuve de hot reload du site.** Le SHA, la génération DS et le build servi sont relevés ensemble à la revue.

Après extraction, une copie des sources ne transporte pas les données PostgreSQL. Pour conserver les données, maintenir explicitement l'identité du volume de campagne ou appliquer la [sauvegarde/restauration](../backup-and-restore.md) sur des ressources isolées ; une nouvelle base vide n'est pas une preuve de conservation. Aucune migration appliquée n'est modifiée rétroactivement.

## Critères de réussite et preuves attendues

| ID | Scénario obligatoire | Preuve minimale lors de la réalisation |
| --- | --- | --- |
| AC-01 | Version et ressources identifiables | SHA du kit, du dérivé, versions Node/npm/navigateur, génération DS, identité des services/base ; aucun secret dans le relevé. |
| AC-02 | Assistance réelle de bout en bout | Brief, décisions et changements attribuables à un vrai travail Codex ; limites du mode externe annoncées. Aucun tour fictif ou connexion seule compté comme cycle réussi. |
| AC-03 | Métier réel | Depuis un inventaire vide, ajouter un objet, le prêter, refuser un second prêt actif côté serveur, le restituer et filtrer la liste. Données relues après rechargement. |
| AC-04 | Parcours d'erreur utilisable | Formulaire incomplet refusé sans perte de saisie ; annulation sans écriture ; erreur de service lisible et reprise possible. Un écran d'attente n'est pas présenté comme prêt. |
| AC-05 | UI Lab complet au périmètre figé | Navigation/composants/états, saisie et choix de portée vérifiés ; aperçu disponible et contrôles actifs, sans chargement indéfini ou perte de sélection. |
| AC-06 | Brouillon réversible | Avant/après visibles ; Annuler après confirmation rétablit la valeur et l'aperçu, sans modifier les sources. Conserver un brouillon ne le sauvegarde pas. |
| AC-07 | Sauvegarde durable locale et partagée | Confirmation après relecture, impact exact sur les consommateurs attendus ; valeurs présentes après fermeture/redémarrage. Aucun effet partagé non annoncé. |
| AC-08 | Storybook et Application concordants | Storybook déjà ouvert suit la sauvegarde ; un build neuf de l'app restitue le même choix sur ses vraies pages. Pages/story d'exemple inchangées insuffisantes. |
| AC-09 | Refus des écritures non autorisées | Contrôles existants Host/Origin/capacité conservés ; pas d'écriture DS depuis le lecteur ou de contournement de verrou par l'agent. Sauvegarde concurrente/périmée refusée sans écraser les données. |
| AC-10 | Reprise | Interruption isolée puis redémarrage : données métier et DS enregistrés conservés, opération inconnue non rejouée automatiquement ; perte éventuelle d'un brouillon non sauvegardé explicitée. |
| AC-11 | Deux formats et accès | Desktop 1280×800 et mobile 390×844, parcours clavier et noms accessibles ; atelier, site et entrée Storybook pertinente utilisables. L'émulation ne prouve pas un appareil réel. |
| AC-12 | Dossier indépendant | Extraction sans `.git` parent ni état privé, chemin avec espaces/renommage puis fonctionnement selon les prérequis documentés. Sources et données conservées vérifiées séparément. |
| AC-13 | Revue et correction réelles | Accès Application et Storybook vérifiés ensemble, retour de conception et correction qualifiée, auteur et indépendance déclarés ; hypothèses visuelles signalées. Sans retour observé, critère non vérifié. |
| AC-14 | Passation et limites | README du dérivé, commandes, source/version, données et reprise compréhensibles sans conversation ; reprise agent distincte d'un développeur tiers. |

Un critère obligatoire non exécuté reste non vérifié et empêche la qualification complète de ce périmètre. L'absence de chat intégré ne devient pas un défaut à cacher : elle borne explicitement le mode de cycle qualifié.

## Contrôles et revues à prévoir

Sur copies inactives et isolées, les commandes existantes servent de points d'entrée, après vérification du périmètre modifié : `npm run typecheck`, `npm run lint`, `npm test`, `npm run test:design-system`, `npm run test:design-editor:server`, `npm run test:design-editor`, `npm run test:design-editor:persistence`, `npm run test:storybook`, `npm run build` et `npm run build-storybook`. Vérifier les scripts disponibles au démarrage de réalisation ; ne pas inventer un succès parce qu'une commande figure dans ce plan. Les scripts persistants existants et les gardes des lecteurs sont des références de runners propriétaires de leurs ressources.

Les tests de l'app témoin doivent couvrir son nouveau domaine et sa base isolée ; `npm run test:projects` teste l'ancien exemple et ne prouve pas le parcours Prêts d'objets. Adapter les tests/lanceurs dans le seul dérivé. Prévoir des captures, assertions navigateur, journaux serveur et relectures après redémarrage, avec erreurs initiales et retests. Les contrôles antérieurs de CORE-01 restent des références historiques, pas les résultats de ce nouveau chantier.

Revues futures : design pour la compréhension/parcours/accessibilité ; technique pour schémas, règles métier, writer, contrats, versions et reprise ; sécurité ciblée sur les frontières effectivement touchées. Sans délégation autorisée, **séquentielles, même agent, non indépendantes**. La préparation seule ne réalise pas ces revues de code ni une recette humaine.

## Réflexion Codex préconisée

**Pour exécuter le chantier : GPT-6.1 Sol · Élevée (`high`).** La recommandation couvre la boucle transverse et ses corrections ; une retouche isolée de texte/CSS sans contrat peut rester Moyenne après inspection. La présente préparation documentaire peut être menée en Moyenne.

| Dimension de la politique locale | Évidence examinée et difficulté |
| --- | --- |
| Résultat/cohérence | Première vraie application et finalisation de UI Lab sont distinctes de l'exemple `/projects`, du chat intégré et du packaging. Brief/critères à figer en A. |
| Localisation | Workspace/éditeur, writer Node, composants/stories, serveur métier et schéma du dérivé, ressources de tests et documents : plusieurs producteurs/consommateurs coordonnés. |
| Frontières | Writer unique et capacités DS à conserver, serveur métier avec base dédiée, lecteurs sans privilèges ; pas de commandes d'agent concurrentes sur les autorités. |
| Contrats/preuves | DTCG → dérivés → atelier/Storybook/build de l'app ; validation de formulaire → règle serveur → PostgreSQL ; reprise et identité des données à tester ensemble. |
| Inconnues | Défauts résiduels à mesurer, mode d'assistance et prérequis disponibles à confirmer ; pas de nouvelle faisabilité fournisseur présumée. |

OpenAI Docs associe `high` aux tâches agentiques et raisonnements complexes ; `xhigh` est à réserver à un bénéfice démontré par l'évaluation. [Documentation officielle consultée le 10 novembre 2026](https://developers.openai.com/api/docs/guides/reasoning). L'application de ce conseil au chantier est notre recommandation, pas une garantie de résultat ni une mesure locale de performance.

**Aucune hausse vers Très élevée, max ou Astra n'est justifiée à ce stade.** Réexaminer si une incompatibilité démontrée mêlant writer/récupération/identité des données résiste au diagnostic en Élevée ; une panne ordinaire, un accès manquant ou un périmètre non décidé ne suffisent pas. Si une hausse devient nécessaire, conserver les preuves et arrêter seulement la partie dépendante selon les règles locales, jusqu'à sélection manuelle et reprise explicite. Aucun modèle/réglage du client n'est modifié ou prétendu vérifié.

## Livrables et état de cette préparation

À produire pendant la réalisation : matrice de périmètre A, correctifs canoniques identifiés, source du témoin, tests et captures, journal du cycle, rapport de revues, passation et point de reprise. Les preuves sélectionnées iront dans `docs/reviews/` du propriétaire ; logs bruts et fixtures dans les emplacements privés ignorés. Le suivi de fabrication reste dans la roadmap racine, les modèles du kit ne sont initialisés que pour le vrai projet dérivé.

Préparation actuelle : fiche, renvoi d'architecture et suivi documentaire seulement. Contrôles de préparation réalisés : quatorze critères identifiés, liens locaux et noms de commandes npm vérifiés, `git diff --check` conforme ; relecture documentaire séquentielle par le même agent, non indépendante. Aucune preuve future AC-01 à AC-14 n'est déclarée acquise. CORE-01 reste clos, AGENT-CHAT-01 préparé séparément, J4/J5 inchangés. **Doc updated.**

Reprise sur mandat d'exécution : commencer A avec cette fiche ; conserver les hypothèses minimales ci-dessus ou consigner leur adaptation avant les changements concernés, puis enchaîner B–F dans le mandat et les dépendances satisfaites. Cette préparation ne lance aucune tranche de réalisation.

## Réalisation A–F

Mandat exécuté sur branche locale `codex/execute-ui-final-01`. A : périmètre et matrice figés ; B : défauts de contrôles/portabilité et guide corrigés canoniquement ; C : vraie application Prêts d’objets avec PostgreSQL ; D : sauvegardes DS locale/partagée, Storybook à chaud et Application reconstruite ; E : même base après déplacement/redémarrage et copie source sans Git ; F : revues séquentielles, corrections et passation. [Rapport, matrice finale et réserves](../reviews/ui-final-01/README.md), [versions et contrôles](../reviews/ui-final-01/qualification.json), [source reproductible](../reviews/ui-final-01/source-manifest.json).

Tous les critères sont techniquement qualifiés au mode externe et au périmètre convenus. L’acceptation humaine, la reprise par un développeur tiers et l’accessibilité exhaustive ne sont pas prétendues. Les échecs et retests sont conservés ; le manifeste final reprend les reçus existants sans conversion ni purge. Projet/caches/DB de recette privés isolés, anciens travaux préservés. Chat intégré, création automatique, ZIP et packaging exclus ; CORE-01 et J4/J5 inchangés. Reprise : revue conjointe Application/Storybook puis décision humaine, sans nouveau chantier implicite. Doc updated.
