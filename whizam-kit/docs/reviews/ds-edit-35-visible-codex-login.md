# DS-EDIT-35 — Connexion Codex visible

31 octobre 2026 — cible application, **En revue : qualification technique acquise, acceptation humaine différée**. Base `c616f9f`, branche `codex/visible-codex-login`, [fiche](../work-items/ds-edit-35-visible-codex-login.md).

## Défaut et correctif

Reproduction dans l’onglet utilisateur 54137 : le clic démarrait bien la connexion et fournissait le lien OpenAI, présent dans l’arbre accessible. La surface absolue placée sous le header était néanmoins découpée par ses ancêtres `overflow-y: hidden`. Le test géométrique au centre du lien ne trouvait pas ce lien et la capture ne le montrait pas. Les tests précédents vérifiaient sa présence, insuffisante pour démontrer sa visibilité réelle.

HeaderTools utilise désormais la surface native Storybook WithTooltipPure, contrôlée par l’URL d’attente ou l’erreur, avec portail extérieur au header et placement bottom-end. Lien et erreurs restent ancrés au bouton, sans changer les handlers, validation d’URL, gardes, comptes ou protocoles. Une connexion acquise retire la surface. Aucun nouveau package ni élargissement d’accès.

## Contrôles

macOS arm64, Node 24.22.0 et Chromium verrouillé existants. Types conformes, ESLint/Prettier ciblés et diff conformes (paramètre theme désormais inutilisé retiré après le premier lint). Quatre parcours dev et quatre statiques `header tools|intention placeholder` réussis, build Storybook compris. Le parcours dev vérifie désormais le hit-test du lien et un essai de clic Playwright `trial`, puis suivi/déconnexion simulés ; aucune navigation fournisseur pendant ces tests.

Reprise réelle de 54137 : état « Génération chargée » et Enregistrer désactivé constatés avant intervention, aucun brouillon actif. [Mise à jour ciblée](ds-edit-35/preview-update.json) du seul HeaderTools, neuf sources de valeurs identiques avant/après, aucun compte transféré. Le manager servait encore son ancien bundle après simple rechargement : redémarrage du seul serveur identifié de cette instance, sur le même port et avec son état privé conservé. Aucun autre aperçu arrêté. L’autorisation inachevée a été relancée après redémarrage.

Retest réel dans le même onglet : bouton cliqué, région Connexion Codex visible hors toolbar, lien au centre réellement pointable (`elementFromPoint`, résultat vrai), [capture](ds-edit-35/login-visible-current.png). Aucun identifiant, consentement ou connexion finale soumis par l’agent ; aucun appel d’inférence. URL OAuth et paramètres temporaires non conservés dans les preuves. La preuve réelle qualifie l’ouverture visible du lien ; l’authentification finale reste à effectuer humainement.

## Revues et reprise

Procédures applicatives à la base citée, **séquentiel, même agent, non indépendant**. Design Reviewer : satisfaisant face au défaut, surface visible et lisible mobile, lien clairement exposé. Technical Reviewer : satisfaisant, portail natif hors clipping, aucun changement du raccordement d’authentification ; test de présence renforcé par géométrie et actionnabilité. Sécurité ciblée : liste de domaines, HTTPS, rel noopener/noreferrer et protections du service conservés ; pas de jeton ou URL temporaire dans le dépôt, pas de scan global ni certification. Connexion finale et autres plateformes non qualifiées par cette intervention.

[Aperçu existant corrigé](http://127.0.0.1:54137/?path=/story/components-button--default). Prochaine action : cliquer sur Se connecter sur OpenAI et terminer humainement la connexion. Valeurs, état privé et autres recettes conservés. Doc updated. Modèles app et G/J5 inchangés, aucune publication.
