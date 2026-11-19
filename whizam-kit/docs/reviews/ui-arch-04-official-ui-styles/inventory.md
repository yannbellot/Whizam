# Inventaire des surfaces et éléments

Analyse statique de toute la production TSX pertinente, complétée par les parcours de cette campagne. [Éléments avec chemin, ligne, libellé et événements](source-elements-before.json), [premier inventaire des familles/imports](source-inventory-before.json), [résultat et limites](README.md). Une ligne de source peut produire plusieurs occurrences ; aucun décompte n’est présenté comme inventaire des données utilisateur.

## Points d’entrée et propriétaires

| Surface | Propriétaire et traitement | Vérification de cette campagne |
| --- | --- | --- |
| Codex, document assistant du daemon | Contenant web ; Button, TextArea, Form, Select, Disclosure, ToggleButton, Heading, Link officiels | Vue native sans compte ; états connectés/erreurs/approbations/historique sur simulation |
| UI Lab /ui-lab | Contenant web ; feuille officielle isolée, contrôles et navigation normalisés | WKWebView puis IAB final ; dix paramètres, clavier, validation/abandon |
| Pages et occurrences dans /ui-lab | Contenant web ; actions, sélections, inspecteurs et statuts normalisés | Page/occurrence fictives sur copie isolée ; consultation et micro-chat |
| Agents IA et micro-chat | Même composant Chat, styles partagés | Deux modes intégrés observés sans fournisseur ; mode contextuel réduit avec disclosure |
| Figma, explorateur et import | Contenant web ; dialogue, formulaire, actions, sélecteurs, champs/zoom et confirmations normalisés | Explorateur vide et fermeture ; branches chargées/import analysées dans le code |
| Composants importés, propositions et demandes planifiées | Contenant web ; contrôles normalisés, Checkbox officielle | Analyse statique, contrats communs exercés ; aucune nouvelle proposition externe ni écriture métier |
| Sélection/remplacement/variantes dans l’inspecteur | Contenant web ; listes groupées et champs officiels, contrats HTML conservés | Sélection en consultation sur fixture ; écrivains/révisions couverts par tests serveur |
| Compte dans le contenu web | Contenant web ; disclosure/dialogue et actions officiels | Absence de compte ; ouverture de connexion réelle non exécutée |
| /ui-lab/preview, /imported/:definitionId, / | Produit aperçu ; conserve ses propres styles et tokens | Iframe isolée ; App et exemples fictifs identiques ; builds conformes |
| /projects, /projects/new, /projects/:projectId, /projects/:projectId/edit | Démonstration métier du starter, pas le gestionnaire natif des projets Loomata | Inventoriés ; styles métier inchangés, pas de backend lancé pour cette campagne |
| /health | Endpoint technique sans interface | Inventorié ; pas d’habillage à modifier |
| Erreurs React Router et contenus textuels | Hôte/document courant ; typographie et fond de page hérités, aucune carte de thème concurrente ajoutée | Erreur intermédiaire de navigation corrigée ; contenu de statut observé |
| Storybook manager et scènes du design system projet | Storybook/produit dérivé ; thème et réglages conservés | Build Storybook final ; pas d’extension du manager |
| Fenêtre, barre de vues, menus Projet/Édition/Présentation, compte natif, choix de dossier, confirmations système | AppKit dans macos/Loomata.swift ; reste natif, sans DOM React Aria | Menus/rechargement et confirmation de raccordement observés ; source native inchangée |
| User Flow et Planification complète | Tranches T2/T3 non réalisées | Aucun nouvel écran créé ou déclaré normalisé |

## Éléments normalisés par fichier

Les composants de contenu qui ne sont pas interactifs héritent de la feuille de page officielle. Les boutons, champs, sélecteurs, labels, groupes et dialogues sont traités dans les adaptateurs communs ; le rendu des données et aperçus reste chez leur propriétaire. Les styles d’assemblage gardent grilles/défilement ; pas de recette Table ou de palette locale inventée.

