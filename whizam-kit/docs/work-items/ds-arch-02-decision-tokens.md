# DS-ARCH-02 — Consolider les décisions de l’ensemble du design system

**6 novembre 2026 — Orientation validée ; réalisation A–D autorisée et reprise à Très élevée.** Les sections 1–9 conservent le cadrage de préparation historique ; le bilan d’exécution ci-dessous porte le statut courant. Cible : application. Demande : reprendre l’ensemble du DS selon le contrat DS-ARCH-01, notamment les Non-semantic Decision Tokens, et présenter la mise à jour avant implémentation. La présente fiche et son inventaire sont des documents de proposition ; aucune règle active ou source de tokens n’est modifiée.

## Base et méthode

Base `41d711a`, initialement main ; branche `codex/ds-arch-02-decision-proposal`. Racine Git vérifiée ; aucun changement suivi préexistant. Doublons non suivis et anciennes copies de fabrication préservés. La recette DS-EDIT-75 ouverte au porteur et ses éventuelles saisies ne sont ni lues ni modifiées ; l’inventaire porte sur le kit canonique, pas ses 18 styles enregistrés de recette.

Procédures applicatives [plan-feature](../../skills/plan-feature/SKILL.md) et [propose-architecture](../../skills/propose-architecture/SKILL.md), versions de la base, rôle Builder selon le contrat commun. Relecture documentaire séquentielle, même agent, non indépendante. Aucun sous-agent. Lecture de l’architecture, du cadrage DS-ARCH-01, du contrat DTCG, des règles/recettes YAML, des catégories de navigation et des opérations de l’éditeur. L’inventaire provient d’une lecture du référentiel par le chargeur existant, sans test, génération de dérivés, installation, serveur ou migration.

## 1. Ce que le contrat dit et ce qu’il faut décider

L’[architecture actuelle](../design-system/architecture.md) définit les décisions comme des intentions **ou des conventions abstraites réutilisables**. Component→Primitive reste autorisé ; Component→Decision est privilégié lorsqu’une convention existe. Le [cadrage initial](ds-arch-01/framing-v1.md), la décision 027 et le contrat d’autorité ne rendent pas cette couche obligatoire dans tous les cas. Il serait incorrect de présenter l’interdiction des liens directs comme une règle déjà adoptée.

**Recommandation à valider : rendre explicite la politique initiale de design à travers les décisions réutilisables, sans interdire les exceptions locales.** Les réglages initiaux couverts par une intention ou une convention suivent Component→Decision→Primitive (éventuellement Decision→Decision). Une référence directe reste possible pour une exception locale explicitement choisie, un échantillon documentaire et un réglage technique sans convention pertinente. Toute référence directe restante doit avoir propriétaire, justification et raison de non-mutualisation ; aucun classement « non sémantique » ne se déduit de sa seule valeur.

Cette règle renforce l’obligation de justification et le raccordement des réglages initiaux ; **elle doit être approuvée avant d’aligner le contrat actif**. Ne pas créer un Decision Token par composant uniquement pour rendre le graphe visuellement uniforme. Une décision abstraite peut être utile avec un seul consommateur, si sa convention est définie indépendamment de ce composant.

Alternative minimale : enrichir les décisions sans renforcer la politique d’attribution initiale ; compatible avec le contrat courant mais laissant davantage de choix ponctuels. Alternative stricte absolue : interdire tout Component→Primitive, y compris une exception saisie dans DS-EDIT ; non recommandée, car elle impose de transformer chaque exception en décision, modifie la notion de réutilisation et le rétablissement. Ce chantier ne la présume pas acceptée.

## 2. État constaté, périmètre exhaustif de lecture

L’[inventaire figé](ds-arch-02/inventory.json) contient une entrée pour chacun des **463 tokens DTCG**, sa référence, valeur, propriétaire et famille de revue proposée, ainsi que les 28 recettes et leurs 32 sorties. Les allocations sont des candidates non approuvées ; l’inventaire n’est ni une migration exécutable ni une seconde autorité.

| Ensemble canonique | Constat |
| --- | --- |
| Primitives | 109 : 25 de l’éditeur, 84 de composition/paramètres ; valeurs et unités à conserver |
| Decision Tokens | 17 sémantiques, tous de couleur ; aucun non sémantique |
| Component Tokens éditables | 188 : 51 via décisions, 137 directement vers des primitives |
| Component Tokens de composition | 116 DTCG : 9 via décisions, 107 directement vers des primitives |
| Échantillons de primitives | 9 Component Tokens générés avec accès direct à la donnée représentée |
| Compatibilité | 24 alias historiques, distincts des décisions actives |
| Recettes CSS | 28 recettes, 32 sorties ; séparées des tokens DTCG, jamais de faux types CSS |

