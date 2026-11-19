# DS-UI-06 — Restaurer la présentation Framer

15 novembre 2026 — cible **application**, correction demandée après la recette DS-UI-06. **En revue — qualification technique acquise, acceptation humaine différée.** [Résultat et preuves](../reviews/ds-ui-06-framer-regression.md).

## Mandat et état initial

Restaurer les acquis visuels DS-UI-03/05 dans le nouvel inspecteur complet : lignes compactes, libellé à gauche et contrôle à droite, contrôles 30 px/radius 8 px, un séparateur par section. Conserver Foundations, Intentions/Conventions, tous les champs du contexte, création par chat et primitives automatiques. Aucune modification des calques, valeurs de tokens, services métier ou sources personnelles.

Préflight : racine Git `/Users/yannbellot/Documents/GitHub/loomata`, base `f3ea7b2e21b7e73f536bb03e519a24faea0b50a1`, branche `codex/restore-framer-inspector`. Aucun changement suivi préexistant ; copies non suivies préservées. La recette 54812 est consultée sans écriture ; correction et parcours sur une nouvelle copie isolée.

## Diagnostic et solution minimale

Observation : DS-UI-06 a reconstruit les fieldsets sans les lignes de contexte DS-UI-03 et a appliqué les espacements/séparateurs à chaque champ et aux sections imbriquées. À 1280×800, la typographie occupe presque tout l’inspecteur ; couleurs et bordures sont sous le défilement.

Réutiliser les tokens outil existants et le select natif habillé. Regrouper valeur/unité sur une ligne. Garder les informations d’attribution et de contraste dans un détail par section, fermé par défaut ; les erreurs restent visibles auprès du champ. Cette présentation réversible reprend l’attribution dépliable de DS-UI-03, sans masquer de champ modifiable. La palette et les panneaux 280/16/16 restent ceux de DS-UI-02/03.

Fichiers applicatifs : `src/ui-lab/editor/TokenInspector.tsx`, `src/loomata-ui/styles/editor.css` ; éventuellement le contrôle partagé si nécessaire. Suivi de fabrication dans les documents racine ; modèles app inchangés.

## Procédures et qualification prévues

Procédures app `implement-feature`, `design-interactions`, `review-design`, `technical-review`, version qualifiée `f3ea7b2`, catalogue explicitement consulté. Rôles séquentiels, même agent, non indépendants. Revue sécurité proportionnée : aucun changement d’accès, de serveur ou d’entrée externe ; lecture du diff seulement.

Critères : références Framer et DS-UI-03 comparées au rendu ; champs du contexte tous présents sans menu Propriété ; géométrie 30/8, alignement et absence de débordement à 1280×800 et 1440×900 ; variantes/états, saisie invalide, abandon, sauvegarde/relecture, édition partagée et retour à la charte préservés. Types, génération, lint ciblé, build et parcours sur copie isolée. Captures sombres et claires ; contrôle natif si disponible.

Configuration recommandée : **GPT-6.1 Sol · Élevée**, restauration des contrôles partagés et des interactions du nouvel inspecteur. Le réglage du client n’est pas vérifiable ; aucun changement automatique de configuration.

## Bilan et point de reprise

Acquis : lignes 30 px/radius 8 px, valeurs/unités regroupées, couleurs compactes, contexte aligné, un séparateur par groupe. Attributions et contraste dépliables ; erreurs visibles, champs et choix de police préservés. L’inspecteur Foundations utilise le même habillage ; pas de réécriture de la grille ni de changement des règles de création/primitives.

Contrôles : types, lint/format, génération/autorités, builds app/Storybook, 16 parcours compilés et neuf persistants conformes ; deux formats desktop et deux thèmes mesurés, rendu WKWebView observé. Campagnes finales séparées après les incidents de fixture documentés dans la preuve. Sources des calques et valeurs DTCG inchangées. Doc updated ; modèles de suivi app non initialisés et copies locales préexistantes préservés.

Prochaine action : recette visuelle humaine sur la nouvelle copie fictive 54815, processus détaché ; aucun brouillon ni enregistrement supplémentaire dans cette copie. Ancienne recette 54812 et fenêtre personnelle conservées. Les serveurs de qualification 54813/54814 sont arrêtés après les preuves. Aucun push ou service distant. Risque résiduel : appréciation de densité et libellés longs sur deux lignes, recette physique/VoiceOver non réalisée. Le chat fournisseur réel reste la réserve antérieure DS-UI-06.

Version de réalisation qualifiée : `dca5fdb80f50ff5969a305307518e0545389d915`. [Empreintes et contrôles](../reviews/ds-ui-06-framer-regression/qualification.json).
