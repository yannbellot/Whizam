# Contrat livré de l’inspecteur visuel

**Historique.** Le parcours de transmission des retouches à l’IA a été retiré dans WYSIWYG-02. Les commandes et tests cités ci-dessous décrivent la version historique ; voir le [parcours actuel](../design-system/visual-inspector.md).

Deux formes v1, application locale. [Guide d’usage](../design-system/visual-inspector.md), [décision 039](../decisions/039-visual-intent-inspector.md). Les types exécutables sont dans `src/core/visual-intent.ts` ; leur validation est partagée par browser et cœur.

## Identités et contenu

Un lot contient schemaVersion=1, kind=visual-intent, requestId UUID, projectId/treeId/pageId UUID, baseRevision SHA-256, designRevision SHA-256 brute ou empreinte coordonnée avec baseRevision, ou null, render/sessionId UUID et pagePath déclaré. Une cible registered porte occurrenceId, definitionId, marker et variantId éventuel, tous issus du registre workspace. Une cible session porte sessionTargetId et tag ; son intention est identify-target et sa portée instance. Ni sélecteur exécutable, ni HTML, texte de formulaire, chemin de fichier ou métadonnée Fiber dans le lot.

requestedScope vaut instance, component ou design-system ; intent vaut modify ou identify-target. previewCoverage vaut selected-element-only. Le lot porte 1 à 100 propriétés distinctes issues de la liste fermée Apparence/Typographie/Dimensions/Espacements/Disposition, pour au plus 64 Kio UTF-8. Chaque changement expose property, from/computed, from/declared {cssText,priority} ou null, provenance inline/computed/verified-binding, puis to/set {cssText,unit} ou to/remove-declaration. Le texte de proposition est borné à 300 caractères ; séparateurs, échappements, URL, import et expression sont refusés. Les unités et expressions ne sont pas converties. Un texte CSS observé n’est jamais exécuté comme commande serveur.

La liste fermée inclut les déclarations communes et individuelles pour l’arrondi, la couleur, l’épaisseur et le style des contours, les marges et les espacements intérieurs. Les opérations conservent leur ordre de projection. Une déclaration commune remplace les opérations précédentes de ses quatre côtés ou coins, tandis qu’une opération individuelle ultérieure reste transmise après elle. Les valeurs d’origine sont prélevées avant la première retouche du groupe. Un côté ou un coin sans binding propre reste une retouche locale ou de composant.

bindingId/tokenId sont nuls ou vérifiés contre la révision DS du composant root/default ; la portée DS exige une référence partagée pour chaque propriété. Les variantes dont la surcharge n’est pas résolue n’ouvrent pas la portée DS. state est default ; la variante garde l’identité enregistrée. breakpoint est null ou {source: cssom-observation, condition: condition de largeur min/max en px/rem/em, éventuellement jointe par and}. Cette donnée indique une observation du navigateur, pas une autorité : l’application définitive doit confirmer la règle dans les sources. La portée DS n’admet pas de condition responsive non portée par son contrat de bindings.

## Contexte Design system

`design-visual-intent` est une autre forme fermée v1, lue dans la même union de demandes ; la forme Pages `visual-intent` ci-dessus est conservée. Aucun pageId fictif. Projet/arbre/baseRevision réels, designRevision obligatoire et `render:{sessionId,sceneId,renderId,generation}`. Le serveur vérifie révisions commune/DS et génération ; scène/renderId sont des observations, pas des attestations de code ou de permission.

Cible `design-part:{target,variant,part,state}` : correspondance exacte à un élément marqué et à un binding DS annoncé par l’aperçu. État natif default/disabled/loading/error selon les réglages disponibles. Les marqueurs descendants sans correspondance exacte restent `session`, intention identify-target et portée instance. Chaque propriété partagée doit avoir le binding de la même cible/variante/partie/état, la propriété CSS et la référence attendue ; portée DS exclut une condition responsive et exige une décision partagée. Les budgets et restrictions CSS de Pages sont communs.

