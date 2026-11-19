# UI-ARCH-03 — Première tranche de l’interface Loomata

**14 novembre 2026 — En revue : qualification technique acquise, acceptation humaine différée.** [Bilan, revues et captures](../reviews/ui-arch-03-first-ui-slice.md). Préparation initiale conservée ci-dessous ; elle est remplacée par le mandat d’exécution en fin de fiche. Cible application ; préparation issue du [cadrage UI-ARCH-02](ui-arch-02-common-framing.md), base `5945d0e`. Aucun mandat de code. [Contrat](../architecture/ui-architecture-boundaries.md), [décision 035](../decisions/035-ui-architecture-boundaries.md).

## But et prérequis

Qualifier DTCG → Tailwind et React Aria dans un parcours existant, sans refaire toute l’interface ni modifier la présentation des composants du projet. Conserver Swift/AppKit/WKWebView, le cœur Node et la logique du writer. Première qualification desktop à 1280 × 800 et 1440 × 900, avec fenêtre minimale actuelle vérifiée pour le défilement ; pas de recette mobile de Loomata. Formats proposés réversibles, sans modification des dimensions de fenêtre native.

Avant code : mandat distinct, état Git/recette relu, alignement prescriptif de la décision 035 couvert, versions et compatibilité React/Tailwind/React Aria vérifiées, source et copie de qualification identifiées. La politique CSS du cahier des charges racine n’a pas été modifiée par le cadrage. Sans son alignement autorisé, préparer les documents nécessaires puis arrêter la partie code. Aucune dépendance à Electron ou à la réalisation du starter.

## Parcours et surfaces retenus

Utiliser la scène Button par défaut existante dans le Design System. Rechercher puis sélectionner cette scène par la navigation, choisir son réglage de couleur de fond, saisir une valeur locale valide puis une valeur invalide, conserver le dernier aperçu valide, demander l’abandon du brouillon et annuler ; demander à nouveau et confirmer. Dans une seconde passe isolée, enregistrer une valeur valide, relire après rechargement puis rétablir explicitement la valeur de départ. Utiliser exclusivement les sources fictives de la copie de qualification, jamais une recette humaine.

| Surface | Changement futur borné | Invariants |
| --- | --- | --- |
| `src/ui-lab/editor/SceneNavigation.tsx`, `navigation-tree.ts`, styles associés | Arbre/recherche composés avec React Aria, apparence Tailwind du scope outil | Identités de scènes, callbacks, filtrage accent-insensible, groupes et état de sélection, verrouillage sous indisponibilité ; pas de sélection automatique après recherche |
| `AppearancePanel.tsx`, groupe « Réglage en brouillon », saisie de valeur précise | Champ texte React Aria, label/aide/erreur et styles outil. Conserver le contrôle couleur natif utile ; ne pas remplacer tout l’inspecteur | Validation et domaine existants, état texte et dernière projection valide, portées/attributions/base, erreurs non effacées artificiellement, Enregistrer soumis aux conditions actuelles |
| `AppearancePanel.tsx`, action « Abandonner » | Dialogue React Aria à la place du `confirm` web de cette action uniquement | Annulation/Échap sans perte, focus restauré ; abandon global uniquement après affirmation explicite et via la fonction actuelle. Confirmations AppKit de fermeture/quitter inchangées |

Les primitives de React Aria sont choisies conformément à leur sémantique au lancement ; ne pas forcer un arbre si le modèle ne permet pas de préserver groupes/sélection. Un conflit sémantique constaté se documente avant extension de périmètre. Pas d’intégration Figma ou Codex réelle nécessaire au parcours.

## Périmètre des fichiers envisagés

