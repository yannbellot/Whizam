# Architecture de l’inspecteur visuel

**WYSIWYG-02.** Le parcours actuel utilise `project/visual-style` à la fin de chaque geste et les décisions de Foundations utilisent le writer des tokens. Les commandes de transmission décrites dans les sections WYSIWYG-01 sont historiques. [Parcours actuel](../design-system/visual-inspector.md).

**16 novembre 2026 · WYSIWYG-01 · Réalisation en revue, acceptation humaine différée.** Le mandat utilisateur adopte cette architecture et ses recommandations. [Décision d’implémentation 039](../decisions/039-visual-intent-inspector.md), [guide](../design-system/visual-inspector.md), [preuves et limites courantes](../reviews/wysiwyg-01/runtime.md). Les sections de conception ci-dessous conservent leur valeur de référence ; les paragraphes désignant des candidats décrivent leur préparation, pas une preuve d’exécution.

## Inspecteur commun réalisé

Pages et toutes les scènes DS en iframe utilisent désormais VisualInspector et sa projection unique. DesignVisualInspector fournit le contexte de scène, visual-context vérifie le rendu et les correspondances exactes. La nouvelle demande design-visual-intent coexiste avec le contrat Pages ; aucun pageId n’est fabriqué pour le DS. Les outils canoniques restent dans la section Design system, protégés contre un tampon CSS concurrent. [Décision 040](../decisions/040-shared-visual-inspector.md), [contrat](visual-intent-contract.md), [preuves courantes](../reviews/wysiwyg-01/shared-inspector.md). Les paragraphes de conception historiques ne remplacent pas cette réalisation.

## Modes à l’échelle du design

Édition est active par défaut, état contrôlé par Workshop et transmis à Pages. Le panneau off ne garde que le switch. Les écouteurs de sélection sont détachés en mode interactif, sans remonter le composant. Le brouillon DS reste projeté avec bindingId null, qui retire le forçage de pseudo-état ; les cibles de la scène et les opérations restent validées par le protocole existant. Le clic DS résout cible/variante/partie et état natif dans les bindings annoncés, dans la galerie comme les exemples individuels. La projection Pages exige le document courant et une fenêtre valide ; changement de page/révision invalide sa sélection DOM. [Guide commun](../design-system/visual-inspector.md).

## Ajustements de recette

La saisie applique immédiatement la projection ; valeurs et unités simples sont séparées puis recomposées, expressions complexes conservées. Les champs Pages réutilisent la structure compacte data-inspector du DS. La scène components/Overview rassemble un exemple réel de chaque composant enregistré dans les scènes Components ; sa sélection DOM est bornée aux cibles/variantes/bindings annoncés par le pont existant. Aucune identité ni permission supplémentaire.

## Raccordement réalisé

- `src/core/visual-intent.ts` : schéma fermé partagé browser/cœur, whitelist des propriétés et budget. `VisualInspector.tsx` : sélection réelle par React Grab, lecture, contrôles, tampon/histoire et admission. `visual-projection.ts` : possession des familles CSS ; `visual-media.ts` : observations CSSOM bornées.
- `scripts/core/workspace-assistant.ts` puis `scripts/agent-chat/context-control.mjs` : trois commandes finies. `visual-intents.mjs` conserve les reçus dans le champ privé optionnel visualRequests et les rattache après action explicite à manager.send/contextMessage. Aucun endpoint de writer exposé à l’iframe.
- Breakpoint : null ou `{source: "cssom-observation", condition: "(max-width: 768px)"}`. L’admission vérifie la forme, jamais une attestation de cascade ; l’agent doit confirmer cette condition dans les sources. Portée DS limitée aux bindings root/default sans condition ; état default seulement. Les autres media/container/pseudo-états restent consultatifs/inconnus.
- Couleurs : contrôle natif avec valeur CSS ; opacité : rail et texte ; champs CSS complets pour expressions, fontes, ombres et Grid, plutôt qu’un parseur prétendant reconstituer toute la cascade. Priorités temporaires important signalées. L’annulation des côtés liés est groupée ; le reset de propriété reconstruit seulement sa famille et rebase les autres gestes conservés.
- Reçu privé durable avant compte fournisseur : received → starting → submitted, ou unknown. Les états après tentative ne sont pas rejoués. Le statut de traitement final appartient au chat/writer existant ; il n’est pas déduit du reçu. Les anciens historiques sans visualRequests restent lisibles, sans migration de leurs conversations.
- La fermeture utilise data-loomata-dirty et le garde natif existant ; beforeunload reste un appoint browser. Les tests précis et limites du contenant sont consignés dans les preuves.


