# Catégories et règles communes

Document généré depuis les tokens JSON DTCG et les règles YAML ; ne pas éditer manuellement.
Régénérer avec `npm run tokens:generate` ; contrôler avec `npm run docs:design-system:check`.

## Decision Tokens : classes explicites

| Classe | Décisions éditables dans DS-EDIT | Justification |
| --- | --- | --- |
| Semantic | 29 | Rôle ou intention de design documentés. |
| Non-semantic | 24 | Convention abstraite documentée, sans rôle d’usage spécifique. |

La classification canonique est dans le référentiel DTCG ; ni la valeur égale ni le nombre de consommateurs ne suffisent à créer une décision. Les décisions de composition, non éditables dans DS-EDIT, sont présentées dans le catalogue complet Non-semantic Tokens.

Les noms de catégories et termes de classement sont en anglais ; les définitions sont en français. Le classement ne renomme aucune identité, ne convertit aucune unité et ne modifie aucune référence. Les familles réservées sans consommateur ne créent pas de token.

## Primitives

| Category | Definition | Examples |
| --- | --- | --- |
| color | Couleurs brutes sans intention produit. | hex-b51a00 |
| space | Distances brutes avec unité conservée. | rem-1 |
| size | Dimensions brutes avec unité conservée. | px-960 |
| radius | Rayons bruts sans référence à un composant. | px-4 |
| stroke | Épaisseurs brutes des traits. | px-1 |
| opacity | Coefficients de transparence ; famille non activée sans usage. | ratio-0-5 |
| type | Propriétés typographiques brutes. | font-size |
| motion | Paramètres temporels bruts ; famille non activée sans usage. | duration |
| color.neutral | Palette neutre explicitement définie ; aucun classement déduit des couleurs actuelles. | neutral-900 |
| color.standalone | Couleurs isolées sans palette documentée ; aucune fonction attribuée par leur teinte. | hex-b51a00 |
| type.font-family | Famille ou pile de polices conservée intégralement. | Inter, ui-sans-serif, system-ui, sans-serif |
| type.font-size | Corps de texte brut avec unité. | rem-1 |
| type.font-weight | Graisse numérique brute. | value-650 |
| type.line-height | Interlignage brut ; coefficient distinct d’une dimension. | ratio-1-5 |
| type.letter-spacing | Approche brute avec unité ; activation conditionnelle. | em-0-01 |
| motion.duration | Durée brute ; activation conditionnelle. | ms-200 |
| motion.easing | Courbe brute documentée ; activation conditionnelle. | standard |

## Semantic tokens

| Category | Definition | Examples |
| --- | --- | --- |
| color | Décisions de couleur par fonction, indépendantes des teintes. | surface |
| color.surface | Couleur des surfaces et de leurs délimitations neutres. | color.surface |
| color.content | Couleur des contenus textuels ou graphiques, y compris leur disponibilité. | color.content |
| color.action | Expression d’une intention d’action ; indépendante de hover ou disabled. | color.action |
| color.feedback | Sens d’un retour ou résultat ; error et success ne créent aucun état interactif. | color.feedback |
| color.selection | Expression d’un choix ou d’une sélection préparée. | color.selection |
| color.focus | Repère coloré du focus visible. | color.focus |
| type | Décisions de lecture ; un style partagé sans rôle plus précis reste au parent. | body |
| type.body | Style du texte courant. | type.body |
| type.heading | Style des titres structurants ; niveaux explicites. | type.heading |
| type.label | Style des libellés identifiant un élément ou une action. | type.label |
| type.caption | Style des légendes et informations annexes. | type.caption |
| type.code | Style des contenus de code. | type.code |
| space | Distances fonctionnelles ; un espacement partagé entre contextes reste au parent. | page |
| space.page | Marges internes globales d’une page. | space.page |
| space.section | Distances entre sections. | space.section |
| space.group | Distances entre éléments regroupés. | space.group |
| space.grid | Gouttières et marges de grille. | space.grid |
| space.surface | Espacements internes des surfaces. | space.surface |
| space.control | Espacements internes des contrôles. | space.control |
| size | Dimensions fonctionnelles indépendantes des valeurs brutes. | reading |
| size.reading | Largeur utile à la lecture. | size.reading |
| size.container | Dimension d’un conteneur de composition. | size.container |
| size.interactive-target | Dimension d’une cible interactive. | size.interactive-target |
| size.icon | Dimension d’un élément iconographique. | size.icon |
| shape | Géométrie fonctionnelle ; un arrondi partagé entre surfaces et contrôles reste au parent. | surface |
| shape.surface | Rayon ou forme d’une surface. | shape.surface |
| shape.control | Rayon ou forme d’un contrôle. | shape.control |
| shape.circle | Forme circulaire. | shape.circle |
| shape.pill | Forme de pastille allongée. | shape.pill |
| stroke | Délimitation fonctionnelle ; un trait partagé reste au parent. | divider |
| stroke.divider | Trait de séparation structurelle. | stroke.divider |
| stroke.surface | Contour d’une surface. | stroke.surface |
| stroke.control | Contour d’un contrôle. | stroke.control |
| stroke.focus | Épaisseur du repère de focus. | stroke.focus |
| elevation | Profondeur visuelle ; ne définit pas automatiquement l’ordre des couches. | raised |
| elevation.raised | Surface légèrement détachée de son contexte. | elevation.raised |
| elevation.floating | Élément flottant au-dessus du contenu. | elevation.floating |
| elevation.modal | Relief visuel d’une surface modale. | elevation.modal |
| layer | Ordre de recouvrement ; indépendant des ombres. | content |
| layer.content | Couche du contenu courant. | layer.content |
| layer.sticky | Couche des éléments fixes ou persistants. | layer.sticky |
| layer.dropdown | Couche des menus flottants. | layer.dropdown |
| layer.dialog | Couche des dialogues. | layer.dialog |
| layer.notification | Couche des notifications. | layer.notification |
| opacity | Transparence fonctionnelle ; ne présume pas une conformité d’accessibilité. | muted |
| opacity.muted | Atténuation visuelle d’un contenu. | opacity.muted |
| opacity.disabled | Atténuation liée à une indisponibilité. | opacity.disabled |
| opacity.scrim | Transparence d’un voile. | opacity.scrim |
| motion | Comportements temporels partagés. | enter |
| motion.enter | Transition d’apparition. | motion.enter |
| motion.exit | Transition de disparition. | motion.exit |
| motion.transition | Transition entre situations. | motion.transition |
| motion.expand | Développement ou réduction. | motion.expand |
| motion.feedback | Mouvement accompagnant un retour d’action. | motion.feedback |
| content | Clés de messages facultatives, distinctes du graphe visuel et des primitives. | action |
| content.action | Libellés d’action réutilisables. | content.action |
| content.common | Messages communs. | content.common |
| content.form | Messages de formulaire. | content.form |
| content.error | Messages d’erreur. | content.error |
| content.notification | Messages de notification. | content.notification |
| content.empty | Messages des situations sans contenu. | content.empty |
| content.dialog | Messages de dialogue. | content.dialog |

## Component tokens

| Category | Prepared tokens |
| --- | --- |
| Button | 15 |
| Field | 84 |
| SelectField | 29 |
| Notice | 33 |
| Panel | 11 |
| Foundations | 16 |

## Classification enregistrée

