# DS-UI-06 — Foundations, inspecteur complet et création par chat

15 novembre 2026 — cible **application**, réalisation reprise explicitement en réflexion Très élevée. **En revue — qualification technique acquise sur le domaine fermé livré, acceptation humaine différée.** [Bilan, contrôles et réserves](../reviews/ds-ui-06-foundations-inspector-chat.md), [contrat 038](../decisions/038-foundations-inspector-chat.md). L’arbitrage primitives est résolu ; les points de reprise et exclusions documentaires ci-dessous restent historiques.

**Correction après recette humaine :** [restauration de la présentation Framer](ds-ui-06-framer-regression.md), champs compacts et alignés sans changement de l’organisation ni des contrats de tokens. La nouvelle copie visuelle est sur 54815 ; les reprises/URL antérieures ci-dessous restent historiques.

## Mandat et préflight

Organiser le Design System en deux accès d’édition : Foundations pour les décisions partagées, Components pour les réglages des composants. Présenter tous les champs de l’élément sélectionné dans l’inspecteur. Réserver la création des tokens de décision ou de composant au chat IA, notamment lors de la création d’un composant ou d’une variante ; modifier les tokens existants dans l’inspecteur. Le moteur crée ou réutilise automatiquement les primitives nécessaires et les relie aux tokens, sans intervention de l’IA.

Racine Git vérifiée : `/Users/yannbellot/Documents/GitHub/loomata`. Base `2cad02fe423d0d67d6770a12f6103dd8bb968d1b`, branche initiale `main`, aucun diff suivi préexistant. Copies suffixées ` 2`, `application/.storybook/editor/` et `frontend/` non suivis hors périmètre, conservés. Branche documentaire `codex/prepare-foundations-inspector`. Premier accès Git en écriture refusé par le sandbox ; création de branche réussie après escalade autorisée. Aucune opération distante.

Catalogue applicatif explicitement consulté ; rôle Builder et procédure [plan-feature](../../skills/plan-feature/SKILL.md) sélectionnés sur cette base (dernier changement de la procédure `3c5ed91`, qualification documentaire INIT-04 ; aucune qualification du nouveau parcours déduite). Réutilisation explicite dans le lab, sans intégration à sa bibliothèque. Travail séquentiel, même agent, non indépendant ; aucune délégation.

Modèle recommandé pour la réalisation : **GPT-6.1 Sol · Élevée**, car sélection multi-champs, modèle DTCG, writer, chat et import ont des contrats dépendants. Préparation sans difficulté justifiant très élevée ; configuration effective du client non vérifiable et non modifiée.

## Sources et observations

- [Périmètre Loomata](../product/loomata-workspace.md), [contrat de coordination](../architecture/workspace-contract.md) : sélection contextualisée, brouillon commun persistant, annulation et frontières des writers. Desktop uniquement, décision 032.
- [Architecture DS](../design-system/architecture.md), [autorité DTCG/YAML](../../src/design-system/authority/README.md), décisions [027](../decisions/027-dtcg-authority-and-css-recipes.md) et [030](../decisions/030-reusable-decision-policy.md) : classification explicite, responsabilités distinctes, justification des références. Certaines décisions de composition sont actuellement en consultation seulement.
- [Décision 023](../decisions/023-explicit-style-intent.md), [assistance](../design-system/editor-assistance.md) : question de portée obligatoire et création d’intention dans Apparence. Contrat à remplacer explicitement avant code, sans réactiver l’ancienne déduction automatique de portée.
- [FIGMA-IMPORT-02](figma-import-02-component-workflow.md) : création déterministe de primitives et tokens de composants hors chat. Parcours à raccorder à la nouvelle règle, sans exemption implicite.
- [DS-UI-03](ds-ui-03-framer-panels.md), [DS-UI-04](ds-ui-04-row-disclosure.md), [DS-UI-05](ds-ui-05-font-type-row.md) : acquis de présentation/clavier à préserver. Brouillon personnel natif signalé par DS-UI-05 : ne pas recharger la fenêtre ni recopier son état privé.