## Choix d’ensemble

Étendre l’exploration de la **page React réellement exécutée** dans PageWorkspace. Utiliser les primitives publiques de React Grab pour cibler et mesurer les éléments, les contrôles React Aria de Loomata pour saisir, et un tampon visuel en mémoire pour prévisualiser. La validation produit une intention structurée, admise par la coordination existante et présentée dans la conversation de l’élément. L’inspecteur ne traduit pas cette intention en édition de fichiers.

Pas de représentation Puck/Craft/GrapesJS des pages, de serveur proxy Rewrite, de moteur AST ou de nouvelle orchestration. Le registre workspace reste l’autorité des identités ; le DTCG projet et les règles YAML restent l’autorité des valeurs partagées. Le chrome continue à consommer les tokens outil. [Frontières](ui-architecture-boundaries.md), [exploration](page-exploration.md), [contrat workspace](workspace-contract.md), [règle 038](../decisions/038-foundations-inspector-chat.md).

Flux proposé :

```text
Page React réelle → adaptateur sélection → correspondance workspace
                            ↓
                    lecteur de propriétés
                            ↓
Contrôles Loomata ↔ tampon visuel + historique → projection DOM possédée
                            ↓ validation explicite
             lot typé → admission par le cœur existant
                            ↓
                 conversation contextualisée
                            ↓ demande explicite / accords existants
                  Codex → moteur/writer existants
```

## Modules, responsabilités et raccordements

| Module proposé | Entrée / sortie | Réemploi et emplacement candidat |
| --- | --- | --- |
| InspectionSession | Document/page/révisions → mode, cible, invalidations | PageWorkspace ; nouveau sous-module browser dans src/ui-lab/editor/visual-inspector/ |
| SelectionAdapter | Pointer/clavier → Element et géométrie ; aucune permission | Imports nommés react-grab/primitives ; adaptateur browser chargé après activation |
| TargetResolver | Element + registre → identité enregistrée ou cible temporaire | resolvePage/resolveSelection dans src/core/exploration.ts, sans modifier leur autorité |
| PropertyReader | Cible + liste de propriétés → observations/provenance | CSSOM du document courant, bindings DS lus ; aucune déduction de token par égalité |
| PropertyRegistry / InspectorPanel | Descripteurs → champs contrôlés et diagnostics | Conventions Puck/GrapesJS, composants et tokens outil ; n’expose pas les modèles externes |
| VisualBuffer / GestureHistory | Gestes → patchs avant/après, lot compacté | État local pur ; conventions Craft.js, aucune dépendance au graphe Craft |
| PreviewProjector | Patchs validés → styles temporaires et vérification | Projection dans le document aperçu, aucune sauvegarde à la frappe |
| VisualIntentAdmission | Lot non fiable → reçu, refus ou conflit | Extension bornée de scripts/core/workspace-assistant.ts et du contrôle agentique existant |
| ConversationAdapter | Reçu → demande contextualisée et suivi | scripts/agent-chat/context-control.mjs, workspace.mjs et Chat existants ; aucun appel direct du panneau au writer |

Créer ces fichiers uniquement lors de leur implémentation. Schéma pur candidat : `src/core/visual-intent.ts`, sans import DOM, provider ou filesystem. Les types internes du tampon peuvent contenir des références Element ; le contrat transmis n’en contient jamais. Le réemploi de React Grab ne dispense pas de vérifier son import distribué, ses effets à l’import et son contexte de fenêtre.

## Sélection, identité et comportement du produit

Deux modes explicites : interaction normale et inspection. À l’activation, capturer les gestes de sélection avant navigation/soumission ; hors inspection, détacher les écouteurs et restituer le focus. Échap termine un geste puis propose la sortie si des retouches subsistent. Les raccourcis undo/redo ne capturent pas ceux des champs de saisie. Ne pas geler React, timers ou animations pour préserver une sélection.

Cadre sans effet sur la mise en page, exclusion du chrome, géométrie recalculée via requestAnimationFrame sur scroll/resize et observation des dimensions. Résoudre le bon document iframe same-origin, le chemin de page et sa révision avant chaque sélection ou transmission. Un portail dans le document peut être inspecté, mais n’hérite pas automatiquement de l’identité de son emplacement visuel.

