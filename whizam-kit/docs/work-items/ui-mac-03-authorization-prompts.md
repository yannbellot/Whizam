# UI-MAC-03 — Autorisations macOS répétées

11 novembre 2026 — application, signalement d’autorisations à la première ouverture des vues, notamment Aperçu. Base `3225ced`. Branche `codex/macos-authorization-diagnostic`. Aucun changement suivi initial, fichiers non suivis historiques préservés.

## Mandat et méthode

Identifier et corriger la cause des demandes répétées, sans suppression de protection macOS, acceptation silencieuse d’une permission ou réinitialisation de TCC. L’utilisateur ne dispose pas du libellé exact ; il décrit l’impression que chaque page demande une autorisation comme une nouvelle app. Ne pas conditionner la suite à une nouvelle demande de ce même libellé indisponible.

Procédure applicative diagnose-incident au HEAD cité, puis inspection du code et des journaux expurgés ; interaction dans la fenêtre réelle via CUA, changements de vues seulement, sans fermer, recharger, modifier ou enregistrer son brouillon. Critères : identifier le dialogue et sa ressource, observer les premiers accès puis les reprises, corriger seulement la cause démontrée. GPT-6.1 Sol · Moyenne recommandé ; aucun réglage changé. Revues séquentielles, même agent, non indépendantes.

## Observations

- Instance effectivement ouverte : `.runtime.local/ui-lab-02/Loomata.app`, même fenêtre et même projet, UI Lab et Aperçu sur 57897, Storybook sur 57898. `showView` crée une WKWebView par rôle puis la conserve ; le changement de vue interne ne lance pas d’application ni de commande `open`. Seules les destinations explicites de connexion officielle passent par NSWorkspace.open.
- Contrôle réel CUA : UI Lab → Aperçu → Storybook → UI Lab, aucune autorisation affichée pendant le parcours observé. Retour au même aperçu iframe (même identifiant bridge), propriété Rayon des angles / valeur 0.5 rem, texte « Brouillon non enregistré » toujours présent. Aucun clic sur Annuler/Enregistrer, aucune fermeture ou relance de l’app. Les vues avaient pu être visitées avant ce contrôle : ceci ne prouve pas le comportement de tout premier accès sur une installation vierge.
- Pas d’attribut `com.apple.quarantine` sur ce bundle ni sur son Node local. Aucun attribut de sécurité modifié.
- Journaux TCC ciblés : accès Documents de Loomata et de son helper autorisés ; prélectures caméra/micro observées, sans preuve d’un dialogue affiché. Journaux Gatekeeper/LaunchServices : lancements de Loomata et évaluation, sans identification d’un dialogue répété par vue. Les événements de requête ne sont pas assimilés à des fenêtres d’autorisation.
- Plusieurs copies locales partagent `org.loomata.local.workspace`. Les deux bundles UI-MAC-02 et UI-LAB-02 ont toutefois un binaire SHA256 identique (`a9f3164c190c7d6bed15533fc253897633cb3574b6136f263888bc8926e44397`) et la même exigence désignée ad hoc (`cdhash 4476a73a2ea6b03b71c0ca5d39f864e2baff1b19`). La multiplication des copies ne suffit donc pas à expliquer la répétition rapportée entre ces deux versions.
- Aucune identité de signature Apple valide disponible dans l’inventaire consulté. Aucune création/importation de certificat, écriture de trousseau ou modification globale autorisée ni effectuée.
- SDK macOS installé : WKProcessPool multiple n’a plus d’effet depuis macOS 12 ; partager artificiellement ce pool ne serait pas une correction démontrée. La configuration actuelle utilise le datastore persistant par défaut de WebKit, pas un store éphémère par page.

## Références et hypothèses

[Apple — exigences de signature](https://developer.apple.com/documentation/technotes/tn3127-inside-code-signing-requirements) : une signature ad hoc est liée à une version de code ; une reconstruction peut entraîner une nouvelle autorisation. Cela reste une hypothèse pour les anciennes versions natives, et n’explique pas à elle seule des alertes entre vues du même processus.

[Apple — accès au dossier Documents](https://developer.apple.com/documentation/bundleresources/information-property-list/nsdocumentsfolderusagedescription) : macOS mémorise le choix de permission, et une sélection par le panneau natif constitue un consentement explicite. Aucun reset de permissions n’est effectué pour tenter de reproduire.

## Résultat et point de reprise

**En cours — diagnostic partiel, symptôme non reproduit ; aucune correction qualifiée. Doc updated.** La cause de la répétition au premier accès reste indéterminée. Le contrôle de navigation existant est satisfaisant et le brouillon observé préservé ; il ne prouve pas l’absence de demandes sur un premier lancement neuf. Pas de modification spéculative du code, de promesse « une seule demande », de nouveau bundle ni de publication.

Revues technique et sécurité ciblées : pas d’écart applicatif démontré sur le changement de vue ; limites de signature et d’observation explicites. Pas de test automatisé ajouté qui refléterait simplement la structure existante. La revue design est limitée au parcours réel et à son absence de dialogue lors de l’observation.

Reprise lorsqu’une demande apparaît effectivement : relever son type/ressource depuis le dialogue ou les journaux corrélés au moment du premier accès ; distinguer autorisation de ressource, ouverture Gatekeeper et activité d’arrière-plan. Ne pas réinitialiser les permissions du porteur pour provoquer cette observation. Toute stabilisation par une identité Apple suppose un mandat et une identité disponibles ; aucune installation ou nouvelle signature globale implicite.
