# DS-EDIT-38 — Choix de portée interchangeables

1 novembre 2026 — application, base 1de98e0, branche codex/switchable-appearance-scope. **En revue, qualification technique acquise, acceptation humaine différée.** [Fiche](../work-items/ds-edit-38-switchable-scope.md).

## Résultat

Partagé, Intention et Local sont interchangeables sans perte de la valeur saisie. Le bouton choisi possède un fond accentué, un contraste conservé au survol et aria-pressed=true ; le groupe garde son nom accessible. Le libellé intention est stable. Les autres choix restent accessibles si la valeur est valide, le contexte disponible et l’édition déverrouillée. La comparaison et les saisies invalides bloquent les choix. Cliquer sur l’intention déjà sélectionnée ne réinitialise pas sa préparation.

Chaque transition remplace le seul geste courant. La description d’intention reste conservée lors d’un aller-retour ; les propositions, précisions et corrélations de requête sont invalidées au changement de portée. Une réponse IA tardive est ignorée. Le partage cherche l’attribution sémantique d’origine, y compris sous une personnalisation enregistrée. Dans ce cas, le geste combine update-shared et restore : le réglage rejoint la valeur saisie commune, les autres personnalisations sont conservées. La validation transactionnelle et les conflits entre gestes restent effectifs.

Sans origine partagée, inventaire complet ou valeur compatible, le bouton partagé reste inactif. Sous le groupe, texte orange exact demandé : « Aucun token partagé d’origine n'existe. ». Ce message commun est conservé sur mandat explicite même lorsque la cause réelle est une incompatibilité ou un inventaire incomplet ; l’aide au survol indique cette cause précise. Sans modification les trois choix sont inactifs ; un réglage autonome modifié garde le comportement local déterministe existant avec sélection Local visible.

## Preuves

- `vitest run --config config/testing/vitest.config.ts tests/unit/assisted-session.test.ts` : **21 réussis**. Six transitions, saisie brute et autre geste conservés, origine sous personnalisation enregistrée, refus absent/incomplet/incompatible et réponse tardive après changement de portée. Analyses simulées, aucune inférence réelle.
- ESLint et Prettier ciblés : conformes. Typecheck : conforme dans `.local/ds-edit-38/check`, archive des sources suivies à la base plus seuls fichiers corrigés, dépendances locales reliées. Réexécuté après stabilisation. Le fichier non suivi préexistant SemanticStyles.tsx, incompatible avec la session actuelle selon DS-EDIT-37, est préservé hors de cette copie ; le contrôle global du clone n’est pas revendiqué conforme.
- `node scripts/test-design-editor.mjs --development assisted.spec.ts` : **20 parcours réussis**, [résumé dev](ds-edit-38/development.json). Desktop 1280×800/mobile 390×844, Chromium local. Six transitions, sélection unique, valeur/aperçu conservés, rétablissement, comparaison, intention et connexion simulées, message orange.
- Même commande sans --development : **18 réussis, deux exclusions attendues** du parcours de service IA absent du statique ; [résumé statique](ds-edit-38/static.json). Build Storybook conforme.
- Après correction du contraste au survol : `--grep 'all six scope|missing shared origin'` : **quatre retests dev et quatre statiques réussis**, [dev](ds-edit-38/development-hover-retest.json), [statique](ds-edit-38/static-hover-retest.json).
- [Sélection mobile](ds-edit-38/selected-shared-mobile.png), [desktop](ds-edit-38/selected-shared-desktop.png), [message desktop](ds-edit-38/missing-origin-desktop.png), [mobile](ds-edit-38/missing-origin-mobile.png) inspectés après correction : sélection et message lisibles.

Diagnostics conservés : première invocation Prettier depuis le lab ne trouvait pas node_modules, relancée depuis l’app ; premier test de message échouait au choix de propriété par valeur technique erronée (18 réussis/deux échecs), corrigé par sélection du libellé visible et valeur numérique sans unité dans le champ numérique. Retest intégral dev conforme. Pendant l’actualisation de l’aperçu, une dernière correction CSS après démarrage a déclenché le refus 503 du service protégé ; redémarrage après stabilisation, réponse snapshot **200** et panneau éditable, Génération chargée/#e32400/Enregistrer inactif confirmés dans le navigateur.

## Livraison et revues

Aperçu existant 54137 : absence de brouillon constatée avant copie ; seuls assisted.ts, ScopeControls.tsx et panel.module.css actualisés, [sources de valeurs conservées](ds-edit-38/preview-update.json), état privé non transféré. Redémarrage final effectué ; autres instances intactes.

Revues **séquentielles, même agent, non indépendantes**, procédures applicatives à la base citée. Design Reviewer : satisfaisant après correction du contraste au survol, sélection visible, alternatives accessibles et libellé stable ; le message générique demandé n’exprime pas toutes les causes, réserve explicitée ci-dessus. Technical Reviewer : satisfaisant sur origine hors geste courant, remplacement atomique, conservation de la saisie, refus transactionnels et corrélation des réponses tardives ; sauvegarde et contrats inchangés. Sécurité ciblée : aucun accès, service, permission, secret ou transport modifié ; les garde-fous serveur restent actifs et ont effectivement refusé l’empreinte périmée, sans contournement. Aucun audit global revendiqué.

Doc updated : guides panneau/assistance, fiche et suivi de fabrication. Modèles app non initialisés, préexistants conservés. Aucun push, publication ou appel fournisseur réel. Risque résiduel : autres navigateurs/OS et acceptation visuelle humaine non qualifiés ; après création d’intention, une dépendance par un autre geste peut légitimement refuser un remplacement incompatible, avec erreur et geste conservé. Reprise : recette humaine sur 54137 ; aucun chantier supplémentaire ouvert.
