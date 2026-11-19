# MVP-01-SOCLE — Qualification et historique des reprises

**État courant, 12 novembre 2026 : En revue — qualification technique acquise, acceptation humaine différée.** [Bilan final, matrice SOC-01 à SOC-12, contrôles, revues et réserves](qualification.md), candidat `7ff7f8c`. Codex réel, reprise après crash, isolation et parcours natif sélectionné éprouvés. Les paragraphes suivants conservent les points de reprise historiques ; leurs anciens blocages sont remplacés par le bilan final. T1 reste À faire, sur mandat distinct.

## Historique initial

12 novembre 2026. Base `2e8bc0b`, branche `codex/mvp-01-common-foundation`. Mandat : réaliser S1–S6 ; mandat conservé, exécution arrêtée avant S2 selon la règle de configuration du lab. Résultat partiel : module pur et tests, sans raccordement aux écritures. SOC-01 partiellement démontré, SOC-02 relations seulement ; SOC-03 à SOC-12 non exécutés. Aucune qualification globale ni ouverture de T1.

## Version et contrôles

Blobs Git examinés : `src/core/workspace-contract.ts` = `d6ed461fcf08e9c03f1ea3ac393079d6d6a96fbb` ; `tests/unit/workspace-contract.test.ts` = `05ff569b5d0bbb197a1fbd45e6c663b56331a9a4`.

Depuis `application/`, runtime existant sélectionné par `sh scripts/with-runtime.sh`, Node v24.22.0. Commandes réelles, chaque invocation précédée de `sh scripts/with-runtime.sh node` :

- `node_modules/vitest/vitest.mjs run --config config/testing/vitest.config.ts tests/unit/workspace-contract.test.ts` : **21 tests réussis**.
- `node_modules/typescript/bin/tsc --noEmit --strict --skipLibCheck --module ESNext --moduleResolution Bundler --target ES2022 --esModuleInterop src/core/workspace-contract.ts tests/unit/workspace-contract.test.ts` : **réussi**, contrôle ciblé, distinct du typecheck complet Router.
- `node_modules/eslint/bin/eslint.js src/core/workspace-contract.ts tests/unit/workspace-contract.test.ts` : **réussi au retest** ; premier lint échoué sur une expression régulière de caractères de contrôle, remplacée côté Builder par une vérification de codes caractères.
- `node_modules/prettier/bin/prettier.cjs --check src/core/workspace-contract.ts tests/unit/workspace-contract.test.ts` : **réussi** après formatage des deux fichiers.

Un premier chemin d’écriture de travail était erroné (`application/application/`) ; seul le fichier créé par cette intervention a été déplacé vers `src/core/`, puis les deux dossiers vides créés ont été retirés. Aucun fichier préexistant touché. Les tests ne portent que sur le chemin final.

Installation, typecheck global, builds, PostgreSQL, navigateur, crash réel, Git de projet, fournisseur et migrations : **non exécutés**. Aucun compte, secret, service personnel ou protection modifié. Pas d’actualisation du manifeste de copie avant raccordement et qualification : les contrats ne sont pas encore livrés aux projets créés.

## Revues ciblées

Mode pour chaque rôle : **séquentiel, même agent, non indépendant**. Procédures applicatives `technical-review` et `security-review` à la base inspectée. Technical Reviewer : satisfaisant pour le contrat pur de travail, avec réserve explicite sur l’absence de raccordement et de transitions exécutables. Vérifiés : types de références, doublons, cardinalités multiples, variantes incohérentes, preuve périmée, absence de mutation de l’entrée et invalidation de preuve au renommage. La version testée ne prouve ni le calcul des révisions ni l’invalidation des dépendants.

Security Reviewer : aucun défaut bloquant identifié sur ce module pur non exposé ; champs fermés et références vérifiés, aucun import Node, fournisseur ou capacité d’écriture. Limites : textes libres non expurgés automatiquement, aucune preuve des permissions du futur moteur. Revue design non applicable à ce point sans UI ; demeure obligatoire pour l’interface de qualification et la sortie du socle. Ces avis ne qualifient pas une livraison.

## Difficulté observée et reprise

Le writer DS (`scripts/design-editor/store.mjs`) possède un manifeste fermé, des reçus préimage/postimage, un propriétaire exclusif, une récupération après crash et une barrière de lecture/génération. Le broker (`scripts/agent-chat/broker.mjs`) possède un verrou par fichier en mémoire, une révision de fichier et une identité de racine liée au système de fichiers ; il n’appelle pas ce journal DS. Le port local n’offre actuellement aucune transaction Git commune. Une enveloppe de schémas ne coordonne pas ces garanties.

Avant S2–S4, déterminer les états récupérables si un crash survient entre publication DS, enregistrement du brouillon et commit Git ; définir un ordre de verrous qui ne bloque pas le writer spécialisé ; distinguer l’identité stable du projet et l’identité physique d’un worktree, sans affaiblir la protection de racine du broker. Incertitude restante : protocole d’atomicité/récupération et compatibilité des journaux existants. Aucune implémentation de stockage ou extension de capacité tentée pour contourner cette difficulté.