- UI : trois surfaces ci-dessus, `Workspace.tsx` pour le conteneur des portails, styles `navigation.module.css` et `appearance.module.css` pour les seules règles remplacées ; pas de modification de `PageWorkspace` ou `FigmaExplorer`.
- Foundations outil : chemins cibles `src/loomata-ui/authority/` et sorties de styles décrits au contrat, créés avec un premier contenu réellement consommé ; pas de catalogue exhaustif. Ne pas renommer les tokens projet existants.
- Raccordement : entrées Vite/CSS, génération partagée et contrôles de consommation, points d’import du document atelier et `.storybook/` pour les seules stories outil isolées. Préserver `app/root.tsx` et les routes produit de l’injection du CSS outil ; toute adaptation de leur point d’entrée est limitée à cette séparation.
- Dépendances : `package.json`/lockfile pour React Aria et Tailwind après validation des versions. Base UI reste tant que des consommateurs existent ; pas de suppression générale.
- Writer : nouveaux dérivés projet seulement si nécessaires à cette tranche et préparés explicitement dans le plan de réalisation ; sinon différer leur thème Tailwind au starter. Le chrome se génère au build, pas par le writer projet. Tout changement du manifeste ou des opérations exige sa qualification et ne peut être glissé comme détail de style.

Ne pas modifier les profils de création/export dans cette tranche : inventorier les effets des nouvelles ressources dans le kit actuel et conserver les chemins existants. L’autonomie complète et la préparation des produits ne seront pas annoncées acquises ici ; elles sont critères du chantier starter suivant.

## Ordre technique et preuves à prévoir, non exécutés

1. Référence de départ : captures/états et valeurs de la copie isolée, identités et scénario ; adopter le mapping outil sans modifier les valeurs projet.
2. Raccordement minimal Tailwind : pas de Preflight global, utilitaires/variables outil et portails bornés ; vérifier absence de variation des scènes et stories produit. Génération déterministe et contrôle des valeurs/classes.
3. React Aria par surface : navigation, champ, dialogue ; maintenir les contrôleurs et callbacks actuels. Ajouter les stories des états utiles et des tests de refus, pas des tests qui recopient le JSX.
4. Parcours complets : clavier, filtre sans résultat, erreur, annulation, abandon, sauvegarde/relecture dans la copie, reprise après rechargement ; clair/sombre et défilement desktop, focus/annonces dans la vraie WKWebView.
5. Revue design, technique et frontières de confiance, avec mode réel et limites ; diff, documents, reprise et dossier de recette humaine.

