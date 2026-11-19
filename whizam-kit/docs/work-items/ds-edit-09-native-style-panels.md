# DS-EDIT-09 — Onglets natifs Apparence et Styles

30 octobre 2026 — cible application, **En revue : contrôles hors E2E conformes, livraison locale effectuée, recette et acceptation humaines en attente**. Suite autorisée de DS-EDIT-08 ; [décision humaine 013](../decisions/013-appearance-and-styles-panels.md). Statut de fabrication consolidé dans la roadmap racine ; modèles applicatifs non initialisés.

## Mandat et préflight

Deux onglets Storybook natifs Apparence et Styles ; quatre actions et réglages accessibles depuis Apparence ; Styles comme entrée directe vers les mêmes créations/valeurs partagées. Tests techniques hors E2E et mise à jour du Storybook habituel 54086, avec préservation des styles, reçus et brouillon humain. Aucun test navigateur, fournisseur, publication ou déploiement distant.

Racine Git canonique vérifiée ; base `656eaa6c4e7773115a6441dc3bacdf013866fae2`, branche initiale main sans diff suivi, 50 entrées non suivies préexistantes (copies suffixées et frontend) hors périmètre. Branche `codex/native-style-panels`. Catalogue de l’app consulté ; procédures plan-feature/design-interactions/implement-feature puis review-design/technical-review/security-review à la version de base. Même agent séquentiel, non indépendant ; aucune délégation.

## Solution minimale et critères

1. Enregistrer deux panneaux natifs depuis manager.tsx ; conserver l’identité de l’ancien panneau pour Apparence afin que les accès existants restent utilisables, ajouter une identité distincte pour Styles. Supprimer la navigation interne redondante.
2. Une seule instance active du pont d’aperçu ; conserver le brouillon lors du remontage natif et ne pas effacer la projection au passage entre les deux panneaux. Suspendre l’aperçu en quittant ces espaces comme auparavant. L’acquittement de contraste reste lié à la génération et aux opérations.
3. Apparence : quatre actions réellement disponibles, réglages spécifiques, attribution et contraste lisibles. Réutilisation retire l’exception ; création et attribution sont préparées ensemble, sans deuxième bouton ; exception et restauration restent locales ; édition partagée affiche usages/impact et conserve les exceptions.
4. Styles : création sans attribution, consultation sans changement de binding, recherche/sélection propres, retour possible vers Apparence. Même formulaire de création et mêmes champs partagés que dans Apparence ; erreurs et valeurs conservées entre entrées. Une seule création en préparation, contexte verrouillé si elle est destinée à un composant.
5. Enregistrer porte sur le brouillon complet et maintient ses blocages. Création du style avant son attribution, unicité et validation existantes conservées ; aucun nouveau discriminant, endpoint, schéma serveur, matrice ou valeur de référence.
6. Types, lint, formatage, unitaires/contrats, tests serveur proportionnés et builds conformes. Adapter les sources E2E directement touchées sans les exécuter. Les interactions, le rendu desktop/mobile et la recette humaine restent explicitement non vérifiés.
7. Avant mise à jour locale, contrôler absence de brouillon/requête en cours, identité des propriétaires, sources et reçus. Respecter le changement de version documenté : ancienne racine conservée si une nouvelle est nécessaire ; aucune copie de journal ou purge pour forcer un démarrage. Même racine pour Storybook et UI Lab associé.

## Surfaces, preuves et limites

Fichiers pressentis : `.storybook/manager.tsx`, `editor/Panel.tsx`, `SemanticStyles.tsx`, `session.ts`, définitions communes de panneaux si nécessaires et manifeste fermé ; tests unitaires de session/enregistrement des panneaux, sources des parcours et runners dont les intitulés changent ; guides, spécification, décisions et suivi. Aucun dérivé de tokens édité à la main ni changement des huit autorités de valeurs enregistrées.

Contrôles depuis une copie privée : npm test ; npm run test:design-system ; npm run typecheck/lint/format:check ; npm run docs:design-system:check ; npm run build/build-storybook. Tests store/HTTP ciblés si nécessaire au chemin de création/attribution, sans recette E2E. Ne lancer aucun runner navigateur, même pour la récupération/live/Storybook. Journaux de chantier sous `.local/ds-edit-09/`, ignorés.

Revues prévues : design (navigation/portées et cohérence des deux entrées, limites sans rendu testé), technique (ordre des opérations, remount/aperçu, erreurs et annulation), sécurité (maintien des validations et frontières, aucun accès nouveau). Aucun contrôle d’instructions/distribution : procédures d’agents et paquet non modifiés. Doc updated.

Choix délégué : réutiliser les formulaires et opérations, pas deux implémentations métier. Recommandation GPT-6.1 Sol · Élevée : résultat clair et localisé, mais contrats de session/sélection/aperçu liés au montage des panneaux et à l’attribution automatique en brouillon ; aucune hausse supplémentaire justifiée. Réglage effectif du client non vérifié ni changé. Dépendances techniques de DS-EDIT-08 acquises pour les contrôles cités ; absence d’E2E antérieure reste visible et ne devient pas un succès actuel.

Séquence autorisée : implémentation, contrôles hors navigateur, revues et mise à jour locale ; réalisée selon le bilan ci-dessous, sans ouvrir de chantier supplémentaire.

## Résultat et livraison

Implémentation et contrôles techniques réalisés : [bilan et trois revues](../reviews/ds-edit-09-native-style-panels.md). 88 unitaires, 47 contractuels, trois serveur ciblés ; types/lint/formatage/docs/builds conformes, sources E2E adaptées sans exécution. Deux panneaux natifs, quatre actions et même formulaire de création/édition partagée, aucun changement serveur ou de valeur de référence.

Candidat source `c8be528` intégré localement dans main. Copie de livraison avec huit sources enregistrées identiques ; Mac déverrouillé par le porteur, brouillon vide constaté avant bascule. Storybook habituel 54086 et UI Lab associé 54085 actualisés sur une racine commune ; anciennes racines et reçus préservés, aucun journal transporté. Apparence et Styles observés comme vrais onglets natifs après rechargement de livraison, service prêt et #5e30eb retrouvée. Aucune interaction de recette ni sauvegarde humaine. Prochaine action : vérification du porteur sur ces accès ; pas de nouvel E2E ou chantier implicite. **Doc updated.**
