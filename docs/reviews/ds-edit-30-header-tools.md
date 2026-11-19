# DS-EDIT-30 — Outils du header Storybook

31 octobre 2026 — cible application, base `39693a1`, branche `codex/storybook-header-tools`. [Fiche](../work-items/ds-edit-30-header-tools.md).

Actualiser les données et Connecter Codex sont déplacés dans la zone droite native de la barre supérieure Storybook, via TOOLEXTRA déjà présent dans la version 10.6.3 installée. Ils sont retirés d’Apparence. Le nouveau composant HeaderTools possède la lecture initiale, le suivi de connexion et les mêmes handlers ; il fonctionne avec le panneau fermé. Lien d’authentification et erreurs restent rattachés à ces outils dans une surface dédiée. La déconnexion y remplace la connexion. Aucun compte ni fournisseur appelé implicitement.

Sur mobile, les textes visuels se réduisent à ↻ et Codex, avec les noms accessibles complets et les infobulles natives ; pas de débordement horizontal constaté. Hypothèse de présentation limitée et réversible, à examiner à la recette. En statique, actualiser relit la génération et la connexion est désactivée faute de service. Aucun changement d’opération, protocole ou permission. Le nouveau fichier est ajouté au manifeste fermé des dépendances pour préserver la détection des modifications et la relecture sûre.

## Contrôles

macOS arm64, Node 24.22.0 et Chromium local verrouillé existants. Types, ESLint et Prettier des fichiers code/tests/manifeste affectés conformes. Quinze unitaires ciblés editor-panel-render/assisted-session réussis. Quatre parcours dev puis quatre statiques sélectionnés avec `header tools|appearance layout` réussis, build Storybook compris. Les parcours vérifient absence de doublons, position à droite, actualisation et, en développement, connexion simulée, affichage du lien autorisé, suivi puis déconnexion. Aucun clic d’authentification réelle ni appel fournisseur.

[Deux contrôles de recette](ds-edit-30/qualification.json) : position réelle en haut à droite, commandes disponibles aux deux formats, absence de débordement et empreintes manager/HeaderTools/Panel/manifeste identiques au dépôt. Captures prises après chargement du composant. [Préservation](ds-edit-30/preview-preservation.json) : modèle/catalogue et 188 identités conservés depuis 54132, sans compte, journal ni brouillon transféré. `npm run test:design-editor:server` : **84 tests réussis**, y compris HTTP protégé, transactions, interruptions et récupération avec le nouveau fichier inscrit au manifeste. Aucune erreur de contrôle finale. Qualification technique acquise, En revue, acceptation humaine différée.

## Revues et reprise

Procédures applicatives à la base citée, **séquentiel, même agent, non indépendant**. Design Reviewer : satisfaisant par rapport au déplacement demandé ; outils dans la zone native droite, hiérarchie du panneau allégée, captures ordinateur/mobile relues. Technical Reviewer : satisfaisant, même session partagée et handlers existants, suivi désormais indépendant du montage d’Apparence, fichier ajouté au manifeste ; état statique explicite. Sécurité ciblée : mêmes endpoints, gardes et validation des URL d’authentification, pas de clé ni état privé transféré, connexion uniquement sur geste explicite ; pas de scan global ni certification.

[Aperçu local corrigé](http://127.0.0.1:54133/?path=/story/components-button--default&addonPanel=adl/design-editor/panel), copie isolée `.local/ds-edit-30/preview`. Anciennes recettes et brouillons préservés. Prochaine action : recette visuelle humaine, notamment les libellés compacts mobiles. Limites : autres navigateurs/OS, connexion réelle non répétée, brouillon volatile préexistant. Doc updated. Modèles app et G/J5 inchangés, aucune publication.
