# Loomata — périmètre fonctionnel du MVP

**Version :** 2.0 — 12 novembre 2026. **Statut :** périmètre fonctionnel et séquence validés par le porteur ; réalisation à qualifier. [Décision 033](../decisions/033-loomata-mvp-scope-and-sequence.md). Cette référence remplace le cadrage courant à trois vues ; les anciennes preuves restent attachées à leurs versions.

## Intention et limites

Loomata est l’application locale de conception et de pilotage du développement avec des agents IA, destinée notamment aux designers. Elle permet d’explorer, comprendre, modifier et réaliser son application par des représentations visuelles et fonctionnelles. Le starter, le design system et Storybook sont ses ressources ; les applications créées sont des résultats distincts, dans leurs propres dossiers. Une démonstration métier ne remplace pas Loomata.

Le MVP prend en charge les projets créés avec Loomata, leur réouverture et leur évolution, sur une architecture de référence et des conventions maîtrisées. Il n’adopte pas des projets hétérogènes préexistants. Le dossier choisi par l’utilisateur reste hors du bundle de l’outil. La stack locale existante est conservée ; cette révision ne décide pas d’un nouveau backend, d’une nouvelle base ou d’une nouvelle architecture d’exécution.

**Codex est le seul fournisseur agentique intégré au MVP.** Claude, le changement de fournisseur et le transfert de conversations sont reportés. Les adaptations multi-assistants du kit restent conservées sans engagement d’intégration à Loomata.

## Plateformes et formats pris en charge

Loomata et ses outils sont desktop uniquement, selon la [décision 032](../decisions/032-desktop-only-interface.md). Vérifier les tailles de fenêtres, le clavier, le focus et le défilement ; aucun support mobile à fabriquer. Les formats des projets créés sont définis par leur propre brief.

## Quatre espaces de travail

### Interface & Design System

Le menu unique du UI Lab réunit **Pages**, pour explorer la composition réelle et descendre de page en pattern, composant et sous-élément, puis **Design System**, pour ouvrir les primitives, les décisions, les composants et les patterns.

Colonne gauche : arborescence et changement de mode. Centre : rendu visuel, exploration et sélection. Colonne droite : inspecteur des propriétés de style en haut, micro-chat contextualisé en bas. Storybook conserve la documentation des composants ; un exemple préparé n’est pas une preuve d’exploration des pages réelles.

Une modification de token expose ses consommateurs connus. Dans l’inspecteur du UI Lab, la page ouverte détermine la destination et la sélection désigne la cible exacte. Sur la page d’un composant, modifier sa partie propre change sa définition et ses usages qui héritent du réglage. Un composant imbriqué dans cette page reçoit une surcharge à son emplacement dans la définition parente. Dans une page du site, la surcharge s’applique uniquement à l’instance sélectionnée et à la partie ou au placement choisi. L’état choisi détermine quand la valeur s’applique. La création et l’affectation explicites de variantes réutilisables restent des opérations distinctes. [Règle et recette](../work-items/wysiwyg-02-contextual-editing.md).

Les gestes d’inspecteur déterministes n’appellent pas systématiquement Codex. Les modifications et demandes en langage naturel utilisent le moteur commun décrit plus bas. Les valeurs/références des tokens restent dans le JSON DTCG ; règles, présentations et recettes gardent leurs propriétaires YAML selon le [contrat d’autorité](../../src/design-system/authority/README.md). Le registre de correspondances ne devient pas une seconde autorité de valeurs.

### User Flow

Graphe orienté interactif des interactions utilisateur–système, navigations, conditions, boucles, retours et entrées/sorties de données. Arborescence à gauche ; graphe navigable avec nœuds repliables au centre ; description en langage accessible et liens Markdown, dont ancres, à droite en haut ; micro-chat en bas.

Le graphe sert à explorer et sélectionner. **Les modifications fonctionnelles passent exclusivement par le micro-chat**, sans édition directe des nœuds et relations. Elles suivent le moteur commun et les modes instantané/planifié.

Distinguer **prévu**, **réalisé** et **vérifié** : intention adoptée, implémentation identifiée, puis contrôle réussi sur une version identifiée. Une interaction Figma non adoptée reste une proposition. Une modification ultérieure invalide les preuves affectées. Aucune exhaustivité du comportement n’est inférée automatiquement depuis du code libre ; les informations non reconnues ou non vérifiables sont signalées.

