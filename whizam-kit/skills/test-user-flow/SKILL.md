---
name: test-user-flow
description: 'Vérifier un parcours dans l’application réelle et ses effets, avec données isolées et preuves de persistance lorsque pertinentes ; ne pas remplacer cela par une story.'
---

# test-user-flow

Entrées : critères, version servie, environnements/outils disponibles et données synthétiques. Lire docs/agents/skill-contract.md et docs/operations.md pour la campagne concernée.

## Travail

Pour une première version, vérifier les critères de la [revue conjointe](../../docs/product/project-start.md#4-revue-de-la-première-version) : URL applicative vers le vrai projet, pages/parcours convenus, entrée Storybook vers les composants utilisés et états pertinents, absence de démonstration livrée comme résultat. Des URL répondant correctement sans ce contenu ne suffisent pas.

Appliquer le [protocole commun](../../docs/agents/user-decisions.md) et le mode choisi pour la couverture validée. En Manuel, fournir la recette et attendre le retour explicite de l’utilisateur ; ne pas présenter ce parcours comme exécuté par l’IA. En E2E, adapter et exécuter les scénarios convenus ; en Combiné, séparer ces résultats de la recette humaine. Réutiliser le mode pour les retests du même périmètre.

Selon le mode retenu, faire vérifier manuellement ou exécuter automatiquement le parcours positif et les refus/erreurs pertinents, pas seulement la capture finale. Identifier navigateur/formats, saisies/actions et résultats observés. Distinguer composant, serveur et base ; pour une écriture, relire après chargement et redémarrage si demandé. Utiliser les runners propriétaires de leurs ressources ; ne jamais pointer un test sur une base existante par commodité.

## Sortie et contrôle

Recueillir le [retour de recette](../../docs/agents/user-decisions.md#retour-de-recette-manuelle) en Manuel/Combiné et laisser la recette en attente sans réponse. Un E2E réussi ne vaut pas acceptation humaine ; une recette validée ne masque pas un contrôle automatisé en échec.

Rapport versionné avec commandes/scénarios, PASS/FAIL/non exécuté, preuves expurgées et limites. Vérifier nettoyage par identité et conserver l’échec initial puis le retest. Un outil indisponible ne produit pas de capture inventée ; préparer la recette manquante et poursuivre les vérifications indépendantes. Les tests agents ne valent pas recette humaine ni reprise par un tiers.
