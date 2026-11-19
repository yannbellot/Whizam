# UI-FINAL-01 — Campagne technique historique

> **Périmètre corrigé le 10 novembre 2026 après retour explicite du porteur.** Ce rapport décrit un exercice de création de Prêts d’objets, réalisé à la suite d’une mauvaise interprétation. Il ne qualifie pas la livraison demandée de **Loomata**, l’application qui doit réunir les outils. La conclusion « UI-FINAL-01 réalisé A–F » est retirée pour le produit. Les tests et correctifs restent des preuves auxiliaires ; les liens de démonstration ci-dessous sont historiques. Les seuls services de cet essai ont été arrêtés après la correction ; sources et volume de données sont conservés. Autorité courante : [fiche corrigée](../../work-items/ui-final-01-complete-assisted-cycle.md) et [intention produit](../../product/loomata-workspace.md).

## A — Périmètre figé le 10 novembre 2026

Mandat : « Exécute le chantier UI-FINAL-01 en commençant par la tranche A. » Base `2a33970`, branche `codex/execute-ui-final-01`. Les tranches A–F sont autorisées dans leurs dépendances ; leur qualification n'est pas déduite de la préparation. [Fiche](../../work-items/ui-final-01-complete-assisted-cycle.md).

Mode retenu : assistant Codex actuel, dans cette conversation, pour cadrer, produire et corriger les vrais fichiers d'une application dérivée. Aucun nouvel appel de fournisseur, compte ou jeton n'est requis pour qualifier ce mode ; le chat intégré AGENT-CHAT-01 reste séparé. Les échanges et changements du projet seront journalisés ; cela ne prouve pas une intégration IA dans UI Lab.

Témoin figé : Prêts d'objets, données synthétiques. Inventaire filtrable par disponibilité, formulaire d'ajout (titre/catégorie), fiche avec prêt à un alias fictif et restitution. Titre et alias obligatoires, un seul prêt actif par objet garanti par PostgreSQL, retour idempotent/refus explicite d'un état périmé. Trois pages réelles, aucun `/projects` du starter présenté comme résultat. Reprise persistante et composants Storybook du projet requis. Les hypothèses de style sont réversibles et réservées à la recette humaine.

Ressources constatées en lecture seule : Node `24.22.0`, npm `11.19.1` (compatible avec les engines déclarés, différent du packageManager documentaire `11.8.0`), Docker serveur `29.8.2`, image PostgreSQL `18.6-bookworm` présente, dépendances et navigateurs Playwright locaux disponibles. Le binaire réel de navigateur et les versions de campagne seront consignés dans la preuve d'exécution. Pas d'installation globale ni de mise à jour de dépendances prévue.

Ressources à créer : copie QA et projet dérivé séparés dans `.local/ui-final-01/`, ports alloués et PostgreSQL/volume/réseau étiquetés avec une identité unique. Ancienne recette CORE-01 53196/53197 et autres recettes non ciblées. Les copies sont issues des fichiers suivis par Git ; dépendances préparées réutilisées par copie, provenance annoncée, pas de promesse de zéro-installation ou de nouveau npm ci.

L'application métier utilise un serveur compilé et PostgreSQL dédié. UI Lab et Storybook gardent leurs deux processus sans DB et un seul writer. Arrêter les seuls services propriétaires avant génération/build ; la relecture du build après modification DS n'est pas du hot reload du site.

## Inventaire des fonctions et priorités A

