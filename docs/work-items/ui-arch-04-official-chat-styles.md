# UI-ARCH-04 — Styles officiels de toute l’interface Loomata

> **Habillage retiré le 15 novembre 2026 sur demande du porteur.** [Retour au design antérieur et correctifs de chargement conservés](ui-arch-04-style-rollback.md). Les preuves ci-dessous restent historiques.

**Cible :** application, dans la recette run-Ag62zM ; suivi de fabrication au lab.  
**Statut :** En revue — qualification technique acquise sur la recette, acceptation humaine différée.  
**Base :** c39ea457b33b86c3a598464fd3698d987f3a2955 ; branche codex/ui-arch-04-official-chat-styles. Racine Git vérifiée, 75 entrées non suivies préexistantes exclues.

## Mandat et autorités avant code

Le porteur demande de corriger Codex avec les styles des exemples officiels React Aria, sans personnalisation, puis répond explicitement **« Appliquer à toute l’interface Loomata »**. Le périmètre exécuté couvre Codex, UI Lab, Pages, inspecteurs, Figma, imports, dialogues et agents intégrés. Les aperçus du produit dérivé gardent leur design ; le chrome macOS reste natif et le manager Storybook appartient à Storybook. Aucun chantier Electron, compte fournisseur, inférence ou publication.

React Aria ne fournit pas de thème par défaut. Cette recette utilise les exemples Vanilla CSS Indigo Adobe à la révision 360e35170568dfc99a2baaa78e6b7bdd36458d91, cohérents avec la recette fictive précédente. Les CSS tiers sont immuables. Composition des panneaux et adaptations aux contrats HTML sont distinguées de leur apparence. Les autorités DTCG/YAML du projet, les décisions 036/037 et les profils canoniques restent inchangés ; l’exception de recette ne devient pas une nouvelle autorité implicite du starter.

Continuité des recettes précédentes : copies d’outillage et de projet de run-Ag62zM, qualification préalable sur copie synthétique, correctifs sources et empreintes sélectionnés dans le dépôt. Le starter canonique sert aussi des fenêtres et un writer actifs ; il n’est pas réécrit sous ces processus. L’extension de portée est consignée avant la normalisation des autres surfaces.

## Procédures et réalisation

Catalogue applicatif consulté explicitement : implement-feature, diagnose-incident, test-user-flow et revues design, technique et sécurité, version qualifiée au commit de base c39ea45. Audit Product Design sur captures de cette campagne, IAB et WKWebView. Même agent, rôles successifs, aucune indépendance ni sous-agent. Configuration Très élevée déjà sélectionnée par le porteur, réglage du client non prétendu vérifié.

Les composants React Aria existants prennent les recettes officielles. Les contrôles HTML dont les contrôleurs dépendent gardent événements, refs et contrats de formulaire via des adaptateurs React Aria. Glyphes Storybook conservés ; chevrons Lucide officiels. Règles locales limitées à la structure, aux contenus longs et aux contrats natifs des dialogues/couleurs. Nouvelles sources ajoutées aux seules listes de copie et révision nécessaires, sans nouveau profil ni migration de reçu.

Les CSS officiels et les compositions examinées sont protégés par une liste fermée de chemins/SHA-256, en complément du contrôle des valeurs tokenisées. CSS tiers altéré refusé ; CSS inconnu soumis au contrôle normal. Le thème du contenant ne dépend pas des tokens du projet fictif.

## Critères démontrés

- [Inventaire des points d’entrée et contrôles](../reviews/ui-arch-04-official-ui-styles/inventory.md), propriétaire et limites de visite explicites.
- 19 CSS Adobe inchangés ; styles calculés Button/Input identiques au témoin officiel dans l’état mesuré.
- Types, lint ciblé, builds app/Storybook, 23 tests de protection/adaptateurs conformes ; 19 observations interactives synthétiques réussies.
- Parcours natif : valeur invalide, réglage valide, portée, conservation puis abandon du seul brouillon d’essai. Aucun enregistrement de token. Dix propriétés disponibles, sélection clavier vérifiée sur la recette finale.
- App, exemples officiels du projet fictif, valeurs DTCG et autorités YAML préservés ; aucun contenu synthétique transféré.
- Assets Codex promus dans son daemon existant, anciens assets conservés ; services de la seule recette relancés sur 59550/59551. Bundle non reconstruit. Ressources synthétiques arrêtées.

## Résultat et reprise

[Bilan, captures, erreurs corrigées, revues et limites](../reviews/ui-arch-04-official-ui-styles/README.md), [preuves structurées](../reviews/ui-arch-04-official-ui-styles/qualification.json). Correctifs tool/project et empreintes avant/après sélectionnés ; application à blanc puis sur copies et concordance des empreintes vérifiées. Ils ciblent la recette identifiée, pas une base arbitraire.

Accès : [UI Lab](http://127.0.0.1:59550/ui-lab?scene=official-theme%2FFixture), [page fictive](http://127.0.0.1:59550/), [Storybook](http://127.0.0.1:59551/). Bundle existant : .local/ui-arch-04/macos-loading/run-Ag62zM/normal/Loomata UI Lab Loading Test.app. Codex et retour UI Lab observés dans WKWebView ; le pilote a ensuite perdu l’accès à la fenêtre, sans cause attribuée. Dernière vérification web : aucun brouillon, aucune erreur console constatée. Pas de contrôle natif ultérieur prétendu réussi.

**Doc updated.** Prochaine action : recette visuelle humaine. Promotion canonique et acceptation globale des jalons non déclarées réalisées. Aucune publication ni Electron.
