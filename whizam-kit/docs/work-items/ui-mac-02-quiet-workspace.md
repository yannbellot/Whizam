# UI-MAC-02 — Espace de travail épuré

11 novembre 2026 — application ; mandat explicite de suppression des messages informatifs (dossier/services), déplacement de la connexion Codex dans le menu principal et suppression de la page Laboratoire de référence. Base `59c6c67`, branche `codex/macos-quiet-workspace`. Préexistants non suivis conservés ; aucun changement suivi initial.

## Préparation

Cadre natif sans contexte/statut permanent ; erreurs conservées sous forme d’alerte native. Menu retenu : Loomata → Compte Codex… ouvre les commandes du compte UI Lab sans confusion avec la connexion du chat. Navigateur : menu Compte Codex. Supprimer route, lien et présentation propres au laboratoire de référence ; conserver les composants/examples partagés et la documentation Storybook. Retirer ses attributions de composition et adapter les contrôles actifs et inventaires concernés ; aucune conversion des reçus/versionnements historiques.

Procédures applicatives du catalogue : implement-feature, test-user-flow, review-design, technical-review ; version initiale citée. Revues séquentielles, même agent, non indépendantes. Recommandation GPT-6.1 Sol · Moyenne pour cette évolution localisée dans les frontières existantes ; aucun réglage modifié. Fichiers : cadre macOS, atelier/connexion, routes et page supprimée, autorités de composition/inventaires, contrôles affectés, documentation/suivi. Aucun fournisseur invoqué ni compte manipulé ; fenêtre humaine et brouillons préservés, nouveau bundle source distinct.

Critères : plus de messages informatifs dans le cadre, erreurs accessibles, connexion/déconnexion disponibles par menu sans bouton permanent, route supprimée en 404, composants partagés toujours disponibles dans Storybook/aperçu, défilement et conservation des brouillons préservés.

Contrôles prévus : génération/contrats, types/lint ciblés, E2E navigateur et natif sur fixtures isolées, menus et ouverture du compte sans connexion réelle. Campagnes utilisant test-results exécutées séquentiellement.

## Résultat

**En revue — qualification technique acquise, acceptation humaine différée. Doc updated.**

## Résultat et choix

Les deux champs natifs de contexte/statut ne sont plus dans l’arborescence visible ; leurs valeurs internes restent disponibles pour le diagnostic et les contrôles existants. Les erreurs d’opération/chargement s’affichent dans une alerte native. Le menu **Loomata → Compte Codex…** sélectionne l’atelier sans recharger son document et ouvre une fenêtre de compte modale. Le contrôle de connexion/déconnexion y reste soumis aux capacités et verrous existants ; le web conserve un menu Compte Codex. Le marqueur de l’hôte est injecté uniquement dans le document natif UI Lab ; l’événement ne transporte aucune commande, URL ni capacité. Sur macOS, la connexion prépare le lien officiel puis laisse l’utilisateur l’ouvrir dans le navigateur système, limité aux trois hôtes HTTPS déjà autorisés pour l’assistance ; aucun popup vide embarqué. Pas de connexion réelle ou d’inférence pendant cette campagne.

Route, page et CSS de référence supprimés. 34 tokens de composition propres à cette page retirés de leurs autorités JSON/YAML et dérivés régénérés ; aucune valeur des tokens conservés changée. Recettes et primitives partagées conservées. Inventaires de livraison et manifeste mis à jour sans conversion des anciens reçus. Le test de migration utilise la projection du plan historique sur les identités survivantes, avec un contrôle explicite que seuls les IDs `component.composition.ui-lab-page.*` ont disparu ; le plan historique et le migrateur ne sont pas modifiés. Les tests des comportements propres à la page supprimée sont retirés ; les composants, stories et contrôles partagés sont conservés.

Fichiers : cadre natif et pilote, Workspace, routes/page/CSS, autorités de composition, manifeste et liste des sources, runner de relecture, tests UI/DS, guide/README/architecture/décision 025/intention produit ; consolidation dans ROADMAP et état racine. Le nouveau contexte produit remplace explicitement l’ancienne demande d’affichage du dossier, selon le mandat actuel.

## Contrôles et limites

- Génération, `npm run docs:design-system:check` et ESLint/Prettier ciblés : PASS ; diff sans erreur d’espacement.
- Typegen Router puis TypeScript via la configuration diagnostique `.local/tsconfig.column-scroll.json` : PASS. Même exclusion des copies non suivies ` 2` que UI-MAC-01 ; contrôle brut du dépôt toujours limité par leurs imports historiques absents, sans modification de ces copies.
- `npm run test:design-system` : **114 PASS**, autorités et cas invalides conformes. Premier passage : quatre échecs d’attentes historiques sur tokens supprimés ; après projection des attentes, deux échecs du plan de test complet ; projection du plan dans les tests corrigée, migrateur historique conservé. Dernier passage sans échec.
- `npm run test:e2e` : **12 PASS**, Chromium desktop/mobile, build client/serveur réussi. 404 de la route supprimée, menu du compte et writer désactivé dans la consultation compilée, fermeture du dialogue, absence du lien et du bouton permanent, couleur DTCG dans l’iframe, colonnes et console vérifiés. Captures et rapport dans `test-results/`.
- `npm run test:loomata` : **14 scénarios PASS**, AppKit et vrais WKWebView dans `test-results/loomata/run-1RPyoV/` (`native.json`). Contrôle des champs absents du cadre, ouverture et fermeture du compte par le menu natif sans connexion, conservation des brouillons et documents, sauvegarde, propagation Storybook, navigation confinée, redémarrage. Premier essai natif en échec sur un sélecteur de test trop large confondant le header des réglages avec celui de l’atelier ; sélecteur corrigé puis parcours complet PASS. SDK 27 incompatible avec le compilateur : repli prévu sur SDK 26.5 installé, sans installation.
- `npm run test:design-editor:live` : **PASS** : mise à jour de l’atelier/aperçu et Storybook, brouillon isolé, fichiers privés refusés, publication interrompue puis récupération réelle. Cibles remplacées par `/ui-lab` et son iframe ; preuves `test-results/editor-live/qualification.json` et captures.
- Bundle source normal `.runtime.local/ui-mac-02/Loomata.app` construit, signé ad hoc et vérifié strictement ; manifeste `candidate.json` adjacent, SHA256 natif `0ccf62ff6fce7ab8ba2ba237ddfb707eca39dadf5c0f3498db7a60ecf292012a`. Ancien bundle et descripteur latest préservés. Ce bundle utilise le runtime local du dépôt ; la distribution autonome E n’est pas remplacée.

Revues design/technique/sécurité ciblée **séquentielles, même agent, non indépendantes** : satisfaisantes sur rendus web et contrôles natifs, suppression bornée à la page et ses consommateurs, compilation et contrats conformes, aucun nouveau writer/capacité/message natif. Ouverture externe limitée à une action de lien et aux hôtes officiels préexistants ; refus de navigation conservés. Les erreurs restent présentables, mais aucun échec fournisseur réel n’a été provoqué. Connexion/déconnexion authentifiées non rejouées ; compte humain et IA non utilisés. Inspection visuelle manuelle du header, Finder/Dock, autres navigateurs/OS et recette humaine restent non vérifiés. Aucune validation humaine/J4/J5, installation globale ou publication déduite. Aucun secret ni suppression de données utilisateur ; travaux préexistants préservés.

Reprise : conserver les brouillons et ouvrir le nouveau bundle local en remplacement de l’ancienne fenêtre ; recette visuelle du menu et de l’espace épuré par le designer.
