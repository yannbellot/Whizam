# DS-UI-06 — Correction de la régression Framer

15 novembre 2026 — cible application, base `f3ea7b2`, version qualifiée `dca5fdb`, branche `codex/restore-framer-inspector`. [Fiche](../work-items/ds-ui-06-framer-regression.md). Qualification technique acquise, acceptation visuelle humaine différée.

## Résultat comparé à la référence

Références réellement relues : [Framer normalisé](ds-ui-03-framer-panels/framer-inspector-normalized.png), [inspecteur DS-UI-03](ds-ui-03-framer-panels/native-inspector.png). Le [rendu régressé](ds-ui-06-framer-regression/before-dark.png) empilait légende, libellé Valeur, champ, unité et attribution, avec des séparateurs à chaque niveau. La typographie occupait presque toute la hauteur de 800 px.

Le [rendu corrigé à 1280×800](ds-ui-06-framer-regression/inspector-dark-1280.png) retrouve libellés à gauche, champs à droite et groupes compacts. Valeur et unité partagent une ligne ; les couleurs associent pastille et saisie. Un séparateur par groupe remplace les séparateurs par champ. Les attributions et le contraste sont dépliables sous chaque groupe ; erreurs et valeurs restent directement visibles. Le sélecteur de police Type et son catalogue sont conservés. Pas de menu Propriété ni de choix de création/portée ajouté.

[1440×900](ds-ui-06-framer-regression/inspector-dark-1440.png), [thème clair](ds-ui-06-framer-regression/inspector-light-1280.png), [Foundations](ds-ui-06-framer-regression/foundations-dark-1440.png), [WKWebView](ds-ui-06-framer-regression/native.png). Les neuf champs par défaut restent affichés dans le même inspecteur avec défilement indépendant ; l’affichage simultané n’impose pas de les faire tenir sans défilement dans toute hauteur de fenêtre. Les états n’exposent que leurs champs préparés. Le cadre 280/16/16, les couleurs sombres et les sources des calques sont préservés. L’ajout de contours en clair réutilise la bordure outil existante : adaptation réversible pour distinguer des champs blancs sur un panneau blanc, sans nouvelle palette ni référence Framer claire inventée.

## Contrôles réellement exécutés

Sources suivies copiées dans des fixtures isolées sous `.local/ds-ui-06/framer-*`, sans données, compte, brouillon ou journal personnels. Builds exécutés hors du writer actif. Aucun token canonique ni backend modifié.

| Contrôle | Résultat |
| --- | --- |
| `generate-tokens.mjs`, `--check-docs`, `generate-loomata-ui.mjs --check`, `validate-design-system.mjs` | Conformes : 188 tokens de composants / 53 styles, références et consommateurs conservés |
| `react-router typegen`, `tsc -b`, lint ciblé et Prettier | Conformes sur les sources suivies ; copies suffixées préexistantes exclues de la fixture |
| Build React Router et Storybook | Conformes |
| 16 parcours desktop compilés | Conformes : champs, invalidité, contexte, unités, contraste déplié, navigation/clavier, brouillon, absence de writer |
| 9 parcours desktop de persistance | Conformes : sauvegarde/relecture, décision partagée conservant un réglage propre, rétablissement, conflit, réponse perdue, imports de polices refusés, création hors chat refusée |
| Géométrie dans Chromium | Quatre combinaisons 1280×800 / 1440×900 × clair/sombre, neuf champs par défaut, lignes et contrôles 30 px, radius 8 px, alignement, aucun débordement horizontal ou erreur de page ; [mesures](ds-ui-06-framer-regression/geometry.json) |
| AppKit / WKWebView instrumenté | Neuf champs ; contrôles affichés 30 px/radius 8 px ; [mesures](ds-ui-06-framer-regression/native.json). Fenêtre de test distincte fermée après capture, aucune action sur la fenêtre personnelle |
| Recette finale 54815 | HTTP 200 ; saisie invalide bloquant Enregistrer, dernier aperçu conservé, Échap conservant le brouillon, abandon restaurant la valeur, changement d’état puis retour et rechargement ; aucune sauvegarde de valeur dans cette copie |

Incidents conservés : première campagne de persistance interrompue après actualisation d’une source surveillée, protection du writer en 503 ; redémarrage normal, aucun verrou retiré. Une exécution parallèle des deux campagnes a partagé par erreur le dossier des traces Playwright : huit parcours de persistance ont passé et un a échoué à la clôture du contexte (artefact ENOENT). Reprise séquentielle : neuf sur neuf conformes. Une assertion exploratoire supposait plus de cinq champs au survol, alors que seuls certains sont préparés ; assertion corrigée au domaine réel, parcours de changement d’état réussi. Les journaux des essais restent locaux, sans effacer ces limites du bilan.

## Revues séquentielles, même agent, non indépendantes

**Design Reviewer : satisfaisant pour la restauration technique de la référence.** Deux lectures : comparaison au Framer réel/DS-UI-03, puis expérience desktop (lisibilité des sections, focus/clavier, saisie invalide, abandon, valeurs et attributions). Les détails ne cachent aucun champ modifiable. Menus natifs et contenu métier restent ceux de Loomata ; aucune reproduction intégrale de Framer ni acceptation humaine revendiquée. VoiceOver et utilisation humaine physique non exécutés.

**Technical Reviewer / QA : satisfaisant.** Déplacement du rendu des métadonnées sans changement de leurs setters ; corrélation binding/séquence/génération/clé d’aperçu conservée. Le retour à la charte est testé après modification partagée. Champs raw/conflits, dernier swatch valide et verrouillage de sauvegarde préservés. Les contrôles continuent d’utiliser leurs labels accessibles ; les légendes masquées le sont seulement visuellement. Tests existants adaptés au dépliage de l’attribution, sans suppression de scénario. Pas de changement de schéma, primitives, admission chat, recette de composant ou valeur de token.

**Sécurité : pas de nouvelle surface sensible constatée dans ce diff.** Relecture proportionnée : CSS/structure de rendu et sélecteurs de tests seulement, aucune permission, ressource externe, authentification ou écriture serveur changée. Ce constat ne remplace pas un audit de sécurité global.

## Reprise

Version corrigée sur une nouvelle copie fictive : `http://127.0.0.1:54815/ui-lab`, serveur détaché local. L’ancienne 54812 reste intacte. Recette humaine : comparer la densité à Framer, examiner les champs et déplier les attributions/contrastes. Création via chat et gestion des primitives restent les contrats DS-UI-06 déjà qualifiés ; aucun nouvel échange fournisseur réel n’est revendiqué ici. Aucun push, publication ou acceptation J5.

**Doc updated** : guide de l’inspecteur, suivi et preuve de correction ; rapport DS-UI-03 conservé comme historique. Risque résiduel : appréciation humaine de la densité et lisibilité des libellés longs sur deux lignes.
