# DS-EDIT-36 — Connexion directe en un clic

31 octobre 2026 — cible application, **En revue : qualification technique acquise, acceptation humaine différée**. Base `276deca`, branche `codex/direct-codex-login`, [fiche](../work-items/ds-edit-36-direct-codex-login.md).

## Comportement

Connecter Codex ouvre un onglet provisoire pendant le geste utilisateur, puis le dirige vers l’URL OpenAI validée dès réponse du service, sans afficher de second lien. L’opener est retiré et une politique no-referrer est posée avant navigation. Le bouton est désactivé pendant la préparation. Si la fenêtre est bloquée, un message visible invite à réessayer et aucune requête de connexion ne part. En cas d’erreur, d’absence d’URL ou de compte déjà connecté, l’onglet provisoire est fermé. Les erreurs restent dans la surface native du header. La déconnexion n’ouvre aucune fenêtre.

refreshAgentStatus renvoie désormais le statut effectivement validé et accepté par la séquence courante ; le retour ne réutilise pas une ancienne URL après échec. Les gardes serveur et client, domaines autorisés, protocoles et permissions restent inchangés. Aucun identifiant ou consentement n’est soumis automatiquement.

## Vérifications

macOS arm64, Node 24.22.0 et Chromium verrouillé existants. Types, ESLint et Prettier ciblés conformes ; 12 unitaires assisted-session réussis. [Résultats navigateur](ds-edit-36/browser-results.json) : huit parcours dev réussis, quatre statiques réussis avec quatre exclusions d’authentification attendues sans service ; build Storybook conforme. Contrôles dev : onglet about:blank créé avant résolution de la réponse retardée, navigation sur la page simulée OpenAI, opener nul, absence du lien intermédiaire, suivi/déconnexion, placeholder, popup bloquée sans appel et fermeture après erreur. [Capture de page simulée](ds-edit-36/direct-login-simulated-desktop.png), aucune donnée réelle de compte.

Diagnostics de préparation corrigés : inférence trop large d’un style statique, contexte de test omis, puis charset de la page simulée manquant ; types et parcours finaux réussis après correction. Les captures de test portent explicitement la mention simulation.

Instance existante 54137 : Génération chargée et Enregistrer désactivé constatés avant mise à jour. HeaderTools et assisted actualisés sans transfert d’état privé ; [empreinte et préservation des sources de valeurs](ds-edit-36/preview-update.json), redémarrage ciblé pour recompiler le manager. Clic réel effectué dans Storybook mis à jour, plus de lien intermédiaire ; [capture du header](ds-edit-36/current-header.png). Le navigateur externe a été identifié, mais sa validation finale n’est pas qualifiée : le contrôle automatique a refusé la lecture globale de Safari susceptible d’exposer des onglets privés et jetons. Aucun contournement, identifiant ou URL temporaire dans les preuves du dépôt ; la validation repose sur le parcours isolé, et la confirmation externe reste humaine.

## Revues et reprise

Procédures applicatives à la base citée, **séquentiel, même agent, non indépendant**. Design Reviewer : satisfaisant pour le parcours implémenté, suppression de l’étape intermédiaire, attente/erreur lisibles ; ouverture externe réelle à confirmer humainement. Technical Reviewer : satisfaisant, réservation synchrone, statut validé renvoyé, garde contre réutilisation d’un résultat périmé, sorties d’erreur testées. Sécurité ciblée : validation d’URL inchangée, opener retiré, referrer supprimé, pas de compte transféré ni secret distribué ; pas de scan global ou certification. Autres navigateurs/OS et authentification finale non qualifiés.

[Aperçu existant mis à jour](http://127.0.0.1:54137/?path=/story/components-button--default). Prochaine action : retest humain du clic en un geste dans le navigateur du poste ; aucune nouvelle tranche ouverte. Valeurs et configuration conservées, autres aperçus préservés. Doc updated. Modèles app et G/J5 inchangés, aucune publication.