Une cible enregistrée exige page + marqueur unique + occurrence cohérente avec la révision. Composant/variante/token proviennent du registre et des bindings validés, jamais du nom React seul. Un enfant DOM non marqué reste une cible temporaire à l’intérieur d’une occurrence ; sélectionner cet enfant ne signifie pas modifier sa racine. Première couverture durable : racines et parties déjà identifiées. Pour une autre partie, conserver la description temporaire et demander un rattachement via les agents ; ne pas générer silencieusement un identifiant source.

Cibles non enregistrées : lecture et retouches de session possibles, demande d’identification adressable à la page connue, mais pas d’application durable ni de propagation sous une fausse identité. Si la page elle-même n’a pas d’identité vérifiée, transmission bloquée. Un sélecteur contextuel n’est ni exécuté par le serveur ni utilisé comme autorité d’écriture.

Les informations Fiber restent facultatives, uniquement pour l’explication. Les API de contexte React Grab collectent aussi HTML, stack et chemins : ne pas transmettre leur objet brut. L’architecture nominale fonctionne avec le registre sans introspection React ; l’enrichissement exige un audit spécifique de confidentialité et d’instrumentation. Cross-origin, Shadow DOM fermé, canvas, pseudo-éléments et iframe imbriquée non qualifiée : expliquer les limites, sans contournement d’origine. Le projet de développement reste du code de confiance, comme aujourd’hui ; same-origin ne constitue pas un confinement de code hostile.

## Lecture CSS et registre extensible

Chaque propriété expose séparément : valeur calculée ; déclaration inline si présente (texte et priorité) ; déclarations de feuille accessibles pertinentes ; héritage observé ; binding/token vérifié ou inconnu. Une liste de règles correspondantes n’est pas une preuve du vainqueur de cascade. Layers, spécificité, media/container queries, animations et CSS tiers peuvent rendre la provenance partielle ; annoncer « provenance partielle », ne pas fabriquer une source exacte.

Les références DTCG sont lues depuis les mappings connus. Ne pas associer un token à partir de deux couleurs identiques. Le navigateur peut résoudre var/calc en pixels : garder le texte déclaré quand disponible et étiqueter la valeur calculée comme observation. Pour une valeur sans déclaration retrouvée, fromDeclared vaut null ; fromComputed reste disponible. null signifie absence/inconnu selon son champ, pas « 0 ».

Descripteur proposé : propriété CSS canonique, catégorie, type de contrôle, unités permises, limites CSS, valeurs énumérées, propriétés conflictuelles, règle de validation et couverture. Sept catégories de la mission conservées. Le navigateur valide CSS.supports ; la frontière Node valide les propriétés, la structure, les budgets et les contraintes lexicales. Ces données restent des propositions, sans attestation de grammaire source ou de cascade ; la validation de l’application définitive appartient au moteur.

Pour marges/paddings et dimensions : longhands explicites. Les contrôles composites produisent un geste atomique de plusieurs longhands, sans découper calc/var par espaces. Conserver les expressions et unités ; aucune conversion px/rem/% automatique. Les valeurs auto et sans unité sont des types distincts. Ombres, fontes et Grid nécessitent des parseurs bornés et diagnostics ; ne pas prétendre couvrir toute la grammaire via un champ numérique.

Les valeurs contenant URL, imports ou ressources externes ne sont pas éditables dans la première projection : lecture possible, demande d’adaptation explicite pour l’édition. Ne pas charger une police ou une image par simple frappe. Les variables personnalisées ne sont pas modifiées sur :root ; projeter une propriété sur la seule cible.

## Projection temporaire et histoire

Choix proposé : un tampon en mémoire par projet/page/document inspecté, distinct du brouillon de sources commun. Aucun stockage durable avant transmission. Afficher qu’une fermeture complète perd les retouches ; protection interne lors d’un changement de page/mode, beforeunload seulement comme aide navigateur sans garantie native. Le contenant macOS doit traiter la fermeture explicitement lors de l’intégration. On ne promet pas une reprise après crash de ce tampon.

Le projecteur modifie uniquement les propriétés inline nécessaires sur les éléments qu’il possède. Avant la première écriture, capturer présence, valeur et priorité initiales des déclarations affectées, y compris les shorthands qu’une écriture longhand peut modifier. Construire un plan de mutation déterministe ; ne jamais restaurer cssText entier. En cas de shorthand qui ne peut pas être restauré sans écraser une modification indépendante, invalider et signaler le conflit.