| Identity | Category |
| --- | --- |
| primitive.color.hex-ffffff | color.standalone |
| primitive.color.hex-f1f5f9 | color.standalone |
| primitive.color.hex-0f172a | color.standalone |
| primitive.color.hex-475569 | color.standalone |
| primitive.color.hex-64748b | color.standalone |
| primitive.stroke.px-1 | stroke |
| primitive.radius.rem-0-5 | radius |
| primitive.space.rem-0-7 | space |
| primitive.space.rem-1 | space |
| primitive.space.rem-1-5 | space |
| primitive.space.rem-0-5 | space |
| primitive.space.rem-2 | space |
| primitive.type.font-size.rem-1 | type.font-size |
| primitive.type.font-size.rem-0-875 | type.font-size |
| primitive.type.font-weight.value-400 | type.font-weight |
| primitive.type.font-weight.value-650 | type.font-weight |
| primitive.type.line-height.ratio-1-5 | type.line-height |
| primitive.type.font-family.stack-496e7465722c2075692d73616e732d73657269662c2073797374656d2d75692c2073616e732d7365726966 | type.font-family |
| primitive.size.rem-70 | size |
| primitive.color.hex-1d4ed8 | color.standalone |
| primitive.color.hex-1e40af | color.standalone |
| primitive.color.hex-b91c1c | color.standalone |
| primitive.color.hex-166534 | color.standalone |
| primitive.stroke.px-3 | stroke |
| primitive.space.px-3 | space |
| semantic.color.neutral.background.default | color.surface |
| semantic.color.secondary.background.default | color.surface |
| semantic.color.neutral.text.default | color.content |
| semantic.color.secondary.text.default | color.content |
| semantic.color.neutral.border.default | color.surface |
| semantic.color.action.primary.background.default | color.action |
| semantic.color.action.primary.background.hover | color.action |
| semantic.color.action.primary.text.default | color.action |
| semantic.color.availability-capacity.unavailable.background.disabled | color.surface |
| semantic.color.feedback.error.text.default | color.feedback |
| semantic.color.feedback.error.border.error | color.feedback |
| semantic.color.feedback.success.text.default | color.feedback |
| semantic.color.action.primary.focus.focus-visible | color.focus |
| semantic.color.action.primary.background.loading | color.action |
| semantic.color.secondary.background.disabled | color.surface |
| semantic.color.neutral.text.disabled | color.content |
| semantic.color.neutral.border.disabled | color.surface |
| semantic.layout.scale.radius-step-01.radius.default | shape |
| semantic.layout.control-shape.radius.default | shape |
| semantic.type.scale.type-font-family-step-01.font-family.default | type |
| semantic.type.hierarchy.control-family.font-family.default | type |
| semantic.type.scale.type-font-size-step-02.font-size.default | type |
| semantic.type.scale.type-font-weight-step-02.font-weight.default | type |
| semantic.type.scale.type-line-height-step-01.line-height.default | type |
| semantic.layout.scale.space-step-02.spacing.default | space |
| semantic.layout.control-block-space.spacing.default | space |
| semantic.layout.scale.space-step-04.spacing.default | space |
| semantic.layout.control-inline-space.spacing.default | space |
| semantic.layout.scale.space-step-06.spacing.focus-visible | space |
| semantic.layout.scale.stroke-step-02.border-width.focus-visible | stroke |
| semantic.layout.scale.radius-step-01.radius.disabled | shape |
| semantic.layout.control-shape.radius.disabled | shape |
| semantic.layout.scale.stroke-step-01.border-width.default | stroke |
| semantic.layout.scale.stroke-step-01.border-width.disabled | stroke |
| semantic.type.scale.type-font-family-step-01.font-family.disabled | type |
| semantic.type.hierarchy.control-family.font-family.disabled | type |
| semantic.type.scale.type-font-size-step-02.font-size.disabled | type |
| semantic.type.scale.type-font-weight-step-01.font-weight.default | type |
| semantic.type.scale.type-font-weight-step-01.font-weight.disabled | type |
| semantic.type.scale.type-line-height-step-01.line-height.disabled | type |
| semantic.layout.scale.space-step-02.spacing.disabled | space |
| semantic.layout.control-block-space.spacing.disabled | space |
| semantic.layout.scale.space-step-04.spacing.disabled | space |
| semantic.layout.control-inline-space.spacing.disabled | space |
| semantic.type.scale.type-font-size-step-01.font-size.default | type |
| semantic.layout.scale.space-step-01.spacing.default | space |
| semantic.type.hierarchy.body-family.font-family.default | type |
| semantic.layout.scale.space-step-03.spacing.default | space |
| semantic.layout.scale.size-step-01.content-width.default | size.container |
| semantic.layout.reading-width.content-width.default | size.container |
| semantic.layout.scale.space-step-05.spacing.default | space |
| semantic.layout.feedback-shape.radius.default | shape |
| semantic.layout.container-shape.radius.default | shape |
| component.button.default.root.background.default | Button |
| component.button.default.root.foreground.default | Button |
| component.button.default.root.border-radius.default | Button |
| component.button.default.root.padding-block.default | Button |
| component.button.default.root.padding-inline.default | Button |
| component.button.default.root.font-size.default | Button |
| component.button.default.root.font-weight.default | Button |
| component.button.default.root.line-height.default | Button |
| component.button.default.root.font-family.default | Button |
| component.button.default.root.background.hover | Button |
| component.button.default.root.background.disabled | Button |
| component.button.default.root.background.loading | Button |
| component.button.default.root.ring-color.focus-visible | Button |
| component.button.default.root.ring-width.focus-visible | Button |
| component.button.default.root.ring-offset.focus-visible | Button |
| component.field.single-line.root.gap.default | Field |
| component.field.single-line.label.foreground.default | Field |
| component.field.single-line.label.font-size.default | Field |
| component.field.single-line.label.font-weight.default | Field |
| component.field.single-line.label.line-height.default | Field |
| component.field.single-line.label.font-family.default | Field |
| component.field.single-line.control.background.default | Field |
| component.field.single-line.control.background.disabled | Field |
| component.field.single-line.control.foreground.default | Field |
| component.field.single-line.control.foreground.disabled | Field |
| component.field.single-line.control.border-color.default | Field |
| component.field.single-line.control.border-color.disabled | Field |
| component.field.single-line.control.border-width.default | Field |
| component.field.single-line.control.border-width.disabled | Field |
| component.field.single-line.control.border-radius.default | Field |
| component.field.single-line.control.border-radius.disabled | Field |
| component.field.single-line.control.padding-block.default | Field |
| component.field.single-line.control.padding-block.disabled | Field |
| component.field.single-line.control.padding-inline.default | Field |
| component.field.single-line.control.padding-inline.disabled | Field |
| component.field.single-line.control.font-size.default | Field |
| component.field.single-line.control.font-size.disabled | Field |
| component.field.single-line.control.font-weight.default | Field |
| component.field.single-line.control.font-weight.disabled | Field |
| component.field.single-line.control.line-height.default | Field |
| component.field.single-line.control.line-height.disabled | Field |
| component.field.single-line.control.font-family.default | Field |
| component.field.single-line.control.font-family.disabled | Field |
| component.field.single-line.control.ring-color.focus-visible | Field |
| component.field.single-line.control.ring-width.focus-visible | Field |
| component.field.single-line.control.ring-offset.focus-visible | Field |
| component.field.single-line.control.border-color.error | Field |
| component.field.single-line.hint.foreground.default | Field |
| component.field.single-line.hint.font-size.default | Field |
| component.field.single-line.hint.font-weight.default | Field |
| component.field.single-line.hint.line-height.default | Field |
| component.field.single-line.hint.font-family.default | Field |
| component.field.single-line.error.foreground.default | Field |
| component.field.single-line.error.font-size.default | Field |
| component.field.single-line.error.font-weight.default | Field |
| component.field.single-line.error.line-height.default | Field |
| component.field.single-line.error.font-family.default | Field |
| component.field.multiline.root.gap.default | Field |
| component.field.multiline.label.foreground.default | Field |
| component.field.multiline.label.font-size.default | Field |
| component.field.multiline.label.font-weight.default | Field |
| component.field.multiline.label.line-height.default | Field |
| component.field.multiline.label.font-family.default | Field |
| component.field.multiline.control.background.default | Field |
| component.field.multiline.control.background.disabled | Field |
| component.field.multiline.control.foreground.default | Field |
| component.field.multiline.control.foreground.disabled | Field |
| component.field.multiline.control.border-color.default | Field |
| component.field.multiline.control.border-color.disabled | Field |
| component.field.multiline.control.border-width.default | Field |
| component.field.multiline.control.border-width.disabled | Field |
| component.field.multiline.control.border-radius.default | Field |
| component.field.multiline.control.border-radius.disabled | Field |
| component.field.multiline.control.padding-block.default | Field |
| component.field.multiline.control.padding-block.disabled | Field |
| component.field.multiline.control.padding-inline.default | Field |
| component.field.multiline.control.padding-inline.disabled | Field |
| component.field.multiline.control.font-size.default | Field |
| component.field.multiline.control.font-size.disabled | Field |
| component.field.multiline.control.font-weight.default | Field |
| component.field.multiline.control.font-weight.disabled | Field |
| component.field.multiline.control.line-height.default | Field |
| component.field.multiline.control.line-height.disabled | Field |
| component.field.multiline.control.font-family.default | Field |
| component.field.multiline.control.font-family.disabled | Field |
| component.field.multiline.control.ring-color.focus-visible | Field |
| component.field.multiline.control.ring-width.focus-visible | Field |
| component.field.multiline.control.ring-offset.focus-visible | Field |
| component.field.multiline.control.border-color.error | Field |
| component.field.multiline.hint.foreground.default | Field |
| component.field.multiline.hint.font-size.default | Field |
| component.field.multiline.hint.font-weight.default | Field |
| component.field.multiline.hint.line-height.default | Field |
| component.field.multiline.hint.font-family.default | Field |
| component.field.multiline.error.foreground.default | Field |
| component.field.multiline.error.font-size.default | Field |
| component.field.multiline.error.font-weight.default | Field |
| component.field.multiline.error.line-height.default | Field |
| component.field.multiline.error.font-family.default | Field |
| component.select-field.default.root.gap.default | SelectField |
| component.select-field.default.label.foreground.default | SelectField |
| component.select-field.default.label.font-size.default | SelectField |
| component.select-field.default.label.font-weight.default | SelectField |
| component.select-field.default.label.line-height.default | SelectField |
| component.select-field.default.label.font-family.default | SelectField |
| component.select-field.default.control.background.default | SelectField |
| component.select-field.default.control.background.disabled | SelectField |
| component.select-field.default.control.foreground.default | SelectField |
| component.select-field.default.control.foreground.disabled | SelectField |
| component.select-field.default.control.border-color.default | SelectField |
| component.select-field.default.control.border-color.disabled | SelectField |
| component.select-field.default.control.border-width.default | SelectField |
| component.select-field.default.control.border-width.disabled | SelectField |
| component.select-field.default.control.border-radius.default | SelectField |
| component.select-field.default.control.border-radius.disabled | SelectField |
| component.select-field.default.control.padding-block.default | SelectField |
| component.select-field.default.control.padding-block.disabled | SelectField |
| component.select-field.default.control.padding-inline.default | SelectField |
| component.select-field.default.control.padding-inline.disabled | SelectField |
| component.select-field.default.control.font-size.default | SelectField |
| component.select-field.default.control.font-size.disabled | SelectField |
| component.select-field.default.control.font-weight.default | SelectField |
| component.select-field.default.control.font-weight.disabled | SelectField |
| component.select-field.default.control.font-family.default | SelectField |
| component.select-field.default.control.font-family.disabled | SelectField |
| component.select-field.default.control.ring-color.focus-visible | SelectField |
| component.select-field.default.control.ring-width.focus-visible | SelectField |
| component.select-field.default.control.ring-offset.focus-visible | SelectField |
| component.notice.info.root.background.default | Notice |
| component.notice.info.root.foreground.default | Notice |
| component.notice.info.root.border-color.default | Notice |
| component.notice.info.root.border-width.default | Notice |
| component.notice.info.root.border-radius.default | Notice |
| component.notice.info.root.padding-block.default | Notice |
| component.notice.info.root.padding-inline.default | Notice |
| component.notice.info.root.font-size.default | Notice |
| component.notice.info.root.font-weight.default | Notice |
| component.notice.info.root.line-height.default | Notice |
| component.notice.info.root.font-family.default | Notice |
| component.notice.success.root.background.default | Notice |
| component.notice.success.root.foreground.default | Notice |
| component.notice.success.root.border-color.default | Notice |
| component.notice.success.root.border-width.default | Notice |
| component.notice.success.root.border-radius.default | Notice |
| component.notice.success.root.padding-block.default | Notice |
| component.notice.success.root.padding-inline.default | Notice |
| component.notice.success.root.font-size.default | Notice |
| component.notice.success.root.font-weight.default | Notice |
| component.notice.success.root.line-height.default | Notice |
| component.notice.success.root.font-family.default | Notice |
| component.notice.error.root.background.default | Notice |
| component.notice.error.root.foreground.default | Notice |
| component.notice.error.root.border-color.default | Notice |
| component.notice.error.root.border-width.default | Notice |
| component.notice.error.root.border-radius.default | Notice |
| component.notice.error.root.padding-block.default | Notice |
| component.notice.error.root.padding-inline.default | Notice |
| component.notice.error.root.font-size.default | Notice |
| component.notice.error.root.font-weight.default | Notice |
| component.notice.error.root.line-height.default | Notice |
| component.notice.error.root.font-family.default | Notice |
| component.panel.default.root.background.default | Panel |
| component.panel.default.root.foreground.default | Panel |
| component.panel.default.root.border-color.default | Panel |
| component.panel.default.root.border-width.default | Panel |
| component.panel.default.root.border-radius.default | Panel |
| component.panel.default.root.padding-block.default | Panel |
| component.panel.default.root.padding-inline.default | Panel |
| component.panel.default.root.font-size.default | Panel |
| component.panel.default.root.font-weight.default | Panel |
| component.panel.default.root.line-height.default | Panel |
| component.panel.default.root.font-family.default | Panel |
| component.foundations.default.document.background.default | Foundations |
| component.foundations.default.document.foreground.default | Foundations |
| component.foundations.default.document.font-size.default | Foundations |
| component.foundations.default.document.font-weight.default | Foundations |
| component.foundations.default.document.line-height.default | Foundations |
| component.foundations.default.document.font-family.default | Foundations |
| component.foundations.default.page.max-width.default | Foundations |
| component.foundations.default.page.page-margin.default | Foundations |
| component.foundations.default.page-mobile.page-margin.default | Foundations |
| component.foundations.default.layout-small.gap.default | Foundations |
| component.foundations.default.layout-medium.gap.default | Foundations |
| component.foundations.default.layout-large.gap.default | Foundations |
| component.foundations.default.table.font-size.default | Foundations |
| component.foundations.default.table.border-color.default | Foundations |
| component.foundations.default.table.padding-block.default | Foundations |
| component.foundations.default.table.padding-inline.default | Foundations |

