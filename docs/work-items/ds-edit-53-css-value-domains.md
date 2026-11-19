# DS-EDIT-53 — Domaines de validité CSS sans limites de design

## Mandat et état

2 novembre 2026 — **application**. **En revue — qualification technique du raccordement courant acquise, acceptation humaine différée.** Préparation suivie du mandat explicite « Lance DS-EDIT-53 ». Réalisation locale des tranches A–D sur les formats actuels ; les autres syntaxes restent cataloguées sans activation.

Base inspectée : `869d5f9287d4b3cc5cb3f19c77f6f0fc6107a644`, branche locale existante `codex/ds-edit-value-domains`, racine Git vérifiée `/Users/yannbellot/Documents/GitHub/agentic-design`. Aucun changement suivi initial. Préexistants non suivis : copies suffixées « 2 », `frontend/` et `.storybook/editor/SemanticStyles.tsx`, tous hors périmètre et à préserver. Réinspecter Git avant réalisation ; ne pas absorber ces fichiers.

Procédure sélectionnée explicitement dans `skills/catalog.json` : [plan-feature](../../skills/plan-feature/SKILL.md), source versionnée à la base ci-dessus ; rôle Builder, sans activation de bibliothèque lab ni sous-agent. Suivi de fabrication dans la roadmap et l’état racine du lab ; modèles ROADMAP/état de l’app laissés non initialisés.

## Résultat attendu et décisions utilisateur

Empêcher les valeurs impossibles pour la propriété CSS, sans plafonds esthétiques arbitraires. Un rayon de `9999px`, un texte de `160px`, un interligne supérieur à 3 ou une largeur inférieure à 320px ne doivent plus être refusés sur ces seuls motifs. Accessibilité, lisibilité et cohérence restent des conseils non bloquants ; aucune acceptation visuelle n’est présumée.

Préparer toutes les familles de valeurs CSS par un référentiel extensible, exploitable par DS-EDIT et l’IA. Limiter la variété par la maturité et la compatibilité des fonctionnalités, sans promettre que toutes les propriétés deviennent immédiatement éditables. « CSS3 » n’est pas une frontière suffisante : les modules évoluent indépendamment.

Hypothèse de cadrage issue de la proposition précédant cette préparation : socle Baseline Widely available ; extensions Newly available selon cibles explicites du projet ; expérimental, propriétaire et obsolète exclus par défaut des nouvelles éditions. Références et versions figées, sans mise à jour distante automatique. Cette hypothèse n’est pas une compatibilité déjà acquise ni une autorisation d’activer des extensions.

## Constats et autorités à réconcilier

- [Contrat d’édition](../../src/design-system/authority/editor-contract.yaml) : 18 propriétés, cinq types ; plafonds 16/96/256/2560, minima de conception et familles préparées. Une propriété déclarée, comme `iconColor`, n’a pas nécessairement une cellule active.
- [Moteur](../../src/design-system/editor/contract.ts), `normalizeValue` : minimum et maximum obligatoires pour les nombres ; dimensions positives/nulles px/rem seulement, comparaison rem à 16px ; graisse entière, précision limitée. Les règles sont aussi inscrites dans des schémas et contrats historiques.
- [Panneau](../../.storybook/editor/Panel.tsx) : champs numériques sans min/max, `step` distinct du domaine ; saisies transitoires et dernier aperçu valide existants à conserver.
- [Snapshot](../../src/design-system/editor/snapshot.ts) : comparaison au contrat compilé de confiance ; une autorité envoyée par le client ne doit pas pouvoir élargir les domaines serveur.
- [Spécification](../product/features/design-system-editor.md), notamment domaines V1, [autorités](../../src/design-system/authority/README.md), [persistance](../design-system/editor-persistence.md), [assistance](../design-system/editor-assistance.md) et composition DS-EDIT-52 : textes et formats à faire évoluer ensemble. Les plafonds actuels sont une divergence explicitement demandée à corriger, pas une règle à supprimer dans le code seul.

Les preuves DS-EDIT-52 sont une base historique, pas une validation de cette évolution. Dépendances : génération et références J2, procédures d’écriture/récupération DS-EDIT, composition DS-EDIT-52. J4/J5 et recette humaine globale ne sont ni clos ni remplacés par DS-EDIT-53.

## Architecture proposée, à concrétiser en réalisation

