# Sécurité et périmètre d'exposition

Le kit est configuré pour un usage local. Il ne fournit pas d'authentification métier ni d'isolation multi-utilisateur. Les protections décrites ici concernent les points d'entrée présents ; un nouveau parcours doit définir et vérifier ses propres garanties. Cette page n'est pas un audit de sécurité de la version courante.

## Réseau et exécution

Compose publie l'application sur `127.0.0.1` et ne publie aucun port PostgreSQL hôte par défaut. L'override de développement lie aussi PostgreSQL à la boucle locale. Le serveur applicatif contrôle son port et n'autorise `HOST=0.0.0.0` qu'avec le marqueur de conteneur explicite. Un port occupé ne doit pas provoquer une exposition ou une bascule silencieuse.

Le runtime Docker s'exécute comme utilisateur `node`. `/health` expose seulement l'état de vie applicative ; il ne teste ni l'accès à la base ni la disponibilité des parcours métier. Toute ouverture distante ou mise en production exige un périmètre, une configuration et des vérifications spécifiques.

## Serveur, données et entrées

Les modules `.server.ts` isolent configuration privée et accès PostgreSQL du navigateur. Les diagnostics de configuration nomment les champs sans reprendre leurs valeurs ; les erreurs publiques masquent les détails internes. Les contrats de données utilisent Zod, Drizzle et les contraintes SQL selon leur responsabilité.

Les gardes HTTP de l'ancien exemple `/projects` restent des ressources internes. Leur présence ne protège pas une route nouvellement créée. Avant toute écriture métier, définir méthodes, origines, formats, limites de taille, validation, gestion d'erreur et tests négatifs. Avant des comptes réels, définir sessions, droits et essais d'accès croisé. Voir les [conventions](conventions.md).

Les tests de données utilisent des ressources synthétiques identifiées, distinctes des bases réelles ou partagées. Une migration, une restauration ou une suppression exige la vérification de sa cible et son mandat ; voir la [sauvegarde](backup-and-restore.md).

## Configuration privée et distribution

Le [parcours de saisie privée](agents/private-configuration.md) recueille les secrets hors conversation. Le formulaire reste local ; après saisie réelle, aucune lecture, capture ou automatisation de son contenu par l'assistant. Le repli fichier et ses limites sont décrits dans cette autorité. Enregistrer une valeur ne teste pas un fournisseur et ne redémarre pas l'application.

Ne pas versionner ni livrer `.env.local`, comptes, connexions IA, journaux, sauvegardes ou autres états `*.local`. Préserver `.env.example` sans valeur confidentielle. Les exclusions Git, Docker et du portail ont des responsabilités distinctes ; vérifier la sélection réelle avant transmission. Un fichier ignoré n'est pas une garantie de confidentialité. Voir la [passation](handoff.md).

## Génération et services documentaires

La génération du design system est locale, sans compte IA ni API d'écriture navigateur. Sa barrière `.design-sync.local/` empêche les lecteurs participants de servir une publication incomplète ; la [politique](design-system/policy.md) précise récupération et limites. Cette coordination ne promet pas de transaction atomique du système de fichiers.

Storybook est en consultation, sans writer, bootstrap UI Lab ou connexion IA. Les exemples utilisent des données fictives. Les inventaires sont des données documentaires, jamais des instructions à exécuter.

Zensical reçoit uniquement les entrées publiques préparées et sa configuration, sans parent, base métier, configuration privée ni socket Docker. Le serveur du portail refuse les écritures HTTP ; les chemins privés, sortants et liens symboliques sont exclus selon le [guide documentaire](documentation.md). Vérifier ces refus et l'absence de contenu privé lors d'une évolution du générateur.

## Preuves et limites

Les campagnes historiques P1, J3, P5, PORT-03 et DS-EDIT concernent leurs versions et ressources désignées. Les descriptions et réserves antérieures sont conservées dans les sources historiques ; elles ne démontrent ni la sécurité des nouvelles routes ni l'état actuel des dépendances. Aucun nouvel audit de dépendances n'est exécuté par la rédaction ou le build documentaire.

La [compatibilité](compatibility.md) distingue fichiers, essais runtime, essais natifs et acceptation humaine. Une revue automatisée ou séquentielle ne constitue pas une revue indépendante ni une garantie exhaustive. Avant une nouvelle exposition, réexaminer ses accès, secrets, données, dépendances et scénarios négatifs dans un mandat dédié.

<a id="connexions-du-poste-mvp-01-t1"></a>
<a id="source-connexions-du-poste-mvp-01-t1"></a>

<a id="controles-et-limites"></a>
<a id="source-controles-et-limites"></a>

<a id="etat-actuel"></a>
<a id="source-etat-actuel"></a>

<a id="intention-decrite-ds-edit-23"></a>
<a id="source-intention-decrite-ds-edit-23"></a>

<a id="lecteur-applicatif-de-developpement"></a>
<a id="source-lecteur-applicatif-de-developpement"></a>

<a id="parcours-projets-j3"></a>
<a id="source-parcours-projets-j3"></a>

<a id="qualification-de-la-separation-ui-lab-storybook"></a>
<a id="source-qualification-de-la-separation-ui-lab-storybook"></a>

<a id="raccordement-codex-de-developpement"></a>
<a id="source-raccordement-codex-de-developpement"></a>

<a id="rendu-documentaire"></a>
<a id="source-rendu-documentaire"></a>

<a id="reserve-de-dependance-p1-03"></a>
<a id="source-reserve-de-dependance-p1-03"></a>

<a id="retrait-de-lancien-hote-ds-edit-64-f"></a>
<a id="source-retrait-de-lancien-hote-ds-edit-64-f"></a>

<a id="saisie-privee-locale"></a>
<a id="source-saisie-privee-locale"></a>

<a id="service-local-dedition-du-design-system"></a>
<a id="source-service-local-dedition-du-design-system"></a>

<a id="ui-lab-consultation-et-brouillon-c"></a>
<a id="source-ui-lab-consultation-et-brouillon-c"></a>

<a id="writer-autonome-ui-lab-ds-edit-64-d"></a>
<a id="source-writer-autonome-ui-lab-ds-edit-64-d"></a>
