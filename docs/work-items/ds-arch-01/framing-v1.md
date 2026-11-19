**Nature :** référentiel d'architecture et de conception

**Statut :** principes établis

**Standard des tokens :** DTCG 2025.10

**Version du cadrage :** 1.0

---

## 1. Définition et objectifs

Le Design System est un système structuré de règles, de valeurs, de composants et de solutions d'interface réutilisables.

Il définit un langage de conception commun permettant de garantir la cohérence visuelle, fonctionnelle et comportementale des interfaces numériques.

Ses objectifs fondamentaux sont :

- **Cohérence :** assurer l'homogénéité des interfaces et des interactions.
- **Réutilisabilité :** mutualiser les décisions de design et les éléments d'interface.
- **Maintenabilité :** centraliser les règles et limiter les duplications.
- **Évolutivité :** permettre l'évolution globale ou locale des propriétés du système.
- **Traçabilité :** expliciter les relations entre les valeurs, les tokens et leurs usages.
- **Interopérabilité :** privilégier les standards et les représentations indépendantes des outils.
- **Accessibilité :** intégrer les exigences d'accessibilité dans les règles, composants et patterns.

Le Design System constitue un référentiel partagé entre conception et développement.

Il ne se limite pas à une bibliothèque de composants graphiques : il comprend également les règles fondamentales de composition et les solutions d'interaction récurrentes.

## 2. Architecture générale

### 2.1. Cinq niveaux de responsabilité

Le système est organisé autour de cinq niveaux.

| Niveau | Désignation | Responsabilité |
| --- | --- | --- |
| 1 | **Primitives** | Valeurs fondamentales |
| 2 | **Decision Tokens** | Décisions de design partagées |
| 3 | **Component Tokens** | Propriétés propres à chaque composant |
| 4 | **Components** | Éléments d'interface simples ou composites |
| 5 | **Patterns** | Solutions d'interface réutilisables |

Ces niveaux constituent une hiérarchie de responsabilités et de spécialisation.

Ils ne forment pas nécessairement une chaîne de dépendances obligatoire : certaines références peuvent traverser plusieurs niveaux.

### 2.2. Trois rubriques d'organisation

La documentation et la gouvernance du Design System s'organisent en trois grandes rubriques.

| Rubrique | Périmètre |
| --- | --- |
| **Foundations** | Primitives, Decision Tokens et règles fondamentales de conception |
| **Components** | Component Tokens, UI Components et Layout Components |
| **Patterns** | Interaction Patterns et Layout Patterns |

Cette organisation documentaire est distincte de la hiérarchie technique des tokens.

Les Foundations constituent le socle commun, les Components fournissent les éléments de construction et les Patterns décrivent des solutions réutilisables à des problèmes d'interface.

---

## 3. Foundations

Les Foundations regroupent les valeurs, les conventions et les principes transversaux qui structurent le langage visuel et spatial.

Elles comprennent notamment :

- Couleurs
- Typographie
- Spacing et dimensions
- Radius et bordures
- Ombres et élévation
- Iconographie
- Grid System
- Responsive Design
- Mouvement et animation
- Accessibilité

Chaque domaine peut associer des valeurs exprimées sous forme de tokens et des règles de conception documentées.

### 3.1. Primitives

Les Primitives définissent les valeurs fondamentales du système.

Elles sont indépendantes des composants et de leurs usages.

Exemples :

| Primitive | Valeur |
| --- | --- |
| `color.red.600` | `#DC2626` |
| `radius.8` | `8px` |
| `spacing.16` | `16px` |
| `font.size.14` | `14px` |

Ces valeurs sont illustratives.

Les Primitives constituent le niveau terminal de résolution des références des autres tokens.

Elles ne doivent pas exprimer un contexte d'usage propre à un composant.

### 3.2. Decision Tokens

Les Decision Tokens représentent les décisions de design partagées et réutilisables.

Ils permettent de dissocier les valeurs fondamentales des conventions qui déterminent leur utilisation.

Deux catégories sont distinguées.

**Semantic Decision Tokens**

Ils expriment un rôle, une intention ou une convention de design identifiable.

Exemples :

- `color.feedback.error`
- `color.action.primary`
- `radius.control.sm`
- `spacing.form.field-gap`
- `layout.container.default`

La sémantique ne se limite pas aux couleurs ou aux états fonctionnels. Elle peut concerner les dimensions, les espacements, les rayons, les propriétés typographiques et toute autre propriété de design.

**Non-semantic Decision Tokens**

Ils définissent des conventions partagées sans exprimer un rôle d'usage spécifique.

Exemples :

