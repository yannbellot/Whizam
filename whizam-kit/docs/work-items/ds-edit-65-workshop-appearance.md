# DS-EDIT-65 — Apparence dans l’atelier UI Lab

## Mandat et référence

Cible application, base 5cabb45, branche `codex/ds-edit-65-workshop-appearance`. Reprendre les éléments d’interface et contenus de l’onglet Apparence de Storybook 34e0aec dans les réglages de UI Lab, adaptés à son habillage. Référence réellement accessible : ancienne recette `.local/ds-edit-52/preview`, panneau ouvert et vérifié ; ses sources qualifiées sont conservées dans Git. Ne pas modifier cette instance ni rétablir une dépendance Storybook dans UI Lab. Aucun déploiement ou compte IA réel.

Procédures applicatives implement-feature/design-interactions/test-user-flow/review-design/technical-review à la base du chantier. Builder puis revues séquentielles, même agent, non indépendantes. Catalogue applicatif consulté. Recommandation Sol · Élevée : restitution de plusieurs interactions et états d’un éditeur existant, canaux/écriture conservés ; aucune difficulté justifiant un changement de configuration observée.

## Périmètre et critères

- Sélecteurs de contexte pertinents, propriétés groupées et aide CSS ; chargement et génération/brouillon explicites.
- Attribution sémantique, exception locale, descriptions d’intention, valeurs chargée/brouillon, liens et compteur des composants concernés avec retour sans perte.
- Couleur visuelle/précise, dimensions et unités autorisées avec conversion mesurée, nombres bornés, familles préparées ; erreur conserve le dernier aperçu valide.
- Badges AA/AAA, seuils/limites de mesure et correction explicite au clic, choix de couleur si nécessaire.
- Trois choix de portée, descriptions et parcours sémantique/clarifications/proposition à assistance optionnelle ; Annuler et Enregistrer, verrouillage, conflit et résultat inconnu conservés.
- Habillage clair de UI Lab, tokens de composition, clavier et mobile ; aucun import Storybook, compte ou API nouvelle. Pas de modification des valeurs/identités produit ni conversion de reçus. Ajouter les consommateurs au manifeste de révision.

Hypothèse réversible : garder la navigation Aperçu/Réglages, le choix d’exemple et l’abandon global propres à UI Lab ; reprendre le vocabulaire et les contrôles d’Apparence à l’intérieur du panneau. Le thème sombre Storybook n’est pas repris. Vérification dans une copie isolée sans données/journaux utilisateur ; génération uniquement inactive, types/lint/unitaires, parcours compilés et persistants desktop/mobile, contrôles DS/docs/frontières et revue visuelle. Tests d’écriture exclus de la recette humaine restaurée. Mise à disposition d’une nouvelle recette UI Lab distincte après qualification, sans remplacer Storybook ni importer les changements UI Lab abandonnés.

## État

**En revue — qualification technique acquise, acceptation humaine différée.** [Bilan, revues et preuves](../reviews/ds-edit-65.md) : présentation d’Apparence reprise sans dépendance Storybook, 20 parcours compilés qualifiés (18 + deux retests numériques), 14 persistants dont clarification simulée, 148 unitaires/82 DS/cinq docs, types/lint/builds/frontières réussis. Six échecs d’une campagne serveur aux fixtures modifiées simultanément rejoués avec succès sur sources stables ; aucune nouvelle campagne complète propre 85/85 revendiquée. Onze tokens de composition ajoutés, autres autorités produit inchangées, manifeste v17. Nouvelle recette UI Lab au port 54139, modèle enregistré de l’ancien Storybook strictement préservé (188 bindings/18 styles), sans importer les changements UI Lab abandonnés. Storybook restauré inchangé sur 54138 ; racines distinctes sans synchronisation. Diff préexistant suivi propre ; fichiers non suivis (ancien dossier `.storybook/editor/`, copies « 2 » et frontend) exclus. Doc updated. Reprise : vérification humaine ; aucune acceptation A–F/J4/J5 ou publication implicite.