### Planification

Roadmap structurée par chantiers et tâches. Les demandes planifiées rejoignent la rubrique « Tâches » en attente. **« Traiter la liste »** lance leur qualification et répartition dans des chantiers existants ou nouveaux. Cette opération ne lance pas les chantiers : leur démarrage est une décision explicite de l’utilisateur.

Une modification instantanée apparaît immédiatement dans la roadmap comme brouillon, sans catégorie de chantier, avec un traitement visuel provisoire, et dans une rubrique dédiée. Au commit, les modifications concernées sont regroupées avec les tâches associées dans un chantier, positionné à la date du commit. Préserver les rattachements antérieurs et les liens multiples, sans dupliquer les tâches ni imposer une relation chantier/commit un à un.

Loomata peut proposer un commit selon l’accumulation, la cohérence, la portée, les risques ou les nouvelles tâches. Une proposition ne vaut pas exécution. À droite : périmètre de l’élément sélectionné et liens Markdown/ancrages en haut, micro-chat en bas.

| Objet | Sens |
| --- | --- |
| Demande | Intention exprimée par l’utilisateur. |
| Tâche | Travail identifié à réaliser. |
| Modification | Changement effectivement apporté au produit. |
| Commit | Enregistrement de modifications dans Git. |
| Chantier | Regroupement de tâches. |

Une demande peut produire plusieurs tâches, un commit plusieurs modifications et un chantier plusieurs commits ; les liens et leurs versions doivent rester interprétables après reprise.

### Agents IA

Espace Codex avec conversations générales librement créées et conversations contextualisées initiées depuis les trois autres espaces. **Une seule conversation persistante par élément** ; elle est retrouvée depuis sa sélection ou l’espace Agents IA. Un renommage ne perd pas son historique. Les échanges sont reliés aux éléments, demandes et modifications concernés ; le contexte transmis inclut la cible, la portée et la version courante, pas seulement un nom.

Respecter autant que possible les usages habituels de Codex : progression, questions, propositions, autorisations, interruption et reprise. Les interfaces documentées du fournisseur sont adaptées au moteur commun. Le [chat actuel](agent-chat.md) est borné ; la cible ne supprime pas ses protections ni n’active des commandes arbitraires par cette seule spécification.

### Accès natif au compte Codex

Le menu macOS **Loomata → Connecter Codex** déclenche directement le parcours officiel dans le navigateur habituel, sans panneau Loomata intermédiaire et sans changer de vue ou de projet. Il utilise l’URL générée par Codex ; comptes et mots de passe proposés relèvent du navigateur et de son profil. Une tentative ne déconnecte pas préalablement le compte existant ; pendant une inférence, la connexion doit être différée. Les erreurs restent explicites. Une fois la connexion confirmée, le menu affiche **Déconnecter Codex** et une alerte confirme la réussite dans Loomata. Le clic de déconnexion demande confirmation en précisant l’interruption des échanges ; Annuler conserve le compte. Après logout réussi, l’alerte confirme la déconnexion et le menu retrouve Connecter Codex. Un compte déjà connecté au démarrage ne déclenche pas d’alerte de succès. Aucun mot de passe n’est lu par Loomata.

## Micro-chats et moteur commun

Le contexte de sélection est transmis automatiquement ; le designer n’a pas à répéter l’identité de l’élément.

- **Instantané** : explication ou modification immédiatement applicable ; brouillon persistant et réversible, sans workflow complet ni commit systématique.
- **Planifié** : demande conservée, qualification au traitement de la liste, lancement explicite d’un chantier. Une demande instantanée peut y être réorientée si complexité ou risque le justifie.

Inspecteurs, micro-chats, conversations générales et arbitrages Figma passent par une coordination commune : identifier cible et version, déterminer portée, appliquer, conserver le brouillon, permettre l’annulation, tracer et enregistrer ultérieurement dans Git. Les écritures spécialisées conservent leurs garanties : le writer DS ne devient pas un éditeur général de React.

## Brouillon, Git, isolation et aperçu

