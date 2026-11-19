> Historique : les prescriptions de couche sémantique et d’éditeur sont remplacées pour le kit par la [décision 039](039-automated-design-system.md).

# 027 — Autorité DTCG et recettes CSS

**5 novembre 2026 — Option recommandée adoptée par le porteur (« Poursuit » après présentation de l’arbitrage). Réalisation techniquement qualifiée selon le [bilan DS-ARCH-01](../reviews/ds-arch-01/README.md), acceptation humaine différée.** JSON DTCG devient l’autorité des tokens ; les recettes CSS sont distinctes. Ce choix remplace la prescription YAML pour les valeurs et références des tokens, sans déplacer l’autorité des règles, présentations et contrats qui restent en YAML.

Cette décision répond au [cadrage fourni](../work-items/ds-arch-01/framing-v1.md). L’inventaire et les alternatives ci-dessous gardent leurs constats datés. La réponse du porteur à la recommandation tranche l’autorité et la distinction tokens/recettes ; le mandat d’exécution DS-ARCH-01 couvre la suite. L’adoption de l’architecture ne vaut pas qualification de sa migration ni acceptation visuelle.

## Observation et conséquence

L’[inventaire de A](../reviews/ds-arch-01-a/README.md) examine les sources au commit `fce1a9e3f0c36b0908ee8f7b110ed9d08bfbf578` : 25 primitives, 17 styles sémantiques, 188 réglages de composants, 24 alias historiques, 79 primitives et 148 tokens de composition, plus neuf alias de nuanciers produits par une règle. Les 188 réglages comprennent 51 attributions sémantiques et 137 réglages autonomes. Ces chiffres concernent le kit versionné, pas les valeurs enregistrées d’une recette externe.

Le chargement du modèle v4 et le contrôle des compositions existantes réussissent, sans écriture des sources. Les noms DTCG des types, leurs valeurs structurées et leur représentation JSON diffèrent des documents actuels. Deux alias historiques (`semantic.color.feedback.error` et `semantic.color.feedback.success`) ont aussi des descendants ; le mapping doit traiter ce cas sans perdre les identités ni référencer un groupe comme un token.

Sur les 79 valeurs de composition, 42 sont des candidates à une représentation scalaire, neuf à une représentation composite et 28 demandent une décomposition ou une recette CSS ; ces mappings ne sont pas encore qualifiés. Exemples de cette dernière catégorie : `min(100% - 2rem, 72rem)`, `clamp(2.25rem, 5vw, 4rem)`, `75vh`, une grille `minmax(...)`, une bordure `currentColor` et des marges composées.