Une priorité temporaire important peut être nécessaire ; la signaler comme surcharge de preview et ne pas la convertir en intention définitive. Relire le rendu effectif après projection : transition, animation ou règle plus forte peuvent empêcher le résultat demandé. Afficher la limite ; ne pas annoncer la nouvelle valeur comme rendue si elle ne l’est pas. Conserver le texte initial, même vide, et les priorités.

Avant toute restauration, vérifier que la propriété contient encore la dernière écriture possédée par l’inspecteur et que le document/cible sont inchangés. Toute mutation concurrente identifiée invalide le patch au lieu d’être écrasée. Cette comparaison ne prouve pas l’absence d’une mutation identique intermédiaire : les limites d’observation DOM doivent être testées et documentées. Ne pas réappliquer en boucle une surcharge que React a remplacée.

Historique : début/update/fin de geste ; slider ou saisie répétée regroupés jusqu’à fin de geste, pas selon un délai qui déclenche une sauvegarde. Nouvelle édition après undo coupe redo. Sélection/survol hors historique. Réinitialiser une propriété ou toute la session restaure uniquement les valeurs possédées ; distinguer rétablissement d’une déclaration et proposition de suppression durable. Le lot final est compacté : premier avant → dernier après ; les intentions d’instance sans différence de déclaration ni de rendu sont retirées, sans déduire un no-op partagé d’une seule égalité visuelle. Bornes proposées : 100 gestes, 100 changements, 64 Kio UTF-8 par lot ; refus explicite, sans troncature silencieuse.

Navigation, HMR, révision externe, disparition/duplication du marqueur et changement de DOM invalident le lot : état stale, pas de transmission automatique. Conserver une copie consultable du lot et nettoyer les patchs encore possédés. Un rattachement après rerendu exige une correspondance enregistrée unique et relecture de base ; ne pas chercher « le premier élément ressemblant ».

## Portées et responsive : articulation avec 038

Dans **Pages**, le menu exprime une intention de demande : « Cet élément », « Ce composant », « Design system ». La prévisualisation reste locale à la cible dans les trois cas ; afficher cette limite et les consommateurs connus avant transmission. Cela évite de prétendre visualiser toutes les pages ou tous les usages d’un token. Une extension de projection globale demanderait une qualification séparée.

Pour composant, exiger une définition connue ; pour design system, une référence/binding connu. Une portée sans correspondance peut devenir une demande d’identification, mais ne doit pas être annoncée comme lot applicable. Aucun balayage global par classes, nom React ou égalité de valeurs. La portée instance sera interprétée par Loomata selon les conventions de variantes réutilisables existantes ; l’inspecteur ne choisit pas une modification inline permanente.

Dans **Foundations/Components**, la sélection continue à fixer la portée conformément à 038. Aucune création directe de token, de primitive ou de variante dans le nouveau panneau. Le bouton transmet une demande ; l’agent et la coordination peuvent ensuite proposer une opération bornée avec provenance/accords existants. Cette séparation des contextes permet la proposition sans réécrire 038. Si la réalisation nécessite de remplacer les gestes déterministes actuels ou de modifier la création par chat, arbitrage et alignement des autorités avant le code concerné.

Responsive : distinguer viewport observé et condition déclarée connue. Sélection d’un breakpoint uniquement depuis le registre projet/une règle vérifiée ; sinon breakpoint null et largeur observée purement informative. Une surcharge de preview responsive est active seulement lorsque sa condition connue est satisfaite dans l’iframe ; ailleurs restaurer la base et montrer le contrôle inactif. Aucune règle media déduite de la largeur. État/variante explicites, pas d’édition de pseudo-état forcé sans qualification.

## Contrat de lot proposé : visual-intent-v1

Le JSON suivant est une forme illustrative, pas un payload accepté aujourd’hui. Les valeurs entre chevrons doivent satisfaire les schémas UUID/révision réels ; il faudra un schéma strict avec union de cibles et tests de sérialisation.

