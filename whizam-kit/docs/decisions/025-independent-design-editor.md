# 025 — Socle DS-EDIT indépendant de Storybook

**État courant F :** atelier UI Lab autonome, addon/writer/bootstrap Storybook retirés ; lecture documentaire protégée et passation React conservée. Les phases précédentes ci-dessous restent leur historique daté.

4 novembre 2026 — mandat explicite DS-EDIT-64 A/B. La migration vers UI Lab est autorisée ; C–F restent hors de ce mandat. Cette décision remplace les obligations d’hébergement Storybook de la décision 007 et de la spécification initiale, sans modifier les règles des valeurs, portées et transactions.

## Contrat cible

L’atelier occupera `/ui-lab`, avec une scène isolée sous `/ui-lab/preview`. La coque initialise sa session après montage client. Une iframe de même origine reçoit uniquement un contexte de scène validé et des opérations bornées ; aucune capacité du service ne lui est transmise. Vérifier origine, source, session, génération, rendu et séquence ; nettoyer les projections au démontage. Les routes seront implémentées en C, pas en A/B.

Navigation : fondations et catalogues en consultation ; composants → exemples → parties/propriétés/états préparés. Les liens d’usage ouvrent une scène et permettent le retour au réglage sans perdre le brouillon. Réglages locaux et partagés, intention explicite, annulation actuelle, unités/contraste restent disponibles ; aucune comparaison ou ancienne fiche Styles réintroduite. Hover/focus simulés sont distingués des interactions réelles. Les états absents ne deviennent pas éditables.

L’isolation de même origine est une isolation de rendu/CSS, pas une frontière de sécurité contre du code arbitraire : aucune scène non fiable ne sera chargée. Le remplacement du fallback de capacité vers le parent par un port explicitement fourni à chaque contexte est un critère C/D.

La coque conserve ses propres tokens d’outillage, isolés des valeurs de l’aperçu ; elle suit la décision 024. Disposition proposée : navigation, aperçu et réglages sur grand écran ; vues basculables sur petit écran avec contexte et brouillon conservés. Cette disposition réversible reste à éprouver en C.

Le writer commun sera raccordé en D au serveur Vite de développement par activation explicite locale ; il sera absent du runtime compilé. Un seul propriétaire par racine, Host/Origin/capacité et méthodes protégées conservés. Bootstrap de capacité réservé au document éditeur ; URLs de bootstrap et snapshot fournies par l’hôte, jamais déduites de la sélection d’une story. En cas d’indisponibilité : consultation/brouillon, sauvegarde désactivée et erreur explicite. Résultat inconnu : interrogation du statut avec le même identifiant. Changement externe : rebase contrôlé et résolution explicite des conflits, sans rechargement destructeur du brouillon.

## Extraction B et transition

Le moteur, la session/rebase/assistance et la projection sont dans `src/design-system/editor/`, sans import Storybook. Le transport d’aperçu est un port ; l’adaptateur Storybook fournit son canal. Les fixtures préparées sont des modules React partagés sans dépendance Storybook. Le serveur et le bootstrap local sont dans `scripts/design-editor/`. Snapshot JSON canonique généré sous `public/`, servi par les deux hôtes ; aucune copie source parallèle.

En B, Storybook reste l’unique hôte du writer. Son adaptateur conserve navigation et panneaux actuels. Le protocole d’aperçu garde provisoirement son champ `storyId` comme identité opaque de scène ; la suppression du vocabulaire et le transport iframe UI Lab relèvent de C. Le modèle et l’écriture restent inchangés ; seule la révision du manifeste fermé change avec les chemins/dépendances. Anciennes racines, reçus et comptes restent attachés à leur outillage ; aucune conversion ou purge.

## Documentation et passation

Storybook reste obligatoire : vrais composants React, propriétés, exemples, états, règles d’usage et tests. Il consommera les mêmes fixtures et valeurs enregistrées ; son retrait d’édition est prévu en F après qualification. Les builds de consultation ne donnent aucun accès au writer. L’assistance Codex reste optionnelle, sans connexion ou inférence implicite.

## Alternatives et preuves

Déplacement global et duplication d’éditeur écartés au profit d’une extraction avec adaptateur temporaire. L’iframe Storybook embarquée est écartée car elle conserverait la dépendance. La preuve de B combine tests du socle sans Storybook, tests serveur/récupération sur copie, interactions de l’ancien hôte et builds. L’autonomie de l’atelier entier reste à démontrer en C/D.

## Matrice de reprise A/B

