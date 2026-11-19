> DS-AUTO-01 : aucun writer ni connexion IA n’est monté dans l’application ou Storybook. UI Lab et son bootstrap sont retirés. Les scripts de génération s’exécutent explicitement ou via les précommandes locales ; les protections et limites de publication sont dans la [politique](design-system/policy.md). Les sections d’éditeur et de comptes d’un autre outil ci-dessous restent historiques.

# Sécurité et périmètre d’exposition

## Connexions du poste — MVP-01-T1

Les comptes Codex et Figma optionnels appartiennent à l’installation locale ; ils ne créent pas de compte utilisateur ni de permissions multi-utilisateurs dans l’exemple métier. Le contexte Codex passe par une commande serveur finie, depuis la racine et l’arbre physiquement servis ; le navigateur ne fournit ni racine libre, ni commande Git, ni attestation de contrôle. Le modèle conserve les liens partageables, les conversations restent privées.

Figma direct accepte un lien de sélection Design, puis conserve seulement sa clé et son nœud. La requête de lecture utilise l’hôte API fixe, sans redirection, avec délai/taille/profondeur bornés. Le jeton personnel `file_content:read`, saisi uniquement dans le formulaire local, est vérifié avant conservation dans `.runtime.local/figma/connection.json` (0600, dossier privé 0700). Il n’est ni renvoyé au navigateur, ni transmis à Codex, ni inscrit dans les traces partageables. Déconnecter retire ce fichier ; les références importées et décisions demeurent partageables. Les sources externes sont des données, sans exécution de liens, d’images ou de prototypes.

Les mêmes gardes Host/Origin/capacité protègent connexion, import et arbitrage. L’import seul ne modifie pas les valeurs produit ; les changements visuels décidés utilisent le writer commun et ses refus de péremption. Les routes et exports excluent connexions et conversations. [Preuves et limites T1](reviews/mvp-01-interface-design-agents/README.md) : essais négatifs et réconciliation synthétique complétés par connexion/import/arbitrages/réimport réels, clone/export sans jeton et déconnexion vérifiée. Aucune ouverture distante ou garantie exhaustive déduite.

## État actuel

Démonstration strictement locale, avec données synthétiques et sans compte utilisateur. Les serveurs hôte utilisent la boucle locale ; aucune publication ou ouverture à des utilisateurs n’est déduite de la qualification technique. Les migrations et tests de données n’autorisent aucune opération sur une base réelle ou partagée.

Les accès navigateur aux modules `.server` sont refusés par le bundler et vérifiés par un test négatif réel. Configuration et connexion PostgreSQL restent serveur ; les diagnostics indiquent les champs, sans valeurs privées. Le rendu d’erreur public ne montre pas les détails internes. Les requêtes Drizzle utilisent des paramètres ; contraintes et transaction annulée sont testées sur PostgreSQL réel isolé. `/health` ne fournit que l’état de vie, sans version, secret ou information de base.

## Contrôles et limites

Les bilans P1-01 à P1-03 décrivent des revues ciblées par rôles exercés séquentiellement par le Builder ; ils ne constituent pas une revue indépendante ni une garantie exhaustive. Les entrées/formulaires J3 et la restauration P5 ont été contrôlés ; authentification, permissions multi-utilisateurs et nouvelles expositions restent à examiner avant activation. Aucune garantie multi-utilisateur ou de production n’est annoncée.

Les tests créent leurs propres ressources étiquetées, secret éphémère et données fictives ; ils vérifient le contexte avant migration et les identités avant nettoyage. Aucun port DB publié dans la campagne d’intégration. `.dockerignore` exclut environnements locaux et installations privées des contextes ; les Dockerfiles ne copient pas de configuration secrète.

## Réserve de dépendance — P1-03

Audit runtime sans avis signalé ; audit complet avec quatre remontées modérées propagées par la chaîne de développement Drizzle Kit/ancien chargeur esbuild. L’avis concerne `esbuild.serve`, absent du workflow de génération SQL local utilisé. Aucun serveur esbuild ni Drizzle Studio n’est lancé. Conserver la réserve et la réévaluer avant livraison ou ajout de ce mode ; aucun downgrade forcé ni acceptation silencieuse d’une vulnérabilité élevée applicable.

