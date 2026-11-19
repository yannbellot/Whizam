# DS-EDIT-27 — Trois options de portée visibles

31 octobre 2026 — cible application, **En revue : qualification technique acquise, acceptation humaine différée**. [Fiche](../work-items/ds-edit-27-visible-scope-options.md), base `3c329f7`, branche `codex/appearance-scope-options`.

Les actions Appliquer au token partagé et Personnaliser uniquement ce réglage sont de nouveau visibles à côté de l’intention sémantique, y compris au chargement. Les trois choix sont regroupés dans une rangée compacte avec retour à la ligne. Les doublons de la question et du formulaire sont retirés. Rétablir la référence de base reste présent selon son état ; les deux commandes d’annulation supprimées dans DS-EDIT-26 restent absentes.

Les prérequis du moteur sont conservés : une portée partagé/local nécessite une modification ; le partage exige une référence effectivement sémantique et un inventaire compatible. Les boutons concernés restent inactifs avec aide lorsqu’ils ne s’appliquent pas. L’intention déjà en cours ne peut pas être réinitialisée par un second clic sur son entrée ; le choix local permet toujours de quitter ce formulaire. Pas de changement d’opération, de service, de compte, de permission, de valeur ou de dépendance.

## Preuves

macOS arm64, Node 24.22.0 et Chromium verrouillé existants ; aucune installation globale. Wrapper livré et PATH du processus utilisés.

- `npm run typecheck` : conforme.
- Vitest ciblé `editor-panel-render` et `assisted-session` : **15 réussis**.
- ESLint et Prettier des quatre fichiers code/tests modifiés : conformes ; diff sans erreur d’espacement.
- `npm run test:design-editor:dev -- --grep 'appearance layout|semantic edit always|visible scope options|Codex clarification'` : **8 réussis**, ordinateur/mobile. Visibilité initiale, activation après saisie, choix local/partagé, intention, clarification et reprise après échec couverts. Réponses Codex simulées, aucun appel réel.
- Même sélection avec `npm run test:design-editor` : **6 réussis**, deux exclusions conditionnelles attendues de clarification IA sans service. Build statique Storybook réussi.
- [Deux parcours de l’aperçu livré](ds-edit-27/qualification.json) : trois options visibles, anciennes annulations absentes, rétablissement et sauvegarde préparée conservés. Aucun enregistrement effectué.
- [Préservation de la recette](ds-edit-27/preview-preservation.json) : modèle/catalogue et 188 identités conservés, valeur #e32400 reprise depuis 54129 ; aucun compte, journal ou brouillon transféré. Empreinte de ScopeControls identique entre dépôt et aperçu.

Pas de test de persistance, récupération, PostgreSQL ou autre plateforme : moteurs inchangés. Limites : navigateur Chromium/macOS, brouillon volatile préexistant, pas d’inférence réelle ni acceptation humaine.

## Revues et reprise

Procédures applicatives à la base citée, **séquentiel, même agent, non indépendant**. Design Reviewer : satisfaisant par rapport aux trois options demandées ; captures relues, actions compactes visibles et retour à la ligne mobile. Technical Reviewer : satisfaisant, handlers existants conservés, garde de partage respectée, absence de doublons, formulaire/portée et aperçu contrôlés. Sécurité ciblée : pas de nouvelle surface d’accès ou entrée externe, protections serveur inchangées ; aucun scan général ni certification.

[Aperçu local corrigé](http://127.0.0.1:54130/?path=/story/components-button--default&addonPanel=adl/design-editor/panel), copie isolée `.local/ds-edit-27/preview`. Anciennes recettes et leurs états conservés. Prochaine action : recette visuelle humaine. **Doc updated.** Guide, fiche et suivi racine synchronisés ; modèles applicatifs et G/J5 inchangés. Aucun push/publication.
