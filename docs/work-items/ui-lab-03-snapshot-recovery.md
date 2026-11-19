# UI-LAB-03 — Rétablir le snapshot protégé

11 novembre 2026 — application, signalement utilisateur de l’aperçu indisponible. Base `3228943`, branche `codex/ui-lab-snapshot-recovery`. Aucun changement suivi initial ; préexistants non suivis conservés.

## Préparation et diagnostic

Procédures applicatives diagnose-incident et test-user-flow, version au HEAD cité ; dépannage d’instance locale, sans correction arbitraire du writer. Référence : protection immutableDigest de `scripts/design-editor/store.mjs`, lignes de snapshot et erreur HTTP expurgée.

Instance effectivement ouverte : bundle source `.runtime.local/ui-lab-02/Loomata.app`, projet courant du dépôt. UI Lab 57897, Storybook 57898. GET atelier et snapshot public : 200 ; POST protégé snapshot avec la capacité du document : 503, `service-unavailable`. Aucun marqueur de transaction active ou migration incomplète constaté. Le writer PID 1988 est antérieur aux derniers changements de fichiers et de manifeste. Le service conserve ses modules/manifeste en mémoire : son readAll peut encore viser les chemins supprimés, et sa protection immutableDigest refuse les changements de dépendances pendant son exécution. La réponse HTTP expurgée ne distingue pas ces deux exceptions internes ; leur point commun vérifié est le service resté ouvert sur l’ancienne version. Le lecteur public reste disponible, les sources ne sont donc pas manquantes.

Périmètre de réparation : arrêter puis redémarrer uniquement les services possédés par le superviseur de cette instance, avec leurs adresses et configuration conservées. Ne pas fermer la fenêtre, recharger son document, effacer de brouillon, modifier un reçu/journal ou retirer la protection immutableDigest. Contrôler empreintes des autorités et reçus avant/après, puis HTTP protégé et public. Le renouvellement de capacité est déjà pris en charge par le transport et préserve l’identité de racine. Aucun appel fournisseur ni nouvelle fonctionnalité.

Critères : snapshot protégé 200, même racine/adresses, autorités et reçus inchangés, récupération possible par Réessayer sans imposer une fermeture du document. Les confirmations natives et beforeunload existantes protègent le brouillon si Vite demande un rechargement ; l’intervention ne force aucun abandon. Revues séquentielles, même agent, non indépendantes. GPT-6.1 Sol · Moyenne recommandé pour ce diagnostic local ; aucun réglage modifié.

## Résultat

**En revue — rétablissement techniquement vérifié, acceptation humaine différée. Doc updated.** Aucun correctif de code ni suppression de protection : la réparation porte sur l’instance et son cycle de vie.

## Opérations et preuves

- Témoin avant/après : agrégat des trois autorités JSON/catalogue/composition `197d72f0eb74551c02b961b22c0860eac3807cc6d73b9f7cf295230eb538ec7b` identique ; aucun reçu enregistré dans cette instance (zéro avant/après, agrégat vide inchangé). Les sources et sauvegardes n’ont donc pas été modifiées par la réparation.
- `node scripts/local-app.mjs stop` puis `start` via le runtime local : PASS, arrêt propre du superviseur possédé puis démarrage `ready`. Même identifiant d’instance, même racine et mêmes ports 57897/57898 ; nouveaux processus UI/Storybook 35755/35760. Aucun arrêt de fenêtre, SIGKILL, purge d’état, retrait de verrou, changement de port ou accès à une autre recette.
- Lecture protégée avant : 503 `service-unavailable`. Après : **200, 188 bindings**. Jeton utilisé seulement en mémoire depuis le document local, jamais consigné. GET public et atelier également disponibles. Configuration d’instance et documents existants conservés.
- Vérification Chromium desktop 1280×800 sur l’instance concernée, dans un contexte navigateur distinct : **PASS**, région `data-preview-ready=true`, absence du texte « Données de design indisponibles. ». Aucune saisie, sauvegarde, connexion ou requête fournisseur. Les requêtes externes étaient bloquées. Script de contrôle et témoin ignorés sous `.local/ui-lab-03/`.
- `git diff --check` : PASS. Pas de tests unitaires/build supplémentaires : aucune implémentation modifiée ; le test discriminant porte sur le service réel en défaut. Les brouillons de la fenêtre native existante ne sont pas inspectés ; aucun rechargement ou fermeture de son document n’a été demandé par l’intervention.

## Revue et reprise

Revues design/technique/sécurité ciblées **séquentielles, même agent, non indépendantes** : satisfaisantes pour ce dépannage. L’échec de lecture est reproduit sur la bonne instance puis disparaît après relance du service de la version courante ; les témoins sources/reçus sont conservés. Aucun changement visuel/produit ou nouvelle surface de sécurité. Le contrôle navigateur est une observation de lecture sur l’instance, distincte de la recette humaine de sa fenêtre native.

Prévention pour la fabrication : préparer les changements des dépendances de l’atelier sur une instance inactive. Après maintenance hors writer, conserver les brouillons et relancer proprement les services avec le superviseur propriétaire ; ne pas supprimer l’empreinte immutableDigest ni les marqueurs privés pour forcer une lecture. La relance renouvelle la capacité ; le transport sait la relire sur la même identité de racine. Si le bandeau demeure dans une fenêtre ouverte, utiliser Réessayer plutôt qu’imposer un rechargement du document.

Publication : aucune. Fichiers modifiés : cette fiche, roadmap et état racine seulement ; opérations privées de cycle de vie dans l’instance autorisée. Préexistants conservés, pas de nouvelle version de bundle nécessaire. Reprise : retester humainement l’aperçu dans la fenêtre déjà ouverte ; si le message demeure malgré Réessayer, inspecter son état sans abandonner le brouillon.
