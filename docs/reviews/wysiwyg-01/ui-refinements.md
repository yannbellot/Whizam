# WYSIWYG-01 — Ajustements après recette

16 novembre 2026, application ; version réalisée `94650a0`, base 1580572, branche codex/wysiwyg-01-ui-refinements. Mandat : vue de tous les composants, présentation commune des inspecteurs, modification immédiate et unités séparées. **En revue : qualification technique acquise, acceptation humaine différée.**

## Changements

La scène `components/Overview` expose un exemple réel de chacun des cinq composants du catalogue actuel (Button, Field, Notice, Panel, SelectField), construite depuis les scènes Components existantes. Une nouvelle entrée « Tous les composants » la rend accessible dans Design system. Clic dans la galerie, ou Tab/Entrée sur une carte, sélectionne un binding root disponible de la cible/variante observée ; l’iframe et la page restent les mêmes. Les exemples et variantes individuels restent accessibles. Les clics/formulaires de démonstration sont suspendus dans cette galerie pour permettre la sélection ; aucun registre d’identité parallèle.

Pages réutilise la structure compacte `data-inspector-row/control/value/unit` et InspectorSelect du DS. Aucun bouton Aperçu : modification textuelle, menu, couleur et opacité appliquent directement la projection. La prise/perte de focus groupe les saisies ; une valeur momentanément invalide conserve le rendu valide. Le champ numérique présente seulement le nombre, l’unité est extraite de la valeur CSS puis recomposée lors de l’édition ou du changement d’unité. Les expressions restent textuelles, sans conversion inventée. Le champ dimension du DS sépare aussi nombre et unité, en conservant sa conversion contextualisée existante.

## Vérifications et revues

Types/build app/Storybook exécutés sur la copie des sources suivies et des fichiers du chantier, isolant les anciennes copies « 2 ». ESLint ciblé et diff relus. Six contrôles DS-UI-06 réussis. Les parcours browser étendus vérifient sélection des cinq composants sans navigation, modification de gap 0.5rem → 0.75rem (rendu 12 px), abandon confirmé (retour 8 px), nombre sans suffixe, saisie instantanée et absence du bouton Aperçu, puis les scénarios complets d’historique/concurrence/transmission/approbation/écriture isolée de WYSIWYG-01. Fournisseur explicitement simulé, aucune inférence réelle. Résultats : [Chromium 156.0.8078.4](ui-refinements-chromium.json) et [WebKit 27.2](ui-refinements-webkit.json) réussis, chacun en 1280×900 et 1440×1000, jusqu’à la source isolée appliquée et relue après recharge. [Empreintes de tous les fichiers runtime/tests affectés](ui-refinements-sources.json). Pages seul réussit dans les deux formats, avec les 503 transitoires et reprises existantes consignés dans `wysiwyg-refinement-pages.log`. Commandes : `node scripts/test-visual-inspector-ui.mjs --application` puis `--webkit`, `node scripts/test-exploration-ui.mjs --pages-only`, `node --test tests/ds-ui-06.test.mjs`, `npm run typecheck`, `npm run build`, `npm run build-storybook` sur copie propre, ESLint ciblé et `git diff --check`. Journaux locaux `wysiwyg-refinement-*`. Aucun test fournisseur réel.

Captures sans retouche : [galerie et sélection](ui-gallery-1280.png), [champs Pages](ui-pages-1280.png), [thème sombre](ui-pages-dark-1440.png).

Échecs de tests conservés : l’ancien scénario cliquait sur Transmettre après une saisie identique (aucun événement change) ; il vérifie maintenant l’absence de lot et le bouton désactivé. Le test d’annulation de la galerie attendait le retour à 8 px avant de confirmer la boîte d’abandon existante ; confirmation ajoutée. Une lecture de ref en rendu a été refusée par ESLint ; mémorisation de l’unité déplacée dans un effet. Aucun contrôle échoué présenté comme réussi.

Revues design (fidélité DS-UI-06 puis usage), technique et sécurité proportionnée : séquentielles, même agent, non indépendantes. Pas de modification de protocole, du writer, des permissions ou des autorités de tokens. La sélection de galerie exige cible/variante/binding présent dans les contextes du pont. Les limites natives, de cascade et d’inférence réelle du bilan runtime initial restent applicables. Les futurs composants sans exemple enregistré ne sont pas inventés ni rendus par un générateur. Acceptation visuelle humaine différée.

Doc updated ; anciens aperçus et données personnelles préservés. Publication désactivée.

## Accès à la recette

Nouvelle copie fictive servie sur [la galerie](http://127.0.0.1:60723/ui-lab?scene=components%2FOverview). L’ancien 59977 est conservé. Métadonnées privées dans `.local/wysiwyg-01-ui-preview/launch.json` à la racine du dépôt de fabrication ; aucune connexion transférée. Smoke de ce lien sous Chromium réussi : entrée directe galerie, sélection Button, passage Pages, choix rem et nombre 1.5 → rayon calculé 24 px, puis reset sans écriture de source. La fenêtre de test automatique est fermée ; le serveur de recette reste disponible.