Inspection du code : `src/ui-lab/editor/AppearancePanel.tsx` utilise `PropertyPicker` et `ScopeControls` ; `editor-contract.yaml` fournit `propertyGroups`. `src/design-system/DecisionCatalog.tsx` est une vue documentaire en lecture seule séparée par classification. Dans `src/design-system/editor/operations.ts`, `set-component-token` et `update-shared` appellent `primitiveFor` : une nouvelle valeur peut ajouter une identité primitive. Ce mécanisme correspond à la règle retenue ; les contrôles de création via chat doivent distinguer tokens de décision/composant et primitives techniques. Masquer les boutons de création ne suffit pas.

## Organisation cible demandée

### Foundations — décisions partagées

- Grilles par type visuel : color, radius, size, spacing, typography, shadow, etc., avec correspondance documentée vers les familles/domaines existants. Ces exemples n’ajoutent ni catégorie vide ni domaine CSS. Type visuel, type DTCG et classification restent distincts.
- Une carte par décision existante : aperçu adapté, nom intelligible, rôle et valeur résolue avec unité. Deux décisions de même valeur restent séparées si leurs rôles diffèrent.
- Badge textuel **Intention** pour `semantic`, **Convention** pour `non-semantic` ; filtre « Tous · Intentions · Conventions ». Lire les métadonnées contrôlées, sans déduction depuis un préfixe, une valeur ou un nombre d’usages.
- Sélectionner une carte ouvre son inspecteur ; sa modification prépare une opération partagée. Montrer les usages concernés, les effets hérités et les limites d’inventaire ; préserver les réglages propres.
- Couvrir les décisions dont le domaine et les consommateurs sont validés pour l’édition. Inventorier les autres et afficher leur indisponibilité motivée, sans les faire disparaître. Qualifier en A/B toute extension nécessaire ; aucune décision de composition n’est déclarée éditable par cette fiche.
- Les primitives ne sont pas des cartes modifiables de la charte ; conserver leur rôle technique et leur documentation dans Foundations, sans supprimer leurs sources/stories.

### Components — inspecteur complet

- Conserver composant, variante, partie et état applicables, avec portée lisible. Une modification de définition peut concerner ses occurrences ; elle n’est pas nécessairement limitée à une instance DOM.
- Retirer le menu **Propriété** : tous les champs pris en charge du contexte sont présents, regroupés selon `propertyGroups`, sans sélectionner une propriété pour les afficher. Sections ouvertes par défaut, défilement accessible, groupes vides masqués ; repli manuel sans perte de saisie.
- « Tous les champs » ne signifie ni tous les états/parties mélangés ni toutes les propriétés CSS possibles.
- Chaque modification vise le token de composant existant, conserve son identité et ne modifie aucune décision partagée. Indication « Suit la charte » / « Réglage propre », action « Revenir à la charte » ; sans attribution, rétablir la base documentée avec un libellé approprié.
- Retirer les choix techniques de portée et formulaires de création du parcours visuel. Conserver unités, polices, contrastes, validation, focus, erreurs par champ et aperçu commun. Une saisie invalide ne doit pas écraser les autres champs ni disparaître au changement de sélection.

### Chat IA — seul accès de création

