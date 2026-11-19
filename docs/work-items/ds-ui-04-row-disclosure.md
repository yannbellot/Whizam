# DS-UI-04 — Toute la ligne de groupe interactive

15 novembre 2026 — Application, mandat de réalisation. Base `1b106c8`, branche codex/ui-lab-row-disclosure ; racine Git vérifiée, aucun changement suivi préexistant. Copies non suivies conservées.

Objectif : clic sur le libellé, les icônes ou l’espace restant d’une ligne de groupe pour déplier/replier. Conserver ordre, style, recherche et clavier. Les feuilles continuent à sélectionner leur scène.

Procédure implement-feature et revue design/technique à la version de base, séquentielles, même agent, non indépendantes. Solution minimale : étendre le Button React Aria existant de slot chevron à toute la largeur de contenu de la ligne ; aucune seconde gestion clavier, aucun gestionnaire de clic parent risquant un double basculement. Indentation conservée. Source : SceneNavigation.tsx uniquement, suivi associé. GPT-6.1 Sol · Moyenne recommandé.

Contrôles prévus : génération outil, lint/types et vérification réelle des clics label/espace/flèche, clavier et recherche sur la copie fictive DS-UI-03. Pas de données personnelles, de publication ou de remplacement d’une ancienne fenêtre.

## Résultat

**En revue — qualification technique acquise, acceptation humaine différée.** Doc updated. Aucun changement de tokens, d’ordre, d’icônes ou de données. Pas de publication. Version : commit de réalisation sur la base `1b106c8`.

Génération outil, ESLint et Prettier ciblés conformes ; typecheck de la copie autonome conforme. CUA navigateur 1280×800 : clic sur le texte Foundations → expanded=true ; clic au bord droit du bouton de 242 px → false, sans double basculement. ArrowRight/ArrowLeft → true/false. Recherche button default, sélection de Default et Échap conformes. Premier essai effectué sur l’ancien module servi : le diagnostic DOM a confirmé l’ancienne petite flèche ; les seuls services de la copie fictive ont été redémarrés, puis tous ces contrôles ont réussi sur le nouveau module.

Copie DS-UI-03 actualisée et fenêtre macOS rechargée : dépliage/repli de Foundations par activation de la cellule entière observés ; état final sans brouillon. [Capture native](../reviews/ds-ui-04-row-disclosure/navigation.png). Application et services 50749/50750 laissés ouverts. Aucune recompilation native nécessaire : changement React servi localement, contenant inchangé.

Revues design/technique séquentielles, même agent, non indépendantes : géométrie conservée, un seul bouton React Aria par groupe, gestion clavier native conservée, feuilles inchangées. Revue de portée sécurité : aucune nouvelle entrée ni permission, aucun contrôle métier modifié. Limite : pas de campagne VoiceOver. Prochaine action : retour humain sur la zone de clic, sans autre chantier ouvert.
