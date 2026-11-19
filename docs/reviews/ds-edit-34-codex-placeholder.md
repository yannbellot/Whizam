# DS-EDIT-34 — Placeholder lié à la connexion

31 octobre 2026 — cible application, **En revue : qualification technique acquise, acceptation humaine différée**. Base `c96d6af`, branche `codex/codex-connection-placeholder`, [fiche](../work-items/ds-edit-34-codex-placeholder.md).

Le message sous le champ d’intention est supprimé. Sans connexion, son placeholder devient « Connectez Codex pour déclarer votre intention. », dans la couleur orange d’avertissement du thème Storybook. Dès connexion, texte et couleur sont remplacés par « Déclarer votre intention... » et la couleur habituelle des placeholders. La déconnexion retrouve naturellement l’état initial. Le texte déjà saisi est conservé ; seul l’indicateur de champ vide change. Libellé accessible et gardes d’interprétation inchangés. Aucune modification des handlers, compte ou moteur.

## Contrôles

macOS arm64, Node 24.22.0 et Chromium verrouillé existants. Types, ESLint et Prettier ciblés conformes ; diff contrôlé. `test:design-editor:dev -- --grep 'intention placeholder|Codex typing'` : **quatre réussis**, ordinateur/mobile, bascule en session avec connexion simulée et texte conservé, absence d’ancien message et de réapplication pendant frappe. Même sélection statique : **quatre réussis**, build Storybook compris ; état non connecté seul applicable sans service. Aucun appel fournisseur, connexion réelle ou enregistrement de recette.

[Deux parcours de recette](ds-edit-34/qualification.json) : orange `rgb(255, 173, 51)` sans connexion, gris habituel `rgb(149, 153, 157)` après connexion simulée, placeholder remplacé, texte saisi préservé. Captures des deux états relues ; celles connectées représentent une simulation, sans compte privé. Empreintes ScopeControls/CSS identiques au dépôt. [Modèle/catalogue et 188 identités](ds-edit-34/preview-preservation.json) conservés depuis 54136, sans compte ni brouillon transféré.

## Revues et reprise

Procédures applicatives à la base citée, **séquentiel, même agent, non indépendant**. Design Reviewer : satisfaisant face aux textes et couleur demandés ; ancien paragraphe retiré et bascule des deux états contrôlée ; placeholder naturellement masqué pendant la saisie. Technical Reviewer : satisfaisant, condition fondée sur l’état connecté déjà validé, classe CSS limitée au placeholder non connecté, largeur/hauteur automatique et saisie conservées. Sécurité ciblée : aucune nouvelle entrée, permission ou URL, gardes existantes inchangées ; aucun scan général ni certification. Autres navigateurs/OS, récupération/persistance et inférence réelle non répétés.

[Aperçu corrigé](http://127.0.0.1:54137/?path=/story/components-button--default&addonPanel=adl/design-editor/panel), copie isolée `.local/ds-edit-34/preview`, déconnectée réellement ; les simulations étaient limitées aux contextes de test fermés. Anciennes recettes/états conservés. Prochaine action : recette visuelle humaine du placeholder. Doc updated. Modèles app et G/J5 inchangés, aucune publication.
