# DS-EDIT-55 — Comparaison, contraste et proposition de libellés

2 novembre 2026 — application, base `6bba586`, réalisation demandée pour le déplacement du message, le libellé « Voir le style d’origine » et l’opacité 50 % des badges non conformes. La nomenclature des propriétés reste une proposition, non appliquée. Préexistants préservés, modèles applicatifs de suivi non initialisés.

Périmètre : Panel, ScopeControls, CSS du panneau et tests concernés ; recette 54138 après constat sans brouillon. Critères : message unique immédiatement après la comparaison et avant les actions ; nouvelles références de libellé dans les tests ; badge non conforme 0.5, badge conforme inchangé ; aucune logique, donnée ou autorité de valeurs modifiée. Procédures applicatives implement-feature/review-design/technical-review, version qualifiée de base ; revues successives du même agent non indépendantes. Sol · Moyenne : présentation localisée et réversible.

## Proposition de nomenclature, sans implémentation

Séparer identifiant technique stable, propriété CSS canonique déjà détenue par cssProperty, et libellé français de présentation. Choisir une forme uniforme « attribut — cible/contexte », classer dans Couleurs, Géométrie, Typographie et Focus. Afficher le nom CSS en aide ou dans un mode avancé ; il ne remplace pas le libellé destiné au designer. Maintenir les libellés dans editor-contract.yaml, sans seconde autorité ni renommage des tokens.

| Réglage | Proposition |
| --- | --- |
| background | Couleur — fond |
| foreground | Couleur — texte |
| borderColor | Couleur — bordure |
| iconColor | Couleur — icône |
| ringColor | Couleur — focus |
| borderRadius | Rayon — angles |
| borderWidth | Épaisseur — bordure |
| paddingBlock | Espacement intérieur — axe de bloc |
| paddingInline | Espacement intérieur — axe en ligne |
| gap | Écart — éléments |
| fontSize | Taille — texte |
| fontWeight | Graisse — texte |
| lineHeight | Hauteur de ligne — texte |
| fontFamily | Famille — police |
| ringWidth | Épaisseur — focus |
| ringOffset | Décalage — focus |
| maxWidth | Largeur — maximale |
| pageMargin | Espacement intérieur — page |

Les termes bloc/en ligne correspondent aux propriétés logiques réelles ; expliquer dans l’aide que, dans l’écriture horizontale habituelle, ils correspondent respectivement à vertical/horizontal. « Marge intérieure de page » désigne ici réellement padding-inline, pas margin : préserver cette distinction. Le groupe et l’aide empêchent de surcharger la liste avec des noms techniques. Proposition soumise au designer, aucune décision de nommage appliquée par ce chantier.

## Résultat et contrôles

Présentation réalisée ; nomenclature seulement proposée. Panel détient le message d’absence de partage sous la comparaison ; ScopeControls conserve uniquement les vrais diagnostics de partage. La condition réutilise le contexte de portée existant, donc conserve le sens et les verrous. Badge contrastFail à 0.5, autres badges inchangés. Guide editor-preview synchronisé.

Quatre tests de rendu réussis ; quatre parcours dev puis quatre statiques desktop/mobile réussis, dont contrôle géométrique comparaison → message → actions, couleur par défaut, opacité mesurée et états AA/AAA selon taille/graisse. ESLint et Prettier ciblés conformes, diff vérifié. Journaux locaux ignorés `layout55-unit.log`, `layout55-dev.log`, `layout55-static.log`, `layout55-lint.log` sous `.local/ds-edit-53/` du lab. Pas de campagne globale répétée : modification de présentation sans contrat de données.

Revues successives, même agent non indépendant : design satisfaisant (placement et états aux deux formats, recette Safari contrôlée), technique satisfaisant (rendu et condition existante, aucun changement des opérations), sécurité sans nouvelle surface ni accès selon le diff. Acceptation visuelle toujours humaine ; la proposition de nomenclature reste à arbitrer.

Recette 54138 : avant intervention génération chargée sans brouillon ; arrêt du seul processus identifié, récupération officielle du propriétaire arrêté, copie des trois fichiers UI et génération, relance persistante détachée. Dix hashes de sources de valeurs identiques avant/après. Safari rechargé depuis l’origine, laissé sur Arrondi : « Données à jour », « Voir le style d’origine » puis message avant les actions, aucun brouillon. Preuves locales ignorées dans `.local/ds-edit-55/` du lab. Aucun enregistrement de valeurs ni publication.

Statut : En revue, qualification technique des changements de présentation acquise, acceptation humaine différée. Doc updated : fiche, guide, roadmap et état de fabrication racine ; modèles de suivi app inchangés. Risques/limites : Chromium desktop/mobile pour tests et Safari pour disponibilité réelle ; aucune qualification universelle. Reprise : recette humaine et choix du designer sur la convention proposée, sans implémentation implicite des nouveaux noms.