- `radius.sm`
- `spacing.md`
- `font.size.lg`

Ils peuvent notamment servir à établir des échelles de dimensionnement abstraites.

**Principe de classification**

La distinction entre tokens sémantiques et non sémantiques est une classification interne au niveau Decision Tokens.

Elle est explicitement représentée dans le référentiel des tokens.

Elle n'impose aucun préfixe dans les noms utilisés par les composants.

Un Decision Token est défini par une décision de design réutilisable et non par le nombre de composants qui l'utilisent effectivement.

### 3.3. Grid System

Le Grid System définit les règles générales d'organisation spatiale des interfaces.

Il couvre notamment :

- Colonnes
- Gouttières
- Marges
- Largeurs de conteneurs
- Alignements
- Breakpoints
- Contraintes responsive
- Comportements d'adaptation

Il appartient aux Foundations et constitue un système de règles transversal.

Ses valeurs peuvent être exprimées au moyen de Primitives et de Decision Tokens.

Sa mise en œuvre technique peut s'appuyer sur des Layout Components.

Le Grid System ne constitue ni une catégorie de tokens autonome ni un niveau architectural supplémentaire.

### 3.4. Design Guidelines

Les Foundations comprennent également les recommandations et règles générales de conception.

Elles concernent notamment :

- Les hiérarchies visuelles et typographiques.
- Les principes de composition et d'alignement.
- L'usage des couleurs et des contrastes.
- Les règles de responsive design.
- Les comportements d'animation.
- Les exigences d'accessibilité.

Ces règles ne sont pas nécessairement représentées par des tokens.

---

## 4. Architecture et gouvernance des tokens

### 4.1. Standard DTCG 2025.10

Le format de référence des tokens est la spécification **Design Tokens Community Group (DTCG) 2025.10**.

Cette spécification définit notamment :

- Le format JSON.
- Les types de valeurs (`$type`).
- Les valeurs (`$value`).
- Les références et alias.
- Les groupes de tokens.
- Les mécanismes de résolution des références.

La spécification DTCG ne prescrit pas la hiérarchie architecturale du Design System.

**Le standard détermine le format technique ; le Design System détermine l'organisation, la classification et les règles d'utilisation.**

### 4.2. Component Tokens

Les Component Tokens représentent les décisions visuelles et dimensionnelles spécifiques à chaque composant.

Chaque composant dispose de son propre ensemble de tokens pour ses propriétés configurables.

Exemples :

- `button.radius`
- `button.background.default`
- `button.background.hover`
- `input.radius`
- `input.border.error`

Les Component Tokens ne sont pas partagés directement entre plusieurs composants.

Deux composants utilisant la même valeur conservent des tokens distincts.

Ces tokens peuvent néanmoins référencer la même Primitive ou le même Decision Token.

Cette séparation garantit l'autonomie des composants tout en permettant une gestion centralisée des conventions partagées.

### 4.3. Règles de référencement

Les relations suivantes sont retenues :

| Relation | Règle |
| --- | --- |
| Decision Token → Primitive | Autorisée |
| Decision Token → Decision Token | Autorisée sous réserve de dépendances justifiées et sans cycle |
| Component Token → Primitive | Autorisée |
| Component Token → Decision Token | Autorisée et privilégiée lorsqu'une convention partagée existe |
| Component Token → autre Component Token | Interdite |
| Decision Token → Component Token | Interdite |
| Token non primitif → valeur littérale directe | Interdite |

Tout token non primitif doit pouvoir être résolu jusqu'à une Primitive.

Les références circulaires sont interdites.

### 4.4. Mutualisation et autonomie

La mutualisation d'une valeur ne suffit pas à imposer la création d'un Decision Token.

Deux Component Tokens peuvent référencer directement une même Primitive lorsqu'aucune convention partagée ne doit être explicitement représentée.

Un Decision Token est créé lorsqu'il formalise une décision de design qui mérite d'être maintenue et pilotée indépendamment de sa valeur brute.

Exemple :

- `button.radius` → `radius.control.sm`
- `input.radius` → `radius.control.sm`
- `radius.control.sm` → `radius.8`

Les deux composants partagent une convention tout en conservant leur autonomie.

---

## 5. Components

Les Components constituent les unités réutilisables de construction des interfaces.

Ils assurent des fonctions de présentation, d'interaction ou de disposition spatiale.

Deux familles principales sont distinguées :

- **UI Components**
- **Layout Components**

Dans chacune de ces familles, les composants peuvent être simples ou composites.

### 5.1. UI Components

Les UI Components représentent les éléments fonctionnels et interactifs de l'interface.

Exemples :

