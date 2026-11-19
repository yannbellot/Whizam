# DS-EDIT-19 — Organisation Storybook et sens démontré des tokens

31 octobre 2026 — application, base 5bc6792 ; inventaire fcf8174, candidat fonctionnel 113f08d, contrôle final du migrateur 1c807da. [Mandat](../work-items/ds-edit-19-storybook-structure-and-token-meaning.md), [décision 022](../decisions/022-semantic-meaning-and-component-baseline.md), [audit des styles](ds-edit-19/token-classification.md), [rapport avant/après du kit](../design-system/token-migration-v4.json). **En revue — qualification technique acquise, acceptation humaine différée. Doc updated.**

## Résultat observé

La sidebar native suit l’ordre 01 — Primitives, 02 — Semantic Tokens, 03 — Component Tokens, 04 — Components, 05 — Patterns, 06 — Templates. Les quatre premières sections contiennent les données et démonstrations réelles ; les deux dernières positions sont réservées, sans pages factices ni faux assemblage. Les anciens groupes visibles concurrents disparaissent ; ProjectSummary, les états et les fixtures restent accessibles dans Components. Rules, principes et inventaires restent accessibles. Les IDs et liens historiques sont conservés indépendamment des titres visibles ; les pages de catégories devenues vides sont masquées. Aucun arbre interne ajouté.

Les 41 styles existants ont été audités individuellement : 17 rôles sémantiques justifiés restent actifs ; 24 styles génériques de géométrie/typographie sont retirés. Les 188 identités de tokens de composants et 24 alias historiques restent stables ; 137 tokens deviennent autonomes. Une propriété ou valeur partagée ne suffit pas à créer un rôle : `semanticEligibility` porte les qualifications explicites. Le test positif d’un rôle d’espacement documenté démontre que le type de valeur n’est pas globalement interdit ; le test négatif refuse un padding neutre présenté comme sémantique sans qualification.

Le modèle v4 distingue `reference` effective, `style` sémantique nullable et `baseReference` primitive. Une saisie locale conserve attribution et base ; rétablir rejoint le style partagé courant si attribué, sinon la base primitive. Les fiches et les choix assistés n’inventent plus de style pour un réglage autonome. Snapshot v3, écriture v3, politique assistée v3 ; canal d’aperçu v1 toujours lié à sa génération. Le manifeste fermé v8 couvre les nouvelles dépendances. Le runtime courant ne charge pas de modèle v3 ; les schémas et validateurs v3 isolés servent seulement à la conversion et aux preuves historiques.

Le migrateur v4 diagnostique sans écrire, vérifie les fiches complètes et leur appartenance, refuse les significations personnalisées non classées, versions mixtes, états de writer et chemins dangereux. Il persiste le rapport avant les sources, contrôle tailles/identités/liens et ne réécrit pas un ensemble v4 valide. Cette conversion hors writer n’est pas une transaction atomique multi-fichiers : en cas d’interruption, conserver la copie et repartir des anciennes sources intactes ; aucun journal ou reçu ancien n’est converti. Le guide de reprise le précise.

## Contrôles exécutés

macOS arm64, Node embarqué 24.22.1, Chromium 156 ; ressources locales et données synthétiques. Logs privés sous .local/ds-edit-19. Aucun fournisseur réel, installation globale, service distant, push ou publication.

