# DS-EDIT-26 — Rétablissement unique

31 octobre 2026 — cible application, **En revue : qualification technique acquise, acceptation humaine différée**. [Fiche](../work-items/ds-edit-26-restore-only.md), base `d8efe81`, branche `codex/appearance-restore-only`.

Les boutons « Tout abandonner » et « Annuler les changements de ce réglage » sont supprimés du panneau. « Rétablir la référence de base » conserve sa condition d’affichage et son comportement : retour au style attribué ou à la base primitive, préparé dans le brouillon avant Enregistrer. Les fonctions internes d’abandon restent disponibles pour les usages internes ; aucun changement du moteur ni des opérations. Guide et attentes UI des tests synchronisés.

## Vérifications

macOS arm64, Node 24.22.0 existant, Chromium local verrouillé, sans installation globale ni inférence. Commandes exécutées avec le wrapper et le runtime compatible dans le PATH du processus.

- `npm run typecheck` : conforme.
- Vitest ciblé `editor-panel-render`, `editor-panels`, `assisted-session` : **16 réussis**.
- ESLint et Prettier des quatre fichiers code/tests modifiés : conformes ; diff sans erreur d’espacement.
- `npm run test:design-editor:dev -- --grep 'appearance layout|compares a draft|opens a typed panel|uses native keyboard|semantic edit always'` : **10 réussis**, ordinateur/mobile. Suppression des actions, référence restaurée, comparaison, saisie invalide, question de portée et clavier couverts.
- Même sélection avec `npm run test:design-editor` : **10 réussis**, build statique Storybook compris.
- [Deux parcours de recette](ds-edit-26/qualification.json) : boutons absents et rétablissement utilisable, référence restaurée à #1d4ed8 depuis la valeur enregistrée #e32400, puis Enregistrer actif. Aucun enregistrement effectué par la campagne.
- [Modèle et catalogue de recette conservés](ds-edit-26/preview-preservation.json) depuis 54128 : 188 identités, aucun état privé ni brouillon transféré.

Échecs diagnostiqués : le premier test remplaçait l’abandon par le rétablissement en conservant son attente de sauvegarde désactivée. Corrigé pour vérifier une opération à enregistrer en développement ; les dix retests passent. Le premier contrôle de recette supposait encore la couleur historique #b51a00 ; la recette a depuis enregistré #e32400. Scénario corrigé pour résoudre les valeurs dans son instantané effectivement copié, sans modifier ses sources ; deux retests réussis. Build applicatif, persistance, récupération et autres plateformes non répétés : aucun changement de leurs chemins.

## Revues et reprise

Mode **séquentiel, même agent, non indépendant**, procédures applicatives à la base citée. Design Reviewer : satisfaisant face à la demande explicite ; captures relues, seule l’action de référence demeure, Enregistrer en pied de panneau. Technical Reviewer : satisfaisant, suppression limitée au rendu et imports désormais inutiles ; conditions de désactivation et de rétablissement conservées, tests adaptés et contrôles conformes. Sécurité ciblée : aucune nouvelle entrée, permission, dépendance ou destination, services et protection des écritures inchangés ; pas de scan général ni certification.

[Aperçu local corrigé](http://127.0.0.1:54129/?path=/story/components-button--default&addonPanel=adl/design-editor/panel). Copie isolée `.local/ds-edit-26/preview`, empreinte du panneau contrôlée contre le dépôt. Ancien aperçu 54128 et ses brouillons/comptes préservés. Prochaine action : recette visuelle humaine de cette simplification. **Doc updated.** Modèles applicatifs et G/J5 inchangés ; aucun push/publication. Brouillon volatile et plateformes non testées : réserves préexistantes.