| Fonction / surface | État constaté | Recette / suite |
| --- | --- | --- |
| Navigation, recherche, scènes et catalogue DS | Implémentés ; non rejoués pour ce candidat à ce stade | B : desktop/mobile, scènes préparées, retour après navigation |
| Valeur, portée locale/partagée et validation | Implémentées ; non rejouées | B/D : vraie saisie, refus, impact exact et pas de nouveau style par simple égalité de valeur |
| Aperçu et annulation | Implémentés ; non rejoués | B/D : brouillon réversible, navigation, confirmation et conservation |
| Sauvegarde/relecture et reprise | Writer transactionnel existant | B/D/E : vrais fichiers, redémarrage, erreurs et refus |
| Storybook documentaire | Lecteur existant | D : déjà ouvert avant la sauvegarde, sans capacité d'écriture |
| Rendu métier avec données | Exemple Projects uniquement | C : nouveau domaine, nouvelles règles/tests PostgreSQL ; exemple conservé hors parcours du dérivé |
| Application / atelier / Storybook simultanés | Le superviseur efface DATABASE_URL | Trois accès distincts ; pas d'assouplissement implicite du superviseur |
| Dossier autonome | CORE-01 qualifié historiquement | E : nouvelle extraction, chemin avec espaces, données traitées séparément |
| Chat général, project.create, ZIP et packaging | Non livrés par ce chantier | Exclus, aucune simulation ni bouton factice |

P1 documentaire confirmé : la fiche UI-FINAL-01 cite la recette globale du lab par un lien hors du kit ; remplacer ce lien par la passation autonome livrée. Aucun défaut runtime bloquant/majeur n'est affirmé sans reproduction. P2 de provenance : npm réellement disponible diffère du libellé packageManager ; respecter les engines, consigner la version, ne pas modifier le verrouillage pour cette campagne.

## Matrice de qualification

Tous les critères sont initialement **non exécutés** pour ce candidat. Les acquis antérieurs restent historiques.

| Critère | Preuve requise | État A |
| --- | --- | --- |
| AC-01 | Versions, SHA, ressources et génération identifiés | Préflight réalisé ; identité de campagne à compléter |
| AC-02 | Travail Codex réel, brief et changements tracés | Mode et brief figés ; réalisation à venir |
| AC-03 | Ajout/prêt/refus double prêt/restitution/filtre, persistance | À réaliser C |
| AC-04 | Refus et erreurs utilisables, saisie conservée | À rejouer B/C |
| AC-05 | Atelier complet au périmètre | À rejouer B |
| AC-06 | Brouillon/annulation sans modification des sources | À rejouer B/D |
| AC-07 | Sauvegarde locale/partagée durable | À rejouer D/E |
| AC-08 | Storybook à chaud et Application reconstruite concordants | À réaliser D |
| AC-09 | Lecteurs et refus d'écriture/concurrence protégés | À rejouer B/D |
| AC-10 | Reprise sans perte/double exécution | À réaliser E |
| AC-11 | Desktop/mobile/clavier/accessibilité | À rejouer B/C/F |
| AC-12 | Dossier indépendant avec données explicitement traitées | À réaliser E |
| AC-13 | Retour de revue réellement attribué et correction | À réaliser D/F |
| AC-14 | Passation sans conversation, limite tiers explicite | À réaliser F |

Niveau retenu : GPT-6.1 Sol · Élevée, analyse de préparation réutilisée à périmètre inchangé ; aucun réglage du client prétendu modifié. Procédures implement-feature, design-interactions et test-user-flow ; initialisation du seul nouveau témoin avec initialize-project. Revues séquentielles, même agent, non indépendantes.

**Sortie A : périmètre, priorités, ressources et matrice figés.** Aucun test applicatif exécuté dans A ; la qualification B–F commence ensuite. Pas d'acceptation humaine globale, de publication ou de modification des anciennes recettes. Doc updated.

## Résultat historique B–F — périmètre de l’exercice uniquement

Le candidat final du kit et le commit du témoin sont identifiés dans [qualification.json](qualification.json) et [source-manifest.json](source-manifest.json). Ces résultats concernent l’exercice historique, sans qualification ni acceptation de l’application Loomata. CORE-01 reste clos ; aucune clôture de J4/J5 ni livraison des distributions finales n'est déduite de ce cycle.

### B — Correctifs canoniques et contrôles