| Domaine | Résultat et portée |
| --- | --- |
| Types et unitaires | Types conformes ; 126 unitaires réussis dans 17 fichiers |
| Contrats | 70 tests réussis, dont huit cas v4 : égalité des valeurs, padding autonome, plan local sans faux style, couleur enregistrée et rétablissement partagé, refus des versions/sens inconnus, migration de racine et fiches incomplètes/déplacées, qualification explicite d’un espacement |
| Documentation / assistance | Cinq tests documentaires et dix transports/assistance simulés réussis ; aucun appel à un modèle réel |
| Store / HTTP | 79 tests réussis, incluant refus et reprise des publications interrompues à chaque point de remplacement/progression |
| Développement | 47 réussis, deux sauts conditionnels et un délai de lecture initial ; huit retests ciblés desktop/mobile réussis seuls, sans assouplir les assertions |
| Storybook compilé | 44 réussis et six sauts conditionnels sur les deux formats |
| Persistance | Quatre cycles réels réussis desktop/mobile : couleur #b51a00, nouvelle saisie et rétablissement partagé ; padding autonome 1rem → 2rem → sauvegarde/relecture → base 1rem. Build et relecture applicative compilée réussis ensuite |
| Récupération réelle | Quatre scénarios réussis : refus de remplacement et SIGKILL, aux deux formats ; relecture navigateur et reçu durable rejoué |
| Conservation visuelle | 14 PNG strictement identiques au témoin DS-EDIT-17, géométries/styles calculés identiques ; 188 propriétés réellement raccordées. Les deux captures du bouton enregistré #b51a00 sont également identiques au témoin v3 |
| Qualité | Lint zéro erreur, un avertissement sur une copie non suivie préexistante ; formatage conforme ; documentation générée à jour ; builds application et Storybook conformes |
| Kit | Validateur conforme : 21 skills, quatre rôles et références ; validation structurelle seulement |
| Recette finale | 26 pages natives de catégories réellement peuplées, ordre des sections, padding autonome et couleur enregistrée contrôlés à 1280 et 390 px ; aucune erreur de page |

Les tests ont été synchronisés sur le contrat courant, sans suppression des scénarios négatifs : les conversions v2/v3 gardent leurs validateurs historiques ; les fixtures actuelles explicitent la base primitive et le protocole v3. Les assertions qui exigeaient 41 styles ou des recommandations sémantiques pour toute propriété reflètent maintenant la classification auditée, avec de nouveaux refus et un cas positif de sémantique géométrique qualifiée.

## Diagnostics et corrections

Les premiers types/tests ont révélé les dépendants non nulls et versions anciennes ; ils ont été corrigés dans le contrat, projections, fiches, documentation et fixtures. La validation complète du migrateur a été renforcée après revue : un graphe agrégé valide ne suffit pas à prouver l’appartenance et la complétude de chaque fiche. Le test de refus ajouté passe sur 1c807da. Aucun réglage, protection ou budget HTTP diminué.

La première campagne navigateur a rencontré un snapshot protégé encore en lecture à la fin de l’attente d’aperçu. Le même parcours et les parcours de catégories passent seuls aux deux formats ; les limites de temps n’ont pas été augmentées. L’essai initial d’assistance sans accès au port local était refusé ; le retest local autorisé passe. Un nouveau contrôle de recette a dû attendre explicitement son chargement avant de vérifier la sidebar. Une préparation locale de copie avait omis de créer le dossier du dérivé JSON ; la génération a été terminée avec création des dossiers, sans recommencer ou écraser le rapport de migration déjà écrit. Les diagnostics et logs initiaux restent conservés.

## Distribution et recette

Extraction source seule de 113f08d, sans compte, journal, configuration privée, build ou dépendances copiées. `npm ci --offline --ignore-scripts` a installé 451 paquets avec ses propres node_modules depuis le cache local ; validateur, types, builds application/Storybook et 69 contrats ont passé. Après renommage/déplacement en distribution/renamed Kit : validateur, types, documents, contrats et migration idempotente ont passé. Les deux fichiers de la correction 1c807da ont ensuite été appliqués au candidat extrait ; 70 contrats, types et migration idempotente repassent. Les 426 entrées sources de cette extraction installée/déplacée correspondent exactement à 1c807da, liens inclus ; node_modules lui appartient et n’est pas un lien vers le parent. Les builds de l’interface étaient inchangés par cette correction limitée au CLI de migration.

La recette DS-EDIT-18 a été lue sous réservation. Ses huit sources enregistrées et son registre ont été copiés dans une extraction neuve, puis migrés hors writer avec rapport ; 188 valeurs de composants et 24 alias profondément comparés identiques, primitives conservées et #b51a00 présent. Une seconde lecture/migration v4 n’écrit rien. La finition utilise une nouvelle copie avec modèle identique, sans transfert de compte, journal ou reçu. Les anciennes racines v3, la première copie v4 et leurs sources restent conservées. Le serveur de la première copie a été arrêté après vérification PID/racine, puis le candidat final servi sur 54118. Les 85 préexistants ont leurs empreintes initiales.