- Button
- Input
- Checkbox
- Badge
- Card
- Select
- Dialog
- DataTable

Chaque composant peut définir :

- Une API et des propriétés configurables.
- Des variantes.
- Des états visuels et interactifs.
- Des comportements.
- Des règles d'accessibilité.
- Des Component Tokens.
- Des sous-composants et slots.

### 5.2. Layout Components

Les Layout Components organisent spatialement les éléments d'interface.

Exemples :

- Stack
- Flex
- Grid
- Container
- Split
- SidebarLayout

Ils mettent en œuvre les règles de composition définies dans les Foundations.

Ils peuvent gérer les espacements, alignements, contraintes dimensionnelles et comportements responsive.

Les Layout Components constituent des éléments de construction réutilisables. Ils ne sont pas automatiquement des Patterns.

### 5.3. Composants simples et composites

**Composants simples**

Ils assurent une fonction élémentaire et autonome.

Exemples : Button, Checkbox, Badge.

**Composants composites**

Ils sont constitués de plusieurs éléments ou sous-composants pouvant présenter des interactions et dépendances internes.

Exemples : Card, Select, Dialog, DataTable.

Les composants composites peuvent comporter des slots, des sous-composants imbriqués et plusieurs niveaux de composition.

**Le nombre de composants imbriqués ne détermine pas le passage au niveau Pattern.**

Une Card comportant un titre, un texte et un bouton demeure normalement un composant composite.

### 5.4. Documentation des composants

Chaque composant doit pouvoir être documenté en précisant :

- Sa fonction.
- Ses propriétés.
- Ses variantes et ses états.
- Ses sous-composants éventuels.
- Ses Component Tokens.
- Ses comportements.
- Ses contraintes d'accessibilité.
- Ses règles d'utilisation.

La documentation doit permettre de comprendre aussi bien son fonctionnement que ses possibilités de composition.

---

## 6. Patterns

Les Patterns formalisent des solutions d'interface réutilisables répondant à des problèmes récurrents.

Ils combinent, lorsque cela est nécessaire, plusieurs composants, règles de composition et comportements coordonnés.

Deux familles principales sont distinguées :

- **Interaction Patterns**
- **Layout Patterns**

Ces catégories ne sont pas exclusives.

### 6.1. Interaction Patterns

Les Interaction Patterns décrivent des solutions à des problèmes d'interaction récurrents.

Exemples :

- Recherche et filtrage
- Sélection multiple
- Validation de formulaire
- Navigation par étapes
- Import de fichiers
- Gestion d'opérations asynchrones

Ils peuvent formaliser :

- L'organisation des interactions.
- Les transitions d'état.
- Les comportements coordonnés.
- Les retours utilisateur.
- Les règles d'accessibilité.
- Les conditions d'utilisation.

### 6.2. Layout Patterns

Les Layout Patterns définissent des organisations d'interface récurrentes adaptées à un besoin d'usage.

Exemples :

- App Shell
- Master–Detail
- Dashboard Layout
- Split View avec coordination des panneaux
- Interface liste–détail

Ils peuvent définir :

- La hiérarchie des zones.
- Les relations entre les espaces.
- Les adaptations responsive.
- Les comportements de navigation.
- Les relations entre panneaux et composants.

Une simple disposition spatiale ne constitue pas automatiquement un Pattern.

Un Grid générique ou une SplitView sans comportement d'usage spécifique peut rester un Layout Component.

### 6.3. Classification des Patterns

Un Pattern peut relever simultanément de plusieurs catégories.

Par exemple, une interface de recherche avec filtres et résultats peut constituer à la fois :

- Un Interaction Pattern, par son fonctionnement.
- Un Layout Pattern, par son organisation spatiale.

La classification doit refléter les responsabilités du Pattern sans imposer artificiellement son appartenance à une catégorie unique.

### 6.4. Différence entre Component et Pattern

La distinction repose sur la responsabilité fonctionnelle.

**Component :** qu'est-ce que cet élément d'interface et comment fonctionne-t-il ?

**Pattern :** comment organiser des composants pour résoudre un problème récurrent d'interaction ou de disposition ?

Un Pattern n'est donc pas défini par la complexité de son assemblage, mais par la solution d'usage qu'il formalise.

---

## 7. Organisation documentaire

Le référentiel documentaire est organisé autour des trois grandes rubriques.

### Foundations

Documenter les valeurs, conventions et règles communes.

Contenu :

- Primitives
- Decision Tokens
- Grid System
- Design Guidelines

### Components

Documenter les éléments d'interface et de disposition.

Contenu :