- Toute nouvelle identité de token de décision ou de composant passe par une demande au chat, notamment lors de l’ajout d’un composant, d’une variante ou d’une propriété éditable. Réutiliser les identités compatibles ; une égalité de valeurs ne justifie pas une nouvelle décision commune. La création/réutilisation des primitives relève du moteur automatique décrit ci-dessous.
- Le chat reçoit sélection/version/intention, explique créations et réutilisations et justifie Intention/Convention. L’utilisateur ne choisit pas une catégorie technique ; une ambiguïté produit matérielle reste soumise à clarification.
- Proposition bornée et validation déterministe avant projection : références, classification, compatibilité et identités. Refuser plans périmés, conflits et applications partielles ; coordonner atomiquement les sources affectées. Pas d’écriture libre confiée au modèle.
- Distinguer création bornée de tokens et développement React/variante : router ce dernier vers le moteur de chantier existant, sans élargir le writer DS ni promettre une création universelle instantanée.
- Sans IA connectée, consulter/modifier les tokens existants reste possible, y compris avec une valeur inédite valide : le moteur crée ou réutilise la primitive nécessaire. La création de tokens de décision/composant reste indisponible avec explication et demande conservée. Aucune inférence à l’ouverture, à la sélection ou à la frappe d’un champ.
- Figma : exploration/lecture conservées ; toute proposition ajoutant des tokens de décision/composant rejoint une demande contextualisée du chat avant application. La seule création automatique d’une primitive pour modifier un token existant n’impose pas ce passage. Contrôler aussi réimport et remplacement ; ne pas désactiver silencieusement la capacité existante.
- Appliquer la règle dans le service/moteur, pas seulement dans l’UI : chat général, micro-chat, imports, variantes et anciennes routes. « Via chat » correspond à une demande et une provenance validées par la coordination, pas à un champ libre fourni par le modèle/client.

## Décision du porteur — arbitrage primitives résolu

**15 novembre 2026 — décision explicite : création des tokens via le chat IA, modification dans l’inspecteur et création ou réutilisation automatique des primitives.** L’interprétation initiale qui réservait aussi les primitives au chat est corrigée ; aucun arbitrage sur ce point ne reste ouvert.

Dans cette règle de parcours, « création de tokens via le chat » désigne les tokens de décision et de composant. Les primitives portent les valeurs et sont gérées par le moteur de façon déterministe :

1. Valider et normaliser la valeur selon le domaine existant.
2. Rechercher une primitive compatible de même famille/type et de valeur canonique identique, unités comprises, sans conversion implicite ni approximation.
3. Réutiliser cette primitive si elle existe ; sinon, créer la primitive nécessaire.
4. Relier le token à cette primitive en conservant son identité lors d’une modification. Une décision peut conserver un lien vers une autre décision compatible ; sa chaîne rejoint toujours une primitive.

Ces étapes s’appliquent à la création via chat comme à la modification dans l’inspecteur, sans question ni inférence pour gérer les primitives. Une primitive utilisée ailleurs n’est jamais modifiée pour satisfaire un seul réglage : changer la référence du token concerné. Préparer ensemble primitive éventuelle et référence dans le brouillon, puis les sauvegarder dans la même transaction validée ; aucune écriture durable à la simple frappe.

La règle conserve DS-02 du cahier des charges : pas de valeur littérale ajoutée aux tokens non primitifs, pas de cycle ni de nouvelle représentation à arbitrer. La portée reste celle de l’accès : composant dans Components, décision partagée dans Foundations. Pas de fusion ou nettoyage automatique des primitives dans ce mandat.

## Tranches et dépendances

| Tranche | Résultat et surfaces principales | Condition de passage |
| --- | --- | --- |
| A — contrats/inventaire | Inventorier décisions éditables et producteurs de tokens ; formaliser la règle primitives résolue ; décision successeur de 023 complétant 030 et l’import ; aligner les autorités avant code | Domaines explicites, distinction tokens/primitives appliquée aux contrats, conservation des anciennes transactions documentée ; aucun arbitrage primitives restant |
| B — Foundations | Grille, badges/filtres, inspection/propagation ; catalogue, navigation et workspace UI Lab | A ; couverture de toutes les décisions annoncées modifiables, identités/valeurs préservées |
| C — inspecteur | `AppearancePanel.tsx`, `PropertyPicker.tsx`, `ScopeControls.tsx`, session/draft/assisted/rebase ; édition simultanée, portée composant | A ; plusieurs champs sans perte, états/sélection et rétablissement corrects |
| D — création par chat | Coordination `workspace-design.ts`, `workspace-figma.ts`, création/variantes, adaptateurs chat, schémas/operations et writer | A ; B/C pour parcours intégré ; aucune voie indirecte non contrôlée |
| E — qualification/docs | Parcours web/macOS isolés, Storybook documentaire, guides et dossier humain | B–D qualifiées ; aucune donnée privée ou brouillon humain importé |