La [spécification DTCG 2025.10](https://www.designtokens.org/tr/2025.10/format/) sépare format, types et extensions (§4, §5.2.2–3, §8–9). Une extension du projet ne rend pas standard un type CSS inventé. Une expression responsive ne doit pas devenir une dimension fixe pour satisfaire le format. Il faut donc décider de la source d’autorité et du statut des recettes, pas seulement renommer les fichiers.

## Option retenue : JSON DTCG canonique pour les tokens

1. Les valeurs primitives et les références effectives des tokens deviennent éditables uniquement dans un référentiel JSON DTCG. Emplacement proposé : `src/design-system/authority/tokens.tokens.json`. Les propriétés `$type`, `$value`, les groupes et références suivent 2025.10 ; aucune chaîne CSS opaque sous un faux type standard.
2. Les métadonnées du kit sont portées par une extension nommée, proposée `org.agentic-design`, validée par les schémas du projet : identité stable, famille/propriétaire, classe sémantique ou non sémantique des Decision Tokens, justification, contexte, provenance, attribution et base de rétablissement. Elles n’élargissent pas les types ou permissions DTCG. Un identifiant de jeton peut rester historiquement préfixé `semantic.` : sa classification vient des métadonnées explicites, sans renommage automatique.
3. Le YAML conserve les règles dont il est propriétaire : intentions et éligibilités, matrice des propriétés/états, présentations et documentation des composants, profil CSS et règles de génération. Les champs de valeurs/références déplacés vers JSON ne restent pas une deuxième source éditable dans les fiches ou anciens registres. Les fiches se relient aux identités du référentiel ; le chargeur assemble un seul modèle validé.
4. Les styles sémantiques actuels restent des décisions sémantiques. Aucune des 24 anciennes décisions retirées n’est réactivée automatiquement comme non sémantique. Une convention non sémantique nouvelle exige un besoin documenté ; les tests peuvent exercer cette classe sur des données fictives sans en inventer dans le produit. Les alias historiques restent un mécanisme de compatibilité documenté, pas un niveau de responsabilité supplémentaire.
5. Les variables CSS et identités d’usage restent stables lorsque possible. Les noms à points deviennent des groupes/segments. Pour les deux collisions préfixe/feuille, employer `$root` et des références explicites terminées par `.$root`, selon §6.2 ; l’identité historique et le nom CSS restent distincts du chemin JSON. Contrôler les futures collisions de la même façon. Aucun alias de compatibilité ne peut contourner les interdictions du graphe.

Cette option correspond au format de référence demandé et évite de conserver durablement deux formats de représentation des tokens. Elle remplace toutefois l’autorité YAML actuellement prescrite par AGENTS, l’architecture et les contrats d’enregistrement : cet effet est matériel et demande une décision documentée avant code.

## Politique proposée pour les compositions CSS

Le référentiel DTCG décrit les tokens ; le code et ses contrats décrivent leur application en CSS. Une **recette CSS est une règle d’implémentation**, pas un sixième niveau de tokens ou une nouvelle catégorie de Pattern. Elle ne devient pas un Pattern par sa seule existence.

- Convertir les valeurs représentables avec leurs types exacts : couleurs sRGB/alpha, dimensions px/rem, nombres, familles/graisses et composites fixes utiles. Les conversions et leur sérialisation CSS demandent un retest ; aucune équivalence visuelle n’est encore revendiquée.
- Décomposer les expressions contextuelles en références aux tokens nécessaires et syntaxe CSS explicite. Exemple : conserver le calcul `clamp(minimum, viewport, maximum)`, avec bornes pilotées par tokens et terme viewport documenté ; ne pas figer une valeur calculée sur un seul écran. `currentColor` reste lié au contexte de couleur au lieu d’être remplacé par une couleur mesurée une fois.
- Garder ces recettes, leur propriété CSS, consommateur et justification dans un contrat distinct du référentiel de valeurs — une évolution du contrat de composition existant suffit. Aucun champ CSS libre ni nouvelle capacité d’édition n’est ouvert. Le contrôle des valeurs visuelles brutes s’étend à ces recettes : les valeurs pilotables passent par les tokens, les mots-clés et opérations structurels sont explicitement autorisés, pas cachés dans une primitive opaque.
- Préserver les anciennes variables de composition comme sorties de compatibilité lorsque nécessaire. Distinguer dans les inventaires les tokens DTCG, les règles/recettes et leurs sorties CSS ; ne pas annoncer l’export d’une recette opaque comme un token DTCG conforme. Toute identité reclassée garde sa correspondance dans la migration.

Cette politique conserve le rendu et le responsive tout en supprimant la confusion entre valeur de token et expression CSS. Elle demande d’aligner la décision 024 et son contrôle de consommation sur ces responsabilités, sans rendre acceptable une valeur visuelle arbitraire dans les consommateurs UI. Sa mise en œuvre reste à qualifier en B/C/F.

## Alternative recevable : YAML canonique et export DTCG

Conserver l’autorité YAML des valeurs/références, ajouter la classification et produire un JSON DTCG déterministe, non éditable, avec les mêmes exigences de types et de distinction des recettes. La génération et l’enregistrement publient ce nouveau dérivé dans leur transaction ; sa péremption est contrôlée. L’export ne devient pas une seconde autorité et n’est pas importé silencieusement pour écraser une instance.

Cette option réduit l’évolution du writer et des formats de sources. Elle conserve un format de tokens propre au kit ; le JSON reste un format d’échange. Elle n’évite ni le travail sur les 28 valeurs contextuelles, ni les mises à jour du graphe, de la classification, des catalogues et de la récupération. Elle est recevable seulement si le porteur confirme que le « format de référence DTCG » peut être une représentation dérivée.

| Conséquence | JSON canonique recommandé | YAML + export |
| --- | --- | --- |
| Source modifiable des tokens | JSON DTCG ; YAML réservé aux autres règles | YAML ; JSON strictement généré |
| Réutilisation par d’autres outils | Format standard directement à la source ; compatibilité réelle des outils à qualifier | Export standard ; retour d’édition externe hors mandat |
| Migration du stockage | Valeurs/références déplacées, writer/chargeur modifiés | Sources conservées et classifiées, dérivé transactionnel ajouté |
| Expressions CSS | Recettes distinctes, reliées aux tokens | Même politique nécessaire |
| Reprise et sécurité | Ancien outillage et journaux conservés ; nouveaux contrats qualifiés | Même obligation, même si le changement est plus limité |

Ni ajout d’un faux `$type: "css"`/`"string"`, ni valeur factice accompagnée d’une expression dans une extension, ni copie éditable synchronisée JSON/YAML ne satisfait la proposition. Aucun changement de stack ou ajout de bibliothèque n’est nécessaire à ce choix.

## Correspondances, reprise et portes techniques

L’[inventaire structuré](../reviews/ds-arch-01-a/inventory.json) donne une entrée par identité actuelle, source, référence, valeur terminale et candidat de mapping. Ce sont des propositions à qualifier ; les nouvelles primitives nécessaires à la décomposition et la table définitive de migration seront établies après arbitrage. Aucun mapping complet définitif n’est déclaré accepté en A.

Après décision : consigner l’option retenue ici, puis aligner le cahier des charges §9 / DS-01–02 au lab et les autorités applicatives. Préserver les cinq responsabilités, les trois rubriques, les références autorisées, la consommation par tokens et la séparation UI Lab/Storybook. Ne pas changer les modèles de suivi du projet dérivé.

B prépare les décodeurs/schémas et le graphe ; C raccorde le modèle, les opérations, le writer et ses dérivés atomiques ; D/E alignent navigation, guides et instructions ; F contrôle extraction et reprise. Les garanties à retester comprennent : interprétation bornée et doublons, références typées, cycles, ownership, absence de valeurs littérales non primitives, classification, refus de versions mélangées, erreurs/concurrence, SIGKILL/reprise et conservation des valeurs/rendus.

Le stockage courant dépend de `sourcePaths` ordonné, du parseur borné YAML/JSON, de la sérialisation YAML de `store.mjs`, du manifeste fermé v26 et de sept dérivés. Ce couplage exclut un remplacement de fichiers au milieu d’une transaction. Le retour arrière utilise l’ancienne copie avec son outillage et ses sources, sans rejouer de journaux entre versions, convertir les reçus, transporter les comptes ou écraser une recette.

## Arbitrage obtenu et reprise

Choix du porteur : **JSON DTCG canonique + recettes CSS distinctes**, option recommandée explicitement présentée avant sa réponse. L’alternative YAML + export n’est pas retenue. Aucun CSS opaque n’est déclaré type standard.

**Porte d’arbitrage A franchie ; correspondances et retour arrière à qualifier pendant B/C.** Aucun niveau de réflexion supérieur à Élevée n’est justifié par l’inspection actuelle. Aucun réglage du client n’a été modifié ou prétendu vérifié. B–F poursuivent le mandat déjà donné, avec leurs contrôles et points de reprise.