| Source sous `src/design-system/authority/` | Responsabilité unique                                                                                           |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| `css-support-profile.yaml`                 | Profil daté, sources/version des données, compatibilité par fonctionnalité, exclusions et extensions explicites |
| `css-value-types.yaml`                     | Types et compositions réutilisables : unités, nombres, listes, fonctions, grammaires                            |
| `css-properties.yaml`                      | Propriétés CSS canoniques, grammaire, références normatives, contraintes et étape d’application                 |
| `editor-contract.yaml` existant            | Correspondance réglage/propriété CSS, contrôle et capacités réellement éditables, matrice existante             |

Prévoir les schémas JSON associés, contrôles relationnels, dérivés générés et un guide de couverture. L’autorité CSS décrit ce qui est valide ; le contrat d’édition indique ce que le moteur sait traiter. Aucun duplicata de min/max, d’unités ou de liste de mots-clés entre eux. Résoudre les alias : `foreground` vers `color`, `ringOffset` vers `outline-offset`, et les autres correspondances d’après leurs consommateurs réels, sans les déduire seulement du libellé.

Pour chaque propriété : alternatives de syntaxe, unités, valeurs signées, bornes ouvertes/fermées ou absentes, mots-clés, cardinalités/séparateurs, fonctions, dépendances, héritage et comportement hors domaine. Distinguer contraintes au parsing, à la résolution/calcul et à l’usage/rendu, notamment les limitations automatiques prévues par CSS. Ne pas convertir systématiquement une valeur calculée négative en erreur littérale.

Pour chaque fonctionnalité : états distincts « connue », « validable par le moteur », « éditable », « compatible avec les cibles ». Une forme standard non implémentée reste « non prise en charge », pas « CSS invalide ». Une fonctionnalité inconnue ne devient pas un champ libre contournant les contrôles.

Les jeux MDN/WebDX sont des candidats de données techniques, pas de nouvelles dépendances approuvées ni une autorité supérieure au W3C. La tranche A doit comparer disponibilité, licence, version et intégration locale des grammaires/parser ; retenir la solution minimale dans la stack et documenter la décision avant raccordement. Pas de réimplémentation exhaustive du moteur CSS par expressions régulières ; pas de dépendance ou téléchargement implicite pendant cette préparation.

## Couverture à inventorier

Inventaire fini et daté par propriété, syntaxe/fonction et statut de prise en charge ; aucune promesse de couvrir les futures versions inconnues de CSS.

| Famille                                  | Exemples et points obligatoires                                                                              |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Nombres / entiers                        | Signe, décimales, bornes de spécification ; graisse 1–1000 décimale, entiers pour l’ordre                    |
| Longueurs                                | Absolues, relatives aux polices, viewport et conteneur ; signe par propriété, pas par unité                  |
| Pourcentages / types mixtes              | Référence contextuelle ; pas de règle globale 0–100 % ; longueur-pourcentage                                 |
| Angles, temps, résolutions, ratios, flex | Rotation, durée/délai, densité, rapport de dimensions, `fr` selon grammaire                                  |
| Couleurs / alpha                         | Espaces, canaux, couleur courante, limitations CSS et transparence ; contraste potentiellement non mesurable |
| Mots-clés et cascade                     | Listes par propriété, `initial`, `inherit`, `unset`, `revert`, `revert-layer` selon profil                   |
| Chaînes / identifiants                   | Échappement, polices, animations, zones nommées ; référence absente distincte de syntaxe invalide            |
| Images / ressources                      | URL, gradients, ensembles d’images ; aucune lecture réseau déclenchée par le validateur                      |
| Positions / formes / chemins             | Coordonnées, origines, clipping et géométries                                                                |
| Listes / composites / raccourcis         | Bordures, rayons elliptiques, ombres, fonds multiples, transformations, grilles ; ordre et séparateurs       |
| Fonctions / expressions                  | Calculs et fonctions admises par profil, dimensions compatibles, dépendances de contexte                     |
| Variables / références                   | `var()`, replis, cycles, substitution et propriétés personnalisées typées ou non                             |

Inclure dans l’inventaire les domaines typographie, disposition physique/logique, tailles, Flexbox/Grid/table/multicolonne, fonds/bordures, effets/masques, transformation/mouvement, défilement, interaction et fragmentation. Classer explicitement les propriétés spécialisées SVG/impression ; leur présence au référentiel n’active aucun éditeur spécialisé. Les sélecteurs CSS, règles conditionnelles et descripteurs d’at-rules ne sont pas des valeurs de propriété : reconnaître leurs contextes nécessaires sans construire un éditeur général de feuilles CSS.

## Tranches proposées et sorties vérifiables

### A — Référentiel et contrat de couverture