## Vocabulary

| Term | Axis | Definition | Scope | Examples |
| --- | --- | --- | --- | --- |
| domain | concept | Famille de décision ; distincte du type de validation. | concept | space |
| usage | concept | Fonction réutilisable et documentée ; ne se déduit pas d’une valeur. | concept | page |
| property | concept | Caractéristique réglée dans le contrat ; forme technique conservée. | concept | padding-inline |
| intent | concept | Sens exprimé ; distinct de la situation interactive. | concept | actions.destructive |
| variant | concept | Déclinaison locale d’un même usage. | concept | compact |
| state | concept | Situation préparée du contrôle ou de son interaction. | concept | hover |
| mode | concept | Contexte global sur un axe défini, sans nouvelle identité. | concept | theme.light |
| primary | priority | Premier niveau de priorité de lecture ou d’action ; ne signifie ni plus grand ni plus élevé. | priority | actions.primary |
| secondary | priority | Priorité subordonnée au niveau principal. | priority | neutral-hierarchy.secondary |
| tertiary | priority | Troisième niveau de priorité. | priority | neutral-hierarchy.tertiary |
| level-1 | heading | Premier niveau de titre, distinct d’une priorité d’action. | type | type.heading |
| level-2 | heading | Deuxième niveau de titre. | type | type.heading |
| level-3 | heading | Troisième niveau de titre. | type | type.heading |
| compact | density | Densité resserrée ; variante locale ou mode global explicitement choisi. | space | space.control |
| comfortable | density | Densité aérée ; variante locale ou mode global explicitement choisi. | space | space.control |
| raised | elevation | Surface légèrement détachée ; pas une priorité. | elevation | elevation.raised |
| floating | elevation | Relief d’un élément flottant. | elevation | elevation.floating |
| modal | elevation | Relief d’une surface modale ; layer garde son ordre propre. | elevation | elevation.modal |
| subtle | intensity | Accentuation faible dans un usage défini. | color | color.surface |
| strong | intensity | Accentuation forte dans un usage défini. | color | color.content |
| default | state | Situation de référence du contrat préparé. | state | component.button.default.root.background.default |
| hover | state | Survol par un pointeur ; ne modifie pas l’intention. | state | component.button.default.root.background.hover |
| focus-visible | state | Focus visible selon l’interaction clavier/navigateur. | state | component.button.default.root.ring-color.focus-visible |
| disabled | state | Indisponibilité d’un contrôle. | state | component.button.default.root.background.disabled |
| loading | state | Activité du contrôle en cours ; distincte du statut métier progress. | state | component.button.default.root.background.loading |
| error | state | Nom historique d’état de validation du composant ; distinct du sens information-result.error et conservé pour compatibilité. | state | component.field.default.control.border-color.error |
| selected | state | Choix sélectionné ; disponible seulement si le contrat le prépare. | state | selection |
| role | concept | Fonction technique d’une propriété dans la matrice ; distincte de son usage de présentation. | concept | font-size |
| surface | concept | Rôle de couleur de fond ; background est la propriété du contrat. | color | color.surface |
| text | concept | Rôle de couleur du texte ; foreground est la propriété du contrat. | color | color.content |
| border | concept | Rôle de couleur du contour ; distinct de border-width. | color | color.surface |
| icon | concept | Rôle de couleur d’une icône ; n’active aucune icône absente. | color | color.content |
| focus | concept | Rôle de couleur du repère de focus ; épaisseur et décalage restent des propriétés distinctes. | color | color.focus |
| spacing | concept | Rôle technique de distance, commun à gap, padding et décalage ; la famille de primitive reste space. | space | space.page |
| radius | concept | Rôle technique du rayon ; famille primitive radius, domaine sémantique shape. | shape | shape.control |
| border-width | concept | Rôle technique d’épaisseur d’un trait, distinct de sa couleur. | stroke | stroke.control |
| content-width | concept | Rôle technique de largeur du contenu ; dimension sémantique de conteneur. | size | size.container |
| font-size | concept | Corps de texte ; dimension typographique, sans assimilation à spacing. | type | type.body |
| font-family | concept | Famille ou pile de polices ; valeur complète conservée. | type | type.body |
| font-weight | concept | Graisse numérique du texte ; distincte de l’importance de l’action. | type | type.label |
| line-height | concept | Interlignage du texte ; coefficient et dimension restent distincts. | type | type.body |

## Modes