- UI Components
- Layout Components
- Component Tokens associés
- États, variantes et règles d'utilisation

### Patterns

Documenter les solutions de conception réutilisables.

Contenu :

- Interaction Patterns
- Layout Patterns
- Contextes d'utilisation
- Comportements et règles de composition

Un environnement tel que Storybook peut servir à documenter et tester les composants et leurs états.

Le référentiel des tokens conserve son rôle d'autorité sur les valeurs, classifications et références.

---

## 8. Méthode de conception et d'évolution

Le Design System évolue progressivement à partir des besoins réels des interfaces.

La méthode privilégiée est *component-first*.

Le processus général est le suivant :

1. Identifier un besoin d'interface.
2. Vérifier les règles, tokens et composants existants.
3. Définir la fonction, les propriétés et les comportements attendus.
4. Déterminer si le besoin relève d'un Component ou d'un Pattern.
5. Identifier les éventuels nouveaux tokens nécessaires.
6. Valider les propositions de conception.
7. Implémenter et documenter.
8. Tester les états, les interactions et l'accessibilité.
9. Intégrer dans l'interface concernée.
10. Faire évoluer le référentiel commun si nécessaire.

L'ajout de nouveaux éléments doit être justifié par un besoin de conception identifié.

Le système privilégie la réutilisation et l'évolution de ses ressources existantes avant la création de nouveaux éléments.

---

## 9. Principes de gouvernance

### 9.1. Cohérence

Les interfaces doivent utiliser les valeurs, tokens et composants définis par le Design System.

Les valeurs visuelles codées directement dans les composants sont évitées lorsqu'elles devraient être pilotées par le système de tokens.

### 9.2. Non-duplication

Avant de créer un composant ou une convention, les ressources existantes doivent être examinées.

La création de variantes ou de composants concurrents répondant aux mêmes besoins doit être limitée.

### 9.3. Autonomie des composants

Les Component Tokens appartiennent exclusivement à leurs composants.

Les conventions communes sont mutualisées au niveau des Decision Tokens.

### 9.4. Traçabilité

Les dépendances entre tokens doivent pouvoir être identifiées et vérifiées.

Les références doivent être résolubles et exemptes de cycles.

### 9.5. Documentation

Tout nouvel élément réutilisable doit être accompagné d'une documentation décrivant son rôle, ses propriétés et ses conditions d'utilisation.

### 9.6. Évolution contrôlée

Les changements apportés aux valeurs partagées, aux composants et aux Patterns doivent prendre en compte leurs conséquences sur l'ensemble des interfaces qui les utilisent.

---

## 10. Points laissés à l'implémentation

Le présent cadrage définit les principes d'architecture du Design System.

Il n'impose pas :

- Un framework de développement particulier.
- Une bibliothèque de composants tierce.
- Une nomenclature complète de fichiers et de dossiers.
- Une échelle définitive de couleurs ou de dimensions.
- Un nombre fixe de colonnes ou de breakpoints.
- Un outil de conception graphique particulier.
- Une méthode unique de distribution des composants.
- Une organisation technique monorepo ou multirepo.
- Un dispositif précis d'automatisation et de validation.

Ces choix relèvent des spécifications techniques propres à chaque implémentation.

Le format DTCG 2025.10 constitue toutefois une exigence pour la représentation des tokens.

La classification des Decision Tokens doit être explicite dans leur référentiel, selon une convention compatible avec ce format.

---

## 11. Synthèse des principes établis

Le Design System repose sur cinq niveaux de responsabilité :

**Primitives → Decision Tokens → Component Tokens → Components → Patterns**

Il s'organise documentairement en trois rubriques :

**Foundations → Components → Patterns**

Les principes structurants sont les suivants :

1. Les Primitives représentent les valeurs fondamentales.
2. Les Decision Tokens expriment des décisions partagées, sémantiques ou non.
3. Les Component Tokens appartiennent exclusivement à leurs composants.
4. Tout token non primitif doit être résoluble jusqu'à une Primitive.
5. Les Components peuvent être simples ou composites.
6. Les UI Components et Layout Components constituent deux familles de composants.
7. Le Grid System relève des Foundations.
8. Les Interaction Patterns et Layout Patterns formalisent des solutions d'usage récurrentes.
9. La complexité ou l'imbrication d'un composant ne suffit pas à le qualifier de Pattern.
10. La conception et l'évolution du système sont progressives, documentées et fondées sur des besoins identifiés.

**Principe directeur :** établir une architecture de design cohérente, explicite et indépendante des technologies, dans laquelle les valeurs, les décisions, les composants et les solutions d'interaction disposent de responsabilités distinctes mais complémentaires.