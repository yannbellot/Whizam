# DS-EDIT-41 — État initial de comparaison

1 novembre 2026 — application, base 83295ef, branche codex/disable-empty-comparison. En revue, qualification technique acquise, acceptation humaine différée. [Fiche](../work-items/ds-edit-41-empty-comparison.md).

Le contrôle reste visible, décoché et désactivé sans opération préparée ; le label suit la couleur atténuée du thème avec opacité 0,65 et curseur inactif. Après une modification valide il redevient disponible. Un effet retire le mode comparaison si le brouillon devient vide. Les autres verrous restent conservés. Interprétation explicite du mandat : visible mais inactif, sans masquage du contrôle.

ESLint ciblé et Prettier conformes. Typecheck conforme dans `.local/ds-edit-41/check`, archive des sources suivies + correctif, dépendances locales reliées ; le préexistant non suivi SemanticStyles.tsx incompatible reste intact dans le clone, sans revendication de types globaux conformes. `node scripts/test-design-editor.mjs --development assisted.spec.ts --grep 'restore remains'` : six parcours réussis ; même commande sans --development : six réussis et build statique conforme. [Dev](ds-edit-41/development.json), [statique](ds-edit-41/static.json). Trois choix, comparaison et restauration vérifiés sur desktop/mobile, sans sauvegarde ou inférence. Test de présentation initiale adapté à la nouvelle règle ; pas de nouvelle logique de données ni de contrôle serveur requis.

[Desktop](ds-edit-41/empty-desktop.png) et [mobile](ds-edit-41/empty-mobile.png) : contrôle inactif après retour à zéro. Revues applicatives séquentielles, même agent, non indépendantes : design satisfaisant pour état natif grisé et label, technique satisfaisant pour garde sur opérations et remise à zéro ; sécurité ciblée sans nouvelle surface d’accès ni changement de service. Autres navigateurs/OS et acceptation visuelle humaine non vérifiés.

Aperçu 54137 actualisé après constat Génération chargée/Enregistrer inactif ; [sources de valeurs inchangées](ds-edit-41/preview-update.json), compte et configuration préservés. Doc updated. Préexistants, modèles app et G/J5 inchangés, aucune publication. Reprise : recette humaine du contrôle.
