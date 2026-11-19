# UI-LAB-02 — Colonnes fixes et habillage proche de Storybook

11 novembre 2026 — application, mandat de réalisation explicite ; base `8bd50c9`, branche `codex/ui-lab-storybook-style`. Aucun changement suivi initial ; préexistants non suivis conservés.

## Préparation

Colonnes gauche/droite de 260 px sur desktop ; centre flexible sans débordement. Préparation initiale : disposition mobile empilée conservée. Le mandat documentaire UI-DESKTOP-01 arrivé en cours de réalisation retire ensuite le mobile des cibles prises en charge ; aucune nouvelle adaptation mobile n’est ajoutée après cette décision. Habillage des panneaux d’outillage rapproché de Storybook installé : typographie compacte, neutres, sélection bleue, groupes et icônes dossier/composant/document/exemple. Préserver les composants et valeurs du produit dans l’iframe, la sauvegarde, les menus et les brouillons.

Référence : capture Storybook du même dépôt, `test-results/loomata/run-1RPyoV/storybook-native.png`, et thème de la version installée dans node_modules/storybook ; clair/sombre selon préférence système comme Storybook. Hypothèse réversible : reprendre ces conventions sans modifier la composition fonctionnelle des réglages, ni ajouter une dépendance Storybook au runtime. Police système de repli si Nunito Sans n’est pas disponible, sans téléchargement de police.

Procédures applicatives du catalogue : implement-feature, design-interactions, review-design, technical-review, version au HEAD cité. Modification du produit existant, sans nouvelle exploration de prototype. Modèle conseillé GPT-6.1 Sol · Moyenne ; aucun réglage changé. Revues séquentielles, même agent, non indépendantes.

Périmètre : autorités JSON DTCG et recettes YAML d’outillage, CSS des trois panneaux, navigation et icônes locales, tests/inventaires/docs affectés ; suivi consolidé à la racine du lab. Aucun compte, fournisseur, service distant, installation globale ou publication. Critères : deux côtés mesurés à 260 px à plusieurs largeurs desktop, centre extensible, mobile préservé, rendu clair/sombre comparé, navigation et défilement/clavier opérationnels. Contrôles : génération/DS/types/lint, navigateur puis parcours natif dans copies isolées ; nouveau bundle source distinct, sans fermer l’ancien.

## Résultat

**En revue — qualification technique acquise, acceptation humaine différée. Doc updated.**

## Réalisation

Recette de grille `260px minmax(0px, 1fr) 260px` dans l’autorité YAML, dimension DTCG locale de 260 px ; la media query mobile conserve la grille sur une colonne. Habillage raccordé aux tokens de composition : 13 px, pile Nunito Sans / système, marges et séparateurs compacts, catégories en capitales espacées, sélection bleue, neutres clair/sombre. Le thème suit `prefers-color-scheme` dans le seul cadre de l’atelier, sans changer les valeurs, modes ou rendus du produit dans l’iframe. 23 nouveaux tokens de composition hors matrice éditable et primitives associées ; 137 tokens de composition au total, 188 réglages du produit conservés. Les anciennes primitives/décisions restent disponibles pour l’historique ; pas de conversion des reçus.

Six SVG adaptés des icônes locales @storybook/icons (composant, dossier, document, exemple et deux chevrons), sans dépendance ajoutée au runtime ; licence MIT conservée dans `src/ui-lab/editor/storybook-icons.LICENSE.md`. Les icônes sont décoratives, les noms accessibles des contrôles et les disclosures natifs restent présents. Le manifeste et la sélection des sources livrables incluent les deux nouveaux fichiers.

Référence lue : thème de Storybook installé (`dist/_browser-chunks/chunk-GLOGC42D.js`) et capture de la même version dans ce dépôt. Rendu UI Lab comparé en clair/sombre dans Chromium. Police système de repli effective si Nunito Sans absente : similarité de conventions, aucune identité pixel par pixel revendiquée. Correction de lisibilité du badge de contraste en sombre après inspection des captures, sans toucher aux mesures de contraste du composant.