Commandes candidates depuis la racine applicative, à choisir selon le diff et le runtime prévu : `npm run validate:design-system`, `npm run test:design-system`, `npm run docs:design-system:check`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run build-storybook`. Les précommandes peuvent régénérer : aucune n’est exécutée dans la préparation. Sélectionner les tests Node/Vitest et runners UI/Storybook appropriés ; utiliser un pilote natif isolé adapté à cette tranche, sans relancer des campagnes fournisseur ou Figma. Si un contrôle obligatoire est invérifiable, la qualification et les dépendances concernées restent bloquées.

## Critères de sortie

| Critère | Résultat observable requis |
| --- | --- |
| UI-01 | Arbre/recherche navigables au clavier ; scène choisie stable, identités et verrouillages conservés ; aucun exemple perdu |
| UI-02 | Saisie conservée, valeur invalide expliquée et reliée au champ ; dernière projection valide conservée et aucune sauvegarde indue |
| UI-03 | Dialogue annoncé, focus contenu/restauré ; annulation sans perte, abandon confirmé seulement ; fermeture native inchangée |
| UI-04 | Nouveau chrome indépendant des valeurs projet ; rendu des scènes et stories produit inchangé dans les états contrôlés ; pas de fuite par reset/portail/iframe |
| UI-05 | Enregistrement/relecture/rétablissement sur copie réussis ; tokens, attributions, bases et révisions préservés ; aucune conversion de journal |
| UI-06 | Génération, types, tests, builds et revues requis satisfaits sur même version ; preuves native/desktop et limites consignées |

Retour arrière : conserver branche et référence qualifiée ; rétablir les seuls changements de source et dépendances de la tranche dans une copie appropriée, sans écraser les données ou rejouer un journal d’une autre version. Une copie avec nouveau manifeste utilise son outillage correspondant. Garder ancienne recette et fenêtre ; ne pas fermer ou reconstruire un bundle ouvert implicitement.

Acceptation humaine différée : conserver toute hypothèse visuelle comme proposée. Qualification technique permet de préparer le chantier starter, pas de l’exécuter automatiquement. Electron reste une tranche séparée après le socle des projets. Aucun calendrier ni budget arbitraire ajouté.


## Exécution — 14 novembre 2026

Mandat reçu : exécuter la tranche avec alignement des autorités avant code, sans socle projets ni Electron. Base `8f19e6a74ecdece03339aef5d643652cf6220e05`, branche `codex/ui-arch-03-first-ui-slice`, aucun changement suivi initial et 75 entrées non suivies exclues. Racine Git vérifiée. Procédures app `implement-feature`, `test-user-flow` et revues prévues, sans sous-agent. GPT-6.1 Sol · Élevée recommandé ; réglage non modifié. Autorités alignées par 036 et cahier des charges avant écriture du code. Node local 24.22.0 disponible ; premier accès registre refusé par DNS sandbox, reprise autorisée hors sandbox. Doc updated.


Arbitrage de compatibilité obtenu pendant l’exécution : le porteur autorise l’ajout minimal des ressources UI à `scripts/project-files.json`, car leurs nouveaux imports rendraient la copie du kit incomplète sinon. Exception à la préparation initiale limitée à cette complétude ; aucun chantier starter ni nouveau profil fonctionnel lancé. Les nouveaux modules outil rejoignent le manifeste de révision v37 (sans élargir `sourcePaths` ni les opérations d’écriture) ; les anciennes transactions restent sous leur outillage, sans conversion.


## Résultat final et reprise

Trois surfaces livrées : arbre/recherche React Aria dans SceneNavigation, champ Valeur précise dans Apparence et dialogue d’abandon. DTCG outil classifié, dérivés CSS/Tailwind, générateur contrôlé et entrées Vite/Storybook sans Preflight global ; fondation projet, writer/opérations et contenant Swift inchangés. Versions figées : React Aria Components 1.22.1, Tailwind et plugin Vite 4.3.5, React/Vite existants compatibles selon leurs peerDependencies.

Contrôles : types et lint conformes dans copie excluant les 75 préexistants ; 114 tests DS, 57 tests de store/récupération, un test du générateur outil conformes. Deux builds et documentation dérivée conformes. Parcours Chromium avec recherche, clavier, erreur, dialogue, vraie sauvegarde/relecture/rétablissement à 1280×800 clair et 1440×900 sombre réussi ; absence de CSS outil dans la page produit et chrome inchangé par la couleur projet. WKWebView à 1280/1440 : saisie invalide, confirmation/annulation, focus initial et retour du focus réussis par actions DOM explicites. Captures relues. Les échecs initiaux et leurs corrections restent dans le bilan ; store final 57/57 sans suppression de protection, reprise reconnue après expiration du runner seulement dans la copie.

Revues design, technique et frontières de confiance : séquentielles, même agent, non indépendantes, conclusions et limites dans le bilan. Aucun accès/endpoint supplémentaire, aucune inférence modèle ni import Figma. Limites : pas de recette physique ou VoiceOver, pas de Windows/Linux ni de nouvelle qualification de distribution ; alertes d’outillage héritées et avertissements des builds conservés. Le contrôle de complétude source du kit n’est pas une qualification du futur starter.

Doc updated. Les 75 préexistants, recettes et fenêtres personnelles sont conservés. Ressources de tests dédiées arrêtées par leurs runners ; copies et preuves ignorées conservées pour reprise. Aucune publication. UI-ARCH-03 reste En revue ; prochaine action : recette humaine de cette tranche. Socle des projets et Electron non ouverts. Pour toute continuation UI de même nature : GPT-6.1 Sol · Élevée ; aucun changement de réglage client effectué.


Vérification finale : 16 liens locaux du bilan, de l’adoption et de la fiche résolus ; empreinte des sources de la preuve structurée vérifiée ; autorités JSON/YAML du projet sans diff ; contrôle de frontières serveur/client conforme (un import `.server` côté client est effectivement refusé dans la cible isolée). Tous les noms de paquets signalés par npm audit étaient déjà présents au lockfile de départ. Les fichiers du chantier sont sélectionnés explicitement, hors 75 préexistants ; diff sans erreur d’espacement ni configuration privée. Cahier des charges v1.16. Les captures et résumés sélectionnés sont versionnés, les traces/copies volumineuses restent locales ignorées.


## Version compilée pour test humain — 14 novembre 2026

Mandat : compiler et ouvrir une version distincte pour vérifier UI-ARCH-03, sans remplacer les fenêtres existantes ni lancer le socle des projets ou Electron. Sources `5c21c51255725fc0eb3e7f8cef8e3b95bf2f04fe`, branche de livraison `codex/ui-arch-03-user-test` ; 75 entrées préexistantes non suivies conservées. Cible application, suivi consolidé dans le lab. Aucun changement de code produit.

Bundle normal **Loomata UI ARCH 03 Test**, sans instrumentation native, compilé depuis le contenant Swift/AppKit/WKWebView existant. SDK 26.5 retenu par le fallback prévu du compilateur après incompatibilité du SDK 27.0 avec Swift 6.3.3 ; premier échec conservé dans les traces locales, seconde compilation réussie. Node local 24.22.0, génération des tokens projet et outil exécutée dans la copie ; services UI Lab et Storybook propres à cette copie. Cette livraison utilise les serveurs locaux de développement, pas une distribution de production autonome.

Accès locaux laissés actifs pour la recette :

- Bundle : `.local/ui-arch-03/user-test-HDeUYg/Loomata UI ARCH 03 Test.app`, depuis la racine du dépôt.
- Projet isolé : `.local/ui-arch-03/user-test-HDeUYg/project`.
- [UI Lab](http://127.0.0.1:58250/ui-lab) et [Storybook](http://127.0.0.1:58251/).
- Descripteur privé ignoré : `.local/ui-arch-03/user-test-latest.json` ; identité `org.loomata.local.ui-arch-03.user-test-HDeUYg`.

Contrôles exécutés : `/usr/bin/codesign --verify --strict` conforme ; HTTP 200 sur `/health`, `/ui-lab` et l’index Storybook `/index.json`. Ouverture native via CUA, UI Lab chargé et capture relue : Button · Default, recherche, arbre et champ Valeur précise présents. Fenêtre de test affichée au premier plan ; les deux anciennes instances Loomata sont toujours en cours d’exécution, sans fermeture ni remplacement. Aucun compte, jeton, historique ou état privé transféré. Copie de test modifiable indépendamment ; aucune sauvegarde projet effectuée pendant cette ouverture.

Recette proposée au designer : rechercher et sélectionner une scène, parcourir l’arbre au clavier, saisir une valeur valide puis invalide dans Valeur précise ; avec un brouillon modifié, cliquer sur Annuler, vérifier « Conserver le brouillon », puis rouvrir le dialogue et vérifier « Abandonner les réglages ». Tester ensuite l’enregistrement et la relecture uniquement dans cette copie. Les résultats humains restent à recueillir ; l’ouverture n’accepte pas le rendu à la place du designer.

Revue de livraison séquentielle, même agent, non indépendante : identité, copie, ports et fenêtres distincts vérifiés ; aucun élargissement au socle ou à Electron. Contrôles de la tranche précédente non répétés en l’absence de modification fonctionnelle. UI-ARCH-03 reste En revue, qualification technique acquise, acceptation humaine différée. Doc updated ; aucune publication. Prochaine action : recette humaine dans cette fenêtre ; pour une continuation UI comparable, GPT-6.1 Sol · Élevée, sans modification du réglage client.


## Correctif — restauration des icônes Storybook

Retour du porteur : fonctionnement confirmé, mais disparition des pictogrammes préexistants dans la navigation. Mandat correctif limité à UI-ARCH-03, cible application ; aucune extension au socle ou à Electron. Base `b4fd502`, branche `codex/ui-arch-03-restore-icons`, 75 entrées préexistantes non suivies et fenêtres personnelles conservées. Procédures applicatives `implement-feature` et `test-user-flow`, versions qualifiées présentes à cette base ; revues design et technique séquentielles, même agent, non indépendantes. Configuration recommandée conservée : GPT-6.1 Sol · Élevée (intégration du chrome et compatibilité Storybook), réglage client non modifié.

Diagnostic : les appels à NavigationIcon ont été retirés de SceneNavigation lors du passage à React Aria ; les SVG adaptés de Storybook et leur licence sont restés présents. Réutiliser ces tracés dans le nouvel arbre, avec chevrons d’expansion et repères dossier/composant/exemple/document. Extraire uniquement leur taille et leurs couleurs vers les tokens outil, sans alias vers le projet ni suppression d’identité historique. Hypothèse minimale : conserver les pictogrammes et couleurs précédents, sans nouvelle direction visuelle.

Fichiers prévus : SceneNavigation, NavigationIcon, autorité DTCG outil, génération/détection Tailwind et dérivés, story de navigation ; adapter seulement la fixture du test du générateur à son nouveau consommateur. Preuves prévues : génération déterministe, types/lint/builds, présence et couleur des SVG dans les deux thèmes desktop, recherche/clavier, ouverture d’une nouvelle copie normale sans remplacement des fenêtres. Critères : icônes visibles, nom accessible inchangé (SVG décoratifs), aucun couplage aux valeurs projet, sélection/expansion/recherche conservées. Acceptation humaine toujours différée ; Doc updated.


Résultat correctif : quatre types de pictogrammes et chevrons SVG rétablis avec autorité outil indépendante, story et contrôle de génération synchronisés. Types/lint, builds app/Storybook, test outil et parcours complet desktop clair/sombre conformes. [Bilan du correctif et captures](../reviews/ui-arch-03-first-ui-slice.md#correctif-des-icônes--14-novembre-2026). Revue design/technique séquentielle non indépendante satisfaisante ; résultat humain à recueillir sur la nouvelle copie dédiée. Aucun changement des données projet, du socle ou d’Electron. Prochaine action autorisée : compiler et ouvrir cette copie corrigée, sans fermer les fenêtres existantes.


Version corrigée normale compilée et ouverte : **Loomata UI ARCH 03 Icons Test**, sources `7ffcc98ef90a471b9dbe7ad4c20b39e1dfaa53d6`, SDK 26.5, signature stricte conforme. Bundle `.local/ui-arch-03/user-test-ZkFK09/Loomata UI ARCH 03 Icons Test.app`, copie `.local/ui-arch-03/user-test-ZkFK09/project`, descripteur ignoré `.local/ui-arch-03/icons-user-test-latest.json`. [UI Lab corrigé](http://127.0.0.1:62416/ui-lab), [Storybook corrigé](http://127.0.0.1:62418/) laissés actifs ; réponses HTTP 200 et story Navigation présente dans l’index. Aucun état privé transféré, aucune instrumentation native.

CUA : nouvelle identité ouverte et affichée, glyphes/colorations visibles dans WKWebView, puis fin du chargement et champ Valeur précise `#1d4ed8` observés. L’instance précédente **Loomata UI ARCH 03 Test** reste en cours d’exécution ; aucune fenêtre fermée/remplacée. L’inventaire courant ne comptait que cette ancienne instance au début de l’ouverture, sans intervention sur les autres applications. Aucun enregistrement dans la copie de recette pendant l’ouverture. Prochaine action : retour visuel humain sur les icônes rétablies ; UI-ARCH-03 reste En revue, qualification technique acquise, acceptation humaine différée. Doc updated ; socle/Electron exclus et aucune publication.