**Un seul brouillon instantané actif par projet**, persistant après fermeture et récupérable après interruption. L’annulation directe concerne le brouillon. Après commit, un retour arrière se demande à Codex et produit une modification tracée ; pas d’interface de retour aux versions commitées dans le MVP. Restauration des données et retour du code restent distincts.

Les chantiers et le brouillon peuvent avancer parallèlement dans des branches/worktrees isolés. L’aperçu montre **un seul état sélectionné et clairement identifié** : version principale, brouillon ou chantier. Aucun assemblage automatique des travaux en aperçu.

Détecter les conflits techniques (fichiers, diffs, branches/commits) et fonctionnels reconnus (composants, tokens, parcours, règles et dépendances). Rapprocher automatiquement seulement lorsque la compatibilité peut être vérifiée ; une fusion Git réussie ne suffit pas à démontrer la compatibilité fonctionnelle. Préserver toutes les versions et demander un arbitrage pour les ambiguïtés. Aucun écrasement silencieux.

Git porte les sources, décisions et traces durables, reconstructibles depuis le dépôt. Une base locale peut porter projections, index et états opérationnels, sans être l’unique détenteur de cette connaissance. Les brouillons non commités ont leur propre persistance locale ; ils ne sont pas reconstructibles depuis les seuls commits. **Les conversations complètes restent dans le stockage local privé de Loomata**, hors Git et des exports source. Versionner les décisions utiles et leurs liens, sans publier les échanges ni les identifiants d’accès. Commit et intégration dans la branche principale sont distincts.

## Contrôles et intégration

Contrôles automatiques proportionnés : modification locale simple immédiatement applicable et annulable ; modification partagée avec impacts et contrôles ciblés ; modification fonctionnelle avec vérifications adaptées, éventuellement différées. Un brouillon peut être visible avant la fin des contrôles. Afficher séparément appliqué, en vérification et validé.

Le mode de validation est indiqué dans le chantier avant lancement. L’intégration est automatique pour un changement **non critique** sans effet visible si ses critères et contrôles sont satisfaits ; elle peut aussi l’être après une validation **E2E explicitement choisie**, couvrant des critères effectivement automatisables et réussie sur la version à intégrer. Une appréciation esthétique reste humaine si elle ne possède pas de critère objectivement vérifiable. Les autres changements visibles sont présentés à l’utilisateur avant intégration.

Arbitrage humain obligatoire pour suppression/transformation de données difficilement réversible, modification des règles d’accès/sécurité/confidentialité, ajout d’un accès/service/coût non prévu, changement matériel du périmètre ou de l’architecture et conflit aux conséquences incertaines. Cette règle est prioritaire sur l’automatisation. Un changement fonctionnel ordinaire déjà autorisé n’est pas critique par sa seule nature. L’échec d’un contrôle obligatoire suspend l’intégration et les dépendances concernées.

Ces règles sont des comportements du produit ; elles ne remplacent pas les règles de fabrication du lab, l’acceptation humaine finale ou une autorisation distincte de publication.

## Références Figma et réconciliation

**Complément approuvé le 14 novembre 2026 :** l’aperçu de référence est automatique à la sélection, au format SVG avec texte vectorisé, dans une colonne centrale réservée à l’image et aux commandes − / pourcentage modifiable / + fixes à 8 px ; le zoom choisi est conservé entre sélections et chaque élément est automatiquement recentré ; le panneau gauche présente les calques en arborescence dépliable ; le point d’entrée **Figma** appartient à **UI Lab → Design System**, avec remplacement contextualisé conservé depuis une occurrence ; la [décision 034](../decisions/034-figma-component-import.md) et le [contrat FIGMA-IMPORT-02](../work-items/figma-import-02-component-workflow.md) élargissent la lecture au fichier exploré en overlay et l'import aux pages/composants complets, variantes et dépendances. Seules les valeurs visuelles effectives sont exploitées ; la logique des variables Figma est ignorée et Loomata conserve l'autorité sur ses primitives/tokens. Import provisoire inspectable, réutilisation sans doublon et annulation ciblée ; remplacement incompatible fonctionnellement refusé sans forçage (Bouton → Champ). Le chemin déterministe est réalisé : explorateur, proposition React réelle, valeurs DTCG, réutilisation, remplacement contrôlé et annulation ; [couverture qualifiée et limites](../reviews/figma-import-02/README.md). Les structures hors de la famille prise en charge deviennent des demandes d’adaptation ; aucune conversion universelle ni compatibilité de code libre n’est présumée. Les paragraphes suivants décrivent le socle conservé ; la sélection devient l'unité choisie dans l'explorateur du fichier, et non l'unique périmètre lisible.