## Contrôles exécutés

- Génération et contrôle documentaire : PASS. Deux refus initiaux du générateur (owner manquant puis sélecteur avec guillemets différents du CSS) corrigés dans les métadonnées, aucune protection retirée.
- `npm run test:design-system` : 114 PASS sur le nouveau thème ; après la seule correction de couleur du badge et passage à 137 tokens, neuf tests ciblés composition/politique PASS et génération conforme.
- Typegen Router et TypeScript via `.local/tsconfig.column-scroll.json` : PASS. Exclusion diagnostique des copies non suivies ` 2` inchangée depuis UI-MAC-01 ; contrôle brut limité par leurs imports historiques absents. ESLint/Prettier ciblés : PASS.
- Première campagne navigateur : 12 parcours existants PASS ; deux nouveaux tests en échec car ils ciblaient une icône située dans un groupe fermé. Sélecteur corrigé vers l’exemple actif ; deux tests ciblés PASS, mesures desktop à 860/1280/1440 px, mobile 390 px et thèmes clair/sombre. Le défilement de page est absent. Captures avant correction du badge dans `test-results/ui-lab-keeps-260px-sidebar-d3f75-me-in-light-and-dark-themes-{desktop,mobile}/`.
- Relance complète finale expirée avant le premier résultat (ETIMEDOUT du runner après 120 s). Deux processus Chromium orphelins identifiés par leur profil privé `e2e-KIo5JI`, arrêtés par PID, aucune fenêtre humaine affectée. Cause du blocage de démarrage non établie. Après la décision desktop uniquement : `npm run test:e2e -- --project desktop --output test-results/ui-lab-02-desktop-final` : **7 PASS** sur la version finale du badge ; rendu clair/sombre, largeur 260 px à 860/1280/1440 px, clavier/parcours existants et sauvegarde consultative contrôlés. Captures finales dans ce dossier, rapport `test-results/report.json`. Pas de nouvelle campagne mobile après décision ; les preuves précédentes restent historiques.
- `npm run test:loomata` : 15 scénarios PASS, AppKit et vrais WKWebView, `test-results/loomata/run-1Vy0ky/native.json`. Deux colonnes réellement mesurées à 260 px dans l’app, menu du compte, navigation et brouillons conservés, sauvegarde/propagation Storybook, redémarrage et refus de navigation vérifiés. La fixture inclut bien le token final de texte du badge et ses trois CSS finaux ; son JSON diffère ensuite normalement par la sauvegarde synthétique du test.
- Bundle normal `.runtime.local/ui-lab-02/Loomata.app` construit, signature ad hoc vérifiée strictement ; `candidate.json` adjacent. Code natif identique à UI-MAC-02, sources web courantes du dépôt, runtime local ; distribution autonome E non remplacée. SDK 27 incompatible puis repli prévu sur SDK 26.5 installé, sans installation. Ancienne fenêtre et descripteur latest conservés.

## Revue et reprise

Revues design/technique/sécurité ciblée séquentielles, même agent, non indépendantes. Design : conventions et hiérarchie rapprochées de la référence, tests de tailles et mobile, badge corrigé. Technique : autorités et consommateurs raccordés, cadre uniquement, styles/valeurs du produit inchangés ; copie autonome du pilote natif opérationnelle. Sécurité : aucune entrée externe, permission ou connexion ajoutée ; icônes statiques locales, refus existants testés. Pas d’audit complet ni d’acceptation humaine déduits. Aucun compte, inférence, installation globale ou publication.

Fichiers : autorités JSON/YAML, trois CSS UI Lab, navigation et SVG/licence, manifestes, contrôles UI/DS/natifs et documentation directement affectée ; suivi dans la roadmap/état du lab. Préexistants préservés. Limites : polices de repli, autres navigateurs et OS non qualifiés, recette visuelle humaine à réaliser. Reprise : ouvrir le bundle local après conservation des brouillons et recueillir le retour desktop sur les panneaux de 260 px. Appliquer la décision 032 aux interventions suivantes ; les styles mobiles déjà présents restent hors engagement de support.