Le bilan historique Security Reviewer P5-02 portait sur le candidat 1a33aee dans son périmètre local, avec dépendances, accès, données, entrées, opérations et limites. Son rapport n’est pas inclus dans ce kit ; ce résumé ne qualifie pas une nouvelle version. Les approbations techniques, arrêts matériels, interdiction des secrets versionnés et autorisation distincte de publication restent applicables.

P1-04 qualifie l’image runtime avec UID 1000, sans Drizzle Kit ni fichier privé, la publication applicative sur 127.0.0.1 et l’absence de port DB hôte par défaut. La configuration locale générée est ignorée, protégée en 0600 et jamais écrasée. L’override hôte est explicite et reste lié à la boucle locale. Les diagnostics de port/configuration/base ont été contrôlés sans publier de secret. Les ressources synthétiques temporaires restent identifiées pour leur nettoyage ciblé.

## Parcours projets J3

Démonstration limitée à la boucle locale, sans comptes. Chaque opération métier refuse les hôtes étrangers ; chaque écriture exige POST et Origin identique, et refuse Fetch-Metadata cross-site. Router 7.18.4 ajoute sa propre vérification d’origine avant l’action. Formulaires URL-encodés seulement, champs nom/description sans doublon, limite effective de 16 KiB y compris sans Content-Length ; refus 413 testé sans rupture avant réponse. Les identifiants/dates ne sont jamais pris d’un formulaire. Zod et Drizzle contrôlent saisie/requêtes ; affichage React comme texte. Données et erreurs non mises en cache, erreurs de stockage expurgées et saisie conservée.

Ces protections ne créent aucune identité ni isolation entre personnes ; ne pas exposer le starter ni y stocker des données réelles. Tout ajout de comptes exige le choix préalable de la méthode, des sessions/droits et des tests d’accès croisé. Le bilan historique J3, non inclus dans ce kit, portait sur ces contrôles et leurs limites ; aucune certification ni revue indépendante n’est revendiquée. Les tests disponibles et les résultats de la version qualifiée sont décrits dans le [bilan PORT-03 livré](reviews/port-03/README.md).

## Service local d’édition du design system

Le service de développement impose loopback, propriétaire unique, Host/Origin exacts et capacité du document local. Les lectures protégées utilisent aussi POST JSON (décision 008), sans CORS ni cache. Entrées, graphes, budgets et chemins sont fermés ; symlinks, hardlinks et changements d’identité sont refusés. La zone `.design-editor.local/` reste privée et exclue de Git et des images. Le [protocole de récupération](design-system/editor-persistence.md) bloque toute version ambiguë. Suspendre écritures/builds externes durant Enregistrer : la coordination ne protège que ses participants, sans garantie universelle contre une course externe ni une panne physique du support.

## Rendu documentaire

Le [catalogue](design-system/semantic-catalog.md) et l’[inventaire](design-system/style-inventory.md) sont du texte dérivé, jamais des instructions ni une autorité. Le renderer échappe les caractères Markdown/HTML des données ; Storybook les lit avec son composant Markdown, sans compilation MDX des données ni HTML brut. Aucun lien, commande, capacité HTTP ou chemin absolu issu des données n’est exécuté. Les réserves et provenances sont conservées comme texte. Le manifeste fermé v2 ajoute seulement ces deux dérivés documentaires et leurs dépendances de génération ; les huit sources modifiables et gardes HTTP restent identiques. Leur publication suit la récupération D, sans nettoyage automatique de journal ni atomicité OS multi-fichiers promise.

## Lecteur applicatif de développement

Le participant Vite applicatif utilise la réservation existante pour ses réponses et refuse de servir une génération pendant publication/récupération. Il ne fournit aucun endpoint d’écriture. Fichiers privés, environnements et métadonnées Git sont refusés ; la surveillance exclut le journal privé. La notification de rechargement suit le snapshot complet, sans capacité envoyée au UI Lab. Le plugin est limité au serveur de développement et absent du runtime compilé. Le manifeste v3 inclut ses dépendances ; conserver toute ancienne racine avec son outillage et ses reçus avant une mise à jour incompatible, sans conversion ou purge automatique.

## Raccordement Codex de développement

L’[assistance optionnelle](design-system/editor-assistance.md) passe par les mêmes protections locales que l’éditeur. Le contexte vient du serveur et des opérations validées, pas d’un snapshot libre envoyé par le modèle. Les réponses sélectionnent des choix bornés ; une propagation partagée ne s’autorise pas elle-même. Les réponses périmées, plans incompatibles, capacités étrangères et tentatives d’outils sont refusés.