Capacité incluse au MVP, usage facultatif par projet. **Connexion directe à Figma**, avec gestion des accès, et **actualisation explicite** par l’utilisateur ; pas de connexion par plugin exporteur/package local comme voie livrée. Le mécanisme détaillé et les droits/couvertures API restent à qualifier ; pas de remplacement silencieux si un accès manque.

Récupérer une sélection, sa provenance, son empreinte/version disponible et sa couverture. Rapprocher les éléments avec le projet, comparer référence, état courant et proposition ; arbitrer **conserver, adopter, combiner ou reporter**, avec décisions durables. « Combiner » produit une proposition explicite ; « reporter » bloque ses dépendances mais pas les travaux indépendants.

Créer de nouvelles pages/composants et modifier l’existant, par Codex et un chantier planifié lorsque du développement le nécessite. Les réglages simples pris en charge peuvent rejoindre le brouillon instantané. L’import seul n’écrit pas dans les autorités. Conserver la source précédente et la base projet intégrée séparément pour préserver les variantes et adaptations intentionnelles lors des réimports.

Pas de synchronisation bidirectionnelle ni d’actualisation Figma automatique. L’absence d’un élément dans une sélection ne supprime rien. Les réactions de prototype sont des observations de navigation ; elles ne prouvent pas les règles métier, permissions ou traitements serveur. [FIGMA-RECON-01 adapté](../work-items/figma-recon-01-design-reconciliation.md).

## Synchronisation, vocabulaire et accompagnement

Actualiser automatiquement les représentations Loomata après les modifications reconnues, y compris depuis un chat général. Signaler les conséquences non interprétables, projections périmées ou couverture partielle ; ne jamais les annoncer comme état vérifié. Cela est distinct de l’actualisation manuelle depuis Figma.

Employer le vocabulaire professionnel du design/développement, avec termes français/anglais, synonymes, définitions et conventions. Normaliser la dénomination sans renommer silencieusement une identité source ni imposer un jargon inutile. Reformuler un concept reconnu avec son nom professionnel. Un `glossaire.md` d’autorité fournit les définitions communes ; les termes peuvent apparaître soulignés en pointillé avec infobulle, accessible aussi au clavier.

Codex qualifie la clarté/cohérence, pose les questions qui changent le résultat, formule recommandations et conséquences compréhensibles, explique les actions par les pages, composants, tokens, parcours, tâches et chantiers concernés. Une ambiguïté matérielle ne se résout pas silencieusement.

## Livraison, état réel et réalisation

Même cœur pour l’application macOS et le dossier autonome. Services locaux, Node/npm et dossier de projet restent ceux de l’[architecture commune](../architecture/shared-core.md). Le runtime privé et les exports ont des preuves historiques E ; signature de distribution, mises à jour, autres machines et acceptation finale restent à qualifier. Copier des sources ne transporte ni données de base ni conversations privées.

Les acquis UI Lab, writer DS, sélection de projet, chat Codex borné et exports sont réutilisables. Ils ne démontrent pas le moteur transversal, l’exploration des pages réelles, les variantes, le User Flow, la Planification ou l’import Figma du présent MVP. Les anciennes qualifications ne sont pas étendues à ces fonctions.

Ordre validé : **1. Interface & Design System et Agents IA ; 2. User Flow ; 3. Planification et Agents IA**. Le socle commun est qualifié au début de T1 ; Agents IA existe dès T1 puis s’étend au pilotage en T3. [Préparation et critères](../work-items/mvp-01-three-stage-development.md). Cette séquence n’autorise aucun développement par elle-même.

Hors MVP : Administration (y compris ses interfaces d’édition/configuration), Claude, changement/transfert de fournisseur, adoption de projets hétérogènes, plugin Figma compagnon, synchronisation bidirectionnelle, aperçu combiné automatique et interface de retour aux commits. Le glossaire et les instructions nécessaires restent des ressources, sans écran Administration implicite. Pas de publication, déploiement, nouvelle architecture distante ni garantie de production ajoutés.