| Capacité conservée | Source après extraction | Preuve prévue / reprise |
| --- | --- | --- |
| Button, Field/SelectField, Notice/Panel et états | `components/*.examples.tsx`, `Button/Button.examples.tsx` | Stories utilisant les mêmes args/renders ; parcours de sélection/états en B, sélection autonome en C. |
| Fondations, catalogues et scènes composites | `Foundations.examples.tsx`, `MigrationFixtures.examples.tsx`, `ui-lab/ControlStates.examples.tsx` | Fixtures communes ; catalogues consultables, pas de nouvelle édition. |
| Brouillon, annulation et conflits | `editor/session.ts`, `rebase.ts`, `assisted.ts` | Tests de session, rafraîchissement, usages et retour ; interface UI Lab en C. |
| Projection, unités et contraste | `editor/Preview.tsx`, `protocol.ts`, `value-tools.ts` | Canal fourni par hôte ; accusés/session/rendu conservés ; transport UI Lab en C. |
| Bootstrap, sauvegarde et récupération | `scripts/design-editor/{local,bootstrap,http,store}.mjs` | Gardes HTTP, concurrence et pannes injectées sans CLI Storybook ; raccordement applicatif en D. |
| Assistance optionnelle | `editor/assisted.ts`, `scripts/design-editor/{assistance,codex}.mjs` | Tests simulés sans connexion fournisseur ; activation du nouvel hôte en D. |
| Passation | Stories, Docs et composants existants | Builds séparés ; Storybook reste raccordé provisoirement, nettoyage F après E. |

Les métadonnées littérales `id`/`title` restent dans les adaptateurs de stories : l’indexeur CSF ne résout pas ces valeurs à travers un module importé. Elles ne sont pas requises par le moteur. Les exemples communs conservent leur définition d’origine pour préparer les scènes UI Lab.

## Réalisation C

C livre /ui-lab et /ui-lab/preview ; la démonstration antérieure reste sous /ui-lab/reference. Navigation native, catalogue consultatif, sélection des points préparés, brouillon local/partagé, réutilisation, rétablissement, mesures et outils déterministes. Portée sémantique nouvelle et connexion IA attendent D ; aucune création manuelle de catalogue ni comparaison réintroduite. Édition persistante volontairement inactive, même en développement.

Les deux contextes lisent le snapshot public sans capacité HTTP. Le canal iframe vérifie origine, fenêtre source, identité de montage et événement fermé ; les schémas de projection vérifient génération, session, sonde, rendu et séquence. storyId reste le nom historique du champ de corrélation, contenant exclusivement une identité de scène, sans index Storybook. Les générations externes sont relues périodiquement avec résolution des conflits, sans sauvegarde ou rebase silencieux.

La notification complète du participant Vite devient un événement de génération. Les pages ordinaires se rechargent ; l’atelier et son aperçu conservent leur session et relisent la génération. Un changement de code ou un rechargement manuel peut toujours perdre le brouillon, avec garde de fermeture ; ce n’est pas une persistance du brouillon. Sur mobile l’aperçu hors écran conserve ses dimensions pour les mesures, sans être interactif lorsque les réglages sont affichés.

26 tokens de composition propres à l’habillage, sans nouvelle intention sémantique artificielle, sont ajoutés à ui-composition.yaml ; les autorités produit existantes restent inchangées. Le manifeste v14 couvre les nouveaux consommateurs et routes. Conserver les anciennes racines et reçus : aucune actualisation d’instance existante ou conversion de journal autorisée par C.

## Réalisation D

Le lancement `scripts/ui-lab-local.mjs` active explicitement le plugin Vite de développement : port loopback exact, capacité aléatoire et identité de racine. Le service commun est installé avant le participant de lecture ; les requêtes API ne détiennent aucune réservation de lecture de leur propre transaction. Bootstrap SSR sur le seul document `/ui-lab`, sans cache ; les autres pages, l’aperçu et le runtime compilé ne reçoivent pas de capacité. Le client ne consulte pas son parent. Le renouvellement après redémarrage exige la même identité de racine, sinon le brouillon est conservé sans réémission.

Le service transactionnel est importé nativement au moment du démarrage, hors du graphe de configuration Vite : une modification de dérivé ne redémarre pas son propre writer. Le cycle de fermeture libère observer, assistance et store ; les notifications de génération suivent la publication complète. État inconnu verrouillé, statut et réessai avec le même identifiant ; source concurrente résolue explicitement.