Le cycle a révélé des défauts dans les preuves et le guide de remplacement : chemins URL mal décodés dans deux tests sur un dossier avec espaces ; assertion E2E lisant l'ancienne autorité YAML ; déclaration TypeScript absente pour le lecteur DTCG ; test négatif de frontière injecté dans l'ancienne route home ; tests d'affectation et de migration supposant la couleur initiale du starter. Les correctifs lisent l'autorité courante ou rejouent l'entrée historique de migration. Le test négatif injecte toujours un import serveur réel, dans la route racine obligatoire, et vérifie son refus. Aucun test obligatoire n'a été retiré ou marqué skipped pour faire passer le dérivé.

Le remplacement de l'exemple a aussi laissé des chemins supprimés dans le manifeste fermé du writer. Le guide canonique exige désormais sa mise à jour explicite ; le témoin déclare ses nouveaux consommateurs et retire les sept chemins absents. Le contrôle de révision et les refus d'accès restent actifs. Une tentative d’ajouter la déclaration réservée aux tests à ce manifeste a volontairement bloqué les reçus précédents ; cet ajout sans rôle runtime a été retiré et le manifeste antérieur restauré à l’identique. Les reçus/verrous ont été conservés et le redémarrage normal a réussi. Le guide précise désormais de préparer la liste avant la première sauvegarde, sans convertir/purger d’anciens reçus. Pas de découverte globale, de fichier manquant ignoré ou de second writer introduit. Le starter conserve son propre exemple.

Campagne QA : **149 tests unitaires, 113 tests DS, 66 tests serveur, 34 parcours atelier, 18 persistants, 18 Storybook et 12 E2E génériques réussis**. Les suites persistantes contiennent aussi des simulations déclarées du service d'interprétation optionnel ; elles ne prouvent pas un appel IA réel. La preuve du mode assisté de ce chantier est le travail Codex externe sur les fichiers du témoin. Types/lint/format/frontières et validation du kit réussis ; commandes, copies et retests dans la qualification. Les modifications finales des contrôles de source ont été requalifiées sur le candidat et le dérivé.

### C — Travail assisté et métier réel

Le projet Prêts d'objets a été initialisé, cadré puis codé par Codex dans le présent mandat. Le [patch intégral du témoin](witness.patch) conserve brief, schéma/migration Drizzle, nouvelles routes, repository, gardes, composants/stories et tests. Il contient une vraie implémentation PostgreSQL : inventaire filtré, ajout validé, prêt à un alias synthétique, restitution et un index unique partiel empêchant deux prêts actifs par objet. L'exemple Projects n'est plus un accès utilisateur ; ses migrations/table sont conservées sans opération de suppression de données.

[Parcours métier réel](business-qualification.json) : validation serveur avec saisie conservée, ajout/prêt/rechargement/restitution, filtre, annulation sans écriture, deux requêtes concurrentes produisant 303 et 409 avec une seule ligne active en SQL, UUID invalide/inconnu, origine étrangère et champs inattendus refusés. Une panne de la seule base propriétaire conserve le formulaire ; après rétablissement, la reprise explicite crée exactement un objet. React Router refuse certaines origines en 400 avant la garde applicative 403 : les deux refus sont reconnus et aucune protection n'est assouplie.

Les tests métier livrés (`npm run test:loans`) démarrent leurs propres ressources étiquetées, migrent, exécutent **six parcours sur deux formats puis deux vérifications après redémarrage**, et nettoient leurs seules ressources. La campagne finale réussit sur la copie source sans Git ; PostgreSQL du témoin de revue reste distinct. Aucune donnée personnelle ni appel de fournisseur n'est nécessaire.

### D — Boucle DS et retours de revue

