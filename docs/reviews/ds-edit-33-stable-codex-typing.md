# DS-EDIT-33 — Saisie Codex stable

31 octobre 2026 — cible application, **En revue : qualification technique acquise, acceptation humaine différée**. Base `054c2db`, branche `codex/stable-codex-typing`, [fiche](../work-items/ds-edit-33-stable-codex-typing.md).

## Cause et correction

L’effet React d’envoi de l’aperçu dépendait de state.assisted complet. Chaque caractère changeait ce conteneur, donc relançait l’envoi et incrémentait la séquence de rendu. L’aperçu était temporairement déclaré périmé et sa couche CSS réécrite, même lorsque les opérations visuelles restaient identiques. Le phénomène reproduit est une réapplication inutile, sans preuve d’un rechargement complet du document.

Le déclenchement utilise désormais la clé de rendu déjà existante (opérations + comparaison), au lieu des métadonnées d’assistance. Sélection, contexte, génération, changements et identité de session restent des dépendances. Le résultat courant utilise la même clé. Description et précision peuvent évoluer sans invalider l’aperçu ; vraies valeurs, changements de story, opérations appliquées et comparaison restent propagés. Aucun debounce masquant une mise à jour, changement de protocole ou moteur serveur.

## Preuves

macOS arm64, Node 24.22.0 et Chromium verrouillé existants. [Avant correction](ds-edit-33/reproduction.json) : le test réel de frappe échoue avec **70 mutations** de la couche CSS contre zéro attendu. Après correction, six parcours dev (saisie, clarification simulée, états Button) et quatre statiques (saisie/états) réussis, build Storybook compris. Le test de frappe contrôle zéro mutation, texte multiligne conservé, aperçu prêt, comparaison et vraie modification de valeur effectives. Quinze unitaires ciblés editor-panel-render/assisted-session réussis ; types, ESLint, Prettier et diff conformes. Diagnostic de test : compteur ajouté à window initialement typé comme propriété obligatoire, refusé par TypeScript ; propriété optionnelle et accumulation initialisée correctement typées, contrôle final réussi.

[Deux parcours de recette](ds-edit-33/qualification.json) : **zéro mutation de la couche d’aperçu et zéro navigation iframe pendant la frappe**, ordinateur/mobile ; comparaison toujours effective. Empreinte de Panel identique au dépôt. Captures relues ; hauteur automatique et texte conservés. [Préservation](ds-edit-33/preview-preservation.json) : modèle/catalogue de 54135 et 188 identités conservés, aucune connexion ni brouillon transféré. Saisies de contrôle non enregistrées et aucun appel fournisseur réel.

## Revues et reprise

Procédures applicatives à la base citée, **séquentiel, même agent, non indépendant**. Technical Reviewer : satisfaisant, clé canonique réutilisée, chaîne de corrélation des réponses intacte et vrais changements exercés ; suppression de la dépendance trop large sans retirer les changements visuels. Design Reviewer : satisfaisant, stabilité mesurée pendant frappe, texte et croissance conservés ; acceptation visuelle humaine différée. Sécurité ciblée : aucun nouvel accès, endpoint, compte ou entrée externe ; pas de scan global ni certification. Persistance/récupération, autre navigateur/OS et inférence réelle non répétées.

[Aperçu corrigé](http://127.0.0.1:54136/?path=/story/components-button--default&addonPanel=adl/design-editor/panel), copie isolée `.local/ds-edit-33/preview`, anciennes recettes/états conservés. Prochaine action : retest humain de saisie, sans nouvelle tranche ouverte. Doc updated. Modèles app et G/J5 inchangés, aucune publication.
