# WYSIWYG-01 — Inspecteur partagé Pages / Design system

16 novembre 2026. Application ; version réalisée `b2fe416`, base 1cb74f8, branche codex/wysiwyg-01-shared-runtime. [Fiche](../../work-items/wysiwyg-01-shared-inspector.md), [décision 040](../../decisions/040-shared-visual-inspector.md), [contrat livré](../../architecture/visual-intent-contract.md), [sources](shared-sources.json). **En revue : qualification technique acquise, acceptation humaine différée.**

## Résultat

VisualInspector est maintenant le panneau commun : mêmes champs, sections fixes, calculs d’unités, projection, historique et reçus. L’adaptateur Pages conserve ses identités et demandes v1. DesignVisualInspector fournit le contexte réel de projet lorsqu’il est disponible et le rendu de scène DS ; visual-context vérifie document, génération et correspondance exacte. Aucun second panneau CSS copié.

La sélection couvre toutes les scènes en iframe, sans filtre de chemin Components : galerie, exemples individuels, variantes, compositions et catalogues. Une partie marquée propre est reconnue via cible/variante/partie/état du contrat ; un enfant non marqué reste la cible exacte temporaire. Le h2 interne d’un Panel dans la composition est modifié sans modifier le Panel, puis transmis comme cible à identifier. Le contenu des cartes sémantiques Foundations hors iframe garde son inspecteur de décisions. Iframes cross-origin, Shadow DOM fermé et pseudo-éléments restent hors couverture, comme dans Pages.

React Grab 0.2.0 reste réellement utilisé pour hit-test et géométrie. En attendant son import, l’événement natif exact sert de secours, dans le seul document courant ; aucun closest vers un parent pour fabriquer la sélection. L’iframe ne reçoit pas de gestes d’édition avant que son contexte soit prêt. Les contrôles désactivés sont sélectionnés sur pointerdown, puisqu’ils n’émettent pas tous un click natif ; les autres cibles gardent la sélection au clic pour éviter une seconde confirmation d’abandon.

Édition est on par défaut et commune aux deux surfaces ; off n’affiche que le switch et rend les interactions. Les sept sections restent ouvertes. Les outils canoniques de tokens sont présents dans Design system pour une partie reliée. Un brouillon DS désactive le CSS et réciproquement ; une mutation externe invalide le lot CSS plutôt que d’écraser l’autre propriétaire. Une première lecture du contexte projet n’efface pas les retouches commencées. L’arrivée d’une nouvelle révision, d’un nouveau rendu/génération ou d’un autre brouillon est distinguée de cette première lecture.

## Contrat et frontières

Nouvelle forme fermée design-visual-intent v1, avec projet/arbre/baseRevision, designRevision et observation de scène/renderId/génération. Aucun faux pageId ni occurrence workspace. Les deux formes de lots se lisent dans le même historique ; les anciens reçus Pages restent dédupliqués à l’identique. Une cible DS enregistrée exige une vraie partie du contrat, les références partagées la même propriété/variante/partie/état et décision ; une cible temporaire ne reçoit ni token ni propagation inventée. L’admission reste durable hors connexion, sans création de thread. L’action d’application est explicite, contextualise une conversation projet et conserve les accords/permissions existants et l’absence de rejeu.

La réception d’une propriété CSS arbitraire n’ajoute pas une capacité d’écriture brute des fichiers DS. Les propriétés hors du writer canonique peuvent nécessiter une proposition de chantier dans le moteur existant. Le fournisseur réel et son interprétation ne sont pas testés ici. Les nouveaux reçus DS demandent ce lecteur mis à jour ; aucune conversion destructive n’est faite pour un ancien exécutable.

## Contrôles exécutés

| Contrôle | Résultat |
| --- | --- |
| Contrats visuels, agent-chat et workspace-t1-context | **35/35** : coexistence/réouverture Pages/DS, déduplication, lancement unique, vraie approbation et écriture isolée, données/révisions/portées forgées refusées, liaison exacte de référence y compris révision coordonnée. Fournisseur simulé. |
| Chromium 156.0.8078.4 | [Réussi](shared-chromium.json), 1280×900 et 1440×1000 : sept sections sur cinq composants puis exemple, variante désactivée, composition avec enfant non marqué, catalogue ; CSS immédiat, unités, undo/redo/reset, reçu/recharge, modes, protection mutuelle des brouillons ; parcours Pages complet avec approbation/source isolée et rendu 18 px après recharge. |
| WebKit 27.2 | [Réussi](shared-webkit.json), mêmes formats/scénarios et mêmes empreintes du runtime principal. Interruptions exactes de lectures de fond immédiatement liées à une navigation conservées dans navigationAborts, distinctes des erreurs actives. |
| Régression Pages historique ciblée | Réussie aux deux formats ; première campagne a reçu workspace-busy-or-interrupted sous charge. Nouveau run isolé réussi, aucune opération mutative refusée rejouée automatiquement sur l’ancienne fixture. |
| Types, build app et build Storybook | Réussis sur copie sélectionnée propre, avec les nouveaux adaptateurs. Les copies préexistantes « 2 » restent hors sélection et leurs erreurs historiques ne sont pas corrigées silencieusement. Avertissements existants fontes à résolution runtime/chunks conservés. |
| Styles et qualité | ESLint ciblé sans erreur (une réserve de dépendance d’effet explicitée ci-dessous), trois tests de composition et validate:agent-kit réussis ; diff sans erreur. Aucun changement de règles pour contourner les gardes. |
| Vrai manifeste de création et ZIP | Réussis : nouveau projet créé depuis project-files.json, génération/typegen/tsc/build, adaptateurs et décision inclus, historique privé exclu. Dépendances locales réutilisées, pas d’installation globale. |