Pour A/D, inspecter aussi les ponts `workspace-design-bridge.mjs`, `workspace-editor.mjs`, le compilateur d’import et les listes de création/export. Les chemins observés ne sont pas un inventaire exhaustif. Ne pas livrer B/C seules comme parcours final si des créations anciennes restent accessibles.

## Critères et preuves prévues

1. **Catalogue :** chaque décision éditable apparaît une fois par type avec classification, valeur et usages ; décisions égales mais distinctes conservées, filtre sans doublon et limites visibles.
2. **Sélection :** carte → bonne décision ; composant → bonne variante/partie/état ; navigation sans création/inférence ; identités outil/projet isolées.
3. **Multi-champs :** couleur, rayon et typographie dans un même brouillon ; erreur d’un champ, changement de sélection, annulation, conflit et reprise sans perte des autres valeurs. Aucun menu Propriété ni choix de portée requis.
4. **Portée :** édition composant sans propagation partagée ; Foundations ne modifie que les liens effectifs compatibles ; réglages propres préservés ; rétablissement vers la décision courante, pas sa valeur historique.
5. **Création :** composant, variante, intention et convention via chat avec classification/références validées ; répétition sans doublon ; demandes non autorisées/périmées refusées. Import/réimport soumis à la même règle pour les tokens de décision/composant. Valeur déjà disponible : primitive compatible réutilisée ; valeur inédite : primitive créée et reliée automatiquement, identité du token modifié conservée et aucun effet sur les tokens qui partagent seulement son ancienne primitive. La propagation d’une décision modifiée suit le critère 4. Une même valeur de type/famille/unité incompatibles ne provoque pas de fausse réutilisation.
6. **Sans IA :** consultation, modification de l’existant, annulation et sauvegarde, y compris valeur inédite valide avec primitive automatique ; création de tokens de décision/composant indisponible sans faux succès. Aucun appel IA requis pour gérer les primitives.
7. **Durabilité :** sources/catalogue cohérents dans la transaction ; sauvegarde/relecture, révision concurrente et réponse perdue ; anciens journaux/reçus conservés sous leur outillage. Pas de migration de recette active ni retrait de verrou.
8. **Rendu :** grilles/inspecteur au clavier, focus et défilement accessibles en desktop 1280×800 et 1440×900. Conserver palette/panneaux/contrôles natifs ; aucune variante mobile.

Contrôles à sélectionner lors de la réalisation, depuis l’app sur données fictives isolées : `npm run typecheck`, lint ciblé, `npm run test:design-system`, tests unitaires catalogue/decisions/session, `npm run test:design-editor:server`, `npm run test:workspace`, `npm run test:variants`, `npm run test:figma-import`, builds app/Storybook et `npm run docs:design-system:check`. Prévoir les parcours ciblés inspecteur/persistance/création chat avec les commandes existantes inspectées. Un vrai appel Codex autorisé prouve le raccordement ; une simulation seulement le contrat. Aucun appel réseau implicite.

Revues de réalisation : Design Reviewer (grilles/inspecteur/portée), Technical Reviewer / QA (graphe, multi-champs, transactions, voies de création), Security Reviewer (provenance, validation serveur, entrées modèle/import et permissions). Séquentiel, même agent, non indépendant sauf autorisation ultérieure de délégation. Si des instructions doivent changer, maintenance/revue ciblée selon le contrat lab ; aucune modification automatique des skills ici.

