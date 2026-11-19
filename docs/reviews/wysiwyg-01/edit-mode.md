# WYSIWYG-01 — Édition et interactions à l’échelle du design

16 novembre 2026, cible application. Version réalisée `6e1afce`, base f0514cd, branche codex/wysiwyg-01-edit-mode. **En revue : qualification technique acquise, acceptation humaine différée.** [Fiche](../../work-items/wysiwyg-01-edit-mode.md), [guide autonome](../../design-system/visual-inspector.md), [empreintes des sources](edit-mode-sources.json).

## Résultat et décisions déléguées

Édition est active par défaut. L’état est commun à Workshop et Pages, conservé entre ces vues pendant la session, sans préférence globale. Un composant partagé EditToggle expose role=switch, nom Édition, aria-checked et activation native clavier. Off : le panneau droit ne contient que ce switch. On : les outils existants et le contexte sélectionné reviennent. Une story interactive complète le composant partagé.

Le clic DS s’applique à la galerie et aux exemples individuels. Cible, variante, partie et état natif sont résolus parmi les bindings des contextes annoncés par le pont existant. Libellé, contrôle, aide et autres parties déclarées ont leurs propres réglages. Un descendant est rattaché à sa partie déclarée ; aucune identité ou propriété indépendante n’est inventée pour un wrapper arbitraire. Une cible sans correspondance masque les outils de l’ancienne sélection et affiche l’absence de réglage enregistré. Le survol et la sélection sont indiqués par une couche DOM éphémère, sans modification des styles du composant.

En édition, clics/pointerdown, saisie, formulaires et touches métier sont interceptés dans le seul document d’aperçu ; Tab reste utilisable et Entrée/Espace sélectionnent. Hors édition, tous ces écouteurs et la couche de sélection sont retirés. Le composant reste monté : son état interactif est conservé. Les brouillons DS restent visibles en mode interactif. Le protocole existant accepte bindingId null : il conserve la projection validée des cibles de la scène, sans forcer de pseudo-état. Ni writer, permission, appel fournisseur ni nouveau stockage.

Pages conserve sa protection d’abandon : une projection éphémère est réinitialisée après confirmation avant de passer off ; un conflit doit être résolu. Page/révision différente invalide la sélection DOM. Toute édition exige le document actuel et une fenêtre valide, afin de ne pas réutiliser un élément du document précédent après navigation.

## Vérifications exécutées

- [Chromium 156.0.8078.4](edit-mode-chromium.json) et [WebKit 27.2](edit-mode-webkit.json) : réussite, chacun en 1280×900 et 1440×1000. Galerie de cinq composants, clic libellé → partie label, changement de taille 1.25 rem → 20 px puis abandon, clic contrôle → partie control, saisie bloquée en on et réelle en off. Panneau off : switch décoché, aucun champ ni autre bouton. Brouillon gap 0.75 rem conservé à 12 px hors édition puis abandonné. Passage Pages avec le même mode off, réactivation des outils, puis parcours complet historique/reset/concurrence/reçus/approbation et source isolée appliquée puis relue après recharge. Fournisseur explicitement simulé.
- Smoke du nouveau lien sous Chromium : exemple individuel button/HTMLForm ; Soumettre en édition laisse clics=0 ; mode off, saisie et vrai submit produisent « Essai interactif · action=7 · clics=1 » ; retour on, clic intercepté et compteur inchangé. Exemple field/Default : aide interne sélectionnée, partie hint confirmée. Aucun enregistrement source dans ce smoke.
- Types, build application et build Storybook réussis sur copie isolée des fichiers suivis et du chantier. Les doublons préexistants « 2 » restent exclus, sans suppression ni modification pour faire passer le contrôle. Journaux locaux wysiwyg-edit-mode-{types,build,storybook}4.log.
- Génération/validation Loomata UI, trois tests de composition et ESLint ciblé réussis ; diff sans erreur. Commandes : `node scripts/generate-loomata-ui.mjs --check`, `node --test tests/ui-composition.test.mjs`, `node scripts/test-visual-inspector-ui.mjs --application` puis `--webkit`, `npm run typecheck`, `npm run build`, `npm run build-storybook` dans la copie sélectionnée. Pas d’extrapolation à une compatibilité native complète.

Les échecs restent consignés dans les journaux locaux. Les dimensions calculées du switch et ses classes non conformes ont été refusées par les gardes existants : réemploi de tokens directs et d’attributs de composant, sans affaiblir les validateurs. Le premier parcours browser ayant atteint Pages a rencontré un élément d’ancien document dont defaultView était null après navigation : invalidation de sélection et contrôles du document courant ajoutés, puis les deux parcours complets ont réussi. Aucun échec masqué ni contrôle déclaré passé sans exécution.

## Revues et limites

Design : lecture de fidélité puis expérience, à partir des rendus [partie interne sélectionnée](edit-mode-internal-part.png), [mode interactif et panneau réduit](edit-mode-interactive.png), [Pages sombre](edit-mode-pages-dark.png). Sélection de la bonne partie, distinction on/off et restitution de la saisie constatées ; direction visuelle et compréhension du switch restent à accepter par le designer.

Technique/QA : mêmes bindings, protocole borné et session de brouillon ; projection interactive sans binding forcé, cycle d’écouteurs et annulation rAF relus. Reprise après changement de document retestée. Sécurité proportionnée : observations DOM bornées aux cibles/variantes/parties/états déclarés ; aucune capacité de source issue d’un clic, aucun service ou droit nouveau. Même agent, rôles séquentiels et non indépendants, pas de sous-agent ni audit externe.

La sélection DS édite les parties et propriétés préparées par le design system, pas un DOM arbitraire sans binding. Les limites de cascade, pseudo-états, DOM fermés, fournisseur réel et parcours natif complet du bilan initial restent explicites. Aucun essai fournisseur réel ou acceptation humaine déduit des tests. Les autorités DTCG/YAML, les modèles de suivi app et les fichiers non suivis préexistants restent hors modifications. Pas de publication.

## Recette

[Nouvel aperçu fictif](http://127.0.0.1:61484/ui-lab?scene=components%2FOverview). Les anciens 60723 et 59977 sont conservés. Métadonnées de lancement privées dans .local/wysiwyg-01-edit-mode-preview/launch.json à la racine de fabrication. Le navigateur automatique est fermé ; le serveur reste disponible pour la recette. Prochaine action : sélectionner le libellé puis le champ, modifier un réglage, désactiver Édition pour tester la saisie et réactiver les outils. Doc updated.
