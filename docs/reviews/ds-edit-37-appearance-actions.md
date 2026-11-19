# DS-EDIT-37 — Actions et rétablissement

1 novembre 2026 — application, base 0664d522, branche codex/appearance-restore-controls. En revue, qualification technique acquise, acceptation humaine différée. [Fiche](../work-items/ds-edit-37-appearance-actions.md).

## Résultat et logique observée

Marge verticale de comparaison : 16px en haut et en bas. Suppression de la question générique sur le token et des mentions de portée locale/partagée ; informations d’attribution et de valeur, erreurs et raisons de blocage conservées. Rétablir toujours présent : désactivé sans geste ni référence propre, actif pour les gestes partagé/local/intention, verrouillé en comparaison ou contexte indisponible. Le geste est annulé avant calcul de la référence à restaurer, ce qui permet d’annuler un changement partagé non enregistré sans créer un faux changement local. Si l’annulation échoue parce qu’un autre geste en dépend, aucune restauration supplémentaire ne part. Les autres gestes restent préservés.

| Situation, contexte éditable | Partagé | Intention | Local |
|---|---|---|---|
| Aucun geste | inactif | inactif | inactif |
| Valeur sémantique modifiée valide, usages complets/compatibles | actif | actif | actif |
| Choix partagé confirmé | inactif | actif | actif |
| Choix local confirmé | inactif | actif | actif |
| Définition/analyse d’intention | inactif | inactif | actif |
| Comparaison ou verrou de contexte | inactif | inactif | inactif |

Les trois choix sont inchangés dans ce mandat. Réserve UX observée : aucun état sélectionné visible, local reste actif après son choix, partagé ne peut être rechoisi après local sans nouvelle saisie/retour initial. Le bouton intention change encore de libellé selon la phase. Ces observations servent au prochain arbitrage éventuel ; aucune refonte implicite. Un réglage avec référence propre déjà enregistrée peut être rétabli même sans nouveau geste. L’interprétation IA reste une action séparée ; aucun appel réel ici.

## Contrôles et limites

- Types : `npm run typecheck` échoue dans le clone à cause de SemanticStyles.tsx non suivi préexistant (exports/propriétés obsolètes). Fichier conservé intact. Réussite dans `.local/ds-edit-37/check` : sources suivies à HEAD + seuls quatre fichiers corrigés, dépendances locales reliées, génération puis typegen/tsc ; aucun fichier retiré du clone. Retest final typegen/tsc réussi après retrait d’une constante devenue inutilisée.
- ESLint et Prettier sur Panel, ScopeControls, CSS et tests : conformes. Premier lint a détecté la constante inutilisée, corrigée. Une invocation ESLint depuis la racine lab n’a pas trouvé la configuration app ; relancée depuis l’app, conforme.
- `vitest run --config config/testing/vitest.config.ts tests/unit/assisted-session.test.ts` : 12 tests réussis.
- `node scripts/test-design-editor.mjs --development assisted.spec.ts --grep 'restore remains|visible scope|semantic edit always'` : 10 parcours réussis, [résumé dev](ds-edit-37/development.json).
- Même commande sans --development : build statique conforme, 10 parcours réussis, [résumé statique](ds-edit-37/static.json). Desktop 1280×800, mobile 390×844, Chromium local. Cinq scénarios dans chaque format/mode : choix explicite, partage, trois restaurations, comparaison, absence d’écriture sauvegarde/IA.
- [Capture desktop](ds-edit-37/shared-desktop.png), [mobile](ds-edit-37/shared-mobile.png) inspectées : bouton présent après partage, espacement visible, pas de messages génériques. Statique : indisponibilité d’enregistrement attendue.
- Aperçu existant 54137 actualisé sur constat Génération chargée/Enregistrer inactif ; uniquement trois fichiers de panneau copiés puis serveur redémarré. [Empreinte de préservation](ds-edit-37/preview-update.json) : autorités identiques, aucun transfert d’état privé.

Revues applicatives **séquentiel, même agent, non indépendant** : Design Reviewer satisfaisant sur espacement, présence des commandes, labels et état inactif ; réserve sur sélection des trois choix documentée. Technical Reviewer satisfaisant sur annulation avant restauration, protection d’échec, absence de mutation des autres gestes, types et parcours ciblés. Sécurité ciblée : aucune modification des services, accès, permissions, sauvegarde, connexion ou entrées externes ; aucune nouvelle surface à qualifier, pas de scan global revendiqué.

Doc updated. Modèles app et préexistants conservés. Aucun push/publication. Reprise : recette humaine sur l’aperçu, analyse UX des trois choix disponible ci-dessus ; aucun chantier supplémentaire ouvert. Autres navigateurs/OS non vérifiés.