Au total : 313 Component Tokens DTCG, 60 reliés à des décisions et 253 à des primitives, dont neuf échantillons. Les 32 sorties de recettes ne sont pas ajoutées artificiellement au nombre de tokens DTCG. Les documents historiques peuvent afficher d’autres décomptes : ne pas les substituer à ce relevé daté.

Les 137 réglages éditables directs couvrent : rayons 11, familles 19, tailles de texte 20, graisses 19, interlignes 17, padding block 12/inline 12, gaps 6, marges de page 2, largeur maximale 1, largeurs de bordure 10, épaisseurs de focus 4 et décalages de focus 4. Les 51 réglages sémantiques existants de couleur ne sont pas réattribués du seul fait de cette consolidation.

## 3. Bibliothèque de décisions proposée

Noms ci-dessous illustratifs en anglais, à fixer dans la table de correspondance avant migration. Identités existantes conservées ; le préfixe historique `semantic.*` ne détermine pas la classification. Toute nouvelle décision reçoit classification, définition, justification, domaine, unité/type, usages autorisés et provenance. Ne pas changer les valeurs pour les faire rentrer dans une échelle plus régulière.

| Domaine | Décisions sémantiques proposées | Conventions non sémantiques proposées | Périmètre de raccordement |
| --- | --- | --- | --- |
| Couleurs | Conserver les 17 intentions ; compléter seulement les rôles démontrés de surface/texte/contour de l’atelier et de l’exemple | Palette nommée par famille/ton uniquement si elle constitue une convention utile ; pas d’alias supplémentaire pour chaque hex | Couleurs de tous les composants, projets, démonstrations et habillage ; l’atelier garde son propriétaire, distinct de la marque produit |
| Rayons | `decision.radius.control`, `decision.radius.container` si ces deux politiques sont retenues | `decision.radius.scale.step-01`, `step-02`, `pill` pour une échelle abstraite documentée ; seuls niveaux réellement utilisés | Button/Field/SelectField pour les contrôles ; Panel pour conteneur ; Notice à qualifier selon sa fonction ; formes de démo séparées si l’intention diffère |
| Familles de texte | `decision.type.family.body`, `decision.type.family.control` lorsque la distinction est voulue | Collection abstraite de familles seulement si elle sert une convention ; le catalogue Google Fonts et les fichiers installés sont des ressources, pas des décisions par police | Les 19 familles éditables et les familles de recettes ; garder DS-EDIT-75, noms à espaces, cache/licences et import local |
| Tailles de texte | `decision.type.size.body`, `caption`, `heading` selon la hiérarchie réelle | Échelle `decision.type.size.scale.step-*` avec valeurs existantes et unités exactes | Les 20 tailles éditables et toutes celles des compositions ; titres responsive restent des recettes |
| Graisses/interlignes | `decision.type.weight.action`, `decision.type.line-height.body` si usages établis | `decision.type.weight.regular`, `semibold` et niveaux de densité d’interligne définis indépendamment d’un composant | Les 19 graisses/17 interlignes ; préserver 650 et la compatibilité des familles importées, sans arrondir à 600/700 |
| Espacements | `decision.space.control.inline`, `block`, `field-stack`, `section` si ces relations sont voulues | `decision.space.scale.step-*` à partir des valeurs réelles, dont 0,7 rem ; ne pas inventer une échelle vide | Padding, gaps et marges des composants et compositions ; aucune unification px/rem ou négatif/positif implicite |
| Dimensions/layout | `decision.layout.reading.max-width`, `decision.control.min-height` si besoins démontrés | Échelle abstraite des dimensions seulement pour les niveaux utilisés ; ne pas appeler une largeur « spacing » | Largeur 70 rem du modèle éditable, autres conteneurs et minimums ; grille et responsive documentés sans nouveaux écrans |
| Bordures/focus | `decision.border.control.width`, `decision.focus.width`, `decision.focus.offset` | Échelle `decision.stroke.scale.step-*` lorsqu’elle existe réellement | Dix largeurs de bordure, quatre épaisseurs/quatre décalages de focus, bordures composites des compositions ; une bordure de 0 reste 0 |
| Élévation | Niveau d’overlay/dialog si cette hiérarchie est démontrée | `decision.elevation.level-*` seulement si les ombres forment une convention | Ombre composite existante, sans créer une collection fictive d’ombres |
| Mouvement/opacité | Retour d’état et atténuation indisponible si ces rôles sont voulus | Durées, courbes et niveaux d’opacité abstraits réellement utilisés | Transition 160 ms, courbe existante, opacité ; respecter reduced-motion et conserver les états |
| Structure/accessibilité/icônes | Règles documentées et décisions seulement pour les valeurs de design effectives | Aucune catégorie de tokens vide | Conserver focus/clavier/contrastes, mécanismes visuellement masqués, iconographie et Patterns existants ; pas de pack d’icônes ou de composant nouveau |

