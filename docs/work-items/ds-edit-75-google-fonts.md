# DS-EDIT-75 — Choisir une famille Google Fonts dans DS-EDIT

**5 novembre 2026 — Chantier préparé ; réalisation non engagée.** Environnement : application. Mandat : préparer, après l’étude de faisabilité, le choix d’une famille Google Fonts pour modifier la famille d’un réglage de texte dans UI Lab. Cette fiche ne vaut ni approbation des options proposées, ni mandat d’implémentation ou d’accès externe. Statut consolidé dans la roadmap de fabrication ; les modèles ROADMAP et project-state livrés avec le kit restent non initialisés.

## Base, méthode et prérequis

- Racine Git vérifiée : `/Users/yannbellot/Documents/GitHub/agentic-design` ; base `22f478883639633dc09713313f42a157fa63ae86`, initialement `main`, branche documentaire `codex/ds-edit-75-google-fonts-plan`.
- Aucun changement suivi préexistant. Les doublons non suivis, `application/.storybook/editor/` et `frontend/` restent hors périmètre, ainsi que les recettes, comptes, brouillons et processus existants. Ne pas prendre l’ancien éditeur Storybook non suivi pour une source active.
- Rôle Builder ; procédure du catalogue applicatif : [plan-feature](../../skills/plan-feature/SKILL.md), version du commit de base, lecture explicite selon le [contrat commun](../agents/skill-contract.md). Usage limité à cette préparation, sans activation de la bibliothèque app dans le lab. Aucun sous-agent ; relecture séquentielle, même agent, non indépendante.
- [DS-ARCH-01](ds-arch-01-design-system-framing.md) est techniquement qualifié, acceptation humaine différée : la migration n’est plus un prérequis technique ouvert. Respecter le [contrat courant](../../src/design-system/authority/README.md), l’[architecture](../design-system/architecture.md) et la [décision 027](../decisions/027-dtcg-authority-and-css-recipes.md).
- Valeurs et références exclusivement dans `tokens.tokens.json`, familles DTCG `fontFamily` ; règles et présentations chez leurs propriétaires YAML, CSS généré non édité. Préserver graphe, classification, attribution, exception locale et base de rétablissement.

## Résultat et limites du périmètre

Permettre au designer de rechercher une famille issue de Google Fonts, de la voir sur le texte réel, puis de l’appliquer dans le brouillon et de l’enregistrer. La police enregistrée accompagne le projet et fonctionne sans connexion à Google dans l’application, UI Lab et Storybook.

« Style de texte » désigne ici le réglage de famille du texte sélectionné et, lorsqu’il existe, sa décision partagée compatible. Taille, graisse et interligne sont conservés ; une incompatibilité ne doit jamais provoquer leur modification silencieuse. Un style typographique composite réunissant ces propriétés n’est pas créé par ce chantier. Ne pas créer une convention partagée ou réactiver un ancien style générique uniquement pour utiliser le sélecteur.

Exclusions : import de polices personnelles, installation système, édition des axes avancés, synchronisation Figma, clonage du site Google Fonts, compte Google obligatoire pour le designer, nouveau backend, modification des données métier, remplacement global automatique des familles, publication et déploiement. Les polices variables peuvent être utilisées pour les graisses existantes compatibles ; leur éditeur d’axes reste exclu.

## Observations de l’inspection

- `editor-contract.yaml` expose `fontFamily` mais sa liste `fontFamilies` ne contient que `Inter, ui-sans-serif, system-ui, sans-serif`. Ce nom dans une pile ne prouve pas qu’un fichier Inter est réellement chargé.
- `AppearancePanel.tsx` possède un champ « Famille disponible », remplacé par un texte lorsqu’une seule famille est autorisée. Il présente des « Familles locales préparées ».
- `contract.ts` refuse les familles absentes de cette liste. `snapshot.ts` interdit un changement de contrat depuis un snapshot actualisé et borne les chaînes de familles. Une extension de familles à chaud exige donc un contrat explicite et vérifié, pas la suppression de ces protections.
- `scripts/dtcg-tokens.mjs` convertit déjà les piles de familles vers DTCG et les sérialise en CSS. Vérifier les noms à espaces, tirets et leur échappement avant toute extension ; aucune chaîne CSS fournie librement ne doit devenir exécutable.
- Le writer possède un manifeste fermé, des dérivés et une récupération transactionnelle. Les fichiers de police et leur registre ajoutent une responsabilité persistante qui n’est pas couverte par le seul changement d’un token.

