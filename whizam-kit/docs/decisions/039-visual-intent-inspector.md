# 039 — Inspecteur visuel et réception différée des intentions

**Historique.** Le parcours de transmission des retouches à l’IA a été retiré dans WYSIWYG-02. Les commandes et tests cités ci-dessous décrivent la version historique ; voir le [parcours actuel](../design-system/visual-inspector.md).

Date : 16 novembre 2026. Cible : application. Décision technique déléguée dans le mandat de réalisation WYSIWYG-01 ; acceptation humaine de l’interface différée. [Contrat livré](../architecture/visual-intent-contract.md). Les preuves de fabrication des primitives et de l’intégration sont conservées dans le dépôt Loomata.

## Choix

Intégrer réellement **react-grab 0.2.0**, version exacte et lockfile, par son export public `react-grab/primitives`. Import différé à l’activation ; seuls hit-test et géométrie sont consommés. Aucun gel React, collecte Fiber/HTML/chemins, presse-papiers ni interface React Grab. La distribution qualifiée diffère du HEAD initialement audité ; ses licences MIT et les dépendances bippy/CLI sont examinées dans la preuve Q. GrapesJS, Puck, React Rewrite et Craft.js restent des références de conception, sans dépendance ni code copié.

Le tampon visuel possède des déclarations DOM éphémères, jamais les fichiers. Le registre workspace fournit les identités ; les bindings vérifiés fournissent les liens DS. Une cible non marquée conserve une identité de session et une demande d’identification adressée à sa page, sans propagation sous une identité inventée. Le panneau Pages exprime trois intentions de portée ; sa projection reste limitée à la sélection. Foundations et Components conservent la décision 038.

Le lot `visual-intent-v1` est un schéma fermé, borné à 64 Kio et 100 propriétés distinctes dans une liste finie. Le serveur contrôle identités, arbre, révisions, page, occurrence/définition/variante et liens DS ; les observations CSS restent des propositions. CSS.supports côté browser ne vaut pas validation de source. Les valeurs avec ressources externes, échappements ou séparateurs de déclarations sont refusées ; seules des conditions de largeur bornées, lues par CSSOM, peuvent être jointes comme **observations**, à confirmer avant application. Aucun registre de breakpoints ou état forcé n’est inventé.

La réception est une extension bornée du contrôle agentique existant : receiveVisualIntent, visualReceipts, applyVisualIntent. L’historique privé v1 accepte un champ optionnel visualRequests ; les anciennes conversations, leurs nativeId/accountRef et permissions sont conservés. Chaque ligne porte racine, identité inode/device, lot, empreinte, état et conversationId éventuel. Aucun historique privé n’est exporté.

La réception persiste avant accusé et ne crée pas de conversation fournisseur. Même requestId et même contenu rendent le même reçu ; contenu différent refusé. L’action distincte « Demander l’application » revalide le contexte, rattache la demande à la conversation native de l’entité, persiste starting avant send, puis submitted. En cas d’échec après ce point : unknown ; starting, unknown et submitted ne sont jamais rejoués automatiquement. Un tour déjà actif laisse le reçu intact. Les données typées sont jointes à CONTEXTE_LOOMATA sans modifier les outils ni permissions. Une proposition d’écriture reste soumise aux accords existants.

## Interface et réversibilité

Sept sections fixes sans accordéons. Valeur CSS textuelle, unité sans conversion, couleur native et rail d’opacité ; regroupement d’un geste continu et côtés liés, undo/redo, rétablissement d’une propriété et retrait explicite d’une déclaration inline. Le reset restaure seulement les familles de déclarations possédées, avec priorité et shorthands ; une mutation concurrente conserve les valeurs du projet et rend le lot consultatif. La restauration vise les déclarations CSSOM, pas une sérialisation HTML octet pour octet.

La prévisualisation peut employer important ; cette priorité n’est pas convertie en consigne de source. Après réception, retirer la projection et annoncer le retour au rendu de base. Un état reçu ne signifie ni appliqué ni validé. Navigation et fermeture avertissent de la perte du tampon ; le garde natif existant lit data-loomata-dirty. La validation complète dans le contenant natif reste bornée aux preuves effectivement réalisées.

## Conséquences

Pas de modèle parallèle de pages, moteur de réécriture ni nouveau backend. Budget historique de 100 demandes, pas de purge automatique ; après résultat inconnu, consulter l’échange avant toute nouvelle demande. Les CSS externes, pseudo-états forcés, container queries et DOM fermés restent hors couverture d’édition déclarée. Aucune migration silencieuse des projets existants, publication ou inférence réelle induite par cette décision. Les limites du produit livré sont dans le [contrat](../architecture/visual-intent-contract.md).

Les lots reçus affichent page, cible, portée et valeurs demandées avant le lancement explicite. Leur lecture est indépendante du choix d’un arbre ; réception et application revalident toujours cet arbre. La réception n’est visible qu’après persistance. Un compte Codex absent conserve le reçu et n’ouvre aucun thread ni tour. L’historique est actuellement borné à 100 lots par installation, sans purge automatique.

Sous conflit de famille CSS, une restauration non démontrable garde la projection marquée sale. La recharge confirmée de l’aperçu retire ces surcharges et perd son état interactif non enregistré ; les mutations concurrentes ne sont pas écrasées pour forcer un reset. Le clavier et la saisie du produit sont suspendus pendant l’inspection ; les champs de l’inspecteur conservent leurs raccourcis natifs.
