# Domaines de valeurs CSS — DS-EDIT-53

Le design system n’impose aucun rayon, texte, largeur ou interligne maximal. Les minima de lisibilité ne définissent pas la validité CSS. Les valeurs initiales restent inchangées ; cette évolution autorise de nouveaux réglages.

## Autorités et couverture

`css-support-profile.yaml` fixe le profil et sa date. `css-value-types.yaml` inventorie 21 familles combinables. `css-properties.yaml` associe les propriétés à ces familles, décrit les domaines exécutables et distingue `current` de `catalogued`. `editor-contract.yaml` relie chaque réglage à une propriété CSS (`cssProperty`) et garde les formats actuellement implémentés. Le chargeur `scripts/css-value-domains.mjs` valide schémas et références, puis dérive le contrat résolu commun au moteur, au serveur, aux snapshots et à l’assistance.

Le catalogue est extensible, pas exhaustif par propriété. Une syntaxe `deferred-to-qualified-grammar` est une entrée de repérage sans validateur exécutable ; elle n’est jamais présentée comme une syntaxe CSS. Les types, mots-clés, calculs, références et composites futurs sont identifiés par famille ; ils n’ouvrent aucun champ libre. SVG, impression, descripteurs, sélecteurs et conditions demandent leur propre qualification avant édition.

Le socle vise Baseline Widely available. Chaque extension exige une référence normative et une preuve de disponibilité pour ses syntaxes, pas seulement pour son nom de propriété. Les entrées futures restent `unverified`. Les sources ne sont jamais récupérées au runtime ; aucun URL d’image ou autre ressource n’est lu par validation.

## Formats éditables actuels

- Couleurs : hexadécimal opaque à trois/six chiffres, canonisé à six chiffres.
- Dimensions : px/rem, six décimales au maximum ; minimum zéro pour rayon, padding, gap, taille, largeur et épaisseur. Décalage du contour signé. Aucun maximum esthétique.
- Graisse : nombre de 1 à 1000, décimales autorisées ; disponibilité réelle selon police.
- Interligne : nombre sans unité non négatif, six décimales au maximum, aucun maximum esthétique.
- Police : pile exacte préparée dans le contrat ; aucune importation implicite.

Les pourcentages, couleurs avec alpha, nouvelles unités, mots-clés, expressions et variables ne sont pas encore éditables dans ces champs. Leur absence est une limite de capacité, pas une affirmation d’invalidité CSS. Les syntaxes de propriété inscrites pour `current` décrivent seulement le sous-ensemble implémenté, pas l’intégralité de la grammaire normative.

## Validation et extension

Une saisie transitoire vide reste possible et conserve le dernier aperçu valide. Les champs numériques exposent les bornes existantes, sans maximum inventé ; le moteur et le serveur restent responsables du rejet effectif. Aucune valeur hors domaine n’est corrigée silencieusement. Pas d’incrément, précision et domaine sont trois notions distinctes.

Avant une extension, qualifier grammaire, références, unités, contraintes au parsing/calcul/rendu, comportement hors domaine et compatibilité cible ; vérifier création, sauvegarde, rechargement, usages partagés et récupération. Une variable syntaxiquement valide mais non résolue n’est pas pleinement validée. Garder distincts erreur CSS, capacité manquante, incompatibilité cible et référence non résolue. Conserver les tokens et le dernier rendu tant que les preuves requises manquent.

Voir la [décision 025](../decisions/025-css-value-domains.md). Les dérivés sont régénérés avec `npm run tokens:generate` ; reconstruire Storybook pour actualiser le contrat de confiance. Ne pas supprimer un journal ou verrou pour forcer la mise à jour d’une instance.