Figer le profil et les sources, inventorier les propriétés/familles et capacités, créer autorités/schémas et guide. Écrire une décision applicative motivée et actualiser la section domaines de la spécification. Versionner les changements de format nécessaires ; ne pas déclarer tous les profils implémentés. Sortie : sources validables et couverture sans ambiguïté, aucune variation des valeurs existantes.

### B — Moteur commun et 18 réglages actuels

Raccorder domaines au moteur, génération, snapshots de confiance, serveur, assistance et consommateurs ; enlever maxima/minima esthétiques, autoriser graisse fractionnaire, interligne non négatif sans plafond et décalage de focus signé selon propriété effective. Conserver les formats courants au premier raccordement ; les nouvelles unités, couleurs/fonctions et composites exigent des capacités explicites qualifiées, pas une acceptation globale par texte libre.

Ne plus exiger min et max simultanément. Aucune comparaison arbitraire rem/px nécessaire pour une simple contrainte de signe ; conserver l’unité, ne pas supposer 16px pour évaluer un contexte inconnu. Distinguer pas d’incrément, précision technique et validité CSS. Documenter les limites de représentation/ressources comme limites du moteur, sans les présenter comme bornes de design ni autoriser débordement numérique ou troncature silencieuse.

Valider toute référence résolue et tous les consommateurs d’un style partagé, y compris ceux de composition hors matrice. Prévoir nouveaux formats sans changer identités, valeurs existantes, provenance ou sens des tokens. Conserver les anciens journaux/reçus dans leurs versions ; diagnostiquer les transactions actives avant toute migration et ne jamais retirer un verrou pour avancer.

### C — Champs et diagnostics

Piloter champs et unités par les capacités du contrat ; bornes HTML seulement lorsqu’elles existent, pas cohérents sans restriction artificielle. Incréments bornés, saisie/collage/clavier contrôlés, états transitoires possibles, erreur compréhensible et dernier aperçu valide conservé ; aucun clamp ajouté silencieusement. Distinguer CSS invalide, fonction non prise en charge, incompatibilité navigateur, référence non résolue et conseil de design.

Les expressions et variables valides syntaxiquement mais non résolues ne sont pas déclarées pleinement validées. Définir leur traitement en brouillon, sauvegarde et aperçu avant activation ; ne pas enregistrer un état dont la validité requise n’est pas démontrée. L’IA reçoit les domaines résolus en lecture seule et passe par les mêmes contrôles ; aucune inférence supplémentaire nécessaire au socle.

### D — Qualification et transmission

Maintenir guides, inventaire généré, stories et dossier de recette. Vérifier dev, statique et persistance en copie isolée ; mettre à jour le suivi lab avec preuves/version/réserves. Qualification acquise implique « En revue, acceptation humaine différée », jamais « Validé » automatiquement. Les extensions au-delà des réglages actuels restent identifiées par capacités et futures tranches ; aucun ajout métier, panneau exhaustif ou changement visuel spontané.

## Fichiers et contrôles prévus, non exécutés

Surfaces : autorités et schémas ; `src/design-system/editor/contract.ts`, `snapshot.ts`, types/protocoles et assistance ; `scripts/validate-design-system.mjs`, génération/snapshot/documentation ; `.storybook/editor/Panel.tsx`, session, serveur et aperçu ; tests DS/snapshot/store/HTTP/persistance et unitaires pertinents. Examiner les dépendants exacts avant de modifier ; contrats historiques consultables à préserver.

| Critère                   | Preuve attendue                                                                                                                                                    |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Liberté de design         | Rayon 9999px, texte 160px, taille de texte 0, interligne 0 et >3, largeur <320 et >2560, graisse fractionnaire valide acceptés sans changer les valeurs par défaut |
| Valeurs impossibles       | Rayon/padding négatifs, unités incompatibles, grammaires mal formées et graisse hors 1–1000 refusés par UI et serveur                                              |
| Contraintes par propriété | Décalage de focus négatif accepté ; ombre avec flou négatif refusée et décalage/étalement signés conservés dans les capacités concernées                           |
| Référentiel extensible    | Familles ci-dessus classées ; profil figé, référence absente/cycle/incohérence détectés ; propriété connue non éditable clairement signalée                        |
| Expressions/contextes     | Types incompatibles, résolution absente, pourcentages >100 % autorisés selon propriété et comportement de limitation CSS distingués, sans faux succès              |
| Parité et persistance     | Validation identique UI/moteur/serveur/IA ; création et modification partagées/locales, rechargement et récupération, rejet de contrat client élargi               |
| Non-régression            | Valeurs/identités/rendus existants inchangés, dérivés reproductibles et consommateurs hors matrice couverts                                                        |
| Accessibilité             | Champ vide temporaire, collage, clavier, changement d’unité, message accessible ; desktop/mobile ; aucun conseil esthétique bloquant                               |

