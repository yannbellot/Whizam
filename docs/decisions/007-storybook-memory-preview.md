# 007 — Consultation et brouillon Storybook en mémoire

Date : 28 octobre 2026. Statut : choix technique de DS-EDIT-01 C, dans le mandat de réalisation ; aucune extension à l’enregistrement D.

## Décision

L’éditeur utilise un panneau du manager Storybook et un adaptateur dans l’iframe, raccordés par les APIs publiques de Storybook 10.6.3. Les composants produit ne connaissent pas le brouillon. Une session en mémoire du manager conserve les choix entre stories et remontages de l’aperçu ; le rechargement du manager la détruit. Aucun stockage navigateur ni service de fichiers.

La génération Node existante produit un instantané TypeScript et son équivalent JSON statique, tous deux ignorés par Git. Ils contiennent modèle résolu, contrats, catalogue, présentation et inventaire des consommateurs déclarés. Le navigateur n’importe aucun lecteur YAML ou fichier serveur. Le JSON est une ressource statique publique de Storybook, pas une API de lecture des sources. Actualiser ne détecte que la dernière génération produite ; une modification YAML sans génération n’est pas détectée.

L’empreinte SHA-256 du contenu canonique est une identité de génération, **pas la baseRevision du protocole d’écriture D**. Le navigateur vérifie schéma, limites de taille, graphe, domaines compilés et empreinte avant projection. Un changement des domaines ou de la présentation exige une reconstruction de Storybook. Une nouvelle génération pendant un brouillon reste en attente d’un choix explicite, sans rebase automatique.

Les messages fermés transportent génération, story, rendu, session, nonce de sonde, séquence et choix typés. Aucun CSS, chemin ou commande libre. Ces identités assurent la corrélation d’interface ; elles ne constituent pas une capacité de sécurité HTTP. La projection produit uniquement les variables connues et une présentation visuelle bornée des états hover/focus. La couche appartient à l’iframe et est retirée à son démontage ; comparaison, abandon et fermeture du panneau rétablissent les valeurs chargées. Pour la génération compilée sans brouillon, cette couche reste vide : le graphe CSS et ses alias conservent leur comportement natif. Une génération JSON plus récente exige sa propre projection de base jusqu’à reconstruction.

## Propriété des métadonnées et limites

Les libellés des propriétés appartiennent à la matrice ; les fiches portent leur présentation, priorités d’intentions, fichiers consommateurs et parties mesurables pour le contraste. Les paramètres des stories annoncent explicitement leurs cibles ; l’addon confirme leur présence dans le DOM. Field/Selection annonce SelectField malgré son meta.component Field. L’inventaire comprend variables de composants, alias historiques et catalogue dynamique Foundations ; une référence inconnue rend l’inventaire partiel et interdit la projection partagée.

Les alias et exceptions suivent les contrats A/B. La création canonique, l’enregistrement, la concurrence de fichiers, la récupération persistante et tout service d’écriture attendent D. Le contraste est un avis sur une paire opaque préparée, sans certification de la page complète. Une surface inconnue reste non mesurée. L’écart Notice entre registre et CSS décrit dans la spécification demeure inchangé.

## Vérification

La qualification et ses limites sont consignées dans le suivi de fabrication du dépôt concepteur. Le kit livre les tests purs et navigateur ainsi que le [guide d’usage](../design-system/editor-preview.md), sans dépendre de ce suivi pour fonctionner.