```json
{
  "schemaVersion": 1,
  "kind": "visual-intent",
  "requestId": "<uuid>",
  "projectId": "<uuid>",
  "treeId": "<uuid>",
  "pageId": "<uuid>",
  "baseRevision": "<sha256>",
  "designRevision": "<sha256-or-null>",
  "render": { "sessionId": "<uuid>", "pagePath": "/projects/new" },
  "target": {
    "kind": "registered",
    "occurrenceId": "<uuid>",
    "marker": "<uuid>",
    "definitionId": "<uuid>",
    "variantId": null,
    "partId": null
  },
  "requestedScope": "instance",
  "intent": "modify",
  "previewCoverage": "selected-element-only",
  "changes": [{
    "property": "border-radius",
    "from": {
      "computed": "8px",
      "declared": { "cssText": "var(--project-radius)", "priority": "" },
      "provenance": "verified-binding"
    },
    "to": { "operation": "set", "cssText": "12px", "unit": "px" },
    "bindingId": "<known-binding-id-or-null>",
    "tokenId": "<known-token-id-or-null>",
    "breakpoint": null,
    "state": "default"
  }]
}
```

Cible alternative `kind: session` : sessionTargetId, rôle/tag et ancestorOccurrenceId éventuel ; pas de définition inventée. Admission limitée à `intent: identify-target`, rattachée à la page connue, et couverture non applicable. partId null n’autorise jamais à traiter un descendant temporaire comme la racine enregistrée. Les identifiants de token/binding utilisent leurs schémas existants, sans leur imposer UUID si l’autorité emploie une autre forme.

Valeur destination : union stricte set (cssText, unité éventuellement null) ou remove-declaration sans valeur. Ce dernier est une intention à interpréter, pas une permission de supprimer une règle source. from.declared null avec provenance unknown est admis comme information partielle ; l’application définitive doit relire la vraie base. Ne pas remplacer un from inconnu par from.computed pour établir un diff de source.

BaseRevision et designRevision sont des préconditions, pas des preuves fournies par le navigateur. Le serveur recalcule projet/arbre/révision et relations page/occurrence/définition/binding ; refuse tout autre scope et tout champ inconnu. Pas de chemin de fichier, Fiber, HTML, valeur de formulaire, commande, origine « codex » auto-attestée ni contenu CSS arbitraire hors registre. Les chaînes de contexte restent des données non fiables.

## Transmission dans le circuit existant

Constat : `project/assistant` est déjà une passerelle fermée. `workspace-assistant.ts` accepte une liste limitée de commandes ; `context-control.mjs` valide send avec conversation/text/requestId, texte limité à 16 000 caractères. Le lot ci-dessus **n’y est pas accepté**. L’envoyer en JSON dans text uniquement ferait perdre la validation structurelle et la vérification fiable des cibles.

Proposition d’évolution bornée, à implémenter ultérieurement : commande `receiveVisualIntent` dans cette même passerelle et son contrôle serveur, avec schéma partagé. La racine et l’arbre restent dérivés par le serveur. Vérifier les préconditions sous les gardes/verrous existants, résoudre la conversation de l’occurrence ou de la page pour une demande d’identification, puis conserver le lot comme demande privée avec reçu corrélé. Réutiliser la persistance de conversations existante ; ne pas écrire dans les sources, ne pas créer une seconde roadmap.

Déduplication par projet/requestId et empreinte canonique du lot. Même id/même contenu retourne le reçu ; même id/autre contenu est refusé. Le reçu durable comprend requestId, empreinte, conversationId, révision contrôlée et état received. Admission et reçu doivent être atomiques dans le magasin concerné ; qualifier les crashs avant/après enregistrement. Une réponse perdue ne déclenche pas une seconde demande : relecture par requestId avant toute reprise. Un timeout reste unknown, jamais succès présumé.

« Transmettre à Loomata » reçoit le lot sans lancer implicitement Codex. Depuis la conversation, une action explicite « Demander l’application » peut démarrer le tour existant, avec connexion et accords usuels. Le gestionnaire ajoute le lot validé comme données de contexte, avec sa version ; les propositions restent soumises à la coordination et aux writers actuels. Une reprise du tour conserve requestId et reçu ; aucun envoi fournisseur automatique après interruption. Le lien reçu→tour→opérations finales doit être observable.

États distincts : editing / stale / submitting / received / refused / unknown pour le tampon et l’admission ; requested / proposed / applied / checking / validated pour le traitement par Loomata. Après reçu, nettoyer la projection possédée et conserver une confirmation consultable. Le produit peut revenir visuellement à sa base jusqu’à application agentique : afficher ce comportement. Pas de cumul d’une ancienne surcharge sur le nouveau rendu issu du moteur.

