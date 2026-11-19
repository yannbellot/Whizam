# DS-EDIT-28 — Actions et messages affinés

31 octobre 2026 — cible application. Base `90c5646`, branche `codex/appearance-action-refinements`. [Fiche](../work-items/ds-edit-28-action-refinements.md).

Le rétablissement est déplacé en pied de panneau, immédiatement à gauche d’Enregistrer ; ses protections !available/comparaison restent explicites après sortie du fieldset. Les récits de préparation réussie sont retirés. La consigne « Terminez l’analyse… » n’est plus affichée ni référencée par aria-describedby, mais le blocage effectif d’enregistrement reste actif. Les autres erreurs utiles sont conservées.

L’entrée d’intention est désactivée sans modification effective de valeur, en cas de valeur invalide ou d’analyse déjà ouverte. Comparaison avec la valeur de référence du réglage avant son geste, en tenant compte des autres choix du brouillon. Les trois options restent visibles. Moteur, sources YAML, données, services et permissions inchangés.

## Contrôles et limites

macOS arm64, Node 24.22.0 et Chromium verrouillé existants, wrapper livré et PATH du processus ; aucune installation globale. Types conformes, 15 unitaires ciblés `editor-panel-render`/`assisted-session` réussis. ESLint/Prettier des cinq fichiers code/tests affectés et diff conformes. Parcours sélectionnés : `appearance layout|semantic edit always|visible scope options|Codex clarification`, commandes test:design-editor:dev puis test:design-editor. **Huit parcours dev réussis puis six statiques réussis**, deux exclusions conditionnelles IA prévues en statique ; build Storybook conforme. Qualification technique acquise, En revue, acceptation humaine différée.

[Deux contrôles de recette](ds-edit-28/qualification.json) réussis aux formats 1280 et 390 : intention initialement inactive, rétablissement avant Enregistrer et fonctionnement conservé. [Modèle/catalogue](ds-edit-28/preview-preservation.json) identiques à 54130, 188 identités, valeur #e32400 ; aucun compte, journal ou brouillon transféré. Captures relues. Aucun enregistrement de recette ni appel réel à Codex ; réponses d’assistance simulées.

Diagnostics : première attente du texte « Intention préparée… » désormais retiré corrigée pour constater son absence, puis bouton Enregistrer actif et aperçu attendu. Une exécution simultanée dev/statique a provoqué des ENOENT de traces dans leur dossier d’artefacts commun ; les campagnes finales sont exécutées successivement. Aucun contournement ni changement de moteur. Persistance complète, récupération, autres navigateurs/OS et recette humaine non exécutés par cette tranche.

## Revues et reprise

Procédures applicatives à la base citée, **séquentiel, même agent, non indépendant**. Design Reviewer : satisfaisant face aux trois demandes explicites ; ordre des actions et états initiaux relus sur captures, erreurs utiles conservées. Technical Reviewer : satisfaisant, garde de valeur et désactivation explicites, blocage de sauvegarde indépendant de son message, absence de référence ARIA orpheline. Sécurité ciblée : aucune nouvelle entrée, permission ou destination, protections serveur inchangées ; pas de scan général ni certification.

[Aperçu local corrigé](http://127.0.0.1:54131/?path=/story/components-button--default&addonPanel=adl/design-editor/panel), copie isolée `.local/ds-edit-28/preview`. Anciennes recettes et états préservés. Prochaine action : recette visuelle humaine. Doc updated. Modèles app et G/J5 inchangés, aucune publication.