[Assertions du cycle](ds-cycle.json) : brouillon `#123456`, aperçu effectif et annulation confirmée sans modification de l'autorité ni du Storybook déjà ouvert ; sauvegarde locale `#234567` ne changeant que le binding existant sélectionné ; sauvegarde partagée finale `#456789` avec relecture. Les consommateurs dont la valeur change correspondent au graphe antérieur du style, plus le composant explicitement rattaché : deux Component Tokens de fond de bouton et deux décisions d'action. Aucun autre token existant ne change de valeur. Les nouveaux primitifs d'édition restent traçables.

Storybook a suivi les sauvegardes **à chaud, sans navigation/rechargement commandé par le pilote**. Après arrêt des services propriétaires, l'application et Storybook ont été reconstruits ; l'application métier sert la même couleur sur « Prêter cet objet » et « Ajouter un objet ». Cette relecture du build **ne constitue pas un hot reload du site**. Storybook et le serveur Application ne possèdent pas la capacité d'écriture DS ; les refus ont été rejoués. Les suites serveur/persistantes couvrent aussi conflits, réponse perdue et reprise transactionnelle.

Retour attribué au rôle Design Reviewer, exercé séquentiellement par le même agent, non indépendant : les blocs confirmation/fiche/action se touchaient sur mobile ; une panne d'inventaire aboutissait à une erreur trop générique ; le pied de Storybook conservait l'identité du starter. Le Builder a réutilisé l'espacement existant, ajouté une erreur 503 explicite avec reprise GET sans rejeu de POST, et corrigé le libellé du seul dérivé. [Retests des deux corrections de parcours](review-corrections.json) et captures finales concordants. Le choix visuel final est une hypothèse réversible, pas une décision du designer.

### E — Reprise et sources indépendantes

Les seuls services du témoin ont été arrêtés. Le dossier a réellement été renommé de `project with spaces` en `loans project renamed`, sa configuration réparée par la procédure existante, puis ses services relancés. Même conteneur/volume/base ; **égalité de toutes les lignes objets/prêts avant/après**, quatre objets et trois prêts synthétiques, même SHA-256 DTCG. De nouveaux GET n'ont rejoué aucune écriture. [Vérification finale des accès et de la base](final-browser.json).

Une extraction source distincte ne contient ni `.git`, ni `.env.local`, ni reçu d'édition, ni identité de supervision copiée. `GIT_CEILING_DIRECTORIES` empêche la découverte du dépôt parent ; Git y échoue effectivement. Validation du kit, format, types, lint, frontières, 149 unités, 113 DS, 66 serveur, deux builds et huit tests métier/reprise réussis dans cette copie. Les états locaux créés ensuite par ses propres contrôles ne proviennent pas de la recette précédente. Node, dépendances et navigateurs préparés ont été réutilisés ; ce n'est pas une preuve de nouvelle installation npm ci ni de zéro-installation.

Le [manifeste source](source-manifest.json) identifie la base exacte du témoin, ses commits et les empreintes de chaque fichier/lien relatif. Le patch est rejoué sur cette base, puis tous les fichiers comparés à l'identique. **Les sources ne contiennent pas les données PostgreSQL** : le déplacement de la même instance conserve explicitement leur identité ; une nouvelle copie commence avec une configuration/base neuve ou une sauvegarde/restauration distincte et autorisée.

### F — Revues et limites

Revues design, technique et sécurité ciblée **séquentielles, même agent, non indépendantes**. Lecture du diff réel, des règles HTTP/validation, schéma/index, routes/repository, writer/lecteurs et reprise ; tests négatifs locaux réels. Aucun défaut bloquant/majeur connu restant dans ce périmètre après les corrections et retests. Ce constat n'est ni un audit exhaustif, ni une certification d'accessibilité, ni une qualification d'hébergement distant : l'application reste locale avec données synthétiques.

Formats exécutés : 1280×800 et 390×844 sous Chromium, noms accessibles, saisie/clavier, absence de débordement et états d'erreur/reprise. Les captures ont été relues. Aucun mobile physique, VoiceOver complet, redémarrage du Mac ou développeur tiers n'est déclaré qualifié par cette campagne. La reprise sans conversation est documentée et rejouée par l'agent ; la recette humaine reste à recueillir.