## Alternatives écartées et conséquences

| Alternative | Motif et condition de réexamen |
| --- | --- |
| React Grab complet avec gel React | Interaction et UI globales inutiles ; primitives préférées ; réexaminer seulement si l’API ciblée échoue réellement |
| Overlay React Rewrite entier | Proxy et écritures de code couplés ; contrôleur à modifier profondément |
| Style Manager GrapesJS / éditeur Puck / core Craft | Deuxième modèle d’éditeur et contextes, coût disproportionné |
| Tout réimplémenter en DOM natif | Duplique un hit-test public existant ; repli si compatibilité/poids/effets échouent au test |
| JSON libre dans le chat | Rapide mais pas d’admission structurelle fiable ; ne qualifie pas le contrat |
| Persister le tampon pré-transmission | Ajoute reprise et arbitrage de styles périmés ; hors hypothèse minimale, décision propre si demandé |

Aucune migration de données/sources actuelles requise par cette proposition. L’extension de contrôle devra rester compatible avec les commandes existantes ; aucun ancien historique converti. Ne pas exporter les demandes privées. Les futurs modules d’outillage nécessaires au kit doivent être sélectionnés dans création/export et vérifiés depuis un projet autonome ; cette étude n’ajoute pas ses notes de fabrication au manifeste d’export.

## Portes de qualification avant livraison

1. Import ciblé React Grab depuis une distribution figée : effets au chargement, bundle et licences regroupées ; iframe same-origin, React réel en dev/build, WKWebView. Si échec, consigner le diagnostic avant toute alternative native.
2. Schéma/resolveur : identités falsifiées, mauvais arbre, révisions périmées, descendant non enregistré, token/composant inconnu, taille/grammaire refusées. Les clients n’attestent pas eux-mêmes l’origine ni la validité des modifications.
3. Projection : scroll/zoom, parents/enfants, deux propriétés, unités/var/calc, shorthands, important, animations, rerendu concurrent, undo/redo, reset/sortie, HMR, resize responsive et nettoyage sans différence dans les sources.
4. Admission : lot reçu durablement, même id répété, contenu contradictoire, réponse perdue, crash, arrêt fournisseur ; connexion absente conserve la demande sans appel. Aucun endpoint de sauvegarde atteint par la preview.
5. Parcours de bout en bout sur projet fictif : lot reçu, demande explicite, proposition agentique et contrôle des portées dans le moteur. Les tests simulés ne démontrent pas un essai fournisseur réel. Régression T1/DS et autonomie de création/export proportionnées au diff.
6. Revue design/technique/sécurité de la réalisation, captures desktop 1280×900 et 1440×1000 clair/sombre, clavier/focus puis recette humaine. Aucun succès d’exécution revendiqué par cette architecture.

**Reprise :** [bilan de réalisation et recette humaine](../reviews/wysiwyg-01/runtime.md). La décision 039 consigne l’adoption technique ; les limites observées et l’acceptation visuelle restent explicites. Les portes ci-dessus sont un plan de qualification, leurs résultats exécutés sont uniquement ceux du bilan.

## Complément de recommandations UI — 16 novembre 2026

La [revue visuelle de GrapesJS](../reviews/wysiwyg-01-grapesjs-ui/README.md) complète la proposition sans modifier ses frontières. Pour le panneau Pages : en-tête de cible/page/parents, contexte état/breakpoint connu, sections **fixes** avec valeur et unité proches, provenance textuelle, couleurs accessibles en graphique et texte, rétablissement nommé et pied de lot avec nombre de retouches et « Transmettre à Loomata ». Le chat conserve son espace existant. Garder les règles courantes de densité et les libellés de [DS-UI-06](../work-items/ds-ui-06-fixed-inspector.md), sans accordéon. Le repli des sections de la démo n’est pas proposé pour Loomata.

Les critères P1/P2 du rapport deviennent les candidats de recette UI de C/D : exactitude undo/redo par geste, reset par propriété, distinction placeholder/valeur calculée/token, champ unité sans conversion implicite, focus et noms accessibles, portée de demande dans Pages seulement. Les contrôles de Flex doivent être qualifiés avec un vrai conteneur à plusieurs enfants ; la sélection Hover et la largeur de preview ne prouvent ni simulation ni règle responsive créée. Elles ont guidé la réalisation de C/D ; l’acceptation visuelle reste différée et les limites exécutées sont celles du bilan runtime.
