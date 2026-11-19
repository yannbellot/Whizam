# DS-EDIT-29 — Contraste et acquittement

31 octobre 2026 — cible application, base `0aac9c1`, branche `codex/appearance-contrast-layout`. [Fiche](../work-items/ds-edit-29-contrast-layout.md).

La case conditionnelle de prise de connaissance est déplacée dans une rangée à droite du résultat de contraste, avec retour à la ligne sur mobile. La section Choix à enregistrer et sa fonction de libellés sont supprimées, sans supprimer les opérations du brouillon. Le calcul d’audit, les avertissements des autres contextes et la clé d’acquittement restent inchangés. Connecter mon compte Codex est renommé Connecter Codex. Le déplacement de la connexion et de l’actualisation n’est pas effectué : le header est la proposition de placement, en réponse à la question du designer.

## Vérifications

macOS arm64, Node 24.22.0 et Chromium local verrouillé. Types conformes ; 15 unitaires ciblés editor-panel-render/assisted-session réussis ; ESLint ciblé conforme. Parcours sélectionnés `contrast acknowledgment|shows contextual heading|appearance layout`, exécutés successivement via test:design-editor:dev puis test:design-editor ; **six parcours dev et six statiques réussis**, build Storybook et formatage ciblé conformes. Qualification technique acquise, En revue, acceptation humaine différée. Aucune inférence réelle ni sauvegarde de recette.

[Deux contrôles de recette](ds-edit-29/qualification.json) réussis : même parent pour mesure et case, position à droite vérifiée par géométrie sur ordinateur, case visible mobile, résumé absent. Captures relues. Le parcours dev vérifie aussi le blocage d’Enregistrer avant acquittement, son activation après et la remise à zéro après une nouvelle valeur. [Préservation](ds-edit-29/preview-preservation.json) : modèle/catalogue, 188 identités et #e32400 repris de 54131, sans compte ni brouillon transféré. La mesure insuffisante blanche des captures est un brouillon synthétique non enregistré ; le nouvel accès s’ouvre sur les valeurs conservées.

## Revues et reprise

Procédures applicatives à la base citée, **séquentiel, même agent, non indépendant**. Design Reviewer : satisfaisant pour le mandat de contraste ; mesure et acquittement rapprochés, alignement desktop et retour à la ligne mobile, suppression complète du récapitulatif. Technical Reviewer : satisfaisant, seul l’emplacement du contrôle change, mêmes conditions/clé/handler et mêmes gardes de sauvegarde ; suppression du renderer sans toucher au plan d’opérations. Sécurité ciblée : aucune nouvelle entrée, permission, dépendance ou destination, protections serveur conservées ; aucun scan global ni certification.

[Aperçu local](http://127.0.0.1:54132/?path=/story/components-button--default&addonPanel=adl/design-editor/panel), copie isolée `.local/ds-edit-29/preview`. Anciennes recettes et leurs états préservés. Prochaine action : recette visuelle humaine et choix de placement des deux outils. Risques résiduels : autres plateformes, persistance/récupération non répétées, brouillon volatile préexistant. Doc updated. Modèles app et G/J5 inchangés, aucune publication.