Axes déclarés, non activés ; aucun thème, format ou langage supplémentaire n’est exécuté. Repli non défini tant que le mode reste inactif.

| Axis | Values | Active | Selection |
| --- | --- | --- | --- |
| theme | dark ; light | false | Non activé &#58; définir sélection, repli et combinaisons avant tout raccordement. |
| viewport | desktop ; mobile ; tablet | false | Les bindings responsive existants sont conservés ; aucun nouveau moteur de modes. |
| density | comfortable ; compact | false | Non activé &#58; un contexte global exige une règle propre ; variante locale distincte. |
| locale | en ; fr | false | Non activé &#58; content exige son mandat et ses données, sans primitive visuelle. |

## Associations préparées

Même partie et même contexte, avec héritage explicite de default. Les paires sans fond déclaré sont non mesurées ; un fond hérité du DOM et les combinaisons réellement rendues demandent le contrôle navigateur. Les ratios sont des mesures, pas une certification ni une autorisation de changer les valeurs. Aucun token d’icône ou de mouvement n’est inventé.

| Component | Variant / Part / State | Properties / tokens / references / values | Text contrast | Icon contrast |
| --- | --- | --- | --- | --- |
| Button | default / root / default | background &#58; component.button.default.root.background.default &#58; semantic.color.action.primary.background.default &#58; &#35;1d4ed8 ; foreground &#58; component.button.default.root.foreground.default &#58; semantic.color.action.primary.text.default &#58; &#35;ffffff ; borderRadius &#58; component.button.default.root.border-radius.default &#58; semantic.layout.control-shape.radius.default &#58; 0.5rem ; paddingBlock &#58; component.button.default.root.padding-block.default &#58; semantic.layout.control-block-space.spacing.default &#58; 0.7rem ; paddingInline &#58; component.button.default.root.padding-inline.default &#58; semantic.layout.control-inline-space.spacing.default &#58; 1rem ; fontSize &#58; component.button.default.root.font-size.default &#58; semantic.type.scale.type-font-size-step-02.font-size.default &#58; 1rem ; fontWeight &#58; component.button.default.root.font-weight.default &#58; semantic.type.scale.type-font-weight-step-02.font-weight.default &#58; 650 ; lineHeight &#58; component.button.default.root.line-height.default &#58; semantic.type.scale.type-line-height-step-01.line-height.default &#58; 1.5 ; fontFamily &#58; component.button.default.root.font-family.default &#58; semantic.type.hierarchy.control-family.font-family.default &#58; Inter, ui-sans-serif, system-ui, sans-serif | 6.70&#58;1 | Not measured |
| Button | default / root / hover | background &#58; component.button.default.root.background.hover &#58; semantic.color.action.primary.background.hover &#58; &#35;1e40af ; foreground &#58; component.button.default.root.foreground.default &#58; semantic.color.action.primary.text.default &#58; &#35;ffffff ; borderRadius &#58; component.button.default.root.border-radius.default &#58; semantic.layout.control-shape.radius.default &#58; 0.5rem ; paddingBlock &#58; component.button.default.root.padding-block.default &#58; semantic.layout.control-block-space.spacing.default &#58; 0.7rem ; paddingInline &#58; component.button.default.root.padding-inline.default &#58; semantic.layout.control-inline-space.spacing.default &#58; 1rem ; fontSize &#58; component.button.default.root.font-size.default &#58; semantic.type.scale.type-font-size-step-02.font-size.default &#58; 1rem ; fontWeight &#58; component.button.default.root.font-weight.default &#58; semantic.type.scale.type-font-weight-step-02.font-weight.default &#58; 650 ; lineHeight &#58; component.button.default.root.line-height.default &#58; semantic.type.scale.type-line-height-step-01.line-height.default &#58; 1.5 ; fontFamily &#58; component.button.default.root.font-family.default &#58; semantic.type.hierarchy.control-family.font-family.default &#58; Inter, ui-sans-serif, system-ui, sans-serif | 8.72&#58;1 | Not measured |
| Button | default / root / disabled | background &#58; component.button.default.root.background.disabled &#58; semantic.color.availability-capacity.unavailable.background.disabled &#58; &#35;64748b ; foreground &#58; component.button.default.root.foreground.default &#58; semantic.color.action.primary.text.default &#58; &#35;ffffff ; borderRadius &#58; component.button.default.root.border-radius.default &#58; semantic.layout.control-shape.radius.default &#58; 0.5rem ; paddingBlock &#58; component.button.default.root.padding-block.default &#58; semantic.layout.control-block-space.spacing.default &#58; 0.7rem ; paddingInline &#58; component.button.default.root.padding-inline.default &#58; semantic.layout.control-inline-space.spacing.default &#58; 1rem ; fontSize &#58; component.button.default.root.font-size.default &#58; semantic.type.scale.type-font-size-step-02.font-size.default &#58; 1rem ; fontWeight &#58; component.button.default.root.font-weight.default &#58; semantic.type.scale.type-font-weight-step-02.font-weight.default &#58; 650 ; lineHeight &#58; component.button.default.root.line-height.default &#58; semantic.type.scale.type-line-height-step-01.line-height.default &#58; 1.5 ; fontFamily &#58; component.button.default.root.font-family.default &#58; semantic.type.hierarchy.control-family.font-family.default &#58; Inter, ui-sans-serif, system-ui, sans-serif | 4.76&#58;1 | Not measured |
| Button | default / root / loading | background &#58; component.button.default.root.background.loading &#58; semantic.color.action.primary.background.loading &#58; &#35;1d4ed8 ; foreground &#58; component.button.default.root.foreground.default &#58; semantic.color.action.primary.text.default &#58; &#35;ffffff ; borderRadius &#58; component.button.default.root.border-radius.default &#58; semantic.layout.control-shape.radius.default &#58; 0.5rem ; paddingBlock &#58; component.button.default.root.padding-block.default &#58; semantic.layout.control-block-space.spacing.default &#58; 0.7rem ; paddingInline &#58; component.button.default.root.padding-inline.default &#58; semantic.layout.control-inline-space.spacing.default &#58; 1rem ; fontSize &#58; component.button.default.root.font-size.default &#58; semantic.type.scale.type-font-size-step-02.font-size.default &#58; 1rem ; fontWeight &#58; component.button.default.root.font-weight.default &#58; semantic.type.scale.type-font-weight-step-02.font-weight.default &#58; 650 ; lineHeight &#58; component.button.default.root.line-height.default &#58; semantic.type.scale.type-line-height-step-01.line-height.default &#58; 1.5 ; fontFamily &#58; component.button.default.root.font-family.default &#58; semantic.type.hierarchy.control-family.font-family.default &#58; Inter, ui-sans-serif, system-ui, sans-serif | 6.70&#58;1 | Not measured |
| Button | default / root / focus-visible | background &#58; component.button.default.root.background.default &#58; semantic.color.action.primary.background.default &#58; &#35;1d4ed8 ; foreground &#58; component.button.default.root.foreground.default &#58; semantic.color.action.primary.text.default &#58; &#35;ffffff ; borderRadius &#58; component.button.default.root.border-radius.default &#58; semantic.layout.control-shape.radius.default &#58; 0.5rem ; paddingBlock &#58; component.button.default.root.padding-block.default &#58; semantic.layout.control-block-space.spacing.default &#58; 0.7rem ; paddingInline &#58; component.button.default.root.padding-inline.default &#58; semantic.layout.control-inline-space.spacing.default &#58; 1rem ; fontSize &#58; component.button.default.root.font-size.default &#58; semantic.type.scale.type-font-size-step-02.font-size.default &#58; 1rem ; fontWeight &#58; component.button.default.root.font-weight.default &#58; semantic.type.scale.type-font-weight-step-02.font-weight.default &#58; 650 ; lineHeight &#58; component.button.default.root.line-height.default &#58; semantic.type.scale.type-line-height-step-01.line-height.default &#58; 1.5 ; fontFamily &#58; component.button.default.root.font-family.default &#58; semantic.type.hierarchy.control-family.font-family.default &#58; Inter, ui-sans-serif, system-ui, sans-serif ; ringColor &#58; component.button.default.root.ring-color.focus-visible &#58; semantic.color.action.primary.focus.focus-visible &#58; &#35;1d4ed8 ; ringWidth &#58; component.button.default.root.ring-width.focus-visible &#58; semantic.layout.scale.stroke-step-02.border-width.focus-visible &#58; 3px ; ringOffset &#58; component.button.default.root.ring-offset.focus-visible &#58; semantic.layout.scale.space-step-06.spacing.focus-visible &#58; 3px | 6.70&#58;1 | Not measured |
| Field | single-line / root / default | gap &#58; component.field.single-line.root.gap.default &#58; semantic.layout.scale.space-step-01.spacing.default &#58; 0.5rem | Not measured | Not measured |
| Field | single-line / label / default | foreground &#58; component.field.single-line.label.foreground.default &#58; semantic.color.neutral.text.default &#58; &#35;0f172a ; fontSize &#58; component.field.single-line.label.font-size.default &#58; semantic.type.scale.type-font-size-step-02.font-size.default &#58; 1rem ; fontWeight &#58; component.field.single-line.label.font-weight.default &#58; semantic.type.scale.type-font-weight-step-02.font-weight.default &#58; 650 ; lineHeight &#58; component.field.single-line.label.line-height.default &#58; semantic.type.scale.type-line-height-step-01.line-height.default &#58; 1.5 ; fontFamily &#58; component.field.single-line.label.font-family.default &#58; semantic.type.hierarchy.control-family.font-family.default &#58; Inter, ui-sans-serif, system-ui, sans-serif | Not measured | Not measured |
| Field | single-line / control / default | background &#58; component.field.single-line.control.background.default &#58; semantic.color.neutral.background.default &#58; &#35;ffffff ; foreground &#58; component.field.single-line.control.foreground.default &#58; semantic.color.neutral.text.default &#58; &#35;0f172a ; borderColor &#58; component.field.single-line.control.border-color.default &#58; semantic.color.neutral.border.default &#58; &#35;64748b ; borderWidth &#58; component.field.single-line.control.border-width.default &#58; semantic.layout.scale.stroke-step-01.border-width.default &#58; 1px ; borderRadius &#58; component.field.single-line.control.border-radius.default &#58; semantic.layout.control-shape.radius.default &#58; 0.5rem ; paddingBlock &#58; component.field.single-line.control.padding-block.default &#58; semantic.layout.control-block-space.spacing.default &#58; 0.7rem ; paddingInline &#58; component.field.single-line.control.padding-inline.default &#58; semantic.layout.control-inline-space.spacing.default &#58; 1rem ; fontSize &#58; component.field.single-line.control.font-size.default &#58; semantic.type.scale.type-font-size-step-02.font-size.default &#58; 1rem ; fontWeight &#58; component.field.single-line.control.font-weight.default &#58; semantic.type.scale.type-font-weight-step-01.font-weight.default &#58; 400 ; lineHeight &#58; component.field.single-line.control.line-height.default &#58; semantic.type.scale.type-line-height-step-01.line-height.default &#58; 1.5 ; fontFamily &#58; component.field.single-line.control.font-family.default &#58; semantic.type.hierarchy.control-family.font-family.default &#58; Inter, ui-sans-serif, system-ui, sans-serif | 17.85&#58;1 | Not measured |
| Field | single-line / control / disabled | background &#58; component.field.single-line.control.background.disabled &#58; semantic.color.secondary.background.disabled &#58; &#35;f1f5f9 ; foreground &#58; component.field.single-line.control.foreground.disabled &#58; semantic.color.neutral.text.disabled &#58; &#35;0f172a ; borderColor &#58; component.field.single-line.control.border-color.disabled &#58; semantic.color.neutral.border.disabled &#58; &#35;64748b ; borderWidth &#58; component.field.single-line.control.border-width.disabled &#58; semantic.layout.scale.stroke-step-01.border-width.disabled &#58; 1px ; borderRadius &#58; component.field.single-line.control.border-radius.disabled &#58; semantic.layout.control-shape.radius.disabled &#58; 0.5rem ; paddingBlock &#58; component.field.single-line.control.padding-block.disabled &#58; semantic.layout.control-block-space.spacing.disabled &#58; 0.7rem ; paddingInline &#58; component.field.single-line.control.padding-inline.disabled &#58; semantic.layout.control-inline-space.spacing.disabled &#58; 1rem ; fontSize &#58; component.field.single-line.control.font-size.disabled &#58; semantic.type.scale.type-font-size-step-02.font-size.disabled &#58; 1rem ; fontWeight &#58; component.field.single-line.control.font-weight.disabled &#58; semantic.type.scale.type-font-weight-step-01.font-weight.disabled &#58; 400 ; lineHeight &#58; component.field.single-line.control.line-height.disabled &#58; semantic.type.scale.type-line-height-step-01.line-height.disabled &#58; 1.5 ; fontFamily &#58; component.field.single-line.control.font-family.disabled &#58; semantic.type.hierarchy.control-family.font-family.disabled &#58; Inter, ui-sans-serif, system-ui, sans-serif | 16.30&#58;1 | Not measured |
| Field | single-line / control / focus-visible | background &#58; component.field.single-line.control.background.default &#58; semantic.color.neutral.background.default &#58; &#35;ffffff ; foreground &#58; component.field.single-line.control.foreground.default &#58; semantic.color.neutral.text.default &#58; &#35;0f172a ; borderColor &#58; component.field.single-line.control.border-color.default &#58; semantic.color.neutral.border.default &#58; &#35;64748b ; borderWidth &#58; component.field.single-line.control.border-width.default &#58; semantic.layout.scale.stroke-step-01.border-width.default &#58; 1px ; borderRadius &#58; component.field.single-line.control.border-radius.default &#58; semantic.layout.control-shape.radius.default &#58; 0.5rem ; paddingBlock &#58; component.field.single-line.control.padding-block.default &#58; semantic.layout.control-block-space.spacing.default &#58; 0.7rem ; paddingInline &#58; component.field.single-line.control.padding-inline.default &#58; semantic.layout.control-inline-space.spacing.default &#58; 1rem ; fontSize &#58; component.field.single-line.control.font-size.default &#58; semantic.type.scale.type-font-size-step-02.font-size.default &#58; 1rem ; fontWeight &#58; component.field.single-line.control.font-weight.default &#58; semantic.type.scale.type-font-weight-step-01.font-weight.default &#58; 400 ; lineHeight &#58; component.field.single-line.control.line-height.default &#58; semantic.type.scale.type-line-height-step-01.line-height.default &#58; 1.5 ; fontFamily &#58; component.field.single-line.control.font-family.default &#58; semantic.type.hierarchy.control-family.font-family.default &#58; Inter, ui-sans-serif, system-ui, sans-serif ; ringColor &#58; component.field.single-line.control.ring-color.focus-visible &#58; semantic.color.action.primary.focus.focus-visible &#58; &#35;1d4ed8 ; ringWidth &#58; component.field.single-line.control.ring-width.focus-visible &#58; semantic.layout.scale.stroke-step-02.border-width.focus-visible &#58; 3px ; ringOffset &#58; component.field.single-line.control.ring-offset.focus-visible &#58; semantic.layout.scale.space-step-06.spacing.focus-visible &#58; 3px | 17.85&#58;1 | Not measured |
| Field | single-line / control / error | background &#58; component.field.single-line.control.background.default &#58; semantic.color.neutral.background.default &#58; &#35;ffffff ; foreground &#58; component.field.single-line.control.foreground.default &#58; semantic.color.neutral.text.default &#58; &#35;0f172a ; borderColor &#58; component.field.single-line.control.border-color.error &#58; semantic.color.feedback.error.border.error &#58; &#35;b91c1c ; borderWidth &#58; component.field.single-line.control.border-width.default &#58; semantic.layout.scale.stroke-step-01.border-width.default &#58; 1px ; borderRadius &#58; component.field.single-line.control.border-radius.default &#58; semantic.layout.control-shape.radius.default &#58; 0.5rem ; paddingBlock &#58; component.field.single-line.control.padding-block.default &#58; semantic.layout.control-block-space.spacing.default &#58; 0.7rem ; paddingInline &#58; component.field.single-line.control.padding-inline.default &#58; semantic.layout.control-inline-space.spacing.default &#58; 1rem ; fontSize &#58; component.field.single-line.control.font-size.default &#58; semantic.type.scale.type-font-size-step-02.font-size.default &#58; 1rem ; fontWeight &#58; component.field.single-line.control.font-weight.default &#58; semantic.type.scale.type-font-weight-step-01.font-weight.default &#58; 400 ; lineHeight &#58; component.field.single-line.control.line-height.default &#58; semantic.type.scale.type-line-height-step-01.line-height.default &#58; 1.5 ; fontFamily &#58; component.field.single-line.control.font-family.default &#58; semantic.type.hierarchy.control-family.font-family.default &#58; Inter, ui-sans-serif, system-ui, sans-serif | 17.85&#58;1 | Not measured |
| Field | single-line / hint / default | foreground &#58; component.field.single-line.hint.foreground.default &#58; semantic.color.secondary.text.default &#58; &#35;475569 ; fontSize &#58; component.field.single-line.hint.font-size.default &#58; semantic.type.scale.type-font-size-step-01.font-size.default &#58; 0.875rem ; fontWeight &#58; component.field.single-line.hint.font-weight.default &#58; semantic.type.scale.type-font-weight-step-01.font-weight.default &#58; 400 ; lineHeight &#58; component.field.single-line.hint.line-height.default &#58; semantic.type.scale.type-line-height-step-01.line-height.default &#58; 1.5 ; fontFamily &#58; component.field.single-line.hint.font-family.default &#58; semantic.type.hierarchy.control-family.font-family.default &#58; Inter, ui-sans-serif, system-ui, sans-serif | Not measured | Not measured |
| Field | single-line / error / default | foreground &#58; component.field.single-line.error.foreground.default &#58; semantic.color.feedback.error.text.default &#58; &#35;b91c1c ; fontSize &#58; component.field.single-line.error.font-size.default &#58; semantic.type.scale.type-font-size-step-01.font-size.default &#58; 0.875rem ; fontWeight &#58; component.field.single-line.error.font-weight.default &#58; semantic.type.scale.type-font-weight-step-01.font-weight.default &#58; 400 ; lineHeight &#58; component.field.single-line.error.line-height.default &#58; semantic.type.scale.type-line-height-step-01.line-height.default &#58; 1.5 ; fontFamily &#58; component.field.single-line.error.font-family.default &#58; semantic.type.hierarchy.control-family.font-family.default &#58; Inter, ui-sans-serif, system-ui, sans-serif | Not measured | Not measured |
| Field | multiline / root / default | gap &#58; component.field.multiline.root.gap.default &#58; semantic.layout.scale.space-step-01.spacing.default &#58; 0.5rem | Not measured | Not measured |
| Field | multiline / label / default | foreground &#58; component.field.multiline.label.foreground.default &#58; semantic.color.neutral.text.default &#58; &#35;0f172a ; fontSize &#58; component.field.multiline.label.font-size.default &#58; semantic.type.scale.type-font-size-step-02.font-size.default &#58; 1rem ; fontWeight &#58; component.field.multiline.label.font-weight.default &#58; semantic.type.scale.type-font-weight-step-02.font-weight.default &#58; 650 ; lineHeight &#58; component.field.multiline.label.line-height.default &#58; semantic.type.scale.type-line-height-step-01.line-height.default &#58; 1.5 ; fontFamily &#58; component.field.multiline.label.font-family.default &#58; semantic.type.hierarchy.control-family.font-family.default &#58; Inter, ui-sans-serif, system-ui, sans-serif | Not measured | Not measured |
| Field | multiline / control / default | background &#58; component.field.multiline.control.background.default &#58; semantic.color.neutral.background.default &#58; &#35;ffffff ; foreground &#58; component.field.multiline.control.foreground.default &#58; semantic.color.neutral.text.default &#58; &#35;0f172a ; borderColor &#58; component.field.multiline.control.border-color.default &#58; semantic.color.neutral.border.default &#58; &#35;64748b ; borderWidth &#58; component.field.multiline.control.border-width.default &#58; semantic.layout.scale.stroke-step-01.border-width.default &#58; 1px ; borderRadius &#58; component.field.multiline.control.border-radius.default &#58; semantic.layout.control-shape.radius.default &#58; 0.5rem ; paddingBlock &#58; component.field.multiline.control.padding-block.default &#58; semantic.layout.control-block-space.spacing.default &#58; 0.7rem ; paddingInline &#58; component.field.multiline.control.padding-inline.default &#58; semantic.layout.control-inline-space.spacing.default &#58; 1rem ; fontSize &#58; component.field.multiline.control.font-size.default &#58; semantic.type.scale.type-font-size-step-02.font-size.default &#58; 1rem ; fontWeight &#58; component.field.multiline.control.font-weight.default &#58; semantic.type.scale.type-font-weight-step-01.font-weight.default &#58; 400 ; lineHeight &#58; component.field.multiline.control.line-height.default &#58; semantic.type.scale.type-line-height-step-01.line-height.default &#58; 1.5 ; fontFamily &#58; component.field.multiline.control.font-family.default &#58; semantic.type.hierarchy.control-family.font-family.default &#58; Inter, ui-sans-serif, system-ui, sans-serif | 17.85&#58;1 | Not measured |
| Field | multiline / control / disabled | background &#58; component.field.multiline.control.background.disabled &#58; semantic.color.secondary.background.disabled &#58; &#35;f1f5f9 ; foreground &#58; component.field.multiline.control.foreground.disabled &#58; semantic.color.neutral.text.disabled &#58; &#35;0f172a ; borderColor &#58; component.field.multiline.control.border-color.disabled &#58; semantic.color.neutral.border.disabled &#58; &#35;64748b ; borderWidth &#58; component.field.multiline.control.border-width.disabled &#58; semantic.layout.scale.stroke-step-01.border-width.disabled &#58; 1px ; borderRadius &#58; component.field.multiline.control.border-radius.disabled &#58; semantic.layout.control-shape.radius.disabled &#58; 0.5rem ; paddingBlock &#58; component.field.multiline.control.padding-block.disabled &#58; semantic.layout.control-block-space.spacing.disabled &#58; 0.7rem ; paddingInline &#58; component.field.multiline.control.padding-inline.disabled &#58; semantic.layout.control-inline-space.spacing.disabled &#58; 1rem ; fontSize &#58; component.field.multiline.control.font-size.disabled &#58; semantic.type.scale.type-font-size-step-02.font-size.disabled &#58; 1rem ; fontWeight &#58; component.field.multiline.control.font-weight.disabled &#58; semantic.type.scale.type-font-weight-step-01.font-weight.disabled &#58; 400 ; lineHeight &#58; component.field.multiline.control.line-height.disabled &#58; semantic.type.scale.type-line-height-step-01.line-height.disabled &#58; 1.5 ; fontFamily &#58; component.field.multiline.control.font-family.disabled &#58; semantic.type.hierarchy.control-family.font-family.disabled &#58; Inter, ui-sans-serif, system-ui, sans-serif | 16.30&#58;1 | Not measured |
| Field | multiline / control / focus-visible | background &#58; component.field.multiline.control.background.default &#58; semantic.color.neutral.background.default &#58; &#35;ffffff ; foreground &#58; component.field.multiline.control.foreground.default &#58; semantic.color.neutral.text.default &#58; &#35;0f172a ; borderColor &#58; component.field.multiline.control.border-color.default &#58; semantic.color.neutral.border.default &#58; &#35;64748b ; borderWidth &#58; component.field.multiline.control.border-width.default &#58; semantic.layout.scale.stroke-step-01.border-width.default &#58; 1px ; borderRadius &#58; component.field.multiline.control.border-radius.default &#58; semantic.layout.control-shape.radius.default &#58; 0.5rem ; paddingBlock &#58; component.field.multiline.control.padding-block.default &#58; semantic.layout.control-block-space.spacing.default &#58; 0.7rem ; paddingInline &#58; component.field.multiline.control.padding-inline.default &#58; semantic.layout.control-inline-space.spacing.default &#58; 1rem ; fontSize &#58; component.field.multiline.control.font-size.default &#58; semantic.type.scale.type-font-size-step-02.font-size.default &#58; 1rem ; fontWeight &#58; component.field.multiline.control.font-weight.default &#58; semantic.type.scale.type-font-weight-step-01.font-weight.default &#58; 400 ; lineHeight &#58; component.field.multiline.control.line-height.default &#58; semantic.type.scale.type-line-height-step-01.line-height.default &#58; 1.5 ; fontFamily &#58; component.field.multiline.control.font-family.default &#58; semantic.type.hierarchy.control-family.font-family.default &#58; Inter, ui-sans-serif, system-ui, sans-serif ; ringColor &#58; component.field.multiline.control.ring-color.focus-visible &#58; semantic.color.action.primary.focus.focus-visible &#58; &#35;1d4ed8 ; ringWidth &#58; component.field.multiline.control.ring-width.focus-visible &#58; semantic.layout.scale.stroke-step-02.border-width.focus-visible &#58; 3px ; ringOffset &#58; component.field.multiline.control.ring-offset.focus-visible &#58; semantic.layout.scale.space-step-06.spacing.focus-visible &#58; 3px | 17.85&#58;1 | Not measured |
| Field | multiline / control / error | background &#58; component.field.multiline.control.background.default &#58; semantic.color.neutral.background.default &#58; &#35;ffffff ; foreground &#58; component.field.multiline.control.foreground.default &#58; semantic.color.neutral.text.default &#58; &#35;0f172a ; borderColor &#58; component.field.multiline.control.border-color.error &#58; semantic.color.feedback.error.border.error &#58; &#35;b91c1c ; borderWidth &#58; component.field.multiline.control.border-width.default &#58; semantic.layout.scale.stroke-step-01.border-width.default &#58; 1px ; borderRadius &#58; component.field.multiline.control.border-radius.default &#58; semantic.layout.control-shape.radius.default &#58; 0.5rem ; paddingBlock &#58; component.field.multiline.control.padding-block.default &#58; semantic.layout.control-block-space.spacing.default &#58; 0.7rem ; paddingInline &#58; component.field.multiline.control.padding-inline.default &#58; semantic.layout.control-inline-space.spacing.default &#58; 1rem ; fontSize &#58; component.field.multiline.control.font-size.default &#58; semantic.type.scale.type-font-size-step-02.font-size.default &#58; 1rem ; fontWeight &#58; component.field.multiline.control.font-weight.default &#58; semantic.type.scale.type-font-weight-step-01.font-weight.default &#58; 400 ; lineHeight &#58; component.field.multiline.control.line-height.default &#58; semantic.type.scale.type-line-height-step-01.line-height.default &#58; 1.5 ; fontFamily &#58; component.field.multiline.control.font-family.default &#58; semantic.type.hierarchy.control-family.font-family.default &#58; Inter, ui-sans-serif, system-ui, sans-serif | 17.85&#58;1 | Not measured |
| Field | multiline / hint / default | foreground &#58; component.field.multiline.hint.foreground.default &#58; semantic.color.secondary.text.default &#58; &#35;475569 ; fontSize &#58; component.field.multiline.hint.font-size.default &#58; semantic.type.scale.type-font-size-step-01.font-size.default &#58; 0.875rem ; fontWeight &#58; component.field.multiline.hint.font-weight.default &#58; semantic.type.scale.type-font-weight-step-01.font-weight.default &#58; 400 ; lineHeight &#58; component.field.multiline.hint.line-height.default &#58; semantic.type.scale.type-line-height-step-01.line-height.default &#58; 1.5 ; fontFamily &#58; component.field.multiline.hint.font-family.default &#58; semantic.type.hierarchy.control-family.font-family.default &#58; Inter, ui-sans-serif, system-ui, sans-serif | Not measured | Not measured |
| Field | multiline / error / default | foreground &#58; component.field.multiline.error.foreground.default &#58; semantic.color.feedback.error.text.default &#58; &#35;b91c1c ; fontSize &#58; component.field.multiline.error.font-size.default &#58; semantic.type.scale.type-font-size-step-01.font-size.default &#58; 0.875rem ; fontWeight &#58; component.field.multiline.error.font-weight.default &#58; semantic.type.scale.type-font-weight-step-01.font-weight.default &#58; 400 ; lineHeight &#58; component.field.multiline.error.line-height.default &#58; semantic.type.scale.type-line-height-step-01.line-height.default &#58; 1.5 ; fontFamily &#58; component.field.multiline.error.font-family.default &#58; semantic.type.hierarchy.control-family.font-family.default &#58; Inter, ui-sans-serif, system-ui, sans-serif | Not measured | Not measured |
| SelectField | default / root / default | gap &#58; component.select-field.default.root.gap.default &#58; semantic.layout.scale.space-step-01.spacing.default &#58; 0.5rem | Not measured | Not measured |
| SelectField | default / label / default | foreground &#58; component.select-field.default.label.foreground.default &#58; semantic.color.neutral.text.default &#58; &#35;0f172a ; fontSize &#58; component.select-field.default.label.font-size.default &#58; semantic.type.scale.type-font-size-step-02.font-size.default &#58; 1rem ; fontWeight &#58; component.select-field.default.label.font-weight.default &#58; semantic.type.scale.type-font-weight-step-02.font-weight.default &#58; 650 ; lineHeight &#58; component.select-field.default.label.line-height.default &#58; semantic.type.scale.type-line-height-step-01.line-height.default &#58; 1.5 ; fontFamily &#58; component.select-field.default.label.font-family.default &#58; semantic.type.hierarchy.control-family.font-family.default &#58; Inter, ui-sans-serif, system-ui, sans-serif | Not measured | Not measured |
| SelectField | default / control / default | background &#58; component.select-field.default.control.background.default &#58; semantic.color.neutral.background.default &#58; &#35;ffffff ; foreground &#58; component.select-field.default.control.foreground.default &#58; semantic.color.neutral.text.default &#58; &#35;0f172a ; borderColor &#58; component.select-field.default.control.border-color.default &#58; semantic.color.neutral.border.default &#58; &#35;64748b ; borderWidth &#58; component.select-field.default.control.border-width.default &#58; semantic.layout.scale.stroke-step-01.border-width.default &#58; 1px ; borderRadius &#58; component.select-field.default.control.border-radius.default &#58; semantic.layout.control-shape.radius.default &#58; 0.5rem ; paddingBlock &#58; component.select-field.default.control.padding-block.default &#58; semantic.layout.control-block-space.spacing.default &#58; 0.7rem ; paddingInline &#58; component.select-field.default.control.padding-inline.default &#58; semantic.layout.control-inline-space.spacing.default &#58; 1rem ; fontSize &#58; component.select-field.default.control.font-size.default &#58; semantic.type.scale.type-font-size-step-02.font-size.default &#58; 1rem ; fontWeight &#58; component.select-field.default.control.font-weight.default &#58; semantic.type.scale.type-font-weight-step-01.font-weight.default &#58; 400 ; fontFamily &#58; component.select-field.default.control.font-family.default &#58; semantic.type.hierarchy.control-family.font-family.default &#58; Inter, ui-sans-serif, system-ui, sans-serif | 17.85&#58;1 | Not measured |
| SelectField | default / control / disabled | background &#58; component.select-field.default.control.background.disabled &#58; semantic.color.secondary.background.disabled &#58; &#35;f1f5f9 ; foreground &#58; component.select-field.default.control.foreground.disabled &#58; semantic.color.neutral.text.disabled &#58; &#35;0f172a ; borderColor &#58; component.select-field.default.control.border-color.disabled &#58; semantic.color.neutral.border.disabled &#58; &#35;64748b ; borderWidth &#58; component.select-field.default.control.border-width.disabled &#58; semantic.layout.scale.stroke-step-01.border-width.disabled &#58; 1px ; borderRadius &#58; component.select-field.default.control.border-radius.disabled &#58; semantic.layout.control-shape.radius.disabled &#58; 0.5rem ; paddingBlock &#58; component.select-field.default.control.padding-block.disabled &#58; semantic.layout.control-block-space.spacing.disabled &#58; 0.7rem ; paddingInline &#58; component.select-field.default.control.padding-inline.disabled &#58; semantic.layout.control-inline-space.spacing.disabled &#58; 1rem ; fontSize &#58; component.select-field.default.control.font-size.disabled &#58; semantic.type.scale.type-font-size-step-02.font-size.disabled &#58; 1rem ; fontWeight &#58; component.select-field.default.control.font-weight.disabled &#58; semantic.type.scale.type-font-weight-step-01.font-weight.disabled &#58; 400 ; fontFamily &#58; component.select-field.default.control.font-family.disabled &#58; semantic.type.hierarchy.control-family.font-family.disabled &#58; Inter, ui-sans-serif, system-ui, sans-serif | 16.30&#58;1 | Not measured |
| SelectField | default / control / focus-visible | background &#58; component.select-field.default.control.background.default &#58; semantic.color.neutral.background.default &#58; &#35;ffffff ; foreground &#58; component.select-field.default.control.foreground.default &#58; semantic.color.neutral.text.default &#58; &#35;0f172a ; borderColor &#58; component.select-field.default.control.border-color.default &#58; semantic.color.neutral.border.default &#58; &#35;64748b ; borderWidth &#58; component.select-field.default.control.border-width.default &#58; semantic.layout.scale.stroke-step-01.border-width.default &#58; 1px ; borderRadius &#58; component.select-field.default.control.border-radius.default &#58; semantic.layout.control-shape.radius.default &#58; 0.5rem ; paddingBlock &#58; component.select-field.default.control.padding-block.default &#58; semantic.layout.control-block-space.spacing.default &#58; 0.7rem ; paddingInline &#58; component.select-field.default.control.padding-inline.default &#58; semantic.layout.control-inline-space.spacing.default &#58; 1rem ; fontSize &#58; component.select-field.default.control.font-size.default &#58; semantic.type.scale.type-font-size-step-02.font-size.default &#58; 1rem ; fontWeight &#58; component.select-field.default.control.font-weight.default &#58; semantic.type.scale.type-font-weight-step-01.font-weight.default &#58; 400 ; fontFamily &#58; component.select-field.default.control.font-family.default &#58; semantic.type.hierarchy.control-family.font-family.default &#58; Inter, ui-sans-serif, system-ui, sans-serif ; ringColor &#58; component.select-field.default.control.ring-color.focus-visible &#58; semantic.color.action.primary.focus.focus-visible &#58; &#35;1d4ed8 ; ringWidth &#58; component.select-field.default.control.ring-width.focus-visible &#58; semantic.layout.scale.stroke-step-02.border-width.focus-visible &#58; 3px ; ringOffset &#58; component.select-field.default.control.ring-offset.focus-visible &#58; semantic.layout.scale.space-step-06.spacing.focus-visible &#58; 3px | 17.85&#58;1 | Not measured |
| Notice | info / root / default | background &#58; component.notice.info.root.background.default &#58; semantic.color.secondary.background.default &#58; &#35;f1f5f9 ; foreground &#58; component.notice.info.root.foreground.default &#58; semantic.color.neutral.text.default &#58; &#35;0f172a ; borderColor &#58; component.notice.info.root.border-color.default &#58; semantic.color.neutral.border.default &#58; &#35;64748b ; borderWidth &#58; component.notice.info.root.border-width.default &#58; semantic.layout.scale.stroke-step-01.border-width.default &#58; 1px ; borderRadius &#58; component.notice.info.root.border-radius.default &#58; semantic.layout.feedback-shape.radius.default &#58; 0.5rem ; paddingBlock &#58; component.notice.info.root.padding-block.default &#58; semantic.layout.scale.space-step-03.spacing.default &#58; 1.5rem ; paddingInline &#58; component.notice.info.root.padding-inline.default &#58; semantic.layout.scale.space-step-03.spacing.default &#58; 1.5rem ; fontSize &#58; component.notice.info.root.font-size.default &#58; semantic.type.scale.type-font-size-step-02.font-size.default &#58; 1rem ; fontWeight &#58; component.notice.info.root.font-weight.default &#58; semantic.type.scale.type-font-weight-step-01.font-weight.default &#58; 400 ; lineHeight &#58; component.notice.info.root.line-height.default &#58; semantic.type.scale.type-line-height-step-01.line-height.default &#58; 1.5 ; fontFamily &#58; component.notice.info.root.font-family.default &#58; semantic.type.hierarchy.body-family.font-family.default &#58; Inter, ui-sans-serif, system-ui, sans-serif | 16.30&#58;1 | Not measured |
| Notice | success / root / default | background &#58; component.notice.success.root.background.default &#58; semantic.color.secondary.background.default &#58; &#35;f1f5f9 ; foreground &#58; component.notice.success.root.foreground.default &#58; semantic.color.feedback.success.text.default &#58; &#35;166534 ; borderColor &#58; component.notice.success.root.border-color.default &#58; semantic.color.neutral.border.default &#58; &#35;64748b ; borderWidth &#58; component.notice.success.root.border-width.default &#58; semantic.layout.scale.stroke-step-01.border-width.default &#58; 1px ; borderRadius &#58; component.notice.success.root.border-radius.default &#58; semantic.layout.feedback-shape.radius.default &#58; 0.5rem ; paddingBlock &#58; component.notice.success.root.padding-block.default &#58; semantic.layout.scale.space-step-03.spacing.default &#58; 1.5rem ; paddingInline &#58; component.notice.success.root.padding-inline.default &#58; semantic.layout.scale.space-step-03.spacing.default &#58; 1.5rem ; fontSize &#58; component.notice.success.root.font-size.default &#58; semantic.type.scale.type-font-size-step-02.font-size.default &#58; 1rem ; fontWeight &#58; component.notice.success.root.font-weight.default &#58; semantic.type.scale.type-font-weight-step-01.font-weight.default &#58; 400 ; lineHeight &#58; component.notice.success.root.line-height.default &#58; semantic.type.scale.type-line-height-step-01.line-height.default &#58; 1.5 ; fontFamily &#58; component.notice.success.root.font-family.default &#58; semantic.type.hierarchy.body-family.font-family.default &#58; Inter, ui-sans-serif, system-ui, sans-serif | 6.51&#58;1 | Not measured |
| Notice | error / root / default | background &#58; component.notice.error.root.background.default &#58; semantic.color.secondary.background.default &#58; &#35;f1f5f9 ; foreground &#58; component.notice.error.root.foreground.default &#58; semantic.color.feedback.error.text.default &#58; &#35;b91c1c ; borderColor &#58; component.notice.error.root.border-color.default &#58; semantic.color.neutral.border.default &#58; &#35;64748b ; borderWidth &#58; component.notice.error.root.border-width.default &#58; semantic.layout.scale.stroke-step-01.border-width.default &#58; 1px ; borderRadius &#58; component.notice.error.root.border-radius.default &#58; semantic.layout.feedback-shape.radius.default &#58; 0.5rem ; paddingBlock &#58; component.notice.error.root.padding-block.default &#58; semantic.layout.scale.space-step-03.spacing.default &#58; 1.5rem ; paddingInline &#58; component.notice.error.root.padding-inline.default &#58; semantic.layout.scale.space-step-03.spacing.default &#58; 1.5rem ; fontSize &#58; component.notice.error.root.font-size.default &#58; semantic.type.scale.type-font-size-step-01.font-size.default &#58; 0.875rem ; fontWeight &#58; component.notice.error.root.font-weight.default &#58; semantic.type.scale.type-font-weight-step-01.font-weight.default &#58; 400 ; lineHeight &#58; component.notice.error.root.line-height.default &#58; semantic.type.scale.type-line-height-step-01.line-height.default &#58; 1.5 ; fontFamily &#58; component.notice.error.root.font-family.default &#58; semantic.type.hierarchy.body-family.font-family.default &#58; Inter, ui-sans-serif, system-ui, sans-serif | 5.91&#58;1 | Not measured |
| Panel | default / root / default | background &#58; component.panel.default.root.background.default &#58; semantic.color.neutral.background.default &#58; &#35;ffffff ; foreground &#58; component.panel.default.root.foreground.default &#58; semantic.color.neutral.text.default &#58; &#35;0f172a ; borderColor &#58; component.panel.default.root.border-color.default &#58; semantic.color.neutral.border.default &#58; &#35;64748b ; borderWidth &#58; component.panel.default.root.border-width.default &#58; semantic.layout.scale.stroke-step-01.border-width.default &#58; 1px ; borderRadius &#58; component.panel.default.root.border-radius.default &#58; semantic.layout.container-shape.radius.default &#58; 0.5rem ; paddingBlock &#58; component.panel.default.root.padding-block.default &#58; semantic.layout.scale.space-step-03.spacing.default &#58; 1.5rem ; paddingInline &#58; component.panel.default.root.padding-inline.default &#58; semantic.layout.scale.space-step-03.spacing.default &#58; 1.5rem ; fontSize &#58; component.panel.default.root.font-size.default &#58; semantic.type.scale.type-font-size-step-02.font-size.default &#58; 1rem ; fontWeight &#58; component.panel.default.root.font-weight.default &#58; semantic.type.scale.type-font-weight-step-01.font-weight.default &#58; 400 ; lineHeight &#58; component.panel.default.root.line-height.default &#58; semantic.type.scale.type-line-height-step-01.line-height.default &#58; 1.5 ; fontFamily &#58; component.panel.default.root.font-family.default &#58; semantic.type.hierarchy.body-family.font-family.default &#58; Inter, ui-sans-serif, system-ui, sans-serif | 17.85&#58;1 | Not measured |
| Foundations | default / document / default | background &#58; component.foundations.default.document.background.default &#58; semantic.color.secondary.background.default &#58; &#35;f1f5f9 ; foreground &#58; component.foundations.default.document.foreground.default &#58; semantic.color.neutral.text.default &#58; &#35;0f172a ; fontSize &#58; component.foundations.default.document.font-size.default &#58; semantic.type.scale.type-font-size-step-02.font-size.default &#58; 1rem ; fontWeight &#58; component.foundations.default.document.font-weight.default &#58; semantic.type.scale.type-font-weight-step-01.font-weight.default &#58; 400 ; lineHeight &#58; component.foundations.default.document.line-height.default &#58; semantic.type.scale.type-line-height-step-01.line-height.default &#58; 1.5 ; fontFamily &#58; component.foundations.default.document.font-family.default &#58; semantic.type.hierarchy.body-family.font-family.default &#58; Inter, ui-sans-serif, system-ui, sans-serif | 16.30&#58;1 | Not measured |
| Foundations | default / page / default | maxWidth &#58; component.foundations.default.page.max-width.default &#58; semantic.layout.reading-width.content-width.default &#58; 70rem ; pageMargin &#58; component.foundations.default.page.page-margin.default &#58; semantic.layout.scale.space-step-05.spacing.default &#58; 2rem | Not measured | Not measured |
| Foundations | default / page-mobile / default | pageMargin &#58; component.foundations.default.page-mobile.page-margin.default &#58; semantic.layout.scale.space-step-04.spacing.default &#58; 1rem | Not measured | Not measured |
| Foundations | default / layout-small / default | gap &#58; component.foundations.default.layout-small.gap.default &#58; semantic.layout.scale.space-step-01.spacing.default &#58; 0.5rem | Not measured | Not measured |
| Foundations | default / layout-medium / default | gap &#58; component.foundations.default.layout-medium.gap.default &#58; semantic.layout.scale.space-step-04.spacing.default &#58; 1rem | Not measured | Not measured |
| Foundations | default / layout-large / default | gap &#58; component.foundations.default.layout-large.gap.default &#58; semantic.layout.scale.space-step-03.spacing.default &#58; 1.5rem | Not measured | Not measured |
| Foundations | default / table / default | fontSize &#58; component.foundations.default.table.font-size.default &#58; semantic.type.scale.type-font-size-step-01.font-size.default &#58; 0.875rem ; borderColor &#58; component.foundations.default.table.border-color.default &#58; semantic.color.neutral.border.default &#58; &#35;64748b ; paddingBlock &#58; component.foundations.default.table.padding-block.default &#58; semantic.layout.scale.space-step-01.spacing.default &#58; 0.5rem ; paddingInline &#58; component.foundations.default.table.padding-inline.default &#58; semantic.layout.scale.space-step-01.spacing.default &#58; 0.5rem | Not measured | Not measured |