L’état Codex propre à l’installation n’est pas copié depuis le compte habituel. Le processus enfant utilise cet état privé, des outils désactivés et une sandbox en lecture seule ; le confinement macOS refuse aussi les écritures du processus hôte hors du répertoire privé. Sa configuration effective est vérifiée avant utilisation, sans lancement non confiné de repli. Les données de connexion restent ignorées par Git, exclues de Docker et refusées par les deux serveurs de développement, y compris par leurs routes de fichiers. Elles ne doivent pas accompagner une extraction source. Ce raccordement est qualifié séparément du socle ; aucune protection équivalente ou compatibilité universelle n’est revendiquée sur les autres plateformes.

## Intention décrite — DS-EDIT-23

La description et les textes de catalogue sont des entrées non fiables, rendues comme texte et transmises seulement lors d’une demande d’interprétation. Réponse structurée, limites et gardes du raccordement existant conservées. La validation hôte refuse champs supplémentaires, catégories inconnues, doublons, valeurs incompatibles et révisions périmées. L’ajout de données au catalogue ne permet aucune modification de taxonomie, de sélecteur, de propriété, de règle de nommage ou de fichier libre. Catalogue, token et attribution participent à une même transaction bornée. Aucune clé, capacité de sauvegarde ou donnée d’authentification n’est transmise au modèle.

## UI Lab — consultation et brouillon C

L’atelier et sa scène utilisent le snapshot public sans capacité ni POST d’édition. Les seuls messages admis ont origine/source/identité de montage reconnues ; les schémas du socle vérifient ensuite leurs identités et opérations. La scène est sélectionnée dans un registre de composants préparés, sans URL ou code arbitraire ; l’iframe de même origine isole le rendu, sans constituer une frontière contre du code hostile. Aucun accès d’écriture ou d’assistance ajouté en C ; l’API Storybook reste séparée. Manifeste v14 : préserver l’ancienne version avec ses reçus, sans migration en place.

## Writer autonome UI Lab — DS-EDIT-64 D

Le plugin editorWorkshop est limité au développement explicitement activé, Host/Origin exacts et port loopback strict. Il précède le lecteur ; toutes les API gardent capacité, POST JSON borné, absence de CORS/cache, validation et protections de fichiers. Le document UI Lab seul reçoit les métadonnées hexadécimales ; les pages ordinaires et scènes n’en reçoivent pas. Le transport ne lit pas le parent, rejette une racine différente au renouvellement et conserve l’identifiant lors d’un résultat inconnu. Le bootstrap serveur est éliminé du build produit et exclu des copies de sources serveur du Docker runtime. Le compte Codex privé et le journal ne sont jamais distribués. Les historiques C restent des preuves du mode consultatif.

## Qualification de la séparation UI Lab / Storybook

La [campagne DS-EDIT-64 E](reviews/ds-edit-64-e.md) requalifie les refus HTTP réels, l’extraction sans état privé et l’absence de writer/bootstrap dans le runtime Docker. Le [dossier de passation](handoff.md) distingue les fichiers privés conservés pour déplacer la même instance des sources distribuables sans capacités, reçus ou connexion IA. Assistance simulée seulement ; aucun nouvel audit de dépendances ou certification de sécurité déduit de cette campagne.

## Retrait de l’ancien hôte — DS-EDIT-64 F

Storybook ne charge plus addon, bootstrap de capacité, middleware writer ou connecteur IA. Les variables d’édition ne sont pas transmises par son lanceur ; l’ancien indicateur ne réactive aucun service. Le participant Vite commun limite les lectures pendant une publication/reprise et refuse API d’édition/chemins privés, sans posséder le writer. Le socle client exige un port d’hôte explicite ; les lectures DOM/parent et le renouvellement historique à `/` sont supprimés. Le [bilan F](reviews/ds-edit-64-f.md) distingue preuves réelles, simulations et limites ; aucune conversion de reçu ou nouvelle exposition réseau.

## Saisie privée locale

Le [parcours de configuration privée](agents/private-configuration.md) fournit le formulaire local et le repli fichier ; les secrets restent hors conversation et hors distribution. Le service ne doit pas être exposé sur le réseau. L’enregistrement ne teste pas un fournisseur et ne recharge pas une application déjà démarrée.