### Matrice finale

| Critère | Résultat technique et preuve |
| --- | --- |
| AC-01 | Qualifié : versions/commits, génération et ressources dans qualification/manifeste. |
| AC-02 | Qualifié au mode externe : brief, décisions et vrais changements Codex dans le patch ; aucun chat intégré prétendu. |
| AC-03 | Qualifié : métier HTTP/SQL réel, concurrence, filtres, prêt/restitution et reprise. |
| AC-04 | Qualifié : validation conservant les champs, annulation, panne et reprise GET explicite. |
| AC-05 | Qualifié au périmètre A : suites atelier et démarrage du témoin avec contrôles actifs. |
| AC-06 | Qualifié : annulation confirmée, même empreinte d'autorité et lecteur inchangé. |
| AC-07 | Qualifié : sauvegardes locale/partagée relues, portée exacte, valeur après redémarrage. |
| AC-08 | Qualifié : Storybook déjà ouvert à chaud, application reconstruite avec le même choix. |
| AC-09 | Qualifié localement : lecteurs sans writer, capacité/origine/conflits et reprise testés. |
| AC-10 | Qualifié : mêmes lignes et autorité après arrêt/déplacement ; aucun rejeu sur GET. |
| AC-11 | Qualifié sur formats émulés et périmètre clavier testé ; accessibilité exhaustive non affirmée. |
| AC-12 | Qualifié après prérequis : source sans Git/privé et tests métier isolés ; identité des données traitée séparément. |
| AC-13 | Qualifié : retours attribués à l'agent Reviewer, corrections/retests et accès conjoints vérifiés ; acceptation humaine distincte. |
| AC-14 | Qualifié pour une reprise agent : README/brief/suivi et reconstitution source ; développeur tiers non vérifié. |

### Reprendre ou examiner

La recette locale utilise trois accès : Application métier compilée, UI Lab writer et Storybook lecteur. Leurs adresses effectives et l'emplacement de travail ignoré sont consignés dans `qualification.json` ; elles ne sont pas des services hébergés. Demander à l'assistant « relance la recette UI-FINAL-01 » ou « arrête uniquement la recette UI-FINAL-01 » ; il doit lire l'état privé `.local/ui-final-01/current.json`, contrôler les identités des processus et l'étiquette de la base, puis utiliser les opérations existantes. Ne pas arrêter les anciennes recettes CORE-01/LOCAL-APP-01 ni supprimer un volume.

Pour reconstituer les seules sources, utiliser [replay-witness.py](replay-witness.py), Python 3.12+ et Git, avec `--repository` pointant vers le clone de fabrication conservant le commit de base, et `--destination` vers un nouveau dossier inexistant dont le parent existe. Le script vérifie le patch, extrait le kit épinglé, applique le diff sans Git parent et compare les empreintes ; il ne configure ni Node, dépendances, services, comptes ou base. Une fois créé, le projet s'utilise sans ce dépôt via son README et ses prérequis. Cela ne livre pas `project.create`, un export ZIP ou une distribution prête à lancer.

Première revue humaine : examiner ensemble Application et Storybook — Carte objet (Disponible/Prêté), ajouter/prêter/restituer un objet synthétique, puis contrôler le DS dans UI Lab. Les services de cette seule recette sont laissés accessibles pour cela ; pas de lancement à l'ouverture de session. Accepter le choix visuel, l'ergonomie et les limites avant une clôture humaine. Prochaine étape de la feuille de route, après stabilisation acceptée : préparer `project.create` sur le cœur commun, puis `project.export`/`tool.export`. Chat intégré, sauvegarde GitHub, enveloppe macOS finale et runtime embarqué restent des chantiers distincts.

Aucune publication, installation globale, connexion IA ou écriture dans une ancienne recette. Les préexistants hors périmètre sont conservés. **Doc updated.**