Reçus Pages et DS coexistent. Le reçu détaillé indique pageId ou sceneId selon sa forme, sans chemin privé. La conversation d’une demande DS est une conversation projet, entityId null ; le lot typé fournit son contexte précis. Aucun faux identifiant de page, de composant workspace ou d’occurrence. Les outils et accords existants gouvernent toujours l’application définitive. Une proposition hors des propriétés canoniques supportées peut nécessiter un chantier qualifié ; la réception n’élargit pas le writer. Les nouveaux lots DS nécessitent le lecteur mis à jour ; ne pas réécrire l’historique pour une rétrogradation.

## Coordination privée

project/assistant admet receiveVisualIntent, visualReceipts et applyVisualIntent, via la passerelle finite existante. Le cœur revalide projet, arbre sélectionné, révisions et cible avant réception et avant lancement ; page/chemin pour Pages, correspondances et génération DS pour les scènes. La page exécutée ne reçoit aucune capacité de writer. Les réponses ne projettent pas de racine privée.

received signifie persistance locale confirmée ; aucune connexion ni conversation fournisseur n’est requise. requestId + empreinte assurent la déduplication, y compris après réponse perdue ; même identifiant avec contenu différent est refusé. L’historique privé v1 conserve au plus 100 lignes visualRequests, optionnelles pour compatibilité avec les anciens historiques. La propriété est liée à la racine et à son identité inode/device ; ce fichier privé n’est pas exporté.

applyVisualIntent est une action explicite. Après revalidation et vérification d’absence de tour actif, elle ouvre/réutilise la conversation de l’entité, persiste starting avant l’envoi, transmet le lot dans CONTEXTE_LOOMATA puis marque submitted. Un échec après tentative donne unknown ; starting/unknown/submitted ne sont jamais rejoués. L’état de traitement final appartient à la conversation et aux reçus du moteur. Autorisations et accords d’écriture existants restent obligatoires.

## Projection et limites

Le projecteur ne modifie que les déclarations inline possédées ; il sauvegarde les familles margin/padding/border/font/background/grid/gap/flex-flow et priorités, restaure sans réassigner cssText, et refuse d’écraser une mutation concurrente. Les gestes continus et côtés liés sont groupés. Navigation/révision/cible perdue ou condition devenue inactive retirent les retouches encore possédées ; un lot périmé reste consultable. La présence d’un attribut style vide peut varier après canonisation CSSOM, sans différence de déclaration ni de rendu promise octet pour octet.

L’inspection fonctionne sur l’iframe same-origin courante. Pas de support déclaré des iframes cross-origin/imbriquées, Shadow DOM fermé, pseudo-éléments, canvas ou pseudo-états forcés. Provenance de cascade partielle ; les déclarations accessibles ne constituent pas un calcul de spécificité/layers. Les retouches pré-transmission sont éphémères et annoncées comme telles. Le contenant natif existant utilise data-loomata-dirty pour son garde de fermeture.

Tests reproductibles depuis le kit préparé : `node --test tests/visual-intents.test.mjs`, `node scripts/test-visual-inspector-ui.mjs --application` ; ajouter `--webkit` pour le moteur WebKit Playwright. Les runners possèdent leurs fixtures et serveurs ; le fournisseur est explicitement simulé, les approbations et écritures sont réelles dans la fixture. Aucune inférence ni connexion réelle n’est induite.

Les lots reçus affichent page, cible, portée et valeurs demandées avant le lancement explicite. Leur lecture est indépendante du choix d’un arbre ; réception et application revalident toujours cet arbre. La réception n’est visible qu’après persistance. Un compte Codex absent conserve le reçu et n’ouvre aucun thread ni tour. L’historique est actuellement borné à 100 lots par installation, sans purge automatique.

Sous conflit de famille CSS, une restauration non démontrable garde la projection marquée sale. La recharge confirmée de l’aperçu retire ces surcharges et perd son état interactif non enregistré ; les mutations concurrentes ne sont pas écrasées pour forcer un reset. Le clavier et la saisie du produit sont suspendus pendant l’inspection ; les champs de l’inspecteur conservent leurs raccourcis natifs.
