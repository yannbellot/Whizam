# DS-EDIT-72 — Revue du menu UI Lab

5 novembre 2026. Cible application ; base 1698b628, branche codex/ds-edit-72-workshop-navigation. Empreinte SHA-256 du lot source/test : `c0b0480ecfd997cd18555c4a61899a73fa96f9759ccce9d1638c6c5328f0a7a4`. [Mandat et périmètre](../work-items/ds-edit-72-workshop-navigation.md). Revues design puis technique par le même agent, séquentielles, non indépendantes.

## Résultat

Liste déroulante remplacée par un menu hiérarchisé : Fondations, Composants, Références ; sept groupes et leurs scènes existantes. Recherche multi-mots insensible à la casse et aux accents, absence de résultat annoncée et effacement au clavier ou au bouton. Sélection marquée visuellement et par aria-current. Rubriques natives details/summary pilotées au clic pour éviter une course des événements toggle ; activation Entrée/Espace et focus conservés. Ouvertures maintenues entre sélections ; ouverture du groupe courant sur un lien d’usage et retour au réglage. Aucun rechargement de page ni abandon du brouillon lors de la sélection.

## Contrôles exécutés

Sur copie source isolée `.local/ds-edit-72/test` excluant les doublons non suivis. Node 24.22.0 local déjà disponible, npm 11.8.0 ; aucune installation. Le lanceur initial a signalé Node hôte 24.13.1 incompatible : utilisation explicite du runtime local compatible. Premier essai navigateur bloqué par EPERM loopback, relancé avec autorisation locale sans modifier de protection.

| Commande dans la copie | Résultat et preuve locale |
| --- | --- |
| npm run tokens:generate | Réussite ; 188 réglages produit et 17 styles source conservés, 14 tokens d’habillage ajoutés ; 147 tokens de composition. |
| npm run test:design-system | 82 réussis après actualisation du décompte attendu 133 → 147 ; design-system-retest.log. |
| npm run typecheck | Réussite sur le code final ; types-qualified.log. |
| npm run lint | Réussite sur le code final ; lint-qualified.log. |
| npm run test:design-editor | Première version : 24/24. Après préservation des ouvertures/focus : 23/24, course details/toggle mobile identifiée puis corrigée. Dernier lot complet : 23/24, filtre corrigé ; nouveau scénario mobile trop précoce avant disponibilité de l’aperçu, saisie ignorée et bouton inactif. workshop-final.log et workshop-qualified.log conservent les échecs. |
| npm run test:design-editor -- --grep 'sidebar groups' --repeat-each 2 | Quatre réussites desktop/mobile sur code final ; navigation-retest.log. Attente explicite de data-preview-ready avant la saisie, puis vérification de sa valeur. Les 22 autres parcours de la dernière campagne complète restent réussis. Build compilé réussi dans chaque campagne. |
| git diff --check | Réussite avant livraison. |

Les avertissements de génération de chunk health et annotation Zod sont sans échec de build. Le 404 volontaire de l’endpoint d’écriture du runtime compilé est attendu et vérifié.

## Revue design

[Desktop 1280](ds-edit-72/navigation-desktop.png), [mobile 390](ds-edit-72/navigation-mobile.png) inspectés. Hiérarchie, indentation, contraste de sélection et absence de débordement horizontal contrôlés ; mobile conserve une liste empilée avec défilement interne borné. Référence : organisation des exemples et variantes des stories existantes, sans reproduction de toutes les fonctions du manager Storybook. Hypothèse visuelle réversible, pas d’acceptation humaine implicite. Safari sur la recette 54143 : menu affiché, Field déplié, Button toujours ouvert, génération chargée et aucune modification en brouillon ; valeur enregistrée #0050c9 visible. Aucune saisie/sauvegarde humaine effectuée.

## Revue technique et sécurité ciblée

Chaque groupe filtre les scènes déjà préparées ; callbacks changeScene et verrouillage existants réutilisés, retour depuis les usages et conservation du brouillon qualifiés. CSS via tokens de composition et références existantes compatibles ; une primitive de fond de sélection propre à l’habillage, aucune modification de valeur produit. Manifeste v24 couvre les deux nouveaux fichiers. Source produit/assistance/sauvegarde, dépendances et permissions inchangées. Recherche locale uniquement, texte rendu par React, aucune entrée externe ou nouvelle surface sensible ; revue de sécurité spécialisée non déclenchée. Aucun findings bloquant après corrections. Nouvelle campagne de sauvegarde interrompue et build Storybook non exécutés : chemins inchangés par cette navigation.

## Recette et reprise

[UI Lab](http://127.0.0.1:54143/ui-lab), nouvelle racine `.local/ds-edit-72/recipe`. Sources de valeurs lues sous barrière compatible depuis DS-EDIT-71, sans comptes/journaux/reçus transférés. Modèle généré strictement égal : 188 bindings et 18 styles enregistrés. Anciennes recettes 54141 et 54142 préservées. Processus dans `.local/ds-edit-72/processes.json`. Risque résiduel : direction visuelle et comportement mobile à accepter humainement ; aucune indépendance de revue ni conformité d’accessibilité exhaustive revendiquée. En revue, qualification technique acquise, acceptation humaine différée. Doc updated ; aucune publication. Prochaine action : recette du menu par le designer.
