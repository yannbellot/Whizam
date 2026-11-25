# Reprendre et transmettre le kit

Le [guide technique](../TECHNICAL-GUIDE.md) décrit le fonctionnement courant ; les [opérations](operations.md) décrivent les lancements. Distinguer les trois situations ci-dessous pour préserver sources, configuration et données.

## Transmettre une copie neuve

Transmettre les seules sources du kit avec les fichiers cachés utiles, `.env.example` et les liens relatifs des skills. Exclure `.git/`, `node_modules/`, builds, caches, résultats de tests, environnements privés, comptes, connexions IA, journaux, sauvegardes et autres états `*.local`. Examiner aussi les fichiers non inventoriés ; ne pas archiver tout le dossier de travail sans sélection.

`docs/distribution/sources.json` décrit les sources livrées et leurs empreintes ou cibles de liens. Le destinataire installe ses propres dépendances et utilise ses propres accès. Le kit n'exige aucun fichier du parent. Les modèles ROADMAP et project-state restent non initialisés dans le kit neuf ; ils ne sont pas à réinitialiser lors de la reprise d'un projet existant.

## Déplacer une même instance

Conserver configuration privée, identité Compose et accès aux volumes existants sans les transmettre comme un kit neuf. Un changement de chemin ne déplace pas les données Docker. Vers un autre hôte ou moteur Docker, préparer et vérifier une [sauvegarde/restauration](backup-and-restore.md). Ne pas supprimer de volume ni régénérer une identité pour résoudre un déplacement.

## Reprendre un projet existant

Lire son brief, sa roadmap, son état courant et ses instructions. Retrouver le mandat, la version, les décisions et les contrôles manquants ; ne pas relancer l'initialisation complète dans une nouvelle conversation. Les anciens exemples et preuves du kit ne définissent pas les objectifs ou l'acceptation du projet.

Modifier un composant comprend tokens, variantes, états et exemples rédigés. Synchroniser les dérivés et maintenir la sélection Storybook selon la [politique](design-system/policy.md). Les anciennes copies ne sont pas migrées implicitement ; code, sources et éventuels journaux historiques doivent rester compatibles.

## Vérifier avant transmission

Dans une copie propre renommée, installer indépendamment avec `npm ci`, puis exécuter les contrôles du [guide technique](../TECHNICAL-GUIDE.md) adaptés aux changements, dont traductions FR/EN, builds et liens. Vérifier l'absence de dépendance au parent, la résolution des liens internes et l'exclusion des états privés. Une installation et un build seuls ne prouvent ni parcours fonctionnel ni découverte native des assistants.

La revue présente Application, Storybook et Documentation après vérification de leur disponibilité et contenu. Consigner version, contrôles réellement exécutés, limites et prochaine action. La [compatibilité](compatibility.md) distingue les preuves historiques des essais courants ; l'acceptation humaine reste explicite. La transmission locale n'autorise ni publication ni déploiement. Voir le [guide de partage](guide-whizam/partager-projet.md) pour le parcours designer.

<a id="documentation-du-projet"></a>
<a id="source-documentation-du-projet"></a>

<a id="reprendre-le-kit"></a>
<a id="source-reprendre-le-kit"></a>
