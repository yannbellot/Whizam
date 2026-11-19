# DS-EDIT-22 — Conventions déclaratives centralisées

Cible application ; mandat du 31 octobre 2026. Base `9e57540`, branche `codex/ds-edit-22-declarative-naming`. Changements suivis initiaux absents ; copies non suivies et frontend préservés, hors périmètre.

Procédures applicatives normalize-design-system, implement-feature et technical-review sélectionnées à cette base qualifiée ; elles ne deviennent pas des skills du lab. Recommandation GPT-6.1 Sol · Élevée : raccordement YAML, schéma, génération et contrats dépendants, sans difficulté nécessitant un arrêt ni réglage client vérifié.

Objectif : naming.yaml détient syntaxe, structures, familles exécutées et correspondances lexicales. Le guide explique ; TypeScript conserve les algorithmes de canonicalisation. Dérivé JSON versionné, régénéré par tokens:generate et contrôlé contre le YAML par validate:design-system, pour fonctionner après extraction et sans parseur YAML dans le navigateur. Choix technique délégué : extension de la génération existante, pas de synchronisation parallèle. Les familles/modes conditionnels documentés restent conditionnels.

Critères : schéma fermé ; refus d’un dérivé périmé ; génération et validation utilisent les mêmes règles ; identités du modèle, valeurs, références et dérivés visuels inchangés ; tests négatifs, types et contrôles ciblés réussis. Aucun changement UI, donnée ou migration d’instance ; manifeste du service ajusté pour protéger les nouvelles dépendances en lecture seule. Suivi consolidé dans le lab, modèles applicatifs non initialisés.

Contrôles et revues : voir le [bilan](../reviews/ds-edit-22-declarative-naming.md). Statut : En revue — qualification technique acquise, acceptation humaine différée. Doc updated. Aucun push ou déploiement.