Une échelle n’est pas une primitive renommée : sa définition expose sa progression, ses limites et les choix qu’elle rend possibles. Les valeurs égales d’un contrôle et d’un conteneur ne suffisent pas à leur imposer la même décision sémantique. Des paramètres purement structurels (centrage, auto, collapse) peuvent rester des mots-clés/recettes ; ne pas inventer une décision de design pour chaque constante mécanique.

## 4. Exemple de rayon avant/après proposé

Actuellement les 11 rayons éditables suivent leur primitive 0,5 rem, sans attribution partagée. L’ancien `semantic.radius.control.default` est un alias déprécié, pas une décision active à réactiver automatiquement.

```text
Button / Field / SelectField → decision.radius.control ────┐
                                                          ├→ decision.radius.scale.step-01 → primitive.radius.rem-0-5
Panel → decision.radius.container ─────────────────────────┘
```

Ce graphe est une proposition de politique, pas une modification faite. Les deux décisions sémantiques gardent une identité distincte même si leur valeur initiale est égale. Si l’échelle n’a pas de convention justifiable, elles peuvent aller directement à la primitive : deux décisions en chaîne ne sont pas obligatoires. Notice est examiné séparément ; aucun rattachement silencieux par ressemblance.

Après une exception locale choisie dans DS-EDIT, le rayon du bouton peut encore atteindre une nouvelle primitive ; sa décision attribuée reste connue et Rétablir rejoint la décision courante. La base de rétablissement conserve sa responsabilité historique. Modifier la décision partagée affecte uniquement ses usages explicites. Il faut présenter au designer les usages et le sens avant l’action.

## 5. Nettoyage des responsabilités et couverture du reste du DS

- Revoir les primitives de composition nommées selon un écran ou un contrôle, et les réemplois entre domaines (`font-size` utilisé comme rayon, `space` comme rayon). Proposer des primitives de domaine cohérentes à valeur égale et préserver les anciennes identités comme compatibilité si nécessaire ; aucune fusion par valeur ni renommage massif implicite.
- Classer les 107 compositions directes selon leur intention réelle et leur propriétaire, pas selon les seuls sélecteurs CSS. Les candidats dans l’inventaire sont des files de revue, pas une décision automatique. Les 32 sorties de recettes gardent une syntaxe fermée ; leurs paramètres de design rejoignent les décisions pertinentes quand le contrat le permet. Les expressions contextuelles ne deviennent pas des tokens DTCG opaques.
- Examiner les références initiales, attributions et bases des 188 réglages séparément ; une exception enregistrée en recette n’est pas écrasée par la nouvelle politique initiale. Les échantillons de primitives restent une exception de visualisation explicite.
- Conserver Components UI/Layout et Patterns, leur fonction et leurs états. Mettre à jour leurs fiches et recommandations lorsqu’une intention évolue. Aucune nouvelle adoption Base UI, aucun nouveau Pattern, thème, backend ou framework introduit par cette reprise.

## 6. Navigation et édition proposées

Sous Foundations → Decision Tokens, présenter **Semantic Tokens** et **Non-semantic Tokens**, puis les seuls domaines réellement peuplés : Color, Type, Space, Radius, Size, Stroke, Elevation, Motion selon le contenu créé. Les mêmes catégories, libellés et données doivent être accessibles dans UI Lab et Storybook. La classification vient des métadonnées ; pas d’un préfixe ou d’une déduction depuis la valeur.

Conserver Primitives et Component Tokens chez leurs propriétaires, avec une chaîne explicite composant → décision(s) → primitive. Montrer définition, classification et usages avant modification partagée. La convention abstraite apparaît comme « Convention » plutôt qu’une intention sémantique inventée. La sélection compatible et le rétablissement existent déjà en partie ; les retester.

La création d’une nouvelle convention non sémantique reste une maintenance explicite des sources dans ce chantier ; **aucun formulaire de création arbitraire ni nouvelle permission IA**. Les conventions livrées peuvent être sélectionnées/modifiées via les opérations compatibles. Une recette ne doit pas utiliser un rôle sémantique factice pour pouvoir sélectionner une échelle.