## Historique de préparation — exclusions, bilan et reprise

Mandat documentaire : aucun code, installation, génération, test, serveur, inférence, import réel, packaging, modification de recette ou publication. Pas de nouvelle palette/stack, catalogue exhaustif, fusion/suppression de tokens ou renumérotation. Projets existants/valeurs personnalisées sans migration implicite. J4/J5 et modèles de suivi livrés inchangés.

À synchroniser pendant la réalisation : spécification DS editor et périmètre Loomata, architecture/autorités, guides editor-preview/editor-assistance/editor-persistence et migration si les contrats évoluent. Régénérer les documents dérivés ; décisions historiques conservées avec renvoi vers leur successeur. Statuts de fabrication uniquement dans la roadmap racine.

**Bilan de préparation :** fiche et suivi racine actualisés (**Doc updated**). Inspection en lecture seule du code/contrats/commandes ; relecture documentaire des dépendances et critères, pas de revue indépendante. Tests, builds, parcours et compatibilité de cette organisation **non exécutés, non vérifiés**. Risques restant à qualifier : nouvelle voie d’import et coordination des créations par chat ; primitives résolues au niveau du contrat attendu, sans qualification fonctionnelle revendiquée. Version documentaire sur la base ci-dessus ; fichiers : cette fiche, roadmap et état courant racine.

Contrôles documentaires de préparation : `git diff --check` conforme ; les 13 liens locaux de cette fiche existent. Relecture du diff et des fichiers sélectionnés : aucun secret, donnée personnelle ou configuration privée ajouté ; aucun fichier préexistant absorbé. Revue documentaire séquentielle : dépendances, exclusions, critères et résolution compatible avec DS-02 explicités ; revues applicatives réservées à la réalisation. Cette vérification ne constitue pas une qualification du fonctionnement futur.

Actualisation documentaire du 15 novembre : base `9494528c4f647cbb4a7927a332c1ef4c51e1caa3`, branche `codex/resolve-ds-ui-06-primitives`, aucun diff suivi initial et mêmes préexistants hors périmètre conservés. Mandat limité à cette fiche et au suivi racine ; décision du porteur consignée ci-dessus, critères et dépendances corrigés. Procédure plan-feature conservée à la version déjà inspectée ; aucun code, test, service ou appel fournisseur exécuté.

## Réalisation — tranche A et point de reprise du 15 novembre

Mandat courant : réaliser A–E. Base `c08ecf84ce1f4b580960f264518b3570bdb85672`, branche `codex/ds-ui-06-foundations-inspector`, aucun diff suivi initial ; préexistants non suivis hors périmètre conservés. Les exclusions de code/tests/services ci-dessus décrivent la préparation historique, pas ce nouveau mandat. Sélection explicite des procédures applicatives implement-feature et design-interactions, version de cette base, en complément de plan-feature ; elles ne deviennent pas des skills lab actifs. Les prescriptions de portée historiques de ces procédures sont remplacées pour la cible demandée par 038 ; leur maintenance devra suivre le workflow lab avant livraison. Aucune procédure n'autorise le contournement des protections.

### Inventaire vérifié en lecture seule