L’assistance conserve le connecteur commun et son compte privé par installation. Connexion sur clic, interprétation sur action distincte, proposition vérifiée et application explicite avant Enregistrer. Aucune connexion ou inférence fournisseur implicite. Le mode déterministe reste autonome. Storybook n’active plus le writer par défaut ; le mode de compatibilité historique exige ADL_STORYBOOK_LEGACY_EDITOR=1 et reste soumis au verrou unique. E/F restent distinctes.

Manifeste v15 ; pas de changement de modèle/protocole de sauvegarde ou de valeurs produit. L’image runtime ne copie pas le helper de bootstrap d’édition ; le build ne contient ni writer ni capacité. Préserver les anciennes racines et leurs reçus, sans migration en place.

## Réalisation F

L’addon et ses outils/panneaux, le décorateur de projection et son canal Storybook, le bootstrap manager et l’ancien middleware writer sont retirés. Les catalogues des stories consomment directement TokenCatalog ; composants, exemples React partagés, IDs de stories et Docs conservés. Les métadonnées de cibles communes aux fixtures restent des données de scène UI Lab ; aucune API Storybook ne les interprète pour éditer.

Storybook ne peut plus activer le service d’édition, même sous l’ancien indicateur de compatibilité. Son lanceur retire les variables de capacité/identité et n’importe plus le bootstrap. Le socle client ne lit plus de capacité dans le DOM/parent et n’offre plus le renouvellement historique à `/` : seul le port explicite de l’hôte, fourni par UI Lab, autorise le transport. Le document atelier reste seul propriétaire de sa capacité.

Le participant de lecture commun est réutilisé par le serveur documentaire Vite, avec rechargement complet après publication cohérente. Il bloque les lectures pendant une transaction/reprise ambiguë et refuse l’API d’édition et les chemins privés ; il n’instancie ni store writer, ni agent, ni observateur d’assistance. UI Lab conserve sa notification de génération sans rechargement destructeur du brouillon.

Manifeste fermé v16 : suppression des dépendances mortes de l’addon et de ses configurations, maintien des consommateurs documentaires utiles au calcul de révision. Modèles/protocole de sauvegarde, dix sources de valeurs et sept dérivés inchangés. Les anciennes racines/reçus restent attachés à leur version ; aucune conversion/purge ou actualisation de recette. Les anciens tests manager sont retirés ; leurs parcours métier encore livrés sont contrôlés dans UI Lab, dont sauvegarde, propagation interlecteurs et interruption/récupération réelle.

Le [bilan F](../reviews/ds-edit-64-f.md) consigne les contrôles exécutés et limites ; acceptation visuelle, reprise par un tiers et J4/J5 demeurent distincts. La suppression de l’addon n’autorise aucune suppression de fichier non suivi, publication, compte ou migration de données.

## Adaptation des contrôles Apparence — DS-EDIT-65

Le mandat suivant reprend dans UI Lab la présentation et les interactions d’Apparence de 34e0aec : composants de présentation locaux sous `src/ui-lab/editor`, logique de brouillon/assistance/écriture toujours dans le socle commun. Aucun manager, thème, canal ou API Storybook importé. Le cycle de vie et le transport restent ceux de l’atelier autonome ; les liens d’usages portent des identités de scène et de binding validées à l’ouverture. Les couleurs et dimensions de l’habillage consomment des tokens de composition, distincts des réglages projetés.

Le manifeste v17 inclut explicitement les quatre nouveaux composants de présentation et leur feuille de styles ; modèle produit et protocole de sauvegarde inchangés. Une nouvelle recette avec cette version repart de sources enregistrées compatibles, sans copier les journaux/comptes d’une ancienne racine ni mettre à jour une instance en place. Le retour de recette Storybook demandé séparément reste une opération locale, sans annuler F dans le kit canonique ni synchroniser deux versions d’éditeur.


## Mise à jour UI-MAC-02 — 11 novembre 2026

Sur demande explicite du porteur, la page `/ui-lab/reference` et son lien sont supprimés. Ses sections historiques ci-dessus ne décrivent plus une route livrée. Les preuves de relecture utilisent l’atelier et son aperçu, et les exemples partagés restent documentés dans Storybook. Le compte UI Lab est accessible par Loomata → Compte Codex… sur macOS, et par le menu Compte Codex dans le navigateur. Cette modification de présentation n’ajoute ni writer ni accès fournisseur ; la connexion exige toujours une action explicite. Voir [UI-MAC-02](../work-items/ui-mac-02-quiet-workspace.md).
