# DS-EDIT-19 — Inventaire des styles

Base 5bc6792b13637d1161ce0e50a193bddc7de03ba4. Inspection des données existantes, sans migration ni contrôle navigateur nouveau. Les décisions ci-dessous appliquent la règle déjà définie. Aucune interdiction générale des espacements/typographies : seuls ces styles existants sont examinés.

{"stylesBefore":41,"retainedSemantic":17,"retiredStyles":24,"bindingsUnchanged":188,"autonomousBindings":137,"legacyAliases":24}

| Style | Décision | Consommateurs | Justification |
| --- | --- | --- | --- |
| semantic.color.neutral.background.default | retain-semantic | 4 | Surface neutre de saisie ou de contenu ; Field, SelectField et Panel. |
| semantic.color.secondary.background.default | retain-semantic | 4 | Surface secondaire distinguée du fond neutre ; Notice et document. |
| semantic.color.neutral.text.default | retain-semantic | 9 | Texte de lecture principal sans accent ; champs, labels, panneau et document. |
| semantic.color.secondary.text.default | retain-semantic | 2 | Texte secondaire d’aide à la saisie ; Field/hint. |
| semantic.color.neutral.border.default | retain-semantic | 8 | Délimitation neutre des contrôles et conteneurs ; champs, notices et panneau. |
| semantic.layout.neutral.border-width.default | component-local | 7 | Épaisseur de contour ou d’anneau ; importance/état ne démontre pas une intention propre à cette épaisseur. |
| semantic.layout.neutral.radius.default | component-local | 8 | Arrondi neutre de contrôle/conteneur ; aucune signification établie au-delà de la forme. |
| semantic.layout.auxiliary.spacing.default | component-local | 4 | Même repère utilisé pour padding, gap, marge ou décalage de focus ; aucune relation sémantique indépendante documentée pour ce style. |
| semantic.layout.secondary.spacing.default | component-local | 6 | Même repère utilisé pour padding, gap, marge ou décalage de focus ; aucune relation sémantique indépendante documentée pour ce style. |
| semantic.layout.primary.spacing.default | component-local | 9 | Même repère utilisé pour padding, gap, marge ou décalage de focus ; aucune relation sémantique indépendante documentée pour ce style. |
| semantic.layout.tertiary.spacing.default | component-local | 6 | Même repère utilisé pour padding, gap, marge ou décalage de focus ; aucune relation sémantique indépendante documentée pour ce style. |
| semantic.layout.context.spacing.default | component-local | 1 | Même repère utilisé pour padding, gap, marge ou décalage de focus ; aucune relation sémantique indépendante documentée pour ce style. |
| semantic.type.hierarchy.neutral.font-size.default | component-local | 11 | Le corps associe des usages différents (label, saisie, aide, erreur, notice, tableau) ; pas de rôle typographique transverse établi pour ce style. |
| semantic.type.hierarchy.secondary.font-size.default | component-local | 6 | Le corps associe des usages différents (label, saisie, aide, erreur, notice, tableau) ; pas de rôle typographique transverse établi pour ce style. |
| semantic.type.hierarchy.neutral.font-weight.default | component-local | 12 | Graisse partagée pour des parties différentes ; la priorité du nom n’établit pas un rôle de lecture commun. |
| semantic.type.hierarchy.primary.font-weight.default | component-local | 4 | Graisse partagée pour des parties différentes ; la priorité du nom n’établit pas un rôle de lecture commun. |
| semantic.type.hierarchy.neutral.line-height.default | component-local | 15 | Interligne générique partagé ; aucune fonction sémantique spécifique démontrée. |
| semantic.type.hierarchy.neutral.font-family.default | component-local | 16 | Pile de police générale ; aucune distinction sémantique établie pour ce style. |
| semantic.layout.neutral.content-width.default | component-local | 1 | Largeur maximale de la page de référence Foundations ; aucune règle transversale de contenu documentée au-delà du réglage géométrique. |
| semantic.color.action.primary.background.default | retain-semantic | 1 | Fond de l’action principale, décliné pour hover/loading sans changer son intention. |
| semantic.color.action.primary.background.hover | retain-semantic | 1 | Fond de l’action principale, décliné pour hover/loading sans changer son intention. |
| semantic.color.action.primary.text.default | retain-semantic | 1 | Texte associé à l’action principale. |
| semantic.color.availability-capacity.unavailable.background.disabled | retain-semantic | 1 | Signal de non-disponibilité du contrôle désactivé. |
| semantic.color.feedback.error.text.default | retain-semantic | 3 | Retour d’erreur textuel ; Field/error et Notice/error. |
| semantic.color.feedback.error.border.error | retain-semantic | 2 | Retour d’erreur sur le contour du champ invalide. |
| semantic.color.feedback.success.text.default | retain-semantic | 1 | Confirmation de résultat atteint ; Notice/success. |
| semantic.color.action.primary.focus.focus-visible | retain-semantic | 4 | Repère de focus clavier sur les contrôles interactifs Button, Field et SelectField. |
| semantic.layout.primary.border-width.focus-visible | component-local | 4 | Épaisseur de contour ou d’anneau ; importance/état ne démontre pas une intention propre à cette épaisseur. |
| semantic.layout.secondary.spacing.focus-visible | component-local | 4 | Même repère utilisé pour padding, gap, marge ou décalage de focus ; aucune relation sémantique indépendante documentée pour ce style. |
| semantic.color.action.primary.background.loading | retain-semantic | 1 | Fond de l’action principale, décliné pour hover/loading sans changer son intention. |
| semantic.color.secondary.background.disabled | retain-semantic | 3 | Surface secondaire distinguée du fond neutre ; Notice et document. |
| semantic.color.neutral.text.disabled | retain-semantic | 3 | Texte de lecture principal sans accent ; champs, labels, panneau et document. |
| semantic.color.neutral.border.disabled | retain-semantic | 3 | Délimitation neutre des contrôles et conteneurs ; champs, notices et panneau. |
| semantic.layout.neutral.border-width.disabled | component-local | 3 | Épaisseur de contour ou d’anneau ; importance/état ne démontre pas une intention propre à cette épaisseur. |
| semantic.layout.neutral.radius.disabled | component-local | 3 | Arrondi neutre de contrôle/conteneur ; aucune signification établie au-delà de la forme. |
| semantic.layout.auxiliary.spacing.disabled | component-local | 3 | Même repère utilisé pour padding, gap, marge ou décalage de focus ; aucune relation sémantique indépendante documentée pour ce style. |
| semantic.layout.secondary.spacing.disabled | component-local | 3 | Même repère utilisé pour padding, gap, marge ou décalage de focus ; aucune relation sémantique indépendante documentée pour ce style. |
| semantic.type.hierarchy.neutral.font-size.disabled | component-local | 3 | Le corps associe des usages différents (label, saisie, aide, erreur, notice, tableau) ; pas de rôle typographique transverse établi pour ce style. |
| semantic.type.hierarchy.neutral.font-weight.disabled | component-local | 3 | Graisse partagée pour des parties différentes ; la priorité du nom n’établit pas un rôle de lecture commun. |
| semantic.type.hierarchy.neutral.line-height.disabled | component-local | 2 | Interligne générique partagé ; aucune fonction sémantique spécifique démontrée. |
| semantic.type.hierarchy.neutral.font-family.disabled | component-local | 3 | Pile de police générale ; aucune distinction sémantique établie pour ce style. |

La [matrice structurée](token-classification.json) conserve chaque référence, la primitive terminale, les consommateurs et les correspondances prévues. Le modèle enregistré de la recette possède en plus une primitive propre #b51a00 ; son bouton garde sa référence effective et son attribution sémantique d’origine. Le modèle canonique et celui de recette ont été copiés dans le point de reprise privé, sans journal ni compte. Les alias historiques restent des interfaces de compatibilité, hors catalogue sémantique actif ; ceux d’un style retiré doivent viser sa primitive terminale. Aucune fusion par valeur.