| Surface | Constat dans les sources | Travail nécessaire |
| --- | --- | --- |
| Inspecteur | AppearancePanel utilise une sélection globale et une mesure `applied` corrélée à un seul binding ; assisted/session/rebase portent les modifications | Extraire des champs multiples sans attribuer une mesure d'un champ à un autre ; conserver erreurs et saisies |
| Décisions éditables | `EditorModel.styles` et `update-shared` ; primitives via `primitiveFor` | Garder ces mécanismes et vérifier absence d'effet sur les autres consommateurs de la primitive |
| Conventions | `EditorStyle.classification` existe, mais `define-and-assign`/`intentionSchema` ne portent pas de classification ; `catalogForOperations` ajoute une éligibilité sémantique | Ajouter un contrat borné pour les conventions ; ne pas les créer comme de fausses intentions |
| Décisions de composition | `DecisionCatalog` lit directement DTCG et indique consultation hors collection editor | Couvrir les types réellement éditables ; rendre explicites les limites des autres |
| Écriture DS coordonnée | `workspace-design-bridge.mjs` et `applyDesign` refusent les opérations de création hors protocoles 5/6 | Introduire le raccordement de création par chat, sans simplement retirer cette liste de contrôle |
| Variantes | `mutateVariant` crée via protocole 5 et `applyDesign`, sans preuve de demande chat | Relier la demande avant création, garder assignation et annulation déterministes |
| Import | `workspace-figma-import.mjs` accepte une proposition locale par protocole 6 et l'efface après reçu durable | Raccorder demande chat et proposition, en conservant la récupération d'une réponse perdue |
| Chat | `broker.permittedPath` protège `src/design-system` ; `applyWorkspaceProposal` publie des propositions de fichiers par `store.apply` | Créer un adaptateur typé de demande DS ; ne pas autoriser l'écriture directe de DTCG |
| Reprise | `recoverDesign` rejoue un journal puis publie la trace commune ; `coordinateEditor` traduit les révisions DS/communes et retrouve les reçus | Vérifier la provenance durable au bon moment, sans consommer une autorisation avant la fin ni permettre son réemploi sur une autre proposition |

### Difficulté observée et arrêt de configuration

Le raccordement de création exige de relier **provenance chat, proposition typée et deux niveaux de transaction/récupération**, sur trois protocoles d'écriture. Les adaptateurs actuels ne fournissent pas cette preuve commune. Retirer une interdiction de création ou ajouter un booléen client ne satisferait pas le contrat. Incertitude restante : où persister et valider la corrélation demande/proposition/révisions afin que le rejeu d'une transaction interrompue reste idempotent, sans accepter une demande périmée ni bloquer la récupération d'une opération déjà enregistrée. À traiter aussi : création d'une convention distincte de l'éligibilité sémantique et conservation des anciens reçus.

Cette difficulté de protocoles, observée avant modification, justifie **GPT-6.1 Sol · Très élevée (`xhigh`)** pour la suite. Application de l'arrêt de configuration prévu par AGENTS du lab : point de reprise conservé, arrêt avant l'implémentation concernée, attente d'une sélection manuelle et d'une demande explicite de reprise. Aucun réglage modifié, aucun recours implicite à Ultra ou sous-agent. Ce n'est ni un nouvel arbitrage sur les primitives ni un refus de permission.

A est **partielle, non qualifiée** : décision cible et inventaire produits ; protocole et revue technique à compléter. B–E non engagées, aucune UI partielle présentée comme livrée. Aucun code applicatif, autorité de valeurs, compte, recette native ou brouillon personnel modifié ; aucun appel fournisseur. Les contrôles de référence ci-dessous ne prouvent pas le nouveau fonctionnement.

Contrôles de référence exécutés depuis l'app : `sh scripts/with-runtime.sh node --test tests/decision-policy.test.mjs tests/workspace-adapters.test.mjs tests/workspace-variants.test.mjs` : **16 réussis, 0 échec**, dont reprise après publication DS/variante interrompue, refus de révision périmée et annulation. Fixtures isolées des tests existants ; aucune instance de recette lancée. Contrôle documentaire : `git diff --check` conforme, 14 liens de la fiche et un lien de la décision présents. Relecture séquentielle, même agent, non indépendante : l'inventaire est exploitable ; l'absence de protocole de provenance/reprise et de création de convention empêche de qualifier A. Revues applicatives Design/Technical/Security et builds du nouveau parcours non exécutés. **Doc updated** ; seuls fiche, décision 038, roadmap et état courant modifiés. Commit de point de reprise sur branche dédiée, sans fusion dans main d'une tranche non qualifiée ni publication.