## 7. Réalisation future, seulement après validation

| Tranche | Résultat | Porte de sortie |
| --- | --- | --- |
| A — Contrat et allocations | Consigner le choix du porteur, aligner les règles propriétaires ; attribuer chaque entrée de l’inventaire à une décision ou une exception justifiée | Table avant/après complète par identité, définitions des conventions, aucune valeur altérée ; l’accord de principe ne vaut pas acceptation visuelle |
| B — Référentiel | Créer les seules décisions utiles, aligner primitives et graphe DTCG, fiches/catalogue/règles | Références typées sans cycle, valeurs résolues identiques, classifications et propriétaires contrôlés |
| C — UI Lab/Storybook | Rubrique non sémantique, chaîne de dépendances, attributions et rétablissement ; cas recette/familles importées | Navigation et actions local/partagé cohérentes, mêmes valeurs dans les deux hôtes |
| D — Sauvegarde et distribution | Versionner les contrats modifiés, migration hors ligne sur copie, reprise et extraction | Pas de journal/compte converti ou copié, défauts/sauvegarde/reprise qualifiés ; dossier de recette humaine |

Surfaces attendues : `src/design-system/authority/tokens.tokens.json`, catalogue/éligibilités/taxonomie, recettes et contrat YAML, métadonnées et schémas ; projection DTCG/validation/résolution et contrôles de consommation ; opérations/session/writer/manifeste ; navigation/catalogues partagés UI Lab/Storybook ; fiches et stories des cinq composants et Foundations, consommateurs d’application/atelier. Documentation : architecture et autorité, nommage, inventaires générés, spécification de l’éditeur, persistance/reprise et procédures d’agents concernées. Ne pas éditer les dérivés à la main.

Les règles de fabrication racine et le cahier des charges restent chez le lab. Une modification de leur autorité devra être explicitement incluse dans le mandat futur si le choix validé change la règle Component→Primitive. Le suivi de fabrication reste à la racine ; les modèles de projet app restent non initialisés.

## 8. Critères de qualification et risques

- Conserver toutes les valeurs, unités et rendus initiaux : comparaison par identité et captures sur les deux formats de référence. Les changements d’architecture ne justifient aucun changement d’identité visuelle.
- Comptabiliser chaque token/recette de l’inventaire, décisions créées et exceptions restantes ; aucune attribution n’est qualifiée par un simple ratio de couverture.
- Tester décision sémantique et non sémantique, décision→décision, refus des cycles/type/propriétaire, exception locale, modification partagée et rétablissement. Retester import Google Fonts, nom à espaces, incompatibilités de graisse et fonctionnement hors connexion.
- Contrôles prévus : validate:design-system, test:design-system, docs:design-system:check, typecheck, lint, test:boundaries, builds app/Storybook, parcours atelier, serveur/persistance/récupération, extraction/renommage/déplacement. Tests ciblés de la nouvelle classification/navigation nécessaires ; aucune campagne exécutée dans ce mandat documentaire.
- Revues futures design, technique/QA et sécurité proportionnée au writer/migration. Revue de procédures si elles changent ; indiquer l’indépendance réelle. Recette humaine et reprise tierce distinctes de la qualification technique.
- Risques principaux : couplage involontaire des usages, explosion des conventions sans sens, changement du rétablissement, mélange d’anciennes recettes/journaux, et palette/échelles présentées comme acceptées. Réduire par allocations justifiées, migration isolée et retour arrière par ancienne copie intacte. Aucun nettoyage ou verrou retiré implicitement.

## 9. Bilan de préparation et validation demandée

**Doc updated.** Livrables : présente proposition, inventaire figé, roadmap et état de fabrication racine. Lecture structurée réussie : 463 tokens, 28 recettes, 32 sorties. Relecture documentaire et liens locaux vérifiés ; aucune implémentation, test applicatif, génération de dérivés, installation, serveur, téléchargement ou publication. Statut : **En revue — proposition documentaire à valider**, aucune qualification de la migration.

Préparation : GPT-6.1 Sol · Élevée, inventaire transverse et frontières de contrat ; réalisation recommandée au même niveau : classification, graphe, attributions, writer et deux hôtes couplés, sans difficulté observée justifiant très élevée/max. Aucun réglage client modifié ou prétendu vérifié.

Validation sollicitée : approuver la politique de la section 1, le catalogue de conventions par domaine et le principe d’une migration à rendu constant, avec conservation des exceptions locales et des recettes existantes. Les noms et allocations détaillés sont finalisés en A à partir des définitions approuvées ; un nouveau choix matériel découvert reste soumis à arbitrage. **Attendre la réponse du porteur avant toute implémentation.** Une approbation documentaire seule ne doit pas être interprétée comme une demande de démarrer des travaux non formulée.