| Fichier sous src/ui-lab/editor | Déclarations natives analysées avant conversion |
| --- | --- |
| AppearancePanel.tsx | h2 × 1, button × 13, h3 × 1, label × 5, select × 3, fieldset × 2, input × 3 |
| AttributionSummary.tsx | a × 1 |
| FigmaExplorer.tsx | dialog × 2, h2 × 1, button × 17, form × 1, label × 5, input × 4, h3 × 2, select × 1 |
| FigmaImport.tsx | h2 × 1, form × 1, label × 7, input × 2, button × 3, select × 4, details × 2, summary × 2, textarea × 1 |
| FontPicker.tsx | label × 3, select × 2, details × 1, summary × 1, input × 1, button × 1 |
| ImportedOccurrenceVariants.tsx | label × 1, select × 1 |
| ImportedWorkbench.tsx | h2 × 1, h3 × 2, label × 4, input × 2, button × 5, select × 2 |
| PageInspector.tsx | h3 × 1, details × 1, summary × 1, label × 5, select × 3, input × 2, button × 3 |
| PageWorkspace.tsx | button × 11, h2 × 2, h3 × 1, label × 1, select × 1 |
| PlannedRequests.tsx | h2 × 1, form × 1, label × 1, input × 1, button × 3, details × 1, summary × 1 |
| PropertyPicker.tsx | label × 1, select × 1 |
| SceneNavigation.tsx |  |
| ScopeControls.tsx | button × 6, label × 2, textarea × 2, h3 × 1, a × 1 |
| Workspace.tsx | details × 1, summary × 1, button × 7, dialog × 1, h2 × 1, a × 1 |

**179 déclarations natives** sont couvertes par cette conversion. SceneNavigation conserve ses composants React Aria avec Tree/SearchField officiels ; NavigationIcon conserve les glyphes Storybook. Controls.tsx fournit le TextField précis et le dialogue d’abandon officiels. Chat.tsx couvre ses trois modes ; son import de styles projet est retiré. Aucun tag natif interactif de ces familles ne reste dans les TSX de l’éditeur après conversion ; les nœuds HTML requis sont centralisés dans Widgets.tsx.

## Contrats et réserves

| Famille | Traitement | Preuve et limite |
| --- | --- | --- |
| Button, sélection persistante | Hooks React Aria, classes Button/ToggleButton officielles, événements HTML préservés | Clic unique, états désactivés, portée native ; tous les raccourcis non rejoués |
| Input/TextArea/Field, labels et descriptions | Styles officiels, événement/ref natif ou composant officiel selon contrat | Égalité calculée Input, validation native et abandon ; annonces VoiceOver non mesurées |
| Select/options/groupes | Select/ListBox/Popover officiels ; événement HTML relayé au contrôleur existant | Groupe, clavier, dix propriétés du vrai projet ; aucune multisélection ajoutée |
| Checkbox, couleur | Checkbox/ColorSwatch officiels ; sélecteur de couleur système conservé | Case cochée et valeur précise testées ; panneau couleur système non requalifié |
| Disclosure/details/summary | Recette officielle ; détail natif quand son contrat open/onToggle est requis | Clavier et contenu révélé ; approbation et micro-chat simulés |
| Dialogues, formulaires et focus | Modal/Dialog ou dialogue HTML conservé pour refs showModal/close | Ouverture, fermeture, retour de focus, abandon/conservation ; piège de focus de chaque branche non inventorié dynamiquement |
| Liens, titres, paragraphes, listes et retours d’état | Recettes Link/Content/Form et typographie de page officielles | Lecture et code revus ; hover Link raccordé ; pas de campagne exhaustive de contrastes |
| Navigation et icônes | Tree/SearchField officiels, glyphes de scènes existants, Lucide pour chevrons | Développement de la navigation, sélection, icônes visibles |

La visite des écrans ne signifie pas que tous leurs états conditionnels ont été rendus. Figma chargé, propositions de composants, police importée et workflow de sauvegarde assistée ne sont pas déclenchés pour obtenir des captures. Leur couverture est statique et celle des contrats partagés ; la recette humaine finale garde ces réserves.