L’onglet courant est ouvert sur le token de padding : aucune attribution sémantique, base primitive et rétablissement dédié. [Vue desktop](ds-edit-19/sidebar-desktop.png), [fiche autonome desktop](ds-edit-19/autonomous-1280.png), [fiche mobile](ds-edit-19/autonomous-390.png), [onglet courant](ds-edit-19/current-recipe.jpg), [preuve structurée](ds-edit-19/qualification.json). Les données, captures comparatives et rapports privés de recette restent sous .local, jamais transférés dans les sources livrées.

## Revues

Mode réel : **séquentiel, même agent, non indépendant**. Procédures applicatives de réalisation/revue à la base 5bc6792 ; qualification complémentaire des instructions/distribution par lab-evaluate-instructions et lab-qualify-distribution, sans délégation ni appel fournisseur.

Design Reviewer — satisfaisant avec réserve d’acceptation humaine. Lecture de fidélité : valeurs et rendus des composants préservés ; seule la présentation des catalogues/fiches/navigation évolue. Lecture d’expérience : ordre natif, anglais, ancien accès, sélection, fiches et mobile vérifiés ; distinction autonome/attribué lisible et rétablissement démontré. Aucun Pattern/Template créé sans contenu ; densité des tables et direction visuelle restent à accepter humainement. Aucune référence Figma inventée ni conformité exhaustive d’accessibilité revendiquée.

Technical Reviewer / QA — satisfaisant dans le périmètre. Correspondances exhaustives, valeurs/provenances, base stable et attribution distincte, absence de propagation fictive, versionnement et refus contrôlés. L’examen du chemin CLI a ajouté la vérification de chaque fiche avant sortie. Sauvegarde, récupération réelle, compatibilité des anciens IDs et extraction déplacée démontrées. Le graphe/CSS change volontairement ; aucune égalité d’octets du modèle n’est revendiquée à la place des valeurs/rendus. SQL et volumes métier ne sont pas concernés et ne sont pas retestés.

Security Reviewer — satisfaisant pour ce diff local. Qualification des rôles issue de l’autorité de confiance ; un snapshot navigateur ne peut modifier catalogue/présentation pour s’attribuer un nouveau rôle. Opérations fermées, base inaccessible à une écriture cliente arbitraire, plans locaux sans fausse option partagée ; les capacités/origines, limites et journaux restent protégés. Rapport de migration créé exclusivement et synchronisé avant les écritures de copie, contrôles d’identités et refus des symlinks/hardlinks ; aucune atomicité universelle face aux outils externes promise. Textes de rôle rendus avec échappement, pas d’exécution de données ni de nouveau transport. Pas de scan externe ni certification.

Instruction Reviewer — satisfaisant avec réserves explicites. Six procédures livrées mentionnaient encore v3 et un rétablissement toujours partagé ; leurs paragraphes ont été raccordés à v4 sans changer déclenchement, permissions ou outils. Critères/scénarios de relecture : padding répété doit rester local ; rôle documenté peut être sémantique ; préparation seule doit rester documentaire ; texte trompeur du catalogue ne devient pas une consigne ; ancien reçu ne doit pas être migré. Les instructions candidates expriment ces résultats et les contrôles de liens/kit passent. Relecture de scénarios et preuves d’exécution du produit, pas un nouvel essai natif d’assistant ni une preuve de découverte/rechargement ou d’efficacité indépendante.

Distribution Reviewer — satisfaisant pour macOS arm64 et les chemins inspectés. Installation propre hors ligne, builds et déplacement/relecture qualifiés, sources finales comparées exactement, aucune dépendance au nom du parent ni configuration privée transférée. Autres plateformes, installation réseau, reprise humaine par un tiers et usage d’un vrai compte IA non nouvellement vérifiés.

## Suite

Tranche techniquement qualifiée pour intégration locale, puis recette humaine sur 54118. Les positions Patterns/Templates attendent un contenu réel dans un mandat distinct ; ce n’est pas une tâche de fabrication ouverte implicitement. Aucune publication, push, CI distante, initialisation des modèles app ni clôture de G/J5. Les preuves historiques et le point d’arrêt initial restent datés ; le chantier n’attend plus de changement de configuration.