**Prochaine action de ce checkpoint historique :** sélectionner manuellement Très élevée puis demander la reprise DS-UI-06. Cette reprise a été explicitement demandée et réalisée ci-dessous.

## Bilan de réalisation — A à E

Version fonctionnelle qualifiée : `543fe16` ; preuves et documentation de clôture rattachées à ce commit.

Reprise autorisée par le porteur en réflexion Très élevée sur `7cd5caf`, même branche ; configuration effective du client non prétendue vérifiée. Aucun sous-agent. Préexistants non suivis conservés, aucune modification des valeurs DTCG canoniques, du brouillon personnel ou d’une ancienne recette. Les ressources de test ont leur propre racine et des données synthétiques.

- **A qualifiée :** contrat 038 aligné, création via action typée du chat et admission interne avant le journal existant ; provenance conservée dans les nouveaux reçus, schémas coordonnés. Aucun ancien reçu converti.
- **B qualifiée :** Foundations par type, Intentions/Conventions, valeurs et aperçus, décisions éditables inspectées avec leurs usages. Domaines de composition non éditables explicitement en consultation.
- **C qualifiée :** champs simultanés par contexte, éditions locales sans question, rétablissement courant, erreurs/conflits conservés, mesures corrélées. Navigation vers le composant courant corrigée.
- **D qualifiée dans le domaine fermé :** création sémantique/convention, variante et import préparés par chat ; refus des anciennes créations directes. Besoin hors matrice transformé en demande planifiée, sans démarrage de chantier. Primitives automatiques sans IA. Une connexion réelle au fournisseur n’est pas revendiquée par les simulations.
- **E qualifiée techniquement :** 182 unitaires, 115 tests DS, six tests spécifiques du chat/moteur, neuf HTTP, 16 parcours compilés et neuf persistants desktop ; trois répétitions ciblées du rétablissement. Rendu AppKit/WKWebView instrumenté et captures 1280×800/1440×900. Types sur copie isolée, lint ciblé, builds, frontières, documentation générée et kit contrôlés selon le [rapport](../reviews/ds-ui-06-foundations-inspector-chat.md). Les échecs initiaux et retests y restent visibles.

Fichiers : moteur/contrats/schéma d’opérations et reçus, adaptateur et enveloppe du chat, admissions import/variantes, UI Lab/grille/inspecteur/navigation, tests et scénario reproductible, manifeste et liste de livraison, guides et six procédures du kit avec catalogue. Maintenance lab-maintain-agent-kit et revue lab-evaluate-instructions limitées aux instructions directement affectées ; 21 skills/quatre rôles conformes, exposition lab inchangée. Revues design/technique/sécurité/instructions séquentielles, même agent, non indépendantes ; conclusions et limites dans le rapport. **Doc updated.**

Les métadonnées de primitive et les liaisons sont atomiques avec la modification. L’annulation restaure l’attribution antérieure ; les identités ajoutées ne sont pas supprimées automatiquement. Les valeurs de la fixture ne constituent pas une nouvelle palette acceptée. Pas de publication, service distant, installation globale ou modification d’authentification. J4/J5 et modèles de suivi livrés inchangés.

**Reprise :** recette visuelle et premier essai réel du nouveau parcours chat avec le compte du porteur, dans une copie choisie. Prévisualisation fictive dédiée : `http://127.0.0.1:54812/ui-lab`. Ne pas recharger la fenêtre personnelle avant résolution explicite de son brouillon ; pas de nouveau chantier implicite. Réserves : décisions de composition en consultation, développement hors matrice planifié, fournisseur réel non nouvellement éprouvé. Les preuves sélectionnées accompagnent la fiche ; leur manifeste est dans [qualification.json](../reviews/ds-ui-06/qualification.json).