## Option proposée et arbitrage préalable

**Recommandation, non encore acceptée : catalogue de métadonnées embarqué et versionné, puis import local des seules familles/variantes choisies.** Recherche locale sans clé ; Internet nécessaire lors de l’import initial, pas après enregistrement. Aucun téléchargement de toute la bibliothèque. L’actualisation du catalogue serait une maintenance explicite, datée et traçable, sans appel réseau automatique au démarrage.

La [Developer API officielle](https://developers.google.com/fonts/docs/developer_api) exige une clé et expose familles, variantes, sous-ensembles et axes variables. L’[API CSS](https://developers.google.com/fonts/docs/css2) permet de demander les styles et plages nécessaires. Le [dépôt officiel Google Fonts](https://github.com/google/fonts) fournit fichiers, métadonnées et licences par famille. Ces sources ont été consultées pendant l’étude préalable ; aucune requête de police ou qualification réseau n’a été effectuée pour cette préparation.

Alternative : catalogue connecté via Developer API, avec configuration privée de la clé côté service local et cache. Cela introduit une configuration externe supplémentaire. Le chargement permanent des polices depuis Google est moins adapté à l’autonomie attendue et n’est pas la recommandation.

**Porte A : avant d’implémenter le réseau ou d’importer des ressources, faire confirmer le catalogue embarqué + import local et l’accès externe nécessaire.** Documenter ensuite une décision applicative : source et version des métadonnées, procédure de mise à jour, formats retenus, couverture initiale, licences, domaines de téléchargement et limites. Cette préparation n’autorise ni clé, ni appel fournisseur, ni téléchargement. Aucune durée ou coût de service n’est présumé.

## Parcours prévu

1. Depuis le réglage Famille d’Apparence ou l’édition d’une décision de famille compatible, ouvrir « Choisir dans Google Fonts ». Préserver l’accès aux familles déjà disponibles.
2. Rechercher par nom ; filtrer par catégorie et couverture de caractères utile au projet. Afficher l’état du catalogue, les variantes et le caractère installé ou à importer. Charger uniquement la famille prévisualisée, pas chaque ligne de résultats.
3. Prévisualiser sur le composant réel avec taille/graisse/interligne courants, et un spécimen français avec accents. Montrer chargement, erreur et police de repli ; un téléchargement échoué ne doit pas apparaître comme un aperçu réussi. Vérifier la couverture réellement disponible : le seul label « latin » ne constitue pas une preuve de tous les glyphes.
4. Réutiliser les règles existantes de portée : réglage local ou modification d’une décision partagée compatible, avec usages concernés. Ne pas modifier la primitive commune en place pour provoquer une propagation globale implicite.
5. Appliquer au brouillon sans sauvegarde automatique. Si une graisse utilisée par la portée choisie manque, expliquer les usages incompatibles et empêcher l’application tant que le conflit n’est pas résolu explicitement ; ne pas compter sur une synthèse silencieuse du navigateur.
6. Annuler restaure le rendu et les références antérieurs. Enregistrer publie ensemble ressources requises, registre et tokens/dérivés. Après rechargement, montrer la famille effectivement chargée dans tous les consommateurs concernés.

## Découpage proposé pour la réalisation

| Tranche | Livrable | Condition de passage |
| --- | --- | --- |
| A — Contrat et provenance | Arbitrage de l’option, décision et spécification du registre/catalogue ; politique de variantes, licences et couverture | Décision externe documentée ; aucune ambiguïté d’autorité |
| B — Ressources et persistance | Import borné côté service existant, cache temporaire isolé, registre des ressources, récupération et contrat d’ajout des familles | Ressource valide et locale avant référence publiée ; panne/concurrence/reprise qualifiées |
| C — Sélection et aperçu | Recherche, variantes, états accessibles, aperçu réel, brouillon et portée réutilisés | Famille réellement chargée, annulation et usages partagés/local isolés démontrés |
| D — Livraison et reprise | Chargement commun app/UI Lab/Storybook, guides, extraction/déplacement hors connexion et dossier de recette | Contrôles et trois revues satisfaits ; acceptation humaine différée |

B et C utilisent des fixtures isolées avant un import réel autorisé. Si une transaction échoue, aucune référence publiée ne doit pointer vers une ressource absente. Les fichiers temporaires restent distincts des ressources enregistrées ; aucun nettoyage ne supprime une police encore référencée, un ancien reçu ou une transaction. Une collecte automatique des anciennes polices n’est pas nécessaire à cette première version. Les anciennes installations continuent avec leur version compatible ; ne pas convertir leurs journaux ou écraser une recette.

## Surfaces prévisionnelles

- Interface : `src/ui-lab/editor/AppearancePanel.tsx`, atelier et formulaires partagés atteints depuis ce panneau, `src/design-system/editor/Preview.tsx`, styles d’habillage tokenisés et présentation accessible du sélecteur.
- Modèle : `src/design-system/editor/{contract,snapshot,operations}.ts`, schémas concernés et `src/design-system/authority/editor-contract.yaml` ; `src/design-system/authority/tokens.tokens.json` seulement pour les valeurs/références enregistrées. Définir un registre de ressources distinct des tokens : provenance, version, fichiers locaux, intégrité, variantes et licence ; il ne duplique pas la valeur de décision.
- Serveur : `scripts/design-editor/{http,store,manifest}.mjs`, génération/snapshot et `scripts/editor-artifacts.mjs`, plus chargement des ressources dans l’app et Storybook. Un téléchargement validé ne doit pas permettre au client d’élargir les domaines de confiance du snapshot.
- Fichiers nouveaux proposés, chemins exacts à arrêter en A : catalogue versionné et registre dans l’autorité, ressources et licences locales sous `public/fonts/`, importeur dans le service existant. Aucun dossier vide créé par cette préparation.
- Documentation : spécification de l’éditeur, autorité/architecture si le contrat change, guides d’aperçu/persistance, README et reprise du kit ; dérivés documentaires uniquement régénérés. Preuves futures sous `docs/reviews/ds-edit-75/` avec premier contenu réel.

## Critères et preuves à produire

1. Une famille absente initialement peut être recherchée, prévisualisée, appliquée et enregistrée sans compte IA ni clé personnelle dans l’option recommandée ; fichiers et licence ont une provenance vérifiable.
2. Taille/interligne/graisse et valeurs hors famille restent identiques. Portée locale : autres réglages inchangés. Portée partagée : seuls les usages explicitement reliés suivent, attribution et rétablissement conservés.
3. Graisse incompatible, glyphe absent, réseau indisponible et fichier invalide produisent un état compréhensible, sans sauvegarde partielle ni faux aperçu. Une sélection rapide successive ne laisse pas un téléchargement tardif remplacer le dernier choix.
4. Annulation, réouverture, sauvegarde concurrente, interruption de l’import et interruption de l’enregistrement conservent les sources valides ; récupération sans suppression de protection et sans ressource référencée manquante.
5. La famille chargée est démontrée dans l’app, UI Lab et Storybook après enregistrement, rechargement et coupure réseau, puis extraction/renommage/déplacement sans parent ni Git. Comparer également les données/ressources antérieures.
6. Clavier, focus, libellés et annonces de chargement/erreur fonctionnent à 390 × 844 et 1280 × 800. Contrôler retours à la ligne, hauteurs des contrôles, débordements et tous les usages partagés touchés. Les comparaisons de non-régression portent sur les surfaces non concernées ; les changements typographiques attendus ne sont pas présentés comme des rendus identiques.
7. Revue sécurité ciblée de toute entrée réseau : identifiants de catalogue validés, domaines/redirects autorisés, chemins locaux confinés, taille/durée bornées, validation des fichiers et des licences ; aucun URL arbitraire, CSS/HTML distant injecté, secret versionné ou accès d’import exposé hors service local protégé.

Contrôles prévus, **non exécutés pendant la préparation**, depuis la racine app sur copies isolées :

- `npm run validate:design-system`, `npm run test:design-system`, `npm run docs:design-system:check` : sources DTCG, sérialisation des familles, graphe et dérivés ; compléter les tests significatifs de domaine et de snapshot.
- `npm run typecheck`, `npm run lint`, contrôle de formatage des fichiers touchés, `npm run test:boundaries` : contrats et frontières client/serveur.
- `npm run test:design-editor:server`, `npm run test:design-editor:persistence`, `npm run test:design-editor:recovery` : import, stockage atomique, concurrence, erreurs et reprise avec fixtures de polices déterministes.
- `npm run test:design-editor`, `npm run test:design-editor:live`, `npm run build`, `npm run build-storybook` : parcours desktop/mobile, chargement effectif et propagation ; compléter par extraction/déplacement hors connexion et import réel autorisé. Adapter les scripts existants avant de prétendre qu’ils couvrent ces nouveaux critères.
- Revues design, technique/QA et sécurité obligatoires pour la réalisation ; déclarer leur indépendance réelle. Pas de revue d’exécution ni de qualification technique revendiquée ici.

## Configuration, bilan de préparation et reprise

Préparation : GPT-6.1 Sol · Moyenne, inspection et rédaction sans exécution. Réalisation recommandée : **GPT-6.1 Sol · Élevée**, car interface, contrat de confiance des familles, ressources réseau, writer/récupération et chargement dans trois consommateurs sont couplés. Les chemins sont localisés mais les effets de portée et la portabilité sont transverses ; l’incertitude principale est le contrat catalogue/import et son enregistrement. Aucun besoin démontré de très élevée, max, Astra ou Ultra ; aucun réglage client vérifié ou modifié.

Livrables de préparation : cette fiche, une entrée de roadmap racine et un point de reprise court dans l’état de fabrication. **Doc updated.** Relecture documentaire séquentielle, même agent, non indépendante : périmètre, dépendance DTCG, propriétaires, exclusions, critères et liens locaux vérifiés avant commit. Aucun test, build, génération, installation, serveur, import ou publication exécuté. Les capacités décrites restent non vérifiées ; licences/variantes/couverture et détails de transaction restent à qualifier en réalisation. Les revues d’implémentation ne s’appliquent pas à cette tranche documentaire.

**Prochaine action : obtenir un mandat de réalisation et franchir la porte A sur l’option de catalogue/import avant les opérations externes.** Conserver ce point de reprise ; ne pas engager B–D sur la seule préparation. Aucun changement de statut DS-ARCH-01, J4/J5 ou de recette humaine n’en découle.

## Réalisation autorisée et point de reprise — 5 novembre 2026

Le porteur a demandé explicitement la réalisation DS-EDIT-75 avec catalogue embarqué + import local et autorisé les téléchargements nécessaires depuis Google Fonts. **Porte A franchie.** [Décision 028](../decisions/028-local-google-fonts.md) : quatre familles initiales, TTF/OFL figés, catalogue faisant registre des ressources immuables attendues ; aucun second registre mutable. Publication des ressources avant référence, puis transaction DTCG existante : précision technique documentée du plan initial, sans changement de stack ni de portée.

A–D terminées techniquement ; **En revue — qualification technique acquise, acceptation humaine différée.** [Bilan, contrôles, échecs et revues](../reviews/ds-edit-75/README.md). Base de réalisation `f33eff6`, branche `codex/ds-edit-75-google-fonts`, préexistants préservés. Fichiers : catalogue/importeur/sélecteur, contrat, transport, HTTP/store/manifeste v28, génération/projection DTCG, MIME Storybook, tests et documentation directement concernés. Valeurs initiales des 188 bindings et 17 styles du kit inchangées ; les imports de démonstration sont seulement dans les copies isolées. Modèles app/J4/J5 et recettes anciennes préservés. Doc updated ; aucun push/déploiement. Contrôles et revues satisfaits selon le bilan ; intégration locale des seuls fichiers sélectionnés après examen du diff. Prochaine action : recette humaine du choix et des portées, sans ouvrir un autre chantier.
