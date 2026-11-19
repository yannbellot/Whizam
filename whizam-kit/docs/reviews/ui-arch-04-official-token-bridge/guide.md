# Modifier le thème officiel dans le projet fictif

Cette copie de recette conserve le rendu des exemples officiels Adobe (révision `360e35170568dfc99a2baaa78e6b7bdd36458d91`) tout en raccordant dix paramètres communs au DTCG du projet.

Dans l’UI Lab, choisir **Projet fictif / Thème officiel React Aria**. Choisir une propriété dans Apparence, saisir sa valeur, choisir **Modifier le style partagé**, puis **Enregistrer**. La page fictive et les stories relisent les mêmes tokens. Une valeur hexadécimale peut remplacer une teinte OKLCH ; les valeurs OKLCH se saisissent précisément, sans conversion implicite. Le carré indique la couleur ; le sélecteur natif est disponible pour les couleurs hexadécimales.

| Paramètre | Valeur officielle initiale |
| --- | --- |
| Teinte de la palette | `oklch(1 0.25049 284.23)` |
| Neutres | `oklch(0.5 0 0)` |
| Teinte des erreurs | `oklch(0.6 0.181447 27.0726)` |
| Unité d’espacement | `0.25rem` |
| Arrondi des contrôles | `8px` |
| Petit arrondi | `6px` |
| Taille du texte | `0.875rem` |
| Petit texte | `0.75rem` |
| Grand texte | `1rem` |
| Famille du texte | `system-ui` |

Ces paramètres pilotent ensemble les composants officiels du projet. Les nuances, états, reliefs et adaptations clair/sombre restent calculés par les règles officielles ; ils ne deviennent pas des réglages indépendants par occurrence. Le profil couleur local accepte les littéraux OKLCH à trois canaux, opaques, dans les domaines préparés ; expressions libres et alpha OKLCH sont refusés. Le contrôle du contraste des palettes calculées n’est pas une nouvelle capacité qualifiée de cette recette.

Les sources des valeurs sont les tokens DTCG (`tokens.tokens.json`) ; les attributions et bases sont conservées. Les profils et fiches déclarent les propriétés personnalisées autorisées. `token-bridge.css` raccorde les alias générés aux variables officielles ; les couleurs ne sont pas dupliquées en CSS. Les règles officielles non éditables sont vérifiées par empreinte fermée, intégrée au manifeste de révision. Les autres CSS restent soumis à leur audit habituel. Une modification de règle nécessite une nouvelle revue de code, pas un contournement du writer.

La provenance initiale `react-aria-official-examples.json` conserve les fichiers Adobe reçus avant adaptation. Les seules adaptations locales portent sur la portée de thème et la consommation des paramètres ; les preuves avant/après et l’overlay de reprise sont conservés dans le suivi de fabrication du dépôt. Le socle canonique, les autres projets et Electron ne sont pas modifiés.