Commandes à adapter aux tranches depuis la racine de l’app : `npm run validate:design-system`, `npm run test:design-system`, `npm run test`, `npm run test:design-editor:server`, `npm run test:design-system:docs`, `npm run docs:design-system:check`, `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run build`, `npm run build-storybook`. Puis parcours pertinents `test:design-editor:dev`, `test:design-editor`, `test:design-editor:persistence` et `test:design-editor:recovery` en ressources isolées. La génération fait partie de la réalisation, pas de la préparation. Toute commande non exécutée reste non vérifiée.

Revues prévues : Design Reviewer (champs/diagnostics), Technical Reviewer / QA (grammaires, versions, génération, références et récupération), Security Reviewer (CSS/URL/variables, limites de ressources, entrées HTTP/IA et confiance du profil). Préserver les contrôles d’accès et de taille existants ; aucune exécution/lecture de ressource externe pour tester une valeur. Séquentiel, même agent, non indépendant si absence de délégation autorisée. Pas de revue d’instructions lab nécessaire pour cette préparation qui ne modifie aucun rôle/skill ; les revues de réalisation restent non exécutées.

## Risques, configuration et reprise

Risque principal : confondre validité de syntaxe, valeur calculée, support navigateur et capacité réelle de DS-EDIT. Autres risques : raccourcis/listes mal décomposés, dérivés/schemas divergents, rupture des anciens reçus, import massif de données non maîtrisé, promesse de couverture universelle. Les réduire par profil figé, statuts explicites, tranches et preuves par capacité.

Routage : préparation documentaire GPT-6.1 Sol · Moyenne ; réalisation A–C recommandée GPT-6.1 Sol · Élevée. Motif : plusieurs contrats dépendants effectivement concernés (autorités, schémas, snapshot de confiance, moteur et persistance), entrées externes, migration potentielle. Résultat clair, chemins inspectés, frontières et preuves identifiées ; parser/données exacts restent à choisir en A. Aucun motif observé pour très élevée/max ; aucun réglage client vérifié ou modifié.

Bilan de préparation : inspection et relecture documentaire uniquement ; `git diff --check` conforme, vérification des liens locaux de cette fiche par lecture Python : aucune cible absente. Contrôles d’exécution et compatibilité non vérifiés. **Doc updated** : cette fiche et suivi de fabrication racine. Aucune qualification technique du futur moteur, acceptation humaine, publication ou modification des instances. Prochaine action : mandat explicite de réalisation, réinspection de la base, puis tranche A avant B/C/D.

## Sources techniques de la proposition

Sources consultées pendant le cadrage du 2 novembre 2026 ; les versions des données d’exécution restent à figer en A.

- [W3C CSS Snapshot 2026](https://www.w3.org/TR/css-2026/) : modules et maturité, distincts de l’adoption navigateur.
- [Baseline](https://web.dev/baseline) : disponibilité inter-navigateurs.
- [CSS Values and Units](https://www.w3.org/TR/css-values-4/) : grammaires, types, fonctions et contraintes.
- [CSS Backgrounds and Borders](https://www.w3.org/TR/css-backgrounds-3/) : rayons et ombres.
- [CSS Fonts](https://www.w3.org/TR/css-fonts-4/) : domaine des graisses.
- [CSS Custom Properties](https://www.w3.org/TR/css-variables-1/) : résolution des variables.
- [MDN data](https://github.com/mdn/data) : candidat pour grammaires structurées ; adoption et licence à qualifier.

## Clôture de réalisation

[Preuves, revues et limites](../reviews/ds-edit-53-css-value-domains.md). Procédures applicatives implement-feature, normalize-design-system, review-design, technical-review et security-review, version de base 869d5f9, utilisées explicitement ; trois rôles de revue successifs, même agent, non indépendants. Tranche A : référentiel local et schémas, choix sans dépendance nouvelle documenté en décision 025 ; pas de grammaire exhaustive importée. B/C : domaine CSS des 18 propriétés et champs raccordés, valeurs initiales conservées. D : contrôles, parcours dev/statique/persistance et revues consignés. Les paragraphes de préparation ci-dessus restent le plan historique ; les résultats exécutés et les limites sont détenus par le rapport. Reprise : recette humaine ; aucune nouvelle extension, publication ou modification de l’ancienne instance. Doc updated.