Commandes depuis application avec son runtime local : `node --test tests/visual-intents.test.mjs tests/agent-chat.test.mjs tests/workspace-t1-context.test.mjs`, `node scripts/test-visual-inspector-ui.mjs --application` puis `--webkit`, `node scripts/test-exploration-ui.mjs --pages-only`, `node --test tests/ui-composition.test.mjs`, `npm run validate:agent-kit`. Types/build/build-storybook exécutés dans test-results/wysiwyg-clean, copie des fichiers suivis et du chantier. Journaux locaux wysiwyg-shared-{contracts-final,ui-combined-chromium,ui-combined-webkit,pages-retry,types-combined,build-combined,storybook-combined,lint-combined,manifest}.log.

## Corrections et limites observées

- Première arrivée du modèle projet traitée comme changement de rendu : séparation des révisions de rendu et de coordination, conservation du tampon avant sa première admission.
- Clic rapide avant import/handshake : secours natif exact et protection de préparation du document, contrôles désactivés couverts. Navigation WebKit : lectures version/snapshot/exploration interrompues identifiées uniquement près des navigations observées ; pas de masquage général des exceptions.
- Reprise de tests : identifiant de lot DS initialement réutilisé depuis la fixture Pages, correctement refusé ; objet projet d’un ancien manager correctement refusé pour une approbation après réouverture ; données de test corrigées. Snapshot incomplet de fixture préparé avant son accès en lecture réservée. Le serveur HTTP requiert le contexte loopback autorisé ; l’essai sandbox EPERM reste visible, campagne finale autorisée passée.
- Plusieurs statuts dans les outils canoniques : assertion limitée au footer du lot. Le message « projection retirée » n’apparaît plus pendant une transmission encore en cours ou non confirmée.
- Brouillon natif : conserver la sélection et désactiver les contrôles CSS pendant le brouillon de tokens ; invalider une vraie projection concurrente. La vérification canonique séparée est décrite dans le complément final.

Revues design, technique/QA et sécurité : **séquentielles, même agent, non indépendantes**. Fidélité et usage contrôlés à partir des rendus [élément interne](shared-internal-1280.png), [enfant de composition](shared-composition-1280.png), [mode interactif](shared-interactive-1280.png) et [Pages sombre](shared-pages-dark-1440.png). Parcours complet relu entrée → schéma → reçu privé → contexte manager → accord → writer existant. Aucun finding bloquant dans les frontières modifiées ; pas de certification ni audit distant. Les capacités de source sont inchangées, les scènes restent des observations, les faux bindings sont refusés côté cœur.

Les longs noms/provenances et les outils canoniques peuvent demander du défilement dans le panneau 280 px ; leur ergonomie reste à accepter par le designer. Native macOS complet, accessibilité exhaustive, interprétation réelle du fournisseur et application canonique par un agent à travers un writer déjà occupé ne sont pas qualifiés par ces simulations. La vraie sauvegarde canonique via les outils DS reste un contrôle séparé ; elle ne vaut pas test d’un agent distant. J4/J5 et acceptation humaine restent ouverts.

Doc updated. Code, schémas, manifeste, tests, guide/contrat/décision, preuves et suivi directement concernés seulement. Préexistants préservés, aucun push, publication ou service distant.

## Sauvegarde canonique, recette et point de reprise

[Contrôle séparé réussi](shared-native-save.json) sur le writer UI actif : libellé Field, 1 → 1.25 rem, accusé HTTP saved ; les fichiers canoniques de composant changent et le rendu vaut 20 px après recharge. Valeur numérique 1 enregistrée à nouveau, relue ; les outils CSS sont disponibles après re-sélection. Historique et éventuelles primitives allouées restent ceux de la copie fictive, sans retour arrière destructeur. Ce contrôle n’est pas un appel à un modèle.

Les essais initiaux de ce contrôle avaient deux limites de fixture/assertion : module resté en cache dans un chemin privé après copie directe, puis conflit workspace-unrecognized-changes correctement conservé sur cette copie modifiée ; aucun verrou/journal/inventaire n’a été effacé pour forcer l’acceptation. La qualification utilise une copie finale intacte. Le texte de statut attendu a été remplacé par l’accusé HTTP saved, le hash des sources canoniques (pas seulement le JSON des primitives) et la relecture après recharge. La copie de diagnostic est conservée inactive.

Réserve ESLint non bloquante : l’effet invalidant observe designSurface.draftKey plutôt que l’identité de l’objet de contexte, recréé lors d’une sélection. Dépendre de l’objet entier réinitialiserait les gestes en cours ; l’avertissement de dépendance est documenté, aucun échec de lint n’est masqué.

[Recette fictive actuelle](http://127.0.0.1:63453/ui-lab?scene=components%2FOverview), code identique aux empreintes publiées. Métadonnées privées dans .local/wysiwyg-shared-recipe/launch.json à la racine de fabrication. Anciens aperçus 61484/60723/59977 préservés ; copie de diagnostic 62862 arrêtée proprement, données conservées. Le navigateur de test est fermé, serveur final laissé pour la recette.

Prochaine action : vérifier visuellement les mêmes sept sections sur un libellé, un contrôle, puis un enfant de composition ; essayer annuler/rétablir/transmettre et Édition off/on. Le réglage visuel et la compréhension des portées restent à accepter, ainsi que les preuves humaines P5/J5. Aucun chantier supplémentaire lancé.
