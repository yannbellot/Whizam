# DS-UI-03 — Panneaux inspirés de Framer

15 novembre 2026 — Application, réalisation autorisée. Base `cf4c5af`, branche `codex/ui-lab-framer-inspector`. Racine Git vérifiée ; aucun changement suivi préexistant. Copies « 2 », frontend et .storybook/editor non suivis préservés.

## Mandat et critères

Observer Framer ouvert sur le Mac et rapprocher les contrôles de UI Lab : inspecteur droit prioritaire, boutons et recherche de gauche. **Calques de gauche intacts** : données, ordre, rendu, icônes, sélection, dépliage et clavier. Conserver largeur 280 px, padding/radius 16 px et palette DS-UI-02. Ne pas modifier les valeurs du projet, le contenant natif, les données personnelles ni les anciennes recettes.

Référence observée via CUA : Framer, panneau Style, objet et breakpoint sélectionnés, sélecteur Fill ouvert puis refermé. Mesures visuelles à densité 2 : contrôles environ 30 px, coins 8 px, sections séparées de traits fins, libellés à gauche/champs à droite. Aucun raster nécessaire ; icônes existantes conservées. Hypothèse réversible : attribution dépliable, réglage avant les métadonnées ; aucune opération métier nouvelle.

## Procédures et preuves prévues

Catalogue applicatif consulté ; implement-feature, design-interactions, review-design et technical-review sélectionnés à `cf4c5af`. Product Design image-to-code/design-qa utilisés pour la comparaison visuelle, dans le produit existant sans scaffold. Modèle recommandé GPT-6.1 Sol · Élevée : CSS outil/projet, contrôles React Aria et contrat de tokens ; aucun changement de réglage client.

Sources prévues : Workspace et AppearancePanel, feuille de chrome et tokens outil, contrôle des références outil, guide editor-preview. Fiche et preuves dans l’application ; statut consolidé dans ROADMAP et état racine. Revues séquentielles, même agent, non indépendantes. Génération/validation, types, lint, build et contrôle réel de saisie, abandon et sauvegarde sur copie isolée. Deux formats desktop : 1280×800 et 1440×900. Aucune publication.

## Résultat — 15 novembre 2026

**En revue — qualification technique acquise dans le périmètre visuel et web contrôlé, acceptation humaine différée.** Version : base `cf4c5af` + commit de réalisation DS-UI-03. Doc updated. [Comparaison et réserves](../../design-qa.md), [rendu natif](../reviews/ds-ui-03-framer-panels/native-final.png).

Contrôles de gauche côte à côte ; recherche et champs 30 px/radius 8 px ; inspecteur en sections Composant/Apparence/Attribution/Portée. L’attribution se déplie, avec son contenu et ses corrections de contraste. InspectorSelect conserve le select HTML, ses options, labels, callbacks et comportement clavier ; seul son habillage ajoute le chevron Storybook existant, décoratif. Panneaux flottants 280/16/16, aperçu et modèle éditable conservés. Aucun événement métier remplacé.

Les tokens outil existants sont inchangés par comparaison logique JSON ; seulement neuf décisions ajoutées, avec leurs primitives : sept dimensions et deux couleurs. Les sources SceneNavigation, NavigationIcon, navigation-tree et navigation.module.css sont **identiques octet pour octet** à HEAD initial. Aucune modification des calques, de leurs identités ou des tokens du projet canonique. Aucun actif raster généré : les preuves sont des captures réelles.

Sources modifiées : Workspace.tsx, AppearancePanel.tsx, PropertyPicker.tsx ; nouveau styles/editor.css et import dans styles/index.css ; autorité outil. Le contrôle ui-composition reconnaît uniquement les décisions déclarées de cette autorité, dans src/loomata-ui ; références inconnues, primitives directes et valeurs de secours non déclarées restent refusées. Nouveau test contractuel couvrant ces refus. project-files.json inclut la feuille pour l’extraction autonome, effectivement utilisée par la copie. Guide editor-preview, présent suivi et rapport design-qa actualisés ; modèles ROADMAP/état de l’app non initialisés.

### Contrôles exécutés

- `npm run tokens:generate`, `npm run validate:design-system`, `npm run docs:design-system:check`, `npm run validate:loomata-ui` : conformes. `npm run test:design-system` : **115/115** ; refus invalides attendus conformes.
- Contrôles ciblés outil/composition/politique : 11/11 ; après les corrections finales CSS/select, outil/composition : **4/4**. ESLint ciblé et Prettier ciblé : conformes. `git diff --check` conforme. Les premières invocations de formatage depuis une mauvaise racine n’ont rien modifié ; commandes corrigées exécutées avec le runtime du dépôt.
- Copie autonome neuve : typecheck et builds app/Storybook conformes. Après les derniers changements select/CSS, typecheck et build app de tool rejoués avec succès. Runtime Node local 24.22.0 ; aucun téléchargement/ajout de dépendance.
- CUA : comparaison des contrôles et de la navigation, formats desktop 1280×800 et 1440×900 ; largeur 280, padding/radius 16, pas de débordement. Recherche et valeur précise : hauteur 30, radius 8, bordure transparente. Label précis sombre #999. Validation, abandon, Échap/retour du focus, sauvegarde/relecture et retour à la valeur initiale conformes sur le projet fictif ; changement de propriété rejoué après InspectorSelect. Console : aucun error dans les deux inspections finales. [Détails et limites](../../design-qa.md#interactions-et-limites).
- Compilation Swift SDK 26.5, ressource palette et signature stricte : conformes. Après ouverture, Finder a ajouté une métadonnée incompatible avec codesign ; le helper existant signBuiltBundle a retiré uniquement les métadonnées Finder/ResourceFork du nouveau bundle et vérifié la signature stricte, sans toucher la quarantaine ni un ancien bundle.
- Premier lancement de préparation bloqué par `listen EPERM` du sandbox ; nouvelle préparation avec ports locaux autorisés réussie. Copie initiale conservée. Lors de corrections des sources immuables en recette, le service s’est verrouillé normalement ; redémarrage de ses seuls services, sans retrait de garde. Les anciennes instances restent intactes.

### Accès et reprise

**Loomata Framer Panels Test** ouverte, copie fictive `.local/ds-ui-03/user-test-V7tkcz`, services laissés actifs sur [UI Lab](http://127.0.0.1:50749/ui-lab) et [Storybook](http://127.0.0.1:50750/). Descriptor privé `.local/ds-ui-03/user-test-latest.json`. Aucune donnée ni connexion d’une ancienne recette reprise ; essais de couleur limités à cette copie, valeur initiale rétablie. La copie est une recette locale, pas une publication ni un nouveau livrable accepté.

Design Reviewer : comparaison globale et rapprochée réelle, trois passes de correction ; satisfaisant dans le périmètre visuel, adaptations et limites documentées. Technical Reviewer / QA : sélection/validation/draft/save inchangés, select natif décoré, contrôles de tokens bornés et extraction avec CSS réussie ; satisfaisant pour la présentation et les parcours web exécutés. Revue de portée sécurité : aucun nouvel accès, secret, permission, traitement distant ou opération persistante ; références inconnues toujours refusées. Rôles exercés **séquentiellement, même agent, non indépendants**. Aucun scan sécurité complet requis pour ces seules surfaces.

Risques/limites : recette sombre observée, thème clair non rejoué, VoiceOver/interaction physique des menus natifs non qualifiés ; transition de chargement après changement de propriété non chronométrée. Voir le rapport pour la portée exacte de chaque preuve. Prochaine action : retour visuel humain sur cette fenêtre ; aucun chantier supplémentaire ouvert, aucun push ni publication.