Recommandation révisée : **GPT-6.1 Sol · Très élevée**, pour examiner ensemble les transitions, scénarios de crash et reprises des mécanismes existants avant de coder la persistance. La hausse est justifiée par cette coordination effective, pas par la taille du chantier, un test ordinaire ou un accès absent. Selon AGENTS.md du lab, attendre sélection manuelle et demande explicite de reprise ; aucun réglage modifié par l’agent. Le mandat reste MVP-01-SOCLE entier, S1 à compléter puis S2–S6, sans T1 implicite.

Doc updated. Risque résiduel : socle non utilisable en l’état, aucune garantie transversale revendiquée. Point de reprise conservé sur branche dédiée ; pas de fusion de cette réalisation partielle dans main, pas de publication. Diff et sélection exacte à vérifier avant commit de reprise.

## Reprise puis arrêt demandé par le porteur — 12 novembre 2026

Reprise explicite « Poursuit » sur `69a3fc6`, puis arrêt explicite du porteur : « je ne peux pas. stop. je reprendrai plus tard ». Travaux arrêtés, sans qualification, commit ni intégration supplémentaires. Les sources en cours restent **non commitées** sur `codex/mvp-01-common-foundation` ; ne pas les perdre ni les confondre avec la version S1 commitée.

Fichiers de travail : nouveaux `scripts/core/workspace.ts`, `scripts/core/workspace-port.ts`, `tests/workspace-store.test.mjs` ; modifications de `scripts/core/local-service.mjs` et `package.json`. Le module de travail prépare le journal privé, les worktrees isolés, la reprise, les préconditions, l’annulation, la reconstruction et la séparation commit/intégration. Le port local est raccordé dans les sources, pas dans une instance personnelle relancée. Le writer DS et le chat ne sont pas encore raccordés au nouveau moteur. Aucune livraison complète revendiquée.

Contrôles réellement exécutés pendant cette reprise, depuis `application/` via `sh scripts/with-runtime.sh node` :

- `--test tests/workspace-store.test.mjs` : **8 tests réussis**, y compris interruption par SIGKILL sur témoin synthétique, reprise des publications de fichiers et de Git, refus des chemins privés/liens, révision périmée, concurrence sans écrasement et clone local sans état privé. Deux passages réussis ; le dernier avant formatage et ajout du port local. Ces tests ne couvrent pas tous les critères SOC-01 à SOC-12.
- Contrôle TypeScript ciblé de `scripts/core/workspace.ts scripts/core/workspace-port.ts` avec `--noEmit --strict --skipLibCheck --allowJs --checkJs false --module ESNext --moduleResolution Bundler --target ES2022 --allowImportingTsExtensions --esModuleInterop` : **réussi**. Aucun typecheck global ni build.
- Formatage des nouveaux fichiers et du port existant via Prettier : exécuté. Lint global et relecture complète des nouveaux modules **non exécutés** à l’arrêt.
- Deux commandes de travail ont d’abord visé un mauvais chemin relatif ; corrigées vers le fichier réel, sans modification de contenu préexistant. Les essais de chargement du module ont ensuite réussi.

Connexion dédiée : seule la présence des chemins a été vérifiée, sans lire ni copier d’identifiant. État dédié et binaire présents, fichier `codex/auth.json` absent. Aucun lancement fournisseur, connexion, inférence ou nouvel accès tenté. Le porteur ne peut pas se connecter maintenant ; essai réel SOC-08 reporté à sa reprise. Documentation officielle App Server consultée : [référence](https://learn.chatgpt.com/docs/app-server), sans changement du protocole fournisseur dans les sources.

Prochaine action **seulement sur reprise explicite** : relire le diff non commité ; revoir et compléter le protocole de récupération et ses cas négatifs, éprouver le port local, raccorder writer DS et conversations, puis compléter les contrôles globaux et revues. Les attestations du port sont réservées à un appelant local de confiance ; ne pas les exposer directement aux sorties du modèle. Aucun des nouveaux mécanismes ne doit être présenté comme techniquement qualifié. Doc updated. Publication désactivée ; instance personnelle préservée.

## Connexion Codex reprise et confirmée — 12 novembre 2026

Mandat limité : « Reprend pour conexion codex ». Connexion reprise depuis la fenêtre Loomata déjà ouverte (`ui-mac-04`), rubrique Codex, bouton Connecter Codex puis lien officiel. Résultat observé dans Loomata : **Codex · Compte connecté**, bouton Déconnecter Codex présent, Nouvelle conversation et saisie de message disponibles. Aucun identifiant, URL d’authentification ou échange privé copié dans les preuves. Aucun changement de code ni de protection, aucune instance supplémentaire lancée, aucun message d’inférence envoyé.

La présence d’un fichier d’authentification n’a pas servi de critère de réussite : l’état connecté de l’application a été vérifié directement. La [documentation officielle App Server](https://learn.chatgpt.com/docs/app-server) a été consultée pour le parcours de connexion. Aucun nouveau binaire ou protocole activé.

Cette connexion lève le prérequis de compte constaté auparavant ; elle ne valide pas SOC-08, qui nécessite encore un essai réel sur projet synthétique et le raccordement du moteur. Le travail non commité et les autres réserves restent conservés. Doc updated. La présente demande ne reprend pas implicitement toute l’implémentation du socle suspendue ; point de reprise inchangé hors connexion désormais confirmée.