## A — Exécution reprise sur mandat validé

Le porteur a sélectionné Très élevée et demandé explicitement la reprise. Base courante `32102be`, branche `codex/ds-arch-02-delivery` ; lanceur local intégré entre-temps préservé. Procédures implement-feature et test-user-flow du catalogue applicatif, puis revues successives déclarées. Aucun sous-agent ni réglage client modifié. Le [checkpoint](ds-arch-02/checkpoint.md) reste historique.

Allocations canoniques : [table avant/après et définitions](ds-arch-02/allocation.json). Les 17 décisions de couleur existantes restent intactes. Les 137 réglages scalaires directs rejoignent 36 décisions nouvelles : 24 conventions non sémantiques par domaine/unité/état et 12 décisions représentant huit politiques sémantiques (arrondis contrôle/conteneur/retour, familles contrôle/contenu, lecture maximale, intérieur block/inline). Les chaînes gardent des rôles compatibles ; les bases primitives ne sont pas changées. La totalité des anciennes valeurs résolues a été comparée par identité avant écriture des sources et est identique.

Composition : 96 conventions non éditables de niveaux de domaine, séparant l’habillage editor de l’application ; elles couvrent les compositions directes et les paramètres de design des recettes. Les coefficients numériques contextuels/reset/centrage restent mécaniques ; la position hors écran accessible reste une exception technique justifiée. Échantillons de primitives conservés. Pas de token par composant ni de grille de niveaux vides. Ces choix techniques compatibles précisent les allocations de A ; leur appréciation visuelle reste différée.


## B–D — Résultat réalisé et point de reprise

**6 novembre 2026 — En revue ; qualification technique acquise, acceptation humaine différée.** Version applicative `83b2978`, base `32102be`. [Bilan, revues et recette](../reviews/ds-arch-02/README.md), [qualification structurée](../reviews/ds-arch-02/qualification.json), [décision 030](../decisions/030-reusable-decision-policy.md).

A : allocations finales, politique approuvée et exceptions justifiées ; B : 149 décisions (29 sémantiques / 120 non sémantiques), 596 tokens au total, 463 valeurs et toutes les bases initiales conservées ; C : catégories et chaînes communes aux deux hôtes, choix explicite d’une convention compatible dans Apparence ; D : manifeste v29, migration hors ligne avec marqueur durable et refus de l’état privé, sauvegarde/relecture/reprise et extraction/déplacement qualifiés. Modèle/snapshot/opérations v4 conservés. Les 188 réglages ont une attribution initiale, sans interdire les exceptions explicites.

Les critères techniques sont démontrés dans le bilan : 113 DS, 149 unitaires, 66 serveur, 13 assistance, cinq documentation, 34 parcours atelier puis deux retests finaux, 18 Storybook, 18 persistants, quatre reprises réelles, propagation en direct, deux builds et 14 captures identiques. Migration complète de copies canoniques et personnalisées avec polices locales réussie ; ancienne recette DS-EDIT-75 jamais écrite, aucun compte/journal/reçu transféré. Revues design/technique/sécurité successives, même agent, non indépendantes ; limites et échecs intermédiaires retestés consignés.

Fichiers : sources DTCG/métadonnées/règles et six fiches, projections/validation/reader/writer/manifeste/migration, catalogues/scènes/Apparence, tests directement affectés, architecture/persistance/migration/nommage/organisation/passation, décision et dérivés générés. Suivi de fabrication consolidé à la racine. **Doc updated** ; aucun autre fichier préexistant intégré, aucune publication.

Hypothèses et choix délégués : niveaux abstraits limités aux usages existants, domaines explicites, séparation atelier/produit, états compatibles conservés, consultation des compositions et attribution des seules conventions préparées. Ils précisent l’orientation approuvée ; leur confort et leurs regroupements restent soumis à la recette humaine. Risque résiduel : densité du catalogue, appréciation des usages et reprise tierce non encore acceptées ; aucune nouvelle plateforme/Docker/base ou inférence fournisseur revendiquée.

Prochaine action : recette humaine et reprise tierce selon le dossier, sans actualiser implicitement un service vivant. LOCAL-APP-01, anciennes recettes, modèles applicatifs et acceptations J4/J5 conservés. La recommandation Très élevée de la reprise portait sur les trois graphes et la migration ; aucune hausse supplémentaire ni modification du réglage utilisateur n’a été nécessaire.
